<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Pricing\Stages;

use Sunrice\Cms\Models\EntryTranslation;
use Sunrice\Cms\Support\Locales;
use Sunrice\Commerce\Catalog\Catalog;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Pricing\Contracts\CalculationStage;

/**
 * Drops lines that can't be bought (unpublished, out of stock, hidden
 * prices…) with a notice, and sets each line's flags. Staff channels
 * (admin, manual orders) skip the purchasability check but keep removed
 * variants out.
 */
class ResolveLines implements CalculationStage
{
    public function __construct(protected Catalog $catalog) {}

    public function run(CalculationState $state): void
    {
        $check = [];
        $seenDigital = [];
        $staff = in_array($state->ctx->channel, ['admin', 'quote'], true);
        foreach ($state->lines as $key => $line) {
            if ($line->quantity <= 0) {
                unset($state->lines[$key]);

                continue;
            }
            $variant = $line->variant;
            if (! $staff && $variant->limitsToOneDigitalUnit()) {
                $duplicate = isset($seenDigital[$variant->id]);
                if ($duplicate || $line->quantity > 1) {
                    $state->notice('digital_quantity_limit', __('commerce::storefront.availability.digital_quantity_limit', ['product' => $this->title($variant)]), $key);
                }
                if ($duplicate) {
                    unset($state->lines[$key]);

                    continue;
                }

                $seenDigital[$variant->id] = true;
                $line->quantity = 1;
            }
            $check[$key] = [$variant, $line->quantity];
        }
        $results = $staff ? [] : $this->catalog->checkMany($check, $state->ctx->customer);

        foreach ($state->lines as $key => $line) {
            $availability = $results[$key] ?? null;
            if ($staff && ($line->variant->trashed() || $line->product()->removed_at !== null)) {
                $state->notice('not_published', __('commerce::storefront.availability.not_published'), $key);
                unset($state->lines[$key]);

                continue;
            }
            if ($availability !== null && ! $availability->isOk()) {
                $title = $this->title($line->variant);
                // Too few left (stock, or the flash sale's per-customer limit): keep what can be bought.
                if (in_array($availability->reason, ['out_of_stock', 'flash_sale_limit'], true) && ($availability->details['available'] ?? 0) >= $line->variant->minOrderQuantity()) {
                    $line->quantity = (int) $availability->details['available'];
                    $state->notice($availability->reason === 'flash_sale_limit' ? 'flash_sale_limit' : 'quantity_reduced', $availability->message($title), $key);
                } else {
                    $state->notice($availability->reason ?? 'unavailable', $availability->message($title), $key);
                    unset($state->lines[$key]);

                    continue;
                }
            }
            $product = $line->product();
            $line->requiresShipping = $line->variant->requiresShipping();
            $line->downloadable = $line->variant->isDownloadable();
            $line->taxClass = $product->tax_class;
        }
    }

    protected function title(Variant $variant): string
    {
        $entry = EntryTranslation::query()->where('entry_id', $variant->product->entry_id)
            ->whereIn('locale', [app()->getLocale(), Locales::default()])->pluck('title', 'locale');
        $title = (string) ($entry[app()->getLocale()] ?? $entry->first() ?? '');

        return $variant->title !== '' ? "{$title} ({$variant->title})" : $title;
    }
}
