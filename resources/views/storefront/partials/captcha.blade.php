@if (filled((string) ($captcha ?? '')))
    <div class="commerce-form__captcha" data-commerce-captcha="{{ app(\Sunrice\Admin\Security\Captcha::class)->field() }}">
        {{ $captcha }}
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => 'captcha'])
    </div>
@endif
