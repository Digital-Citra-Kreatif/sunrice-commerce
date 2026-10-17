<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Features\BuiltinFeatures;
use Sunrice\Commerce\Features\FeatureRegistry;
use Sunrice\Commerce\Features\Features;

/** Settings → Store → Features: the module switches, grouped. */
class FeaturesController extends Controller
{
    public function index(Request $request, FeatureRegistry $registry, Features $features): Response
    {
        $this->authorize('commerce.settings.features');
        $mode = $features->mode();

        $groups = [];
        foreach ($registry->all() as $feature) {
            $explain = $features->explain($feature->key);
            $groups[$feature->group][] = [
                'key' => $feature->key,
                'label' => $feature->label,
                'description' => $feature->description,
                'core' => $feature->core,
                'switched_on' => $explain['switched_on'],
                'active' => $explain['active'],
                'reasons' => array_map(fn (string $reason) => static::reason($reason, $registry), $explain['reasons']),
                'requires' => array_map(fn (string $k) => $registry->get($k)->label ?? $k, $features->requirements($feature, $mode)),
                'dependents' => array_values(array_filter(
                    array_map(fn (string $k) => $features->active($k) ? ['key' => $k, 'label' => $registry->get($k)->label ?? $k] : null, $registry->dependentsOf($feature->key)),
                )),
                'modes' => $feature->modes,
                'essential' => in_array($feature->key, ToggleFeature::ESSENTIAL[$mode] ?? [], true),
            ];
        }

        // Built-in groups first, in their order; extension groups after.
        $labels = BuiltinFeatures::GROUPS;
        $groups = array_replace(array_intersect_key(array_fill_keys(array_keys($labels), []), $groups), $groups);

        return Inertia::render('Commerce/Settings/Features', [
            'sections' => SettingsController::menu($request->user()),
            'mode' => ['key' => $mode, 'label' => ToggleFeature::MODE_LABELS[$mode] ?? $mode],
            'groups' => array_map(fn (string $group, array $items) => ['key' => $group, 'label' => $labels[$group] ?? ucfirst($group), 'features' => $items], array_keys($groups), $groups),
            'updateUrl' => route('sunrice.admin.commerce.settings.features.update', '__key__', false),
        ]);
    }

    public function update(Request $request, string $feature, FeatureRegistry $registry, ToggleFeature $toggle): RedirectResponse
    {
        $this->authorize('commerce.settings.features');
        $definition = $registry->get($feature) ?? abort(404);
        $on = $request->boolean('on');

        $changes = $toggle->handle($feature, $on);

        $message = $definition->label.($on ? ' switched on.' : ' switched off.');
        if ($changes['deactivated'] !== [] && ! $on) {
            $off = array_filter($changes['deactivated'], fn (string $k) => $k !== $feature);
            if ($off !== []) {
                $message .= ' Also off now: '.implode(', ', array_map(fn (string $k) => $registry->get($k)->label ?? $k, $off)).'.';
            }
        }

        return back()->with('success', $message);
    }

    protected static function reason(string $reason, FeatureRegistry $registry): string
    {
        [$kind, $value] = explode(':', $reason, 2) + [1 => ''];

        return $kind === 'mode'
            ? 'Not available in '.(ToggleFeature::MODE_LABELS[$value] ?? $value).' mode'
            : 'Needs '.($registry->get($value)->label ?? $value);
    }
}
