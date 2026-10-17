import { adminUrl, inertia, ui } from '../../lib/sunrice';
import { SettingsLayout } from '../../components/SettingsLayout';
import { StatusBadge } from '../../components/StatusBadge';
import { EmptyState } from '../../components/EmptyState';
import type { MenuItem } from '../../lib/store';

interface MethodRow { id: number; title: string; type: string; active: boolean; etd: string | null; edit_url: string }
interface ZoneRow { id: number; name: string; everywhere_else: boolean; regions: string[]; edit_url: string; methods: MethodRow[] }

interface Props {
    sections: MenuItem[];
    zones: ZoneRow[];
    types: Array<{ key: string; label: string }>;
    couriers: Array<{ key: string; name: string; tracking_url: string | null }>;
    moveUrl: string;
}

export default function Shipping({ sections, zones, types, couriers, moveUrl }: Props) {
    const { Card, CardContent, CardHeader, CardTitle, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } = ui;
    const { Link } = inertia;
    const move = (kind: 'zone' | 'method', id: number, direction: 'up' | 'down') =>
        inertia.router.post(adminUrl(moveUrl), { kind, id, direction }, { preserveScroll: true });

    return (
        <SettingsLayout sections={sections} current="shipping" title="Shipping"
            description="Zones are checked in order and the first one matching the address gives its methods. Pickup methods are offered everywhere.">
            <div className="cm:flex cm:justify-end">
                <Button asChild><Link href={adminUrl('commerce/settings/shipping/zones/create')}>Add zone</Link></Button>
            </div>
            {zones.length === 0 && (
                <EmptyState title="No shipping zones yet" description="Without a zone, checkout offers no shipping. Add one for your country or provinces." />
            )}
            {zones.map((zone, zi) => (
                <Card key={zone.id}>
                    <CardHeader className="cm:flex cm:flex-row cm:items-start cm:justify-between cm:gap-4">
                        <div className="cm:grid cm:gap-1">
                            <CardTitle className="cm:flex cm:items-center cm:gap-2">
                                {zone.name}
                                {zone.everywhere_else && <StatusBadge tone="info">Everywhere else</StatusBadge>}
                            </CardTitle>
                            {!zone.everywhere_else && (
                                <p className="cm:text-sm cm:text-muted-foreground">{zone.regions.length > 0 ? zone.regions.join(', ') : 'No regions'}</p>
                            )}
                        </div>
                        <div className="cm:flex cm:shrink-0 cm:gap-1">
                            <Button variant="ghost" size="sm" aria-label="Move up" disabled={zi === 0} onClick={() => move('zone', zone.id, 'up')}>↑</Button>
                            <Button variant="ghost" size="sm" aria-label="Move down" disabled={zi === zones.length - 1} onClick={() => move('zone', zone.id, 'down')}>↓</Button>
                            <Button variant="outline" size="sm" asChild><Link href={adminUrl(zone.edit_url)}>Edit</Link></Button>
                        </div>
                    </CardHeader>
                    <CardContent className="cm:grid cm:gap-3">
                        {zone.methods.length === 0 && <p className="cm:text-sm cm:text-muted-foreground">No methods in this zone.</p>}
                        {zone.methods.length > 0 && (
                            <ul className="cm:divide-y cm:divide-border cm:rounded-md cm:border">
                                {zone.methods.map((method, mi) => (
                                    <li key={method.id} className="cm:flex cm:items-center cm:justify-between cm:gap-3 cm:px-3 cm:py-2">
                                        <div className="cm:min-w-0">
                                            <Link href={adminUrl(method.edit_url)} className="cm:font-medium cm:hover:underline">{method.title}</Link>
                                            <p className="cm:text-xs cm:text-muted-foreground">{method.type}{method.etd ? ` · ${method.etd}` : ''}</p>
                                        </div>
                                        <div className="cm:flex cm:items-center cm:gap-1">
                                            {!method.active && <StatusBadge>Inactive</StatusBadge>}
                                            <Button variant="ghost" size="sm" aria-label="Move up" disabled={mi === 0} onClick={() => move('method', method.id, 'up')}>↑</Button>
                                            <Button variant="ghost" size="sm" aria-label="Move down" disabled={mi === zone.methods.length - 1} onClick={() => move('method', method.id, 'down')}>↓</Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div>
                            <Select value="" onValueChange={(type: string) => inertia.router.visit(adminUrl(`commerce/settings/shipping/zones/${zone.id}/methods/create?type=${type}`))}>
                                <SelectTrigger className="cm:w-48" aria-label={`Add a method to ${zone.name}`}><SelectValue placeholder="Add method…" /></SelectTrigger>
                                <SelectContent>
                                    {types.map((type) => <SelectItem key={type.key} value={type.key}>{type.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            ))}
            <Card>
                <CardHeader><CardTitle>Courier presets</CardTitle></CardHeader>
                <CardContent>
                    <p className="cm:mb-3 cm:text-sm cm:text-muted-foreground">Offered when adding a shipment; the tracking link is filled in from the tracking number. Add more in config/commerce.php or with Commerce::registerCourier().</p>
                    <ul className="cm:grid cm:gap-1 cm:text-sm cm:sm:grid-cols-2">
                        {couriers.map((c) => (
                            <li key={c.key} className="cm:flex cm:items-center cm:gap-2">
                                <span className="cm:font-medium">{c.name}</span>
                                {!c.tracking_url && <span className="cm:text-xs cm:text-muted-foreground">(no tracking link)</span>}
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </SettingsLayout>
    );
}
