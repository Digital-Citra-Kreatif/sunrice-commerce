<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Sunrice\Cms\Support\Locales;
use Sunrice\Commerce\Admin\SchemaForm;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Notifications\EmailDefinition;
use Sunrice\Commerce\Notifications\Emails;
use Sunrice\Commerce\Notifications\EmailSettings;
use Sunrice\Commerce\Notifications\StoreEmail;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Support\ActivityRecorder;

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
        // The texts show their default until changed (saving a default unchanged keeps it the default).
        foreach ($this->parts($email) as $part) {
            foreach (Locales::all() as $locale) {
                $stored = $values[$part][$locale] ?? null;
                $values[$part][$locale] = is_string($stored) && trim($stored) !== '' ? $stored : $settings->defaultText($key, $part, $locale);
            }
        }
        $values['enabled'] = $settings->enabled($key);
        if ($email->audience === 'staff') {
            // Who gets it now: unset roles mean the shop managers.
            $values['roles'] = $settings->roles($key);
        }
        $values['attachments'] ??= $email->defaultAttachments;

        return Inertia::render('Commerce/Settings/Section', [
            'section' => ['key' => 'emails', 'label' => 'Email: '.$email->label],
            'parent' => ['label' => 'Emails', 'href' => 'commerce/settings/emails'],
            'sections' => SettingsController::menu($request->user()),
            'form' => SchemaForm::make($this->fields($email), $values)->action(route('sunrice.admin.commerce.settings.emails.update', $key, false), 'put'),
        ]);
    }

    public function update(Request $request, string $key, Emails $emails, StoreSettings $store, EmailSettings $settings): RedirectResponse
    {
        $this->guard();
        $email = $this->email($emails, $key);
        $values = SchemaForm::make($this->fields($email))->validate((array) $request->input('values', []));
        foreach ($this->parts($email) as $part) {
            foreach ((array) ($values[$part] ?? []) as $locale => $text) {
                // The default as it is stays the default, so it follows changes to the default texts.
                if (is_string($text) && trim($text) === trim($settings->defaultText($key, $part, (string) $locale))) {
                    $values[$part][$locale] = null;
                }
            }
        }
        foreach (['addresses', 'copies'] as $list) {
            if (! array_key_exists($list, $values)) {
                continue;
            }
            $values[$list] = array_values(array_unique(array_filter(array_map(fn ($a) => mb_strtolower(trim((string) $a)), $this->addressList($values[$list])))));
            foreach ($values[$list] as $address) {
                if (! filter_var($address, FILTER_VALIDATE_EMAIL)) {
                    throw ValidationException::withMessages(["values.{$list}" => "\"{$address}\" isn't an email address."]);
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
        $locale = in_array($request->query('lang'), Locales::all(), true) ? (string) $request->query('lang') : Locales::default();

        return response($this->render($key, $locale), 200, ['Content-Type' => 'text/html; charset=utf-8']);
    }

    public function test(Request $request, string $key, Emails $emails): RedirectResponse
    {
        $this->guard();
        $this->email($emails, $key);
        abort_unless($this->usesStoreEmail($key), 404);
        $to = (string) $request->user()->getAttribute('email');
        Notification::route('mail', $to)->notifyNow((new StoreEmail($key, $this->sampleOrder(), null, null, [], Locales::default()))->locale(Locales::default()));

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
            'shipping_total' => 10000, 'shipping_method' => ['label' => 'JNE REG'], 'placed_at' => now(), 'currency' => 'IDR', 'locale' => Locales::default(),
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

    /** @return list<string> the texts the email's settings can change */
    protected function parts(EmailDefinition $email): array
    {
        return $this->usesStoreEmail($email->key) ? ['subject', 'heading', 'intro'] : ['subject'];
    }

    /** @return list<string> addresses, from a list or a string ("a@x.id, b@x.id") */
    protected function addressList(mixed $value): array
    {
        $parts = [];
        foreach (is_array($value) ? $value : [$value] as $item) {
            $parts = [...$parts, ...(preg_split('/[\s,;]+/', (string) $item) ?: [])];
        }

        return $parts;
    }

    /**
     * The placeholders an email's texts can use, to insert with a click.
     *
     * @return list<array{value: string, label: string}>
     */
    public static function placeholders(EmailDefinition $email): array
    {
        $all = ['number' => 'Order number', 'name' => 'Customer name', 'store' => 'Store name', 'product' => 'Product', 'balance' => 'Balance due', 'due_date' => 'Balance due date'];
        $names = match (true) {
            in_array($email->key, ['account_welcome', 'verify_email', 'login_code', 'password_reset'], true) => ['store'],
            in_array($email->key, ['back_in_stock', 'staff_low_stock', 'staff_out_of_stock'], true) => ['product', 'name', 'store'],
            in_array($email->key, ['balance_reminder', 'staff_balance_overdue'], true) => ['number', 'name', 'store', 'balance', 'due_date'],
            default => ['number', 'name', 'store'],
        };

        return array_map(fn (string $n) => ['value' => ':'.$n, 'label' => $all[$n]], $names);
    }

    /** @return array<int, array<string, mixed>> */
    protected function fields(EmailDefinition $email): array
    {
        $tokens = self::placeholders($email);
        $perLanguage = function (string $handle, string $label, string $type = 'text') use ($tokens): array {
            $group = SchemaForm::perLanguage($handle, $label, $type, $type === 'text' ? 200 : 2000,
                ['instructions' => 'Shows the default text until you change it; clear it to go back to the default.']);
            $group['config']['fields'] = array_map(fn (array $f) => [...$f, 'config' => [...(array) ($f['config'] ?? []), 'tokens' => $tokens]], $group['config']['fields']);

            return $group;
        };
        $fields = [];
        if (! $email->locked) {
            $fields[] = ['handle' => 'enabled', 'type' => 'toggle', 'label' => 'Send this email'];
        }
        if ($email->audience === 'staff') {
            $fields[] = ['handle' => 'addresses', 'type' => 'commerce_choices', 'label' => 'Send to', 'translatable' => false,
                'config' => ['placeholder' => 'The store email', 'input_placeholder' => 'Type an address…'], 'instructions' => 'Type an address and press Enter. Empty: the store email.'];
            $fields[] = ['handle' => 'roles', 'type' => 'commerce_choices', 'label' => 'And to users with the roles', 'translatable' => false,
                'config' => ['source' => 'roles', 'creatable' => false, 'placeholder' => 'No roles']];
        }
        if ($email->audience !== 'staff' && ! $email->locked) {
            $fields[] = ['handle' => 'copies', 'type' => 'commerce_choices', 'label' => 'Also send a copy to', 'translatable' => false,
                'config' => ['placeholder' => 'Only the customer', 'input_placeholder' => 'Type an address…'],
                'instructions' => 'Each address gets a hidden copy (BCC). Type an address and press Enter.'];
        }
        $fields[] = $perLanguage('subject', 'Subject');
        if ($this->usesStoreEmail($email->key)) {
            $fields[] = $perLanguage('heading', 'Heading');
            $fields[] = $perLanguage('intro', 'Text', 'textarea');
        }
        if ($email->attachments !== []) {
            $labels = ['invoice' => 'Invoice (PDF)', 'invoice_to_pay' => 'Invoice (PDF), only when paying by transfer, QRIS or another manual method', 'quotation' => 'Quotation (PDF)', 'packing_slip' => 'Packing slip (PDF)', 'downloads' => 'Download files (when small enough)'];
            $fields[] = ['handle' => 'attachments', 'type' => 'select', 'label' => 'Attachments', 'config' => ['multiple' => true,
                'options' => array_map(fn ($a) => ['value' => $a, 'label' => $labels[$a] ?? $a], $email->attachments)]];
        }

        return $fields;
    }
}
