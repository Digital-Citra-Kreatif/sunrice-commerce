@if ($added)
    <form method="POST" action="{{ commerce_url('commerce.compare.remove', ['product' => $productId]) }}" class="commerce-compare-button">
        @csrf @method('DELETE')
        <button type="submit" aria-pressed="true">{{ __('commerce::storefront.compare.remove') }}</button>
    </form>
@else
    <form method="POST" action="{{ commerce_url('commerce.compare.add') }}" class="commerce-compare-button">
        @csrf
        <input type="hidden" name="product" value="{{ $productId }}">
        <button type="submit" aria-pressed="false">{{ __('commerce::storefront.compare.add') }}</button>
    </form>
@endif
