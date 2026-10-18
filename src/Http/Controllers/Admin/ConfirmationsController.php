<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Payments\Actions\ReviewPaymentConfirmation;
use Sunrice\Commerce\Payments\Models\PaymentConfirmation;
use Sunrice\Commerce\Support\DomainException;
use Sunrice\Commerce\Support\MoneyFormatter;
use Symfony\Component\HttpFoundation\StreamedResponse;

/** Shop → Payments to verify: confirmations waiting for review, the proof beside the expected amount. */
class ConfirmationsController extends Controller
{
    public function index(Request $request, MoneyFormatter $money): Response
    {
        $this->guard();
        $status = in_array($request->query('status'), ['submitted', 'approved', 'rejected'], true) ? (string) $request->query('status') : 'submitted';
        $confirmations = PaymentConfirmation::query()->with(['order', 'payment'])->where('status', $status)
            ->orderBy($status === 'submitted' ? 'id' : 'reviewed_at', $status === 'submitted' ? 'asc' : 'desc')->limit(100)->get();

        return Inertia::render('Commerce/Confirmations/Index', [
            'status' => $status,
            'confirmations' => $confirmations->map(fn (PaymentConfirmation $c) => [
                'id' => $c->id,
                'order' => ['id' => $c->order_id, 'number' => $c->order->displayNumber(), 'customer' => $c->order->customer_name ?? $c->order->email, 'href' => "commerce/orders/{$c->order_id}"],
                'expected' => $c->payment !== null ? $money->format($c->payment->amount) : null,
                'expected_amount' => $c->payment?->amount,
                'amount' => $money->format($c->amount),
                'amount_value' => $c->amount,
                'method' => $c->payment->method_title ?? null,
                'sender_name' => $c->sender_name, 'sender_bank' => $c->sender_bank,
                'transferred_at' => $c->transferred_at?->toDateString(),
                'destination' => $c->destination,
                'note' => $c->note,
                'proof_url' => $c->proof_path !== null ? route('sunrice.admin.commerce.confirmations.proof', $c, false) : null,
                'proof_is_pdf' => str_ends_with((string) $c->proof_path, '.pdf'),
                'status' => $c->status, 'review_note' => $c->review_note,
                'created_at' => $c->created_at?->toIso8601String(),
            ])->all(),
        ]);
    }

    /** The proof, streamed only to staff who verify payments. */
    public function proof(PaymentConfirmation $confirmation): StreamedResponse
    {
        $this->guard();
        abort_if($confirmation->proof_path === null || $confirmation->proof_disk === null, 404);

        return Storage::disk($confirmation->proof_disk)->response($confirmation->proof_path, null, ['X-Content-Type-Options' => 'nosniff', 'Content-Security-Policy' => "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'"]);
    }

    public function approve(Request $request, PaymentConfirmation $confirmation, ReviewPaymentConfirmation $review): RedirectResponse
    {
        $this->guard();
        try {
            $review->approve($confirmation, Actor::admin($request->user()), $request->boolean('anyway'));
        } catch (DomainException $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', "Payment for {$confirmation->order->displayNumber()} approved.");
    }

    public function reject(Request $request, PaymentConfirmation $confirmation, ReviewPaymentConfirmation $review): RedirectResponse
    {
        $this->guard();
        $data = $request->validate(['reason' => ['required', 'string', 'max:255']]);
        try {
            $review->reject($confirmation, $data['reason'], Actor::admin($request->user()));
        } catch (DomainException $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Confirmation rejected; the customer was told.');
    }

    protected function guard(): void
    {
        $this->authorizeFeature('manual_payments');
        $this->authorize('commerce.payments.verify');
    }
}
