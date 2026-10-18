import { fetchJson, React, ui } from '../lib/sunrice';
import type { FieldProps } from '../sunrice';

type Target = { type: 'product' | 'variant' | 'term'; id: number; label: string; group?: string };

/** commerce_targets: products, variants and categories/brands a promotion applies to. */
export default function TargetsField({ field, value, onChange, pathPrefix }: FieldProps<Target[] | null>) {
    const { Input, Badge } = ui;
    const config = field.config ?? {};
    const targets = Array.isArray(value) ? value : [];
    const [query, setQuery] = React.useState('');
    const [results, setResults] = React.useState<Target[]>([]);
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        if (!open) return;
        const params = new URLSearchParams({ q: query });
        ((config.types as string[]) ?? []).forEach((t) => params.append('types[]', t));
        ((config.taxonomies as string[]) ?? []).forEach((t) => params.append('taxonomies[]', t));
        const timer = setTimeout(() => fetchJson<{ data: Target[] }>(`${config.api}?${params}`).then((r) => setResults(r.data)).catch(() => setResults([])), 200);

        return () => clearTimeout(timer);
    }, [query, open]); // eslint-disable-line react-hooks/exhaustive-deps

    const has = (t: Target) => targets.some((x) => x.type === t.type && x.id === t.id);
    const typeLabel: Record<string, string> = { product: 'Product', variant: 'Variant', term: 'Category/brand' };

    return (
        <div className="cm:grid cm:gap-2">
            {targets.length > 0 && (
                <div className="cm:flex cm:flex-wrap cm:gap-1.5">
                    {targets.map((t) => (
                        <Badge key={`${t.type}:${t.id}`} variant="secondary" className="cm:gap-1">
                            <span className="cm:text-muted-foreground">{typeLabel[t.type]}:</span> {t.label}
                            <button type="button" aria-label={`Remove ${t.label}`} onClick={() => onChange(targets.filter((x) => !(x.type === t.type && x.id === t.id)))}>×</button>
                        </Badge>
                    ))}
                </div>
            )}
            <div className="cm:relative">
                <Input id={pathPrefix} value={query} placeholder="Search products, SKUs, categories, brands…" onFocus={() => setOpen(true)}
                    onBlur={() => setTimeout(() => setOpen(false), 150)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)} />
                {open && results.length > 0 && (
                    <ul className="cm:absolute cm:z-20 cm:mt-1 cm:max-h-72 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow">
                        {results.map((r) => (
                            <li key={`${r.type}:${r.id}`}>
                                <button type="button" disabled={has(r)} className="cm:flex cm:w-full cm:justify-between cm:gap-3 cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted cm:disabled:opacity-50"
                                    onMouseDown={(e) => e.preventDefault()} onClick={() => { onChange([...targets, { type: r.type, id: r.id, label: r.label }]); setQuery(''); }}>
                                    <span>{r.label}</span><span className="cm:text-xs cm:text-muted-foreground">{r.group}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
