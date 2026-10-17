import type { ReactNode } from 'react';
import { inertia } from '../lib/sunrice';

/** Page title, description and actions; also sets the document title. */
export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
    const { Head } = inertia;

    return (
        <div className="cm:flex cm:flex-wrap cm:items-start cm:justify-between cm:gap-4">
            <Head title={title} />
            <div className="cm:grid cm:gap-1">
                <h1 className="cm:text-xl cm:font-semibold cm:tracking-tight">{title}</h1>
                {description && <p className="cm:text-sm cm:text-muted-foreground">{description}</p>}
            </div>
            {actions && <div className="cm:flex cm:flex-wrap cm:items-center cm:gap-2">{actions}</div>}
        </div>
    );
}
