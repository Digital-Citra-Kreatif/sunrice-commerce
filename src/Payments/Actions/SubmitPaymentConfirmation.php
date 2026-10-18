<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments\Actions;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Payments\Events\PaymentConfirmationSubmitted;
use Sunrice\Commerce\Payments\Models\PaymentConfirmation;
use Sunrice\Commerce\Payments\PaymentResult;
use Sunrice\Commerce\Payments\ProofFiles;

/**
 * "I have paid" (ARCHITECTURE.md §13.5): the transfer details and an
 * optional proof (image or PDF up to commerce.payments.proof_max_kb). The
 * payment becomes Awaiting confirmation, which pauses its deadline, and
 * staff are told.
 */
class SubmitPaymentConfirmation
{
    public function __construct(protected RecordPaymentResult $record, protected ProofFiles $proofs) {}

    /**
     * @param  array<string, mixed>  $input
     *
     * @throws ValidationException
     */
    public function handle(Order $order, array $input, ?UploadedFile $proof, ?string $ip = null): PaymentConfirmation
    {
        $payment = $order->payments()->where('status', 'pending')->latest('id')->first();
        $mode = (string) ($payment->instructions['confirmation'] ?? 'off');
        if ($payment === null || $mode === 'off' || ! $order->isUnpaid()) {
            throw ValidationException::withMessages(['order' => __('commerce::payments.confirm.not_open')]);
        }
        $accounts = (array) ($payment->instructions['accounts'] ?? []);
        $data = Validator::make([...$input, 'proof' => $proof], [
            'sender_name' => ['required', 'string', 'max:120'],
            'sender_bank' => ['nullable', 'string', 'max:80'],
            'amount' => ['required', 'integer', 'min:1'],
            'transferred_at' => ['required', 'date', 'before_or_equal:today'],
            'account' => $accounts === [] ? ['nullable'] : ['required', 'integer', 'min:0', 'max:'.(count($accounts) - 1)],
            'proof' => [$mode === 'required' ? 'required' : 'nullable', 'file', 'mimes:jpg,jpeg,png,webp,pdf', 'max:'.(int) config('commerce.payments.proof_max_kb', 5120)],
            'note' => ['nullable', 'string', 'max:500'],
        ], [], ['sender_name' => __('commerce::payments.confirm.sender_name'), 'amount' => __('commerce::payments.confirm.amount'), 'proof' => __('commerce::payments.confirm.proof')])->validate();

        $stored = $proof !== null ? $this->proofs->store($proof, $order->id) : null;
        $confirmation = DB::transaction(function () use ($order, $payment, $data, $stored, $accounts, $ip): PaymentConfirmation {
            $confirmation = PaymentConfirmation::query()->create([
                'order_id' => $order->id, 'payment_id' => $payment->id, 'customer_id' => $order->customer_id,
                'sender_name' => $data['sender_name'], 'sender_bank' => $data['sender_bank'] ?? null, 'amount' => (int) $data['amount'],
                'transferred_at' => $data['transferred_at'], 'destination' => isset($data['account']) ? ($accounts[(int) $data['account']] ?? null) : null,
                'proof_disk' => $stored['disk'] ?? null, 'proof_path' => $stored['path'] ?? null, 'note' => $data['note'] ?? null,
                'status' => 'submitted', 'ip_address' => $ip,
            ]);
            $payment->forceFill(['meta' => [...(array) $payment->meta, 'awaiting_since' => now()->toIso8601String()]])->save();
            $this->record->handle($payment, PaymentResult::awaitingConfirmation('confirmation:'.$confirmation->id), Actor::customer());

            return $confirmation;
        });
        DB::afterCommit(fn () => PaymentConfirmationSubmitted::dispatch($confirmation));

        return $confirmation;
    }
}
