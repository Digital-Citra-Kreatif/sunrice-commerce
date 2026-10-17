import { adminUrl, inertia, React, Sunrice, ui } from '../../lib/sunrice';
import { api } from '../../lib/api';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { useCommerceShared } from '../../lib/store';
import { ShipmentDialog, RefundDialog } from './dialogs';
import type { OrderPageProps } from './types';

const dateTime = (iso: string | null) => (iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '—');
const tone = (status: string) => ({
    completed: 'ok', paid: 'ok', shipped: 'ok', delivered: 'ok', accepted: 'ok',
    processing: 'info', quoted: 'info', partially_shipped: 'info', awaiting_confirmation: 'info', partially_refunded: 'info',
    pending: 'warning', requested: 'warning', on_hold: 'warning', unpaid: 'warning', unfulfilled: 'warning',
    cancelled: 'error', failed: 'error', refunded: 'error', declined: 'error', expired: 'error',
}[status] ?? 'neutral');

export default function OrderShow(props: OrderPageProps) {
    const { order, transitions, can, panels } = props;
    const { Card, CardContent, CardHeader, CardTitle, Button, Textarea, Label, Checkbox, Input, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } = ui;
    const { Link, router } = inertia;
    useCommerceShared();
    Sunrice.useBreadcrumbs([{ label: 'Shop', href: adminUrl('commerce') }, { label: 'Orders', href: adminUrl('commerce/orders') }, { label: order.number }]);
    const base = `commerce/orders/${order.id}`;
    const [transition, setTransition] = React.useState<{ to: string; label: string } | null>(null);
    const [reason, setReason] = React.useState('');
    const [paying, setPaying] = React.useState(false);
    const [shipping, setShipping] = React.useState(false);
    const [refunding, setRefunding] = React.useState(false);
    const note = inertia.useForm({ message: '', customer: false });
    const paid = inertia.useForm({ reference: '', paid_at: '', account: '' });
    const registry = api.orderPanels();

    const go = (to: string, why?: string) => router.post(adminUrl(`${base}/transition`), { to, reason: why ?? null }, { preserveScroll: true, onFinish: () => setTransition(null) });

    return (
        <div className="cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6">
            <PageHeader
                title={`${order.type === 'quote' ? 'Quote' : 'Order'} ${order.number}`}
                description={<>Placed {dateTime(order.placed_at)} · {order.channel}{order.trashed ? ' · in the trash' : ''}</>}
                actions={<div className="cm:flex cm:flex-wrap cm:items-center cm:gap-2">
                    <StatusBadge tone={tone(order.status)}>{order.status_label}</StatusBadge>
                    {order.type === 'order' && <StatusBadge tone={tone(order.payment_status)}>{order.payment_label}</StatusBadge>}
                    {order.type === 'order' && order.fulfillment_status !== 'not_required' && <StatusBadge tone={tone(order.fulfillment_status)}>{order.fulfillment_label}</StatusBadge>}
                    <Button variant="outline" size="sm" asChild><a href={order.storefront_url} target="_blank" rel="noreferrer">Customer view</a></Button>
                </div>} />

            <div className="cm:flex cm:flex-wrap cm:gap-2">
                {transitions.filter((t) => t.permission).map((t) => (
                    <Button key={t.to} size="sm" variant={t.to === 'cancelled' ? 'outline' : 'default'} disabled={!t.allowed} title={t.reason ?? undefined}
                        onClick={() => (t.to === 'cancelled' || t.to === 'on_hold' ? setTransition(t) : go(t.to))}>
                        {t.to === 'cancelled' ? 'Cancel order' : `Mark ${t.label.toLowerCase()}`}
                    </Button>
                ))}
                {can.mark_paid && <Button size="sm" variant="outline" onClick={() => setPaying(true)}>Mark paid</Button>}
                {can.shipments && order.items.some((i) => i.unfulfilled > 0) && <Button size="sm" variant="outline" onClick={() => setShipping(true)}>Add shipment</Button>}
                {can.refund && <Button size="sm" variant="outline" onClick={() => setRefunding(true)}>Refund</Button>}
                {can.send_link && <Button size="sm" variant="outline" onClick={() => router.post(adminUrl(`${base}/payment-link`), {}, { preserveScroll: true })}>Send payment link</Button>}
                {can.edit_items && <Button size="sm" variant="outline" asChild><Link href={adminUrl(`${base}/edit`)}>Edit items</Link></Button>}
                {can.respond_quote && <Button size="sm" asChild><Link href={adminUrl(`${base}/quote`)}>{order.status === 'quoted' ? 'Edit quote' : 'Send a quote'}</Link></Button>}
                {can.delete && !order.trashed && (
                    <Button size="sm" variant="ghost" className="cm:ml-auto cm:text-destructive"
                        onClick={() => window.confirm('Move this order to the trash?') && router.delete(adminUrl(base))}>Trash</Button>
                )}
                {can.delete && order.trashed && <Button size="sm" variant="outline" className="cm:ml-auto" onClick={() => router.post(adminUrl(`${base}/restore`))}>Restore</Button>}
                {can.force_delete && (
                    <Button size="sm" variant="ghost" className="cm:text-destructive"
                        onClick={() => window.confirm('Delete this order for good? This can\'t be undone.') && router.delete(adminUrl(`${base}/force`))}>Delete for good</Button>
                )}
            </div>

            <div className="cm:grid cm:gap-6 cm:lg:grid-cols-[2fr_1fr]">
                <div className="cm:grid cm:content-start cm:gap-6">
                    <Card>
                        <CardHeader><CardTitle>Items</CardTitle></CardHeader>
                        <CardContent className="cm:grid cm:gap-4">
                            <ul className="cm:divide-y cm:divide-border">
                                {order.items.map((item) => (
                                    <li key={item.id} className="cm:grid cm:gap-1 cm:py-3 cm:first:pt-0 cm:sm:grid-cols-[1fr_auto] cm:sm:gap-4">
                                        <div className="cm:min-w-0">
                                            <p className="cm:font-medium">
                                                {item.product_href ? <Link href={adminUrl(item.product_href)} className="cm:hover:underline">{item.name}</Link> : item.name}
                                                {item.variant_title && <span className="cm:text-muted-foreground"> · {item.variant_title}</span>}
                                            </p>
                                            <p className="cm:text-xs cm:text-muted-foreground">
                                                {item.sku && <>SKU {item.sku} · </>}{item.price_source.label}
                                                {item.requires_shipping && order.fulfillment_status !== 'not_required' && <> · shipped {item.fulfilled_quantity}/{item.quantity}</>}
                                                {item.refunded_quantity > 0 && <> · refunded {item.refunded_quantity}</>}
                                            </p>
                                            {item.components.length > 0 && (
                                                <ul className="cm:mt-1 cm:text-xs cm:text-muted-foreground">{item.components.map((c, i) => <li key={i}>{c.quantity} × {c.name}</li>)}</ul>
                                            )}
                                        </div>
                                        <div className="cm:text-sm cm:sm:text-right">
                                            <p>{item.quantity} × {item.regular_unit_price && <del className="cm:text-muted-foreground">{item.regular_unit_price}</del>} {item.unit_price_formatted}</p>
                                            {item.discount && <p className="cm:text-xs cm:text-muted-foreground">−{item.discount}</p>}
                                            <p className="cm:font-medium">{item.total}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <dl className="cm:grid cm:gap-1 cm:border-t cm:pt-3 cm:text-sm">
                                <Row label="Subtotal" value={order.totals.subtotal} />
                                {order.adjustments.filter((a) => a.kind !== 'tax').map((a, i) => <Row key={i} label={`${a.label}${a.code ? ` (${a.code})` : ''}`} value={a.amount} muted />)}
                                {order.totals.shipping !== null && <Row label={`Shipping${order.shipping_method?.label ? ` · ${order.shipping_method.label}` : ''}`} value={order.totals.shipping} />}
                                {order.adjustments.filter((a) => a.kind === 'tax').map((a, i) => <Row key={`t${i}`} label={`${a.label}${a.included ? ' (included)' : ''}`} value={a.amount} muted />)}
                                <Row label="Total" value={order.totals.total} strong />
                                {order.type === 'order' && <Row label="Paid" value={order.totals.paid} muted />}
                                {order.totals.refunded && <Row label="Refunded" value={`−${order.totals.refunded}`} muted />}
                            </dl>
                        </CardContent>
                    </Card>

                    {(order.payments.length > 0 || order.confirmations.length > 0) && (
                        <Card>
                            <CardHeader><CardTitle>Payments</CardTitle></CardHeader>
                            <CardContent className="cm:grid cm:gap-2 cm:text-sm">
                                {order.payments.map((p) => (
                                    <div key={p.id} className="cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2 cm:rounded-md cm:border cm:p-3">
                                        <div><p className="cm:font-medium">{p.method} · {p.amount}</p>
                                            <p className="cm:text-xs cm:text-muted-foreground">{p.reference && <>Ref {p.reference} · </>}{p.paid_at ? `Paid ${dateTime(p.paid_at)}` : p.expires_at ? `Due ${dateTime(p.expires_at)}` : ''}{p.refunded && ` · refunded ${p.refunded}`}</p></div>
                                        <StatusBadge tone={tone(p.status)}>{p.status.replace(/_/g, ' ')}</StatusBadge>
                                    </div>
                                ))}
                                {order.confirmations.map((c) => (
                                    <div key={c.id} className="cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2 cm:rounded-md cm:border cm:border-dashed cm:p-3">
                                        <span>Confirmation from {c.sender_name}{c.sender_bank ? ` (${c.sender_bank})` : ''} · {c.amount}
                                            {c.proof_url && <> · <a href={c.proof_url} target="_blank" rel="noreferrer" className="cm:underline">proof</a></>}</span>
                                        <span className="cm:flex cm:items-center cm:gap-2">
                                            <StatusBadge tone={c.status === 'approved' ? 'ok' : c.status === 'rejected' ? 'error' : 'warning'}>{c.status}</StatusBadge>
                                            {c.can_review && <Button size="sm" asChild><Link href={adminUrl('commerce/confirmations')}>Review</Link></Button>}
                                        </span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {order.shipments.length > 0 && (
                        <Card>
                            <CardHeader><CardTitle>Shipments</CardTitle></CardHeader>
                            <CardContent className="cm:grid cm:gap-2 cm:text-sm">
                                {order.shipments.map((s) => (
                                    <div key={s.id} className="cm:grid cm:gap-1 cm:rounded-md cm:border cm:p-3">
                                        <div className="cm:flex cm:items-center cm:justify-between">
                                            <span className="cm:font-medium">{s.courier}{s.service ? ` ${s.service}` : ''}{s.tracking_number && <> · {s.tracking_url ? <a href={s.tracking_url} target="_blank" rel="noreferrer" className="cm:underline">{s.tracking_number}</a> : s.tracking_number}</>}</span>
                                            <StatusBadge tone={tone(s.status)}>{s.status.replace(/_/g, ' ')}</StatusBadge>
                                        </div>
                                        <p className="cm:text-xs cm:text-muted-foreground">{s.items.map((i) => `${i.quantity} × ${i.name}`).join(', ')} · shipped {dateTime(s.shipped_at)}{s.delivered_at ? ` · delivered ${dateTime(s.delivered_at)}` : ''}</p>
                                        {can.shipments && s.status !== 'delivered' && (
                                            <div><Button size="sm" variant="outline" onClick={() => router.post(adminUrl(`${base}/shipments/${s.id}/delivered`), {}, { preserveScroll: true })}>Mark delivered</Button></div>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {order.refunds.length > 0 && (
                        <Card>
                            <CardHeader><CardTitle>Refunds</CardTitle></CardHeader>
                            <CardContent className="cm:grid cm:gap-1 cm:text-sm">
                                {order.refunds.map((r) => <p key={r.id}>{r.amount} · {dateTime(r.created_at)}{r.reason ? ` · ${r.reason}` : ''}{r.restock ? ' · restocked' : ''}</p>)}
                            </CardContent>
                        </Card>
                    )}

                    {panels.map((panel) => {
                        const Panel = registry[panel.key];
                        return Panel ? (
                            <Card key={panel.key}><CardHeader><CardTitle>{panel.label}</CardTitle></CardHeader><CardContent><Panel order={order} data={panel.data} /></CardContent></Card>
                        ) : null;
                    })}

                    <Card>
                        <CardHeader><CardTitle>Timeline</CardTitle></CardHeader>
                        <CardContent className="cm:grid cm:gap-4">
                            {can.edit && (
                                <form className="cm:grid cm:gap-2" onSubmit={(e) => { e.preventDefault(); note.post(adminUrl(`${base}/notes`), { preserveScroll: true, onSuccess: () => note.reset() }); }}>
                                    <Label htmlFor="o-note" className="cm:sr-only">Note</Label>
                                    <Textarea id="o-note" placeholder="Add a note…" value={note.data.message} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => note.setData('message', e.target.value)} />
                                    <div className="cm:flex cm:items-center cm:justify-between cm:gap-2">
                                        <label className="cm:flex cm:items-center cm:gap-2 cm:text-sm"><Checkbox checked={note.data.customer} onCheckedChange={(v: boolean) => note.setData('customer', v === true)} /> Send to the customer</label>
                                        <Button size="sm" type="submit" disabled={note.processing || note.data.message.trim() === ''}>Add note</Button>
                                    </div>
                                </form>
                            )}
                            <ol className="cm:grid cm:gap-3 cm:text-sm">
                                {order.timeline.map((e) => (
                                    <li key={e.id} className="cm:grid cm:gap-0.5 cm:border-l-2 cm:pl-3" style={{ borderColor: e.visibility === 'customer' ? 'var(--color-primary, currentColor)' : undefined }}>
                                        <span className="cm:whitespace-pre-line">{e.message}</span>
                                        <span className="cm:text-xs cm:text-muted-foreground">{dateTime(e.created_at)} · {e.actor ?? e.source}{e.visibility === 'customer' ? ' · to the customer' : ''}</span>
                                    </li>
                                ))}
                            </ol>
                        </CardContent>
                    </Card>
                </div>

                <div className="cm:grid cm:content-start cm:gap-6">
                    <Card>
                        <CardHeader><CardTitle>Customer</CardTitle></CardHeader>
                        <CardContent className="cm:grid cm:gap-1 cm:text-sm">
                            <p className="cm:font-medium">{order.customer.href ? <Link href={adminUrl(order.customer.href)} className="cm:hover:underline">{order.customer.name ?? order.customer.email}</Link> : (order.customer.name ?? order.customer.email)}</p>
                            {order.customer.email && <a href={`mailto:${order.customer.email}`} className="cm:text-muted-foreground cm:hover:underline">{order.customer.email}</a>}
                            {order.customer.phone && <a href={`https://wa.me/${order.customer.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="cm:text-muted-foreground cm:hover:underline">{order.customer.phone}</a>}
                            {order.customer.guest && <p className="cm:text-xs cm:text-muted-foreground">Guest checkout</p>}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="cm:flex cm:flex-row cm:items-center cm:justify-between">
                            <CardTitle>Addresses</CardTitle>
                            {can.edit_addresses && <Button size="sm" variant="ghost" asChild><Link href={adminUrl(`${base}/addresses`)}>Edit</Link></Button>}
                        </CardHeader>
                        <CardContent className="cm:grid cm:gap-3 cm:text-sm">
                            {order.pickup && <div><p className="cm:text-xs cm:font-medium cm:uppercase cm:text-muted-foreground">Pickup</p><p>{order.pickup.name}<br />{order.pickup.address}</p></div>}
                            {order.shipping_address_text && <div><p className="cm:text-xs cm:font-medium cm:uppercase cm:text-muted-foreground">Shipping</p><p className="cm:whitespace-pre-line">{order.shipping_address_text}</p></div>}
                            {order.billing_address_text && order.billing_address_text !== order.shipping_address_text && <div><p className="cm:text-xs cm:font-medium cm:uppercase cm:text-muted-foreground">Billing</p><p className="cm:whitespace-pre-line">{order.billing_address_text}</p></div>}
                            {order.dropship && <div><p className="cm:text-xs cm:font-medium cm:uppercase cm:text-muted-foreground">Dropshipper</p><p>{order.dropship.name} · {order.dropship.phone}</p></div>}
                            {!order.shipping_address_text && !order.billing_address_text && !order.pickup && <p className="cm:text-muted-foreground">No address.</p>}
                        </CardContent>
                    </Card>
                    {(order.customer_note || (order.fields && Object.keys(order.fields).length > 0)) && (
                        <Card>
                            <CardHeader><CardTitle>From the customer</CardTitle></CardHeader>
                            <CardContent className="cm:grid cm:gap-2 cm:text-sm">
                                {order.customer_note && <p className="cm:whitespace-pre-line">{order.customer_note}</p>}
                                {order.fields && Object.entries(order.fields).map(([k, v]) => <p key={k}><span className="cm:text-muted-foreground">{k.replace(/_/g, ' ')}:</span> {String(v ?? '')}</p>)}
                            </CardContent>
                        </Card>
                    )}
                    <Card>
                        <CardHeader><CardTitle>Details</CardTitle></CardHeader>
                        <CardContent className="cm:grid cm:gap-1 cm:text-sm">
                            {order.payment_method_title && <p>Payment: {order.payment_method_title}</p>}
                            {order.expires_at && order.payment_status === 'unpaid' && <p>Pay before {dateTime(order.expires_at)}</p>}
                            {order.paid_at && <p>Paid {dateTime(order.paid_at)}</p>}
                            {order.completed_at && <p>Completed {dateTime(order.completed_at)}</p>}
                            {order.cancelled_at && <p>Cancelled {dateTime(order.cancelled_at)}{order.cancel_reason ? ` — ${order.cancel_reason}` : ''}</p>}
                            {order.quote_valid_until && <p>Quote valid until {dateTime(order.quote_valid_until)}</p>}
                            {order.documents.map((d) => <p key={d.id}>{d.type.replace('_', ' ')} {d.number}</p>)}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={transition !== null} onOpenChange={(open: boolean) => !open && setTransition(null)}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{transition?.to === 'cancelled' ? 'Cancel this order?' : 'Put this order on hold?'}</DialogTitle>
                        <DialogDescription>{transition?.to === 'cancelled' ? 'Stock, flash sale quantities and voucher uses are given back.' : 'It can go back to its status later.'}</DialogDescription></DialogHeader>
                    <div className="cm:grid cm:gap-1"><Label htmlFor="o-reason">Reason (on the timeline)</Label><Input id="o-reason" value={reason} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReason(e.target.value)} /></div>
                    <DialogFooter><Button variant="outline" onClick={() => setTransition(null)}>Back</Button><Button onClick={() => transition && go(transition.to, reason)}>Confirm</Button></DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={paying} onOpenChange={setPaying}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Mark as paid</DialogTitle><DialogDescription>Record a payment you received outside the store ({order.totals.total}).</DialogDescription></DialogHeader>
                    <form className="cm:grid cm:gap-3" onSubmit={(e) => { e.preventDefault(); paid.post(adminUrl(`${base}/mark-paid`), { preserveScroll: true, onSuccess: () => setPaying(false) }); }}>
                        <div className="cm:grid cm:gap-1"><Label htmlFor="p-ref">Reference</Label><Input id="p-ref" value={paid.data.reference} onChange={(e: React.ChangeEvent<HTMLInputElement>) => paid.setData('reference', e.target.value)} /></div>
                        <div className="cm:grid cm:gap-1"><Label htmlFor="p-date">Paid on</Label><Input id="p-date" type="datetime-local" value={paid.data.paid_at} onChange={(e: React.ChangeEvent<HTMLInputElement>) => paid.setData('paid_at', e.target.value)} /></div>
                        <div className="cm:grid cm:gap-1"><Label htmlFor="p-acc">Into account</Label><Input id="p-acc" value={paid.data.account} onChange={(e: React.ChangeEvent<HTMLInputElement>) => paid.setData('account', e.target.value)} /></div>
                        <DialogFooter><Button type="submit" disabled={paid.processing}>Record payment</Button></DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {shipping && <ShipmentDialog order={order} couriers={props.couriers} onClose={() => setShipping(false)} />}
            {refunding && <RefundDialog order={order} onClose={() => setRefunding(false)} />}
        </div>
    );
}

function Row({ label, value, muted, strong }: { label: string; value: string; muted?: boolean; strong?: boolean }) {
    return (
        <div className={`cm:flex cm:justify-between cm:gap-4 ${muted ? 'cm:text-muted-foreground' : ''} ${strong ? 'cm:text-base cm:font-semibold' : ''}`}>
            <dt>{label}</dt><dd>{value}</dd>
        </div>
    );
}
