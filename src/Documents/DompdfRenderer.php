<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Documents;

use Dompdf\Dompdf;
use Dompdf\Options;

/** PDFs with dompdf (CSS 2.1: the templates use tables). Remote files are never fetched. */
class DompdfRenderer implements BatchRenderer
{
    public function pdf(string $html, string $paper = 'a4'): string
    {
        $dompdf = new Dompdf($this->options());
        $dompdf->loadHtml($html, 'UTF-8');
        $dompdf->setPaper($paper);
        $dompdf->render();

        return (string) $dompdf->output();
    }

    /**
     * Each document is laid out by its own Dompdf on one shared canvas, so
     * only the finished pages are kept between documents, not their layout.
     */
    public function combined(iterable $documents, string $paper = 'a4'): string
    {
        $pdf = new Dompdf($this->options());
        $pdf->setPaper($paper);
        $canvas = $pdf->getCanvas();
        $first = true;
        foreach ($documents as $html) {
            if (! $first) {
                $canvas->new_page();
            }
            $first = false;
            $dompdf = new Dompdf($this->options());
            $dompdf->setCanvas($canvas);
            $dompdf->getFontMetrics()->setCanvas($canvas);
            $dompdf->loadHtml($html, 'UTF-8');
            $dompdf->render();
            unset($dompdf, $html);
            gc_collect_cycles(); // dompdf's frame tree is full of cycles
        }

        return (string) $pdf->output();
    }

    protected function options(): Options
    {
        $options = new Options;
        $options->setIsRemoteEnabled(false);
        $options->setDefaultFont('DejaVu Sans');
        $options->setTempDir(sys_get_temp_dir());

        return $options;
    }
}
