<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Documents;

use Dompdf\Dompdf;
use Dompdf\Options;

/** PDFs with dompdf (CSS 2.1: the templates use tables). Remote files are never fetched. */
class DompdfRenderer implements DocumentRenderer
{
    public function pdf(string $html, string $paper = 'a4'): string
    {
        $options = new Options;
        $options->setIsRemoteEnabled(false);
        $options->setDefaultFont('DejaVu Sans');
        $options->setTempDir(sys_get_temp_dir());
        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html, 'UTF-8');
        $dompdf->setPaper($paper);
        $dompdf->render();

        return (string) $dompdf->output();
    }
}
