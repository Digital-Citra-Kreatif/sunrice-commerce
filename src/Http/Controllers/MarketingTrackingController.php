<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Sunrice\Commerce\Marketing\Tracker;
use Sunrice\Support\Locales;

/**
 * Marketing email links (stateless, like webhooks: no session or CSRF;
 * the email's token is the secret): the open-tracking image, tracked
 * links and unsubscribing. They keep working when the module is off, so
 * links in emails already sent never break.
 */
class MarketingTrackingController extends Controller
{
    /** A transparent 1×1 GIF. */
    protected const PIXEL = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    public function open(string $token, Tracker $tracker): Response
    {
        if (config('commerce.marketing.track', true)) {
            $tracker->open($token);
        }

        return response((string) base64_decode(self::PIXEL), 200, [
            'Content-Type' => 'image/gif',
            'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
        ]);
    }

    public function click(string $token, string $link, Tracker $tracker): RedirectResponse
    {
        $url = $tracker->click($token, $link);

        return redirect()->away($url ?? url('/'));
    }

    public function unsubscribeForm(string $token, Tracker $tracker): Response
    {
        $send = $tracker->find($token);
        $this->locale($send?->locale);

        return response()->view('commerce::marketing.unsubscribe', ['send' => $send, 'done' => false, 'token' => $token])
            ->header('X-Robots-Tag', 'noindex, nofollow');
    }

    /** The form's button, and mail clients' one-click unsubscribe (RFC 8058). */
    public function unsubscribe(Request $request, string $token, Tracker $tracker): Response
    {
        $send = $tracker->unsubscribe($token);
        $this->locale($send?->locale);

        return response()->view('commerce::marketing.unsubscribe', ['send' => $send, 'done' => $send !== null, 'token' => $token], $send === null ? 404 : 200)
            ->header('X-Robots-Tag', 'noindex, nofollow');
    }

    protected function locale(?string $locale): void
    {
        app()->setLocale(in_array($locale, Locales::available(), true) ? (string) $locale : Locales::main());
    }
}
