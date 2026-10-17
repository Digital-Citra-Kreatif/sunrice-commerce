import { adminUrl, inertia } from '../lib/sunrice';
import { cn } from '../lib/cn';
import type { MenuItem } from '../lib/store';

/** The vertical menu of a settings area (Store → General, Catalog, …). */
export function SectionNav({ items, current, label = 'Sections' }: { items: MenuItem[]; current: string; label?: string }) {
    const { Link } = inertia;

    return (
        <nav aria-label={label} className="cm:flex cm:gap-1 cm:overflow-x-auto cm:md:flex-col">
            {items.map((item) => (
                <Link
                    key={item.key}
                    href={adminUrl(item.href)}
                    aria-current={item.key === current ? 'page' : undefined}
                    className={cn(
                        'cm:whitespace-nowrap cm:rounded-md cm:px-3 cm:py-1.5 cm:text-sm cm:text-muted-foreground cm:hover:bg-muted cm:hover:text-foreground',
                        item.key === current && 'cm:bg-muted cm:font-medium cm:text-foreground',
                    )}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}
