import { React, fetchJson, ui } from '../lib/sunrice';
import type { FieldProps } from '../sunrice';
import { SELECT_NONE } from '../lib/fields';

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

/** commerce_region: country, then province → city → district (→ village) in Indonesia. */
export default function RegionField({ field, value, onChange, id }: FieldProps<Partial<Region> | null>) {
    const { Label, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } = ui;
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
        <div className="cm:grid cm:gap-x-5 cm:gap-y-4 cm:sm:grid-cols-2">
            {countries.length > 0 && (
                <div className="cm:grid cm:gap-1.5">
                    <Label htmlFor={`${id}-country`}>Country</Label>
                    <Select value={region.country}
                        onValueChange={(country: string) => onChange({ country, province_code: null, city_code: null, district_code: null, village_code: null })}>
                        <SelectTrigger id={`${id}-country`} className="cm:w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {countries.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            )}
            {region.country === 'ID' && levels.map((level, i) => (
                <div key={level.key} className="cm:grid cm:gap-1.5">
                    <Label htmlFor={`${id}-${level.key}`}>{level.label}</Label>
                    <Select value={region[level.key] ?? SELECT_NONE} disabled={i > 0 && !parents[i]}
                        onValueChange={(code: string) => set(i, code === SELECT_NONE ? '' : code)}>
                        <SelectTrigger id={`${id}-${level.key}`} className="cm:w-full"><SelectValue placeholder="Choose…" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value={SELECT_NONE}>Choose…</SelectItem>
                            {(options[level.key] ?? []).map((o) => <SelectItem key={o.code} value={o.code}>{o.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            ))}
        </div>
    );
}
