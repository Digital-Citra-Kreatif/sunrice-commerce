<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Database\Eloquent\Model;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Sunrice\Commerce\Mcp\CommerceTool;

/**
 * Saves a promotion through the same action and form values as its
 * admin page. Without values it describes the form (fields and the
 * current values); with values they are merged over the current ones, so
 * only the keys that change need sending.
 *
 * @template TModel of Model
 */
abstract class SaveWithFormTool extends CommerceTool
{
    /** The Promotions\Actions\Save* action (fields(), values(), handle()). */
    abstract protected function action(): object;

    /** @return TModel|null the record to update, or a new one */
    abstract protected function record(?int $id): ?Model;

    /**
     * @param  TModel  $model
     * @return array<string, mixed>
     */
    abstract protected function present(Model $model): array;

    protected function run(Request $request): Response
    {
        $args = $request->validate(['id' => ['nullable', 'integer'], 'values' => ['nullable', 'array'], 'confirm' => ['boolean']]);
        $model = $this->record(isset($args['id']) ? (int) $args['id'] : null);
        if ($model === null) {
            return $this->notFound('Record');
        }
        $action = $this->action();
        if (! isset($args['values'])) {
            return $this->json(['fields' => self::describe($action->fields()), 'values' => $action->values($model)]);
        }
        $values = array_replace($action->values($model), $args['values']);
        if (($what = $this->needsConfirmation($values)) !== null && ($refused = $this->unconfirmed($request, $what)) !== null) {
            return $refused;
        }
        $saved = $action->handle($model, $values);

        return $this->json(['saved' => true, ...$this->present($saved->refresh())]);
    }

    /**
     * What saving these values does that the user must agree to first (it
     * changes many prices), or null.
     *
     * @param  array<string, mixed>  $values
     */
    protected function needsConfirmation(array $values): ?string
    {
        return null;
    }

    /**
     * The form's fields in a compact form for agents.
     *
     * @param  array<int, array<string, mixed>>  $fields
     * @return array<int, array<string, mixed>>
     */
    protected static function describe(array $fields): array
    {
        return array_map(fn (array $f) => array_filter([
            'handle' => $f['handle'], 'type' => $f['type'], 'label' => $f['label'] ?? null, 'required' => $f['required'] ?? null,
            'instructions' => $f['instructions'] ?? null,
            'options' => isset($f['config']['options']) ? array_column($f['config']['options'], 'value') : null,
            'fields' => isset($f['config']['fields']) ? self::describe($f['config']['fields']) : null,
        ], fn ($v) => $v !== null), $fields);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'id' => $schema->integer()->description('The record to change; leave out to create one.'),
            'values' => $schema->object()->description('Form values to change (merged over the current ones). Leave out to get the fields and current values first. '
                .'Money is an integer in the smallest currency unit; percents are numbers (12.5); dates are {start, end} ISO 8601; '
                .'product targets are [{type: product | variant | term, id}].'),
            'confirm' => $schema->boolean()->description('Saving an active pricing rule or flash sale changes many prices: ask the user, then send true.'),
        ];
    }
}
