import { cn } from '../lib/cn';

const tones: Record<string, string> = {
    ok: 'cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400',
    success: 'cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400',
    warning: 'cm:bg-amber-500/10 cm:text-amber-700 cm:dark:text-amber-400',
    error: 'cm:bg-red-500/10 cm:text-red-700 cm:dark:text-red-400',
    info: 'cm:bg-sky-500/10 cm:text-sky-700 cm:dark:text-sky-400',
    neutral: 'cm:bg-muted cm:text-muted-foreground',
};

/** A small colored label: tone ok | warning | error | info | neutral. */
export function StatusBadge({ tone = 'neutral', children }: { tone?: string; children: React.ReactNode }) {
    return (
        <span className={cn('cm:inline-flex cm:items-center cm:rounded-full cm:px-2 cm:py-0.5 cm:text-xs cm:font-medium', tones[tone] ?? tones.neutral)}>
            {children}
        </span>
    );
}
