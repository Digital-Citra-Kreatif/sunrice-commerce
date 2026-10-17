{{--
    Flash messages (commerce.success, commerce.error).
--}}
@if (session('commerce.success'))
    <p class="commerce-message commerce-message--success" role="status">{{ session('commerce.success') }}</p>
@endif
@if (session('commerce.error'))
    <p class="commerce-message commerce-message--error" role="alert">{{ session('commerce.error') }}</p>
@endif
