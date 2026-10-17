import { adminUrl, inertia, React, Sunrice, ui } from '../../lib/sunrice';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { EmptyState } from '../../components/EmptyState';
import { useCommerceShared } from '../../lib/store';

interface Confirmation {
    id: number;
    order: { id: number; number: string; customer: string | null; href: string };
    expected: string | null; expected_amount: number | null; amount: string; amount_value: number; method: string | null;
    sender_name: string; sender_bank: string | null; transferred_at: string | null;
    destination: { bank?: string; number?: string; holder?: string } | null; note: string | null;
    proof_url: string | null; proof_is_pdf: boolean; status: string; review_note: string | null; created_at: string | null;
}

/** Shop → Payments to verify: each confirmation with its proof, approve or reject. */
export default function ConfirmationsIndex({ status, confirmations }: { status: string; confirmations: Confirmation[] }) {
    const { Card, CardContent, Button, Input, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } = ui;
    const { Link, router } = inertia;
    useCommerceShared();
    Sunrice.useBreadcrumbs([{ label: 'Shop', href: adminUrl('commerce') }, { label: 'Payments to verify' }]);
    const [rejecting, setRejecting] = React.useState<Confirmation | null>(null);
    const [reason, setReason] = React.useState('');
    const approve = (c: Confirmation) => {
        const short = c.expected_amount !== null && c.amount_value < c.expected_amount;
        if (short && !window.confirm(`${c.amount} is less than the ${c.expected} expected. Approve anyway?`)) return;
        router.post(adminUrl(`commerce/confirmations/${c.id}/approve`), { anyway: short }, { preserveScroll: true });
    };

    return (
        <div className="cm:mx-auto cm:grid cm:w-full cm:max-w-5xl cm:gap-6 cm:p-4 cm:md:p-6">
            <PageHeader title="Payments to verify" description="Customers' transfer confirmations. Compare the proof with the amount expected, then approve or reject." />
            <div className="cm:flex cm:gap-2">
                {['submitted', 'approved', 'rejected'].map((s) => (
                    <Button key={s} size="sm" variant={s === status ? 'default' : 'outline'} asChild>
                        <Link href={adminUrl(`commerce/confirmations?status=${s}`)}>{s === 'submitted' ? 'Waiting' : s[0].toUpperCase() + s.slice(1)}</Link>
                    </Button>
                ))}
            </div>
            {confirmations.length === 0 && <EmptyState title={status === 'submitted' ? 'Nothing to verify' : 'None yet'} />}
            {confirmations.map((c) => (
                <Card key={c.id}>
                    <CardContent className="cm:grid cm:gap-4 cm:pt-6 cm:md:grid-cols-[1fr_16rem]">
                        <div className="cm:grid cm:content-start cm:gap-1 cm:text-sm">
                            <p className="cm:text-base cm:font-medium"><Link href={adminUrl(c.order.href)} className="cm:hover:underline">{c.order.number}</Link> · {c.order.customer}</p>
                            <p>Sent <strong>{c.amount}</strong>{c.expected && <> · expected <strong>{c.expected}</strong></>}
                                {c.expected_amount !== null && c.amount_value < c.expected_amount && <> <StatusBadge tone="warning">Less than expected</StatusBadge></>}</p>
                            <p>From {c.sender_name}{c.sender_bank ? ` (${c.sender_bank})` : ''} on {c.transferred_at ?? '—'}</p>
                            {c.destination && <p>Into {c.destination.bank} {c.destination.number} · {c.destination.holder}</p>}
                            {c.method && <p className="cm:text-muted-foreground">{c.method}</p>}
                            {c.note && <p className="cm:whitespace-pre-line cm:text-muted-foreground">“{c.note}”</p>}
                            {c.review_note && <p className="cm:text-muted-foreground">Rejected: {c.review_note}</p>}
                            {c.status === 'submitted' && (
                                <div className="cm:mt-2 cm:flex cm:gap-2">
                                    <Button size="sm" onClick={() => approve(c)}>Approve</Button>
                                    <Button size="sm" variant="outline" onClick={() => { setRejecting(c); setReason(''); }}>Reject</Button>
                                </div>
                            )}
                        </div>
                        <div>
                            {c.proof_url ? (c.proof_is_pdf
                                ? <a href={c.proof_url} target="_blank" rel="noreferrer" className="cm:underline">Open the PDF proof</a>
                                : <a href={c.proof_url} target="_blank" rel="noreferrer"><img src={c.proof_url} alt={`Proof for ${c.order.number}`} className="cm:max-h-72 cm:w-full cm:rounded-md cm:border cm:object-contain" /></a>)
                                : <p className="cm:text-sm cm:text-muted-foreground">No proof attached.</p>}
                        </div>
                    </CardContent>
                </Card>
            ))}
            <Dialog open={rejecting !== null} onOpenChange={(open: boolean) => !open && setRejecting(null)}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Reject this confirmation?</DialogTitle></DialogHeader>
                    <p className="cm:text-sm cm:text-muted-foreground">The customer is emailed the reason and can confirm again; the payment deadline resumes.</p>
                    <Input aria-label="Reason" placeholder="e.g. We haven't received the transfer yet" value={reason} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReason(e.target.value)} />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejecting(null)}>Back</Button>
                        <Button disabled={reason.trim() === ''} onClick={() => rejecting && router.post(adminUrl(`commerce/confirmations/${rejecting.id}/reject`), { reason }, { preserveScroll: true, onSuccess: () => setRejecting(null) })}>Reject</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
