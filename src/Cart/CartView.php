<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Cart;

use Illuminate\Support\Facades\DB;
use JsonSerializable;
use Sunrice\Commerce\Cart\Models\Cart;
use Sunrice\Commerce\Cart\Models\CartItem;
use Sunrice\Commerce\Catalog\ProductView;
use Sunrice\Commerce\Catalog\ProductViewFactory;
use Sunrice\Commerce\Pricing\CalcLine;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Pricing\Calculator;
use Sunrice\Commerce\Pricing\PricingContext;
use Sunrice\Commerce\Support\MoneyFormatter;
use Sunrice\Models\Entry;

/**
 * The cart as the customer sees it: lines with their product views,
 * prices, discounts, totals and notices (removed items, price changes,
 * voucher refusals). Used by the cart page, mini cart, checkout and JSON.
 */
class CartView implements JsonSerializable
{
    /** @var array<int, array{item: CartItem, line: CalcLine, product: ?ProductView, entry: ?Entry}> */
    public array $lines = [];

    public function __construct(public readonly ?Cart $cart, public readonly CalculationState $state) {}

    /**
     * @param  array<string, mixed>  $context  PricingContext overrides (checkout: destination, rate, payment)
     */
    public static function for(?Cart $cart, array $context = []): self
    {
        $ctx = PricingContext::current()->with($context);
        if ($cart === null) {
            return new self(null, app(Calculator::class)->calculate([], $ctx));
        }
        $cart->loadMissing('items.variant.product.tiers');
        $checkout = (array) $cart->checkout;
        $ctx = $ctx->with(array_filter([
            'email' => $ctx->email ?? ($checkout['email'] ?? null),
            'phone' => $checkout['phone'] ?? null,
        ]));
        $lines = [];
        foreach ($cart->items as $item) {
            $lines['i'.$item->id] = [$item->variant, $item->quantity, (array) $item->meta];
        }
        $state = app(Calculator::class)->calculate($lines, $ctx, (array) $cart->vouchers);
        $view = new self($cart, $state);
        $view->attach();

        return $view;
    }

    /** Product views for the lines; "price changed" notices against what the customer saw. */
    protected function attach(): void
    {
        $items = $this->cart?->items->keyBy(fn (CartItem $i) => 'i'.$i->id) ?? collect();
        $entryIds = array_map(fn (CalcLine $l) => (int) $l->product()->entry_id, array_values($this->state->lines));
        $entries = $entryIds === [] ? collect() : Entry::query()->with('translations', 'collection')->whereIn('id', $entryIds)->get()
            ->each(fn (Entry $e) => $e->resolveFor(app()->getLocale()))->keyBy('id');
        $views = app(ProductViewFactory::class)->forEntries($entries->values());
        $money = app(MoneyFormatter::class);

        foreach ($this->state->lines as $key => $line) {
            $item = $items->get($key);
            if ($item === null) {
                continue;
            }
            if ($item->unit_price_seen !== null && $item->unit_price_seen !== $line->unitPrice) {
                $this->state->notice('price_changed', __('commerce::storefront.cart.price_changed', [
                    'product' => $this->title($entries->get($line->product()->entry_id), $line),
                    'from' => $money->format($item->unit_price_seen), 'to' => $money->format($line->unitPrice),
                ]), $key);
            }
            $this->lines[] = ['item' => $item, 'line' => $line, 'product' => $views[$line->product()->entry_id] ?? null, 'entry' => $entries->get($line->product()->entry_id)];
        }
    }

    /** Remember the prices shown, so the next change can be noticed. */
    public function acknowledgePrices(): void
    {
        $changed = [];
        foreach ($this->lines as $row) {
            if ($row['item']->unit_price_seen !== $row['line']->unitPrice) {
                $changed[(int) $row['item']->id] = [$row['item'], (int) $row['line']->unitPrice];
            }
        }
        if ($changed === []) {
            return;
        }
        // One statement for all lines; ids and prices are ints, so inlining them is safe.
        $case = 'CASE id';
        foreach ($changed as $id => [, $price]) {
            $case .= ' WHEN '.$id.' THEN '.$price;
        }
        CartItem::query()->whereIn('id', array_keys($changed))->update(['unit_price_seen' => DB::raw($case.' END'), 'updated_at' => now()]);
        foreach ($changed as [$item, $price]) {
            $item->setAttribute('unit_price_seen', $price)->syncOriginalAttribute('unit_price_seen');
        }
    }

    public function isEmpty(): bool
    {
        return $this->lines === [];
    }

    public function count(): int
    {
        return array_sum(array_map(fn (array $row) => $row['line']->quantity, $this->lines));
    }

    protected function title(?Entry $entry, CalcLine $line): string
    {
        return trim(($entry->title ?? '').($line->variant->title !== '' ? ' ('.$line->variant->title.')' : ''));
    }

    /** @return array<string, mixed> */
    public function jsonSerialize(): array
    {
        $money = app(MoneyFormatter::class);
        $format = fn (int $amount) => ['amount' => $amount, 'formatted' => $money->format($amount)];

        return [
            'count' => $this->count(),
            'lines' => array_map(fn (array $row) => [
                'id' => $row['item']->id,
                'variant_id' => $row['line']->variant->id,
                'title' => $this->title($row['entry'], $row['line']),
                'url' => $row['entry']?->url,
                'sku' => $row['line']->variant->sku,
                'quantity' => $row['line']->quantity,
                'min_qty' => $row['line']->variant->min_qty,
                'max_qty' => $row['line']->variant->max_qty,
                'qty_step' => $row['line']->variant->qty_step,
                'unit_price' => $format($row['line']->unitPrice),
                'regular_unit_price' => $row['line']->regularUnitPrice > $row['line']->unitPrice ? $format($row['line']->regularUnitPrice) : null,
                'price_source' => $row['line']->priceSource,
                'subtotal' => $format($row['line']->subtotal),
                'discount' => $format($row['line']->discount()),
                'total' => $format($row['line']->net()),
            ], $this->lines),
            'codes' => $this->state->appliedCodes,
            'adjustments' => array_map(fn ($a) => ['type' => $a->type, 'label' => $a->label, 'amount' => $format($a->amount), 'code' => $a->source['code'] ?? null], array_values($this->state->adjustments)),
            'totals' => array_map($format, $this->state->totals),
            'notices' => $this->state->notices,
        ];
    }
}
