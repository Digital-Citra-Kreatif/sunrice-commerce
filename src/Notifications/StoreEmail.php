<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Digital\Models\DownloadGrant;
use Sunrice\Commerce\Documents\Documents;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Settings\StoreSettings;
use Throwable;

/**
 * One store email (ARCHITECTURE.md §19), queued, in the recipient's
 * language: the subject and heading from Settings → Emails (or the
 * defaults), the body from commerce::emails.store with the key's part,
 * the store's branding, and the email's attachments.
 */
class StoreEmail extends Notification implements ShouldQueue
{
    use Queueable, SerializesModels;

    /** @param  array<string, mixed>  $context */
    public function __construct(
        public string $key,
        public ?Order $order = null,
        public ?Customer $customer = null,
        public ?Variant $variant = null,
        public array $context = [],
        public string $lang = 'id',
    ) {}

    /** @return array<int, string> */
    public function via(mixed $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(mixed $notifiable): MailMessage
    {
        $data = $this->data();
        $settings = app(EmailSettings::class);
        $mail = (new MailMessage)
            ->subject($settings->text($this->key, 'subject', $this->lang, $data['replace']))
            ->markdown('commerce::emails.store', $data);
        $replyTo = app(StoreSettings::class)->get('general.email');
        if (is_string($replyTo) && $replyTo !== '' && str_starts_with($this->key, 'staff_') === false) {
            $mail->replyTo($replyTo, commerce_store_name());
        }

        return $this->attach($mail, $settings->attachments($this->key));
    }

    /** @return array<string, mixed> what the views receive */
    public function data(): array
    {
        $settings = app(EmailSettings::class);
        $replace = [
            'store' => commerce_store_name(),
            'number' => $this->order?->displayNumber() ?? '',
            'name' => $this->order->customer_name ?? $this->customer->name ?? '',
            'product' => $this->context['product'] ?? '',
        ];

        return [
            'key' => $this->key,
            'lang' => $this->lang,
            'order' => $this->order,
            'customer' => $this->customer,
            'variant' => $this->variant,
            'context' => $this->context,
            'replace' => $replace,
            'heading' => $settings->text($this->key, 'heading', $this->lang, $replace),
            'intro' => $settings->text($this->key, 'intro', $this->lang, $replace),
            'action' => $this->action($settings, $replace),
            'store' => ['name' => commerce_store_name(), 'url' => url('/')],
        ];
    }

    /**
     * The button: the order or quote page, the pay page, the confirm page, the admin order…
     *
     * @param  array<string, string>  $replace
     * @return array{label: string, url: string}|null
     */
    protected function action(EmailSettings $settings, array $replace): ?array
    {
        $label = $settings->text($this->key, 'action', $this->lang, $replace);
        $url = $this->context['url'] ?? match (true) {
            str_starts_with($this->key, 'staff_') && $this->order !== null => url(config('sunrice.admin.path', 'cms').'/commerce/orders/'.$this->order->id),
            $this->key === 'staff_payment_confirmation' => url(config('sunrice.admin.path', 'cms').'/commerce/confirmations'),
            $this->key === 'payment_link' && $this->order !== null => commerce_url('commerce.order.pay', ['key' => $this->order->order_key], $this->lang),
            $this->key === 'payment_rejected' && $this->order !== null => commerce_url('commerce.confirm-payment', [], $this->lang).'?order='.$this->order->order_key,
            $this->order !== null => $this->order->url(),
            default => null,
        };

        return $label !== '' && is_string($url) ? ['label' => $label, 'url' => $url] : null;
    }

    /** @param  array<int, string>  $kinds */
    protected function attach(MailMessage $mail, array $kinds): MailMessage
    {
        if ($this->order === null) {
            return $mail;
        }
        $documents = app(Features::class)->active('documents');
        foreach ($kinds as $kind) {
            try {
                if ($documents && in_array($kind, ['invoice', 'packing_slip', 'quotation'], true)) {
                    $mail->attachData(app(Documents::class)->pdf($this->order, $kind), str_replace('/', '-', $this->order->displayNumber()).'-'.$kind.'.pdf', ['mime' => 'application/pdf']);
                }
                if ($kind === 'downloads') {
                    foreach ($this->attachableDownloads() as $grant) {
                        $mail->attachData((string) Storage::disk((string) $grant->file->disk)->get((string) $grant->file->path), (string) ($grant->file->filename ?? basename((string) $grant->file->path)),
                            array_filter(['mime' => $grant->file->mime_type]));
                    }
                }
            } catch (Throwable $e) {
                report($e);
            }
        }

        return $mail;
    }

    /**
     * Download files small enough to attach, for products delivered as attachments.
     *
     * @return array<int, DownloadGrant>
     */
    public function attachableDownloads(): array
    {
        $limit = (int) config('commerce.downloads.attachment_max_mb', 10) * 1024 * 1024;
        $out = [];
        foreach ((array) ($this->context['grants'] ?? []) as $grant) {
            if (! $grant instanceof DownloadGrant || $grant->file->type !== 'file' || $grant->file->path === null) {
                continue;
            }
            if (in_array('attachment', DeliveryModes::for($grant), true) && (int) $grant->file->size > 0 && (int) $grant->file->size <= $limit) {
                $out[] = $grant;
            }
        }

        return $out;
    }
}
