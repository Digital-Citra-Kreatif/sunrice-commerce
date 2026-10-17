import { ui } from '../../lib/sunrice';
import { variantTitle } from '../../lib/variants';
import { Money, NativeSelect, NumberInput, Row, Section } from './controls';
import type { TabProps, Tier } from './types';

/** The product's own bulk prices: "from 10 units, 5% off". */
export function PricingTab({ value, update, path }: TabProps) {
    const { Button } = ui;
    const set = (i: number, patch: Partial<Tier>) => update({ tiers: value.tiers.map((t, j) => (j === i ? { ...t, ...patch } : t)) });

    return (
        <Section title="Bulk prices" description="Lower unit prices for larger quantities. The best matching tier applies."
            actions={value.tiers.length < 20 && <Button type="button" variant="outline" size="sm"
                onClick={() => update({ tiers: [...value.tiers, { min_qty: (value.tiers.at(-1)?.min_qty ?? 1) + 9, type: 'percent_off', value: 500, variant: null }] })}>Add tier</Button>}>
            {value.tiers.length === 0 && <p className="cm:text-sm cm:text-muted-foreground">No bulk prices.</p>}
            {value.tiers.map((tier, i) => (
                <div key={i} className="cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[8rem_12rem_1fr_1fr_auto]">
                    <Row label="From (units)" htmlFor={`${path}-tier-${i}-min`}><NumberInput id={`${path}-tier-${i}-min`} min={2} value={tier.min_qty} onChange={(v) => set(i, { min_qty: v ?? 2 })} /></Row>
                    <Row label="Price" htmlFor={`${path}-tier-${i}-type`}>
                        <NativeSelect id={`${path}-tier-${i}-type`} value={tier.type} onChange={(type) => set(i, { type, value: 0 })}
                            options={[['percent_off', 'Percent off'], ['amount_off', 'Amount off per unit'], ['fixed_price', 'Fixed unit price']]} />
                    </Row>
                    <Row label={tier.type === 'percent_off' ? 'Percent' : 'Amount'} htmlFor={`${path}-tier-${i}-value`}>
                        {tier.type === 'percent_off'
                            ? <NumberInput id={`${path}-tier-${i}-value`} value={tier.value / 100} onChange={(v) => set(i, { value: Math.round((v ?? 0) * 100) })} />
                            : <Money id={`${path}-tier-${i}-value`} value={tier.value} nullable={false} onChange={(v) => set(i, { value: v ?? 0 })} />}
                    </Row>
                    <Row label="For" htmlFor={`${path}-tier-${i}-variant`}>
                        <NativeSelect id={`${path}-tier-${i}-variant`} value={tier.variant ?? ''} onChange={(variant) => set(i, { variant: variant || null })}
                            options={[['', 'All variants'], ...(value.type === 'variable' ? value.variants.map((v) => [v.id, variantTitle(value.options, v)] as [string, string]) : [])]} />
                    </Row>
                    <Button type="button" variant="ghost" size="sm" onClick={() => update({ tiers: value.tiers.filter((_, j) => j !== i) })}>Remove</Button>
                </div>
            ))}
        </Section>
    );
}
