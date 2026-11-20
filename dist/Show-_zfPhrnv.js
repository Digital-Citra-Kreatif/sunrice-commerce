import { i as M, b as t, c as L, j as a, a as m, M as re, d as ae, u as ne, R as j, e as ce, P as le, S as R, F as D } from "./main-Bl32mM8r.js";
import { P as ie } from "./PaymentConfirmationDialog-CjQrip3v.js";
function se({ order: o, couriers: r, onClose: x }) {
  const { Dialog: d, DialogContent: F, DialogFooter: h, DialogHeader: p, DialogTitle: g, Button: u, Input: s, Label: N } = L, _ = o.items.filter((n) => n.unfulfilled > 0), c = M.useForm({
    courier: r[0]?.key ?? "",
    courier_name: "",
    service: "",
    tracking_number: "",
    items: _.map((n) => ({ order_item_id: n.id, quantity: n.unfulfilled }))
  }), b = c.errors;
  return /* @__PURE__ */ t(d, { open: !0, onOpenChange: (n) => !n && x(), children: /* @__PURE__ */ a(F, { children: [
    /* @__PURE__ */ t(p, { children: /* @__PURE__ */ t(g, { children: "Add a shipment" }) }),
    /* @__PURE__ */ a("form", { className: "cm:grid cm:gap-3", onSubmit: (n) => {
      n.preventDefault(), c.post(m(`commerce/orders/${o.id}/shipments`), { preserveScroll: !0, onSuccess: x });
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
        /* @__PURE__ */ t(s, { id: "s-name", value: c.data.courier_name, onChange: (n) => c.setData("courier_name", n.target.value) })
      ] }),
      /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ t(N, { htmlFor: "s-service", children: "Service" }),
        /* @__PURE__ */ t(s, { id: "s-service", placeholder: "REG, YES…", value: c.data.service, onChange: (n) => c.setData("service", n.target.value) })
      ] }),
      /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ t(N, { htmlFor: "s-tracking", children: "Tracking number" }),
        /* @__PURE__ */ t(s, { id: "s-tracking", value: c.data.tracking_number, onChange: (n) => c.setData("tracking_number", n.target.value) })
      ] }),
      /* @__PURE__ */ a("fieldset", { className: "cm:grid cm:gap-2", children: [
        /* @__PURE__ */ t("legend", { className: "cm:mb-1 cm:text-sm cm:font-medium", children: "In this parcel" }),
        _.map((n, w) => /* @__PURE__ */ a("label", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:text-sm", children: [
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
            s,
            {
              type: "number",
              min: 0,
              max: n.unfulfilled,
              className: "cm:w-20",
              value: c.data.items[w].quantity,
              onChange: (S) => c.setData("items", c.data.items.map(($, B) => B === w ? { ...$, quantity: Number(S.target.value) } : $))
            }
          )
        ] }, n.id)),
        b.items && /* @__PURE__ */ t("p", { className: "cm:text-sm cm:text-destructive", children: b.items })
      ] }),
      /* @__PURE__ */ a(h, { children: [
        /* @__PURE__ */ t(u, { type: "button", variant: "outline", onClick: x, children: "Cancel" }),
        /* @__PURE__ */ t(u, { type: "submit", disabled: c.processing, children: "Save shipment" })
      ] })
    ] })
  ] }) });
}
function de({ order: o, onClose: r }) {
  const { Dialog: x, DialogContent: d, DialogFooter: F, DialogHeader: h, DialogTitle: p, DialogDescription: g, Button: u, Input: s, Label: N, Checkbox: _ } = L, c = M.useForm({
    amount: o.totals.refundable,
    reason: "",
    restock: !1,
    items: o.items.map((i) => ({ order_item_id: i.id, quantity: 0 }))
  }), b = c.errors;
  return /* @__PURE__ */ t(x, { open: !0, onOpenChange: (i) => !i && r(), children: /* @__PURE__ */ a(d, { children: [
    /* @__PURE__ */ a(h, { children: [
      /* @__PURE__ */ t(p, { children: "Refund" }),
      /* @__PURE__ */ t(g, { children: "Record money you returned to the customer." })
    ] }),
    /* @__PURE__ */ a("form", { className: "cm:grid cm:gap-3", onSubmit: (i) => {
      i.preventDefault(), c.post(m(`commerce/orders/${o.id}/refunds`), { preserveScroll: !0, onSuccess: r });
    }, children: [
      /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ t(N, { htmlFor: "r-amount", children: "Amount" }),
        /* @__PURE__ */ t(re, { id: "r-amount", value: c.data.amount, onChange: (i) => c.setData("amount", i) }),
        b.amount && /* @__PURE__ */ t("p", { className: "cm:text-sm cm:text-destructive", children: b.amount })
      ] }),
      /* @__PURE__ */ a("fieldset", { className: "cm:grid cm:gap-2", children: [
        /* @__PURE__ */ t("legend", { className: "cm:mb-1 cm:text-sm cm:font-medium", children: "Items returned (optional)" }),
        o.items.map((i, n) => /* @__PURE__ */ a("label", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:text-sm", children: [
          /* @__PURE__ */ a("span", { children: [
            i.name,
            i.variant_title ? ` · ${i.variant_title}` : ""
          ] }),
          /* @__PURE__ */ t(
            s,
            {
              type: "number",
              min: 0,
              max: i.quantity - i.refunded_quantity,
              className: "cm:w-20",
              value: c.data.items[n].quantity,
              onChange: (w) => c.setData("items", c.data.items.map((S, $) => $ === n ? { ...S, quantity: Number(w.target.value) } : S))
            }
          )
        ] }, i.id))
      ] }),
      /* @__PURE__ */ a("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
        /* @__PURE__ */ t(_, { checked: c.data.restock, onCheckedChange: (i) => c.setData("restock", i === !0) }),
        " Put the returned items back in stock"
      ] }),
      /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ t(N, { htmlFor: "r-reason", children: "Reason" }),
        /* @__PURE__ */ t(s, { id: "r-reason", value: c.data.reason, onChange: (i) => c.setData("reason", i.target.value) })
      ] }),
      /* @__PURE__ */ a(F, { children: [
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
function ue(o) {
  const { order: r, transitions: x, can: d, panels: F } = o, {
    Card: h,
    CardContent: p,
    CardHeader: g,
    CardTitle: u,
    Button: s,
    Textarea: N,
    Label: _,
    Checkbox: c,
    Input: b,
    Dialog: i,
    DialogContent: n,
    DialogFooter: w,
    DialogHeader: S,
    DialogTitle: $,
    DialogDescription: B,
    DropdownMenu: K,
    DropdownMenuTrigger: Y,
    DropdownMenuContent: J,
    DropdownMenuItem: V
  } = L, { Link: I, router: q } = M;
  ae(), ne([{ label: "Shop", href: m("commerce") }, { label: "Orders", href: m("commerce/orders") }, { label: r.number }]);
  const v = `commerce/orders/${r.id}`, [P, O] = j.useState(null), [z, E] = j.useState(""), [W, A] = j.useState(!1), [X, H] = j.useState(!1), [Z, G] = j.useState(!1), y = M.useForm({ message: "", customer: !1 }), C = M.useForm({ reference: "", paid_at: "", account: "" }), ee = ce.orderPanels(), Q = x.filter((e) => e.permission && e.allowed), U = (e, l) => q.post(m(`${v}/transition`), { to: e, reason: l ?? null }, { preserveScroll: !0, onFinish: () => O(null) });
  return /* @__PURE__ */ a("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-6", children: [
    /* @__PURE__ */ t(
      le,
      {
        title: `${r.type === "quote" ? "Quote" : "Order"} ${r.number}`,
        description: /* @__PURE__ */ a(D, { children: [
          "Placed ",
          f(r.placed_at),
          " · ",
          r.channel,
          r.trashed ? " · in the trash" : ""
        ] }),
        back: { href: m("commerce/orders"), label: "Back to orders" },
        actions: /* @__PURE__ */ a(D, { children: [
          Q.length > 0 && /* @__PURE__ */ a(K, { children: [
            /* @__PURE__ */ t(Y, { asChild: !0, children: /* @__PURE__ */ t(s, { type: "button", variant: "outline", children: "Change status" }) }),
            /* @__PURE__ */ t(J, { align: "end", children: Q.map((e) => /* @__PURE__ */ t(V, { variant: e.to === "cancelled" ? "destructive" : "default", onSelect: () => {
              e.to === "cancelled" || e.to === "on_hold" ? (E(""), O(e)) : U(e.to);
            }, children: e.to === "cancelled" ? "Cancel order…" : e.to === "on_hold" ? "Put on hold…" : `Mark ${e.label.toLowerCase()}` }, e.to)) })
          ] }),
          d.mark_paid && /* @__PURE__ */ t(s, { variant: "outline", onClick: () => A(!0), children: "Mark paid" }),
          d.shipments && r.items.some((e) => e.unfulfilled > 0) && /* @__PURE__ */ t(s, { variant: "outline", onClick: () => H(!0), children: "Add shipment" })
        ] }),
        primary: d.respond_quote ? /* @__PURE__ */ t(s, { asChild: !0, children: /* @__PURE__ */ t(I, { href: m(`${v}/quote`), children: r.status === "quoted" ? "Edit quote" : "Send a quote" }) }) : void 0,
        menu: [
          { label: "Customer view", href: r.storefront_url, external: !0 },
          ...d.edit_items ? [{ label: "Edit items", href: m(`${v}/edit`) }] : [],
          ...d.refund ? [{ label: "Refund…", onSelect: () => G(!0) }] : [],
          ...d.send_link ? [{ label: "Send payment link", onSelect: () => q.post(m(`${v}/payment-link`), {}, { preserveScroll: !0 }) }] : [],
          ...d.delete && !r.trashed ? [{ label: "Move to trash", destructive: !0, group: "Delete", onSelect: () => {
            window.confirm("Move this order to the trash?") && q.delete(m(v));
          } }] : [],
          ...d.delete && r.trashed ? [{ label: "Restore", group: "Delete", onSelect: () => q.post(m(`${v}/restore`)) }] : [],
          ...d.force_delete ? [{ label: "Delete for good", destructive: !0, group: "Delete", onSelect: () => {
            window.confirm("Delete this order for good? This can't be undone.") && q.delete(m(`${v}/force`));
          } }] : []
        ],
        children: /* @__PURE__ */ a("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-1.5", children: [
          /* @__PURE__ */ t(R, { tone: T(r.status), children: r.status_label }),
          r.type === "order" && /* @__PURE__ */ t(R, { tone: T(r.payment_status), children: r.payment_label }),
          r.type === "order" && r.fulfillment_status !== "not_required" && /* @__PURE__ */ t(R, { tone: T(r.fulfillment_status), children: r.fulfillment_label })
        ] })
      }
    ),
    /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[2fr_1fr]", children: [
      /* @__PURE__ */ a("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ a(h, { children: [
          /* @__PURE__ */ t(g, { children: /* @__PURE__ */ t(u, { children: "Items" }) }),
          /* @__PURE__ */ a(p, { className: "cm:grid cm:gap-4", children: [
            /* @__PURE__ */ t("ul", { className: "cm:divide-y cm:divide-border", children: r.items.map((e) => /* @__PURE__ */ a("li", { className: "cm:grid cm:gap-1 cm:py-3 cm:first:pt-0 cm:sm:grid-cols-[1fr_auto] cm:sm:gap-4", children: [
              /* @__PURE__ */ a("div", { className: "cm:min-w-0", children: [
                /* @__PURE__ */ a("p", { className: "cm:font-medium", children: [
                  e.product_href ? /* @__PURE__ */ t(I, { href: m(e.product_href), className: "cm:hover:underline", children: e.name }) : e.name,
                  e.variant_title && /* @__PURE__ */ a("span", { className: "cm:text-muted-foreground", children: [
                    " · ",
                    e.variant_title
                  ] })
                ] }),
                e.details.map((l) => /* @__PURE__ */ t("p", { className: "cm:text-sm", children: l }, l)),
                /* @__PURE__ */ a("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  e.sku && /* @__PURE__ */ a(D, { children: [
                    "SKU ",
                    e.sku,
                    " · "
                  ] }),
                  e.price_source.label,
                  e.requires_shipping && r.fulfillment_status !== "not_required" && /* @__PURE__ */ a(D, { children: [
                    " · shipped ",
                    e.fulfilled_quantity,
                    "/",
                    e.quantity
                  ] }),
                  e.refunded_quantity > 0 && /* @__PURE__ */ a(D, { children: [
                    " · refunded ",
                    e.refunded_quantity
                  ] })
                ] }),
                e.components.length > 0 && /* @__PURE__ */ t("ul", { className: "cm:mt-1 cm:text-xs cm:text-muted-foreground", children: e.components.map((l, te) => /* @__PURE__ */ a("li", { children: [
                  l.quantity,
                  " × ",
                  l.name
                ] }, te)) })
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
              /* @__PURE__ */ t(k, { label: "Subtotal", value: r.totals.subtotal }),
              r.adjustments.filter((e) => e.kind !== "tax").map((e, l) => /* @__PURE__ */ t(k, { label: `${e.label}${e.code ? ` (${e.code})` : ""}`, value: e.amount, muted: !0 }, l)),
              r.totals.shipping !== null && /* @__PURE__ */ t(k, { label: `Shipping${r.shipping_method?.label ? ` · ${r.shipping_method.label}` : ""}`, value: r.totals.shipping }),
              r.adjustments.filter((e) => e.kind === "tax").map((e, l) => /* @__PURE__ */ t(k, { label: `${e.label}${e.included ? " (included)" : ""}`, value: e.amount, muted: !0 }, `t${l}`)),
              /* @__PURE__ */ t(k, { label: "Total", value: r.totals.total, strong: !0 }),
              r.type === "order" && /* @__PURE__ */ t(k, { label: "Paid", value: r.totals.paid, muted: !0 }),
              r.totals.refunded && /* @__PURE__ */ t(k, { label: "Refunded", value: `−${r.totals.refunded}`, muted: !0 }),
              r.totals.deposit && /* @__PURE__ */ t(k, { label: "Deposit asked", value: r.totals.deposit, muted: !0 }),
              r.totals.balance && /* @__PURE__ */ t(k, { label: r.totals.balance_due_at ? `Balance, due ${f(r.totals.balance_due_at)}` : "Balance", value: r.totals.balance })
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
                  e.reference && /* @__PURE__ */ a(D, { children: [
                    "Ref ",
                    e.reference,
                    " · "
                  ] }),
                  e.paid_at ? `Paid ${f(e.paid_at)}` : e.expires_at ? `Due ${f(e.expires_at)}` : "",
                  e.refunded && ` · refunded ${e.refunded}`
                ] })
              ] }),
              /* @__PURE__ */ t(R, { tone: T(e.status), children: e.status.replace(/_/g, " ") })
            ] }, e.id)),
            r.confirmations.map((e) => /* @__PURE__ */ a("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2 cm:rounded-md cm:border cm:border-dashed cm:p-3", children: [
              /* @__PURE__ */ a("span", { children: [
                "Confirmation from ",
                e.sender_name,
                e.sender_bank ? ` (${e.sender_bank})` : "",
                " · ",
                e.amount,
                e.proof_url && /* @__PURE__ */ a(D, { children: [
                  " · ",
                  /* @__PURE__ */ t("a", { href: e.proof_url, target: "_blank", rel: "noreferrer", className: "cm:underline", children: "proof" })
                ] })
              ] }),
              /* @__PURE__ */ a("span", { className: "cm:flex cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ t(R, { tone: e.status === "approved" ? "ok" : e.status === "rejected" ? "error" : "warning", children: e.status }),
                e.review && /* @__PURE__ */ t(ie, { confirmation: e.review })
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
                e.tracking_number && /* @__PURE__ */ a(D, { children: [
                  " · ",
                  e.tracking_url ? /* @__PURE__ */ t("a", { href: e.tracking_url, target: "_blank", rel: "noreferrer", className: "cm:underline", children: e.tracking_number }) : e.tracking_number
                ] })
              ] }),
              /* @__PURE__ */ t(R, { tone: T(e.status), children: e.status.replace(/_/g, " ") })
            ] }),
            /* @__PURE__ */ a("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
              e.items.map((l) => `${l.quantity} × ${l.name}`).join(", "),
              " · shipped ",
              f(e.shipped_at),
              e.delivered_at ? ` · delivered ${f(e.delivered_at)}` : ""
            ] }),
            d.shipments && e.status !== "delivered" && /* @__PURE__ */ t("div", { children: /* @__PURE__ */ t(s, { size: "sm", variant: "outline", onClick: () => q.post(m(`${v}/shipments/${e.id}/delivered`), {}, { preserveScroll: !0 }), children: "Mark delivered" }) })
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
              /* @__PURE__ */ t(R, { tone: e.state === "active" ? "ok" : "warning", children: e.state.replace("_", " ") }),
              d.edit && ["resend", "extend", "reset", "revoke"].map((l) => /* @__PURE__ */ t(s, { size: "sm", variant: "ghost", onClick: () => q.post(m(`${v}/downloads/${e.id}`), { action: l }, { preserveScroll: !0 }), children: { resend: "Resend", extend: "+7 days", reset: "Reset count", revoke: "Revoke" }[l] }, l))
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
        F.map((e) => {
          const l = ee[e.key];
          return l ? /* @__PURE__ */ a(h, { children: [
            /* @__PURE__ */ t(g, { children: /* @__PURE__ */ t(u, { children: e.label }) }),
            /* @__PURE__ */ t(p, { children: /* @__PURE__ */ t(l, { order: r, data: e.data }) })
          ] }, e.key) : null;
        }),
        /* @__PURE__ */ a(h, { children: [
          /* @__PURE__ */ t(g, { children: /* @__PURE__ */ t(u, { children: "Timeline" }) }),
          /* @__PURE__ */ a(p, { className: "cm:grid cm:gap-4", children: [
            d.edit && /* @__PURE__ */ a("form", { className: "cm:grid cm:gap-2", onSubmit: (e) => {
              e.preventDefault(), y.post(m(`${v}/notes`), { preserveScroll: !0, onSuccess: () => y.reset() });
            }, children: [
              /* @__PURE__ */ t(_, { htmlFor: "o-note", className: "cm:sr-only", children: "Note" }),
              /* @__PURE__ */ t(N, { id: "o-note", placeholder: "Add a note…", value: y.data.message, onChange: (e) => y.setData("message", e.target.value) }),
              /* @__PURE__ */ a("div", { className: "cm:flex cm:items-center cm:justify-between cm:gap-2", children: [
                /* @__PURE__ */ a("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
                  /* @__PURE__ */ t(c, { checked: y.data.customer, onCheckedChange: (e) => y.setData("customer", e === !0) }),
                  " Send to the customer"
                ] }),
                /* @__PURE__ */ t(s, { size: "sm", type: "submit", disabled: y.processing || y.data.message.trim() === "", children: "Add note" })
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
            /* @__PURE__ */ t("p", { className: "cm:font-medium", children: r.customer.href ? /* @__PURE__ */ t(I, { href: m(r.customer.href), className: "cm:hover:underline", children: r.customer.name ?? r.customer.email }) : r.customer.name ?? r.customer.email }),
            r.customer.email && /* @__PURE__ */ t("a", { href: `mailto:${r.customer.email}`, className: "cm:text-muted-foreground cm:hover:underline", children: r.customer.email }),
            r.customer.phone && /* @__PURE__ */ t("a", { href: `https://wa.me/${r.customer.phone.replace(/\D/g, "")}`, target: "_blank", rel: "noreferrer", className: "cm:text-muted-foreground cm:hover:underline", children: r.customer.phone }),
            r.customer.guest && /* @__PURE__ */ t("p", { className: "cm:text-xs cm:text-muted-foreground", children: "Guest checkout" })
          ] })
        ] }),
        /* @__PURE__ */ a(h, { children: [
          /* @__PURE__ */ a(g, { className: "cm:flex cm:flex-row cm:items-center cm:justify-between", children: [
            /* @__PURE__ */ t(u, { children: "Addresses" }),
            d.edit_addresses && /* @__PURE__ */ t(s, { size: "sm", variant: "ghost", asChild: !0, children: /* @__PURE__ */ t(I, { href: m(`${v}/addresses`), children: "Edit" }) })
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
            r.fields && Object.entries(r.fields).map(([e, l]) => /* @__PURE__ */ a("p", { children: [
              /* @__PURE__ */ a("span", { className: "cm:text-muted-foreground", children: [
                e.replace(/_/g, " "),
                ":"
              ] }),
              " ",
              String(l ?? "")
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
            r.documents.length > 0 && /* @__PURE__ */ t("div", { className: "cm:mt-2 cm:flex cm:flex-wrap cm:gap-2", children: r.documents.map((e) => /* @__PURE__ */ t(s, { size: "sm", variant: "outline", asChild: !0, children: /* @__PURE__ */ a("a", { href: e.url, target: "_blank", rel: "noreferrer", children: [
              e.label,
              e.number ? ` ${e.number}` : ""
            ] }) }, e.type)) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ t(i, { open: P !== null, onOpenChange: (e) => !e && O(null), children: /* @__PURE__ */ a(n, { children: [
      /* @__PURE__ */ a(S, { children: [
        /* @__PURE__ */ t($, { children: P?.to === "cancelled" ? "Cancel this order?" : "Put this order on hold?" }),
        /* @__PURE__ */ t(B, { children: P?.to === "cancelled" ? "Stock, flash sale quantities and voucher uses are given back." : "It can go back to its status later." })
      ] }),
      /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ t(_, { htmlFor: "o-reason", children: "Reason (on the timeline)" }),
        /* @__PURE__ */ t(b, { id: "o-reason", value: z, onChange: (e) => E(e.target.value) })
      ] }),
      /* @__PURE__ */ a(w, { children: [
        /* @__PURE__ */ t(s, { variant: "outline", onClick: () => O(null), children: "Back" }),
        /* @__PURE__ */ t(s, { onClick: () => P && U(P.to, z), children: "Confirm" })
      ] })
    ] }) }),
    /* @__PURE__ */ t(i, { open: W, onOpenChange: A, children: /* @__PURE__ */ a(n, { children: [
      /* @__PURE__ */ a(S, { children: [
        /* @__PURE__ */ t($, { children: "Mark as paid" }),
        /* @__PURE__ */ a(B, { children: [
          "Record a payment you received outside the store (",
          r.totals.total,
          ")."
        ] })
      ] }),
      /* @__PURE__ */ a("form", { className: "cm:grid cm:gap-3", onSubmit: (e) => {
        e.preventDefault(), C.post(m(`${v}/mark-paid`), { preserveScroll: !0, onSuccess: () => A(!1) });
      }, children: [
        /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ t(_, { htmlFor: "p-ref", children: "Reference" }),
          /* @__PURE__ */ t(b, { id: "p-ref", value: C.data.reference, onChange: (e) => C.setData("reference", e.target.value) })
        ] }),
        /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ t(_, { htmlFor: "p-date", children: "Paid on" }),
          /* @__PURE__ */ t(b, { id: "p-date", type: "datetime-local", value: C.data.paid_at, onChange: (e) => C.setData("paid_at", e.target.value) })
        ] }),
        /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ t(_, { htmlFor: "p-acc", children: "Into account" }),
          /* @__PURE__ */ t(b, { id: "p-acc", value: C.data.account, onChange: (e) => C.setData("account", e.target.value) })
        ] }),
        /* @__PURE__ */ t(w, { children: /* @__PURE__ */ t(s, { type: "submit", disabled: C.processing, children: "Record payment" }) })
      ] })
    ] }) }),
    X && /* @__PURE__ */ t(se, { order: r, couriers: o.couriers, onClose: () => H(!1) }),
    Z && /* @__PURE__ */ t(de, { order: r, onClose: () => G(!1) })
  ] });
}
function k({ label: o, value: r, muted: x, strong: d }) {
  return /* @__PURE__ */ a("div", { className: `cm:flex cm:justify-between cm:gap-4 ${x ? "cm:text-muted-foreground" : ""} ${d ? "cm:text-base cm:font-semibold" : ""}`, children: [
    /* @__PURE__ */ t("dt", { children: o }),
    /* @__PURE__ */ t("dd", { children: r })
  ] });
}
export {
  ue as default
};
