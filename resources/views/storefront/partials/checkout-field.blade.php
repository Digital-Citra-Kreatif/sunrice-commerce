{{-- An extension checkout field: $field ['handle', 'label', 'type', 'options', 'instructions'] --}}
@php($name = 'fields['.$field['handle'].']')
@php($value = old('fields.'.$field['handle'], $data->get('fields.'.$field['handle'])))
@if ($field['type'] === 'checkbox')
    <label class="commerce-check"><input type="checkbox" name="{{ $name }}" value="1" @checked($value)> {{ $field['label'] }}</label>
@else
    <label class="commerce-field"><span>{{ $field['label'] }}</span>
        @if ($field['type'] === 'textarea')
            <textarea name="{{ $name }}" rows="3">{{ $value }}</textarea>
        @elseif ($field['type'] === 'select')
            <select name="{{ $name }}">
                <option value=""></option>
                @foreach ((array) ($field['options'] ?? []) as $optionValue => $optionLabel)
                    <option value="{{ $optionValue }}" @selected((string) $value === (string) $optionValue)>{{ $optionLabel }}</option>
                @endforeach
            </select>
        @else
            <input type="text" name="{{ $name }}" value="{{ $value }}">
        @endif
        @if (! empty($field['instructions']))<small>{{ $field['instructions'] }}</small>@endif
    </label>
@endif
@include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => 'fields.'.$field['handle']])
