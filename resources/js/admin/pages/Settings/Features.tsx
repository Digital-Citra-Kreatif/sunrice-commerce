import { inertia, React, ui } from '../../lib/sunrice';
import { SettingsLayout } from '../../components/SettingsLayout';
import { StatusBadge } from '../../components/StatusBadge';
import type { MenuItem } from '../../lib/store';

interface FeatureRow {
    key: string;
    label: string;
    description: string;
    core: boolean;
    switched_on: boolean;
    active: boolean;
    reasons: string[];
    requires: string[];
    dependents: Array<{ key: string; label: string }>;
    essential: boolean;
}

interface Props {
    sections: MenuItem[];
    mode: { key: string; label: string };
    groups: Array<{ key: string; label: string; features: FeatureRow[] }>;
    updateUrl: string;
}

export default function Features({ sections, mode, groups, updateUrl }: Props) {
    const { Card, CardContent, CardHeader, CardTitle, Switch, Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } = ui;
    const { errors } = inertia.usePage<{ errors: Record<string, string> }>().props;
    const [confirm, setConfirm] = React.useState<FeatureRow | null>(null);
    const [busy, setBusy] = React.useState<string | null>(null);

    const toggle = (feature: FeatureRow, on: boolean) => {
        setBusy(feature.key);
        inertia.router.put(updateUrl.replace('__key__', feature.key), { on }, { preserveScroll: true, onFinish: () => setBusy(null) });
    };

    return (
        <SettingsLayout
            sections={sections}
            current="features"
            title="Features"
            description={<>Switch store modules on or off. Selling mode: <strong>{mode.label}</strong>. Switching off never deletes data.</>}
        >
            {errors.feature && (
                <div role="alert" className="cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive">
                    {errors.feature}
                </div>
            )}
            {groups.map((group) => (
                <Card key={group.key}>
                    <CardHeader>
                        <CardTitle>{group.label}</CardTitle>
                    </CardHeader>
                    <CardContent className="cm:grid cm:gap-0 cm:divide-y cm:divide-border">
                        {group.features.map((feature) => (
                            <div key={feature.key} className="cm:flex cm:items-start cm:justify-between cm:gap-4 cm:py-3 cm:first:pt-0 cm:last:pb-0">
                                <div className="cm:grid cm:gap-1">
                                    <div className="cm:flex cm:flex-wrap cm:items-center cm:gap-2">
                                        <label htmlFor={`feature-${feature.key}`} className="cm:font-medium">{feature.label}</label>
                                        {feature.core && <StatusBadge>Always on</StatusBadge>}
                                        {feature.switched_on && !feature.active && <StatusBadge tone="warning">Off — {feature.reasons.join('; ').replace(/^Needs /, 'needs ')}</StatusBadge>}
                                        {feature.essential && <StatusBadge tone="info">Needed by {mode.label}</StatusBadge>}
                                    </div>
                                    <p className="cm:text-sm cm:text-muted-foreground">{feature.description}</p>
                                    {feature.requires.length > 0 && (
                                        <p className="cm:text-xs cm:text-muted-foreground">Needs: {feature.requires.join(', ')}</p>
                                    )}
                                </div>
                                <Switch
                                    id={`feature-${feature.key}`}
                                    checked={feature.switched_on}
                                    disabled={feature.core || busy === feature.key}
                                    onCheckedChange={(on: boolean) => (!on && feature.dependents.length > 0 ? setConfirm(feature) : toggle(feature, on))}
                                />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            ))}
            <Dialog open={confirm !== null} onOpenChange={(open: boolean) => !open && setConfirm(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Switch off {confirm?.label}?</DialogTitle>
                        <DialogDescription>
                            These are switched off with it: {confirm?.dependents.map((d) => d.label).join(', ')}. Their data is kept.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirm(null)}>Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                if (confirm) toggle(confirm, false);
                                setConfirm(null);
                            }}
                        >
                            Switch off
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </SettingsLayout>
    );
}
