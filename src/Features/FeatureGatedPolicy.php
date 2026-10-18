<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Features;

/**
 * Base for commerce model policies: nothing is allowed while the model's
 * module is inactive; otherwise the policy's own methods decide.
 */
abstract class FeatureGatedPolicy
{
    /** The module the model belongs to. */
    protected string $feature = 'catalog';

    public function before(mixed $user, string $ability): ?bool
    {
        return app(Features::class)->active($this->feature) ? null : false;
    }
}
