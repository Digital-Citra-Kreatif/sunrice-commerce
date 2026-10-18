<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Features\Actions;

use Illuminate\Validation\ValidationException;
use InvalidArgumentException;
use Sunrice\Commerce\Customers\Auth\LoginCodes;
use Sunrice\Commerce\Events\FeatureToggled;
use Sunrice\Commerce\Features\FeatureRegistry;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Support\ActivityRecorder;

/**
 * Switches a module on or off. Refuses switches that would leave the
 * selling mode unusable (e.g. Payments off in Online store mode), and
 * returns the modules that become inactive or active because of it.
 */
class ToggleFeature
{
    /** Modules each selling mode can't work without. */
    public const ESSENTIAL = [
        'shop' => ['cart', 'orders', 'checkout', 'payments'],
        'quote' => ['cart', 'orders', 'checkout'],
        'whatsapp' => ['cart', 'orders', 'checkout'],
        'catalog' => [],
    ];

    public const MODE_LABELS = ['shop' => 'Online store', 'quote' => 'Quotation', 'whatsapp' => 'WhatsApp order', 'catalog' => 'Catalog'];

    /**
     * @return array{deactivated: array<int, string>, activated: array<int, string>}
     *
     * @throws ValidationException
     */
    public function handle(string $key, bool $on): array
    {
        $registry = app(FeatureRegistry::class);
        $features = app(Features::class);
        $settings = app(StoreSettings::class);
        $feature = $registry->get($key) ?? throw new InvalidArgumentException("Unknown feature \"{$key}\".");

        if ($feature->core && ! $on) {
            throw ValidationException::withMessages(['feature' => "{$feature->label} can't be switched off."]);
        }

        if ($key === 'passwordless_login' && $on && ! app(LoginCodes::class)->supported()) {
            throw ValidationException::withMessages(['feature' => 'Sign in with an emailed code needs the HasOneTimePasswords trait on your user model. Run php artisan commerce:install, or add use Spatie\\OneTimePasswords\\Models\\Concerns\\HasOneTimePasswords; to it.']);
        }

        $switches = (array) $settings->get('features', []);
        $switches[$key] = $on;
        $mode = $features->mode();
        static::ensureModeUsable($mode, $switches, $on ? null : $key);

        $before = $features->states();
        $settings->saveSection('features', $switches);
        $features->flush();
        $after = $features->states();

        $changes = [
            'deactivated' => array_keys(array_filter($after, fn (bool $active, string $k) => ! $active && ($before[$k] ?? false), ARRAY_FILTER_USE_BOTH)),
            'activated' => array_keys(array_filter($after, fn (bool $active, string $k) => $active && ! ($before[$k] ?? false), ARRAY_FILTER_USE_BOTH)),
        ];

        app(ActivityRecorder::class)->record($on ? 'switched on' : 'switched off', "Store feature: {$feature->label}", ['changes' => [$key]], 'feature');
        FeatureToggled::dispatch($key, $on, $changes['deactivated'], $changes['activated']);

        return $changes;
    }

    /**
     * Refuse switches (or a selling mode) that leave the mode without
     * something it can't work without.
     *
     * @param  array<string, bool>  $switches
     * @param  string|null  $switchedOff  the module being switched off (kept for callers; the message names the root cause)
     *
     * @throws ValidationException
     */
    public static function ensureModeUsable(string $mode, array $switches, ?string $switchedOff = null): void
    {
        $features = app(Features::class);
        $registry = app(FeatureRegistry::class);
        foreach (static::ESSENTIAL[$mode] ?? [] as $essential) {
            if (! $features->activeWith($essential, $switches, $mode)) {
                $label = $registry->get(static::rootCause($essential, $switches, $mode))->label ?? $essential;
                $modeLabel = static::MODE_LABELS[$mode] ?? $mode;

                throw ValidationException::withMessages([
                    'feature' => "{$modeLabel} mode needs {$label}. Choose another selling mode first, or switch on what it needs.",
                ]);
            }
        }
    }

    /**
     * The module to blame when $key is inactive: the first switched-off
     * module down its requirements (Checkout is off because Payments is).
     *
     * @param  array<string, bool>  $switches
     */
    protected static function rootCause(string $key, array $switches, string $mode): string
    {
        $features = app(Features::class);
        $feature = app(FeatureRegistry::class)->get($key);
        if ($feature === null || ! ($switches[$key] ?? $feature->default) || ! in_array($mode, $feature->modes, true)) {
            return $key;
        }
        foreach ($features->requirements($feature, $mode) as $required) {
            if (! $features->activeWith($required, $switches, $mode)) {
                return static::rootCause($required, $switches, $mode);
            }
        }

        return $key;
    }
}
