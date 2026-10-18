<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Analytics;

use Illuminate\Http\Request;

/** Which storefront requests count: not bots, not staff, not previews. */
class VisitorFilter
{
    public function counts(?Request $request): bool
    {
        if ($request === null || app()->runningInConsole() && ! app()->runningUnitTests()) {
            return true;
        }
        if ($request->attributes->get('sunrice.preview') === true) {
            return false;
        }
        $agent = strtolower((string) $request->userAgent());
        if ($agent === '') {
            return false;
        }
        foreach ((array) config('commerce.analytics.bot_user_agents', []) as $bot) {
            if ($bot !== '' && str_contains($agent, strtolower((string) $bot))) {
                return false;
            }
        }
        $user = $request->user();

        return ! ($user !== null && $user->can('sunrice.access-admin'));
    }
}
