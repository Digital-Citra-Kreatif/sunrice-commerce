<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;
use Sunrice\Commerce\Admin\SchemaForm;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Notifications\EmailDefinition;
use Sunrice\Commerce\Notifications\Emails;
use Sunrice\Commerce\Notifications\EmailSettings;
use Sunrice\Commerce\Notifications\StoreEmail;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Support\ActivityRecorder;
use Sunrice\Support\Locales;

/** Settings → Store → Emails: every email's switch, recipients, texts and attachments, with a preview and a test. */
class EmailsSettingsController extends Controller
{
    public function index(Request $request, Emails $emails, EmailSettings $settings, Features $features): Response
    {
        $this->guard();
        $rows = [];
        foreach ($emails->all() as $key => $email) {
            if ($email->feature !== null && ! $features->active($email->feature)) {
                continue;
            }
            $rows[] = ['key' => $key, 'label' => $email->label, 'audience' => $email->audience, 'description' => $email->description,
                'enabled' => $settings->enabled($key), 'locked' => $email->locked, 'edit_url' => "commerce/settings/emails/{$key}",
                'preview_url' => $this->usesStoreEmail($key) ? route('sunrice.admin.commerce.settings.emails.preview', $key, false) : null];
        }

        return Inertia::render('Commerce/Settings/Emails', ['sections' => SettingsController::menu($request->user()), 'emails' => $rows]);
    }

    public function edit(Request $request, string $key, Emails $emails, EmailSettings $settings): Response
    {
        $this->guard();
        $email = $this->email($emails, $key);
        $values = $settings->for($key);
        if (is_array($values['addresses'] ?? null)) {
            $values['addresses'] = implode(', ', $values['addresses']);
        }
        $values['enabled'] = $settings->enabled($key);
        $values['attachments'] ??= $email->defaultAttachments;

        return Inertia::render('Commerce/Settings/Section', [
            'section' => ['key' => 'emails', 'label' => 'Email: '.$email->label],
            'sections' => SettingsController::menu($request->user()),
            'form' => SchemaForm::make($this->fields($email), $values)->action(route('sunrice.admin.commerce.settings.emails.update', $key, false), 'put'),
        ]);
    }

    public function update(Request $request, string $key, Emails $emails, StoreSettings $store): RedirectResponse
    {
        $this->guard();
        $email = $this->email($emails, $key);
        $values = SchemaForm::make($this->fields($email))->validate((array) $request->input('values', []));
        if (array_key_exists('addresses', $values)) {
            $values['addresses'] = array_values(array_filter(array_map('trim', preg_split('/[\s,;]+/', (string) $values['addresses']) ?: [])));
            foreach ($values['addresses'] as $address) {
                if (! filter_var($address, FILTER_VALIDATE_EMAIL)) {
                    throw ValidationException::withMessages(['values.addresses' => "\"{$address}\" isn't an email address."]);
                }
            }
        }
        if ($email->locked) {
            $values['enabled'] = true;
        }
        $stored = (array) ($store->stored()['emails'] ?? []);
        $stored[$key] = $values;
        $store->saveSection('emails', $stored);
        app(ActivityRecorder::class)->record('updated', "Email: {$email->label}", [], 'store_setting');

        return redirect()->route('sunrice.admin.commerce.settings.emails')->with('success', 'Email saved.');
    }

    public function toggle(Request $request, string $key, Emails $emails, StoreSettings $store): RedirectResponse
    {
        $this->guard();
        $email = $this->email($emails, $key);
        abort_if($email->locked, 422);
        $stored = (array) ($store->stored()['emails'] ?? []);
        $stored[$key] = [...(array) ($stored[$key] ?? []), 'enabled' => $request->boolean('enabled')];
        $store->saveSection('emails', $stored);

        return back();
    }

    /** The email rendered with the latest order (or a sample). */
    public function preview(Request $request, string $key, Emails $emails): \Illuminate\Http\Response
    {
        $this->guard();
        $this->email($emails, $key);
        abort_unless($this->usesStoreEmail($key), 404);
        $locale = in_array($request->query('lang'), Locales::available(), true) ? (string) $request->query('lang') : Locales::main();

        return response($this->render($key, $locale), 200, ['Content-Type' => 'text/html; charset=utf-8']);
    }

    public function test(Request $request, string $key, Emails $emails): RedirectResponse
    {
        $this->guard();
        $this->email($emails, $key);
        abort_unless($this->usesStoreEmail($key), 404);
        $to = (string) $request->user()->getAttribute('email');
        Notification::route('mail', $to)->notifyNow((new StoreEmail($key, $this->sampleOrder(), null, null, [], Locales::main()))->locale(Locales::main()));

        return back()->with('success', "Test email sent to {$to}.");
    }

    public function render(string $key, string $locale): string
    {
        $previous = app()->getLocale();
        app()->setLocale($locale);
        try {
            return (string) (new StoreEmail($key, $this->sampleOrder(), null, null, [], $locale))->toMail(null)->render();
        } finally {
            app()->setLocale($previous);
        }
    }

    protected function sampleOrder(): Order
    {
        return Order::query()->where('type', 'order')->latest('id')->first() ?? (new Order)->forceFill([
            'id' => 0, 'type' => 'order', 'number' => 'ORD-SAMPLE-0001', 'order_key' => str_repeat('x', 40), 'status' => 'pending', 'payment_status' => 'unpaid',
            'fulfillment_status' => 'unfulfilled', 'customer_name' => 'Rina', 'email' => 'rina@example.com', 'subtotal' => 100000, 'total' => 110000,
            'shipping_total' => 10000, 'shipping_method' => ['label' => 'JNE REG'], 'placed_at' => now(), 'currency' => 'IDR', 'locale' => Locales::main(),
        ]);
    }

    protected function usesStoreEmail(string $key): bool
    {
        return ! in_array($key, ['account_welcome', 'verify_email', 'login_code', 'password_reset'], true);
    }

    protected function guard(): void
    {
        $this->authorize('commerce.settings.emails');
    }

    protected function email(Emails $emails, string $key): EmailDefinition
    {
        $email = $emails->get($key);
        abort_if($email === null, 404);

        return $email;
    }

    /** @return array<int, array<string, mixed>> */
    protected function fields(EmailDefinition $email): array
    {
        $perLanguage = function (string $handle, string $label, string $type = 'text') {
            $fields = [];
            foreach (Locales::available() as $locale) {
                $fields[] = ['handle' => $locale, 'type' => $type, 'label' => Locales::name($locale), 'translatable' => false, 'config' => ['max' => $type === 'text' ? 200 : 2000]];
            }

            return ['handle' => $handle, 'type' => 'group', 'label' => $label, 'instructions' => 'Empty: the default text. Placeholders: :number, :store, :name.', 'config' => ['fields' => $fields]];
        };
        $fields = [];
        if (! $email->locked) {
            $fields[] = ['handle' => 'enabled', 'type' => 'toggle', 'label' => 'Send this email'];
        }
        if ($email->audience === 'staff') {
            $fields[] = ['handle' => 'addresses', 'type' => 'text', 'label' => 'Send to', 'translatable' => false, 'instructions' => 'Email addresses, comma separated. Empty: the store email.'];
            $fields[] = ['handle' => 'roles', 'type' => 'select', 'label' => 'And to users with the roles', 'config' => ['multiple' => true,
                'options' => Role::query()->orderBy('name')->pluck('name')->map(fn ($n) => ['value' => $n, 'label' => $n])->all()]];
        }
        $fields[] = $perLanguage('subject', 'Subject');
        if ($this->usesStoreEmail($email->key)) {
            $fields[] = $perLanguage('heading', 'Heading');
            $fields[] = $perLanguage('intro', 'Text', 'textarea');
        }
        if ($email->attachments !== []) {
            $labels = ['invoice' => 'Invoice (PDF)', 'quotation' => 'Quotation (PDF)', 'packing_slip' => 'Packing slip (PDF)', 'downloads' => 'Download files (when small enough)'];
            $fields[] = ['handle' => 'attachments', 'type' => 'select', 'label' => 'Attachments', 'config' => ['multiple' => true,
                'options' => array_map(fn ($a) => ['value' => $a, 'label' => $labels[$a] ?? $a], $email->attachments)]];
        }

        return $fields;
    }
}
