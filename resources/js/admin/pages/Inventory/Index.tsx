import { adminUrl, components, fetchJson, inertia, React, Sunrice, ui } from '../../lib/sunrice';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { useCommerceShared } from '../../lib/store';

interface Row { id: number; product_title: string; entry_id: number; sku: string | null; track_stock: boolean; stock_quantity: number | null; backorders: string; status: string; low: boolean }
interface Movement { id: number; delta: number; quantity_after: number | null; reason: string; note: string | null; user: string | null; at: string; reference: { type: string; id: number } | null }

const statusTone: Record<string, string> = { in_stock: 'ok', out_of_stock: 'error', backorder: 'warning' };

function AdjustDialog({ row, reasons, onClose }: { row: Row; reasons: string[]; onClose: () => void }) {
    const { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Button, Input, Label } = ui;
    const form = inertia.useForm({ mode: 'add', quantity: 0, reason: 'manual', note: '' });
    const [history, setHistory] = React.useState<Movement[] | null>(null);
    React.useEffect(() => {
        fetchJson<{ data: Movement[] }>(adminUrl(`commerce/inventory/${row.id}/history`)).then((r) => setHistory(r.data)).catch(() => setHistory([]));
    }, [row.id]);
    const after = form.data.mode === 'set' ? form.data.quantity : (row.stock_quantity ?? 0) + form.data.quantity;

    return (
        <Dialog open onOpenChange={(open: boolean) => !open && onClose()}>
            <DialogContent className="cm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Adjust stock</DialogTitle>
                    <DialogDescription>{row.product_title}{row.sku ? ` · ${row.sku}` : ''}. Now: {row.track_stock ? row.stock_quantity ?? 0 : 'not tracked'}.</DialogDescription>
                </DialogHeader>
                <form id="adjust-stock" className="cm:grid cm:gap-3" onSubmit={(e) => { e.preventDefault(); form.post(adminUrl(`commerce/inventory/${row.id}/adjust`), { preserveScroll: true, onSuccess: onClose }); }}>
                    <div className="cm:grid cm:grid-cols-2 cm:gap-3">
                        <div className="cm:grid cm:gap-1">
                            <Label htmlFor="adjust-mode">Change</Label>
                            <select id="adjust-mode" className="cm:h-9 cm:rounded-md cm:border cm:bg-background cm:px-3 cm:text-sm" value={form.data.mode} onChange={(e) => form.setData('mode', e.target.value)}>
                                <option value="add">Add or remove</option><option value="set">Set to</option>
                            </select>
                        </div>
                        <div className="cm:grid cm:gap-1">
                            <Label htmlFor="adjust-quantity">{form.data.mode === 'set' ? 'New stock' : 'Units (+/−)'}</Label>
                            <Input id="adjust-quantity" type="number" value={form.data.quantity} onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('quantity', Number(e.target.value))} />
                            {form.errors.quantity && <p className="cm:text-xs cm:text-destructive">{form.errors.quantity}</p>}
                        </div>
                    </div>
                    <div className="cm:grid cm:grid-cols-2 cm:gap-3">
                        <div className="cm:grid cm:gap-1">
                            <Label htmlFor="adjust-reason">Reason</Label>
                            <select id="adjust-reason" className="cm:h-9 cm:rounded-md cm:border cm:bg-background cm:px-3 cm:text-sm" value={form.data.reason} onChange={(e) => form.setData('reason', e.target.value)}>
                                {reasons.map((r) => <option key={r} value={r}>{r[0].toUpperCase() + r.slice(1)}</option>)}
                            </select>
                        </div>
                        <div className="cm:grid cm:gap-1">
                            <Label htmlFor="adjust-note">Note</Label>
                            <Input id="adjust-note" value={form.data.note} onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('note', e.target.value)} />
                        </div>
                    </div>
                    <p className="cm:text-sm">Stock after: <strong>{after}</strong></p>
                </form>
                <div className="cm:grid cm:max-h-56 cm:gap-1 cm:overflow-auto cm:border-t cm:pt-3 cm:text-sm">
                    <p className="cm:font-medium">History</p>
                    {history === null ? <p className="cm:text-muted-foreground">Loading…</p> : history.length === 0 ? <p className="cm:text-muted-foreground">No changes yet.</p> : history.map((m) => (
                        <div key={m.id} className="cm:flex cm:justify-between cm:gap-3">
                            <span>{m.delta > 0 ? `+${m.delta}` : m.delta} → {m.quantity_after} · {m.reason}{m.reference ? ` (${m.reference.type} #${m.reference.id})` : ''}{m.note ? ` · ${m.note}` : ''}</span>
                            <span className="cm:whitespace-nowrap cm:text-muted-foreground">{m.user ? `${m.user}, ` : ''}{new Date(m.at).toLocaleString()}</span>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
                    <Button type="submit" form="adjust-stock" disabled={form.processing}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function InventoryIndex(props: Record<string, unknown> & { can: { adjust: boolean }; reasons: string[] }) {
    const { DataTable } = components;
    const [adjusting, setAdjusting] = React.useState<Row | null>(null);
    useCommerceShared();
    Sunrice.useBreadcrumbs([{ label: 'Shop', href: adminUrl('commerce') }, { label: 'Inventory' }]);

    return (
        <div className="cm:grid cm:gap-6 cm:p-4 cm:md:p-6">
            <PageHeader title="Inventory" description="Stock of every product variant. Every change is recorded." />
            <DataTable
                {...props}
                searchPlaceholder="Search products or SKUs…"
                onRowClick={props.can.adjust ? (row: Row) => setAdjusting(row) : undefined}
                renderCell={(row: Row, column: { key: string }) => {
                    if (column.key === 'status') return <StatusBadge tone={row.low ? 'warning' : statusTone[row.status]}>{row.low ? 'Low' : row.status.replace(/_/g, ' ')}</StatusBadge>;
                    if (column.key === 'stock_quantity') return row.track_stock ? row.stock_quantity : <span className="cm:text-muted-foreground">—</span>;
                    return undefined;
                }}
            />
            {adjusting && <AdjustDialog row={adjusting} reasons={props.reasons} onClose={() => setAdjusting(null)} />}
        </div>
    );
}
