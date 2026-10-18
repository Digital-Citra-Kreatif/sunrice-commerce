<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Features;

use Sunrice\Commerce\Settings\StoreSettings;

/**
 * Which store modules are active right now:
 *
 *   active(f) = f is core, or (f is switched on and the selling mode is one
 *               of f's modes and every requirement — f.requires plus
 *               f.modeRequires[mode] — is active)
 *
 * Each module's own switch is stored separately, so switching off Cart
 * makes Checkout inactive without forgetting that Checkout was on.
 * Computed once per request.
 */
class Features
{
    /** @var array<string, bool> */
    protected array $memo = [];

    public function __construct(protected FeatureRegistry $registry, protected StoreSettings $settings) {}

    public function mode(): string
    {
        $mode = (string) $this->settings->get('general.selling_mode', 'shop');

        return in_array($mode, Feature::MODES, true) ? $mode : 'shop';
    }

    public function switchedOn(string $key): bool
    {
        $feature = $this->registry->get($key);
        if ($feature === null) {
            return false;
        }
        if ($feature->core) {
            return true;
        }
        $stored = (array) $this->settings->get('features', []);

        return array_key_exists($key, $stored) ? (bool) $stored[$key] : $feature->default;
    }

    public function active(string $key): bool
    {
        return $this->memo[$key] ??= $this->resolve($key, [], $this->mode(), null);
    }

    /**
     * What the state would be with other switches or another mode (used to
     * preview a toggle or a selling mode change).
     *
     * @param  array<string, bool>  $switches
     */
    public function activeWith(string $key, array $switches = [], ?string $mode = null): bool
    {
        return $this->resolve($key, [], $mode ?? $this->mode(), $switches);
    }

    /**
     * Why a module is (in)active: {active, switched_on, reasons}. Reasons
     * are "mode:<mode>" or "needs:<key>".
     *
     * @return array{active: bool, switched_on: bool, reasons: array<int, string>}
     */
    public function explain(string $key): array
    {
        $feature = $this->registry->get($key);
        $reasons = [];
        if ($feature !== null && ! $feature->core) {
            $mode = $this->mode();
            if (! in_array($mode, $feature->modes, true)) {
                $reasons[] = "mode:{$mode}";
            }
            foreach ($this->requirements($feature, $mode) as $required) {
                if (! $this->active($required)) {
                    $reasons[] = "needs:{$required}";
                }
            }
        }

        return ['active' => $this->active($key), 'switched_on' => $this->switchedOn($key), 'reasons' => $reasons];
    }

    /** @return array<string, bool> every feature's state */
    public function states(): array
    {
        $states = [];
        foreach (array_keys($this->registry->all()) as $key) {
            $states[$key] = $this->active($key);
        }

        return $states;
    }

    /** @return array<int, string> */
    public function requirements(Feature $feature, string $mode): array
    {
        return array_values(array_unique([...$feature->requires, ...($feature->modeRequires[$mode] ?? [])]));
    }

    /** Forget the memo (after the settings change). */
    public function flush(): void
    {
        $this->memo = [];
    }

    /**
     * @param  array<int, string>  $visiting
     * @param  array<string, bool>|null  $switches
     */
    protected function resolve(string $key, array $visiting, string $mode, ?array $switches): bool
    {
        $feature = $this->registry->get($key);
        if ($feature === null || in_array($key, $visiting, true)) {
            return false;
        }
        if ($feature->core) {
            return true;
        }
        $on = $switches !== null && array_key_exists($key, $switches) ? $switches[$key] : $this->switchedOn($key);
        if (! $on || ! in_array($mode, $feature->modes, true)) {
            return false;
        }
        foreach ($this->requirements($feature, $mode) as $required) {
            if (! $this->resolve($required, [...$visiting, $key], $mode, $switches)) {
                return false;
            }
        }

        return true;
    }
}
