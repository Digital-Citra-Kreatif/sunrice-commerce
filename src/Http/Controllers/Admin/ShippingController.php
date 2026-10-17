<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Sunrice\Commerce\Admin\SchemaForm;
use Sunrice\Commerce\Regions\Countries;
use Sunrice\Commerce\Regions\Region;
use Sunrice\Commerce\Shipping\Contracts\ShippingMethodType;
use Sunrice\Commerce\Shipping\Couriers;
use Sunrice\Commerce\Shipping\Models\ShippingMethod;
use Sunrice\Commerce\Shipping\Models\ShippingZone;
use Sunrice\Commerce\Shipping\ShippingTypes;
use Sunrice\Commerce\Support\ActivityRecorder;
use Sunrice\Support\Locales;

/** Settings → Store → Shipping: zones in order, their methods, courier presets. */
class ShippingController extends Controller
{
    public function index(Request $request, ShippingTypes $types, Couriers $couriers): Response
    {
        $this->guard();
        $labels = $types->options();
        $zones = ShippingZone::query()->with(['regions', 'methods'])->orderBy('position')->orderBy('id')->get();

        return Inertia::render('Commerce/Settings/Shipping', [
            'sections' => SettingsController::menu($request->user()),
            'zones' => $zones->map(fn (ShippingZone $zone) => [
                'id' => $zone->id,
                'name' => $zone->name,
                'everywhere_else' => $zone->everywhere_else,
                'regions' => $zone->everywhere_else ? [] : $this->regionLabels($zone),
                'edit_url' => "commerce/settings/shipping/zones/{$zone->id}/edit",
                'methods' => $zone->methods->map(fn (ShippingMethod $m) => [
                    'id' => $m->id, 'title' => $m->titleFor(), 'type' => $labels[$m->type] ?? $m->type, 'active' => $m->active, 'etd' => $m->etdFor(),
                    'edit_url' => "commerce/settings/shipping/methods/{$m->id}/edit",
                ])->values()->all(),
            ])->values()->all(),
            'types' => array_map(fn ($key, $label) => ['key' => $key, 'label' => $label], array_keys($labels), $labels),
            'couriers' => array_map(fn ($key, $c) => ['key' => $key, ...$c], array_keys($couriers->all()), $couriers->all()),
            'moveUrl' => route('sunrice.admin.commerce.settings.shipping.move', [], false),
        ]);
    }

    public function createZone(): Response
    {
        $this->guard();

        return $this->zoneForm(null, ['regions' => [['region' => ['country' => 'ID']]]]);
    }

    public function storeZone(Request $request): RedirectResponse
    {
        $this->guard();
        $values = SchemaForm::make($this->zoneFields())->validate((array) $request->input('values', []));
        $zone = DB::transaction(function () use ($values): ShippingZone {
            $zone = ShippingZone::query()->create(['name' => $values['name'], 'everywhere_else' => (bool) $values['everywhere_else'],
                'position' => (int) ShippingZone::query()->max('position') + 1]);
            $this->syncRegions($zone, $values);

            return $zone;
        });
        app(ActivityRecorder::class)->record('created', "Shipping zone: {$zone->name}", [], 'store_setting');

        return redirect()->route('sunrice.admin.commerce.settings.shipping')->with('success', 'Zone added.');
    }

    public function editZone(ShippingZone $zone): Response
    {
        $this->guard();
        $regions = $zone->regions->map(function ($r) {
            $value = ['country' => $r->country];
            if ($r->region_code !== null) {
                $chain = [];
                $code = $r->region_code;
                while ($code !== null) {
                    $chain[Region::levelOf($code)] = $code;
                    $code = Region::query()->whereKey($code)->value('parent_code');
                }
                foreach ([1 => 'province_code', 2 => 'city_code', 3 => 'district_code'] as $level => $key) {
                    $value[$key] = $chain[$level] ?? null;
                }
            }

            return ['region' => $value];
        })->all();

        return $this->zoneForm($zone, ['name' => $zone->name, 'everywhere_else' => $zone->everywhere_else, 'regions' => $regions]);
    }

    public function updateZone(Request $request, ShippingZone $zone): RedirectResponse
    {
        $this->guard();
        $values = SchemaForm::make($this->zoneFields())->validate((array) $request->input('values', []));
        DB::transaction(function () use ($zone, $values): void {
            $zone->update(['name' => $values['name'], 'everywhere_else' => (bool) $values['everywhere_else']]);
            $this->syncRegions($zone, $values);
        });
        app(ActivityRecorder::class)->record('updated', "Shipping zone: {$zone->name}", [], 'store_setting');

        return redirect()->route('sunrice.admin.commerce.settings.shipping')->with('success', 'Zone saved.');
    }

    public function destroyZone(ShippingZone $zone): RedirectResponse
    {
        $this->guard();
        DB::transaction(function () use ($zone): void {
            $zone->methods()->delete();
            $zone->regions()->delete();
            $zone->delete();
        });
        app(ActivityRecorder::class)->record('deleted', "Shipping zone: {$zone->name}", [], 'store_setting');

        return redirect()->route('sunrice.admin.commerce.settings.shipping')->with('success', 'Zone deleted.');
    }

    public function createMethod(Request $request, ShippingZone $zone, ShippingTypes $types): Response
    {
        $this->guard();
        $type = $this->type($types, (string) $request->query('type'));

        return $this->methodForm($zone, $type, null, ['active' => true]);
    }

    public function storeMethod(Request $request, ShippingZone $zone, ShippingTypes $types): RedirectResponse
    {
        $this->guard();
        $type = $this->type($types, (string) $request->query('type', $request->input('type')));
        $values = SchemaForm::make($this->methodFields($type))->validate((array) $request->input('values', []), $this->prefixRules($type));
        $method = $zone->methods()->create([...$this->methodAttributes($values, $type), 'type' => $type::key(),
            'position' => (int) $zone->methods()->max('position') + 1]);
        app(ActivityRecorder::class)->record('created', "Shipping method: {$method->titleFor()}", [], 'store_setting');

        return redirect()->route('sunrice.admin.commerce.settings.shipping')->with('success', 'Method added.');
    }

    public function editMethod(ShippingMethod $method, ShippingTypes $types): Response
    {
        $this->guard();
        $type = $this->type($types, $method->type);

        return $this->methodForm($method->zone, $type, $method, [
            'title' => $method->title, 'etd' => $method->etd, 'active' => $method->active,
            'min_subtotal' => $method->setting('min_subtotal'), 'max_subtotal' => $method->setting('max_subtotal'), 'max_weight' => $method->setting('max_weight'),
            'settings' => array_diff_key((array) $method->settings, array_flip(['min_subtotal', 'max_subtotal', 'max_weight'])),
        ]);
    }

    public function updateMethod(Request $request, ShippingMethod $method, ShippingTypes $types): RedirectResponse
    {
        $this->guard();
        $type = $this->type($types, $method->type);
        $values = SchemaForm::make($this->methodFields($type))->validate((array) $request->input('values', []), $this->prefixRules($type));
        $method->update($this->methodAttributes($values, $type));
        app(ActivityRecorder::class)->record('updated', "Shipping method: {$method->titleFor()}", [], 'store_setting');

        return redirect()->route('sunrice.admin.commerce.settings.shipping')->with('success', 'Method saved.');
    }

    public function destroyMethod(ShippingMethod $method): RedirectResponse
    {
        $this->guard();
        $method->delete();

        return redirect()->route('sunrice.admin.commerce.settings.shipping')->with('success', 'Method deleted.');
    }

    /** Move a zone or a method one place up or down. */
    public function move(Request $request): RedirectResponse
    {
        $this->guard();
        $data = $request->validate(['kind' => ['required', 'in:zone,method'], 'id' => ['required', 'integer'], 'direction' => ['required', 'in:up,down']]);
        DB::transaction(function () use ($data): void {
            $items = $data['kind'] === 'zone'
                ? ShippingZone::query()->orderBy('position')->orderBy('id')->get()
                : ShippingMethod::query()->where('zone_id', ShippingMethod::query()->findOrFail($data['id'])->zone_id)->orderBy('position')->orderBy('id')->get();
            $ids = $items->pluck('id')->all();
            $at = array_search((int) $data['id'], $ids, true);
            $to = $data['direction'] === 'up' ? $at - 1 : $at + 1;
            if ($at === false || ! isset($ids[$to])) {
                return;
            }
            [$ids[$at], $ids[$to]] = [$ids[$to], $ids[$at]];
            foreach ($ids as $position => $id) {
                $items->firstWhere('id', $id)?->forceFill(['position' => $position])->save();
            }
        });

        return back();
    }

    protected function guard(): void
    {
        $this->authorizeFeature('shipping');
        $this->authorize('commerce.settings.shipping');
    }

    /** @param  array<string, mixed>  $values */
    protected function zoneForm(?ShippingZone $zone, array $values): Response
    {
        $form = SchemaForm::make($this->zoneFields(), $values)->action($zone === null
            ? route('sunrice.admin.commerce.settings.shipping.zones.store', [], false)
            : route('sunrice.admin.commerce.settings.shipping.zones.update', $zone, false), $zone === null ? 'post' : 'put');

        return Inertia::render('Commerce/Shared/SchemaForm', [
            'title' => $zone === null ? 'New shipping zone' : $zone->name,
            'description' => 'Zones are checked in order; the first that matches the address gives its methods.',
            'form' => $form,
            'breadcrumbs' => [['label' => 'Settings', 'href' => 'settings'], ['label' => 'Store', 'href' => 'commerce/settings'], ['label' => 'Shipping', 'href' => 'commerce/settings/shipping']],
            'deleteUrl' => $zone === null ? null : "commerce/settings/shipping/zones/{$zone->id}",
            'deleteConfirm' => 'Delete this zone and its methods?',
        ]);
    }

    /** @return array<int, array<string, mixed>> */
    protected function zoneFields(): array
    {
        return [
            ['handle' => 'name', 'type' => 'text', 'label' => 'Zone name', 'required' => true, 'translatable' => false, 'config' => ['max' => 120]],
            ['handle' => 'everywhere_else', 'type' => 'toggle', 'label' => 'Everywhere else', 'instructions' => 'Catches addresses no other zone matches; its regions are ignored.'],
            ['handle' => 'regions', 'type' => 'repeater', 'label' => 'Regions', 'instructions' => 'A country, or in Indonesia a province, city or district (and everything in it).', 'config' => ['max' => 500, 'fields' => [
                ['handle' => 'region', 'type' => 'commerce_region', 'label' => 'Region', 'config' => ['depth' => 'district']],
            ]]],
        ];
    }

    /** @param  array<string, mixed>  $values */
    protected function syncRegions(ShippingZone $zone, array $values): void
    {
        $zone->regions()->delete();
        $seen = [];
        foreach ((array) ($values['regions'] ?? []) as $row) {
            $region = (array) ($row['region'] ?? []);
            $country = strtoupper((string) ($region['country'] ?? ''));
            if ($country === '' || ! Countries::exists($country)) {
                continue;
            }
            $code = $country === 'ID' ? ($region['district_code'] ?? $region['city_code'] ?? $region['province_code'] ?? null) : null;
            $key = $country.'|'.$code;
            if (! isset($seen[$key])) {
                $zone->regions()->create(['country' => $country, 'region_code' => $code]);
                $seen[$key] = true;
            }
        }
    }

    /** @return array<int, string> */
    protected function regionLabels(ShippingZone $zone): array
    {
        $names = Region::query()->whereIn('code', $zone->regions->pluck('region_code')->filter()->all())->pluck('name', 'code');

        return $zone->regions->map(fn ($r) => $r->region_code === null ? Countries::name($r->country) : (string) ($names[$r->region_code] ?? $r->region_code))->values()->all();
    }

    protected function type(ShippingTypes $types, string $key): ShippingMethodType
    {
        $type = $types->get($key);
        abort_if($type === null, 404);

        return $type;
    }

    /** @param  array<string, mixed>  $values */
    protected function methodForm(ShippingZone $zone, ShippingMethodType $type, ?ShippingMethod $method, array $values): Response
    {
        $form = SchemaForm::make($this->methodFields($type), $values)->action($method === null
            ? route('sunrice.admin.commerce.settings.shipping.methods.store', ['zone' => $zone, 'type' => $type::key()], false)
            : route('sunrice.admin.commerce.settings.shipping.methods.update', $method, false), $method === null ? 'post' : 'put');

        return Inertia::render('Commerce/Shared/SchemaForm', [
            'title' => $method === null ? "New {$type->label()} method" : $method->titleFor(),
            'description' => "{$type->label()} · {$zone->name}",
            'form' => $form,
            'breadcrumbs' => [['label' => 'Settings', 'href' => 'settings'], ['label' => 'Store', 'href' => 'commerce/settings'], ['label' => 'Shipping', 'href' => 'commerce/settings/shipping']],
            'deleteUrl' => $method === null ? null : "commerce/settings/shipping/methods/{$method->id}",
            'deleteConfirm' => 'Delete this shipping method?',
        ]);
    }

    /** @return array<int, array<string, mixed>> */
    protected function methodFields(ShippingMethodType $type): array
    {
        $perLanguage = function (string $handle, string $label, bool $required): array {
            $fields = [];
            foreach (Locales::available() as $i => $locale) {
                $fields[] = ['handle' => $locale, 'type' => 'text', 'label' => Locales::name($locale), 'translatable' => false,
                    'required' => $required && $locale === Locales::main(), 'config' => ['max' => 120]];
            }

            return ['handle' => $handle, 'type' => 'group', 'label' => $label, 'config' => ['fields' => $fields]];
        };

        return [
            $perLanguage('title', 'Title', true),
            $perLanguage('etd', 'Estimated delivery (e.g. 2–3 days)', false),
            ['handle' => 'active', 'type' => 'toggle', 'label' => 'Active'],
            ['handle' => 'settings', 'type' => 'group', 'label' => $type->label(), 'config' => ['fields' => $type->settingsSchema()]],
            ['handle' => 'min_subtotal', 'type' => 'commerce_money', 'label' => 'Only from a subtotal of'],
            ['handle' => 'max_subtotal', 'type' => 'commerce_money', 'label' => 'Only up to a subtotal of'],
            ['handle' => 'max_weight', 'type' => 'number', 'label' => 'Only up to a weight of (kg)', 'config' => ['min' => 0]],
        ];
    }

    /** @return array<string, mixed> the type's own rules, under settings. */
    protected function prefixRules(ShippingMethodType $type): array
    {
        $rules = [];
        foreach ($type->settingsRules() as $key => $rule) {
            $rules["settings.{$key}"] = $rule;
        }

        return $rules;
    }

    /**
     * @param  array<string, mixed>  $values
     * @return array<string, mixed>
     */
    protected function methodAttributes(array $values, ShippingMethodType $type): array
    {
        $settings = (array) ($values['settings'] ?? []);
        foreach (['min_subtotal', 'max_subtotal', 'max_weight'] as $key) {
            $settings[$key] = $values[$key] === '' ? null : $values[$key];
        }

        return ['title' => (array) $values['title'], 'etd' => (array) $values['etd'], 'active' => (bool) $values['active'], 'settings' => $settings];
    }
}
