{{-- $order, $returns and $returnable: the return history and eligibility. --}}
@php($L = \Sunrice\Commerce\Storefront\Layout::class)
@foreach ($returns as $return)
    <p class="commerce-return">{{ __('commerce::account.returns.line', ['number' => $return->number(), 'status' => __('commerce::account.returns.statuses.'.$return->status), 'date' => $return->created_at?->translatedFormat('j F Y')]) }}
        @if ($return->note)<br><small>{{ $return->note }}</small>@endif</p>
@endforeach
@if ($returnable !== null)
    @php($lines = $order->items->whereNull('parent_id')->keyBy('id'))
    <details class="commerce-accordion commerce-return-form" @if ($errors->hasAny(['items', 'items.*', 'reason', 'details', 'return'])) open @endif>
        <summary>{{ __('commerce::account.returns.request') }}</summary>
        <form class="commerce-return-form__fields" method="POST" action="{{ commerce_url('commerce.account.orders.return', ['order' => $order->id]) }}">@csrf
            @include($L::view('partials.field-error'), ['name' => 'return'])
            <fieldset class="commerce-return-form__items">
                <legend>{{ __('commerce::account.returns.items') }}</legend>
                @foreach ($returnable as $itemId => $max)
                    <div class="commerce-return-form__row">
                        <label for="return-{{ $itemId }}">{{ $lines[$itemId]?->title() }}</label>
                        <div class="commerce-return-form__quantity">
                            <input id="return-{{ $itemId }}" type="number" name="items[{{ $itemId }}]" min="0" max="{{ $max }}"
                                value="{{ old('items.'.$itemId, 0) }}" inputmode="numeric" aria-describedby="return-limit-{{ $itemId }}">
                            <small id="return-limit-{{ $itemId }}">{{ __('commerce::account.returns.of', ['count' => $max]) }}</small>
                        </div>
                        @include($L::view('partials.field-error'), ['name' => 'items.'.$itemId])
                    </div>
                @endforeach
                @include($L::view('partials.field-error'), ['name' => 'items'])
            </fieldset>
            <label class="commerce-field" for="return-reason"><span>{{ __('commerce::account.returns.reason') }}</span>
                <select id="return-reason" name="reason" required>
                    <option value="" disabled @selected(!old('reason'))>{{ __('commerce::account.returns.choose_reason') }}</option>
                    @foreach (\Sunrice\Commerce\Returns\Models\ReturnRequest::REASONS as $reason)
                        <option value="{{ $reason }}" @selected(old('reason') === $reason)>{{ __('commerce::account.returns.reasons.'.$reason) }}</option>
                    @endforeach
                </select>
                @include($L::view('partials.field-error'), ['name' => 'reason'])
            </label>
            <label class="commerce-field" for="return-details"><span>{{ __('commerce::account.returns.details') }}</span>
                <textarea id="return-details" name="details" rows="3" maxlength="2000">{{ old('details') }}</textarea>
                @include($L::view('partials.field-error'), ['name' => 'details'])
            </label>
            <button type="submit" class="commerce-button commerce-button--primary">{{ __('commerce::account.returns.submit') }}</button>
        </form>
    </details>
@endif
