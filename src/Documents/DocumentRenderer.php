<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Documents;

/** Turns a document's HTML into PDF bytes (dompdf by default; bind another, e.g. spatie/laravel-pdf). */
interface DocumentRenderer
{
    public function pdf(string $html, string $paper = 'a4'): string;
}
