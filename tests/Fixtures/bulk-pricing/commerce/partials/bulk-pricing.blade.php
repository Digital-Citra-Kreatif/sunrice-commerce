@foreach ($tiers as $tier)
    <p>Bulk tier: {{ $tier['min_qty'] }} pcs at {{ $tier['price'] }}</p>
@endforeach
