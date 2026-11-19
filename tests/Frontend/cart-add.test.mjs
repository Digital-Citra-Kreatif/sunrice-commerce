import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const theme = readFileSync(new URL('../../stubs/theme/commerce.js', import.meta.url), 'utf8');

function storefront(deliver) {
    const submitHandlers = [];
    let posts = 0;
    let formPosts = 0;
    const notices = [];
    const counter = { textContent: '', hidden: true };
    const button = {
        attributes: new Map(),
        setAttribute(name, value) { this.attributes.set(name, value); },
        removeAttribute(name) { this.attributes.delete(name); },
    };
    const link = { focused: false, focus() { this.focused = true; } };
    const recovery = { hidden: true, querySelector: () => link };
    const cartAction = {
        href: '/cart',
        label: 'View cart',
        cloneNode() { return { href: this.href, label: this.label }; },
    };
    const controls = {
        '[data-commerce-add-recovery]': recovery,
        '[data-commerce-add-success-action]': { content: { firstElementChild: cartAction } },
        'button[type=submit]': button,
    };
    const form = {
        dataset: { commerceCartApi: '/commerce/api/cart/items' },
        closest: (selector) => selector === '[data-commerce-add]' ? form : null,
        contains: (node) => node === button,
        querySelector: (selector) => controls[selector] ?? null,
        after: (notice) => notices.push(notice),
        submit: () => { formPosts++; },
    };

    runInNewContext(theme, {
        document: {
            activeElement: button,
            addEventListener: (event, handler) => { if (event === 'submit') submitHandlers.push(handler); },
            querySelector: () => null,
            querySelectorAll: (selector) => selector === '[data-commerce-cart-count]' ? [counter] : [],
            createElement: () => ({
                setAttribute(name, value) { this[name] = value; },
                classList: { add() {} },
                append(...children) { this.children = children; },
                addEventListener() {},
            }),
            body: { appendChild: (notice) => notices.push(notice) },
            dispatchEvent() {},
            documentElement: { classList: { add() {} } },
        },
        fetch: async (_url, options) => {
            assert.equal(options.method, 'POST');
            posts++;
            return deliver();
        },
        window: {},
        FormData: class {},
        CustomEvent: class {},
        AbortSignal,
        setTimeout() {},
        clearTimeout() {},
    });

    const submit = () => {
        let prevented = false;
        submitHandlers.forEach((handler) => handler({ target: form, submitter: button, preventDefault: () => { prevented = true; } }));
        return prevented;
    };
    return { submit, counts: () => [posts, formPosts], button, link, recovery, counter, notices };
}

const settle = () => new Promise((resolve) => setImmediate(resolve));

test('a lost response after adding an item reveals cart recovery without posting again', async () => {
    let quantity = 0;
    const page = storefront(() => {
        quantity++;
        throw new TypeError('Connection lost');
    });

    assert.equal(page.submit(), true);
    assert.equal(page.submit(), true);
    await settle();

    assert.deepEqual(page.counts(), [1, 0]);
    assert.equal(quantity, 1);
    assert.equal(page.recovery.hidden, false);
    assert.equal(page.link.focused, true);
    assert.equal(page.button.attributes.get('aria-disabled'), 'true');
    assert.equal(page.submit(), true);
    assert.deepEqual(page.counts(), [1, 0]);
});

test('an ambiguous server or parsing error keeps the form blocked and points to the cart', async () => {
    for (const response of [
        new Response('{ "message": "Server error" }', { status: 503 }),
        new Response('unexpected markup'),
        Response.json({ message: 'OK' }),
    ]) {
        const page = storefront(() => response);
        page.submit();
        await settle();
        assert.equal(page.recovery.hidden, false);
        page.submit();
        assert.deepEqual(page.counts(), [1, 0]);
    }
});

test('a confirmed refusal allows correction and a later confirmed success updates the cart', async () => {
    const responses = [
        Response.json({ message: 'Quantity unavailable' }, { status: 422 }),
        Response.json({ cart: { count: 1 }, message: 'Added' }),
    ];
    const page = storefront(() => responses.shift());

    page.submit();
    await settle();
    assert.equal(page.notices[0].textContent, 'Quantity unavailable');
    assert.equal(page.notices[0].children, undefined);
    assert.equal(page.button.attributes.has('aria-disabled'), false);
    assert.equal(page.recovery.hidden, true);

    page.submit();
    await settle();
    assert.deepEqual(page.counts(), [2, 0]);
    assert.equal(page.counter.textContent, 1);
    assert.equal(page.counter.hidden, false);
    const [message, cart] = page.notices[1].children;
    assert.equal(message.textContent, 'Added');
    assert.equal(message.role, 'status');
    assert.equal(cart.href, '/cart');
    assert.equal(cart.label, 'View cart');
});
