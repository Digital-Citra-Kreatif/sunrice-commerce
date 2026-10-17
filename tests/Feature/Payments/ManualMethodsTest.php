<?php

declare(strict_types=1);

use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Checkout\Actions\PlaceOrder;
use Sunrice\Commerce\Checkout\CheckoutData;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Payments\PaymentContext;
use Sunrice\Commerce\Payments\PaymentManager;
use Sunrice\Commerce\Payments\UniqueCodes;
use Sunrice\Commerce\Settings\StoreSettings;

beforeEach(function () {
    $this->mug = checkoutStore(['initial_stock' => 50]);
    app(StoreSettings::class)->saveSection('payments', ['methods' => [
        'bank_transfer' => ['active' => true, 'unique_code' => 'add', 'unique_min' => 1, 'unique_max' => 3, 'confirmation' => 'required',
            'accounts' => [['bank' => 'bca', 'number' => '1234567890', 'holder' => 'PT Toko']], 'instructions' => ['id' => 'Transfer ke rekening berikut.']],
        'cod' => ['active' => true, 'provinces' => ['32'], 'fee_fixed' => 5000],
    ]]);
    app()->forgetScopedInstances();
});

function placeWith(Variant $mug, string $method, array $input = []): Order
{
    app()->forgetScopedInstances();
    $cart = cartWith([[$mug, 1]]);

    return app(PlaceOrder::class)->handle($cart, CheckoutData::fromCart($cart)->merge(checkoutInput(['payment_method' => $method, ...$input])), null)->order;
}

it('gives each open bank transfer order a distinct amount', function () {
    $totals = [];
    foreach (range(1, 3) as $i) {
        $order = placeWith($this->mug, 'bank_transfer', ['email' => "c{$i}@example.com"]);
        $totals[] = $order->total;
        $code = $order->adjustments->firstWhere('kind', 'unique_code')->amount;
        expect($code)->toBeBetween(1, 3)->and($order->total)->toBe(60000 + $code)->and($order->payments->sole()->amount)->toBe($order->total);
    }
    expect(array_unique($totals))->toHaveCount(3);

    // All codes taken: after 20 tries any value is used.
    expect(app(UniqueCodes::class)->pick(60000, ['min' => 1, 'max' => 3, 'direction' => 'add'], 'bank_transfer'))->toBeBetween(1, 3)
        ->and(app(UniqueCodes::class)->pick(60000, ['min' => 1, 'max' => 3, 'direction' => 'subtract'], 'bank_transfer'))->toBeBetween(-3, -1);
});

it('keeps the instructions as they were when the order was placed', function () {
    $order = placeWith($this->mug, 'bank_transfer');
    app(StoreSettings::class)->saveSection('payments', ['methods' => ['bank_transfer' => ['active' => true, 'accounts' => [['bank' => 'mandiri', 'number' => '999', 'holder' => 'X']]]]]);

    $snapshot = $order->payments->sole()->instructions;
    expect($snapshot['accounts'][0])->toMatchArray(['bank' => 'BCA', 'number' => '1234567890', 'holder' => 'PT Toko'])
        ->and($snapshot['confirmation'])->toBe('required')
        ->and($snapshot['instructions'])->toBe('Transfer ke rekening berikut.');
    $this->get($order->url())->assertSee('1234567890')->assertDontSee('999');
});

it('starts cash on delivery as processing and unpaid, with its fee', function () {
    $order = placeWith($this->mug, 'cod');
    expect([$order->status, $order->payment_status, $order->expires_at])->toBe(['processing', 'unpaid', null])
        ->and($order->fee_total)->toBe(5000)->and($order->total)->toBe(65000);
});

it('offers methods by their availability rules', function () {
    $keys = fn (array $destination, bool $shipping = true, int $amount = 60000) => array_keys(app(PaymentManager::class)->available(new PaymentContext($amount, destination: $destination, needsShipping: $shipping)));
    expect($keys(['country' => 'ID', 'province_code' => '32']))->toBe(['bank_transfer', 'cod'])
        ->and($keys(['country' => 'ID', 'province_code' => '31']))->toBe(['bank_transfer'])
        ->and($keys(['country' => 'ID', 'province_code' => '32'], false))->toBe(['bank_transfer']);

    app(StoreSettings::class)->saveSection('payments', ['methods' => [...(array) app(StoreSettings::class)->get('payments.methods'),
        'bank_transfer' => [...(array) app(StoreSettings::class)->get('payments.methods.bank_transfer'), 'min_total' => 100000]]]);
    app()->forgetScopedInstances();
    expect($keys(['country' => 'ID', 'province_code' => '32']))->toBe(['cod']);

    app(ToggleFeature::class)->handle('manual_payments', false);
    app()->forgetScopedInstances();
    expect($keys(['country' => 'ID', 'province_code' => '32']))->toBe([]);
});
