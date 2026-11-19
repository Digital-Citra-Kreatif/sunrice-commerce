import { adminUrl, inertia, ui, useBreadcrumbs } from '../../lib/sunrice';
import { DataTable, type DataTableProps } from '../../components/DataTable';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { useCommerceShared } from '../../lib/store';

interface Row { id: number; product_title: string; href: string; type: string; sku: string | null; min_price: string | null; stock: string | null; in_stock: boolean | null; featured: boolean; state: string; sync_failed: boolean; sync_error: string | null; categories: string }

const stateTone: Record<string, string> = { published: 'ok', draft: 'neutral', scheduled: 'info', trashed: 'error' };

export default function ProductsIndex(props: DataTableProps & { create: Array<{ label: string; url: string }>; bulkUrl: string }) {
    const { Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } = ui;
    const { Link } = inertia;
    useCommerceShared();
    useBreadcrumbs([{ label: 'Shop', href: adminUrl('commerce') }, { label: 'Products' }]);

    return (
        <div className="cm:flex cm:min-w-0 cm:flex-col cm:gap-6">
            <PageHeader title="Products" description="Products are entries: opening one goes to the editor."
                primary={props.create.length === 1 ? <Button asChild><Link href={adminUrl(props.create[0].url)}>New product</Link></Button>
                    : props.create.length > 1 ? (
                        // Several product collections: choose which the product goes in.
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button>New product</Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {props.create.map((c) => <DropdownMenuItem key={c.url} asChild><Link href={adminUrl(c.url)}>{c.label}</Link></DropdownMenuItem>)}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : undefined}
                menu={[
                    { label: 'Export CSV', href: adminUrl('commerce/products/export'), download: true },
                    { label: 'Import CSV', href: adminUrl('commerce/products/import') },
                ]} />
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
