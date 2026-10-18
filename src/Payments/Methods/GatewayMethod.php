<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments\Methods;

use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Payments\Contracts\HandlesReturn;
use Sunrice\Commerce\Payments\Contracts\HandlesWebhooks;
use Sunrice\Commerce\Payments\Contracts\SupportsStatusCheck;
use Sunrice\Commerce\Payments\Models\Payment;
use Sunrice\Commerce\Payments\PaymentContext;
use Sunrice\Commerce\Payments\PaymentMethodBase;
use Sunrice\Commerce\Payments\PaymentResult;
use Sunrice\Commerce\Payments\PaymentStart;
use Sunrice\Commerce\Support\MoneyFormatter;
use Sunrice\Support\Locales;
use Throwable;

/**
 * The base of a redirect gateway package (sunrice/commerce-midtrans,
 * sunrice/commerce-xendit): the sandbox switch, per-language instructions,
 * a payment page created once per payment, the return and status check,
 * and the paid amount checked against the payment. Keys come from config
 * (.env), never from settings. A package implements currencies(),
 * configured(), createPayment(), check() and the webhook (HandlesWebhooks).
 */
abstract class GatewayMethod extends PaymentMethodBase implements HandlesReturn, HandlesWebhooks, SupportsStatusCheck
{
    /** @return array<int, string> the currencies the gateway takes */
    abstract protected function currencies(): array;

    /** Keys for the current mode are set and the SDK is installed. */
    abstract public function configured(): bool;

    /**
     * Creates the gateway's payment page.
     *
     * @return array{url: string, meta?: array<string, mixed>}
     */
    abstract protected function createPayment(Order $order, Payment $payment, string $reference): array;

    /** Test mode (on until switched off). */
    public function sandbox(): bool
    {
        return (bool) $this->setting('sandbox', true);
    }

    public function isAvailable(PaymentContext $ctx): bool
    {
        return $this->configured() && in_array($this->currency(), $this->currencies(), true) && parent::isAvailable($ctx);
    }

    /** Sends the customer to the gateway; a payment that already has a page keeps it. */
    public function start(Order $order, Payment $payment): PaymentStart
    {
        $url = DB::transaction(function () use ($order, $payment): string {
            /** @var Payment $locked */
            $locked = Payment::query()->whereKey($payment->id)->lockForUpdate()->firstOrFail();
            $existing = $locked->instructions['url'] ?? null;
            if (is_string($existing) && $existing !== '' && $locked->reference !== null) {
                return $existing;
            }
            $reference = Str::limit((string) preg_replace('/[^A-Za-z0-9]/', '', $order->displayNumber()), 30, '').'-'.$payment->id.'-'.Str::lower(Str::random(4));
            $created = $this->createPayment($order, $locked, $reference);
            $locked->forceFill([
                'reference' => $reference,
                'instructions' => ['amount' => $locked->amount, 'instructions' => $this->instructionsText($order->locale), 'url' => $created['url'],
                    'deadline' => $locked->expires_at?->toIso8601String()],
                'meta' => [...(array) $locked->meta, ...($created['meta'] ?? []), 'sandbox' => $this->sandbox()],
            ])->save();

            return $created['url'];
        });
        $payment->refresh();

        return PaymentStart::redirect($url);
    }

    /** The customer is back: ask the gateway rather than trust the query string. */
    public function handleReturn(Request $request, Payment $payment): PaymentResult
    {
        return $payment->reference === null ? PaymentResult::pending() : $this->check($payment);
    }

    public function instructionsText(?string $locale = null): ?string
    {
        return $this->localized('instructions', $locale);
    }

    public function instructionsView(): ?string
    {
        return 'commerce::storefront.payments.gateway';
    }

    /** The store's currency. */
    protected function currency(): string
    {
        return strtoupper(app(MoneyFormatter::class)->settings()['code']);
    }

    /** An amount in minor units as the gateway takes it (major units). */
    protected function toGateway(int $amount): float|int
    {
        $decimals = app(MoneyFormatter::class)->settings()['decimals'];

        return $decimals === 0 ? $amount : $amount / 10 ** $decimals;
    }

    /** A gateway amount (major units) in minor units. */
    protected function fromGateway(float $amount): int
    {
        return (int) round($amount * 10 ** app(MoneyFormatter::class)->settings()['decimals']);
    }

    /** The payment with this reference. */
    protected function paymentFor(string $reference): ?Payment
    {
        return $reference === '' ? null : Payment::query()->where('method', $this->id())->where('reference', $reference)->latest('id')->first();
    }

    /**
     * A paid result for the payment's amount, or null when the gateway's
     * amount is not what the payment asked for.
     *
     * @param  array<string, mixed>  $raw
     */
    protected function paidResult(?Payment $payment, float $paid, string $reference, ?CarbonInterface $at, array $raw): ?PaymentResult
    {
        if ($payment === null) {
            return PaymentResult::paid(null, $reference, $at, $raw);
        }
        if (abs((float) $this->toGateway($payment->amount) - $paid) >= 0.01) {
            return null;
        }

        return PaymentResult::paid($payment->amount, $reference, $at, $raw);
    }

    /** A gateway's time (in its zone when it has none) in the app's timezone, as it is stored. */
    protected function time(mixed $value, string $timezone = 'UTC'): ?CarbonInterface
    {
        if (! is_string($value) || $value === '') {
            return null;
        }
        try {
            return Carbon::parse($value, $timezone)->setTimezone((string) config('app.timezone', 'UTC'));
        } catch (Throwable) {
            return null;
        }
    }

    /**
     * The sandbox switch (saying which keys are set, never their values) and
     * the instructions.
     *
     * @param  array{sandbox: array<string, string>, live: array<string, string>}  $keys  config key => .env name, per mode
     * @return array<int, array<string, mixed>>
     */
    protected function gatewayFields(array $keys): array
    {
        $status = fn (array $names) => implode(', ', array_map(fn (string $config, string $env) => $env.' ('.(filled(config($config)) ? 'set' : 'missing').')', array_keys($names), $names));
        $fields = [];
        foreach (Locales::available() as $locale) {
            $fields[] = ['handle' => $locale, 'type' => 'textarea', 'label' => Locales::name($locale), 'translatable' => false, 'config' => ['max' => 3000]];
        }

        return [
            ['handle' => 'sandbox', 'type' => 'toggle', 'label' => 'Sandbox (test mode)', 'instructions' => 'On: uses '.$status($keys['sandbox']).'. Off: uses '.$status($keys['live']).'. Payment notification URL: '.route('commerce.webhooks', ['method' => static::key()])],
            ['handle' => 'instructions', 'type' => 'group', 'label' => 'Instructions on the order page and in the email', 'config' => ['fields' => $fields]],
        ];
    }
}
