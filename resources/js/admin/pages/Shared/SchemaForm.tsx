import { SchemaFormView, type SchemaFormProps } from '../../components/SchemaFormView';
import { PageHeader } from '../../components/PageHeader';
import { adminUrl, inertia, Sunrice, ui } from '../../lib/sunrice';
import { useCommerceShared } from '../../lib/store';

/** A page that is only a schema form (Inertia::render('Commerce/Shared/SchemaForm', [...])). */
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
    Sunrice.useBreadcrumbs([...breadcrumbs.map((b) => ({ ...b, href: b.href ? adminUrl(b.href) : undefined })), { label: title }]);

    return (
        <div className="cm:mx-auto cm:grid cm:w-full cm:max-w-3xl cm:gap-6 cm:p-4 cm:md:p-6">
            <PageHeader title={title} description={description} />
            <SchemaFormView form={form} footer={deleteUrl ? (
                <Button type="button" variant="ghost" className="cm:ml-auto cm:text-destructive"
                    onClick={() => window.confirm(deleteConfirm ?? 'Delete this?') && inertia.router.delete(adminUrl(deleteUrl))}>Delete</Button>
            ) : null} />
        </div>
    );
}
