<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Health\Checks;

use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Health\HealthCheck;
use Sunrice\Commerce\Health\HealthResult;
use Sunrice\Commerce\Payments\PaymentManager;
use Sunrice\Commerce\Payments\PaymentMethodBase;
use Sunrice\Commerce\Settings\StoreSettings;

/**
 * What customers need to be able to order (SPEC.md, store health): a
 * payment method in the online store, a shipping zone for physical
 * products, and a WhatsApp number in WhatsApp mode.
 */
class StoreReadinessCheck implements HealthCheck
{
    public function key(): string
    {
        return 'store_readiness';
    }

    public function label(): string
    {
        return 'Ordering';
    }

    public function run(): HealthResult
    {
        $features = app(Features::class);
        $mode = $features->mode();
        if ($mode === 'shop' && $features->active('payments')) {
            $active = array_filter(app(PaymentManager::class)->all(), fn ($m) => ! $m instanceof PaymentMethodBase || $m->active());
            if ($active === []) {
                return HealthResult::error('The online store has no active payment method: customers can\'t place orders.', 'Switch one on in Settings → Store → Payments.');
            }
        }
        if ($mode === 'whatsapp' && (array) app(StoreSettings::class)->get('general.whatsapp.numbers', []) === []) {
            return HealthResult::error('WhatsApp order mode has no WhatsApp number.', 'Add one in Settings → Store → General → WhatsApp.');
        }
        if (in_array($mode, ['shop', 'whatsapp'], true) && $features->active('shipping')) {
            $physical = DB::table('commerce_variants')->join('commerce_products', 'commerce_products.id', '=', 'commerce_variants.product_id')
                ->whereNull('commerce_products.removed_at')->whereNull('commerce_variants.deleted_at')
                ->where(fn ($q) => $q->where('commerce_variants.requires_shipping', true)->orWhere(fn ($q) => $q->whereNull('commerce_variants.requires_shipping')->where('commerce_products.requires_shipping', true)))
                ->exists();
            $methods = DB::table('commerce_shipping_methods')->where('active', true)->exists();
            if ($physical && ! $methods) {
                return HealthResult::error('There are products to ship but no shipping zone with an active method: checkout can\'t offer shipping.', 'Add a zone in Settings → Store → Shipping.');
            }
        }

        return HealthResult::ok('Customers can order.');
    }
}
