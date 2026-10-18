<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Actions;

use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\OrderStateMachine;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Support\DomainException;

/** The customer (or staff) declines a quote request or a quote. */
class DeclineQuote
{
    public function __construct(protected OrderStateMachine $states) {}

    /** @throws DomainException */
    public function handle(Order $quote, Actor $actor, ?string $reason = null): Order
    {
        if (! $quote->isQuote() || ! in_array($quote->status, [OrderStatus::REQUESTED, OrderStatus::QUOTED], true)) {
            throw new DomainException(__('commerce::checkout.quote.not_open'));
        }

        return $this->states->transition($quote, OrderStatus::DECLINED, $actor, $reason);
    }
}
