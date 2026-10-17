import { adminUrl, fetchJson, inertia, React } from '../../lib/sunrice';
import { api } from '../../lib/api';
import { cn } from '../../lib/cn';
import { useCommerceShared } from '../../lib/store';
import { newId } from '../../lib/variants';
import type { FieldProps } from '../../sunrice';
import { BundleTab } from './BundleTab';
import { DigitalTab } from './DigitalTab';
import { GeneralTab } from './GeneralTab';
import { InventoryTab } from './InventoryTab';
import { PricingTab } from './PricingTab';
import { ShippingTab } from './ShippingTab';
import { emptyVariant, type EditorConfig, type LiveProduct, type ProductValue, type TabProps, type Variant } from './types';
import { VariantsTab } from './VariantsTab';

function withDefaults(value: Partial<ProductValue> | null | undefined): ProductValue {
    const v = value ?? {};
    const variants = (v.variants?.length ? v.variants : [{ ...emptyVariant, id: newId() }]).map((x) => ({ ...emptyVariant, ...x, id: x.id ?? newId() })) as Variant[];

    return {
        type: v.type ?? 'simple', purchase_mode: v.purchase_mode ?? 'default', external_links: v.external_links ?? [],
        requires_shipping: v.requires_shipping ?? true, downloadable: v.downloadable ?? false, featured: v.featured ?? false,
        tax_class: v.tax_class ?? null, options: v.options ?? [], variants, bundle: v.bundle ?? null,
        downloads: v.downloads ?? [], delivery: v.delivery ?? null, tiers: v.tiers ?? [],
    };
}

/** commerce_product: the product data editor in Sunrice's entry editor. */
export default function ProductEditor({ field, value: raw, onChange, errors, pathPrefix = 'data.product' }: FieldProps<Partial<ProductValue> | null>) {
    useCommerceShared();
    const config = (field.config ?? {}) as unknown as EditorConfig;
    const value = withDefaults(raw);
    const { props } = inertia.usePage<{ entry?: { id: number } | null }>();
    const entryId = props.entry?.id ?? null;
    const [live, setLive] = React.useState<LiveProduct | null>(null);

    React.useEffect(() => {
        if (!entryId) return;
        fetchJson<{ data: LiveProduct | null }>(adminUrl(`commerce/api/products/${entryId}`)).then((r) => setLive(r.data)).catch(() => undefined);
    }, [entryId, props.entry]); // refetch after saves (new page props)

    const update = (patch: Partial<ProductValue>) => {
        const next = { ...value, ...patch };
        if (patch.type && patch.type !== 'variable') {
            next.options = [];
            next.variants = [{ ...next.variants[0], options: {} }];
        }
        if (patch.type === 'bundle' && !next.bundle) next.bundle = { pricing: 'fixed', value: 0, items: [] };
        onChange(next);
    };
    const updateVariant = (index: number, patch: Partial<Variant>) => update({ variants: value.variants.map((v, i) => (i === index ? { ...v, ...patch } : v)) });

    const tabs: Array<{ key: string; label: string; render: (p: TabProps) => React.ReactNode }> = [{ key: 'general', label: 'General', render: (p) => <GeneralTab {...p} /> }];
    if (value.type === 'variable') tabs.push({ key: 'variants', label: 'Variants', render: (p) => <VariantsTab {...p} /> });
    if (value.type === 'bundle') tabs.push({ key: 'bundle', label: 'Bundle', render: (p) => <BundleTab {...p} /> });
    if (value.type !== 'variable' && (config.features?.inventory ?? true)) tabs.push({ key: 'inventory', label: 'Inventory', render: (p) => <InventoryTab {...p} /> });
    if (value.requires_shipping) tabs.push({ key: 'shipping', label: 'Shipping', render: (p) => <ShippingTab {...p} /> });
    tabs.push({ key: 'pricing', label: 'Bulk prices', render: (p) => <PricingTab {...p} /> });
    if (value.downloadable) tabs.push({ key: 'digital', label: 'Digital', render: (p) => <DigitalTab {...p} /> });
    for (const [key, Tab] of Object.entries(api.productTabs())) {
        tabs.push({ key: `ext-${key}`, label: (Tab as { label?: string }).label ?? key, render: (p) => <Tab {...p} /> });
    }

    const [current, setCurrent] = React.useState('general');
    const active = tabs.find((t) => t.key === current) ?? tabs[0];
    const error = errors?.[pathPrefix];
    const tabProps: TabProps = { value, update, updateVariant, config, live, entryId, path: pathPrefix.replace(/\W+/g, '-') };

    return (
        <div className="cm:grid cm:gap-4 cm:rounded-lg cm:border cm:p-4">
            {live?.sync_status === 'failed' && (
                <div role="alert" className="cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive">
                    The published version couldn't be applied to the store, so it can't be bought: {live.sync_error}. Fix it and publish again.
                </div>
            )}
            {error && <p role="alert" className="cm:text-sm cm:text-destructive">{error}</p>}
            <div role="tablist" aria-label="Product data" className="cm:flex cm:flex-wrap cm:gap-1 cm:border-b">
                {tabs.map((tab) => (
                    <button key={tab.key} type="button" role="tab" aria-selected={tab.key === active.key} onClick={() => setCurrent(tab.key)}
                        className={cn('cm:-mb-px cm:border-b-2 cm:px-3 cm:py-2 cm:text-sm', tab.key === active.key ? 'cm:border-primary cm:font-medium' : 'cm:border-transparent cm:text-muted-foreground cm:hover:text-foreground')}>
                        {tab.label}
                    </button>
                ))}
            </div>
            <div role="tabpanel">{active.render(tabProps)}</div>
        </div>
    );
}
