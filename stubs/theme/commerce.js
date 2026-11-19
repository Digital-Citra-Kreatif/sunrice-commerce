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

    // A failed response may arrive after the server already added the item.
    var activeAdds = new WeakSet();
    document.addEventListener('submit', function (event) {
        var form = event.target.closest('[data-commerce-add]');
        if (!form || !form.dataset.commerceCartApi) return;
        if (activeAdds.has(form)) {
            event.preventDefault();
            return;
        }
        if (event.submitter && event.submitter.name === 'buy_now') return;

        event.preventDefault();
        activeAdds.add(form);
        var button = event.submitter || form.querySelector('button[type=submit]');
        if (button) button.setAttribute('aria-disabled', 'true');
        fetch(form.dataset.commerceCartApi, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': csrf(), 'X-Requested-With': 'XMLHttpRequest' },
            body: new FormData(form),
            credentials: 'same-origin',
            signal: AbortSignal.timeout(12000),
        })
            .then(function (response) {
                if (response.status >= 500) throw new Error('Cart result is unknown');
                return response.json().then(function (json) {
                    if (!json || typeof json.message !== 'string' || (response.ok && !Number.isInteger(json.cart?.count))) {
                        throw new Error('Unexpected cart response');
                    }
                    return { ok: response.ok, json: json };
                });
            })
            .then(function (result) {
                activeAdds.delete(form);
                if (button) button.removeAttribute('aria-disabled');
                if (Number.isInteger(result.json.cart?.count)) updateMiniCart(result.json.cart);
                toast(result.json.message, !result.ok);
            })
            .catch(function () {
                var recovery = form.querySelector('[data-commerce-add-recovery]');
                if (recovery) {
                    recovery.hidden = false;
                    if (form.contains(document.activeElement)) recovery.querySelector('a')?.focus();
                } else {
                    // Older published templates still get a safe recovery path.
                    var cart = document.querySelector('[data-commerce-mini-cart]');
                    if (cart && cart.href) window.location.assign(cart.href);
                    else {
                        activeAdds.delete(form);
                        if (button) button.removeAttribute('aria-disabled');
                        toast('Check your cart before trying again.', true);
                    }
                }
            });
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
            var pickup = !!(rate && rate.dataset.pickup === '1');
            if (address) address.hidden = pickup;
            var pickupContact = form.querySelector('[data-commerce-pickup-contact]');
            if (pickupContact) pickupContact.hidden = !pickup;
        }
        var timer;
        var revision = 0;
        var refreshing = false;
        var pending = false;
        var failed = false;
        var submitting = false;
        var update = form.querySelector('[data-commerce-update]');
        var submit = form.querySelector('button[name=action][value=place]');
        var status = form.querySelector('[data-commerce-checkout-status]');
        var retry = form.querySelector('[data-commerce-checkout-retry]');
        var paymentSection = form.querySelector('[data-commerce-payment-section]');
        var paymentStep = form.closest('.commerce-checkout-page')?.querySelector('[data-commerce-payment-step]');

        function fillShippingAddress(address, fields) {
            fields.forEach(function (input) {
                var key = input.name.slice('shipping_address['.length, -1);
                var value = String(address[key] ?? '');
                if (input.hasAttribute('data-commerce-region')) {
                    input.length = 1;
                    input.dataset.value = '';
                    if (value) input.add(new Option(address[input.dataset.commerceRegion] || value, value));
                }
                input.value = value;
            });
            // Resync the country and reload its region choices, keeping the selected codes.
            fields.find(function (input) { return input.name === 'shipping_address[country]'; })?.dispatchEvent(new Event('change'));
        }

        function enhanceShippingAddress() {
            var editor = form.querySelector('[data-commerce-address-editor]');
            var dialog = form.closest('.commerce-checkout-page')?.querySelector('[data-commerce-address-dialog]');
            if (!editor || typeof dialog?.showModal !== 'function') return null;

            var fields = Array.from(editor.querySelectorAll('[name^="shipping_address["]'));
            var saved = form.querySelector('[data-commerce-saved-address]');
            var save = editor.querySelector('[name=save_address]');
            var card = form.querySelector('[data-commerce-address-card]');
            var summary = card.querySelector('[data-commerce-address-summary]');
            var open = card.querySelector('[data-commerce-open-address]');
            var error = dialog.querySelector('[data-commerce-address-dialog-error]');
            // Keep the draft outside the checkout form so a refresh only sees the applied address.
            var committed = document.createElement('div');
            committed.hidden = true;
            editor.before(committed);
            dialog.querySelector('[data-commerce-address-dialog-body]').append(editor);
            var inputs = (save ? [...fields, save] : fields).map(function (field) {
                var input = document.createElement('input');
                input.type = 'hidden';
                input.name = field.name;
                committed.append(input);
                return input;
            });
            var activeAddress;
            var activeId;
            var shouldSave;

            function apply() {
                activeAddress = {};
                fields.forEach(function (field, index) {
                    var key = field.name.slice('shipping_address['.length, -1);
                    inputs[index].value = field.disabled ? '' : field.value;
                    activeAddress[key] = inputs[index].value;
                    if (field.dataset.commerceRegion) {
                        activeAddress[field.dataset.commerceRegion] = activeAddress[key] ? field.selectedOptions[0]?.text : '';
                    }
                });
                activeAddress.countryLabel = fields.find(function (field) {
                    return field.name === 'shipping_address[country]';
                })?.selectedOptions[0]?.text;
                activeId = saved?.value || '';
                shouldSave = save?.checked ?? false;
                if (save) inputs[fields.length].value = shouldSave ? '1' : '0';
                var locality = [activeAddress.village, activeAddress.district, activeAddress.city,
                    activeAddress.country === 'ID' ? activeAddress.province : activeAddress.state,
                    activeAddress.postal_code].filter(Boolean).join(', ');
                var recipient = [activeId ? '' : activeAddress.name, activeAddress.phone].filter(Boolean).join(' · ');
                var street = [activeAddress.line1, activeAddress.line2, locality,
                    activeAddress.country === 'ID' ? '' : activeAddress.countryLabel].filter(Boolean).join(', ');
                summary.textContent = [recipient, street].filter(Boolean).join('\n');
                summary.hidden = !activeAddress.line1;
                open.textContent = summary.hidden || activeId ? open.dataset.addLabel : open.dataset.changeLabel;
            }

            function showEditor(startNew) {
                var draft = startNew && activeId ? {
                    country: activeAddress.country,
                    name: activeAddress.name || form.elements.name?.value,
                    phone: activeAddress.phone || form.elements.phone?.value,
                } : activeAddress;
                fillShippingAddress(draft, fields);
                if (save) save.checked = draft === activeAddress && shouldSave;
                error.hidden = true;
                dialog.showModal();
            }

            var fallback = form.querySelector('[data-commerce-address-fallback]');
            if (fallback) fallback.hidden = true;
            card.hidden = false;
            apply();
            open.addEventListener('click', function () { showEditor(true); });
            dialog.querySelector('[data-commerce-cancel-address]').addEventListener('click', function () { dialog.close(); });
            dialog.addEventListener('close', function () { open.focus({ preventScroll: true }); });
            dialog.querySelector('[data-commerce-apply-address]').addEventListener('click', function () {
                var country = editor.querySelector('[data-commerce-country]').value;
                var missing = fields.find(function (field) {
                    var key = field.name.slice('shipping_address['.length, -1);
                    var required = ['name', 'line1', 'country'].includes(key)
                        || (key === 'phone' && editor.dataset.phoneRequired === '1')
                        || (key === 'postal_code' && editor.dataset.postalRequired === '1')
                        || (country === 'ID' ? field.hasAttribute('data-commerce-region') : key === 'city');
                    return required && !field.value.trim();
                });
                error.hidden = !missing;
                if (missing) {
                    missing.focus();
                    return;
                }
                if (saved) saved.value = '';
                apply();
                dialog.close();
                refresh();
            });
            if (editor.hasAttribute('data-commerce-address-errors') && !form.querySelector('[data-commerce-shipping-address]').hidden) showEditor(false);

            return function (option) {
                if (!option?.dataset.address) {
                    saved.value = activeId;
                    showEditor(true);
                    return false;
                }
                fillShippingAddress(JSON.parse(option.dataset.address), fields);
                if (save) save.checked = false;
                apply();
                return true;
            };
        }

        var chooseSavedAddress = enhanceShippingAddress();

        function showStatus(message) {
            if (status) status.textContent = status.dataset[message] || '';
            if (retry) retry.hidden = !failed;
            if (submit) submit.setAttribute('aria-disabled', String(pending || failed || submitting));
        }

        function replaceFragment(selector, html) {
            var el = form.querySelector(selector);
            if (!el || typeof html !== 'string' || el.outerHTML === html) return;

            var focused = el.contains(document.activeElement) ? document.activeElement : null;
            var details = el.querySelector('details[open]');
            el.outerHTML = html;
            var replacement = form.querySelector(selector);
            if (!replacement) return;

            if (details && replacement.querySelector('details')) replacement.querySelector('details').open = true;
            if (focused && focused.matches('summary')) replacement.querySelector('summary')?.focus({ preventScroll: true });
            if (focused && focused.type === 'radio') {
                var radios = Array.from(replacement.querySelectorAll('input[type=radio]'));
                var next = radios.find(function (radio) { return radio.value === focused.value; }) || radios[0];
                if (next) next.focus({ preventScroll: true });
                else submit?.focus({ preventScroll: true });
            }
        }

        function refresh() {
            clearTimeout(timer);
            revision++;
            pending = true;
            failed = false;
            showStatus('updating');
            timer = setTimeout(sendRefresh, 300);
        }

        function sendRefresh() {
            clearTimeout(timer);
            if (refreshing) return;

            refreshing = true;
            var sent = revision;
            var data = new FormData(form);
            data.delete('password');
            data.set('_form', 'checkout');
            fetch(form.dataset.refresh, {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': csrf(), 'X-Requested-With': 'XMLHttpRequest' },
                body: data,
                signal: AbortSignal.timeout(12000),
                credentials: 'same-origin',
            })
                .then(function (response) {
                    if (!response.ok) throw new Error('Checkout refresh failed');
                    return response.json();
                })
                .then(function (json) {
                    if (sent !== revision) return;
                    if (typeof json.hash !== 'string' || !json.hash) throw new Error('Checkout total is missing');

                    replaceFragment('[data-commerce-rates]', json.rates_html);
                    replaceFragment('[data-commerce-payments]', json.payments_html);
                    replaceFragment('[data-commerce-summary]', json.summary);
                    if (typeof json.totals?.total?.amount === 'number') {
                        var paymentNeeded = json.totals.total.amount > 0;
                        if (paymentSection) paymentSection.hidden = !paymentNeeded;
                        if (paymentStep) paymentStep.hidden = !paymentNeeded;
                        // A sole method can become selected when the rates or total change.
                        // Confirm its fee before allowing the order to be placed.
                        var selectedPayment = form.querySelector('[data-commerce-payments] input[name=payment_method]:checked');
                        if (paymentNeeded && selectedPayment && selectedPayment.value !== data.get('payment_method')) {
                            revision++;
                            return;
                        }
                    }
                    var hash = form.querySelector('[data-commerce-hash]');
                    if (hash) hash.value = json.hash;
                    syncToggles();
                })
                .catch(function () {
                    if (sent === revision) failed = true;
                })
                .finally(function () {
                    refreshing = false;
                    if (sent !== revision) {
                        sendRefresh();
                        return;
                    }

                    pending = false;
                    if (update) update.hidden = !failed;
                    showStatus(failed ? 'failed' : 'updated');
                });
        }

        form.addEventListener('submit', function (event) {
            if (event.submitter === update && update) {
                if (pending || submitting) event.preventDefault();
                return;
            }
            if (pending || (failed && (retry || update)) || submitting) {
                event.preventDefault();
                return;
            }

            submitting = true;
            showStatus('submitting');
        });
        if (retry) retry.addEventListener('click', function () {
            refresh();
            if (submit) submit.focus({ preventScroll: true });
        });
        window.addEventListener('pageshow', function (event) {
            if (!event.persisted) return;
            submitting = false;
            showStatus(pending ? 'updating' : failed ? 'failed' : '');
        });
        form.addEventListener('change', function (event) {
            var t = event.target;
            if (t.matches('[data-commerce-saved-address]')) {
                var option = t.selectedOptions[0];
                if (chooseSavedAddress) {
                    if (!chooseSavedAddress(option)) return;
                } else if (option?.dataset.address) {
                    fillShippingAddress(JSON.parse(option.dataset.address), Array.from(form.querySelectorAll('[name^="shipping_address["]')));
                }
            }
            syncToggles();
            if (t.name === 'password' || t.name === 'notes' || t.name === 'terms') return;
            refresh();
        });
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

    // The mini cart drawer: a <dialog> listing the cart's first lines (focus stays inside; Escape closes and focus returns to the link).
    document.addEventListener('click', function (event) {
        var link = event.target.closest('[data-commerce-mini-cart]');
        var drawer = document.querySelector('[data-commerce-drawer]');
        if (!link || !drawer || typeof drawer.showModal !== 'function' || event.metaKey || event.ctrlKey) return;
        event.preventDefault();
        var body = drawer.querySelector('[data-commerce-drawer-body]');
        var shown = parseInt(drawer.dataset.commerceDrawerLines, 10) || 10;
        var api = link.dataset.commerceCartApi + (link.dataset.commerceCartApi.indexOf('?') === -1 ? '?' : '&') + 'lines=' + shown;
        fetch(api, { headers: { 'Accept': 'application/json' }, credentials: 'same-origin' })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                var cart = json.cart || json;
                body.textContent = '';
                var list = document.createElement('ul');
                list.className = 'commerce-drawer__lines';
                (cart.lines || []).slice(0, shown).forEach(function (line) {
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
                var more = (cart.line_count || 0) - list.children.length;
                if (more > 0) {
                    var rest = document.createElement('a');
                    rest.className = 'commerce-drawer__more';
                    rest.href = link.href;
                    rest.textContent = (drawer.dataset.commerceDrawerMore || '+:count').replace(':count', more);
                    body.appendChild(rest);
                }
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
    // A panel that slides in (the menu, the filters): opens with its button, closes with Escape,
    // its close button or the backdrop, keeps focus inside while open and gives it back after.
    function panel(el, opener, backdropClass) {
        var backdrop = null;
        var last = null;
        function focusables() {
            return Array.prototype.filter.call(el.querySelectorAll('a[href], button:not([disabled]), input:not([type=hidden]), select, textarea, summary'), function (n) { return n.offsetParent !== null; });
        }
        function open() {
            last = document.activeElement;
            el.classList.add('is-open');
            document.documentElement.style.overflow = 'hidden';
            if (opener) opener.setAttribute('aria-expanded', 'true');
            backdrop = document.createElement('div');
            backdrop.className = backdropClass;
            backdrop.addEventListener('click', close);
            el.parentNode.appendChild(backdrop);
            var first = focusables()[0];
            if (first) first.focus();
        }
        function close() {
            if (!el.classList.contains('is-open')) return;
            el.classList.remove('is-open');
            document.documentElement.style.overflow = '';
            if (opener) opener.setAttribute('aria-expanded', 'false');
            if (backdrop) backdrop.remove();
            if (last && last.focus) last.focus();
        }
        el.addEventListener('keydown', function (event) {
            if (!el.classList.contains('is-open')) return;
            if (event.key === 'Escape') { close(); return; }
            if (event.key !== 'Tab') return;
            var items = focusables();
            if (!items.length) return;
            if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items[items.length - 1].focus(); }
            else if (!event.shiftKey && document.activeElement === items[items.length - 1]) { event.preventDefault(); items[0].focus(); }
        });
        return { open: open, close: close };
    }

    // The header menu: a drawer on small screens; on wide screens Escape closes an open mega panel.
    var nav = document.querySelector('[data-commerce-nav]');
    var navToggle = document.querySelector('[data-commerce-nav-toggle]');
    if (nav && navToggle) {
        var navPanel = panel(nav, navToggle, 'commerce-nav__backdrop');
        navToggle.addEventListener('click', navPanel.open);
        nav.querySelectorAll('[data-commerce-nav-close]').forEach(function (b) { b.addEventListener('click', navPanel.close); });
        nav.addEventListener('keydown', function (event) {
            if (event.key !== 'Escape') return;
            var item = event.target.closest('.commerce-nav__item--parent');
            var mega = item && item.querySelector('.commerce-nav__panel');
            if (!mega || window.getComputedStyle(mega).position !== 'absolute') return;
            mega.classList.add('is-closed');
            item.querySelector('.commerce-nav__link').focus();
        });
        nav.addEventListener('mouseover', function (event) {
            var item = event.target.closest('.commerce-nav__item--parent');
            if (item) item.querySelectorAll('.is-closed').forEach(function (m) { m.classList.remove('is-closed'); });
        });
        nav.addEventListener('focusout', function (event) {
            var item = event.target.closest('.commerce-nav__item--parent');
            if (item && !item.contains(event.relatedTarget)) item.querySelectorAll('.is-closed').forEach(function (m) { m.classList.remove('is-closed'); });
        });
    }

    // Listing filters: a drawer on small screens, opened by the "Filter" button.
    document.querySelectorAll('[data-commerce-listing]').forEach(function (listing) {
        var aside = listing.querySelector('[data-commerce-filter-panel]');
        var button = listing.querySelector('[data-commerce-filters-open]');
        if (!aside || !button) return;
        button.hidden = false;
        var filters = panel(aside, button, 'commerce-filters-backdrop');
        button.addEventListener('click', filters.open);
        aside.querySelectorAll('[data-commerce-filters-close]').forEach(function (b) { b.addEventListener('click', filters.close); });
    });

    // Quantity steppers: − and + buttons around a number input; in the cart a change saves the line.
    document.querySelectorAll('[data-commerce-stepper]').forEach(function (stepper) {
        var input = stepper.querySelector('input[type=number]');
        if (!input || stepper.querySelector('.commerce-stepper__button')) return;
        var label = input.getAttribute('aria-label') || '';
        [['-', -1], ['+', 1]].forEach(function (pair) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'commerce-stepper__button';
            b.textContent = pair[0] === '-' ? '−' : '+';
            b.setAttribute('aria-label', (pair[1] < 0 ? '− ' : '+ ') + label);
            b.addEventListener('click', function () {
                var step = parseFloat(input.step) || 1;
                var min = input.min === '' ? -Infinity : parseFloat(input.min);
                var max = input.max === '' ? Infinity : parseFloat(input.max);
                var next = Math.min(max, Math.max(min, (parseFloat(input.value) || 0) + pair[1] * step));
                if (String(next) === input.value) return;
                input.value = next;
                input.dispatchEvent(new Event('change', { bubbles: true }));
            });
            if (pair[1] < 0) stepper.insertBefore(b, input); else stepper.appendChild(b);
        });
        if (stepper.hasAttribute('data-commerce-autosubmit')) {
            var timer = null;
            input.addEventListener('change', function () {
                clearTimeout(timer);
                timer = setTimeout(function () { if (input.form) input.form.requestSubmit ? input.form.requestSubmit() : input.form.submit(); }, 500);
            });
        }
    });

    // Product gallery: on phones the images scroll sideways; the thumbnails follow and jump to an image.
    document.querySelectorAll('[data-commerce-gallery]').forEach(function (gallery) {
        var main = gallery.querySelector('.commerce-gallery__main');
        var thumbs = gallery.querySelectorAll('[data-commerce-thumb]');
        if (!main || !thumbs.length) return;
        function mark(index) {
            thumbs.forEach(function (t, i) { if (i === index) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current'); });
        }
        thumbs.forEach(function (thumb, index) {
            thumb.addEventListener('click', function (event) {
                event.preventDefault();
                var image = main.querySelectorAll('[data-commerce-gallery-image]')[index];
                if (image) main.scrollTo({ left: image.offsetLeft - main.offsetLeft, behavior: 'smooth' });
                mark(index);
            });
        });
        main.addEventListener('scroll', function () {
            if (main.clientWidth) mark(Math.round(main.scrollLeft / main.clientWidth));
        }, { passive: true });
    });
})();
