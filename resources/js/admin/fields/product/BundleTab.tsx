import { adminUrl, fetchJson, React, ui } from '../../lib/sunrice';
import { formatMoney } from '../../lib/money';
import { Money, NativeSelect, NumberInput, Row, Section } from './controls';
import type { TabProps } from './types';

type Option = { id: number; label: string; sku: string | null; price: number };

/** The products a bundle is made of, and how it is priced. */
export function BundleTab({ value, update, path }: TabProps) {
    const { Button, Input } = ui;
    const bundle = value.bundle ?? { pricing: 'fixed' as const, value: 0, items: [] };
    const [known, setKnown] = React.useState<Record<number, Option>>({});
    const [query, setQuery] = React.useState('');
    const [results, setResults] = React.useState<Option[]>([]);
    const ids = bundle.items.map((i) => i.variant_id).filter((x): x is number => !!x);

    React.useEffect(() => {
        const missing = ids.filter((id) => !known[id]);
        if (missing.length === 0) return;
        fetchJson<{ data: Option[] }>(adminUrl(`commerce/api/variants?${missing.map((id) => `ids[]=${id}`).join('&')}`))
            .then((r) => setKnown((k) => ({ ...k, ...Object.fromEntries(r.data.map((o) => [o.id, o])) }))).catch(() => undefined);
    }, [ids.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps
    React.useEffect(() => {
        if (query.trim().length < 2) return setResults([]);
        const timer = setTimeout(() => fetchJson<{ data: Option[] }>(adminUrl(`commerce/api/variants?q=${encodeURIComponent(query)}`)).then((r) => setResults(r.data)).catch(() => undefined), 250);

        return () => clearTimeout(timer);
    }, [query]);

    const setBundle = (patch: Partial<typeof bundle>) => update({ bundle: { ...bundle, ...patch } });
    const sum = bundle.items.reduce((total, item) => total + (known[item.variant_id ?? 0]?.price ?? 0) * item.quantity, 0);

    return (
        <div className="cm:grid cm:gap-6">
            <Section title="Products in the bundle" description="Bundles take their stock from these products.">
                {bundle.items.map((item, i) => (
                    <div key={i} className="cm:flex cm:items-center cm:gap-3">
                        <span className="cm:flex-1 cm:text-sm">{known[item.variant_id ?? 0]?.label ?? `#${item.variant_id}`}</span>
                        <div className="cm:w-24"><NumberInput min={1} value={item.quantity} onChange={(q) => setBundle({ items: bundle.items.map((x, j) => (j === i ? { ...x, quantity: q ?? 1 } : x)) })} /></div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => setBundle({ items: bundle.items.filter((_, j) => j !== i) })}>Remove</Button>
                    </div>
                ))}
                <div className="cm:relative">
                    <Input value={query} placeholder="Search products or SKUs to add…" aria-label="Add a product to the bundle" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)} />
                    {results.length > 0 && (
                        <ul className="cm:absolute cm:z-10 cm:mt-1 cm:max-h-64 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow">
                            {results.map((r) => (
                                <li key={r.id}>
                                    <button type="button" className="cm:flex cm:w-full cm:justify-between cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted"
                                        onClick={() => { setKnown((k) => ({ ...k, [r.id]: r })); setBundle({ items: [...bundle.items, { variant_id: r.id, quantity: 1 }] }); setQuery(''); }}>
                                        <span>{r.label}{r.sku && <span className="cm:text-muted-foreground"> · {r.sku}</span>}</span><span>{formatMoney(r.price)}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </Section>
            <Section title="Bundle price" description={`The products cost ${formatMoney(sum)} together.`}>
                <div className="cm:grid cm:gap-3 cm:sm:grid-cols-2">
                    <Row label="Price" htmlFor={`${path}-bundle-pricing`}>
                        <NativeSelect id={`${path}-bundle-pricing`} value={bundle.pricing} onChange={(pricing) => setBundle({ pricing, value: 0 })}
                            options={[['fixed', 'Its own price (General tab)'], ['percent_off', 'Total minus a percentage'], ['amount_off', 'Total minus an amount']]} />
                    </Row>
                    {bundle.pricing === 'percent_off' && <Row label="Percent off" htmlFor={`${path}-bundle-value`}><NumberInput id={`${path}-bundle-value`} value={bundle.value / 100} onChange={(v) => setBundle({ value: Math.round((v ?? 0) * 100) })} /></Row>}
                    {bundle.pricing === 'amount_off' && <Row label="Amount off" htmlFor={`${path}-bundle-value`}><Money id={`${path}-bundle-value`} value={bundle.value} nullable={false} onChange={(v) => setBundle({ value: v ?? 0 })} /></Row>}
                </div>
            </Section>
        </div>
    );
}
