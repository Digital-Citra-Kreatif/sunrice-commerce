<?php

declare(strict_types=1);

use Symfony\Component\Finder\Finder;

/* docs/extending.md lists every event and storefront slot (EXECUTION_PLAN.md C15.1). */

it('documents every event', function () {
    $docs = file_get_contents(__DIR__.'/../../../docs/extending.md');
    $events = collect(Finder::create()->files()->in(__DIR__.'/../../../src')->path('/Events\//')->name('*.php'))
        ->map(fn ($file) => $file->getBasename('.php'))->values();

    expect($events)->not->toBeEmpty();
    foreach ($events as $event) {
        expect($docs)->toContain($event);
    }
});

it('documents every storefront slot', function () {
    $docs = file_get_contents(__DIR__.'/../../../docs/extending.md');
    $slots = [];
    foreach (Finder::create()->files()->in(__DIR__.'/../../../resources/views')->name('*.blade.php') as $file) {
        preg_match_all('/<x-commerce::slot name="([^"]+)"/', $file->getContents(), $m);
        array_push($slots, ...$m[1]);
    }

    expect($slots)->not->toBeEmpty();
    foreach (array_unique($slots) as $slot) {
        expect($docs)->toContain("| `{$slot}` |");
    }
});
