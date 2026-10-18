<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Features;

use InvalidArgumentException;

class FeatureRegistry
{
    /** @var array<string, Feature> */
    protected array $features = [];

    public function __construct()
    {
        foreach (BuiltinFeatures::all() as $feature) {
            $this->register($feature);
        }
    }

    public function register(Feature $feature): void
    {
        if (! preg_match('/^[a-z][a-z0-9_]*$/', $feature->key)) {
            throw new InvalidArgumentException("Feature key \"{$feature->key}\": use lowercase letters, digits and _.");
        }
        $this->features[$feature->key] = $feature;
    }

    public function get(string $key): ?Feature
    {
        return $this->features[$key] ?? null;
    }

    public function has(string $key): bool
    {
        return isset($this->features[$key]);
    }

    /** @return array<string, Feature> */
    public function all(): array
    {
        return $this->features;
    }

    /**
     * Features that require $key directly (in any mode).
     *
     * @return array<int, string>
     */
    public function dependentsOf(string $key): array
    {
        return array_keys(array_filter($this->features, fn (Feature $f) => in_array($key, $f->requires, true)
            || in_array($key, array_merge([], ...array_values($f->modeRequires)), true)));
    }
}
