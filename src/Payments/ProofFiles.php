<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\Drivers\Imagick\Driver as ImagickDriver;
use Intervention\Image\ImageManager;
use Throwable;

/**
 * Payment proofs on the private disk (commerce.payments.proof_disk) under
 * commerce/proofs/{order}/{random}.{ext}. Images are re-encoded, which
 * drops metadata and anything hidden in the file; PDFs are kept as sent.
 */
class ProofFiles
{
    /** @return array{disk: string, path: string} */
    public function store(UploadedFile $file, int $orderId): array
    {
        $disk = (string) config('commerce.payments.proof_disk', 'local');
        $extension = strtolower($file->guessExtension() ?: $file->getClientOriginalExtension() ?: 'bin');
        $extension = $extension === 'jpeg' ? 'jpg' : $extension;
        $path = "commerce/proofs/{$orderId}/".Str::random(32).'.'.$extension;
        $contents = $extension === 'pdf' ? (string) file_get_contents($file->getRealPath()) : $this->reencode($file, $extension);
        Storage::disk($disk)->put($path, $contents);

        return ['disk' => $disk, 'path' => $path];
    }

    /** The image drawn again from its pixels (the original when no image library is installed). */
    public function reencode(UploadedFile $file, string $extension): string
    {
        $original = (string) file_get_contents($file->getRealPath());
        if (! extension_loaded('imagick') && ! extension_loaded('gd')) {
            report(new \RuntimeException('Payment proof kept as uploaded: install the GD or Imagick PHP extension to re-encode images.'));

            return $original;
        }
        try {
            $manager = new ImageManager(extension_loaded('imagick') ? new ImagickDriver : new GdDriver);

            return (string) $manager->decode($original)->encodeUsingFileExtension($extension);
        } catch (Throwable $e) {
            report($e);

            return $original;
        }
    }

    public function delete(?string $disk, ?string $path): void
    {
        if ($disk !== null && $path !== null) {
            Storage::disk($disk)->delete($path);
        }
    }
}
