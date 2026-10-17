import type { ReactNode } from 'react';

export function EmptyState({ title, description, action }: { title: string; description?: ReactNode; action?: ReactNode }) {
    return (
        <div className="cm:flex cm:flex-col cm:items-center cm:gap-2 cm:rounded-lg cm:border cm:border-dashed cm:px-6 cm:py-10 cm:text-center">
            <p className="cm:font-medium">{title}</p>
            {description && <p className="cm:max-w-md cm:text-sm cm:text-muted-foreground">{description}</p>}
            {action && <div className="cm:mt-2">{action}</div>}
        </div>
    );
}
