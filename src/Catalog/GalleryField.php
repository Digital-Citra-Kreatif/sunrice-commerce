<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog;

use Sunrice\Cms\Fields\Field;
use Sunrice\Cms\Fields\FieldType;
use Sunrice\Cms\Fields\HydrationContext;
use Sunrice\Cms\Fields\Types\MediaField;

/** The CMS media field's existing list of IDs, with a sortable admin input. */
final class GalleryField extends FieldType
{
    private readonly MediaField $media;

    public function __construct()
    {
        $this->media = new MediaField;
    }

    public function type(): string
    {
        return 'commerce_gallery';
    }

    public function label(): string
    {
        return 'Product gallery';
    }

    public function rules(Field $field): array
    {
        return $this->media->rules($field);
    }

    public function nestedRules(Field $field, string $key, mixed $value): array
    {
        return $this->media->nestedRules($field, $key, $value);
    }

    public function defaultValue(Field $field): mixed
    {
        return $this->media->defaultValue($field);
    }

    public function normalize(mixed $value, Field $field): mixed
    {
        return $this->media->normalize($value, $field);
    }

    public function hydrate(mixed $value, Field $field, HydrationContext $context): mixed
    {
        return $this->media->hydrate($value, $field, $context);
    }

    public function references(mixed $value, Field $field): array
    {
        return $this->media->references($value, $field);
    }

    public function settings(): array
    {
        return $this->media->settings();
    }
}
