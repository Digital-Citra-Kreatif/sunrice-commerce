{{-- $data, $settings and $extraFields. --}}
@php($L = \Sunrice\Commerce\Storefront\Layout::class)
@if ($settings->get('checkout.order_notes', true))
    <details class="commerce-accordion commerce-checkout__notes" id="order-notes" @if (old('notes', $data->get('notes')) || $errors->has('notes')) open @endif>
        <summary>{{ __('commerce::checkout.fields.notes') }}</summary>
        <label class="commerce-field">
            <span class="commerce-visually-hidden">{{ __('commerce::checkout.fields.notes') }}</span>
            <textarea name="notes" rows="3" maxlength="1000">{{ old('notes', $data->get('notes')) }}</textarea>
            @include($L::view('partials.field-error'), ['name' => 'notes'])
        </label>
    </details>
@endif
@if ($settings->get('checkout.dropshipper', false) || collect($extraFields)->where('section', 'extra')->isNotEmpty())
    <fieldset class="commerce-checkout__section" id="notes">
        <legend>{{ __('commerce::checkout.sections.notes') }}</legend>
        @if ($settings->get('checkout.dropshipper', false))
            @php($dropship = $data->dropship())
            <label class="commerce-check"><input type="checkbox" name="dropship[enabled]" value="1" @checked($dropship['enabled']) data-commerce-toggle="dropship"> {{ __('commerce::checkout.dropship') }}</label>
            <div data-commerce-toggled="dropship" @if (! $dropship['enabled']) hidden @endif>
                <label class="commerce-field"><span>{{ __('commerce::checkout.fields.dropship_name') }}</span>
                    <input type="text" name="dropship[name]" value="{{ old('dropship.name', $dropship['name']) }}">
                    @include($L::view('partials.field-error'), ['name' => 'dropship.name'])
                </label>
                <label class="commerce-field"><span>{{ __('commerce::checkout.fields.dropship_phone') }}</span>
                    <input type="tel" name="dropship[phone]" value="{{ old('dropship.phone', $dropship['phone']) }}">
                    @include($L::view('partials.field-error'), ['name' => 'dropship.phone'])
                </label>
            </div>
        @endif
        @foreach (collect($extraFields)->where('section', 'extra') as $field)
            @include($L::view('partials.checkout-field'), ['field' => $field])
        @endforeach
    </fieldset>
@endif
