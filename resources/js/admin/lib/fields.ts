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
