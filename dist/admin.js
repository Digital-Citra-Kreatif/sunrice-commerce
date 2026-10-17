const me = { symbol: "Rp", position: "left", space: !1, thousands: ".", decimal: ",", decimals: 0 };
let te = me;
function ve(t) {
  te = { ...me, ...t ?? {} };
}
function K(t, n = te) {
  const c = t < 0, a = Math.abs(Math.round(t)), i = 10 ** n.decimals, r = Math.floor(a / i).toString().replace(/\B(?=(\d{3})+(?!\d))/g, n.thousands), s = n.decimals > 0 ? n.decimal + String(a % i).padStart(n.decimals, "0") : "", o = r + s, y = n.space ? " " : "", m = n.position === "left" ? `${n.symbol}${y}${o}` : `${o}${y}${n.symbol}`;
  return c ? `-${m}` : m;
}
function ue(t, n = te) {
  let c = t.replace(n.symbol, "").replace(/\s/g, "");
  const a = c.startsWith("-");
  c = c.replace(/^-/, "").split(n.thousands).join("");
  const [i, r = ""] = c.split(n.decimal);
  if (!/^\d*$/.test(i) || !/^\d*$/.test(r) || i + r === "")
    return null;
  const s = Number(i || "0") * 10 ** n.decimals + Number(r.padEnd(n.decimals, "0").slice(0, n.decimals) || "0");
  return a ? -s : s;
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
  parseMoney: ue,
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
      } catch (a) {
        console.error("SunriceCommerceQueue call failed", a);
      }
    }
  })(), t.push = ((...c) => (c.forEach((a) => a(z)), t.length)), window.SunriceCommerceQueue = t;
}
const E = window.Sunrice, { React: S, ui: F, components: U, inertia: j, adminUrl: w, fetchJson: O, toast: ke } = E, he = window.Sunrice.React, J = he.Fragment;
function e(t, n, c) {
  return he.createElement(t, c === void 0 ? n : { ...n, key: c });
}
const l = e;
function M({ title: t, description: n, actions: c }) {
  const { Head: a } = j;
  return /* @__PURE__ */ l("div", { className: "cm:flex cm:flex-wrap cm:items-start cm:justify-between cm:gap-4", children: [
    /* @__PURE__ */ e(a, { title: t }),
    /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e("h1", { className: "cm:text-xl cm:font-semibold cm:tracking-tight", children: t }),
      n && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: n })
    ] }),
    c && /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: c })
  ] });
}
function ge(t) {
  var n, c, a = "";
  if (typeof t == "string" || typeof t == "number") a += t;
  else if (typeof t == "object") if (Array.isArray(t)) {
    var i = t.length;
    for (n = 0; n < i; n++) t[n] && (c = ge(t[n])) && (a && (a += " "), a += c);
  } else for (c in t) t[c] && (a && (a += " "), a += c);
  return a;
}
function xe() {
  for (var t, n, c = 0, a = "", i = arguments.length; c < i; c++) (t = arguments[c]) && (n = ge(t)) && (a && (a += " "), a += n);
  return a;
}
function Q(...t) {
  return xe(t);
}
const le = {
  ok: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  success: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  warning: "cm:bg-amber-500/10 cm:text-amber-700 cm:dark:text-amber-400",
  error: "cm:bg-red-500/10 cm:text-red-700 cm:dark:text-red-400",
  info: "cm:bg-sky-500/10 cm:text-sky-700 cm:dark:text-sky-400",
  neutral: "cm:bg-muted cm:text-muted-foreground"
};
function T({ tone: t = "neutral", children: n }) {
  return /* @__PURE__ */ e("span", { className: Q("cm:inline-flex cm:items-center cm:rounded-full cm:px-2 cm:py-0.5 cm:text-xs cm:font-medium", le[t] ?? le.neutral), children: n });
}
function L() {
  const { props: t } = j.usePage(), n = t.commerce ?? {};
  return ve(n.currency), n;
}
const Z = (t) => t ? new Date(t).toLocaleDateString(void 0, { dateStyle: "medium" }) : "—";
function Ne({ customer: t, account: n, roleOptions: c, orders: a, can: i }) {
  const { Card: r, CardContent: s, CardHeader: o, CardTitle: y, Button: m, Input: x, Label: b, Textarea: p, Switch: u, Checkbox: f } = F, { Link: g, router: d } = j;
  L(), E.useBreadcrumbs([{ label: "Shop", href: w("commerce") }, { label: "Customers", href: w("commerce/customers") }, { label: t.name ?? t.email }]);
  const h = j.useForm({ name: t.name ?? "", phone: t.phone ?? "", note: t.note ?? "", accepts_marketing: t.accepts_marketing, roles: n?.roles ?? [] }), [C, v] = S.useState(!1), N = (k) => d.post(w(`commerce/customers/${t.id}/${k}`), {}, { preserveScroll: !0 });
  return /* @__PURE__ */ l("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-5xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      M,
      {
        title: t.name ?? t.email,
        description: /* @__PURE__ */ l(J, { children: [
          t.email,
          t.phone ? ` · ${t.phone}` : ""
        ] }),
        actions: /* @__PURE__ */ l(J, { children: [
          t.deletion_requested_at && /* @__PURE__ */ l(T, { tone: "warning", children: [
            "Deletion requested ",
            Z(t.deletion_requested_at)
          ] }),
          n ? /* @__PURE__ */ e(T, { tone: "ok", children: "Registered" }) : /* @__PURE__ */ e(T, { children: "Guest" })
        ] })
      }
    ),
    /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-3", children: [["Orders", String(t.orders_count)], ["Spent", t.total_spent], ["Last order", Z(t.last_order_at)]].map(([k, D]) => /* @__PURE__ */ e(r, { children: /* @__PURE__ */ l(s, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
      /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: k }),
      /* @__PURE__ */ e("span", { className: "cm:text-xl cm:font-semibold", children: D })
    ] }) }, k)) }),
    /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[2fr_1fr]", children: [
      /* @__PURE__ */ l("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ l(r, { children: [
          /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(y, { children: "Orders" }) }),
          /* @__PURE__ */ e(s, { children: a.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No orders yet." }) : /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1", children: a.map((k) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ l(g, { href: w(k.href), className: "cm:flex cm:justify-between cm:rounded cm:p-2 cm:hover:bg-muted", children: [
            /* @__PURE__ */ l("span", { children: [
              k.number,
              " · ",
              Z(k.date)
            ] }),
            /* @__PURE__ */ l("span", { children: [
              /* @__PURE__ */ e(T, { children: k.status }),
              " ",
              k.total
            ] })
          ] }) }, k.id)) }) })
        ] }),
        /* @__PURE__ */ l(r, { children: [
          /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(y, { children: "Addresses" }) }),
          /* @__PURE__ */ e(s, { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: t.addresses.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No saved addresses." }) : t.addresses.map((k) => /* @__PURE__ */ l("div", { className: "cm:rounded-md cm:border cm:p-3 cm:text-sm", children: [
            k.label && /* @__PURE__ */ e("p", { className: "cm:font-medium", children: k.label }),
            /* @__PURE__ */ e("p", { className: "cm:whitespace-pre-line", children: k.text }),
            /* @__PURE__ */ l("div", { className: "cm:mt-1 cm:flex cm:gap-1", children: [
              k.default_shipping && /* @__PURE__ */ e(T, { children: "Shipping" }),
              k.default_billing && /* @__PURE__ */ e(T, { children: "Billing" })
            ] })
          ] }, k.id)) })
        ] })
      ] }),
      /* @__PURE__ */ l("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ l(r, { children: [
          /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(y, { children: "Details" }) }),
          /* @__PURE__ */ e(s, { children: /* @__PURE__ */ l("form", { className: "cm:grid cm:gap-3", onSubmit: (k) => {
            k.preventDefault(), h.put(w(`commerce/customers/${t.id}`), { preserveScroll: !0 });
          }, children: [
            /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(b, { htmlFor: "c-name", children: "Name" }),
              /* @__PURE__ */ e(x, { id: "c-name", disabled: !i.edit, value: h.data.name, onChange: (k) => h.setData("name", k.target.value) })
            ] }),
            /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(b, { htmlFor: "c-phone", children: "Phone" }),
              /* @__PURE__ */ e(x, { id: "c-phone", disabled: !i.edit, value: h.data.phone, onChange: (k) => h.setData("phone", k.target.value) })
            ] }),
            /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(b, { htmlFor: "c-note", children: "Note (staff only)" }),
              /* @__PURE__ */ e(p, { id: "c-note", disabled: !i.edit, value: h.data.note, onChange: (k) => h.setData("note", k.target.value) })
            ] }),
            /* @__PURE__ */ l("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e(u, { id: "c-marketing", disabled: !i.edit, checked: h.data.accepts_marketing, onCheckedChange: (k) => h.setData("accepts_marketing", k) }),
              /* @__PURE__ */ e(b, { htmlFor: "c-marketing", children: "Accepts marketing" })
            ] }),
            n && /* @__PURE__ */ l("fieldset", { className: "cm:grid cm:gap-1.5", children: [
              /* @__PURE__ */ e("legend", { className: "cm:mb-1 cm:text-sm cm:font-medium", children: "Roles" }),
              c.map((k) => /* @__PURE__ */ l("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
                /* @__PURE__ */ e(
                  f,
                  {
                    disabled: !i.edit,
                    checked: h.data.roles.includes(k),
                    onCheckedChange: (D) => h.setData("roles", D ? [...h.data.roles, k] : h.data.roles.filter(($) => $ !== k))
                  }
                ),
                k
              ] }, k))
            ] }),
            i.edit && /* @__PURE__ */ e(m, { type: "submit", disabled: h.processing, children: "Save" })
          ] }) })
        ] }),
        n && /* @__PURE__ */ l(r, { children: [
          /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(y, { children: "Account" }) }),
          /* @__PURE__ */ l(s, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            /* @__PURE__ */ l("p", { children: [
              "Email ",
              n.email_verified ? "verified" : "not verified"
            ] }),
            n.google && /* @__PURE__ */ l("p", { children: [
              "Google: ",
              n.google
            ] }),
            i.edit && /* @__PURE__ */ e(m, { variant: "outline", size: "sm", onClick: () => N("password-reset"), children: "Send a password reset link" }),
            i.edit && !n.email_verified && /* @__PURE__ */ e(m, { variant: "outline", size: "sm", onClick: () => N("verify"), children: "Mark email verified" })
          ] })
        ] }),
        i.delete && !t.anonymized && /* @__PURE__ */ l(r, { children: [
          /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(y, { children: "Remove personal data" }) }),
          /* @__PURE__ */ l(s, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "Name, email, phone and addresses are deleted; orders keep their amounts." }),
            C ? /* @__PURE__ */ l("div", { className: "cm:flex cm:gap-2", children: [
              /* @__PURE__ */ e(m, { variant: "destructive", size: "sm", onClick: () => N("anonymize"), children: "Remove for good" }),
              /* @__PURE__ */ e(m, { variant: "outline", size: "sm", onClick: () => v(!1), children: "Cancel" })
            ] }) : /* @__PURE__ */ e(m, { variant: "outline", size: "sm", onClick: () => v(!0), children: "Anonymize" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function ne({ title: t, description: n, action: c }) {
  return /* @__PURE__ */ l("div", { className: "cm:flex cm:flex-col cm:items-center cm:gap-2 cm:rounded-lg cm:border cm:border-dashed cm:px-6 cm:py-10 cm:text-center", children: [
    /* @__PURE__ */ e("p", { className: "cm:font-medium", children: t }),
    n && /* @__PURE__ */ e("p", { className: "cm:max-w-md cm:text-sm cm:text-muted-foreground", children: n }),
    c && /* @__PURE__ */ e("div", { className: "cm:mt-2", children: c })
  ] });
}
function _e({ mode: t, setup: n, health: c, kpis: a, todo: i }) {
  const { Card: r, CardContent: s, CardHeader: o, CardTitle: y, CardDescription: m } = F, { Link: x } = j;
  L();
  const b = n.filter((f) => !f.done), p = c.filter((f) => f.status !== "ok"), u = Object.entries(z.dashboardWidgets());
  return /* @__PURE__ */ l("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(M, { title: "Store", description: /* @__PURE__ */ l(J, { children: [
      "Selling mode: ",
      t.label
    ] }) }),
    b.length > 0 && /* @__PURE__ */ l(r, { children: [
      /* @__PURE__ */ l(o, { children: [
        /* @__PURE__ */ e(y, { children: "Set up your store" }),
        /* @__PURE__ */ l(m, { children: [
          n.length - b.length,
          " of ",
          n.length,
          " done"
        ] })
      ] }),
      /* @__PURE__ */ e(s, { className: "cm:grid cm:gap-2", children: n.map((f) => /* @__PURE__ */ l(x, { href: w(f.href), className: "cm:flex cm:items-start cm:gap-3 cm:rounded-md cm:p-2 cm:hover:bg-muted", children: [
        /* @__PURE__ */ e("span", { "aria-hidden": !0, className: f.done ? "cm:text-emerald-600" : "cm:text-muted-foreground", children: f.done ? "✓" : "○" }),
        /* @__PURE__ */ l("span", { className: "cm:grid", children: [
          /* @__PURE__ */ e("span", { className: f.done ? "cm:text-muted-foreground cm:line-through" : "cm:font-medium", children: f.label }),
          f.description && /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: f.description })
        ] })
      ] }, f.key)) })
    ] }),
    p.length > 0 && /* @__PURE__ */ l(r, { children: [
      /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(y, { children: "Needs attention" }) }),
      /* @__PURE__ */ e(s, { className: "cm:grid cm:gap-3", children: p.map((f) => /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ l("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
          /* @__PURE__ */ e(T, { tone: f.status, children: f.status === "error" ? "Problem" : "Warning" }),
          /* @__PURE__ */ e("span", { className: "cm:font-medium", children: f.label })
        ] }),
        /* @__PURE__ */ e("p", { className: "cm:text-sm", children: f.message }),
        f.fix && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: f.fix })
      ] }, f.key)) })
    ] }),
    /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2 cm:lg:grid-cols-4", children: a === void 0 ? [0, 1, 2, 3].map((f) => /* @__PURE__ */ e("div", { className: "cm:h-24 cm:animate-pulse cm:rounded-lg cm:bg-muted" }, f)) : a.map((f) => /* @__PURE__ */ e(r, { children: /* @__PURE__ */ l(s, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
      /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: f.label }),
      /* @__PURE__ */ e("span", { className: "cm:text-2xl cm:font-semibold", children: f.value }),
      f.hint && /* @__PURE__ */ e("span", { className: "cm:text-xs cm:text-muted-foreground", children: f.hint })
    ] }) }, f.key)) }),
    /* @__PURE__ */ l(r, { children: [
      /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(y, { children: "To do" }) }),
      /* @__PURE__ */ e(s, { children: i === void 0 ? /* @__PURE__ */ e("div", { className: "cm:h-16 cm:animate-pulse cm:rounded-md cm:bg-muted" }) : i.length === 0 ? /* @__PURE__ */ e(ne, { title: "Nothing to do", description: "Orders to process and payments to verify show up here." }) : /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1", children: i.map((f) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ l(x, { href: w(f.href), className: "cm:flex cm:justify-between cm:rounded-md cm:p-2 cm:hover:bg-muted", children: [
        /* @__PURE__ */ e("span", { children: f.label }),
        /* @__PURE__ */ e("span", { className: "cm:font-semibold", children: f.count })
      ] }) }, f.key)) }) })
    ] }),
    u.map(([f, g]) => /* @__PURE__ */ e(g, {}, f))
  ] });
}
const Ce = { in_stock: "ok", out_of_stock: "error", backorder: "warning" };
function $e({ row: t, reasons: n, onClose: c }) {
  const { Dialog: a, DialogContent: i, DialogHeader: r, DialogTitle: s, DialogDescription: o, DialogFooter: y, Button: m, Input: x, Label: b } = F, p = j.useForm({ mode: "add", quantity: 0, reason: "manual", note: "" }), [u, f] = S.useState(null);
  S.useEffect(() => {
    O(w(`commerce/inventory/${t.id}/history`)).then((d) => f(d.data)).catch(() => f([]));
  }, [t.id]);
  const g = p.data.mode === "set" ? p.data.quantity : (t.stock_quantity ?? 0) + p.data.quantity;
  return /* @__PURE__ */ e(a, { open: !0, onOpenChange: (d) => !d && c(), children: /* @__PURE__ */ l(i, { className: "cm:max-w-lg", children: [
    /* @__PURE__ */ l(r, { children: [
      /* @__PURE__ */ e(s, { children: "Adjust stock" }),
      /* @__PURE__ */ l(o, { children: [
        t.product_title,
        t.sku ? ` · ${t.sku}` : "",
        ". Now: ",
        t.track_stock ? t.stock_quantity ?? 0 : "not tracked",
        "."
      ] })
    ] }),
    /* @__PURE__ */ l("form", { id: "adjust-stock", className: "cm:grid cm:gap-3", onSubmit: (d) => {
      d.preventDefault(), p.post(w(`commerce/inventory/${t.id}/adjust`), { preserveScroll: !0, onSuccess: c });
    }, children: [
      /* @__PURE__ */ l("div", { className: "cm:grid cm:grid-cols-2 cm:gap-3", children: [
        /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(b, { htmlFor: "adjust-mode", children: "Change" }),
          /* @__PURE__ */ l("select", { id: "adjust-mode", className: "cm:h-9 cm:rounded-md cm:border cm:bg-background cm:px-3 cm:text-sm", value: p.data.mode, onChange: (d) => p.setData("mode", d.target.value), children: [
            /* @__PURE__ */ e("option", { value: "add", children: "Add or remove" }),
            /* @__PURE__ */ e("option", { value: "set", children: "Set to" })
          ] })
        ] }),
        /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(b, { htmlFor: "adjust-quantity", children: p.data.mode === "set" ? "New stock" : "Units (+/−)" }),
          /* @__PURE__ */ e(x, { id: "adjust-quantity", type: "number", value: p.data.quantity, onChange: (d) => p.setData("quantity", Number(d.target.value)) }),
          p.errors.quantity && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-destructive", children: p.errors.quantity })
        ] })
      ] }),
      /* @__PURE__ */ l("div", { className: "cm:grid cm:grid-cols-2 cm:gap-3", children: [
        /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(b, { htmlFor: "adjust-reason", children: "Reason" }),
          /* @__PURE__ */ e("select", { id: "adjust-reason", className: "cm:h-9 cm:rounded-md cm:border cm:bg-background cm:px-3 cm:text-sm", value: p.data.reason, onChange: (d) => p.setData("reason", d.target.value), children: n.map((d) => /* @__PURE__ */ e("option", { value: d, children: d[0].toUpperCase() + d.slice(1) }, d)) })
        ] }),
        /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(b, { htmlFor: "adjust-note", children: "Note" }),
          /* @__PURE__ */ e(x, { id: "adjust-note", value: p.data.note, onChange: (d) => p.setData("note", d.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ l("p", { className: "cm:text-sm", children: [
        "Stock after: ",
        /* @__PURE__ */ e("strong", { children: g })
      ] })
    ] }),
    /* @__PURE__ */ l("div", { className: "cm:grid cm:max-h-56 cm:gap-1 cm:overflow-auto cm:border-t cm:pt-3 cm:text-sm", children: [
      /* @__PURE__ */ e("p", { className: "cm:font-medium", children: "History" }),
      u === null ? /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "Loading…" }) : u.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "No changes yet." }) : u.map((d) => /* @__PURE__ */ l("div", { className: "cm:flex cm:justify-between cm:gap-3", children: [
        /* @__PURE__ */ l("span", { children: [
          d.delta > 0 ? `+${d.delta}` : d.delta,
          " → ",
          d.quantity_after,
          " · ",
          d.reason,
          d.reference ? ` (${d.reference.type} #${d.reference.id})` : "",
          d.note ? ` · ${d.note}` : ""
        ] }),
        /* @__PURE__ */ l("span", { className: "cm:whitespace-nowrap cm:text-muted-foreground", children: [
          d.user ? `${d.user}, ` : "",
          new Date(d.at).toLocaleString()
        ] })
      ] }, d.id))
    ] }),
    /* @__PURE__ */ l(y, { children: [
      /* @__PURE__ */ e(m, { variant: "outline", type: "button", onClick: c, children: "Cancel" }),
      /* @__PURE__ */ e(m, { type: "submit", form: "adjust-stock", disabled: p.processing, children: "Save" })
    ] })
  ] }) });
}
function we(t) {
  const { DataTable: n } = U, [c, a] = S.useState(null);
  return L(), E.useBreadcrumbs([{ label: "Shop", href: w("commerce") }, { label: "Inventory" }]), /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(M, { title: "Inventory", description: "Stock of every product variant. Every change is recorded." }),
    /* @__PURE__ */ e(
      n,
      {
        ...t,
        searchPlaceholder: "Search products or SKUs…",
        onRowClick: t.can.adjust ? (i) => a(i) : void 0,
        renderCell: (i, r) => {
          if (r.key === "status") return /* @__PURE__ */ e(T, { tone: i.low ? "warning" : Ce[i.status], children: i.low ? "Low" : i.status.replace(/_/g, " ") });
          if (r.key === "stock_quantity") return i.track_stock ? i.stock_quantity : /* @__PURE__ */ e("span", { className: "cm:text-muted-foreground", children: "—" });
        }
      }
    ),
    c && /* @__PURE__ */ e($e, { row: c, reasons: t.reasons, onClose: () => a(null) })
  ] });
}
const Se = { published: "ok", draft: "neutral", scheduled: "info", trashed: "error" };
function Fe(t) {
  const { DataTable: n } = U, { Button: c } = F, { Link: a } = j;
  return L(), E.useBreadcrumbs([{ label: "Shop", href: w("commerce") }, { label: "Products" }]), /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      M,
      {
        title: "Products",
        description: "Products are entries: opening one goes to the editor.",
        actions: /* @__PURE__ */ e(c, { asChild: !0, children: /* @__PURE__ */ e(a, { href: w(t.createUrl), children: "New product" }) })
      }
    ),
    /* @__PURE__ */ e(
      n,
      {
        ...t,
        searchPlaceholder: "Search titles or SKUs…",
        rowHref: (i) => w(i.href),
        renderCell: (i, r) => {
          switch (r.key) {
            case "product_title":
              return /* @__PURE__ */ l("span", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ e("span", { className: "cm:font-medium", children: i.product_title }),
                i.featured && /* @__PURE__ */ e(T, { tone: "info", children: "Featured" }),
                i.sync_failed && /* @__PURE__ */ e("span", { title: i.sync_error ?? "", children: /* @__PURE__ */ e(T, { tone: "error", children: "Can't be bought" }) })
              ] });
            case "state":
              return /* @__PURE__ */ e(T, { tone: Se[i.state], children: i.state });
            case "stock":
              return i.stock === null ? "—" : /* @__PURE__ */ e("span", { className: i.in_stock === !1 ? "cm:text-destructive" : "", children: i.stock });
            case "type":
              return /* @__PURE__ */ e(T, { children: i.type });
            default:
              return;
          }
        }
      }
    )
  ] });
}
function pe({ items: t, current: n, label: c = "Sections" }) {
  const { Link: a } = j;
  return /* @__PURE__ */ e("nav", { "aria-label": c, className: "cm:flex cm:gap-1 cm:overflow-x-auto cm:md:flex-col", children: t.map((i) => /* @__PURE__ */ e(
    a,
    {
      href: w(i.href),
      "aria-current": i.key === n ? "page" : void 0,
      className: Q(
        "cm:whitespace-nowrap cm:rounded-md cm:px-3 cm:py-1.5 cm:text-sm cm:text-muted-foreground cm:hover:bg-muted cm:hover:text-foreground",
        i.key === n && "cm:bg-muted cm:font-medium cm:text-foreground"
      ),
      children: i.label
    },
    i.key
  )) });
}
function Y({ sections: t, current: n, title: c, description: a, children: i }) {
  const { SettingsTabs: r } = U;
  return L(), E.useBreadcrumbs([{ label: "Settings", href: w("settings") }, { label: "Store", href: w("commerce/settings") }, { label: c }]), /* @__PURE__ */ l("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(r, { current: "store" }),
    /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-6 cm:md:grid-cols-[12rem_1fr]", children: [
      /* @__PURE__ */ e(pe, { items: t, current: n, label: "Store settings" }),
      /* @__PURE__ */ l("div", { className: "cm:grid cm:min-w-0 cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ e(M, { title: c, description: a }),
        i
      ] })
    ] })
  ] });
}
function De({ sections: t, mode: n, groups: c, updateUrl: a }) {
  const { Card: i, CardContent: r, CardHeader: s, CardTitle: o, Switch: y, Button: m, Dialog: x, DialogContent: b, DialogDescription: p, DialogFooter: u, DialogHeader: f, DialogTitle: g } = F, { errors: d } = j.usePage().props, [h, C] = S.useState(null), [v, N] = S.useState(null), k = (D, $) => {
    N(D.key), j.router.put(a.replace("__key__", D.key), { on: $ }, { preserveScroll: !0, onFinish: () => N(null) });
  };
  return /* @__PURE__ */ l(
    Y,
    {
      sections: t,
      current: "features",
      title: "Features",
      description: /* @__PURE__ */ l(J, { children: [
        "Switch store modules on or off. Selling mode: ",
        /* @__PURE__ */ e("strong", { children: n.label }),
        ". Switching off never deletes data."
      ] }),
      children: [
        d.feature && /* @__PURE__ */ e("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: d.feature }),
        c.map((D) => /* @__PURE__ */ l(i, { children: [
          /* @__PURE__ */ e(s, { children: /* @__PURE__ */ e(o, { children: D.label }) }),
          /* @__PURE__ */ e(r, { className: "cm:grid cm:gap-0 cm:divide-y cm:divide-border", children: D.features.map(($) => /* @__PURE__ */ l("div", { className: "cm:flex cm:items-start cm:justify-between cm:gap-4 cm:py-3 cm:first:pt-0 cm:last:pb-0", children: [
            /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ l("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ e("label", { htmlFor: `feature-${$.key}`, className: "cm:font-medium", children: $.label }),
                $.core && /* @__PURE__ */ e(T, { children: "Always on" }),
                $.switched_on && !$.active && /* @__PURE__ */ l(T, { tone: "warning", children: [
                  "Off — ",
                  $.reasons.join("; ").replace(/^Needs /, "needs ")
                ] }),
                $.essential && /* @__PURE__ */ l(T, { tone: "info", children: [
                  "Needed by ",
                  n.label
                ] })
              ] }),
              /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: $.description }),
              $.requires.length > 0 && /* @__PURE__ */ l("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                "Needs: ",
                $.requires.join(", ")
              ] })
            ] }),
            /* @__PURE__ */ e(
              y,
              {
                id: `feature-${$.key}`,
                checked: $.switched_on,
                disabled: $.core || v === $.key,
                onCheckedChange: (V) => !V && $.dependents.length > 0 ? C($) : k($, V)
              }
            )
          ] }, $.key)) })
        ] }, D.key)),
        /* @__PURE__ */ e(x, { open: h !== null, onOpenChange: (D) => !D && C(null), children: /* @__PURE__ */ l(b, { children: [
          /* @__PURE__ */ l(f, { children: [
            /* @__PURE__ */ l(g, { children: [
              "Switch off ",
              h?.label,
              "?"
            ] }),
            /* @__PURE__ */ l(p, { children: [
              "These are switched off with it: ",
              h?.dependents.map((D) => D.label).join(", "),
              ". Their data is kept."
            ] })
          ] }),
          /* @__PURE__ */ l(u, { children: [
            /* @__PURE__ */ e(m, { variant: "outline", onClick: () => C(null), children: "Cancel" }),
            /* @__PURE__ */ e(
              m,
              {
                variant: "destructive",
                onClick: () => {
                  h && k(h, !1), C(null);
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
function ce({ form: t, footer: n }) {
  const { FieldRenderer: c } = U, { Button: a } = F, { data: i, setData: r, errors: s, processing: o, isDirty: y, ...m } = j.useForm({ values: t.values });
  return /* @__PURE__ */ l(
    "form",
    {
      className: "cm:grid cm:gap-6",
      onSubmit: (x) => {
        x.preventDefault(), m[t.method](t.action, { preserveScroll: !0 });
      },
      children: [
        s.section && /* @__PURE__ */ e("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: s.section }),
        /* @__PURE__ */ e(
          c,
          {
            fields: t.fields,
            values: i.values,
            errors: s,
            pathPrefix: "values",
            onChange: (x) => r("values", x)
          }
        ),
        /* @__PURE__ */ l("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
          /* @__PURE__ */ e(a, { type: "submit", disabled: o, children: t.submitLabel }),
          y && /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: "Unsaved changes" }),
          n
        ] })
      ]
    }
  );
}
function Te({ section: t, sections: n, form: c }) {
  return /* @__PURE__ */ e(Y, { sections: n, current: t.key, title: `${t.label} settings`, children: /* @__PURE__ */ e(ce, { form: c }, t.key) });
}
function qe({ sections: t, zones: n, types: c, couriers: a, moveUrl: i }) {
  const { Card: r, CardContent: s, CardHeader: o, CardTitle: y, Button: m, Select: x, SelectContent: b, SelectItem: p, SelectTrigger: u, SelectValue: f } = F, { Link: g } = j, d = (h, C, v) => j.router.post(w(i), { kind: h, id: C, direction: v }, { preserveScroll: !0 });
  return /* @__PURE__ */ l(
    Y,
    {
      sections: t,
      current: "shipping",
      title: "Shipping",
      description: "Zones are checked in order and the first one matching the address gives its methods. Pickup methods are offered everywhere.",
      children: [
        /* @__PURE__ */ e("div", { className: "cm:flex cm:justify-end", children: /* @__PURE__ */ e(m, { asChild: !0, children: /* @__PURE__ */ e(g, { href: w("commerce/settings/shipping/zones/create"), children: "Add zone" }) }) }),
        n.length === 0 && /* @__PURE__ */ e(ne, { title: "No shipping zones yet", description: "Without a zone, checkout offers no shipping. Add one for your country or provinces." }),
        n.map((h, C) => /* @__PURE__ */ l(r, { children: [
          /* @__PURE__ */ l(o, { className: "cm:flex cm:flex-row cm:items-start cm:justify-between cm:gap-4", children: [
            /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ l(y, { className: "cm:flex cm:items-center cm:gap-2", children: [
                h.name,
                h.everywhere_else && /* @__PURE__ */ e(T, { tone: "info", children: "Everywhere else" })
              ] }),
              !h.everywhere_else && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: h.regions.length > 0 ? h.regions.join(", ") : "No regions" })
            ] }),
            /* @__PURE__ */ l("div", { className: "cm:flex cm:shrink-0 cm:gap-1", children: [
              /* @__PURE__ */ e(m, { variant: "ghost", size: "sm", "aria-label": "Move up", disabled: C === 0, onClick: () => d("zone", h.id, "up"), children: "↑" }),
              /* @__PURE__ */ e(m, { variant: "ghost", size: "sm", "aria-label": "Move down", disabled: C === n.length - 1, onClick: () => d("zone", h.id, "down"), children: "↓" }),
              /* @__PURE__ */ e(m, { variant: "outline", size: "sm", asChild: !0, children: /* @__PURE__ */ e(g, { href: w(h.edit_url), children: "Edit" }) })
            ] })
          ] }),
          /* @__PURE__ */ l(s, { className: "cm:grid cm:gap-3", children: [
            h.methods.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No methods in this zone." }),
            h.methods.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:divide-y cm:divide-border cm:rounded-md cm:border", children: h.methods.map((v, N) => /* @__PURE__ */ l("li", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:px-3 cm:py-2", children: [
              /* @__PURE__ */ l("div", { className: "cm:min-w-0", children: [
                /* @__PURE__ */ e(g, { href: w(v.edit_url), className: "cm:font-medium cm:hover:underline", children: v.title }),
                /* @__PURE__ */ l("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  v.type,
                  v.etd ? ` · ${v.etd}` : ""
                ] })
              ] }),
              /* @__PURE__ */ l("div", { className: "cm:flex cm:items-center cm:gap-1", children: [
                !v.active && /* @__PURE__ */ e(T, { children: "Inactive" }),
                /* @__PURE__ */ e(m, { variant: "ghost", size: "sm", "aria-label": "Move up", disabled: N === 0, onClick: () => d("method", v.id, "up"), children: "↑" }),
                /* @__PURE__ */ e(m, { variant: "ghost", size: "sm", "aria-label": "Move down", disabled: N === h.methods.length - 1, onClick: () => d("method", v.id, "down"), children: "↓" })
              ] })
            ] }, v.id)) }),
            /* @__PURE__ */ e("div", { children: /* @__PURE__ */ l(x, { value: "", onValueChange: (v) => j.router.visit(w(`commerce/settings/shipping/zones/${h.id}/methods/create?type=${v}`)), children: [
              /* @__PURE__ */ e(u, { className: "cm:w-48", "aria-label": `Add a method to ${h.name}`, children: /* @__PURE__ */ e(f, { placeholder: "Add method…" }) }),
              /* @__PURE__ */ e(b, { children: c.map((v) => /* @__PURE__ */ e(p, { value: v.key, children: v.label }, v.key)) })
            ] }) })
          ] })
        ] }, h.id)),
        /* @__PURE__ */ l(r, { children: [
          /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(y, { children: "Courier presets" }) }),
          /* @__PURE__ */ l(s, { children: [
            /* @__PURE__ */ e("p", { className: "cm:mb-3 cm:text-sm cm:text-muted-foreground", children: "Offered when adding a shipment; the tracking link is filled in from the tracking number. Add more in config/commerce.php or with Commerce::registerCourier()." }),
            /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1 cm:text-sm cm:sm:grid-cols-2", children: a.map((h) => /* @__PURE__ */ l("li", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e("span", { className: "cm:font-medium", children: h.name }),
              !h.tracking_url && /* @__PURE__ */ e("span", { className: "cm:text-xs cm:text-muted-foreground", children: "(no tracking link)" })
            ] }, h.key)) })
          ] })
        ] })
      ]
    }
  );
}
function je({ title: t, description: n, form: c, breadcrumbs: a = [], deleteUrl: i, deleteConfirm: r }) {
  const { Button: s } = F;
  return L(), E.useBreadcrumbs([...a.map((o) => ({ ...o, href: o.href ? w(o.href) : void 0 })), { label: t }]), /* @__PURE__ */ l("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-3xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(M, { title: t, description: n }),
    /* @__PURE__ */ e(ce, { form: c, footer: i ? /* @__PURE__ */ e(
      s,
      {
        type: "button",
        variant: "ghost",
        className: "cm:ml-auto cm:text-destructive",
        onClick: () => window.confirm(r ?? "Delete this?") && j.router.delete(w(i)),
        children: "Delete"
      }
    ) : null })
  ] });
}
function Ie(t) {
  const { DataTable: n } = U, { Button: c } = F, { Link: a } = j;
  return L(), E.useBreadcrumbs([{ label: "Shop", href: w("commerce") }, { label: t.title }]), /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      M,
      {
        title: t.title,
        description: t.description,
        actions: t.createUrl ? /* @__PURE__ */ e(c, { asChild: !0, children: /* @__PURE__ */ e(a, { href: w(t.createUrl), children: t.createLabel ?? "New" }) }) : null
      }
    ),
    /* @__PURE__ */ e(
      n,
      {
        ...t,
        bulkUrl: t.bulkUrl ? w(t.bulkUrl) : void 0,
        rowHref: (i) => i.href ? w(i.href) : null,
        renderCell: (i, r) => r.type === "badge" && i[r.key] != null ? /* @__PURE__ */ e(T, { tone: i[`${r.key}_tone`] ?? "neutral", children: String(i[r.key]) }) : void 0
      }
    )
  ] });
}
const Be = {
  "Commerce/Customers/Show": Ne,
  "Commerce/Dashboard": _e,
  "Commerce/Inventory/Index": we,
  "Commerce/Products/Index": Fe,
  "Commerce/Settings/Section": Te,
  "Commerce/Settings/Features": De,
  "Commerce/Settings/Shipping": qe,
  "Commerce/Shared/SchemaForm": je,
  "Commerce/Shared/ResourceIndex": Ie
};
function Ae() {
  Object.entries(Be).forEach(([t, n]) => E.registerPage(t, n));
}
function ie(t) {
  if (!t) return "";
  const n = new Date(t);
  if (Number.isNaN(n.getTime())) return "";
  const c = (a) => String(a).padStart(2, "0");
  return `${n.getFullYear()}-${c(n.getMonth() + 1)}-${c(n.getDate())}T${c(n.getHours())}:${c(n.getMinutes())}`;
}
function ae(t) {
  return t ? new Date(t).toISOString() : null;
}
function Ee({ value: t, onChange: n, pathPrefix: c }) {
  const { Input: a, Label: i } = F, r = { start: t?.start ?? null, end: t?.end ?? null };
  return /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(i, { htmlFor: `${c}-start`, children: "Starts" }),
      /* @__PURE__ */ e(
        a,
        {
          id: `${c}-start`,
          type: "datetime-local",
          value: ie(r.start),
          onChange: (s) => n({ ...r, start: ae(s.target.value) })
        }
      )
    ] }),
    /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(i, { htmlFor: `${c}-end`, children: "Ends" }),
      /* @__PURE__ */ e(
        a,
        {
          id: `${c}-end`,
          type: "datetime-local",
          value: ie(r.end),
          onChange: (s) => n({ ...r, end: ae(s.target.value) })
        }
      )
    ] })
  ] });
}
function re({
  value: t,
  onChange: n,
  id: c,
  placeholder: a,
  allowNull: i = !0,
  invalid: r
}) {
  const { Input: s } = F, o = (p) => p == null ? "" : K(p).replace(/^[^\d-]+|[^\d]+$/g, ""), [y, m] = S.useState(o(t)), [x, b] = S.useState(!1);
  return S.useEffect(() => {
    x || m(o(t));
  }, [t, x]), /* @__PURE__ */ e(
    s,
    {
      id: c,
      inputMode: "decimal",
      value: y,
      placeholder: a,
      "aria-invalid": r || void 0,
      onFocus: () => b(!0),
      onChange: (p) => {
        m(p.target.value);
        const u = p.target.value.trim() === "" ? i ? null : 0 : ue(p.target.value);
        (u !== null || p.target.value.trim() === "") && n(u);
      },
      onBlur: () => {
        b(!1), m(o(t));
      }
    }
  );
}
function Le({ field: t, value: n, onChange: c, errors: a, pathPrefix: i }) {
  return L(), /* @__PURE__ */ e(
    re,
    {
      id: i,
      value: n,
      onChange: c,
      allowNull: t.config?.allow_null !== !1,
      invalid: !!(i && a?.[i])
    }
  );
}
const se = [
  { key: "province_code", label: "Province" },
  { key: "city_code", label: "City / regency" },
  { key: "district_code", label: "District" },
  { key: "village_code", label: "Village" }
], Pe = { province: 1, city: 2, district: 3, village: 4 }, X = /* @__PURE__ */ new Map();
function Re(t, n) {
  const c = n ? `${t}?parent=${encodeURIComponent(n)}` : t;
  return X.has(c) || X.set(c, O(c).then((a) => a.data).catch(() => (X.delete(c), []))), X.get(c);
}
const oe = "cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm cm:disabled:opacity-50";
function Oe({ field: t, value: n, onChange: c, pathPrefix: a }) {
  const { Label: i } = F, r = t.config ?? {}, s = String(r.api ?? ""), o = Pe[r.depth ?? "district"] ?? 3, y = r.country_options ?? [], m = { country: "ID", province_code: null, city_code: null, district_code: null, village_code: null, ...n ?? {} }, x = se.slice(0, o), [b, p] = S.useState({}), u = [null, m.province_code, m.city_code, m.district_code];
  S.useEffect(() => {
    m.country !== "ID" || !s || x.forEach((g, d) => {
      const h = u[d];
      d > 0 && !h || Re(s, h).then((C) => p((v) => ({ ...v, [g.key]: C })));
    });
  }, [s, m.country, m.province_code, m.city_code, m.district_code]);
  const f = (g, d) => {
    const h = { ...m };
    h[x[g].key] = d || null, se.slice(g + 1).forEach((C) => {
      h[C.key] = null;
    }), c(h);
  };
  return /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    y.length > 0 && /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(i, { htmlFor: `${a}-country`, children: "Country" }),
      /* @__PURE__ */ e(
        "select",
        {
          id: `${a}-country`,
          className: oe,
          value: m.country,
          onChange: (g) => c({ country: g.target.value, province_code: null, city_code: null, district_code: null, village_code: null }),
          children: y.map((g) => /* @__PURE__ */ e("option", { value: g.value, children: g.label }, g.value))
        }
      )
    ] }),
    m.country === "ID" && x.map((g, d) => /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(i, { htmlFor: `${a}-${g.key}`, children: g.label }),
      /* @__PURE__ */ l(
        "select",
        {
          id: `${a}-${g.key}`,
          className: oe,
          value: m[g.key] ?? "",
          disabled: d > 0 && !u[d],
          onChange: (h) => f(d, h.target.value),
          children: [
            /* @__PURE__ */ e("option", { value: "", children: "Choose…" }),
            (b[g.key] ?? []).map((h) => /* @__PURE__ */ e("option", { value: h.code, children: h.name }, h.code))
          ]
        }
      )
    ] }, g.key))
  ] });
}
function Me({ field: t, value: n, onChange: c, pathPrefix: a }) {
  const { Input: i, Badge: r } = F, s = t.config ?? {}, o = Array.isArray(n) ? n : [], [y, m] = S.useState(""), [x, b] = S.useState([]), [p, u] = S.useState(!1);
  S.useEffect(() => {
    if (!p) return;
    const d = new URLSearchParams({ q: y });
    (s.types ?? []).forEach((C) => d.append("types[]", C)), (s.taxonomies ?? []).forEach((C) => d.append("taxonomies[]", C));
    const h = setTimeout(() => O(`${s.api}?${d}`).then((C) => b(C.data)).catch(() => b([])), 200);
    return () => clearTimeout(h);
  }, [y, p]);
  const f = (d) => o.some((h) => h.type === d.type && h.id === d.id), g = { product: "Product", variant: "Variant", term: "Category/brand" };
  return /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-2", children: [
    o.length > 0 && /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: o.map((d) => /* @__PURE__ */ l(r, { variant: "secondary", className: "cm:gap-1", children: [
      /* @__PURE__ */ l("span", { className: "cm:text-muted-foreground", children: [
        g[d.type],
        ":"
      ] }),
      " ",
      d.label,
      /* @__PURE__ */ e("button", { type: "button", "aria-label": `Remove ${d.label}`, onClick: () => c(o.filter((h) => !(h.type === d.type && h.id === d.id))), children: "×" })
    ] }, `${d.type}:${d.id}`)) }),
    /* @__PURE__ */ l("div", { className: "cm:relative", children: [
      /* @__PURE__ */ e(
        i,
        {
          id: a,
          value: y,
          placeholder: "Search products, SKUs, categories, brands…",
          onFocus: () => u(!0),
          onBlur: () => setTimeout(() => u(!1), 150),
          onChange: (d) => m(d.target.value)
        }
      ),
      p && x.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-20 cm:mt-1 cm:max-h-72 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: x.map((d) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          disabled: f(d),
          className: "cm:flex cm:w-full cm:justify-between cm:gap-3 cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted cm:disabled:opacity-50",
          onMouseDown: (h) => h.preventDefault(),
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
function A() {
  return (globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`).replace(/-/g, "").slice(0, 32);
}
function de(t) {
  return Object.keys(t).sort().map((n) => `${n}=${t[n]}`).join("|");
}
function Ue(t) {
  let n = [{}];
  for (const c of t) {
    if (c.values.length === 0) return [];
    const a = [];
    for (const i of n)
      for (const r of c.values)
        a.push({ ...i, [c.id]: r.id });
    n = a;
  }
  return t.length === 0 ? [] : n;
}
function ze(t, n, c, a = 100) {
  const i = new Map(n.map((r) => [de(r.options), r]));
  return Ue(t).slice(0, a).map((r) => {
    const s = i.get(de(r));
    return s ? { ...s, options: r } : { ...c, id: A(), sku: null, options: r, active: !0, price: c.price ?? 0 };
  });
}
function fe(t, n, c = {}) {
  return t.map((a) => {
    const i = a.values.find((r) => r.id === n.options[a.id]);
    return i ? i.label ?? (i.term_id ? c[i.term_id] ?? `#${i.term_id}` : "?") : "?";
  }).join(" / ");
}
function _({ label: t, hint: n, children: c, htmlFor: a, className: i }) {
  const { Label: r } = F;
  return /* @__PURE__ */ l("div", { className: Q("cm:grid cm:gap-1.5", i), children: [
    /* @__PURE__ */ e(r, { htmlFor: a, children: t }),
    c,
    n && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: n })
  ] });
}
function W({ children: t, cols: n = 3 }) {
  return /* @__PURE__ */ e("div", { className: Q("cm:grid cm:gap-4", { 2: "cm:sm:grid-cols-2", 3: "cm:sm:grid-cols-2 cm:lg:grid-cols-3", 4: "cm:sm:grid-cols-2 cm:lg:grid-cols-4" }[n]), children: t });
}
function q({ id: t, value: n, onChange: c, min: a = 0, placeholder: i }) {
  const { Input: r } = F;
  return /* @__PURE__ */ e(
    r,
    {
      id: t,
      type: "number",
      inputMode: "numeric",
      min: a,
      value: n ?? "",
      placeholder: i,
      onChange: (s) => c(s.target.value === "" ? null : Math.round(Number(s.target.value)))
    }
  );
}
function G({ id: t, value: n, onChange: c, placeholder: a, onBlur: i }) {
  const { Input: r } = F;
  return /* @__PURE__ */ e(
    r,
    {
      id: t,
      value: n ?? "",
      placeholder: a,
      onBlur: i,
      onChange: (s) => c(s.target.value === "" ? null : s.target.value)
    }
  );
}
function R({ id: t, value: n, onChange: c, nullable: a = !0 }) {
  return /* @__PURE__ */ e(re, { id: t, value: n, allowNull: a, onChange: c });
}
function H({ id: t, label: n, checked: c, onChange: a, hint: i }) {
  const { Switch: r, Label: s } = F;
  return /* @__PURE__ */ l("div", { className: "cm:flex cm:items-start cm:gap-3", children: [
    /* @__PURE__ */ e(r, { id: t, checked: c, onCheckedChange: a }),
    /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-0.5", children: [
      /* @__PURE__ */ e(s, { htmlFor: t, children: n }),
      i && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: i })
    ] })
  ] });
}
const He = "cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm";
function I({ id: t, value: n, onChange: c, options: a }) {
  return /* @__PURE__ */ e("select", { id: t, className: He, value: n, onChange: (i) => c(i.target.value), children: a.map(([i, r]) => /* @__PURE__ */ e("option", { value: i, children: r }, i)) });
}
function B({ title: t, description: n, children: c, actions: a }) {
  return /* @__PURE__ */ l("section", { className: "cm:grid cm:gap-4", children: [
    /* @__PURE__ */ l("div", { className: "cm:flex cm:items-start cm:justify-between cm:gap-3", children: [
      /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-0.5", children: [
        /* @__PURE__ */ e("h3", { className: "cm:text-sm cm:font-semibold", children: t }),
        n && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: n })
      ] }),
      a
    ] }),
    c
  ] });
}
function Ke({ value: t, update: n, path: c }) {
  const { Button: a, Input: i } = F, r = t.bundle ?? { pricing: "fixed", value: 0, items: [] }, [s, o] = S.useState({}), [y, m] = S.useState(""), [x, b] = S.useState([]), p = r.items.map((g) => g.variant_id).filter((g) => !!g);
  S.useEffect(() => {
    const g = p.filter((d) => !s[d]);
    g.length !== 0 && O(w(`commerce/api/variants?${g.map((d) => `ids[]=${d}`).join("&")}`)).then((d) => o((h) => ({ ...h, ...Object.fromEntries(d.data.map((C) => [C.id, C])) }))).catch(() => {
    });
  }, [p.join(",")]), S.useEffect(() => {
    if (y.trim().length < 2) return b([]);
    const g = setTimeout(() => O(w(`commerce/api/variants?q=${encodeURIComponent(y)}`)).then((d) => b(d.data)).catch(() => {
    }), 250);
    return () => clearTimeout(g);
  }, [y]);
  const u = (g) => n({ bundle: { ...r, ...g } }), f = r.items.reduce((g, d) => g + (s[d.variant_id ?? 0]?.price ?? 0) * d.quantity, 0);
  return /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ l(B, { title: "Products in the bundle", description: "Bundles take their stock from these products.", children: [
      r.items.map((g, d) => /* @__PURE__ */ l("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ e("span", { className: "cm:flex-1 cm:text-sm", children: s[g.variant_id ?? 0]?.label ?? `#${g.variant_id}` }),
        /* @__PURE__ */ e("div", { className: "cm:w-24", children: /* @__PURE__ */ e(q, { min: 1, value: g.quantity, onChange: (h) => u({ items: r.items.map((C, v) => v === d ? { ...C, quantity: h ?? 1 } : C) }) }) }),
        /* @__PURE__ */ e(a, { type: "button", variant: "ghost", size: "sm", onClick: () => u({ items: r.items.filter((h, C) => C !== d) }), children: "Remove" })
      ] }, d)),
      /* @__PURE__ */ l("div", { className: "cm:relative", children: [
        /* @__PURE__ */ e(i, { value: y, placeholder: "Search products or SKUs to add…", "aria-label": "Add a product to the bundle", onChange: (g) => m(g.target.value) }),
        x.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-10 cm:mt-1 cm:max-h-64 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: x.map((g) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: "cm:flex cm:w-full cm:justify-between cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted",
            onClick: () => {
              o((d) => ({ ...d, [g.id]: g })), u({ items: [...r.items, { variant_id: g.id, quantity: 1 }] }), m("");
            },
            children: [
              /* @__PURE__ */ l("span", { children: [
                g.label,
                g.sku && /* @__PURE__ */ l("span", { className: "cm:text-muted-foreground", children: [
                  " · ",
                  g.sku
                ] })
              ] }),
              /* @__PURE__ */ e("span", { children: K(g.price) })
            ]
          }
        ) }, g.id)) })
      ] })
    ] }),
    /* @__PURE__ */ e(B, { title: "Bundle price", description: `The products cost ${K(f)} together.`, children: /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(_, { label: "Price", htmlFor: `${c}-bundle-pricing`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${c}-bundle-pricing`,
          value: r.pricing,
          onChange: (g) => u({ pricing: g, value: 0 }),
          options: [["fixed", "Its own price (General tab)"], ["percent_off", "Total minus a percentage"], ["amount_off", "Total minus an amount"]]
        }
      ) }),
      r.pricing === "percent_off" && /* @__PURE__ */ e(_, { label: "Percent off", htmlFor: `${c}-bundle-value`, children: /* @__PURE__ */ e(q, { id: `${c}-bundle-value`, value: r.value / 100, onChange: (g) => u({ value: Math.round((g ?? 0) * 100) }) }) }),
      r.pricing === "amount_off" && /* @__PURE__ */ e(_, { label: "Amount off", htmlFor: `${c}-bundle-value`, children: /* @__PURE__ */ e(R, { id: `${c}-bundle-value`, value: r.value, nullable: !1, onChange: (g) => u({ value: g ?? 0 }) }) })
    ] }) })
  ] });
}
function We() {
  return decodeURIComponent(document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/)?.[1] ?? "");
}
function Ge({ value: t, update: n, path: c }) {
  const { Button: a } = F, [i, r] = S.useState(!1), s = S.useRef(null), o = t.delivery ?? { modes: ["link", "account"], download_limit: null, expiry_days: null }, y = (b) => n({ delivery: { ...o, ...b } }), m = (b, p) => n({ downloads: t.downloads.map((u, f) => f === b ? { ...u, ...p } : u) }), x = async (b) => {
    if (b?.length) {
      r(!0);
      try {
        const p = [];
        for (const u of Array.from(b)) {
          const f = new FormData();
          f.append("file", u);
          const g = await fetch(w("commerce/api/downloads"), { method: "POST", body: f, headers: { "X-XSRF-TOKEN": We(), Accept: "application/json" }, credentials: "same-origin" }), d = await g.json();
          if (!g.ok) throw new Error(d.message ?? "Upload failed");
          p.push({ id: A(), type: "file", file_id: d.data.id, url: null, name: u.name.replace(/\.[^.]+$/, ""), file: d.data });
        }
        n({ downloads: [...t.downloads, ...p] });
      } catch (p) {
        ke.error(p instanceof Error ? p.message : "Upload failed");
      } finally {
        r(!1), s.current && (s.current.value = "");
      }
    }
  };
  return /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ l(
      B,
      {
        title: "Files and links",
        description: "Files are stored privately and only served to customers who bought them.",
        actions: /* @__PURE__ */ l("div", { className: "cm:flex cm:gap-2", children: [
          /* @__PURE__ */ e(a, { type: "button", variant: "outline", size: "sm", disabled: i, onClick: () => s.current?.click(), children: i ? "Uploading…" : "Upload file" }),
          /* @__PURE__ */ e(a, { type: "button", variant: "outline", size: "sm", onClick: () => n({ downloads: [...t.downloads, { id: A(), type: "url", file_id: null, url: null, name: "" }] }), children: "Add link" }),
          /* @__PURE__ */ e("input", { ref: s, type: "file", multiple: !0, hidden: !0, onChange: (b) => x(b.target.files) })
        ] }),
        children: [
          t.downloads.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No files yet." }),
          t.downloads.map((b, p) => /* @__PURE__ */ l("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(_, { label: "Name", htmlFor: `${c}-dl-${p}`, children: /* @__PURE__ */ e(G, { id: `${c}-dl-${p}`, value: b.name, onChange: (u) => m(p, { name: u ?? "" }) }) }),
            b.type === "url" ? /* @__PURE__ */ e(_, { label: "Link", htmlFor: `${c}-dl-${p}-url`, children: /* @__PURE__ */ e(G, { id: `${c}-dl-${p}-url`, value: b.url, placeholder: "https://", onChange: (u) => m(p, { url: u }) }) }) : /* @__PURE__ */ e(_, { label: "File", children: /* @__PURE__ */ e("p", { className: "cm:truncate cm:text-sm cm:text-muted-foreground", children: b.file?.filename ?? `File #${b.file_id}` }) }),
            /* @__PURE__ */ e(a, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ downloads: t.downloads.filter((u, f) => f !== p) }), children: "Remove" })
          ] }, b.id ?? p))
        ]
      }
    ),
    /* @__PURE__ */ l(B, { title: "Delivery", children: [
      /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-3", children: [["attachment", "Attach files to the email"], ["link", "Download links in the email"], ["account", "Library in My Account"]].map(([b, p]) => /* @__PURE__ */ e(
        H,
        {
          id: `${c}-mode-${b}`,
          label: p,
          checked: o.modes.includes(b),
          onChange: (u) => y({ modes: u ? [...o.modes, b] : o.modes.filter((f) => f !== b) })
        },
        b
      )) }),
      /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
        /* @__PURE__ */ e(_, { label: "Downloads per file", htmlFor: `${c}-limit`, hint: "Empty: unlimited.", children: /* @__PURE__ */ e(q, { id: `${c}-limit`, min: 1, value: o.download_limit, onChange: (b) => y({ download_limit: b }) }) }),
        /* @__PURE__ */ e(_, { label: "Links expire after (days)", htmlFor: `${c}-expiry`, hint: "Empty: never.", children: /* @__PURE__ */ e(q, { id: `${c}-expiry`, min: 1, value: o.expiry_days, onChange: (b) => y({ expiry_days: b }) }) })
      ] })
    ] })
  ] });
}
function be({ id: t, value: n, onChange: c, entryId: a }) {
  const [i, r] = S.useState(null);
  return /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-1", children: [
    /* @__PURE__ */ e(G, { id: t, value: n, onChange: (o) => {
      r(null), c(o);
    }, onBlur: () => {
      if (!n) return r(null);
      const o = new URLSearchParams({ sku: n, entry: String(a ?? 0) });
      O(w(`commerce/api/sku-check?${o}`)).then((y) => r(y.available ? null : y.product ?? "another product")).catch(() => r(null));
    } }),
    i && /* @__PURE__ */ l("p", { className: "cm:text-xs cm:text-destructive", children: [
      "Already used by ",
      i,
      "."
    ] })
  ] });
}
const Qe = [
  ["default", "Follow the store (selling mode)"],
  ["cart", "Add to cart"],
  ["inquiry", "Inquiry form"],
  ["whatsapp", "Ask on WhatsApp"],
  ["external", "Links to other shops"],
  ["none", "No button (display only)"]
];
function Ve({ value: t, update: n, updateVariant: c, config: a, entryId: i, path: r }) {
  const { Button: s } = F, o = [["simple", "Simple product"]];
  (a.features.variants || t.type === "variable") && o.push(["variable", "Variable product (sizes, colors…)"]), (a.features.bundles || t.type === "bundle") && o.push(["bundle", "Bundle of other products"]);
  const y = t.variants[0];
  return /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ l(W, { cols: 2, children: [
      /* @__PURE__ */ e(_, { label: "Product type", htmlFor: `${r}-type`, children: /* @__PURE__ */ e(I, { id: `${r}-type`, value: t.type, options: o, onChange: (m) => n({ type: m }) }) }),
      /* @__PURE__ */ e(_, { label: "Button on the product page", htmlFor: `${r}-mode`, hint: "'Follow the store' uses the selling mode set in Settings → Store.", children: /* @__PURE__ */ e(I, { id: `${r}-mode`, value: t.purchase_mode, options: Qe, onChange: (m) => n({ purchase_mode: m }) }) })
    ] }),
    t.type !== "variable" && y && /* @__PURE__ */ e(B, { title: "Price", children: /* @__PURE__ */ l(W, { cols: 4, children: [
      /* @__PURE__ */ e(_, { label: "Price", htmlFor: `${r}-price`, children: /* @__PURE__ */ e(R, { id: `${r}-price`, value: y.price, nullable: !1, onChange: (m) => c(0, { price: m ?? 0 }) }) }),
      /* @__PURE__ */ e(_, { label: "Compare-at price", htmlFor: `${r}-compare`, hint: "Shown struck through when higher.", children: /* @__PURE__ */ e(R, { id: `${r}-compare`, value: y.compare_at_price, onChange: (m) => c(0, { compare_at_price: m }) }) }),
      /* @__PURE__ */ e(_, { label: "Cost", htmlFor: `${r}-cost`, hint: "For profit reports; never shown.", children: /* @__PURE__ */ e(R, { id: `${r}-cost`, value: y.cost, onChange: (m) => c(0, { cost: m }) }) }),
      /* @__PURE__ */ e(_, { label: "SKU", htmlFor: `${r}-sku`, children: /* @__PURE__ */ e(be, { id: `${r}-sku`, value: y.sku, entryId: i, onChange: (m) => c(0, { sku: m }) }) })
    ] }) }),
    (t.purchase_mode === "external" || t.external_links.length > 0) && /* @__PURE__ */ e(
      B,
      {
        title: "Links to other shops",
        description: "Buttons such as 'Buy on Tokopedia'.",
        actions: t.external_links.length < 10 && /* @__PURE__ */ e(s, { type: "button", variant: "outline", size: "sm", onClick: () => n({ external_links: [...t.external_links, { preset: "tokopedia", label: null, url: null }] }), children: "Add link" }),
        children: t.external_links.map((m, x) => {
          const b = (p) => n({ external_links: t.external_links.map((u, f) => f === x ? { ...u, ...p } : u) });
          return /* @__PURE__ */ l("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[10rem_1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(_, { label: "Shop", htmlFor: `${r}-link-${x}-preset`, children: /* @__PURE__ */ e(
              I,
              {
                id: `${r}-link-${x}-preset`,
                value: m.preset ?? "",
                onChange: (p) => b({ preset: p || null }),
                options: [...Object.entries(a.link_presets), ["", "Other…"]]
              }
            ) }),
            /* @__PURE__ */ e(_, { label: "Button label", htmlFor: `${r}-link-${x}-label`, children: /* @__PURE__ */ e(G, { id: `${r}-link-${x}-label`, value: m.label, placeholder: m.preset ? `Buy on ${a.link_presets[m.preset]}` : "", onChange: (p) => b({ label: p }) }) }),
            /* @__PURE__ */ e(_, { label: "Link", htmlFor: `${r}-link-${x}-url`, children: /* @__PURE__ */ e(G, { id: `${r}-link-${x}-url`, value: m.url, placeholder: "https://", onChange: (p) => b({ url: p }) }) }),
            /* @__PURE__ */ e(s, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ external_links: t.external_links.filter((p, u) => u !== x) }), children: "Remove" })
          ] }, x);
        })
      }
    ),
    /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(H, { id: `${r}-shipping`, label: "Needs shipping", checked: t.requires_shipping, onChange: (m) => n({ requires_shipping: m }), hint: "Off for services and digital products." }),
      (a.features.digital || t.downloadable) && /* @__PURE__ */ e(H, { id: `${r}-downloadable`, label: "Downloadable", checked: t.downloadable, onChange: (m) => n({ downloadable: m }), hint: "Customers get files or links after paying." }),
      /* @__PURE__ */ e(H, { id: `${r}-featured`, label: "Featured", checked: t.featured, onChange: (m) => n({ featured: m }), hint: "Shown first when sorting by featured." })
    ] }),
    a.features.taxes && /* @__PURE__ */ e(_, { label: "Tax class", htmlFor: `${r}-tax`, children: /* @__PURE__ */ e(
      I,
      {
        id: `${r}-tax`,
        value: t.tax_class ?? "",
        onChange: (m) => n({ tax_class: m || null }),
        options: [["", "Standard"], ...a.tax_classes.filter((m) => m !== "standard").map((m) => [m, m])]
      }
    ) })
  ] });
}
function Xe({ value: t, updateVariant: n, live: c, path: a }) {
  const i = t.variants[0];
  if (!i) return null;
  const r = c?.variants[i.id];
  return /* @__PURE__ */ l(B, { title: "Stock", children: [
    /* @__PURE__ */ e(
      H,
      {
        id: `${a}-track`,
        label: "Track stock",
        checked: i.track_stock,
        onChange: (s) => n(0, { track_stock: s }),
        hint: "Count units: orders take them, cancellations give them back."
      }
    ),
    i.track_stock ? /* @__PURE__ */ l(W, { cols: 3, children: [
      r?.track_stock && r.stock_quantity !== null ? /* @__PURE__ */ e(_, { label: "In stock", hint: "Change it in Shop → Inventory, so every change is recorded.", children: /* @__PURE__ */ e("p", { className: "cm:text-2xl cm:font-semibold", children: r.stock_quantity }) }) : /* @__PURE__ */ e(_, { label: "Starting stock", htmlFor: `${a}-initial`, hint: "Set once, when the product is published.", children: /* @__PURE__ */ e(q, { id: `${a}-initial`, value: i.initial_stock, onChange: (s) => n(0, { initial_stock: s }) }) }),
      /* @__PURE__ */ e(_, { label: "When sold out", htmlFor: `${a}-backorders`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${a}-backorders`,
          value: i.backorders,
          onChange: (s) => n(0, { backorders: s }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }),
      /* @__PURE__ */ e(_, { label: "Low stock at", htmlFor: `${a}-low`, hint: "Empty: the store's setting.", children: /* @__PURE__ */ e(q, { id: `${a}-low`, value: i.low_stock_threshold, onChange: (s) => n(0, { low_stock_threshold: s }) }) })
    ] }) : /* @__PURE__ */ e(_, { label: "Stock status", htmlFor: `${a}-status`, children: /* @__PURE__ */ e(
      I,
      {
        id: `${a}-status`,
        value: i.stock_status,
        onChange: (s) => n(0, { stock_status: s }),
        options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
      }
    ) })
  ] });
}
function Je({ value: t, update: n, path: c }) {
  const { Button: a } = F, i = (r, s) => n({ tiers: t.tiers.map((o, y) => y === r ? { ...o, ...s } : o) });
  return /* @__PURE__ */ l(
    B,
    {
      title: "Bulk prices",
      description: "Lower unit prices for larger quantities. The best matching tier applies.",
      actions: t.tiers.length < 20 && /* @__PURE__ */ e(
        a,
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
        t.tiers.map((r, s) => /* @__PURE__ */ l("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[8rem_12rem_1fr_1fr_auto]", children: [
          /* @__PURE__ */ e(_, { label: "From (units)", htmlFor: `${c}-tier-${s}-min`, children: /* @__PURE__ */ e(q, { id: `${c}-tier-${s}-min`, min: 2, value: r.min_qty, onChange: (o) => i(s, { min_qty: o ?? 2 }) }) }),
          /* @__PURE__ */ e(_, { label: "Price", htmlFor: `${c}-tier-${s}-type`, children: /* @__PURE__ */ e(
            I,
            {
              id: `${c}-tier-${s}-type`,
              value: r.type,
              onChange: (o) => i(s, { type: o, value: 0 }),
              options: [["percent_off", "Percent off"], ["amount_off", "Amount off per unit"], ["fixed_price", "Fixed unit price"]]
            }
          ) }),
          /* @__PURE__ */ e(_, { label: r.type === "percent_off" ? "Percent" : "Amount", htmlFor: `${c}-tier-${s}-value`, children: r.type === "percent_off" ? /* @__PURE__ */ e(q, { id: `${c}-tier-${s}-value`, value: r.value / 100, onChange: (o) => i(s, { value: Math.round((o ?? 0) * 100) }) }) : /* @__PURE__ */ e(R, { id: `${c}-tier-${s}-value`, value: r.value, nullable: !1, onChange: (o) => i(s, { value: o ?? 0 }) }) }),
          /* @__PURE__ */ e(_, { label: "For", htmlFor: `${c}-tier-${s}-variant`, children: /* @__PURE__ */ e(
            I,
            {
              id: `${c}-tier-${s}-variant`,
              value: r.variant ?? "",
              onChange: (o) => i(s, { variant: o || null }),
              options: [["", "All variants"], ...t.type === "variable" ? t.variants.map((o) => [o.id, fe(t.options, o)]) : []]
            }
          ) }),
          /* @__PURE__ */ e(a, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ tiers: t.tiers.filter((o, y) => y !== s) }), children: "Remove" })
        ] }, s))
      ]
    }
  );
}
function Ye({ value: t, update: n, updateVariant: c, path: a }) {
  const i = t.variants[0];
  if (!i) return null;
  const r = (s) => t.type === "variable" ? n({ variants: t.variants.map((o) => ({ ...o, ...s })) }) : c(0, s);
  return /* @__PURE__ */ e(B, { title: "Package", description: t.type === "variable" ? "Applies to every variant; a variant can have its own weight under More." : "Used for shipping rates.", children: /* @__PURE__ */ l(W, { cols: 4, children: [
    /* @__PURE__ */ e(_, { label: "Weight (grams)", htmlFor: `${a}-weight`, children: /* @__PURE__ */ e(q, { id: `${a}-weight`, value: i.weight, onChange: (s) => r({ weight: s }) }) }),
    /* @__PURE__ */ e(_, { label: "Length (mm)", htmlFor: `${a}-length`, children: /* @__PURE__ */ e(q, { id: `${a}-length`, value: i.length, onChange: (s) => r({ length: s }) }) }),
    /* @__PURE__ */ e(_, { label: "Width (mm)", htmlFor: `${a}-width`, children: /* @__PURE__ */ e(q, { id: `${a}-width`, value: i.width, onChange: (s) => r({ width: s }) }) }),
    /* @__PURE__ */ e(_, { label: "Height (mm)", htmlFor: `${a}-height`, children: /* @__PURE__ */ e(q, { id: `${a}-height`, value: i.height, onChange: (s) => r({ height: s }) }) })
  ] }) });
}
const ee = {
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
function Ze(t) {
  const [n, c] = S.useState({}), a = t.filter((i) => !(i in n));
  return S.useEffect(() => {
    if (a.length === 0) return;
    const i = a.map((r) => `ids[]=${r}`).join("&");
    O(w(`api/terms?${i}`)).then((r) => c((s) => ({ ...s, ...Object.fromEntries(r.data.map((o) => [o.id, o.title])) }))).catch(() => {
    });
  }, [a.join(",")]), n;
}
function et({ option: t, onChange: n, onRemove: c, config: a, path: i }) {
  const { Button: r, Input: s, Badge: o } = F, { FieldRenderer: y } = U, [m, x] = S.useState(""), b = () => {
    const u = m.split(",").map((f) => f.trim()).filter(Boolean).filter((f) => !t.values.some((g) => (g.label ?? "").toLowerCase() === f.toLowerCase()));
    u.length && n({ ...t, values: [...t.values, ...u.map((f) => ({ id: A(), label: f }))] }), x("");
  }, p = t.values.map((u) => u.term_id).filter((u) => !!u);
  return /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-3 cm:rounded-md cm:border cm:p-3", children: [
    /* @__PURE__ */ l("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_1fr_auto]", children: [
      /* @__PURE__ */ e(_, { label: "Option name", htmlFor: `${i}-name`, children: /* @__PURE__ */ e(s, { id: `${i}-name`, value: t.name, placeholder: "Size", onChange: (u) => n({ ...t, name: u.target.value }) }) }),
      a.attribute_taxonomies.length > 0 ? /* @__PURE__ */ e(_, { label: "Values from", htmlFor: `${i}-source`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${i}-source`,
          value: t.taxonomy ?? "",
          onChange: (u) => n({ ...t, taxonomy: u || null, values: [] }),
          options: [["", "Custom values"], ...a.attribute_taxonomies.map((u) => [u.handle, u.title])]
        }
      ) }) : /* @__PURE__ */ e("div", {}),
      /* @__PURE__ */ e(r, { type: "button", variant: "ghost", size: "sm", onClick: c, children: "Remove option" })
    ] }),
    t.taxonomy ? /* @__PURE__ */ e(
      y,
      {
        fields: [{ handle: "terms", type: "terms", label: "Values", config: { taxonomy: t.taxonomy } }],
        values: { terms: p },
        pathPrefix: `${i}-terms`,
        onChange: (u) => {
          const f = u.terms ?? [], g = t.values.filter((h) => h.term_id && f.includes(h.term_id)), d = f.filter((h) => !g.some((C) => C.term_id === h)).map((h) => ({ id: A(), term_id: h }));
          n({ ...t, values: [...g, ...d] });
        }
      }
    ) : /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-2", children: [
      /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: t.values.map((u) => /* @__PURE__ */ l(o, { variant: "secondary", className: "cm:gap-1", children: [
        u.label,
        /* @__PURE__ */ e("button", { type: "button", "aria-label": `Remove ${u.label}`, onClick: () => n({ ...t, values: t.values.filter((f) => f.id !== u.id) }), children: "×" })
      ] }, u.id)) }),
      /* @__PURE__ */ l("div", { className: "cm:flex cm:gap-2", children: [
        /* @__PURE__ */ e(
          s,
          {
            value: m,
            placeholder: "S, M, L",
            "aria-label": `Add values to ${t.name || "option"}`,
            onChange: (u) => x(u.target.value),
            onKeyDown: (u) => {
              u.key === "Enter" && (u.preventDefault(), b());
            }
          }
        ),
        /* @__PURE__ */ e(r, { type: "button", variant: "outline", onClick: b, children: "Add" })
      ] })
    ] })
  ] });
}
function tt({ variant: t, index: n, updateVariant: c, tab: a }) {
  const { FieldRenderer: i } = U, r = `${a.path}-v${n}`, s = a.live?.variants[t.id];
  return /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-4 cm:bg-muted/40 cm:p-4", children: [
    /* @__PURE__ */ l(W, { cols: 4, children: [
      /* @__PURE__ */ e(_, { label: "Cost", htmlFor: `${r}-cost`, children: /* @__PURE__ */ e(R, { id: `${r}-cost`, value: t.cost, onChange: (o) => c(n, { cost: o }) }) }),
      /* @__PURE__ */ e(_, { label: "Barcode", htmlFor: `${r}-barcode`, children: /* @__PURE__ */ e(G, { id: `${r}-barcode`, value: t.barcode, onChange: (o) => c(n, { barcode: o }) }) }),
      /* @__PURE__ */ e(_, { label: "Weight (g)", htmlFor: `${r}-weight`, children: /* @__PURE__ */ e(q, { id: `${r}-weight`, value: t.weight, onChange: (o) => c(n, { weight: o }), placeholder: "Product's" }) }),
      /* @__PURE__ */ e(_, { label: "Min / max / step", htmlFor: `${r}-min`, children: /* @__PURE__ */ l("div", { className: "cm:grid cm:grid-cols-3 cm:gap-1", children: [
        /* @__PURE__ */ e(q, { id: `${r}-min`, min: 1, value: t.min_qty, onChange: (o) => c(n, { min_qty: o ?? 1 }) }),
        /* @__PURE__ */ e(q, { min: 1, value: t.max_qty, onChange: (o) => c(n, { max_qty: o }), placeholder: "–" }),
        /* @__PURE__ */ e(q, { min: 1, value: t.qty_step, onChange: (o) => c(n, { qty_step: o ?? 1 }) })
      ] }) })
    ] }),
    a.config.features.inventory && /* @__PURE__ */ l(W, { cols: 4, children: [
      /* @__PURE__ */ e(H, { id: `${r}-track`, label: "Track stock", checked: t.track_stock, onChange: (o) => c(n, { track_stock: o }) }),
      t.track_stock && (s?.track_stock && s.stock_quantity !== null ? /* @__PURE__ */ e(_, { label: "In stock", children: /* @__PURE__ */ l("p", { className: "cm:text-sm", children: [
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
      i,
      {
        fields: [{ handle: "image", type: "asset", label: "Image", config: { image_only: !0 } }],
        values: { image: t.image },
        pathPrefix: `${r}-image`,
        onChange: (o) => c(n, { image: o.image ?? null })
      }
    )
  ] });
}
function nt(t) {
  const { value: n, update: c, updateVariant: a, config: i, entryId: r, live: s } = t, { Button: o, Table: y, TableBody: m, TableCell: x, TableHead: b, TableHeader: p, TableRow: u, Switch: f } = F, [g, d] = S.useState(null), h = Ze(n.options.flatMap((N) => N.values.map((k) => k.term_id).filter((k) => !!k))), C = n.variants[0] ?? { ...ee, id: A() }, v = (N = n.options) => c({ options: N, variants: ze(N, n.variants, { ...C, initial_stock: null, image: null }, i.max_variants) });
  return /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ e(
      B,
      {
        title: "Options",
        description: `Up to ${i.max_options} options, such as size and color. Variants are made for every combination.`,
        actions: n.options.length < i.max_options && /* @__PURE__ */ e(o, { type: "button", variant: "outline", size: "sm", onClick: () => c({ options: [...n.options, { id: A(), name: "", taxonomy: null, values: [] }] }), children: "Add option" }),
        children: n.options.map((N, k) => /* @__PURE__ */ e(
          et,
          {
            option: N,
            config: i,
            path: `${t.path}-o${k}`,
            onChange: (D) => v(n.options.map(($, V) => V === k ? D : $)),
            onRemove: () => v(n.options.filter((D, $) => $ !== k))
          },
          N.id
        ))
      }
    ),
    /* @__PURE__ */ l(
      B,
      {
        title: `Variants (${n.variants.length})`,
        description: "Each has its own SKU, price and stock. Switch one off to stop selling it without losing it.",
        actions: /* @__PURE__ */ e(o, { type: "button", variant: "outline", size: "sm", onClick: () => v(), children: "Regenerate" }),
        children: [
          n.options.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "Add an option with values to create variants." }) : /* @__PURE__ */ e("div", { className: "cm:overflow-x-auto cm:rounded-md cm:border", children: /* @__PURE__ */ l(y, { children: [
            /* @__PURE__ */ e(p, { children: /* @__PURE__ */ l(u, { children: [
              /* @__PURE__ */ e(b, { children: "Variant" }),
              /* @__PURE__ */ e(b, { children: "SKU" }),
              /* @__PURE__ */ e(b, { children: "Price" }),
              /* @__PURE__ */ e(b, { children: "Compare-at" }),
              i.features.inventory && /* @__PURE__ */ e(b, { children: "Stock" }),
              /* @__PURE__ */ e(b, { children: "On sale" }),
              /* @__PURE__ */ e(b, {})
            ] }) }),
            /* @__PURE__ */ e(m, { children: n.variants.map((N, k) => {
              const D = s?.variants[N.id];
              return /* @__PURE__ */ l(S.Fragment, { children: [
                /* @__PURE__ */ l(u, { className: N.active ? "" : "cm:opacity-60", children: [
                  /* @__PURE__ */ e(x, { className: "cm:font-medium cm:whitespace-nowrap", children: fe(n.options, N, h) }),
                  /* @__PURE__ */ e(x, { className: "cm:min-w-36", children: /* @__PURE__ */ e(be, { value: N.sku, entryId: r, onChange: ($) => a(k, { sku: $ }) }) }),
                  /* @__PURE__ */ e(x, { className: "cm:min-w-32", children: /* @__PURE__ */ e(R, { value: N.price, nullable: !1, onChange: ($) => a(k, { price: $ ?? 0 }) }) }),
                  /* @__PURE__ */ e(x, { className: "cm:min-w-32", children: /* @__PURE__ */ e(R, { value: N.compare_at_price, onChange: ($) => a(k, { compare_at_price: $ }) }) }),
                  i.features.inventory && /* @__PURE__ */ e(x, { className: "cm:whitespace-nowrap cm:text-sm", children: N.track_stock ? D?.stock_quantity ?? N.initial_stock ?? 0 : /* @__PURE__ */ e(T, { children: N.stock_status.replace("_", " ") }) }),
                  /* @__PURE__ */ e(x, { children: /* @__PURE__ */ e(f, { checked: N.active, "aria-label": "Sell this variant", onCheckedChange: ($) => a(k, { active: $ }) }) }),
                  /* @__PURE__ */ e(x, { children: /* @__PURE__ */ e(o, { type: "button", variant: "ghost", size: "sm", "aria-expanded": g === N.id, onClick: () => d(g === N.id ? null : N.id), children: g === N.id ? "Close" : "More" }) })
                ] }),
                g === N.id && /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(x, { colSpan: 7, className: "cm:p-0", children: /* @__PURE__ */ e(tt, { variant: N, index: k, updateVariant: a, tab: t }) }) })
              ] }, N.id);
            }) })
          ] }) }),
          n.variants.length > 0 && /* @__PURE__ */ l("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
            "Prices from ",
            K(Math.min(...n.variants.map((N) => N.price))),
            " to ",
            K(Math.max(...n.variants.map((N) => N.price))),
            "."
          ] })
        ]
      }
    )
  ] });
}
function ct(t) {
  const n = t ?? {}, c = (n.variants?.length ? n.variants : [{ ...ee, id: A() }]).map((a) => ({ ...ee, ...a, id: a.id ?? A() }));
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
function rt({ field: t, value: n, onChange: c, errors: a, pathPrefix: i = "data.product" }) {
  L();
  const r = t.config ?? {}, s = ct(n), { props: o } = j.usePage(), y = o.entry?.id ?? null, [m, x] = S.useState(null);
  S.useEffect(() => {
    y && O(w(`commerce/api/products/${y}`)).then((v) => x(v.data)).catch(() => {
    });
  }, [y, o.entry]);
  const b = (v) => {
    const N = { ...s, ...v };
    v.type && v.type !== "variable" && (N.options = [], N.variants = [{ ...N.variants[0], options: {} }]), v.type === "bundle" && !N.bundle && (N.bundle = { pricing: "fixed", value: 0, items: [] }), c(N);
  }, p = (v, N) => b({ variants: s.variants.map((k, D) => D === v ? { ...k, ...N } : k) }), u = [{ key: "general", label: "General", render: (v) => /* @__PURE__ */ e(Ve, { ...v }) }];
  s.type === "variable" && u.push({ key: "variants", label: "Variants", render: (v) => /* @__PURE__ */ e(nt, { ...v }) }), s.type === "bundle" && u.push({ key: "bundle", label: "Bundle", render: (v) => /* @__PURE__ */ e(Ke, { ...v }) }), s.type !== "variable" && (r.features?.inventory ?? !0) && u.push({ key: "inventory", label: "Inventory", render: (v) => /* @__PURE__ */ e(Xe, { ...v }) }), s.requires_shipping && u.push({ key: "shipping", label: "Shipping", render: (v) => /* @__PURE__ */ e(Ye, { ...v }) }), (r.features?.pricing_rules !== !1 || s.tiers.length > 0) && u.push({ key: "pricing", label: "Bulk prices", render: (v) => /* @__PURE__ */ e(Je, { ...v }) }), s.downloadable && u.push({ key: "digital", label: "Digital", render: (v) => /* @__PURE__ */ e(Ge, { ...v }) });
  for (const [v, N] of Object.entries(z.productTabs()))
    u.push({ key: `ext-${v}`, label: N.label ?? v, render: (k) => /* @__PURE__ */ e(N, { ...k }) });
  const [f, g] = S.useState("general"), d = u.find((v) => v.key === f) ?? u[0], h = a?.[i], C = { value: s, update: b, updateVariant: p, config: r, live: m, entryId: y, path: i.replace(/\W+/g, "-") };
  return /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-4 cm:rounded-lg cm:border cm:p-4", children: [
    m?.sync_status === "failed" && /* @__PURE__ */ l("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: [
      "The published version couldn't be applied to the store, so it can't be bought: ",
      m.sync_error,
      ". Fix it and publish again."
    ] }),
    h && /* @__PURE__ */ e("p", { role: "alert", className: "cm:text-sm cm:text-destructive", children: h }),
    /* @__PURE__ */ e("div", { role: "tablist", "aria-label": "Product data", className: "cm:flex cm:flex-wrap cm:gap-1 cm:border-b", children: u.map((v) => /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": v.key === d.key,
        onClick: () => g(v.key),
        className: Q("cm:-mb-px cm:border-b-2 cm:px-3 cm:py-2 cm:text-sm", v.key === d.key ? "cm:border-primary cm:font-medium" : "cm:border-transparent cm:text-muted-foreground cm:hover:text-foreground"),
        children: v.label
      },
      v.key
    )) }),
    /* @__PURE__ */ e("div", { role: "tabpanel", children: d.render(C) })
  ] });
}
const lt = {
  commerce_money: Le,
  commerce_datetime_range: Ee,
  commerce_region: Oe,
  commerce_targets: Me,
  commerce_product: rt
};
function it() {
  Object.entries(lt).forEach(([t, n]) => E.registerField(t, n));
}
function at() {
  Object.assign(z.components, { EmptyState: ne, MoneyInput: re, PageHeader: M, SchemaFormView: ce, SectionNav: pe, SettingsLayout: Y, StatusBadge: T });
}
ye();
at();
it();
Ae();
