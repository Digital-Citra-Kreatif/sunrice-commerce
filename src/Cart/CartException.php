<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Cart;

use RuntimeException;

/** A cart change the customer can't make; the message is for them. */
class CartException extends RuntimeException
{
    public function __construct(string $message, public readonly string $reason = 'invalid')
    {
        parent::__construct($message);
    }
}
