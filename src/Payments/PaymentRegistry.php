<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments;

use InvalidArgumentException;
use Sunrice\Commerce\Payments\Contracts\PaymentMethod;

/** The payment method classes registered with Commerce::registerPaymentMethod(). */
class PaymentRegistry
{
    /** @var array<string, class-string<PaymentMethod>> */
    protected array $classes = [];

    /** @param  class-string<PaymentMethod>  $class */
    public function register(string $class): void
    {
        if (! is_subclass_of($class, PaymentMethod::class)) {
            throw new InvalidArgumentException("{$class} must implement ".PaymentMethod::class.'.');
        }
        $this->classes[$class::key()] = $class;
    }

    /** @return array<string, class-string<PaymentMethod>> */
    public function classes(): array
    {
        return $this->classes;
    }
}
