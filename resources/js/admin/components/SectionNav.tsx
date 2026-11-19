import { adminUrl, inertia } from '../lib/sunrice';
import { cn } from '../lib/cn';
import type { MenuItem } from '../lib/store';

/** A settings area's sections as tabs (Store → General, Catalog, …): one row, scrolling sideways when narrow. */
export function SectionNav({ items, current, label = 'Sections' }: { items: MenuItem[]; current: string; label?: string }) {
    const { Link } = inertia;

    return (
        <nav aria-label={label} className="cm:-mb-2 cm:flex cm:gap-1 cm:overflow-x-auto cm:border-b">
            {items.map((item) => (
                <Link
                    key={item.key}
                    href={adminUrl(item.href)}
                    aria-current={item.key === current ? 'page' : undefined}
                    className={cn(
                        'cm:-mb-px cm:whitespace-nowrap cm:border-b-2 cm:border-transparent cm:px-3 cm:pb-2.5 cm:pt-1 cm:text-sm cm:text-muted-foreground cm:transition-colors cm:hover:text-foreground',
                        item.key === current && 'cm:border-foreground cm:font-medium cm:text-foreground',
                    )}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}
