<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Storefront;

/**
 * What `vendor:publish --tag=commerce-templates` copies into the app
 * (ARCHITECTURE.md §22.3): the product, shop and product term pages as
 * Sunrice templates, every other store page and partial under
 * resources/views/commerce (found first by Layout::view()), and the theme.
 */
final class Templates
{
    /** @return array<string, string> source => destination */
    public static function publishable(): array
    {
        $views = __DIR__.'/../../resources/views/storefront';
        $collections = (array) config('commerce.catalog.collections', ['products']);
        $map = [
            __DIR__.'/../../stubs/theme' => public_path('commerce-theme'),
            "{$views}/product.blade.php" => resource_path('views/sunrice/'.($collections[0] ?? 'products').'/show.blade.php'),
            "{$views}/shop.blade.php" => resource_path('views/sunrice/'.($collections[0] ?? 'products').'/index.blade.php'),
            "{$views}/category.blade.php" => resource_path('views/sunrice/taxonomies/'.config('commerce.catalog.category_taxonomy', 'product_categories').'/show.blade.php'),
            "{$views}/brand.blade.php" => resource_path('views/sunrice/taxonomies/'.config('commerce.catalog.brand_taxonomy', 'brands').'/show.blade.php'),
            "{$views}/tag.blade.php" => resource_path('views/sunrice/taxonomies/'.config('commerce.catalog.tag_taxonomy', 'product_tags').'/show.blade.php'),
        ];
        foreach (self::files($views) as $relative) {
            if (! in_array($relative, ['product.blade.php', 'shop.blade.php', 'category.blade.php', 'brand.blade.php', 'tag.blade.php'], true)) {
                $map["{$views}/{$relative}"] = resource_path('views/commerce/'.$relative);
            }
        }

        return $map;
    }

    /** @return array<int, string> paths relative to $dir */
    public static function files(string $dir): array
    {
        $out = [];
        $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($dir, \FilesystemIterator::SKIP_DOTS));
        foreach ($iterator as $file) {
            if ($file instanceof \SplFileInfo && str_ends_with($file->getFilename(), '.blade.php')) {
                $out[] = ltrim(str_replace('\\', '/', substr($file->getPathname(), strlen($dir))), '/');
            }
        }
        sort($out);

        return $out;
    }
}
