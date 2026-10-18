import { React } from '../lib/sunrice';

export interface ChartSeries {
    key: string;
    label: string;
    /** A CSS color; defaults to the admin's chart colors. */
    color?: string;
    dashed?: boolean;
}

export interface ChartProps {
    data: Array<Record<string, unknown>>;
    xKey: string;
    series: ChartSeries[];
    kind?: 'line' | 'bar';
    height?: number;
    /** Formats values on the axis and in the tooltip. */
    format?: (value: number) => string;
    /** Formats the x labels (dates…). */
    formatX?: (value: string) => string;
    /** Accessible description of what the chart shows. */
    label: string;
}

// recharts is large: it loads as its own chunk the first time a chart renders.
const ChartImpl = React.lazy(() => import('./ChartImpl'));

/** A responsive line or bar chart (recharts) themed with the admin's colors. */
export function Chart(props: ChartProps) {
    const placeholder = <div className="cm:animate-pulse cm:rounded-md cm:bg-muted" style={{ height: props.height ?? 260 }} />;

    return (
        <React.Suspense fallback={placeholder}>
            <ChartImpl {...props} />
        </React.Suspense>
    );
}
