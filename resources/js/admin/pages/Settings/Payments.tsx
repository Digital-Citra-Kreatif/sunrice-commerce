import { adminUrl, inertia, ui } from '../../lib/sunrice';
import { SettingsLayout } from '../../components/SettingsLayout';
import { StatusBadge } from '../../components/StatusBadge';
import { EmptyState } from '../../components/EmptyState';
import type { MenuItem } from '../../lib/store';

interface Props {
    sections: MenuItem[];
    methods: Array<{ key: string; title: string; type: string; active: boolean; instance: boolean; edit_url: string }>;
    instanceTypes: Array<{ key: string; label: string }>;
}

export default function Payments({ sections, methods, instanceTypes }: Props) {
    const { Card, CardContent, Button, Switch } = ui;
    const { Link, router } = inertia;
    const move = (key: string, direction: 'up' | 'down') => router.post(adminUrl('commerce/settings/payments/move'), { key, direction }, { preserveScroll: true });

    return (
        <SettingsLayout sections={sections} current="payments" title="Payments" description="Payment methods offered at checkout and on the pay page, in this order.">
            {methods.length === 0 && <EmptyState title="No payment methods" description="Switch on Bank transfer, QRIS and cash on delivery in Features, or install a gateway package." />}
            {methods.length > 0 && (
                <Card>
                    <CardContent className="cm:p-0">
                        <ul className="cm:divide-y cm:divide-border">
                            {methods.map((m, i) => (
                                <li key={m.key} className="cm:flex cm:items-center cm:justify-between cm:gap-3 cm:px-4 cm:py-3">
                                    <div className="cm:min-w-0">
                                        <Link href={adminUrl(m.edit_url)} className="cm:font-medium cm:hover:underline">{m.title}</Link>
                                        <p className="cm:text-xs cm:text-muted-foreground">{m.type}{m.instance ? ` · ${m.key}` : ''}</p>
                                    </div>
                                    <div className="cm:flex cm:items-center cm:gap-2">
                                        {!m.active && <StatusBadge>Off</StatusBadge>}
                                        <Button variant="ghost" size="sm" aria-label="Move up" disabled={i === 0} onClick={() => move(m.key, 'up')}>↑</Button>
                                        <Button variant="ghost" size="sm" aria-label="Move down" disabled={i === methods.length - 1} onClick={() => move(m.key, 'down')}>↓</Button>
                                        <Switch checked={m.active} aria-label={`${m.title} active`}
                                            onCheckedChange={(on: boolean) => router.put(adminUrl(`commerce/settings/payments/${m.key}/active`), { active: on }, { preserveScroll: true })} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}
            {instanceTypes.length > 0 && (
                <div className="cm:flex cm:flex-wrap cm:gap-2">
                    {instanceTypes.map((t) => (
                        <Button key={t.key} variant="outline" onClick={() => router.post(adminUrl('commerce/settings/payments/instances'), { type: t.key })}>Add {t.label.toLowerCase()}</Button>
                    ))}
                </div>
            )}
        </SettingsLayout>
    );
}
