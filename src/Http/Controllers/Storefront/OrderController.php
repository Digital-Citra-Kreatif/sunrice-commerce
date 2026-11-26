<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Storefront;

use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Sunrice\Commerce\Digital\Models\DownloadGrant;
use Sunrice\Commerce\Documents\Documents;
use Sunrice\Commerce\Orders\Actions\CancelOrderByCustomer;
use Sunrice\Commerce\Orders\InvalidTransition;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\OrderAccess;
use Sunrice\Commerce\Payments\Actions\PayWithMethod;
use Sunrice\Commerce\Payments\PaymentManager;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Storefront\Layout;

/**
 * The customer's order page and the guest order lookup.
 */
class OrderController
{
    public function show(Request $request, string $key): View|RedirectResponse
    {
        $order = $this->find($request, $key);
        if ($order->isQuote()) {
            return redirect($order->url());
        }

        return view(Layout::view('order'), $this->data($request, $order) + ['seoTitle' => __('commerce::checkout.order.title', ['number' => $order->displayNumber()])]);
    }

    public function cancel(Request $request, string $key, CancelOrderByCustomer $cancel): RedirectResponse
    {
        $order = $this->find($request, $key);
        try {
            $cancel->handle($order, $request->string('reason')->limit(250)->toString() ?: null);
        } catch (InvalidTransition $e) {
            return back()->with('commerce.error', $e->getMessage());
        }

        return back()->with('commerce.success', __('commerce::checkout.order.cancelled'));
    }

    public function invoice(Request $request, string $key, Documents $documents): Response
    {
        $order = $this->find($request, $key);
        abort_unless($this->invoiceAvailable($order), 404);

        return response($documents->pdf($order, 'invoice'), 200, ['Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="'.str_replace('/', '-', (string) $order->number).'.pdf"']);
    }

    protected function invoiceAvailable(Order $order): bool
    {
        return ! $order->isQuote() && commerce_feature('documents') && $order->isPaid()
            && (bool) app(StoreSettings::class)->get('documents.customer_invoice_download', true);
    }

    public function find(Request $request, string $key): Order
    {
        return app(OrderAccess::class)->find($request, $key);
    }

    /** @return array<string, mixed> */
    public function data(Request $request, Order $order): array
    {
        $order->load(['items.children', 'adjustments', 'payments', 'shipments']);
        $payment = $order->payment();
        $method = $payment !== null ? app(PaymentManager::class)->get($payment->method) : null;

        return [
            'order' => $order,
            'payment' => $payment,
            'instructionsView' => $method?->instructionsView(),
            'whatsappUrl' => $order->meta('whatsapp_url'),
            'openWhatsApp' => $request->boolean('whatsapp') && $order->meta('whatsapp_url') !== null,
            'payUrl' => commerce_feature('payments') && app(PayWithMethod::class)->payable($order) && $order->payment_method !== 'whatsapp'
                ? commerce_url('commerce.order.pay', ['key' => $order->order_key]) : null,
            'downloads' => DownloadGrant::query()->with('file')->where('order_id', $order->id)->whereNull('revoked_at')->get(),
            'invoiceUrl' => $this->invoiceAvailable($order) ? commerce_url('commerce.order.invoice', ['key' => $order->order_key]) : null,
            'canCancel' => app(CancelOrderByCustomer::class)->allowed($order),
        ];
    }
}
