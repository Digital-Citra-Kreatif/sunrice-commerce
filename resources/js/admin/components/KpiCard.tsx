import { cn } from '../lib/cn';
import { adminUrl, inertia, ui } from '../lib/sunrice';

export interface Kpi {
    key: string;
    label: string;
    value: string;
    hint?: string;
    href?: string;
    /** Percent change against the comparison period; null when there is nothing to compare. */
    change?: number | null;
}

/** A KpiCard's place while its figure loads: the same card, so nothing moves when it arrives. */
export function KpiCardSkeleton() {
    const { Card, CardContent } = ui;

    return (
        <Card aria-hidden="true">
            <CardContent className="cm:grid cm:gap-1 cm:pt-6">
                <span className="cm:my-0.5 cm:h-4 cm:w-24 cm:animate-pulse cm:rounded cm:bg-muted" />
                <span className="cm:my-1 cm:h-6 cm:w-20 cm:animate-pulse cm:rounded cm:bg-muted" />
                <span className="cm:h-4" />
            </CardContent>
        </Card>
    );
}

/** A figure with its change against the comparison period. */
export function KpiCard({ kpi }: { kpi: Kpi }) {
    const { Card, CardContent } = ui;
    const { Link } = inertia;
    const change = kpi.change ?? null;
    const body = (
        <CardContent className="cm:grid cm:gap-1 cm:pt-6">
            <span className="cm:text-sm cm:text-muted-foreground">{kpi.label}</span>
            <span className="cm:text-2xl cm:font-semibold cm:tabular-nums">{kpi.value}</span>
            {change !== null && (
                <span
                    className={cn('cm:text-xs cm:font-medium', change > 0 ? 'cm:text-emerald-600' : change < 0 ? 'cm:text-red-600' : 'cm:text-muted-foreground')}
                    title="Compared with the previous period"
                >
                    <span aria-hidden>{change > 0 ? '▲' : change < 0 ? '▼' : '•'}</span> {Math.abs(change).toLocaleString(undefined, { maximumFractionDigits: 1 })}%
                    <span className="cm:sr-only">{change > 0 ? ' up' : change < 0 ? ' down' : ''} from the previous period</span>
                </span>
            )}
            {kpi.hint && <span className="cm:text-xs cm:text-muted-foreground">{kpi.hint}</span>}
        </CardContent>
    );

    return <Card>{kpi.href ? <Link href={adminUrl(kpi.href)} className="cm:block">{body}</Link> : body}</Card>;
}
