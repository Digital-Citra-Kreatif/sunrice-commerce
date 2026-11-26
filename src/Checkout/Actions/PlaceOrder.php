<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Checkout\Actions;

use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Sunrice\Cms\Models\Entry;
use Sunrice\Cms\Support\Locales;
use Sunrice\Commerce\Cart\CartView;
use Sunrice\Commerce\Cart\Models\Cart;
use Sunrice\Commerce\Catalog\Bundles;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Checkout\CheckoutChanged;
use Sunrice\Commerce\Checkout\CheckoutData;
use Sunrice\Commerce\Checkout\CheckoutMode;
use Sunrice\Commerce\Checkout\CheckoutRefused;
use Sunrice\Commerce\Checkout\CheckoutValidator;
use Sunrice\Commerce\Checkout\Completion\CheckoutCompletion;
use Sunrice\Commerce\Checkout\Completion\CompletionResponse;
use Sunrice\Commerce\Checkout\Completion\Completions;
use Sunrice\Commerce\Checkout\PlacedOrder;
use Sunrice\Commerce\Contracts\Inventory;
use Sunrice\Commerce\Customers\Actions\SaveAddress;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Inventory\OutOfStock;
use Sunrice\Commerce\Loyalty\Loyalty;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Events\OrderPaid;
use Sunrice\Commerce\Orders\Events\OrderPlaced;
use Sunrice\Commerce\Orders\Events\QuoteRequested;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\Models\OrderItem;
use Sunrice\Commerce\Orders\Numbering;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Orders\Timeline;
use Sunrice\Commerce\Payments\Actions\StartPayment;
use Sunrice\Commerce\Payments\Contracts\AddsUniqueCode;
use Sunrice\Commerce\Payments\Contracts\StartsCheckoutSession;
use Sunrice\Commerce\Payments\Models\Payment;
use Sunrice\Commerce\Payments\PaymentManager;
use Sunrice\Commerce\Payments\UniqueCodes;
use Sunrice\Commerce\Pricing\Adjustment;
use Sunrice\Commerce\Pricing\CalcLine;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Pricing\Contracts\ReservesDiscounts;
use Sunrice\Commerce\Pricing\PriceProviders;
use Sunrice\Commerce\Promotions\FlashSales\FlashSaleReservations;
use Sunrice\Commerce\Promotions\Vouchers\Voucher;
use Sunrice\Commerce\Promotions\Vouchers\VoucherRedemptions;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Shipping\ShippingOrigins;
use Sunrice\Commerce\Support\MoneyFormatter;
use Sunrice\Commerce\Support\Phone;
use Sunrice\Commerce\Support\Staff;

/**
 * Turns a cart into an order or quote (ARCHITECTURE.md §11.3), in one
 * transaction: a fresh calculation compared with what the customer saw,
 * the checkout rules, all-or-nothing reservations (stock, flash sale
 * quantities, voucher uses), the customer, the number, and the order with
 * its lines, adjustments, timeline and payment. Placing the same cart
 * twice returns the first order.
 */
class PlaceOrder
{
    /** @var array<int, Order> */
    protected array $placed = [];

    /** The account made by this checkout (verification off), which the order joins. */
    public function __construct(
        protected StoreSettings $settings,
        protected CheckoutMode $mode,
        protected CheckoutValidator $validator,
        protected Completions $completions,
        protected Numbering $numbering,
        protected Timeline $timeline,
        protected PaymentManager $payments,
    ) {}

    /**
     * @param  string|null  $totalsHash  the hash of the totals the customer saw (null skips the check: staff and tests)
     * @param  array<string, mixed>  $extra  inputs that aren't stored: password
     * @param  array<string, string|null>  $client  ip_address, user_agent
     *
     * @throws CheckoutChanged|CheckoutRefused|ValidationException
     */
    public function handle(Cart $cart, CheckoutData $data, ?string $totalsHash, array $extra = [], array $client = []): PlacedOrder
    {
        // Every order belongs to an account: checkout is behind sign-in, and the order goes to that account's email.
        $account = commerce_customer() ?? throw new CheckoutRefused(__('commerce::checkout.errors.sign_in'));
        $data = $data->merge(['email' => $account->getAttribute('email')]);

        $completion = $this->completions->get($this->mode->completion());
        $created = false;

        $order = DB::transaction(function () use ($cart, $data, $totalsHash, $extra, $client, $completion, $account, &$created): Order {
            // 1. One order per cart.
            /** @var Cart $locked */
            $locked = Cart::query()->whereKey($cart->id)->lockForUpdate()->firstOrFail();
            if ($locked->customer_id !== null
                && ! Customer::query()->whereKey($locked->customer_id)->where('user_id', $account->getAuthIdentifier())->exists()) {
                throw new CheckoutRefused(__('commerce::checkout.errors.cart_account'));
            }
            $existing = $this->existing($locked);
            if ($existing !== null) {
                if ((string) $existing->user_id !== (string) $account->getAuthIdentifier()) {
                    throw new CheckoutRefused(__('commerce::checkout.errors.cart_account'));
                }

                return $existing;
            }

            // 2. Paused.
            if ($this->settings->get('general.pause_orders', false)) {
                throw new CheckoutRefused((string) ($this->settings->get('general.pause_message') ?: __('commerce::checkout.errors.paused')));
            }

            // 3. A fresh calculation; 5. the checkout rules (field errors first);
            // 4. the same totals as the customer saw.
            $view = CartView::for($locked, [...$data->context(), 'placing' => true]);
            $state = $view->state;
            $this->validator->validate($data, $state, $extra);
            if ($totalsHash !== null && ! hash_equals($state->hash(), $totalsHash)) {
                $changes = array_values(array_unique(array_column(array_filter($state->notices, fn ($n) => $n['code'] !== 'voucher_conditional'), 'message')));
                throw new CheckoutChanged($changes);
            }

            if ($this->validator->needsAddress($data, $state)) {
                $recipient = $data->shippingAddress();
                $data = $data->merge(['name' => $recipient['name'] ?? null, 'phone' => $recipient['phone'] ?? null]);
            }

            // 7. The customer.
            $customer = $this->customer($data, $extra);

            // 9–10. The order and its lines, then the reservations.
            $order = $this->insert($locked, $data, $state, $completion, $customer, $client);
            if ($completion->reservesStock()) {
                $this->reserve($order, $state);
            }

            // 11. The cart is done.
            if ($order->type !== ResolveCheckoutSession::TYPE) {
                $locked->forceFill(['status' => 'converted', 'order_id' => $order->id])->save();
            }
            $created = true;

            return $order;
        }, 3);

        // 12. A hosted session holds the checkout snapshot. The order is placed when payment starts.
        if ($order->type === ResolveCheckoutSession::TYPE) {
            [$locked, $start] = DB::transaction(function () use ($order): array {
                $locked = Order::withTrashed()->whereKey($order->id)->lockForUpdate()->first();
                $payment = $locked?->payment();

                return [$locked, $locked?->type === ResolveCheckoutSession::TYPE && $payment !== null
                    ? app(StartPayment::class)->handle($locked, $payment)
                    : null];
            });
            if ($locked !== null && $locked->type !== ResolveCheckoutSession::TYPE) {
                return new PlacedOrder($locked, $completion->afterPlaced($locked), false);
            }
            if ($start?->kind !== 'redirect' || blank($start->url)) {
                app(ResolveCheckoutSession::class)->releaseUnopened($order);

                throw new CheckoutRefused(__('commerce::checkout.errors.payment_status'));
            }

            return new PlacedOrder($order, new CompletionResponse($start->url), false);
        }

        // 13. After commit.
        if ($created) {
            $order->refresh();
            $order->isQuote() ? QuoteRequested::dispatch($order) : OrderPlaced::dispatch($order);
            if ($order->payment_status === OrderStatus::PAID) {
                OrderPaid::dispatch($order);
            }
            $payment = $order->payments()->first();
            $start = $payment !== null && $order->status !== OrderStatus::CANCELLED ? app(StartPayment::class)->handle($order, $payment) : null;
            $response = $start?->kind === 'redirect' ? new CompletionResponse((string) $start->url) : $completion->afterPlaced($order);

            return new PlacedOrder($order, $response, true);
        }

        return new PlacedOrder($order, $completion->afterPlaced($order), false);
    }

    protected function existing(Cart $cart): ?Order
    {
        if ($cart->status === 'converted' && $cart->order_id !== null) {
            return Order::withTrashed()->find($cart->order_id);
        }

        return Order::withTrashed()->where('checkout_token', hash('sha256', $cart->token))->first();
    }

    /** @param  array<string, mixed>  $extra */
    protected function customer(CheckoutData $data, array $extra): Customer
    {
        $user = commerce_customer() ?? throw new CheckoutRefused(__('commerce::checkout.errors.sign_in'));
        $customer = Customer::forUser($user);
        $country = (string) ($data->shippingAddress()['country'] ?? 'ID');
        $customer->forceFill([
            'name' => $customer->name ?: $data->get('name'),
            'phone' => $customer->phone ?: Phone::normalize($data->phone(), $country),
            'locale' => $customer->locale ?? app()->getLocale(),
        ]);
        if ($data->get('accepts_marketing') && ! $customer->accepts_marketing) {
            $customer->forceFill(['accepts_marketing' => true, 'marketing_consent_at' => now()]);
        }
        $customer->save();

        if ($data->get('save_address') && $data->shippingAddress() !== null && ! $data->isPickup()) {
            app(SaveAddress::class)->fromCheckout($customer, $data);
        }

        return $customer;
    }

    /** @param  array<string, string|null>  $client */
    protected function insert(Cart $cart, CheckoutData $data, CalculationState $state, CheckoutCompletion $completion, Customer $customer, array $client): Order
    {
        $states = $completion->initialStates($state, $data);
        $isQuote = $completion->orderType() === 'quote';
        $method = ! $isQuote && $completion->requiresPayment() && $state->totals['total'] > 0 && $data->paymentMethod() !== null
            ? $this->payments->get($data->paymentMethod()) : null;
        $draft = $method instanceof StartsCheckoutSession && $completion::key() === 'order';
        $whatsapp = $completion::key() === 'whatsapp';
        $country = (string) ($data->shippingAddress()['country'] ?? 'ID');
        $rate = $state->shipping['rate'];
        $totals = $state->totals;
        // 8. The unique transfer code (bank transfer with the setting on).
        $uniqueCode = $method instanceof AddsUniqueCode && ($range = $method->uniqueCodeRange()) !== null
            ? app(UniqueCodes::class)->pick($totals['total'], $range, PaymentManager::idOf($method)) : 0;

        $user = commerce_customer();
        $order = new Order;
        $order->forceFill([
            'type' => $draft ? ResolveCheckoutSession::TYPE : $completion->orderType(),
            'number' => $isQuote || $draft ? null : $this->numbering->next('order'),
            'quote_number' => $isQuote ? $this->numbering->next('quote') : null,
            'order_key' => Str::random(40),
            'checkout_token' => hash('sha256', $cart->token),
            'status' => $states->status,
            'payment_status' => $states->payment,
            'fulfillment_status' => $states->fulfillment,
            'channel' => 'storefront',
            'selling_mode' => $this->mode->mode(),
            'customer_id' => $customer->id,
            'user_id' => $user?->getAuthIdentifier(),
            'email' => $data->email(),
            'phone' => Phone::normalize($data->phone(), $country) ?? $data->phone(),
            'customer_name' => $data->get('name'),
            'shipping_address' => $state->shipping['needed'] && ! $data->isPickup() ? $data->shippingAddress() : null,
            'billing_address' => $data->billingAddress(),
            'shipping_method' => $rate === null ? null : [...$rate, 'title' => $rate['label']],
            'payment_method' => $whatsapp ? 'whatsapp' : ($method !== null ? PaymentManager::idOf($method) : null),
            'payment_method_title' => $whatsapp ? __('commerce::checkout.whatsapp_payment') : ($method !== null ? PaymentManager::titleOf($method) : null),
            'currency' => (string) $this->settings->get('general.currency.code', 'IDR'),
            'locale' => app()->getLocale(),
            'prices_include_tax' => (bool) ($state->data['prices_include_tax'] ?? $this->settings->get('taxes.prices_include_tax', true)),
            'subtotal' => $totals['subtotal'],
            'discount_total' => $totals['discount'] + $totals['shipping_discount'],
            'shipping_total' => $totals['shipping'],
            'fee_total' => $totals['fee'],
            'tax_total' => $totals['tax'],
            'total' => $totals['total'] + $uniqueCode,
            'weight' => $this->weight($state),
            'customer_note' => $this->settings->get('checkout.order_notes', true) ? $data->get('notes') : null,
            'dropship' => $this->settings->get('checkout.dropshipper', false) && $data->dropship()['enabled'] ? $data->dropship() : null,
            'fields' => $data->fields() ?: null,
            'meta' => [...array_filter(['checkout_cart_id' => $draft ? $cart->id : null, 'codes' => $state->appliedCodes ?: null, 'pickup' => $data->isPickup() ? ($rate['meta']['location'] ?? null) : null,
                // Shipped from somewhere else than the store (an extension's origin): carriers book it from there.
                'shipping_origin' => $state->shipping['needed'] && ! $data->isPickup() ? app(ShippingOrigins::class)->custom($state)?->toArray() : null])],
            'ip_address' => $client['ip_address'] ?? null,
            'user_agent' => isset($client['user_agent']) ? mb_substr((string) $client['user_agent'], 0, 255) : null,
            'placed_at' => $draft ? null : now(),
            'deleted_at' => $draft ? now() : null,
            'paid_at' => $states->payment === OrderStatus::PAID ? now() : null,
            'quote_valid_until' => null,
        ])->save();

        $this->insertLines($order, $state);
        $this->insertAdjustments($order, $state);
        if ($uniqueCode !== 0) {
            $order->adjustments()->create(['kind' => 'unique_code', 'source_type' => 'unique_code', 'label' => __('commerce::payments.unique_code'),
                'amount' => $uniqueCode, 'created_at' => now()]);
        }
        if (! $draft) {
            $this->timeline->record($order, 'status', Timeline::text($isQuote ? 'commerce::orders.timeline.quote_requested' : 'commerce::orders.timeline.placed'),
                ['to' => $order->status, 'channel' => 'storefront'], Actor::customer());
        }

        if ($method !== null) {
            $deadline = $method->deadline($order);
            // A deposit (set by a calculation stage) is paid now, the rest by balance_due_at.
            $deposit = $state->depositDue();
            if ($deposit !== null) {
                $dueAt = isset($state->deposit['balance_due_at']) ? Carbon::parse((string) $state->deposit['balance_due_at']) : null;
                $order->forceFill(['deposit_total' => $deposit + $uniqueCode, 'balance_due_at' => $dueAt])->save();
                $money = app(MoneyFormatter::class);
                $this->timeline->record($order, 'payment', Timeline::text('commerce::orders.timeline.deposit_asked', [
                    'amount' => $money->format($order->deposit_total), 'balance' => $money->format($order->total - $order->deposit_total),
                    'date' => $dueAt?->translatedFormat('j F Y') ?? '—',
                ]), ['deposit' => $order->deposit_total], Actor::customer());
            }
            Payment::query()->create([
                'order_id' => $order->id, 'method' => $order->payment_method, 'method_title' => $order->payment_method_title,
                'amount' => $deposit !== null ? $order->deposit_total : $order->total, 'currency' => $order->currency, 'status' => 'pending', 'expires_at' => $deadline,
                'meta' => array_filter(['part' => $deposit !== null ? 'deposit' : null, 'checkout_session' => $draft]) ?: null,
            ]);
            $order->forceFill(['expires_at' => $deadline ?? ($draft ? now()->addDay() : null)])->save();
        }

        return $order;
    }

    /** Lines as snapshots; bundle components as child lines. */
    public function insertLines(Order $order, CalculationState $state): void
    {
        $locale = (string) ($order->locale ?? Locales::default());
        $this->loadSnapshots($state);
        foreach ($state->lines as $line) {
            $item = OrderItem::query()->create($this->lineAttributes($order, $line, $locale));
            $product = $line->product();
            if ($product->isBundle()) {
                foreach (app(Bundles::class)->explode($product, $line->quantity) as $component) {
                    $variant = $component['variant'];
                    OrderItem::query()->create([
                        'order_id' => $order->id, 'parent_id' => $item->id, 'product_id' => $variant->product_id, 'variant_id' => $variant->id,
                        'entry_id' => $variant->product->entry_id, 'name' => $this->title($variant, $locale), 'variant_title' => $variant->title ?: null,
                        'sku' => $variant->sku, 'quantity' => $component['quantity'], 'weight' => (int) $variant->weight,
                        'requires_shipping' => $line->requiresShipping && $variant->requiresShipping(), 'downloadable' => $variant->isDownloadable(),
                        'options' => $this->options($variant),
                    ]);
                }
            }
        }
    }

    /** @return array<string, mixed> */
    protected function lineAttributes(Order $order, CalcLine $line, string $locale): array
    {
        $variant = $line->variant;

        return [
            'order_id' => $order->id,
            'product_id' => $variant->product_id,
            'variant_id' => $variant->id,
            'entry_id' => $variant->product->entry_id,
            'flash_sale_item_id' => $line->priceSource['type'] === 'flash_sale' ? (int) $line->priceSource['id'] : null,
            'name' => $this->title($variant, $locale),
            'variant_title' => $variant->title ?: null,
            'sku' => $variant->sku,
            'options' => $this->options($variant),
            'quantity' => $line->quantity,
            'unit_price' => $line->unitPrice,
            'regular_unit_price' => $line->regularUnitPrice,
            'compare_at_price' => $variant->compare_at_price,
            'price_source' => $line->priceSource,
            'subtotal' => $line->subtotal,
            'discount_total' => $line->discount(),
            'tax_total' => $line->tax(),
            'total' => $line->net(),
            'cost' => $variant->cost,
            'weight' => (int) $variant->weight,
            'requires_shipping' => $line->requiresShipping,
            'downloadable' => $line->downloadable,
            // on_request: the customer saw no price for it; a quote shows none until staff price it.
            'meta' => array_filter(['line' => $line->meta ?: null, 'price' => $line->priceMeta ?: null, 'taxes' => $line->taxes ?: null, 'discounts' => $line->discounts ?: null,
                'on_request' => $line->onRequest ?: null]) ?: null,
        ];
    }

    /** Discounts, shipping discounts, fees and unique codes; taxes by name. */
    public function insertAdjustments(Order $order, CalculationState $state): void
    {
        $now = now();
        foreach ($state->adjustments as $adjustment) {
            $order->adjustments()->create([
                'kind' => $adjustment->type,
                'source_type' => $adjustment->source['type'],
                'source_id' => isset($adjustment->source['id']) ? (string) $adjustment->source['id'] : null,
                'code' => $adjustment->source['code'] ?? null,
                'label' => $adjustment->label,
                'amount' => $adjustment->sign() * $adjustment->amount,
                'meta' => array_filter(['key' => $adjustment->key, 'allocations' => $adjustment->allocations ?: null, ...$adjustment->meta]) ?: null,
                'created_at' => $now,
            ]);
        }
        $taxes = [];
        foreach ($state->lines as $line) {
            foreach ($line->taxes as $tax) {
                $taxes[$tax['name']] = ($taxes[$tax['name']] ?? 0) + $tax['amount'];
            }
        }
        if (($state->data['shipping_tax'] ?? 0) > 0) {
            $taxes[__('commerce::checkout.shipping_tax')] = (int) $state->data['shipping_tax'];
        }
        foreach ($taxes as $name => $amount) {
            $order->adjustments()->create(['kind' => 'tax', 'source_type' => 'tax_rate', 'label' => (string) $name, 'amount' => $amount,
                'meta' => ['included' => $order->prices_include_tax], 'created_at' => $now]);
        }
    }

    /**
     * Stock, then flash sale quantities, then voucher uses (in id order),
     * all or nothing: any failure rolls the whole placement back.
     *
     * @throws CheckoutRefused
     */
    public function reserve(Order $order, CalculationState $state): void
    {
        $lines = array_map(fn (CalcLine $l) => [$l->variant, $l->quantity], array_values($state->lines));
        try {
            app(Inventory::class)->reserve($lines, $order, 'order');
        } catch (OutOfStock $e) {
            throw new CheckoutRefused($e->customerMessage(), previous: $e);
        }
        $order->setMeta('reserved.stock', true);

        $flash = [];
        foreach ($state->lines as $line) {
            if ($line->priceSource['type'] === 'flash_sale') {
                $flash[(int) $line->priceSource['id']] = ($flash[(int) $line->priceSource['id']] ?? 0) + $line->quantity;
            }
        }
        ksort($flash);
        foreach ($flash as $itemId => $qty) {
            if (! app(FlashSaleReservations::class)->reserve($itemId, $qty)) {
                throw new CheckoutRefused(__('commerce::checkout.errors.flash_sale'));
            }
        }
        $order->setMeta('reserved.flash', $flash ?: null);

        $amounts = [];
        foreach ($state->adjustments as $adjustment) {
            if ($adjustment->source['type'] === 'voucher' && in_array($adjustment->type, [Adjustment::DISCOUNT, Adjustment::SHIPPING_DISCOUNT], true)) {
                $amounts[(int) $adjustment->source['id']] = ($amounts[(int) $adjustment->source['id']] ?? 0) + $adjustment->amount;
            }
        }
        ksort($amounts);
        foreach (Voucher::query()->whereIn('id', array_keys($amounts))->orderBy('id')->get() as $voucher) {
            if (! app(VoucherRedemptions::class)->redeem($voucher, $order->id, $amounts[$voucher->id], $state->ctx)) {
                throw new CheckoutRefused(__('commerce::checkout.errors.voucher', ['code' => $voucher->label()]));
            }
        }
        $order->setMeta('reserved.vouchers', $amounts !== []);

        // Extension providers that hold something back (loyalty points…).
        $committed = [];
        $providers = app(PriceProviders::class);
        foreach ([...$providers->discounts(), ...$providers->shippingDiscounts(), ...$providers->fees(), ...($state->adjustmentsOfType(Adjustment::POINTS) !== [] ? [app(Loyalty::class)] : [])] as $provider) {
            if ($provider instanceof ReservesDiscounts && ! in_array($provider::class, $committed, true)) {
                $provider->commit($order, $state);
                $committed[] = $provider::class;
            }
        }
        if ($committed !== []) {
            $order->setMeta('reserved.providers', $committed);
        }
        $order->save();
    }

    protected function weight(CalculationState $state): int
    {
        $grams = 0;
        foreach ($state->lines as $line) {
            if ($line->requiresShipping) {
                $grams += (int) $line->variant->weight * $line->quantity;
            }
        }

        return $grams;
    }

    /** @var array<int, Entry> entry id => entry with translations, for the lines being inserted */
    protected array $entries = [];

    /**
     * Load the entries (titles) and option values of every line and bundle
     * component at once, so inserting lines doesn't query per line.
     */
    protected function loadSnapshots(CalculationState $state): void
    {
        $this->entries = [];
        $variants = [];
        foreach ($state->lines as $line) {
            $variants[] = $line->variant;
            if ($line->product()->isBundle()) {
                foreach (app(Bundles::class)->explode($line->product(), 1) as $component) {
                    $variants[] = $component['variant'];
                }
            }
        }
        if ($variants === []) {
            return;
        }
        (new EloquentCollection($variants))->loadMissing(['product', 'optionValues.option', 'optionValues.term.translations']);
        $ids = array_values(array_unique(array_map(fn (Variant $v) => (int) $v->product->entry_id, $variants)));
        $this->entries = Entry::withTrashed()->with('translations')->whereIn('id', $ids)->get()->keyBy('id')->all();
    }

    protected function title(Variant $variant, string $locale): string
    {
        $entry = $this->entries[(int) $variant->product->entry_id] ?? $variant->product->entry();
        if ($entry === null) {
            return (string) ($variant->sku ?? 'Product');
        }
        $entry->loadMissing('translations');
        $translation = $entry->translations->firstWhere('locale', $locale) ?? $entry->translations->firstWhere('locale', Locales::default()) ?? $entry->translations->first();

        return (string) ($translation->title ?? $variant->sku ?? 'Product');
    }

    /** @return array<string, string>|null option name => value */
    protected function options(Variant $variant): ?array
    {
        $variant->loadMissing('optionValues.option', 'optionValues.term.translations');
        $options = [];
        foreach ($variant->optionValues as $value) {
            $options[(string) $value->option->name] = (string) ($value->label ?? $value->term?->title() ?? '');
        }

        return $options ?: null;
    }
}
