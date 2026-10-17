@extends(\Sunrice\Commerce\Storefront\Layout::view('account.layout'))

@section('account')
    <h1>{{ __('commerce::digital.title') }}</h1>
    @if ($grants->isEmpty())
        <p>{{ __('commerce::digital.none') }}</p>
    @else
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.downloads'), ['grants' => $grants])
    @endif
@endsection
