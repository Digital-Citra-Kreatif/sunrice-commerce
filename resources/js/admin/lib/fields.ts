/** A field definition as the server sends it (the CMS's toAdmin(): children at `fields`). */
export interface FieldDef {
    handle: string;
    type: string;
    label?: string;
    required?: boolean;
    instructions?: string | null;
    config?: Record<string, unknown>;
    fields?: FieldDef[];
    /** How much of the row it takes, in percent (the CMS's Field::WIDTHS). */
    width?: number;
    /** Shown only when other fields on its level are so (the CMS's Field condition). */
    condition?: ConditionRule | { match?: 'all' | 'any'; rules: ConditionRule[] } | null;
}

export interface ConditionRule { field: string; operator: 'equals' | 'not_equals' | 'filled' | 'empty'; value?: string | number | boolean | null }

const comparable = (value: unknown): string => (value === true ? 'true' : value === false ? 'false' : value === null || value === undefined || typeof value === 'object' ? '' : String(value));

/** Whether a field shows with these values on its level: as the CMS decides (Field::isShownWith()). */
export function isShown(field: FieldDef, values: Record<string, unknown>): boolean {
    const condition = field.condition;
    if (!condition) return true;
    const rules = 'rules' in condition ? condition.rules : [condition];
    if (rules.length === 0) return true;
    const met = rules.map((rule) => {
        const other = values?.[rule.field];
        const filled = other !== null && other !== undefined && other !== '' && other !== false && !(Array.isArray(other) && other.length === 0);
        const equal = (Array.isArray(other) ? other : [other]).map(comparable).includes(comparable(rule.value));
        return rule.operator === 'equals' ? equal : rule.operator === 'not_equals' ? !equal : rule.operator === 'filled' ? filled : !filled;
    });

    return 'rules' in condition && condition.match === 'any' ? met.includes(true) : !met.includes(false);
}

export type Option = { value: string; label: string };

/** A select's options: strings, or {value, label}. */
export function optionsOf(field: FieldDef): Option[] {
    const raw = field.config?.options;
    if (!Array.isArray(raw)) return [];

    return raw.map((o) => (typeof o === 'object' && o !== null ? { value: String((o as Option).value), label: String((o as Option).label ?? (o as Option).value) } : { value: String(o), label: String(o) }));
}

/** The errors under a path, by the rest of their path ('' for the path itself). */
export function errorsUnder(errors: Record<string, string>, path: string): Record<string, string> {
    const out: Record<string, string> = {};
    for (const [key, message] of Object.entries(errors)) {
        if (key === path) out[''] = message;
        else if (key.startsWith(`${path}.`)) out[key.slice(path.length + 1)] = message;
    }

    return out;
}

/** A number input's value: null when empty. */
export function numberValue(text: string): number | null {
    if (text.trim() === '') return null;
    const n = Number(text);

    return Number.isFinite(n) ? n : null;
}

/** The panel's Select takes no empty values: "nothing chosen" and an option whose value is '' get their own. */
export const SELECT_NONE = '__none';
export const SELECT_EMPTY = '__empty';

/** An option's value as the Select holds it. */
export const toSelect = (value: string): string => (value === '' ? SELECT_EMPTY : value);

/** The Select's value for a field's value: '' is an answer when an option says so ("None (1000)"), else nothing chosen. */
export function selectValue(current: unknown, options: Option[]): string {
    if (current === null || current === undefined || (current === '' && !options.some((o) => o.value === ''))) return SELECT_NONE;

    return toSelect(String(current));
}

/** The field's value for what the Select chose: null for nothing, '' for the empty option, ids as numbers. */
export function fromSelect(next: string, numeric: boolean): string | number | null {
    if (next === SELECT_NONE) return null;
    if (next === SELECT_EMPTY) return '';

    return numeric ? Number(next) : next;
}

/** Fields whose values say nothing in a folded card's summary: switches, secrets, and codes or ids only their inputs can name. */
const UNSUMMED = new Set(['toggle', 'password', 'secret', 'commerce_region', 'commerce_targets', 'entries', 'terms', 'media', 'asset']);

/**
 * What a folded card says it holds (the panel's cardSummary() joins them):
 * the values a reader can see, in order, options by their labels, groups
 * flattened beside the rest. Hidden fields keep their values, but don't count.
 */
export function summaryValues(fields: readonly FieldDef[], values: Record<string, unknown> | null | undefined): unknown[] {
    if (!values || typeof values !== 'object' || Array.isArray(values)) return [];

    return fields.filter((field) => isShown(field, values) && !UNSUMMED.has(field.type) && !field.config?.secret).flatMap((field): unknown[] => {
        const value = values[field.handle];
        if (field.type === 'group') return summaryValues(field.fields ?? [], value as Record<string, unknown>);
        if (field.type === 'select') {
            const options = optionsOf(field);
            const label = (one: unknown) => options.find((o) => o.value === String(one))?.label ?? one;
            return [Array.isArray(value) ? value.map(label).join(', ') : value === null || value === undefined ? value : label(value)];
        }

        return [value];
    });
}
