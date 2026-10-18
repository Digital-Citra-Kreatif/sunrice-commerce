import { test } from 'node:test';
import assert from 'node:assert/strict';

// Plain TypeScript (erasable types only): Node strips the types itself.
const { audienceComplete, defaultValue, groupRules, insertTag, rate, unknownTags } = await import('../../resources/js/admin/lib/marketing.ts');

const defs = {
    no_order_for_days: { label: 'No order for', group: 'Orders', input: 'days' },
    never_ordered: { label: 'Never ordered', group: 'Orders', input: 'none' },
    bought_product: { label: 'Bought', group: 'Orders', input: 'products' },
    language: { label: 'Language', group: 'Customer', input: 'select', options: [{ value: 'id', label: 'Bahasa' }] },
    city: { label: 'City', group: 'Customer', input: 'text' },
};

test('gives each kind of rule a starting value', () => {
    assert.equal(defaultValue(defs.no_order_for_days), 30);
    assert.equal(defaultValue(defs.never_ordered), null);
    assert.deepEqual(defaultValue(defs.bought_product), []);
    assert.equal(defaultValue(defs.language), 'id');
    assert.equal(defaultValue(undefined), null);
});

test('groups rules in their order', () => {
    assert.deepEqual(groupRules(defs).map(([group, rules]) => [group, rules.map(([key]) => key)]), [
        ['Orders', ['no_order_for_days', 'never_ordered', 'bought_product']],
        ['Customer', ['language', 'city']],
    ]);
});

test('knows when an audience is ready to count', () => {
    assert.equal(audienceComplete({ match: 'all', rules: [] }, defs), true);
    assert.equal(audienceComplete({ match: 'all', rules: [{ rule: 'never_ordered' }, { rule: 'no_order_for_days', value: 60 }] }, defs), true);
    assert.equal(audienceComplete({ match: 'all', rules: [{ rule: 'no_order_for_days', value: '' }] }, defs), false);
    assert.equal(audienceComplete({ match: 'all', rules: [{ rule: 'bought_product', value: [] }] }, defs), false);
    assert.equal(audienceComplete({ match: 'all', rules: [{ rule: 'city', value: '  ' }] }, defs), false);
    assert.equal(audienceComplete({ match: 'all', rules: [{ rule: 'nope' }] }, defs), false);
});

test('inserts smart tags at the cursor', () => {
    assert.deepEqual(insertTag('Hi !', 'first_name', 3, 3), { text: 'Hi {first_name}!', cursor: 15 });
    assert.deepEqual(insertTag('Hi you', 'name', 3, 6), { text: 'Hi {name}', cursor: 9 });
    assert.deepEqual(insertTag('Hi', 'name', null, null), { text: 'Hi{name}', cursor: 8 });
});

test('finds unknown smart tags', () => {
    assert.deepEqual(unknownTags('{first_name|there} {frist_name} {frist_name} {store_name}', ['first_name', 'store_name']), ['frist_name']);
});

test('formats rates', () => {
    assert.equal(rate(1, 3), '33.3%');
    assert.equal(rate(0, 0), '—');
});
