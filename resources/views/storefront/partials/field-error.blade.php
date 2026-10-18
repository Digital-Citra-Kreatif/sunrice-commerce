{{--
    A field's validation message. $name: the field name (dot notation).
--}}
@error($name)
    <span class="commerce-field__error" role="alert">{{ $message }}</span>
@enderror
