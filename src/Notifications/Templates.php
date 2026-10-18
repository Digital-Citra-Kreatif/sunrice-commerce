<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Notifications;

/**
 * Views a site or package puts in place of commerce's own, without
 * copying files into resources/views/vendor: the frame of every store
 * email, one email's body, the CSS theme emails are inlined with, and
 * each document (invoice, packing slip, quotation) or the documents'
 * layout. Registered with Commerce::emailTemplate(), emailTheme() and
 * documentTemplate().
 */
class Templates
{
    protected ?string $frame = null;

    protected ?string $theme = null;

    /** @var array<string, string> email key => view */
    protected array $bodies = [];

    /** @var array<string, string> document type (or "layout") => view */
    protected array $documents = [];

    /** The frame of every store email (default commerce::emails.store), or one email's body (default commerce::emails.parts.{key}). */
    public function email(string $view, ?string $key = null): void
    {
        if ($key === null) {
            $this->frame = $view;
        } else {
            $this->bodies[$key] = $view;
        }
    }

    public function theme(string $view): void
    {
        $this->theme = $view;
    }

    public function document(string $type, string $view): void
    {
        $this->documents[$type] = $view;
    }

    public function frameView(): string
    {
        return $this->frame ?? 'commerce::emails.store';
    }

    public function bodyView(string $key): string
    {
        return $this->bodies[$key] ?? 'commerce::emails.parts.'.$key;
    }

    /** A replaced body, or null when the email keeps its own content. */
    public function replacedBody(string $key): ?string
    {
        return $this->bodies[$key] ?? null;
    }

    public function themeView(): string
    {
        return $this->theme ?? 'commerce::emails.theme';
    }

    public function documentView(string $type): string
    {
        return $this->documents[$type] ?? 'commerce::documents.'.str_replace('_', '-', $type);
    }
}
