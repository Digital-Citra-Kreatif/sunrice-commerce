/** Helpers of the marketing editor (Commerce/Marketing/Editor): audience rules and smart tags. */

export interface RuleDef {
    label: string;
    group: string;
    input: 'none' | 'days' | 'number' | 'money' | 'select' | 'text' | 'products' | 'categories';
    options?: Array<{ value: string; label: string }>;
}

export interface Rule {
    rule: string;
    value?: unknown;
}

export interface AudienceValue {
    match: 'all' | 'any';
    rules: Rule[];
}

/** A new rule's starting value for its input. */
export function defaultValue(def: RuleDef | undefined): unknown {
    switch (def?.input) {
        case 'days':
            return 30;
        case 'number':
            return 1;
        case 'money':
            return 0;
        case 'select':
            return def.options?.[0]?.value ?? '';
        case 'products':
        case 'categories':
            return [];
        case 'text':
            return '';
        default:
            return null;
    }
}

/** Rules grouped for the rule picker, in their order. */
export function groupRules(defs: Record<string, RuleDef>): Array<[string, Array<[string, RuleDef]>]> {
    const groups: Array<[string, Array<[string, RuleDef]>]> = [];
    for (const [key, def] of Object.entries(defs)) {
        let group = groups.find(([name]) => name === def.group);
        if (!group) {
            group = [def.group, []];
            groups.push(group);
        }
        group[1].push([key, def]);
    }

    return groups;
}

/** Whether every rule has the value it needs (the live count only asks then). */
export function audienceComplete(audience: AudienceValue, defs: Record<string, RuleDef>): boolean {
    return audience.rules.every((r) => {
        const def = defs[r.rule];
        if (!def) return false;
        if (def.input === 'none') return true;
        if (def.input === 'products' || def.input === 'categories') return Array.isArray(r.value) && r.value.length > 0;
        if (def.input === 'days' || def.input === 'number' || def.input === 'money') return r.value !== '' && r.value !== null && Number(r.value) >= 0;

        return String(r.value ?? '').trim() !== '';
    });
}

/** Put a smart tag into a text at the cursor (replacing a selection); returns the text and the new cursor. */
export function insertTag(text: string, tag: string, start: number | null, end: number | null): { text: string; cursor: number } {
    const token = `{${tag}}`;
    const from = start ?? text.length;
    const to = end ?? from;
    const next = text.slice(0, from) + token + text.slice(to);

    return { text: next, cursor: from + token.length };
}

/** Smart tags in a text that aren't known (likely typos), without duplicates. */
export function unknownTags(text: string, known: string[]): string[] {
    const found = new Set<string>();
    for (const match of text.matchAll(/\{([a-z_]+)(?:\|[^{}]*)?\}/g)) {
        if (!known.includes(match[1])) found.add(match[1]);
    }

    return [...found];
}

/** "42%" of a total, or "—" when nothing was sent. */
export function rate(part: number, total: number): string {
    return total > 0 ? `${Math.round((part / total) * 1000) / 10}%` : '—';
}
