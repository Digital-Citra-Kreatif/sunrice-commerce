{{--
    The product inquiry form (the CMS form "product_inquiry"). $entry: the product shown.
    The product, its link and the variant chosen go in hidden fields.
--}}
<x-sunrice-cms::form :handle="config('commerce.catalog.inquiry_form')" class="commerce-inquiry__form">
    @foreach ($component->form->schema()->fields() as $field)
        @if (in_array($field->handle, ['product', 'product_url', 'variant'], true))
            <input type="hidden" name="data[{{ $field->handle }}]" value="{{ match ($field->handle) { 'product' => $entry->title, 'product_url' => url($entry->url() ?? ''), default => '' } }}" @if ($field->handle === 'variant') data-commerce-inquiry-variant @endif>
        @else
            <label class="commerce-field" for="form-{{ $component->form->handle }}-{{ $field->handle }}">
                <span>{{ $field->labelIn() }}@if ($field->required) *@endif</span>
                @if ($field->type === 'textarea')
                    <textarea id="form-{{ $component->form->handle }}-{{ $field->handle }}" name="data[{{ $field->handle }}]" @required($field->required)>{{ $component->old($field->handle) }}</textarea>
                @else
                    <input id="form-{{ $component->form->handle }}-{{ $field->handle }}" type="{{ $field->type === 'number' ? 'number' : (in_array('email', (array) ($field->config['validation'] ?? $field->toArray()['validation'] ?? []), true) ? 'email' : 'text') }}" name="data[{{ $field->handle }}]" value="{{ is_scalar($old = $component->old($field->handle)) ? $old : '' }}" @required($field->required)>
                @endif
                @if ($error = $component->error($field->handle))
                    <span class="error">{{ $error }}</span>
                @endif
            </label>
        @endif
    @endforeach
    <button type="submit" class="commerce-button">{{ __('commerce::storefront.product.send_inquiry') }}</button>
</x-sunrice-cms::form>
