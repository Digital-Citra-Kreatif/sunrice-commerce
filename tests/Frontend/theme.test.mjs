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

test('lists the first lines in the drawer, then "and X more" to the cart page', () => {
    const js = readFileSync(new URL('../../stubs/theme/commerce.js', import.meta.url), 'utf8');
    assert.match(js, /'lines=' \+ shown/);
    assert.match(js, /\.slice\(0, shown\)/);
    assert.match(js, /cart\.line_count \|\| 0\) - list\.children\.length/);
    assert.match(js, /commerceDrawerMore[^;]*\.replace\(':count', more\)/);
    assert.match(css, /\.commerce-drawer__more \{/);
    assert.match(css, /\.commerce-summary__more summary \{/);
});

test('starter theme: drawers keep focus inside and close with Escape', () => {
    const js = readFileSync(new URL('../../stubs/theme/commerce.js', import.meta.url), 'utf8');
    assert.match(js, /function panel\(el, opener, backdropClass\)/);
    assert.match(js, /event\.key === 'Escape'\) \{ close\(\); return; \}/);
    assert.match(js, /event\.key !== 'Tab'/);
    assert.match(js, /opener\.setAttribute\('aria-expanded', 'true'\)/);
    assert.match(js, /\[data-commerce-nav-toggle\]/);
    assert.match(js, /\[data-commerce-filters-open\]/);
    // Without JavaScript the filter button stays hidden and the form is shown in the page.
    assert.match(js, /button\.hidden = false/);
    assert.match(css, /\.js \.commerce-listing__filters \{[^}]*position: fixed/);
    assert.match(css, /\.js \.commerce-nav \{[^}]*transform: translateX\(-100%\)/);
});

test('starter theme: quantity steppers respect min, max and step, and the cart saves itself', () => {
    const js = readFileSync(new URL('../../stubs/theme/commerce.js', import.meta.url), 'utf8');
    assert.match(js, /\[data-commerce-stepper\]/);
    assert.match(js, /Math\.min\(max, Math\.max\(min, \(parseFloat\(input\.value\) \|\| 0\) \+ pair\[1\] \* step\)\)/);
    assert.match(js, /data-commerce-autosubmit/);
    assert.match(css, /\.commerce-stepper__button \{/);
});

test('starter theme: the gallery thumbnails follow the swipeable images on phones', () => {
    const js = readFileSync(new URL('../../stubs/theme/commerce.js', import.meta.url), 'utf8');
    assert.match(js, /\[data-commerce-thumb\]/);
    assert.match(js, /Math\.round\(main\.scrollLeft \/ main\.clientWidth\)/);
    const block = mediaBlock('(max-width: 899px)');
    assert.match(block, /scroll-snap-type: x mandatory/);
});

test('starter theme: colours and the font are design tokens', () => {
    for (const token of ['--commerce-fg', '--commerce-accent', '--commerce-surface', '--commerce-line', '--commerce-radius', '--commerce-font']) {
        assert.match(css, new RegExp(`${token}: [^;]+;`));
    }
});
