import { DataTable, type DataTableProps } from '../../components/DataTable';
import { PageHeader } from '../../components/PageHeader';
import { SchemaFormView, type SchemaFormProps } from '../../components/SchemaFormView';
import { adminUrl, inertia, React, ui, useBreadcrumbs } from '../../lib/sunrice';
import { useCommerceShared } from '../../lib/store';

interface Row {
    created_at: string | null;
    points: number;
    balance_after: number;
    order_number: string | null;
    order_url: string | null;
    expires_at: string | null;
    note: string | null;
}

const FORM_ID = 'commerce-loyalty-adjust';
const formatPoints = new Intl.NumberFormat('id-ID');
const dateTime = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export default function LoyaltyShow({ title, description, balance, form, history }: {
    title: string;
    description: string;
    balance: number;
    form: SchemaFormProps;
    history: DataTableProps;
}) {
    const { Button } = ui;
    const { Link } = inertia;
    const back = adminUrl('commerce/loyalty');
    const [saving, setSaving] = React.useState(false);
    useCommerceShared();
    useBreadcrumbs([{ label: 'Shop', href: adminUrl('commerce') }, { label: 'Loyalty points', href: back }, { label: title }]);

    return (
        <div className="cm:flex cm:min-w-0 cm:flex-col cm:gap-6">
            <PageHeader title={title} description={description} back={{ href: back, label: 'Back to loyalty points' }} />
            <section className="cm:grid cm:gap-3" aria-labelledby="adjust-points-title">
                <div className="cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-3">
                    <h2 className="cm:text-lg cm:font-semibold" id="adjust-points-title">Adjust points</h2>
                    <Button type="submit" form={FORM_ID} disabled={saving}>Save adjustment</Button>
                </div>
                <SchemaFormView key={balance} form={form} id={FORM_ID} onProcessing={setSaving} />
            </section>
            <section className="cm:grid cm:gap-3" aria-labelledby="points-history-title">
                <h2 className="cm:text-lg cm:font-semibold" id="points-history-title">Points history</h2>
                <DataTable
                    {...history}
                    searchPlaceholder="Search reasons…"
                    renderCell={(row: Row, column) => {
                        if (column.key === 'created_at' || column.key === 'expires_at') {
                            const value = row[column.key];
                            return value ? <time dateTime={value}>{dateTime.format(new Date(value))}</time> : '—';
                        }
                        if (column.key === 'points') return <span className="cm:font-medium cm:tabular-nums">{row.points > 0 ? '+' : ''}{formatPoints.format(row.points)}</span>;
                        if (column.key === 'balance_after') return <span className="cm:tabular-nums">{formatPoints.format(row.balance_after)}</span>;
                        if (column.key === 'order_number') return row.order_url
                            ? <Link href={row.order_url} className="cm:underline cm:underline-offset-4">{row.order_number}</Link>
                            : row.order_number ?? '—';
                        if (column.key === 'note') return <span className="cm:block cm:max-w-60 cm:wrap-anywhere cm:whitespace-normal">{row.note ?? '—'}</span>;
                        return undefined;
                    }}
                />
            </section>
        </div>
    );
}
