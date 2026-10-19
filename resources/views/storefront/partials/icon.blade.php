{{--
    A 24 px line icon (inline SVG, decorative: give its link or button a
    text label). $name: search, user, heart, bag, menu, close, filter,
    chevron, arrow, compare, check, truck, store.
--}}
<svg class="commerce-icon commerce-icon--{{ $name }}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" aria-hidden="true" focusable="false">
    @switch($name)
        @case('search')<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/>@break
        @case('user')<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>@break
        @case('heart')<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" stroke-linecap="round" stroke-linejoin="round"/>@break
        @case('bag')<path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>@break
        @case('menu')<path d="M3 6h18M3 12h18M3 18h18"/>@break
        @case('close')<path d="M5 5l14 14M19 5 5 19"/>@break
        @case('filter')<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>@break
        @case('chevron')<path d="m6 9 6 6 6-6"/>@break
        @case('arrow')<path d="M4 12h15M14 6l6 6-6 6"/>@break
        @case('compare')<path d="M7 4v16M17 4v16M3 8h8M13 16h8"/>@break
        @case('check')<path d="m5 12 5 5 9-10"/>@break
        @case('truck')<path d="M2 6h12v10H2zM14 10h4l4 3v3h-8"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>@break
        @case('store')<path d="M4 9h16v11H4zM3 9l2-5h14l2 5M10 20v-6h4v6"/>@break
    @endswitch
</svg>
