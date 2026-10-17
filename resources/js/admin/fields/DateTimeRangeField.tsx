import { ui } from '../lib/sunrice';
import type { FieldProps } from '../sunrice';

type Range = { start: string | null; end: string | null };

/** ISO 8601 → the value of an <input type="datetime-local"> in local time. */
function toLocal(iso: string | null): string {
    if (!iso) return '';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function fromLocal(local: string): string | null {
    return local ? new Date(local).toISOString() : null;
}

/** commerce_datetime_range: {start, end}. */
export default function DateTimeRangeField({ value, onChange, pathPrefix }: FieldProps<Range | null>) {
    const { Input, Label } = ui;
    const range: Range = { start: value?.start ?? null, end: value?.end ?? null };

    return (
        <div className="cm:grid cm:gap-3 cm:sm:grid-cols-2">
            <div className="cm:grid cm:gap-1">
                <Label htmlFor={`${pathPrefix}-start`}>Starts</Label>
                <Input id={`${pathPrefix}-start`} type="datetime-local" value={toLocal(range.start)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...range, start: fromLocal(e.target.value) })} />
            </div>
            <div className="cm:grid cm:gap-1">
                <Label htmlFor={`${pathPrefix}-end`}>Ends</Label>
                <Input id={`${pathPrefix}-end`} type="datetime-local" value={toLocal(range.end)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...range, end: fromLocal(e.target.value) })} />
            </div>
        </div>
    );
}
