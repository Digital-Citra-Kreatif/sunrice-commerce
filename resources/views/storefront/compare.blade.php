{{--
    Product comparison. $entries: the products side by side, $fields: the compared attributes, $specLabels.
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.assets'))
    <section class="commerce-compare">
        <h1 class="commerce-page-title">{{ __('commerce::storefront.compare.title') }}</h1>
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.messages'))
        @if ($entries->isEmpty())
            @include(\Sunrice\Commerce\Storefront\Layout::view('partials.empty'), ['title' => __('commerce::storefront.compare.empty'), 'icon' => 'compare',
                'action' => ['url' => url(\Sunrice\Support\Locales::prefix(app()->getLocale()) ?: '/'), 'label' => __('commerce::storefront.cart.continue')]])
        @else
            @php($views = $entries->mapWithKeys(fn ($e) => [$e->id => commerce_product($e)]))
            <div class="commerce-compare__scroll">
                <table class="commerce-compare__table">
                    <thead>
                        <tr>
                            <td></td>
                            @foreach ($entries as $entry)
                                <th scope="col">
                                    @php($image = collect($entry->get('gallery') ?? [])->first())
                                    <a class="commerce-compare__product" href="{{ $entry->url }}">
                                        @if (is_object($image))<img src="{{ $image->url() }}" alt="" width="200" height="250" loading="lazy">@endif
                                        <span>{{ $entry->title }}</span>
                                    </a>
                                    <x-commerce::compare-button :entry="$entry" />
                                </th>
                            @endforeach
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">{{ __('commerce::storefront.listing.price') }}</th>
                            @foreach ($entries as $entry)
                                <td>@if ($views[$entry->id])@include(\Sunrice\Commerce\Storefront\Layout::view('partials.price'), ['product' => $views[$entry->id]])@endif</td>
                            @endforeach
                        </tr>
                        @foreach ($fields as $field)
                            <tr>
                                <th scope="row">{{ __('commerce::storefront.compare.fields.'.$field) }}</th>
                                @foreach ($entries as $entry)
                                    @php($view = $views[$entry->id])
                                    @php($variant = $view?->defaultVariant())
                                    <td>{{ match ($field) {
                                        'sku' => $view?->isVariable() ? '—' : ($variant?->sku ?? '—'),
                                        'stock' => $view?->stock['message'] ?? '—',
                                        'weight' => $variant?->weight ? number_format($variant->weight / 1000, 2, ',', '.').' kg' : '—',
                                        'dimensions' => $variant?->length ? ($variant->length / 10).' × '.($variant->width / 10).' × '.($variant->height / 10).' cm' : '—',
                                        'excerpt' => (string) ($entry->get('excerpt') ?? '—'),
                                        'brand', 'categories' => $entry->terms->filter(fn ($t) => $t->taxonomy?->handle === config($field === 'brand' ? 'commerce.catalog.brand_taxonomy' : 'commerce.catalog.category_taxonomy'))
                                            ->map(fn ($t) => $t->resolveFor(app()->getLocale())->name)->implode(', ') ?: '—',
                                        'attributes' => collect($view?->options ?? [])->map(fn ($o) => $o['name'].': '.collect($o['values'])->pluck('label')->implode(', '))->implode('; ') ?: '—',
                                        default => '—',
                                    } }}</td>
                                @endforeach
                            </tr>
                        @endforeach
                        @foreach ($specLabels as $label)
                            <tr>
                                <th scope="row">{{ $label }}</th>
                                @foreach ($entries as $entry)
                                    <td>{{ data_get(collect($entry->get('specifications') ?? [])->first(fn ($row) => mb_strtolower(trim((string) data_get($row, 'label', ''))) === mb_strtolower($label)), 'value') ?? '—' }}</td>
                                @endforeach
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endif
    </section>
@endsection
