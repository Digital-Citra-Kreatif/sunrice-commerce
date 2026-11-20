/**
 * Weights are stored in grams and sizes in millimetres; the store's units
 * (Settings → General → Weight unit / Dimension unit) are only how they are
 * shown and typed. Changing a unit converts nothing: the same values show in it.
 */
export type WeightUnit = 'g' | 'kg';
export type DimensionUnit = 'mm' | 'cm' | 'm';
export type Unit = WeightUnit | DimensionUnit;

/** Stored units (grams, millimetres) in one of each. */
export const FACTORS: Record<Unit, number> = { g: 1, kg: 1000, mm: 1, cm: 10, m: 1000 };

let units: { weight: WeightUnit; dimension: DimensionUnit } = { weight: 'g', dimension: 'mm' };

export function setUnits(next?: Partial<{ weight: string; dimension: string }>): void {
    units = {
        weight: next?.weight === 'kg' ? 'kg' : next?.weight === 'g' ? 'g' : units.weight,
        dimension: next?.dimension === 'cm' || next?.dimension === 'm' || next?.dimension === 'mm' ? next.dimension : units.dimension,
    };
}

export const weightUnit = (): WeightUnit => units.weight;
export const dimensionUnit = (): DimensionUnit => units.dimension;

/** A stored value as it shows in `unit` (no float noise: 0.25, not 0.25000000000000006). */
export function toUnit(stored: number | null, unit: Unit): string {
    if (stored === null) return '';

    return String(Number((stored / FACTORS[unit]).toFixed(6)));
}

/** What was typed in `unit`, stored (whole grams or millimetres); null when empty or not a number. */
export function fromUnit(text: string, unit: Unit): number | null {
    const trimmed = text.trim().replace(',', '.');
    if (trimmed === '') return null;
    const n = Number(trimmed);

    return Number.isFinite(n) ? Math.max(0, Math.round(n * FACTORS[unit])) : null;
}
