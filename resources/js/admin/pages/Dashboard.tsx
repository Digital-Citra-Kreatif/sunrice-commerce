import { adminUrl, inertia, ui } from '../lib/sunrice';
import { Chart } from '../components/Chart';
import { EmptyState } from '../components/EmptyState';
import { KpiCard, type Kpi } from '../components/KpiCard';
import { formatMoney } from '../lib/money';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../lib/api';
import { useCommerceShared } from '../lib/store';

interface Props {
    mode: { key: string; label: string };
    setup: Array<{ key: string; label: string; description: string; href: string; done: boolean }>;
    health: Array<{ key: string; label: string; status: 'ok' | 'warning' | 'error'; message: string; fix: string | null }>;
    period: { key: string; options: Array<{ value: string; label: string }> };
    analytics: boolean;
    canReports: boolean;
    kpis?: Kpi[];
    sales?: Array<{ date: string; total: number; orders: number; previous: number | null }>;
    topProducts?: Array<{ product_id: number; title: string; href: string | null; units: number; revenue: string }>;
    todo?: Array<{ key: string; label: string; count: number; href: string }>;
    recentOrders?: Array<{ id: number; number: string; customer: string | null; total: string; status: string; status_key: string; placed_at: string | null; href: string }>;
}

const statusTone: Record<string, string> = { pending: 'warning', on_hold: 'warning', processing: 'info', completed: 'ok', cancelled: 'neutral', refunded: 'neutral', failed: 'error' };

const shortDate = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });

export default function Dashboard({ mode, setup, health, period, analytics, canReports, kpis, sales, topProducts, todo, recentOrders }: Props) {
    const { Card, CardContent, CardHeader, CardTitle, CardDescription, Button } = ui;
    const { Link } = inertia;
    useCommerceShared();
    const remaining = setup.filter((s) => !s.done);
    const problems = health.filter((h) => h.status !== 'ok');
    const widgets = Object.entries(api.dashboardWidgets());

    return (
        <div className="cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6">
            <PageHeader title="Store" description={<>Selling mode: {mode.label}</>} />

            {remaining.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Set up your store</CardTitle>
                        <CardDescription>{setup.length - remaining.length} of {setup.length} done</CardDescription>
                    </CardHeader>
                    <CardContent className="cm:grid cm:gap-2">
                        {setup.map((step) => (
                            <Link key={step.key} href={adminUrl(step.href)} className="cm:flex cm:items-start cm:gap-3 cm:rounded-md cm:p-2 cm:hover:bg-muted">
                                <span aria-hidden className={step.done ? 'cm:text-emerald-600' : 'cm:text-muted-foreground'}>{step.done ? '✓' : '○'}</span>
                                <span className="cm:grid">
                                    <span className={step.done ? 'cm:text-muted-foreground cm:line-through' : 'cm:font-medium'}>{step.label}</span>
                                    {step.description && <span className="cm:text-sm cm:text-muted-foreground">{step.description}</span>}
                                </span>
                            </Link>
                        ))}
                    </CardContent>
                </Card>
            )}

            {problems.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Needs attention</CardTitle>
                    </CardHeader>
                    <CardContent className="cm:grid cm:gap-3">
                        {problems.map((h) => (
                            <div key={h.key} className="cm:grid cm:gap-1">
                                <div className="cm:flex cm:items-center cm:gap-2">
                                    <StatusBadge tone={h.status}>{h.status === 'error' ? 'Problem' : 'Warning'}</StatusBadge>
                                    <span className="cm:font-medium">{h.label}</span>
                                </div>
                                <p className="cm:text-sm">{h.message}</p>
                                {h.fix && <p className="cm:text-sm cm:text-muted-foreground">{h.fix}</p>}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {analytics && (
                <div className="cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2">
                    <div role="group" aria-label="Period" className="cm:flex cm:gap-1">
                        {period.options.map((option) => (
                            <Button key={option.value} size="sm" variant={option.value === period.key ? 'default' : 'outline'} aria-pressed={option.value === period.key}
                                onClick={() => inertia.router.get(adminUrl('commerce'), { period: option.value }, { preserveScroll: true, preserveState: true })}>
                                {option.label}
                            </Button>
                        ))}
                    </div>
                    {canReports && <Link href={adminUrl('commerce/reports/sales')} className="cm:text-sm cm:underline">All reports</Link>}
                </div>
            )}

            <div className="cm:grid cm:gap-4 cm:sm:grid-cols-2 cm:lg:grid-cols-5">
                {kpis === undefined
                    ? [0, 1, 2, 3, 4].map((i) => <div key={i} className="cm:h-24 cm:animate-pulse cm:rounded-lg cm:bg-muted" />)
                    : kpis.map((kpi) => <KpiCard key={kpi.key} kpi={kpi} />)}
            </div>

            {analytics && (
                <div className="cm:grid cm:gap-4 cm:lg:grid-cols-3">
                    <Card className="cm:lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Sales</CardTitle>
                            <CardDescription>Total sales per day, against the previous period</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {sales === undefined ? (
                                <div className="cm:h-64 cm:animate-pulse cm:rounded-md cm:bg-muted" />
                            ) : (
                                <Chart label="Total sales per day" data={sales} xKey="date" formatX={shortDate} format={(v) => formatMoney(v)}
                                    series={[{ key: 'total', label: 'This period' }, { key: 'previous', label: 'Previous period', dashed: true }]} />
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Top products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {topProducts === undefined ? (
                                <div className="cm:h-40 cm:animate-pulse cm:rounded-md cm:bg-muted" />
                            ) : topProducts.length === 0 ? (
                                <EmptyState title="No sales yet" description="Best sellers in this period show up here." />
                            ) : (
                                <ol className="cm:grid cm:gap-2">
                                    {topProducts.map((p) => (
                                        <li key={p.product_id} className="cm:flex cm:justify-between cm:gap-2 cm:text-sm">
                                            {p.href ? <Link href={adminUrl(p.href)} className="cm:truncate cm:hover:underline">{p.title}</Link> : <span className="cm:truncate">{p.title}</span>}
                                            <span className="cm:shrink-0 cm:tabular-nums cm:text-muted-foreground">{p.units} · {p.revenue}</span>
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>To do</CardTitle>
                </CardHeader>
                <CardContent>
                    {todo === undefined ? (
                        <div className="cm:h-16 cm:animate-pulse cm:rounded-md cm:bg-muted" />
                    ) : todo.length === 0 ? (
                        <EmptyState title="Nothing to do" description="Orders to process and payments to verify show up here." />
                    ) : (
                        <ul className="cm:grid cm:gap-1">
                            {todo.map((t) => (
                                <li key={t.key}>
                                    <Link href={adminUrl(t.href)} className="cm:flex cm:justify-between cm:rounded-md cm:p-2 cm:hover:bg-muted">
                                        <span>{t.label}</span>
                                        <span className="cm:font-semibold">{t.count}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>

            {recentOrders !== undefined && recentOrders.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Recent orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="cm:grid cm:gap-1">
                            {recentOrders.map((o) => (
                                <li key={o.id}>
                                    <Link href={adminUrl(o.href)} className="cm:grid cm:grid-cols-[1fr_auto] cm:items-center cm:gap-x-3 cm:rounded-md cm:p-2 cm:hover:bg-muted cm:sm:grid-cols-[8rem_1fr_auto_auto]">
                                        <span className="cm:font-medium">{o.number}</span>
                                        <span className="cm:truncate cm:text-muted-foreground">{o.customer}</span>
                                        <StatusBadge tone={statusTone[o.status_key]}>{o.status}</StatusBadge>
                                        <span className="cm:tabular-nums">{o.total}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {widgets.map(([name, Widget]) => (
                <Widget key={name} />
            ))}
        </div>
    );
}
