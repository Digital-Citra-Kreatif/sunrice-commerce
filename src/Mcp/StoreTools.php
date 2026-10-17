<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Mcp;

/** The store's MCP tools, in the order agents see them. */
final class StoreTools
{
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
