import { React, adminUrl, fetchJson, ui } from '../../lib/sunrice';
import { NativeSelect, Row } from './controls';
import type { TabProps } from './types';

export function LiveStock({ variantKey, tab, sku }: { variantKey: string; tab: TabProps; sku: string | null }) {
    const saved = tab.live?.variants[variantKey];
    const reasons = tab.live?.stock_adjustment?.reasons;
    const [open, setOpen] = React.useState(false);
    const { Button } = ui;
    if (!saved || saved.stock_quantity === null) return null;

    return (
        <Row label="In stock">
            <div className="cm:flex cm:min-h-10 cm:flex-wrap cm:items-center cm:gap-x-3 cm:gap-y-1">
                <strong className="cm:text-lg cm:tabular-nums" aria-live="polite">{saved.stock_quantity}</strong>
                {reasons && <Button type="button" size="sm" variant="outline" onClick={() => setOpen(true)}>Adjust stock</Button>}
            </div>
            {open && reasons && <StockDialog key={saved.id} id={saved.id} stock={saved.stock_quantity} sku={sku}
                reasons={reasons} onClose={() => setOpen(false)} onAdjusted={(quantity) => tab.updateLiveStock(variantKey, saved.id, quantity)} />}
        </Row>
    );
}

function StockDialog({ id, stock, sku, reasons, onClose, onAdjusted }: {
    id: number; stock: number; sku: string | null; reasons: string[]; onClose: () => void; onAdjusted: (quantity: number) => void;
}) {
    const { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input } = ui;
    const [mode, setMode] = React.useState<'add' | 'set'>('add');
    const [quantity, setQuantity] = React.useState('');
    const [reason, setReason] = React.useState(reasons[0]);
    const [note, setNote] = React.useState<string | null>(null);
    const [error, setError] = React.useState('');
    const [saving, setSaving] = React.useState(false);
    const formId = React.useId();

    async function submit(event: React.FormEvent) {
        event.preventDefault();
        event.stopPropagation();
        if (saving || error || quantity === '') return;
        setSaving(true);
        setError('');
        try {
            const result = await fetchJson<{ stock_quantity: number }>(adminUrl(`commerce/inventory/${id}/adjust`), {
                method: 'POST',
                signal: AbortSignal.timeout(15000),
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode, quantity: Number(quantity), reason, note }),
            });
            onAdjusted(result.stock_quantity);
            onClose();
        } catch {
            setError('The adjustment could not be confirmed. Check the current stock in Inventory before retrying.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <Dialog open onOpenChange={(next: boolean) => { if (!next && !saving) onClose(); }}>
            <DialogContent className="cm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Adjust stock</DialogTitle>
                    <DialogDescription>{sku ? `${sku} · ` : ''}Current stock: {stock}. This saves immediately and records a stock movement.</DialogDescription>
                </DialogHeader>
                <form id={formId} className="cm:grid cm:gap-4" onSubmit={submit}>
                    <div className="cm:grid cm:items-start cm:gap-3 cm:sm:grid-cols-2">
                        <Row label="Adjustment" htmlFor={`${formId}-mode`}>
                            <NativeSelect id={`${formId}-mode`} value={mode} onChange={(value) => { setMode(value); setQuantity(''); }}
                                options={[[ 'add', 'Add or remove units' ], [ 'set', 'Set total stock' ]]} />
                        </Row>
                        <Row label={mode === 'set' ? 'New stock total' : 'Units (+/−)'} htmlFor={`${formId}-quantity`}>
                            <Input id={`${formId}-quantity`} type="number" inputMode="numeric" required min={mode === 'set' ? 0 : -1000000}
                                max={1000000} step={1} value={quantity} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuantity(event.target.value)} />
                        </Row>
                        <Row label="Reason" htmlFor={`${formId}-reason`}>
                            <NativeSelect id={`${formId}-reason`} value={reason} onChange={setReason}
                                options={reasons.map((value) => [value, value[0].toUpperCase() + value.slice(1)])} />
                        </Row>
                        <Row label="Note (optional)" htmlFor={`${formId}-note`}>
                            <Input id={`${formId}-note`} value={note ?? ''} maxLength={255} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNote(event.target.value || null)} />
                        </Row>
                    </div>
                    {error && <p role="alert" className="cm:text-sm cm:text-destructive">{error}</p>}
                </form>
                <DialogFooter>
                    <Button type="button" variant="ghost" disabled={saving} onClick={onClose}>Cancel</Button>
                    <Button type="submit" form={formId} disabled={saving || quantity === '' || Boolean(error)}>{saving ? 'Saving…' : 'Save adjustment'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
