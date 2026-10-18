import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// The storefront theme (stubs/theme/commerce.css) is plain CSS: check its rules as text.
const css = readFileSync(new URL('../../stubs/theme/commerce.css', import.meta.url), 'utf8');

function mediaBlock(query) {
    const start = css.indexOf(`@media ${query} {`);
    assert.notEqual(start, -1, `no @media ${query} block`);
    let depth = 0;
    for (let i = css.indexOf('{', start); i < css.length; i++) {
        depth += css[i] === '{' ? 1 : css[i] === '}' ? -1 : 0;
        if (depth === 0) return css.slice(start, i + 1);
    }
    return css.slice(start);
}

test('stacks cart lines on narrow screens instead of a five-column row wider than a phone', () => {
    const block = mediaBlock('(max-width: 600px)');
    assert.match(block, /\.commerce-cart__lines tr \{[^}]*display: grid/);
    assert.match(block, /grid-template-areas: "product product" "price total" "qty remove"/);
    assert.match(block, /\.commerce-cart__product \{[^}]*overflow-wrap: anywhere/);
    for (const area of ['product', 'price', 'total', 'qty', 'remove']) {
        assert.match(block, new RegExp(`grid-area: ${area};`));
    }
});

test('scrolls a long cart inside the drawer, keeping its buttons in view', () => {
    assert.match(css, /\.commerce-drawer\[open\] \{[^}]*display: flex;[^}]*flex-direction: column/);
    assert.match(css, /\.commerce-drawer__body \{[^}]*min-height: 0;[^}]*overflow-y: auto/);
    assert.match(css, /\.commerce-drawer \{[^}]*max-width: 100vw;[^}]*box-sizing: border-box/);
});
