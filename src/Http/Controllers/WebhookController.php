<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers;

use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Payments\Actions\RecordPaymentResult;
use Sunrice\Commerce\Payments\Contracts\HandlesWebhooks;
use Sunrice\Commerce\Payments\InvalidWebhook;
use Sunrice\Commerce\Payments\Models\Payment;
use Sunrice\Commerce\Payments\Models\WebhookCall;
use Sunrice\Commerce\Payments\PaymentManager;
use Throwable;

/**
 * POST commerce/webhooks/{method} (ARCHITECTURE.md §13.3): no session,
 * no CSRF. The call is logged, verified by the method, de-duplicated on
 * its event id, matched to a payment by reference and recorded through
 * RecordPaymentResult. A call that fails while recording releases its
 * event id, so the gateway's retry is processed.
 */
class WebhookController
{
    public function __invoke(Request $request, string $method, PaymentManager $payments, RecordPaymentResult $record): JsonResponse
    {
        $gateway = $payments->get($method);
        abort_unless($gateway instanceof HandlesWebhooks, 404);
        $call = WebhookCall::query()->create([
            'method' => $method, 'payload_hash' => hash('sha256', (string) $request->getContent()), 'status' => 'received', 'received_at' => now(),
        ]);

        try {
            $event = $gateway->parseWebhook($request);
        } catch (InvalidWebhook $e) {
            $call->forceFill(['status' => 'failed', 'error' => $e->getMessage()])->save();

            return response()->json(['ok' => false, 'error' => 'invalid'], 400);
        }

        $duplicate = WebhookCall::query()->where('method', $method)->where('event_id', $event->eventId)->exists();
        if (! $duplicate) {
            try {
                $call->forceFill(['event_id' => $event->eventId])->save();
            } catch (QueryException) {
                $duplicate = true; // the same event arrived twice at once
            }
        }
        if ($duplicate) {
            $call->forceFill(['status' => 'ignored', 'error' => 'duplicate event', 'processed_at' => now()])->save();

            return response()->json(['ok' => true, 'duplicate' => true]);
        }

        $payment = Payment::query()->where('method', $method)->where('reference', $event->reference)->latest('id')->first();
        if ($payment === null) {
            $call->forceFill(['status' => 'ignored', 'error' => 'unknown reference', 'processed_at' => now()])->save();

            return response()->json(['ok' => true, 'ignored' => true]);
        }

        try {
            $changed = $record->handle($payment, $event->result, Actor::gateway($method));
        } catch (Throwable $e) {
            report($e);
            // Give the event id back, so the gateway's retry is processed instead of ignored as a duplicate.
            $call->forceFill(['status' => 'failed', 'event_id' => null, 'payment_id' => $payment->id, 'error' => "event {$event->eventId}: {$e->getMessage()}"])->save();

            return response()->json(['ok' => false], 500);
        }
        $call->forceFill(['status' => $changed ? 'processed' : 'ignored', 'payment_id' => $payment->id, 'processed_at' => now()])->save();

        return response()->json(['ok' => true]);
    }
}
