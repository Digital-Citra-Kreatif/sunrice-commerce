/** Product data helpers shared by the product editor (and tested in tests/Frontend). */

export interface OptionValue { id: string; label?: string | null; term_id?: number | null }
export interface ProductOption { id: string; name: string; taxonomy: string | null; values: OptionValue[] }
export interface VariantValue {
    id: string;
    options: Record<string, string>;
    sku: string | null;
    price: number;
    active: boolean;
    [key: string]: unknown;
}

/** A new id for an option, value, variant or download (32 hex characters). */
export function newId(): string {
    const random = globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`;

    return random.replace(/-/g, '').slice(0, 32);
}

/** Stable key of an option combination: "optA=val1|optB=val2" (sorted by option id). */
export function comboKey(options: Record<string, string>): string {
    return Object.keys(options).sort().map((k) => `${k}=${options[k]}`).join('|');
}

/** Every combination of the options' values, in option order. */
export function combinations(options: ProductOption[]): Array<Record<string, string>> {
    let result: Array<Record<string, string>> = [{}];
    for (const option of options) {
        if (option.values.length === 0) return [];
        const next: Array<Record<string, string>> = [];
        for (const combo of result) {
            for (const value of option.values) {
                next.push({ ...combo, [option.id]: value.id });
            }
        }
        result = next;
    }

    return options.length === 0 ? [] : result;
}

/**
 * Variants for every combination: existing variants are kept (matched by
 * combination, so their ids, SKUs and prices stay); new combinations get a
 * copy of `template` (usually the first variant) with a new id and no SKU.
 * Variants whose combination no longer exists are dropped.
 */
export function generateVariants(options: ProductOption[], existing: VariantValue[], template: Partial<VariantValue>, limit = 100): VariantValue[] {
    const byKey = new Map(existing.map((v) => [comboKey(v.options), v]));

    return combinations(options).slice(0, limit).map((combo) => {
        const found = byKey.get(comboKey(combo));
        if (found) return { ...found, options: combo };

        return { ...template, id: newId(), sku: null, options: combo, active: true, price: template.price ?? 0 } as VariantValue;
    });
}

/** The variant matching a (complete) selection of option values, if any. */
export function matchVariant(variants: VariantValue[], selection: Record<string, string>): VariantValue | null {
    const key = comboKey(selection);

    return variants.find((v) => comboKey(v.options) === key) ?? null;
}

/** "M / Red" from a variant's options. */
export function variantTitle(options: ProductOption[], variant: Pick<VariantValue, 'options'>, termTitles: Record<number, string> = {}): string {
    return options
        .map((o) => {
            const value = o.values.find((v) => v.id === variant.options[o.id]);
            if (!value) return '?';

            return value.label ?? (value.term_id ? termTitles[value.term_id] ?? `#${value.term_id}` : '?');
        })
        .join(' / ');
}
