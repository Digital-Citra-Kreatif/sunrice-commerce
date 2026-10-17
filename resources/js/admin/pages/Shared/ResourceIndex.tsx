import { adminUrl, components, inertia, Sunrice, ui } from '../../lib/sunrice';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { useCommerceShared } from '../../lib/store';

/**
 * A list page for commerce records (vouchers, pricing rules, flash sales…):
 * Inertia::render('Commerce/Shared/ResourceIndex', [title, description, createUrl, …DataTable props]).
 * Rows link to row.href; columns of type "badge" read row[key + '_tone'] for their color.
 */
export default function ResourceIndex(props: Record<string, unknown> & { title: string; description?: string; createUrl?: string | null; createLabel?: string; bulkUrl?: string }) {
    const { DataTable } = components;
    const { Button } = ui;
    const { Link } = inertia;
    useCommerceShared();
    Sunrice.useBreadcrumbs([{ label: 'Shop', href: adminUrl('commerce') }, { label: props.title }]);

    return (
        <div className="cm:grid cm:gap-6 cm:p-4 cm:md:p-6">
            <PageHeader title={props.title} description={props.description}
                actions={props.createUrl ? <Button asChild><Link href={adminUrl(props.createUrl)}>{props.createLabel ?? 'New'}</Link></Button> : null} />
            <DataTable
                {...props}
                bulkUrl={props.bulkUrl ? adminUrl(props.bulkUrl) : undefined}
                rowHref={(row: { href?: string }) => (row.href ? adminUrl(row.href) : null)}
                renderCell={(row: Record<string, unknown>, column: { key: string; type: string }) =>
                    column.type === 'badge' && row[column.key] != null
                        ? <StatusBadge tone={(row[`${column.key}_tone`] as string) ?? 'neutral'}>{String(row[column.key])}</StatusBadge>
                        : undefined}
            />
        </div>
    );
}
