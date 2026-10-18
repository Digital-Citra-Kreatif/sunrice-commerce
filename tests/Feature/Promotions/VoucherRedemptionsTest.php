<?php

declare(strict_types=1);

use Sunrice\Commerce\Pricing\PricingContext;
use Sunrice\Commerce\Promotions\Vouchers\Voucher;
use Sunrice\Commerce\Promotions\Vouchers\VoucherRedemptions;

it('counts uses under the limits and releases them', function () {
    $voucher = Voucher::query()->create(['name' => 'X', 'code' => 'x1', 'type' => 'percent', 'value' => 1000, 'usage_limit' => 2, 'usage_limit_per_customer' => 1]);
    $redemptions = app(VoucherRedemptions::class);
    $ana = new PricingContext(email: 'ana@example.com');
    $budi = new PricingContext(email: 'BUDI@example.com');
    $cici = new PricingContext(email: 'cici@example.com');

    expect($voucher->code)->toBe('X1')
        ->and($redemptions->redeem($voucher, 1, 5000, $ana))->toBeTrue()
        ->and($redemptions->redeem($voucher, 2, 5000, $ana))->toBeFalse()   // per customer
        ->and($redemptions->redeem($voucher, 3, 5000, $budi))->toBeTrue()
        ->and($redemptions->redeem($voucher, 4, 5000, $cici))->toBeFalse()  // used up
        ->and($voucher->fresh()->times_used)->toBe(2);

    $redemptions->release(3);
    $redemptions->release(3);
    expect($voucher->fresh()->times_used)->toBe(1)
        ->and($redemptions->redeem($voucher, 5, 5000, $cici))->toBeTrue();
});
