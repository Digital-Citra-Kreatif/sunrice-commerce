<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog;

use Illuminate\Support\Str;
use Sunrice\Admin\Media\Media;
use Sunrice\Cms\Fields\Field;
use Sunrice\Cms\Fields\HydrationContext;
use Sunrice\Cms\Fields\Types\RichText;
use Sunrice\Cms\Models\EntryTranslation;
use Sunrice\Commerce\Settings\StoreSettings;

final class ProductContent
{
    public function __construct(private ProductDefaults $defaults, private StoreSettings $settings) {}

    /** @return array{specifications: list<array<string, mixed>>, faq: list<array<string, mixed>>, size_guide: string|null, video: array{type: string, url: string}|null} */
    public function forEntry(EntryTranslation $entry): array
    {
        $values = commerce_values($entry);
        $presentation = (array) ($values['commerce_presentation'] ?? []);
        $termIds = LiveEntries::previewing($entry) ? $entry->entry->draftTermIds() : null;

        $specifications = $this->rows($entry, 'specifications', $values, $presentation, $termIds);
        $faq = $this->rows($entry, 'faq', $values, $presentation, $termIds);
        $visibility = $this->resolve($entry, 'size_guide_visibility', $presentation, $termIds);
        $guide = $visibility['value'] === 'show' ? $this->resolve($entry, 'size_guide', $values, $termIds) : null;
        $html = $guide['value'] ?? null;
        if (is_string($html) && $guide['source'] !== 'product') {
            $type = new RichText;
            $field = new Field('size_guide', 'rich_text', 'Size guide');
            $html = $type->hydrate($type->normalize($html, $field), $field, new HydrationContext($entry->locale));
        }

        return [
            'specifications' => $specifications,
            'faq' => $faq,
            'size_guide' => is_string($html) && filled($html) ? $html : null,
            'video' => $this->video($presentation),
        ];
    }

    /** @return list<array<string, mixed>> */
    public function specifications(EntryTranslation $entry): array
    {
        $values = commerce_values($entry);

        return $this->rows($entry, 'specifications', $values, (array) ($values['commerce_presentation'] ?? []), null);
    }

    /**
     * @param  array<mixed>  $values
     * @param  array<mixed>  $presentation
     * @param  list<int>|null  $termIds
     * @return list<array<string, mixed>>
     */
    private function rows(EntryTranslation $entry, string $key, array $values, array $presentation, ?array $termIds): array
    {
        if (($presentation[$key.'_visibility'] ?? null) === 'hide') {
            return [];
        }

        $resolved = $this->resolve($entry, $key, $values, $termIds)['value'];

        return is_iterable($resolved) ? collect($resolved)->filter(self::visibleRow(...))->values()->all() : [];
    }

    public static function visibleRow(mixed $row): bool
    {
        return is_array($row) && ($row['_hidden'] ?? false) !== true;
    }

    /**
     * @param  array<mixed>  $values
     * @param  list<int>|null  $termIds
     * @return array{value: mixed, source: string, term_id: int|null}
     */
    private function resolve(EntryTranslation $entry, string $key, array $values, ?array $termIds): array
    {
        $value = $values[$key] ?? null;

        return $this->defaults->resolve($key, $entry->entry_id, filled($value) && $value !== 'inherit' ? $value : null, $this->settings->get('catalog.'.$key), $termIds);
    }

    /**
     * @param  array<mixed>  $presentation
     * @return array{type: string, url: string}|null
     */
    private function video(array $presentation): ?array
    {
        if (($presentation['video_source'] ?? null) === 'local') {
            $media = $presentation['video_file'] ?? null;

            return $media instanceof Media && str_starts_with($media->mime_type, 'video/') ? ['type' => 'local', 'url' => $media->url()] : null;
        }
        $url = $presentation['video_url'] ?? null;
        if (($presentation['video_source'] ?? null) !== 'external' || ! is_string($url) || ! Str::isUrl($url, ['https'])) {
            return null;
        }

        $host = strtolower((string) parse_url($url, PHP_URL_HOST));
        $path = trim((string) parse_url($url, PHP_URL_PATH), '/');
        $id = null;
        if ($host === 'youtu.be') {
            $id = $path;
        } elseif (in_array($host, ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'www.youtube-nocookie.com', 'youtube-nocookie.com'], true)) {
            if ($path === 'watch') {
                parse_str((string) parse_url($url, PHP_URL_QUERY), $query);
                $id = $query['v'] ?? null;
            } elseif (preg_match('~^(?:embed|shorts|live)/([^/]+)$~', $path, $parts)) {
                $id = $parts[1];
            }
        }
        if (is_string($id) && preg_match('/^[A-Za-z0-9_-]{11}$/D', $id)) {
            return ['type' => 'youtube', 'url' => 'https://www.youtube-nocookie.com/embed/'.$id];
        }

        return ['type' => 'external', 'url' => $url];
    }
}
