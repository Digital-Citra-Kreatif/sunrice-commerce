<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Support;

final class Defaults
{
    /**
     * Fill in keys missing from $values with $defaults, recursively for
     * associative arrays. Values that are set (lists included) win.
     *
     * @param  array<array-key, mixed>  $defaults
     * @param  array<array-key, mixed>  $values
     * @return array<array-key, mixed>
     */
    public static function merge(array $defaults, array $values): array
    {
        foreach ($defaults as $key => $default) {
            if (! array_key_exists($key, $values)) {
                $values[$key] = $default;
            } elseif (is_array($default) && is_array($values[$key]) && ! array_is_list($default) && ! array_is_list($values[$key])) {
                $values[$key] = self::merge($default, $values[$key]);
            }
        }

        return $values;
    }
}
