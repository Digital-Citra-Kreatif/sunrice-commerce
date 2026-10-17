import { adminUrl, fetchJson, inertia, React, Sunrice, ui } from '../../lib/sunrice';
import { PageHeader } from '../../components/PageHeader';
import { MoneyInput } from '../../components/MoneyInput';
import { useCommerceShared } from '../../lib/store';
import RegionField from '../../fields/RegionField';

interface Line { item_id?: number | null; variant_id: number; label: string; sku: string | null; quantity: number; price: number; unit_price: number | null }
interface Props {
    mode: 'create' | 'edit' | 'quote';
    order: { id: number; number: string; customer: string; lines: Line[]; shipping: { label: string; cost: number } | null; discount: { label: string; amount: number } | null; needs_shipping: boolean; valid_until?: string } | null;
    paymentMethods: Array<{ value: string; label: string }>;
    canOverride: boolean;
    variantsUrl: string;
    previewUrl: string;
    submitUrl: string;
}
type Preview = { lines: Array<{ variant_id: number; unit_price_formatted: string; total: string }>; totals: Record<string, string>; needs_shipping: boolean; notices: string[] };

/** Shop → Orders → New order, and editing an unpaid order's lines. */
export default function OrderEditor({ mode, order, paymentMethods, canOverride, variantsUrl, previewUrl, submitUrl }: Props) {
    const { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Checkbox, Textarea } = ui;
    useCommerceShared();
    Sunrice.useBreadcrumbs([{ label: 'Shop', href: adminUrl('commerce') }, { label: 'Orders', href: adminUrl('commerce/orders') },
        ...(order ? [{ label: order.number, href: adminUrl(`commerce/orders/${order.id}`) }] : []), { label: mode === 'create' ? 'New order' : mode === 'quote' ? 'Quote' : 'Edit items' }]);
    const form = inertia.useForm({
        email: '', name: '', phone: '',
        lines: (order?.lines ?? []) as Line[],
        shipping: order?.shipping ?? { label: '', cost: 0 },
        discount: order?.discount ?? { label: '', amount: 0 },
        shipping_address: { name: '', phone: '', country: 'ID', province_code: null, city_code: null, district_code: null, village_code: null, line1: '', line2: '', postal_code: '' } as Record<string, unknown>,
        payment_status: 'unpaid', payment_method: paymentMethods[0]?.value ?? '', reference: '', note: '', send_link: false, notify: false,
        valid_until: order?.valid_until ?? '', send: true,
    });
    const errors = form.errors as Record<string, string>;
    const [query, setQuery] = React.useState('');
    const [results, setResults] = React.useState<Array<{ id: number; label: string; sku: string | null; price: number }>>([]);
    const [preview, setPreview] = React.useState<Preview | null>(null);

    React.useEffect(() => {
        if (query.trim().length < 2) { setResults([]); return; }
        const t = setTimeout(() => fetchJson<{ data: typeof results }>(`${adminUrl(variantsUrl)}&q=${encodeURIComponent(query)}`).then((r) => setResults(r.data)).catch(() => setResults([])), 250);
        return () => clearTimeout(t);
    }, [query]);

    React.useEffect(() => {
        if (form.data.lines.length === 0) { setPreview(null); return; }
        const t = setTimeout(() => {
            fetchJson<Preview>(adminUrl(previewUrl), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
                lines: form.data.lines.map(({ item_id, variant_id, quantity, unit_price }) => ({ item_id, variant_id, quantity, unit_price })),
                shipping: form.data.shipping, discount: form.data.discount, shipping_address: mode === 'create' ? form.data.shipping_address : undefined,
            }) }).then(setPreview).catch(() => setPreview(null));
        }, 300);
        return () => clearTimeout(t);
    }, [JSON.stringify([form.data.lines, form.data.shipping, form.data.discount, form.data.shipping_address])]);

    const add = (v: { id: number; label: string; sku: string | null; price: number }) => {
        const existing = form.data.lines.findIndex((l) => l.variant_id === v.id && !l.item_id);
        form.setData('lines', existing >= 0
            ? form.data.lines.map((l, i) => (i === existing ? { ...l, quantity: l.quantity + 1 } : l))
            : [...form.data.lines, { variant_id: v.id, label: v.label, sku: v.sku, quantity: 1, price: v.price, unit_price: null }]);
        setQuery('');
        setResults([]);
    };
    const setLine = (index: number, patch: Partial<Line>) => form.setData('lines', form.data.lines.map((l, i) => (i === index ? { ...l, ...patch } : l)));
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.transform((data: typeof form.data) => ({ ...data, lines: data.lines.map(({ item_id, variant_id, quantity, unit_price }) => ({ item_id, variant_id, quantity, unit_price })) }));
        mode === 'create' ? form.post(adminUrl(submitUrl)) : form.put(adminUrl(submitUrl));
    };
    const priceOf = (variantId: number) => preview?.lines.find((l) => l.variant_id === variantId);

    return (
        <form onSubmit={submit} className="cm:mx-auto cm:grid cm:w-full cm:max-w-5xl cm:gap-6 cm:p-4 cm:md:p-6">
            <PageHeader title={mode === 'create' ? 'New order' : mode === 'quote' ? `Quote ${order?.number}` : `Edit ${order?.number}`}
                description={mode === 'edit' ? 'Existing lines keep their price; new lines use today\'s price. The stock difference is reserved or given back.'
                    : mode === 'quote' ? `For ${order?.customer}. Set the prices, shipping and discount, then send it.` : 'An order for a customer, from a chat or a call.'} />
            <div className="cm:grid cm:gap-6 cm:lg:grid-cols-[2fr_1fr]">
                <div className="cm:grid cm:content-start cm:gap-6">
                    <Card>
                        <CardHeader><CardTitle>Products</CardTitle></CardHeader>
                        <CardContent className="cm:grid cm:gap-3">
                            <div className="cm:relative">
                                <Input placeholder="Search products by name or SKU…" value={query} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)} aria-label="Search products" />
                                {results.length > 0 && (
                                    <ul className="cm:absolute cm:z-10 cm:mt-1 cm:max-h-64 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow">
                                        {results.map((r) => (
                                            <li key={r.id}><button type="button" className="cm:flex cm:w-full cm:justify-between cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted" onClick={() => add(r)}>
                                                <span>{r.label}{r.sku ? <span className="cm:text-muted-foreground"> · {r.sku}</span> : null}</span>
                                            </button></li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            {errors.lines && <p className="cm:text-sm cm:text-destructive">{errors.lines}</p>}
                            {form.data.lines.length === 0 ? <p className="cm:text-sm cm:text-muted-foreground">No products yet.</p> : (
                                <ul className="cm:divide-y cm:divide-border">
                                    {form.data.lines.map((line, index) => (
                                        <li key={`${line.item_id ?? 'n'}-${line.variant_id}-${index}`} className="cm:grid cm:items-center cm:gap-2 cm:py-2 cm:sm:grid-cols-[1fr_5rem_9rem_7rem_auto]">
                                            <div className="cm:min-w-0 cm:text-sm"><p className="cm:font-medium">{line.label}</p>{line.sku && <p className="cm:text-xs cm:text-muted-foreground">{line.sku}</p>}</div>
                                            <Input type="number" min={1} aria-label="Quantity" value={line.quantity} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLine(index, { quantity: Math.max(1, Number(e.target.value)) })} />
                                            {canOverride
                                                ? <MoneyInput value={line.unit_price} placeholder={priceOf(line.variant_id)?.unit_price_formatted ?? ''} onChange={(v: number | null) => setLine(index, { unit_price: v })} />
                                                : <span className="cm:text-sm">{priceOf(line.variant_id)?.unit_price_formatted ?? '…'}</span>}
                                            <span className="cm:text-sm cm:font-medium cm:sm:text-right">{priceOf(line.variant_id)?.total ?? ''}</span>
                                            <Button type="button" variant="ghost" size="sm" aria-label="Remove" onClick={() => form.setData('lines', form.data.lines.filter((_, i) => i !== index))}>×</Button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {preview?.notices.map((n, i) => <p key={i} className="cm:text-sm cm:text-amber-700">{n}</p>)}
                        </CardContent>
                    </Card>

                    {mode === 'create' && (
                        <Card>
                            <CardHeader><CardTitle>Customer</CardTitle></CardHeader>
                            <CardContent className="cm:grid cm:gap-3 cm:sm:grid-cols-3">
                                <div className="cm:grid cm:gap-1"><Label htmlFor="m-email">Email *</Label><Input id="m-email" type="email" value={form.data.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('email', e.target.value)} />{errors.email && <p className="cm:text-sm cm:text-destructive">{errors.email}</p>}</div>
                                <div className="cm:grid cm:gap-1"><Label htmlFor="m-name">Name</Label><Input id="m-name" value={form.data.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('name', e.target.value)} /></div>
                                <div className="cm:grid cm:gap-1"><Label htmlFor="m-phone">Phone</Label><Input id="m-phone" value={form.data.phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('phone', e.target.value)} /></div>
                            </CardContent>
                        </Card>
                    )}

                    {mode === 'create' && (preview?.needs_shipping ?? true) && (
                        <Card>
                            <CardHeader><CardTitle>Shipping address</CardTitle></CardHeader>
                            <CardContent className="cm:grid cm:gap-3">
                                <div className="cm:grid cm:gap-3 cm:sm:grid-cols-2">
                                    {(['name', 'phone'] as const).map((key) => (
                                        <div key={key} className="cm:grid cm:gap-1"><Label htmlFor={`a-${key}`}>{key === 'name' ? 'Recipient' : 'Phone'}</Label>
                                            <Input id={`a-${key}`} value={String(form.data.shipping_address[key] ?? '')} onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('shipping_address', { ...form.data.shipping_address, [key]: e.target.value })} /></div>
                                    ))}
                                </div>
                                <RegionField field={{ handle: 'region', type: 'commerce_region', label: 'Region', config: { depth: 'village' } }} pathPrefix="shipping_address"
                                    value={form.data.shipping_address as never}
                                    onChange={(v: Record<string, unknown> | null) => form.setData('shipping_address', { ...form.data.shipping_address, ...(v ?? {}) })} />
                                <div className="cm:grid cm:gap-1"><Label htmlFor="a-line1">Street address</Label>
                                    <Input id="a-line1" value={String(form.data.shipping_address.line1 ?? '')} onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('shipping_address', { ...form.data.shipping_address, line1: e.target.value })} /></div>
                                <div className="cm:grid cm:gap-1 cm:sm:w-48"><Label htmlFor="a-postal">Postal code</Label>
                                    <Input id="a-postal" value={String(form.data.shipping_address.postal_code ?? '')} onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('shipping_address', { ...form.data.shipping_address, postal_code: e.target.value })} /></div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="cm:grid cm:content-start cm:gap-6">
                    <Card>
                        <CardHeader><CardTitle>Shipping and discount</CardTitle></CardHeader>
                        <CardContent className="cm:grid cm:gap-3">
                            <div className="cm:grid cm:gap-1"><Label htmlFor="s-label">Shipping method</Label><Input id="s-label" placeholder="JNE REG" value={form.data.shipping.label} onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('shipping', { ...form.data.shipping, label: e.target.value })} /></div>
                            <div className="cm:grid cm:gap-1"><Label htmlFor="s-cost">Shipping cost</Label><MoneyInput id="s-cost" allowNull={false} value={form.data.shipping.cost} onChange={(v: number | null) => form.setData('shipping', { ...form.data.shipping, cost: v ?? 0 })} /></div>
                            <div className="cm:grid cm:gap-1"><Label htmlFor="d-label">Discount label</Label><Input id="d-label" value={form.data.discount.label} onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('discount', { ...form.data.discount, label: e.target.value })} /></div>
                            <div className="cm:grid cm:gap-1"><Label htmlFor="d-amount">Discount</Label><MoneyInput id="d-amount" allowNull={false} value={form.data.discount.amount} onChange={(v: number | null) => form.setData('discount', { ...form.data.discount, amount: v ?? 0 })} /></div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Total</CardTitle></CardHeader>
                        <CardContent className="cm:grid cm:gap-1 cm:text-sm">
                            {preview ? (<>
                                <p className="cm:flex cm:justify-between"><span>Subtotal</span><span>{preview.totals.subtotal}</span></p>
                                <p className="cm:flex cm:justify-between"><span>Discount</span><span>−{preview.totals.discount}</span></p>
                                <p className="cm:flex cm:justify-between"><span>Shipping</span><span>{preview.totals.shipping}</span></p>
                                <p className="cm:flex cm:justify-between cm:text-base cm:font-semibold"><span>Total</span><span>{preview.totals.total}</span></p>
                            </>) : <p className="cm:text-muted-foreground">Add products to see the total.</p>}
                        </CardContent>
                    </Card>
                    {mode === 'create' && (
                        <Card>
                            <CardHeader><CardTitle>Payment</CardTitle></CardHeader>
                            <CardContent className="cm:grid cm:gap-3 cm:text-sm">
                                {(['unpaid', 'paid'] as const).map((status) => (
                                    <label key={status} className="cm:flex cm:items-center cm:gap-2"><input type="radio" name="payment_status" checked={form.data.payment_status === status} onChange={() => form.setData('payment_status', status)} />
                                        {status === 'unpaid' ? 'Unpaid: the customer pays later' : 'Paid already'}</label>
                                ))}
                                {paymentMethods.length > 0 && (
                                    <div className="cm:grid cm:gap-1"><Label htmlFor="p-method">Method</Label>
                                        <select id="p-method" className="cm:h-9 cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3" value={form.data.payment_method} onChange={(e) => form.setData('payment_method', e.target.value)}>
                                            <option value="">—</option>{paymentMethods.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                                        </select></div>
                                )}
                                {form.data.payment_status === 'paid'
                                    ? <div className="cm:grid cm:gap-1"><Label htmlFor="p-ref">Reference</Label><Input id="p-ref" value={form.data.reference} onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('reference', e.target.value)} /></div>
                                    : <label className="cm:flex cm:items-center cm:gap-2"><Checkbox checked={form.data.send_link} onCheckedChange={(v: boolean) => form.setData('send_link', v === true)} /> Email the customer the link to pay</label>}
                                <div className="cm:grid cm:gap-1"><Label htmlFor="m-note">Internal note</Label><Textarea id="m-note" value={form.data.note} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => form.setData('note', e.target.value)} /></div>
                            </CardContent>
                        </Card>
                    )}
                    {mode === 'quote' && (
                        <Card>
                            <CardHeader><CardTitle>Validity</CardTitle></CardHeader>
                            <CardContent className="cm:grid cm:gap-3 cm:text-sm">
                                <div className="cm:grid cm:gap-1"><Label htmlFor="q-valid">Valid until</Label><Input id="q-valid" type="date" value={form.data.valid_until} onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('valid_until', e.target.value)} />
                                    {errors.valid_until && <p className="cm:text-sm cm:text-destructive">{errors.valid_until}</p>}</div>
                                <label className="cm:flex cm:items-center cm:gap-2"><Checkbox checked={form.data.send} onCheckedChange={(v: boolean) => form.setData('send', v === true)} /> Send it to the customer now</label>
                            </CardContent>
                        </Card>
                    )}
                    {mode === 'edit' && (
                        <label className="cm:flex cm:items-center cm:gap-2 cm:text-sm"><Checkbox checked={form.data.notify} onCheckedChange={(v: boolean) => form.setData('notify', v === true)} /> Tell the customer about the change</label>
                    )}
                    <Button type="submit" disabled={form.processing || form.data.lines.length === 0}>{mode === 'create' ? 'Create order' : mode === 'quote' ? (form.data.send ? 'Send quote' : 'Save quote') : 'Save changes'}</Button>
                </div>
            </div>
        </form>
    );
}
