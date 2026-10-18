import { adminUrl, inertia, React, Sunrice, ui } from '../../lib/sunrice';
import { Chart } from '../../components/Chart';
import { EmptyState } from '../../components/EmptyState';
import { KpiCard } from '../../components/KpiCard';
import { PageHeader } from '../../components/PageHeader';
import { cn } from '../../lib/cn';
import { formatMoney } from '../../lib/money';
import { useCommerceShared } from '../../lib/store';

type Kind = 'text' | 'money' | 'count' | 'percent' | 'date';
type Row = Record<string, unknown> & { href?: string | null };

interface Props {
    report: { key: string; label: string; description: string; usesDates: boolean };
    reports: Array<{ key: string; label: string }>;
    period: { from: string; to: string; preset: string | null; interval: string; compare: string; presets: Record<string, string> };
    result: {
        columns: Array<{ key: string; label: string; kind: Kind }>;
        rows: Row[];
        totals: Row | null;
        chart: { kind: 'line' | 'bar'; xKey: string; series: Array<{ key: string; label: string }>; data: Row[] } | null;
        summary: Array<{ key: string; label: string; kind: Kind; value: number; previous: number | null; change: number | null }>;
    };
    exportUrl: string | null;
}

const count = (v: number) => v.toLocaleString(undefined, { maximumFractionDigits: 0 });

function format(value: unknown, kind: Kind): string {
    if (value === null || value === undefined || value === '') return '—';
    if (typeof value !== 'number') return kind === 'date' && /^\d{4}-\d{2}-\d{2}$/.test(String(value)) ? new Date(`${value}T00:00:00`).toLocaleDateString() : String(value);
    if (kind === 'money') return formatMoney(value);
    if (kind === 'percent') return `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })}%`;
    return count(value);
}

const numeric = (kind: Kind) => kind === 'money' || kind === 'count' || kind === 'percent';

export default function ReportShow({ report, reports, period, result, exportUrl }: Props) {
    const { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
        Table, TableBody, TableCell, TableHead, TableHeader, TableRow } = ui;
    const { Link, router } = inertia;
    useCommerceShared();
    Sunrice.useBreadcrumbs([{ label: 'Shop', href: adminUrl('commerce') }, { label: 'Reports', href: adminUrl('commerce/reports') }, { label: report.label }]);
    const [from, setFrom] = React.useState(period.from);
    const [to, setTo] = React.useState(period.to);
    const visit = (query: Record<string, string>) =>
        router.get(adminUrl(`commerce/reports/${report.key}`), { from: period.from, to: period.to, interval: period.interval, compare: period.compare, ...query }, { preserveScroll: true });
    const chartFormat = result.chart && result.columns.find((c) => c.key === result.chart?.series[0]?.key)?.kind === 'money' ? (v: number) => formatMoney(v) : count;

    return (
        <div className="cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:grid-cols-1 cm:gap-6 cm:p-4 cm:md:p-6">
            <PageHeader title="Reports" description={report.description || undefined}
                actions={exportUrl ? <Button asChild variant="outline"><a href={exportUrl}>Export CSV</a></Button> : undefined} />

            <nav aria-label="Reports" className="cm:flex cm:flex-wrap cm:gap-1">
                {reports.map((r) => (
                    <Link key={r.key} href={adminUrl(`commerce/reports/${r.key}`)} aria-current={r.key === report.key ? 'page' : undefined}
                        className={cn('cm:rounded-md cm:px-3 cm:py-1.5 cm:text-sm', r.key === report.key ? 'cm:bg-primary cm:text-primary-foreground' : 'cm:hover:bg-muted')}>
                        {r.label}
                    </Link>
                ))}
            </nav>

            {report.usesDates && (
                <Card>
                    <CardContent className="cm:flex cm:flex-wrap cm:items-end cm:gap-3 cm:pt-6">
                        <div className="cm:grid cm:gap-1">
                            <Label htmlFor="report-preset">Period</Label>
                            <Select value={period.preset ?? 'custom'} onValueChange={(value: string) => value !== 'custom' && router.get(adminUrl(`commerce/reports/${report.key}`), { period: value, compare: period.compare }, { preserveScroll: true })}>
                                <SelectTrigger id="report-preset" className="cm:w-44"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Object.entries(period.presets).map(([key, label]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}
                                    <SelectItem value="custom">Custom</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <form className="cm:flex cm:flex-wrap cm:items-end cm:gap-3" onSubmit={(e: React.FormEvent) => { e.preventDefault(); visit({ from, to }); }}>
                            <div className="cm:grid cm:gap-1">
                                <Label htmlFor="report-from">From</Label>
                                <Input id="report-from" type="date" value={from} max={to} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFrom(e.target.value)} />
                            </div>
                            <div className="cm:grid cm:gap-1">
                                <Label htmlFor="report-to">To</Label>
                                <Input id="report-to" type="date" value={to} min={from} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTo(e.target.value)} />
                            </div>
                            <Button type="submit" variant="outline">Apply</Button>
                        </form>
                        <div className="cm:grid cm:gap-1">
                            <Label htmlFor="report-compare">Compare with</Label>
                            <Select value={period.compare} onValueChange={(value: string) => visit({ compare: value })}>
                                <SelectTrigger id="report-compare" className="cm:w-44"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="previous">Previous period</SelectItem>
                                    <SelectItem value="year">Same period last year</SelectItem>
                                    <SelectItem value="none">Nothing</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {report.key === 'sales' && (
                            <div className="cm:grid cm:gap-1">
                                <Label htmlFor="report-interval">Group by</Label>
                                <Select value={period.interval} onValueChange={(value: string) => visit({ interval: value })}>
                                    <SelectTrigger id="report-interval" className="cm:w-32"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="day">Day</SelectItem>
                                        <SelectItem value="week">Week</SelectItem>
                                        <SelectItem value="month">Month</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {result.summary.length > 0 && (
                <div className="cm:grid cm:gap-4 cm:sm:grid-cols-2 cm:lg:grid-cols-5">
                    {result.summary.map((s) => <KpiCard key={s.key} kpi={{ key: s.key, label: s.label, value: format(s.value, s.kind), change: s.change }} />)}
                </div>
            )}

            {result.chart && result.chart.data.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>{report.label}</CardTitle>
                        {report.usesDates && <CardDescription>{format(period.from, 'date')} – {format(period.to, 'date')}</CardDescription>}
                    </CardHeader>
                    <CardContent>
                        <Chart label={report.label} kind={result.chart.kind} data={result.chart.data} xKey={result.chart.xKey} series={result.chart.series}
                            format={chartFormat} formatX={result.chart.xKey === 'date' ? (v) => format(v, 'date') : undefined} />
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardContent className="cm:pt-6">
                    {result.rows.length === 0 ? (
                        <EmptyState title="Nothing to show" description={report.usesDates ? 'There is no data for this period.' : 'Nothing needs attention.'} />
                    ) : (
                        <div className="cm:overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {result.columns.map((c) => <TableHead key={c.key} className={numeric(c.kind) ? 'cm:text-right' : undefined}>{c.label}</TableHead>)}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {result.rows.map((row, i) => (
                                        <TableRow key={i}>
                                            {result.columns.map((c, j) => (
                                                <TableCell key={c.key} className={cn(numeric(c.kind) && 'cm:text-right cm:tabular-nums')}>
                                                    {j === 0 && row.href ? <Link href={adminUrl(row.href)} className="cm:underline-offset-2 cm:hover:underline">{format(row[c.key], c.kind)}</Link> : format(row[c.key], c.kind)}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                    {result.totals && (
                                        <TableRow className="cm:font-semibold">
                                            {result.columns.map((c) => <TableCell key={c.key} className={cn(numeric(c.kind) && 'cm:text-right cm:tabular-nums')}>{format(result.totals?.[c.key], c.kind)}</TableCell>)}
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
