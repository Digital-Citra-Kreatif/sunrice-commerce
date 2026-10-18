/** Store currency format (Settings → Store → General). */
export interface MoneyFormat {
    symbol: string;
    position: 'left' | 'right';
    space: boolean;
    thousands: string;
    decimal: string;
    decimals: number;
}

export const defaultFormat: MoneyFormat = { symbol: 'Rp', position: 'left', space: false, thousands: '.', decimal: ',', decimals: 0 };

let current: MoneyFormat = defaultFormat;

/** Set from the page props of commerce pages. */
export function setMoneyFormat(format: Partial<MoneyFormat> | undefined): void {
    current = { ...defaultFormat, ...(format ?? {}) };
}

/** 150000 (minor units) → "Rp150.000". */
export function formatMoney(amount: number, format: MoneyFormat = current): string {
    const negative = amount < 0;
    const minor = Math.abs(Math.round(amount));
    const factor = 10 ** format.decimals;
    const whole = Math.floor(minor / factor).toString().replace(/\B(?=(\d{3})+(?!\d))/g, format.thousands);
    const fraction = format.decimals > 0 ? format.decimal + String(minor % factor).padStart(format.decimals, '0') : '';
    const number = whole + fraction;
    const gap = format.space ? ' ' : '';
    const text = format.position === 'left' ? `${format.symbol}${gap}${number}` : `${number}${gap}${format.symbol}`;

    return negative ? `-${text}` : text;
}

/** "Rp150.000" / "150.000" / "150000" → 150000 (minor units); null when it isn't a number. */
export function parseMoney(text: string, format: MoneyFormat = current): number | null {
    let clean = text.replace(format.symbol, '').replace(/\s/g, '');
    const negative = clean.startsWith('-');
    clean = clean.replace(/^-/, '').split(format.thousands).join('');
    const [whole, fraction = ''] = clean.split(format.decimal);
    if (!/^\d*$/.test(whole) || !/^\d*$/.test(fraction) || whole + fraction === '') {
        return null;
    }
    const minor = Number(whole || '0') * 10 ** format.decimals + Number(fraction.padEnd(format.decimals, '0').slice(0, format.decimals) || '0');

    return negative ? -minor : minor;
}
