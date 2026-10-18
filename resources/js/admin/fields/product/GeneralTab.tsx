import { ui } from '../../lib/sunrice';
import { Grid, Money, NativeSelect, Row, Section, TextInput, Toggle } from './controls';
import { SkuInput } from './SkuInput';
import type { ProductValue, TabProps } from './types';

const PURCHASE_MODES: Array<[string, string]> = [
    ['default', 'Follow the store (selling mode)'],
    ['cart', 'Add to cart'],
    ['inquiry', 'Inquiry form'],
    ['whatsapp', 'Ask on WhatsApp'],
    ['external', 'Links to other shops'],
    ['none', 'No button (display only)'],
];

export function GeneralTab({ value, update, updateVariant, config, entryId, path }: TabProps) {
    const { Button } = ui;
    const types: Array<[ProductValue['type'], string]> = [['simple', 'Simple product']];
    if (config.features.variants || value.type === 'variable') types.push(['variable', 'Variable product (sizes, colors…)']);
    if (config.features.bundles || value.type === 'bundle') types.push(['bundle', 'Bundle of other products']);
    const single = value.variants[0];

    return (
        <div className="cm:grid cm:gap-6">
            <Grid cols={2}>
                <Row label="Product type" htmlFor={`${path}-type`}>
                    <NativeSelect id={`${path}-type`} value={value.type} options={types} onChange={(type) => update({ type })} />
                </Row>
                <Row label="Button on the product page" htmlFor={`${path}-mode`} hint="'Follow the store' uses the selling mode set in Settings → Store.">
                    <NativeSelect id={`${path}-mode`} value={value.purchase_mode} options={PURCHASE_MODES} onChange={(purchase_mode) => update({ purchase_mode })} />
                </Row>
            </Grid>

            {value.type !== 'variable' && single && (
                <Section title="Price">
                    <Grid cols={4}>
                        <Row label="Price" htmlFor={`${path}-price`}><Money id={`${path}-price`} value={single.price} nullable={false} onChange={(price) => updateVariant(0, { price: price ?? 0 })} /></Row>
                        <Row label="Compare-at price" htmlFor={`${path}-compare`} hint="Shown struck through when higher."><Money id={`${path}-compare`} value={single.compare_at_price} onChange={(compare_at_price) => updateVariant(0, { compare_at_price })} /></Row>
                        <Row label="Cost" htmlFor={`${path}-cost`} hint="For profit reports; never shown."><Money id={`${path}-cost`} value={single.cost} onChange={(cost) => updateVariant(0, { cost })} /></Row>
                        <Row label="SKU" htmlFor={`${path}-sku`}><SkuInput id={`${path}-sku`} value={single.sku} entryId={entryId} onChange={(sku) => updateVariant(0, { sku })} /></Row>
                    </Grid>
                </Section>
            )}

            {(value.purchase_mode === 'external' || value.external_links.length > 0) && (
                <Section title="Links to other shops" description="Buttons such as 'Buy on Tokopedia'."
                    actions={value.external_links.length < 10 && <Button type="button" variant="outline" size="sm" onClick={() => update({ external_links: [...value.external_links, { preset: 'tokopedia', label: null, url: null }] })}>Add link</Button>}>
                    {value.external_links.map((link, i) => {
                        const set = (patch: Partial<typeof link>) => update({ external_links: value.external_links.map((l, j) => (j === i ? { ...l, ...patch } : l)) });

                        return (
                            <div key={i} className="cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[10rem_1fr_2fr_auto]">
                                <Row label="Shop" htmlFor={`${path}-link-${i}-preset`}>
                                    <NativeSelect id={`${path}-link-${i}-preset`} value={link.preset ?? ''} onChange={(preset) => set({ preset: preset || null })}
                                        options={[...Object.entries(config.link_presets), ['', 'Other…']] as Array<[string, string]>} />
                                </Row>
                                <Row label="Button label" htmlFor={`${path}-link-${i}-label`}>
                                    <TextInput id={`${path}-link-${i}-label`} value={link.label} placeholder={link.preset ? `Buy on ${config.link_presets[link.preset]}` : ''} onChange={(label) => set({ label })} />
                                </Row>
                                <Row label="Link" htmlFor={`${path}-link-${i}-url`}>
                                    <TextInput id={`${path}-link-${i}-url`} value={link.url} placeholder="https://" onChange={(url) => set({ url })} />
                                </Row>
                                <Button type="button" variant="ghost" size="sm" onClick={() => update({ external_links: value.external_links.filter((_, j) => j !== i) })}>Remove</Button>
                            </div>
                        );
                    })}
                </Section>
            )}

            <div className="cm:grid cm:gap-4 cm:sm:grid-cols-2">
                <Toggle id={`${path}-shipping`} label="Needs shipping" checked={value.requires_shipping} onChange={(requires_shipping) => update({ requires_shipping })} hint="Off for services and digital products." />
                {(config.features.digital || value.downloadable) && (
                    <Toggle id={`${path}-downloadable`} label="Downloadable" checked={value.downloadable} onChange={(downloadable) => update({ downloadable })} hint="Customers get files or links after paying." />
                )}
                <Toggle id={`${path}-featured`} label="Featured" checked={value.featured} onChange={(featured) => update({ featured })} hint="Shown first when sorting by featured." />
            </div>

            {config.features.taxes && (
                <Row label="Tax class" htmlFor={`${path}-tax`}>
                    <NativeSelect id={`${path}-tax`} value={value.tax_class ?? ''} onChange={(tax_class) => update({ tax_class: tax_class || null })}
                        options={[['', 'Standard'], ...config.tax_classes.filter((c) => c !== 'standard').map((c) => [c, c] as [string, string])]} />
                </Row>
            )}
        </div>
    );
}
