<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Storefront;

use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Sunrice\Commerce\Cart\CartException;
use Sunrice\Commerce\Catalog\ProductQuery;
use Sunrice\Commerce\Storefront\Layout;
use Sunrice\Commerce\Storefront\StorefrontRoutes;
use Sunrice\Commerce\Wishlist\Wishlist;
use Sunrice\Commerce\Wishlist\WishlistManager;
use Sunrice\Models\Entry;

/** The wishlist page, add/remove (forms or JSON), sharing and the shared page. */
class WishlistController
{
    public function show(WishlistManager $wishlists): View
    {
        $wishlist = $wishlists->current();

        return view(Layout::view('wishlist'), [
            'wishlist' => $wishlist,
            'products' => $this->products($wishlist),
            'shareUrl' => $wishlist?->is_shared ? StorefrontRoutes::url('commerce.wishlist.shared', ['token' => $wishlist->share_token]) : null,
            'seoTitle' => __('commerce::storefront.wishlist.title'),
            'readOnly' => false,
        ]);
    }

    public function shared(string $token): View
    {
        $wishlist = Wishlist::query()->where('share_token', $token)->where('is_shared', true)->firstOrFail();

        return view(Layout::view('wishlist'), ['wishlist' => $wishlist, 'products' => $this->products($wishlist), 'shareUrl' => null,
            'seoTitle' => __('commerce::storefront.wishlist.title'), 'readOnly' => true]);
    }

    public function add(Request $request, WishlistManager $wishlists): RedirectResponse|JsonResponse
    {
        $data = $request->validate(['product' => ['required', 'integer'], 'variant' => ['nullable', 'integer']]);
        try {
            $wishlists->add((int) $data['product'], isset($data['variant']) ? (int) $data['variant'] : null);
        } catch (CartException $e) {
            return $this->respond($request, $e->getMessage(), false, $wishlists);
        }

        return $this->respond($request, __('commerce::storefront.wishlist.added'), true, $wishlists);
    }

    public function remove(Request $request, int $product, WishlistManager $wishlists): RedirectResponse|JsonResponse
    {
        $wishlists->remove($product, $request->filled('variant') ? (int) $request->input('variant') : null);

        return $this->respond($request, __('commerce::storefront.wishlist.removed'), true, $wishlists);
    }

    public function share(Request $request, WishlistManager $wishlists): RedirectResponse
    {
        $wishlists->share($request->boolean('on', true));

        return back()->with('commerce.success', __('commerce::storefront.wishlist.'.($request->boolean('on', true) ? 'shared' : 'unshared')));
    }

    /** @return Collection<int, Entry> */
    protected function products(?Wishlist $wishlist): Collection
    {
        if ($wishlist === null) {
            return collect();
        }
        $entryIds = $wishlist->items()->with('product:id,entry_id')->get()->pluck('product.entry_id')->filter()->unique()->values()->all();

        return $entryIds === [] ? collect() : ProductQuery::make()->entries($entryIds)->get(Wishlist::LIMIT);
    }

    protected function respond(Request $request, string $message, bool $ok, WishlistManager $wishlists): RedirectResponse|JsonResponse
    {
        if ($request->expectsJson()) {
            return response()->json(['message' => $message, 'count' => $wishlists->current()?->items()->count() ?? 0], $ok ? 200 : 422);
        }

        return back()->with($ok ? 'commerce.success' : 'commerce.error', $message);
    }
}
