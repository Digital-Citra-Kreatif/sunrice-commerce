<?php

declare(strict_types=1);

namespace Workbench\App\Commerce;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Payments\Contracts\HandlesReturn;
use Sunrice\Commerce\Payments\Contracts\HandlesWebhooks;
use Sunrice\Commerce\Payments\Contracts\SupportsRefunds;
use Sunrice\Commerce\Payments\Contracts\SupportsStatusCheck;
use Sunrice\Commerce\Payments\InvalidWebhook;
use Sunrice\Commerce\Payments\Models\Payment;
use Sunrice\Commerce\Payments\PaymentMethodBase;
use Sunrice\Commerce\Payments\PaymentResult;
use Sunrice\Commerce\Payments\PaymentStart;
use Sunrice\Commerce\Payments\RefundResult;
use Sunrice\Commerce\Payments\WebhookEvent;

/**
 * A redirect gateway for tests: start() sends the customer to
 * pay.example; webhooks are signed with HMAC-SHA256 of the body
 * (X-Signature, secret from settings); returns carry ?status; refunds
 * succeed; the status check reads Cache "fake-gateway:{reference}".
 */
class FakeGateway extends PaymentMethodBase implements HandlesReturn, HandlesWebhooks, SupportsRefunds, SupportsStatusCheck
{
    public static function key(): string
    {
        return 'fake_gateway';
    }

    public function label(): string
    {
        return 'Fake gateway';
    }

    public function settingsSchema(): array
    {
        return [['handle' => 'secret', 'type' => 'text', 'label' => 'Webhook secret', 'translatable' => false]];
    }

    public function start(Order $order, Payment $payment): PaymentStart
    {
        $payment->forceFill(['reference' => 'FAKE-'.$payment->id])->save();

        return PaymentStart::redirect('https://pay.example/checkout/'.$payment->reference);
    }

    public function parseWebhook(Request $request): WebhookEvent
    {
        $secret = (string) $this->setting('secret', 'test-secret');
        if (! hash_equals(hash_hmac('sha256', (string) $request->getContent(), $secret), (string) $request->header('X-Signature'))) {
            throw new InvalidWebhook('Bad signature.');
        }
        $data = (array) $request->json()->all();

        return new WebhookEvent((string) $data['event_id'], (string) $data['reference'],
            new PaymentResult((string) $data['status'], isset($data['amount']) ? (int) $data['amount'] : null, (string) $data['reference'], null, $data));
    }

    public function handleReturn(Request $request, Payment $payment): PaymentResult
    {
        return new PaymentResult((string) $request->query('status', 'pending'), null, $payment->reference);
    }

    public function refund(Payment $payment, int $amount, string $reason): RefundResult
    {
        return new RefundResult(true, 'FAKE-REFUND-'.$payment->id);
    }

    public function check(Payment $payment): PaymentResult
    {
        return new PaymentResult((string) Cache::get('fake-gateway:'.$payment->reference, 'pending'), null, $payment->reference);
    }
}
