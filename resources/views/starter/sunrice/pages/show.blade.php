{{--
    A content page of the `pages` collection (About, Help, the legal
    pages) in the starter look. Fields: `intro` (textarea), `image`
    (asset), `body` (rich text). $entry, $collection, $locale.
--}}
@extends('sunrice.layouts.app')

@php($page = $sunricePage->entry ?? $entry)

@section('content')
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.assets'))
    <article class="commerce-page">
        <header class="commerce-page__header">
            <h1 class="commerce-page__title">{{ $page->title }}</h1>
            @if (filled($page->get('intro')))
                <p class="commerce-page__intro">{{ $page->get('intro') }}</p>
            @endif
        </header>
        @php($image = $page->get('image'))
        @if (is_object($image))
            <img class="commerce-page__image" src="{{ $image->url() }}" alt="{{ $image->alt ?? '' }}" width="1600" height="600">
        @endif
        @if (filled($body = $page->get('body')))
            <div class="commerce-prose">{!! $body !!}</div>
        @endif
    </article>
@endsection
