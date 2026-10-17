import { adminUrl, inertia, ui } from '../lib/sunrice';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../lib/api';
import { useCommerceShared } from '../lib/store';

interface Props {
    mode: { key: string; label: string };
    setup: Array<{ key: string; label: string; description: string; href: string; done: boolean }>;
    health: Array<{ key: string; label: string; status: 'ok' | 'warning' | 'error'; message: string; fix: string | null }>;
    kpis?: Array<{ key: string; label: string; value: string; hint?: string; href?: string }>;
    todo?: Array<{ key: string; label: string; count: number; href: string }>;
}

export default function Dashboard({ mode, setup, health, kpis, todo }: Props) {
    const { Card, CardContent, CardHeader, CardTitle, CardDescription } = ui;
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

            <div className="cm:grid cm:gap-4 cm:sm:grid-cols-2 cm:lg:grid-cols-4">
                {kpis === undefined
                    ? [0, 1, 2, 3].map((i) => <div key={i} className="cm:h-24 cm:animate-pulse cm:rounded-lg cm:bg-muted" />)
                    : kpis.map((kpi) => (
                          <Card key={kpi.key}>
                              <CardContent className="cm:grid cm:gap-1 cm:pt-6">
                                  <span className="cm:text-sm cm:text-muted-foreground">{kpi.label}</span>
                                  <span className="cm:text-2xl cm:font-semibold">{kpi.value}</span>
                                  {kpi.hint && <span className="cm:text-xs cm:text-muted-foreground">{kpi.hint}</span>}
                              </CardContent>
                          </Card>
                      ))}
            </div>

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

            {widgets.map(([name, Widget]) => (
                <Widget key={name} />
            ))}
        </div>
    );
}
