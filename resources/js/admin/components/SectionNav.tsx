import { adminUrl, inertia } from '../lib/sunrice';
import { cn } from '../lib/cn';
import type { MenuItem } from '../lib/store';

/** A settings area's section links. */
export function SectionNav({ items, current, label = 'Sections' }: { items: MenuItem[]; current: string; label?: string }) {
    const { Link } = inertia;

    return (
        <nav aria-label={label} className="cm:grid cm:gap-1 cm:max-lg:grid-cols-[repeat(auto-fit,minmax(min(100%,10rem),1fr))]">
            {items.map((item) => (
                <Link
                    key={item.key}
                    href={adminUrl(item.href)}
                    aria-current={item.key === current ? 'page' : undefined}
                    className={cn(
                        'cm:flex cm:min-h-10 cm:items-center cm:rounded-md cm:px-3 cm:py-2 cm:text-sm cm:text-muted-foreground cm:transition-colors cm:hover:bg-muted cm:hover:text-foreground',
                        item.key === current && 'cm:bg-muted cm:font-semibold cm:text-foreground',
                    )}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}
