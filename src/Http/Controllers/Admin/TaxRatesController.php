<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Sunrice\Commerce\Admin\SchemaForm;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Support\ActivityRecorder;
use Sunrice\Commerce\Taxes\TaxRate;

/** Settings → Store → Tax rates (all rates edited at once). */
class TaxRatesController extends Controller
{
    public function edit(Request $request): Response
    {
        $this->guard();
        $values = ['rates' => TaxRate::query()->orderBy('tax_class')->orderByDesc('priority')->get()->map(fn (TaxRate $r) => [
            'name' => $r->name, 'tax_class' => $r->tax_class, 'percent' => $r->rate / 100,
            'region' => ['country' => $r->country ?? '', 'province_code' => strlen((string) $r->region_code) === 2 ? $r->region_code : null, 'city_code' => strlen((string) $r->region_code) === 5 ? $r->region_code : null],
            'compound' => $r->compound, 'shipping' => $r->shipping, 'priority' => $r->priority,
        ])->all()];

        return Inertia::render('Commerce/Settings/Section', [
            'section' => ['key' => 'tax-rates', 'label' => 'Tax rates'],
            'sections' => SettingsController::menu($request->user()),
            'form' => SchemaForm::make($this->fields(), $values)->action(route('sunrice.admin.commerce.settings.tax-rates.update', [], false), 'put'),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $this->guard();
        $values = SchemaForm::make($this->fields())->validate((array) $request->input('values', []));
        DB::transaction(function () use ($values): void {
            TaxRate::query()->delete();
            foreach ((array) $values['rates'] as $row) {
                $region = (array) ($row['region'] ?? []);
                TaxRate::query()->create([
                    'name' => $row['name'], 'tax_class' => $row['tax_class'] ?: 'standard', 'rate' => (int) round((float) $row['percent'] * 100),
                    'country' => ($region['country'] ?? '') !== '' ? strtoupper($region['country']) : null,
                    'region_code' => $region['city_code'] ?? $region['province_code'] ?? null,
                    'compound' => (bool) ($row['compound'] ?? false), 'shipping' => (bool) ($row['shipping'] ?? false), 'priority' => (int) ($row['priority'] ?? 0),
                ]);
            }
        });
        app(ActivityRecorder::class)->record('updated', 'Store settings: Tax rates', [], 'store_setting');

        return back()->with('success', 'Tax rates saved.');
    }

    protected function guard(): void
    {
        $this->authorizeFeature('taxes');
        $this->authorize('commerce.settings.taxes');
    }

    /** @return array<int, array<string, mixed>> */
    protected function fields(): array
    {
        $classes = array_map(fn (string $c) => ['value' => $c, 'label' => $c], array_values(array_unique(['standard', ...(array) app(StoreSettings::class)->get('taxes.classes', [])])));

        return [
            ['handle' => 'rates', 'type' => 'repeater', 'label' => 'Rates', 'instructions' => 'Leave the country empty for everywhere. A rate for a province replaces the same-named general rate there.', 'config' => ['max' => 200, 'fields' => [
                ['handle' => 'name', 'type' => 'text', 'label' => 'Name (e.g. PPN)', 'required' => true, 'translatable' => false, 'config' => ['max' => 80]],
                ['handle' => 'tax_class', 'type' => 'select', 'label' => 'Tax class', 'config' => ['options' => $classes]],
                ['handle' => 'percent', 'type' => 'number', 'label' => 'Rate (%)', 'required' => true, 'config' => ['min' => 0, 'max' => 100]],
                ['handle' => 'region', 'type' => 'commerce_region', 'label' => 'Where', 'config' => ['depth' => 'city']],
                ['handle' => 'compound', 'type' => 'toggle', 'label' => 'Compound (on top of other taxes)'],
                ['handle' => 'shipping', 'type' => 'toggle', 'label' => 'Also on shipping'],
                ['handle' => 'priority', 'type' => 'number', 'label' => 'Priority', 'validation' => ['integer']],
            ]]],
        ];
    }
}
