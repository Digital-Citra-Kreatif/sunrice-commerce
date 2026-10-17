<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Settings\Sections;

use Closure;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Settings\SettingsRegistry;
use Sunrice\Commerce\Settings\SettingsSection;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Support\NumberFormat;
use Sunrice\Models\Taxonomy;
use Sunrice\Support\Locales;

/**
 * The Settings → Store sections commerce itself provides. Sections of
 * later modules (Payments, Shipping, Taxes, Emails…) are registered by
 * those modules.
 */
final class BuiltinSections
{
    public static function register(SettingsRegistry $registry): void
    {
        $registry->register(new SettingsSection('general', 'General', fn () => self::general(), position: 10, check: self::checkSellingMode()));
        $registry->register(new SettingsSection('catalog', 'Catalog', fn () => self::catalog(), position: 20));
        $registry->register(new SettingsSection('checkout', 'Checkout', fn () => self::checkout(), feature: 'checkout', position: 30, rules: [
            'order_number_format' => [self::formatRule()],
            'quote_number_format' => [self::formatRule()],
        ]));
        $registry->register(new SettingsSection('taxes', 'Taxes', fn () => self::taxes(), feature: 'taxes', position: 50));
        $registry->register(new SettingsSection('accounts', 'Accounts', fn () => self::accounts(), feature: 'accounts', position: 60));
        $registry->register(new SettingsSection('digital', 'Digital products', fn () => self::digital(), feature: 'digital', permission: 'commerce.settings.catalog', position: 25));
        $registry->register(new SettingsSection('documents', 'Documents', fn () => self::documents(), feature: 'documents', position: 80, rules: [
            'invoice_number_format' => [self::formatRule()],
        ]));
    }

    /**
     * @param  array<string, string>  $labels
     * @return array<int, array{value: string, label: string}>
     */
    protected static function options(array $labels): array
    {
        return array_map(fn ($value, $label) => ['value' => (string) $value, 'label' => $label], array_keys($labels), $labels);
    }

    /** @return array<int, array<string, mixed>> */
    protected static function digital(): array
    {
        return [
            ['handle' => 'delivery', 'type' => 'select', 'label' => 'Delivery', 'instructions' => 'How files reach customers when the product doesn\'t say.', 'config' => ['multiple' => true, 'options' => self::options([
                'attachment' => 'Attached to the email (small files)', 'link' => 'A download link in the email', 'account' => 'In My Account → Downloads',
            ])]],
            ['handle' => 'grant_on', 'type' => 'select', 'label' => 'Give access when the order is', 'config' => ['options' => self::options(['paid' => 'Paid', 'completed' => 'Completed'])]],
            ['handle' => 'download_limit', 'type' => 'number', 'label' => 'Downloads per file', 'instructions' => 'Empty: unlimited.', 'config' => ['min' => 1], 'validation' => ['nullable', 'integer']],
            ['handle' => 'expiry_days', 'type' => 'number', 'label' => 'Links expire after (days)', 'instructions' => 'Empty: never.', 'config' => ['min' => 1], 'validation' => ['nullable', 'integer']],
        ];
    }

    /** @return array<int, array<string, mixed>> */
    protected static function general(): array
    {
        return [
            ['handle' => 'name', 'type' => 'text', 'label' => 'Store name', 'required' => true, 'translatable' => false, 'config' => ['max' => 120],
                'instructions' => 'On invoices, emails and the storefront.'],
            ['handle' => 'logo', 'type' => 'asset', 'label' => 'Logo', 'config' => ['image_only' => true], 'instructions' => 'For invoices and emails.'],
            ['handle' => 'email', 'type' => 'text', 'label' => 'Store email', 'translatable' => false, 'validation' => ['email:rfc', 'max:190'],
                'instructions' => 'Order notifications go here; customers reply to it.'],
            ['handle' => 'phone', 'type' => 'text', 'label' => 'Phone', 'translatable' => false, 'config' => ['max' => 40]],
            ['handle' => 'tax_id', 'type' => 'text', 'label' => 'Tax number (NPWP)', 'translatable' => false, 'config' => ['max' => 40]],
            ['handle' => 'address', 'type' => 'group', 'label' => 'Store address', 'instructions' => 'Printed on invoices; shipping origin.', 'config' => ['fields' => [
                ['handle' => 'line1', 'type' => 'text', 'label' => 'Street address', 'translatable' => false, 'config' => ['max' => 190]],
                ['handle' => 'line2', 'type' => 'text', 'label' => 'Building, floor (optional)', 'translatable' => false, 'config' => ['max' => 190]],
                ['handle' => 'region', 'type' => 'commerce_region', 'label' => 'Region', 'config' => ['depth' => 'district']],
                ['handle' => 'postal_code', 'type' => 'text', 'label' => 'Postal code', 'translatable' => false, 'config' => ['max' => 12]],
            ]]],
            ['handle' => 'selling_mode', 'type' => 'select', 'label' => 'Selling mode', 'required' => true, 'config' => ['options' => self::options([
                'shop' => 'Online store: customers check out and pay',
                'quote' => 'Quotation: customers request a quote, you send prices',
                'whatsapp' => 'WhatsApp order: the cart is sent to you on WhatsApp',
                'catalog' => 'Catalog: no cart; products show a call to action',
            ])]],
            ['handle' => 'pause_orders', 'type' => 'toggle', 'label' => 'Pause orders', 'instructions' => 'The store stays open, but checkout is closed (holidays, stocktaking).'],
            ['handle' => 'pause_message', 'type' => 'textarea', 'label' => 'Message while paused', 'config' => ['max' => 500]],
            ['handle' => 'whatsapp', 'type' => 'group', 'label' => 'WhatsApp', 'config' => ['fields' => [
                ['handle' => 'numbers', 'type' => 'repeater', 'label' => 'Numbers', 'config' => ['max' => 10, 'fields' => [
                    ['handle' => 'number', 'type' => 'text', 'label' => 'Number', 'required' => true, 'translatable' => false, 'validation' => ['regex:/^\+?[0-9 ()-]{8,20}$/']],
                    ['handle' => 'name', 'type' => 'text', 'label' => 'Name (e.g. Sales Jakarta)', 'translatable' => false, 'config' => ['max' => 60]],
                ]]],
                ['handle' => 'rotation', 'type' => 'select', 'label' => 'With several numbers', 'config' => ['options' => self::options([
                    'random' => 'Pick one at random', 'round_robin' => 'Take turns (round-robin)',
                ])]],
                self::perLanguage('product_message', 'Message about a product',
                    'Placeholders: {product}, {variant}, {quantity}, {price}, {url}. Empty: the default message.'),
                self::perLanguage('order_message', 'Message for an order',
                    'Placeholders: {order_number}, {items}, {total}, {name}, {phone}, {address}, {shipping}, {notes}, {url}. Empty: the default message.'),
            ]]],
            ['handle' => 'currency', 'type' => 'group', 'label' => 'Currency', 'instructions' => "Can't be changed once there are orders.", 'config' => ['fields' => [
                ['handle' => 'code', 'type' => 'text', 'label' => 'Currency code', 'required' => true, 'translatable' => false, 'validation' => ['regex:/^[A-Z]{3}$/']],
                ['handle' => 'symbol', 'type' => 'text', 'label' => 'Symbol', 'required' => true, 'translatable' => false, 'config' => ['max' => 8]],
                ['handle' => 'position', 'type' => 'select', 'label' => 'Symbol position', 'config' => ['options' => self::options(['left' => 'Before the amount', 'right' => 'After the amount'])]],
                ['handle' => 'space', 'type' => 'toggle', 'label' => 'Space between symbol and amount'],
                ['handle' => 'thousands', 'type' => 'select', 'label' => 'Thousands separator', 'config' => ['options' => self::options(['.' => 'Dot (1.000)', ',' => 'Comma (1,000)', ' ' => 'Space (1 000)', '' => 'None (1000)'])]],
                ['handle' => 'decimal', 'type' => 'select', 'label' => 'Decimal separator', 'config' => ['options' => self::options([',' => 'Comma', '.' => 'Dot'])]],
                ['handle' => 'decimals', 'type' => 'number', 'label' => 'Decimals', 'required' => true, 'config' => ['min' => 0, 'max' => 3], 'validation' => ['integer']],
            ]]],
            ['handle' => 'weight_unit', 'type' => 'select', 'label' => 'Weight unit', 'config' => ['options' => self::options(['kg' => 'Kilograms', 'g' => 'Grams'])]],
            ['handle' => 'dimension_unit', 'type' => 'select', 'label' => 'Dimension unit', 'config' => ['options' => self::options(['cm' => 'Centimeters', 'm' => 'Meters', 'mm' => 'Millimeters'])]],
        ];
    }

    /** @return array<int, array<string, mixed>> */
    protected static function catalog(): array
    {
        $roles = Role::query()->orderBy('name')->pluck('name')->map(fn (string $r) => ['value' => $r, 'label' => $r])->all();
        $taxonomies = Taxonomy::query()->orderBy('title')->get()->map(fn (Taxonomy $t) => ['value' => $t->handle, 'label' => $t->title])->all();

        return [
            ['handle' => 'price_visibility', 'type' => 'select', 'label' => 'Who sees prices', 'config' => ['options' => self::options([
                'everyone' => 'Everyone', 'signed_in' => 'Signed-in customers', 'roles' => 'Customers with certain roles', 'nobody' => 'Nobody (prices on request)',
            ])]],
            ['handle' => 'price_visibility_roles', 'type' => 'select', 'label' => 'Roles that see prices', 'config' => ['options' => $roles, 'multiple' => true]],
            ['handle' => 'call_to_action', 'type' => 'select', 'label' => 'Call to action in Catalog mode', 'instructions' => 'Products can override it.', 'config' => ['options' => self::options([
                'inquiry' => 'Inquiry form', 'whatsapp' => 'Ask on WhatsApp', 'external' => 'Links to other shops (set per product)', 'none' => 'None',
            ])]],
            ['handle' => 'show_stock', 'type' => 'select', 'label' => 'Show stock', 'config' => ['options' => self::options([
                'always' => 'Always ("12 in stock")', 'low' => 'Only when low ("Only 3 left")', 'never' => 'Never (in stock / out of stock)',
            ])]],
            ['handle' => 'low_stock_threshold', 'type' => 'number', 'label' => 'Low stock at', 'config' => ['min' => 0, 'max' => 100000], 'validation' => ['integer']],
            ['handle' => 'hide_out_of_stock', 'type' => 'toggle', 'label' => 'Hide out-of-stock products from listings'],
            ['handle' => 'new_badge_days', 'type' => 'number', 'label' => '"New" badge for (days)', 'instructions' => '0: no badge.', 'config' => ['min' => 0, 'max' => 365], 'validation' => ['integer']],
            ['handle' => 'price_range', 'type' => 'select', 'label' => 'Price of variable products', 'config' => ['options' => self::options([
                'range' => 'Range (Rp10.000 – Rp25.000)', 'from' => 'From the lowest (From Rp10.000)', 'min' => 'Lowest only',
            ])]],
            ['handle' => 'attribute_taxonomies', 'type' => 'select', 'label' => 'Attribute taxonomies', 'instructions' => 'Taxonomies that can be used as product options (e.g. Colors) and filters.', 'config' => ['options' => $taxonomies, 'multiple' => true]],
            ['handle' => 'compare_max', 'type' => 'number', 'label' => 'Products to compare at most', 'config' => ['min' => 2, 'max' => 6], 'validation' => ['integer']],
            ['handle' => 'compare_fields', 'type' => 'select', 'label' => 'Compare also', 'config' => ['multiple' => true, 'options' => self::options([
                'sku' => 'SKU', 'brand' => 'Brand', 'categories' => 'Categories', 'stock' => 'Stock', 'weight' => 'Weight', 'dimensions' => 'Dimensions', 'attributes' => 'Attributes', 'excerpt' => 'Summary',
            ])]],
        ];
    }

    /** @return array<int, array<string, mixed>> */
    protected static function checkout(): array
    {
        $resets = self::options(['never' => 'Never', 'yearly' => 'Every year', 'monthly' => 'Every month', 'daily' => 'Every day']);

        return [
            ['handle' => 'guest_checkout', 'type' => 'toggle', 'label' => 'Allow checkout without an account'],
            ['handle' => 'create_account', 'type' => 'select', 'label' => 'Accounts at checkout', 'config' => ['options' => self::options([
                'never' => "Don't offer", 'offer' => 'Offer to create one', 'always' => 'Always create one',
            ])]],
            ['handle' => 'require_phone', 'type' => 'toggle', 'label' => 'Require a phone number'],
            ['handle' => 'company_fields', 'type' => 'toggle', 'label' => 'Ask for a company name and tax number'],
            ['handle' => 'address_line2', 'type' => 'toggle', 'label' => 'Second address line'],
            ['handle' => 'require_postal_code', 'type' => 'toggle', 'label' => 'Require a postal code'],
            ['handle' => 'village_level', 'type' => 'toggle', 'label' => 'Ask for the village (kelurahan/desa)'],
            ['handle' => 'order_notes', 'type' => 'toggle', 'label' => 'Order notes'],
            ['handle' => 'dropshipper', 'type' => 'toggle', 'label' => 'Dropshipper details (sender name and phone)'],
            ['handle' => 'minimum_order', 'type' => 'commerce_money', 'label' => 'Minimum order', 'instructions' => 'Subtotal before discounts; 0 for none.', 'config' => ['allow_null' => false]],
            ['handle' => 'terms_page', 'type' => 'entries', 'label' => 'Terms page', 'instructions' => 'Customers must accept it to check out.', 'config' => ['max' => 1]],
            ['handle' => 'customer_cancel', 'type' => 'toggle', 'label' => 'Customers can cancel unpaid orders'],
            ['handle' => 'order_number_format', 'type' => 'text', 'label' => 'Order number', 'required' => true, 'translatable' => false,
                'instructions' => '{Y} year, {y} 2-digit year, {m} month, {d} day, {seq:4} counter with 4 digits.', 'config' => ['max' => 60]],
            ['handle' => 'order_number_reset', 'type' => 'select', 'label' => 'Restart the order counter', 'config' => ['options' => $resets]],
            ['handle' => 'quote_number_format', 'type' => 'text', 'label' => 'Quote number', 'required' => true, 'translatable' => false, 'config' => ['max' => 60]],
            ['handle' => 'quote_number_reset', 'type' => 'select', 'label' => 'Restart the quote counter', 'config' => ['options' => $resets]],
            ['handle' => 'quote_valid_days', 'type' => 'number', 'label' => 'Quotes are valid for (days)', 'config' => ['min' => 1, 'max' => 365], 'validation' => ['integer']],
            ['handle' => 'auto_complete_shipped', 'type' => 'toggle', 'label' => 'Complete orders when shipped'],
            ['handle' => 'auto_complete_digital', 'type' => 'toggle', 'label' => 'Complete digital-only orders when paid'],
        ];
    }

    /** @return array<int, array<string, mixed>> */
    protected static function taxes(): array
    {
        return [
            ['handle' => 'prices_include_tax', 'type' => 'toggle', 'label' => 'Prices include tax', 'instructions' => 'On: tax is part of the prices you enter (usual in Indonesia). Off: tax is added at checkout.'],
            ['handle' => 'display_prices', 'type' => 'select', 'label' => 'Show prices', 'config' => ['options' => self::options(['incl' => 'Including tax', 'excl' => 'Excluding tax', 'none' => 'Without a tax note'])]],
            ['handle' => 'based_on', 'type' => 'select', 'label' => 'Tax by', 'config' => ['options' => self::options(['shipping' => 'The shipping address', 'store' => 'The store address'])]],
            ['handle' => 'classes', 'type' => 'select', 'label' => 'Tax classes', 'instructions' => 'Products choose one; "standard" always exists. Type to add (e.g. "exempt").', 'config' => ['multiple' => true, 'options' => array_map(
                fn (string $c) => ['value' => $c, 'label' => $c], array_values(array_unique(['standard', 'reduced', 'exempt', ...(array) app(StoreSettings::class)->get('taxes.classes', [])])),
            )]],
        ];
    }

    /** @return array<int, array<string, mixed>> */
    protected static function accounts(): array
    {
        $roles = Role::query()->orderBy('name')->pluck('name')->map(fn (string $r) => ['value' => $r, 'label' => $r])->all();

        return [
            ['handle' => 'registration', 'type' => 'toggle', 'label' => 'Customers can register'],
            ['handle' => 'verify_email', 'type' => 'toggle', 'label' => 'Verify email addresses'],
            ['handle' => 'require_phone', 'type' => 'toggle', 'label' => 'Ask for a phone number at registration'],
            ['handle' => 'customer_roles', 'type' => 'select', 'label' => 'Customer roles', 'required' => true,
                'instructions' => 'Roles given to new customers, and counted as customers in Shop → Customers.', 'config' => ['options' => $roles, 'multiple' => true]],
            ['handle' => 'code_minutes', 'type' => 'number', 'label' => 'Sign-in codes are valid for (minutes)', 'config' => ['min' => 5, 'max' => 60], 'validation' => ['integer']],
        ];
    }

    /** @return array<int, array<string, mixed>> */
    protected static function documents(): array
    {
        return [
            ['handle' => 'invoice_number_format', 'type' => 'text', 'label' => 'Invoice number', 'required' => true, 'translatable' => false, 'config' => ['max' => 60],
                'instructions' => '{Y} year, {y} 2-digit year, {m} month, {d} day, {seq:4} counter with 4 digits.'],
            ['handle' => 'invoice_number_reset', 'type' => 'select', 'label' => 'Restart the invoice counter', 'config' => ['options' => self::options(['never' => 'Never', 'yearly' => 'Every year', 'monthly' => 'Every month', 'daily' => 'Every day'])]],
            ['handle' => 'invoice_assigned_on', 'type' => 'select', 'label' => 'Give the invoice number', 'config' => ['options' => self::options(['placed' => 'When the order is placed', 'paid' => 'When it is paid'])]],
            ['handle' => 'customer_invoice_download', 'type' => 'toggle', 'label' => 'Customers can download invoices'],
            ['handle' => 'footer', 'type' => 'textarea', 'label' => 'Invoice footer', 'instructions' => 'Bank details, thank-you note…', 'config' => ['max' => 1000]],
        ];
    }

    /**
     * A textarea per site language: {id: "…", en: "…"}.
     *
     * @return array<string, mixed>
     */
    protected static function perLanguage(string $handle, string $label, string $instructions): array
    {
        $fields = [];
        foreach (Locales::available() as $locale) {
            $fields[] = ['handle' => $locale, 'type' => 'textarea', 'label' => Locales::name($locale), 'translatable' => false, 'config' => ['max' => 1000]];
        }

        return ['handle' => $handle, 'type' => 'group', 'label' => $label, 'instructions' => $instructions, 'config' => ['fields' => $fields]];
    }

    protected static function formatRule(): Closure
    {
        return function (string $attribute, mixed $value, Closure $fail): void {
            if (is_string($value) && ! NumberFormat::valid($value)) {
                $fail('Include a counter ({seq} or {seq:4}).');
            }
        };
    }

    /** The selling mode needs its essential modules (e.g. Online store needs Payments). */
    protected static function checkSellingMode(): Closure
    {
        return function (array $values, StoreSettings $current): ?string {
            $mode = (string) ($values['selling_mode'] ?? $current->get('general.selling_mode'));
            try {
                ToggleFeature::ensureModeUsable($mode, (array) $current->get('features', []));
            } catch (ValidationException $e) {
                return (string) collect($e->errors())->flatten()->first();
            }

            return null;
        };
    }
}
