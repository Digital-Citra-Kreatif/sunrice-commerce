<?php

declare(strict_types=1);

namespace Sunrice\Commerce;

use Illuminate\Contracts\Auth\Access\Authorizable;
use Sunrice\Admin\Assets\PluginBundle;
use Sunrice\Admin\BasePlugin;
use Sunrice\Admin\Dashboard\Widget;
use Sunrice\Admin\Navigation\NavigationItem;
use Sunrice\Admin\Panel;
use Sunrice\Admin\Permissions\Permission;
use Sunrice\Cms\Admin\ContentNavigation;
use Sunrice\Cms\CmsPlugin;
use Sunrice\Cms\Fields\FieldTypes;
use Sunrice\Commerce\Admin\Dashboard\StoreCard;
use Sunrice\Commerce\Admin\ShopNavigation;
use Sunrice\Commerce\Http\Controllers\Admin\SettingsController;
use Sunrice\Commerce\Mcp\StoreTools;
use Sunrice\Commerce\Permissions\CommercePermissions;
use Sunrice\Commerce\Settings\StoreSettings;

/**
 * The store, added to the panel after the CMS in the app's panel provider:
 *
 *     $panel->plugin(CmsPlugin::make())->plugin(CommercePlugin::make());
 *
 * Everything commerce adds to the admin: the Shop sidebar group, the
 * commerce permissions and roles, the admin pages and their bundle, the
 * Store card on the dashboard, the store tools for AI agents, the
 * Product data and other field types, and the developer docs.
 */
final class CommercePlugin extends BasePlugin
{
    public const ID = 'commerce';

    public function id(): string
    {
        return self::ID;
    }

    /** @return list<string> */
    public function requires(): array
    {
        return [CmsPlugin::ID];
    }

    public function register(Panel $panel): void
    {
        foreach (CommercePermissions::all() as $name => [$label, $group]) {
            $panel->permissions(Permission::make($name, $label, $group));
        }
        $panel->navigation(...ShopNavigation::items());
        $panel->navigationUsing(fn (): array => ShopNavigation::attributeItems());
        // Products and their taxonomies are listed under Shop → Products, so not again under Content and Taxonomies.
        app(ContentNavigation::class)->listElsewhere(collections: ShopNavigation::collections(...), taxonomies: ShopNavigation::taxonomies(...));
        // Settings → Store: one item in the Settings menu for anyone who may edit a section of it.
        $panel->navigation(NavigationItem::make('commerce-settings')->label('Store')->url('commerce/settings')->icon('shopping-bag')
            ->inSettings()->visible(fn (Authorizable $user): bool => SettingsController::menu($user) !== []));
        $panel->routes(function (): void {
            require __DIR__.'/../routes/admin.php';
        });
        // dist/ published to public/vendor/commerce (sunrice:assets, commerce:publish-assets).
        $panel->bundle(PluginBundle::make(self::ID)->named('Sunrice Commerce')
            ->publishedFrom(dirname(__DIR__).'/dist', public_path('vendor/commerce'))
            ->module('admin.js')->style('admin.css')->pages('Commerce/')
            // The Product data and other field inputs in the CMS's editors.
            ->extends('Cms/'));
        $panel->widgets(Widget::stat('commerce.store')->title('Store')->icon('shopping-bag')->link('commerce', 'Store dashboard')
            ->sort(10)->permission('commerce.dashboard.view')
            ->data(fn (Authorizable $user): array => StoreCard::data($user)));
        // The store's money format, for the admin's money inputs and figures.
        // On Settings → Store's pages, the panel's Settings menu too (SettingsLayout).
        $panel->share('commerce', fn (): array => [
            'currency' => (array) app(StoreSettings::class)->get('general.currency', []),
            'settingsNav' => str_starts_with((string) request()->route()?->getName(), 'sunrice.admin.commerce.settings') && ($user = request()->user()) instanceof Authorizable
                ? $panel->settingsNavigation($user) : [],
        ]);
        $panel->tools(...StoreTools::ALL);
        $panel->aiInstructions(StoreTools::INSTRUCTIONS);
        $panel->defaultRole('shop-manager', CommercePermissions::shopManager());
        $panel->privilegedPermissions('commerce.settings.*', 'commerce.orders.refund', 'commerce.payments.verify', 'commerce.customers.delete');
        $panel->docs('Store', dirname(__DIR__).'/docs');

        app(FieldTypes::class)->register(
            Admin\Fields\MoneyField::class,
            Admin\Fields\DateTimeRangeField::class,
            Admin\Fields\RegionField::class,
            Admin\Fields\TargetsField::class,
            Catalog\ProductField::class,
        );
    }
}
