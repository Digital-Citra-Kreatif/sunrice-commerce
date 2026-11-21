<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Loyalty;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Sunrice\Commerce\Catalog\Models\Variant;

/**
 * Who a gift card in the cart is for: the product form's optional
 * gift_card[name], gift_card[email] and gift_card[message] become the cart
 * line's meta `gift_card` {name, email, message}. A line with a recipient
 * is a line of its own (cards for two people are two lines); without one
 * the code goes to the buyer only.
 */
final class GiftCardRecipient
{
    public const MESSAGE_MAX = 300;

    /**
     * The line meta for an add-to-cart request: [] unless the variant is a gift card and an email was given.
     *
     * @return array<string, mixed>
     */
    public static function meta(Request $request, int $variantId): array
    {
        $input = $request->input('gift_card');
        if (! is_array($input) || ! commerce_feature('loyalty') || trim((string) ($input['email'] ?? '')) === '') {
            return [];
        }
        $variant = Variant::query()->with('product')->find($variantId);
        if ($variant === null || ! $variant->product->gift_card) {
            return [];
        }
        // Errors are keyed gift_card.email…, as the product form names its fields.
        $data = (array) Validator::make(['gift_card' => $input], [
            'gift_card.name' => ['nullable', 'string', 'max:120'],
            'gift_card.email' => ['required', 'string', 'email', 'max:190'],
            'gift_card.message' => ['nullable', 'string', 'max:'.self::MESSAGE_MAX],
        ], [], [
            'gift_card.name' => __('commerce::storefront.gift_card.name'), 'gift_card.email' => __('commerce::storefront.gift_card.email'), 'gift_card.message' => __('commerce::storefront.gift_card.message'),
        ])->validate()['gift_card'];

        return ['gift_card' => array_filter([
            'name' => trim((string) ($data['name'] ?? '')),
            'email' => mb_strtolower(trim((string) $data['email'])),
            'message' => trim((string) ($data['message'] ?? '')),
        ], fn (string $v): bool => $v !== '')];
    }

    /**
     * The lines a gift card line shows in the cart, at checkout, on the order and in emails.
     *
     * @param  array<string, mixed>  $meta
     * @return list<string>
     */
    public static function describe(array $meta): array
    {
        $card = $meta['gift_card'] ?? null;
        if (! is_array($card) || ! is_string($card['email'] ?? null)) {
            return [];
        }
        $lines = [__('commerce::storefront.gift_card.for', ['who' => isset($card['name']) && is_string($card['name']) ? "{$card['name']} ({$card['email']})" : $card['email']])];
        if (is_string($card['message'] ?? null) && $card['message'] !== '') {
            $lines[] = '“'.$card['message'].'”';
        }

        return $lines;
    }
}
