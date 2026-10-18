import { adminUrl, inertia } from '../lib/sunrice';
import { cn } from '../lib/cn';
import type { MenuItem } from '../lib/store';

/** Tabs between the pages of one menu entry (Marketing → Campaigns, Automations). */
export function PageTabs({ items, current, label }: { items: MenuItem[]; current: string; label: string }) {
    const { Link } = inertia;

    return (
        <nav aria-label={label} className="cm:flex cm:gap-1 cm:overflow-x-auto cm:border-b">
            {items.map((item) => (
                <Link
                    key={item.key}
                    href={adminUrl(item.href)}
                    aria-current={item.key === current ? 'page' : undefined}
                    className={cn(
                        'cm:-mb-px cm:whitespace-nowrap cm:border-b-2 cm:border-transparent cm:px-3 cm:py-2 cm:text-sm cm:text-muted-foreground cm:hover:text-foreground',
                        item.key === current && 'cm:border-foreground cm:font-medium cm:text-foreground',
                    )}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}
