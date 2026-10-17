import { fetchJson, React, ui } from '../lib/sunrice';
import type { FieldProps } from '../sunrice';

type Region = { country: string; province_code: string | null; city_code: string | null; district_code: string | null; village_code: string | null };
type Option = { code: string; name: string };

const LEVELS = [
    { key: 'province_code', label: 'Province' },
    { key: 'city_code', label: 'City / regency' },
    { key: 'district_code', label: 'District' },
    { key: 'village_code', label: 'Village' },
] as const;
const DEPTHS = { province: 1, city: 2, district: 3, village: 4 } as const;

const cache = new Map<string, Promise<Option[]>>();
function children(api: string, parent: string | null): Promise<Option[]> {
    const url = parent ? `${api}?parent=${encodeURIComponent(parent)}` : api;
    if (!cache.has(url)) {
        cache.set(url, fetchJson<{ data: Option[] }>(url).then((r) => r.data).catch(() => { cache.delete(url); return []; }));
    }

    return cache.get(url)!;
}

const selectClass = 'cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm cm:disabled:opacity-50';

/** commerce_region: country, then province → city → district (→ village) in Indonesia. */
export default function RegionField({ field, value, onChange, pathPrefix }: FieldProps<Partial<Region> | null>) {
    const { Label } = ui;
    const config = field.config ?? {};
    const api = String(config.api ?? '');
    const depth = DEPTHS[(config.depth as keyof typeof DEPTHS) ?? 'district'] ?? 3;
    const countries = (config.country_options as Array<{ value: string; label: string }> | undefined) ?? [];
    const region: Region = { country: 'ID', province_code: null, city_code: null, district_code: null, village_code: null, ...(value ?? {}) };
    const levels = LEVELS.slice(0, depth);
    const [options, setOptions] = React.useState<Record<string, Option[]>>({});

    const parents = [null, region.province_code, region.city_code, region.district_code];
    React.useEffect(() => {
        if (region.country !== 'ID' || !api) return;
        levels.forEach((level, i) => {
            const parent = parents[i];
            if (i > 0 && !parent) return;
            children(api, parent).then((list) => setOptions((o) => ({ ...o, [level.key]: list })));
        });
    }, [api, region.country, region.province_code, region.city_code, region.district_code]); // eslint-disable-line react-hooks/exhaustive-deps

    const set = (index: number, code: string) => {
        const next: Region = { ...region };
        next[levels[index].key] = code || null;
        // A new choice clears the levels below it.
        LEVELS.slice(index + 1).forEach((l) => { next[l.key] = null; });
        onChange(next);
    };

    return (
        <div className="cm:grid cm:gap-3 cm:sm:grid-cols-2">
            {countries.length > 0 && (
                <div className="cm:grid cm:gap-1">
                    <Label htmlFor={`${pathPrefix}-country`}>Country</Label>
                    <select id={`${pathPrefix}-country`} className={selectClass} value={region.country}
                        onChange={(e) => onChange({ country: e.target.value, province_code: null, city_code: null, district_code: null, village_code: null })}>
                        {countries.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                </div>
            )}
            {region.country === 'ID' && levels.map((level, i) => (
                <div key={level.key} className="cm:grid cm:gap-1">
                    <Label htmlFor={`${pathPrefix}-${level.key}`}>{level.label}</Label>
                    <select id={`${pathPrefix}-${level.key}`} className={selectClass} value={region[level.key] ?? ''}
                        disabled={i > 0 && !parents[i]} onChange={(e) => set(i, e.target.value)}>
                        <option value="">Choose…</option>
                        {(options[level.key] ?? []).map((o) => <option key={o.code} value={o.code}>{o.name}</option>)}
                    </select>
                </div>
            ))}
        </div>
    );
}
