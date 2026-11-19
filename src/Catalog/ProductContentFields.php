<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog;

/** CMS and store settings definitions for reusable product content. */
final class ProductContentFields
{
    /** @return list<array<string, mixed>> */
    public static function defaults(bool $scoped = false): array
    {
        return [
            ['handle' => 'specifications', 'type' => 'repeater', 'label' => 'Specifications', 'fields' => [
                ['handle' => 'label', 'type' => 'text', 'label' => 'Label', 'width' => 40, 'required' => true],
                ['handle' => 'value', 'type' => 'text', 'label' => 'Value', 'width' => 60, 'required' => true],
            ]],
            ['handle' => 'faq', 'type' => 'repeater', 'label' => 'Questions and answers', 'fields' => [
                ['handle' => 'question', 'type' => 'text', 'label' => 'Question', 'required' => true],
                ['handle' => 'answer', 'type' => 'textarea', 'label' => 'Answer', 'required' => true],
            ]],
            self::visibility('size_guide_visibility', 'Size guide visibility', $scoped ? 'Inherit visibility' : null),
            ['handle' => 'size_guide', 'type' => 'rich_text', 'label' => 'Size guide', 'instructions' => 'Visibility and content can be inherited independently.'],
        ];
    }

    /** @return array<string, mixed> */
    public static function presentation(): array
    {
        return [
            'handle' => 'commerce_presentation', 'type' => 'group', 'label' => 'Display options and video',
            'instructions' => 'Set product-specific visibility. Shared content is managed in Shop → Settings → Catalog.',
            'fields' => [
                self::visibility('specifications_visibility', 'Specifications', 'Show available specifications', false),
                self::visibility('faq_visibility', 'Questions and answers', 'Show available questions', false),
                self::visibility('size_guide_visibility', 'Size guide', 'Inherit visibility'),
                ['handle' => 'video_source', 'type' => 'select', 'label' => 'Product video', 'width' => 50, 'config' => ['default' => 'none', 'options' => [
                    ['value' => 'none', 'label' => 'No video'],
                    ['value' => 'local', 'label' => 'Media library'],
                    ['value' => 'external', 'label' => 'External link'],
                ]]],
                ['handle' => 'video_file', 'type' => 'media', 'label' => 'Video file', 'config' => ['types' => ['video']],
                    'condition' => ['field' => 'video_source', 'operator' => 'equals', 'value' => 'local']],
                ['handle' => 'video_url', 'type' => 'text', 'label' => 'Video URL',
                    'validation' => ['url:https'],
                    'instructions' => 'YouTube videos play on the product page. Other HTTPS links open the external video.',
                    'condition' => ['field' => 'video_source', 'operator' => 'equals', 'value' => 'external']],
            ],
        ];
    }

    /** @return array<string, mixed> */
    private static function visibility(string $handle, string $label, ?string $inheritLabel, bool $show = true): array
    {
        return ['handle' => $handle, 'type' => 'select', 'label' => $label, 'width' => 50, 'config' => [
            'default' => $inheritLabel === null ? 'hide' : 'inherit',
            'options' => [
                ...($inheritLabel === null ? [] : [['value' => 'inherit', 'label' => $inheritLabel]]),
                ...($show ? [['value' => 'show', 'label' => 'Show']] : []),
                ['value' => 'hide', 'label' => 'Hide'],
            ],
        ]];
    }
}
