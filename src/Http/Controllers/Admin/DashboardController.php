<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Inertia\Inertia;
use Inertia\Response;
use Sunrice\Commerce\Admin\Dashboard\DashboardCards;
use Sunrice\Commerce\Admin\Setup\SetupChecklist;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Health\HealthRegistry;

/** Shop → Dashboard: the setup checklist, health, figures and to-dos. */
class DashboardController extends Controller
{
    public function __invoke(SetupChecklist $checklist, HealthRegistry $health, Features $features, DashboardCards $cards): Response
    {
        $this->authorize('commerce.dashboard.view');
        $mode = $features->mode();

        return Inertia::render('Commerce/Dashboard', [
            'mode' => ['key' => $mode, 'label' => ToggleFeature::MODE_LABELS[$mode] ?? $mode],
            'setup' => $checklist->evaluate(),
            'health' => array_map(fn (string $key, array $outcome) => [
                'key' => $key,
                'label' => $outcome['label'],
                'status' => $outcome['result']->status,
                'message' => $outcome['result']->message,
                'fix' => $outcome['result']->fix,
            ], array_keys($results = $health->run()), $results),
            // Figures and to-dos are computed after the page shows.
            'kpis' => Inertia::defer(fn () => $cards->kpis(request()->user())),
            'todo' => Inertia::defer(fn () => $cards->todo(request()->user())),
        ]);
    }
}
