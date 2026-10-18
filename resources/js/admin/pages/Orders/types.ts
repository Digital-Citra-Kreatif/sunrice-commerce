export interface OrderItemRow {
    id: number; name: string; variant_title: string | null; sku: string | null; options: Record<string, string> | null;
    quantity: number; fulfilled_quantity: number; refunded_quantity: number; unfulfilled: number; requires_shipping: boolean;
    unit_price: number; unit_price_formatted: string; regular_unit_price: string | null; price_source: { type: string; label: string };
    subtotal: string; discount: string | null; total: string; product_href: string | null;
    components: Array<{ name: string; sku: string | null; quantity: number }>;
}

export interface OrderData {
    id: number; type: 'order' | 'quote'; number: string; order_key: string;
    status: string; status_label: string; payment_status: string; payment_label: string; fulfillment_status: string; fulfillment_label: string;
    channel: string; selling_mode: string; locale: string | null;
    placed_at: string | null; expires_at: string | null; paid_at: string | null; completed_at: string | null; cancelled_at: string | null;
    cancel_reason: string | null; quote_valid_until: string | null; trashed: boolean;
    customer: { name: string | null; email: string | null; phone: string | null; href: string | null; guest: boolean };
    shipping_address: Record<string, string | null> | null; billing_address: Record<string, string | null> | null;
    shipping_address_text: string | null; billing_address_text: string | null;
    shipping_method: { label?: string; method?: string; eta?: string | null } | null;
    pickup: { name: string; address: string | null } | null;
    payment_method_title: string | null; customer_note: string | null;
    dropship: { name: string | null; phone: string | null } | null; fields: Record<string, unknown> | null;
    items: OrderItemRow[];
    totals: { subtotal: string; discount: string | null; shipping: string | null; fees: string | null; tax: string | null; tax_included: boolean;
        total: string; total_amount: number; paid: string; refunded: string | null; refundable: number };
    adjustments: Array<{ kind: string; label: string; code: string | null; source: string; amount: string; included: boolean }>;
    payments: Array<{ id: number; method: string; amount: string; status: string; reference: string | null; paid_at: string | null; expires_at: string | null; refunded: string | null }>;
    confirmations: Array<{ id: number; sender_name: string; sender_bank: string | null; amount: string; status: string; created_at: string | null; proof_url: string | null; can_review: boolean }>;
    shipments: Array<{ id: number; courier: string | null; service: string | null; tracking_number: string | null; tracking_url: string | null; status: string;
        shipped_at: string | null; delivered_at: string | null; items: Array<{ name: string | null; quantity: number }> }>;
    refunds: Array<{ id: number; amount: string; reason: string | null; restock: boolean; created_at: string | null }>;
    documents: Array<{ type: string; label: string; number: string | null; url: string }>;
    downloads: Array<{ id: number; name: string; count: number; remaining: number | null; expires_at: string | null; revoked: boolean; state: string }>;
    timeline: Array<{ id: number; type: string; visibility: string; message: string | null; source: string; actor: string | null; created_at: string | null }>;
    storefront_url: string;
}

export interface OrderPageProps {
    order: OrderData;
    transitions: Array<{ to: string; label: string; allowed: boolean; reason: string | null; permission: boolean }>;
    couriers: Array<{ key: string; name: string }>;
    panels: Array<{ key: string; label: string; data: Record<string, unknown> }>;
    can: Record<'edit' | 'cancel' | 'refund' | 'delete' | 'force_delete' | 'mark_paid' | 'shipments' | 'edit_items' | 'respond_quote' | 'edit_addresses' | 'send_link', boolean>;
}
