<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog;

/**
 * What a product's button does (ARCHITECTURE.md §7.3): a pure function of
 * the selling mode, the product's purchase mode, whether the cart module
 * is active and the store's catalog call-to-action.
 *
 * Results: cart | inquiry | whatsapp | external | none.
 */
final class PurchaseModes
{
    public const CART_MODES = ['shop', 'quote', 'whatsapp'];

    /** @param  array<int, mixed>  $externalLinks */
    public static function resolve(string $sellingMode, string $productMode, bool $cartActive, string $catalogCta, array $externalLinks = []): string
    {
        $hasCart = $cartActive && in_array($sellingMode, self::CART_MODES, true);
        $fallback = self::callToAction($catalogCta, $externalLinks);

        return match ($productMode) {
            'default', 'cart' => $hasCart ? 'cart' : $fallback,
            'external' => $externalLinks !== [] ? 'external' : $fallback,
            'inquiry', 'whatsapp', 'none' => $productMode,
            default => $fallback,
        };
    }

    /** The store's catalog call-to-action; "external" needs the product's own links. */
    protected static function callToAction(string $cta, array $externalLinks): string
    {
        return match ($cta) {
            'external', 'link' => $externalLinks !== [] ? 'external' : 'none',
            'inquiry', 'whatsapp', 'none' => $cta,
            default => 'inquiry',
        };
    }
}
