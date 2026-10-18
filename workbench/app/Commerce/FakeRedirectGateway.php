<?php

declare(strict_types=1);

namespace Workbench\App\Commerce;

use Illuminate\Http\Request;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Payments\InvalidWebhook;
use Sunrice\Commerce\Payments\Methods\GatewayMethod;
use Sunrice\Commerce\Payments\Models\Payment;
use Sunrice\Commerce\Payments\PaymentResult;
use Sunrice\Commerce\Payments\WebhookEvent;

/**
 * A GatewayMethod for tests, as a gateway package would write one:
 * createPayment() counts its calls; webhooks carry {reference, paid}
 * (major units), unsigned; check() returns static::$status.
 */
class FakeRedirectGateway extends GatewayMethod
{
    public static int $created = 0;

    public static string $status = 'pending';

    public static function key(): string
    {
        return 'fake_redirect';
    }

    public function label(): string
    {
        return 'Fake redirect';
    }

    public function settingsSchema(): array
    {
        return $this->gatewayFields(['sandbox' => ['commerce.fake.sandbox_key' => 'FAKE_SANDBOX_KEY'], 'live' => ['commerce.fake.key' => 'FAKE_KEY']]);
    }

    protected function currencies(): array
    {
        return ['IDR'];
    }

    public function configured(): bool
    {
        return true;
    }

    protected function createPayment(Order $order, Payment $payment, string $reference): array
    {
        static::$created++;

        return ['url' => 'https://redirect.example/'.$reference, 'meta' => ['token' => 'tok-'.static::$created]];
    }

    public function parseWebhook(Request $request): WebhookEvent
    {
        $reference = (string) $request->input('reference');
        $payment = $this->paidResult($this->paymentFor($reference), (float) $request->input('paid'), $reference, null, $request->all())
            ?? throw new InvalidWebhook('Amount does not match the payment.');

        return new WebhookEvent('evt-'.$reference, $reference, $payment);
    }

    public function check(Payment $payment): PaymentResult
    {
        return new PaymentResult(static::$status, null, $payment->reference);
    }
}
