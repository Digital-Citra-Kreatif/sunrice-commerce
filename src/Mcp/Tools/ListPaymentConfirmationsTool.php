<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;
use Sunrice\Commerce\Mcp\CommerceTool;
use Sunrice\Commerce\Mcp\OrderData;
use Sunrice\Commerce\Payments\Models\PaymentConfirmation;

#[IsReadOnly]
#[Description('Payment confirmations customers sent for bank transfers (status submitted = waiting for review): the order, the amount sent against the amount expected, sender, bank, date and whether a proof was uploaded. The proof image itself is only in the admin (Shop → Payments to verify); check the bank account before approving with review_payment_confirmation.')]
class ListPaymentConfirmationsTool extends CommerceTool
{
    protected string $name = 'list_payment_confirmations';

    protected ?string $feature = 'manual_payments';

    protected ?string $permission = 'commerce.payments.verify';

    protected function run(Request $request): Response
    {
        $args = $request->validate(['status' => ['nullable', 'in:submitted,approved,rejected'], 'limit' => ['nullable', 'integer', 'min:1', 'max:100']]);
        $rows = PaymentConfirmation::query()->with(['order', 'payment'])->where('status', $args['status'] ?? 'submitted')
            ->latest('id')->limit((int) ($args['limit'] ?? 25))->get();

        return $this->json(['confirmations' => $rows->map(fn (PaymentConfirmation $c) => [
            'id' => $c->id, 'status' => $c->status, 'order' => $c->order->displayNumber(), 'order_id' => $c->order_id,
            'amount_sent' => OrderData::money($c->amount), 'amount_expected' => $c->payment !== null ? OrderData::money($c->payment->amount) : null,
            'sender' => $c->sender_name, 'bank' => $c->sender_bank, 'to_account' => $c->destination['label'] ?? $c->destination['account_number'] ?? null,
            'transferred_at' => $c->transferred_at?->toIso8601String(), 'has_proof' => $c->proof_path !== null, 'note' => $c->note,
            'submitted_at' => $c->created_at?->toIso8601String(),
        ])->all()]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'status' => $schema->string()->enum(['submitted', 'approved', 'rejected'])->description('Default: submitted (waiting).'),
            'limit' => $schema->integer(),
        ];
    }
}
