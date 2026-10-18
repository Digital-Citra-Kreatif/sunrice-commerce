<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Documents;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Sunrice\Commerce\Notifications\Templates;
use Sunrice\Commerce\Orders\Models\Document;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\Numbering;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Support\Address;
use Sunrice\Commerce\Support\MoneyFormatter;
use Sunrice\Models\Asset;

/**
 * Invoices, packing slips and quotations (ARCHITECTURE.md §18): HTML in
 * the order's language, PDFs through the DocumentRenderer, cached on the
 * private disk with the order version they were made from.
 */
class Documents
{
    public const TYPES = ['invoice', 'packing_slip', 'quotation'];

    public function __construct(protected DocumentRenderer $renderer, protected Numbering $numbering, protected StoreSettings $settings) {}

    /** The invoice number, assigned once. */
    public function invoiceNumber(Order $order): string
    {
        return DB::transaction(function () use ($order): string {
            $existing = Document::query()->where('order_id', $order->id)->where('type', 'invoice')->lockForUpdate()->value('number');
            if ($existing !== null) {
                return (string) $existing;
            }
            $number = $this->numbering->next('invoice', $order);
            Document::query()->create(['order_id' => $order->id, 'type' => 'invoice', 'number' => $number, 'issued_at' => now(), 'order_version' => 0]);

            return $number;
        });
    }

    /** The PDF of one order's document (cached until the order changes). */
    public function pdf(Order $order, string $type): string
    {
        $type = in_array($type, self::TYPES, true) ? $type : 'invoice';
        $number = match ($type) {
            'invoice' => $this->invoiceNumber($order),
            'quotation' => $order->quote_number,
            default => $order->number,
        };
        $document = Document::query()->firstOrCreate(['order_id' => $order->id, 'type' => $type], ['number' => $type === 'packing_slip' ? null : $number, 'issued_at' => now()]);
        $disk = Storage::disk((string) config('commerce.payments.proof_disk', 'local'));
        if ($document->path !== null && $document->order_version === $order->version && $disk->exists($document->path)) {
            return (string) $disk->get($document->path);
        }
        $pdf = $this->renderer->pdf($this->html(collect([$order]), $type));
        $path = "commerce/documents/{$order->id}/{$type}-v{$order->version}.pdf";
        $disk->put($path, $pdf);
        if ($document->path !== null && $document->path !== $path) {
            $disk->delete($document->path);
        }
        $document->forceFill(['disk' => config('commerce.payments.proof_disk', 'local'), 'path' => $path, 'order_version' => $order->version])->save();

        return $pdf;
    }

    /**
     * One PDF for several orders (bulk packing slips).
     *
     * @param  Collection<int, Order>  $orders
     */
    public function bulkPdf(Collection $orders, string $type = 'packing_slip'): string
    {
        return $this->renderer->pdf($this->html($orders, $type));
    }

    /**
     * The HTML of documents of one type, one page per order.
     *
     * @param  Collection<int, Order>  $orders
     */
    public function html(Collection $orders, string $type): string
    {
        $pages = [];
        foreach ($orders as $order) {
            $order->loadMissing(['items.children', 'adjustments', 'shipments']);
            $previous = app()->getLocale();
            app()->setLocale((string) ($order->locale ?: $previous));
            try {
                $pages[] = view(app(Templates::class)->documentView($type), $this->data($order, $type))->render();
            } finally {
                app()->setLocale($previous);
            }
        }

        return view(app(Templates::class)->documentView('layout'), ['pages' => $pages, 'title' => $type])->render();
    }

    /** @return array<string, mixed> */
    protected function data(Order $order, string $type): array
    {
        $store = (array) $this->settings->get('general', []);
        $logo = $store['logo'] ?? null;
        $logoId = is_array($logo) ? ($logo[0] ?? null) : $logo;
        $logoPath = null;
        if ($logoId !== null) {
            $asset = Asset::query()->find($logoId);
            $logoPath = $asset !== null && $asset->getAttribute('disk') !== null ? Storage::disk((string) $asset->getAttribute('disk'))->path((string) $asset->getAttribute('path')) : null;
        }

        return [
            'order' => $order,
            'type' => $type,
            'number' => match ($type) {
                'invoice' => $this->invoiceNumber($order),
                'quotation' => $order->quote_number,
                default => $order->number,
            },
            'store' => [
                'name' => (string) ($store['name'] ?? config('app.name')),
                'address' => array_filter((array) ($store['address'] ?? [])) !== [] ? Address::fromArray((array) $store['address'])->format(null, "\n") : null,
                'email' => $store['email'] ?? null,
                'phone' => $store['phone'] ?? null,
                'tax_id' => $store['tax_id'] ?? null,
                'logo' => $logoPath !== null && is_file($logoPath) ? 'data:'.mime_content_type($logoPath).';base64,'.base64_encode((string) file_get_contents($logoPath)) : null,
            ],
            'footer' => $this->settings->get('documents.footer'),
            // Where to transfer, while the invoice is unpaid (the open bank-transfer payment's accounts).
            'bankAccounts' => $type === 'invoice' && in_array($order->payment_status, ['unpaid', 'awaiting_confirmation'], true)
                ? array_values(array_filter((array) ($order->payments()->where('status', 'pending')->first()?->instructions['accounts'] ?? []), 'is_array'))
                : [],
            'money' => app(MoneyFormatter::class),
        ];
    }
}
