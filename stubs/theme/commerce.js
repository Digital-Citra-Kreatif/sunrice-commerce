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
})();
