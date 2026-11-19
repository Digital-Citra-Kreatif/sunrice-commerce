import { Grid, NativeSelect, NumberInput, Row, Section, Toggle } from './controls';
import { LiveStock } from './LiveStock';
import type { TabProps } from './types';

/** Stock settings of a simple product or bundle (variants have theirs in the Variants tab). */
export function InventoryTab(tab: TabProps) {
    const { value, updateVariant, live, path } = tab;
    const variant = value.variants[0];
    if (!variant) return null;
    const saved = live?.variants[variant.id];

    return (
        <Section title="Stock">
            <Toggle id={`${path}-track`} label="Track stock" checked={variant.track_stock} onChange={(track_stock) => updateVariant(0, { track_stock })}
                hint="Reduce stock when an order is placed and restore it when the order is cancelled." />
            {variant.track_stock ? (
                <Grid cols={3}>
                    {saved?.track_stock && saved.stock_quantity !== null ? (
                        <LiveStock variantKey={variant.id} tab={tab} sku={variant.sku} />
                    ) : (
                        <Row label="Starting stock" htmlFor={`${path}-initial`} hint="Set once, when the product is published.">
                            <NumberInput id={`${path}-initial`} value={variant.initial_stock} onChange={(initial_stock) => updateVariant(0, { initial_stock })} />
                        </Row>
                    )}
                    <Row label="When sold out" htmlFor={`${path}-backorders`}>
                        <NativeSelect id={`${path}-backorders`} value={variant.backorders} onChange={(backorders) => updateVariant(0, { backorders })}
                            options={[['no', 'Stop selling'], ['allow', 'Keep selling (backorder)'], ['notify', 'Keep selling, tell customers']]} />
                    </Row>
                    <Row label="Low stock at" htmlFor={`${path}-low`} hint="Empty: the store's setting.">
                        <NumberInput id={`${path}-low`} value={variant.low_stock_threshold} onChange={(low_stock_threshold) => updateVariant(0, { low_stock_threshold })} />
                    </Row>
                </Grid>
            ) : (
                <Row label="Stock status" htmlFor={`${path}-status`}>
                    <NativeSelect id={`${path}-status`} value={variant.stock_status} onChange={(stock_status) => updateVariant(0, { stock_status })}
                        options={[['in_stock', 'In stock'], ['out_of_stock', 'Out of stock'], ['backorder', 'On backorder']]} />
                </Row>
            )}
        </Section>
    );
}
