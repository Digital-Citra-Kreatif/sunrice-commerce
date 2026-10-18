{{-- Fake loyalty: the "use points" control in the checkout slot checkout.after_payment (inside the checkout form). --}}
@php($customer = app(\Sunrice\Commerce\Commerce::class)->customer())
@if ($customer)
    @php($using = (bool) ($customer->meta['loyalty_use'] ?? false))
    <div class="loyalty-checkout" data-loyalty>
        <p>You have {{ \Workbench\App\Commerce\FakeLoyalty::balance($customer->id) }} points.</p>
        <button type="submit" formaction="{{ route('loyalty.use') }}" name="use" value="{{ $using ? 0 : 1 }}" class="commerce-button commerce-button--secondary">
            {{ $using ? 'Don\'t use my points' : 'Use my points' }}
        </button>
    </div>
@endif
