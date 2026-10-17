<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Inventory\Actions\AdjustStock;
use Sunrice\Commerce\Mcp\CommerceTool;

#[Description('Change a variant\'s stock, like Shop → Inventory: add or remove units (quantity +5 / -2) or set the count (set: true). The variant is a SKU or variant id; reason is manual, correction or import, and the change is kept in the stock history with a note.')]
class AdjustStockTool extends CommerceTool
{
    protected string $name = 'adjust_stock';

    protected ?string $feature = 'inventory';

    protected ?string $permission = 'commerce.inventory.adjust';

    protected function run(Request $request): Response
    {
        $args = $request->validate([
            'variant' => ['required'], 'quantity' => ['required', 'integer', 'min:-1000000', 'max:1000000'], 'set' => ['boolean'],
            'reason' => ['nullable', 'in:manual,correction,import'], 'note' => ['nullable', 'string', 'max:255'],
        ]);
        $key = (string) $args['variant'];
        $variant = Variant::query()->where('sku', $key)->first() ?? (ctype_digit($key) ? Variant::query()->find((int) $key) : null);
        if ($variant === null) {
            return $this->notFound('Variant');
        }
        if (! $variant->track_stock) {
            return Response::error("Stock isn't tracked for {$key}: switch on stock tracking in the product first.");
        }
        $before = (int) $variant->stock_quantity;
        $variant = app(AdjustStock::class)->handle($variant, (int) $args['quantity'], (bool) ($args['set'] ?? false), $args['reason'] ?? 'manual', $args['note'] ?? null, (int) auth()->id());

        return $this->json(['sku' => $variant->sku, 'before' => $before, 'stock' => (int) $variant->stock_quantity, 'stock_status' => $variant->stock_status]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'variant' => $schema->string()->description('SKU or variant id.')->required(),
            'quantity' => $schema->integer()->description('Units to add (negative to remove), or the new count with set.')->required(),
            'set' => $schema->boolean()->description('Set the count instead of adding.'),
            'reason' => $schema->string()->enum(['manual', 'correction', 'import']),
            'note' => $schema->string(),
        ];
    }
}
