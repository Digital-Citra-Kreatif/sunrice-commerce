<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Features\Http;

use Closure;
use Illuminate\Http\Request;
use Sunrice\Commerce\Features\Features;
use Symfony\Component\HttpFoundation\Response;

/** Route middleware `commerce.feature:vouchers` (several: `commerce.feature:cart,checkout`): 404 while inactive. */
class EnsureFeatureActive
{
    public function handle(Request $request, Closure $next, string ...$features): Response
    {
        foreach ($features as $feature) {
            abort_unless(app(Features::class)->active($feature), 404);
        }

        return $next($request);
    }
}
