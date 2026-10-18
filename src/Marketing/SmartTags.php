<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Marketing;

use Illuminate\Support\Facades\Route;
use Sunrice\Commerce\Cart\Models\Cart;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Support\MoneyFormatter;

/**
 * Smart tags in a marketing email's subject, text and button: {first_name},
 * {cart_items}… replaced for each recipient. A fallback follows a bar,
 * for when the value is empty: {first_name|there}. Unknown tags are left
 * as they are, so a typo shows up in the test email.
 */
class SmartTags
{
    /** Tags whose value is HTML (left unescaped in the body; text elsewhere). */
    protected const HTML = ['cart_items'];

    /** @return array<string, string> tag => description */
    public static function all(): array
    {
        return [
            'first_name' => 'First name',
            'name' => 'Full name',
            'email' => 'Email address',
            'store_name' => 'Store name',
            'store_url' => 'Store home page',
            'account_url' => 'My Account page',
            'orders_count' => 'Number of orders',
            'total_spent' => 'Total spent',
            'last_order_number' => 'Last order number',
            'last_order_date' => 'Last order date',
            'days_since_last_order' => 'Days since the last order',
            'cart_url' => 'Link that brings back their cart',
            'cart_items' => 'Products in their cart',
            'cart_total' => 'Cart subtotal',
            'voucher_code' => 'The email\'s voucher code',
            'unsubscribe_url' => 'Unsubscribe link',
        ];
    }

    /**
     * The values for one recipient.
     *
     * @param  array<string, mixed>  $extra  voucher_code, cart, unsubscribe_url…
     * @return array<string, string>
     */
    public function values(?Customer $customer, string $email, string $locale, array $extra = []): array
    {
        $money = app(MoneyFormatter::class);
        $name = trim((string) ($customer->name ?? ''));
        $last = $customer !== null && $customer->orders_count > 0
            ? Order::query()->where('customer_id', $customer->id)->where('type', 'order')->latest('placed_at')->first()
            : null;
        $cart = $extra['cart'] ?? null;

        return [
            'first_name' => $name === '' ? '' : explode(' ', $name)[0],
            'name' => $name,
            'email' => $email,
            'store_name' => commerce_store_name(),
            'store_url' => url('/'),
            'account_url' => Route::has('commerce.account') ? commerce_url('commerce.account', [], $locale) : url('/'),
            'orders_count' => (string) ($customer->orders_count ?? 0),
            'total_spent' => $money->format((int) ($customer->total_spent ?? 0)),
            'last_order_number' => $last?->displayNumber() ?? '',
            'last_order_date' => $last?->placed_at?->locale($locale)->isoFormat('D MMMM YYYY') ?? '',
            'days_since_last_order' => $customer?->last_order_at !== null ? (string) (int) $customer->last_order_at->diffInDays(now()) : '',
            'cart_url' => (string) ($extra['cart_url'] ?? ''),
            'cart_items' => $cart instanceof Cart ? $this->cartItems($cart, $locale) : '',
            'cart_total' => $cart instanceof Cart ? $money->format($this->cartSubtotal($cart)) : '',
            'voucher_code' => (string) ($extra['voucher_code'] ?? ''),
            'unsubscribe_url' => (string) ($extra['unsubscribe_url'] ?? ''),
        ];
    }

    /**
     * Replace the tags in $template. In HTML, values are escaped (except
     * {cart_items}); in text, HTML values become plain lines.
     *
     * @param  array<string, string>  $values
     */
    public function render(string $template, array $values, bool $html = false): string
    {
        // Editors encode braces in link addresses: href="%7Bcart_url%7D".
        $template = preg_replace('/%7B([a-z_]+)(?:%7C([^%]*))?%7D/i', '{$1|$2}', $template) ?? $template;

        return preg_replace_callback('/\{([a-z_]+)(?:\|([^{}]*))?\}/', function (array $m) use ($values, $html): string {
            if (! array_key_exists($m[1], $values)) {
                return $m[0];
            }
            $value = $values[$m[1]];
            if ($value === '') {
                $fallback = rawurldecode($m[2] ?? '');

                return $html ? e($fallback) : $fallback;
            }
            if (in_array($m[1], self::HTML, true)) {
                return $html ? $value : trim(html_entity_decode(strip_tags(str_replace('</li>', "\n", $value))));
            }

            return $html ? e($value) : $value;
        }, $template) ?? $template;
    }

    protected function cartItems(Cart $cart, string $locale): string
    {
        $money = app(MoneyFormatter::class);
        $items = $cart->items()->with('variant.product')->limit(10)->get();
        $lines = [];
        foreach ($items as $item) {
            $variant = $item->variant;
            $translations = $variant->product->entry()?->translations;
            $title = $translations?->firstWhere('locale', $locale)->title ?? $translations?->first()->title ?? $variant->sku;
            $label = trim($title.($variant->title !== '' ? ' — '.$variant->title : ''));
            $lines[] = '<li>'.e($item->quantity.' × '.$label).($item->unit_price_seen !== null ? ' — '.e($money->format((int) $item->unit_price_seen * $item->quantity)) : '').'</li>';
        }

        return $lines === [] ? '' : '<ul>'.implode('', $lines).'</ul>';
    }

    protected function cartSubtotal(Cart $cart): int
    {
        return (int) $cart->items()->get()->sum(fn ($i) => (int) $i->unit_price_seen * (int) $i->quantity);
    }
}
