<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Marketing\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Sunrice\Commerce\Marketing\Audience;
use Sunrice\Commerce\Marketing\Automations\Triggers;
use Sunrice\Commerce\Marketing\Dispatcher;
use Sunrice\Commerce\Marketing\Models\Campaign;
use Sunrice\Commerce\Marketing\Recipient;

/**
 * Each active automation asks its trigger who became due since it last
 * asked (at most a week back), keeps those its audience rules allow, and
 * queues their emails. Started by commerce:tick.
 */
class RunAutomations implements ShouldBeUnique, ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable;

    public int $uniqueFor = 600;

    public function handle(Triggers $triggers, Audience $audience, Dispatcher $dispatcher): void
    {
        $now = now();
        foreach (Campaign::query()->where('type', Campaign::AUTOMATION)->where('status', 'active')->get() as $automation) {
            $trigger = $triggers->get($automation->trigger);
            if ($trigger === null) {
                continue;
            }
            $from = $automation->last_run_at ?? $now;
            $from = $from->lt($now->copy()->subWeek()) ? $now->copy()->subWeek() : $from;
            $delay = (int) (($automation->trigger_config ?? [])['delay'] ?? $trigger->delay()['default']);
            $rules = Audience::clean($automation->audience)['rules'];

            $recipients = (function () use ($trigger, $delay, $from, $now, $rules, $automation, $audience) {
                $buffer = [];
                foreach ($trigger->recipients($delay, $from, $now) as $recipient) {
                    $buffer[] = $recipient;
                    if (count($buffer) >= 200) {
                        yield from $this->allowed($buffer, $rules, $automation, $audience);
                        $buffer = [];
                    }
                }
                yield from $this->allowed($buffer, $rules, $automation, $audience);
            })();
            $dispatcher->queue($automation, $recipients);
            $automation->forceFill(['last_run_at' => $now])->save();
        }
    }

    /**
     * The recipients the automation's own audience rules allow (none for guests when it has rules).
     *
     * @param  array<int, Recipient>  $recipients
     * @param  array<int, array<string, mixed>>  $rules
     * @return array<int, Recipient>
     */
    protected function allowed(array $recipients, array $rules, Campaign $automation, Audience $audience): array
    {
        if ($rules === [] || $recipients === []) {
            return $recipients;
        }
        $ids = array_values(array_filter(array_map(fn (Recipient $r) => $r->customer?->id, $recipients)));
        $ok = $ids === [] ? [] : array_flip($audience->query($automation->audience)->whereIn('commerce_customers.id', $ids)->pluck('commerce_customers.id')->all());

        return array_values(array_filter($recipients, fn (Recipient $r) => $r->customer !== null && isset($ok[$r->customer->id])));
    }
}
