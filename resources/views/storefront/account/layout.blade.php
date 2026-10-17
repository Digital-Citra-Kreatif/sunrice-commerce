{{--
    My Account pages: the account menu beside the page. Extension pages
    (Commerce::registerAccountPage) can extend this layout without passing
    $navigation or $current: the menu comes from the registry and the
    current item from the route.
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::name())
@php($navigation ??= app(\Sunrice\Commerce\Customers\AccountNavigation::class)->items())
@php($current ??= collect($navigation)->first(fn ($item) => request()->routeIs($item['route'].'*'))['key'] ?? null)

@section('content')
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.assets'))
    <section class="commerce-account">
        <nav class="commerce-account__nav" aria-label="{{ __('commerce::account.overview.title') }}">
            <ul>
                @foreach ($navigation as $item)
                    <li><a href="{{ $item['url'] }}" @if ($item['key'] === $current) aria-current="page" @endif>{{ $item['label'] }}</a></li>
                @endforeach
            </ul>
            <form method="POST" action="{{ commerce_url('commerce.account.logout') }}">@csrf<button type="submit" class="commerce-link">{{ __('commerce::account.logout') }}</button></form>
        </nav>
        <div class="commerce-account__page">
            @include(\Sunrice\Commerce\Storefront\Layout::view('partials.messages'))
            @yield('account')
        </div>
    </section>
@endsection
