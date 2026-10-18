<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Admin\Setup;

use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Payments\PaymentManager;
use Sunrice\Commerce\Payments\PaymentMethodBase;
use Sunrice\Commerce\Settings\StoreSettings;
use Throwable;

class SetupChecklist
{
    /** @var array<string, SetupStep> */
    protected array $steps = [];

    public function register(SetupStep $step): void
    {
        $this->steps[$step->key] = $step;
    }

    /** @return array<int, array{key: string, label: string, description: string, href: string, done: bool}> */
    public function evaluate(): array
    {
        $features = app(Features::class);
        $steps = array_filter($this->steps, fn (SetupStep $s) => $s->feature === null || $features->active($s->feature));
        usort($steps, fn (SetupStep $a, SetupStep $b) => $a->position <=> $b->position);

        return array_map(function (SetupStep $step): array {
            try {
                $done = (bool) ($step->done)();
            } catch (Throwable $e) {
                report($e);
                $done = false;
            }

            return ['key' => $step->key, 'label' => $step->label, 'description' => $step->description, 'href' => $step->href, 'done' => $done];
        }, $steps);
    }

    public static function registerBuiltin(self $checklist): void
    {
        $settings = fn () => app(StoreSettings::class);
        $checklist->register(new SetupStep('details', 'Add your store details', 'commerce/settings/general',
            fn () => filled($settings()->get('general.name')) && filled($settings()->get('general.email')),
            position: 10, description: 'Name and email, for invoices and order emails.'));
        $checklist->register(new SetupStep('address', 'Add your store address', 'commerce/settings/general',
            fn () => filled($settings()->get('general.address.line1')) && filled($settings()->get('general.address.region.city_code') ?? $settings()->get('general.address.region.country')),
            position: 20, description: 'Printed on invoices and used as the shipping origin.'));
        $checklist->register(new SetupStep('products', 'Add products', 'commerce/products',
            fn () => DB::table('commerce_products')->whereNull('removed_at')->exists(),
            position: 30, description: 'Products are entries with Product data: create them in Shop → Products.'));
        $checklist->register(new SetupStep('payments', 'Switch on a payment method', 'commerce/settings/payments',
            fn () => array_filter(app(PaymentManager::class)->all(), fn ($m) => ! $m instanceof PaymentMethodBase || $m->active()) !== [],
            feature: 'payments', position: 40, description: 'Bank transfer, payment instructions (QRIS) or cash on delivery.'));
        $checklist->register(new SetupStep('shipping', 'Set up shipping', 'commerce/settings/shipping',
            fn () => DB::table('commerce_shipping_methods')->where('active', true)->exists(),
            feature: 'shipping', position: 50, description: 'A zone with at least one method: flat rate, by weight, free or pickup.'));
        $checklist->register(new SetupStep('terms', 'Choose your terms page', 'commerce/settings/checkout',
            fn () => filled($settings()->get('checkout.terms_page')),
            feature: 'checkout', position: 60, description: 'Customers agree to it at checkout. Sample legal pages were added to Pages.'));
        $checklist->register(new SetupStep('test_order', 'Place a test order', '/',
            fn () => DB::table('commerce_orders')->where('channel', 'storefront')->exists(),
            feature: 'checkout', position: 70, description: 'Go through checkout once as a customer would.'));
    }
}
