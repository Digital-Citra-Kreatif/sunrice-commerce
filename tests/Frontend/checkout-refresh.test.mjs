import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const theme = readFileSync(new URL('../../stubs/theme/commerce.js', import.meta.url), 'utf8');

test('checkout reveals the payment step and confirms the auto-selected fee before submitting', async () => {
    const listeners = new Map();
    const requests = [];
    let reloads = 0;
    const step = { hidden: true };
    const payment = { hidden: true };
    const hash = { value: 'free' };
    const update = { hidden: false };
    const voucherCode = { value: 'HEMAT' };
    const label = { textContent: 'Place order' };
    const status = { dataset: {}, textContent: '' };
    const button = {
        name: 'action', value: 'place', dataset: { processingLabel: 'Placing your order…' },
        querySelector: () => label,
        setAttribute(_name, value) { this.ariaDisabled = value === 'true'; },
    };
    const methods = {
        outerHTML: 'empty',
        contains: () => false,
        querySelector: () => null,
    };
    const elements = {
        '[data-commerce-payment-section]': payment,
        '[data-commerce-hash]': hash,
        '[data-commerce-update]': update,
        '[data-commerce-checkout-status]': status,
        '[data-commerce-captcha]': { dataset: { commerceCaptcha: 'cf-turnstile-response' } },
        '[data-commerce-payments]': methods,
        'button[name=action][value=place]': button,
    };
    const selectedMethod = () => methods.outerHTML === 'transfer' ? { value: 'transfer' } : null;
    const form = {
        dataset: { refresh: '/checkout/refresh' },
        elements: { namedItem: () => voucherCode },
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
        window: {
            location: { reload() { reloads++; } },
            addEventListener: (name, listener) => listeners.set(name, listener),
        },
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
        fetch: (url, { body }) => new Promise((resolve) => requests.push({ url, body, resolve })),
    });
    const refresh = () => listeners.get('change')({ target: { name: 'shipping_rate', matches: () => false } });
    const reply = (request, amount, label, html, method) => request.resolve({
        ok: true, json: async () => ({ totals: { total: { amount } }, hash: label, payments_html: html, selected_payment_method: method }),
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
    assert.equal(button.ariaDisabled, true);
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
    assert.equal(update.hidden, true);

    refresh();
    await waitFor(4);
    reply(requests[3], 12000, 'server-priced-default', 'transfer', 'transfer');
    await settle();
    assert.equal(hash.value, 'server-priced-default');
    assert.equal(button.disabled, false);
    assert.equal(requests.length, 4);

    const submit = (submitter) => {
        let prevented = false;
        listeners.get('submit')({ submitter, preventDefault() { prevented = true; } });
        return prevented;
    };
    refresh();
    await waitFor(5);
    assert.equal(submit({
        name: 'apply_voucher',
        value: '1',
        formAction: '/checkout/voucher',
        hasAttribute: (attribute) => attribute === 'data-commerce-voucher-submit',
    }), true);
    voucherCode.value = 'OTHER';
    reply(requests[4], 0, 'old', 'empty');
    await waitFor(6);
    assert.equal(requests[5].url, '/checkout/voucher');
    assert.equal(requests[5].body.get('apply_voucher'), '1');
    assert.equal(requests[5].body.get('voucher_code'), 'HEMAT');
    assert.equal(requests[5].body.get('password'), null);
    assert.equal(requests[5].body.get('cf-turnstile-response'), null);

    requests[5].resolve({ ok: false });
    await settle();
    assert.equal(update.hidden, false);
    assert.equal(submit(button), true);
    assert.equal(submit(update), false);

    refresh();
    await waitFor(7);
    reply(requests[6], 12000, 'ready', 'transfer', 'transfer');
    await settle();
    assert.equal(submit(button), false);
    assert.equal(button.disabled, true);
    assert.equal(label.textContent, 'Placing your order…');
    assert.equal(status.textContent, '');
    const formData = new Map();
    listeners.get('formdata')({ formData });
    assert.equal(formData.get('action'), 'place');
    assert.equal(submit(button), true);
    listeners.get('pageshow')({ persisted: false });
    assert.equal(reloads, 0);
    listeners.get('pageshow')({ persisted: true });
    assert.equal(reloads, 1);
});
