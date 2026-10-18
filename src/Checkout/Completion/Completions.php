<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Checkout\Completion;

use InvalidArgumentException;

/** The checkout completion strategies by key. */
class Completions
{
    /** @var array<string, class-string<CheckoutCompletion>> */
    protected array $strategies = [
        'order' => OrderCompletion::class,
        'quote' => QuoteCompletion::class,
        'whatsapp' => WhatsAppCompletion::class,
    ];

    /** @param  class-string<CheckoutCompletion>  $class */
    public function register(string $class): void
    {
        if (! is_subclass_of($class, CheckoutCompletion::class)) {
            throw new InvalidArgumentException("{$class} must implement ".CheckoutCompletion::class.'.');
        }
        $this->strategies[$class::key()] = $class;
    }

    public function get(string $key): CheckoutCompletion
    {
        return app($this->strategies[$key] ?? $this->strategies['order']);
    }
}
