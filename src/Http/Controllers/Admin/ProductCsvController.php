<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Sunrice\Cms\Models\Collection;
use Sunrice\Cms\Support\Access;
use Sunrice\Commerce\Catalog\Csv\ProductCsv;
use Sunrice\Commerce\Catalog\Csv\ProductCsvCreator;
use Sunrice\Commerce\Support\ActivityRecorder;
use Sunrice\Commerce\Support\CsvExport;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Shop → Products → Export / Import: every variant as CSV, and price,
 * stock and other changes from a CSV by SKU, previewed before they apply.
 */
class ProductCsvController extends Controller
{
    public function export(Request $request, ProductCsv $csv): StreamedResponse
    {
        $this->authorize('commerce.products.export');
        $collections = $this->collections($request, 'view');
        abort_if($collections === [], 403);
        app(ActivityRecorder::class)->record('exported', 'Products', [], 'products');

        return response()->streamDownload(function () use ($csv, $collections): void {
            $writer = CsvExport::toOutput();
            foreach ($csv->rows($collections) as $row) {
                $writer->addRow($row);
            }
            $writer->close();
        }, 'products-'.now()->format('Ymd-His').'.csv', ['Content-Type' => 'text/csv', 'Cache-Control' => 'private, no-store']);
    }

    public function form(Request $request): Response
    {
        abort_if($this->collections($request, 'update') === [], 403);

        $report = $request->query('report');

        return Inertia::render('Commerce/Products/Import', [
            'result' => is_string($report) && preg_match('/^[a-zA-Z0-9]{40}$/D', $report) ? Cache::get(self::key($request, $report).':result') : null,
            'columns' => ProductCsv::COLUMNS, 'changeable' => ProductCsv::CHANGEABLE, 'maxRows' => ProductCsv::MAX_ROWS,
            'canAdjustStock' => $request->user()->can('commerce.inventory.adjust'), 'canCreate' => $this->mayCreate($request),
            'canExport' => $request->user()->can('commerce.products.export') && $this->collections($request, 'view') !== [],
            'preview' => null, 'token' => null,
        ]);
    }

    public function preview(Request $request, ProductCsv $csv): Response|RedirectResponse
    {
        abort_if($this->collections($request, 'update') === [], 403);
        $options = $request->validate(['file' => ['required', 'file', 'mimetypes:text/csv,text/plain,application/csv,application/vnd.ms-excel', 'max:5120'],
            'create' => ['nullable', 'boolean'], 'publish' => ['nullable', 'boolean']]);
        $create = (bool) ($options['create'] ?? false);
        $stream = fopen((string) $request->file('file')?->getRealPath(), 'r');
        abort_if($stream === false, 422);
        $preview = $csv->preview($stream, $request->user(), $create);
        fclose($stream);
        if ($preview['error'] !== null) {
            return back()->withErrors(['file' => $preview['error']]);
        }
        $token = Str::random(40);
        Cache::put(self::key($request, $token), ['rows' => $preview['rows'], 'publish' => (bool) ($options['publish'] ?? false)], now()->addHour());

        return Inertia::render('Commerce/Products/Import', [
            'columns' => ProductCsv::COLUMNS, 'changeable' => ProductCsv::CHANGEABLE, 'maxRows' => ProductCsv::MAX_ROWS,
            'canAdjustStock' => $request->user()->can('commerce.inventory.adjust'), 'canCreate' => $this->mayCreate($request),
            'canExport' => $request->user()->can('commerce.products.export') && $this->collections($request, 'view') !== [],
            'preview' => $preview['rows'], 'token' => $token,
        ]);
    }

    public function apply(Request $request, ProductCsv $csv): RedirectResponse
    {
        abort_if($this->collections($request, 'update') === [], 403);
        $data = $request->validate(['token' => ['required', 'string', 'size:40']]);
        $key = self::key($request, $data['token']);
        $preview = Cache::lock($key.':apply', 10)->get(fn () => Cache::pull($key));
        $rows = is_array($preview) ? ($preview['rows'] ?? null) : null;
        if (! is_array($rows)) {
            return redirect()->route('sunrice.admin.commerce.products.import')->withErrors(['file' => 'That preview has expired: upload the file again.']);
        }
        $result = $csv->applyWithReport($rows, $request->user());
        $count = $result['updated'];
        $created = app(ProductCsvCreator::class)->create($rows, $request->user(), (bool) ($preview['publish'] ?? false));
        $message = $count === 1 ? '1 variant updated.' : "{$count} variants updated.";
        if ($created > 0) {
            $message .= ' '.($created === 1 ? '1 product created.' : "{$created} products created.");
        }

        if ($result['skipped'] !== []) {
            Cache::put($key.':result', ['summary' => $message, 'skipped' => $result['skipped']], now()->addHour());

            return redirect()->route('sunrice.admin.commerce.products.import', ['report' => $data['token']]);
        }

        return redirect()->route('sunrice.admin.commerce.products')->with('success', $message);
    }

    /** Whether the import may create products (the user may create entries in the main product collection). */
    protected function mayCreate(Request $request): bool
    {
        $handle = (string) (config('commerce.catalog.collections', ['products'])[0] ?? 'products');
        $collection = Collection::query()->where('handle', $handle)->first();

        return $collection !== null && Access::entries($request->user(), 'create', $collection);
    }

    /** A preview belongs to the user who made it. */
    protected static function key(Request $request, string $token): string
    {
        return 'commerce:product-import:'.$request->user()->getAuthIdentifier().':'.$token;
    }

    /** @return list<int> the product collections the user may view or update */
    protected function collections(Request $request, string $ability): array
    {
        return Collection::query()->whereIn('handle', (array) config('commerce.catalog.collections', ['products']))->get()
            ->filter(fn (Collection $c) => Access::entries($request->user(), $ability, $c))->pluck('id')->map(fn ($id) => (int) $id)->values()->all();
    }
}
