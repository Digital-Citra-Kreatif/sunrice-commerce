{{--
    A content page of the `pages` collection (About, Help, the legal
    pages) in the starter look. Fields: `intro` (textarea), `image`
    (media), `body` (rich text). $entry (an EntryTranslation), $values,
    $collection, $locale.
--}}
@extends('cms.layout')

@section('content')
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.assets'))
    <article class="commerce-page"{!! cms_page()?->langAttribute() !!}>
        <header class="commerce-page__header">
            <h1 class="commerce-page__title">{{ $title ?? $entry->title }}</h1>
            @if (filled($values['intro'] ?? null))
                <p class="commerce-page__intro">{{ $values['intro'] }}</p>
            @endif
        </header>
        @php($image = $values['image'] ?? null)
        @if (is_object($image))
            <img class="commerce-page__image" src="{{ $image->url() }}" alt="{{ $image->altIn() ?? '' }}" width="1600" height="600">
        @endif
        @if (filled($body = $values['body'] ?? null))
            {{-- Rich text is cleaned when it's saved. --}}
            <div class="commerce-prose">{!! $body !!}</div>
        @endif
    </article>
@endsection
