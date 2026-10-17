const de = { symbol: "Rp", position: "left", space: !1, thousands: ".", decimal: ",", decimals: 0 };
let ee = de;
function ve(t) {
  ee = { ...de, ...t ?? {} };
}
function K(t, n = ee) {
  const c = t < 0, i = Math.abs(Math.round(t)), l = 10 ** n.decimals, r = Math.floor(i / l).toString().replace(/\B(?=(\d{3})+(?!\d))/g, n.thousands), s = n.decimals > 0 ? n.decimal + String(i % l).padStart(n.decimals, "0") : "", o = r + s, v = n.space ? " " : "", m = n.position === "left" ? `${n.symbol}${v}${o}` : `${o}${v}${n.symbol}`;
  return c ? `-${m}` : m;
}
function me(t, n = ee) {
  let c = t.replace(n.symbol, "").replace(/\s/g, "");
  const i = c.startsWith("-");
  c = c.replace(/^-/, "").split(n.thousands).join("");
  const [l, r = ""] = c.split(n.decimal);
  if (!/^\d*$/.test(l) || !/^\d*$/.test(r) || l + r === "")
    return null;
  const s = Number(l || "0") * 10 ** n.decimals + Number(r.padEnd(n.decimals, "0").slice(0, n.decimals) || "0");
  return i ? -s : s;
}
const P = {
  orderPanels: {},
  dashboardWidgets: {},
  settingsSections: {},
  productTabs: {}
}, z = {
  version: 1,
  registerOrderPanel: (t, n) => {
    P.orderPanels[t] = n;
  },
  registerDashboardWidget: (t, n) => {
    P.dashboardWidgets[t] = n;
  },
  registerSettingsSection: (t, n) => {
    P.settingsSections[t] = n;
  },
  registerProductTab: (t, n) => {
    P.productTabs[t] = n;
  },
  orderPanels: () => P.orderPanels,
  dashboardWidgets: () => P.dashboardWidgets,
  settingsSections: () => P.settingsSections,
  productTabs: () => P.productTabs,
  formatMoney: K,
  parseMoney: me,
  components: {}
};
function ye() {
  window.SunriceCommerce = z;
  const t = window.SunriceCommerceQueue ?? [];
  (() => {
    for (; t.length > 0; ) {
      const c = t.shift();
      try {
        c?.(z);
      } catch (i) {
        console.error("SunriceCommerceQueue call failed", i);
      }
    }
  })(), t.push = ((...c) => (c.forEach((i) => i(z)), t.length)), window.SunriceCommerceQueue = t;
}
const E = window.Sunrice, { React: C, ui: F, components: M, inertia: j, adminUrl: S, fetchJson: O, toast: ke } = E, ue = window.Sunrice.React, V = ue.Fragment;
function e(t, n, c) {
  return ue.createElement(t, c === void 0 ? n : { ...n, key: c });
}
const a = e;
function U({ title: t, description: n, actions: c }) {
  const { Head: i } = j;
  return /* @__PURE__ */ a("div", { className: "cm:flex cm:flex-wrap cm:items-start cm:justify-between cm:gap-4", children: [
    /* @__PURE__ */ e(i, { title: t }),
    /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e("h1", { className: "cm:text-xl cm:font-semibold cm:tracking-tight", children: t }),
      n && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: n })
    ] }),
    c && /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: c })
  ] });
}
function he(t) {
  var n, c, i = "";
  if (typeof t == "string" || typeof t == "number") i += t;
  else if (typeof t == "object") if (Array.isArray(t)) {
    var l = t.length;
    for (n = 0; n < l; n++) t[n] && (c = he(t[n])) && (i && (i += " "), i += c);
  } else for (c in t) t[c] && (i && (i += " "), i += c);
  return i;
}
function xe() {
  for (var t, n, c = 0, i = "", l = arguments.length; c < l; c++) (t = arguments[c]) && (n = he(t)) && (i && (i += " "), i += n);
  return i;
}
function Q(...t) {
  return xe(t);
}
const re = {
  ok: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  success: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  warning: "cm:bg-amber-500/10 cm:text-amber-700 cm:dark:text-amber-400",
  error: "cm:bg-red-500/10 cm:text-red-700 cm:dark:text-red-400",
  info: "cm:bg-sky-500/10 cm:text-sky-700 cm:dark:text-sky-400",
  neutral: "cm:bg-muted cm:text-muted-foreground"
};
function T({ tone: t = "neutral", children: n }) {
  return /* @__PURE__ */ e("span", { className: Q("cm:inline-flex cm:items-center cm:rounded-full cm:px-2 cm:py-0.5 cm:text-xs cm:font-medium", re[t] ?? re.neutral), children: n });
}
function L() {
  const { props: t } = j.usePage(), n = t.commerce ?? {};
  return ve(n.currency), n;
}
const Y = (t) => t ? new Date(t).toLocaleDateString(void 0, { dateStyle: "medium" }) : "—";
function Ne({ customer: t, account: n, roleOptions: c, orders: i, can: l }) {
  const { Card: r, CardContent: s, CardHeader: o, CardTitle: v, Button: m, Input: k, Label: f, Textarea: g, Switch: u, Checkbox: p } = F, { Link: h, router: d } = j;
  L(), E.useBreadcrumbs([{ label: "Shop", href: S("commerce") }, { label: "Customers", href: S("commerce/customers") }, { label: t.name ?? t.email }]);
  const b = j.useForm({ name: t.name ?? "", phone: t.phone ?? "", note: t.note ?? "", accepts_marketing: t.accepts_marketing, roles: n?.roles ?? [] }), [w, N] = C.useState(!1), x = (y) => d.post(S(`commerce/customers/${t.id}/${y}`), {}, { preserveScroll: !0 });
  return /* @__PURE__ */ a("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-5xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      U,
      {
        title: t.name ?? t.email,
        description: /* @__PURE__ */ a(V, { children: [
          t.email,
          t.phone ? ` · ${t.phone}` : ""
        ] }),
        actions: /* @__PURE__ */ a(V, { children: [
          t.deletion_requested_at && /* @__PURE__ */ a(T, { tone: "warning", children: [
            "Deletion requested ",
            Y(t.deletion_requested_at)
          ] }),
          n ? /* @__PURE__ */ e(T, { tone: "ok", children: "Registered" }) : /* @__PURE__ */ e(T, { children: "Guest" })
        ] })
      }
    ),
    /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-3", children: [["Orders", String(t.orders_count)], ["Spent", t.total_spent], ["Last order", Y(t.last_order_at)]].map(([y, D]) => /* @__PURE__ */ e(r, { children: /* @__PURE__ */ a(s, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
      /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: y }),
      /* @__PURE__ */ e("span", { className: "cm:text-xl cm:font-semibold", children: D })
    ] }) }, y)) }),
    /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[2fr_1fr]", children: [
      /* @__PURE__ */ a("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ a(r, { children: [
          /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(v, { children: "Orders" }) }),
          /* @__PURE__ */ e(s, { children: i.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No orders yet." }) : /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1", children: i.map((y) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ a(h, { href: S(y.href), className: "cm:flex cm:justify-between cm:rounded cm:p-2 cm:hover:bg-muted", children: [
            /* @__PURE__ */ a("span", { children: [
              y.number,
              " · ",
              Y(y.date)
            ] }),
            /* @__PURE__ */ a("span", { children: [
              /* @__PURE__ */ e(T, { children: y.status }),
              " ",
              y.total
            ] })
          ] }) }, y.id)) }) })
        ] }),
        /* @__PURE__ */ a(r, { children: [
          /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(v, { children: "Addresses" }) }),
          /* @__PURE__ */ e(s, { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: t.addresses.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No saved addresses." }) : t.addresses.map((y) => /* @__PURE__ */ a("div", { className: "cm:rounded-md cm:border cm:p-3 cm:text-sm", children: [
            y.label && /* @__PURE__ */ e("p", { className: "cm:font-medium", children: y.label }),
            /* @__PURE__ */ e("p", { className: "cm:whitespace-pre-line", children: y.text }),
            /* @__PURE__ */ a("div", { className: "cm:mt-1 cm:flex cm:gap-1", children: [
              y.default_shipping && /* @__PURE__ */ e(T, { children: "Shipping" }),
              y.default_billing && /* @__PURE__ */ e(T, { children: "Billing" })
            ] })
          ] }, y.id)) })
        ] })
      ] }),
      /* @__PURE__ */ a("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ a(r, { children: [
          /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(v, { children: "Details" }) }),
          /* @__PURE__ */ e(s, { children: /* @__PURE__ */ a("form", { className: "cm:grid cm:gap-3", onSubmit: (y) => {
            y.preventDefault(), b.put(S(`commerce/customers/${t.id}`), { preserveScroll: !0 });
          }, children: [
            /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(f, { htmlFor: "c-name", children: "Name" }),
              /* @__PURE__ */ e(k, { id: "c-name", disabled: !l.edit, value: b.data.name, onChange: (y) => b.setData("name", y.target.value) })
            ] }),
            /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(f, { htmlFor: "c-phone", children: "Phone" }),
              /* @__PURE__ */ e(k, { id: "c-phone", disabled: !l.edit, value: b.data.phone, onChange: (y) => b.setData("phone", y.target.value) })
            ] }),
            /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(f, { htmlFor: "c-note", children: "Note (staff only)" }),
              /* @__PURE__ */ e(g, { id: "c-note", disabled: !l.edit, value: b.data.note, onChange: (y) => b.setData("note", y.target.value) })
            ] }),
            /* @__PURE__ */ a("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e(u, { id: "c-marketing", disabled: !l.edit, checked: b.data.accepts_marketing, onCheckedChange: (y) => b.setData("accepts_marketing", y) }),
              /* @__PURE__ */ e(f, { htmlFor: "c-marketing", children: "Accepts marketing" })
            ] }),
            n && /* @__PURE__ */ a("fieldset", { className: "cm:grid cm:gap-1.5", children: [
              /* @__PURE__ */ e("legend", { className: "cm:mb-1 cm:text-sm cm:font-medium", children: "Roles" }),
              c.map((y) => /* @__PURE__ */ a("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
                /* @__PURE__ */ e(
                  p,
                  {
                    disabled: !l.edit,
                    checked: b.data.roles.includes(y),
                    onCheckedChange: (D) => b.setData("roles", D ? [...b.data.roles, y] : b.data.roles.filter(($) => $ !== y))
                  }
                ),
                y
              ] }, y))
            ] }),
            l.edit && /* @__PURE__ */ e(m, { type: "submit", disabled: b.processing, children: "Save" })
          ] }) })
        ] }),
        n && /* @__PURE__ */ a(r, { children: [
          /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(v, { children: "Account" }) }),
          /* @__PURE__ */ a(s, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            /* @__PURE__ */ a("p", { children: [
              "Email ",
              n.email_verified ? "verified" : "not verified"
            ] }),
            n.google && /* @__PURE__ */ a("p", { children: [
              "Google: ",
              n.google
            ] }),
            l.edit && /* @__PURE__ */ e(m, { variant: "outline", size: "sm", onClick: () => x("password-reset"), children: "Send a password reset link" }),
            l.edit && !n.email_verified && /* @__PURE__ */ e(m, { variant: "outline", size: "sm", onClick: () => x("verify"), children: "Mark email verified" })
          ] })
        ] }),
        l.delete && !t.anonymized && /* @__PURE__ */ a(r, { children: [
          /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(v, { children: "Remove personal data" }) }),
          /* @__PURE__ */ a(s, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "Name, email, phone and addresses are deleted; orders keep their amounts." }),
            w ? /* @__PURE__ */ a("div", { className: "cm:flex cm:gap-2", children: [
              /* @__PURE__ */ e(m, { variant: "destructive", size: "sm", onClick: () => x("anonymize"), children: "Remove for good" }),
              /* @__PURE__ */ e(m, { variant: "outline", size: "sm", onClick: () => N(!1), children: "Cancel" })
            ] }) : /* @__PURE__ */ e(m, { variant: "outline", size: "sm", onClick: () => N(!0), children: "Anonymize" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function ge({ title: t, description: n, action: c }) {
  return /* @__PURE__ */ a("div", { className: "cm:flex cm:flex-col cm:items-center cm:gap-2 cm:rounded-lg cm:border cm:border-dashed cm:px-6 cm:py-10 cm:text-center", children: [
    /* @__PURE__ */ e("p", { className: "cm:font-medium", children: t }),
    n && /* @__PURE__ */ e("p", { className: "cm:max-w-md cm:text-sm cm:text-muted-foreground", children: n }),
    c && /* @__PURE__ */ e("div", { className: "cm:mt-2", children: c })
  ] });
}
function _e({ mode: t, setup: n, health: c, kpis: i, todo: l }) {
  const { Card: r, CardContent: s, CardHeader: o, CardTitle: v, CardDescription: m } = F, { Link: k } = j;
  L();
  const f = n.filter((p) => !p.done), g = c.filter((p) => p.status !== "ok"), u = Object.entries(z.dashboardWidgets());
  return /* @__PURE__ */ a("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(U, { title: "Store", description: /* @__PURE__ */ a(V, { children: [
      "Selling mode: ",
      t.label
    ] }) }),
    f.length > 0 && /* @__PURE__ */ a(r, { children: [
      /* @__PURE__ */ a(o, { children: [
        /* @__PURE__ */ e(v, { children: "Set up your store" }),
        /* @__PURE__ */ a(m, { children: [
          n.length - f.length,
          " of ",
          n.length,
          " done"
        ] })
      ] }),
      /* @__PURE__ */ e(s, { className: "cm:grid cm:gap-2", children: n.map((p) => /* @__PURE__ */ a(k, { href: S(p.href), className: "cm:flex cm:items-start cm:gap-3 cm:rounded-md cm:p-2 cm:hover:bg-muted", children: [
        /* @__PURE__ */ e("span", { "aria-hidden": !0, className: p.done ? "cm:text-emerald-600" : "cm:text-muted-foreground", children: p.done ? "✓" : "○" }),
        /* @__PURE__ */ a("span", { className: "cm:grid", children: [
          /* @__PURE__ */ e("span", { className: p.done ? "cm:text-muted-foreground cm:line-through" : "cm:font-medium", children: p.label }),
          p.description && /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: p.description })
        ] })
      ] }, p.key)) })
    ] }),
    g.length > 0 && /* @__PURE__ */ a(r, { children: [
      /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(v, { children: "Needs attention" }) }),
      /* @__PURE__ */ e(s, { className: "cm:grid cm:gap-3", children: g.map((p) => /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ a("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
          /* @__PURE__ */ e(T, { tone: p.status, children: p.status === "error" ? "Problem" : "Warning" }),
          /* @__PURE__ */ e("span", { className: "cm:font-medium", children: p.label })
        ] }),
        /* @__PURE__ */ e("p", { className: "cm:text-sm", children: p.message }),
        p.fix && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: p.fix })
      ] }, p.key)) })
    ] }),
    /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2 cm:lg:grid-cols-4", children: i === void 0 ? [0, 1, 2, 3].map((p) => /* @__PURE__ */ e("div", { className: "cm:h-24 cm:animate-pulse cm:rounded-lg cm:bg-muted" }, p)) : i.map((p) => /* @__PURE__ */ e(r, { children: /* @__PURE__ */ a(s, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
      /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: p.label }),
      /* @__PURE__ */ e("span", { className: "cm:text-2xl cm:font-semibold", children: p.value }),
      p.hint && /* @__PURE__ */ e("span", { className: "cm:text-xs cm:text-muted-foreground", children: p.hint })
    ] }) }, p.key)) }),
    /* @__PURE__ */ a(r, { children: [
      /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(v, { children: "To do" }) }),
      /* @__PURE__ */ e(s, { children: l === void 0 ? /* @__PURE__ */ e("div", { className: "cm:h-16 cm:animate-pulse cm:rounded-md cm:bg-muted" }) : l.length === 0 ? /* @__PURE__ */ e(ge, { title: "Nothing to do", description: "Orders to process and payments to verify show up here." }) : /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1", children: l.map((p) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ a(k, { href: S(p.href), className: "cm:flex cm:justify-between cm:rounded-md cm:p-2 cm:hover:bg-muted", children: [
        /* @__PURE__ */ e("span", { children: p.label }),
        /* @__PURE__ */ e("span", { className: "cm:font-semibold", children: p.count })
      ] }) }, p.key)) }) })
    ] }),
    u.map(([p, h]) => /* @__PURE__ */ e(h, {}, p))
  ] });
}
const $e = { in_stock: "ok", out_of_stock: "error", backorder: "warning" };
function Ce({ row: t, reasons: n, onClose: c }) {
  const { Dialog: i, DialogContent: l, DialogHeader: r, DialogTitle: s, DialogDescription: o, DialogFooter: v, Button: m, Input: k, Label: f } = F, g = j.useForm({ mode: "add", quantity: 0, reason: "manual", note: "" }), [u, p] = C.useState(null);
  C.useEffect(() => {
    O(S(`commerce/inventory/${t.id}/history`)).then((d) => p(d.data)).catch(() => p([]));
  }, [t.id]);
  const h = g.data.mode === "set" ? g.data.quantity : (t.stock_quantity ?? 0) + g.data.quantity;
  return /* @__PURE__ */ e(i, { open: !0, onOpenChange: (d) => !d && c(), children: /* @__PURE__ */ a(l, { className: "cm:max-w-lg", children: [
    /* @__PURE__ */ a(r, { children: [
      /* @__PURE__ */ e(s, { children: "Adjust stock" }),
      /* @__PURE__ */ a(o, { children: [
        t.product_title,
        t.sku ? ` · ${t.sku}` : "",
        ". Now: ",
        t.track_stock ? t.stock_quantity ?? 0 : "not tracked",
        "."
      ] })
    ] }),
    /* @__PURE__ */ a("form", { id: "adjust-stock", className: "cm:grid cm:gap-3", onSubmit: (d) => {
      d.preventDefault(), g.post(S(`commerce/inventory/${t.id}/adjust`), { preserveScroll: !0, onSuccess: c });
    }, children: [
      /* @__PURE__ */ a("div", { className: "cm:grid cm:grid-cols-2 cm:gap-3", children: [
        /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(f, { htmlFor: "adjust-mode", children: "Change" }),
          /* @__PURE__ */ a("select", { id: "adjust-mode", className: "cm:h-9 cm:rounded-md cm:border cm:bg-background cm:px-3 cm:text-sm", value: g.data.mode, onChange: (d) => g.setData("mode", d.target.value), children: [
            /* @__PURE__ */ e("option", { value: "add", children: "Add or remove" }),
            /* @__PURE__ */ e("option", { value: "set", children: "Set to" })
          ] })
        ] }),
        /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(f, { htmlFor: "adjust-quantity", children: g.data.mode === "set" ? "New stock" : "Units (+/−)" }),
          /* @__PURE__ */ e(k, { id: "adjust-quantity", type: "number", value: g.data.quantity, onChange: (d) => g.setData("quantity", Number(d.target.value)) }),
          g.errors.quantity && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-destructive", children: g.errors.quantity })
        ] })
      ] }),
      /* @__PURE__ */ a("div", { className: "cm:grid cm:grid-cols-2 cm:gap-3", children: [
        /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(f, { htmlFor: "adjust-reason", children: "Reason" }),
          /* @__PURE__ */ e("select", { id: "adjust-reason", className: "cm:h-9 cm:rounded-md cm:border cm:bg-background cm:px-3 cm:text-sm", value: g.data.reason, onChange: (d) => g.setData("reason", d.target.value), children: n.map((d) => /* @__PURE__ */ e("option", { value: d, children: d[0].toUpperCase() + d.slice(1) }, d)) })
        ] }),
        /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(f, { htmlFor: "adjust-note", children: "Note" }),
          /* @__PURE__ */ e(k, { id: "adjust-note", value: g.data.note, onChange: (d) => g.setData("note", d.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ a("p", { className: "cm:text-sm", children: [
        "Stock after: ",
        /* @__PURE__ */ e("strong", { children: h })
      ] })
    ] }),
    /* @__PURE__ */ a("div", { className: "cm:grid cm:max-h-56 cm:gap-1 cm:overflow-auto cm:border-t cm:pt-3 cm:text-sm", children: [
      /* @__PURE__ */ e("p", { className: "cm:font-medium", children: "History" }),
      u === null ? /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "Loading…" }) : u.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "No changes yet." }) : u.map((d) => /* @__PURE__ */ a("div", { className: "cm:flex cm:justify-between cm:gap-3", children: [
        /* @__PURE__ */ a("span", { children: [
          d.delta > 0 ? `+${d.delta}` : d.delta,
          " → ",
          d.quantity_after,
          " · ",
          d.reason,
          d.reference ? ` (${d.reference.type} #${d.reference.id})` : "",
          d.note ? ` · ${d.note}` : ""
        ] }),
        /* @__PURE__ */ a("span", { className: "cm:whitespace-nowrap cm:text-muted-foreground", children: [
          d.user ? `${d.user}, ` : "",
          new Date(d.at).toLocaleString()
        ] })
      ] }, d.id))
    ] }),
    /* @__PURE__ */ a(v, { children: [
      /* @__PURE__ */ e(m, { variant: "outline", type: "button", onClick: c, children: "Cancel" }),
      /* @__PURE__ */ e(m, { type: "submit", form: "adjust-stock", disabled: g.processing, children: "Save" })
    ] })
  ] }) });
}
function we(t) {
  const { DataTable: n } = M, [c, i] = C.useState(null);
  return L(), E.useBreadcrumbs([{ label: "Shop", href: S("commerce") }, { label: "Inventory" }]), /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(U, { title: "Inventory", description: "Stock of every product variant. Every change is recorded." }),
    /* @__PURE__ */ e(
      n,
      {
        ...t,
        searchPlaceholder: "Search products or SKUs…",
        onRowClick: t.can.adjust ? (l) => i(l) : void 0,
        renderCell: (l, r) => {
          if (r.key === "status") return /* @__PURE__ */ e(T, { tone: l.low ? "warning" : $e[l.status], children: l.low ? "Low" : l.status.replace(/_/g, " ") });
          if (r.key === "stock_quantity") return l.track_stock ? l.stock_quantity : /* @__PURE__ */ e("span", { className: "cm:text-muted-foreground", children: "—" });
        }
      }
    ),
    c && /* @__PURE__ */ e(Ce, { row: c, reasons: t.reasons, onClose: () => i(null) })
  ] });
}
const Se = { published: "ok", draft: "neutral", scheduled: "info", trashed: "error" };
function Fe(t) {
  const { DataTable: n } = M, { Button: c } = F, { Link: i } = j;
  return L(), E.useBreadcrumbs([{ label: "Shop", href: S("commerce") }, { label: "Products" }]), /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      U,
      {
        title: "Products",
        description: "Products are entries: opening one goes to the editor.",
        actions: /* @__PURE__ */ e(c, { asChild: !0, children: /* @__PURE__ */ e(i, { href: S(t.createUrl), children: "New product" }) })
      }
    ),
    /* @__PURE__ */ e(
      n,
      {
        ...t,
        searchPlaceholder: "Search titles or SKUs…",
        rowHref: (l) => S(l.href),
        renderCell: (l, r) => {
          switch (r.key) {
            case "product_title":
              return /* @__PURE__ */ a("span", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ e("span", { className: "cm:font-medium", children: l.product_title }),
                l.featured && /* @__PURE__ */ e(T, { tone: "info", children: "Featured" }),
                l.sync_failed && /* @__PURE__ */ e("span", { title: l.sync_error ?? "", children: /* @__PURE__ */ e(T, { tone: "error", children: "Can't be bought" }) })
              ] });
            case "state":
              return /* @__PURE__ */ e(T, { tone: Se[l.state], children: l.state });
            case "stock":
              return l.stock === null ? "—" : /* @__PURE__ */ e("span", { className: l.in_stock === !1 ? "cm:text-destructive" : "", children: l.stock });
            case "type":
              return /* @__PURE__ */ e(T, { children: l.type });
            default:
              return;
          }
        }
      }
    )
  ] });
}
function pe({ items: t, current: n, label: c = "Sections" }) {
  const { Link: i } = j;
  return /* @__PURE__ */ e("nav", { "aria-label": c, className: "cm:flex cm:gap-1 cm:overflow-x-auto cm:md:flex-col", children: t.map((l) => /* @__PURE__ */ e(
    i,
    {
      href: S(l.href),
      "aria-current": l.key === n ? "page" : void 0,
      className: Q(
        "cm:whitespace-nowrap cm:rounded-md cm:px-3 cm:py-1.5 cm:text-sm cm:text-muted-foreground cm:hover:bg-muted cm:hover:text-foreground",
        l.key === n && "cm:bg-muted cm:font-medium cm:text-foreground"
      ),
      children: l.label
    },
    l.key
  )) });
}
function te({ sections: t, current: n, title: c, description: i, children: l }) {
  const { SettingsTabs: r } = M;
  return L(), E.useBreadcrumbs([{ label: "Settings", href: S("settings") }, { label: "Store", href: S("commerce/settings") }, { label: c }]), /* @__PURE__ */ a("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(r, { current: "store" }),
    /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-6 cm:md:grid-cols-[12rem_1fr]", children: [
      /* @__PURE__ */ e(pe, { items: t, current: n, label: "Store settings" }),
      /* @__PURE__ */ a("div", { className: "cm:grid cm:min-w-0 cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ e(U, { title: c, description: i }),
        l
      ] })
    ] })
  ] });
}
function De({ sections: t, mode: n, groups: c, updateUrl: i }) {
  const { Card: l, CardContent: r, CardHeader: s, CardTitle: o, Switch: v, Button: m, Dialog: k, DialogContent: f, DialogDescription: g, DialogFooter: u, DialogHeader: p, DialogTitle: h } = F, { errors: d } = j.usePage().props, [b, w] = C.useState(null), [N, x] = C.useState(null), y = (D, $) => {
    x(D.key), j.router.put(i.replace("__key__", D.key), { on: $ }, { preserveScroll: !0, onFinish: () => x(null) });
  };
  return /* @__PURE__ */ a(
    te,
    {
      sections: t,
      current: "features",
      title: "Features",
      description: /* @__PURE__ */ a(V, { children: [
        "Switch store modules on or off. Selling mode: ",
        /* @__PURE__ */ e("strong", { children: n.label }),
        ". Switching off never deletes data."
      ] }),
      children: [
        d.feature && /* @__PURE__ */ e("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: d.feature }),
        c.map((D) => /* @__PURE__ */ a(l, { children: [
          /* @__PURE__ */ e(s, { children: /* @__PURE__ */ e(o, { children: D.label }) }),
          /* @__PURE__ */ e(r, { className: "cm:grid cm:gap-0 cm:divide-y cm:divide-border", children: D.features.map(($) => /* @__PURE__ */ a("div", { className: "cm:flex cm:items-start cm:justify-between cm:gap-4 cm:py-3 cm:first:pt-0 cm:last:pb-0", children: [
            /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ a("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ e("label", { htmlFor: `feature-${$.key}`, className: "cm:font-medium", children: $.label }),
                $.core && /* @__PURE__ */ e(T, { children: "Always on" }),
                $.switched_on && !$.active && /* @__PURE__ */ a(T, { tone: "warning", children: [
                  "Off — ",
                  $.reasons.join("; ").replace(/^Needs /, "needs ")
                ] }),
                $.essential && /* @__PURE__ */ a(T, { tone: "info", children: [
                  "Needed by ",
                  n.label
                ] })
              ] }),
              /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: $.description }),
              $.requires.length > 0 && /* @__PURE__ */ a("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                "Needs: ",
                $.requires.join(", ")
              ] })
            ] }),
            /* @__PURE__ */ e(
              v,
              {
                id: `feature-${$.key}`,
                checked: $.switched_on,
                disabled: $.core || N === $.key,
                onCheckedChange: (X) => !X && $.dependents.length > 0 ? w($) : y($, X)
              }
            )
          ] }, $.key)) })
        ] }, D.key)),
        /* @__PURE__ */ e(k, { open: b !== null, onOpenChange: (D) => !D && w(null), children: /* @__PURE__ */ a(f, { children: [
          /* @__PURE__ */ a(p, { children: [
            /* @__PURE__ */ a(h, { children: [
              "Switch off ",
              b?.label,
              "?"
            ] }),
            /* @__PURE__ */ a(g, { children: [
              "These are switched off with it: ",
              b?.dependents.map((D) => D.label).join(", "),
              ". Their data is kept."
            ] })
          ] }),
          /* @__PURE__ */ a(u, { children: [
            /* @__PURE__ */ e(m, { variant: "outline", onClick: () => w(null), children: "Cancel" }),
            /* @__PURE__ */ e(
              m,
              {
                variant: "destructive",
                onClick: () => {
                  b && y(b, !1), w(null);
                },
                children: "Switch off"
              }
            )
          ] })
        ] }) })
      ]
    }
  );
}
function ne({ form: t, footer: n }) {
  const { FieldRenderer: c } = M, { Button: i } = F, { data: l, setData: r, errors: s, processing: o, isDirty: v, ...m } = j.useForm({ values: t.values });
  return /* @__PURE__ */ a(
    "form",
    {
      className: "cm:grid cm:gap-6",
      onSubmit: (k) => {
        k.preventDefault(), m[t.method](t.action, { preserveScroll: !0 });
      },
      children: [
        s.section && /* @__PURE__ */ e("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: s.section }),
        /* @__PURE__ */ e(
          c,
          {
            fields: t.fields,
            values: l.values,
            errors: s,
            pathPrefix: "values",
            onChange: (k) => r("values", k)
          }
        ),
        /* @__PURE__ */ a("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
          /* @__PURE__ */ e(i, { type: "submit", disabled: o, children: t.submitLabel }),
          v && /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: "Unsaved changes" }),
          n
        ] })
      ]
    }
  );
}
function Te({ section: t, sections: n, form: c }) {
  return /* @__PURE__ */ e(te, { sections: n, current: t.key, title: `${t.label} settings`, children: /* @__PURE__ */ e(ne, { form: c }, t.key) });
}
function qe({ title: t, description: n, form: c, breadcrumbs: i = [], deleteUrl: l, deleteConfirm: r }) {
  const { Button: s } = F;
  return L(), E.useBreadcrumbs([...i.map((o) => ({ ...o, href: o.href ? S(o.href) : void 0 })), { label: t }]), /* @__PURE__ */ a("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-3xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(U, { title: t, description: n }),
    /* @__PURE__ */ e(ne, { form: c, footer: l ? /* @__PURE__ */ e(
      s,
      {
        type: "button",
        variant: "ghost",
        className: "cm:ml-auto cm:text-destructive",
        onClick: () => window.confirm(r ?? "Delete this?") && j.router.delete(S(l)),
        children: "Delete"
      }
    ) : null })
  ] });
}
function je(t) {
  const { DataTable: n } = M, { Button: c } = F, { Link: i } = j;
  return L(), E.useBreadcrumbs([{ label: "Shop", href: S("commerce") }, { label: t.title }]), /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      U,
      {
        title: t.title,
        description: t.description,
        actions: t.createUrl ? /* @__PURE__ */ e(c, { asChild: !0, children: /* @__PURE__ */ e(i, { href: S(t.createUrl), children: t.createLabel ?? "New" }) }) : null
      }
    ),
    /* @__PURE__ */ e(
      n,
      {
        ...t,
        bulkUrl: t.bulkUrl ? S(t.bulkUrl) : void 0,
        rowHref: (l) => l.href ? S(l.href) : null,
        renderCell: (l, r) => r.type === "badge" && l[r.key] != null ? /* @__PURE__ */ e(T, { tone: l[`${r.key}_tone`] ?? "neutral", children: String(l[r.key]) }) : void 0
      }
    )
  ] });
}
const Ie = {
  "Commerce/Customers/Show": Ne,
  "Commerce/Dashboard": _e,
  "Commerce/Inventory/Index": we,
  "Commerce/Products/Index": Fe,
  "Commerce/Settings/Section": Te,
  "Commerce/Settings/Features": De,
  "Commerce/Shared/SchemaForm": qe,
  "Commerce/Shared/ResourceIndex": je
};
function Be() {
  Object.entries(Ie).forEach(([t, n]) => E.registerPage(t, n));
}
function le(t) {
  if (!t) return "";
  const n = new Date(t);
  if (Number.isNaN(n.getTime())) return "";
  const c = (i) => String(i).padStart(2, "0");
  return `${n.getFullYear()}-${c(n.getMonth() + 1)}-${c(n.getDate())}T${c(n.getHours())}:${c(n.getMinutes())}`;
}
function ae(t) {
  return t ? new Date(t).toISOString() : null;
}
function Re({ value: t, onChange: n, pathPrefix: c }) {
  const { Input: i, Label: l } = F, r = { start: t?.start ?? null, end: t?.end ?? null };
  return /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(l, { htmlFor: `${c}-start`, children: "Starts" }),
      /* @__PURE__ */ e(
        i,
        {
          id: `${c}-start`,
          type: "datetime-local",
          value: le(r.start),
          onChange: (s) => n({ ...r, start: ae(s.target.value) })
        }
      )
    ] }),
    /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(l, { htmlFor: `${c}-end`, children: "Ends" }),
      /* @__PURE__ */ e(
        i,
        {
          id: `${c}-end`,
          type: "datetime-local",
          value: le(r.end),
          onChange: (s) => n({ ...r, end: ae(s.target.value) })
        }
      )
    ] })
  ] });
}
function ce({
  value: t,
  onChange: n,
  id: c,
  placeholder: i,
  allowNull: l = !0,
  invalid: r
}) {
  const { Input: s } = F, o = (g) => g == null ? "" : K(g).replace(/^[^\d-]+|[^\d]+$/g, ""), [v, m] = C.useState(o(t)), [k, f] = C.useState(!1);
  return C.useEffect(() => {
    k || m(o(t));
  }, [t, k]), /* @__PURE__ */ e(
    s,
    {
      id: c,
      inputMode: "decimal",
      value: v,
      placeholder: i,
      "aria-invalid": r || void 0,
      onFocus: () => f(!0),
      onChange: (g) => {
        m(g.target.value);
        const u = g.target.value.trim() === "" ? l ? null : 0 : me(g.target.value);
        (u !== null || g.target.value.trim() === "") && n(u);
      },
      onBlur: () => {
        f(!1), m(o(t));
      }
    }
  );
}
function Ee({ field: t, value: n, onChange: c, errors: i, pathPrefix: l }) {
  return L(), /* @__PURE__ */ e(
    ce,
    {
      id: l,
      value: n,
      onChange: c,
      allowNull: t.config?.allow_null !== !1,
      invalid: !!(l && i?.[l])
    }
  );
}
const ie = [
  { key: "province_code", label: "Province" },
  { key: "city_code", label: "City / regency" },
  { key: "district_code", label: "District" },
  { key: "village_code", label: "Village" }
], Le = { province: 1, city: 2, district: 3, village: 4 }, J = /* @__PURE__ */ new Map();
function Pe(t, n) {
  const c = n ? `${t}?parent=${encodeURIComponent(n)}` : t;
  return J.has(c) || J.set(c, O(c).then((i) => i.data).catch(() => (J.delete(c), []))), J.get(c);
}
const se = "cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm cm:disabled:opacity-50";
function Ae({ field: t, value: n, onChange: c, pathPrefix: i }) {
  const { Label: l } = F, r = t.config ?? {}, s = String(r.api ?? ""), o = Le[r.depth ?? "district"] ?? 3, v = r.country_options ?? [], m = { country: "ID", province_code: null, city_code: null, district_code: null, village_code: null, ...n ?? {} }, k = ie.slice(0, o), [f, g] = C.useState({}), u = [null, m.province_code, m.city_code, m.district_code];
  C.useEffect(() => {
    m.country !== "ID" || !s || k.forEach((h, d) => {
      const b = u[d];
      d > 0 && !b || Pe(s, b).then((w) => g((N) => ({ ...N, [h.key]: w })));
    });
  }, [s, m.country, m.province_code, m.city_code, m.district_code]);
  const p = (h, d) => {
    const b = { ...m };
    b[k[h].key] = d || null, ie.slice(h + 1).forEach((w) => {
      b[w.key] = null;
    }), c(b);
  };
  return /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    v.length > 0 && /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(l, { htmlFor: `${i}-country`, children: "Country" }),
      /* @__PURE__ */ e(
        "select",
        {
          id: `${i}-country`,
          className: se,
          value: m.country,
          onChange: (h) => c({ country: h.target.value, province_code: null, city_code: null, district_code: null, village_code: null }),
          children: v.map((h) => /* @__PURE__ */ e("option", { value: h.value, children: h.label }, h.value))
        }
      )
    ] }),
    m.country === "ID" && k.map((h, d) => /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(l, { htmlFor: `${i}-${h.key}`, children: h.label }),
      /* @__PURE__ */ a(
        "select",
        {
          id: `${i}-${h.key}`,
          className: se,
          value: m[h.key] ?? "",
          disabled: d > 0 && !u[d],
          onChange: (b) => p(d, b.target.value),
          children: [
            /* @__PURE__ */ e("option", { value: "", children: "Choose…" }),
            (f[h.key] ?? []).map((b) => /* @__PURE__ */ e("option", { value: b.code, children: b.name }, b.code))
          ]
        }
      )
    ] }, h.key))
  ] });
}
function Oe({ field: t, value: n, onChange: c, pathPrefix: i }) {
  const { Input: l, Badge: r } = F, s = t.config ?? {}, o = Array.isArray(n) ? n : [], [v, m] = C.useState(""), [k, f] = C.useState([]), [g, u] = C.useState(!1);
  C.useEffect(() => {
    if (!g) return;
    const d = new URLSearchParams({ q: v });
    (s.types ?? []).forEach((w) => d.append("types[]", w)), (s.taxonomies ?? []).forEach((w) => d.append("taxonomies[]", w));
    const b = setTimeout(() => O(`${s.api}?${d}`).then((w) => f(w.data)).catch(() => f([])), 200);
    return () => clearTimeout(b);
  }, [v, g]);
  const p = (d) => o.some((b) => b.type === d.type && b.id === d.id), h = { product: "Product", variant: "Variant", term: "Category/brand" };
  return /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-2", children: [
    o.length > 0 && /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: o.map((d) => /* @__PURE__ */ a(r, { variant: "secondary", className: "cm:gap-1", children: [
      /* @__PURE__ */ a("span", { className: "cm:text-muted-foreground", children: [
        h[d.type],
        ":"
      ] }),
      " ",
      d.label,
      /* @__PURE__ */ e("button", { type: "button", "aria-label": `Remove ${d.label}`, onClick: () => c(o.filter((b) => !(b.type === d.type && b.id === d.id))), children: "×" })
    ] }, `${d.type}:${d.id}`)) }),
    /* @__PURE__ */ a("div", { className: "cm:relative", children: [
      /* @__PURE__ */ e(
        l,
        {
          id: i,
          value: v,
          placeholder: "Search products, SKUs, categories, brands…",
          onFocus: () => u(!0),
          onBlur: () => setTimeout(() => u(!1), 150),
          onChange: (d) => m(d.target.value)
        }
      ),
      g && k.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-20 cm:mt-1 cm:max-h-72 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: k.map((d) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: p(d),
          className: "cm:flex cm:w-full cm:justify-between cm:gap-3 cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted cm:disabled:opacity-50",
          onMouseDown: (b) => b.preventDefault(),
          onClick: () => {
            c([...o, { type: d.type, id: d.id, label: d.label }]), m("");
          },
          children: [
            /* @__PURE__ */ e("span", { children: d.label }),
            /* @__PURE__ */ e("span", { className: "cm:text-xs cm:text-muted-foreground", children: d.group })
          ]
        }
      ) }, `${d.type}:${d.id}`)) })
    ] })
  ] });
}
function R() {
  return (globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`).replace(/-/g, "").slice(0, 32);
}
function oe(t) {
  return Object.keys(t).sort().map((n) => `${n}=${t[n]}`).join("|");
}
function Ue(t) {
  let n = [{}];
  for (const c of t) {
    if (c.values.length === 0) return [];
    const i = [];
    for (const l of n)
      for (const r of c.values)
        i.push({ ...l, [c.id]: r.id });
    n = i;
  }
  return t.length === 0 ? [] : n;
}
function Me(t, n, c, i = 100) {
  const l = new Map(n.map((r) => [oe(r.options), r]));
  return Ue(t).slice(0, i).map((r) => {
    const s = l.get(oe(r));
    return s ? { ...s, options: r } : { ...c, id: R(), sku: null, options: r, active: !0, price: c.price ?? 0 };
  });
}
function fe(t, n, c = {}) {
  return t.map((i) => {
    const l = i.values.find((r) => r.id === n.options[i.id]);
    return l ? l.label ?? (l.term_id ? c[l.term_id] ?? `#${l.term_id}` : "?") : "?";
  }).join(" / ");
}
function _({ label: t, hint: n, children: c, htmlFor: i, className: l }) {
  const { Label: r } = F;
  return /* @__PURE__ */ a("div", { className: Q("cm:grid cm:gap-1.5", l), children: [
    /* @__PURE__ */ e(r, { htmlFor: i, children: t }),
    c,
    n && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: n })
  ] });
}
function W({ children: t, cols: n = 3 }) {
  return /* @__PURE__ */ e("div", { className: Q("cm:grid cm:gap-4", { 2: "cm:sm:grid-cols-2", 3: "cm:sm:grid-cols-2 cm:lg:grid-cols-3", 4: "cm:sm:grid-cols-2 cm:lg:grid-cols-4" }[n]), children: t });
}
function q({ id: t, value: n, onChange: c, min: i = 0, placeholder: l }) {
  const { Input: r } = F;
  return /* @__PURE__ */ e(
    r,
    {
      id: t,
      type: "number",
      inputMode: "numeric",
      min: i,
      value: n ?? "",
      placeholder: l,
      onChange: (s) => c(s.target.value === "" ? null : Math.round(Number(s.target.value)))
    }
  );
}
function G({ id: t, value: n, onChange: c, placeholder: i, onBlur: l }) {
  const { Input: r } = F;
  return /* @__PURE__ */ e(
    r,
    {
      id: t,
      value: n ?? "",
      placeholder: i,
      onBlur: l,
      onChange: (s) => c(s.target.value === "" ? null : s.target.value)
    }
  );
}
function A({ id: t, value: n, onChange: c, nullable: i = !0 }) {
  return /* @__PURE__ */ e(ce, { id: t, value: n, allowNull: i, onChange: c });
}
function H({ id: t, label: n, checked: c, onChange: i, hint: l }) {
  const { Switch: r, Label: s } = F;
  return /* @__PURE__ */ a("div", { className: "cm:flex cm:items-start cm:gap-3", children: [
    /* @__PURE__ */ e(r, { id: t, checked: c, onCheckedChange: i }),
    /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-0.5", children: [
      /* @__PURE__ */ e(s, { htmlFor: t, children: n }),
      l && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: l })
    ] })
  ] });
}
const ze = "cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm";
function I({ id: t, value: n, onChange: c, options: i }) {
  return /* @__PURE__ */ e("select", { id: t, className: ze, value: n, onChange: (l) => c(l.target.value), children: i.map(([l, r]) => /* @__PURE__ */ e("option", { value: l, children: r }, l)) });
}
function B({ title: t, description: n, children: c, actions: i }) {
  return /* @__PURE__ */ a("section", { className: "cm:grid cm:gap-4", children: [
    /* @__PURE__ */ a("div", { className: "cm:flex cm:items-start cm:justify-between cm:gap-3", children: [
      /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-0.5", children: [
        /* @__PURE__ */ e("h3", { className: "cm:text-sm cm:font-semibold", children: t }),
        n && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: n })
      ] }),
      i
    ] }),
    c
  ] });
}
function He({ value: t, update: n, path: c }) {
  const { Button: i, Input: l } = F, r = t.bundle ?? { pricing: "fixed", value: 0, items: [] }, [s, o] = C.useState({}), [v, m] = C.useState(""), [k, f] = C.useState([]), g = r.items.map((h) => h.variant_id).filter((h) => !!h);
  C.useEffect(() => {
    const h = g.filter((d) => !s[d]);
    h.length !== 0 && O(S(`commerce/api/variants?${h.map((d) => `ids[]=${d}`).join("&")}`)).then((d) => o((b) => ({ ...b, ...Object.fromEntries(d.data.map((w) => [w.id, w])) }))).catch(() => {
    });
  }, [g.join(",")]), C.useEffect(() => {
    if (v.trim().length < 2) return f([]);
    const h = setTimeout(() => O(S(`commerce/api/variants?q=${encodeURIComponent(v)}`)).then((d) => f(d.data)).catch(() => {
    }), 250);
    return () => clearTimeout(h);
  }, [v]);
  const u = (h) => n({ bundle: { ...r, ...h } }), p = r.items.reduce((h, d) => h + (s[d.variant_id ?? 0]?.price ?? 0) * d.quantity, 0);
  return /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ a(B, { title: "Products in the bundle", description: "Bundles take their stock from these products.", children: [
      r.items.map((h, d) => /* @__PURE__ */ a("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ e("span", { className: "cm:flex-1 cm:text-sm", children: s[h.variant_id ?? 0]?.label ?? `#${h.variant_id}` }),
        /* @__PURE__ */ e("div", { className: "cm:w-24", children: /* @__PURE__ */ e(q, { min: 1, value: h.quantity, onChange: (b) => u({ items: r.items.map((w, N) => N === d ? { ...w, quantity: b ?? 1 } : w) }) }) }),
        /* @__PURE__ */ e(i, { type: "button", variant: "ghost", size: "sm", onClick: () => u({ items: r.items.filter((b, w) => w !== d) }), children: "Remove" })
      ] }, d)),
      /* @__PURE__ */ a("div", { className: "cm:relative", children: [
        /* @__PURE__ */ e(l, { value: v, placeholder: "Search products or SKUs to add…", "aria-label": "Add a product to the bundle", onChange: (h) => m(h.target.value) }),
        k.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-10 cm:mt-1 cm:max-h-64 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: k.map((h) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "cm:flex cm:w-full cm:justify-between cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted",
            onClick: () => {
              o((d) => ({ ...d, [h.id]: h })), u({ items: [...r.items, { variant_id: h.id, quantity: 1 }] }), m("");
            },
            children: [
              /* @__PURE__ */ a("span", { children: [
                h.label,
                h.sku && /* @__PURE__ */ a("span", { className: "cm:text-muted-foreground", children: [
                  " · ",
                  h.sku
                ] })
              ] }),
              /* @__PURE__ */ e("span", { children: K(h.price) })
            ]
          }
        ) }, h.id)) })
      ] })
    ] }),
    /* @__PURE__ */ e(B, { title: "Bundle price", description: `The products cost ${K(p)} together.`, children: /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(_, { label: "Price", htmlFor: `${c}-bundle-pricing`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${c}-bundle-pricing`,
          value: r.pricing,
          onChange: (h) => u({ pricing: h, value: 0 }),
          options: [["fixed", "Its own price (General tab)"], ["percent_off", "Total minus a percentage"], ["amount_off", "Total minus an amount"]]
        }
      ) }),
      r.pricing === "percent_off" && /* @__PURE__ */ e(_, { label: "Percent off", htmlFor: `${c}-bundle-value`, children: /* @__PURE__ */ e(q, { id: `${c}-bundle-value`, value: r.value / 100, onChange: (h) => u({ value: Math.round((h ?? 0) * 100) }) }) }),
      r.pricing === "amount_off" && /* @__PURE__ */ e(_, { label: "Amount off", htmlFor: `${c}-bundle-value`, children: /* @__PURE__ */ e(A, { id: `${c}-bundle-value`, value: r.value, nullable: !1, onChange: (h) => u({ value: h ?? 0 }) }) })
    ] }) })
  ] });
}
function Ke() {
  return decodeURIComponent(document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/)?.[1] ?? "");
}
function We({ value: t, update: n, path: c }) {
  const { Button: i } = F, [l, r] = C.useState(!1), s = C.useRef(null), o = t.delivery ?? { modes: ["link", "account"], download_limit: null, expiry_days: null }, v = (f) => n({ delivery: { ...o, ...f } }), m = (f, g) => n({ downloads: t.downloads.map((u, p) => p === f ? { ...u, ...g } : u) }), k = async (f) => {
    if (f?.length) {
      r(!0);
      try {
        const g = [];
        for (const u of Array.from(f)) {
          const p = new FormData();
          p.append("file", u);
          const h = await fetch(S("commerce/api/downloads"), { method: "POST", body: p, headers: { "X-XSRF-TOKEN": Ke(), Accept: "application/json" }, credentials: "same-origin" }), d = await h.json();
          if (!h.ok) throw new Error(d.message ?? "Upload failed");
          g.push({ id: R(), type: "file", file_id: d.data.id, url: null, name: u.name.replace(/\.[^.]+$/, ""), file: d.data });
        }
        n({ downloads: [...t.downloads, ...g] });
      } catch (g) {
        ke.error(g instanceof Error ? g.message : "Upload failed");
      } finally {
        r(!1), s.current && (s.current.value = "");
      }
    }
  };
  return /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ a(
      B,
      {
        title: "Files and links",
        description: "Files are stored privately and only served to customers who bought them.",
        actions: /* @__PURE__ */ a("div", { className: "cm:flex cm:gap-2", children: [
          /* @__PURE__ */ e(i, { type: "button", variant: "outline", size: "sm", disabled: l, onClick: () => s.current?.click(), children: l ? "Uploading…" : "Upload file" }),
          /* @__PURE__ */ e(i, { type: "button", variant: "outline", size: "sm", onClick: () => n({ downloads: [...t.downloads, { id: R(), type: "url", file_id: null, url: null, name: "" }] }), children: "Add link" }),
          /* @__PURE__ */ e("input", { ref: s, type: "file", multiple: !0, hidden: !0, onChange: (f) => k(f.target.files) })
        ] }),
        children: [
          t.downloads.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No files yet." }),
          t.downloads.map((f, g) => /* @__PURE__ */ a("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(_, { label: "Name", htmlFor: `${c}-dl-${g}`, children: /* @__PURE__ */ e(G, { id: `${c}-dl-${g}`, value: f.name, onChange: (u) => m(g, { name: u ?? "" }) }) }),
            f.type === "url" ? /* @__PURE__ */ e(_, { label: "Link", htmlFor: `${c}-dl-${g}-url`, children: /* @__PURE__ */ e(G, { id: `${c}-dl-${g}-url`, value: f.url, placeholder: "https://", onChange: (u) => m(g, { url: u }) }) }) : /* @__PURE__ */ e(_, { label: "File", children: /* @__PURE__ */ e("p", { className: "cm:truncate cm:text-sm cm:text-muted-foreground", children: f.file?.filename ?? `File #${f.file_id}` }) }),
            /* @__PURE__ */ e(i, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ downloads: t.downloads.filter((u, p) => p !== g) }), children: "Remove" })
          ] }, f.id ?? g))
        ]
      }
    ),
    /* @__PURE__ */ a(B, { title: "Delivery", children: [
      /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-3", children: [["attachment", "Attach files to the email"], ["link", "Download links in the email"], ["account", "Library in My Account"]].map(([f, g]) => /* @__PURE__ */ e(
        H,
        {
          id: `${c}-mode-${f}`,
          label: g,
          checked: o.modes.includes(f),
          onChange: (u) => v({ modes: u ? [...o.modes, f] : o.modes.filter((p) => p !== f) })
        },
        f
      )) }),
      /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
        /* @__PURE__ */ e(_, { label: "Downloads per file", htmlFor: `${c}-limit`, hint: "Empty: unlimited.", children: /* @__PURE__ */ e(q, { id: `${c}-limit`, min: 1, value: o.download_limit, onChange: (f) => v({ download_limit: f }) }) }),
        /* @__PURE__ */ e(_, { label: "Links expire after (days)", htmlFor: `${c}-expiry`, hint: "Empty: never.", children: /* @__PURE__ */ e(q, { id: `${c}-expiry`, min: 1, value: o.expiry_days, onChange: (f) => v({ expiry_days: f }) }) })
      ] })
    ] })
  ] });
}
function be({ id: t, value: n, onChange: c, entryId: i }) {
  const [l, r] = C.useState(null);
  return /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
    /* @__PURE__ */ e(G, { id: t, value: n, onChange: (o) => {
      r(null), c(o);
    }, onBlur: () => {
      if (!n) return r(null);
      const o = new URLSearchParams({ sku: n, entry: String(i ?? 0) });
      O(S(`commerce/api/sku-check?${o}`)).then((v) => r(v.available ? null : v.product ?? "another product")).catch(() => r(null));
    } }),
    l && /* @__PURE__ */ a("p", { className: "cm:text-xs cm:text-destructive", children: [
      "Already used by ",
      l,
      "."
    ] })
  ] });
}
const Ge = [
  ["default", "Follow the store (selling mode)"],
  ["cart", "Add to cart"],
  ["inquiry", "Inquiry form"],
  ["whatsapp", "Ask on WhatsApp"],
  ["external", "Links to other shops"],
  ["none", "No button (display only)"]
];
function Qe({ value: t, update: n, updateVariant: c, config: i, entryId: l, path: r }) {
  const { Button: s } = F, o = [["simple", "Simple product"]];
  (i.features.variants || t.type === "variable") && o.push(["variable", "Variable product (sizes, colors…)"]), (i.features.bundles || t.type === "bundle") && o.push(["bundle", "Bundle of other products"]);
  const v = t.variants[0];
  return /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ a(W, { cols: 2, children: [
      /* @__PURE__ */ e(_, { label: "Product type", htmlFor: `${r}-type`, children: /* @__PURE__ */ e(I, { id: `${r}-type`, value: t.type, options: o, onChange: (m) => n({ type: m }) }) }),
      /* @__PURE__ */ e(_, { label: "Button on the product page", htmlFor: `${r}-mode`, hint: "'Follow the store' uses the selling mode set in Settings → Store.", children: /* @__PURE__ */ e(I, { id: `${r}-mode`, value: t.purchase_mode, options: Ge, onChange: (m) => n({ purchase_mode: m }) }) })
    ] }),
    t.type !== "variable" && v && /* @__PURE__ */ e(B, { title: "Price", children: /* @__PURE__ */ a(W, { cols: 4, children: [
      /* @__PURE__ */ e(_, { label: "Price", htmlFor: `${r}-price`, children: /* @__PURE__ */ e(A, { id: `${r}-price`, value: v.price, nullable: !1, onChange: (m) => c(0, { price: m ?? 0 }) }) }),
      /* @__PURE__ */ e(_, { label: "Compare-at price", htmlFor: `${r}-compare`, hint: "Shown struck through when higher.", children: /* @__PURE__ */ e(A, { id: `${r}-compare`, value: v.compare_at_price, onChange: (m) => c(0, { compare_at_price: m }) }) }),
      /* @__PURE__ */ e(_, { label: "Cost", htmlFor: `${r}-cost`, hint: "For profit reports; never shown.", children: /* @__PURE__ */ e(A, { id: `${r}-cost`, value: v.cost, onChange: (m) => c(0, { cost: m }) }) }),
      /* @__PURE__ */ e(_, { label: "SKU", htmlFor: `${r}-sku`, children: /* @__PURE__ */ e(be, { id: `${r}-sku`, value: v.sku, entryId: l, onChange: (m) => c(0, { sku: m }) }) })
    ] }) }),
    (t.purchase_mode === "external" || t.external_links.length > 0) && /* @__PURE__ */ e(
      B,
      {
        title: "Links to other shops",
        description: "Buttons such as 'Buy on Tokopedia'.",
        actions: t.external_links.length < 10 && /* @__PURE__ */ e(s, { type: "button", variant: "outline", size: "sm", onClick: () => n({ external_links: [...t.external_links, { preset: "tokopedia", label: null, url: null }] }), children: "Add link" }),
        children: t.external_links.map((m, k) => {
          const f = (g) => n({ external_links: t.external_links.map((u, p) => p === k ? { ...u, ...g } : u) });
          return /* @__PURE__ */ a("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[10rem_1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(_, { label: "Shop", htmlFor: `${r}-link-${k}-preset`, children: /* @__PURE__ */ e(
              I,
              {
                id: `${r}-link-${k}-preset`,
                value: m.preset ?? "",
                onChange: (g) => f({ preset: g || null }),
                options: [...Object.entries(i.link_presets), ["", "Other…"]]
              }
            ) }),
            /* @__PURE__ */ e(_, { label: "Button label", htmlFor: `${r}-link-${k}-label`, children: /* @__PURE__ */ e(G, { id: `${r}-link-${k}-label`, value: m.label, placeholder: m.preset ? `Buy on ${i.link_presets[m.preset]}` : "", onChange: (g) => f({ label: g }) }) }),
            /* @__PURE__ */ e(_, { label: "Link", htmlFor: `${r}-link-${k}-url`, children: /* @__PURE__ */ e(G, { id: `${r}-link-${k}-url`, value: m.url, placeholder: "https://", onChange: (g) => f({ url: g }) }) }),
            /* @__PURE__ */ e(s, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ external_links: t.external_links.filter((g, u) => u !== k) }), children: "Remove" })
          ] }, k);
        })
      }
    ),
    /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(H, { id: `${r}-shipping`, label: "Needs shipping", checked: t.requires_shipping, onChange: (m) => n({ requires_shipping: m }), hint: "Off for services and digital products." }),
      (i.features.digital || t.downloadable) && /* @__PURE__ */ e(H, { id: `${r}-downloadable`, label: "Downloadable", checked: t.downloadable, onChange: (m) => n({ downloadable: m }), hint: "Customers get files or links after paying." }),
      /* @__PURE__ */ e(H, { id: `${r}-featured`, label: "Featured", checked: t.featured, onChange: (m) => n({ featured: m }), hint: "Shown first when sorting by featured." })
    ] }),
    i.features.taxes && /* @__PURE__ */ e(_, { label: "Tax class", htmlFor: `${r}-tax`, children: /* @__PURE__ */ e(
      I,
      {
        id: `${r}-tax`,
        value: t.tax_class ?? "",
        onChange: (m) => n({ tax_class: m || null }),
        options: [["", "Standard"], ...i.tax_classes.filter((m) => m !== "standard").map((m) => [m, m])]
      }
    ) })
  ] });
}
function Xe({ value: t, updateVariant: n, live: c, path: i }) {
  const l = t.variants[0];
  if (!l) return null;
  const r = c?.variants[l.id];
  return /* @__PURE__ */ a(B, { title: "Stock", children: [
    /* @__PURE__ */ e(
      H,
      {
        id: `${i}-track`,
        label: "Track stock",
        checked: l.track_stock,
        onChange: (s) => n(0, { track_stock: s }),
        hint: "Count units: orders take them, cancellations give them back."
      }
    ),
    l.track_stock ? /* @__PURE__ */ a(W, { cols: 3, children: [
      r?.track_stock && r.stock_quantity !== null ? /* @__PURE__ */ e(_, { label: "In stock", hint: "Change it in Shop → Inventory, so every change is recorded.", children: /* @__PURE__ */ e("p", { className: "cm:text-2xl cm:font-semibold", children: r.stock_quantity }) }) : /* @__PURE__ */ e(_, { label: "Starting stock", htmlFor: `${i}-initial`, hint: "Set once, when the product is published.", children: /* @__PURE__ */ e(q, { id: `${i}-initial`, value: l.initial_stock, onChange: (s) => n(0, { initial_stock: s }) }) }),
      /* @__PURE__ */ e(_, { label: "When sold out", htmlFor: `${i}-backorders`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${i}-backorders`,
          value: l.backorders,
          onChange: (s) => n(0, { backorders: s }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }),
      /* @__PURE__ */ e(_, { label: "Low stock at", htmlFor: `${i}-low`, hint: "Empty: the store's setting.", children: /* @__PURE__ */ e(q, { id: `${i}-low`, value: l.low_stock_threshold, onChange: (s) => n(0, { low_stock_threshold: s }) }) })
    ] }) : /* @__PURE__ */ e(_, { label: "Stock status", htmlFor: `${i}-status`, children: /* @__PURE__ */ e(
      I,
      {
        id: `${i}-status`,
        value: l.stock_status,
        onChange: (s) => n(0, { stock_status: s }),
        options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
      }
    ) })
  ] });
}
function Je({ value: t, update: n, path: c }) {
  const { Button: i } = F, l = (r, s) => n({ tiers: t.tiers.map((o, v) => v === r ? { ...o, ...s } : o) });
  return /* @__PURE__ */ a(
    B,
    {
      title: "Bulk prices",
      description: "Lower unit prices for larger quantities. The best matching tier applies.",
      actions: t.tiers.length < 20 && /* @__PURE__ */ e(
        i,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          onClick: () => n({ tiers: [...t.tiers, { min_qty: (t.tiers.at(-1)?.min_qty ?? 1) + 9, type: "percent_off", value: 500, variant: null }] }),
          children: "Add tier"
        }
      ),
      children: [
        t.tiers.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No bulk prices." }),
        t.tiers.map((r, s) => /* @__PURE__ */ a("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[8rem_12rem_1fr_1fr_auto]", children: [
          /* @__PURE__ */ e(_, { label: "From (units)", htmlFor: `${c}-tier-${s}-min`, children: /* @__PURE__ */ e(q, { id: `${c}-tier-${s}-min`, min: 2, value: r.min_qty, onChange: (o) => l(s, { min_qty: o ?? 2 }) }) }),
          /* @__PURE__ */ e(_, { label: "Price", htmlFor: `${c}-tier-${s}-type`, children: /* @__PURE__ */ e(
            I,
            {
              id: `${c}-tier-${s}-type`,
              value: r.type,
              onChange: (o) => l(s, { type: o, value: 0 }),
              options: [["percent_off", "Percent off"], ["amount_off", "Amount off per unit"], ["fixed_price", "Fixed unit price"]]
            }
          ) }),
          /* @__PURE__ */ e(_, { label: r.type === "percent_off" ? "Percent" : "Amount", htmlFor: `${c}-tier-${s}-value`, children: r.type === "percent_off" ? /* @__PURE__ */ e(q, { id: `${c}-tier-${s}-value`, value: r.value / 100, onChange: (o) => l(s, { value: Math.round((o ?? 0) * 100) }) }) : /* @__PURE__ */ e(A, { id: `${c}-tier-${s}-value`, value: r.value, nullable: !1, onChange: (o) => l(s, { value: o ?? 0 }) }) }),
          /* @__PURE__ */ e(_, { label: "For", htmlFor: `${c}-tier-${s}-variant`, children: /* @__PURE__ */ e(
            I,
            {
              id: `${c}-tier-${s}-variant`,
              value: r.variant ?? "",
              onChange: (o) => l(s, { variant: o || null }),
              options: [["", "All variants"], ...t.type === "variable" ? t.variants.map((o) => [o.id, fe(t.options, o)]) : []]
            }
          ) }),
          /* @__PURE__ */ e(i, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ tiers: t.tiers.filter((o, v) => v !== s) }), children: "Remove" })
        ] }, s))
      ]
    }
  );
}
function Ve({ value: t, update: n, updateVariant: c, path: i }) {
  const l = t.variants[0];
  if (!l) return null;
  const r = (s) => t.type === "variable" ? n({ variants: t.variants.map((o) => ({ ...o, ...s })) }) : c(0, s);
  return /* @__PURE__ */ e(B, { title: "Package", description: t.type === "variable" ? "Applies to every variant; a variant can have its own weight under More." : "Used for shipping rates.", children: /* @__PURE__ */ a(W, { cols: 4, children: [
    /* @__PURE__ */ e(_, { label: "Weight (grams)", htmlFor: `${i}-weight`, children: /* @__PURE__ */ e(q, { id: `${i}-weight`, value: l.weight, onChange: (s) => r({ weight: s }) }) }),
    /* @__PURE__ */ e(_, { label: "Length (mm)", htmlFor: `${i}-length`, children: /* @__PURE__ */ e(q, { id: `${i}-length`, value: l.length, onChange: (s) => r({ length: s }) }) }),
    /* @__PURE__ */ e(_, { label: "Width (mm)", htmlFor: `${i}-width`, children: /* @__PURE__ */ e(q, { id: `${i}-width`, value: l.width, onChange: (s) => r({ width: s }) }) }),
    /* @__PURE__ */ e(_, { label: "Height (mm)", htmlFor: `${i}-height`, children: /* @__PURE__ */ e(q, { id: `${i}-height`, value: l.height, onChange: (s) => r({ height: s }) }) })
  ] }) });
}
const Z = {
  options: {},
  sku: null,
  barcode: null,
  price: 0,
  compare_at_price: null,
  cost: null,
  weight: null,
  length: null,
  width: null,
  height: null,
  image: null,
  requires_shipping: null,
  downloadable: null,
  track_stock: !1,
  initial_stock: null,
  backorders: "no",
  low_stock_threshold: null,
  stock_status: "in_stock",
  min_qty: 1,
  max_qty: null,
  qty_step: 1,
  active: !0,
  downloads: []
};
function Ye(t) {
  const [n, c] = C.useState({}), i = t.filter((l) => !(l in n));
  return C.useEffect(() => {
    if (i.length === 0) return;
    const l = i.map((r) => `ids[]=${r}`).join("&");
    O(S(`api/terms?${l}`)).then((r) => c((s) => ({ ...s, ...Object.fromEntries(r.data.map((o) => [o.id, o.title])) }))).catch(() => {
    });
  }, [i.join(",")]), n;
}
function Ze({ option: t, onChange: n, onRemove: c, config: i, path: l }) {
  const { Button: r, Input: s, Badge: o } = F, { FieldRenderer: v } = M, [m, k] = C.useState(""), f = () => {
    const u = m.split(",").map((p) => p.trim()).filter(Boolean).filter((p) => !t.values.some((h) => (h.label ?? "").toLowerCase() === p.toLowerCase()));
    u.length && n({ ...t, values: [...t.values, ...u.map((p) => ({ id: R(), label: p }))] }), k("");
  }, g = t.values.map((u) => u.term_id).filter((u) => !!u);
  return /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-3 cm:rounded-md cm:border cm:p-3", children: [
    /* @__PURE__ */ a("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_1fr_auto]", children: [
      /* @__PURE__ */ e(_, { label: "Option name", htmlFor: `${l}-name`, children: /* @__PURE__ */ e(s, { id: `${l}-name`, value: t.name, placeholder: "Size", onChange: (u) => n({ ...t, name: u.target.value }) }) }),
      i.attribute_taxonomies.length > 0 ? /* @__PURE__ */ e(_, { label: "Values from", htmlFor: `${l}-source`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${l}-source`,
          value: t.taxonomy ?? "",
          onChange: (u) => n({ ...t, taxonomy: u || null, values: [] }),
          options: [["", "Custom values"], ...i.attribute_taxonomies.map((u) => [u.handle, u.title])]
        }
      ) }) : /* @__PURE__ */ e("div", {}),
      /* @__PURE__ */ e(r, { type: "button", variant: "ghost", size: "sm", onClick: c, children: "Remove option" })
    ] }),
    t.taxonomy ? /* @__PURE__ */ e(
      v,
      {
        fields: [{ handle: "terms", type: "terms", label: "Values", config: { taxonomy: t.taxonomy } }],
        values: { terms: g },
        pathPrefix: `${l}-terms`,
        onChange: (u) => {
          const p = u.terms ?? [], h = t.values.filter((b) => b.term_id && p.includes(b.term_id)), d = p.filter((b) => !h.some((w) => w.term_id === b)).map((b) => ({ id: R(), term_id: b }));
          n({ ...t, values: [...h, ...d] });
        }
      }
    ) : /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-2", children: [
      /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: t.values.map((u) => /* @__PURE__ */ a(o, { variant: "secondary", className: "cm:gap-1", children: [
        u.label,
        /* @__PURE__ */ e("button", { type: "button", "aria-label": `Remove ${u.label}`, onClick: () => n({ ...t, values: t.values.filter((p) => p.id !== u.id) }), children: "×" })
      ] }, u.id)) }),
      /* @__PURE__ */ a("div", { className: "cm:flex cm:gap-2", children: [
        /* @__PURE__ */ e(
          s,
          {
            value: m,
            placeholder: "S, M, L",
            "aria-label": `Add values to ${t.name || "option"}`,
            onChange: (u) => k(u.target.value),
            onKeyDown: (u) => {
              u.key === "Enter" && (u.preventDefault(), f());
            }
          }
        ),
        /* @__PURE__ */ e(r, { type: "button", variant: "outline", onClick: f, children: "Add" })
      ] })
    ] })
  ] });
}
function et({ variant: t, index: n, updateVariant: c, tab: i }) {
  const { FieldRenderer: l } = M, r = `${i.path}-v${n}`, s = i.live?.variants[t.id];
  return /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-4 cm:bg-muted/40 cm:p-4", children: [
    /* @__PURE__ */ a(W, { cols: 4, children: [
      /* @__PURE__ */ e(_, { label: "Cost", htmlFor: `${r}-cost`, children: /* @__PURE__ */ e(A, { id: `${r}-cost`, value: t.cost, onChange: (o) => c(n, { cost: o }) }) }),
      /* @__PURE__ */ e(_, { label: "Barcode", htmlFor: `${r}-barcode`, children: /* @__PURE__ */ e(G, { id: `${r}-barcode`, value: t.barcode, onChange: (o) => c(n, { barcode: o }) }) }),
      /* @__PURE__ */ e(_, { label: "Weight (g)", htmlFor: `${r}-weight`, children: /* @__PURE__ */ e(q, { id: `${r}-weight`, value: t.weight, onChange: (o) => c(n, { weight: o }), placeholder: "Product's" }) }),
      /* @__PURE__ */ e(_, { label: "Min / max / step", htmlFor: `${r}-min`, children: /* @__PURE__ */ a("div", { className: "cm:grid cm:grid-cols-3 cm:gap-1", children: [
        /* @__PURE__ */ e(q, { id: `${r}-min`, min: 1, value: t.min_qty, onChange: (o) => c(n, { min_qty: o ?? 1 }) }),
        /* @__PURE__ */ e(q, { min: 1, value: t.max_qty, onChange: (o) => c(n, { max_qty: o }), placeholder: "–" }),
        /* @__PURE__ */ e(q, { min: 1, value: t.qty_step, onChange: (o) => c(n, { qty_step: o ?? 1 }) })
      ] }) })
    ] }),
    i.config.features.inventory && /* @__PURE__ */ a(W, { cols: 4, children: [
      /* @__PURE__ */ e(H, { id: `${r}-track`, label: "Track stock", checked: t.track_stock, onChange: (o) => c(n, { track_stock: o }) }),
      t.track_stock && (s?.track_stock && s.stock_quantity !== null ? /* @__PURE__ */ e(_, { label: "In stock", children: /* @__PURE__ */ a("p", { className: "cm:text-sm", children: [
        s.stock_quantity,
        " ",
        /* @__PURE__ */ e("span", { className: "cm:text-muted-foreground", children: "(change it in Shop → Inventory)" })
      ] }) }) : /* @__PURE__ */ e(_, { label: "Starting stock", htmlFor: `${r}-initial`, children: /* @__PURE__ */ e(q, { id: `${r}-initial`, value: t.initial_stock, onChange: (o) => c(n, { initial_stock: o }) }) })),
      t.track_stock ? /* @__PURE__ */ e(_, { label: "When sold out", htmlFor: `${r}-backorders`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${r}-backorders`,
          value: t.backorders,
          onChange: (o) => c(n, { backorders: o }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }) : /* @__PURE__ */ e(_, { label: "Stock status", htmlFor: `${r}-status`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${r}-status`,
          value: t.stock_status,
          onChange: (o) => c(n, { stock_status: o }),
          options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
        }
      ) })
    ] }),
    /* @__PURE__ */ e(
      l,
      {
        fields: [{ handle: "image", type: "asset", label: "Image", config: { image_only: !0 } }],
        values: { image: t.image },
        pathPrefix: `${r}-image`,
        onChange: (o) => c(n, { image: o.image ?? null })
      }
    )
  ] });
}
function tt(t) {
  const { value: n, update: c, updateVariant: i, config: l, entryId: r, live: s } = t, { Button: o, Table: v, TableBody: m, TableCell: k, TableHead: f, TableHeader: g, TableRow: u, Switch: p } = F, [h, d] = C.useState(null), b = Ye(n.options.flatMap((x) => x.values.map((y) => y.term_id).filter((y) => !!y))), w = n.variants[0] ?? { ...Z, id: R() }, N = (x = n.options) => c({ options: x, variants: Me(x, n.variants, { ...w, initial_stock: null, image: null }, l.max_variants) });
  return /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ e(
      B,
      {
        title: "Options",
        description: `Up to ${l.max_options} options, such as size and color. Variants are made for every combination.`,
        actions: n.options.length < l.max_options && /* @__PURE__ */ e(o, { type: "button", variant: "outline", size: "sm", onClick: () => c({ options: [...n.options, { id: R(), name: "", taxonomy: null, values: [] }] }), children: "Add option" }),
        children: n.options.map((x, y) => /* @__PURE__ */ e(
          Ze,
          {
            option: x,
            config: l,
            path: `${t.path}-o${y}`,
            onChange: (D) => N(n.options.map(($, X) => X === y ? D : $)),
            onRemove: () => N(n.options.filter((D, $) => $ !== y))
          },
          x.id
        ))
      }
    ),
    /* @__PURE__ */ a(
      B,
      {
        title: `Variants (${n.variants.length})`,
        description: "Each has its own SKU, price and stock. Switch one off to stop selling it without losing it.",
        actions: /* @__PURE__ */ e(o, { type: "button", variant: "outline", size: "sm", onClick: () => N(), children: "Regenerate" }),
        children: [
          n.options.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "Add an option with values to create variants." }) : /* @__PURE__ */ e("div", { className: "cm:overflow-x-auto cm:rounded-md cm:border", children: /* @__PURE__ */ a(v, { children: [
            /* @__PURE__ */ e(g, { children: /* @__PURE__ */ a(u, { children: [
              /* @__PURE__ */ e(f, { children: "Variant" }),
              /* @__PURE__ */ e(f, { children: "SKU" }),
              /* @__PURE__ */ e(f, { children: "Price" }),
              /* @__PURE__ */ e(f, { children: "Compare-at" }),
              l.features.inventory && /* @__PURE__ */ e(f, { children: "Stock" }),
              /* @__PURE__ */ e(f, { children: "On sale" }),
              /* @__PURE__ */ e(f, {})
            ] }) }),
            /* @__PURE__ */ e(m, { children: n.variants.map((x, y) => {
              const D = s?.variants[x.id];
              return /* @__PURE__ */ a(C.Fragment, { children: [
                /* @__PURE__ */ a(u, { className: x.active ? "" : "cm:opacity-60", children: [
                  /* @__PURE__ */ e(k, { className: "cm:font-medium cm:whitespace-nowrap", children: fe(n.options, x, b) }),
                  /* @__PURE__ */ e(k, { className: "cm:min-w-36", children: /* @__PURE__ */ e(be, { value: x.sku, entryId: r, onChange: ($) => i(y, { sku: $ }) }) }),
                  /* @__PURE__ */ e(k, { className: "cm:min-w-32", children: /* @__PURE__ */ e(A, { value: x.price, nullable: !1, onChange: ($) => i(y, { price: $ ?? 0 }) }) }),
                  /* @__PURE__ */ e(k, { className: "cm:min-w-32", children: /* @__PURE__ */ e(A, { value: x.compare_at_price, onChange: ($) => i(y, { compare_at_price: $ }) }) }),
                  l.features.inventory && /* @__PURE__ */ e(k, { className: "cm:whitespace-nowrap cm:text-sm", children: x.track_stock ? D?.stock_quantity ?? x.initial_stock ?? 0 : /* @__PURE__ */ e(T, { children: x.stock_status.replace("_", " ") }) }),
                  /* @__PURE__ */ e(k, { children: /* @__PURE__ */ e(p, { checked: x.active, "aria-label": "Sell this variant", onCheckedChange: ($) => i(y, { active: $ }) }) }),
                  /* @__PURE__ */ e(k, { children: /* @__PURE__ */ e(o, { type: "button", variant: "ghost", size: "sm", "aria-expanded": h === x.id, onClick: () => d(h === x.id ? null : x.id), children: h === x.id ? "Close" : "More" }) })
                ] }),
                h === x.id && /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(k, { colSpan: 7, className: "cm:p-0", children: /* @__PURE__ */ e(et, { variant: x, index: y, updateVariant: i, tab: t }) }) })
              ] }, x.id);
            }) })
          ] }) }),
          n.variants.length > 0 && /* @__PURE__ */ a("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
            "Prices from ",
            K(Math.min(...n.variants.map((x) => x.price))),
            " to ",
            K(Math.max(...n.variants.map((x) => x.price))),
            "."
          ] })
        ]
      }
    )
  ] });
}
function nt(t) {
  const n = t ?? {}, c = (n.variants?.length ? n.variants : [{ ...Z, id: R() }]).map((i) => ({ ...Z, ...i, id: i.id ?? R() }));
  return {
    type: n.type ?? "simple",
    purchase_mode: n.purchase_mode ?? "default",
    external_links: n.external_links ?? [],
    requires_shipping: n.requires_shipping ?? !0,
    downloadable: n.downloadable ?? !1,
    featured: n.featured ?? !1,
    tax_class: n.tax_class ?? null,
    options: n.options ?? [],
    variants: c,
    bundle: n.bundle ?? null,
    downloads: n.downloads ?? [],
    delivery: n.delivery ?? null,
    tiers: n.tiers ?? []
  };
}
function ct({ field: t, value: n, onChange: c, errors: i, pathPrefix: l = "data.product" }) {
  L();
  const r = t.config ?? {}, s = nt(n), { props: o } = j.usePage(), v = o.entry?.id ?? null, [m, k] = C.useState(null);
  C.useEffect(() => {
    v && O(S(`commerce/api/products/${v}`)).then((N) => k(N.data)).catch(() => {
    });
  }, [v, o.entry]);
  const f = (N) => {
    const x = { ...s, ...N };
    N.type && N.type !== "variable" && (x.options = [], x.variants = [{ ...x.variants[0], options: {} }]), N.type === "bundle" && !x.bundle && (x.bundle = { pricing: "fixed", value: 0, items: [] }), c(x);
  }, g = (N, x) => f({ variants: s.variants.map((y, D) => D === N ? { ...y, ...x } : y) }), u = [{ key: "general", label: "General", render: (N) => /* @__PURE__ */ e(Qe, { ...N }) }];
  s.type === "variable" && u.push({ key: "variants", label: "Variants", render: (N) => /* @__PURE__ */ e(tt, { ...N }) }), s.type === "bundle" && u.push({ key: "bundle", label: "Bundle", render: (N) => /* @__PURE__ */ e(He, { ...N }) }), s.type !== "variable" && (r.features?.inventory ?? !0) && u.push({ key: "inventory", label: "Inventory", render: (N) => /* @__PURE__ */ e(Xe, { ...N }) }), s.requires_shipping && u.push({ key: "shipping", label: "Shipping", render: (N) => /* @__PURE__ */ e(Ve, { ...N }) }), (r.features?.pricing_rules !== !1 || s.tiers.length > 0) && u.push({ key: "pricing", label: "Bulk prices", render: (N) => /* @__PURE__ */ e(Je, { ...N }) }), s.downloadable && u.push({ key: "digital", label: "Digital", render: (N) => /* @__PURE__ */ e(We, { ...N }) });
  for (const [N, x] of Object.entries(z.productTabs()))
    u.push({ key: `ext-${N}`, label: x.label ?? N, render: (y) => /* @__PURE__ */ e(x, { ...y }) });
  const [p, h] = C.useState("general"), d = u.find((N) => N.key === p) ?? u[0], b = i?.[l], w = { value: s, update: f, updateVariant: g, config: r, live: m, entryId: v, path: l.replace(/\W+/g, "-") };
  return /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-4 cm:rounded-lg cm:border cm:p-4", children: [
    m?.sync_status === "failed" && /* @__PURE__ */ a("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: [
      "The published version couldn't be applied to the store, so it can't be bought: ",
      m.sync_error,
      ". Fix it and publish again."
    ] }),
    b && /* @__PURE__ */ e("p", { role: "alert", className: "cm:text-sm cm:text-destructive", children: b }),
    /* @__PURE__ */ e("div", { role: "tablist", "aria-label": "Product data", className: "cm:flex cm:flex-wrap cm:gap-1 cm:border-b", children: u.map((N) => /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": N.key === d.key,
        onClick: () => h(N.key),
        className: Q("cm:-mb-px cm:border-b-2 cm:px-3 cm:py-2 cm:text-sm", N.key === d.key ? "cm:border-primary cm:font-medium" : "cm:border-transparent cm:text-muted-foreground cm:hover:text-foreground"),
        children: N.label
      },
      N.key
    )) }),
    /* @__PURE__ */ e("div", { role: "tabpanel", children: d.render(w) })
  ] });
}
const rt = {
  commerce_money: Ee,
  commerce_datetime_range: Re,
  commerce_region: Ae,
  commerce_targets: Oe,
  commerce_product: ct
};
function lt() {
  Object.entries(rt).forEach(([t, n]) => E.registerField(t, n));
}
function at() {
  Object.assign(z.components, { EmptyState: ge, MoneyInput: ce, PageHeader: U, SchemaFormView: ne, SectionNav: pe, SettingsLayout: te, StatusBadge: T });
}
ye();
at();
lt();
Be();
