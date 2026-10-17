import { components, fetchJson, adminUrl, React, ui } from '../../lib/sunrice';
import { formatMoney } from '../../lib/money';
import { generateVariants, newId, variantTitle, type ProductOption } from '../../lib/variants';
import { StatusBadge } from '../../components/StatusBadge';
import { Grid, Money, NativeSelect, NumberInput, Row, Section, TextInput, Toggle } from './controls';
import { SkuInput } from './SkuInput';
import { emptyVariant, type TabProps, type Variant } from './types';

/** Titles of attribute terms, fetched from Sunrice's term search. */
function useTermTitles(ids: number[]): Record<number, string> {
    const [titles, setTitles] = React.useState<Record<number, string>>({});
    const missing = ids.filter((id) => !(id in titles));
    React.useEffect(() => {
        if (missing.length === 0) return;
        const query = missing.map((id) => `ids[]=${id}`).join('&');
        fetchJson<{ data: Array<{ id: number; title: string }> }>(adminUrl(`api/terms?${query}`))
            .then((r) => setTitles((t) => ({ ...t, ...Object.fromEntries(r.data.map((x) => [x.id, x.title])) })))
            .catch(() => undefined);
    }, [missing.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

    return titles;
}

function OptionEditor({ option, onChange, onRemove, config, path }: { option: ProductOption; onChange: (o: ProductOption) => void; onRemove: () => void; config: TabProps['config']; path: string }) {
    const { Button, Input, Badge } = ui;
    const { FieldRenderer } = components;
    const [draft, setDraft] = React.useState('');
    const addValue = () => {
        const labels = draft.split(',').map((s) => s.trim()).filter(Boolean)
            .filter((l) => !option.values.some((v) => (v.label ?? '').toLowerCase() === l.toLowerCase()));
        if (labels.length) onChange({ ...option, values: [...option.values, ...labels.map((label) => ({ id: newId(), label }))] });
        setDraft('');
    };
    const termIds = option.values.map((v) => v.term_id).filter((x): x is number => !!x);

    return (
        <div className="cm:grid cm:gap-3 cm:rounded-md cm:border cm:p-3">
            <div className="cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_1fr_auto]">
                <Row label="Option name" htmlFor={`${path}-name`}>
                    <Input id={`${path}-name`} value={option.name} placeholder="Size" onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...option, name: e.target.value })} />
                </Row>
                {config.attribute_taxonomies.length > 0 ? (
                    <Row label="Values from" htmlFor={`${path}-source`}>
                        <NativeSelect id={`${path}-source`} value={option.taxonomy ?? ''} onChange={(taxonomy) => onChange({ ...option, taxonomy: taxonomy || null, values: [] })}
                            options={[['', 'Custom values'], ...config.attribute_taxonomies.map((t) => [t.handle, t.title] as [string, string])]} />
                    </Row>
                ) : <div />}
                <Button type="button" variant="ghost" size="sm" onClick={onRemove}>Remove option</Button>
            </div>
            {option.taxonomy ? (
                <FieldRenderer
                    fields={[{ handle: 'terms', type: 'terms', label: 'Values', config: { taxonomy: option.taxonomy } }]}
                    values={{ terms: termIds }}
                    pathPrefix={`${path}-terms`}
                    onChange={(values: { terms?: number[] }) => {
                        const ids = values.terms ?? [];
                        const kept = option.values.filter((v) => v.term_id && ids.includes(v.term_id));
                        const added = ids.filter((id) => !kept.some((v) => v.term_id === id)).map((term_id) => ({ id: newId(), term_id }));
                        onChange({ ...option, values: [...kept, ...added] });
                    }}
                />
            ) : (
                <div className="cm:grid cm:gap-2">
                    <div className="cm:flex cm:flex-wrap cm:gap-1.5">
                        {option.values.map((v) => (
                            <Badge key={v.id} variant="secondary" className="cm:gap-1">
                                {v.label}
                                <button type="button" aria-label={`Remove ${v.label}`} onClick={() => onChange({ ...option, values: option.values.filter((x) => x.id !== v.id) })}>×</button>
                            </Badge>
                        ))}
                    </div>
                    <div className="cm:flex cm:gap-2">
                        <Input value={draft} placeholder="S, M, L" aria-label={`Add values to ${option.name || 'option'}`}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraft(e.target.value)}
                            onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') { e.preventDefault(); addValue(); } }} />
                        <Button type="button" variant="outline" onClick={addValue}>Add</Button>
                    </div>
                </div>
            )}
        </div>
    );
}

function VariantDetails({ variant, index, updateVariant, tab }: { variant: Variant; index: number; updateVariant: TabProps['updateVariant']; tab: TabProps }) {
    const { FieldRenderer } = components;
    const p = `${tab.path}-v${index}`;
    const live = tab.live?.variants[variant.id];

    return (
        <div className="cm:grid cm:gap-4 cm:bg-muted/40 cm:p-4">
            <Grid cols={4}>
                <Row label="Cost" htmlFor={`${p}-cost`}><Money id={`${p}-cost`} value={variant.cost} onChange={(cost) => updateVariant(index, { cost })} /></Row>
                <Row label="Barcode" htmlFor={`${p}-barcode`}><TextInput id={`${p}-barcode`} value={variant.barcode} onChange={(barcode) => updateVariant(index, { barcode })} /></Row>
                <Row label="Weight (g)" htmlFor={`${p}-weight`}><NumberInput id={`${p}-weight`} value={variant.weight} onChange={(weight) => updateVariant(index, { weight })} placeholder="Product's" /></Row>
                <Row label="Min / max / step" htmlFor={`${p}-min`}>
                    <div className="cm:grid cm:grid-cols-3 cm:gap-1">
                        <NumberInput id={`${p}-min`} min={1} value={variant.min_qty} onChange={(v) => updateVariant(index, { min_qty: v ?? 1 })} />
                        <NumberInput min={1} value={variant.max_qty} onChange={(v) => updateVariant(index, { max_qty: v })} placeholder="–" />
                        <NumberInput min={1} value={variant.qty_step} onChange={(v) => updateVariant(index, { qty_step: v ?? 1 })} />
                    </div>
                </Row>
            </Grid>
            {tab.config.features.inventory && (
                <Grid cols={4}>
                    <Toggle id={`${p}-track`} label="Track stock" checked={variant.track_stock} onChange={(track_stock) => updateVariant(index, { track_stock })} />
                    {variant.track_stock && (live?.track_stock && live.stock_quantity !== null ? (
                        <Row label="In stock"><p className="cm:text-sm">{live.stock_quantity} <span className="cm:text-muted-foreground">(change it in Shop → Inventory)</span></p></Row>
                    ) : (
                        <Row label="Starting stock" htmlFor={`${p}-initial`}><NumberInput id={`${p}-initial`} value={variant.initial_stock} onChange={(initial_stock) => updateVariant(index, { initial_stock })} /></Row>
                    ))}
                    {variant.track_stock ? (
                        <Row label="When sold out" htmlFor={`${p}-backorders`}>
                            <NativeSelect id={`${p}-backorders`} value={variant.backorders} onChange={(backorders) => updateVariant(index, { backorders })}
                                options={[['no', 'Stop selling'], ['allow', 'Keep selling (backorder)'], ['notify', 'Keep selling, tell customers']]} />
                        </Row>
                    ) : (
                        <Row label="Stock status" htmlFor={`${p}-status`}>
                            <NativeSelect id={`${p}-status`} value={variant.stock_status} onChange={(stock_status) => updateVariant(index, { stock_status })}
                                options={[['in_stock', 'In stock'], ['out_of_stock', 'Out of stock'], ['backorder', 'On backorder']]} />
                        </Row>
                    )}
                </Grid>
            )}
            <FieldRenderer fields={[{ handle: 'image', type: 'asset', label: 'Image', config: { image_only: true } }]} values={{ image: variant.image }}
                pathPrefix={`${p}-image`} onChange={(v: { image?: number | null }) => updateVariant(index, { image: v.image ?? null })} />
        </div>
    );
}

export function VariantsTab(tab: TabProps) {
    const { value, update, updateVariant, config, entryId, live } = tab;
    const { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Switch } = ui;
    const [open, setOpen] = React.useState<string | null>(null);
    const termTitles = useTermTitles(value.options.flatMap((o) => o.values.map((v) => v.term_id).filter((x): x is number => !!x)));
    const template = value.variants[0] ?? { ...emptyVariant, id: newId() };
    const generate = (options = value.options) => update({ options, variants: generateVariants(options, value.variants, { ...template, initial_stock: null, image: null }, config.max_variants) as Variant[] });

    return (
        <div className="cm:grid cm:gap-6">
            <Section title="Options" description={`Up to ${config.max_options} options, such as size and color. Variants are made for every combination.`}
                actions={value.options.length < config.max_options && (
                    <Button type="button" variant="outline" size="sm" onClick={() => update({ options: [...value.options, { id: newId(), name: '', taxonomy: null, values: [] }] })}>Add option</Button>
                )}>
                {value.options.map((option, i) => (
                    <OptionEditor key={option.id} option={option} config={config} path={`${tab.path}-o${i}`}
                        onChange={(o) => generate(value.options.map((x, j) => (j === i ? o : x)))}
                        onRemove={() => generate(value.options.filter((_, j) => j !== i))} />
                ))}
            </Section>

            <Section title={`Variants (${value.variants.length})`} description="Each has its own SKU, price and stock. Switch one off to stop selling it without losing it."
                actions={<Button type="button" variant="outline" size="sm" onClick={() => generate()}>Regenerate</Button>}>
                {value.options.length === 0 ? (
                    <p className="cm:text-sm cm:text-muted-foreground">Add an option with values to create variants.</p>
                ) : (
                    <div className="cm:overflow-x-auto cm:rounded-md cm:border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Variant</TableHead><TableHead>SKU</TableHead><TableHead>Price</TableHead><TableHead>Compare-at</TableHead>
                                    {config.features.inventory && <TableHead>Stock</TableHead>}<TableHead>On sale</TableHead><TableHead />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {value.variants.map((variant, i) => {
                                    const stock = live?.variants[variant.id];

                                    return (
                                        <React.Fragment key={variant.id}>
                                            <TableRow className={variant.active ? '' : 'cm:opacity-60'}>
                                                <TableCell className="cm:font-medium cm:whitespace-nowrap">{variantTitle(value.options, variant, termTitles)}</TableCell>
                                                <TableCell className="cm:min-w-36"><SkuInput value={variant.sku} entryId={entryId} onChange={(sku) => updateVariant(i, { sku })} /></TableCell>
                                                <TableCell className="cm:min-w-32"><Money value={variant.price} nullable={false} onChange={(price) => updateVariant(i, { price: price ?? 0 })} /></TableCell>
                                                <TableCell className="cm:min-w-32"><Money value={variant.compare_at_price} onChange={(compare_at_price) => updateVariant(i, { compare_at_price })} /></TableCell>
                                                {config.features.inventory && (
                                                    <TableCell className="cm:whitespace-nowrap cm:text-sm">
                                                        {variant.track_stock ? (stock?.stock_quantity ?? variant.initial_stock ?? 0) : <StatusBadge>{variant.stock_status.replace('_', ' ')}</StatusBadge>}
                                                    </TableCell>
                                                )}
                                                <TableCell><Switch checked={variant.active} aria-label="Sell this variant" onCheckedChange={(active: boolean) => updateVariant(i, { active })} /></TableCell>
                                                <TableCell>
                                                    <Button type="button" variant="ghost" size="sm" aria-expanded={open === variant.id} onClick={() => setOpen(open === variant.id ? null : variant.id)}>
                                                        {open === variant.id ? 'Close' : 'More'}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                            {open === variant.id && (
                                                <TableRow><TableCell colSpan={7} className="cm:p-0"><VariantDetails variant={variant} index={i} updateVariant={updateVariant} tab={tab} /></TableCell></TableRow>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}
                {value.variants.length > 0 && (
                    <p className="cm:text-xs cm:text-muted-foreground">
                        Prices from {formatMoney(Math.min(...value.variants.map((v) => v.price)))} to {formatMoney(Math.max(...value.variants.map((v) => v.price)))}.
                    </p>
                )}
            </Section>
        </div>
    );
}
