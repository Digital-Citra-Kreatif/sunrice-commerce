<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders;

use RuntimeException;

/** A status change the order can't make (the message says why). */
class InvalidTransition extends RuntimeException
{
    public function __construct(public readonly string $from, public readonly string $to, string $message)
    {
        parent::__construct($message);
    }
}
