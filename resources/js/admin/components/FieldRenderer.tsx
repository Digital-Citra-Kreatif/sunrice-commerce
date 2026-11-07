import * as React from 'react';
import * as Ui from '../shims/ui';
import { cn } from '../lib/cn';
import type { FieldProps } from '../sunrice';
import { errorsUnder, fromSelect, isShown, numberValue, optionsOf, SELECT_NONE, selectValue, toSelect, type FieldDef } from '../lib/fields';
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

    return (
        <div className="cm:grid cm:gap-1.5" data-field={field.handle}>
            {!inline && !hideLabel && (
                <Label htmlFor={field.type === 'group' || field.type === 'repeater' ? undefined : id} id={`${id}-label`}>
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
            // Laid out with the fields around it, under its label: the section's card is the frame.
            return <FieldRenderer fields={field.fields ?? []} values={(value as Values | null) ?? {}} errors={errors} pathPrefix={path} onChange={(next) => onChange(next)} />;
        case 'repeater': {
            const rows = Array.isArray(value) ? (value as Values[]) : [];
            const set = (next: Values[]) => onChange(next);
            const blank = () => Object.fromEntries((field.fields ?? []).map((f) => [f.handle, f.type === 'toggle' ? false : null]));
            return (
                <div className="cm:grid cm:gap-3">
                    {rows.map((row, i) => (
                        <div key={i} className="cm:grid cm:gap-3 cm:rounded-lg cm:border cm:p-4">
                            <FieldRenderer fields={field.fields ?? []} values={row} errors={errors} pathPrefix={`${path}.${i}`}
                                onChange={(next) => set(rows.map((r, j) => (j === i ? next : r)))} />
                            <div className="cm:flex cm:gap-2">
                                <Button type="button" size="sm" variant="ghost" disabled={i === 0} onClick={() => set(rows.map((r, j) => (j === i - 1 ? rows[i] : j === i ? rows[i - 1] : r)))}>Move up</Button>
                                <Button type="button" size="sm" variant="ghost" onClick={() => set(rows.filter((_, j) => j !== i))}>Remove</Button>
                            </div>
                        </div>
                    ))}
                    <div><Button type="button" size="sm" variant="outline" disabled={typeof config.max === 'number' && rows.length >= config.max} onClick={() => set([...rows, blank()])}>Add {label.toLowerCase()}</Button></div>
                </div>
            );
        }
        default:
            return <TextInput id={id} value={typeof value === 'string' || typeof value === 'number' ? String(value) : ''} aria-invalid={invalid} aria-describedby={describedBy}
                maxLength={undefined} placeholder={config.placeholder as string | undefined} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} />;
    }
}
