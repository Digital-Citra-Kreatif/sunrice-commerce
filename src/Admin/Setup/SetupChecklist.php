<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Admin\Setup;

use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Settings\StoreSettings;
use Throwable;

class SetupChecklist
{
    /** @var array<string, SetupStep> */
    protected array $steps = [];

    public function register(SetupStep $step): void
    {
        $this->steps[$step->key] = $step;
    }

    /** @return array<int, array{key: string, label: string, description: string, href: string, done: bool}> */
    public function evaluate(): array
    {
        $features = app(Features::class);
        $steps = array_filter($this->steps, fn (SetupStep $s) => $s->feature === null || $features->active($s->feature));
        usort($steps, fn (SetupStep $a, SetupStep $b) => $a->position <=> $b->position);

        return array_map(function (SetupStep $step): array {
            try {
                $done = (bool) ($step->done)();
            } catch (Throwable $e) {
                report($e);
                $done = false;
            }

            return ['key' => $step->key, 'label' => $step->label, 'description' => $step->description, 'href' => $step->href, 'done' => $done];
        }, $steps);
    }

    public static function registerBuiltin(self $checklist): void
    {
        $settings = fn () => app(StoreSettings::class);
        $checklist->register(new SetupStep('details', 'Add your store details', 'commerce/settings/general',
            fn () => filled($settings()->get('general.name')) && filled($settings()->get('general.email')),
            position: 10, description: 'Name and email, for invoices and order emails.'));
        $checklist->register(new SetupStep('address', 'Add your store address', 'commerce/settings/general',
            fn () => filled($settings()->get('general.address.line1')) && filled($settings()->get('general.address.region.city_code') ?? $settings()->get('general.address.region.country')),
            position: 20, description: 'Printed on invoices and used as the shipping origin.'));
    }
}
