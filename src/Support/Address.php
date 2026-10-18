<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Support;

use JsonSerializable;
use Sunrice\Commerce\Regions\Countries;

/**
 * A postal address with region codes and names. Indonesian addresses carry
 * Kemendagri codes (province, city, district, village) and their names;
 * other countries use free-text state and city. Orders store it as a
 * snapshot (toArray()), so it prints the same even if a region is renamed.
 */
final class Address implements JsonSerializable
{
    public const FIELDS = [
        'name', 'phone', 'company', 'country',
        'province_code', 'city_code', 'district_code', 'village_code',
        'province', 'city', 'district', 'village', 'state',
        'postal_code', 'line1', 'line2', 'notes',
    ];

    /** @param  array<string, string|null>  $values */
    private function __construct(private array $values) {}

    /** @param  array<string, mixed>  $values */
    public static function fromArray(array $values): self
    {
        $clean = [];
        foreach (self::FIELDS as $field) {
            $value = $values[$field] ?? null;
            $clean[$field] = is_scalar($value) && trim((string) $value) !== '' ? trim((string) $value) : null;
        }
        $clean['country'] = strtoupper($clean['country'] ?? 'ID');

        return new self($clean);
    }

    public function get(string $field): ?string
    {
        return $this->values[$field] ?? null;
    }

    public function country(): string
    {
        return (string) $this->values['country'];
    }

    public function isIndonesian(): bool
    {
        return $this->country() === 'ID';
    }

    /**
     * Region codes from the most specific to the province.
     *
     * @return array<int, string>
     */
    public function regionCodes(): array
    {
        return array_values(array_filter([
            $this->values['village_code'], $this->values['district_code'], $this->values['city_code'], $this->values['province_code'],
        ]));
    }

    /** @return array<int, string> lines for printing */
    public function lines(?string $locale = null): array
    {
        $v = $this->values;
        $area = $this->isIndonesian()
            ? implode(', ', array_filter([$v['village'], $v['district'], $v['city']]))
            : implode(', ', array_filter([$v['city'], $v['state']]));
        $last = implode(' ', array_filter([$this->isIndonesian() ? $v['province'] : null, $v['postal_code']]));

        return array_values(array_filter([
            $v['name'],
            $v['company'],
            $v['line1'],
            $v['line2'],
            $area,
            $last,
            Countries::name($this->country(), $locale),
            $v['phone'],
        ]));
    }

    public function format(?string $locale = null, string $separator = "\n"): string
    {
        return implode($separator, $this->lines($locale));
    }

    /** @return array<string, string|null> */
    public function toArray(): array
    {
        return $this->values;
    }

    /** @return array<string, string|null> */
    public function jsonSerialize(): array
    {
        return $this->values;
    }
}
