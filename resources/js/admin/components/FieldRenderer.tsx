import * as React from 'react';
import * as Ui from '../shims/ui';
import { cn } from '../lib/cn';
import type { FieldProps } from '../sunrice';
import { errorsUnder, fromSelect, isShown, numberValue, optionsOf, SELECT_NONE, selectValue, summaryValues, toSelect, type FieldDef } from '../lib/fields';
import DateTimeRangeField from '../fields/DateTimeRangeField';
import MoneyField from '../fields/MoneyField';
import RegionField from '../fields/RegionField';
import TargetsField from '../fields/TargetsField';

type AnyComponent = React.ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
const ui = Ui as unknown as Record<string, AnyComponent>;


type Values = Record<string, unknown>;

/** Commerce's own field types, drawn by their inputs (also registered with the CMS's editors). */
export const COMMERCE_INPUTS: Record<string, React.ComponentType<FieldProps<any>>> = { // eslint-disable-line @typescript-eslint/no-explicit-any
    commerce_money: MoneyField,
    commerce_datetime_range: DateTimeRangeField,
    commerce_region: RegionField,
    commerce_targets: TargetsField,
};




/** A field's share of the row (the CMS's widths) on a 12-column grid, full width on phones. */
const SPAN: Record<number, string> = {
    25: 'cm:md:col-span-3', 33: 'cm:md:col-span-4', 50: 'cm:md:col-span-6', 66: 'cm:md:col-span-8', 75: 'cm:md:col-span-9', 100: 'cm:md:col-span-12',
};



/**
 * Commerce's forms (SchemaForm, src/Admin/SchemaForm.php): each field with
 * its label, input, help and error. Values are by handle; errors keyed by
 * `pathPrefix.handle` (as the server names them).
 */
export function FieldRenderer({ fields, values, onChange, errors = {}, pathPrefix = 'values', section }: {
    fields: readonly FieldDef[] | ReadonlyArray<Record<string, unknown>>;
    values: Values;
    onChange: (values: Values) => void;
    errors?: Partial<Record<string, string>>;
    pathPrefix?: string;
    /** The section's title: a field labelled the same doesn't repeat it. */
    section?: string | null;
}) {
    const defs = fields as readonly FieldDef[];
    const messages = errors as Record<string, string>;
    return (
        <div className="cm:grid cm:grid-cols-1 cm:gap-x-5 cm:gap-y-6 cm:md:grid-cols-12">
            {defs.filter((field) => isShown(field, values ?? {})).map((field) => (
                <div key={field.handle} className={cn('cm:min-w-0', SPAN[field.width ?? 100] ?? SPAN[100],
                    // A switch beside an input sits level with the input, not its label.
                    field.type === 'toggle' && (field.width ?? 100) < 100 && 'cm:md:self-end cm:md:pb-2.5')}>
                    <FieldRow field={field} value={values?.[field.handle]} path={`${pathPrefix}.${field.handle}`} errors={messages} hideLabel={!!section && field.label === section}
                        onChange={(value) => onChange({ ...values, [field.handle]: value })} />
                </div>
            ))}
        </div>
    );
}

function FieldRow({ field, value, onChange, path, errors, hideLabel = false }: { field: FieldDef; value: unknown; onChange: (value: unknown) => void; path: string; errors: Record<string, string>; hideLabel?: boolean }) {
    const { Label } = ui;
    const id = path.replace(/[^A-Za-z0-9_-]+/g, '-');
    const error = errors[path];
    const help = field.instructions ? `${id}-help` : undefined;
    const describedBy = [help, error ? `${id}-error` : undefined].filter(Boolean).join(' ') || undefined;
    const label = field.label ?? field.handle;
    const inline = field.type === 'toggle';

    if (field.type === 'group' || field.type === 'commerce_region') {
        // A group inside a card (or a region, several selects with labels of their own): a small heading and a rule, no box of its own (the card is the frame).
        return (
            <div role="group" aria-labelledby={hideLabel ? undefined : `${id}-label`} aria-label={hideLabel ? label : undefined} className="cm:grid cm:gap-4" data-field={field.handle}>
                {!hideLabel && (
                    <div className="cm:grid cm:gap-1">
                        <div className="cm:flex cm:items-center cm:gap-3">
                            <h3 id={`${id}-label`} className="cm:text-sm cm:font-medium cm:text-foreground">{label}</h3>
                            <div aria-hidden="true" className="cm:h-px cm:flex-1 cm:bg-border" />
                        </div>
                        {help && <p id={help} className="cm:text-sm cm:text-muted-foreground">{field.instructions}</p>}
                    </div>
                )}
                <Input field={field} value={value} onChange={onChange} id={id} path={path} errors={errors} describedBy={describedBy} label={label} />
                {hideLabel && help && <p id={help} className="cm:text-sm cm:text-muted-foreground">{field.instructions}</p>}
                {error && <p id={`${id}-error`} className="cm:text-sm cm:text-destructive">{error}</p>}
            </div>
        );
    }

    return (
        <div className="cm:grid cm:gap-1.5" data-field={field.handle}>
            {/* A label the card's title or a language tab already says is kept for screen readers only. */}
            {!inline && (
                <Label htmlFor={field.type === 'repeater' ? undefined : id} id={`${id}-label`} className={hideLabel ? 'cm:sr-only' : undefined}>
                    {label}{field.required && <span className="cm:text-destructive"> *</span>}
                </Label>
            )}
            <Input field={field} value={value} onChange={onChange} id={id} path={path} errors={errors} describedBy={describedBy} label={label} />
            {help && <p id={help} className="cm:text-sm cm:text-muted-foreground">{field.instructions}</p>}
            {error && <p id={`${id}-error`} className="cm:text-sm cm:text-destructive">{error}</p>}
        </div>
    );
}

function Input({ field, value, onChange, id, path, errors, describedBy, label }: {
    field: FieldDef; value: unknown; onChange: (value: unknown) => void; id: string; path: string; errors: Record<string, string>; describedBy?: string; label: string;
}) {
    const { Input: TextInput, Textarea, Switch, Label, Button, MediaPickerInput, RichTextEditor, Checkbox, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } = ui;
    const invalid = errors[path] !== undefined;
    const config = field.config ?? {};
    const Own = COMMERCE_INPUTS[field.type];
    if (Own) {
        return <Own field={field} value={value} onChange={onChange} errors={errorsUnder(errors, path)} id={id} describedBy={describedBy} />;
    }

    switch (field.type) {
        case 'textarea':
            return <Textarea id={id} rows={4} value={typeof value === 'string' ? value : ''} aria-invalid={invalid} aria-describedby={describedBy}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)} />;
        case 'number':
            return <TextInput id={id} type="number" inputMode="decimal" value={value === null || value === undefined ? '' : String(value)} aria-invalid={invalid} aria-describedby={describedBy}
                min={config.min as number | undefined} max={config.max as number | undefined} step={(config.step as number | undefined) ?? 'any'}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(numberValue(e.target.value))} />;
        case 'date':
            return <TextInput id={id} type="date" value={typeof value === 'string' ? value : ''} aria-invalid={invalid} aria-describedby={describedBy}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value || null)} />;
        case 'toggle':
            return (
                <div className="cm:flex cm:items-center cm:gap-3">
                    <Switch id={id} checked={value === true} aria-describedby={describedBy} onCheckedChange={(on: boolean) => onChange(on)} />
                    <Label htmlFor={id}>{label}</Label>
                </div>
            );
        case 'select':
        case 'entries':
        case 'terms': {
            const options = optionsOf(field);
            // Entries and terms are ids; a select's values are text.
            const numeric = field.type !== 'select';
            if (config.multiple === true) {
                const chosen = (Array.isArray(value) ? value : []).map(String);
                const toggle = (option: string, on: boolean) => {
                    const next = on ? [...chosen, option] : chosen.filter((v) => v !== option);
                    onChange(numeric ? next.map(Number) : next);
                };
                return (
                    <div role="group" aria-labelledby={`${id}-label`} aria-describedby={describedBy} className="cm:grid cm:gap-2 cm:sm:grid-cols-2">
                        {options.map((o) => (
                            <label key={o.value} className="cm:flex cm:items-center cm:gap-2 cm:text-sm">
                                <Checkbox checked={chosen.includes(o.value)} onCheckedChange={(on: boolean) => toggle(o.value, on === true)} />
                                {o.label}
                            </label>
                        ))}
                    </div>
                );
            }
            const current = Array.isArray(value) ? value[0] : value;
            const chosen = selectValue(current, options);
            return (
                <Select value={chosen} onValueChange={(next: string) => onChange(fromSelect(next, numeric))}>
                    <SelectTrigger id={id} className="cm:w-full" aria-invalid={invalid} aria-describedby={describedBy}><SelectValue placeholder="—" /></SelectTrigger>
                    <SelectContent>
                        {(!field.required || chosen === SELECT_NONE) && <SelectItem value={SELECT_NONE}>—</SelectItem>}
                        {options.map((o) => <SelectItem key={o.value} value={toSelect(o.value)}>{o.label}</SelectItem>)}
                    </SelectContent>
                </Select>
            );
        }
        case 'media':
        case 'asset':
            return <MediaPickerInput id={id} value={value ?? null} multiple={config.multiple === true} max={config.max} invalid={invalid}
                types={Array.isArray(config.types) ? config.types : config.image_only ? ['image'] : undefined} onChange={(next: unknown) => onChange(next)} />;
        case 'rich_text':
            return <RichTextEditor id={id} value={typeof value === 'string' ? value : ''} invalid={invalid} labelledBy={`${id}-label`}
                onChange={(html: string | null) => onChange(html ?? '')} />;
        case 'group':
            if (config.per_language === true) return <PerLanguage field={field} value={value} onChange={onChange} path={path} errors={errors} />;
            return <FieldRenderer fields={field.fields ?? []} values={(value as Values | null) ?? {}} errors={errors} pathPrefix={path} onChange={(next) => onChange(next)} />;
        case 'repeater':
            return <Repeater field={field} value={value} onChange={onChange} path={path} errors={errors} label={label} />;
        default:
            return <TextInput id={id} value={typeof value === 'string' || typeof value === 'number' ? String(value) : ''} aria-invalid={invalid} aria-describedby={describedBy}
                maxLength={undefined} placeholder={config.placeholder as string | undefined} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} />;
    }
}

/** A repeater: its rows are the only boxes in a form, each folding to a one-line summary. */
function Repeater({ field, value, onChange, path, errors, label }: { field: FieldDef; value: unknown; onChange: (value: unknown) => void; path: string; errors: Record<string, string>; label: string }) {
    const { Button } = ui;
    const rows = Array.isArray(value) ? (value as Values[]) : [];
    // Rows are matched to their fold state by a key that moves with them.
    const keys = React.useRef<number[]>([]);
    const next = React.useRef(0);
    while (keys.current.length < rows.length) keys.current.push(next.current++);
    keys.current.length = rows.length;
    // Rows added here start open; the ones the page brought start folded.
    const [open, setOpen] = React.useState<Set<number>>(() => new Set());
    const set = (rowsNext: Values[], keysNext: number[]) => { keys.current = keysNext; onChange(rowsNext); };
    const blank = () => Object.fromEntries((field.fields ?? []).map((f) => [f.handle, f.type === 'toggle' ? false : null]));
    const max = typeof field.config?.max === 'number' ? field.config.max : null;
    const swap = <T,>(list: T[], i: number): T[] => list.map((item, j) => (j === i - 1 ? list[i] : j === i ? list[i - 1] : item));

    return (
        <div className="cm:grid cm:gap-2">
            {rows.map((row, i) => {
                const key = keys.current[i];
                const rowPath = `${path}.${i}`;
                const failing = Object.keys(errors).some((k) => k === rowPath || k.startsWith(`${rowPath}.`));
                const summary = (ui.cardSummary as unknown as (values: unknown[]) => string)(summaryValues(field.fields ?? [], row));
                const shown = failing || open.has(key) || summary === '';
                const toggle = () => setOpen((current) => {
                    const copy = new Set(current);
                    if (shown) copy.delete(key); else copy.add(key);
                    return copy;
                });
                const bodyId = `${rowPath.replace(/[^A-Za-z0-9_-]+/g, '-')}-row`;

                return (
                    <div key={key} className={cn('cm:rounded-lg cm:border cm:bg-card', failing && 'cm:border-destructive/50')}>
                        <div className="cm:flex cm:items-center cm:gap-1 cm:pr-2">
                            <button type="button" aria-expanded={shown} aria-controls={bodyId} onClick={toggle} disabled={failing || summary === ''}
                                className="cm:flex cm:min-w-0 cm:flex-1 cm:items-center cm:gap-2 cm:rounded-lg cm:px-3 cm:py-2.5 cm:text-left cm:text-sm cm:disabled:cursor-default cm:focus-visible:ring-2 cm:focus-visible:ring-ring cm:focus-visible:outline-none">
                                <svg aria-hidden="true" viewBox="0 0 24 24" className={cn('cm:size-4 cm:shrink-0 cm:text-muted-foreground cm:transition-transform', !shown && 'cm:-rotate-90')} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                <span className="cm:shrink-0 cm:tabular-nums cm:text-muted-foreground">{i + 1}.</span>
                                <span className="cm:truncate cm:font-medium">{summary || `New ${label.toLowerCase()}`}</span>
                            </button>
                            <Button type="button" size="sm" variant="ghost" disabled={i === 0} aria-label={`Move ${i + 1} up`}
                                onClick={() => set(swap(rows, i), swap(keys.current, i))}>Move up</Button>
                            <Button type="button" size="sm" variant="ghost" aria-label={`Remove ${i + 1}`}
                                onClick={() => set(rows.filter((_, j) => j !== i), keys.current.filter((_, j) => j !== i))}>Remove</Button>
                        </div>
                        <div id={bodyId} hidden={!shown} className="cm:border-t cm:p-4">
                            <FieldRenderer fields={field.fields ?? []} values={row} errors={errors} pathPrefix={rowPath}
                                onChange={(changed) => set(rows.map((r, j) => (j === i ? changed : r)), keys.current)} />
                        </div>
                    </div>
                );
            })}
            <div>
                <Button type="button" size="sm" variant="outline" disabled={max !== null && rows.length >= max}
                    onClick={() => { const key = next.current++; setOpen((current) => new Set(current).add(key)); set([...rows, blank()], [...keys.current, key]); }}>
                    Add {label.toLowerCase()}
                </Button>
            </div>
        </div>
    );
}

/** A group with one field per language (SchemaForm::perLanguage()): language tabs, one language's field at a time. */
function PerLanguage({ field, value, onChange, path, errors }: { field: FieldDef; value: unknown; onChange: (value: unknown) => void; path: string; errors: Record<string, string> }) {
    const { LanguageTabs } = ui;
    const values = (value as Values | null) ?? {};
    const languages = field.fields ?? [];
    const main = String(field.config?.main ?? languages[0]?.handle ?? '');
    const failing = (code: string) => Object.keys(errors).some((k) => k === `${path}.${code}` || k.startsWith(`${path}.${code}.`));
    const [current, setCurrent] = React.useState(() => languages.find((l) => failing(l.handle))?.handle ?? main);
    const empty = (code: string) => values[code] === null || values[code] === undefined || values[code] === '';

    return (
        <LanguageTabs value={current} onValueChange={setCurrent} label={field.label}
            languages={languages.map((l) => ({
                code: l.handle, name: l.label, main: l.handle === main, missing: l.handle !== main && empty(l.handle),
                status: failing(l.handle) ? { tone: 'warning', label: 'Has an error' } : undefined,
            }))}>
            {(code: string) => (
                // The tab names the language, so its field doesn't.
                <FieldRenderer fields={languages.filter((l) => l.handle === code)} values={values} errors={errors} pathPrefix={path}
                    section={languages.find((l) => l.handle === code)?.label ?? null} onChange={(next) => onChange(next)} />
            )}
        </LanguageTabs>
    );
}
