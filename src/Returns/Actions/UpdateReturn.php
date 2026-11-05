<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Returns\Actions;

use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Notifications\Notifier;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Timeline;
use Sunrice\Commerce\Returns\Models\ReturnRequest;

/** Staff move a return on (approve, reject, received, closed), with a note emailed to the customer. */
class UpdateReturn
{
    public function __construct(protected Timeline $timeline, protected Notifier $notifier) {}

    /** @throws ValidationException */
    public function handle(ReturnRequest $return, string $status, ?string $note, Actor $actor): void
    {
        $note = trim((string) $note) === '' ? null : trim((string) $note);
        // Checked against the row as it is now, locked: two staff saving at once can't both move it from the same status.
        $changed = DB::transaction(function () use ($return, $status, $note): bool {
            /** @var ReturnRequest $locked */
            $locked = ReturnRequest::query()->whereKey($return->id)->lockForUpdate()->firstOrFail();
            if (! in_array($status, $locked->allowedStatuses(), true)) {
                throw ValidationException::withMessages(['values.status' => 'A '.$locked->status.' return can\'t be moved to '.$status.'.']);
            }
            $changed = $status !== $locked->status;
            $locked->update(['status' => $status, 'note' => $note, 'resolved_at' => in_array($status, ['rejected', 'closed'], true) ? ($locked->resolved_at ?? now()) : null]);
            $return->setRawAttributes($locked->getAttributes(), true);

            return $changed;
        });
        if (! $changed) {
            return;
        }
        $label = __("commerce::account.returns.statuses.{$status}");
        $this->timeline->record($return->order, 'return', "Return {$return->number()}: {$label}".($note !== null ? " ({$note})" : ''), ['return' => $return->id, 'status' => $status], $actor, 'customer');
        $this->notifier->send('return_updated', $return->order, ['return' => $return->number(), 'status' => $status, 'note' => $note]);
    }
}
