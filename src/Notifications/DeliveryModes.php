<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Notifications;

use Sunrice\Commerce\Digital\Models\DownloadGrant;
use Sunrice\Commerce\Settings\StoreSettings;

/** How a grant's file reaches the customer: the product's delivery modes, or the store's. */
final class DeliveryModes
{
    /** @return array<int, string> attachment | link | account */
    public static function for(DownloadGrant $grant): array
    {
        $product = $grant->item->product;
        $modes = (array) (($product->delivery ?? [])['modes'] ?? []);

        return $modes !== [] ? $modes : (array) app(StoreSettings::class)->get('digital.delivery', ['link', 'account']);
    }
}
