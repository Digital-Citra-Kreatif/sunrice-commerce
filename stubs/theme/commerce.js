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

    function dismissOnBackdrop(dialog) {
        var pressedOnBackdrop = false;
        function isBackdrop(event) {
            if (event.target !== dialog) return false;
            var bounds = dialog.getBoundingClientRect();
            return event.clientX < bounds.left || event.clientX > bounds.right
                || event.clientY < bounds.top || event.clientY > bounds.bottom;
        }
        dialog.addEventListener('pointerdown', function (event) {
            pressedOnBackdrop = isBackdrop(event);
        });
        dialog.addEventListener('click', function (event) {
            if (pressedOnBackdrop && isBackdrop(event)) dialog.close();
            pressedOnBackdrop = false;
        });
    }

    function updateMiniCart(cart) {
        document.querySelectorAll('[data-commerce-cart-count]').forEach(function (el) {
            el.textContent = cart.count;
            el.hidden = cart.count === 0;
        });
        document.dispatchEvent(new CustomEvent('commerce:cart', { detail: cart }));
        document.dispatchEvent(new CustomEvent('commerce:cart-updated', { detail: cart }));
    }

    document.querySelectorAll('[data-commerce-product-search]').forEach(function (form) {
        var input = form.querySelector('[name="q"]');
        var result = form.querySelector('[data-commerce-search-result]');
        var count = form.querySelector('[data-commerce-search-count]');
        var link = form.querySelector('[data-commerce-search-link]');
        if (!input || !result || !count || !link) return;

        var timer;
        var pending;
        var revision = 0;

        function clearResult() {
            clearTimeout(timer);
            pending?.abort();
            revision++;
            result.hidden = true;
        }

        function schedule(event) {
            clearResult();
            var query = input.value.trim();
            if (!query || event.isComposing) return;

            var current = revision;
            timer = setTimeout(function () {
                pending = new AbortController();
                var endpoint = new URL(form.dataset.commerceProductSearch, form.action);
                endpoint.searchParams.set('q', query);
                fetch(endpoint, { headers: { Accept: 'application/json' }, signal: pending.signal })
                    .then(function (response) {
                        if (!response.ok) throw new Error('Product count unavailable');
                        return response.json();
                    })
                    .then(function (data) {
                        if (current !== revision || input.value.trim() !== query) return;
                        var destination = new URL(form.action);
                        destination.searchParams.set('q', query);
                        count.textContent = data.message;
                        link.href = destination.href;
                        link.hidden = data.count === 0;
                        result.hidden = false;
                    })
                    .catch(function () {});
            }, 1000);
        }

        input.addEventListener('input', schedule);
        input.addEventListener('compositionend', schedule);
        form.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') clearResult();
        });
    });

    var buyBars = new WeakMap();
    var actionToast;
    function toast(message, isError, form) {
        var el = document.createElement('div');
        el.className = 'commerce-toast' + (isError ? ' commerce-toast--error' : '');
        if (form) {
            el.classList.add(form.dataset.commerceCollection ? 'commerce-toast--collection-success' : 'commerce-toast--cart-success');
            var header = document.querySelector('.commerce-header');
            if (header) el.style.setProperty('--commerce-toast-top', Math.max(16, header.getBoundingClientRect().bottom + 12) + 'px');
        }
        var actionSelector = form?.dataset.commerceCollection
            ? '[data-commerce-collection-success-action]' : '[data-commerce-add-success-action]';
        var action = form?.querySelector(actionSelector)?.content.firstElementChild;
        if (!action) {
            el.setAttribute('role', isError ? 'alert' : 'status');
            el.textContent = message;
            document.body.appendChild(el);
            setTimeout(function () { el.remove(); }, 4000);
            return;
        }

        actionToast?.remove();
        actionToast = el;
        el.classList.add('commerce-toast--with-action');
        var text = document.createElement('span');
        text.className = 'commerce-toast__message';
        text.setAttribute('role', 'status');
        text.textContent = message;
        el.append(text, action.cloneNode(true));
        var bar = buyBars.get(form);
        var origin = bar?.contains(document.activeElement) ? bar : form;
        origin.after(el);

        var timer;
        function dismissLater() {
            clearTimeout(timer);
            timer = setTimeout(function () {
                el.remove();
                if (actionToast === el) actionToast = null;
            }, 8000);
        }

        el.addEventListener('pointerenter', function () { clearTimeout(timer); });
        el.addEventListener('focusin', function () { clearTimeout(timer); });
        el.addEventListener('pointerleave', function () {
            if (!el.contains(document.activeElement)) dismissLater();
        });
        el.addEventListener('focusout', function (event) {
            if (!el.contains(event.relatedTarget) && !el.matches(':hover')) dismissLater();
        });
        dismissLater();
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
                toast(result.json.message, !result.ok, result.ok ? form : null);
            })
            .catch(function () {
                var recovery = form.querySelector('[data-commerce-add-recovery]');
                if (recovery) {
                    recovery.hidden = false;
                    if (form.contains(document.activeElement) || buyBars.get(form)?.classList.contains('is-visible')) {
                        recovery.querySelector('a')?.focus();
                    }
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

    // Leaving the list pages as regular forms lets the server render removed rows and empty states.
    var updatingCollection = false;
    document.addEventListener('submit', function (event) {
        var form = event.target.closest('[data-commerce-collection]');
        if (!form || form.closest('.commerce-wishlist, .commerce-compare')) return;
        event.preventDefault();
        if (updatingCollection) return;

        var button = form.querySelector('button[type=submit]');
        var method = form.querySelector('[name=_method]');
        var selecting = method.disabled;
        updatingCollection = true;
        button.setAttribute('aria-disabled', 'true');
        fetch(form.action, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': csrf(), 'X-Requested-With': 'XMLHttpRequest' },
            body: new FormData(form),
            credentials: 'same-origin',
            signal: AbortSignal.timeout(12000),
        })
            .then(function (response) {
                if (response.status >= 500) throw new Error('Collection result is unknown');
                return response.json().then(function (json) {
                    if (typeof json?.message !== 'string' || (response.ok && !Number.isInteger(json.count))) {
                        throw new Error('Unexpected collection response');
                    }
                    if (response.ok) {
                        document.querySelectorAll('[data-commerce-collection]').forEach(function (peer) {
                            if (peer.dataset.commerceCollection !== form.dataset.commerceCollection || peer.dataset.productId !== form.dataset.productId) return;
                            peer.action = selecting ? peer.dataset.removeUrl : peer.dataset.addUrl;
                            peer.querySelector('[name=_method]').disabled = !selecting;
                            peer.querySelector('button[type=submit]').setAttribute('aria-pressed', String(selecting));
                            peer.querySelector('[data-commerce-collection-label]').textContent = selecting ? peer.dataset.removeLabel : peer.dataset.addLabel;
                        });
                    }
                    toast(json.message, !response.ok, response.ok && form.isConnected ? form : null);
                });
            })
            .catch(function () { toast(form.dataset.unconfirmed, true); })
            .finally(function () {
                updatingCollection = false;
                button.removeAttribute('aria-disabled');
            });
    });

    document.querySelectorAll('[data-commerce-cart]').forEach(function (cart) {
        var dialog = cart.querySelector('[data-commerce-cart-remove-dialog]');
        if (typeof dialog?.showModal !== 'function') return;

        var name = dialog.querySelector('[data-commerce-cart-remove-item]');
        var form;
        var trigger;
        function close() {
            dialog.close();
            trigger?.focus();
            form = null;
            trigger = null;
        }

        cart.addEventListener('click', function (event) {
            var opener = event.target.closest('[data-commerce-cart-remove-trigger]');
            if (!opener) return;

            event.preventDefault();
            if (dialog.open) return;
            trigger = opener;
            form = opener.closest('form');
            name.textContent = form.dataset.commerceCartRemove;
            dialog.showModal();
        });
        dialog.addEventListener('submit', function (event) {
            event.preventDefault();
            var remove = form;
            close();
            if (event.submitter?.value === 'remove') remove?.submit();
        });
        dialog.addEventListener('cancel', function (event) {
            event.preventDefault();
            close();
        });
    });

    document.querySelectorAll('[data-commerce-order-cancel]').forEach(function (form) {
        var dialog = form.querySelector('[data-commerce-order-cancel-dialog]');
        var opener = form.querySelector('[data-commerce-open-order-cancel]');
        if (!opener || typeof dialog?.showModal !== 'function') return;
        var fallback = form.querySelector('[data-commerce-order-cancel-fallback]');
        if (fallback) fallback.hidden = true;
        opener.hidden = false;
        opener.addEventListener('click', function () { dialog.showModal(); });
        dialog.querySelector('[data-commerce-keep-order]')?.addEventListener('click', function () { dialog.close(); });
        dialog.addEventListener('close', function () { opener.focus({ preventScroll: true }); });
        dismissOnBackdrop(dialog);
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
            var pickupNote = form.querySelector('[data-commerce-pickup-note]');
            if (pickupNote) pickupNote.hidden = !pickup;
            if (address) address.hidden = !pickupNote && pickup;
            var pickupContact = form.querySelector('[data-commerce-pickup-contact]');
            if (pickupContact) {
                pickupContact.hidden = !pickup;
                if (pickup) {
                    ['name', 'phone'].forEach(function (field) {
                        var input = pickupContact.querySelector('[name="' + field + '"]');
                        var recipient = form.elements.namedItem('shipping_address[' + field + ']');
                        if (input && !input.value && recipient?.value) input.value = recipient.value;
                    });
                }
            }
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
        var submitLabel = submit?.querySelector('[data-commerce-place-label]') || submit;
        var defaultSubmitLabel = submitLabel?.textContent;
        var processingLabel = submit?.dataset.processingLabel || status?.dataset.submitting;
        var voucherRequest = null;
        var addressRequest = null;
        var paymentSection = form.querySelector('[data-commerce-payment-section]');
        var paymentStep = form.closest('.commerce-checkout-page')?.querySelector('[data-commerce-payment-step]');
        var termsLink = form.querySelector('[data-commerce-open-terms]');
        var termsDialog = form.closest('.commerce-checkout-page')?.querySelector('[data-commerce-terms-dialog]');
        if (termsLink && typeof termsDialog?.showModal === 'function') {
            termsLink.addEventListener('click', function (event) {
                if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
                event.preventDefault();
                termsDialog.showModal();
            });
            dismissOnBackdrop(termsDialog);
            termsDialog.addEventListener('close', function () { termsLink.focus({ preventScroll: true }); });
        }

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
            var picker = form.querySelector('[data-commerce-saved-address-picker]');
            var newAddressOption = saved?.querySelector('option[value=""]');
            var save = editor.querySelector('[name=save_address]');
            var card = form.querySelector('[data-commerce-address-card]');
            var summary = card.querySelector('[data-commerce-address-summary]');
            var open = card.querySelector('[data-commerce-open-address]');
            var error = dialog.querySelector('[data-commerce-address-dialog-error]');
            var applyButton = dialog.querySelector('[data-commerce-apply-address]');
            var cancel = dialog.querySelector('[data-commerce-cancel-address]');
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
                var title = activeAddress.label?.trim() || '';
                if (newAddressOption?.dataset.placeholder) {
                    newAddressOption.textContent = (!activeId && title) || newAddressOption.dataset.placeholder;
                }
                var locality = [activeAddress.village, activeAddress.district, activeAddress.city,
                    activeAddress.country === 'ID' ? activeAddress.province : activeAddress.state,
                    activeAddress.postal_code].filter(Boolean).join(', ');
                var recipient = [activeId ? '' : activeAddress.name, activeAddress.phone].filter(Boolean).join(' · ');
                var street = [activeAddress.line1, activeAddress.line2, locality,
                    activeAddress.country === 'ID' ? '' : activeAddress.countryLabel].filter(Boolean).join(', ');
                summary.textContent = [saved && !picker?.hidden ? '' : title, recipient, street].filter(Boolean).join('\n');
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
                if (save) save.checked = draft !== activeAddress || !activeAddress.line1 || shouldSave;
                error.hidden = true;
                dialog.showModal();
            }

            var fallback = form.querySelector('[data-commerce-address-fallback]');
            if (fallback) fallback.hidden = true;
            card.hidden = false;
            apply();
            open.addEventListener('click', function () { showEditor(true); });
            cancel.addEventListener('click', function () { dialog.close(); });
            dialog.addEventListener('cancel', function (event) {
                if (applyButton.disabled) event.preventDefault();
            });
            dialog.addEventListener('close', function () { open.focus({ preventScroll: true }); });
            applyButton.addEventListener('click', function () {
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
                    error.textContent = error.dataset.incomplete || '';
                    missing.focus();
                    return;
                }
                if (save?.checked && saved) {
                    applyButton.disabled = cancel.disabled = true;
                    addressRequest = {
                        values: fields.map(function (field) { return [field.name, field.disabled ? '' : field.value]; }),
                        finish: function (result, message) {
                            applyButton.disabled = cancel.disabled = false;
                            if (!result) {
                                error.textContent = message || error.dataset.saveFailed || '';
                                error.hidden = false;
                                return;
                            }
                            var id = String(result.id);
                            var option = Array.from(saved.options).find(function (item) { return item.value === id; });
                            if (!option) {
                                option = new Option(result.title, id);
                                saved.add(option);
                            }
                            option.dataset.address = JSON.stringify(result.address);
                            if (picker) picker.hidden = false;
                            saved.value = id;
                            fillShippingAddress(result.address, fields);
                            save.checked = false;
                            apply();
                            dialog.close();
                        },
                    };
                    refresh();
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
            if (submit) {
                submit.disabled = submitting;
                submit.setAttribute('aria-disabled', String(pending || failed || submitting));
                if (processingLabel) submitLabel.textContent = submitting ? processingLabel : defaultSubmitLabel;
            }
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
            if (focused && selector === '[data-commerce-checkout-vouchers]') {
                replacement.querySelector('[name=voucher_code]')?.focus({ preventScroll: true });
            }
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
            var address = addressRequest;
            var addressError;
            addressRequest = null;
            var voucher = address ? null : voucherRequest;
            if (!address) voucherRequest = null;
            var data = new FormData(form);
            data.delete('password');
            var captchaField = form.querySelector('[data-commerce-captcha]')?.dataset.commerceCaptcha;
            if (captchaField) data.delete(captchaField);
            data.set('_form', 'checkout');
            if (address) {
                data.set('action', 'apply_address');
                data.set('save_address', '1');
                data.set('address_id', '');
                address.values.forEach(function (field) { data.set(field[0], field[1]); });
            }
            if (voucher) {
                data.set(voucher.name, voucher.value);
                if (voucher.code !== null) data.set('voucher_code', voucher.code);
            }
            fetch(voucher ? voucher.formAction : form.dataset.refresh, {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': csrf(), 'X-Requested-With': 'XMLHttpRequest' },
                body: data,
                signal: AbortSignal.timeout(12000),
                credentials: 'same-origin',
            })
                .then(function (response) {
                    if (address && response.status === 422) {
                        return response.json().then(function (json) {
                            addressError = json.message;
                            throw new Error('Address validation failed');
                        });
                    }
                    if (!response.ok) throw new Error('Checkout refresh failed');
                    return response.json();
                })
                .then(function (json) {
                    if (address) {
                        if (!json.saved_address || typeof json.hash !== 'string' || !json.hash) throw new Error('Checkout refresh failed');
                        address.finish(json.saved_address);
                        address = null;
                    }
                    if (voucher) replaceFragment('[data-commerce-checkout-vouchers]', json.vouchers_html);
                    if (sent !== revision) return;
                    if (typeof json.hash !== 'string' || !json.hash) throw new Error('Checkout total is missing');

                    replaceFragment('[data-commerce-rates]', json.rates_html);
                    replaceFragment('[data-commerce-payments]', json.payments_html);
                    replaceFragment('[data-commerce-summary]', json.summary);
                    if (typeof json.totals?.total?.amount === 'number') {
                        var paymentNeeded = json.totals.total.amount > 0;
                        if (paymentSection) paymentSection.hidden = !paymentNeeded;
                        if (paymentStep) paymentStep.hidden = !paymentNeeded;
                        // The selected method must match the totals returned by the server.
                        var selectedPayment = form.querySelector('[data-commerce-payments] input[name=payment_method]:checked');
                        if (paymentNeeded && selectedPayment && selectedPayment.value !== (json.selected_payment_method ?? data.get('payment_method'))) {
                            revision++;
                            return;
                        }
                    }
                    var hash = form.querySelector('[data-commerce-hash]');
                    if (hash) hash.value = json.hash;
                    syncToggles();
                })
                .catch(function () {
                    if (address) {
                        address.finish(null, addressError);
                        return;
                    }
                    if (sent === revision) failed = true;
                })
                .finally(function () {
                    refreshing = false;
                    if (sent !== revision || voucherRequest || addressRequest) {
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
            if (event.submitter?.hasAttribute?.('data-commerce-voucher-submit')) {
                event.preventDefault();
                if (submitting) return;
                var button = event.submitter;
                voucherRequest = {
                    name: button.name,
                    value: button.value,
                    formAction: button.formAction,
                    code: button.name === 'apply_voucher' ? form.elements.namedItem('voucher_code').value : null,
                };
                refresh();
                return;
            }

            if (pending || (failed && update) || submitting) {
                event.preventDefault();
                return;
            }
            if (submit && !event.defaultPrevented && (!event.submitter || event.submitter === submit)) {
                submitting = true;
                showStatus('');
            }
        });
        form.addEventListener('formdata', function (event) {
            // A disabled button is omitted from the browser's POST body.
            if (submitting && submit) event.formData.set(submit.name, submit.value);
        });
        form.addEventListener('keydown', function (event) {
            if (event.key !== 'Enter' || event.target.name !== 'voucher_code') return;
            event.preventDefault();
            var apply = form.querySelector('[name=apply_voucher]');
            if (apply) form.requestSubmit(apply);
        });
        window.addEventListener('pageshow', function (event) {
            if (!event.persisted) return;
            if (submitting) {
                window.location.reload();
                return;
            }
            showStatus(pending ? 'updating' : failed ? 'failed' : '');
        });
        form.addEventListener('change', function (event) {
            if (submitting) return;
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
            if (['password', 'notes', 'terms', 'voucher_code'].includes(t.name)) return;
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
                var empty = cart.count === 0;
                var footer = drawer.querySelector('[data-commerce-drawer-footer], .commerce-drawer__footer');
                if (footer) footer.hidden = empty;
                if (empty) {
                    var template = drawer.querySelector('[data-commerce-drawer-empty]');
                    if (!template) throw new Error('Cart empty state unavailable');
                    body.appendChild(template.content.cloneNode(true));
                } else {
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
        aside.addEventListener('click', function (event) {
            if (event.target.closest('[data-commerce-filters-close]')) filters.close();
        });

        // Before the sticky sidebar reaches the header, its starting position can be lower on the page.
        var desktop = window.matchMedia('(min-width: 1024px)');
        var frame = 0;
        function fitFilters() {
            frame = 0;
            if (!desktop.matches) return;
            var top = Math.max(0, aside.getBoundingClientRect().top);
            var height = Math.max(0, Math.floor(window.innerHeight - top - 16)) + 'px';
            if (aside.style.getPropertyValue('--commerce-filter-height') !== height) {
                aside.style.setProperty('--commerce-filter-height', height);
            }
        }
        function scheduleFit() {
            if (!frame) frame = window.requestAnimationFrame(fitFilters);
        }
        fitFilters();
        window.addEventListener('load', scheduleFit, { once: true });
        window.addEventListener('resize', scheduleFit);
        window.addEventListener('scroll', scheduleFit, { passive: true });
        document.fonts?.ready.then(scheduleFit);

        var results = listing.querySelector('[data-commerce-listing-results]');
        var status = listing.querySelector('[data-commerce-listing-status]');
        if (!results || !status) return;
        var pending;
        var renderedUrl = window.location.href;
        var appliedFilters;

        function filterParams(form) {
            var params = new URLSearchParams();
            new FormData(form).forEach(function (value, name) {
                if (value !== '' && !(name === 'sort' && value === 'featured')) params.append(name, value);
            });
            return params;
        }

        function syncApply() {
            var form = aside.querySelector('[data-commerce-filters]');
            var apply = form?.querySelector('[data-commerce-filters-apply]');
            if (apply) apply.disabled = filterParams(form).toString() === appliedFilters;
        }

        function rememberFilters() {
            var form = aside.querySelector('[data-commerce-filters]');
            appliedFilters = form && filterParams(form).toString();
            syncApply();
        }

        rememberFilters();
        aside.addEventListener('input', function (event) {
            var option = event.target;
            if (option.matches('input[name="category[]"]:checked')) {
                for (var branch = option.closest('.commerce-filters__branch'); branch; branch = branch.parentElement.closest('.commerce-filters__branch')) {
                    var parent = branch.parentElement.querySelector(':scope > label [data-commerce-filter-parent]');
                    if (parent) parent.checked = false;
                }
                if (option.hasAttribute('data-commerce-filter-parent')) {
                    var group = option.closest('.commerce-filters__parent').querySelector(':scope > .commerce-filters__branch');
                    group.open = true;
                    group.querySelectorAll('input[name="category[]"]:checked')
                        .forEach(function (child) { child.checked = false; });
                }
            }
            syncApply();
        });
        aside.addEventListener('change', syncApply);
        window.addEventListener('pageshow', syncApply);

        function showLoading(loading) {
            results.setAttribute('aria-busy', String(loading));
            status.textContent = loading ? status.dataset.loading : '';
        }

        async function navigate(url, source) {
            pending?.abort();
            if (url.href === renderedUrl) {
                showLoading(false);
                return;
            }

            var request = new AbortController();
            pending = request;
            showLoading(true);
            try {
                var response = await fetch(url, {
                    headers: { Accept: 'text/html' },
                    signal: AbortSignal.any([request.signal, AbortSignal.timeout(12000)]),
                });
                if (!response.ok || response.redirected) throw new Error('Listing unavailable');
                var html = new DOMParser().parseFromString(await response.text(), 'text/html');
                if (request.signal.aborted) return;
                var nextListing = html.querySelector('[data-commerce-listing]');
                var nextAside = nextListing?.querySelector('[data-commerce-filter-panel]');
                var nextResults = nextListing?.querySelector('[data-commerce-listing-results]');
                var nextButton = nextResults?.querySelector('[data-commerce-filters-open]');
                if (!nextAside || !nextButton) throw new Error('Listing fragment unavailable');

                var focusInListing = listing.contains(document.activeElement);
                var drawerOpen = aside.classList.contains('is-open');
                filters.close();
                nextButton.replaceWith(button);
                aside.replaceChildren(...nextAside.childNodes);
                results.replaceChildren(...nextResults.childNodes);
                rememberFilters();
                if (source !== 'history') window.history.pushState(null, '', url);
                renderedUrl = url.href;
                if (source === 'page') listing.scrollIntoView({ block: 'start' });
                if (source !== 'history' || focusInListing) {
                    var focus = source === 'view' ? results.querySelector('.commerce-listing__views [aria-current]')
                        : drawerOpen ? button : results;
                    (focus || results).focus({ preventScroll: true });
                }
                scheduleFit();
                showLoading(false);
                status.textContent = results.querySelector('.commerce-products__count, .commerce-products .commerce-empty__title')?.textContent.trim() || '';
            } catch {
                if (request.signal.aborted) return;
                if (source === 'history') window.location.reload();
                else window.location.assign(url);
            }
        }

        listing.addEventListener('submit', function (event) {
            var form = event.target.closest('[data-commerce-filters]');
            if (!form) return;
            var url = new URL(form.action);
            event.preventDefault();
            var params = filterParams(form).toString();
            if (params === appliedFilters) return;
            url.search = params;
            navigate(url, 'filter');
        });
        listing.addEventListener('click', function (event) {
            if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            var link = event.target.closest('.commerce-listing__views a, .commerce-pages a, .commerce-chips a, .commerce-filters__foot a, .commerce-products .commerce-empty a');
            if (!link || link.target || link.hasAttribute('download')) return;
            var url = new URL(link.href);
            if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return;
            event.preventDefault();
            navigate(url, link.closest('.commerce-listing__views') ? 'view' : link.closest('.commerce-pages') ? 'page' : 'filter');
        });
        window.addEventListener('popstate', function () { navigate(new URL(window.location.href), 'history'); });
    });

    // Use the original form to submit from the floating controls on product pages.
    document.querySelectorAll('.commerce-product [data-commerce-buy-controls]').forEach(function (controls) {
        if (typeof IntersectionObserver !== 'function' || typeof ResizeObserver !== 'function') return;

        var form = controls.closest('[data-commerce-add]');
        var page = controls.closest('.commerce-product');
        var sourceButton = controls.querySelector('button[type=submit]');
        var sourceQuantity = controls.querySelector('input[name=quantity]');
        if (!form || !sourceButton || !sourceQuantity) return;

        var bar = document.createElement('div');
        bar.className = 'commerce-buy-bar';
        bar.inert = true;
        var buttons = controls.cloneNode(true);
        buttons.removeAttribute('data-commerce-buy-controls');
        buttons.className = 'commerce-buy-bar__controls';
        var button = buttons.querySelector('button[type=submit]');
        button.type = 'button';
        var quantity = buttons.querySelector('input[name=quantity]');
        quantity.removeAttribute('name');
        bar.appendChild(buttons);
        page.after(bar);
        buyBars.set(form, bar);

        var inView = true;
        function updateBar() {
            var visible = !inView && !sourceButton.disabled;
            if (!visible && bar.contains(document.activeElement)) {
                var target = document.activeElement === button && !sourceButton.disabled ? sourceButton : sourceQuantity;
                target.focus({ preventScroll: true });
            }
            bar.inert = !visible;
            bar.classList.toggle('is-visible', visible);
            button.setAttribute('aria-disabled', sourceButton.getAttribute('aria-disabled') || 'false');
        }

        function syncQuantity() {
            quantity.min = sourceQuantity.min;
            quantity.max = sourceQuantity.max;
            quantity.step = sourceQuantity.step;
            quantity.value = sourceQuantity.value;
        }

        ['input', 'change'].forEach(function (event) {
            sourceQuantity.addEventListener(event, syncQuantity);
            quantity.addEventListener(event, function () {
                sourceQuantity.value = quantity.value;
                sourceQuantity.dispatchEvent(new Event(event, { bubbles: true }));
            });
        });
        function addFromBar() {
            if (sourceButton.disabled || sourceButton.getAttribute('aria-disabled') === 'true') return;
            if (!quantity.reportValidity()) return;
            form.requestSubmit(sourceButton);
        }
        button.addEventListener('click', addFromBar);
        quantity.addEventListener('keydown', function (event) {
            if (event.key !== 'Enter') return;
            event.preventDefault();
            addFromBar();
        });
        controls.closest('[data-commerce-product]')?.addEventListener('commerce:variant', syncQuantity);
        new MutationObserver(updateBar).observe(sourceButton, { attributeFilter: ['disabled', 'aria-disabled'] });
        syncQuantity();

        var header = document.querySelector('.commerce-header');
        var observer;
        function observeControls() {
            var top = Math.ceil(header?.getBoundingClientRect().height || 0);
            var bottom = Math.ceil(bar.getBoundingClientRect().height);
            document.documentElement.style.setProperty('--commerce-buy-bar-space', bottom + 'px');
            observer?.disconnect();
            observer = new IntersectionObserver(function (entries) {
                inView = entries[0].intersectionRatio >= 0.95;
                updateBar();
            }, { rootMargin: '-' + top + 'px 0px -' + bottom + 'px', threshold: 0.95 });
            observer.observe(controls);
        }
        var resizer = new ResizeObserver(observeControls);
        resizer.observe(bar);
        if (header) resizer.observe(header);
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

    // Product photos stay in order. Variant selection moves to the matching slide.
    document.querySelectorAll('[data-commerce-gallery]').forEach(function (gallery) {
        var main = gallery.querySelector('.commerce-gallery__main');
        if (!main) return;
        var slides = Array.from(main.querySelectorAll('[data-commerce-gallery-image]'));
        if (!slides.length) return;
        var thumbs = Array.from(gallery.querySelectorAll('[data-commerce-thumb]'));
        var photoMap = JSON.parse(gallery.dataset.commerceGallery || '{}');
        var lightbox = gallery.querySelector('[data-commerce-gallery-lightbox]');
        var zoom = lightbox?.querySelector('[data-commerce-gallery-zoom]');
        var product = gallery.closest('.commerce-product');
        var active = 0;

        function mark(index) {
            active = index;
            thumbs.forEach(function (thumb, i) {
                if (i === index) thumb.setAttribute('aria-current', 'true');
                else thumb.removeAttribute('aria-current');
            });
            slides.forEach(function (slide, i) {
                if (slide.matches('a')) slide.tabIndex = i === index ? 0 : -1;
            });
            var selected = thumbs[index];
            var rail = selected?.closest('.commerce-gallery__thumbs');
            if (!rail) return;
            var thumbBox = selected.getBoundingClientRect();
            var railBox = rail.getBoundingClientRect();
            if (thumbBox.left < railBox.left || thumbBox.right > railBox.right) {
                rail.scrollBy({ left: thumbBox.left - railBox.left });
            }
        }

        function show(index) {
            index = (index + slides.length) % slides.length;
            main.scrollTo({ left: index * main.clientWidth, behavior: 'instant' });
            mark(index);
            if (lightbox?.open && zoom) {
                zoom.src = slides[index].href;
                zoom.alt = slides[index].querySelector('img').alt;
            }
        }

        thumbs.forEach(function (thumb, index) {
            thumb.addEventListener('click', function (event) {
                event.preventDefault();
                show(index);
            });
        });
        main.addEventListener('scroll', function () {
            if (main.clientWidth) mark(Math.round(main.scrollLeft / main.clientWidth));
        }, { passive: true });
        gallery.querySelectorAll('[data-commerce-gallery-step]').forEach(function (button) {
            button.hidden = false;
            button.addEventListener('click', function () { show(active + Number(button.dataset.commerceGalleryStep)); });
        });
        gallery.addEventListener('keydown', function (event) {
            if (!event.target.closest('.commerce-gallery__stage, .commerce-gallery__thumbs, .commerce-gallery__lightbox')) return;
            if (slides.length < 2 || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
            event.preventDefault();
            show(active + (event.key === 'ArrowLeft' ? -1 : 1));
            if (!lightbox?.open && main.contains(event.target)) slides[active].focus({ preventScroll: true });
        });
        if (lightbox && zoom && typeof lightbox.showModal === 'function') {
            lightbox.querySelector('[data-commerce-gallery-close]').addEventListener('click', function () { lightbox.close(); });
            lightbox.addEventListener('click', function (event) { if (event.target === lightbox) lightbox.close(); });
            lightbox.addEventListener('close', function () { slides[active].focus({ preventScroll: true }); });
            slides.forEach(function (slide, index) {
                slide.addEventListener('click', function (event) {
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                    event.preventDefault();
                    lightbox.showModal();
                    show(index);
                });
            });
        }
        document.addEventListener('commerce:variant', function (event) {
            if (!event.detail || (product && !product.contains(event.target))) return;
            var image = photoMap[event.detail.id];
            if (typeof image === 'string') {
                // A published template from before the carousel still sends image URLs.
                var first = main.querySelector('img');
                if (first) first.src = image;
            } else if (!event.detail.initial) {
                show(Number.isInteger(image) ? image : 0);
            }
        });
        mark(0);
    });
})();
