<table class="lines">
    <thead><tr>
        <th>{{ __('commerce::documents.item') }}</th><th>SKU</th><th class="num">{{ __('commerce::documents.qty') }}</th>
        @if ($prices)<th class="num">{{ __('commerce::documents.price') }}</th><th class="num">{{ __('commerce::documents.amount') }}</th>@endif
    </tr></thead>
    <tbody>
        @foreach ($order->items->whereNull('parent_id') as $item)
            <tr>
                <td>{{ $item->title() }}
                    @foreach ($item->children as $child)<br><span class="small muted">{{ $child->quantity }} × {{ $child->title() }}</span>@endforeach
                </td>
                <td>{{ $item->sku }}</td>
                <td class="num">{{ $item->quantity }}</td>
                @if ($prices)<td class="num">{{ $money->format($item->unit_price) }}</td><td class="num">{{ $money->format($item->subtotal) }}</td>@endif
            </tr>
        @endforeach
    </tbody>
</table>
