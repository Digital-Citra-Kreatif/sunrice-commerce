import { adminUrl, components, inertia, Sunrice, ui } from '../../lib/sunrice';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { useCommerceShared } from '../../lib/store';

interface Row { id: number; product_title: string; href: string; type: string; sku: string | null; min_price: string | null; stock: string | null; in_stock: boolean | null; featured: boolean; state: string; sync_failed: boolean; sync_error: string | null; categories: string }

const stateTone: Record<string, string> = { published: 'ok', draft: 'neutral', scheduled: 'info', trashed: 'error' };

export default function ProductsIndex(props: Record<string, unknown> & { createUrl: string; bulkUrl: string }) {
    const { DataTable } = components;
    const { Button } = ui;
    const { Link } = inertia;
    useCommerceShared();
    Sunrice.useBreadcrumbs([{ label: 'Shop', href: adminUrl('commerce') }, { label: 'Products' }]);

    return (
        <div className="cm:grid cm:gap-6 cm:p-4 cm:md:p-6">
            <PageHeader title="Products" description="Products are entries: opening one goes to the editor."
                actions={<Button asChild><Link href={adminUrl(props.createUrl)}>New product</Link></Button>} />
            <DataTable
                {...props}
                searchPlaceholder="Search titles or SKUs…"
                rowHref={(row: Row) => adminUrl(row.href)}
                renderCell={(row: Row, column: { key: string }) => {
                    switch (column.key) {
                        case 'product_title':
                            return (
                                <span className="cm:flex cm:flex-wrap cm:items-center cm:gap-2">
                                    <span className="cm:font-medium">{row.product_title}</span>
                                    {row.featured && <StatusBadge tone="info">Featured</StatusBadge>}
                                    {row.sync_failed && <span title={row.sync_error ?? ''}><StatusBadge tone="error">Can't be bought</StatusBadge></span>}
                                </span>
                            );
                        case 'state':
                            return <StatusBadge tone={stateTone[row.state]}>{row.state}</StatusBadge>;
                        case 'stock':
                            return row.stock === null ? '—' : <span className={row.in_stock === false ? 'cm:text-destructive' : ''}>{row.stock}</span>;
                        case 'type':
                            return <StatusBadge>{row.type}</StatusBadge>;
                        default:
                            return undefined;
                    }
                }}
            />
        </div>
    );
}
