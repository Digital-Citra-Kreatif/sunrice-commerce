import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const theme = readFileSync(new URL('../../stubs/theme/commerce.js', import.meta.url), 'utf8');
const partial = readFileSync(new URL('../../resources/views/storefront/partials/address-fields.blade.php', import.meta.url), 'utf8');
const addressScript = partial.match(/<script>([\s\S]*?)<\/script>/)[1];

class Option {
    constructor(text, value, _defaultSelected = false, selected = false) {
        Object.assign(this, { text, value, selected, dataset: {} });
    }
}

function field(name, { options, value = '', level } = {}) {
    const events = new Map();
    return {
        name: `shipping_address[${name}]`,
        value,
        ...(options ? { options, tagName: 'SELECT' } : {}),
        dataset: level ? { commerceRegion: level, value } : {},
        addEventListener(type, listener) { events.set(type, listener); },
        dispatchEvent(event) { return events.get(event.type)?.(event); },
        hasAttribute(key) { return key === 'data-commerce-region' && !!level; },
        set length(length) { this.options.length = length; this.value = this.options[0].value; },
        get selectedOptions() { return this.options.filter((option) => option.value === this.value); },
        add(option) { this.options.push(option); if (option.selected) this.value = option.value; },
    };
}

function storefront() {
    const fields = {
        country: field('country', { value: 'ID', options: [new Option('Indonesia', 'ID'), new Option('Singapore', 'SG')] }),
        province_code: field('province_code', { level: 'province', value: '31', options: [new Option('Select', ''), new Option('Jakarta', '31')] }),
        city_code: field('city_code', { level: 'city', value: '31.74', options: [new Option('Select', ''), new Option('South Jakarta', '31.74')] }),
        district_code: field('district_code', { level: 'district', value: '31.74.01', options: [new Option('Select', ''), new Option('District one', '31.74.01')] }),
        city: field('city'),
        state: field('state'),
        line1: field('line1', { value: 'Old street' }),
        line2: field('line2', { value: 'Old apartment' }),
        postal_code: field('postal_code', { value: '12345' }),
        notes: field('notes', { value: 'Old delivery note' }),
    };
    const levels = [fields.province_code, fields.city_code, fields.district_code];
    const domesticLabels = levels.map(() => ({ hidden: false }));
    const abroadLabels = [fields.city, fields.state].map((input) => ({ querySelector: () => input }));
    const requests = [];
    const addressBox = {
        dataset: { api: '/regions' },
        querySelector: (selector) => selector === '[data-commerce-country]' ? fields.country : fields.postal_code,
        querySelectorAll(selector) {
            if (selector === '[data-commerce-region]') return levels;
            if (selector === '[data-commerce-region-level]') return domesticLabels;
            if (selector === '[data-commerce-abroad]') return abroadLabels;
            return [];
        },
    };
    const form = {
        closest: () => null,
        addEventListener(type, callback) { if (type === 'change') this.change = callback; },
        querySelector: (selector) => selector === '[name="shipping_address[country]"]' ? fields.country : null,
        querySelectorAll: (selector) => selector === '[name^="shipping_address["]' ? Object.values(fields) : [],
    };
    const context = {
        document: {
            addEventListener() {},
            querySelector: () => null,
            querySelectorAll(selector) {
                if (selector === '[data-commerce-address]') return [addressBox];
                if (selector === '[data-commerce-checkout]') return [form];
                return [];
            },
            documentElement: { classList: { add() {} } },
        },
        window: { addEventListener() {} },
        Option,
        Event,
        clearTimeout() {},
        setTimeout() {},
        fetch(url) {
            return new Promise((resolve) => requests.push({
                url,
                respond(data) { resolve({ json: () => Promise.resolve({ data }) }); },
            }));
        },
    };

    runInNewContext(theme, context);
    runInNewContext(addressScript, context);

    return {
        fields, levels, domesticLabels, abroadLabels, requests,
        choose(address) {
            form.change({
                target: {
                    matches: (selector) => selector === '[data-commerce-saved-address]',
                    selectedOptions: [{ dataset: { address: JSON.stringify(address) } }],
                },
            });
        },
    };
}

const settle = () => new Promise((resolve) => setImmediate(resolve));

test('switching to a sparse overseas address clears old optional fields and shows overseas controls', async () => {
    const page = storefront();
    const staleProvinces = page.requests[0];

    page.choose({ country: 'SG', city: 'Singapore', state: 'Central', line1: 'New street', line2: null });

    assert.deepEqual(
        [page.fields.line1.value, page.fields.line2.value, page.fields.postal_code.value, page.fields.notes.value],
        ['New street', '', '', ''],
    );
    assert.equal(page.fields.city.value, 'Singapore');
    assert.equal(page.fields.city.disabled, false);
    assert.ok(page.abroadLabels.every((label) => !label.hidden));
    assert.ok(page.domesticLabels.every((label) => label.hidden));
    assert.ok(page.levels.every((level) => level.disabled && level.value === ''));

    staleProvinces.respond([{ code: '31', name: 'Jakarta' }]);
    await settle();
    assert.equal(page.requests.length, 1);
    assert.ok(page.levels.every((level) => level.disabled && level.options.length === 1));
});

test('switching domestic addresses uses region codes and ignores an old request for the previous city chain', async () => {
    const page = storefront();
    const provinces = [{ code: '31', name: 'Jakarta' }, { code: '32', name: 'West Java' }];
    page.requests[0].respond(provinces);
    await settle();
    const staleCities = page.requests[1];
    assert.equal(staleCities.url, '/regions?parent=31');

    page.choose({
        country: 'ID', province_code: '32', province: 'West Java', city_code: '32.73', city: 'Bandung',
        district_code: '32.73.01', district: 'Sukasari', line1: 'New street', notes: null,
    });

    assert.deepEqual(page.levels.map((level) => level.value), ['32', '32.73', '32.73.01']);
    assert.deepEqual(page.levels.map((level) => level.selectedOptions[0].text), ['West Java', 'Bandung', 'Sukasari']);
    assert.ok(page.levels.every((level) => !level.disabled));
    assert.ok(page.abroadLabels.every((label) => label.hidden));
    assert.ok(page.domesticLabels.every((label) => !label.hidden));
    assert.equal(page.fields.city.disabled, true);

    page.requests[2].respond(provinces);
    await settle();
    assert.equal(page.requests[3].url, '/regions?parent=32');
    page.requests[3].respond([{ code: '32.73', name: 'Bandung' }]);
    staleCities.respond([{ code: '31.74', name: 'South Jakarta' }]);
    await settle();
    assert.equal(page.requests[4].url, '/regions?parent=32.73');
    page.requests[4].respond([{ code: '32.73.01', name: 'Sukasari' }]);
    await settle();

    assert.deepEqual(page.levels.map((level) => level.value), ['32', '32.73', '32.73.01']);
    assert.deepEqual(page.fields.city_code.options.map((option) => option.value), ['', '32.73']);
    assert.equal(page.fields.notes.value, '');
});
