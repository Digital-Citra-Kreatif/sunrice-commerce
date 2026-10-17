import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { transformSync } from 'esbuild';

// Compile the TypeScript module and load it from a data URL.
const ts = readFileSync(new URL('../../resources/js/admin/lib/variants.ts', import.meta.url), 'utf8');
const { code } = transformSync(ts, { loader: 'ts', format: 'esm' });
const { combinations, generateVariants, matchVariant, comboKey, variantTitle } = await import(`data:text/javascript,${encodeURIComponent(code)}`);

const options = [
    { id: 'size', name: 'Size', taxonomy: null, values: [{ id: 's', label: 'S' }, { id: 'm', label: 'M' }] },
    { id: 'color', name: 'Color', taxonomy: 'colors', values: [{ id: 'red', term_id: 7 }, { id: 'blue', label: 'Blue' }] },
];

test('builds every combination in option order', () => {
    assert.deepEqual(combinations(options), [
        { size: 's', color: 'red' }, { size: 's', color: 'blue' }, { size: 'm', color: 'red' }, { size: 'm', color: 'blue' },
    ]);
    assert.deepEqual(combinations([]), []);
    assert.deepEqual(combinations([{ id: 'x', name: 'X', taxonomy: null, values: [] }]), []);
});

test('keeps existing variants and adds new ones from the template', () => {
    const existing = [{ id: 'keep', options: { color: 'red', size: 's' }, sku: 'A', price: 5, active: false }];
    const variants = generateVariants(options, existing, { price: 9, track_stock: true });
    assert.equal(variants.length, 4);
    assert.equal(variants[0].id, 'keep');
    assert.equal(variants[0].sku, 'A');
    assert.equal(variants[1].sku, null);
    assert.equal(variants[1].price, 9);
    assert.equal(variants[1].track_stock, true);
    assert.equal(variants[1].id.length, 32);
    assert.equal(generateVariants(options, [], {}, 3).length, 3);
});

test('matches a selection and names a variant', () => {
    const variants = generateVariants(options, [], { price: 1 });
    assert.equal(matchVariant(variants, { color: 'blue', size: 'm' }), variants[3]);
    assert.equal(matchVariant(variants, { size: 'm' }), null);
    assert.equal(comboKey({ b: '2', a: '1' }), 'a=1|b=2');
    assert.equal(variantTitle(options, variants[0], { 7: 'Merah' }), 'S / Merah');
});
