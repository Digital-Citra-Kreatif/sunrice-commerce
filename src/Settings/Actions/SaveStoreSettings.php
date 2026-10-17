<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Settings\Actions;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;
use Sunrice\Commerce\Events\StoreSettingsSaved;
use Sunrice\Commerce\Settings\SettingsRegistry;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Support\ActivityRecorder;

/**
 * Validates and saves one Settings → Store section. Cross-checks of the
 * section (and locked settings) refuse saves that would leave the store
 * unusable, with the reason as a validation error.
 */
class SaveStoreSettings
{
    /** @var array<int, callable(string, array<string, mixed>, StoreSettings): array<string, string>> */
    protected static array $guards = [];

    /**
     * A check for every section save: returns [field => message] for each
     * value it refuses (used for locked settings such as the currency).
     *
     * @param  callable(string, array<string, mixed>, StoreSettings): array<string, string>  $guard
     */
    public static function guardUsing(callable $guard): void
    {
        static::$guards[] = $guard;
    }

    public static function flushGuards(): void
    {
        static::$guards = [];
    }

    /**
     * @param  array<string, mixed>  $input
     * @return array<string, mixed> the saved values
     *
     * @throws ValidationException
     */
    public function handle(string $sectionKey, array $input): array
    {
        $section = app(SettingsRegistry::class)->get($sectionKey)
            ?? throw new InvalidArgumentException("Unknown store settings section \"{$sectionKey}\".");
        $settings = app(StoreSettings::class);

        $rules = $section->rules();
        $values = Validator::make($input, $rules)->validate();
        // Only keys the section declares are stored.
        $values = array_intersect_key($values, array_flip(array_map(fn (string $k) => explode('.', $k)[0], array_keys($rules))));

        $errors = [];
        foreach (static::$guards as $guard) {
            $errors += $guard($sectionKey, $values, $settings);
        }
        if (($reason = $section->check($values, $settings)) !== null) {
            $errors['section'] = $reason;
        }
        if ($errors !== []) {
            throw ValidationException::withMessages($errors);
        }

        $before = $settings->section($sectionKey);
        $settings->saveSection($sectionKey, $values);

        $changed = array_keys(array_filter($values, fn ($value, $key) => ($before[$key] ?? null) != $value, ARRAY_FILTER_USE_BOTH));
        if ($changed !== []) {
            app(ActivityRecorder::class)->record('updated', "Store settings: {$section->label}", ['changes' => $changed], 'store_setting');
        }
        StoreSettingsSaved::dispatch($sectionKey, $changed);

        return $values;
    }
}
