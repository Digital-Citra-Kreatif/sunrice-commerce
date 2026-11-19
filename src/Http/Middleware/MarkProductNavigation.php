<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Traits\HasRoles;
use Sunrice\Admin\Http\Controllers\DashboardController;
use Sunrice\Commerce\Admin\ShopNavigation;
use Symfony\Component\HttpFoundation\Response;

final class MarkProductNavigation
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if ($request->routeIs('sunrice.admin.dashboard') && $request->route()?->getControllerClass() === DashboardController::class
            && $user !== null && in_array(HasRoles::class, class_uses_recursive($user), true) && $user->can('commerce.dashboard.view')
            && $user->hasRole('shop-manager')) {
            $response = $next($request);

            return $response->isSuccessful() ? to_route('sunrice.admin.commerce.dashboard') : $response;
        }

        // The panel has already shared its permission-filtered sidebar.
        $navigation = Inertia::getShared('navigation');
        if (! $navigation instanceof Closure) {
            return $next($request);
        }

        Inertia::share('navigation', fn (): array => ShopNavigation::withShopPaths($navigation(), $request->routeIs('sunrice.admin.cms.collections.entries.*')));
        try {
            return $next($request);
        } finally {
            Inertia::share('navigation', $navigation);
        }
    }
}
