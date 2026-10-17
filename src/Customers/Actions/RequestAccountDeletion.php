<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Customers\Actions;

use Sunrice\Commerce\Customers\Events\AccountDeletionRequested;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Support\ActivityRecorder;

/** The customer asks for their account to be deleted; staff anonymize it (Shop → Customers). */
class RequestAccountDeletion
{
    public function handle(Customer $customer): void
    {
        if ($customer->deletion_requested_at !== null) {
            return;
        }
        $customer->forceFill(['deletion_requested_at' => now()])->save();
        app(ActivityRecorder::class)->record('requested deletion', "Customer: {$customer->email}", [], 'customer');
        event(new AccountDeletionRequested($customer));
    }
}
