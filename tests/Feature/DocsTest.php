<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Blade;
use Sunrice\Commerce\Commerce;
use Symfony\Component\Finder\Finder;

/*
 * Every public name is documented (EXECUTION_PLAN.md C16.2): the Commerce
 * API, helpers, Blade components, contracts, config keys and commands are
 * compared with docs/. Events and slots: tests/Feature/Extensions/DocsTest.php.
 */

function doc(string $file): string
{
    return (string) file_get_contents(__DIR__.'/../../docs/'.$file);
}

it('documents every public method of the Commerce API', function () {
    $docs = doc('extending.md');
    $methods = collect((new ReflectionClass(Commerce::class))->getMethods(ReflectionMethod::IS_PUBLIC))
        ->reject(fn (ReflectionMethod $m) => $m->isConstructor() || $m->isStatic() || in_array($m->getName(), ['tickSteps', 'pruneSteps'], true))
        ->map(fn (ReflectionMethod $m) => $m->getName());

    foreach ($methods as $method) {
        expect($docs)->toContain($method.'(');
    }
});

it('documents every helper', function () {
    $docs = doc('helpers.md');
    preg_match_all('/function (commerce_[a-z_]+)\(/', (string) file_get_contents(__DIR__.'/../../src/helpers.php'), $m);

    expect($m[1])->not->toBeEmpty();
    foreach ($m[1] as $helper) {
        expect($docs)->toContain($helper.'(');
    }
});

it('documents every Blade component', function () {
    $docs = doc('blade-components.md');
    $components = collect(Blade::getClassComponentAliases())->keys()->filter(fn (string $alias) => str_starts_with($alias, 'commerce::'));

    expect($components)->not->toBeEmpty();
    foreach ($components as $alias) {
        expect($docs)->toContain('<x-'.$alias);
    }
});

it('documents every contract', function () {
    $docs = doc('extending.md');
    $contracts = collect(Finder::create()->files()->in(__DIR__.'/../../src')->name('*.php'))
        ->filter(fn ($file) => str_contains($file->getContents(), "\ninterface "))
        ->map(fn ($file) => $file->getBasename('.php'))->values();

    expect($contracts)->not->toBeEmpty();
    foreach ($contracts as $contract) {
        expect($docs)->toContain($contract);
    }
});

it('documents every config key', function () {
    $docs = doc('configuration.md');
    foreach (config('commerce') as $group => $values) {
        if ($group === 'defaults') {
            expect($docs)->toContain('`defaults.');

            continue;
        }
        foreach (array_keys((array) $values) as $key) {
            expect($docs)->toContain("`{$group}.{$key}");
        }
    }
});

it('documents every command', function () {
    $docs = doc('commands.md');
    $commands = collect(Artisan::all())->keys()->filter(fn (string $name) => str_starts_with($name, 'commerce:'));

    expect($commands)->not->toBeEmpty();
    foreach ($commands as $command) {
        expect($docs)->toContain("`{$command}`");
    }
});

it('links every docs page from the README, and no link is broken', function () {
    $readme = (string) file_get_contents(__DIR__.'/../../README.md');
    foreach (Finder::create()->files()->in(__DIR__.'/../../docs')->name('*.md') as $file) {
        expect($readme)->toContain('docs/'.$file->getFilename());
        preg_match_all('/\]\(([a-z-]+\.md)(#[a-z0-9-]+)?\)/', $file->getContents(), $links);
        foreach ($links[1] as $target) {
            expect(is_file(__DIR__.'/../../docs/'.$target))->toBeTrue("{$file->getFilename()} links to missing {$target}");
        }
    }
});
