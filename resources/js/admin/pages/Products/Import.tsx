import { adminUrl, inertia, ui, useBreadcrumbs } from '../../lib/sunrice';
import { PageHeader } from '../../components/PageHeader';
import { InputError } from '../../components/InputError';

interface Change { from: string | number | boolean | null; to: string | number | boolean | null }
interface PreviewRow { line: number; sku: string; product: string; changes: Record<string, Change>; error: string | null }

const show = (value: Change['from']) => (value === null || value === '' ? '—' : typeof value === 'boolean' ? (value ? 'yes' : 'no') : String(value));

/** Shop → Products → Import: upload a CSV, see what it changes, apply. */
export default function ProductsImport(props: { columns: string[]; changeable: string[]; maxRows: number; canAdjustStock: boolean; preview: PreviewRow[] | null; token: string | null }) {
    const { Button, Input, Label } = ui;
    const { useForm, router, Link } = inertia;
    useBreadcrumbs([{ label: 'Shop', href: adminUrl('commerce') }, { label: 'Products', href: adminUrl('commerce/products') }, { label: 'Import' }]);
    const upload = useForm({ file: null as File | null });
    const rows = props.preview ?? [];
    const changing = rows.filter((r) => r.error === null && Object.keys(r.changes).length > 0);
    const failing = rows.filter((r) => r.error !== null);

    return (
        <div className="cm:flex cm:min-w-0 cm:flex-col cm:gap-6 cm:max-w-5xl">
            <PageHeader title="Import products" description="Change prices, stock and more from a CSV: rows are matched by SKU, and blank cells keep the value." />
            <form className="cm:grid cm:max-w-xl cm:gap-3" onSubmit={(e) => { e.preventDefault(); upload.post(adminUrl('commerce/products/import'), { forceFormData: true }); }}>
                <Label htmlFor="import-file">CSV file</Label>
                <Input id="import-file" type="file" accept=".csv,text/csv" aria-describedby="import-help"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => upload.setData('file', e.target.files?.[0] ?? null)} />
                <p id="import-help" className="cm:text-sm cm:text-muted-foreground">
                    Start from <a className="cm:underline" href={adminUrl('commerce/products/export')}>the export</a>. Columns: {props.columns.join(', ')};
                    the import changes {props.changeable.filter((c) => c !== 'stock' || props.canAdjustStock).join(', ')}. Amounts in the store's currency
                    with a dot for decimals; 0 clears a compare-at price or cost. Up to {props.maxRows} rows.
                </p>
                <InputError message={upload.errors.file} />
                <div><Button type="submit" disabled={upload.processing || upload.data.file === null}>Preview changes</Button></div>
            </form>

            {props.preview !== null && (
                <section className="cm:grid cm:gap-3" aria-labelledby="preview-title">
                    <h2 id="preview-title" className="cm:text-lg cm:font-semibold">
                        {changing.length} {changing.length === 1 ? 'variant changes' : 'variants change'}{failing.length > 0 ? `, ${failing.length} rows can't be used` : ''}
                    </h2>
                    <div className="cm:overflow-x-auto cm:rounded-lg cm:border">
                        <table className="cm:w-full cm:text-sm">
                            <thead><tr className="cm:border-b cm:text-left"><th className="cm:p-2">Line</th><th className="cm:p-2">SKU</th><th className="cm:p-2">Product</th><th className="cm:p-2">Changes</th></tr></thead>
                            <tbody>
                                {rows.filter((r) => r.error !== null || Object.keys(r.changes).length > 0).map((r) => (
                                    <tr key={r.line} className="cm:border-b cm:align-top">
                                        <td className="cm:p-2">{r.line}</td>
                                        <td className="cm:p-2 cm:font-mono">{r.sku || '—'}</td>
                                        <td className="cm:p-2">{r.product || '—'}</td>
                                        <td className="cm:p-2">
                                            {r.error !== null ? <span className="cm:text-destructive">{r.error}</span> : (
                                                <ul>{Object.entries(r.changes).map(([field, c]) => <li key={field}>{field}: {show(c.from)} → <strong>{show(c.to)}</strong></li>)}</ul>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="cm:flex cm:gap-2">
                        <Button type="button" disabled={changing.length === 0} onClick={() => router.post(adminUrl('commerce/products/import/apply'), { token: props.token })}>
                            Apply {changing.length} {changing.length === 1 ? 'change' : 'changes'}
                        </Button>
                        <Button asChild variant="outline"><Link href={adminUrl('commerce/products')}>Cancel</Link></Button>
                    </div>
                </section>
            )}
        </div>
    );
}
