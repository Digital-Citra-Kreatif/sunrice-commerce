import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const theme = readFileSync(new URL('../../stubs/theme/commerce.js', import.meta.url), 'utf8');
const settle = () => new Promise((resolve) => setImmediate(resolve));

test('waits one second and shows only the current product count and a link when there are matches', async () => {
    const inputEvents = new Map();
    const formEvents = new Map();
    const input = { value: '', addEventListener: (type, handler) => inputEvents.set(type, handler) };
    const panel = { hidden: true };
    const count = {};
    const link = { hidden: true };
    const fields = new Map([
        ['[name="q"]', input],
        ['[data-commerce-search-result]', panel],
        ['[data-commerce-search-count]', count],
        ['[data-commerce-search-link]', link],
    ]);
    const form = {
        action: 'https://store.test/en/products',
        dataset: { commerceProductSearch: '/en/commerce/api/product-search/count' },
        querySelector: (selector) => fields.get(selector),
        addEventListener: (type, handler) => formEvents.set(type, handler),
    };
    const requests = [];
    const timers = new Map();
    let timerId = 0;
    runInNewContext(theme, {
        document: {
            querySelector: () => null,
            querySelectorAll: (selector) => selector === '[data-commerce-product-search]' ? [form] : [],
            addEventListener() {},
            documentElement: { classList: { add() {} } },
        },
        window: { addEventListener() {} },
        URL,
        AbortController,
        setTimeout(callback, delay) { timers.set(++timerId, { callback, delay }); return timerId; },
        clearTimeout(id) { timers.delete(id); },
        fetch(url, { signal }) {
            return new Promise((resolve) => requests.push({ url, signal, respond: (data) => resolve({ ok: true, json: async () => data }) }));
        },
    });

    const type = (query) => { input.value = query; inputEvents.get('input')({}); };
    const runTimer = () => {
        assert.equal(timers.size, 1);
        const [{ callback, delay }] = timers.values();
        assert.equal(delay, 1000);
        timers.clear();
        callback();
    };

    type('m');
    type('mu');
    assert.equal(requests.length, 0);
    runTimer();
    assert.equal(requests[0].url.searchParams.get('q'), 'mu');

    type('mug & cup');
    assert.equal(requests[0].signal.aborted, true);
    runTimer();
    requests[1].respond({ count: 2, message: '2 products found' });
    await settle();
    assert.equal(count.textContent, '2 products found');
    assert.equal(panel.hidden, false);
    assert.equal(link.hidden, false);
    assert.equal(new URL(link.href).searchParams.get('q'), 'mug & cup');
    assert.equal(new URL(link.href).pathname, '/en/products');

    requests[0].respond({ count: 0, message: 'Outdated result' });
    await settle();
    assert.equal(count.textContent, '2 products found');

    type('missing');
    runTimer();
    requests[2].respond({ count: 0, message: 'No products found' });
    await settle();
    assert.equal(count.textContent, 'No products found');
    assert.equal(link.hidden, true);
    formEvents.get('keydown')({ key: 'Escape' });
    assert.equal(panel.hidden, true);
    type('  ');
    assert.equal(timers.size, 0);
});
