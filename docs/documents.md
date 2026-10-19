# Invoices, packing slips and quotations

Commerce makes three PDF documents from an order: the invoice, the packing slip and, in Quotation
mode, the quotation. They are the `documents` feature (on by default, needs `orders`); see
[features.md](features.md).

## Contents

- [The documents](#the-documents)
- [Invoice numbers](#invoice-numbers)
- [Settings → Store → Documents](#settings--store--documents)
- [In the admin](#in-the-admin)
- [For customers](#for-customers)
- [In emails](#in-emails)
- [Caching](#caching)
- [Customizing the templates](#customizing-the-templates)
- [Swapping the renderer](#swapping-the-renderer)

## The documents

| Document | Type | Shows |
| --- | --- | --- |
| Invoice | `invoice` | Store logo, name, address, phone, email and tax ID; invoice number, date and order number; billing and shipping address; items with prices; subtotal, discounts, shipping, fees, taxes per rate, total, paid and refunded; payment method and status; while unpaid, the bank accounts to transfer to (from the order's open bank-transfer payment); the customer's order note; the invoice footer |
| Packing slip | `packing_slip` | The store, the order number and date; the addresses; the dropshipper as sender when there is one; items and quantities without prices; the shipping method and the customer's note |
| Quotation | `quotation` | Like the invoice, titled "Quotation", with the quote number and its validity date; the customer's note; the invoice footer |

Documents are rendered in the order's language, one A4 page (or more) per order. The code lives in
`src/Documents/`: `Documents` builds the HTML and PDFs, `DompdfRenderer` turns HTML into PDF with
[dompdf](https://github.com/dompdf/dompdf) (pure PHP), and `AssignInvoiceNumber` numbers invoices.

```php
use Sunrice\Commerce\Documents\Documents;

$pdf = app(Documents::class)->pdf($order, 'invoice');           // PDF bytes (cached)
$pdf = app(Documents::class)->bulkPdf($orders, 'packing_slip'); // one PDF for several orders
$html = app(Documents::class)->html(collect([$order]), 'invoice');
$number = app(Documents::class)->invoiceNumber($order);         // assigned once
```

## Invoice numbers

Invoices have their own number, separate from the order number. The default format is
`INV/{Y}/{m}/{seq:4}` with the counter restarting every month, for example `INV/2026/10/0001`.

| Token | |
| --- | --- |
| `{Y}`, `{y}` | Year, 4 or 2 digits |
| `{m}`, `{d}` | Month, day |
| `{seq}`, `{seq:4}` | The counter, plain or padded to 4 digits (required) |

A format must contain a counter and be at most 60 characters. The counter can restart never, every
year, every month or every day. The date in the number is the day the number is given.

**When numbers are given** (Settings → Store → Documents → Give the invoice number):

- **When the order is placed** (default): on `OrderPlaced`.
- **When it is paid**: on `OrderPaid`.

An order's invoice number is given once and never changes. If an invoice is needed before then (a
download, or an email that attaches it), the number is given at that moment. Quotes never get an
invoice number. Numbers are stored in `commerce_documents` and shown on the admin order page.

## Settings → Store → Documents

Shown while documents are on, for users with `commerce.settings.documents`.

| Setting | Key | Default |
| --- | --- | --- |
| Invoice number | `documents.invoice_number_format` | `INV/{Y}/{m}/{seq:4}` |
| Restart the invoice counter | `documents.invoice_number_reset` | `monthly` (`never`, `yearly`, `monthly`, `daily`) |
| Give the invoice number | `documents.invoice_assigned_on` | `placed` (or `paid`) |
| Customers can download invoices | `documents.customer_invoice_download` | on |
| Invoice footer | `documents.footer` | empty (up to 1000 characters) |

Use the footer for bank details, payment terms or a thank-you note. It is printed on invoices and
quotations.

The store's name, address, phone, email, tax ID and logo come from Settings → Store → General.

## In the admin

With `commerce.documents.view`, the **Documents** box on an order's page has:

- **Invoice** (orders), with its number once given;
- **Packing slip** (orders with items to ship);
- **Quotation** (quotes).

Each opens the PDF in the browser, ready to print or save. The URL is
`/cms/commerce/orders/{id}/documents/{invoice|packing-slip|quotation}`.

**Bulk packing slips**: select orders in Shop → Orders and choose **Print packing slips**. You get
one PDF with a page per order (up to 200 orders), from
`/cms/commerce/orders/packing-slips?ids=1,2,3`.

Bulk PDFs are rendered 25 orders at a time (`commerce.documents.batch_size` in
`config/commerce.php`) and the batches are joined into the one PDF, so 200 orders need about as much
memory as 25. Up to the batch size, the PDF is made in one go, as for a single order.

AI agents don't download documents; they work with the order data ([ai-agents.md](ai-agents.md)).

## For customers

With **Customers can download invoices** on, a paid order shows an invoice download link on its order
page and in My Account → Orders. The link is `/order/{key}/invoice`, so only someone with the
order's long random key can open it. Unpaid orders and quotes have no customer download.

## In emails

Emails can attach documents (Settings → Store → Emails → Attachments):

| Email | Document | By default |
| --- | --- | --- |
| Order received | Invoice | off |
| Payment received | Invoice | on |
| Quote ready | Quotation | on |
| New order (staff) | Packing slip | off |

Nothing is attached while the `documents` feature is off. See [emails.md](emails.md#attachments).

## Caching

A document's PDF is made once per order version and stored on the private disk
(`payments.proof_disk`, `local` by default) under `commerce/documents/{order id}/`. Every change to
the order (status, payment, shipment, edit, address, quote reply) raises its version, so the next
download makes a fresh PDF and replaces the old file. Bulk packing slips aren't cached.

Cached PDFs don't change when you edit a template or the store details. To see a template change on
an existing order, delete its folder `commerce/documents/{order id}/` on that disk; the PDFs are
made again on the next download.

## Customizing the templates

Publish the templates:

```bash
php artisan vendor:publish --tag=commerce-documents
```

They are copied to `resources/views/vendor/commerce/documents/` and used instead of the package's:

| View | |
| --- | --- |
| `layout.blade.php` | The HTML page and styles; one `.page` per order |
| `invoice.blade.php`, `packing-slip.blade.php`, `quotation.blade.php` | One page of each document |
| `partials/header.blade.php` | Store details, title, number, dates and addresses |
| `partials/lines.blade.php` | The items (`$prices` shows or hides prices) |
| `partials/totals.blade.php` | Subtotal, discounts, shipping, fees, taxes and totals |

Or, from a service provider, replace one view without publishing the rest:

```php
Commerce::documentTemplate('invoice', 'pdf.invoice');        // also packing_slip, quotation
Commerce::documentTemplate('layout', 'pdf.layout');          // the page and styles around them
```

The document views receive:

| Variable | |
| --- | --- |
| `$order` | The `Order`, with items, adjustments and shipments loaded |
| `$type` | `invoice`, `packing_slip` or `quotation` |
| `$number` | The invoice number, the quote number, or the order number on packing slips |
| `$store` | `name`, `address`, `email`, `phone`, `tax_id` and `logo` (a data URI, or null) |
| `$footer` | The invoice footer |
| `$money` | The store's money formatter: `$money->format($order->total)` |

The layout receives `$pages` (the rendered pages) and `$title`. Labels are translations in
`commerce::documents.*` (publish them with `--tag=commerce-translations`).

Keep dompdf's limits in mind: CSS 2.1, layout with tables, no flexbox or grid. Remote files are never
fetched, so put images in as data URIs (the logo already is). The default font is DejaVu Sans, which
covers Indonesian and most Latin text.

## Swapping the renderer

PDFs are made by `Documents\DocumentRenderer`:

```php
interface DocumentRenderer
{
    public function pdf(string $html, string $paper = 'a4'): string; // PDF bytes
}
```

Bind your own in a service provider's `register()`, for example to use a headless browser for modern
CSS:

```php
use Sunrice\Commerce\Documents\DocumentRenderer;

$this->app->bind(DocumentRenderer::class, BrowserRenderer::class);
```

```php
class BrowserRenderer implements DocumentRenderer
{
    public function pdf(string $html, string $paper = 'a4'): string
    {
        // Send $html to your PDF engine and return the bytes.
    }
}
```

The HTML, the caching, the numbering and the downloads stay the same.

To render bulk documents in batches, implement `Documents\BatchRenderer` instead: its
`combined(iterable $documents, string $paper = 'a4'): string` gets the HTML of one batch at a time
and returns one PDF. A plain `DocumentRenderer` gets bulk documents as one HTML document.
