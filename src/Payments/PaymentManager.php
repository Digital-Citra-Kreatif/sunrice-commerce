<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments;

use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Payments\Contracts\PaymentMethod;
use Sunrice\Commerce\Settings\StoreSettings;

/**
 * The registered payment methods, configured from Settings → Payments,
 * in the store's order. Classes registered with
 * Commerce::registerPaymentMethod(); a class with `instances()` gives one
 * method per stored instance (several "payment instructions" methods).
 */
class PaymentManager
{
    /** @var array<string, PaymentMethod>|null */
    protected ?array $methods = null;

    public function __construct(protected PaymentRegistry $registry, protected StoreSettings $settings, protected Features $features) {}

    /**
     * Every configured method, in the store's order (active or not).
     *
     * @return array<string, PaymentMethod>
     */
    public function all(): array
    {
        if ($this->methods !== null) {
            return $this->methods;
        }
        $stored = (array) $this->settings->get('payments.methods', []);
        $methods = [];
        foreach ($this->registry->classes() as $key => $class) {
            if (is_subclass_of($class, PaymentMethodBase::class) && ($feature = $class::feature()) !== null && ! $this->features->active($feature)) {
                continue;
            }
            $method = app($class);
            $keys = method_exists($class, 'instances') ? (array) $class::instances($this->settings) : [$key];
            foreach ($keys as $instance) {
                $methods[$instance] = $method instanceof PaymentMethodBase ? $method->configure((array) ($stored[$instance] ?? []), $instance) : $method;
            }
        }
        $order = array_flip(array_values((array) $this->settings->get('payments.order', [])));
        uksort($methods, fn ($a, $b) => [$order[$a] ?? PHP_INT_MAX, $a] <=> [$order[$b] ?? PHP_INT_MAX, $b]);

        return $this->methods = $methods;
    }

    public function get(string $key): ?PaymentMethod
    {
        return $this->all()[$key] ?? null;
    }

    public static function idOf(PaymentMethod $method): string
    {
        return $method instanceof PaymentMethodBase ? $method->id() : $method::key();
    }

    public static function titleOf(PaymentMethod $method): string
    {
        return $method instanceof PaymentMethodBase ? $method->title() : $method->label();
    }

    public function isActive(PaymentMethod $method): bool
    {
        return ! $method instanceof PaymentMethodBase || $method->active();
    }

    /**
     * The methods a customer can choose for this context (none while the payments module is off).
     *
     * @return array<string, PaymentMethod>
     */
    public function available(PaymentContext $ctx): array
    {
        if (! $this->features->active('payments')) {
            return [];
        }

        return array_filter($this->all(), fn (PaymentMethod $m) => $this->isActive($m) && $m->isAvailable($ctx));
    }

    public function flush(): void
    {
        $this->methods = null;
    }
}
