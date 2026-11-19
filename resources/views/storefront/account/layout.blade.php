{{--
    My Account pages: the account menu beside the page. Extension pages
    (Commerce::registerAccountPage) can extend this layout without passing
    $navigation or $current: the menu comes from the registry and the
    current item from the route.
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::name())
@php($navigation ??= app(\Sunrice\Commerce\Customers\AccountNavigation::class)->items())
@php($announcement ??= app(\Sunrice\Commerce\Customers\AccountAnnouncement::class))
@php($announcementPosition = $announcement->position())
@php($current ??= collect($navigation)->first(fn ($item) => request()->routeIs($item['route'].'*'))['key'] ?? null)

@section('content')
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.assets'))
    <section class="commerce-account">
        @include(\Sunrice\Commerce\Storefront\Layout::view('account.navigation'))
        <div class="commerce-account__page">
            @include(\Sunrice\Commerce\Storefront\Layout::view('partials.messages'))
            @if ($announcementPosition === 'above')
                @include(\Sunrice\Commerce\Storefront\Layout::view('account.announcement-banner'))
            @endif
            @yield('account')
            @if ($announcementPosition === 'below')
                @include(\Sunrice\Commerce\Storefront\Layout::view('account.announcement-banner'))
            @endif
        </div>
    </section>
@endsection
