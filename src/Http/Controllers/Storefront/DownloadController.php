<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Storefront;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Sunrice\Commerce\Digital\Models\DownloadGrant;
use Sunrice\Commerce\Digital\Models\DownloadLog;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

/**
 * GET downloads/{token}: the file behind a grant. Each download counts
 * (atomically, against the limit) and is logged; links redirect, cloud
 * disks redirect to a short-lived URL, local files are streamed. Works
 * while the digital module is off, so bought files stay available.
 */
class DownloadController
{
    public function __invoke(Request $request, string $token): StreamedResponse|RedirectResponse
    {
        abort_unless(strlen($token) === 64, 404);
        $grant = DownloadGrant::query()->with('file')->where('token', $token)->first();
        abort_if($grant === null, 404);
        if (($refusal = $grant->refusal()) !== null) {
            abort(410, __('commerce::digital.'.$refusal));
        }

        $counted = DB::table('commerce_download_grants')->where('id', $grant->id)
            ->where(fn ($q) => $q->whereNull('downloads_remaining')->orWhere('downloads_remaining', '>', 0))
            ->update([
                'downloads_remaining' => DB::raw('CASE WHEN downloads_remaining IS NULL THEN NULL ELSE downloads_remaining - 1 END'),
                'download_count' => DB::raw('download_count + 1'),
                'last_downloaded_at' => now(),
                'updated_at' => now(),
            ]);
        abort_if($counted !== 1, 410, __('commerce::digital.used_up'));
        DownloadLog::query()->create(['grant_id' => $grant->id, 'ip_address' => $request->ip(), 'user_agent' => mb_substr((string) $request->userAgent(), 0, 255)]);

        $file = $grant->file;
        if ($file->type === 'url' || ($file->path === null && $file->url !== null)) {
            return redirect()->away((string) $file->url);
        }
        abort_if($file->disk === null || $file->path === null, 404);
        $disk = Storage::disk($file->disk);
        if (! $disk->exists($file->path)) {
            abort(404);
        }
        try {
            if ($disk->providesTemporaryUrls() && config("filesystems.disks.{$file->disk}.driver") !== 'local') {
                return redirect()->away($disk->temporaryUrl($file->path, now()->addMinutes(5), ['ResponseContentDisposition' => 'attachment; filename="'.addslashes((string) ($file->filename ?? basename($file->path))).'"']));
            }
        } catch (Throwable) {
            // Fall back to streaming.
        }

        return $disk->download($file->path, $file->filename ?? basename($file->path), ['X-Content-Type-Options' => 'nosniff']);
    }
}
