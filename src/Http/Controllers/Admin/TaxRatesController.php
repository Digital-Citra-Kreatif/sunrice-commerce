<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Sunrice\Commerce\Admin\SchemaForm;
use Sunrice\Commerce\Regions\Region;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Support\ActivityRecorder;
use Sunrice\Commerce\Taxes\TaxRate;

/** Settings → Store → Tax rates (all rates edited at once). */
class TaxRatesController extends Controller
{
    public function edit(Request $request): Response
    {
        $this->guard();
        $rates = TaxRate::query()->orderBy('tax_class')->orderByDesc('priority')->orderBy('id')->get();

        return Inertia::render('Commerce/Settings/Section', [
            'section' => ['key' => 'tax-rates', 'label' => 'Tax rates'],
            'sections' => SettingsController::menu($request->user()),
            'form' => SchemaForm::make($this->fields(), ['rates' => self::grouped($rates->all())])
                ->action(route('sunrice.admin.commerce.settings.tax-rates.update', [], false), 'put'),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $this->guard();
        $input = (array) $request->input('values', []);
        // The earlier shape, one place per rate: region {country, province_code, city_code}.
        foreach ((array) ($input['rates'] ?? []) as $i => $row) {
            if (is_array($row) && is_array($row['region'] ?? null) && ! array_key_exists('countries', $row)) {
                $region = $row['region'];
                $input['rates'][$i]['countries'] = array_filter([(string) ($region['country'] ?? '')]);
                $input['rates'][$i]['regions'] = array_filter([$region['city_code'] ?? $region['province_code'] ?? null]);
            }
        }
        $values = SchemaForm::make($this->fields())->validate($input, ['rates.*.regions.*' => [function (string $attribute, mixed $value, \Closure $fail): void {
            if (! Region::query()->active()->whereKey((string) $value)->whereIn('level', [Region::LEVELS['province'], Region::LEVELS['city']])->exists()) {
                $fail('Choose a province or city from the list.');
            }
        }]]);
        DB::transaction(function () use ($values): void {
            TaxRate::query()->delete();
            foreach ((array) $values['rates'] as $row) {
                foreach (self::places((array) ($row['countries'] ?? []), (array) ($row['regions'] ?? [])) as [$country, $region]) {
                    TaxRate::query()->create([
                        'name' => $row['name'], 'tax_class' => $row['tax_class'] ?: 'standard', 'rate' => (int) round((float) $row['percent'] * 100),
                        'country' => $country, 'region_code' => $region,
                        'compound' => (bool) ($row['compound'] ?? false), 'shipping' => (bool) ($row['shipping'] ?? false), 'priority' => (int) ($row['priority'] ?? 0),
                    ]);
                }
            }
        });
        app(ActivityRecorder::class)->record('updated', 'Store settings: Tax rates', [], 'store_setting');

        return back()->with('success', 'Tax rates saved.');
    }

    /**
     * Where a rate in the form applies, as stored rows [country, region code]: one per
     * country, or for Indonesia one per province or city chosen; no country is everywhere.
     *
     * @param  array<int, mixed>  $countries
     * @param  array<int, mixed>  $regions
     * @return list<array{0: string|null, 1: string|null}>
     */
    public static function places(array $countries, array $regions): array
    {
        $countries = array_values(array_unique(array_filter(array_map(fn ($c) => strtoupper(trim((string) $c)), $countries))));
        $regions = array_values(array_unique(array_filter(array_map(fn ($r) => trim((string) $r), $regions))));
        // Provinces and cities count only with Indonesia chosen (the field hides without it, keeping what it had).
        if ($countries === []) {
            return [[null, null]];
        }
        $places = [];
        foreach ($countries as $country) {
            foreach ($country === 'ID' && $regions !== [] ? $regions : [null] as $region) {
                $places[] = [$country, $region];
            }
        }

        return $places;
    }

    /**
     * Stored rows back as the form's rates: rows alike but for where they apply are one rate.
     * Everywhere, whole countries and Indonesian regions stay separate rates, so a
     * country-wide rate and a provincial one never merge.
     *
     * @param  array<int, TaxRate>  $rates
     * @return list<array<string, mixed>>
     */
    public static function grouped(array $rates): array
    {
        $groups = [];
        foreach ($rates as $r) {
            $where = $r->region_code !== null ? 'regions' : ($r->country !== null ? 'countries' : 'everywhere');
            $key = json_encode([$r->name, $r->tax_class, $r->rate, (bool) $r->compound, (bool) $r->shipping, (int) $r->priority, $where]);
            $groups[$key] ??= ['name' => $r->name, 'tax_class' => $r->tax_class, 'percent' => $r->rate / 100, 'countries' => [], 'regions' => [],
                'compound' => (bool) $r->compound, 'shipping' => (bool) $r->shipping, 'priority' => (int) $r->priority];
            if ($r->country !== null && ! in_array(strtoupper($r->country), $groups[$key]['countries'], true)) {
                $groups[$key]['countries'][] = strtoupper($r->country);
            }
            if ($r->region_code !== null && ! in_array($r->region_code, $groups[$key]['regions'], true)) {
                $groups[$key]['regions'][] = $r->region_code;
            }
        }

        return array_values($groups);
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
            ['handle' => 'rates', 'type' => 'repeater', 'label' => 'Rates', 'instructions' => 'Leave the countries empty for everywhere. A rate for a province or city replaces the same-named general rate there.', 'config' => ['max' => 200, 'fields' => [
                ['handle' => 'name', 'type' => 'text', 'label' => 'Name (e.g. PPN)', 'required' => true, 'translatable' => false, 'config' => ['max' => 80]],
                ['handle' => 'tax_class', 'type' => 'select', 'label' => 'Tax class', 'config' => ['options' => $classes]],
                ['handle' => 'percent', 'type' => 'number', 'label' => 'Rate (%)', 'required' => true, 'config' => ['min' => 0, 'max' => 100]],
                ['handle' => 'countries', 'type' => 'commerce_choices', 'label' => 'Countries', 'translatable' => false, 'width' => 50,
                    'config' => ['source' => 'countries', 'uppercase' => true, 'creatable' => false, 'placeholder' => 'Everywhere'], 'instructions' => 'Empty: everywhere.'],
                ['handle' => 'regions', 'type' => 'commerce_choices', 'label' => 'Provinces and cities in Indonesia', 'translatable' => false, 'width' => 50,
                    'config' => ['source' => 'id_regions', 'creatable' => false, 'placeholder' => 'All of Indonesia'], 'instructions' => 'Only these places in Indonesia. Empty: the whole country.',
                    'condition' => ['field' => 'countries', 'operator' => 'equals', 'value' => 'ID']],
                ['handle' => 'compound', 'type' => 'toggle', 'label' => 'Compound (on top of other taxes)'],
                ['handle' => 'shipping', 'type' => 'toggle', 'label' => 'Also on shipping'],
                ['handle' => 'priority', 'type' => 'number', 'label' => 'Priority', 'validation' => ['integer']],
            ]]],
        ];
    }
}
