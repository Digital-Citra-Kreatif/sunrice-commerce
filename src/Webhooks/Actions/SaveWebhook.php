<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Webhooks\Actions;

use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Admin\SchemaForm;
use Sunrice\Commerce\Support\ActivityRecorder;
use Sunrice\Commerce\Webhooks\EndpointUrl;
use Sunrice\Commerce\Webhooks\Models\Webhook;
use Sunrice\Commerce\Webhooks\Webhooks;

/**
 * Creates or updates a webhook endpoint from the Settings → Webhooks form.
 * A new endpoint gets its signing secret here; "New secret" replaces it.
 * Switching an endpoint back on clears its failure count.
 */
class SaveWebhook
{
    /** @return array<int, array<string, mixed>> */
    public function fields(): array
    {
        return [
            ['handle' => 'name', 'type' => 'text', 'label' => 'Name', 'required' => true, 'translatable' => false, 'instructions' => 'For you: "Accounting", "Warehouse"…', 'config' => ['max' => 120]],
            ['handle' => 'url', 'type' => 'text', 'label' => 'URL', 'required' => true, 'translatable' => false, 'instructions' => 'A public https:// address that answers 2xx.', 'validation' => ['url', 'max:2000']],
            ['handle' => 'events', 'type' => 'select', 'label' => 'Events', 'required' => true,
                'config' => ['multiple' => true, 'options' => array_map(fn (string $key, string $label) => ['value' => $key, 'label' => "{$label} ({$key})"], array_keys(Webhooks::EVENTS), Webhooks::EVENTS)]],
            ['handle' => 'active', 'type' => 'toggle', 'label' => 'Active', 'instructions' => 'Switched off on its own after many failed deliveries in a row.'],
            ['handle' => 'rotate_secret', 'type' => 'toggle', 'label' => 'New signing secret', 'instructions' => 'Replaces the secret: update the receiving end right away.'],
        ];
    }

    /** @return array<string, mixed> */
    public function values(Webhook $webhook): array
    {
        return ['name' => $webhook->name, 'url' => $webhook->url, 'events' => $webhook->events ?? [], 'active' => $webhook->active ?? true, 'rotate_secret' => false];
    }

    /**
     * @param  array<string, mixed>  $input  the form's values
     *
     * @throws ValidationException
     */
    public function handle(Webhook $webhook, array $input): Webhook
    {
        $values = SchemaForm::make($this->fields())->validate($input, [
            'events' => ['required', 'array', 'min:1'],
            'events.*' => ['string', 'in:'.implode(',', array_keys(Webhooks::EVENTS))],
        ]);
        $url = trim((string) $values['url']);
        if (($problem = EndpointUrl::problem($url)) !== null) {
            throw SchemaForm::prefixed(ValidationException::withMessages(['url' => $problem]));
        }
        $active = (bool) $values['active'];
        $webhook->fill([
            'name' => $values['name'], 'url' => $url, 'events' => array_values(array_unique((array) $values['events'])), 'active' => $active,
        ]);
        if (! $webhook->exists || (bool) ($values['rotate_secret'] ?? false)) {
            $webhook->secret = Webhooks::newSecret();
        }
        if ($active && $webhook->isDirty('active')) {
            $webhook->failures = 0;
            $webhook->disabled_at = null;
        }
        $webhook->save();
        app(Webhooks::class)->flush();
        app(ActivityRecorder::class)->record($webhook->wasRecentlyCreated ? 'created' : 'updated', "Webhook: {$webhook->name}", [], 'webhook');

        return $webhook;
    }
}
