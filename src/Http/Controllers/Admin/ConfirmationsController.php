<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Sunrice\Commerce\Admin\PaymentConfirmationDetails;
use Sunrice\Commerce\Admin\Tables\Column;
use Sunrice\Commerce\Admin\Tables\TableQuery;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\AdminOrderScopes;
use Sunrice\Commerce\Orders\Models\Order;
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
        $statuses = ['submitted', 'approved', 'rejected'];
        $selected = data_get($request->query('filters'), 'status') ?? $request->query('status');
        $status = in_array($selected, $statuses, true) ? $selected : 'submitted';
        $request->query->set('filters', ['status' => $status]);
        $table = TableQuery::for(PaymentConfirmation::query()->with(['order', 'payment'])
            ->whereIn('order_id', app(AdminOrderScopes::class)->apply(Order::query())->select('id')))
            ->filter('status', fn (Builder $q, string $value) => $q->where('status', $value))
            ->searchUsing(function (Builder $query, string $search): void {
                $like = '%'.addcslashes($search, '\\%_').'%';
                $query->where(fn (Builder $q) => $q->whereLike('sender_name', $like)
                    ->orWhereHas('order', fn (Builder $order) => $order->whereLike('number', $like)));
            })
            ->sortable(['amount', 'transferred_at'])->apply($request);
        if ($table->meta()['sort'] === null) {
            $table->builder()->orderBy($status === 'submitted' ? 'id' : 'reviewed_at', $status === 'submitted' ? 'asc' : 'desc');
        }
        $table->builder()->orderBy('id');
        $rows = $table->paginate($request);

        return Inertia::render('Commerce/Confirmations/Index', [
            'status' => $status,
            ...$this->tableProps('commerce-payment-confirmations', $table, [
                new Column('order', 'Order'),
                new Column('sender_name', 'Sender'),
                new Column('amount', 'Amount sent', sortable: true),
                new Column('transferred_at', 'Transfer date', sortable: true),
                new Column('status', 'Status', type: 'badge'),
                new Column('actions', 'Actions'),
            ], $rows->through(fn (Model $row) => $row instanceof PaymentConfirmation
                ? PaymentConfirmationDetails::make($row, $row->order, $money) : [])),
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
