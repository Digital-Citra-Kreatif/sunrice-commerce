<?php

declare(strict_types=1);

use Sunrice\Cms\Models\Blueprint;
use Sunrice\Cms\Models\Collection;
use Sunrice\Cms\Models\EntryTranslation;
use Sunrice\Cms\Models\Form;
use Sunrice\Cms\Models\Menu;
use Sunrice\Cms\Models\Taxonomy;
use Sunrice\Commerce\Catalog\Actions\ScaffoldStore;

it('creates the store structure, then reports nothing to do', function () {
    $this->artisan('commerce:scaffold')->assertSuccessful();

    $products = Collection::query()->where('handle', 'products')->firstOrFail();
    expect($products->blueprint)->toBe('product')
        ->and(collect(Blueprint::query()->where('handle', 'product')->value('fields'))->firstWhere('handle', 'product')['type'])->toBe('commerce_product')
        ->and($products->taxonomies()->pluck('handle')->sort()->values()->all())->toBe(['brands', 'product_categories', 'product_tags'])
        ->and(Taxonomy::query()->where('handle', 'product_categories')->value('hierarchical'))->toBeTruthy()
        ->and(Form::query()->where('handle', 'product_inquiry')->exists())->toBeTrue()
        ->and(Menu::query()->where('handle', 'shop')->exists())->toBeTrue()
        ->and(EntryTranslation::query()->count())->toBe(0); // no pages collection: no legal pages

    $this->artisan('commerce:scaffold')->expectsOutputToContain('nothing to do')->assertSuccessful();
});

it('keeps a changed product blueprint unless forced', function () {
    app(ScaffoldStore::class)->handle();
    $blueprint = Blueprint::query()->where('handle', 'product')->firstOrFail();
    $blueprint->update(['title' => 'Item']);

    $report = app(ScaffoldStore::class)->handle();
    expect($report->status('blueprint', 'product'))->toBe(ScaffoldStore::KEPT)
        ->and($blueprint->fresh()->title)->toBe('Item');

    $this->artisan('commerce:scaffold --force')->assertSuccessful();
    expect($blueprint->fresh()->title)->toBe('Product');
});

it('writes nothing on a dry run', function () {
    $this->artisan('commerce:scaffold --dry-run')->assertSuccessful();

    expect(Collection::query()->where('handle', 'products')->exists())->toBeFalse();
});

it('adds legal pages as drafts when a pages collection exists', function () {
    Blueprint::query()->create(['handle' => 'page', 'title' => 'Page', 'fields' => [['handle' => 'body', 'type' => 'rich_text', 'label' => 'Body']]]);
    Collection::query()->create(['handle' => 'pages', 'title' => 'Pages', 'blueprint' => 'page', 'route' => '/{slug}']);

    app(ScaffoldStore::class)->handle();

    $privacy = EntryTranslation::query()->where('draft_slug', 'kebijakan-privasi')->firstOrFail();
    expect($privacy->status())->toBe('draft')
        ->and($privacy->draft_data['body'])->toContain('<h2>');
    expect(EntryTranslation::query()->count())->toBe(4);
});
