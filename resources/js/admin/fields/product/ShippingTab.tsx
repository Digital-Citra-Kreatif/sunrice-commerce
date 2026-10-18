import { Grid, NumberInput, Row, Section } from './controls';
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
                <Row label="Weight (grams)" htmlFor={`${path}-weight`}><NumberInput id={`${path}-weight`} value={first.weight} onChange={(weight) => set({ weight })} /></Row>
                <Row label="Length (mm)" htmlFor={`${path}-length`}><NumberInput id={`${path}-length`} value={first.length} onChange={(length) => set({ length })} /></Row>
                <Row label="Width (mm)" htmlFor={`${path}-width`}><NumberInput id={`${path}-width`} value={first.width} onChange={(width) => set({ width })} /></Row>
                <Row label="Height (mm)" htmlFor={`${path}-height`}><NumberInput id={`${path}-height`} value={first.height} onChange={(height) => set({ height })} /></Row>
            </Grid>
        </Section>
    );
}
