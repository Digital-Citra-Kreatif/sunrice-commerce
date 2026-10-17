{{-- A countdown to $until (ISO 8601). --}}
<span class="commerce-countdown" data-commerce-countdown="{{ $until }}">{{ \Illuminate\Support\Carbon::parse($until)->diffForHumans(syntax: \Carbon\CarbonInterface::DIFF_ABSOLUTE) }}</span>
@once
    @push('scripts')
        <script>
            (function () {
                var pad = function (n) { return String(n).padStart(2, '0'); };
                function tick() {
                    document.querySelectorAll('[data-commerce-countdown]').forEach(function (el) {
                        var left = Math.max(0, Math.floor((new Date(el.dataset.commerceCountdown) - Date.now()) / 1000));
                        var d = Math.floor(left / 86400), h = Math.floor(left % 86400 / 3600), m = Math.floor(left % 3600 / 60), s = left % 60;
                        el.textContent = (d > 0 ? d + 'd ' : '') + pad(h) + ':' + pad(m) + ':' + pad(s);
                    });
                }
                tick();
                setInterval(tick, 1000);
            })();
        </script>
    @endpush
@endonce
