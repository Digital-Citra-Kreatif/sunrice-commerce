<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Marketing\Automations;

/** The triggers automations can start from (Commerce::registerMarketingTrigger() adds a package's). */
class Triggers
{
    /** @var array<string, Trigger> */
    protected array $triggers = [];

    public function __construct()
    {
        foreach ([new AbandonedCart, new Welcome, new FirstOrderNudge, new AfterOrder, new WinBack] as $trigger) {
            $this->register($trigger);
        }
    }

    public function register(Trigger $trigger): void
    {
        $this->triggers[$trigger->key()] = $trigger;
    }

    public function get(?string $key): ?Trigger
    {
        return $key === null ? null : ($this->triggers[$key] ?? null);
    }

    /** @return array<string, Trigger> */
    public function all(): array
    {
        return $this->triggers;
    }
}
