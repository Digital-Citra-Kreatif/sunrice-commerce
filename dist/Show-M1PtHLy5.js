import { i as I, c as t, d as A, j as r, b as d, M as W, u as X, a as Z, R as T, e as ee, P as te, S as q, F as C } from "./main-BZm25ssn.js";
function re({ order: o, couriers: a, onClose: _ }) {
  const { Dialog: m, DialogContent: F, DialogFooter: h, DialogHeader: p, DialogTitle: g, Button: u, Input: i, Label: N } = A, b = o.items.filter((n) => n.unfulfilled > 0), c = I.useForm({
    courier: a[0]?.key ?? "",
    courier_name: "",
    service: "",
    tracking_number: "",
    items: b.map((n) => ({ order_item_id: n.id, quantity: n.unfulfilled }))
  }), x = c.errors;
  return /* @__PURE__ */ t(m, { open: !0, onOpenChange: (n) => !n && _(), children: /* @__PURE__ */ r(F, { children: [
    /* @__PURE__ */ t(p, { children: /* @__PURE__ */ t(g, { children: "Add a shipment" }) }),
    /* @__PURE__ */ r("form", { className: "cm:grid cm:gap-3", onSubmit: (n) => {
      n.preventDefault(), c.post(d(`commerce/orders/${o.id}/shipments`), { preserveScroll: !0, onSuccess: _ });
    }, children: [
      /* @__PURE__ */ r("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ t(N, { htmlFor: "s-courier", children: "Courier" }),
        /* @__PURE__ */ r("select", { id: "s-courier", className: "cm:h-9 cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm", value: c.data.courier, onChange: (n) => c.setData("courier", n.target.value), children: [
          a.map((n) => /* @__PURE__ */ t("option", { value: n.key, children: n.name }, n.key)),
          /* @__PURE__ */ t("option", { value: "", children: "Other…" })
        ] })
      ] }),
      c.data.courier === "" && /* @__PURE__ */ r("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ t(N, { htmlFor: "s-name", children: "Courier name" }),
        /* @__PURE__ */ t(i, { id: "s-name", value: c.data.courier_name, onChange: (n) => c.setData("courier_name", n.target.value) })
      ] }),
      /* @__PURE__ */ r("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ t(N, { htmlFor: "s-service", children: "Service" }),
        /* @__PURE__ */ t(i, { id: "s-service", placeholder: "REG, YES…", value: c.data.service, onChange: (n) => c.setData("service", n.target.value) })
      ] }),
      /* @__PURE__ */ r("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ t(N, { htmlFor: "s-tracking", children: "Tracking number" }),
        /* @__PURE__ */ t(i, { id: "s-tracking", value: c.data.tracking_number, onChange: (n) => c.setData("tracking_number", n.target.value) })
      ] }),
      /* @__PURE__ */ r("fieldset", { className: "cm:grid cm:gap-2", children: [
        /* @__PURE__ */ t("legend", { className: "cm:mb-1 cm:text-sm cm:font-medium", children: "In this parcel" }),
        b.map((n, S) => /* @__PURE__ */ r("label", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:text-sm", children: [
          /* @__PURE__ */ r("span", { children: [
            n.name,
            n.variant_title ? ` · ${n.variant_title}` : "",
            " ",
            /* @__PURE__ */ r("span", { className: "cm:text-muted-foreground", children: [
              "(",
              n.unfulfilled,
              " left)"
            ] })
          ] }),
          /* @__PURE__ */ t(
            i,
            {
              type: "number",
              min: 0,
              max: n.unfulfilled,
              className: "cm:w-20",
              value: c.data.items[S].quantity,
              onChange: (D) => c.setData("items", c.data.items.map((w, B) => B === S ? { ...w, quantity: Number(D.target.value) } : w))
            }
          )
        ] }, n.id)),
        x.items && /* @__PURE__ */ t("p", { className: "cm:text-sm cm:text-destructive", children: x.items })
      ] }),
      /* @__PURE__ */ r(h, { children: [
        /* @__PURE__ */ t(u, { type: "button", variant: "outline", onClick: _, children: "Cancel" }),
        /* @__PURE__ */ t(u, { type: "submit", disabled: c.processing, children: "Save shipment" })
      ] })
    ] })
  ] }) });
}
function ae({ order: o, onClose: a }) {
  const { Dialog: _, DialogContent: m, DialogFooter: F, DialogHeader: h, DialogTitle: p, DialogDescription: g, Button: u, Input: i, Label: N, Checkbox: b } = A, c = I.useForm({
    amount: o.totals.refundable,
    reason: "",
    restock: !1,
    items: o.items.map((l) => ({ order_item_id: l.id, quantity: 0 }))
  }), x = c.errors;
  return /* @__PURE__ */ t(_, { open: !0, onOpenChange: (l) => !l && a(), children: /* @__PURE__ */ r(m, { children: [
    /* @__PURE__ */ r(h, { children: [
      /* @__PURE__ */ t(p, { children: "Refund" }),
      /* @__PURE__ */ t(g, { children: "Record money you returned to the customer." })
    ] }),
    /* @__PURE__ */ r("form", { className: "cm:grid cm:gap-3", onSubmit: (l) => {
      l.preventDefault(), c.post(d(`commerce/orders/${o.id}/refunds`), { preserveScroll: !0, onSuccess: a });
    }, children: [
      /* @__PURE__ */ r("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ t(N, { htmlFor: "r-amount", children: "Amount" }),
        /* @__PURE__ */ t(W, { id: "r-amount", value: c.data.amount, onChange: (l) => c.setData("amount", l) }),
        x.amount && /* @__PURE__ */ t("p", { className: "cm:text-sm cm:text-destructive", children: x.amount })
      ] }),
      /* @__PURE__ */ r("fieldset", { className: "cm:grid cm:gap-2", children: [
        /* @__PURE__ */ t("legend", { className: "cm:mb-1 cm:text-sm cm:font-medium", children: "Items returned (optional)" }),
        o.items.map((l, n) => /* @__PURE__ */ r("label", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:text-sm", children: [
          /* @__PURE__ */ r("span", { children: [
            l.name,
            l.variant_title ? ` · ${l.variant_title}` : ""
          ] }),
          /* @__PURE__ */ t(
            i,
            {
              type: "number",
              min: 0,
              max: l.quantity - l.refunded_quantity,
              className: "cm:w-20",
              value: c.data.items[n].quantity,
              onChange: (S) => c.setData("items", c.data.items.map((D, w) => w === n ? { ...D, quantity: Number(S.target.value) } : D))
            }
          )
        ] }, l.id))
      ] }),
      /* @__PURE__ */ r("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
        /* @__PURE__ */ t(b, { checked: c.data.restock, onCheckedChange: (l) => c.setData("restock", l === !0) }),
        " Put the returned items back in stock"
      ] }),
      /* @__PURE__ */ r("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ t(N, { htmlFor: "r-reason", children: "Reason" }),
        /* @__PURE__ */ t(i, { id: "r-reason", value: c.data.reason, onChange: (l) => c.setData("reason", l.target.value) })
      ] }),
      /* @__PURE__ */ r(F, { children: [
        /* @__PURE__ */ t(u, { type: "button", variant: "outline", onClick: a, children: "Cancel" }),
        /* @__PURE__ */ t(u, { type: "submit", disabled: c.processing, children: "Record refund" })
      ] })
    ] })
  ] }) });
}
const f = (o) => o ? new Date(o).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" }) : "—", O = (o) => ({
  completed: "ok",
  paid: "ok",
  shipped: "ok",
  delivered: "ok",
  accepted: "ok",
  processing: "info",
  quoted: "info",
  partially_shipped: "info",
  awaiting_confirmation: "info",
  partially_refunded: "info",
  pending: "warning",
  requested: "warning",
  on_hold: "warning",
  unpaid: "warning",
  unfulfilled: "warning",
  cancelled: "error",
  failed: "error",
  refunded: "error",
  declined: "error",
  expired: "error"
})[o] ?? "neutral";
function ce(o) {
  const { order: a, transitions: _, can: m, panels: F } = o, { Card: h, CardContent: p, CardHeader: g, CardTitle: u, Button: i, Textarea: N, Label: b, Checkbox: c, Input: x, Dialog: l, DialogContent: n, DialogFooter: S, DialogHeader: D, DialogTitle: w, DialogDescription: B } = A, { Link: j, router: $ } = I;
  X(), Z([{ label: "Shop", href: d("commerce") }, { label: "Orders", href: d("commerce/orders") }, { label: a.number }]);
  const v = `commerce/orders/${a.id}`, [P, M] = T.useState(null), [L, Q] = T.useState(""), [U, z] = T.useState(!1), [K, E] = T.useState(!1), [Y, H] = T.useState(!1), k = I.useForm({ message: "", customer: !1 }), y = I.useForm({ reference: "", paid_at: "", account: "" }), J = ee.orderPanels(), G = (e, s) => $.post(d(`${v}/transition`), { to: e, reason: s ?? null }, { preserveScroll: !0, onFinish: () => M(null) });
  return /* @__PURE__ */ r("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-6", children: [
    /* @__PURE__ */ t(
      te,
      {
        title: `${a.type === "quote" ? "Quote" : "Order"} ${a.number}`,
        description: /* @__PURE__ */ r(C, { children: [
          "Placed ",
          f(a.placed_at),
          " · ",
          a.channel,
          a.trashed ? " · in the trash" : ""
        ] }),
        back: { href: d("commerce/orders"), label: "Back to orders" },
        actions: /* @__PURE__ */ r(C, { children: [
          m.mark_paid && /* @__PURE__ */ t(i, { variant: "outline", onClick: () => z(!0), children: "Mark paid" }),
          m.shipments && a.items.some((e) => e.unfulfilled > 0) && /* @__PURE__ */ t(i, { variant: "outline", onClick: () => E(!0), children: "Add shipment" }),
          _.filter((e) => e.permission && e.allowed && e.to !== "cancelled" && e.to !== "on_hold").map((e) => /* @__PURE__ */ r(i, { variant: "outline", onClick: () => G(e.to), children: [
            "Mark ",
            e.label.toLowerCase()
          ] }, e.to))
        ] }),
        primary: m.respond_quote ? /* @__PURE__ */ t(i, { asChild: !0, children: /* @__PURE__ */ t(j, { href: d(`${v}/quote`), children: a.status === "quoted" ? "Edit quote" : "Send a quote" }) }) : void 0,
        menu: [
          { label: "Customer view", href: a.storefront_url, external: !0 },
          ...m.edit_items ? [{ label: "Edit items", href: d(`${v}/edit`) }] : [],
          ...m.refund ? [{ label: "Refund…", onSelect: () => H(!0) }] : [],
          ...m.send_link ? [{ label: "Send payment link", onSelect: () => $.post(d(`${v}/payment-link`), {}, { preserveScroll: !0 }) }] : [],
          ..._.filter((e) => e.permission && e.allowed && (e.to === "cancelled" || e.to === "on_hold")).map((e) => ({ label: e.to === "cancelled" ? "Cancel order…" : "Put on hold…", onSelect: () => M(e), group: "Status" })),
          ...m.delete && !a.trashed ? [{ label: "Move to trash", destructive: !0, group: "Delete", onSelect: () => {
            window.confirm("Move this order to the trash?") && $.delete(d(v));
          } }] : [],
          ...m.delete && a.trashed ? [{ label: "Restore", group: "Delete", onSelect: () => $.post(d(`${v}/restore`)) }] : [],
          ...m.force_delete ? [{ label: "Delete for good", destructive: !0, group: "Delete", onSelect: () => {
            window.confirm("Delete this order for good? This can't be undone.") && $.delete(d(`${v}/force`));
          } }] : []
        ],
        children: /* @__PURE__ */ r("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-1.5", children: [
          /* @__PURE__ */ t(q, { tone: O(a.status), children: a.status_label }),
          a.type === "order" && /* @__PURE__ */ t(q, { tone: O(a.payment_status), children: a.payment_label }),
          a.type === "order" && a.fulfillment_status !== "not_required" && /* @__PURE__ */ t(q, { tone: O(a.fulfillment_status), children: a.fulfillment_label })
        ] })
      }
    ),
    /* @__PURE__ */ r("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[2fr_1fr]", children: [
      /* @__PURE__ */ r("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ r(h, { children: [
          /* @__PURE__ */ t(g, { children: /* @__PURE__ */ t(u, { children: "Items" }) }),
          /* @__PURE__ */ r(p, { className: "cm:grid cm:gap-4", children: [
            /* @__PURE__ */ t("ul", { className: "cm:divide-y cm:divide-border", children: a.items.map((e) => /* @__PURE__ */ r("li", { className: "cm:grid cm:gap-1 cm:py-3 cm:first:pt-0 cm:sm:grid-cols-[1fr_auto] cm:sm:gap-4", children: [
              /* @__PURE__ */ r("div", { className: "cm:min-w-0", children: [
                /* @__PURE__ */ r("p", { className: "cm:font-medium", children: [
                  e.product_href ? /* @__PURE__ */ t(j, { href: d(e.product_href), className: "cm:hover:underline", children: e.name }) : e.name,
                  e.variant_title && /* @__PURE__ */ r("span", { className: "cm:text-muted-foreground", children: [
                    " · ",
                    e.variant_title
                  ] })
                ] }),
                /* @__PURE__ */ r("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  e.sku && /* @__PURE__ */ r(C, { children: [
                    "SKU ",
                    e.sku,
                    " · "
                  ] }),
                  e.price_source.label,
                  e.requires_shipping && a.fulfillment_status !== "not_required" && /* @__PURE__ */ r(C, { children: [
                    " · shipped ",
                    e.fulfilled_quantity,
                    "/",
                    e.quantity
                  ] }),
                  e.refunded_quantity > 0 && /* @__PURE__ */ r(C, { children: [
                    " · refunded ",
                    e.refunded_quantity
                  ] })
                ] }),
                e.components.length > 0 && /* @__PURE__ */ t("ul", { className: "cm:mt-1 cm:text-xs cm:text-muted-foreground", children: e.components.map((s, V) => /* @__PURE__ */ r("li", { children: [
                  s.quantity,
                  " × ",
                  s.name
                ] }, V)) })
              ] }),
              /* @__PURE__ */ r("div", { className: "cm:text-sm cm:sm:text-right", children: [
                /* @__PURE__ */ r("p", { children: [
                  e.quantity,
                  " × ",
                  e.regular_unit_price && /* @__PURE__ */ t("del", { className: "cm:text-muted-foreground", children: e.regular_unit_price }),
                  " ",
                  e.unit_price_formatted
                ] }),
                e.discount && /* @__PURE__ */ r("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  "−",
                  e.discount
                ] }),
                /* @__PURE__ */ t("p", { className: "cm:font-medium", children: e.total })
              ] })
            ] }, e.id)) }),
            /* @__PURE__ */ r("dl", { className: "cm:grid cm:gap-1 cm:border-t cm:pt-3 cm:text-sm", children: [
              /* @__PURE__ */ t(R, { label: "Subtotal", value: a.totals.subtotal }),
              a.adjustments.filter((e) => e.kind !== "tax").map((e, s) => /* @__PURE__ */ t(R, { label: `${e.label}${e.code ? ` (${e.code})` : ""}`, value: e.amount, muted: !0 }, s)),
              a.totals.shipping !== null && /* @__PURE__ */ t(R, { label: `Shipping${a.shipping_method?.label ? ` · ${a.shipping_method.label}` : ""}`, value: a.totals.shipping }),
              a.adjustments.filter((e) => e.kind === "tax").map((e, s) => /* @__PURE__ */ t(R, { label: `${e.label}${e.included ? " (included)" : ""}`, value: e.amount, muted: !0 }, `t${s}`)),
              /* @__PURE__ */ t(R, { label: "Total", value: a.totals.total, strong: !0 }),
              a.type === "order" && /* @__PURE__ */ t(R, { label: "Paid", value: a.totals.paid, muted: !0 }),
              a.totals.refunded && /* @__PURE__ */ t(R, { label: "Refunded", value: `−${a.totals.refunded}`, muted: !0 })
            ] })
          ] })
        ] }),
        (a.payments.length > 0 || a.confirmations.length > 0) && /* @__PURE__ */ r(h, { children: [
          /* @__PURE__ */ t(g, { children: /* @__PURE__ */ t(u, { children: "Payments" }) }),
          /* @__PURE__ */ r(p, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            a.payments.map((e) => /* @__PURE__ */ r("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2 cm:rounded-md cm:border cm:p-3", children: [
              /* @__PURE__ */ r("div", { children: [
                /* @__PURE__ */ r("p", { className: "cm:font-medium", children: [
                  e.method,
                  " · ",
                  e.amount
                ] }),
                /* @__PURE__ */ r("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  e.reference && /* @__PURE__ */ r(C, { children: [
                    "Ref ",
                    e.reference,
                    " · "
                  ] }),
                  e.paid_at ? `Paid ${f(e.paid_at)}` : e.expires_at ? `Due ${f(e.expires_at)}` : "",
                  e.refunded && ` · refunded ${e.refunded}`
                ] })
              ] }),
              /* @__PURE__ */ t(q, { tone: O(e.status), children: e.status.replace(/_/g, " ") })
            ] }, e.id)),
            a.confirmations.map((e) => /* @__PURE__ */ r("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2 cm:rounded-md cm:border cm:border-dashed cm:p-3", children: [
              /* @__PURE__ */ r("span", { children: [
                "Confirmation from ",
                e.sender_name,
                e.sender_bank ? ` (${e.sender_bank})` : "",
                " · ",
                e.amount,
                e.proof_url && /* @__PURE__ */ r(C, { children: [
                  " · ",
                  /* @__PURE__ */ t("a", { href: e.proof_url, target: "_blank", rel: "noreferrer", className: "cm:underline", children: "proof" })
                ] })
              ] }),
              /* @__PURE__ */ r("span", { className: "cm:flex cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ t(q, { tone: e.status === "approved" ? "ok" : e.status === "rejected" ? "error" : "warning", children: e.status }),
                e.can_review && /* @__PURE__ */ t(i, { size: "sm", asChild: !0, children: /* @__PURE__ */ t(j, { href: d("commerce/confirmations"), children: "Review" }) })
              ] })
            ] }, e.id))
          ] })
        ] }),
        a.shipments.length > 0 && /* @__PURE__ */ r(h, { children: [
          /* @__PURE__ */ t(g, { children: /* @__PURE__ */ t(u, { children: "Shipments" }) }),
          /* @__PURE__ */ t(p, { className: "cm:grid cm:gap-2 cm:text-sm", children: a.shipments.map((e) => /* @__PURE__ */ r("div", { className: "cm:grid cm:gap-1 cm:rounded-md cm:border cm:p-3", children: [
            /* @__PURE__ */ r("div", { className: "cm:flex cm:items-center cm:justify-between", children: [
              /* @__PURE__ */ r("span", { className: "cm:font-medium", children: [
                e.courier,
                e.service ? ` ${e.service}` : "",
                e.tracking_number && /* @__PURE__ */ r(C, { children: [
                  " · ",
                  e.tracking_url ? /* @__PURE__ */ t("a", { href: e.tracking_url, target: "_blank", rel: "noreferrer", className: "cm:underline", children: e.tracking_number }) : e.tracking_number
                ] })
              ] }),
              /* @__PURE__ */ t(q, { tone: O(e.status), children: e.status.replace(/_/g, " ") })
            ] }),
            /* @__PURE__ */ r("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
              e.items.map((s) => `${s.quantity} × ${s.name}`).join(", "),
              " · shipped ",
              f(e.shipped_at),
              e.delivered_at ? ` · delivered ${f(e.delivered_at)}` : ""
            ] }),
            m.shipments && e.status !== "delivered" && /* @__PURE__ */ t("div", { children: /* @__PURE__ */ t(i, { size: "sm", variant: "outline", onClick: () => $.post(d(`${v}/shipments/${e.id}/delivered`), {}, { preserveScroll: !0 }), children: "Mark delivered" }) })
          ] }, e.id)) })
        ] }),
        a.downloads.length > 0 && /* @__PURE__ */ r(h, { children: [
          /* @__PURE__ */ t(g, { children: /* @__PURE__ */ t(u, { children: "Downloads" }) }),
          /* @__PURE__ */ t(p, { className: "cm:grid cm:gap-2 cm:text-sm", children: a.downloads.map((e) => /* @__PURE__ */ r("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2 cm:rounded-md cm:border cm:p-3", children: [
            /* @__PURE__ */ r("span", { children: [
              /* @__PURE__ */ t("span", { className: "cm:font-medium", children: e.name }),
              " · ",
              e.count,
              " downloaded",
              e.remaining !== null ? ` · ${e.remaining} left` : "",
              e.expires_at ? ` · until ${f(e.expires_at)}` : ""
            ] }),
            /* @__PURE__ */ r("span", { className: "cm:flex cm:items-center cm:gap-1", children: [
              /* @__PURE__ */ t(q, { tone: e.state === "active" ? "ok" : "warning", children: e.state.replace("_", " ") }),
              m.edit && ["resend", "extend", "reset", "revoke"].map((s) => /* @__PURE__ */ t(i, { size: "sm", variant: "ghost", onClick: () => $.post(d(`${v}/downloads/${e.id}`), { action: s }, { preserveScroll: !0 }), children: { resend: "Resend", extend: "+7 days", reset: "Reset count", revoke: "Revoke" }[s] }, s))
            ] })
          ] }, e.id)) })
        ] }),
        a.refunds.length > 0 && /* @__PURE__ */ r(h, { children: [
          /* @__PURE__ */ t(g, { children: /* @__PURE__ */ t(u, { children: "Refunds" }) }),
          /* @__PURE__ */ t(p, { className: "cm:grid cm:gap-1 cm:text-sm", children: a.refunds.map((e) => /* @__PURE__ */ r("p", { children: [
            e.amount,
            " · ",
            f(e.created_at),
            e.reason ? ` · ${e.reason}` : "",
            e.restock ? " · restocked" : ""
          ] }, e.id)) })
        ] }),
        F.map((e) => {
          const s = J[e.key];
          return s ? /* @__PURE__ */ r(h, { children: [
            /* @__PURE__ */ t(g, { children: /* @__PURE__ */ t(u, { children: e.label }) }),
            /* @__PURE__ */ t(p, { children: /* @__PURE__ */ t(s, { order: a, data: e.data }) })
          ] }, e.key) : null;
        }),
        /* @__PURE__ */ r(h, { children: [
          /* @__PURE__ */ t(g, { children: /* @__PURE__ */ t(u, { children: "Timeline" }) }),
          /* @__PURE__ */ r(p, { className: "cm:grid cm:gap-4", children: [
            m.edit && /* @__PURE__ */ r("form", { className: "cm:grid cm:gap-2", onSubmit: (e) => {
              e.preventDefault(), k.post(d(`${v}/notes`), { preserveScroll: !0, onSuccess: () => k.reset() });
            }, children: [
              /* @__PURE__ */ t(b, { htmlFor: "o-note", className: "cm:sr-only", children: "Note" }),
              /* @__PURE__ */ t(N, { id: "o-note", placeholder: "Add a note…", value: k.data.message, onChange: (e) => k.setData("message", e.target.value) }),
              /* @__PURE__ */ r("div", { className: "cm:flex cm:items-center cm:justify-between cm:gap-2", children: [
                /* @__PURE__ */ r("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
                  /* @__PURE__ */ t(c, { checked: k.data.customer, onCheckedChange: (e) => k.setData("customer", e === !0) }),
                  " Send to the customer"
                ] }),
                /* @__PURE__ */ t(i, { size: "sm", type: "submit", disabled: k.processing || k.data.message.trim() === "", children: "Add note" })
              ] })
            ] }),
            /* @__PURE__ */ t("ol", { className: "cm:grid cm:gap-3 cm:text-sm", children: a.timeline.map((e) => /* @__PURE__ */ r("li", { className: "cm:grid cm:gap-0.5 cm:border-l-2 cm:pl-3", style: { borderColor: e.visibility === "customer" ? "var(--color-primary, currentColor)" : void 0 }, children: [
              /* @__PURE__ */ t("span", { className: "cm:whitespace-pre-line", children: e.message }),
              /* @__PURE__ */ r("span", { className: "cm:text-xs cm:text-muted-foreground", children: [
                f(e.created_at),
                " · ",
                e.actor ?? e.source,
                e.visibility === "customer" ? " · to the customer" : ""
              ] })
            ] }, e.id)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ r("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ r(h, { children: [
          /* @__PURE__ */ t(g, { children: /* @__PURE__ */ t(u, { children: "Customer" }) }),
          /* @__PURE__ */ r(p, { className: "cm:grid cm:gap-1 cm:text-sm", children: [
            /* @__PURE__ */ t("p", { className: "cm:font-medium", children: a.customer.href ? /* @__PURE__ */ t(j, { href: d(a.customer.href), className: "cm:hover:underline", children: a.customer.name ?? a.customer.email }) : a.customer.name ?? a.customer.email }),
            a.customer.email && /* @__PURE__ */ t("a", { href: `mailto:${a.customer.email}`, className: "cm:text-muted-foreground cm:hover:underline", children: a.customer.email }),
            a.customer.phone && /* @__PURE__ */ t("a", { href: `https://wa.me/${a.customer.phone.replace(/\D/g, "")}`, target: "_blank", rel: "noreferrer", className: "cm:text-muted-foreground cm:hover:underline", children: a.customer.phone }),
            a.customer.guest && /* @__PURE__ */ t("p", { className: "cm:text-xs cm:text-muted-foreground", children: "Guest checkout" })
          ] })
        ] }),
        /* @__PURE__ */ r(h, { children: [
          /* @__PURE__ */ r(g, { className: "cm:flex cm:flex-row cm:items-center cm:justify-between", children: [
            /* @__PURE__ */ t(u, { children: "Addresses" }),
            m.edit_addresses && /* @__PURE__ */ t(i, { size: "sm", variant: "ghost", asChild: !0, children: /* @__PURE__ */ t(j, { href: d(`${v}/addresses`), children: "Edit" }) })
          ] }),
          /* @__PURE__ */ r(p, { className: "cm:grid cm:gap-3 cm:text-sm", children: [
            a.pickup && /* @__PURE__ */ r("div", { children: [
              /* @__PURE__ */ t("p", { className: "cm:text-xs cm:font-medium cm:uppercase cm:text-muted-foreground", children: "Pickup" }),
              /* @__PURE__ */ r("p", { children: [
                a.pickup.name,
                /* @__PURE__ */ t("br", {}),
                a.pickup.address
              ] })
            ] }),
            a.shipping_address_text && /* @__PURE__ */ r("div", { children: [
              /* @__PURE__ */ t("p", { className: "cm:text-xs cm:font-medium cm:uppercase cm:text-muted-foreground", children: "Shipping" }),
              /* @__PURE__ */ t("p", { className: "cm:whitespace-pre-line", children: a.shipping_address_text })
            ] }),
            a.billing_address_text && a.billing_address_text !== a.shipping_address_text && /* @__PURE__ */ r("div", { children: [
              /* @__PURE__ */ t("p", { className: "cm:text-xs cm:font-medium cm:uppercase cm:text-muted-foreground", children: "Billing" }),
              /* @__PURE__ */ t("p", { className: "cm:whitespace-pre-line", children: a.billing_address_text })
            ] }),
            a.dropship && /* @__PURE__ */ r("div", { children: [
              /* @__PURE__ */ t("p", { className: "cm:text-xs cm:font-medium cm:uppercase cm:text-muted-foreground", children: "Dropshipper" }),
              /* @__PURE__ */ r("p", { children: [
                a.dropship.name,
                " · ",
                a.dropship.phone
              ] })
            ] }),
            !a.shipping_address_text && !a.billing_address_text && !a.pickup && /* @__PURE__ */ t("p", { className: "cm:text-muted-foreground", children: "No address." })
          ] })
        ] }),
        (a.customer_note || a.fields && Object.keys(a.fields).length > 0) && /* @__PURE__ */ r(h, { children: [
          /* @__PURE__ */ t(g, { children: /* @__PURE__ */ t(u, { children: "From the customer" }) }),
          /* @__PURE__ */ r(p, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            a.customer_note && /* @__PURE__ */ t("p", { className: "cm:whitespace-pre-line", children: a.customer_note }),
            a.fields && Object.entries(a.fields).map(([e, s]) => /* @__PURE__ */ r("p", { children: [
              /* @__PURE__ */ r("span", { className: "cm:text-muted-foreground", children: [
                e.replace(/_/g, " "),
                ":"
              ] }),
              " ",
              String(s ?? "")
            ] }, e))
          ] })
        ] }),
        /* @__PURE__ */ r(h, { children: [
          /* @__PURE__ */ t(g, { children: /* @__PURE__ */ t(u, { children: "Details" }) }),
          /* @__PURE__ */ r(p, { className: "cm:grid cm:gap-1 cm:text-sm", children: [
            a.payment_method_title && /* @__PURE__ */ r("p", { children: [
              "Payment: ",
              a.payment_method_title
            ] }),
            a.expires_at && a.payment_status === "unpaid" && /* @__PURE__ */ r("p", { children: [
              "Pay before ",
              f(a.expires_at)
            ] }),
            a.paid_at && /* @__PURE__ */ r("p", { children: [
              "Paid ",
              f(a.paid_at)
            ] }),
            a.completed_at && /* @__PURE__ */ r("p", { children: [
              "Completed ",
              f(a.completed_at)
            ] }),
            a.cancelled_at && /* @__PURE__ */ r("p", { children: [
              "Cancelled ",
              f(a.cancelled_at),
              a.cancel_reason ? ` — ${a.cancel_reason}` : ""
            ] }),
            a.quote_valid_until && /* @__PURE__ */ r("p", { children: [
              "Quote valid until ",
              f(a.quote_valid_until)
            ] }),
            a.documents.length > 0 && /* @__PURE__ */ t("div", { className: "cm:mt-2 cm:flex cm:flex-wrap cm:gap-2", children: a.documents.map((e) => /* @__PURE__ */ t(i, { size: "sm", variant: "outline", asChild: !0, children: /* @__PURE__ */ r("a", { href: e.url, target: "_blank", rel: "noreferrer", children: [
              e.label,
              e.number ? ` ${e.number}` : ""
            ] }) }, e.type)) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ t(l, { open: P !== null, onOpenChange: (e) => !e && M(null), children: /* @__PURE__ */ r(n, { children: [
      /* @__PURE__ */ r(D, { children: [
        /* @__PURE__ */ t(w, { children: P?.to === "cancelled" ? "Cancel this order?" : "Put this order on hold?" }),
        /* @__PURE__ */ t(B, { children: P?.to === "cancelled" ? "Stock, flash sale quantities and voucher uses are given back." : "It can go back to its status later." })
      ] }),
      /* @__PURE__ */ r("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ t(b, { htmlFor: "o-reason", children: "Reason (on the timeline)" }),
        /* @__PURE__ */ t(x, { id: "o-reason", value: L, onChange: (e) => Q(e.target.value) })
      ] }),
      /* @__PURE__ */ r(S, { children: [
        /* @__PURE__ */ t(i, { variant: "outline", onClick: () => M(null), children: "Back" }),
        /* @__PURE__ */ t(i, { onClick: () => P && G(P.to, L), children: "Confirm" })
      ] })
    ] }) }),
    /* @__PURE__ */ t(l, { open: U, onOpenChange: z, children: /* @__PURE__ */ r(n, { children: [
      /* @__PURE__ */ r(D, { children: [
        /* @__PURE__ */ t(w, { children: "Mark as paid" }),
        /* @__PURE__ */ r(B, { children: [
          "Record a payment you received outside the store (",
          a.totals.total,
          ")."
        ] })
      ] }),
      /* @__PURE__ */ r("form", { className: "cm:grid cm:gap-3", onSubmit: (e) => {
        e.preventDefault(), y.post(d(`${v}/mark-paid`), { preserveScroll: !0, onSuccess: () => z(!1) });
      }, children: [
        /* @__PURE__ */ r("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ t(b, { htmlFor: "p-ref", children: "Reference" }),
          /* @__PURE__ */ t(x, { id: "p-ref", value: y.data.reference, onChange: (e) => y.setData("reference", e.target.value) })
        ] }),
        /* @__PURE__ */ r("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ t(b, { htmlFor: "p-date", children: "Paid on" }),
          /* @__PURE__ */ t(x, { id: "p-date", type: "datetime-local", value: y.data.paid_at, onChange: (e) => y.setData("paid_at", e.target.value) })
        ] }),
        /* @__PURE__ */ r("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ t(b, { htmlFor: "p-acc", children: "Into account" }),
          /* @__PURE__ */ t(x, { id: "p-acc", value: y.data.account, onChange: (e) => y.setData("account", e.target.value) })
        ] }),
        /* @__PURE__ */ t(S, { children: /* @__PURE__ */ t(i, { type: "submit", disabled: y.processing, children: "Record payment" }) })
      ] })
    ] }) }),
    K && /* @__PURE__ */ t(re, { order: a, couriers: o.couriers, onClose: () => E(!1) }),
    Y && /* @__PURE__ */ t(ae, { order: a, onClose: () => H(!1) })
  ] });
}
function R({ label: o, value: a, muted: _, strong: m }) {
  return /* @__PURE__ */ r("div", { className: `cm:flex cm:justify-between cm:gap-4 ${_ ? "cm:text-muted-foreground" : ""} ${m ? "cm:text-base cm:font-semibold" : ""}`, children: [
    /* @__PURE__ */ t("dt", { children: o }),
    /* @__PURE__ */ t("dd", { children: a })
  ] });
}
export {
  ce as default
};
