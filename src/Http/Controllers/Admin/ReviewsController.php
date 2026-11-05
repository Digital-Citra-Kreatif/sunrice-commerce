<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Sunrice\Cms\Models\EntryTranslation;
use Sunrice\Cms\Support\Locales;
use Sunrice\Commerce\Admin\SchemaForm;
use Sunrice\Commerce\Admin\Tables\Column;
use Sunrice\Commerce\Admin\Tables\TableQuery;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Reviews\Actions\DeleteReviews;
use Sunrice\Commerce\Reviews\Actions\ReplyToReview;
use Sunrice\Commerce\Reviews\Actions\SetReviewStatus;
use Sunrice\Commerce\Reviews\Models\Review;

/** Shop → Products → Reviews: approve, reject, reply to and delete product reviews. */
class ReviewsController extends Controller
{
    private const STATUS_LABELS = ['pending' => 'Waiting', 'approved' => 'Shown', 'rejected' => 'Rejected'];

    public function index(Request $request): Response
    {
        $this->guard();
        $table = TableQuery::for(Review::query())
            ->searchable(['name', 'email', 'title', 'body'])
            ->filter('status', fn (Builder $q, string $v) => $q->where('status', $v))
            ->filter('rating', fn (Builder $q, string $v) => $q->where('rating', (int) $v))
            ->filter('verified', fn (Builder $q, string $v) => $v === 'yes' ? $q->whereNotNull('order_id') : $q->whereNull('order_id'))
            ->sortable(['created_at', 'rating'])->apply($request);
        $rows = $table->defaultPerPage(25)->paginate($request);
        $reviews = $rows->getCollection();
        // The products' names: two queries for the page.
        $entryIds = Product::query()->whereIn('id', $reviews->pluck('product_id')->unique())->pluck('entry_id', 'id');
        $titles = EntryTranslation::query()->where('locale', Locales::default())->whereIn('entry_id', $entryIds->values())->pluck('title', 'entry_id');

        return Inertia::render('Commerce/Shared/ResourceIndex', [
            'title' => 'Reviews',
            'description' => 'Product reviews from customers. They show on the product page once approved.',
            'createUrl' => null,
            'bulkUrl' => route('sunrice.admin.commerce.reviews.bulk', [], false),
            ...$this->tableProps('commerce-reviews', $table, [
                new Column('review', 'Review'),
                new Column('product', 'Product'),
                new Column('rating', 'Rating', sortable: true),
                new Column('name', 'By'),
                new Column('status', 'Status', type: 'badge'),
                new Column('created_at', 'Written', sortable: true),
            ], $rows->through(fn (Model $r) => $r instanceof Review ? [
                'id' => $r->id,
                'href' => "commerce/reviews/{$r->id}",
                'review' => Str::limit($r->title ?? $r->body, 80),
                'product' => (string) ($titles[$entryIds[$r->product_id] ?? 0] ?? "#{$r->product_id}"),
                'rating' => str_repeat('★', $r->rating).str_repeat('☆', 5 - $r->rating),
                'name' => $r->name.($r->verified() ? ' (verified purchase)' : ''),
                'status' => self::STATUS_LABELS[$r->status] ?? $r->status,
                'status_tone' => match ($r->status) {
                    'approved' => 'ok', 'pending' => 'warning', default => 'neutral'
                },
                'created_at' => $r->created_at?->isoFormat('D MMM YYYY'),
            ] : []), [
                ['key' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => array_map(fn (string $k, string $l) => ['value' => $k, 'label' => $l], array_keys(self::STATUS_LABELS), self::STATUS_LABELS)],
                ['key' => 'rating', 'label' => 'Rating', 'type' => 'select', 'options' => array_map(fn (int $r) => ['value' => (string) $r, 'label' => str_repeat('★', $r)], [5, 4, 3, 2, 1])],
                ['key' => 'verified', 'label' => 'Purchase', 'type' => 'select', 'options' => [['value' => 'yes', 'label' => 'Verified'], ['value' => 'no', 'label' => 'Not verified']]],
            ], [
                ['key' => 'approved', 'label' => 'Approve'],
                ['key' => 'rejected', 'label' => 'Reject'],
                ['key' => 'delete', 'label' => 'Delete', 'variant' => 'destructive', 'confirm' => 'Delete the selected reviews for good?'],
            ]),
        ]);
    }

    public function bulk(Request $request, SetReviewStatus $status, DeleteReviews $delete): RedirectResponse
    {
        $this->guard();
        $data = $request->validate([
            'action' => ['required', Rule::in(['approved', 'rejected', 'delete'])],
            'ids' => ['required', 'array', 'max:200'],
            'ids.*' => ['integer'],
        ]);
        $reviews = Review::query()->whereIn('id', $data['ids'])->get();
        $done = $data['action'] === 'delete' ? $delete->handle($reviews) : $status->handle($reviews, $data['action']);

        return back()->with('success', $done === 1 ? '1 review updated.' : "{$done} reviews updated.");
    }

    public function edit(Review $review): Response
    {
        $this->guard();
        $product = $review->product()->first();
        $title = $product === null ? null : EntryTranslation::query()->where('entry_id', $product->entry_id)->where('locale', Locales::default())->value('title');

        return Inertia::render('Commerce/Shared/SchemaForm', [
            'title' => "Review by {$review->name}",
            // What the customer wrote, with the product and when.
            'description' => str_repeat('★', $review->rating).' · '.($title ?? "Product #{$review->product_id}").($review->verified() ? ' · verified purchase' : '')
                .' · '.$review->created_at?->isoFormat('D MMM YYYY').($review->email ? " · {$review->email}" : '')
                .' — '.($review->title ? "{$review->title}: " : '').$review->body,
            'form' => SchemaForm::make([
                ['handle' => 'status', 'type' => 'select', 'label' => 'Status', 'required' => true, 'config' => ['options' => array_map(fn (string $k, string $l) => ['value' => $k, 'label' => $l], array_keys(self::STATUS_LABELS), self::STATUS_LABELS)]],
                ['handle' => 'reply', 'type' => 'textarea', 'label' => 'Your reply', 'instructions' => 'Shown under the review, as from the store.', 'validation' => ['max:5000']],
            ], ['status' => $review->status, 'reply' => $review->reply])
                ->action(route('sunrice.admin.commerce.reviews.update', $review, false), 'put'),
            'breadcrumbs' => [['label' => 'Shop', 'href' => 'commerce'], ['label' => 'Reviews', 'href' => 'commerce/reviews']],
            'deleteUrl' => "commerce/reviews/{$review->id}",
        ]);
    }

    public function update(Request $request, Review $review, ReplyToReview $reply): RedirectResponse
    {
        $this->guard();
        $data = $request->validate([
            'values.status' => ['required', Rule::in(Review::STATUSES)],
            'values.reply' => ['nullable', 'string', 'max:5000'],
        ]);
        $reply->handle($review, $data['values']['reply'] ?? null, $data['values']['status']);

        return back()->with('success', 'Review saved.');
    }

    public function destroy(Review $review, DeleteReviews $delete): RedirectResponse
    {
        $this->guard();
        $delete->handle([$review]);

        return redirect()->route('sunrice.admin.commerce.reviews')->with('success', 'Review deleted.');
    }

    protected function guard(): void
    {
        $this->authorizeFeature('reviews');
        $this->authorize('commerce.reviews.manage');
    }
}
