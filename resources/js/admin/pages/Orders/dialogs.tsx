import { adminUrl, inertia, React, ui } from '../../lib/sunrice';
import { MoneyInput } from '../../components/MoneyInput';
import type { OrderData } from './types';

/** Add a shipment: courier preset or free text, tracking, and the quantities in this parcel. */
export function ShipmentDialog({ order, couriers, onClose }: { order: OrderData; couriers: Array<{ key: string; name: string }>; onClose: () => void }) {
    const { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Button, Input, Label } = ui;
    const items = order.items.filter((i) => i.unfulfilled > 0);
    const form = inertia.useForm({
        courier: couriers[0]?.key ?? '', courier_name: '', service: '', tracking_number: '',
        items: items.map((i) => ({ order_item_id: i.id, quantity: i.unfulfilled })),
    });
    const errors = form.errors as Record<string, string>;
    const selectClass = 'cm:h-9 cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm';

    return (
        <Dialog open onOpenChange={(open: boolean) => !open && onClose()}>
            <DialogContent>
                <DialogHeader><DialogTitle>Add a shipment</DialogTitle></DialogHeader>
                <form className="cm:grid cm:gap-3" onSubmit={(e) => { e.preventDefault(); form.post(adminUrl(`commerce/orders/${order.id}/shipments`), { preserveScroll: true, onSuccess: onClose }); }}>
                    <div className="cm:grid cm:gap-1"><Label htmlFor="s-courier">Courier</Label>
                        <select id="s-courier" className={selectClass} value={form.data.courier} onChange={(e) => form.setData('courier', e.target.value)}>
                            {couriers.map((c) => <option key={c.key} value={c.key}>{c.name}</option>)}
                            <option value="">Other…</option>
                        </select>
                    </div>
                    {form.data.courier === '' && <div className="cm:grid cm:gap-1"><Label htmlFor="s-name">Courier name</Label><Input id="s-name" value={form.data.courier_name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('courier_name', e.target.value)} /></div>}
                    <div className="cm:grid cm:gap-1"><Label htmlFor="s-service">Service</Label><Input id="s-service" placeholder="REG, YES…" value={form.data.service} onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('service', e.target.value)} /></div>
                    <div className="cm:grid cm:gap-1"><Label htmlFor="s-tracking">Tracking number</Label><Input id="s-tracking" value={form.data.tracking_number} onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('tracking_number', e.target.value)} /></div>
                    <fieldset className="cm:grid cm:gap-2"><legend className="cm:mb-1 cm:text-sm cm:font-medium">In this parcel</legend>
                        {items.map((item, index) => (
                            <label key={item.id} className="cm:flex cm:items-center cm:justify-between cm:gap-3 cm:text-sm">
                                <span>{item.name}{item.variant_title ? ` · ${item.variant_title}` : ''} <span className="cm:text-muted-foreground">({item.unfulfilled} left)</span></span>
                                <Input type="number" min={0} max={item.unfulfilled} className="cm:w-20" value={form.data.items[index].quantity}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('items', form.data.items.map((row, i) => (i === index ? { ...row, quantity: Number(e.target.value) } : row)))} />
                            </label>
                        ))}
                        {errors.items && <p className="cm:text-sm cm:text-destructive">{errors.items}</p>}
                    </fieldset>
                    <DialogFooter><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit" disabled={form.processing}>Save shipment</Button></DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

/** Record a refund: amount (up to what's left), item quantities, reason and restock. */
export function RefundDialog({ order, onClose }: { order: OrderData; onClose: () => void }) {
    const { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription, Button, Input, Label, Checkbox } = ui;
    const form = inertia.useForm({
        amount: order.totals.refundable as number | null, reason: '', restock: false,
        items: order.items.map((i) => ({ order_item_id: i.id, quantity: 0 })),
    });
    const errors = form.errors as Record<string, string>;

    return (
        <Dialog open onOpenChange={(open: boolean) => !open && onClose()}>
            <DialogContent>
                <DialogHeader><DialogTitle>Refund</DialogTitle><DialogDescription>Record money you returned to the customer.</DialogDescription></DialogHeader>
                <form className="cm:grid cm:gap-3" onSubmit={(e) => { e.preventDefault(); form.post(adminUrl(`commerce/orders/${order.id}/refunds`), { preserveScroll: true, onSuccess: onClose }); }}>
                    <div className="cm:grid cm:gap-1"><Label htmlFor="r-amount">Amount</Label>
                        <MoneyInput id="r-amount" value={form.data.amount} onChange={(v: number | null) => form.setData('amount', v)} />
                        {errors.amount && <p className="cm:text-sm cm:text-destructive">{errors.amount}</p>}
                    </div>
                    <fieldset className="cm:grid cm:gap-2"><legend className="cm:mb-1 cm:text-sm cm:font-medium">Items returned (optional)</legend>
                        {order.items.map((item, index) => (
                            <label key={item.id} className="cm:flex cm:items-center cm:justify-between cm:gap-3 cm:text-sm">
                                <span>{item.name}{item.variant_title ? ` · ${item.variant_title}` : ''}</span>
                                <Input type="number" min={0} max={item.quantity - item.refunded_quantity} className="cm:w-20" value={form.data.items[index].quantity}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('items', form.data.items.map((row, i) => (i === index ? { ...row, quantity: Number(e.target.value) } : row)))} />
                            </label>
                        ))}
                    </fieldset>
                    <label className="cm:flex cm:items-center cm:gap-2 cm:text-sm"><Checkbox checked={form.data.restock} onCheckedChange={(v: boolean) => form.setData('restock', v === true)} /> Put the returned items back in stock</label>
                    <div className="cm:grid cm:gap-1"><Label htmlFor="r-reason">Reason</Label><Input id="r-reason" value={form.data.reason} onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('reason', e.target.value)} /></div>
                    <DialogFooter><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit" disabled={form.processing}>Record refund</Button></DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
