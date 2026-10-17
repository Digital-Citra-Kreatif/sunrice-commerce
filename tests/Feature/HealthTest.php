<?php

declare(strict_types=1);

use Illuminate\Console\Scheduling\Schedule;
use Sunrice\Commerce\Facades\Commerce;
use Sunrice\Commerce\Health\HealthCheck;
use Sunrice\Commerce\Health\HealthRegistry;
use Sunrice\Commerce\Health\HealthResult;

class FailingCheck implements HealthCheck
{
    public function key(): string
    {
        return 'failing';
    }

    public function label(): string
    {
        return 'Failing';
    }

    public function run(): HealthResult
    {
        return HealthResult::error('Broken.', 'Fix it.');
    }
}

it('reports the scheduler stale until commerce:tick runs', function () {
    $scheduler = fn () => app(HealthRegistry::class)->run()['scheduler']['result']->status;

    expect($scheduler())->toBe(HealthResult::ERROR);
    $this->artisan('commerce:tick')->assertSuccessful();
    expect($scheduler())->toBe(HealthResult::OK);

    $this->travel(6)->minutes();
    expect($scheduler())->toBe(HealthResult::ERROR);
});

it('fails commerce:doctor on an error', function () {
    $this->artisan('commerce:tick');
    config(['mail.default' => 'smtp', 'mail.mailers.smtp.transport' => 'smtp']);
    $this->artisan('commerce:doctor')->assertSuccessful();

    Commerce::registerHealthCheck(FailingCheck::class);
    $this->artisan('commerce:doctor')->expectsOutputToContain('Broken.')->assertFailed();
});

it('runs registered tick and prune steps and schedules them', function () {
    $ran = [];
    Commerce::onTick('demo', function () use (&$ran) {
        $ran[] = 'tick';
    });
    Commerce::onPrune('demo', function () use (&$ran) {
        $ran[] = 'prune';

        return 3;
    });

    $this->artisan('commerce:tick')->assertSuccessful();
    $this->artisan('commerce:prune')->expectsOutputToContain('demo')->assertSuccessful();
    expect($ran)->toBe(['tick', 'prune']);

    $commands = collect(app(Schedule::class)->events())->map(fn ($e) => $e->command)->implode(' ');
    expect($commands)->toContain('commerce:tick')->toContain('commerce:prune');
});

it('warns while the full-page cache is on', function () {
    $status = fn () => app(HealthRegistry::class)->run()['full_page_cache']['result']->status;

    expect($status())->toBe(HealthResult::OK);
    config(['sunrice.cache.full_page' => true]);
    expect($status())->toBe(HealthResult::WARNING);
});
