<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Settings;

use Sunrice\Commerce\Features\Features;

class SettingsRegistry
{
    /** @var array<string, SettingsSection> */
    protected array $sections = [];

    public function register(SettingsSection $section): void
    {
        $this->sections[$section->key] = $section;
    }

    public function get(string $key): ?SettingsSection
    {
        return $this->sections[$key] ?? null;
    }

    /** @return array<string, SettingsSection> in display order */
    public function all(): array
    {
        $sections = $this->sections;
        uasort($sections, fn (SettingsSection $a, SettingsSection $b) => $a->position <=> $b->position);

        return $sections;
    }

    /**
     * Sections this user may open, with their module active.
     *
     * @return array<string, SettingsSection>
     */
    public function visibleTo(mixed $user): array
    {
        $features = app(Features::class);

        return array_filter($this->all(), fn (SettingsSection $s) => $user !== null
            && ($s->feature === null || $features->active($s->feature))
            && $user->can($s->permission()));
    }
}
