import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const theme = readFileSync(new URL('../../stubs/theme/commerce.js', import.meta.url), 'utf8');

test('checkout reveals the payment step and confirms the auto-selected fee before submitting', async () => {
    const listeners = new Map();
    const requests = [];
    const step = { hidden: true };
    const payment = { hidden: true };
    const hash = { value: 'free' };
    const button = { setAttribute(_name, value) { this.disabled = value === 'true'; } };
    const methods = {
        outerHTML: 'empty',
        contains: () => false,
        querySelector: () => null,
    };
    const elements = {
        '[data-commerce-payment-section]': payment,
        '[data-commerce-hash]': hash,
        '[data-commerce-captcha]': { dataset: { commerceCaptcha: 'cf-turnstile-response' } },
        '[data-commerce-payments]': methods,
        'button[name=action][value=place]': button,
    };
    const selectedMethod = () => methods.outerHTML === 'transfer' ? { value: 'transfer' } : null;
    const form = {
        dataset: { refresh: '/checkout/refresh' },
        closest: () => ({ querySelector: () => step }),
        querySelectorAll: () => [],
        querySelector: (selector) => selector.endsWith(':checked') && selector.includes('payment_method')
            ? selectedMethod()
            : elements[selector],
        addEventListener: (name, listener) => listeners.set(name, listener),
    };
    runInNewContext(theme, {
        document: {
            addEventListener() {},
            querySelector: () => null,
            querySelectorAll: (selector) => selector === '[data-commerce-checkout]' ? [form] : [],
            documentElement: { classList: { add() {} } },
        },
        window: { addEventListener() {} },
        setTimeout, clearTimeout, AbortSignal,
        FormData: class {
            constructor() {
                this.values = new Map([['password', 'private'], ['cf-turnstile-response', 'checkout-token']]);
                const selected = selectedMethod();
                if (selected) this.values.set('payment_method', selected.value);
            }
            get(key) { return this.values.get(key) ?? null; }
            set(key, value) { this.values.set(key, value); }
            delete(key) { this.values.delete(key); }
        },
        fetch: (_url, { body }) => new Promise((resolve) => requests.push({ body, resolve })),
    });
    const refresh = () => listeners.get('change')({ target: { name: 'shipping_rate', matches: () => false } });
    const reply = (request, amount, label, html) => request.resolve({
        ok: true, json: async () => ({ totals: { total: { amount } }, hash: label, payments_html: html }),
    });
    const waitFor = async (count) => {
        const deadline = Date.now() + 3000;
        while (requests.length < count && Date.now() < deadline) {
            await new Promise((resolve) => setTimeout(resolve, 10));
        }
        assert.equal(requests.length, count);
    };
    const settle = () => new Promise((resolve) => setImmediate(resolve));

    refresh();
    await waitFor(1);
    assert.equal(requests[0].body.get('_form'), 'checkout');
    assert.equal(requests[0].body.get('password'), null);
    assert.equal(requests[0].body.get('cf-turnstile-response'), null);
    assert.equal(requests[0].body.get('payment_method'), null);
    reply(requests[0], 10000, 'shipping-only', 'transfer');

    await waitFor(2);
    assert.equal(payment.hidden, false);
    assert.equal(step.hidden, false);
    assert.equal(requests[1].body.get('payment_method'), 'transfer');
    assert.equal(button.disabled, true);
    assert.equal(hash.value, 'free');

    reply(requests[1], 12000, 'shipping-and-fee', 'transfer');
    await settle();
    assert.equal(button.disabled, false);
    assert.equal(hash.value, 'shipping-and-fee');

    refresh();
    await waitFor(3);
    reply(requests[2], 0, 'free-again', 'empty');
    await settle();
    assert.equal(payment.hidden, true);
    assert.equal(step.hidden, true);
    assert.equal(hash.value, 'free-again');
});
