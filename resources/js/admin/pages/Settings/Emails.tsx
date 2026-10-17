import { adminUrl, inertia, ui } from '../../lib/sunrice';
import { SettingsLayout } from '../../components/SettingsLayout';
import { StatusBadge } from '../../components/StatusBadge';
import type { MenuItem } from '../../lib/store';

interface EmailRow { key: string; label: string; audience: 'customer' | 'staff'; description: string; enabled: boolean; locked: boolean; edit_url: string; preview_url: string | null }

export default function Emails({ sections, emails }: { sections: MenuItem[]; emails: EmailRow[] }) {
    const { Card, CardContent, CardHeader, CardTitle, Switch, Button } = ui;
    const { Link, router } = inertia;
    const groups: Array<[string, EmailRow[]]> = [['To customers', emails.filter((e) => e.audience === 'customer')], ['To staff', emails.filter((e) => e.audience === 'staff')]];

    return (
        <SettingsLayout sections={sections} current="emails" title="Emails" description="What the store sends, and to whom. Open an email to change its texts, recipients and attachments.">
            {groups.map(([title, rows]) => rows.length > 0 && (
                <Card key={title}>
                    <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
                    <CardContent className="cm:p-0">
                        <ul className="cm:divide-y cm:divide-border">
                            {rows.map((e) => (
                                <li key={e.key} className="cm:flex cm:items-center cm:justify-between cm:gap-3 cm:px-6 cm:py-3">
                                    <div className="cm:min-w-0">
                                        <Link href={adminUrl(e.edit_url)} className="cm:font-medium cm:hover:underline">{e.label}</Link>
                                        {e.description && <p className="cm:text-xs cm:text-muted-foreground">{e.description}</p>}
                                    </div>
                                    <div className="cm:flex cm:items-center cm:gap-2">
                                        {e.preview_url && (
                                            <>
                                                <Button size="sm" variant="ghost" asChild><a href={e.preview_url} target="_blank" rel="noreferrer">Preview</a></Button>
                                                <Button size="sm" variant="ghost" onClick={() => router.post(adminUrl(`commerce/settings/emails/${e.key}/test`), {}, { preserveScroll: true })}>Send test</Button>
                                            </>
                                        )}
                                        {e.locked ? <StatusBadge>Always sent</StatusBadge> : (
                                            <Switch checked={e.enabled} aria-label={`Send ${e.label}`}
                                                onCheckedChange={(on: boolean) => router.put(adminUrl(`commerce/settings/emails/${e.key}/enabled`), { enabled: on }, { preserveScroll: true })} />
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            ))}
        </SettingsLayout>
    );
}
