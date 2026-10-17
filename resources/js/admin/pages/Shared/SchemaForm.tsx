import { SchemaFormView, type SchemaFormProps } from '../../components/SchemaFormView';
import { PageHeader } from '../../components/PageHeader';
import { Sunrice } from '../../lib/sunrice';
import { useCommerceShared } from '../../lib/store';

/** A page that is only a schema form (Inertia::render('Commerce/Shared/SchemaForm', [...])). */
export default function SchemaForm({ title, description, form, breadcrumbs = [] }: {
    title: string;
    description?: string;
    form: SchemaFormProps;
    breadcrumbs?: Array<{ label: string; href?: string }>;
}) {
    useCommerceShared();
    Sunrice.useBreadcrumbs([...breadcrumbs, { label: title }]);

    return (
        <div className="cm:mx-auto cm:grid cm:w-full cm:max-w-3xl cm:gap-6 cm:p-4 cm:md:p-6">
            <PageHeader title={title} description={description} />
            <SchemaFormView form={form} />
        </div>
    );
}
