@include('commerce::documents.partials.header', ['heading' => __('commerce::documents.quotation')])
@include('commerce::documents.partials.lines', ['prices' => true])
@include('commerce::documents.partials.totals')
@if ($footer)<div class="footer">{!! nl2br(e($footer)) !!}</div>@endif
