import { Grid, Row, Section, UnitInput } from './controls';
import { dimensionUnit, weightUnit } from '../../lib/units';
import type { TabProps, Variant } from './types';

/** Weight and dimensions (all variants at once for variable products; each can differ in its details). */
export function ShippingTab({ value, update, updateVariant, path }: TabProps) {
    const first = value.variants[0];
    if (!first) return null;
    const set = (patch: Partial<Variant>) => (value.type === 'variable'
        ? update({ variants: value.variants.map((v) => ({ ...v, ...patch })) })
        : updateVariant(0, patch));

    return (
        <Section title="Package" description={value.type === 'variable' ? 'Applies to every variant; a variant can have its own weight under More.' : 'Used for shipping rates.'}>
            <Grid cols={4}>
                <Row label={`Weight (${weightUnit()})`} htmlFor={`${path}-weight`}><UnitInput id={`${path}-weight`} unit={weightUnit()} value={first.weight} onChange={(weight) => set({ weight })} /></Row>
                <Row label={`Length (${dimensionUnit()})`} htmlFor={`${path}-length`}><UnitInput id={`${path}-length`} unit={dimensionUnit()} value={first.length} onChange={(length) => set({ length })} /></Row>
                <Row label={`Width (${dimensionUnit()})`} htmlFor={`${path}-width`}><UnitInput id={`${path}-width`} unit={dimensionUnit()} value={first.width} onChange={(width) => set({ width })} /></Row>
                <Row label={`Height (${dimensionUnit()})`} htmlFor={`${path}-height`}><UnitInput id={`${path}-height`} unit={dimensionUnit()} value={first.height} onChange={(height) => set({ height })} /></Row>
            </Grid>
        </Section>
    );
}
