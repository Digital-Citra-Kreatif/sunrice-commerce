<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments;

final class RefundResult
{
    /** @param  array<string, mixed>  $raw */
    public function __construct(public readonly bool $ok, public readonly ?string $reference = null, public readonly ?string $error = null, public readonly array $raw = []) {}
}
