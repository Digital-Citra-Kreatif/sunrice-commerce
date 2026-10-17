@php($grants = (array) ($context['grants'] ?? []))
@php($attached = collect((new \Sunrice\Commerce\Notifications\StoreEmail($key, $order, null, null, $context, $lang))->attachableDownloads())->pluck('id')->all())
@foreach ($grants as $grant)
@php($modes = \Sunrice\Commerce\Notifications\DeliveryModes::for($grant))
@if (in_array($grant->id, $attached, true))
- {{ $grant->file->name }} — {{ __('commerce::emails.downloads_ready.attached') }}
@elseif (in_array('link', $modes, true) || in_array('attachment', $modes, true))
- [{{ $grant->file->name }}]({{ $grant->url() }})@if ($grant->expires_at) ({{ __('commerce::digital.expires', ['date' => $grant->expires_at->translatedFormat('j F Y')]) }})@endif
@else
- {{ $grant->file->name }} — {{ __('commerce::emails.downloads_ready.in_account') }}
@endif
@endforeach
