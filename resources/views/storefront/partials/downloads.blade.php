{{-- Download links. $grants (DownloadGrant[]) --}}
<ul class="commerce-downloads">
    @foreach ($grants as $grant)
        <li>
            <span class="commerce-downloads__name">{{ $grant->file->name }}</span>
            @if ($grant->refusal() === null)
                <a href="{{ $grant->url() }}" class="commerce-button commerce-button--secondary" rel="nofollow">{{ __('commerce::digital.download') }}</a>
                @if ($grant->downloads_remaining !== null)<small>{{ __('commerce::digital.remaining', ['count' => $grant->downloads_remaining]) }}</small>@endif
                @if ($grant->expires_at)<small>{{ __('commerce::digital.expires', ['date' => $grant->expires_at->translatedFormat('j F Y')]) }}</small>@endif
            @else
                <small>{{ __('commerce::digital.'.$grant->refusal()) }}</small>
            @endif
        </li>
    @endforeach
</ul>
