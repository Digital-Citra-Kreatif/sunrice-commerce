<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Console;

use Illuminate\Console\Command;

/** commerce:publish-assets — republishes the prebuilt admin bundle (run after upgrades). */
class PublishAssetsCommand extends Command
{
    protected $signature = 'commerce:publish-assets';

    protected $description = 'Publish the Sunrice Commerce admin assets to public/vendor/commerce';

    public function handle(): int
    {
        return $this->call('vendor:publish', ['--tag' => 'commerce-assets', '--force' => true]);
    }
}
