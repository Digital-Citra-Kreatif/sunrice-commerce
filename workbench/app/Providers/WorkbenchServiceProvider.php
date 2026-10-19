<?php

declare(strict_types=1);

namespace Workbench\App\Providers;

use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

/**
 * The workbench store uses the starter theme as if it were published
 * (commerce:install --starter): the package's resources/views/starter is
 * looked up first, like an app's resources/views.
 */
class WorkbenchServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $starter = realpath(__DIR__.'/../../../resources/views/starter') ?: __DIR__.'/../../../resources/views/starter';
        View::prependLocation($starter);
        // Error pages (errors/404) are looked up in view.paths.
        config(['view.paths' => [$starter, ...(array) config('view.paths')]]);
    }
}
