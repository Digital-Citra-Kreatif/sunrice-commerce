<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Returns\Actions;

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
        if (! in_array($status, $return->allowedStatuses(), true)) {
            throw ValidationException::withMessages(['values.status' => 'A '.$return->status.' return can\'t be moved to '.$status.'.']);
        }
        $note = trim((string) $note) === '' ? null : trim((string) $note);
        $changed = $status !== $return->status;
        $return->update(['status' => $status, 'note' => $note, 'resolved_at' => in_array($status, ['rejected', 'closed'], true) ? ($return->resolved_at ?? now()) : null]);
        if (! $changed) {
            return;
        }
        $label = __("commerce::account.returns.statuses.{$status}");
        $this->timeline->record($return->order, 'return', "Return {$return->number()}: {$label}".($note !== null ? " ({$note})" : ''), ['return' => $return->id, 'status' => $status], $actor, 'customer');
        $this->notifier->send('return_updated', $return->order, ['return' => $return->number(), 'status' => $label, 'note' => $note]);
    }
}
