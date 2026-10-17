@if ($variant)
**{{ $variant->product->entry()?->translations()->value('title') }}**@if ($variant->title) ({{ $variant->title }})@endif · SKU {{ $variant->sku ?? '—' }} · {{ (int) $variant->fresh()?->stock_quantity }}
@endif
