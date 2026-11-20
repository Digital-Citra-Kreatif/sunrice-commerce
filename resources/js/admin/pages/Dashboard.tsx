import { adminUrl, inertia, ui } from '../lib/sunrice';
import { Chart } from '../components/Chart';
import { EmptyState } from '../components/EmptyState';
import { KpiCard, KpiCardSkeleton, type Kpi } from '../components/KpiCard';
import { formatCompactMoney, formatMoney } from '../lib/money';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../lib/api';
import { useCommerceShared } from '../lib/store';

interface Props {
    mode: { key: string; label: string };
    setup: Array<{ key: string; label: string; description: string; href: string; done: boolean }>;
    health: Array<{ key: string; label: string; status: 'ok' | 'warning' | 'error'; message: string; fix: string | null }>;
    period: {
        key: string; from: string; to: string; compareFrom: string | null; compareTo: string | null;
        options: Array<{ value: string; label: string }>;
    };
    analytics: boolean;
    canReports: boolean;
    kpis?: Kpi[];
    sales?: Array<{ date: string; total: number; orders: number; previous: number | null }>;
    topProducts?: Array<{ product_id: number; title: string; href: string | null; units: number; revenue: string }>;
    todo?: Array<{ key: string; label: string; count: number; href: string }>;
    widgets?: Record<string, Record<string, unknown>>;
    recentOrders?: Array<{ id: number; number: string; customer: string | null; total: string; status: string; status_key: string; placed_at: string | null; href: string }>;
}

const statusTone: Record<string, string> = { pending: 'warning', on_hold: 'warning', processing: 'info', completed: 'ok', cancelled: 'error', refunded: 'neutral', failed: 'error' };

const dateOnly = (value: string) => new Date(`${value}T00:00:00`);
const shortDate = (value: string) => dateOnly(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
const dates = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
const dateRange = (from: string, to: string) => dates.formatRange(dateOnly(from), dateOnly(to));

export default function Dashboard({ mode, setup, health, period, analytics, canReports, kpis, sales, topProducts, todo, widgets: widgetProps, recentOrders }: Props) {
    const { Card, CardContent, CardHeader, CardTitle, CardDescription, Button } = ui;
    const { Link } = inertia;
    useCommerceShared();
    const remaining = setup.filter((s) => !s.done);
    const problems = health.filter((h) => h.status !== 'ok');
    const today = period.key === 'today';
    const comparison = period.compareFrom && period.compareTo ? dateRange(period.compareFrom, period.compareTo) : null;
    // Widgets render once their props arrive, and only those the server allows (permission, module).
    const widgets = Object.entries(api.dashboardWidgets()).filter(([name]) => widgetProps !== undefined && name in widgetProps);

    return (
        <div className="commerce-dashboard cm:flex cm:min-w-0 cm:flex-col cm:gap-6">
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

            {(analytics || kpis === undefined || kpis.length > 0) && (
                <section className="cm:grid cm:gap-4" aria-labelledby="dashboard-overview">
                    <div className="cm:flex cm:flex-wrap cm:items-end cm:justify-between cm:gap-x-6 cm:gap-y-3">
                        <div>
                            <h2 id="dashboard-overview" className="cm:text-xl cm:font-semibold cm:tracking-tight">Sales overview</h2>
                            {analytics && <p className="cm:mt-1 cm:text-sm cm:text-muted-foreground">{dateRange(period.from, period.to)}</p>}
                        </div>
                        {analytics && (
                            <div className="cm:flex cm:flex-wrap cm:items-center cm:gap-3">
                                <div role="group" aria-label="Reporting period" className="commerce-dashboard-period">
                                    {period.options.map((option) => (
                                        <Button type="button" key={option.value} size="sm" variant={option.value === period.key ? 'default' : 'ghost'}
                                            aria-pressed={option.value === period.key}
                                            onClick={() => inertia.router.get(adminUrl('commerce'), { period: option.value }, { preserveScroll: true, preserveState: true })}>
                                            {option.label}
                                        </Button>
                                    ))}
                                </div>
                                {canReports && <Button asChild variant="outline" size="sm">
                                    <Link href={adminUrl(`commerce/reports/sales?period=${period.key}`)}>View reports</Link>
                                </Button>}
                            </div>
                        )}
                    </div>

                    <div className="commerce-dashboard-kpis">
                        {kpis === undefined
                            ? Array.from({ length: 5 }, (_, i) => <KpiCardSkeleton key={i} className={analytics && i === 0 ? 'commerce-dashboard-sales-kpi' : undefined} />)
                            : kpis.map((kpi) => <KpiCard key={kpi.key} kpi={kpi} className={kpi.key === 'total_sales' ? 'commerce-dashboard-sales-kpi' : undefined} />)}
                    </div>

                    {analytics && (
                        <div className="commerce-dashboard-grid">
                            <Card className="cm:min-w-0">
                                <CardHeader>
                                    <CardTitle>Sales trend</CardTitle>
                                    {comparison && <CardDescription>Compared with {comparison}</CardDescription>}
                                </CardHeader>
                                <CardContent>
                                    {sales === undefined ? (
                                        <div className="cm:h-[280px] cm:animate-pulse cm:rounded-md cm:bg-muted" />
                                    ) : !sales.some((day) => day.total !== 0 || (day.previous ?? 0) !== 0) ? (
                                        <div className="cm:grid cm:min-h-[280px] cm:content-center"><EmptyState title="No sales in these periods" /></div>
                                    ) : (
                                        <Chart label={today ? 'Sales today and yesterday' : 'Daily sales this period and the previous period'} kind={today ? 'bar' : 'line'}
                                            data={sales} xKey="date" height={280} interpolation="linear" formatX={shortDate} format={formatMoney} formatAxis={(value) => formatCompactMoney(value)}
                                            series={[
                                                { key: 'total', label: today ? 'Today' : 'Current period', color: 'var(--commerce-dashboard-current)' },
                                                { key: 'previous', label: today ? 'Yesterday' : 'Previous period', color: 'var(--commerce-dashboard-previous)', dashed: true },
                                            ]} />
                                    )}
                                </CardContent>
                            </Card>
                            <Card className="cm:min-w-0">
                                <CardHeader><CardTitle>Top products</CardTitle></CardHeader>
                                <CardContent>
                                    {topProducts === undefined ? <RowsSkeleton rows={5} /> : topProducts.length === 0 ? (
                                        <EmptyState title="No products sold this period" />
                                    ) : (
                                        <table className="commerce-dashboard-table">
                                            <thead><tr><th scope="col">Product</th><th scope="col" className="commerce-dashboard-number">Units</th><th scope="col" className="commerce-dashboard-number">Sales</th></tr></thead>
                                            <tbody>{topProducts.map((product) => (
                                                <tr key={product.product_id}>
                                                    <th scope="row">{product.href ? <Link href={adminUrl(product.href)}>{product.title}</Link> : product.title}</th>
                                                    <td className="commerce-dashboard-number">{product.units.toLocaleString()}</td>
                                                    <td className="commerce-dashboard-number cm:font-medium">{product.revenue}</td>
                                                </tr>
                                            ))}</tbody>
                                        </table>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </section>
            )}

            <div className="commerce-dashboard-grid commerce-dashboard-activity" data-has-orders={recentOrders === undefined || recentOrders.length > 0}>
                {(recentOrders === undefined || recentOrders.length > 0) && (
                    <Card className="cm:min-w-0">
                        <CardHeader className="cm:flex cm:flex-row cm:flex-wrap cm:items-center cm:justify-between cm:gap-2">
                            <CardTitle>Recent orders</CardTitle>
                            {recentOrders && <Button asChild size="sm" variant="outline"><Link href={adminUrl('commerce/orders')}>View orders</Link></Button>}
                        </CardHeader>
                        <CardContent>
                            {recentOrders === undefined ? <RowsSkeleton rows={5} /> : (
                                <table className="commerce-dashboard-table commerce-dashboard-orders">
                                    <thead>
                                        <tr>
                                            <th scope="col">Order</th><th scope="col" className="commerce-dashboard-order-customer">Customer</th>
                                            <th scope="col" className="commerce-dashboard-order-date">Placed</th>
                                            <th scope="col">Status</th><th scope="col" className="commerce-dashboard-number">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>{recentOrders.map((order) => (
                                        <tr key={order.id}>
                                            <th scope="row">
                                                <Link href={adminUrl(order.href)}>{order.number}</Link>
                                                <span className="commerce-dashboard-mobile-customer cm:text-xs cm:text-muted-foreground">{order.customer}</span>
                                            </th>
                                            <td className="commerce-dashboard-order-customer cm:text-muted-foreground">{order.customer ?? '—'}</td>
                                            <td className="commerce-dashboard-order-date cm:whitespace-nowrap cm:text-muted-foreground">
                                                {order.placed_at ? new Date(order.placed_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : '—'}
                                            </td>
                                            <td><StatusBadge tone={statusTone[order.status_key]}>{order.status}</StatusBadge></td>
                                            <td className="commerce-dashboard-number cm:font-medium">{order.total}</td>
                                        </tr>
                                    ))}</tbody>
                                </table>
                            )}
                        </CardContent>
                    </Card>
                )}

                <Card className="cm:min-w-0">
                    <CardHeader><CardTitle>To do</CardTitle></CardHeader>
                    <CardContent>
                        {todo === undefined ? <RowsSkeleton rows={2} /> : todo.length === 0 ? (
                            <EmptyState title="You’re caught up" />
                        ) : (
                            <ul className="commerce-dashboard-tasks">
                                {todo.map((task) => (
                                    <li key={task.key}>
                                        <Link href={adminUrl(task.href)}>
                                            <span>{task.label}</span>
                                            <strong>{task.count.toLocaleString()}</strong>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>

            {widgets.map(([name, Widget]) => (
                <Widget key={name} {...widgetProps?.[name]} />
            ))}
        </div>
    );
}

/** Rows of a list while it loads, as tall as the rows that replace them. */
function RowsSkeleton({ rows }: { rows: number }) {
    return (
        <div className="cm:grid cm:gap-1" aria-hidden="true">
            {Array.from({ length: rows }, (_, i) => (
                <div key={i} className="cm:flex cm:h-10 cm:items-center cm:justify-between">
                    <span className="cm:h-4 cm:w-40 cm:animate-pulse cm:rounded cm:bg-muted" />
                    <span className="cm:h-4 cm:w-12 cm:animate-pulse cm:rounded cm:bg-muted" />
                </div>
            ))}
        </div>
    );
}
