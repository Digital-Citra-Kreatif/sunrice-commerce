{{--
    The store's pages in My Account (orders, addresses, points…): the account
    package's layout (its menu, messages and announcement) around the page,
    with the store's styles and messages. Pages extend this view and fill
    @section('account'); extensions' pages (Commerce::registerAccountPage)
    do the same.
--}}
@extends(\Sunrice\Account\View\Layout::view('layout'))

@section('account')
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.assets'))
    <div class="commerce-account__page">
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.messages'))
        @yield('commerce-account')
    </div>
@endsection
