<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Sunrice\Commerce\Mcp\CommerceTool;
use Sunrice\Commerce\Mcp\OrderData;
use Sunrice\Commerce\Payments\Actions\ReviewPaymentConfirmation;
use Sunrice\Commerce\Payments\Models\PaymentConfirmation;

#[Description('Approve (the money arrived: the order becomes paid) or reject (with a reason the customer sees) a payment confirmation from list_payment_confirmations. Approving less than expected needs anyway: true. Needs confirm: true — ask the user, who should check the bank account first.')]
class ReviewPaymentConfirmationTool extends CommerceTool
{
    protected string $name = 'review_payment_confirmation';

    protected ?string $feature = 'manual_payments';

    protected ?string $permission = 'commerce.payments.verify';

    protected function run(Request $request): Response
    {
        $args = $request->validate([
            'id' => ['required', 'integer'], 'decision' => ['required', 'in:approve,reject'],
            'reason' => ['required_if:decision,reject', 'nullable', 'string', 'max:500'], 'anyway' => ['boolean'], 'confirm' => ['boolean'],
        ]);
        $confirmation = PaymentConfirmation::query()->with('order')->find($args['id']);
        if ($confirmation === null) {
            return $this->notFound('Payment confirmation');
        }
        $number = $confirmation->order->displayNumber();
        if (($refused = $this->unconfirmed($request, ($args['decision'] === 'approve' ? 'approve' : 'reject')." the payment for order {$number}")) !== null) {
            return $refused;
        }
        $review = app(ReviewPaymentConfirmation::class);
        $args['decision'] === 'approve'
            ? $review->approve($confirmation, $this->actor(), (bool) ($args['anyway'] ?? false))
            : $review->reject($confirmation, (string) $args['reason'], $this->actor());

        return $this->json(['status' => $confirmation->refresh()->status, 'order' => OrderData::summary($confirmation->order->refresh())]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'id' => $schema->integer()->description('The confirmation id.')->required(),
            'decision' => $schema->string()->enum(['approve', 'reject'])->required(),
            'reason' => $schema->string()->description('Why it is rejected (sent to the customer).'),
            'anyway' => $schema->boolean()->description('Approve although less than expected arrived.'),
            'confirm' => $schema->boolean()->description('true once the user agreed.'),
        ];
    }
}
