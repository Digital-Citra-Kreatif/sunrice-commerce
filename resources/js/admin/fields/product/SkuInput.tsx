import { adminUrl, fetchJson, React } from '../../lib/sunrice';
import { TextInput } from './controls';

/** A SKU field that checks, when left, whether another product uses it. */
export function SkuInput({ id, value, onChange, entryId }: { id?: string; value: string | null; onChange: (v: string | null) => void; entryId: number | null }) {
    const [taken, setTaken] = React.useState<string | null>(null);
    const check = () => {
        if (!value) return setTaken(null);
        const query = new URLSearchParams({ sku: value, entry: String(entryId ?? 0) });
        fetchJson<{ available: boolean; product?: string }>(adminUrl(`commerce/api/sku-check?${query}`))
            .then((r) => setTaken(r.available ? null : (r.product ?? 'another product')))
            .catch(() => setTaken(null));
    };

    return (
        <div className="cm:grid cm:gap-1">
            <TextInput id={id} value={value} onChange={(v) => { setTaken(null); onChange(v); }} onBlur={check} />
            {taken && <p className="cm:text-xs cm:text-destructive">Already used by {taken}.</p>}
        </div>
    );
}
