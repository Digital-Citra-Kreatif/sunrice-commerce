import { adminUrl, inertia, React, Sunrice, ui } from '../../lib/sunrice';
import { KpiCard } from '../../components/KpiCard';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { useCommerceShared } from '../../lib/store';
import { rate } from '../../lib/marketing';

interface Props {
    campaign: {
        id: number; name: string; type: 'campaign' | 'automation'; status: string; editable: boolean; trigger: string | null; subject: string;
        started_at: string | null; finished_at: string | null; scheduled_at: string | null;
    };
    stats: { recipients: number; sent: number; failed: number; queued: number; opened: number; clicked: number; unsubscribed: number; open_rate: number; click_rate: number };
    links: Array<{ url: string; clicks: number; unique_clicks: number }>;
    recipients: Array<{ email: string; status: string; error: string | null; sent_at: string | null; opened_at: string | null; clicked_at: string | null; unsubscribed: boolean }>;
}

const people = (n: number) => `${n.toLocaleString()} ${n === 1 ? 'person' : 'people'}`;
const when = (iso: string | null) => (iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '—');
const tones: Record<string, string> = { sent: 'ok', queued: 'info', sending: 'info', failed: 'error', skipped: 'neutral', active: 'ok', paused: 'warning', cancelled: 'error', scheduled: 'info' };

/** Commerce/Marketing/Report: a campaign's or automation's results. Refreshes itself while emails are going out. */
export default function Report({ campaign, stats, links, recipients }: Props) {
    const { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } = ui;
    const { router, Link } = inertia;
    const automation = campaign.type === 'automation';
    useCommerceShared();
    Sunrice.useBreadcrumbs([
        { label: 'Shop', href: adminUrl('commerce') },
        { label: 'Marketing', href: adminUrl('commerce/marketing') },
        { label: automation ? 'Automations' : 'Campaigns', href: adminUrl(automation ? 'commerce/marketing/automations' : 'commerce/marketing/campaigns') },
        { label: campaign.name },
    ]);

    React.useEffect(() => {
        if (stats.queued === 0 && campaign.status !== 'sending') return;
        const timer = setInterval(() => router.reload({ only: ['campaign', 'stats', 'links', 'recipients'] }), 5000);

        return () => clearInterval(timer);
    }, [stats.queued, campaign.status]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6">
            <PageHeader
                title={campaign.name}
                description={<>Subject: {campaign.subject}{campaign.trigger ? ` · ${campaign.trigger}` : ''}{campaign.started_at ? ` · started ${when(campaign.started_at)}` : ''}{campaign.finished_at ? `, finished ${when(campaign.finished_at)}` : ''}</>}
                actions={<>
                    <StatusBadge tone={tones[campaign.status] ?? 'neutral'}>{campaign.status}</StatusBadge>
                    {campaign.status === 'sending' && (
                        <Button variant="outline" onClick={() => window.confirm('Stop sending? Emails not yet sent won\'t go out.') && router.post(adminUrl(`commerce/marketing/${campaign.id}/cancel`), {}, { preserveScroll: true })}>Stop sending</Button>
                    )}
                    {campaign.editable && <Button variant="outline" asChild><Link href={adminUrl(`commerce/marketing/${campaign.id}/edit`)}>Edit</Link></Button>}
                    <Button variant="outline" onClick={() => router.post(adminUrl(`commerce/marketing/${campaign.id}/duplicate`))}>Duplicate</Button>
                </>}
            />

            {campaign.status === 'sending' && stats.recipients === 0 && (
                <p role="status" className="cm:rounded-md cm:border cm:border-sky-500/30 cm:bg-sky-500/5 cm:px-4 cm:py-3 cm:text-sm">
                    Finding the recipients. The queue worker does this in the background (php artisan queue:work).
                </p>
            )}
            {stats.queued > 0 && (
                <p role="status" className="cm:rounded-md cm:border cm:border-sky-500/30 cm:bg-sky-500/5 cm:px-4 cm:py-3 cm:text-sm">
                    {stats.queued.toLocaleString()} {stats.queued === 1 ? 'email is' : 'emails are'} waiting to be sent by the queue worker.
                </p>
            )}

            <div className="cm:grid cm:gap-4 cm:sm:grid-cols-2 cm:lg:grid-cols-5">
                <KpiCard kpi={{ key: 'sent', label: 'Sent', value: stats.sent.toLocaleString(), hint: stats.failed > 0 ? `${stats.failed} failed` : `of ${stats.recipients.toLocaleString()} recipients` }} />
                <KpiCard kpi={{ key: 'opened', label: 'Opened', value: rate(stats.opened, stats.sent), hint: people(stats.opened) }} />
                <KpiCard kpi={{ key: 'clicked', label: 'Clicked', value: rate(stats.clicked, stats.sent), hint: people(stats.clicked) }} />
                <KpiCard kpi={{ key: 'ctor', label: 'Clicked after opening', value: rate(stats.clicked, stats.opened), hint: 'Of those who opened' }} />
                <KpiCard kpi={{ key: 'unsubscribed', label: 'Unsubscribed', value: rate(stats.unsubscribed, stats.sent), hint: people(stats.unsubscribed) }} />
            </div>
            <p className="cm:text-xs cm:text-muted-foreground">
                Opens are counted when the email's images load, so they are approximate: some inboxes load images for everyone, others never. A click also counts as an open.
            </p>

            <Card>
                <CardHeader><CardTitle>Links</CardTitle><CardDescription>Clicks on each link in the email.</CardDescription></CardHeader>
                <CardContent className="cm:p-0">
                    {links.length === 0 ? <p className="cm:px-6 cm:pb-6 cm:text-sm cm:text-muted-foreground">No clicks yet.</p> : (
                        <Table>
                            <TableHeader><TableRow><TableHead>Link</TableHead><TableHead className="cm:text-right">People</TableHead><TableHead className="cm:text-right">Clicks</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {links.map((l) => (
                                    <TableRow key={l.url}>
                                        <TableCell className="cm:max-w-md cm:truncate"><a href={l.url} target="_blank" rel="noreferrer" className="cm:hover:underline">{l.url}</a></TableCell>
                                        <TableCell className="cm:text-right cm:tabular-nums">{l.unique_clicks}</TableCell>
                                        <TableCell className="cm:text-right cm:tabular-nums">{l.clicks}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Latest recipients</CardTitle><CardDescription>The 50 most recent.</CardDescription></CardHeader>
                <CardContent className="cm:p-0">
                    {recipients.length === 0 ? <p className="cm:px-6 cm:pb-6 cm:text-sm cm:text-muted-foreground">Nobody yet.</p> : (
                        <Table>
                            <TableHeader><TableRow><TableHead>Email</TableHead><TableHead>Status</TableHead><TableHead>Sent</TableHead><TableHead>Opened</TableHead><TableHead>Clicked</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {recipients.map((r) => (
                                    <TableRow key={`${r.email}-${r.sent_at}`}>
                                        <TableCell>{r.email}{r.unsubscribed && <> <StatusBadge tone="warning">unsubscribed</StatusBadge></>}</TableCell>
                                        <TableCell><span title={r.error ?? undefined}><StatusBadge tone={tones[r.status] ?? 'neutral'}>{r.status}</StatusBadge></span></TableCell>
                                        <TableCell className="cm:whitespace-nowrap">{when(r.sent_at)}</TableCell>
                                        <TableCell className="cm:whitespace-nowrap">{when(r.opened_at)}</TableCell>
                                        <TableCell className="cm:whitespace-nowrap">{when(r.clicked_at)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
