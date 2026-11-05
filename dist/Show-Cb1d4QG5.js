import { i as O, c as t, d as A, j as a, b as m, M as W, u as X, a as Z, R as P, e as ee, P as te, S, F as q } from "./main-p2UnqZyH.js";
function re({ order: o, couriers: r, onClose: b }) {
  const { Dialog: d, DialogContent: j, DialogFooter: h, DialogHeader: p, DialogTitle: g, Button: u, Input: i, Label: N } = A, _ = o.items.filter((n) => n.unfulfilled > 0), c = O.useForm({
    courier: r[0]?.key ?? "",
    courier_name: "",
    service: "",
    tracking_number: "",
    items: _.map((n) => ({ order_item_id: n.id, quantity: n.unfulfilled }))
  }), x = c.errors;
  return /* @__PURE__ */ t(d, { open: !0, onOpenChange: (n) => !n && b(), children: /* @__PURE__ */ a(j, { children: [
    /* @__PURE__ */ t(p, { children: /* @__PURE__ */ t(g, { children: "Add a shipment" }) }),
    /* @__PURE__ */ a("form", { className: "cm:grid cm:gap-3", onSubmit: (n) => {
      n.preventDefault(), c.post(m(`commerce/orders/${o.id}/shipments`), { preserveScroll: !0, onSuccess: b });
    }, children: [
      /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ t(N, { htmlFor: "s-courier", children: "Courier" }),
        /* @__PURE__ */ a("select", { id: "s-courier", className: "cm:h-9 cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm", value: c.data.courier, onChange: (n) => c.setData("courier", n.target.value), children: [
          r.map((n) => /* @__PURE__ */ t("option", { value: n.key, children: n.name }, n.key)),
          /* @__PURE__ */ t("option", { value: "", children: "Other…" })
        ] })
      ] }),
      c.data.courier === "" && /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ t(N, { htmlFor: "s-name", children: "Courier name" }),
        /* @__PURE__ */ t(i, { id: "s-name", value: c.data.courier_name, onChange: (n) => c.setData("courier_name", n.target.value) })
      ] }),
      /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ t(N, { htmlFor: "s-service", children: "Service" }),
        /* @__PURE__ */ t(i, { id: "s-service", placeholder: "REG, YES…", value: c.data.service, onChange: (n) => c.setData("service", n.target.value) })
      ] }),
      /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ t(N, { htmlFor: "s-tracking", children: "Tracking number" }),
        /* @__PURE__ */ t(i, { id: "s-tracking", value: c.data.tracking_number, onChange: (n) => c.setData("tracking_number", n.target.value) })
      ] }),
      /* @__PURE__ */ a("fieldset", { className: "cm:grid cm:gap-2", children: [
        /* @__PURE__ */ t("legend", { className: "cm:mb-1 cm:text-sm cm:font-medium", children: "In this parcel" }),
        _.map((n, C) => /* @__PURE__ */ a("label", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:text-sm", children: [
          /* @__PURE__ */ a("span", { children: [
            n.name,
            n.variant_title ? ` · ${n.variant_title}` : "",
            " ",
            /* @__PURE__ */ a("span", { className: "cm:text-muted-foreground", children: [
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
              value: c.data.items[C].quantity,
              onChange: (w) => c.setData("items", c.data.items.map((D, I) => I === C ? { ...D, quantity: Number(w.target.value) } : D))
            }
          )
        ] }, n.id)),
        x.items && /* @__PURE__ */ t("p", { className: "cm:text-sm cm:text-destructive", children: x.items })
      ] }),
      /* @__PURE__ */ a(h, { children: [
        /* @__PURE__ */ t(u, { type: "button", variant: "outline", onClick: b, children: "Cancel" }),
        /* @__PURE__ */ t(u, { type: "submit", disabled: c.processing, children: "Save shipment" })
      ] })
    ] })
  ] }) });
}
function ae({ order: o, onClose: r }) {
  const { Dialog: b, DialogContent: d, DialogFooter: j, DialogHeader: h, DialogTitle: p, DialogDescription: g, Button: u, Input: i, Label: N, Checkbox: _ } = A, c = O.useForm({
    amount: o.totals.refundable,
    reason: "",
    restock: !1,
    items: o.items.map((l) => ({ order_item_id: l.id, quantity: 0 }))
  }), x = c.errors;
  return /* @__PURE__ */ t(b, { open: !0, onOpenChange: (l) => !l && r(), children: /* @__PURE__ */ a(d, { children: [
    /* @__PURE__ */ a(h, { children: [
      /* @__PURE__ */ t(p, { children: "Refund" }),
      /* @__PURE__ */ t(g, { children: "Record money you returned to the customer." })
    ] }),
    /* @__PURE__ */ a("form", { className: "cm:grid cm:gap-3", onSubmit: (l) => {
      l.preventDefault(), c.post(m(`commerce/orders/${o.id}/refunds`), { preserveScroll: !0, onSuccess: r });
    }, children: [
      /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ t(N, { htmlFor: "r-amount", children: "Amount" }),
        /* @__PURE__ */ t(W, { id: "r-amount", value: c.data.amount, onChange: (l) => c.setData("amount", l) }),
        x.amount && /* @__PURE__ */ t("p", { className: "cm:text-sm cm:text-destructive", children: x.amount })
      ] }),
      /* @__PURE__ */ a("fieldset", { className: "cm:grid cm:gap-2", children: [
        /* @__PURE__ */ t("legend", { className: "cm:mb-1 cm:text-sm cm:font-medium", children: "Items returned (optional)" }),
        o.items.map((l, n) => /* @__PURE__ */ a("label", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:text-sm", children: [
          /* @__PURE__ */ a("span", { children: [
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
              onChange: (C) => c.setData("items", c.data.items.map((w, D) => D === n ? { ...w, quantity: Number(C.target.value) } : w))
            }
          )
        ] }, l.id))
      ] }),
      /* @__PURE__ */ a("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
        /* @__PURE__ */ t(_, { checked: c.data.restock, onCheckedChange: (l) => c.setData("restock", l === !0) }),
        " Put the returned items back in stock"
      ] }),
      /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ t(N, { htmlFor: "r-reason", children: "Reason" }),
        /* @__PURE__ */ t(i, { id: "r-reason", value: c.data.reason, onChange: (l) => c.setData("reason", l.target.value) })
      ] }),
      /* @__PURE__ */ a(j, { children: [
        /* @__PURE__ */ t(u, { type: "button", variant: "outline", onClick: r, children: "Cancel" }),
        /* @__PURE__ */ t(u, { type: "submit", disabled: c.processing, children: "Record refund" })
      ] })
    ] })
  ] }) });
}
const f = (o) => o ? new Date(o).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" }) : "—", T = (o) => ({
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
  const { order: r, transitions: b, can: d, panels: j } = o, { Card: h, CardContent: p, CardHeader: g, CardTitle: u, Button: i, Textarea: N, Label: _, Checkbox: c, Input: x, Dialog: l, DialogContent: n, DialogFooter: C, DialogHeader: w, DialogTitle: D, DialogDescription: I } = A, { Link: F, router: $ } = O;
  X(), Z([{ label: "Shop", href: m("commerce") }, { label: "Orders", href: m("commerce/orders") }, { label: r.number }]);
  const v = `commerce/orders/${r.id}`, [z, B] = P.useState(null), [L, Q] = P.useState(""), [U, M] = P.useState(!1), [K, E] = P.useState(!1), [Y, H] = P.useState(!1), k = O.useForm({ message: "", customer: !1 }), y = O.useForm({ reference: "", paid_at: "", account: "" }), J = ee.orderPanels(), G = (e, s) => $.post(m(`${v}/transition`), { to: e, reason: s ?? null }, { preserveScroll: !0, onFinish: () => B(null) });
  return /* @__PURE__ */ a("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ t(
      te,
      {
        title: `${r.type === "quote" ? "Quote" : "Order"} ${r.number}`,
        description: /* @__PURE__ */ a(q, { children: [
          "Placed ",
          f(r.placed_at),
          " · ",
          r.channel,
          r.trashed ? " · in the trash" : ""
        ] }),
        actions: /* @__PURE__ */ a("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
          /* @__PURE__ */ t(S, { tone: T(r.status), children: r.status_label }),
          r.type === "order" && /* @__PURE__ */ t(S, { tone: T(r.payment_status), children: r.payment_label }),
          r.type === "order" && r.fulfillment_status !== "not_required" && /* @__PURE__ */ t(S, { tone: T(r.fulfillment_status), children: r.fulfillment_label }),
          /* @__PURE__ */ t(i, { variant: "outline", size: "sm", asChild: !0, children: /* @__PURE__ */ t("a", { href: r.storefront_url, target: "_blank", rel: "noreferrer", children: "Customer view" }) })
        ] })
      }
    ),
    /* @__PURE__ */ a("div", { className: "cm:flex cm:flex-wrap cm:gap-2", children: [
      b.filter((e) => e.permission).map((e) => /* @__PURE__ */ t(
        i,
        {
          size: "sm",
          variant: e.to === "cancelled" ? "outline" : "default",
          disabled: !e.allowed,
          title: e.reason ?? void 0,
          onClick: () => e.to === "cancelled" || e.to === "on_hold" ? B(e) : G(e.to),
          children: e.to === "cancelled" ? "Cancel order" : `Mark ${e.label.toLowerCase()}`
        },
        e.to
      )),
      d.mark_paid && /* @__PURE__ */ t(i, { size: "sm", variant: "outline", onClick: () => M(!0), children: "Mark paid" }),
      d.shipments && r.items.some((e) => e.unfulfilled > 0) && /* @__PURE__ */ t(i, { size: "sm", variant: "outline", onClick: () => E(!0), children: "Add shipment" }),
      d.refund && /* @__PURE__ */ t(i, { size: "sm", variant: "outline", onClick: () => H(!0), children: "Refund" }),
      d.send_link && /* @__PURE__ */ t(i, { size: "sm", variant: "outline", onClick: () => $.post(m(`${v}/payment-link`), {}, { preserveScroll: !0 }), children: "Send payment link" }),
      d.edit_items && /* @__PURE__ */ t(i, { size: "sm", variant: "outline", asChild: !0, children: /* @__PURE__ */ t(F, { href: m(`${v}/edit`), children: "Edit items" }) }),
      d.respond_quote && /* @__PURE__ */ t(i, { size: "sm", asChild: !0, children: /* @__PURE__ */ t(F, { href: m(`${v}/quote`), children: r.status === "quoted" ? "Edit quote" : "Send a quote" }) }),
      d.delete && !r.trashed && /* @__PURE__ */ t(
        i,
        {
          size: "sm",
          variant: "ghost",
          className: "cm:ml-auto cm:text-destructive",
          onClick: () => window.confirm("Move this order to the trash?") && $.delete(m(v)),
          children: "Trash"
        }
      ),
      d.delete && r.trashed && /* @__PURE__ */ t(i, { size: "sm", variant: "outline", className: "cm:ml-auto", onClick: () => $.post(m(`${v}/restore`)), children: "Restore" }),
      d.force_delete && /* @__PURE__ */ t(
        i,
        {
          size: "sm",
          variant: "ghost",
          className: "cm:text-destructive",
          onClick: () => window.confirm("Delete this order for good? This can't be undone.") && $.delete(m(`${v}/force`)),
          children: "Delete for good"
        }
      )
    ] }),
    /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[2fr_1fr]", children: [
      /* @__PURE__ */ a("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ a(h, { children: [
          /* @__PURE__ */ t(g, { children: /* @__PURE__ */ t(u, { children: "Items" }) }),
          /* @__PURE__ */ a(p, { className: "cm:grid cm:gap-4", children: [
            /* @__PURE__ */ t("ul", { className: "cm:divide-y cm:divide-border", children: r.items.map((e) => /* @__PURE__ */ a("li", { className: "cm:grid cm:gap-1 cm:py-3 cm:first:pt-0 cm:sm:grid-cols-[1fr_auto] cm:sm:gap-4", children: [
              /* @__PURE__ */ a("div", { className: "cm:min-w-0", children: [
                /* @__PURE__ */ a("p", { className: "cm:font-medium", children: [
                  e.product_href ? /* @__PURE__ */ t(F, { href: m(e.product_href), className: "cm:hover:underline", children: e.name }) : e.name,
                  e.variant_title && /* @__PURE__ */ a("span", { className: "cm:text-muted-foreground", children: [
                    " · ",
                    e.variant_title
                  ] })
                ] }),
                /* @__PURE__ */ a("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  e.sku && /* @__PURE__ */ a(q, { children: [
                    "SKU ",
                    e.sku,
                    " · "
                  ] }),
                  e.price_source.label,
                  e.requires_shipping && r.fulfillment_status !== "not_required" && /* @__PURE__ */ a(q, { children: [
                    " · shipped ",
                    e.fulfilled_quantity,
                    "/",
                    e.quantity
                  ] }),
                  e.refunded_quantity > 0 && /* @__PURE__ */ a(q, { children: [
                    " · refunded ",
                    e.refunded_quantity
                  ] })
                ] }),
                e.components.length > 0 && /* @__PURE__ */ t("ul", { className: "cm:mt-1 cm:text-xs cm:text-muted-foreground", children: e.components.map((s, V) => /* @__PURE__ */ a("li", { children: [
                  s.quantity,
                  " × ",
                  s.name
                ] }, V)) })
              ] }),
              /* @__PURE__ */ a("div", { className: "cm:text-sm cm:sm:text-right", children: [
                /* @__PURE__ */ a("p", { children: [
                  e.quantity,
                  " × ",
                  e.regular_unit_price && /* @__PURE__ */ t("del", { className: "cm:text-muted-foreground", children: e.regular_unit_price }),
                  " ",
                  e.unit_price_formatted
                ] }),
                e.discount && /* @__PURE__ */ a("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  "−",
                  e.discount
                ] }),
                /* @__PURE__ */ t("p", { className: "cm:font-medium", children: e.total })
              ] })
            ] }, e.id)) }),
            /* @__PURE__ */ a("dl", { className: "cm:grid cm:gap-1 cm:border-t cm:pt-3 cm:text-sm", children: [
              /* @__PURE__ */ t(R, { label: "Subtotal", value: r.totals.subtotal }),
              r.adjustments.filter((e) => e.kind !== "tax").map((e, s) => /* @__PURE__ */ t(R, { label: `${e.label}${e.code ? ` (${e.code})` : ""}`, value: e.amount, muted: !0 }, s)),
              r.totals.shipping !== null && /* @__PURE__ */ t(R, { label: `Shipping${r.shipping_method?.label ? ` · ${r.shipping_method.label}` : ""}`, value: r.totals.shipping }),
              r.adjustments.filter((e) => e.kind === "tax").map((e, s) => /* @__PURE__ */ t(R, { label: `${e.label}${e.included ? " (included)" : ""}`, value: e.amount, muted: !0 }, `t${s}`)),
              /* @__PURE__ */ t(R, { label: "Total", value: r.totals.total, strong: !0 }),
              r.type === "order" && /* @__PURE__ */ t(R, { label: "Paid", value: r.totals.paid, muted: !0 }),
              r.totals.refunded && /* @__PURE__ */ t(R, { label: "Refunded", value: `−${r.totals.refunded}`, muted: !0 })
            ] })
          ] })
        ] }),
        (r.payments.length > 0 || r.confirmations.length > 0) && /* @__PURE__ */ a(h, { children: [
          /* @__PURE__ */ t(g, { children: /* @__PURE__ */ t(u, { children: "Payments" }) }),
          /* @__PURE__ */ a(p, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            r.payments.map((e) => /* @__PURE__ */ a("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2 cm:rounded-md cm:border cm:p-3", children: [
              /* @__PURE__ */ a("div", { children: [
                /* @__PURE__ */ a("p", { className: "cm:font-medium", children: [
                  e.method,
                  " · ",
                  e.amount
                ] }),
                /* @__PURE__ */ a("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  e.reference && /* @__PURE__ */ a(q, { children: [
                    "Ref ",
                    e.reference,
                    " · "
                  ] }),
                  e.paid_at ? `Paid ${f(e.paid_at)}` : e.expires_at ? `Due ${f(e.expires_at)}` : "",
                  e.refunded && ` · refunded ${e.refunded}`
                ] })
              ] }),
              /* @__PURE__ */ t(S, { tone: T(e.status), children: e.status.replace(/_/g, " ") })
            ] }, e.id)),
            r.confirmations.map((e) => /* @__PURE__ */ a("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2 cm:rounded-md cm:border cm:border-dashed cm:p-3", children: [
              /* @__PURE__ */ a("span", { children: [
                "Confirmation from ",
                e.sender_name,
                e.sender_bank ? ` (${e.sender_bank})` : "",
                " · ",
                e.amount,
                e.proof_url && /* @__PURE__ */ a(q, { children: [
                  " · ",
                  /* @__PURE__ */ t("a", { href: e.proof_url, target: "_blank", rel: "noreferrer", className: "cm:underline", children: "proof" })
                ] })
              ] }),
              /* @__PURE__ */ a("span", { className: "cm:flex cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ t(S, { tone: e.status === "approved" ? "ok" : e.status === "rejected" ? "error" : "warning", children: e.status }),
                e.can_review && /* @__PURE__ */ t(i, { size: "sm", asChild: !0, children: /* @__PURE__ */ t(F, { href: m("commerce/confirmations"), children: "Review" }) })
              ] })
            ] }, e.id))
          ] })
        ] }),
        r.shipments.length > 0 && /* @__PURE__ */ a(h, { children: [
          /* @__PURE__ */ t(g, { children: /* @__PURE__ */ t(u, { children: "Shipments" }) }),
          /* @__PURE__ */ t(p, { className: "cm:grid cm:gap-2 cm:text-sm", children: r.shipments.map((e) => /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1 cm:rounded-md cm:border cm:p-3", children: [
            /* @__PURE__ */ a("div", { className: "cm:flex cm:items-center cm:justify-between", children: [
              /* @__PURE__ */ a("span", { className: "cm:font-medium", children: [
                e.courier,
                e.service ? ` ${e.service}` : "",
                e.tracking_number && /* @__PURE__ */ a(q, { children: [
                  " · ",
                  e.tracking_url ? /* @__PURE__ */ t("a", { href: e.tracking_url, target: "_blank", rel: "noreferrer", className: "cm:underline", children: e.tracking_number }) : e.tracking_number
                ] })
              ] }),
              /* @__PURE__ */ t(S, { tone: T(e.status), children: e.status.replace(/_/g, " ") })
            ] }),
            /* @__PURE__ */ a("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
              e.items.map((s) => `${s.quantity} × ${s.name}`).join(", "),
              " · shipped ",
              f(e.shipped_at),
              e.delivered_at ? ` · delivered ${f(e.delivered_at)}` : ""
            ] }),
            d.shipments && e.status !== "delivered" && /* @__PURE__ */ t("div", { children: /* @__PURE__ */ t(i, { size: "sm", variant: "outline", onClick: () => $.post(m(`${v}/shipments/${e.id}/delivered`), {}, { preserveScroll: !0 }), children: "Mark delivered" }) })
          ] }, e.id)) })
        ] }),
        r.downloads.length > 0 && /* @__PURE__ */ a(h, { children: [
          /* @__PURE__ */ t(g, { children: /* @__PURE__ */ t(u, { children: "Downloads" }) }),
          /* @__PURE__ */ t(p, { className: "cm:grid cm:gap-2 cm:text-sm", children: r.downloads.map((e) => /* @__PURE__ */ a("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2 cm:rounded-md cm:border cm:p-3", children: [
            /* @__PURE__ */ a("span", { children: [
              /* @__PURE__ */ t("span", { className: "cm:font-medium", children: e.name }),
              " · ",
              e.count,
              " downloaded",
              e.remaining !== null ? ` · ${e.remaining} left` : "",
              e.expires_at ? ` · until ${f(e.expires_at)}` : ""
            ] }),
            /* @__PURE__ */ a("span", { className: "cm:flex cm:items-center cm:gap-1", children: [
              /* @__PURE__ */ t(S, { tone: e.state === "active" ? "ok" : "warning", children: e.state.replace("_", " ") }),
              d.edit && ["resend", "extend", "reset", "revoke"].map((s) => /* @__PURE__ */ t(i, { size: "sm", variant: "ghost", onClick: () => $.post(m(`${v}/downloads/${e.id}`), { action: s }, { preserveScroll: !0 }), children: { resend: "Resend", extend: "+7 days", reset: "Reset count", revoke: "Revoke" }[s] }, s))
            ] })
          ] }, e.id)) })
        ] }),
        r.refunds.length > 0 && /* @__PURE__ */ a(h, { children: [
          /* @__PURE__ */ t(g, { children: /* @__PURE__ */ t(u, { children: "Refunds" }) }),
          /* @__PURE__ */ t(p, { className: "cm:grid cm:gap-1 cm:text-sm", children: r.refunds.map((e) => /* @__PURE__ */ a("p", { children: [
            e.amount,
            " · ",
            f(e.created_at),
            e.reason ? ` · ${e.reason}` : "",
            e.restock ? " · restocked" : ""
          ] }, e.id)) })
        ] }),
        j.map((e) => {
          const s = J[e.key];
          return s ? /* @__PURE__ */ a(h, { children: [
            /* @__PURE__ */ t(g, { children: /* @__PURE__ */ t(u, { children: e.label }) }),
            /* @__PURE__ */ t(p, { children: /* @__PURE__ */ t(s, { order: r, data: e.data }) })
          ] }, e.key) : null;
        }),
        /* @__PURE__ */ a(h, { children: [
          /* @__PURE__ */ t(g, { children: /* @__PURE__ */ t(u, { children: "Timeline" }) }),
          /* @__PURE__ */ a(p, { className: "cm:grid cm:gap-4", children: [
            d.edit && /* @__PURE__ */ a("form", { className: "cm:grid cm:gap-2", onSubmit: (e) => {
              e.preventDefault(), k.post(m(`${v}/notes`), { preserveScroll: !0, onSuccess: () => k.reset() });
            }, children: [
              /* @__PURE__ */ t(_, { htmlFor: "o-note", className: "cm:sr-only", children: "Note" }),
              /* @__PURE__ */ t(N, { id: "o-note", placeholder: "Add a note…", value: k.data.message, onChange: (e) => k.setData("message", e.target.value) }),
              /* @__PURE__ */ a("div", { className: "cm:flex cm:items-center cm:justify-between cm:gap-2", children: [
                /* @__PURE__ */ a("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
                  /* @__PURE__ */ t(c, { checked: k.data.customer, onCheckedChange: (e) => k.setData("customer", e === !0) }),
                  " Send to the customer"
                ] }),
                /* @__PURE__ */ t(i, { size: "sm", type: "submit", disabled: k.processing || k.data.message.trim() === "", children: "Add note" })
              ] })
            ] }),
            /* @__PURE__ */ t("ol", { className: "cm:grid cm:gap-3 cm:text-sm", children: r.timeline.map((e) => /* @__PURE__ */ a("li", { className: "cm:grid cm:gap-0.5 cm:border-l-2 cm:pl-3", style: { borderColor: e.visibility === "customer" ? "var(--color-primary, currentColor)" : void 0 }, children: [
              /* @__PURE__ */ t("span", { className: "cm:whitespace-pre-line", children: e.message }),
              /* @__PURE__ */ a("span", { className: "cm:text-xs cm:text-muted-foreground", children: [
                f(e.created_at),
                " · ",
                e.actor ?? e.source,
                e.visibility === "customer" ? " · to the customer" : ""
              ] })
            ] }, e.id)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ a("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ a(h, { children: [
          /* @__PURE__ */ t(g, { children: /* @__PURE__ */ t(u, { children: "Customer" }) }),
          /* @__PURE__ */ a(p, { className: "cm:grid cm:gap-1 cm:text-sm", children: [
            /* @__PURE__ */ t("p", { className: "cm:font-medium", children: r.customer.href ? /* @__PURE__ */ t(F, { href: m(r.customer.href), className: "cm:hover:underline", children: r.customer.name ?? r.customer.email }) : r.customer.name ?? r.customer.email }),
            r.customer.email && /* @__PURE__ */ t("a", { href: `mailto:${r.customer.email}`, className: "cm:text-muted-foreground cm:hover:underline", children: r.customer.email }),
            r.customer.phone && /* @__PURE__ */ t("a", { href: `https://wa.me/${r.customer.phone.replace(/\D/g, "")}`, target: "_blank", rel: "noreferrer", className: "cm:text-muted-foreground cm:hover:underline", children: r.customer.phone }),
            r.customer.guest && /* @__PURE__ */ t("p", { className: "cm:text-xs cm:text-muted-foreground", children: "Guest checkout" })
          ] })
        ] }),
        /* @__PURE__ */ a(h, { children: [
          /* @__PURE__ */ a(g, { className: "cm:flex cm:flex-row cm:items-center cm:justify-between", children: [
            /* @__PURE__ */ t(u, { children: "Addresses" }),
            d.edit_addresses && /* @__PURE__ */ t(i, { size: "sm", variant: "ghost", asChild: !0, children: /* @__PURE__ */ t(F, { href: m(`${v}/addresses`), children: "Edit" }) })
          ] }),
          /* @__PURE__ */ a(p, { className: "cm:grid cm:gap-3 cm:text-sm", children: [
            r.pickup && /* @__PURE__ */ a("div", { children: [
              /* @__PURE__ */ t("p", { className: "cm:text-xs cm:font-medium cm:uppercase cm:text-muted-foreground", children: "Pickup" }),
              /* @__PURE__ */ a("p", { children: [
                r.pickup.name,
                /* @__PURE__ */ t("br", {}),
                r.pickup.address
              ] })
            ] }),
            r.shipping_address_text && /* @__PURE__ */ a("div", { children: [
              /* @__PURE__ */ t("p", { className: "cm:text-xs cm:font-medium cm:uppercase cm:text-muted-foreground", children: "Shipping" }),
              /* @__PURE__ */ t("p", { className: "cm:whitespace-pre-line", children: r.shipping_address_text })
            ] }),
            r.billing_address_text && r.billing_address_text !== r.shipping_address_text && /* @__PURE__ */ a("div", { children: [
              /* @__PURE__ */ t("p", { className: "cm:text-xs cm:font-medium cm:uppercase cm:text-muted-foreground", children: "Billing" }),
              /* @__PURE__ */ t("p", { className: "cm:whitespace-pre-line", children: r.billing_address_text })
            ] }),
            r.dropship && /* @__PURE__ */ a("div", { children: [
              /* @__PURE__ */ t("p", { className: "cm:text-xs cm:font-medium cm:uppercase cm:text-muted-foreground", children: "Dropshipper" }),
              /* @__PURE__ */ a("p", { children: [
                r.dropship.name,
                " · ",
                r.dropship.phone
              ] })
            ] }),
            !r.shipping_address_text && !r.billing_address_text && !r.pickup && /* @__PURE__ */ t("p", { className: "cm:text-muted-foreground", children: "No address." })
          ] })
        ] }),
        (r.customer_note || r.fields && Object.keys(r.fields).length > 0) && /* @__PURE__ */ a(h, { children: [
          /* @__PURE__ */ t(g, { children: /* @__PURE__ */ t(u, { children: "From the customer" }) }),
          /* @__PURE__ */ a(p, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            r.customer_note && /* @__PURE__ */ t("p", { className: "cm:whitespace-pre-line", children: r.customer_note }),
            r.fields && Object.entries(r.fields).map(([e, s]) => /* @__PURE__ */ a("p", { children: [
              /* @__PURE__ */ a("span", { className: "cm:text-muted-foreground", children: [
                e.replace(/_/g, " "),
                ":"
              ] }),
              " ",
              String(s ?? "")
            ] }, e))
          ] })
        ] }),
        /* @__PURE__ */ a(h, { children: [
          /* @__PURE__ */ t(g, { children: /* @__PURE__ */ t(u, { children: "Details" }) }),
          /* @__PURE__ */ a(p, { className: "cm:grid cm:gap-1 cm:text-sm", children: [
            r.payment_method_title && /* @__PURE__ */ a("p", { children: [
              "Payment: ",
              r.payment_method_title
            ] }),
            r.expires_at && r.payment_status === "unpaid" && /* @__PURE__ */ a("p", { children: [
              "Pay before ",
              f(r.expires_at)
            ] }),
            r.paid_at && /* @__PURE__ */ a("p", { children: [
              "Paid ",
              f(r.paid_at)
            ] }),
            r.completed_at && /* @__PURE__ */ a("p", { children: [
              "Completed ",
              f(r.completed_at)
            ] }),
            r.cancelled_at && /* @__PURE__ */ a("p", { children: [
              "Cancelled ",
              f(r.cancelled_at),
              r.cancel_reason ? ` — ${r.cancel_reason}` : ""
            ] }),
            r.quote_valid_until && /* @__PURE__ */ a("p", { children: [
              "Quote valid until ",
              f(r.quote_valid_until)
            ] }),
            r.documents.length > 0 && /* @__PURE__ */ t("div", { className: "cm:mt-2 cm:flex cm:flex-wrap cm:gap-2", children: r.documents.map((e) => /* @__PURE__ */ t(i, { size: "sm", variant: "outline", asChild: !0, children: /* @__PURE__ */ a("a", { href: e.url, target: "_blank", rel: "noreferrer", children: [
              e.label,
              e.number ? ` ${e.number}` : ""
            ] }) }, e.type)) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ t(l, { open: z !== null, onOpenChange: (e) => !e && B(null), children: /* @__PURE__ */ a(n, { children: [
      /* @__PURE__ */ a(w, { children: [
        /* @__PURE__ */ t(D, { children: z?.to === "cancelled" ? "Cancel this order?" : "Put this order on hold?" }),
        /* @__PURE__ */ t(I, { children: z?.to === "cancelled" ? "Stock, flash sale quantities and voucher uses are given back." : "It can go back to its status later." })
      ] }),
      /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ t(_, { htmlFor: "o-reason", children: "Reason (on the timeline)" }),
        /* @__PURE__ */ t(x, { id: "o-reason", value: L, onChange: (e) => Q(e.target.value) })
      ] }),
      /* @__PURE__ */ a(C, { children: [
        /* @__PURE__ */ t(i, { variant: "outline", onClick: () => B(null), children: "Back" }),
        /* @__PURE__ */ t(i, { onClick: () => z && G(z.to, L), children: "Confirm" })
      ] })
    ] }) }),
    /* @__PURE__ */ t(l, { open: U, onOpenChange: M, children: /* @__PURE__ */ a(n, { children: [
      /* @__PURE__ */ a(w, { children: [
        /* @__PURE__ */ t(D, { children: "Mark as paid" }),
        /* @__PURE__ */ a(I, { children: [
          "Record a payment you received outside the store (",
          r.totals.total,
          ")."
        ] })
      ] }),
      /* @__PURE__ */ a("form", { className: "cm:grid cm:gap-3", onSubmit: (e) => {
        e.preventDefault(), y.post(m(`${v}/mark-paid`), { preserveScroll: !0, onSuccess: () => M(!1) });
      }, children: [
        /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ t(_, { htmlFor: "p-ref", children: "Reference" }),
          /* @__PURE__ */ t(x, { id: "p-ref", value: y.data.reference, onChange: (e) => y.setData("reference", e.target.value) })
        ] }),
        /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ t(_, { htmlFor: "p-date", children: "Paid on" }),
          /* @__PURE__ */ t(x, { id: "p-date", type: "datetime-local", value: y.data.paid_at, onChange: (e) => y.setData("paid_at", e.target.value) })
        ] }),
        /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ t(_, { htmlFor: "p-acc", children: "Into account" }),
          /* @__PURE__ */ t(x, { id: "p-acc", value: y.data.account, onChange: (e) => y.setData("account", e.target.value) })
        ] }),
        /* @__PURE__ */ t(C, { children: /* @__PURE__ */ t(i, { type: "submit", disabled: y.processing, children: "Record payment" }) })
      ] })
    ] }) }),
    K && /* @__PURE__ */ t(re, { order: r, couriers: o.couriers, onClose: () => E(!1) }),
    Y && /* @__PURE__ */ t(ae, { order: r, onClose: () => H(!1) })
  ] });
}
function R({ label: o, value: r, muted: b, strong: d }) {
  return /* @__PURE__ */ a("div", { className: `cm:flex cm:justify-between cm:gap-4 ${b ? "cm:text-muted-foreground" : ""} ${d ? "cm:text-base cm:font-semibold" : ""}`, children: [
    /* @__PURE__ */ t("dt", { children: o }),
    /* @__PURE__ */ t("dd", { children: r })
  ] });
}
export {
  ce as default
};
