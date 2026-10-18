<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\SimpleExcel\SimpleExcelWriter;
use Sunrice\Commerce\Analytics\Period;
use Sunrice\Commerce\Analytics\Reports\Report;
use Sunrice\Commerce\Analytics\Reports\Reports;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Support\CsvCell;
use Symfony\Component\HttpFoundation\StreamedResponse;

/** Shop → Reports: one page for every report, with a date range, comparison and CSV export. */
class ReportsController extends Controller
{
    public function index(Reports $reports): RedirectResponse
    {
        $this->guard();
        $first = array_key_first($reports->available());
        abort_if($first === null, 404);

        return redirect()->route('sunrice.admin.commerce.reports.show', ['report' => $first]);
    }

    public function show(Request $request, Reports $reports, string $report): Response
    {
        $this->guard();
        $definition = $reports->find($report) ?? abort(404);
        $period = Period::fromRequest($request);

        return Inertia::render('Commerce/Reports/Show', [
            'report' => ['key' => $definition->key(), 'label' => $definition->label(), 'description' => $definition->description(), 'usesDates' => $definition->usesDates()],
            'reports' => array_values(array_map(fn (Report $r) => ['key' => $r->key(), 'label' => $r->label()], $reports->available())),
            'period' => [...$period->toArray(), 'compare' => (string) $request->query('compare', 'previous')],
            'result' => $definition->run($period)->toArray(),
            'exportUrl' => $request->user()->can('commerce.reports.export')
                ? route('sunrice.admin.commerce.reports.export', ['report' => $definition->key(), ...$request->query()], false) : null,
        ]);
    }

    /** The report's rows as CSV (amounts in currency units, not minor units). */
    public function export(Request $request, Reports $reports, string $report): StreamedResponse
    {
        $this->guard();
        $this->authorize('commerce.reports.export');
        $definition = $reports->find($report) ?? abort(404);
        $period = Period::fromRequest($request);
        $result = $definition->run($period);
        $decimals = (int) app(StoreSettings::class)->get('general.currency.decimals', 0);
        $name = $definition->key().($definition->usesDates() ? "-{$period->from}-{$period->to}" : '-'.now()->toDateString()).'.csv';

        return response()->streamDownload(function () use ($result, $decimals, $name): void {
            $writer = SimpleExcelWriter::streamDownload($name);
            foreach ([...$result->rows, ...($result->totals !== null ? [$result->totals] : [])] as $row) {
                $line = [];
                foreach ($result->columns as $column) {
                    $value = $row[$column['key']] ?? null;
                    $line[$column['label']] = $column['kind'] === 'money' && is_numeric($value) ? round((float) $value / (10 ** $decimals), $decimals) : $value;
                }
                $writer->addRow(array_map(CsvCell::safe(...), $line));
            }
            $writer->close();
        }, $name, ['Content-Type' => 'text/csv']);
    }

    protected function guard(): void
    {
        abort_unless(app(Features::class)->active('analytics'), 404);
        $this->authorize('commerce.reports.view');
    }
}
