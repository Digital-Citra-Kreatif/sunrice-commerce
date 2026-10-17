import type { ChartProps } from './Chart';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const palette = ['var(--chart-1, var(--primary))', 'var(--chart-2, var(--muted-foreground))', 'var(--chart-3, #f59e0b)', 'var(--chart-4, #10b981)'];

/** The recharts implementation behind Chart, loaded on first use. */
export default function ChartImpl({ data, xKey, series, kind = 'line', height = 260, format, formatX, label }: ChartProps) {
    const axis = { stroke: 'var(--muted-foreground)', fontSize: 12, tickLine: false, axisLine: false } as const;
    const tooltip = (
        <Tooltip
            formatter={(value) => (format && typeof value === 'number' ? format(value) : String(value))}
            labelFormatter={(value) => (formatX ? formatX(String(value)) : String(value))}
            contentStyle={{ background: 'var(--popover)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--popover-foreground)' }}
        />
    );
    const common = (
        <>
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis dataKey={xKey} {...axis} tickFormatter={formatX} minTickGap={16} />
            <YAxis {...axis} width={72} tickFormatter={format} />
            {tooltip}
            {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
        </>
    );

    return (
        <div role="img" aria-label={label} style={{ width: '100%', height }}>
            <ResponsiveContainer width="100%" height="100%">
                {kind === 'bar' ? (
                    <BarChart data={data}>
                        {common}
                        {series.map((s, i) => (
                            <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color ?? palette[i % palette.length]} radius={[4, 4, 0, 0]} />
                        ))}
                    </BarChart>
                ) : (
                    <LineChart data={data}>
                        {common}
                        {series.map((s, i) => (
                            <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color ?? palette[i % palette.length]}
                                strokeWidth={2} strokeDasharray={s.dashed ? '4 4' : undefined} dot={false} isAnimationActive={false} />
                        ))}
                    </LineChart>
                )}
            </ResponsiveContainer>
        </div>
    );
}
