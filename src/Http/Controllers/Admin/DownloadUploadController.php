<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Sunrice\Commerce\Catalog\Models\DownloadFile;

/**
 * POST commerce/api/downloads — a digital product's file, stored on the
 * private downloads disk as an unattached row; publishing the product
 * attaches it (ProductProjector).
 */
class DownloadUploadController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $this->authorizeFeature('digital');
        abort_unless($request->user()->can('sunrice.assets.upload') || $request->user()->can('commerce.inventory.adjust'), 403);
        $request->validate(['file' => ['required', 'file', 'max:'.((int) config('commerce.downloads.max_upload_mb', 512) * 1024)]]);

        $file = $request->file('file');
        $disk = (string) config('commerce.downloads.disk', 'local');
        $path = $file->storeAs('commerce/downloads/'.now()->format('Y/m'), Str::random(40).'.'.$file->getClientOriginalExtension(), ['disk' => $disk]);

        $row = DownloadFile::query()->create([
            'type' => 'file',
            'name' => pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
            'disk' => $disk,
            'path' => $path,
            'filename' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'uploaded_by' => $request->user()->getAuthIdentifier(),
            'attached' => false,
        ]);

        return response()->json(['data' => ['id' => $row->id, 'filename' => $row->filename, 'size' => $row->size]], 201);
    }
}
