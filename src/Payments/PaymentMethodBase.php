<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments;

use DateTimeInterface;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Payments\Contracts\PaymentMethod;
use Sunrice\Support\Locales;

/**
 * The settings every method shares (stored in payments.methods.{key}):
 * active, title and description per language, availability (min/max
 * total, countries or provinces, shipping method types, customer roles),
 * a fee (fixed and/or percent) and the payment deadline in hours.
 */
abstract class PaymentMethodBase implements PaymentMethod
{
    /** @var array<string, mixed> */
    protected array $settings = [];

    protected ?string $instanceKey = null;

    /** @param  array<string, mixed>  $settings */
    public function configure(array $settings, ?string $key = null): static
    {
        $clone = clone $this;
        $clone->settings = $settings;
        $clone->instanceKey = $key;

        return $clone;
    }

    /** This instance's key (an instance class may have several). */
    public function id(): string
    {
        return $this->instanceKey ?? static::key();
    }

    public function setting(string $key, mixed $default = null): mixed
    {
        $value = data_get($this->settings, $key);

        return $value === null || $value === '' ? $default : $value;
    }

    public function active(): bool
    {
        return (bool) $this->setting('active', false);
    }

    /** The customer-facing title. */
    public function title(?string $locale = null): string
    {
        return $this->localized('title', $locale) ?? $this->label();
    }

    public function description(?string $locale = null): ?string
    {
        return $this->localized('description', $locale);
    }

    protected function localized(string $key, ?string $locale): ?string
    {
        $values = array_filter((array) $this->setting($key, []), fn ($v) => is_string($v) && trim($v) !== '');
        $locale ??= app()->getLocale();

        return $values[$locale] ?? $values[Locales::main()] ?? (reset($values) ?: null);
    }

    public function settingsRules(): array
    {
        return [];
    }

    /** The shared availability checks; override and call parent for more. */
    public function isAvailable(PaymentContext $ctx): bool
    {
        $min = $this->setting('min_total');
        $max = $this->setting('max_total');
        if (($min !== null && $ctx->amount < (int) $min) || ($max !== null && (int) $max > 0 && $ctx->amount > (int) $max)) {
            return false;
        }
        $countries = array_filter((array) $this->setting('countries', []));
        $country = strtoupper((string) ($ctx->destination['country'] ?? ''));
        if ($countries !== [] && $country !== '' && ! in_array($country, $countries, true)) {
            return false;
        }
        $provinces = array_filter((array) $this->setting('provinces', []));
        if ($provinces !== [] && ! in_array((string) ($ctx->destination['province_code'] ?? ''), $provinces, true)) {
            return false;
        }
        $shipping = array_filter((array) $this->setting('shipping_methods', []));
        if ($shipping !== [] && ($ctx->shippingMethod === null || ! in_array($ctx->shippingMethod, $shipping, true))) {
            return false;
        }
        $roles = array_filter((array) $this->setting('roles', []));

        return $roles === [] || array_intersect($roles, $ctx->roles) !== [];
    }

    public function fee(PaymentContext $ctx): ?Fee
    {
        $amount = (int) $this->setting('fee_fixed', 0) + (int) round($ctx->amount * (float) $this->setting('fee_percent', 0) / 100);

        return $amount > 0 ? new Fee($amount, __('commerce::checkout.payment_fee', ['method' => $this->title()])) : null;
    }

    public function deadline(Order $order): ?DateTimeInterface
    {
        $hours = (int) $this->setting('deadline_hours', 24);

        return $hours > 0 ? now()->addHours($hours) : null;
    }

    public function instructionsView(): ?string
    {
        return null;
    }

    /**
     * The shared settings fields (rendered before the method's own).
     *
     * @return array<int, array<string, mixed>>
     */
    public static function commonSchema(): array
    {
        $perLanguage = function (string $handle, string $label, string $type) {
            $fields = [];
            foreach (Locales::available() as $locale) {
                $fields[] = ['handle' => $locale, 'type' => $type, 'label' => Locales::name($locale), 'translatable' => false, 'config' => ['max' => $type === 'text' ? 120 : 2000]];
            }

            return ['handle' => $handle, 'type' => 'group', 'label' => $label, 'config' => ['fields' => $fields]];
        };

        return [
            ['handle' => 'active', 'type' => 'toggle', 'label' => 'Active'],
            $perLanguage('title', 'Title', 'text'),
            $perLanguage('description', 'Description at checkout', 'textarea'),
            ['handle' => 'min_total', 'type' => 'commerce_money', 'label' => 'Only from an order total of'],
            ['handle' => 'max_total', 'type' => 'commerce_money', 'label' => 'Only up to an order total of'],
            ['handle' => 'countries', 'type' => 'text', 'label' => 'Only for countries', 'translatable' => false, 'instructions' => 'ISO codes, comma separated (ID, SG). Empty: everywhere.'],
            ['handle' => 'provinces', 'type' => 'text', 'label' => 'Only for provinces', 'translatable' => false, 'instructions' => 'Province codes, comma separated (31, 32). Empty: everywhere.'],
            ['handle' => 'shipping_methods', 'type' => 'text', 'label' => 'Only with shipping method types', 'translatable' => false, 'instructions' => 'Comma separated (flat, weight, pickup). Empty: any.'],
            ['handle' => 'roles', 'type' => 'text', 'label' => 'Only for customer roles', 'translatable' => false, 'instructions' => 'Role names, comma separated. Empty: everyone.'],
            ['handle' => 'fee_fixed', 'type' => 'commerce_money', 'label' => 'Fee (fixed)'],
            ['handle' => 'fee_percent', 'type' => 'number', 'label' => 'Fee (%)', 'config' => ['min' => 0, 'max' => 100]],
            ['handle' => 'deadline_hours', 'type' => 'number', 'label' => 'Payment deadline (hours)', 'instructions' => 'Unpaid orders are cancelled after this. 0: never.', 'config' => ['min' => 0, 'max' => 8760], 'validation' => ['integer']],
        ];
    }
}
