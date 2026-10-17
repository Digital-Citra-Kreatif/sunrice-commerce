import type { ProductOption, VariantValue } from '../../lib/variants';

export interface ExternalLink { preset: string | null; label: string | null; url: string | null }
export interface Download { id: string | null; type: 'file' | 'url'; file_id: number | null; url: string | null; name: string; file?: { filename: string; size: number } }
export interface Tier { min_qty: number; type: 'percent_off' | 'amount_off' | 'fixed_price'; value: number; variant: string | null }

export interface Variant extends VariantValue {
    barcode: string | null;
    compare_at_price: number | null;
    cost: number | null;
    weight: number | null;
    length: number | null;
    width: number | null;
    height: number | null;
    image: number | null;
    requires_shipping: boolean | null;
    downloadable: boolean | null;
    track_stock: boolean;
    initial_stock: number | null;
    backorders: 'no' | 'allow' | 'notify';
    low_stock_threshold: number | null;
    stock_status: 'in_stock' | 'out_of_stock' | 'backorder';
    min_qty: number;
    max_qty: number | null;
    qty_step: number;
    downloads: Download[];
}

export interface ProductValue {
    type: 'simple' | 'variable' | 'bundle';
    purchase_mode: string;
    external_links: ExternalLink[];
    requires_shipping: boolean;
    downloadable: boolean;
    featured: boolean;
    tax_class: string | null;
    options: ProductOption[];
    variants: Variant[];
    bundle: { pricing: 'fixed' | 'percent_off' | 'amount_off'; value: number; items: Array<{ variant_id: number | null; quantity: number }> } | null;
    downloads: Download[];
    delivery: { modes: string[]; download_limit: number | null; expiry_days: number | null } | null;
    tiers: Tier[];
}

export interface EditorConfig {
    max_options: number;
    max_variants: number;
    link_presets: Record<string, string>;
    attribute_taxonomies: Array<{ handle: string; title: string }>;
    tax_classes: string[];
    features: Record<string, boolean>;
}

/** Live data from commerce/api/products/{entry}. */
export interface LiveProduct {
    sync_status: 'ok' | 'failed';
    sync_error: string | null;
    synced_at: string | null;
    variants: Record<string, { id: number; stock_quantity: number | null; stock_status: string; track_stock: boolean }>;
}

export interface TabProps {
    value: ProductValue;
    update: (patch: Partial<ProductValue>) => void;
    updateVariant: (index: number, patch: Partial<Variant>) => void;
    config: EditorConfig;
    live: LiveProduct | null;
    entryId: number | null;
    path: string;
}

export const emptyVariant: Omit<Variant, 'id'> = {
    options: {}, sku: null, barcode: null, price: 0, compare_at_price: null, cost: null,
    weight: null, length: null, width: null, height: null, image: null, requires_shipping: null, downloadable: null,
    track_stock: false, initial_stock: null, backorders: 'no', low_stock_threshold: null, stock_status: 'in_stock',
    min_qty: 1, max_qty: null, qty_step: 1, active: true, downloads: [],
};
