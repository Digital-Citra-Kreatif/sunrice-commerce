<?php

declare(strict_types=1);

use Sunrice\Commerce\Regions\Countries;
use Sunrice\Commerce\Regions\Region;
use Sunrice\Commerce\Regions\RegionImporter;
use Sunrice\Commerce\Regions\RegionMapping;

function fixtureImporter(?string $dir = null): RegionImporter
{
    return new RegionImporter($dir ?? __DIR__.'/../../Fixtures/regions');
}

it('imports down to a level, idempotently', function () {
    expect(fixtureImporter()->import(2))->toBe([1 => 2, 2 => 2])
        ->and(Region::query()->count())->toBe(4);

    fixtureImporter()->import(4);
    fixtureImporter()->import(4);

    $village = Region::query()->findOrFail('32.73.01.1001');
    expect(Region::query()->count())->toBe(6)
        ->and($village->postal_code)->toBe('40151')
        ->and($village->parent->parent->name)->toBe('Kota Bandung')
        ->and(Region::query()->findOrFail('32.73')->kind)->toBe('kota');
});

it('marks codes that left the data inactive instead of deleting them', function () {
    fixtureImporter()->import(2);
    $dir = sys_get_temp_dir().'/regions-'.uniqid();
    mkdir($dir);
    foreach (['provinces.csv', 'districts.csv', 'villages.csv.gz'] as $file) {
        copy(__DIR__.'/../../Fixtures/regions/'.$file, "{$dir}/{$file}");
    }
    file_put_contents("{$dir}/cities.csv", "code,parent_code,name,kind,postal_code\n32.73,32,\"Kota Bandung (baru)\",kota,\n");

    fixtureImporter($dir)->import(2);

    expect(Region::query()->findOrFail('32.04')->active)->toBeFalse()
        ->and(Region::query()->findOrFail('32.73')->name)->toBe('Kota Bandung (baru)');
});

it('ships the full dataset', function () {
    $count = fn (string $file) => count(str_ends_with($file, '.gz') ? gzfile($file) : file($file)) - 1;
    $dir = __DIR__.'/../../../database/data/regions/';

    expect($count($dir.'provinces.csv'))->toBe(38)
        ->and($count($dir.'cities.csv'))->toBe(514)
        ->and($count($dir.'districts.csv'))->toBe(7285)
        ->and($count($dir.'villages.csv.gz'))->toBe(83762);
});

it('imports from the command', function () {
    $this->artisan('commerce:regions:import', ['--level' => 'city'])->assertSuccessful();
    expect(Region::query()->where('level', 2)->count())->toBe(514);

    $this->artisan('commerce:regions:import', ['--level' => 'nope'])->assertFailed();
});

it('finds the most specific carrier mapping and country names', function () {
    RegionMapping::query()->create(['provider' => 'demo', 'region_code' => '32.73', 'external_id' => 'BDG']);

    expect(RegionMapping::for('demo', '32.73.01.1001'))->toBe('BDG')
        ->and(RegionMapping::for('demo', '31'))->toBeNull()
        ->and(Countries::exists('id'))->toBeTrue()
        ->and(Countries::name('SG', 'en'))->toBe('Singapore')
        ->and(Region::lineage('32.73.01'))->toBe(['32', '32.73', '32.73.01']);
});
