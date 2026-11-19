import { React, adminUrl, inertia, ui } from '../lib/sunrice';

export type PaymentConfirmation = {
    id: number;
    order: { number: string; customer: string; href: string };
    expected: string | null;
    amount: string;
    short: boolean;
    method: string | null;
    sender_name: string;
    sender_bank: string | null;
    transferred_at: string | null;
    destination: { bank?: string; number?: string; holder?: string } | null;
    note: string | null;
    proof_url: string | null;
    proof_is_pdf: boolean;
    status: string;
    review_note: string | null;
};

export function PaymentConfirmationDialog({ confirmation: c }: { confirmation: PaymentConfirmation }) {
    const { Button, Dialog, DialogTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription, Label, Textarea } = ui;
    const [open, setOpen] = React.useState(false);
    const [rejecting, setRejecting] = React.useState(false);
    const [serverError, setServerError] = React.useState('');
    const form = inertia.useForm({ reason: '', anyway: false });
    const pending = c.status === 'submitted';
    const toggle = (next: boolean) => {
        setOpen(next);
        if (next) {
            setRejecting(false);
            setServerError('');
            form.reset();
        }
    };
    const decide = (action: 'approve' | 'reject') => {
        setServerError('');
        form.post(adminUrl(`commerce/confirmations/${c.id}/${action}`), {
            preserveScroll: true,
            onSuccess: (page: { props: { flash?: { error?: string } } }) => {
                const error = page.props.flash?.error;
                if (error) setServerError(error);
                else setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={toggle}>
            <DialogTrigger asChild><Button type="button" size="sm" variant={pending ? 'default' : 'outline'}>{pending ? 'Review' : 'View'}</Button></DialogTrigger>
            <DialogContent className="cm:max-h-[90dvh] cm:overflow-y-auto cm:sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{rejecting ? 'Reject payment confirmation' : 'Payment confirmation'}</DialogTitle>
                    <DialogDescription>{c.order.number} · {c.order.customer}</DialogDescription>
                </DialogHeader>
                <dl className="cm:grid cm:grid-cols-[auto_1fr] cm:gap-x-4 cm:gap-y-1 cm:text-sm">
                    <dt>Amount sent</dt><dd className="cm:font-semibold">{c.amount}</dd>
                    <dt>Expected</dt><dd>{c.expected ?? '—'}</dd>
                    <dt>Sender</dt><dd>{c.sender_name}{c.sender_bank ? ` · ${c.sender_bank}` : ''}</dd>
                    <dt>Transfer date</dt><dd>{c.transferred_at ?? '—'}</dd>
                    {c.method && <><dt>Method</dt><dd>{c.method}</dd></>}
                    {c.destination && <><dt>Destination</dt><dd>{[c.destination.bank, c.destination.number, c.destination.holder].filter(Boolean).join(' · ') || '—'}</dd></>}
                </dl>
                {c.note && <p className="cm:whitespace-pre-line cm:text-sm cm:text-muted-foreground">{c.note}</p>}
                {c.review_note && <p className="cm:text-sm">Rejection reason · {c.review_note}</p>}
                {c.proof_url ? (
                    <a href={c.proof_url} target="_blank" rel="noopener noreferrer" className="cm:text-sm cm:underline">
                        {c.proof_is_pdf ? 'Open PDF proof' : <img src={c.proof_url} alt={`Transfer proof for ${c.order.number}`} className="cm:max-h-56 cm:w-full cm:rounded-md cm:border cm:object-contain" />}
                    </a>
                ) : <p className="cm:text-sm cm:text-muted-foreground">No proof attached.</p>}
                {pending && rejecting && (
                    <label className="cm:grid cm:gap-2 cm:text-sm">
                        <span>Reason sent to the customer</span>
                        <Textarea value={form.data.reason} maxLength={255} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => form.setData('reason', event.target.value)} />
                        {form.errors.reason && <span role="alert" className="cm:text-destructive">{form.errors.reason}</span>}
                    </label>
                )}
                {pending && !rejecting && c.short && (
                    <Label className="cm:items-start">
                        <input type="checkbox" checked={form.data.anyway} onChange={(event) => form.setData('anyway', event.currentTarget.checked)} />
                        <span>I confirm approval even though the transfer is below the expected amount.</span>
                    </Label>
                )}
                {serverError && <p role="alert" className="cm:text-sm cm:text-destructive">{serverError}</p>}
                <DialogFooter>
                    {pending && rejecting ? <>
                        <Button type="button" variant="outline" onClick={() => setRejecting(false)} disabled={form.processing}>Back</Button>
                        <Button type="button" variant="destructive" onClick={() => decide('reject')} disabled={form.processing || form.data.reason.trim() === ''}>Reject confirmation</Button>
                    </> : pending ? <>
                        <Button type="button" variant="outline" onClick={() => setRejecting(true)} disabled={form.processing}>Reject</Button>
                        <Button type="button" onClick={() => decide('approve')} disabled={form.processing || (c.short && !form.data.anyway)}>Approve</Button>
                    </> : <Button type="button" variant="outline" onClick={() => setOpen(false)}>Close</Button>}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
