<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Admin;

use Illuminate\Contracts\Auth\Access\Authorizable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Sunrice\Cms\Models\Collection;
use Sunrice\Cms\Models\Term;
use Sunrice\Commerce\Catalog\ProductContentFields;
use Sunrice\Commerce\Catalog\ProductDefaults;
use Sunrice\Commerce\Promotions\PriceRules\PriceRule;
use Sunrice\Commerce\Settings\StoreSettings;

final class EditorPresentation
{
    /** @return array<string, mixed> */
    public static function forRequest(Request $request): array
    {
        $collection = $request->route('collection');
        if ($request->routeIs('sunrice.admin.cms.collections.entries.create', 'sunrice.admin.cms.collections.entries.edit')
            && $collection instanceof Collection && in_array($collection->handle, ShopNavigation::collections(), true)) {
            $pickers = [];
            foreach ([
                'brand' => [__('Select brand'), __('Search brands')],
                'category' => [__('Select categories'), __('Search categories')],
                'tag' => [__('Select tags'), __('Search tags')],
            ] as $type => [$select, $search]) {
                $handle = config("commerce.catalog.{$type}_taxonomy");
                if (is_string($handle) && $handle !== '') {
                    $pickers[$handle] = ['select' => $select, 'search' => $search];
                }
            }

            return ['entry' => ['create' => __('New product'), 'save' => __('Save draft'), 'organization' => __('Organization'), 'pickers' => $pickers]];
        }

        $term = $request->route('term');
        $actor = $request->user();
        if (! $request->routeIs('sunrice.admin.cms.taxonomies.terms.edit') || ! $term instanceof Term || ! $actor instanceof Authorizable) {
            return [];
        }
        $scope = match ($term->taxonomy->handle) {
            config('commerce.catalog.category_taxonomy') => 'category',
            config('commerce.catalog.brand_taxonomy') => 'brand',
            default => null,
        };
        if ($scope === null) {
            return [];
        }

        $sections = [];
        if ($actor->can('commerce.settings.catalog')) {
            $sections[] = [
                'title' => __('Catalog defaults'),
                'description' => __('Brand overrides take priority over category overrides. Product overrides take priority over both.'),
                'items' => self::defaults($term, $scope),
            ];
        }
        if (ShopNavigation::allows($actor, 'commerce.pricing-rules.manage', 'pricing_rules')) {
            $sections[] = [
                'title' => __('Active pricing rules'),
                'description' => __('These rules are running now. Customer, product and quantity conditions can affect the final price.'),
                'items' => self::priceRules($term, $scope),
            ];
        }

        return $sections === [] ? [] : ['term' => $sections];
    }

    /** @return list<array<string, string>> */
    private static function defaults(Term $term, string $scope): array
    {
        $settings = app(StoreSettings::class);
        $resolver = app(ProductDefaults::class);
        $fields = [
            ['handle' => 'purchase_mode', 'label' => 'Storefront button'],
            ...ProductContentFields::defaults(scoped: true),
        ];
        $items = [];
        foreach ($fields as $field) {
            $key = $field['handle'];
            $store = $key === 'purchase_mode' ? ($settings->get('catalog.default_purchase_mode') ?: 'cart') : $settings->get("catalog.{$key}");
            $resolved = $resolver->resolve($key, null, null, $store, [$term->id]);
            $value = match ($key) {
                'purchase_mode' => ProductDefaults::MODES[(string) $resolved['value']] ?? null,
                'size_guide_visibility' => $resolved['value'] === 'show' ? __('Shown') : __('Hidden'),
                default => filled($resolved['value']) ? __('Configured') : __('Empty'),
            };
            $source = $resolved['source'] === $scope ? __('Override on this :scope', ['scope' => $scope]) : __('Inherited from Store settings');
            $items[] = ['label' => (string) $field['label'], 'detail' => implode(' · ', array_filter([$value, $source]))];
        }
        $items[] = ['label' => (string) __('Open Catalog settings'), 'href' => route('sunrice.admin.commerce.settings.show', ['section' => 'catalog'], false)];

        return $items;
    }

    /** @return list<array<string, string>> */
    private static function priceRules(Term $term, string $scope): array
    {
        $terms = [$term->id];
        if ($term->parent_id !== null) {
            $parents = Term::query()->where('taxonomy_id', $term->taxonomy_id)->pluck('parent_id', 'id');
            for ($parent = $term->parent_id; $parent !== null && ! in_array($parent, $terms, true); $parent = $parents->get($parent)) {
                $terms[] = $parent;
            }
        }
        $now = now();
        $rules = PriceRule::query()->where('active', true)
            ->where(fn (Builder $query) => $query->whereNull('starts_at')->orWhere('starts_at', '<=', $now))
            ->where(fn (Builder $query) => $query->whereNull('ends_at')->orWhere('ends_at', '>', $now))
            ->where(fn (Builder $query) => $query->where('scope', 'all')->orWhere(fn (Builder $scoped) => $scoped
                ->where('scope', $scope === 'category' ? 'categories' : 'brands')
                ->whereHas('targets', fn (Builder $targets) => $targets->where('target_type', 'term')->whereIn('target_id', $terms))))
            ->orderByDesc('priority')->orderBy('name')->limit(20)->get(['id', 'name', 'scope']);
        $items = $rules->map(fn (PriceRule $rule) => [
            'label' => $rule->name, 'detail' => $rule->scope === 'all' ? __('Store-wide') : __('Category or brand rule'),
            'href' => route('sunrice.admin.commerce.pricing-rules.edit', ['rule' => $rule->id], false),
        ])->all();
        if ($items === []) {
            $items[] = ['label' => __('No active pricing rules target this :scope.', ['scope' => $scope])];
        }
        $items[] = ['label' => (string) __('Open Pricing rules'), 'href' => route('sunrice.admin.commerce.pricing-rules', [], false)];

        return $items;
    }
}
