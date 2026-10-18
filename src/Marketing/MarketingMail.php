<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Marketing;

use Illuminate\Mail\Mailable;
use Symfony\Component\Mime\Email;

/** A rendered marketing email (MessageBuilder), with one-click unsubscribe headers (RFC 8058). */
class MarketingMail extends Mailable
{
    public function __construct(string $subject, string $html, public string $plain, public string $unsubscribeUrl)
    {
        $this->subject($subject);
        $this->html($html);
    }

    public function build(): static
    {
        return $this->withSymfonyMessage(function (Email $message): void {
            $message->text($this->plain);
            $message->getHeaders()->addTextHeader('List-Unsubscribe', '<'.$this->unsubscribeUrl.'>');
            $message->getHeaders()->addTextHeader('List-Unsubscribe-Post', 'List-Unsubscribe=One-Click');
        });
    }
}
