<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Symfony\Component\HttpFoundation\Response;

/** Resolve Commerce admin models after the panel has authenticated the request. */
final class BindAdminModels
{
    public function __construct(private readonly SubstituteBindings $bindings) {}

    public function handle(Request $request, Closure $next): Response
    {
        return $this->bindings->handle($request, $next);
    }
}
