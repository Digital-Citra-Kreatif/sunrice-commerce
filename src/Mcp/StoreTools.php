<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Mcp;

/** The store's MCP tools, in the order agents see them. */
final class StoreTools
{
    /** Added to the MCP server's instructions (Sunrice::addMcpInstructions). */
    public const INSTRUCTIONS = <<<'MD'
        ## Store
        Store tools start with get_store_info. Ask the user before approving payments, refunding,
        cancelling orders, switching store features or changing many prices (pricing rules, flash
        sales); those tools need confirm: true. Products are Sunrice entries: change their content and
        Product data with update_entry (field `product`); get_product shows the field's shape.
        MD;

    /** @var array<int, class-string<CommerceTool>> */
    public const ALL = [
        Tools\GetStoreInfoTool::class,
        Tools\ListOrdersTool::class,
        Tools\GetOrderTool::class,
        Tools\UpdateOrderTool::class,
        Tools\CreateOrderTool::class,
        Tools\RefundOrderTool::class,
        Tools\ListPaymentConfirmationsTool::class,
        Tools\ReviewPaymentConfirmationTool::class,
        Tools\ListProductsTool::class,
        Tools\GetProductTool::class,
        Tools\AdjustStockTool::class,
        Tools\ListCustomersTool::class,
        Tools\GetCustomerTool::class,
        Tools\ListVouchersTool::class,
        Tools\SaveVoucherTool::class,
        Tools\ListFlashSalesTool::class,
        Tools\SaveFlashSaleTool::class,
        Tools\SavePricingRuleTool::class,
        Tools\SalesReportTool::class,
        Tools\GetStoreSettingsTool::class,
        Tools\UpdateStoreSettingsTool::class,
        Tools\SetStoreFeatureTool::class,
        Tools\QuoteShippingTool::class,
    ];
}
