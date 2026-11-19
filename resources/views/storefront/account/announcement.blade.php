@extends(\Sunrice\Commerce\Storefront\Layout::view('account.layout'))

@section('account')
    <h1>{{ $announcement->title() }}</h1>
    <div class="commerce-account-announcement commerce-account-announcement--page">
        <p>{{ $announcement->message() }}</p>
    </div>
@endsection
