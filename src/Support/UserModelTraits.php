<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Support;

use ReflectionClass;

/**
 * Adds a trait (and its import) to the app's user model source file, the
 * way sunrice:install adds HasRoles. Only touches writable files inside
 * the application, never vendor.
 */
final class UserModelTraits
{
    /**
     * @param  class-string  $model
     * @return bool|null true when added, null when it was already there, false when it couldn't be added
     */
    public static function ensure(string $model, string $trait): ?bool
    {
        if (in_array($trait, class_uses_recursive($model), true)) {
            return null;
        }
        $file = (new ReflectionClass($model))->getFileName();
        if ($file === false || ! is_writable($file) || ! str_starts_with($file, base_path()) || str_starts_with($file, base_path('vendor'))) {
            return false;
        }
        $source = (string) file_get_contents($file);
        $short = class_basename($model);
        $traitShort = class_basename($trait);
        if (str_contains($source, $traitShort.';') && str_contains($source, 'use '.$trait.';')) {
            return null; // added earlier in this process; the loaded class predates it
        }

        // Opening brace of the class body.
        if (preg_match('/^\s*(?:(?:final|abstract|readonly)\s+)*class\s+'.preg_quote($short, '/').'\b[^{]*\{/m', $source, $match, PREG_OFFSET_CAPTURE) !== 1) {
            return false;
        }
        $bodyStart = $match[0][1] + strlen($match[0][0]);

        // Append to the first trait list (`use HasFactory, Notifiable;`), or open one.
        $body = substr($source, $bodyStart);
        if (preg_match('/\A((?:\s*(?:\/\*.*?\*\/|\/\/[^\n]*))*\s*use\s+)([^;{]+);/s', $body, $traits) === 1) {
            $body = substr_replace($body, $traits[1].rtrim($traits[2]).', '.$traitShort.';', 0, strlen($traits[0]));
        } else {
            $body = "\n    use {$traitShort};\n".$body;
        }
        $source = substr($source, 0, $bodyStart).$body;

        // Import the trait after the last top-level import, or the namespace.
        $import = 'use '.$trait.';';
        if (! str_contains($source, $import)) {
            $header = substr($source, 0, $match[0][1]);
            if (preg_match_all('/^use\s+[^;]+;$/m', $header, $uses, PREG_OFFSET_CAPTURE) > 0) {
                $last = end($uses[0]);
                $source = substr_replace($source, "\n".$import, $last[1] + strlen($last[0]), 0);
            } elseif (preg_match('/^namespace\s+[^;]+;$/m', $header, $ns, PREG_OFFSET_CAPTURE) === 1) {
                $source = substr_replace($source, "\n\n".$import, $ns[0][1] + strlen($ns[0][0]), 0);
            } else {
                return false;
            }
        }

        return file_put_contents($file, $source) !== false;
    }
}
