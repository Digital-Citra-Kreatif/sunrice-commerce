<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments\Methods;

use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Payments\Models\Payment;
use Sunrice\Commerce\Payments\PaymentStart;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Models\Asset;

/**
 * A title, an image (a static QRIS code, an e-wallet number) and
 * instructions. Stores can add several (instructions_xxxxx keys).
 */
class PaymentInstructions extends ManualMethod
{
    public static function key(): string
    {
        return 'instructions';
    }

    /** @return array<int, string> the keys of the stored instances */
    public static function instances(StoreSettings $settings): array
    {
        return array_values(array_filter((array) $settings->get('payments.instances.instructions', []), 'is_string'));
    }

    public function label(): string
    {
        return 'Payment instructions (QRIS, e-wallet…)';
    }

    public function settingsSchema(): array
    {
        return [
            ['handle' => 'image', 'type' => 'asset', 'label' => 'Image (e.g. QRIS code)', 'config' => ['image_only' => true]],
            ...self::instructionFields(),
        ];
    }

    public function imageUrl(): ?string
    {
        $image = $this->setting('image');
        $id = is_array($image) ? ($image[0] ?? null) : $image;

        return $id !== null && class_exists(Asset::class) ? Asset::query()->find($id)?->url() : null;
    }

    public function start(Order $order, Payment $payment): PaymentStart
    {
        return PaymentStart::instructions([...$this->snapshot($order, $payment), 'title' => $this->title($order->locale), 'image' => $this->imageUrl()]);
    }

    public function instructionsView(): ?string
    {
        return 'commerce::storefront.payments.instructions';
    }
}
