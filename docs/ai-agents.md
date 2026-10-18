# AI agents (MCP)

Sunrice has an [MCP](https://modelcontextprotocol.io) server that AI agents connect to. Commerce adds
store tools to it: the agent can look up orders, ship them, check payments, adjust stock, run reports
and change settings, with the same rules and permissions as a person in the admin.

## Contents

- [Connecting an agent](#connecting-an-agent)
- [Which tools an agent sees](#which-tools-an-agent-sees)
- [The tools](#the-tools)
- [Asking first: `confirm: true`](#asking-first-confirm-true)
- [Money in tools](#money-in-tools)
- [Editing products](#editing-products)
- [The activity log](#the-activity-log)
- [Workflows and prompts](#workflows-and-prompts)
- [Adding tools](#adding-tools)

## Connecting an agent

The store tools use Sunrice's server, endpoint and tokens. Nothing extra to set up.

1. Pick the user the agent acts as. Give their role **Connect AI agents** (`sunrice.ai-access`) and
   the store permissions it needs (for example Shop Manager, or a narrower role; see
   [accounts.md](accounts.md#roles-and-permissions)).
2. Create a token in the admin under **AI access**, or on the command line:

   ```bash
   php artisan sunrice:mcp-token manager@example.com --name="Store assistant"
   ```

   The token is shown once. `--list` shows the user's tokens and `--revoke=ID` revokes one.
3. Add the server to your agent: the URL is `https://your-site/mcp` (Sunrice's `sunrice.mcp.path`),
   with the header `Authorization: Bearer sr_…`. The AI access page shows ready-made settings.

See Sunrice's AI agents guide (`docs/ai-agents.md` in Sunrice) for stdio, rate limits and Sunrice's
own tools.

## Which tools an agent sees

Store tools are listed only while:

- **Store tools for AI agents** (`ai_tools`, Settings → Store → Features, on by default) is on;
- the tool's module is on (for example `vouchers` for `save_voucher`);
- the token's user has the tool's permission.

Hidden tools aren't listed, and calling one anyway is refused. `get_store_info` tells the agent
which store tools it may use. An agent can't switch `ai_tools` off; that is done in the admin.

## The tools

All 23, in the order agents see them (`Mcp\StoreTools`):

| Tool | Does | Module | Permission |
| --- | --- | --- | --- |
| `get_store_info` | Start here: store name and email, selling mode, currency with an example amount, whether orders are paused, every module and whether it's on, the to-dos, the store tools you may use | — | — |
| `list_orders` | Orders or quotes, newest first. Filters: `type`, `status`, `payment_status`, `fulfillment_status`, `from`/`to` (`Y-m-d`), `search` (number, name, email, phone, SKU), `limit` (25, up to 100) | `orders` | `commerce.orders.view` |
| `get_order` | One order or quote by id or number: items, totals, addresses, payment, shipments, refunds, the 20 latest timeline entries and `next_statuses` | `orders` | `commerce.orders.view` |
| `update_order` | Change an order: `status` (with `reason`), a `note` (`to_customer` emails it), a `shipment` with tracking, `mark_paid` (with `reference`), `shipping_address` / `billing_address` | `orders` | `commerce.orders.view`, plus each change's own (below) |
| `create_order` | A manual order (phone, chat, walk-in): `lines` of variant ids and quantities, the customer by `customer_id` or `email`, optional shipping, discount, payment status and method; `send_link` emails a payment link | `orders` | `commerce.orders.create` (`unit_price` also needs `commerce.orders.override-prices`) |
| `refund_order` | Record a refund already paid back: `amount`, `reason`, returned `items`, `restock` | `orders` | `commerce.orders.refund` |
| `list_payment_confirmations` | "I have paid" confirmations (default: waiting): order, amount sent against expected, sender, bank, account paid into, date, whether there is a proof | `manual_payments` | `commerce.payments.verify` |
| `review_payment_confirmation` | Approve (the order becomes paid) or reject (with a reason the customer sees). `anyway: true` approves less than expected | `manual_payments` | `commerce.payments.verify` |
| `list_products` | Products: entry id, title, type, price or range, in stock, featured, status. `search` (title or SKU), `stock` (`in`, `out`, `low`), `featured` | `catalog` | Viewing the products collection |
| `get_product` | One product by entry id or SKU: the Product data field, variants with ids, live stock and prices, and editing notes | `catalog` | Viewing the products collection |
| `adjust_stock` | Add or remove units of a variant (by SKU or id), or set the count (`set: true`), with a reason (`manual`, `correction`, `import`) and a note | `inventory` | `commerce.inventory.adjust` |
| `list_customers` | Customers: name, email, phone, account or guest, orders, amount spent. `search`, `sort` (`recent`, `spent`, `orders`) | — | `commerce.customers.view` |
| `get_customer` | One customer by id or email: contact details, addresses, marketing consent, staff note, 10 latest orders | — | `commerce.customers.view` |
| `list_vouchers` | Vouchers and automatic discounts: code, name, type, value, dates, uses, active | `vouchers` | `commerce.vouchers.manage` |
| `save_voucher` | Create or change a voucher or automatic discount | `vouchers` | `commerce.vouchers.manage` |
| `list_flash_sales` | Flash sales: dates, state, item count, units sold | `flash_sales` | `commerce.flash-sales.manage` |
| `save_flash_sale` | Create or change a flash sale | `flash_sales` | `commerce.flash-sales.manage` |
| `save_pricing_rule` | Create or change a pricing rule (quantity tiers for an audience) | `pricing_rules` | `commerce.pricing-rules.manage` |
| `sales_report` | Run any report from Shop → Reports (`sales` by default): `period` or `from`/`to`, `compare`, `interval`, `limit` (100 rows) | `analytics` | `commerce.reports.view` |
| `get_store_settings` | Without `section`, the settings sections you may change; with one, its fields and current values | — | A `commerce.settings.*` section permission |
| `update_store_settings` | Change values in one section, merged over the current ones and validated like the admin form | — | The section's permission |
| `set_store_feature` | Switch a module on or off; modules that depend on it follow | — | `commerce.settings.features` |
| `quote_shipping` | Shipping options and costs for variants and quantities to a destination, as checkout would offer them | `shipping` | `commerce.orders.view` |

Notes:

- **`update_order`** checks each change: a status change needs `commerce.orders.edit`
  (`commerce.orders.cancel` to cancel, `commerce.quotes.respond` for quotes); `mark_paid` needs
  `commerce.payments.verify`; a shipment needs `commerce.shipments.manage` and the `shipping`
  module; notes and addresses need `commerce.orders.edit`. A shipment without `items` ships
  everything not shipped yet. `get_order`'s `next_statuses` lists the statuses allowed now.
- **`save_voucher`, `save_flash_sale` and `save_pricing_rule`** use the admin's forms. Called without
  `values`, they return the form's fields and the current values; then send only what changes (it
  is merged over the current values). Leave out `id` to create.
- **Settings tools** cover the form sections (General, Catalog, Digital products, Checkout, Taxes,
  Accounts, Documents, and extensions' sections) the user may edit. Payments, shipping zones and emails have their own admin
  pages and aren't here; features are switched with `set_store_feature`. Password fields are never
  returned.
- **`sales_report`** answers with the report's columns and kinds, rows (without links), totals and
  summary. Reports whose module is off aren't available.
- **Read-only tools** (`get_*`, `list_*`, `sales_report`, `quote_shipping`) are marked read-only for
  agents; `refund_order` is marked destructive.
- Refusals the admin would show (a status change that isn't allowed, more than was paid, out of
  stock) come back as tool errors the agent can read and explain.

## Asking first: `confirm: true`

Some actions change money or what customers see. Their tools refuse until the agent calls again with
`confirm: true`, and the refusal tells the agent to ask the user first:

| Tool | Needs `confirm: true` for |
| --- | --- |
| `update_order` | Cancelling, and marking paid |
| `refund_order` | Every refund |
| `review_payment_confirmation` | Approving and rejecting |
| `set_store_feature` | Switching any module on or off |
| `save_pricing_rule` | Saving an active rule (it changes prices) |
| `save_flash_sale` | Saving an active sale with items |

Agents are told to check the bank account before approving a transfer. The proof image is only in
the admin (Shop → Payments to verify).

## Money in tools

Every amount an agent reads is an object with the integer in the currency's smallest unit and the
formatted text:

```json
{ "total": { "amount": 150000, "formatted": "Rp150.000" } }
```

Amounts an agent sends (`refund_order`'s `amount`, `create_order`'s `unit_price`, shipping cost,
promotion values) are integers in the smallest unit too. `sales_report` rows and totals are plain
integers. `get_store_info` gives the currency code, decimals and an example.

## Editing products

Products are Sunrice entries. Their title, description, images and SEO, and the store data (type,
variants, prices, SKUs, weights, options, tiers…), are edited with Sunrice's entry tool
`update_entry`. The store data is the Product data field, `product` by default
(`commerce.catalog.field`).

1. `list_products` or `get_product` to find the entry id.
2. `get_product` returns the field's current value under `product`, the variants with their ids, and
   `editing`, which explains the shape: the keys, variant fields, money as integers, weight in
   grams.
3. `update_entry` with the whole object back as `fields.product`. Keep existing variant ids.
4. Publish the entry (`publish: true`): prices and variants reach the store when the entry is
   published.

Stock is not changed this way: `initial_stock` only applies to new variants. Use `adjust_stock`, so
changes are in the stock history. See [catalog.md](catalog.md).

## The activity log

Everything an agent changes goes through the admin's actions, so it is in Sunrice's activity log with
the source **AI agent** (`ai`) and the token's name, as well as the user. Order timelines show the
same: changes by an agent are marked with source `ai` (`Orders\Actor::ai()`). Filter the activity
log by source to see what agents did, or let an agent read it with Sunrice's `get_activity`.

## Workflows and prompts

Ask in plain words. Some that work well:

**Answering customers**

- "A customer asks where order ORD-20261016-0012 is. Look it up and write a short, friendly reply
  with the courier and tracking link."
- "Rina (rina@example.com) asks whether her payment arrived. Check her latest order and its payment
  status."
- "How much is shipping for two of SKU KAOS-HITAM-M to Bandung? List the options with their
  delivery times." (`quote_shipping` needs region codes; the agent can find them from an existing
  address or ask.)
- "Is the blue variant of the Tumbler in stock? If not, when did we last sell one?"

**Shipping a batch**

- "List the orders to ship. For each one I give you a JNE tracking number, add the shipment and
  tell me when you're done:" followed by the numbers.
- "Mark order ORD-20261015-0031 as shipped with SiCepat, tracking 0042…, only the two mugs; the
  rest ships next week."

**Checking payments**

- "Show the payment confirmations waiting for review, and flag any where the amount sent doesn't
  match the amount expected."
- "I checked the bank: the transfers for ORD-…-0007 and ORD-…-0009 arrived. Approve both." The
  agent asks for confirmation, then approves.
- "Reject the confirmation for ORD-…-0011: nothing arrived. Tell the customer to send the proof
  again."

**Running the store**

- "How did sales do this month compared with last month? Which products and categories grew?"
- "Which products are low on stock? Put 24 more of each SKU I list on the shelf."
- "Create a voucher LEBARAN10: 10% off, from 1 to 7 April, at most 100 uses."
- "Customers who buy 10 or more of any T-shirt get 15% off. Set that up as a pricing rule."

Start sessions with "Start with get_store_info" if your agent doesn't do it by itself. For
pricing rules and other bulk price changes, review what the agent proposes before it saves: these
tools don't ask for `confirm`.

## Adding tools

Extensions add their own store tools with `Sunrice::registerMcpTool()`. Extending
`Mcp\CommerceTool` gives the same checks (`ai_tools`, the module, the permission), the `ai` actor and
`confirm: true` handling. See [extending.md](extending.md#mcp-tools).
