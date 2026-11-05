/** A field definition as the server sends it (the CMS's toAdmin(): children at `fields`). */
export interface FieldDef {
    handle: string;
    type: string;
    label?: string;
    required?: boolean;
    instructions?: string | null;
    config?: Record<string, unknown>;
    fields?: FieldDef[];
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
