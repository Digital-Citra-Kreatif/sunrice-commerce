<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Marketing;

use Sunrice\Commerce\Customers\Models\Customer;

/** Someone a marketing email goes to, with what the email is about (a cart, an order). */
final class Recipient
{
    /** @param  array<string, mixed>  $context */
    public function __construct(
        public readonly ?Customer $customer,
        public readonly string $email,
        public readonly string $locale,
        public readonly string $dedupeKey = '',
        public readonly array $context = [],
    ) {}
}
