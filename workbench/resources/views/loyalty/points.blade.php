{{-- Fake loyalty: My Account → Points. --}}
@extends(\Sunrice\Commerce\Storefront\Layout::view('account.layout'))

@section('commerce-account')
    <h1>Points</h1>
    <p data-loyalty-balance>{{ $balance }} points</p>
@endsection
