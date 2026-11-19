<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Sunrice\Commerce\Admin\ShopNavigation;
use Symfony\Component\HttpFoundation\Response;

final class MarkProductNavigation
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->routeIs('sunrice.admin.cms.collections.entries.*')) {
            return $next($request);
        }

        // The panel has already shared its permission-filtered sidebar.
        $navigation = Inertia::getShared('navigation');
        if (! $navigation instanceof Closure) {
            return $next($request);
        }

        Inertia::share('navigation', fn (): array => ShopNavigation::withProductEditorPaths($navigation()));
        try {
            return $next($request);
        } finally {
            Inertia::share('navigation', $navigation);
        }
    }
}
