<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Marketing\Actions;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Marketing\Audience;
use Sunrice\Commerce\Marketing\Automations\Triggers;
use Sunrice\Commerce\Marketing\Models\Campaign;
use Sunrice\Support\HtmlSanitizer;
use Sunrice\Support\Locales;

/**
 * Saves a campaign or automation: name, audience rules, content per
 * language (subject, preheader, body HTML, button), and for automations
 * the trigger and its delay. Sent campaigns can't be changed.
 */
class SaveCampaign
{
    /**
     * @param  array<string, mixed>  $input
     *
     * @throws ValidationException
     */
    public function handle(Campaign $campaign, array $input, ?int $userId = null): Campaign
    {
        if ($campaign->exists && ! $campaign->editable()) {
            throw ValidationException::withMessages(['name' => 'A campaign that has been sent can\'t be changed. Duplicate it instead.']);
        }
        $automation = $campaign->isAutomation();
        $main = Locales::main();
        $data = Validator::make($input, [
            'name' => ['required', 'string', 'max:150'],
            'trigger' => $automation ? ['required', Rule::in(array_keys(app(Triggers::class)->all()))] : ['nullable'],
            'delay' => $automation ? ['required', 'integer', 'min:0', 'max:3650'] : ['nullable'],
            'voucher_code' => ['nullable', 'string', 'max:60'],
            'audience' => ['nullable', 'array'],
            'content' => ['required', 'array'],
            "content.{$main}.subject" => ['required', 'string', 'max:200'],
            "content.{$main}.body" => ['required', 'string', 'max:100000'],
            'content.*.subject' => ['nullable', 'string', 'max:200'],
            'content.*.preheader' => ['nullable', 'string', 'max:200'],
            'content.*.body' => ['nullable', 'string', 'max:100000'],
            'content.*.button_label' => ['nullable', 'string', 'max:80'],
            'content.*.button_url' => ['nullable', 'string', 'max:500', 'regex:#^(https?://|/|\{[a-z_]+\})#i'],
        ], [
            "content.{$main}.subject.required" => 'Write a subject (in '.Locales::name($main).').',
            "content.{$main}.body.required" => 'Write the email (in '.Locales::name($main).').',
            'content.*.button_url.regex' => 'The button link must start with https://, / or a smart tag like {store_url}.',
        ])->validate();

        $content = [];
        foreach (Locales::available() as $locale) {
            $part = (array) ($data['content'][$locale] ?? []);
            $content[$locale] = [
                'subject' => trim((string) ($part['subject'] ?? '')),
                'preheader' => trim((string) ($part['preheader'] ?? '')),
                'body' => (string) HtmlSanitizer::sanitize((string) ($part['body'] ?? '')),
                'button_label' => trim((string) ($part['button_label'] ?? '')),
                'button_url' => trim((string) ($part['button_url'] ?? '')),
            ];
        }
        $audience = Audience::clean($data['audience'] ?? null);

        $campaign->fill([
            'name' => $data['name'],
            'audience' => $audience,
            'content' => $content,
            'trigger' => $automation ? $data['trigger'] : null,
            'trigger_config' => array_filter([
                'delay' => $automation ? (int) $data['delay'] : null,
                'voucher_code' => trim((string) ($data['voucher_code'] ?? '')) ?: null,
            ], fn ($v) => $v !== null),
        ]);
        $campaign->created_by ??= $userId;
        $campaign->save();

        return $campaign;
    }
}
