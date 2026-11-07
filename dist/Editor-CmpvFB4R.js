import { u as U, a as z, b as v, i as A, R as b, h as E, j as i, c as a, P as B, d as H, M as w, l as L, F as M } from "./main-DVaJaMrz.js";
function G({ mode: l, order: r, paymentMethods: x, canOverride: P, variantsUrl: R, previewUrl: j, submitUrl: k }) {
  const { Card: h, CardContent: p, CardHeader: u, CardTitle: g, Button: F, Input: d, Label: s, Checkbox: y, Textarea: I } = H;
  U(), z([
    { label: "Shop", href: v("commerce") },
    { label: "Orders", href: v("commerce/orders") },
    ...r ? [{ label: r.number, href: v(`commerce/orders/${r.id}`) }] : [],
    { label: l === "create" ? "New order" : l === "quote" ? "Quote" : "Edit items" }
  ]);
  const t = A.useForm({
    email: "",
    name: "",
    phone: "",
    lines: r?.lines ?? [],
    shipping: r?.shipping ?? { label: "", cost: 0 },
    discount: r?.discount ?? { label: "", amount: 0 },
    shipping_address: { name: "", phone: "", country: "ID", province_code: null, city_code: null, district_code: null, village_code: null, line1: "", line2: "", postal_code: "" },
    payment_status: "unpaid",
    payment_method: x[0]?.value ?? "",
    reference: "",
    note: "",
    send_link: !1,
    notify: !1,
    valid_until: r?.valid_until ?? "",
    send: !0
  }), f = t.errors, [_, q] = b.useState(""), [T, N] = b.useState([]), [o, C] = b.useState(null);
  b.useEffect(() => {
    if (_.trim().length < 2) {
      N([]);
      return;
    }
    const e = setTimeout(() => E(`${v(R)}&q=${encodeURIComponent(_)}`).then((n) => N(n.data)).catch(() => N([])), 250);
    return () => clearTimeout(e);
  }, [_]), b.useEffect(() => {
    if (t.data.lines.length === 0) {
      C(null);
      return;
    }
    const e = setTimeout(() => {
      E(v(j), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        lines: t.data.lines.map(({ item_id: n, variant_id: c, quantity: m, unit_price: S }) => ({ item_id: n, variant_id: c, quantity: m, unit_price: S })),
        shipping: t.data.shipping,
        discount: t.data.discount,
        shipping_address: l === "create" ? t.data.shipping_address : void 0
      }) }).then(C).catch(() => C(null));
    }, 300);
    return () => clearTimeout(e);
  }, [JSON.stringify([t.data.lines, t.data.shipping, t.data.discount, t.data.shipping_address])]);
  const O = (e) => {
    const n = t.data.lines.findIndex((c) => c.variant_id === e.id && !c.item_id);
    t.setData("lines", n >= 0 ? t.data.lines.map((c, m) => m === n ? { ...c, quantity: c.quantity + 1 } : c) : [...t.data.lines, { variant_id: e.id, label: e.label, sku: e.sku, quantity: 1, price: e.price, unit_price: null }]), q(""), N([]);
  }, $ = (e, n) => t.setData("lines", t.data.lines.map((c, m) => m === e ? { ...c, ...n } : c)), J = (e) => {
    e.preventDefault(), t.transform((n) => ({ ...n, lines: n.lines.map(({ item_id: c, variant_id: m, quantity: S, unit_price: Q }) => ({ item_id: c, variant_id: m, quantity: S, unit_price: Q })) })), l === "create" ? t.post(v(k)) : t.put(v(k));
  }, D = (e) => o?.lines.find((n) => n.variant_id === e);
  return /* @__PURE__ */ i("form", { onSubmit: J, className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-6 cm:max-w-5xl", children: [
    /* @__PURE__ */ a(
      B,
      {
        title: l === "create" ? "New order" : l === "quote" ? `Quote ${r?.number}` : `Edit ${r?.number}`,
        description: l === "edit" ? "Existing lines keep their price; new lines use today's price. The stock difference is reserved or given back." : l === "quote" ? `For ${r?.customer}. Set the prices, shipping and discount, then send it.` : "An order for a customer, from a chat or a call."
      }
    ),
    /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[2fr_1fr]", children: [
      /* @__PURE__ */ i("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ i(h, { children: [
          /* @__PURE__ */ a(u, { children: /* @__PURE__ */ a(g, { children: "Products" }) }),
          /* @__PURE__ */ i(p, { className: "cm:grid cm:gap-3", children: [
            /* @__PURE__ */ i("div", { className: "cm:relative", children: [
              /* @__PURE__ */ a(d, { placeholder: "Search products by name or SKU…", value: _, onChange: (e) => q(e.target.value), "aria-label": "Search products" }),
              T.length > 0 && /* @__PURE__ */ a("ul", { className: "cm:absolute cm:z-10 cm:mt-1 cm:max-h-64 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: T.map((e) => /* @__PURE__ */ a("li", { children: /* @__PURE__ */ a("button", { type: "button", className: "cm:flex cm:w-full cm:justify-between cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted", onClick: () => O(e), children: /* @__PURE__ */ i("span", { children: [
                e.label,
                e.sku ? /* @__PURE__ */ i("span", { className: "cm:text-muted-foreground", children: [
                  " · ",
                  e.sku
                ] }) : null
              ] }) }) }, e.id)) })
            ] }),
            f.lines && /* @__PURE__ */ a("p", { className: "cm:text-sm cm:text-destructive", children: f.lines }),
            t.data.lines.length === 0 ? /* @__PURE__ */ a("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No products yet." }) : /* @__PURE__ */ a("ul", { className: "cm:divide-y cm:divide-border", children: t.data.lines.map((e, n) => /* @__PURE__ */ i("li", { className: "cm:grid cm:items-center cm:gap-2 cm:py-2 cm:sm:grid-cols-[1fr_5rem_9rem_7rem_auto]", children: [
              /* @__PURE__ */ i("div", { className: "cm:min-w-0 cm:text-sm", children: [
                /* @__PURE__ */ a("p", { className: "cm:font-medium", children: e.label }),
                e.sku && /* @__PURE__ */ a("p", { className: "cm:text-xs cm:text-muted-foreground", children: e.sku })
              ] }),
              /* @__PURE__ */ a(d, { type: "number", min: 1, "aria-label": "Quantity", value: e.quantity, onChange: (c) => $(n, { quantity: Math.max(1, Number(c.target.value)) }) }),
              P ? /* @__PURE__ */ a(w, { value: e.unit_price, placeholder: D(e.variant_id)?.unit_price_formatted ?? "", onChange: (c) => $(n, { unit_price: c }) }) : /* @__PURE__ */ a("span", { className: "cm:text-sm", children: D(e.variant_id)?.unit_price_formatted ?? "…" }),
              /* @__PURE__ */ a("span", { className: "cm:text-sm cm:font-medium cm:sm:text-right", children: D(e.variant_id)?.total ?? "" }),
              /* @__PURE__ */ a(F, { type: "button", variant: "ghost", size: "sm", "aria-label": "Remove", onClick: () => t.setData("lines", t.data.lines.filter((c, m) => m !== n)), children: "×" })
            ] }, `${e.item_id ?? "n"}-${e.variant_id}-${n}`)) }),
            o?.notices.map((e, n) => /* @__PURE__ */ a("p", { className: "cm:text-sm cm:text-amber-700", children: e }, n))
          ] })
        ] }),
        l === "create" && /* @__PURE__ */ i(h, { children: [
          /* @__PURE__ */ a(u, { children: /* @__PURE__ */ a(g, { children: "Customer" }) }),
          /* @__PURE__ */ i(p, { className: "cm:grid cm:gap-3 cm:sm:grid-cols-3", children: [
            /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ a(s, { htmlFor: "m-email", children: "Email *" }),
              /* @__PURE__ */ a(d, { id: "m-email", type: "email", value: t.data.email, onChange: (e) => t.setData("email", e.target.value) }),
              f.email && /* @__PURE__ */ a("p", { className: "cm:text-sm cm:text-destructive", children: f.email })
            ] }),
            /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ a(s, { htmlFor: "m-name", children: "Name" }),
              /* @__PURE__ */ a(d, { id: "m-name", value: t.data.name, onChange: (e) => t.setData("name", e.target.value) })
            ] }),
            /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ a(s, { htmlFor: "m-phone", children: "Phone" }),
              /* @__PURE__ */ a(d, { id: "m-phone", value: t.data.phone, onChange: (e) => t.setData("phone", e.target.value) })
            ] })
          ] })
        ] }),
        l === "create" && (o?.needs_shipping ?? !0) && /* @__PURE__ */ i(h, { children: [
          /* @__PURE__ */ a(u, { children: /* @__PURE__ */ a(g, { children: "Shipping address" }) }),
          /* @__PURE__ */ i(p, { className: "cm:grid cm:gap-3", children: [
            /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: ["name", "phone"].map((e) => /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ a(s, { htmlFor: `a-${e}`, children: e === "name" ? "Recipient" : "Phone" }),
              /* @__PURE__ */ a(d, { id: `a-${e}`, value: String(t.data.shipping_address[e] ?? ""), onChange: (n) => t.setData("shipping_address", { ...t.data.shipping_address, [e]: n.target.value }) })
            ] }, e)) }),
            /* @__PURE__ */ a(
              L,
              {
                field: { handle: "region", type: "commerce_region", label: "Region", config: { depth: "village" } },
                id: "shipping_address",
                value: t.data.shipping_address,
                onChange: (e) => t.setData("shipping_address", { ...t.data.shipping_address, ...e ?? {} })
              }
            ),
            /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ a(s, { htmlFor: "a-line1", children: "Street address" }),
              /* @__PURE__ */ a(d, { id: "a-line1", value: String(t.data.shipping_address.line1 ?? ""), onChange: (e) => t.setData("shipping_address", { ...t.data.shipping_address, line1: e.target.value }) })
            ] }),
            /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1 cm:sm:w-48", children: [
              /* @__PURE__ */ a(s, { htmlFor: "a-postal", children: "Postal code" }),
              /* @__PURE__ */ a(d, { id: "a-postal", value: String(t.data.shipping_address.postal_code ?? ""), onChange: (e) => t.setData("shipping_address", { ...t.data.shipping_address, postal_code: e.target.value }) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ i("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ i(h, { children: [
          /* @__PURE__ */ a(u, { children: /* @__PURE__ */ a(g, { children: "Shipping and discount" }) }),
          /* @__PURE__ */ i(p, { className: "cm:grid cm:gap-3", children: [
            /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ a(s, { htmlFor: "s-label", children: "Shipping method" }),
              /* @__PURE__ */ a(d, { id: "s-label", placeholder: "JNE REG", value: t.data.shipping.label, onChange: (e) => t.setData("shipping", { ...t.data.shipping, label: e.target.value }) })
            ] }),
            /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ a(s, { htmlFor: "s-cost", children: "Shipping cost" }),
              /* @__PURE__ */ a(w, { id: "s-cost", allowNull: !1, value: t.data.shipping.cost, onChange: (e) => t.setData("shipping", { ...t.data.shipping, cost: e ?? 0 }) })
            ] }),
            /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ a(s, { htmlFor: "d-label", children: "Discount label" }),
              /* @__PURE__ */ a(d, { id: "d-label", value: t.data.discount.label, onChange: (e) => t.setData("discount", { ...t.data.discount, label: e.target.value }) })
            ] }),
            /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ a(s, { htmlFor: "d-amount", children: "Discount" }),
              /* @__PURE__ */ a(w, { id: "d-amount", allowNull: !1, value: t.data.discount.amount, onChange: (e) => t.setData("discount", { ...t.data.discount, amount: e ?? 0 }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ i(h, { children: [
          /* @__PURE__ */ a(u, { children: /* @__PURE__ */ a(g, { children: "Total" }) }),
          /* @__PURE__ */ a(p, { className: "cm:grid cm:gap-1 cm:text-sm", children: o ? /* @__PURE__ */ i(M, { children: [
            /* @__PURE__ */ i("p", { className: "cm:flex cm:justify-between", children: [
              /* @__PURE__ */ a("span", { children: "Subtotal" }),
              /* @__PURE__ */ a("span", { children: o.totals.subtotal })
            ] }),
            /* @__PURE__ */ i("p", { className: "cm:flex cm:justify-between", children: [
              /* @__PURE__ */ a("span", { children: "Discount" }),
              /* @__PURE__ */ i("span", { children: [
                "−",
                o.totals.discount
              ] })
            ] }),
            /* @__PURE__ */ i("p", { className: "cm:flex cm:justify-between", children: [
              /* @__PURE__ */ a("span", { children: "Shipping" }),
              /* @__PURE__ */ a("span", { children: o.totals.shipping })
            ] }),
            /* @__PURE__ */ i("p", { className: "cm:flex cm:justify-between cm:text-base cm:font-semibold", children: [
              /* @__PURE__ */ a("span", { children: "Total" }),
              /* @__PURE__ */ a("span", { children: o.totals.total })
            ] })
          ] }) : /* @__PURE__ */ a("p", { className: "cm:text-muted-foreground", children: "Add products to see the total." }) })
        ] }),
        l === "create" && /* @__PURE__ */ i(h, { children: [
          /* @__PURE__ */ a(u, { children: /* @__PURE__ */ a(g, { children: "Payment" }) }),
          /* @__PURE__ */ i(p, { className: "cm:grid cm:gap-3 cm:text-sm", children: [
            ["unpaid", "paid"].map((e) => /* @__PURE__ */ i("label", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ a("input", { type: "radio", name: "payment_status", checked: t.data.payment_status === e, onChange: () => t.setData("payment_status", e) }),
              e === "unpaid" ? "Unpaid: the customer pays later" : "Paid already"
            ] }, e)),
            x.length > 0 && /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ a(s, { htmlFor: "p-method", children: "Method" }),
              /* @__PURE__ */ i("select", { id: "p-method", className: "cm:h-9 cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3", value: t.data.payment_method, onChange: (e) => t.setData("payment_method", e.target.value), children: [
                /* @__PURE__ */ a("option", { value: "", children: "—" }),
                x.map((e) => /* @__PURE__ */ a("option", { value: e.value, children: e.label }, e.value))
              ] })
            ] }),
            t.data.payment_status === "paid" ? /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ a(s, { htmlFor: "p-ref", children: "Reference" }),
              /* @__PURE__ */ a(d, { id: "p-ref", value: t.data.reference, onChange: (e) => t.setData("reference", e.target.value) })
            ] }) : /* @__PURE__ */ i("label", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ a(y, { checked: t.data.send_link, onCheckedChange: (e) => t.setData("send_link", e === !0) }),
              " Email the customer the link to pay"
            ] }),
            /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ a(s, { htmlFor: "m-note", children: "Internal note" }),
              /* @__PURE__ */ a(I, { id: "m-note", value: t.data.note, onChange: (e) => t.setData("note", e.target.value) })
            ] })
          ] })
        ] }),
        l === "quote" && /* @__PURE__ */ i(h, { children: [
          /* @__PURE__ */ a(u, { children: /* @__PURE__ */ a(g, { children: "Validity" }) }),
          /* @__PURE__ */ i(p, { className: "cm:grid cm:gap-3 cm:text-sm", children: [
            /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ a(s, { htmlFor: "q-valid", children: "Valid until" }),
              /* @__PURE__ */ a(d, { id: "q-valid", type: "date", value: t.data.valid_until, onChange: (e) => t.setData("valid_until", e.target.value) }),
              f.valid_until && /* @__PURE__ */ a("p", { className: "cm:text-sm cm:text-destructive", children: f.valid_until })
            ] }),
            /* @__PURE__ */ i("label", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ a(y, { checked: t.data.send, onCheckedChange: (e) => t.setData("send", e === !0) }),
              " Send it to the customer now"
            ] })
          ] })
        ] }),
        l === "edit" && /* @__PURE__ */ i("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
          /* @__PURE__ */ a(y, { checked: t.data.notify, onCheckedChange: (e) => t.setData("notify", e === !0) }),
          " Tell the customer about the change"
        ] }),
        /* @__PURE__ */ a(F, { type: "submit", disabled: t.processing || t.data.lines.length === 0, children: l === "create" ? "Create order" : l === "quote" ? t.data.send ? "Send quote" : "Save quote" : "Save changes" })
      ] })
    ] })
  ] });
}
export {
  G as default
};
