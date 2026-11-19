<?php

declare(strict_types=1);

use Illuminate\Routing\Middleware\SubstituteBindings;
use Sunrice\Admin\PanelRoutes;
use Sunrice\Commerce\Http\Middleware\BindAdminModels;

it('authenticates Commerce admin routes before resolving models', function () {
    $router = app('router');
    foreach (['orders.show', 'customers.show'] as $name) {
        $route = $router->getRoutes()->getByName('sunrice.admin.commerce.'.$name);
        $middleware = $router->gatherRouteMiddleware($route);
        $binding = array_search(BindAdminModels::class, $middleware, true);
        expect($middleware)->not->toContain(SubstituteBindings::class)
            ->and($binding)->not->toBeFalse();
        foreach (PanelRoutes::authenticated() as $guard) {
            expect(array_search($guard, $middleware, true))->not->toBeFalse()->toBeLessThan($binding);
        }
    }
});
