# Sunrice Commerce interface audit

This is a source and flow review of the starter storefront and the Commerce admin. It covers
catalog setup, promotions, product discovery and detail, cart and checkout, and post-purchase
pages. The table distinguishes observed behavior from work still pending. Rendering in a
custom published theme can differ from the starter templates.

| Priority | Flow | Finding and status |
| --- | --- | --- |
| High | Flash Sale editor | The picker accepted several targets and saved only the first. One rule now applies to all selected products and variants. The picker gets a full row. The discount field appears for the chosen method, and quantity caps explain their defaults. |
| High | Product editor and storefront CTA | “Follow the store” hid which action shoppers would get. The selector now shows the inherited action and source. Storefront rendering and cart eligibility share the same resolver. |
| High | Checkout | Contact, address, shipping, payment, verification and final submission are in a single form. When repricing is pending, the button state and status text communicate it, but the status sits near final submission and may be out of view when changing address or payment. Surface progress beside the section that triggered it and test recovery with an invalid address, quote failure and expired CAPTCHA. |
| Medium | Catalog and product details | Mobile product filters use a drawer and the product CTA floats when the main controls leave view. Verify long localized labels, swatch keyboard navigation, and floating CTA behavior with the onscreen keyboard at narrow widths. |
| Medium | Cart and mini cart | Removal has a confirmation and quantity changes update the cart. The mini cart has a direct checkout action. Verify that the full cart and mini cart explain the same discounts and that slow updates keep the affected row visible and understandable. |
| Medium | Wishlist and Compare | Compare can be opened from the header or a notification. Its comparison table scrolls horizontally on phones. Give the horizontal area a visible scroll cue and keep row labels in view so values are easier to match to attributes. |
| Medium | Orders and downloads | The account order list has search and filters; the order detail separates payment, fulfillment and files. Review the action copy for pending payment, partial shipment and unavailable files, where customers need one clear next action. |

## Configuration and ownership

For a policy that can vary by product, the target precedence is **Store → Category → Brand →
Product**. Use an explicit **Default** choice with the effective value and source. Distinguish an
inherited value from an explicit off/none choice. When multiple rules match at the same scope,
show their ordering. Price campaigns and eligibility rules can overlap; audit their stacking and
limits alongside any migration to inheritance.

| Configuration family | Current behavior and remaining work |
| --- | --- |
| Storefront button | Four levels supported. First matching rule in each scope wins. Rules match terms directly assigned to the product. |
| Stock and fulfillment policies | Stock is tracked per variant. Low-stock thresholds use variant or store. Shipping eligibility and several item attributes are read from products and variants. Apply the hierarchy to policy defaults and use the same effective value in the editor, availability checks, checkout and reports. Actual inventory quantities remain item records. |
| Price visibility and presentation | Visibility, variable-price display and stock display have store-level settings. Promotions have explicit targets, priorities and stacking behavior. Add scoped defaults consistently across listings, detail pages, cart pricing and feeds before exposing overrides. |
| Tax, shipping and digital delivery | Tax classes are item attributes. Carriers and rates depend on destination and order contents. Digital delivery has store defaults and product overrides. Add category and brand policy to eligible item-level choices while keeping final rate, tax and download decisions consistent with the order. |
| Reviews and discovery | Review eligibility and approval, Compare limits, search and listing filters govern different surfaces. Audit which settings are meaningful per product and show the source wherever an override is supported. |
| Store and order settings | Currency, payment credentials, selling workflow, order numbering and account access govern the store or whole transaction. Define how item-level policies combine in a mixed cart before making any transaction-wide setting overridable. |
