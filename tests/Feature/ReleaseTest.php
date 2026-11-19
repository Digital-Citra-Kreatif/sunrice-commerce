<?php

declare(strict_types=1);

/*
 * Commerce installs from Packagist with stable Sunrice releases, and
 * .github/workflows/release.yml tags a version that CHANGELOG.md describes.
 */

it('requires stable Sunrice releases from Packagist', function () {
    $composer = json_decode((string) file_get_contents(__DIR__.'/../../composer.json'), true, flags: JSON_THROW_ON_ERROR);

    expect($composer)->not->toHaveKeys(['repositories', 'minimum-stability'])
        ->and($composer['require']['sunrice/admin'])->toMatch('/^\^\d+\.\d+$/')
        ->and($composer['require']['sunrice/cms'])->toBe($composer['require']['sunrice/admin']);
});

it('tags only versions the changelog describes', function () {
    $workflow = (string) file_get_contents(__DIR__.'/../../.github/workflows/release.yml');
    preg_match('/^## (\d+\.\d+\.\d+\S*) \((\d{4}-\d{2}-\d{2})\)$/m', (string) file_get_contents(__DIR__.'/../../CHANGELOG.md'), $latest);

    expect($workflow)->toContain('workflow_dispatch:')
        ->toContain('has no \"## ${VERSION} (date)\" section')
        ->toContain('git push origin "refs/tags/${tag}"')
        ->and($latest)->not->toBeEmpty();
});
