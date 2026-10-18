import { adminUrl, inertia, React, Sunrice, ui } from '../../lib/sunrice';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { useCommerceShared } from '../../lib/store';

interface Props {
    customer: {
        id: number; name: string | null; email: string; phone: string | null; note: string | null; accepts_marketing: boolean; locale: string | null;
        orders_count: number; total_spent: string; first_order_at: string | null; last_order_at: string | null; created_at: string | null;
        deletion_requested_at: string | null; anonymized: boolean;
        addresses: Array<{ id: number; label: string | null; text: string; default_shipping: boolean; default_billing: boolean }>;
    };
    account: { email_verified: boolean; roles: string[]; google: string | null } | null;
    roleOptions: string[];
    orders: Array<{ id: number; number: string; date: string; status: string; total: string; href: string }>;
    can: { edit: boolean; delete: boolean };
}

const date = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' }) : '—');

export default function CustomerShow({ customer, account, roleOptions, orders, can }: Props) {
    const { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Textarea, Switch, Checkbox } = ui;
    const { Link, router } = inertia;
    useCommerceShared();
    Sunrice.useBreadcrumbs([{ label: 'Shop', href: adminUrl('commerce') }, { label: 'Customers', href: adminUrl('commerce/customers') }, { label: customer.name ?? customer.email }]);
    const form = inertia.useForm({ name: customer.name ?? '', phone: customer.phone ?? '', note: customer.note ?? '', accepts_marketing: customer.accepts_marketing, roles: account?.roles ?? [] });
    const [confirming, setConfirming] = React.useState(false);
    const post = (path: string) => router.post(adminUrl(`commerce/customers/${customer.id}/${path}`), {}, { preserveScroll: true });

    return (
        <div className="cm:mx-auto cm:grid cm:w-full cm:max-w-5xl cm:gap-6 cm:p-4 cm:md:p-6">
            <PageHeader title={customer.name ?? customer.email} description={<>{customer.email}{customer.phone ? ` · ${customer.phone}` : ''}</>}
                actions={<>
                    {customer.deletion_requested_at && <StatusBadge tone="warning">Deletion requested {date(customer.deletion_requested_at)}</StatusBadge>}
                    {account ? <StatusBadge tone="ok">Registered</StatusBadge> : <StatusBadge>Guest</StatusBadge>}
                </>} />
            <div className="cm:grid cm:gap-4 cm:sm:grid-cols-3">
                {[['Orders', String(customer.orders_count)], ['Spent', customer.total_spent], ['Last order', date(customer.last_order_at)]].map(([label, value]) => (
                    <Card key={label}><CardContent className="cm:grid cm:gap-1 cm:pt-6"><span className="cm:text-sm cm:text-muted-foreground">{label}</span><span className="cm:text-xl cm:font-semibold">{value}</span></CardContent></Card>
                ))}
            </div>
            <div className="cm:grid cm:gap-6 cm:lg:grid-cols-[2fr_1fr]">
                <div className="cm:grid cm:content-start cm:gap-6">
                    <Card>
                        <CardHeader><CardTitle>Orders</CardTitle></CardHeader>
                        <CardContent>
                            {orders.length === 0 ? <p className="cm:text-sm cm:text-muted-foreground">No orders yet.</p> : (
                                <ul className="cm:grid cm:gap-1">{orders.map((o) => (
                                    <li key={o.id}><Link href={adminUrl(o.href)} className="cm:flex cm:justify-between cm:rounded cm:p-2 cm:hover:bg-muted">
                                        <span>{o.number} · {date(o.date)}</span><span><StatusBadge>{o.status}</StatusBadge> {o.total}</span>
                                    </Link></li>
                                ))}</ul>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Addresses</CardTitle></CardHeader>
                        <CardContent className="cm:grid cm:gap-3 cm:sm:grid-cols-2">
                            {customer.addresses.length === 0 ? <p className="cm:text-sm cm:text-muted-foreground">No saved addresses.</p> : customer.addresses.map((a) => (
                                <div key={a.id} className="cm:rounded-md cm:border cm:p-3 cm:text-sm">
                                    {a.label && <p className="cm:font-medium">{a.label}</p>}
                                    <p className="cm:whitespace-pre-line">{a.text}</p>
                                    <div className="cm:mt-1 cm:flex cm:gap-1">{a.default_shipping && <StatusBadge>Shipping</StatusBadge>}{a.default_billing && <StatusBadge>Billing</StatusBadge>}</div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
                <div className="cm:grid cm:content-start cm:gap-6">
                    <Card>
                        <CardHeader><CardTitle>Details</CardTitle></CardHeader>
                        <CardContent>
                            <form className="cm:grid cm:gap-3" onSubmit={(e) => { e.preventDefault(); form.put(adminUrl(`commerce/customers/${customer.id}`), { preserveScroll: true }); }}>
                                <div className="cm:grid cm:gap-1"><Label htmlFor="c-name">Name</Label><Input id="c-name" disabled={!can.edit} value={form.data.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('name', e.target.value)} /></div>
                                <div className="cm:grid cm:gap-1"><Label htmlFor="c-phone">Phone</Label><Input id="c-phone" disabled={!can.edit} value={form.data.phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('phone', e.target.value)} /></div>
                                <div className="cm:grid cm:gap-1"><Label htmlFor="c-note">Note (staff only)</Label><Textarea id="c-note" disabled={!can.edit} value={form.data.note} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => form.setData('note', e.target.value)} /></div>
                                <div className="cm:flex cm:items-center cm:gap-2"><Switch id="c-marketing" disabled={!can.edit} checked={form.data.accepts_marketing} onCheckedChange={(v: boolean) => form.setData('accepts_marketing', v)} /><Label htmlFor="c-marketing">Accepts marketing</Label></div>
                                {account && (
                                    <fieldset className="cm:grid cm:gap-1.5">
                                        <legend className="cm:mb-1 cm:text-sm cm:font-medium">Roles</legend>
                                        {roleOptions.map((role) => (
                                            <label key={role} className="cm:flex cm:items-center cm:gap-2 cm:text-sm">
                                                <Checkbox disabled={!can.edit} checked={form.data.roles.includes(role)}
                                                    onCheckedChange={(on: boolean) => form.setData('roles', on ? [...form.data.roles, role] : form.data.roles.filter((r) => r !== role))} />
                                                {role}
                                            </label>
                                        ))}
                                    </fieldset>
                                )}
                                {can.edit && <Button type="submit" disabled={form.processing}>Save</Button>}
                            </form>
                        </CardContent>
                    </Card>
                    {account && (
                        <Card>
                            <CardHeader><CardTitle>Account</CardTitle></CardHeader>
                            <CardContent className="cm:grid cm:gap-2 cm:text-sm">
                                <p>Email {account.email_verified ? 'verified' : 'not verified'}</p>
                                {account.google && <p>Google: {account.google}</p>}
                                {can.edit && <Button variant="outline" size="sm" onClick={() => post('password-reset')}>Send a password reset link</Button>}
                                {can.edit && !account.email_verified && <Button variant="outline" size="sm" onClick={() => post('verify')}>Mark email verified</Button>}
                            </CardContent>
                        </Card>
                    )}
                    {can.delete && !customer.anonymized && (
                        <Card>
                            <CardHeader><CardTitle>Remove personal data</CardTitle></CardHeader>
                            <CardContent className="cm:grid cm:gap-2 cm:text-sm">
                                <p className="cm:text-muted-foreground">Name, email, phone and addresses are deleted; orders keep their amounts.</p>
                                {confirming
                                    ? <div className="cm:flex cm:gap-2"><Button variant="destructive" size="sm" onClick={() => post('anonymize')}>Remove for good</Button><Button variant="outline" size="sm" onClick={() => setConfirming(false)}>Cancel</Button></div>
                                    : <Button variant="outline" size="sm" onClick={() => setConfirming(true)}>Anonymize</Button>}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
