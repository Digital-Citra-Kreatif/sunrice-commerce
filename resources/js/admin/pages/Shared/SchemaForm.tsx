import { SchemaFormView, type SchemaFormProps } from '../../components/SchemaFormView';
import { PageHeader } from '../../components/PageHeader';
import { adminUrl, inertia, ui, useBreadcrumbs } from '../../lib/sunrice';
import { useCommerceShared } from '../../lib/store';

const FORM_ID = 'commerce-schema-form';

/** A page that is only a schema form (Inertia::render('Commerce/Shared/SchemaForm', [...])): Save and Delete in its header. */
export default function SchemaForm({ title, description, form, breadcrumbs = [], deleteUrl, deleteConfirm }: {
    title: string;
    description?: string;
    form: SchemaFormProps;
    breadcrumbs?: Array<{ label: string; href?: string }>;
    deleteUrl?: string | null;
    deleteConfirm?: string;
}) {
    const { Button } = ui;
    useCommerceShared();
    useBreadcrumbs([...breadcrumbs.map((b) => ({ ...b, href: b.href ? adminUrl(b.href) : undefined })), { label: title }]);
    const back = [...breadcrumbs].reverse().find((b) => b.href && b.href !== 'commerce');

    return (
        <div className="cm:flex cm:min-w-0 cm:max-w-5xl cm:flex-col cm:gap-6">
            <PageHeader title={title} description={description}
                back={back?.href ? { href: adminUrl(back.href), label: `Back to ${back.label.toLowerCase()}` } : undefined}
                actions={deleteUrl ? (
                    <Button type="button" variant="outline" className="cm:text-destructive"
                        onClick={() => window.confirm(deleteConfirm ?? 'Delete this?') && inertia.router.delete(adminUrl(deleteUrl))}>Delete</Button>
                ) : undefined}
                primary={<Button type="submit" form={FORM_ID}>{form.submitLabel}</Button>} />
            <SchemaFormView form={form} id={FORM_ID} storageKey={`commerce:form:${form.action.replace(/\/\d+/g, "")}`} />
        </div>
    );
}
