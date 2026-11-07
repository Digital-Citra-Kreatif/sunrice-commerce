import type { ReactNode } from 'react';
import { inertia, ui } from '../lib/sunrice';
import { FieldRenderer } from '../components/FieldRenderer';
import type { FieldDef } from '../lib/fields';

export interface SchemaFormSection { title: string | null; description: string | null; fields: string[] }

export interface SchemaFormProps {
    fields: Array<Record<string, unknown>>;
    sections?: SchemaFormSection[];
    values: Record<string, unknown>;
    action: string;
    method: 'post' | 'put' | 'patch';
    submitLabel: string;
}

/**
 * A SchemaForm (src/Admin/SchemaForm.php) drawn as the panel draws its
 * forms: each section a card (titled ones fold away, remembered per
 * `storageKey`), fields side by side by their width. With `id`, the page
 * puts the submit button where it likes (`<Button type="submit" form={id}>`,
 * in its header); without, it sits under the form.
 */
export function SchemaFormView({ form, id, storageKey, footer }: { form: SchemaFormProps; id?: string; storageKey?: string; footer?: ReactNode }) {
    const { Button, Card, CardContent, CollapsibleCard, useUnsavedChanges } = ui as typeof ui & { useUnsavedChanges: (dirty: boolean, save?: () => void) => void };
    const { data, setData, errors, processing, isDirty, ...submit } = inertia.useForm({ values: form.values });
    const save = () => submit[form.method](form.action, { preserveScroll: true });
    useUnsavedChanges(isDirty, save);
    const fields = form.fields as unknown as FieldDef[];
    const sections = form.sections?.length ? form.sections : [{ title: null, description: null, fields: fields.map((f) => f.handle) }];
    const errorKeys = Object.keys(errors);
    const drawn = (handles: string[], title: string | null = null) => (
        <FieldRenderer fields={fields.filter((f) => handles.includes(f.handle))} values={data.values} errors={errors} pathPrefix="values" section={title}
            onChange={(values: Record<string, unknown>) => setData('values', values)} />
    );

    return (
        <form id={id} className="cm:flex cm:flex-col cm:gap-6" onSubmit={(e) => { e.preventDefault(); save(); }}>
            {errors.section && (
                <div role="alert" className="cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive">
                    {errors.section}
                </div>
            )}
            {sections.map((section, i) => section.title === null ? (
                <Card key={`untitled-${i}`}><CardContent>{drawn(section.fields)}</CardContent></Card>
            ) : (
                <CollapsibleCard key={section.title} title={section.title} description={section.description ?? undefined}
                    storageKey={storageKey ? `${storageKey}:${section.title}` : undefined}
                    hasErrors={section.fields.some((h) => errorKeys.some((k) => k === `values.${h}` || k.startsWith(`values.${h}.`)))}>
                    {drawn(section.fields, section.title)}
                </CollapsibleCard>
            ))}
            {(id === undefined || footer) && (
                <div className="cm:flex cm:items-center cm:gap-3">
                    {id === undefined && <Button type="submit" disabled={processing}>{form.submitLabel}</Button>}
                    {footer}
                </div>
            )}
        </form>
    );
}
