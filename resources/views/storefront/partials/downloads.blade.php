{{-- Download grants shown in My Account and on the order confirmation. --}}
<table class="commerce-account__orders commerce-downloads" aria-label="{{ __('commerce::digital.title') }}">
    <thead>
        <tr>
            <th scope="col">{{ __('commerce::digital.file') }}</th>
            <th scope="col">{{ __('commerce::digital.remaining_heading') }}</th>
            <th scope="col">{{ __('commerce::digital.expiry_heading') }}</th>
            <th scope="col" class="commerce-downloads__action"><span class="commerce-visually-hidden">{{ __('commerce::digital.download') }}</span></th>
        </tr>
    </thead>
    <tbody>
        @foreach ($grants as $grant)
            @php($refusal = $grant->refusal())
            <tr>
                <td class="commerce-downloads__name">{{ $grant->file->name }}</td>
                <td data-label="{{ __('commerce::digital.remaining_heading') }}">
                    {{ $grant->downloads_remaining ?? __('commerce::digital.unlimited') }}
                </td>
                <td data-label="{{ __('commerce::digital.expiry_heading') }}">
                    @if ($grant->expires_at)
                        <time datetime="{{ $grant->expires_at->toDateString() }}">{{ $grant->expires_at->translatedFormat('j M Y') }}</time>
                    @else
                        {{ __('commerce::digital.no_expiry') }}
                    @endif
                </td>
                <td class="commerce-downloads__action">
                    @if ($refusal === null)
                        <a href="{{ $grant->url() }}" class="commerce-button commerce-button--secondary" rel="nofollow">{{ __('commerce::digital.download') }}</a>
                    @else
                        <small>{{ __('commerce::digital.'.$refusal) }}</small>
                    @endif
                </td>
            </tr>
        @endforeach
    </tbody>
</table>
