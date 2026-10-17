import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// The money helpers are plain functions: load them without a bundler.
const source = readFileSync(new URL('../../resources/js/admin/lib/money.ts', import.meta.url), 'utf8')
    .replace(/export interface[\s\S]*?\n}\n/, '')
    .replace(/: MoneyFormat \| undefined|: Partial<MoneyFormat> \| undefined|: MoneyFormat = current|: MoneyFormat = defaultFormat|: MoneyFormat|: number \| null|: number|: string|: void/g, '')
    .replace(/export /g, '');
const { formatMoney, parseMoney } = new Function(`${source}; return { formatMoney, parseMoney };`)();

const idr = { symbol: 'Rp', position: 'left', space: false, thousands: '.', decimal: ',', decimals: 0 };
const usd = { symbol: '$', position: 'left', space: false, thousands: ',', decimal: '.', decimals: 2 };

test('formats rupiah and two-decimal currencies', () => {
    assert.equal(formatMoney(150000, idr), 'Rp150.000');
    assert.equal(formatMoney(-2500, idr), '-Rp2.500');
    assert.equal(formatMoney(123456, usd), '$1,234.56');
    assert.equal(formatMoney(5, usd), '$0.05');
});

test('parses what it formats', () => {
    assert.equal(parseMoney('Rp150.000', idr), 150000);
    assert.equal(parseMoney('150000', idr), 150000);
    assert.equal(parseMoney('$1,234.56', usd), 123456);
    assert.equal(parseMoney('abc', idr), null);
});
