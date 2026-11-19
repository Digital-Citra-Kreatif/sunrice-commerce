<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Sunrice\Commerce\Catalog\ProductContentFields;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('sunrice_collections') || ! Schema::hasTable('sunrice_blueprints')) {
            return;
        }
        $handles = DB::table('sunrice_collections')->whereIn('handle', (array) config('commerce.catalog.collections', ['products']))->pluck('blueprint');
        foreach (DB::table('sunrice_blueprints')->whereIn('handle', $handles)->get() as $record) {
            $fields = json_decode((string) $record->fields, true, flags: JSON_THROW_ON_ERROR);
            if (! is_array($fields) || ! in_array('commerce_product', array_column($fields, 'type'), true)) {
                continue;
            }
            $updated = $this->presentationFields($fields);
            if ($updated !== $fields) {
                DB::table('sunrice_blueprints')->where('id', $record->id)->update(['fields' => json_encode($updated, JSON_THROW_ON_ERROR)]);
            }
        }
    }

    /**
     * @param  list<array<string, mixed>>  $fields
     * @return list<array<string, mixed>>
     */
    private function presentationFields(array $fields): array
    {
        $updated = [];
        $hasPresentation = in_array('commerce_presentation', array_column($fields, 'handle'), true);
        foreach ($fields as $field) {
            if (($field['handle'] ?? null) === 'gallery' && ($field['type'] ?? null) === 'media' && ($field['config']['multiple'] ?? false)) {
                $field['type'] = 'commerce_gallery';
                $field['instructions'] ??= 'Drag images to change the order. The first image is the cover.';
            }
            $updated[] = $field;
            if (($field['type'] ?? null) === 'commerce_product' && ! $hasPresentation) {
                $updated[] = ProductContentFields::presentation();
                $hasPresentation = true;
            }
        }

        return $updated;
    }

    public function down(): void
    {
        // Keep the CMS configuration and saved presentation content on rollback.
    }
};
