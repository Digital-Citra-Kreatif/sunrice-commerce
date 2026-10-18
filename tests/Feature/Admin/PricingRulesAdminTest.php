<?php

declare(strict_types=1);

use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Promotions\PriceRules\PriceRule;

it('creates, lists, edits and deletes a pricing rule', function () {
    actingAsSuperAdmin();
    $variant = Variant::factory()->create();

    $this->get('/cms/commerce/pricing-rules/create')->assertOk();
    $this->post('/cms/commerce/pricing-rules', ['values' => [
        'name' => 'Reseller', 'active' => true, 'audience' => 'roles', 'roles' => ['Reseller'], 'scope' => 'products',
        'targets' => [['type' => 'product', 'id' => $variant->product_id, 'label' => 'x'], ['type' => 'term', 'id' => 5, 'label' => 'ignored']],
        'quantity_basis' => 'product', 'priority' => 1,
        'tiers' => [['min_qty' => 12, 'type' => 'percent_off', 'percent' => 7.5], ['min_qty' => 1, 'type' => 'fixed_price', 'amount' => 45000]],
    ]])->assertSessionHasNoErrors()->assertRedirect();

    $rule = PriceRule::query()->firstOrFail();
    expect($rule->tiers)->toEqual([['min_qty' => 1, 'type' => 'fixed_price', 'value' => 45000], ['min_qty' => 12, 'type' => 'percent_off', 'value' => 750]])
        ->and($rule->targets->pluck('target_type')->all())->toBe(['product'])
        ->and($rule->roles)->toBe(['Reseller']);

    $this->get('/cms/commerce/pricing-rules')->assertOk()->assertSee('Reseller');
    $this->get("/cms/commerce/pricing-rules/{$rule->id}/edit")->assertOk();
    $this->put("/cms/commerce/pricing-rules/{$rule->id}", ['values' => ['name' => 'Reseller', 'active' => false, 'audience' => 'everyone', 'scope' => 'all',
        'quantity_basis' => 'variant', 'tiers' => [['min_qty' => 2, 'type' => 'amount_off', 'amount' => 1000]]]])->assertSessionHasNoErrors();
    expect($rule->fresh()->active)->toBeFalse()->and($rule->targets()->count())->toBe(0);

    $this->delete("/cms/commerce/pricing-rules/{$rule->id}")->assertRedirect();
    expect(PriceRule::query()->count())->toBe(0);
});

it('validates rules', function () {
    actingAsSuperAdmin();

    $this->post('/cms/commerce/pricing-rules', ['values' => ['name' => '', 'audience' => 'roles', 'scope' => 'categories', 'quantity_basis' => 'variant', 'tiers' => []]])
        ->assertSessionHasErrors(['values.name', 'values.roles', 'values.targets', 'values.tiers']);
    $this->post('/cms/commerce/pricing-rules', ['values' => ['name' => 'X', 'audience' => 'everyone', 'scope' => 'all', 'quantity_basis' => 'variant',
        'tiers' => [['min_qty' => 2, 'type' => 'percent_off', 'percent' => 150]]]])->assertSessionHasErrors(['values.tiers.0.percent']);
});

it('needs the permission and the module', function () {
    actingAsUserWith(['commerce.dashboard.view']);
    $this->get('/cms/commerce/pricing-rules')->assertForbidden();

    actingAsSuperAdmin();
    app(ToggleFeature::class)->handle('pricing_rules', false);
    $this->get('/cms/commerce/pricing-rules')->assertNotFound();
});
