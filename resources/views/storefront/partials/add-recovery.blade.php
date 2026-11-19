<div class="commerce-message commerce-message--error" role="alert" data-commerce-add-recovery hidden>
    {{ __('commerce::storefront.cart.add_unconfirmed') }}
    <a href="{{ commerce_url('commerce.cart') }}">{{ __('commerce::storefront.cart.view_cart') }}</a>
</div>
<template data-commerce-add-success-action>
    <a class="commerce-toast__cart" href="{{ commerce_url('commerce.cart') }}" aria-label="{{ __('commerce::storefront.cart.view_cart') }}">
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.icon'), ['name' => 'bag'])
    </a>
</template>
