<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Storefront;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Sunrice\Admin\Security\Captcha;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Customers\CurrentCustomer;
use Sunrice\Commerce\Reviews\Actions\SubmitReview;

/** POST /reviews/{product}: a review from the product page (honeypot, captcha for guests, 5 an hour per address). */
class ReviewsController extends Controller
{
    public function store(Request $request, Product $product, CurrentCustomer $current, SubmitReview $submit): RedirectResponse
    {
        abort_if($product->removed_at !== null, 404);
        $customer = $current->get();
        $data = $request->validate([
            'rating' => ['required', 'integer', 'between:1,5'],
            'title' => ['nullable', 'string', 'max:150'],
            'body' => ['required', 'string', 'min:10', 'max:5000'],
            'name' => [$customer === null ? 'required' : 'nullable', 'string', 'max:100'],
            'email' => [$customer === null ? 'required' : 'nullable', 'email', 'max:255'],
        ]);
        if ($customer === null && ! app(Captcha::class)->passes($request)) {
            return back()->withInput()->withErrors(['captcha' => __('commerce::storefront.reviews.captcha')]);
        }
        $review = $submit->handle($product, ['rating' => (int) $data['rating'], ...$data], $customer, $request->ip());

        return back()->withFragment('reviews')->with('commerce.success', __($review->status === 'approved'
            ? 'commerce::storefront.reviews.published' : 'commerce::storefront.reviews.thanks'));
    }
}
