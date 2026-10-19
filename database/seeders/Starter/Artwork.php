<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Database\Seeders\Starter;

/**
 * Placeholder artwork for the starter store: flat garment silhouettes as
 * SVG, in the colour of the variant, on a light grey ground. No external
 * images and no image library needed; SVGs are stored as Sunrice assets
 * and never resized. Product shots are 4:5 (600 × 750), tiles 1:1 and
 * banners wide.
 */
final class Artwork
{
    /** The garment shapes, drawn on a 600 × 750 canvas. */
    public const SHAPES = ['tee', 'knit', 'shirt', 'jacket', 'trousers', 'shorts', 'skirt', 'cap', 'tote', 'socks', 'book', 'stack', 'card'];

    /** A product shot: the garment centred, or a 2× detail of it. */
    public static function product(string $shape, string $fill, bool $detail = false): string
    {
        $box = $detail ? '150 140 300 375' : '0 0 600 750';

        return self::svg($box, 600, 750, '<rect x="-600" y="-600" width="1800" height="1950" fill="#f3f3f1"/>'.self::garment($shape, $fill));
    }

    /** A category tile: a garment on a tinted square. */
    public static function tile(string $shape, string $fill, string $ground): string
    {
        return self::svg('0 0 600 600', 600, 600, '<rect width="600" height="600" fill="'.$ground.'"/>'
            .'<g transform="translate(60 30) scale(0.8)">'.self::garment($shape, $fill).'</g>');
    }

    /**
     * A wide banner: a row of garments on a coloured ground.
     *
     * @param  array<int, array{0: string, 1: string}>  $garments  [shape, fill]
     */
    public static function banner(array $garments, string $ground, int $width = 1600, int $height = 700): string
    {
        $count = max(1, count($garments));
        $slot = ($width * 0.62) / $count;
        $scale = min($height * 0.86 / 750, $slot / 600 * 1.15);
        $body = '<rect width="'.$width.'" height="'.$height.'" fill="'.$ground.'"/>'
            .'<rect x="'.round($width * 0.36).'" width="'.round($width * 0.64).'" height="'.$height.'" fill="#ffffff" opacity="0.18"/>';
        foreach (array_values($garments) as $i => [$shape, $fill]) {
            $x = $width * 0.36 + $slot * $i + ($slot - 600 * $scale) / 2;
            $y = ($height - 750 * $scale) / 2 + ($i % 2 === 0 ? 0 : $height * 0.04);
            $body .= '<g transform="translate('.round($x, 1).' '.round($y, 1).') scale('.round($scale, 3).')">'.self::garment($shape, $fill).'</g>';
        }

        return self::svg("0 0 {$width} {$height}", $width, $height, $body);
    }

    /** A brand logo: the brand's initials in a thin square. */
    public static function brand(string $name): string
    {
        $initials = mb_strtoupper(implode('', array_map(fn (string $w) => mb_substr($w, 0, 1), array_slice(preg_split('/[\s&]+/', $name) ?: [], 0, 2))));

        return self::svg('0 0 400 200', 400, 200, '<rect width="400" height="200" fill="#ffffff"/>'
            .'<rect x="140" y="40" width="120" height="120" fill="none" stroke="#111111" stroke-width="4"/>'
            .'<text x="200" y="118" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="52" fill="#111111">'.e($initials).'</text>');
    }

    /** The store wordmark: KAIN in block letters with a red bar (paths only, so dompdf draws it too). */
    public static function logo(): string
    {
        $letters = '<path d="M0 0h14v26l20-26h17L29 27l23 33H35L20 37l-6 7v16H0z"/>'          // K
            .'<path d="M74 0h16l24 60H99l-5-13H70l-5 13H50zm-1 35h17l-8-22z"/>'               // A
            .'<path d="M122 0h14v60h-14z"/>'                                                     // I
            .'<path d="M150 0h14l26 37V0h14v60h-14L164 23v37h-14z"/>';                          // N

        return self::svg('0 0 240 80', 240, 80, '<rect x="0" y="66" width="44" height="6" fill="#d7001d"/>'
            .'<g fill="#111111" transform="translate(18 2)">'.$letters.'</g>');
    }

    /** A pale ground for a fill, for tiles and banners. */
    public static function ground(string $fill): string
    {
        [$r, $g, $b] = self::rgb($fill);

        return sprintf('#%02x%02x%02x', (int) (235 + $r * 0.07), (int) (235 + $g * 0.07), (int) (233 + $b * 0.07));
    }

    protected static function garment(string $shape, string $fill): string
    {
        $line = self::shade($fill, self::light($fill) ? -0.18 : -0.28);
        $accent = self::shade($fill, self::light($fill) ? -0.08 : 0.12);
        $s = 'fill="'.$fill.'" stroke="'.$line.'" stroke-width="3" stroke-linejoin="round"';
        $d = 'fill="none" stroke="'.$line.'" stroke-width="3" stroke-linecap="round"';
        $a = 'fill="'.$accent.'"';
        $shadow = '<ellipse cx="300" cy="680" rx="190" ry="14" fill="#000000" opacity="0.06"/>';

        return $shadow.match ($shape) {
            'tee' => '<path '.$s.' d="M222 140l38-18q40 34 80 0l38 18 92 52-36 92-46-20v360H212V264l-46 20-36-92z"/>'
                .'<path '.$d.' d="M260 122q40 52 80 0"/><path '.$d.' d="M212 264v-60M388 264v-60" opacity="0.35"/>',
            'knit' => '<path '.$s.' d="M226 140l36-16q38 36 76 0l36 16 78 44 50 352-48 14-54-232v326H212V318l-54 232-48-14 50-352z"/>'
                .'<path '.$a.' d="M212 618h176v26H212z"/><path '.$d.' d="M262 124q38 50 76 0"/>'
                .'<path '.$d.' d="M118 520l46 14M482 520l-46 14" opacity="0.6"/>',
            'shirt' => '<path '.$s.' d="M226 136l44-16 30 40 30-40 44 16 76 46 46 352-46 12-52-226v328H212V310l-52 226-46-12 46-352z"/>'
                .'<path '.$d.' d="M300 160v478"/><path '.$a.' d="M270 120l30 40-34 26-14-50zM330 120l-30 40 34 26 14-50z"/>'
                .'<circle cx="300" cy="230" r="5" fill="'.$line.'"/><circle cx="300" cy="320" r="5" fill="'.$line.'"/><circle cx="300" cy="410" r="5" fill="'.$line.'"/><circle cx="300" cy="500" r="5" fill="'.$line.'"/>',
            'jacket' => '<path '.$s.' d="M220 128l40-18h80l40 18 86 50 44 372-50 12-48-236v344H198V326l-48 236-50-12 44-372z"/>'
                .'<path '.$a.' d="M260 110l40 70 40-70 16 10-56 110-56-110z"/><path '.$d.' d="M300 180v478"/>'
                .'<path '.$d.' d="M222 470h50M328 470h50" opacity="0.7"/>',
            'trousers' => '<path '.$s.' d="M212 116h176l28 528h-92l-24-380-24 380h-92z"/>'
                .'<path '.$a.' d="M212 116h176v28H212z"/><path '.$d.' d="M300 144v100M248 150q4 40-26 56M352 150q-4 40 26 56" opacity="0.6"/>',
            'shorts' => '<path '.$s.' d="M200 200h200l36 300h-110l-26-170-26 170H164z"/>'
                .'<path '.$a.' d="M200 200h200v28H200z"/><path '.$d.' d="M300 228v90" opacity="0.6"/>',
            'skirt' => '<path '.$s.' d="M236 150h128l90 470H146z"/><path '.$a.' d="M236 150h128v30H236z"/>'
                .'<path '.$d.' d="M262 180l-40 440M338 180l40 440M300 180v440" opacity="0.35"/>',
            'cap' => '<path '.$s.' d="M170 430q0-190 150-190t150 190z"/><path '.$s.' d="M300 430h230q10 24-24 32H300z"/>'
                .'<path '.$d.' d="M320 240v190M250 262q30 70 20 168M390 262q-30 70-20 168" opacity="0.4"/><circle cx="320" cy="238" r="9" '.$a.'/>',
            'tote' => '<path fill="none" stroke="'.$line.'" stroke-width="16" stroke-linecap="round" d="M232 300q0-150 68-150t68 150"/><path '.$s.' d="M170 290h260l-14 360H184z"/>'
                .'<path '.$a.' d="M170 290h260v24H170z"/>',
            'socks' => '<path '.$s.' d="M236 120h110v330l-10 120q-8 60-80 60h-90q-40 0-40-40t50-50l60-20z"/>'
                .'<path '.$a.' d="M236 120h110v40H236z"/><path '.$d.' d="M236 190h110M236 214h110" opacity="0.45"/>',
            'book' => '<path '.$s.' d="M160 130h270q14 0 14 14v470q0 14-14 14H160z"/><path '.$a.' d="M160 130h34v498h-34z"/>'
                .'<rect x="240" y="230" width="150" height="10" fill="'.$line.'"/><rect x="240" y="260" width="110" height="10" fill="'.$line.'" opacity="0.6"/>'
                .'<rect x="240" y="470" width="150" height="110" fill="#ffffff" opacity="0.35"/>',
            'stack' => '<path '.$s.' d="M140 470h320v70H140z"/><path '.$s.' d="M150 400h300v70H150z" transform="rotate(-2 300 435)"/>'
                .'<path '.$s.' d="M146 330h308v70H146z" transform="rotate(1.5 300 365)"/><path '.$d.' d="M270 330q30 30 60 0" opacity="0.6"/>',
            'card' => '<rect x="120" y="250" width="360" height="230" rx="10" '.$s.'/><rect x="120" y="300" width="360" height="40" '.$a.'/>'
                .'<rect x="150" y="410" width="120" height="14" fill="#ffffff" opacity="0.7"/><rect x="400" y="400" width="50" height="50" fill="#d7001d"/>',
            default => '<rect x="150" y="150" width="300" height="450" '.$s.'/>',
        };
    }

    protected static function svg(string $viewBox, int $width, int $height, string $body): string
    {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="'.$viewBox.'" width="'.$width.'" height="'.$height.'">'.$body.'</svg>';
    }

    /** @return array{0: int, 1: int, 2: int} */
    protected static function rgb(string $hex): array
    {
        $hex = ltrim($hex, '#');

        return [(int) hexdec(substr($hex, 0, 2)), (int) hexdec(substr($hex, 2, 2)), (int) hexdec(substr($hex, 4, 2))];
    }

    protected static function light(string $hex): bool
    {
        [$r, $g, $b] = self::rgb($hex);

        return (0.299 * $r + 0.587 * $g + 0.114 * $b) > 170;
    }

    /** Lighter (amount > 0) or darker (amount < 0). */
    protected static function shade(string $hex, float $amount): string
    {
        return '#'.implode('', array_map(function (int $c) use ($amount): string {
            $v = $amount < 0 ? $c * (1 + $amount) : $c + (255 - $c) * $amount;

            return sprintf('%02x', max(0, min(255, (int) round($v))));
        }, self::rgb($hex)));
    }
}
