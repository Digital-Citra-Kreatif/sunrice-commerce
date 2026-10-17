<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Sunrice\Commerce\Admin\SchemaForm;
use Sunrice\Commerce\Settings\Actions\SaveStoreSettings;
use Sunrice\Commerce\Settings\SettingsRegistry;
use Sunrice\Commerce\Settings\SettingsSection;
use Sunrice\Commerce\Settings\StoreSettings;

/** Settings → Store: one section per page, with the section menu. */
class SettingsController extends Controller
{
    /** The first section (or the Features page) this user may open. */
    public function index(Request $request, SettingsRegistry $registry): RedirectResponse
    {
        $first = array_key_first($registry->visibleTo($request->user()));
        if ($first !== null) {
            return redirect()->route('sunrice.admin.commerce.settings.show', $first);
        }
        abort_unless($request->user()->can('commerce.settings.features'), 403);

        return redirect()->route('sunrice.admin.commerce.settings.features');
    }

    public function show(Request $request, string $section, SettingsRegistry $registry, StoreSettings $settings): Response
    {
        $definition = $this->section($request, $registry, $section);
        $form = SchemaForm::make($definition->fields(), $settings->section($section))
            ->action(route('sunrice.admin.commerce.settings.update', $section, false), 'put');

        return Inertia::render($definition->page ?? 'Commerce/Settings/Section', [
            'section' => ['key' => $definition->key, 'label' => $definition->label],
            'sections' => static::menu($request->user()),
            'form' => $form,
        ]);
    }

    public function update(Request $request, string $section, SettingsRegistry $registry, SaveStoreSettings $save): RedirectResponse
    {
        $this->section($request, $registry, $section);
        try {
            $save->handle($section, (array) $request->input('values', []));
        } catch (ValidationException $e) {
            throw SchemaForm::prefixed($e);
        }

        return back()->with('success', 'Settings saved.');
    }

    protected function section(Request $request, SettingsRegistry $registry, string $key): SettingsSection
    {
        $section = $registry->get($key);
        abort_if($section === null || ($section->feature !== null && ! commerce_feature($section->feature)), 404);
        abort_unless($request->user()->can($section->permission()), 403);

        return $section;
    }

    /**
     * The section menu: the sections this user may open, and Features.
     *
     * @return array<int, array{key: string, label: string, href: string}>
     */
    public static function menu(mixed $user): array
    {
        $menu = [];
        foreach (app(SettingsRegistry::class)->visibleTo($user) as $key => $section) {
            $menu[] = ['key' => $key, 'label' => $section->label, 'href' => "commerce/settings/{$key}"];
        }
        if (commerce_feature('taxes') && $user->can('commerce.settings.taxes')) {
            $menu[] = ['key' => 'tax-rates', 'label' => 'Tax rates', 'href' => 'commerce/settings/tax-rates'];
        }
        if ($user->can('commerce.settings.features')) {
            $menu[] = ['key' => 'features', 'label' => 'Features', 'href' => 'commerce/settings/features'];
        }

        return $menu;
    }
}
