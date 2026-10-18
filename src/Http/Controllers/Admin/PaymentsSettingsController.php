<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Sunrice\Commerce\Admin\SchemaForm;
use Sunrice\Commerce\Payments\Contracts\PaymentMethod;
use Sunrice\Commerce\Payments\PaymentManager;
use Sunrice\Commerce\Payments\PaymentMethodBase;
use Sunrice\Commerce\Payments\PaymentRegistry;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Support\ActivityRecorder;

/**
 * Settings → Store → Payments: the methods in checkout order, each with
 * an active switch and its settings (stored in payments.methods.{key});
 * methods that allow several instances (payment instructions) can be added.
 */
class PaymentsSettingsController extends Controller
{
    public function index(Request $request, PaymentManager $payments, PaymentRegistry $registry): Response
    {
        $this->guard();
        $methods = [];
        foreach ($payments->all() as $key => $method) {
            $methods[] = [
                'key' => $key, 'title' => PaymentManager::titleOf($method), 'type' => $method->label(),
                'active' => $payments->isActive($method), 'instance' => $key !== $method::key(),
                'edit_url' => "commerce/settings/payments/{$key}",
            ];
        }

        return Inertia::render('Commerce/Settings/Payments', [
            'sections' => SettingsController::menu($request->user()),
            'methods' => $methods,
            'instanceTypes' => collect($registry->classes())->filter(fn ($class) => method_exists($class, 'instances'))
                ->map(fn ($class, $key) => ['key' => $key, 'label' => app($class)->label()])->values()->all(),
        ]);
    }

    public function edit(Request $request, string $method, PaymentManager $payments): Response
    {
        $this->guard();
        $instance = $this->method($payments, $method);

        return Inertia::render('Commerce/Settings/Section', [
            'section' => ['key' => 'payments', 'label' => PaymentManager::titleOf($instance)],
            'sections' => SettingsController::menu($request->user()),
            'form' => SchemaForm::make($this->fields($instance), $this->stored($method))
                ->action(route('sunrice.admin.commerce.settings.payments.update', $method, false), 'put'),
        ]);
    }

    public function update(Request $request, string $method, PaymentManager $payments, StoreSettings $settings): RedirectResponse
    {
        $this->guard();
        $instance = $this->method($payments, $method);
        $values = SchemaForm::make($this->fields($instance))->validate((array) $request->input('values', []), $instance->settingsRules());
        foreach (['countries', 'provinces', 'shipping_methods', 'roles'] as $list) {
            if (array_key_exists($list, $values)) {
                $values[$list] = array_values(array_filter(array_map('trim', explode(',', (string) $values[$list]))));
                if ($list === 'countries') {
                    $values[$list] = array_map('strtoupper', $values[$list]);
                }
            }
        }
        $this->save($settings, fn (array $section) => [...$section, 'methods' => [...(array) ($section['methods'] ?? []), $method => $values]]);
        app(ActivityRecorder::class)->record('updated', "Payment method: {$method}", [], 'store_setting');

        return redirect()->route('sunrice.admin.commerce.settings.payments')->with('success', 'Payment method saved.');
    }

    public function toggle(Request $request, string $method, PaymentManager $payments, StoreSettings $settings): RedirectResponse
    {
        $this->guard();
        $this->method($payments, $method);
        $on = $request->boolean('active');
        $this->save($settings, function (array $section) use ($method, $on) {
            $section['methods'][$method] = [...(array) ($section['methods'][$method] ?? []), 'active' => $on];

            return $section;
        });

        return back();
    }

    public function move(Request $request, PaymentManager $payments, StoreSettings $settings): RedirectResponse
    {
        $this->guard();
        $data = $request->validate(['key' => ['required', 'string'], 'direction' => ['required', 'in:up,down']]);
        $keys = array_keys($payments->all());
        $at = array_search($data['key'], $keys, true);
        $to = $data['direction'] === 'up' ? (int) $at - 1 : (int) $at + 1;
        if ($at !== false && isset($keys[$to])) {
            [$keys[$at], $keys[$to]] = [$keys[$to], $keys[$at]];
            $this->save($settings, fn (array $section) => [...$section, 'order' => $keys]);
        }

        return back();
    }

    /** A new instance of a method class that allows several (e.g. another QRIS). */
    public function addInstance(Request $request, PaymentRegistry $registry, StoreSettings $settings): RedirectResponse
    {
        $this->guard();
        $data = $request->validate(['type' => ['required', 'string']]);
        $class = $registry->classes()[$data['type']] ?? null;
        abort_unless($class !== null && method_exists($class, 'instances'), 404);
        $key = $data['type'].'_'.Str::lower(Str::random(5));
        $this->save($settings, function (array $section) use ($data, $key) {
            $section['instances'][$data['type']] = [...(array) ($section['instances'][$data['type']] ?? []), $key];
            $section['methods'][$key] = ['active' => false];

            return $section;
        });

        return redirect()->route('sunrice.admin.commerce.settings.payments.edit', $key);
    }

    public function destroyInstance(string $method, PaymentManager $payments, StoreSettings $settings): RedirectResponse
    {
        $this->guard();
        $instance = $this->method($payments, $method);
        abort_if($method === $instance::key(), 422);
        $this->save($settings, function (array $section) use ($method, $instance) {
            $section['instances'][$instance::key()] = array_values(array_diff((array) ($section['instances'][$instance::key()] ?? []), [$method]));
            unset($section['methods'][$method]);
            $section['order'] = array_values(array_diff((array) ($section['order'] ?? []), [$method]));

            return $section;
        });

        return redirect()->route('sunrice.admin.commerce.settings.payments')->with('success', 'Payment method removed.');
    }

    protected function guard(): void
    {
        $this->authorizeFeature('payments');
        $this->authorize('commerce.settings.payments');
    }

    protected function method(PaymentManager $payments, string $key): PaymentMethod
    {
        $method = $payments->get($key);
        abort_if($method === null, 404);

        return $method;
    }

    /** @return array<int, array<string, mixed>> */
    protected function fields(PaymentMethod $method): array
    {
        return [...($method instanceof PaymentMethodBase ? PaymentMethodBase::commonSchema() : []), ...$method->settingsSchema()];
    }

    /** @return array<string, mixed> */
    protected function stored(string $key): array
    {
        $values = (array) app(StoreSettings::class)->get("payments.methods.{$key}", []);
        foreach (['countries', 'provinces', 'shipping_methods', 'roles'] as $list) {
            if (is_array($values[$list] ?? null)) {
                $values[$list] = implode(', ', $values[$list]);
            }
        }

        return $values;
    }

    /** @param  \Closure(array<string, mixed>): array<string, mixed>  $change */
    protected function save(StoreSettings $settings, \Closure $change): void
    {
        $section = $change((array) ($settings->stored()['payments'] ?? []));
        $settings->saveSection('payments', $section);
        app(PaymentManager::class)->flush();
    }
}
