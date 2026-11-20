import { React, ui } from '../../lib/sunrice';
import { cn } from '../../lib/cn';
import { MoneyInput } from '../../components/MoneyInput';
import { fromUnit, toUnit, type Unit } from '../../lib/units';

/** Small labelled controls used across the product editor tabs. */
export function Row({ label, hint, children, htmlFor, className }: { label: string; hint?: string; children: React.ReactNode; htmlFor?: string; className?: string }) {
    const { Label } = ui;

    return (
        <div className={cn('cm:grid cm:content-start cm:gap-1.5', className)}>
            <Label htmlFor={htmlFor}>{label}</Label>
            {children}
            {hint && <p className="cm:text-xs cm:text-muted-foreground">{hint}</p>}
        </div>
    );
}

export function Grid({ children, cols = 3 }: { children: React.ReactNode; cols?: 2 | 3 | 4 }) {
    const classes = { 2: 'cm:sm:grid-cols-2', 3: 'cm:sm:grid-cols-2 cm:lg:grid-cols-3', 4: 'cm:sm:grid-cols-2 cm:lg:grid-cols-4' };

    return <div className={cn('cm:grid cm:items-start cm:gap-4', classes[cols])}>{children}</div>;
}

export function NumberInput({ id, value, onChange, min = 0, placeholder }: { id?: string; value: number | null; onChange: (v: number | null) => void; min?: number; placeholder?: string }) {
    const { Input } = ui;

    return (
        <Input id={id} type="number" inputMode="numeric" min={min} value={value ?? ''} placeholder={placeholder}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value === '' ? null : Math.round(Number(e.target.value)))} />
    );
}

/**
 * A weight or size typed in the store's unit (kg, cm…) and kept in grams or
 * millimetres. What is typed stays as typed ("0.", "1,5") while it means the value.
 */
export function UnitInput({ id, value, onChange, unit, placeholder }: { id?: string; value: number | null; onChange: (v: number | null) => void; unit: Unit; placeholder?: string }) {
    const { Input } = ui;
    const [text, setText] = React.useState(() => toUnit(value, unit));
    // A new value from outside (another variant, the unit changing) replaces the text.
    React.useEffect(() => {
        if (fromUnit(text, unit) !== value) setText(toUnit(value, unit));
    }, [value, unit]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Input id={id} type="text" inputMode="decimal" value={text} placeholder={placeholder}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setText(e.target.value); onChange(fromUnit(e.target.value, unit)); }} />
    );
}

export function TextInput({ id, value, onChange, placeholder, onBlur }: { id?: string; value: string | null; onChange: (v: string | null) => void; placeholder?: string; onBlur?: () => void }) {
    const { Input } = ui;

    return <Input id={id} value={value ?? ''} placeholder={placeholder} onBlur={onBlur}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value === '' ? null : e.target.value)} />;
}

export function Money({ id, value, onChange, nullable = true, placeholder }: { id?: string; value: number | null; onChange: (v: number | null) => void; nullable?: boolean; placeholder?: string }) {
    return <MoneyInput id={id} value={value} allowNull={nullable} onChange={onChange} placeholder={placeholder} />;
}

export function Toggle({ id, label, checked, onChange, hint, disabled = false }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string; disabled?: boolean }) {
    const { Switch, Label } = ui;

    return (
        <div className="cm:flex cm:items-start cm:gap-3">
            <Switch id={id} disabled={disabled} checked={checked} onCheckedChange={onChange} />
            <div className="cm:grid cm:gap-0.5">
                <Label htmlFor={id}>{label}</Label>
                {hint && <p className="cm:text-xs cm:text-muted-foreground">{hint}</p>}
            </div>
        </div>
    );
}

export const selectClass = 'cm:h-10 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm';

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
