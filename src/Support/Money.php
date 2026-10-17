<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Support;

use JsonSerializable;
use Stringable;

/**
 * An amount in the store currency's minor unit (whole rupiah for IDR).
 * Immutable; never a float. Percentages are basis points (1100 = 11.00%).
 */
final class Money implements JsonSerializable, Stringable
{
    public function __construct(public readonly int $amount) {}

    public static function of(int $amount): self
    {
        return new self($amount);
    }

    public static function zero(): self
    {
        return new self(0);
    }

    public function add(self|int $other): self
    {
        return new self($this->amount + ($other instanceof self ? $other->amount : $other));
    }

    public function subtract(self|int $other): self
    {
        return new self($this->amount - ($other instanceof self ? $other->amount : $other));
    }

    public function multiply(int $times): self
    {
        return new self($this->amount * $times);
    }

    /** This amount's share at a rate in basis points, rounded half up. */
    public function percent(int $basisPoints): self
    {
        return new self(self::percentOf($this->amount, $basisPoints));
    }

    /** `$amount × $basisPoints ÷ 10000`, rounded half up (away from zero for negatives). */
    public static function percentOf(int $amount, int $basisPoints): int
    {
        $product = $amount * $basisPoints;
        $rounded = intdiv(abs($product) + 5000, 10000);

        return $product < 0 ? -$rounded : $rounded;
    }

    public function isZero(): bool
    {
        return $this->amount === 0;
    }

    public function isNegative(): bool
    {
        return $this->amount < 0;
    }

    public function max(self|int $other): self
    {
        $other = $other instanceof self ? $other->amount : $other;

        return new self(max($this->amount, $other));
    }

    public function min(self|int $other): self
    {
        $other = $other instanceof self ? $other->amount : $other;

        return new self(min($this->amount, $other));
    }

    public function format(): string
    {
        return app(MoneyFormatter::class)->format($this->amount);
    }

    public function jsonSerialize(): int
    {
        return $this->amount;
    }

    public function __toString(): string
    {
        return $this->format();
    }
}
