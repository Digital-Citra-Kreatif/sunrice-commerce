<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Mcp\Tools;

use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;
use Sunrice\Commerce\Admin\Dashboard\DashboardCards;
use Sunrice\Commerce\Features\FeatureRegistry;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Mcp\CommerceTool;
use Sunrice\Commerce\Mcp\OrderData;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Sunrice;

#[IsReadOnly]
#[Description('Start here for store work: the store\'s name, selling mode (shop, quote or WhatsApp), currency, which store modules are on, what needs doing (orders to ship, payments to verify, quotes, low stock) and which store tools you may use. Money in every store tool is an integer in the currency\'s smallest unit plus a formatted string.')]
class GetStoreInfoTool extends CommerceTool
{
    protected string $name = 'get_store_info';

    protected function run(Request $request): Response
    {
        $settings = app(StoreSettings::class);
        $features = app(Features::class);
        $todo = app(DashboardCards::class)->todo(auth()->user());

        return $this->json([
            'name' => $settings->get('general.name'),
            'email' => $settings->get('general.email'),
            'selling_mode' => $features->mode(),
            'currency' => ['code' => $settings->get('general.currency.code', 'IDR'), 'decimals' => (int) $settings->get('general.currency.decimals', 0),
                'example' => OrderData::money(150000)['formatted']],
            'orders_paused' => (bool) $settings->get('general.pause_orders', false),
            'modules' => array_values(array_map(fn ($f) => ['key' => $f->key, 'label' => $f->label, 'on' => $features->active($f->key)], app(FeatureRegistry::class)->all())),
            'todo' => array_map(fn (array $t) => ['what' => $t['label'], 'count' => $t['count']], $todo),
            'tools' => array_values(array_map(fn (string $class) => app($class)->name(), array_filter(app(Sunrice::class)->mcpTools(),
                fn (string $class) => is_subclass_of($class, CommerceTool::class) && app($class)->shouldRegister()))),
        ]);
    }
}
