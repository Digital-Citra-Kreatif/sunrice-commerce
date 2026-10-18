<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Health\Checks;

use Sunrice\Commerce\Health\HealthCheck;
use Sunrice\Commerce\Health\HealthResult;

class MailCheck implements HealthCheck
{
    public function key(): string
    {
        return 'mail';
    }

    public function label(): string
    {
        return 'Email';
    }

    public function run(): HealthResult
    {
        $mailer = (string) config('mail.default');
        $transport = (string) config("mail.mailers.{$mailer}.transport", $mailer);

        return in_array($transport, ['log', 'array'], true)
            ? HealthResult::warning("Emails aren't delivered: the mailer is \"{$transport}\". Order emails and sign-in codes won't reach anyone.", 'Set up SMTP (Sunrice docs: Mail).')
            : HealthResult::ok("Mail is sent with {$transport}.");
    }
}
