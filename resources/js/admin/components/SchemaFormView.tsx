import { components, inertia, ui } from '../lib/sunrice';

export interface SchemaFormProps {
    fields: Array<Record<string, unknown>>;
    values: Record<string, unknown>;
    action: string;
    method: 'post' | 'put' | 'patch';
    submitLabel: string;
}

/** A SchemaForm (src/Admin/SchemaForm.php) rendered with Sunrice's field controls. */
export function SchemaFormView({ form, footer }: { form: SchemaFormProps; footer?: React.ReactNode }) {
    const { FieldRenderer } = components;
    const { Button } = ui;
    const { data, setData, errors, processing, isDirty, ...submit } = inertia.useForm({ values: form.values });

    return (
        <form
            className="cm:grid cm:gap-6"
            onSubmit={(e) => {
                e.preventDefault();
                submit[form.method](form.action, { preserveScroll: true });
            }}
        >
            {errors.section && (
                <div role="alert" className="cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive">
                    {errors.section}
                </div>
            )}
            <FieldRenderer
                fields={form.fields}
                values={data.values}
                errors={errors}
                pathPrefix="values"
                onChange={(values: Record<string, unknown>) => setData('values', values)}
            />
            <div className="cm:flex cm:items-center cm:gap-3">
                <Button type="submit" disabled={processing}>
                    {form.submitLabel}
                </Button>
                {isDirty && <span className="cm:text-sm cm:text-muted-foreground">Unsaved changes</span>}
                {footer}
            </div>
        </form>
    );
}
