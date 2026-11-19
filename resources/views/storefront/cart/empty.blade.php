@php($L = \Sunrice\Commerce\Storefront\Layout::class)
@include($L::view('partials.empty'), [
    'title' => __('commerce::storefront.cart.empty'),
    'text' => __('commerce::storefront.theme.cart_empty_text'),
    'icon' => 'bag',
    'action' => [
        'url' => $continueShopping ?? app(\Sunrice\Commerce\Storefront\ShoppingDestination::class)->url(),
        'label' => __('commerce::storefront.cart.continue'),
    ],
])
