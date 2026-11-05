import * as React from 'react';
import * as Ui from '../shims/ui';
import type { FieldProps } from '../sunrice';
import { errorsUnder, numberValue, optionsOf, type FieldDef } from '../lib/fields';
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




const selectClass = 'cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-input cm:bg-background cm:px-3 cm:text-sm';

/**
 * Commerce's forms (SchemaForm, src/Admin/SchemaForm.php): each field with
 * its label, input, help and error. Values are by handle; errors keyed by
 * `pathPrefix.handle` (as the server names them).
 */
export function FieldRenderer({ fields, values, onChange, errors = {}, pathPrefix = 'values' }: {
    fields: readonly FieldDef[] | ReadonlyArray<Record<string, unknown>>;
    values: Values;
    onChange: (values: Values) => void;
    errors?: Partial<Record<string, string>>;
    pathPrefix?: string;
}) {
    const defs = fields as readonly FieldDef[];
    const messages = errors as Record<string, string>;
    return (
        <div className="cm:grid cm:gap-5">
            {defs.map((field) => (
                <FieldRow key={field.handle} field={field} value={values?.[field.handle]} path={`${pathPrefix}.${field.handle}`} errors={messages}
                    onChange={(value) => onChange({ ...values, [field.handle]: value })} />
            ))}
        </div>
    );
}

function FieldRow({ field, value, onChange, path, errors }: { field: FieldDef; value: unknown; onChange: (value: unknown) => void; path: string; errors: Record<string, string> }) {
    const { Label } = ui;
    const id = path.replace(/[^A-Za-z0-9_-]+/g, '-');
    const error = errors[path];
    const help = field.instructions ? `${id}-help` : undefined;
    const describedBy = [help, error ? `${id}-error` : undefined].filter(Boolean).join(' ') || undefined;
    const label = field.label ?? field.handle;
    const inline = field.type === 'toggle';

    return (
        <div className="cm:grid cm:gap-1.5" data-field={field.handle}>
            {!inline && (
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
    const { Input: TextInput, Textarea, Switch, Label, Button, MediaPickerInput, RichTextEditor } = ui;
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
                    <div role="group" aria-labelledby={`${id}-label`} aria-describedby={describedBy} className="cm:grid cm:gap-1.5 cm:sm:grid-cols-2">
                        {options.map((o) => (
                            <label key={o.value} className="cm:flex cm:items-center cm:gap-2 cm:text-sm">
                                <input type="checkbox" checked={chosen.includes(o.value)} onChange={(e) => toggle(o.value, e.target.checked)} />
                                {o.label}
                            </label>
                        ))}
                    </div>
                );
            }
            const current = Array.isArray(value) ? value[0] : value;
            return (
                <select id={id} className={selectClass} value={current === null || current === undefined ? '' : String(current)} aria-invalid={invalid} aria-describedby={describedBy}
                    onChange={(e) => onChange(e.target.value === '' ? null : numeric ? Number(e.target.value) : e.target.value)}>
                    {(!field.required || current === null || current === undefined || current === '') && <option value="">—</option>}
                    {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
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
            return (
                <div className="cm:rounded-lg cm:border cm:p-4">
                    <FieldRenderer fields={field.fields ?? []} values={(value as Values | null) ?? {}} errors={errors} pathPrefix={path} onChange={(next) => onChange(next)} />
                </div>
            );
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
