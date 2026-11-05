import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { transformSync } from 'esbuild';

const load = async (path) => {
    const ts = readFileSync(new URL(`../../resources/js/admin/lib/${path}`, import.meta.url), 'utf8');
    const { code } = transformSync(ts, { loader: 'ts', format: 'esm' });

    return import(`data:text/javascript,${encodeURIComponent(code)}`);
};
const { tableQuery, cellText } = await load('table.ts');
const { optionsOf, errorsUnder, numberValue } = await load('fields.ts');

const meta = { search: 'mug', sort: 'code', direction: 'asc', filters: { kind: 'code', empty: '' }, perPage: 25 };

test('writes a list\'s query as TableQuery reads it', () => {
    assert.deepEqual(tableQuery(meta), { search: 'mug', filters: { kind: 'code' }, sort: 'code', per_page: 25 });
    assert.deepEqual(tableQuery(meta, { direction: 'desc', page: 3 }), { search: 'mug', filters: { kind: 'code' }, sort: '-code', per_page: 25, page: 3 });
    // A new search or filter starts at the first page.
    assert.deepEqual(tableQuery({ ...meta, search: null, sort: null, filters: {} }, { page: 1 }), { per_page: 25 });
});

test('shows empty cells as a dash and booleans as words', () => {
    assert.equal(cellText(null), '—');
    assert.equal(cellText(''), '—');
    assert.equal(cellText(true), 'Yes');
    assert.equal(cellText(0), '0');
});

test('reads select options as strings or value and label', () => {
    assert.deepEqual(optionsOf({ handle: 'x', type: 'select', config: { options: ['a', { value: 1, label: 'One' }] } }),
        [{ value: 'a', label: 'a' }, { value: '1', label: 'One' }]);
    assert.deepEqual(optionsOf({ handle: 'x', type: 'select' }), []);
});

test('gives an input the errors under its path, its own as \'\'', () => {
    const errors = { 'values.price': 'Required.', 'values.price.min': 'Too low.', 'values.prices': 'Other.' };
    assert.deepEqual(errorsUnder(errors, 'values.price'), { '': 'Required.', min: 'Too low.' });
});

test('reads number inputs as numbers, empty as null', () => {
    assert.equal(numberValue(''), null);
    assert.equal(numberValue(' 12.5 '), 12.5);
    assert.equal(numberValue('abc'), null);
});
