import { React, ui } from '../../lib/sunrice';
import { cn } from '../../lib/cn';
import { MoneyInput } from '../../components/MoneyInput';

/** Small labelled controls used across the product editor tabs. */
export function Row({ label, hint, children, htmlFor, className }: { label: string; hint?: string; children: React.ReactNode; htmlFor?: string; className?: string }) {
    const { Label } = ui;

    return (
        <div className={cn('cm:grid cm:gap-1.5', className)}>
            <Label htmlFor={htmlFor}>{label}</Label>
            {children}
            {hint && <p className="cm:text-xs cm:text-muted-foreground">{hint}</p>}
        </div>
    );
}

export function Grid({ children, cols = 3 }: { children: React.ReactNode; cols?: 2 | 3 | 4 }) {
    const classes = { 2: 'cm:sm:grid-cols-2', 3: 'cm:sm:grid-cols-2 cm:lg:grid-cols-3', 4: 'cm:sm:grid-cols-2 cm:lg:grid-cols-4' };

    return <div className={cn('cm:grid cm:gap-4', classes[cols])}>{children}</div>;
}

export function NumberInput({ id, value, onChange, min = 0, placeholder }: { id?: string; value: number | null; onChange: (v: number | null) => void; min?: number; placeholder?: string }) {
    const { Input } = ui;

    return (
        <Input id={id} type="number" inputMode="numeric" min={min} value={value ?? ''} placeholder={placeholder}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value === '' ? null : Math.round(Number(e.target.value)))} />
    );
}

export function TextInput({ id, value, onChange, placeholder, onBlur }: { id?: string; value: string | null; onChange: (v: string | null) => void; placeholder?: string; onBlur?: () => void }) {
    const { Input } = ui;

    return <Input id={id} value={value ?? ''} placeholder={placeholder} onBlur={onBlur}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value === '' ? null : e.target.value)} />;
}

export function Money({ id, value, onChange, nullable = true }: { id?: string; value: number | null; onChange: (v: number | null) => void; nullable?: boolean }) {
    return <MoneyInput id={id} value={value} allowNull={nullable} onChange={onChange} />;
}

export function Toggle({ id, label, checked, onChange, hint }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
    const { Switch, Label } = ui;

    return (
        <div className="cm:flex cm:items-start cm:gap-3">
            <Switch id={id} checked={checked} onCheckedChange={onChange} />
            <div className="cm:grid cm:gap-0.5">
                <Label htmlFor={id}>{label}</Label>
                {hint && <p className="cm:text-xs cm:text-muted-foreground">{hint}</p>}
            </div>
        </div>
    );
}

export const selectClass = 'cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm';

export function NativeSelect<T extends string>({ id, value, onChange, options }: { id?: string; value: T; onChange: (v: T) => void; options: Array<[T, string]> }) {
    return (
        <select id={id} className={selectClass} value={value} onChange={(e) => onChange(e.target.value as T)}>
            {options.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
        </select>
    );
}

export function Section({ title, description, children, actions }: { title: string; description?: string; children: React.ReactNode; actions?: React.ReactNode }) {
    return (
        <section className="cm:grid cm:gap-4">
            <div className="cm:flex cm:items-start cm:justify-between cm:gap-3">
                <div className="cm:grid cm:gap-0.5">
                    <h3 className="cm:text-sm cm:font-semibold">{title}</h3>
                    {description && <p className="cm:text-xs cm:text-muted-foreground">{description}</p>}
                </div>
                {actions}
            </div>
            {children}
        </section>
    );
}
