/*
 * Storefront enhancements for the commerce templates (published to
 * public/commerce-theme/commerce.js). Everything works without it; with
 * it, adding to the cart stays on the page and the mini cart updates.
 */
(function () {
    'use strict';

    function csrf() {
        var meta = document.querySelector('meta[name="csrf-token"]');
        if (meta) return meta.content;
        var input = document.querySelector('input[name="_token"]');
        return input ? input.value : '';
    }

    function updateMiniCart(cart) {
        document.querySelectorAll('[data-commerce-cart-count]').forEach(function (el) {
            el.textContent = cart.count;
            el.hidden = cart.count === 0;
        });
        document.dispatchEvent(new CustomEvent('commerce:cart', { detail: cart }));
        document.dispatchEvent(new CustomEvent('commerce:cart-updated', { detail: cart }));
    }

    function toast(message, isError) {
        var el = document.createElement('div');
        el.className = 'commerce-toast' + (isError ? ' commerce-toast--error' : '');
        el.setAttribute('role', isError ? 'alert' : 'status');
        el.textContent = message;
        document.body.appendChild(el);
        setTimeout(function () { el.remove(); }, 4000);
    }

    document.addEventListener('submit', function (event) {
        var form = event.target.closest('[data-commerce-add]');
        if (!form || !form.dataset.commerceCartApi || event.submitter && event.submitter.name === 'buy_now') return;
        event.preventDefault();
        var data = new FormData(form);
        var button = form.querySelector('button[type=submit]');
        if (button) button.disabled = true;
        fetch(form.dataset.commerceCartApi, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': csrf(), 'X-Requested-With': 'XMLHttpRequest' },
            body: data,
            credentials: 'same-origin',
        })
            .then(function (response) { return response.json().then(function (json) { return { ok: response.ok, json: json }; }); })
            .then(function (result) {
                if (result.json.cart) updateMiniCart(result.json.cart);
                toast(result.json.message || '', !result.ok);
            })
            .catch(function () { form.submit(); })
            .finally(function () { if (button) button.disabled = false; });
    });

    // Checkout: show/hide toggled parts, and refresh rates, payments and totals on change.
    document.querySelectorAll('[data-commerce-checkout]').forEach(function (form) {
        function syncToggles() {
            form.querySelectorAll('[data-commerce-toggle]').forEach(function (box) {
                var name = box.dataset.commerceToggle;
                var show = name === 'billing' ? !box.checked : box.checked;
                form.querySelectorAll('[data-commerce-toggled="' + name + '"]').forEach(function (el) { el.hidden = !show; });
            });
            var rate = form.querySelector('input[name=shipping_rate]:checked');
            var address = form.querySelector('[data-commerce-shipping-address]');
            if (address) address.hidden = !!(rate && rate.dataset.pickup === '1');
        }
        var timer = null;
        function refresh() {
            clearTimeout(timer);
            timer = setTimeout(function () {
                var data = new FormData(form);
                data.delete('password');
                fetch(form.dataset.refresh, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': csrf(), 'X-Requested-With': 'XMLHttpRequest' },
                    body: data,
                    credentials: 'same-origin',
                })
                    .then(function (response) { return response.json(); })
                    .then(function (json) {
                        [['[data-commerce-rates]', json.rates_html], ['[data-commerce-payments]', json.payments_html], ['[data-commerce-summary]', json.summary]].forEach(function (pair) {
                            var el = form.querySelector(pair[0]);
                            if (el && typeof pair[1] === 'string') el.outerHTML = pair[1];
                        });
                        var hash = form.querySelector('[data-commerce-hash]');
                        if (hash) hash.value = json.hash;
                        syncToggles();
                    })
                    .catch(function () { /* the "Update shipping" button still works */ });
            }, 300);
        }
        form.addEventListener('change', function (event) {
            var t = event.target;
            if (t.matches('[data-commerce-saved-address]') && t.selectedOptions[0] && t.selectedOptions[0].dataset.address) {
                var address = JSON.parse(t.selectedOptions[0].dataset.address);
                Object.keys(address).forEach(function (key) {
                    var input = form.querySelector('[name="shipping_address[' + key + ']"]');
                    if (!input || address[key] === null) return;
                    if (input.tagName === 'SELECT' && !Array.prototype.some.call(input.options, function (o) { return o.value === address[key]; })) {
                        input.add(new Option(address[key + ''] || address[key], address[key], true, true));
                    }
                    input.value = address[key];
                });
            }
            syncToggles();
            if (t.name === 'password' || t.name === 'notes' || t.name === 'terms') return;
            refresh();
        });
        var update = form.querySelector('[data-commerce-update]');
        if (update) update.hidden = true;
        syncToggles();
    });

    // Copy buttons next to amounts and account numbers.
    document.addEventListener('click', function (event) {
        var button = event.target.closest('[data-commerce-copy-button]');
        if (!button) return;
        var source = button.previousElementSibling && button.previousElementSibling.closest('[data-commerce-copy]') ? button.previousElementSibling : button.parentElement.querySelector('[data-commerce-copy]');
        if (!source || !navigator.clipboard) return;
        navigator.clipboard.writeText(source.dataset.commerceCopy).then(function () { toast(button.dataset.copied || '✓'); });
    });

    // The variant's own image comes first in the gallery.
    document.addEventListener('commerce:variant', function (event) {
        var gallery = document.querySelector('[data-commerce-gallery]');
        if (!gallery || !event.detail) return;
        var images = JSON.parse(gallery.dataset.commerceGallery || '{}');
        var src = images[event.detail.id];
        var first = gallery.querySelector('img');
        if (!src || !first) return;
        if (!first.dataset.original) first.dataset.original = first.src;
        first.src = src;
    });

    // The mini cart drawer: a <dialog> listing the cart (focus stays inside; Escape closes and focus returns to the link).
    document.addEventListener('click', function (event) {
        var link = event.target.closest('[data-commerce-mini-cart]');
        var drawer = document.querySelector('[data-commerce-drawer]');
        if (!link || !drawer || typeof drawer.showModal !== 'function' || event.metaKey || event.ctrlKey) return;
        event.preventDefault();
        var body = drawer.querySelector('[data-commerce-drawer-body]');
        fetch(link.dataset.commerceCartApi, { headers: { 'Accept': 'application/json' }, credentials: 'same-origin' })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                var cart = json.cart || json;
                body.textContent = '';
                var list = document.createElement('ul');
                list.className = 'commerce-drawer__lines';
                (cart.lines || []).forEach(function (line) {
                    var li = document.createElement('li');
                    var a = document.createElement('a');
                    a.href = line.url || '#';
                    a.textContent = line.quantity + ' × ' + line.title;
                    var price = document.createElement('span');
                    price.textContent = line.total.formatted;
                    li.appendChild(a);
                    li.appendChild(price);
                    list.appendChild(li);
                });
                body.appendChild(list);
                if (cart.totals) {
                    var total = document.createElement('p');
                    total.className = 'commerce-drawer__total';
                    total.textContent = cart.totals.total.formatted;
                    body.appendChild(total);
                }
                drawer.showModal();
                var close = drawer.querySelector('[data-commerce-drawer-close]');
                if (close) close.focus();
            })
            .catch(function () { window.location.href = link.href; });
        drawer.addEventListener('close', function onClose() {
            drawer.removeEventListener('close', onClose);
            link.focus();
        });
    });
    document.addEventListener('click', function (event) {
        if (event.target.closest('[data-commerce-drawer-close]')) event.target.closest('dialog').close();
        if (event.target.matches('[data-commerce-drawer]')) event.target.close(); // a click on the backdrop
    });
})();
