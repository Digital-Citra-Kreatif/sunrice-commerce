{{--
    The product inquiry form (Sunrice form "product_inquiry"). $product: ProductView.
--}}
<x-sunrice::form :handle="config('commerce.catalog.inquiry_form')" class="commerce-inquiry__form">
    @foreach ($component->form->fields as $field)
        @if ($field['config']['hidden'] ?? false)
            <input type="hidden" name="{{ $field['handle'] }}" value="{{ match ($field['handle']) { 'product' => $entry->title, 'product_url' => url($entry->url ?? ''), default => '' } }}" @if ($field['handle'] === 'variant') data-commerce-inquiry-variant @endif>
        @else
            <label class="commerce-field">
                <span>{{ $field['label'] ?? $field['handle'] }}@if ($field['required'] ?? false) *@endif</span>
                @if ($field['type'] === 'textarea')
                    <textarea name="{{ $field['handle'] }}" @required($field['required'] ?? false)>{{ $component->old($field['handle']) }}</textarea>
                @else
                    <input type="{{ $field['type'] === 'number' ? 'number' : (in_array('email', (array) ($field['validation'] ?? []), true) ? 'email' : 'text') }}" name="{{ $field['handle'] }}" value="{{ $component->old($field['handle']) }}" @required($field['required'] ?? false)>
                @endif
                @if ($error = $component->error($field['handle']))
                    <span class="error">{{ $error }}</span>
                @endif
            </label>
        @endif
    @endforeach
</x-sunrice::form>
