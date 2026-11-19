import { adminUrl, inertia, ui, useBreadcrumbs } from '../../lib/sunrice';
import { DataTable, type DataTableProps, type Paginator } from '../../components/DataTable';
import { PageHeader } from '../../components/PageHeader';
import { PaymentConfirmationDialog, type PaymentConfirmation } from '../../components/PaymentConfirmationDialog';
import { StatusBadge } from '../../components/StatusBadge';

const statuses = { submitted: 'Waiting', approved: 'Approved', rejected: 'Rejected' };

export default function ConfirmationsIndex({ status, ...table }: Omit<DataTableProps, 'rows'> & { status: string; rows: Paginator<PaymentConfirmation> }) {
    const { Button } = ui;
    const { Link } = inertia;
    useBreadcrumbs([{ label: 'Shop', href: adminUrl('commerce') }, { label: 'Payments to verify' }]);

    return (
        <div className="cm:flex cm:min-w-0 cm:flex-col cm:gap-6">
            <PageHeader title="Payments to verify" description="Customers’ transfer confirmations. Review the proof and the amount expected." />
            <nav className="cm:flex cm:flex-wrap cm:gap-2" aria-label="Confirmation status">
                {Object.entries(statuses).map(([value, label]) => (
                    <Button key={value} size="sm" variant={value === status ? 'default' : 'outline'} asChild>
                        <Link href={adminUrl(`commerce/confirmations?status=${value}`)} aria-current={value === status ? 'page' : undefined}>{label}</Link>
                    </Button>
                ))}
            </nav>
            <DataTable {...table} searchPlaceholder="Search order number or sender…"
                renderCell={(row: PaymentConfirmation, column) => {
                    if (column.key === 'order') return <div>
                        <Link href={adminUrl(row.order.href)} className="cm:font-medium cm:hover:underline">{row.order.number}</Link>
                        <p className="cm:text-xs cm:text-muted-foreground">{row.order.customer}</p>
                    </div>;
                    if (column.key === 'status') return <StatusBadge tone={row.status === 'approved' ? 'ok' : row.status === 'rejected' ? 'error' : 'warning'}>
                        {statuses[row.status as keyof typeof statuses] ?? row.status}
                    </StatusBadge>;
                    if (column.key === 'actions') return <PaymentConfirmationDialog confirmation={row} />;
                    return undefined;
                }} />
        </div>
    );
}
