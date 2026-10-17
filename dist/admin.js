const Se = { symbol: "Rp", position: "left", space: !1, thousands: ".", decimal: ",", decimals: 0 };
let ve = Se;
function Be(c) {
  ve = { ...Se, ...c ?? {} };
}
function re(c, t = ve) {
  const l = c < 0, i = Math.abs(Math.round(c)), s = 10 ** t.decimals, r = Math.floor(i / s).toString().replace(/\B(?=(\d{3})+(?!\d))/g, t.thousands), d = t.decimals > 0 ? t.decimal + String(i % s).padStart(t.decimals, "0") : "", m = r + d, y = t.space ? " " : "", u = t.position === "left" ? `${t.symbol}${y}${m}` : `${m}${y}${t.symbol}`;
  return l ? `-${u}` : u;
}
function De(c, t = ve) {
  let l = c.replace(t.symbol, "").replace(/\s/g, "");
  const i = l.startsWith("-");
  l = l.replace(/^-/, "").split(t.thousands).join("");
  const [s, r = ""] = l.split(t.decimal);
  if (!/^\d*$/.test(s) || !/^\d*$/.test(r) || s + r === "")
    return null;
  const d = Number(s || "0") * 10 ** t.decimals + Number(r.padEnd(t.decimals, "0").slice(0, t.decimals) || "0");
  return i ? -d : d;
}
const X = {
  orderPanels: {},
  dashboardWidgets: {},
  settingsSections: {},
  productTabs: {}
}, ee = {
  version: 1,
  registerOrderPanel: (c, t) => {
    X.orderPanels[c] = t;
  },
  registerDashboardWidget: (c, t) => {
    X.dashboardWidgets[c] = t;
  },
  registerSettingsSection: (c, t) => {
    X.settingsSections[c] = t;
  },
  registerProductTab: (c, t) => {
    X.productTabs[c] = t;
  },
  orderPanels: () => X.orderPanels,
  dashboardWidgets: () => X.dashboardWidgets,
  settingsSections: () => X.settingsSections,
  productTabs: () => X.productTabs,
  formatMoney: re,
  parseMoney: De,
  components: {}
};
function Oe() {
  window.SunriceCommerce = ee;
  const c = window.SunriceCommerceQueue ?? [];
  (() => {
    for (; c.length > 0; ) {
      const l = c.shift();
      try {
        l?.(ee);
      } catch (i) {
        console.error("SunriceCommerceQueue call failed", i);
      }
    }
  })(), c.push = ((...l) => (l.forEach((i) => i(ee)), c.length)), window.SunriceCommerceQueue = c;
}
const L = window.Sunrice, { React: q, ui: T, components: ne, inertia: P, fetchJson: Q, toast: Ae } = L;
function w(c = "") {
  return c.startsWith("/") ? c : L.adminUrl(c);
}
const Fe = window.Sunrice.React, U = Fe.Fragment;
function e(c, t, l) {
  return Fe.createElement(c, l === void 0 ? t : { ...t, key: l });
}
const n = e;
function G({ title: c, description: t, actions: l }) {
  const { Head: i } = P;
  return /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-wrap cm:items-start cm:justify-between cm:gap-4", children: [
    /* @__PURE__ */ e(i, { title: c }),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e("h1", { className: "cm:text-xl cm:font-semibold cm:tracking-tight", children: c }),
      t && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: t })
    ] }),
    l && /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: l })
  ] });
}
function qe(c) {
  var t, l, i = "";
  if (typeof c == "string" || typeof c == "number") i += c;
  else if (typeof c == "object") if (Array.isArray(c)) {
    var s = c.length;
    for (t = 0; t < s; t++) c[t] && (l = qe(c[t])) && (i && (i += " "), i += l);
  } else for (l in c) c[l] && (i && (i += " "), i += l);
  return i;
}
function Le() {
  for (var c, t, l = 0, i = "", s = arguments.length; l < s; l++) (c = arguments[l]) && (t = qe(c)) && (i && (i += " "), i += t);
  return i;
}
function me(...c) {
  return Le(c);
}
const ke = {
  ok: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  success: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  warning: "cm:bg-amber-500/10 cm:text-amber-700 cm:dark:text-amber-400",
  error: "cm:bg-red-500/10 cm:text-red-700 cm:dark:text-red-400",
  info: "cm:bg-sky-500/10 cm:text-sky-700 cm:dark:text-sky-400",
  neutral: "cm:bg-muted cm:text-muted-foreground"
};
function j({ tone: c = "neutral", children: t }) {
  return /* @__PURE__ */ e("span", { className: me("cm:inline-flex cm:items-center cm:rounded-full cm:px-2 cm:py-0.5 cm:text-xs cm:font-medium", ke[c] ?? ke.neutral), children: t });
}
function K() {
  const { props: c } = P.usePage(), t = c.commerce ?? {};
  return Be(t.currency), t;
}
const ge = (c) => c ? new Date(c).toLocaleDateString(void 0, { dateStyle: "medium" }) : "—";
function Me({ customer: c, account: t, roleOptions: l, orders: i, can: s }) {
  const { Card: r, CardContent: d, CardHeader: m, CardTitle: y, Button: u, Input: k, Label: x, Textarea: h, Switch: g, Checkbox: f } = T, { Link: p, router: a } = P;
  K(), L.useBreadcrumbs([{ label: "Shop", href: w("commerce") }, { label: "Customers", href: w("commerce/customers") }, { label: c.name ?? c.email }]);
  const v = P.useForm({ name: c.name ?? "", phone: c.phone ?? "", note: c.note ?? "", accepts_marketing: c.accepts_marketing, roles: t?.roles ?? [] }), [$, N] = q.useState(!1), C = (_) => a.post(w(`commerce/customers/${c.id}/${_}`), {}, { preserveScroll: !0 });
  return /* @__PURE__ */ n("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-5xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      G,
      {
        title: c.name ?? c.email,
        description: /* @__PURE__ */ n(U, { children: [
          c.email,
          c.phone ? ` · ${c.phone}` : ""
        ] }),
        actions: /* @__PURE__ */ n(U, { children: [
          c.deletion_requested_at && /* @__PURE__ */ n(j, { tone: "warning", children: [
            "Deletion requested ",
            ge(c.deletion_requested_at)
          ] }),
          t ? /* @__PURE__ */ e(j, { tone: "ok", children: "Registered" }) : /* @__PURE__ */ e(j, { children: "Guest" })
        ] })
      }
    ),
    /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-3", children: [["Orders", String(c.orders_count)], ["Spent", c.total_spent], ["Last order", ge(c.last_order_at)]].map(([_, D]) => /* @__PURE__ */ e(r, { children: /* @__PURE__ */ n(d, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
      /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: _ }),
      /* @__PURE__ */ e("span", { className: "cm:text-xl cm:font-semibold", children: D })
    ] }) }, _)) }),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[2fr_1fr]", children: [
      /* @__PURE__ */ n("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ n(r, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(y, { children: "Orders" }) }),
          /* @__PURE__ */ e(d, { children: i.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No orders yet." }) : /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1", children: i.map((_) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ n(p, { href: w(_.href), className: "cm:flex cm:justify-between cm:rounded cm:p-2 cm:hover:bg-muted", children: [
            /* @__PURE__ */ n("span", { children: [
              _.number,
              " · ",
              ge(_.date)
            ] }),
            /* @__PURE__ */ n("span", { children: [
              /* @__PURE__ */ e(j, { children: _.status }),
              " ",
              _.total
            ] })
          ] }) }, _.id)) }) })
        ] }),
        /* @__PURE__ */ n(r, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(y, { children: "Addresses" }) }),
          /* @__PURE__ */ e(d, { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: c.addresses.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No saved addresses." }) : c.addresses.map((_) => /* @__PURE__ */ n("div", { className: "cm:rounded-md cm:border cm:p-3 cm:text-sm", children: [
            _.label && /* @__PURE__ */ e("p", { className: "cm:font-medium", children: _.label }),
            /* @__PURE__ */ e("p", { className: "cm:whitespace-pre-line", children: _.text }),
            /* @__PURE__ */ n("div", { className: "cm:mt-1 cm:flex cm:gap-1", children: [
              _.default_shipping && /* @__PURE__ */ e(j, { children: "Shipping" }),
              _.default_billing && /* @__PURE__ */ e(j, { children: "Billing" })
            ] })
          ] }, _.id)) })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ n(r, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(y, { children: "Details" }) }),
          /* @__PURE__ */ e(d, { children: /* @__PURE__ */ n("form", { className: "cm:grid cm:gap-3", onSubmit: (_) => {
            _.preventDefault(), v.put(w(`commerce/customers/${c.id}`), { preserveScroll: !0 });
          }, children: [
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(x, { htmlFor: "c-name", children: "Name" }),
              /* @__PURE__ */ e(k, { id: "c-name", disabled: !s.edit, value: v.data.name, onChange: (_) => v.setData("name", _.target.value) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(x, { htmlFor: "c-phone", children: "Phone" }),
              /* @__PURE__ */ e(k, { id: "c-phone", disabled: !s.edit, value: v.data.phone, onChange: (_) => v.setData("phone", _.target.value) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(x, { htmlFor: "c-note", children: "Note (staff only)" }),
              /* @__PURE__ */ e(h, { id: "c-note", disabled: !s.edit, value: v.data.note, onChange: (_) => v.setData("note", _.target.value) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e(g, { id: "c-marketing", disabled: !s.edit, checked: v.data.accepts_marketing, onCheckedChange: (_) => v.setData("accepts_marketing", _) }),
              /* @__PURE__ */ e(x, { htmlFor: "c-marketing", children: "Accepts marketing" })
            ] }),
            t && /* @__PURE__ */ n("fieldset", { className: "cm:grid cm:gap-1.5", children: [
              /* @__PURE__ */ e("legend", { className: "cm:mb-1 cm:text-sm cm:font-medium", children: "Roles" }),
              l.map((_) => /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
                /* @__PURE__ */ e(
                  f,
                  {
                    disabled: !s.edit,
                    checked: v.data.roles.includes(_),
                    onCheckedChange: (D) => v.setData("roles", D ? [...v.data.roles, _] : v.data.roles.filter((S) => S !== _))
                  }
                ),
                _
              ] }, _))
            ] }),
            s.edit && /* @__PURE__ */ e(u, { type: "submit", disabled: v.processing, children: "Save" })
          ] }) })
        ] }),
        t && /* @__PURE__ */ n(r, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(y, { children: "Account" }) }),
          /* @__PURE__ */ n(d, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            /* @__PURE__ */ n("p", { children: [
              "Email ",
              t.email_verified ? "verified" : "not verified"
            ] }),
            t.google && /* @__PURE__ */ n("p", { children: [
              "Google: ",
              t.google
            ] }),
            s.edit && /* @__PURE__ */ e(u, { variant: "outline", size: "sm", onClick: () => C("password-reset"), children: "Send a password reset link" }),
            s.edit && !t.email_verified && /* @__PURE__ */ e(u, { variant: "outline", size: "sm", onClick: () => C("verify"), children: "Mark email verified" })
          ] })
        ] }),
        s.delete && !c.anonymized && /* @__PURE__ */ n(r, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(y, { children: "Remove personal data" }) }),
          /* @__PURE__ */ n(d, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "Name, email, phone and addresses are deleted; orders keep their amounts." }),
            $ ? /* @__PURE__ */ n("div", { className: "cm:flex cm:gap-2", children: [
              /* @__PURE__ */ e(u, { variant: "destructive", size: "sm", onClick: () => C("anonymize"), children: "Remove for good" }),
              /* @__PURE__ */ e(u, { variant: "outline", size: "sm", onClick: () => N(!1), children: "Cancel" })
            ] }) : /* @__PURE__ */ e(u, { variant: "outline", size: "sm", onClick: () => N(!0), children: "Anonymize" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function be({ title: c, description: t, action: l }) {
  return /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-col cm:items-center cm:gap-2 cm:rounded-lg cm:border cm:border-dashed cm:px-6 cm:py-10 cm:text-center", children: [
    /* @__PURE__ */ e("p", { className: "cm:font-medium", children: c }),
    t && /* @__PURE__ */ e("p", { className: "cm:max-w-md cm:text-sm cm:text-muted-foreground", children: t }),
    l && /* @__PURE__ */ e("div", { className: "cm:mt-2", children: l })
  ] });
}
function ze({ mode: c, setup: t, health: l, kpis: i, todo: s }) {
  const { Card: r, CardContent: d, CardHeader: m, CardTitle: y, CardDescription: u } = T, { Link: k } = P;
  K();
  const x = t.filter((f) => !f.done), h = l.filter((f) => f.status !== "ok"), g = Object.entries(ee.dashboardWidgets());
  return /* @__PURE__ */ n("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(G, { title: "Store", description: /* @__PURE__ */ n(U, { children: [
      "Selling mode: ",
      c.label
    ] }) }),
    x.length > 0 && /* @__PURE__ */ n(r, { children: [
      /* @__PURE__ */ n(m, { children: [
        /* @__PURE__ */ e(y, { children: "Set up your store" }),
        /* @__PURE__ */ n(u, { children: [
          t.length - x.length,
          " of ",
          t.length,
          " done"
        ] })
      ] }),
      /* @__PURE__ */ e(d, { className: "cm:grid cm:gap-2", children: t.map((f) => /* @__PURE__ */ n(k, { href: w(f.href), className: "cm:flex cm:items-start cm:gap-3 cm:rounded-md cm:p-2 cm:hover:bg-muted", children: [
        /* @__PURE__ */ e("span", { "aria-hidden": !0, className: f.done ? "cm:text-emerald-600" : "cm:text-muted-foreground", children: f.done ? "✓" : "○" }),
        /* @__PURE__ */ n("span", { className: "cm:grid", children: [
          /* @__PURE__ */ e("span", { className: f.done ? "cm:text-muted-foreground cm:line-through" : "cm:font-medium", children: f.label }),
          f.description && /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: f.description })
        ] })
      ] }, f.key)) })
    ] }),
    h.length > 0 && /* @__PURE__ */ n(r, { children: [
      /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(y, { children: "Needs attention" }) }),
      /* @__PURE__ */ e(d, { className: "cm:grid cm:gap-3", children: h.map((f) => /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
          /* @__PURE__ */ e(j, { tone: f.status, children: f.status === "error" ? "Problem" : "Warning" }),
          /* @__PURE__ */ e("span", { className: "cm:font-medium", children: f.label })
        ] }),
        /* @__PURE__ */ e("p", { className: "cm:text-sm", children: f.message }),
        f.fix && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: f.fix })
      ] }, f.key)) })
    ] }),
    /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2 cm:lg:grid-cols-4", children: i === void 0 ? [0, 1, 2, 3].map((f) => /* @__PURE__ */ e("div", { className: "cm:h-24 cm:animate-pulse cm:rounded-lg cm:bg-muted" }, f)) : i.map((f) => /* @__PURE__ */ e(r, { children: /* @__PURE__ */ n(d, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
      /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: f.label }),
      /* @__PURE__ */ e("span", { className: "cm:text-2xl cm:font-semibold", children: f.value }),
      f.hint && /* @__PURE__ */ e("span", { className: "cm:text-xs cm:text-muted-foreground", children: f.hint })
    ] }) }, f.key)) }),
    /* @__PURE__ */ n(r, { children: [
      /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(y, { children: "To do" }) }),
      /* @__PURE__ */ e(d, { children: s === void 0 ? /* @__PURE__ */ e("div", { className: "cm:h-16 cm:animate-pulse cm:rounded-md cm:bg-muted" }) : s.length === 0 ? /* @__PURE__ */ e(be, { title: "Nothing to do", description: "Orders to process and payments to verify show up here." }) : /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1", children: s.map((f) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ n(k, { href: w(f.href), className: "cm:flex cm:justify-between cm:rounded-md cm:p-2 cm:hover:bg-muted", children: [
        /* @__PURE__ */ e("span", { children: f.label }),
        /* @__PURE__ */ e("span", { className: "cm:font-semibold", children: f.count })
      ] }) }, f.key)) }) })
    ] }),
    g.map(([f, p]) => /* @__PURE__ */ e(p, {}, f))
  ] });
}
const Ue = { in_stock: "ok", out_of_stock: "error", backorder: "warning" };
function He({ row: c, reasons: t, onClose: l }) {
  const { Dialog: i, DialogContent: s, DialogHeader: r, DialogTitle: d, DialogDescription: m, DialogFooter: y, Button: u, Input: k, Label: x } = T, h = P.useForm({ mode: "add", quantity: 0, reason: "manual", note: "" }), [g, f] = q.useState(null);
  q.useEffect(() => {
    Q(w(`commerce/inventory/${c.id}/history`)).then((a) => f(a.data)).catch(() => f([]));
  }, [c.id]);
  const p = h.data.mode === "set" ? h.data.quantity : (c.stock_quantity ?? 0) + h.data.quantity;
  return /* @__PURE__ */ e(i, { open: !0, onOpenChange: (a) => !a && l(), children: /* @__PURE__ */ n(s, { className: "cm:max-w-lg", children: [
    /* @__PURE__ */ n(r, { children: [
      /* @__PURE__ */ e(d, { children: "Adjust stock" }),
      /* @__PURE__ */ n(m, { children: [
        c.product_title,
        c.sku ? ` · ${c.sku}` : "",
        ". Now: ",
        c.track_stock ? c.stock_quantity ?? 0 : "not tracked",
        "."
      ] })
    ] }),
    /* @__PURE__ */ n("form", { id: "adjust-stock", className: "cm:grid cm:gap-3", onSubmit: (a) => {
      a.preventDefault(), h.post(w(`commerce/inventory/${c.id}/adjust`), { preserveScroll: !0, onSuccess: l });
    }, children: [
      /* @__PURE__ */ n("div", { className: "cm:grid cm:grid-cols-2 cm:gap-3", children: [
        /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(x, { htmlFor: "adjust-mode", children: "Change" }),
          /* @__PURE__ */ n("select", { id: "adjust-mode", className: "cm:h-9 cm:rounded-md cm:border cm:bg-background cm:px-3 cm:text-sm", value: h.data.mode, onChange: (a) => h.setData("mode", a.target.value), children: [
            /* @__PURE__ */ e("option", { value: "add", children: "Add or remove" }),
            /* @__PURE__ */ e("option", { value: "set", children: "Set to" })
          ] })
        ] }),
        /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(x, { htmlFor: "adjust-quantity", children: h.data.mode === "set" ? "New stock" : "Units (+/−)" }),
          /* @__PURE__ */ e(k, { id: "adjust-quantity", type: "number", value: h.data.quantity, onChange: (a) => h.setData("quantity", Number(a.target.value)) }),
          h.errors.quantity && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-destructive", children: h.errors.quantity })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:grid-cols-2 cm:gap-3", children: [
        /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(x, { htmlFor: "adjust-reason", children: "Reason" }),
          /* @__PURE__ */ e("select", { id: "adjust-reason", className: "cm:h-9 cm:rounded-md cm:border cm:bg-background cm:px-3 cm:text-sm", value: h.data.reason, onChange: (a) => h.setData("reason", a.target.value), children: t.map((a) => /* @__PURE__ */ e("option", { value: a, children: a[0].toUpperCase() + a.slice(1) }, a)) })
        ] }),
        /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(x, { htmlFor: "adjust-note", children: "Note" }),
          /* @__PURE__ */ e(k, { id: "adjust-note", value: h.data.note, onChange: (a) => h.setData("note", a.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ n("p", { className: "cm:text-sm", children: [
        "Stock after: ",
        /* @__PURE__ */ e("strong", { children: p })
      ] })
    ] }),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:max-h-56 cm:gap-1 cm:overflow-auto cm:border-t cm:pt-3 cm:text-sm", children: [
      /* @__PURE__ */ e("p", { className: "cm:font-medium", children: "History" }),
      g === null ? /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "Loading…" }) : g.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "No changes yet." }) : g.map((a) => /* @__PURE__ */ n("div", { className: "cm:flex cm:justify-between cm:gap-3", children: [
        /* @__PURE__ */ n("span", { children: [
          a.delta > 0 ? `+${a.delta}` : a.delta,
          " → ",
          a.quantity_after,
          " · ",
          a.reason,
          a.reference ? ` (${a.reference.type} #${a.reference.id})` : "",
          a.note ? ` · ${a.note}` : ""
        ] }),
        /* @__PURE__ */ n("span", { className: "cm:whitespace-nowrap cm:text-muted-foreground", children: [
          a.user ? `${a.user}, ` : "",
          new Date(a.at).toLocaleString()
        ] })
      ] }, a.id))
    ] }),
    /* @__PURE__ */ n(y, { children: [
      /* @__PURE__ */ e(u, { variant: "outline", type: "button", onClick: l, children: "Cancel" }),
      /* @__PURE__ */ e(u, { type: "submit", form: "adjust-stock", disabled: h.processing, children: "Save" })
    ] })
  ] }) });
}
function Ke(c) {
  const { DataTable: t } = ne, [l, i] = q.useState(null);
  return K(), L.useBreadcrumbs([{ label: "Shop", href: w("commerce") }, { label: "Inventory" }]), /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(G, { title: "Inventory", description: "Stock of every product variant. Every change is recorded." }),
    /* @__PURE__ */ e(
      t,
      {
        ...c,
        searchPlaceholder: "Search products or SKUs…",
        onRowClick: c.can.adjust ? (s) => i(s) : void 0,
        renderCell: (s, r) => {
          if (r.key === "status") return /* @__PURE__ */ e(j, { tone: s.low ? "warning" : Ue[s.status], children: s.low ? "Low" : s.status.replace(/_/g, " ") });
          if (r.key === "stock_quantity") return s.track_stock ? s.stock_quantity : /* @__PURE__ */ e("span", { className: "cm:text-muted-foreground", children: "—" });
        }
      }
    ),
    l && /* @__PURE__ */ e(He, { row: l, reasons: c.reasons, onClose: () => i(null) })
  ] });
}
function te({
  value: c,
  onChange: t,
  id: l,
  placeholder: i,
  allowNull: s = !0,
  invalid: r
}) {
  const { Input: d } = T, m = (h) => h == null ? "" : re(h).replace(/^[^\d-]+|[^\d]+$/g, ""), [y, u] = q.useState(m(c)), [k, x] = q.useState(!1);
  return q.useEffect(() => {
    k || u(m(c));
  }, [c, k]), /* @__PURE__ */ e(
    d,
    {
      id: l,
      inputMode: "decimal",
      value: y,
      placeholder: i,
      "aria-invalid": r || void 0,
      onFocus: () => x(!0),
      onChange: (h) => {
        u(h.target.value);
        const g = h.target.value.trim() === "" ? s ? null : 0 : De(h.target.value);
        (g !== null || h.target.value.trim() === "") && t(g);
      },
      onBlur: () => {
        x(!1), u(m(c));
      }
    }
  );
}
const Ne = [
  { key: "province_code", label: "Province" },
  { key: "city_code", label: "City / regency" },
  { key: "district_code", label: "District" },
  { key: "village_code", label: "Village" }
], We = { province: 1, city: 2, district: 3, village: 4 }, ue = /* @__PURE__ */ new Map();
function Qe(c, t) {
  const l = t ? `${c}?parent=${encodeURIComponent(t)}` : c;
  return ue.has(l) || ue.set(l, Q(l).then((i) => i.data).catch(() => (ue.delete(l), []))), ue.get(l);
}
const _e = "cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm cm:disabled:opacity-50";
function Te({ field: c, value: t, onChange: l, pathPrefix: i }) {
  const { Label: s } = T, r = c.config ?? {}, d = String(r.api ?? ""), m = We[r.depth ?? "district"] ?? 3, y = r.country_options ?? [], u = { country: "ID", province_code: null, city_code: null, district_code: null, village_code: null, ...t ?? {} }, k = Ne.slice(0, m), [x, h] = q.useState({}), g = [null, u.province_code, u.city_code, u.district_code];
  q.useEffect(() => {
    u.country !== "ID" || !d || k.forEach((p, a) => {
      const v = g[a];
      a > 0 && !v || Qe(d, v).then(($) => h((N) => ({ ...N, [p.key]: $ })));
    });
  }, [d, u.country, u.province_code, u.city_code, u.district_code]);
  const f = (p, a) => {
    const v = { ...u };
    v[k[p].key] = a || null, Ne.slice(p + 1).forEach(($) => {
      v[$.key] = null;
    }), l(v);
  };
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    y.length > 0 && /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(s, { htmlFor: `${i}-country`, children: "Country" }),
      /* @__PURE__ */ e(
        "select",
        {
          id: `${i}-country`,
          className: _e,
          value: u.country,
          onChange: (p) => l({ country: p.target.value, province_code: null, city_code: null, district_code: null, village_code: null }),
          children: y.map((p) => /* @__PURE__ */ e("option", { value: p.value, children: p.label }, p.value))
        }
      )
    ] }),
    u.country === "ID" && k.map((p, a) => /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(s, { htmlFor: `${i}-${p.key}`, children: p.label }),
      /* @__PURE__ */ n(
        "select",
        {
          id: `${i}-${p.key}`,
          className: _e,
          value: u[p.key] ?? "",
          disabled: a > 0 && !g[a],
          onChange: (v) => f(a, v.target.value),
          children: [
            /* @__PURE__ */ e("option", { value: "", children: "Choose…" }),
            (x[p.key] ?? []).map((v) => /* @__PURE__ */ e("option", { value: v.code, children: v.name }, v.code))
          ]
        }
      )
    ] }, p.key))
  ] });
}
function Ge({ mode: c, order: t, paymentMethods: l, canOverride: i, variantsUrl: s, previewUrl: r, submitUrl: d }) {
  const { Card: m, CardContent: y, CardHeader: u, CardTitle: k, Button: x, Input: h, Label: g, Checkbox: f, Textarea: p } = T;
  K(), L.useBreadcrumbs([
    { label: "Shop", href: w("commerce") },
    { label: "Orders", href: w("commerce/orders") },
    ...t ? [{ label: t.number, href: w(`commerce/orders/${t.id}`) }] : [],
    { label: c === "create" ? "New order" : c === "quote" ? "Quote" : "Edit items" }
  ]);
  const a = P.useForm({
    email: "",
    name: "",
    phone: "",
    lines: t?.lines ?? [],
    shipping: t?.shipping ?? { label: "", cost: 0 },
    discount: t?.discount ?? { label: "", amount: 0 },
    shipping_address: { name: "", phone: "", country: "ID", province_code: null, city_code: null, district_code: null, village_code: null, line1: "", line2: "", postal_code: "" },
    payment_status: "unpaid",
    payment_method: l[0]?.value ?? "",
    reference: "",
    note: "",
    send_link: !1,
    notify: !1,
    valid_until: t?.valid_until ?? "",
    send: !0
  }), v = a.errors, [$, N] = q.useState(""), [C, _] = q.useState([]), [D, S] = q.useState(null);
  q.useEffect(() => {
    if ($.trim().length < 2) {
      _([]);
      return;
    }
    const b = setTimeout(() => Q(`${w(s)}&q=${encodeURIComponent($)}`).then((R) => _(R.data)).catch(() => _([])), 250);
    return () => clearTimeout(b);
  }, [$]), q.useEffect(() => {
    if (a.data.lines.length === 0) {
      S(null);
      return;
    }
    const b = setTimeout(() => {
      Q(w(r), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        lines: a.data.lines.map(({ item_id: R, variant_id: I, quantity: z, unit_price: ce }) => ({ item_id: R, variant_id: I, quantity: z, unit_price: ce })),
        shipping: a.data.shipping,
        discount: a.data.discount,
        shipping_address: c === "create" ? a.data.shipping_address : void 0
      }) }).then(S).catch(() => S(null));
    }, 300);
    return () => clearTimeout(b);
  }, [JSON.stringify([a.data.lines, a.data.shipping, a.data.discount, a.data.shipping_address])]);
  const M = (b) => {
    const R = a.data.lines.findIndex((I) => I.variant_id === b.id && !I.item_id);
    a.setData("lines", R >= 0 ? a.data.lines.map((I, z) => z === R ? { ...I, quantity: I.quantity + 1 } : I) : [...a.data.lines, { variant_id: b.id, label: b.label, sku: b.sku, quantity: 1, price: b.price, unit_price: null }]), N(""), _([]);
  }, se = (b, R) => a.setData("lines", a.data.lines.map((I, z) => z === b ? { ...I, ...R } : I)), pe = (b) => {
    b.preventDefault(), a.transform((R) => ({ ...R, lines: R.lines.map(({ item_id: I, variant_id: z, quantity: ce, unit_price: W }) => ({ item_id: I, variant_id: z, quantity: ce, unit_price: W })) })), c === "create" ? a.post(w(d)) : a.put(w(d));
  }, de = (b) => D?.lines.find((R) => R.variant_id === b);
  return /* @__PURE__ */ n("form", { onSubmit: pe, className: "cm:mx-auto cm:grid cm:w-full cm:max-w-5xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      G,
      {
        title: c === "create" ? "New order" : c === "quote" ? `Quote ${t?.number}` : `Edit ${t?.number}`,
        description: c === "edit" ? "Existing lines keep their price; new lines use today's price. The stock difference is reserved or given back." : c === "quote" ? `For ${t?.customer}. Set the prices, shipping and discount, then send it.` : "An order for a customer, from a chat or a call."
      }
    ),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[2fr_1fr]", children: [
      /* @__PURE__ */ n("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ n(m, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(k, { children: "Products" }) }),
          /* @__PURE__ */ n(y, { className: "cm:grid cm:gap-3", children: [
            /* @__PURE__ */ n("div", { className: "cm:relative", children: [
              /* @__PURE__ */ e(h, { placeholder: "Search products by name or SKU…", value: $, onChange: (b) => N(b.target.value), "aria-label": "Search products" }),
              C.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-10 cm:mt-1 cm:max-h-64 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: C.map((b) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ e("button", { type: "button", className: "cm:flex cm:w-full cm:justify-between cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted", onClick: () => M(b), children: /* @__PURE__ */ n("span", { children: [
                b.label,
                b.sku ? /* @__PURE__ */ n("span", { className: "cm:text-muted-foreground", children: [
                  " · ",
                  b.sku
                ] }) : null
              ] }) }) }, b.id)) })
            ] }),
            v.lines && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-destructive", children: v.lines }),
            a.data.lines.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No products yet." }) : /* @__PURE__ */ e("ul", { className: "cm:divide-y cm:divide-border", children: a.data.lines.map((b, R) => /* @__PURE__ */ n("li", { className: "cm:grid cm:items-center cm:gap-2 cm:py-2 cm:sm:grid-cols-[1fr_5rem_9rem_7rem_auto]", children: [
              /* @__PURE__ */ n("div", { className: "cm:min-w-0 cm:text-sm", children: [
                /* @__PURE__ */ e("p", { className: "cm:font-medium", children: b.label }),
                b.sku && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: b.sku })
              ] }),
              /* @__PURE__ */ e(h, { type: "number", min: 1, "aria-label": "Quantity", value: b.quantity, onChange: (I) => se(R, { quantity: Math.max(1, Number(I.target.value)) }) }),
              i ? /* @__PURE__ */ e(te, { value: b.unit_price, placeholder: de(b.variant_id)?.unit_price_formatted ?? "", onChange: (I) => se(R, { unit_price: I }) }) : /* @__PURE__ */ e("span", { className: "cm:text-sm", children: de(b.variant_id)?.unit_price_formatted ?? "…" }),
              /* @__PURE__ */ e("span", { className: "cm:text-sm cm:font-medium cm:sm:text-right", children: de(b.variant_id)?.total ?? "" }),
              /* @__PURE__ */ e(x, { type: "button", variant: "ghost", size: "sm", "aria-label": "Remove", onClick: () => a.setData("lines", a.data.lines.filter((I, z) => z !== R)), children: "×" })
            ] }, `${b.item_id ?? "n"}-${b.variant_id}-${R}`)) }),
            D?.notices.map((b, R) => /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-amber-700", children: b }, R))
          ] })
        ] }),
        c === "create" && /* @__PURE__ */ n(m, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(k, { children: "Customer" }) }),
          /* @__PURE__ */ n(y, { className: "cm:grid cm:gap-3 cm:sm:grid-cols-3", children: [
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(g, { htmlFor: "m-email", children: "Email *" }),
              /* @__PURE__ */ e(h, { id: "m-email", type: "email", value: a.data.email, onChange: (b) => a.setData("email", b.target.value) }),
              v.email && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-destructive", children: v.email })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(g, { htmlFor: "m-name", children: "Name" }),
              /* @__PURE__ */ e(h, { id: "m-name", value: a.data.name, onChange: (b) => a.setData("name", b.target.value) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(g, { htmlFor: "m-phone", children: "Phone" }),
              /* @__PURE__ */ e(h, { id: "m-phone", value: a.data.phone, onChange: (b) => a.setData("phone", b.target.value) })
            ] })
          ] })
        ] }),
        c === "create" && (D?.needs_shipping ?? !0) && /* @__PURE__ */ n(m, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(k, { children: "Shipping address" }) }),
          /* @__PURE__ */ n(y, { className: "cm:grid cm:gap-3", children: [
            /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: ["name", "phone"].map((b) => /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(g, { htmlFor: `a-${b}`, children: b === "name" ? "Recipient" : "Phone" }),
              /* @__PURE__ */ e(h, { id: `a-${b}`, value: String(a.data.shipping_address[b] ?? ""), onChange: (R) => a.setData("shipping_address", { ...a.data.shipping_address, [b]: R.target.value }) })
            ] }, b)) }),
            /* @__PURE__ */ e(
              Te,
              {
                field: { handle: "region", type: "commerce_region", label: "Region", config: { depth: "village" } },
                pathPrefix: "shipping_address",
                value: a.data.shipping_address,
                onChange: (b) => a.setData("shipping_address", { ...a.data.shipping_address, ...b ?? {} })
              }
            ),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(g, { htmlFor: "a-line1", children: "Street address" }),
              /* @__PURE__ */ e(h, { id: "a-line1", value: String(a.data.shipping_address.line1 ?? ""), onChange: (b) => a.setData("shipping_address", { ...a.data.shipping_address, line1: b.target.value }) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1 cm:sm:w-48", children: [
              /* @__PURE__ */ e(g, { htmlFor: "a-postal", children: "Postal code" }),
              /* @__PURE__ */ e(h, { id: "a-postal", value: String(a.data.shipping_address.postal_code ?? ""), onChange: (b) => a.setData("shipping_address", { ...a.data.shipping_address, postal_code: b.target.value }) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ n(m, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(k, { children: "Shipping and discount" }) }),
          /* @__PURE__ */ n(y, { className: "cm:grid cm:gap-3", children: [
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(g, { htmlFor: "s-label", children: "Shipping method" }),
              /* @__PURE__ */ e(h, { id: "s-label", placeholder: "JNE REG", value: a.data.shipping.label, onChange: (b) => a.setData("shipping", { ...a.data.shipping, label: b.target.value }) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(g, { htmlFor: "s-cost", children: "Shipping cost" }),
              /* @__PURE__ */ e(te, { id: "s-cost", allowNull: !1, value: a.data.shipping.cost, onChange: (b) => a.setData("shipping", { ...a.data.shipping, cost: b ?? 0 }) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(g, { htmlFor: "d-label", children: "Discount label" }),
              /* @__PURE__ */ e(h, { id: "d-label", value: a.data.discount.label, onChange: (b) => a.setData("discount", { ...a.data.discount, label: b.target.value }) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(g, { htmlFor: "d-amount", children: "Discount" }),
              /* @__PURE__ */ e(te, { id: "d-amount", allowNull: !1, value: a.data.discount.amount, onChange: (b) => a.setData("discount", { ...a.data.discount, amount: b ?? 0 }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ n(m, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(k, { children: "Total" }) }),
          /* @__PURE__ */ e(y, { className: "cm:grid cm:gap-1 cm:text-sm", children: D ? /* @__PURE__ */ n(U, { children: [
            /* @__PURE__ */ n("p", { className: "cm:flex cm:justify-between", children: [
              /* @__PURE__ */ e("span", { children: "Subtotal" }),
              /* @__PURE__ */ e("span", { children: D.totals.subtotal })
            ] }),
            /* @__PURE__ */ n("p", { className: "cm:flex cm:justify-between", children: [
              /* @__PURE__ */ e("span", { children: "Discount" }),
              /* @__PURE__ */ n("span", { children: [
                "−",
                D.totals.discount
              ] })
            ] }),
            /* @__PURE__ */ n("p", { className: "cm:flex cm:justify-between", children: [
              /* @__PURE__ */ e("span", { children: "Shipping" }),
              /* @__PURE__ */ e("span", { children: D.totals.shipping })
            ] }),
            /* @__PURE__ */ n("p", { className: "cm:flex cm:justify-between cm:text-base cm:font-semibold", children: [
              /* @__PURE__ */ e("span", { children: "Total" }),
              /* @__PURE__ */ e("span", { children: D.totals.total })
            ] })
          ] }) : /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "Add products to see the total." }) })
        ] }),
        c === "create" && /* @__PURE__ */ n(m, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(k, { children: "Payment" }) }),
          /* @__PURE__ */ n(y, { className: "cm:grid cm:gap-3 cm:text-sm", children: [
            ["unpaid", "paid"].map((b) => /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e("input", { type: "radio", name: "payment_status", checked: a.data.payment_status === b, onChange: () => a.setData("payment_status", b) }),
              b === "unpaid" ? "Unpaid: the customer pays later" : "Paid already"
            ] }, b)),
            l.length > 0 && /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(g, { htmlFor: "p-method", children: "Method" }),
              /* @__PURE__ */ n("select", { id: "p-method", className: "cm:h-9 cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3", value: a.data.payment_method, onChange: (b) => a.setData("payment_method", b.target.value), children: [
                /* @__PURE__ */ e("option", { value: "", children: "—" }),
                l.map((b) => /* @__PURE__ */ e("option", { value: b.value, children: b.label }, b.value))
              ] })
            ] }),
            a.data.payment_status === "paid" ? /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(g, { htmlFor: "p-ref", children: "Reference" }),
              /* @__PURE__ */ e(h, { id: "p-ref", value: a.data.reference, onChange: (b) => a.setData("reference", b.target.value) })
            ] }) : /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e(f, { checked: a.data.send_link, onCheckedChange: (b) => a.setData("send_link", b === !0) }),
              " Email the customer the link to pay"
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(g, { htmlFor: "m-note", children: "Internal note" }),
              /* @__PURE__ */ e(p, { id: "m-note", value: a.data.note, onChange: (b) => a.setData("note", b.target.value) })
            ] })
          ] })
        ] }),
        c === "quote" && /* @__PURE__ */ n(m, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(k, { children: "Validity" }) }),
          /* @__PURE__ */ n(y, { className: "cm:grid cm:gap-3 cm:text-sm", children: [
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(g, { htmlFor: "q-valid", children: "Valid until" }),
              /* @__PURE__ */ e(h, { id: "q-valid", type: "date", value: a.data.valid_until, onChange: (b) => a.setData("valid_until", b.target.value) }),
              v.valid_until && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-destructive", children: v.valid_until })
            ] }),
            /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e(f, { checked: a.data.send, onCheckedChange: (b) => a.setData("send", b === !0) }),
              " Send it to the customer now"
            ] })
          ] })
        ] }),
        c === "edit" && /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
          /* @__PURE__ */ e(f, { checked: a.data.notify, onCheckedChange: (b) => a.setData("notify", b === !0) }),
          " Tell the customer about the change"
        ] }),
        /* @__PURE__ */ e(x, { type: "submit", disabled: a.processing || a.data.lines.length === 0, children: c === "create" ? "Create order" : c === "quote" ? a.data.send ? "Send quote" : "Save quote" : "Save changes" })
      ] })
    ] })
  ] });
}
function Ve({ order: c, couriers: t, onClose: l }) {
  const { Dialog: i, DialogContent: s, DialogFooter: r, DialogHeader: d, DialogTitle: m, Button: y, Input: u, Label: k } = T, x = c.items.filter((p) => p.unfulfilled > 0), h = P.useForm({
    courier: t[0]?.key ?? "",
    courier_name: "",
    service: "",
    tracking_number: "",
    items: x.map((p) => ({ order_item_id: p.id, quantity: p.unfulfilled }))
  }), g = h.errors;
  return /* @__PURE__ */ e(i, { open: !0, onOpenChange: (p) => !p && l(), children: /* @__PURE__ */ n(s, { children: [
    /* @__PURE__ */ e(d, { children: /* @__PURE__ */ e(m, { children: "Add a shipment" }) }),
    /* @__PURE__ */ n("form", { className: "cm:grid cm:gap-3", onSubmit: (p) => {
      p.preventDefault(), h.post(w(`commerce/orders/${c.id}/shipments`), { preserveScroll: !0, onSuccess: l });
    }, children: [
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(k, { htmlFor: "s-courier", children: "Courier" }),
        /* @__PURE__ */ n("select", { id: "s-courier", className: "cm:h-9 cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm", value: h.data.courier, onChange: (p) => h.setData("courier", p.target.value), children: [
          t.map((p) => /* @__PURE__ */ e("option", { value: p.key, children: p.name }, p.key)),
          /* @__PURE__ */ e("option", { value: "", children: "Other…" })
        ] })
      ] }),
      h.data.courier === "" && /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(k, { htmlFor: "s-name", children: "Courier name" }),
        /* @__PURE__ */ e(u, { id: "s-name", value: h.data.courier_name, onChange: (p) => h.setData("courier_name", p.target.value) })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(k, { htmlFor: "s-service", children: "Service" }),
        /* @__PURE__ */ e(u, { id: "s-service", placeholder: "REG, YES…", value: h.data.service, onChange: (p) => h.setData("service", p.target.value) })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(k, { htmlFor: "s-tracking", children: "Tracking number" }),
        /* @__PURE__ */ e(u, { id: "s-tracking", value: h.data.tracking_number, onChange: (p) => h.setData("tracking_number", p.target.value) })
      ] }),
      /* @__PURE__ */ n("fieldset", { className: "cm:grid cm:gap-2", children: [
        /* @__PURE__ */ e("legend", { className: "cm:mb-1 cm:text-sm cm:font-medium", children: "In this parcel" }),
        x.map((p, a) => /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:text-sm", children: [
          /* @__PURE__ */ n("span", { children: [
            p.name,
            p.variant_title ? ` · ${p.variant_title}` : "",
            " ",
            /* @__PURE__ */ n("span", { className: "cm:text-muted-foreground", children: [
              "(",
              p.unfulfilled,
              " left)"
            ] })
          ] }),
          /* @__PURE__ */ e(
            u,
            {
              type: "number",
              min: 0,
              max: p.unfulfilled,
              className: "cm:w-20",
              value: h.data.items[a].quantity,
              onChange: (v) => h.setData("items", h.data.items.map(($, N) => N === a ? { ...$, quantity: Number(v.target.value) } : $))
            }
          )
        ] }, p.id)),
        g.items && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-destructive", children: g.items })
      ] }),
      /* @__PURE__ */ n(r, { children: [
        /* @__PURE__ */ e(y, { type: "button", variant: "outline", onClick: l, children: "Cancel" }),
        /* @__PURE__ */ e(y, { type: "submit", disabled: h.processing, children: "Save shipment" })
      ] })
    ] })
  ] }) });
}
function Je({ order: c, onClose: t }) {
  const { Dialog: l, DialogContent: i, DialogFooter: s, DialogHeader: r, DialogTitle: d, DialogDescription: m, Button: y, Input: u, Label: k, Checkbox: x } = T, h = P.useForm({
    amount: c.totals.refundable,
    reason: "",
    restock: !1,
    items: c.items.map((f) => ({ order_item_id: f.id, quantity: 0 }))
  }), g = h.errors;
  return /* @__PURE__ */ e(l, { open: !0, onOpenChange: (f) => !f && t(), children: /* @__PURE__ */ n(i, { children: [
    /* @__PURE__ */ n(r, { children: [
      /* @__PURE__ */ e(d, { children: "Refund" }),
      /* @__PURE__ */ e(m, { children: "Record money you returned to the customer." })
    ] }),
    /* @__PURE__ */ n("form", { className: "cm:grid cm:gap-3", onSubmit: (f) => {
      f.preventDefault(), h.post(w(`commerce/orders/${c.id}/refunds`), { preserveScroll: !0, onSuccess: t });
    }, children: [
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(k, { htmlFor: "r-amount", children: "Amount" }),
        /* @__PURE__ */ e(te, { id: "r-amount", value: h.data.amount, onChange: (f) => h.setData("amount", f) }),
        g.amount && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-destructive", children: g.amount })
      ] }),
      /* @__PURE__ */ n("fieldset", { className: "cm:grid cm:gap-2", children: [
        /* @__PURE__ */ e("legend", { className: "cm:mb-1 cm:text-sm cm:font-medium", children: "Items returned (optional)" }),
        c.items.map((f, p) => /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:text-sm", children: [
          /* @__PURE__ */ n("span", { children: [
            f.name,
            f.variant_title ? ` · ${f.variant_title}` : ""
          ] }),
          /* @__PURE__ */ e(
            u,
            {
              type: "number",
              min: 0,
              max: f.quantity - f.refunded_quantity,
              className: "cm:w-20",
              value: h.data.items[p].quantity,
              onChange: (a) => h.setData("items", h.data.items.map((v, $) => $ === p ? { ...v, quantity: Number(a.target.value) } : v))
            }
          )
        ] }, f.id))
      ] }),
      /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
        /* @__PURE__ */ e(x, { checked: h.data.restock, onCheckedChange: (f) => h.setData("restock", f === !0) }),
        " Put the returned items back in stock"
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(k, { htmlFor: "r-reason", children: "Reason" }),
        /* @__PURE__ */ e(u, { id: "r-reason", value: h.data.reason, onChange: (f) => h.setData("reason", f.target.value) })
      ] }),
      /* @__PURE__ */ n(s, { children: [
        /* @__PURE__ */ e(y, { type: "button", variant: "outline", onClick: t, children: "Cancel" }),
        /* @__PURE__ */ e(y, { type: "submit", disabled: h.processing, children: "Record refund" })
      ] })
    ] })
  ] }) });
}
const O = (c) => c ? new Date(c).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" }) : "—", oe = (c) => ({
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
})[c] ?? "neutral";
function Xe(c) {
  const { order: t, transitions: l, can: i, panels: s } = c, { Card: r, CardContent: d, CardHeader: m, CardTitle: y, Button: u, Textarea: k, Label: x, Checkbox: h, Input: g, Dialog: f, DialogContent: p, DialogFooter: a, DialogHeader: v, DialogTitle: $, DialogDescription: N } = T, { Link: C, router: _ } = P;
  K(), L.useBreadcrumbs([{ label: "Shop", href: w("commerce") }, { label: "Orders", href: w("commerce/orders") }, { label: t.number }]);
  const D = `commerce/orders/${t.id}`, [S, M] = q.useState(null), [se, pe] = q.useState(""), [de, b] = q.useState(!1), [R, I] = q.useState(!1), [z, ce] = q.useState(!1), W = P.useForm({ message: "", customer: !1 }), J = P.useForm({ reference: "", paid_at: "", account: "" }), Ie = ee.orderPanels(), xe = (o, B) => _.post(w(`${D}/transition`), { to: o, reason: B ?? null }, { preserveScroll: !0, onFinish: () => M(null) });
  return /* @__PURE__ */ n("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      G,
      {
        title: `${t.type === "quote" ? "Quote" : "Order"} ${t.number}`,
        description: /* @__PURE__ */ n(U, { children: [
          "Placed ",
          O(t.placed_at),
          " · ",
          t.channel,
          t.trashed ? " · in the trash" : ""
        ] }),
        actions: /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
          /* @__PURE__ */ e(j, { tone: oe(t.status), children: t.status_label }),
          t.type === "order" && /* @__PURE__ */ e(j, { tone: oe(t.payment_status), children: t.payment_label }),
          t.type === "order" && t.fulfillment_status !== "not_required" && /* @__PURE__ */ e(j, { tone: oe(t.fulfillment_status), children: t.fulfillment_label }),
          /* @__PURE__ */ e(u, { variant: "outline", size: "sm", asChild: !0, children: /* @__PURE__ */ e("a", { href: t.storefront_url, target: "_blank", rel: "noreferrer", children: "Customer view" }) })
        ] })
      }
    ),
    /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-wrap cm:gap-2", children: [
      l.filter((o) => o.permission).map((o) => /* @__PURE__ */ e(
        u,
        {
          size: "sm",
          variant: o.to === "cancelled" ? "outline" : "default",
          disabled: !o.allowed,
          title: o.reason ?? void 0,
          onClick: () => o.to === "cancelled" || o.to === "on_hold" ? M(o) : xe(o.to),
          children: o.to === "cancelled" ? "Cancel order" : `Mark ${o.label.toLowerCase()}`
        },
        o.to
      )),
      i.mark_paid && /* @__PURE__ */ e(u, { size: "sm", variant: "outline", onClick: () => b(!0), children: "Mark paid" }),
      i.shipments && t.items.some((o) => o.unfulfilled > 0) && /* @__PURE__ */ e(u, { size: "sm", variant: "outline", onClick: () => I(!0), children: "Add shipment" }),
      i.refund && /* @__PURE__ */ e(u, { size: "sm", variant: "outline", onClick: () => ce(!0), children: "Refund" }),
      i.send_link && /* @__PURE__ */ e(u, { size: "sm", variant: "outline", onClick: () => _.post(w(`${D}/payment-link`), {}, { preserveScroll: !0 }), children: "Send payment link" }),
      i.edit_items && /* @__PURE__ */ e(u, { size: "sm", variant: "outline", asChild: !0, children: /* @__PURE__ */ e(C, { href: w(`${D}/edit`), children: "Edit items" }) }),
      i.respond_quote && /* @__PURE__ */ e(u, { size: "sm", asChild: !0, children: /* @__PURE__ */ e(C, { href: w(`${D}/quote`), children: t.status === "quoted" ? "Edit quote" : "Send a quote" }) }),
      i.delete && !t.trashed && /* @__PURE__ */ e(
        u,
        {
          size: "sm",
          variant: "ghost",
          className: "cm:ml-auto cm:text-destructive",
          onClick: () => window.confirm("Move this order to the trash?") && _.delete(w(D)),
          children: "Trash"
        }
      ),
      i.delete && t.trashed && /* @__PURE__ */ e(u, { size: "sm", variant: "outline", className: "cm:ml-auto", onClick: () => _.post(w(`${D}/restore`)), children: "Restore" }),
      i.force_delete && /* @__PURE__ */ e(
        u,
        {
          size: "sm",
          variant: "ghost",
          className: "cm:text-destructive",
          onClick: () => window.confirm("Delete this order for good? This can't be undone.") && _.delete(w(`${D}/force`)),
          children: "Delete for good"
        }
      )
    ] }),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[2fr_1fr]", children: [
      /* @__PURE__ */ n("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ n(r, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(y, { children: "Items" }) }),
          /* @__PURE__ */ n(d, { className: "cm:grid cm:gap-4", children: [
            /* @__PURE__ */ e("ul", { className: "cm:divide-y cm:divide-border", children: t.items.map((o) => /* @__PURE__ */ n("li", { className: "cm:grid cm:gap-1 cm:py-3 cm:first:pt-0 cm:sm:grid-cols-[1fr_auto] cm:sm:gap-4", children: [
              /* @__PURE__ */ n("div", { className: "cm:min-w-0", children: [
                /* @__PURE__ */ n("p", { className: "cm:font-medium", children: [
                  o.product_href ? /* @__PURE__ */ e(C, { href: w(o.product_href), className: "cm:hover:underline", children: o.name }) : o.name,
                  o.variant_title && /* @__PURE__ */ n("span", { className: "cm:text-muted-foreground", children: [
                    " · ",
                    o.variant_title
                  ] })
                ] }),
                /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  o.sku && /* @__PURE__ */ n(U, { children: [
                    "SKU ",
                    o.sku,
                    " · "
                  ] }),
                  o.price_source.label,
                  o.requires_shipping && t.fulfillment_status !== "not_required" && /* @__PURE__ */ n(U, { children: [
                    " · shipped ",
                    o.fulfilled_quantity,
                    "/",
                    o.quantity
                  ] }),
                  o.refunded_quantity > 0 && /* @__PURE__ */ n(U, { children: [
                    " · refunded ",
                    o.refunded_quantity
                  ] })
                ] }),
                o.components.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:mt-1 cm:text-xs cm:text-muted-foreground", children: o.components.map((B, Ee) => /* @__PURE__ */ n("li", { children: [
                  B.quantity,
                  " × ",
                  B.name
                ] }, Ee)) })
              ] }),
              /* @__PURE__ */ n("div", { className: "cm:text-sm cm:sm:text-right", children: [
                /* @__PURE__ */ n("p", { children: [
                  o.quantity,
                  " × ",
                  o.regular_unit_price && /* @__PURE__ */ e("del", { className: "cm:text-muted-foreground", children: o.regular_unit_price }),
                  " ",
                  o.unit_price_formatted
                ] }),
                o.discount && /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  "−",
                  o.discount
                ] }),
                /* @__PURE__ */ e("p", { className: "cm:font-medium", children: o.total })
              ] })
            ] }, o.id)) }),
            /* @__PURE__ */ n("dl", { className: "cm:grid cm:gap-1 cm:border-t cm:pt-3 cm:text-sm", children: [
              /* @__PURE__ */ e(Z, { label: "Subtotal", value: t.totals.subtotal }),
              t.adjustments.filter((o) => o.kind !== "tax").map((o, B) => /* @__PURE__ */ e(Z, { label: `${o.label}${o.code ? ` (${o.code})` : ""}`, value: o.amount, muted: !0 }, B)),
              t.totals.shipping !== null && /* @__PURE__ */ e(Z, { label: `Shipping${t.shipping_method?.label ? ` · ${t.shipping_method.label}` : ""}`, value: t.totals.shipping }),
              t.adjustments.filter((o) => o.kind === "tax").map((o, B) => /* @__PURE__ */ e(Z, { label: `${o.label}${o.included ? " (included)" : ""}`, value: o.amount, muted: !0 }, `t${B}`)),
              /* @__PURE__ */ e(Z, { label: "Total", value: t.totals.total, strong: !0 }),
              t.type === "order" && /* @__PURE__ */ e(Z, { label: "Paid", value: t.totals.paid, muted: !0 }),
              t.totals.refunded && /* @__PURE__ */ e(Z, { label: "Refunded", value: `−${t.totals.refunded}`, muted: !0 })
            ] })
          ] })
        ] }),
        (t.payments.length > 0 || t.confirmations.length > 0) && /* @__PURE__ */ n(r, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(y, { children: "Payments" }) }),
          /* @__PURE__ */ n(d, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            t.payments.map((o) => /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2 cm:rounded-md cm:border cm:p-3", children: [
              /* @__PURE__ */ n("div", { children: [
                /* @__PURE__ */ n("p", { className: "cm:font-medium", children: [
                  o.method,
                  " · ",
                  o.amount
                ] }),
                /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  o.reference && /* @__PURE__ */ n(U, { children: [
                    "Ref ",
                    o.reference,
                    " · "
                  ] }),
                  o.paid_at ? `Paid ${O(o.paid_at)}` : o.expires_at ? `Due ${O(o.expires_at)}` : "",
                  o.refunded && ` · refunded ${o.refunded}`
                ] })
              ] }),
              /* @__PURE__ */ e(j, { tone: oe(o.status), children: o.status.replace(/_/g, " ") })
            ] }, o.id)),
            t.confirmations.map((o) => /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:justify-between cm:rounded-md cm:border cm:border-dashed cm:p-3", children: [
              /* @__PURE__ */ n("span", { children: [
                "Confirmation from ",
                o.sender_name,
                o.sender_bank ? ` (${o.sender_bank})` : "",
                " · ",
                o.amount
              ] }),
              /* @__PURE__ */ e(j, { tone: o.status === "approved" ? "ok" : o.status === "rejected" ? "error" : "warning", children: o.status })
            ] }, o.id))
          ] })
        ] }),
        t.shipments.length > 0 && /* @__PURE__ */ n(r, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(y, { children: "Shipments" }) }),
          /* @__PURE__ */ e(d, { className: "cm:grid cm:gap-2 cm:text-sm", children: t.shipments.map((o) => /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1 cm:rounded-md cm:border cm:p-3", children: [
            /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:justify-between", children: [
              /* @__PURE__ */ n("span", { className: "cm:font-medium", children: [
                o.courier,
                o.service ? ` ${o.service}` : "",
                o.tracking_number && /* @__PURE__ */ n(U, { children: [
                  " · ",
                  o.tracking_url ? /* @__PURE__ */ e("a", { href: o.tracking_url, target: "_blank", rel: "noreferrer", className: "cm:underline", children: o.tracking_number }) : o.tracking_number
                ] })
              ] }),
              /* @__PURE__ */ e(j, { tone: oe(o.status), children: o.status.replace(/_/g, " ") })
            ] }),
            /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
              o.items.map((B) => `${B.quantity} × ${B.name}`).join(", "),
              " · shipped ",
              O(o.shipped_at),
              o.delivered_at ? ` · delivered ${O(o.delivered_at)}` : ""
            ] }),
            i.shipments && o.status !== "delivered" && /* @__PURE__ */ e("div", { children: /* @__PURE__ */ e(u, { size: "sm", variant: "outline", onClick: () => _.post(w(`${D}/shipments/${o.id}/delivered`), {}, { preserveScroll: !0 }), children: "Mark delivered" }) })
          ] }, o.id)) })
        ] }),
        t.refunds.length > 0 && /* @__PURE__ */ n(r, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(y, { children: "Refunds" }) }),
          /* @__PURE__ */ e(d, { className: "cm:grid cm:gap-1 cm:text-sm", children: t.refunds.map((o) => /* @__PURE__ */ n("p", { children: [
            o.amount,
            " · ",
            O(o.created_at),
            o.reason ? ` · ${o.reason}` : "",
            o.restock ? " · restocked" : ""
          ] }, o.id)) })
        ] }),
        s.map((o) => {
          const B = Ie[o.key];
          return B ? /* @__PURE__ */ n(r, { children: [
            /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(y, { children: o.label }) }),
            /* @__PURE__ */ e(d, { children: /* @__PURE__ */ e(B, { order: t, data: o.data }) })
          ] }, o.key) : null;
        }),
        /* @__PURE__ */ n(r, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(y, { children: "Timeline" }) }),
          /* @__PURE__ */ n(d, { className: "cm:grid cm:gap-4", children: [
            i.edit && /* @__PURE__ */ n("form", { className: "cm:grid cm:gap-2", onSubmit: (o) => {
              o.preventDefault(), W.post(w(`${D}/notes`), { preserveScroll: !0, onSuccess: () => W.reset() });
            }, children: [
              /* @__PURE__ */ e(x, { htmlFor: "o-note", className: "cm:sr-only", children: "Note" }),
              /* @__PURE__ */ e(k, { id: "o-note", placeholder: "Add a note…", value: W.data.message, onChange: (o) => W.setData("message", o.target.value) }),
              /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:justify-between cm:gap-2", children: [
                /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
                  /* @__PURE__ */ e(h, { checked: W.data.customer, onCheckedChange: (o) => W.setData("customer", o === !0) }),
                  " Send to the customer"
                ] }),
                /* @__PURE__ */ e(u, { size: "sm", type: "submit", disabled: W.processing || W.data.message.trim() === "", children: "Add note" })
              ] })
            ] }),
            /* @__PURE__ */ e("ol", { className: "cm:grid cm:gap-3 cm:text-sm", children: t.timeline.map((o) => /* @__PURE__ */ n("li", { className: "cm:grid cm:gap-0.5 cm:border-l-2 cm:pl-3", style: { borderColor: o.visibility === "customer" ? "var(--color-primary, currentColor)" : void 0 }, children: [
              /* @__PURE__ */ e("span", { className: "cm:whitespace-pre-line", children: o.message }),
              /* @__PURE__ */ n("span", { className: "cm:text-xs cm:text-muted-foreground", children: [
                O(o.created_at),
                " · ",
                o.actor ?? o.source,
                o.visibility === "customer" ? " · to the customer" : ""
              ] })
            ] }, o.id)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ n(r, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(y, { children: "Customer" }) }),
          /* @__PURE__ */ n(d, { className: "cm:grid cm:gap-1 cm:text-sm", children: [
            /* @__PURE__ */ e("p", { className: "cm:font-medium", children: t.customer.href ? /* @__PURE__ */ e(C, { href: w(t.customer.href), className: "cm:hover:underline", children: t.customer.name ?? t.customer.email }) : t.customer.name ?? t.customer.email }),
            t.customer.email && /* @__PURE__ */ e("a", { href: `mailto:${t.customer.email}`, className: "cm:text-muted-foreground cm:hover:underline", children: t.customer.email }),
            t.customer.phone && /* @__PURE__ */ e("a", { href: `https://wa.me/${t.customer.phone.replace(/\D/g, "")}`, target: "_blank", rel: "noreferrer", className: "cm:text-muted-foreground cm:hover:underline", children: t.customer.phone }),
            t.customer.guest && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: "Guest checkout" })
          ] })
        ] }),
        /* @__PURE__ */ n(r, { children: [
          /* @__PURE__ */ n(m, { className: "cm:flex cm:flex-row cm:items-center cm:justify-between", children: [
            /* @__PURE__ */ e(y, { children: "Addresses" }),
            i.edit_addresses && /* @__PURE__ */ e(u, { size: "sm", variant: "ghost", asChild: !0, children: /* @__PURE__ */ e(C, { href: w(`${D}/addresses`), children: "Edit" }) })
          ] }),
          /* @__PURE__ */ n(d, { className: "cm:grid cm:gap-3 cm:text-sm", children: [
            t.pickup && /* @__PURE__ */ n("div", { children: [
              /* @__PURE__ */ e("p", { className: "cm:text-xs cm:font-medium cm:uppercase cm:text-muted-foreground", children: "Pickup" }),
              /* @__PURE__ */ n("p", { children: [
                t.pickup.name,
                /* @__PURE__ */ e("br", {}),
                t.pickup.address
              ] })
            ] }),
            t.shipping_address_text && /* @__PURE__ */ n("div", { children: [
              /* @__PURE__ */ e("p", { className: "cm:text-xs cm:font-medium cm:uppercase cm:text-muted-foreground", children: "Shipping" }),
              /* @__PURE__ */ e("p", { className: "cm:whitespace-pre-line", children: t.shipping_address_text })
            ] }),
            t.billing_address_text && t.billing_address_text !== t.shipping_address_text && /* @__PURE__ */ n("div", { children: [
              /* @__PURE__ */ e("p", { className: "cm:text-xs cm:font-medium cm:uppercase cm:text-muted-foreground", children: "Billing" }),
              /* @__PURE__ */ e("p", { className: "cm:whitespace-pre-line", children: t.billing_address_text })
            ] }),
            t.dropship && /* @__PURE__ */ n("div", { children: [
              /* @__PURE__ */ e("p", { className: "cm:text-xs cm:font-medium cm:uppercase cm:text-muted-foreground", children: "Dropshipper" }),
              /* @__PURE__ */ n("p", { children: [
                t.dropship.name,
                " · ",
                t.dropship.phone
              ] })
            ] }),
            !t.shipping_address_text && !t.billing_address_text && !t.pickup && /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "No address." })
          ] })
        ] }),
        (t.customer_note || t.fields && Object.keys(t.fields).length > 0) && /* @__PURE__ */ n(r, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(y, { children: "From the customer" }) }),
          /* @__PURE__ */ n(d, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            t.customer_note && /* @__PURE__ */ e("p", { className: "cm:whitespace-pre-line", children: t.customer_note }),
            t.fields && Object.entries(t.fields).map(([o, B]) => /* @__PURE__ */ n("p", { children: [
              /* @__PURE__ */ n("span", { className: "cm:text-muted-foreground", children: [
                o.replace(/_/g, " "),
                ":"
              ] }),
              " ",
              String(B ?? "")
            ] }, o))
          ] })
        ] }),
        /* @__PURE__ */ n(r, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(y, { children: "Details" }) }),
          /* @__PURE__ */ n(d, { className: "cm:grid cm:gap-1 cm:text-sm", children: [
            t.payment_method_title && /* @__PURE__ */ n("p", { children: [
              "Payment: ",
              t.payment_method_title
            ] }),
            t.expires_at && t.payment_status === "unpaid" && /* @__PURE__ */ n("p", { children: [
              "Pay before ",
              O(t.expires_at)
            ] }),
            t.paid_at && /* @__PURE__ */ n("p", { children: [
              "Paid ",
              O(t.paid_at)
            ] }),
            t.completed_at && /* @__PURE__ */ n("p", { children: [
              "Completed ",
              O(t.completed_at)
            ] }),
            t.cancelled_at && /* @__PURE__ */ n("p", { children: [
              "Cancelled ",
              O(t.cancelled_at),
              t.cancel_reason ? ` — ${t.cancel_reason}` : ""
            ] }),
            t.quote_valid_until && /* @__PURE__ */ n("p", { children: [
              "Quote valid until ",
              O(t.quote_valid_until)
            ] }),
            t.documents.map((o) => /* @__PURE__ */ n("p", { children: [
              o.type.replace("_", " "),
              " ",
              o.number
            ] }, o.id))
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e(f, { open: S !== null, onOpenChange: (o) => !o && M(null), children: /* @__PURE__ */ n(p, { children: [
      /* @__PURE__ */ n(v, { children: [
        /* @__PURE__ */ e($, { children: S?.to === "cancelled" ? "Cancel this order?" : "Put this order on hold?" }),
        /* @__PURE__ */ e(N, { children: S?.to === "cancelled" ? "Stock, flash sale quantities and voucher uses are given back." : "It can go back to its status later." })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(x, { htmlFor: "o-reason", children: "Reason (on the timeline)" }),
        /* @__PURE__ */ e(g, { id: "o-reason", value: se, onChange: (o) => pe(o.target.value) })
      ] }),
      /* @__PURE__ */ n(a, { children: [
        /* @__PURE__ */ e(u, { variant: "outline", onClick: () => M(null), children: "Back" }),
        /* @__PURE__ */ e(u, { onClick: () => S && xe(S.to, se), children: "Confirm" })
      ] })
    ] }) }),
    /* @__PURE__ */ e(f, { open: de, onOpenChange: b, children: /* @__PURE__ */ n(p, { children: [
      /* @__PURE__ */ n(v, { children: [
        /* @__PURE__ */ e($, { children: "Mark as paid" }),
        /* @__PURE__ */ n(N, { children: [
          "Record a payment you received outside the store (",
          t.totals.total,
          ")."
        ] })
      ] }),
      /* @__PURE__ */ n("form", { className: "cm:grid cm:gap-3", onSubmit: (o) => {
        o.preventDefault(), J.post(w(`${D}/mark-paid`), { preserveScroll: !0, onSuccess: () => b(!1) });
      }, children: [
        /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(x, { htmlFor: "p-ref", children: "Reference" }),
          /* @__PURE__ */ e(g, { id: "p-ref", value: J.data.reference, onChange: (o) => J.setData("reference", o.target.value) })
        ] }),
        /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(x, { htmlFor: "p-date", children: "Paid on" }),
          /* @__PURE__ */ e(g, { id: "p-date", type: "datetime-local", value: J.data.paid_at, onChange: (o) => J.setData("paid_at", o.target.value) })
        ] }),
        /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(x, { htmlFor: "p-acc", children: "Into account" }),
          /* @__PURE__ */ e(g, { id: "p-acc", value: J.data.account, onChange: (o) => J.setData("account", o.target.value) })
        ] }),
        /* @__PURE__ */ e(a, { children: /* @__PURE__ */ e(u, { type: "submit", disabled: J.processing, children: "Record payment" }) })
      ] })
    ] }) }),
    R && /* @__PURE__ */ e(Ve, { order: t, couriers: c.couriers, onClose: () => I(!1) }),
    z && /* @__PURE__ */ e(Je, { order: t, onClose: () => ce(!1) })
  ] });
}
function Z({ label: c, value: t, muted: l, strong: i }) {
  return /* @__PURE__ */ n("div", { className: `cm:flex cm:justify-between cm:gap-4 ${l ? "cm:text-muted-foreground" : ""} ${i ? "cm:text-base cm:font-semibold" : ""}`, children: [
    /* @__PURE__ */ e("dt", { children: c }),
    /* @__PURE__ */ e("dd", { children: t })
  ] });
}
const Ye = { published: "ok", draft: "neutral", scheduled: "info", trashed: "error" };
function Ze(c) {
  const { DataTable: t } = ne, { Button: l } = T, { Link: i } = P;
  return K(), L.useBreadcrumbs([{ label: "Shop", href: w("commerce") }, { label: "Products" }]), /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      G,
      {
        title: "Products",
        description: "Products are entries: opening one goes to the editor.",
        actions: /* @__PURE__ */ e(l, { asChild: !0, children: /* @__PURE__ */ e(i, { href: w(c.createUrl), children: "New product" }) })
      }
    ),
    /* @__PURE__ */ e(
      t,
      {
        ...c,
        searchPlaceholder: "Search titles or SKUs…",
        rowHref: (s) => w(s.href),
        renderCell: (s, r) => {
          switch (r.key) {
            case "product_title":
              return /* @__PURE__ */ n("span", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ e("span", { className: "cm:font-medium", children: s.product_title }),
                s.featured && /* @__PURE__ */ e(j, { tone: "info", children: "Featured" }),
                s.sync_failed && /* @__PURE__ */ e("span", { title: s.sync_error ?? "", children: /* @__PURE__ */ e(j, { tone: "error", children: "Can't be bought" }) })
              ] });
            case "state":
              return /* @__PURE__ */ e(j, { tone: Ye[s.state], children: s.state });
            case "stock":
              return s.stock === null ? "—" : /* @__PURE__ */ e("span", { className: s.in_stock === !1 ? "cm:text-destructive" : "", children: s.stock });
            case "type":
              return /* @__PURE__ */ e(j, { children: s.type });
            default:
              return;
          }
        }
      }
    )
  ] });
}
function je({ items: c, current: t, label: l = "Sections" }) {
  const { Link: i } = P;
  return /* @__PURE__ */ e("nav", { "aria-label": l, className: "cm:flex cm:gap-1 cm:overflow-x-auto cm:md:flex-col", children: c.map((s) => /* @__PURE__ */ e(
    i,
    {
      href: w(s.href),
      "aria-current": s.key === t ? "page" : void 0,
      className: me(
        "cm:whitespace-nowrap cm:rounded-md cm:px-3 cm:py-1.5 cm:text-sm cm:text-muted-foreground cm:hover:bg-muted cm:hover:text-foreground",
        s.key === t && "cm:bg-muted cm:font-medium cm:text-foreground"
      ),
      children: s.label
    },
    s.key
  )) });
}
function he({ sections: c, current: t, title: l, description: i, children: s }) {
  const { SettingsTabs: r } = ne;
  return K(), L.useBreadcrumbs([{ label: "Settings", href: w("settings") }, { label: "Store", href: w("commerce/settings") }, { label: l }]), /* @__PURE__ */ n("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(r, { current: "store" }),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6 cm:md:grid-cols-[12rem_1fr]", children: [
      /* @__PURE__ */ e(je, { items: c, current: t, label: "Store settings" }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:min-w-0 cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ e(G, { title: l, description: i }),
        s
      ] })
    ] })
  ] });
}
function et({ sections: c, mode: t, groups: l, updateUrl: i }) {
  const { Card: s, CardContent: r, CardHeader: d, CardTitle: m, Switch: y, Button: u, Dialog: k, DialogContent: x, DialogDescription: h, DialogFooter: g, DialogHeader: f, DialogTitle: p } = T, { errors: a } = P.usePage().props, [v, $] = q.useState(null), [N, C] = q.useState(null), _ = (D, S) => {
    C(D.key), P.router.put(i.replace("__key__", D.key), { on: S }, { preserveScroll: !0, onFinish: () => C(null) });
  };
  return /* @__PURE__ */ n(
    he,
    {
      sections: c,
      current: "features",
      title: "Features",
      description: /* @__PURE__ */ n(U, { children: [
        "Switch store modules on or off. Selling mode: ",
        /* @__PURE__ */ e("strong", { children: t.label }),
        ". Switching off never deletes data."
      ] }),
      children: [
        a.feature && /* @__PURE__ */ e("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: a.feature }),
        l.map((D) => /* @__PURE__ */ n(s, { children: [
          /* @__PURE__ */ e(d, { children: /* @__PURE__ */ e(m, { children: D.label }) }),
          /* @__PURE__ */ e(r, { className: "cm:grid cm:gap-0 cm:divide-y cm:divide-border", children: D.features.map((S) => /* @__PURE__ */ n("div", { className: "cm:flex cm:items-start cm:justify-between cm:gap-4 cm:py-3 cm:first:pt-0 cm:last:pb-0", children: [
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ e("label", { htmlFor: `feature-${S.key}`, className: "cm:font-medium", children: S.label }),
                S.core && /* @__PURE__ */ e(j, { children: "Always on" }),
                S.switched_on && !S.active && /* @__PURE__ */ n(j, { tone: "warning", children: [
                  "Off — ",
                  S.reasons.join("; ").replace(/^Needs /, "needs ")
                ] }),
                S.essential && /* @__PURE__ */ n(j, { tone: "info", children: [
                  "Needed by ",
                  t.label
                ] })
              ] }),
              /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: S.description }),
              S.requires.length > 0 && /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                "Needs: ",
                S.requires.join(", ")
              ] })
            ] }),
            /* @__PURE__ */ e(
              y,
              {
                id: `feature-${S.key}`,
                checked: S.switched_on,
                disabled: S.core || N === S.key,
                onCheckedChange: (M) => !M && S.dependents.length > 0 ? $(S) : _(S, M)
              }
            )
          ] }, S.key)) })
        ] }, D.key)),
        /* @__PURE__ */ e(k, { open: v !== null, onOpenChange: (D) => !D && $(null), children: /* @__PURE__ */ n(x, { children: [
          /* @__PURE__ */ n(f, { children: [
            /* @__PURE__ */ n(p, { children: [
              "Switch off ",
              v?.label,
              "?"
            ] }),
            /* @__PURE__ */ n(h, { children: [
              "These are switched off with it: ",
              v?.dependents.map((D) => D.label).join(", "),
              ". Their data is kept."
            ] })
          ] }),
          /* @__PURE__ */ n(g, { children: [
            /* @__PURE__ */ e(u, { variant: "outline", onClick: () => $(null), children: "Cancel" }),
            /* @__PURE__ */ e(
              u,
              {
                variant: "destructive",
                onClick: () => {
                  v && _(v, !1), $(null);
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
function ye({ form: c, footer: t }) {
  const { FieldRenderer: l } = ne, { Button: i } = T, { data: s, setData: r, errors: d, processing: m, isDirty: y, ...u } = P.useForm({ values: c.values });
  return /* @__PURE__ */ n(
    "form",
    {
      className: "cm:grid cm:gap-6",
      onSubmit: (k) => {
        k.preventDefault(), u[c.method](c.action, { preserveScroll: !0 });
      },
      children: [
        d.section && /* @__PURE__ */ e("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: d.section }),
        /* @__PURE__ */ e(
          l,
          {
            fields: c.fields,
            values: s.values,
            errors: d,
            pathPrefix: "values",
            onChange: (k) => r("values", k)
          }
        ),
        /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
          /* @__PURE__ */ e(i, { type: "submit", disabled: m, children: c.submitLabel }),
          y && /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: "Unsaved changes" }),
          t
        ] })
      ]
    }
  );
}
function tt({ section: c, sections: t, form: l }) {
  return /* @__PURE__ */ e(he, { sections: t, current: c.key, title: `${c.label} settings`, children: /* @__PURE__ */ e(ye, { form: l }, c.key) });
}
function nt({ sections: c, zones: t, types: l, couriers: i, moveUrl: s }) {
  const { Card: r, CardContent: d, CardHeader: m, CardTitle: y, Button: u, Select: k, SelectContent: x, SelectItem: h, SelectTrigger: g, SelectValue: f } = T, { Link: p } = P, a = (v, $, N) => P.router.post(w(s), { kind: v, id: $, direction: N }, { preserveScroll: !0 });
  return /* @__PURE__ */ n(
    he,
    {
      sections: c,
      current: "shipping",
      title: "Shipping",
      description: "Zones are checked in order and the first one matching the address gives its methods. Pickup methods are offered everywhere.",
      children: [
        /* @__PURE__ */ e("div", { className: "cm:flex cm:justify-end", children: /* @__PURE__ */ e(u, { asChild: !0, children: /* @__PURE__ */ e(p, { href: w("commerce/settings/shipping/zones/create"), children: "Add zone" }) }) }),
        t.length === 0 && /* @__PURE__ */ e(be, { title: "No shipping zones yet", description: "Without a zone, checkout offers no shipping. Add one for your country or provinces." }),
        t.map((v, $) => /* @__PURE__ */ n(r, { children: [
          /* @__PURE__ */ n(m, { className: "cm:flex cm:flex-row cm:items-start cm:justify-between cm:gap-4", children: [
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ n(y, { className: "cm:flex cm:items-center cm:gap-2", children: [
                v.name,
                v.everywhere_else && /* @__PURE__ */ e(j, { tone: "info", children: "Everywhere else" })
              ] }),
              !v.everywhere_else && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: v.regions.length > 0 ? v.regions.join(", ") : "No regions" })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:flex cm:shrink-0 cm:gap-1", children: [
              /* @__PURE__ */ e(u, { variant: "ghost", size: "sm", "aria-label": "Move up", disabled: $ === 0, onClick: () => a("zone", v.id, "up"), children: "↑" }),
              /* @__PURE__ */ e(u, { variant: "ghost", size: "sm", "aria-label": "Move down", disabled: $ === t.length - 1, onClick: () => a("zone", v.id, "down"), children: "↓" }),
              /* @__PURE__ */ e(u, { variant: "outline", size: "sm", asChild: !0, children: /* @__PURE__ */ e(p, { href: w(v.edit_url), children: "Edit" }) })
            ] })
          ] }),
          /* @__PURE__ */ n(d, { className: "cm:grid cm:gap-3", children: [
            v.methods.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No methods in this zone." }),
            v.methods.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:divide-y cm:divide-border cm:rounded-md cm:border", children: v.methods.map((N, C) => /* @__PURE__ */ n("li", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:px-3 cm:py-2", children: [
              /* @__PURE__ */ n("div", { className: "cm:min-w-0", children: [
                /* @__PURE__ */ e(p, { href: w(N.edit_url), className: "cm:font-medium cm:hover:underline", children: N.title }),
                /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  N.type,
                  N.etd ? ` · ${N.etd}` : ""
                ] })
              ] }),
              /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:gap-1", children: [
                !N.active && /* @__PURE__ */ e(j, { children: "Inactive" }),
                /* @__PURE__ */ e(u, { variant: "ghost", size: "sm", "aria-label": "Move up", disabled: C === 0, onClick: () => a("method", N.id, "up"), children: "↑" }),
                /* @__PURE__ */ e(u, { variant: "ghost", size: "sm", "aria-label": "Move down", disabled: C === v.methods.length - 1, onClick: () => a("method", N.id, "down"), children: "↓" })
              ] })
            ] }, N.id)) }),
            /* @__PURE__ */ e("div", { children: /* @__PURE__ */ n(k, { value: "", onValueChange: (N) => P.router.visit(w(`commerce/settings/shipping/zones/${v.id}/methods/create?type=${N}`)), children: [
              /* @__PURE__ */ e(g, { className: "cm:w-48", "aria-label": `Add a method to ${v.name}`, children: /* @__PURE__ */ e(f, { placeholder: "Add method…" }) }),
              /* @__PURE__ */ e(x, { children: l.map((N) => /* @__PURE__ */ e(h, { value: N.key, children: N.label }, N.key)) })
            ] }) })
          ] })
        ] }, v.id)),
        /* @__PURE__ */ n(r, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(y, { children: "Courier presets" }) }),
          /* @__PURE__ */ n(d, { children: [
            /* @__PURE__ */ e("p", { className: "cm:mb-3 cm:text-sm cm:text-muted-foreground", children: "Offered when adding a shipment; the tracking link is filled in from the tracking number. Add more in config/commerce.php or with Commerce::registerCourier()." }),
            /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1 cm:text-sm cm:sm:grid-cols-2", children: i.map((v) => /* @__PURE__ */ n("li", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e("span", { className: "cm:font-medium", children: v.name }),
              !v.tracking_url && /* @__PURE__ */ e("span", { className: "cm:text-xs cm:text-muted-foreground", children: "(no tracking link)" })
            ] }, v.key)) })
          ] })
        ] })
      ]
    }
  );
}
function ct({ title: c, description: t, form: l, breadcrumbs: i = [], deleteUrl: s, deleteConfirm: r }) {
  const { Button: d } = T;
  return K(), L.useBreadcrumbs([...i.map((m) => ({ ...m, href: m.href ? w(m.href) : void 0 })), { label: c }]), /* @__PURE__ */ n("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-3xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(G, { title: c, description: t }),
    /* @__PURE__ */ e(ye, { form: l, footer: s ? /* @__PURE__ */ e(
      d,
      {
        type: "button",
        variant: "ghost",
        className: "cm:ml-auto cm:text-destructive",
        onClick: () => window.confirm(r ?? "Delete this?") && P.router.delete(w(s)),
        children: "Delete"
      }
    ) : null })
  ] });
}
function at(c) {
  const { DataTable: t } = ne, { Button: l } = T, { Link: i } = P;
  return K(), L.useBreadcrumbs([{ label: "Shop", href: w("commerce") }, { label: c.title }]), /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      G,
      {
        title: c.title,
        description: c.description,
        actions: c.createUrl ? /* @__PURE__ */ e(l, { asChild: !0, children: /* @__PURE__ */ e(i, { href: w(c.createUrl), children: c.createLabel ?? "New" }) }) : null
      }
    ),
    /* @__PURE__ */ e(
      t,
      {
        ...c,
        bulkUrl: c.bulkUrl ? w(c.bulkUrl) : void 0,
        rowHref: (s) => s.href ? w(s.href) : null,
        renderCell: (s, r) => r.type === "badge" && s[r.key] != null ? /* @__PURE__ */ e(j, { tone: s[`${r.key}_tone`] ?? "neutral", children: String(s[r.key]) }) : void 0
      }
    )
  ] });
}
const rt = {
  "Commerce/Customers/Show": Me,
  "Commerce/Dashboard": ze,
  "Commerce/Inventory/Index": Ke,
  "Commerce/Orders/Editor": Ge,
  "Commerce/Orders/Show": Xe,
  "Commerce/Products/Index": Ze,
  "Commerce/Settings/Section": tt,
  "Commerce/Settings/Features": et,
  "Commerce/Settings/Shipping": nt,
  "Commerce/Shared/SchemaForm": ct,
  "Commerce/Shared/ResourceIndex": at
};
function lt() {
  Object.entries(rt).forEach(([c, t]) => L.registerPage(c, t));
}
function Ce(c) {
  if (!c) return "";
  const t = new Date(c);
  if (Number.isNaN(t.getTime())) return "";
  const l = (i) => String(i).padStart(2, "0");
  return `${t.getFullYear()}-${l(t.getMonth() + 1)}-${l(t.getDate())}T${l(t.getHours())}:${l(t.getMinutes())}`;
}
function we(c) {
  return c ? new Date(c).toISOString() : null;
}
function it({ value: c, onChange: t, pathPrefix: l }) {
  const { Input: i, Label: s } = T, r = { start: c?.start ?? null, end: c?.end ?? null };
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(s, { htmlFor: `${l}-start`, children: "Starts" }),
      /* @__PURE__ */ e(
        i,
        {
          id: `${l}-start`,
          type: "datetime-local",
          value: Ce(r.start),
          onChange: (d) => t({ ...r, start: we(d.target.value) })
        }
      )
    ] }),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(s, { htmlFor: `${l}-end`, children: "Ends" }),
      /* @__PURE__ */ e(
        i,
        {
          id: `${l}-end`,
          type: "datetime-local",
          value: Ce(r.end),
          onChange: (d) => t({ ...r, end: we(d.target.value) })
        }
      )
    ] })
  ] });
}
function st({ field: c, value: t, onChange: l, errors: i, pathPrefix: s }) {
  return K(), /* @__PURE__ */ e(
    te,
    {
      id: s,
      value: t,
      onChange: l,
      allowNull: c.config?.allow_null !== !1,
      invalid: !!(s && i?.[s])
    }
  );
}
function dt({ field: c, value: t, onChange: l, pathPrefix: i }) {
  const { Input: s, Badge: r } = T, d = c.config ?? {}, m = Array.isArray(t) ? t : [], [y, u] = q.useState(""), [k, x] = q.useState([]), [h, g] = q.useState(!1);
  q.useEffect(() => {
    if (!h) return;
    const a = new URLSearchParams({ q: y });
    (d.types ?? []).forEach(($) => a.append("types[]", $)), (d.taxonomies ?? []).forEach(($) => a.append("taxonomies[]", $));
    const v = setTimeout(() => Q(`${d.api}?${a}`).then(($) => x($.data)).catch(() => x([])), 200);
    return () => clearTimeout(v);
  }, [y, h]);
  const f = (a) => m.some((v) => v.type === a.type && v.id === a.id), p = { product: "Product", variant: "Variant", term: "Category/brand" };
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-2", children: [
    m.length > 0 && /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: m.map((a) => /* @__PURE__ */ n(r, { variant: "secondary", className: "cm:gap-1", children: [
      /* @__PURE__ */ n("span", { className: "cm:text-muted-foreground", children: [
        p[a.type],
        ":"
      ] }),
      " ",
      a.label,
      /* @__PURE__ */ e("button", { type: "button", "aria-label": `Remove ${a.label}`, onClick: () => l(m.filter((v) => !(v.type === a.type && v.id === a.id))), children: "×" })
    ] }, `${a.type}:${a.id}`)) }),
    /* @__PURE__ */ n("div", { className: "cm:relative", children: [
      /* @__PURE__ */ e(
        s,
        {
          id: i,
          value: y,
          placeholder: "Search products, SKUs, categories, brands…",
          onFocus: () => g(!0),
          onBlur: () => setTimeout(() => g(!1), 150),
          onChange: (a) => u(a.target.value)
        }
      ),
      h && k.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-20 cm:mt-1 cm:max-h-72 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: k.map((a) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: f(a),
          className: "cm:flex cm:w-full cm:justify-between cm:gap-3 cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted cm:disabled:opacity-50",
          onMouseDown: (v) => v.preventDefault(),
          onClick: () => {
            l([...m, { type: a.type, id: a.id, label: a.label }]), u("");
          },
          children: [
            /* @__PURE__ */ e("span", { children: a.label }),
            /* @__PURE__ */ e("span", { className: "cm:text-xs cm:text-muted-foreground", children: a.group })
          ]
        }
      ) }, `${a.type}:${a.id}`)) })
    ] })
  ] });
}
function V() {
  return (globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`).replace(/-/g, "").slice(0, 32);
}
function $e(c) {
  return Object.keys(c).sort().map((t) => `${t}=${c[t]}`).join("|");
}
function ot(c) {
  let t = [{}];
  for (const l of c) {
    if (l.values.length === 0) return [];
    const i = [];
    for (const s of t)
      for (const r of l.values)
        i.push({ ...s, [l.id]: r.id });
    t = i;
  }
  return c.length === 0 ? [] : t;
}
function mt(c, t, l, i = 100) {
  const s = new Map(t.map((r) => [$e(r.options), r]));
  return ot(c).slice(0, i).map((r) => {
    const d = s.get($e(r));
    return d ? { ...d, options: r } : { ...l, id: V(), sku: null, options: r, active: !0, price: l.price ?? 0 };
  });
}
function Re(c, t, l = {}) {
  return c.map((i) => {
    const s = i.values.find((r) => r.id === t.options[i.id]);
    return s ? s.label ?? (s.term_id ? l[s.term_id] ?? `#${s.term_id}` : "?") : "?";
  }).join(" / ");
}
function F({ label: c, hint: t, children: l, htmlFor: i, className: s }) {
  const { Label: r } = T;
  return /* @__PURE__ */ n("div", { className: me("cm:grid cm:gap-1.5", s), children: [
    /* @__PURE__ */ e(r, { htmlFor: i, children: c }),
    l,
    t && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: t })
  ] });
}
function le({ children: c, cols: t = 3 }) {
  return /* @__PURE__ */ e("div", { className: me("cm:grid cm:gap-4", { 2: "cm:sm:grid-cols-2", 3: "cm:sm:grid-cols-2 cm:lg:grid-cols-3", 4: "cm:sm:grid-cols-2 cm:lg:grid-cols-4" }[t]), children: c });
}
function E({ id: c, value: t, onChange: l, min: i = 0, placeholder: s }) {
  const { Input: r } = T;
  return /* @__PURE__ */ e(
    r,
    {
      id: c,
      type: "number",
      inputMode: "numeric",
      min: i,
      value: t ?? "",
      placeholder: s,
      onChange: (d) => l(d.target.value === "" ? null : Math.round(Number(d.target.value)))
    }
  );
}
function ie({ id: c, value: t, onChange: l, placeholder: i, onBlur: s }) {
  const { Input: r } = T;
  return /* @__PURE__ */ e(
    r,
    {
      id: c,
      value: t ?? "",
      placeholder: i,
      onBlur: s,
      onChange: (d) => l(d.target.value === "" ? null : d.target.value)
    }
  );
}
function Y({ id: c, value: t, onChange: l, nullable: i = !0 }) {
  return /* @__PURE__ */ e(te, { id: c, value: t, allowNull: i, onChange: l });
}
function ae({ id: c, label: t, checked: l, onChange: i, hint: s }) {
  const { Switch: r, Label: d } = T;
  return /* @__PURE__ */ n("div", { className: "cm:flex cm:items-start cm:gap-3", children: [
    /* @__PURE__ */ e(r, { id: c, checked: l, onCheckedChange: i }),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-0.5", children: [
      /* @__PURE__ */ e(d, { htmlFor: c, children: t }),
      s && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: s })
    ] })
  ] });
}
const ut = "cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm";
function A({ id: c, value: t, onChange: l, options: i }) {
  return /* @__PURE__ */ e("select", { id: c, className: ut, value: t, onChange: (s) => l(s.target.value), children: i.map(([s, r]) => /* @__PURE__ */ e("option", { value: s, children: r }, s)) });
}
function H({ title: c, description: t, children: l, actions: i }) {
  return /* @__PURE__ */ n("section", { className: "cm:grid cm:gap-4", children: [
    /* @__PURE__ */ n("div", { className: "cm:flex cm:items-start cm:justify-between cm:gap-3", children: [
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-0.5", children: [
        /* @__PURE__ */ e("h3", { className: "cm:text-sm cm:font-semibold", children: c }),
        t && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: t })
      ] }),
      i
    ] }),
    l
  ] });
}
function ht({ value: c, update: t, path: l }) {
  const { Button: i, Input: s } = T, r = c.bundle ?? { pricing: "fixed", value: 0, items: [] }, [d, m] = q.useState({}), [y, u] = q.useState(""), [k, x] = q.useState([]), h = r.items.map((p) => p.variant_id).filter((p) => !!p);
  q.useEffect(() => {
    const p = h.filter((a) => !d[a]);
    p.length !== 0 && Q(w(`commerce/api/variants?${p.map((a) => `ids[]=${a}`).join("&")}`)).then((a) => m((v) => ({ ...v, ...Object.fromEntries(a.data.map(($) => [$.id, $])) }))).catch(() => {
    });
  }, [h.join(",")]), q.useEffect(() => {
    if (y.trim().length < 2) return x([]);
    const p = setTimeout(() => Q(w(`commerce/api/variants?q=${encodeURIComponent(y)}`)).then((a) => x(a.data)).catch(() => {
    }), 250);
    return () => clearTimeout(p);
  }, [y]);
  const g = (p) => t({ bundle: { ...r, ...p } }), f = r.items.reduce((p, a) => p + (d[a.variant_id ?? 0]?.price ?? 0) * a.quantity, 0);
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ n(H, { title: "Products in the bundle", description: "Bundles take their stock from these products.", children: [
      r.items.map((p, a) => /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ e("span", { className: "cm:flex-1 cm:text-sm", children: d[p.variant_id ?? 0]?.label ?? `#${p.variant_id}` }),
        /* @__PURE__ */ e("div", { className: "cm:w-24", children: /* @__PURE__ */ e(E, { min: 1, value: p.quantity, onChange: (v) => g({ items: r.items.map(($, N) => N === a ? { ...$, quantity: v ?? 1 } : $) }) }) }),
        /* @__PURE__ */ e(i, { type: "button", variant: "ghost", size: "sm", onClick: () => g({ items: r.items.filter((v, $) => $ !== a) }), children: "Remove" })
      ] }, a)),
      /* @__PURE__ */ n("div", { className: "cm:relative", children: [
        /* @__PURE__ */ e(s, { value: y, placeholder: "Search products or SKUs to add…", "aria-label": "Add a product to the bundle", onChange: (p) => u(p.target.value) }),
        k.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-10 cm:mt-1 cm:max-h-64 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: k.map((p) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "cm:flex cm:w-full cm:justify-between cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted",
            onClick: () => {
              m((a) => ({ ...a, [p.id]: p })), g({ items: [...r.items, { variant_id: p.id, quantity: 1 }] }), u("");
            },
            children: [
              /* @__PURE__ */ n("span", { children: [
                p.label,
                p.sku && /* @__PURE__ */ n("span", { className: "cm:text-muted-foreground", children: [
                  " · ",
                  p.sku
                ] })
              ] }),
              /* @__PURE__ */ e("span", { children: re(p.price) })
            ]
          }
        ) }, p.id)) })
      ] })
    ] }),
    /* @__PURE__ */ e(H, { title: "Bundle price", description: `The products cost ${re(f)} together.`, children: /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(F, { label: "Price", htmlFor: `${l}-bundle-pricing`, children: /* @__PURE__ */ e(
        A,
        {
          id: `${l}-bundle-pricing`,
          value: r.pricing,
          onChange: (p) => g({ pricing: p, value: 0 }),
          options: [["fixed", "Its own price (General tab)"], ["percent_off", "Total minus a percentage"], ["amount_off", "Total minus an amount"]]
        }
      ) }),
      r.pricing === "percent_off" && /* @__PURE__ */ e(F, { label: "Percent off", htmlFor: `${l}-bundle-value`, children: /* @__PURE__ */ e(E, { id: `${l}-bundle-value`, value: r.value / 100, onChange: (p) => g({ value: Math.round((p ?? 0) * 100) }) }) }),
      r.pricing === "amount_off" && /* @__PURE__ */ e(F, { label: "Amount off", htmlFor: `${l}-bundle-value`, children: /* @__PURE__ */ e(Y, { id: `${l}-bundle-value`, value: r.value, nullable: !1, onChange: (p) => g({ value: p ?? 0 }) }) })
    ] }) })
  ] });
}
function pt() {
  return decodeURIComponent(document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/)?.[1] ?? "");
}
function gt({ value: c, update: t, path: l }) {
  const { Button: i } = T, [s, r] = q.useState(!1), d = q.useRef(null), m = c.delivery ?? { modes: ["link", "account"], download_limit: null, expiry_days: null }, y = (x) => t({ delivery: { ...m, ...x } }), u = (x, h) => t({ downloads: c.downloads.map((g, f) => f === x ? { ...g, ...h } : g) }), k = async (x) => {
    if (x?.length) {
      r(!0);
      try {
        const h = [];
        for (const g of Array.from(x)) {
          const f = new FormData();
          f.append("file", g);
          const p = await fetch(w("commerce/api/downloads"), { method: "POST", body: f, headers: { "X-XSRF-TOKEN": pt(), Accept: "application/json" }, credentials: "same-origin" }), a = await p.json();
          if (!p.ok) throw new Error(a.message ?? "Upload failed");
          h.push({ id: V(), type: "file", file_id: a.data.id, url: null, name: g.name.replace(/\.[^.]+$/, ""), file: a.data });
        }
        t({ downloads: [...c.downloads, ...h] });
      } catch (h) {
        Ae.error(h instanceof Error ? h.message : "Upload failed");
      } finally {
        r(!1), d.current && (d.current.value = "");
      }
    }
  };
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ n(
      H,
      {
        title: "Files and links",
        description: "Files are stored privately and only served to customers who bought them.",
        actions: /* @__PURE__ */ n("div", { className: "cm:flex cm:gap-2", children: [
          /* @__PURE__ */ e(i, { type: "button", variant: "outline", size: "sm", disabled: s, onClick: () => d.current?.click(), children: s ? "Uploading…" : "Upload file" }),
          /* @__PURE__ */ e(i, { type: "button", variant: "outline", size: "sm", onClick: () => t({ downloads: [...c.downloads, { id: V(), type: "url", file_id: null, url: null, name: "" }] }), children: "Add link" }),
          /* @__PURE__ */ e("input", { ref: d, type: "file", multiple: !0, hidden: !0, onChange: (x) => k(x.target.files) })
        ] }),
        children: [
          c.downloads.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No files yet." }),
          c.downloads.map((x, h) => /* @__PURE__ */ n("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(F, { label: "Name", htmlFor: `${l}-dl-${h}`, children: /* @__PURE__ */ e(ie, { id: `${l}-dl-${h}`, value: x.name, onChange: (g) => u(h, { name: g ?? "" }) }) }),
            x.type === "url" ? /* @__PURE__ */ e(F, { label: "Link", htmlFor: `${l}-dl-${h}-url`, children: /* @__PURE__ */ e(ie, { id: `${l}-dl-${h}-url`, value: x.url, placeholder: "https://", onChange: (g) => u(h, { url: g }) }) }) : /* @__PURE__ */ e(F, { label: "File", children: /* @__PURE__ */ e("p", { className: "cm:truncate cm:text-sm cm:text-muted-foreground", children: x.file?.filename ?? `File #${x.file_id}` }) }),
            /* @__PURE__ */ e(i, { type: "button", variant: "ghost", size: "sm", onClick: () => t({ downloads: c.downloads.filter((g, f) => f !== h) }), children: "Remove" })
          ] }, x.id ?? h))
        ]
      }
    ),
    /* @__PURE__ */ n(H, { title: "Delivery", children: [
      /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-3", children: [["attachment", "Attach files to the email"], ["link", "Download links in the email"], ["account", "Library in My Account"]].map(([x, h]) => /* @__PURE__ */ e(
        ae,
        {
          id: `${l}-mode-${x}`,
          label: h,
          checked: m.modes.includes(x),
          onChange: (g) => y({ modes: g ? [...m.modes, x] : m.modes.filter((f) => f !== x) })
        },
        x
      )) }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
        /* @__PURE__ */ e(F, { label: "Downloads per file", htmlFor: `${l}-limit`, hint: "Empty: unlimited.", children: /* @__PURE__ */ e(E, { id: `${l}-limit`, min: 1, value: m.download_limit, onChange: (x) => y({ download_limit: x }) }) }),
        /* @__PURE__ */ e(F, { label: "Links expire after (days)", htmlFor: `${l}-expiry`, hint: "Empty: never.", children: /* @__PURE__ */ e(E, { id: `${l}-expiry`, min: 1, value: m.expiry_days, onChange: (x) => y({ expiry_days: x }) }) })
      ] })
    ] })
  ] });
}
function Pe({ id: c, value: t, onChange: l, entryId: i }) {
  const [s, r] = q.useState(null);
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
    /* @__PURE__ */ e(ie, { id: c, value: t, onChange: (m) => {
      r(null), l(m);
    }, onBlur: () => {
      if (!t) return r(null);
      const m = new URLSearchParams({ sku: t, entry: String(i ?? 0) });
      Q(w(`commerce/api/sku-check?${m}`)).then((y) => r(y.available ? null : y.product ?? "another product")).catch(() => r(null));
    } }),
    s && /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-destructive", children: [
      "Already used by ",
      s,
      "."
    ] })
  ] });
}
const ft = [
  ["default", "Follow the store (selling mode)"],
  ["cart", "Add to cart"],
  ["inquiry", "Inquiry form"],
  ["whatsapp", "Ask on WhatsApp"],
  ["external", "Links to other shops"],
  ["none", "No button (display only)"]
];
function vt({ value: c, update: t, updateVariant: l, config: i, entryId: s, path: r }) {
  const { Button: d } = T, m = [["simple", "Simple product"]];
  (i.features.variants || c.type === "variable") && m.push(["variable", "Variable product (sizes, colors…)"]), (i.features.bundles || c.type === "bundle") && m.push(["bundle", "Bundle of other products"]);
  const y = c.variants[0];
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ n(le, { cols: 2, children: [
      /* @__PURE__ */ e(F, { label: "Product type", htmlFor: `${r}-type`, children: /* @__PURE__ */ e(A, { id: `${r}-type`, value: c.type, options: m, onChange: (u) => t({ type: u }) }) }),
      /* @__PURE__ */ e(F, { label: "Button on the product page", htmlFor: `${r}-mode`, hint: "'Follow the store' uses the selling mode set in Settings → Store.", children: /* @__PURE__ */ e(A, { id: `${r}-mode`, value: c.purchase_mode, options: ft, onChange: (u) => t({ purchase_mode: u }) }) })
    ] }),
    c.type !== "variable" && y && /* @__PURE__ */ e(H, { title: "Price", children: /* @__PURE__ */ n(le, { cols: 4, children: [
      /* @__PURE__ */ e(F, { label: "Price", htmlFor: `${r}-price`, children: /* @__PURE__ */ e(Y, { id: `${r}-price`, value: y.price, nullable: !1, onChange: (u) => l(0, { price: u ?? 0 }) }) }),
      /* @__PURE__ */ e(F, { label: "Compare-at price", htmlFor: `${r}-compare`, hint: "Shown struck through when higher.", children: /* @__PURE__ */ e(Y, { id: `${r}-compare`, value: y.compare_at_price, onChange: (u) => l(0, { compare_at_price: u }) }) }),
      /* @__PURE__ */ e(F, { label: "Cost", htmlFor: `${r}-cost`, hint: "For profit reports; never shown.", children: /* @__PURE__ */ e(Y, { id: `${r}-cost`, value: y.cost, onChange: (u) => l(0, { cost: u }) }) }),
      /* @__PURE__ */ e(F, { label: "SKU", htmlFor: `${r}-sku`, children: /* @__PURE__ */ e(Pe, { id: `${r}-sku`, value: y.sku, entryId: s, onChange: (u) => l(0, { sku: u }) }) })
    ] }) }),
    (c.purchase_mode === "external" || c.external_links.length > 0) && /* @__PURE__ */ e(
      H,
      {
        title: "Links to other shops",
        description: "Buttons such as 'Buy on Tokopedia'.",
        actions: c.external_links.length < 10 && /* @__PURE__ */ e(d, { type: "button", variant: "outline", size: "sm", onClick: () => t({ external_links: [...c.external_links, { preset: "tokopedia", label: null, url: null }] }), children: "Add link" }),
        children: c.external_links.map((u, k) => {
          const x = (h) => t({ external_links: c.external_links.map((g, f) => f === k ? { ...g, ...h } : g) });
          return /* @__PURE__ */ n("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[10rem_1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(F, { label: "Shop", htmlFor: `${r}-link-${k}-preset`, children: /* @__PURE__ */ e(
              A,
              {
                id: `${r}-link-${k}-preset`,
                value: u.preset ?? "",
                onChange: (h) => x({ preset: h || null }),
                options: [...Object.entries(i.link_presets), ["", "Other…"]]
              }
            ) }),
            /* @__PURE__ */ e(F, { label: "Button label", htmlFor: `${r}-link-${k}-label`, children: /* @__PURE__ */ e(ie, { id: `${r}-link-${k}-label`, value: u.label, placeholder: u.preset ? `Buy on ${i.link_presets[u.preset]}` : "", onChange: (h) => x({ label: h }) }) }),
            /* @__PURE__ */ e(F, { label: "Link", htmlFor: `${r}-link-${k}-url`, children: /* @__PURE__ */ e(ie, { id: `${r}-link-${k}-url`, value: u.url, placeholder: "https://", onChange: (h) => x({ url: h }) }) }),
            /* @__PURE__ */ e(d, { type: "button", variant: "ghost", size: "sm", onClick: () => t({ external_links: c.external_links.filter((h, g) => g !== k) }), children: "Remove" })
          ] }, k);
        })
      }
    ),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(ae, { id: `${r}-shipping`, label: "Needs shipping", checked: c.requires_shipping, onChange: (u) => t({ requires_shipping: u }), hint: "Off for services and digital products." }),
      (i.features.digital || c.downloadable) && /* @__PURE__ */ e(ae, { id: `${r}-downloadable`, label: "Downloadable", checked: c.downloadable, onChange: (u) => t({ downloadable: u }), hint: "Customers get files or links after paying." }),
      /* @__PURE__ */ e(ae, { id: `${r}-featured`, label: "Featured", checked: c.featured, onChange: (u) => t({ featured: u }), hint: "Shown first when sorting by featured." })
    ] }),
    i.features.taxes && /* @__PURE__ */ e(F, { label: "Tax class", htmlFor: `${r}-tax`, children: /* @__PURE__ */ e(
      A,
      {
        id: `${r}-tax`,
        value: c.tax_class ?? "",
        onChange: (u) => t({ tax_class: u || null }),
        options: [["", "Standard"], ...i.tax_classes.filter((u) => u !== "standard").map((u) => [u, u])]
      }
    ) })
  ] });
}
function bt({ value: c, updateVariant: t, live: l, path: i }) {
  const s = c.variants[0];
  if (!s) return null;
  const r = l?.variants[s.id];
  return /* @__PURE__ */ n(H, { title: "Stock", children: [
    /* @__PURE__ */ e(
      ae,
      {
        id: `${i}-track`,
        label: "Track stock",
        checked: s.track_stock,
        onChange: (d) => t(0, { track_stock: d }),
        hint: "Count units: orders take them, cancellations give them back."
      }
    ),
    s.track_stock ? /* @__PURE__ */ n(le, { cols: 3, children: [
      r?.track_stock && r.stock_quantity !== null ? /* @__PURE__ */ e(F, { label: "In stock", hint: "Change it in Shop → Inventory, so every change is recorded.", children: /* @__PURE__ */ e("p", { className: "cm:text-2xl cm:font-semibold", children: r.stock_quantity }) }) : /* @__PURE__ */ e(F, { label: "Starting stock", htmlFor: `${i}-initial`, hint: "Set once, when the product is published.", children: /* @__PURE__ */ e(E, { id: `${i}-initial`, value: s.initial_stock, onChange: (d) => t(0, { initial_stock: d }) }) }),
      /* @__PURE__ */ e(F, { label: "When sold out", htmlFor: `${i}-backorders`, children: /* @__PURE__ */ e(
        A,
        {
          id: `${i}-backorders`,
          value: s.backorders,
          onChange: (d) => t(0, { backorders: d }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }),
      /* @__PURE__ */ e(F, { label: "Low stock at", htmlFor: `${i}-low`, hint: "Empty: the store's setting.", children: /* @__PURE__ */ e(E, { id: `${i}-low`, value: s.low_stock_threshold, onChange: (d) => t(0, { low_stock_threshold: d }) }) })
    ] }) : /* @__PURE__ */ e(F, { label: "Stock status", htmlFor: `${i}-status`, children: /* @__PURE__ */ e(
      A,
      {
        id: `${i}-status`,
        value: s.stock_status,
        onChange: (d) => t(0, { stock_status: d }),
        options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
      }
    ) })
  ] });
}
function yt({ value: c, update: t, path: l }) {
  const { Button: i } = T, s = (r, d) => t({ tiers: c.tiers.map((m, y) => y === r ? { ...m, ...d } : m) });
  return /* @__PURE__ */ n(
    H,
    {
      title: "Bulk prices",
      description: "Lower unit prices for larger quantities. The best matching tier applies.",
      actions: c.tiers.length < 20 && /* @__PURE__ */ e(
        i,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          onClick: () => t({ tiers: [...c.tiers, { min_qty: (c.tiers.at(-1)?.min_qty ?? 1) + 9, type: "percent_off", value: 500, variant: null }] }),
          children: "Add tier"
        }
      ),
      children: [
        c.tiers.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No bulk prices." }),
        c.tiers.map((r, d) => /* @__PURE__ */ n("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[8rem_12rem_1fr_1fr_auto]", children: [
          /* @__PURE__ */ e(F, { label: "From (units)", htmlFor: `${l}-tier-${d}-min`, children: /* @__PURE__ */ e(E, { id: `${l}-tier-${d}-min`, min: 2, value: r.min_qty, onChange: (m) => s(d, { min_qty: m ?? 2 }) }) }),
          /* @__PURE__ */ e(F, { label: "Price", htmlFor: `${l}-tier-${d}-type`, children: /* @__PURE__ */ e(
            A,
            {
              id: `${l}-tier-${d}-type`,
              value: r.type,
              onChange: (m) => s(d, { type: m, value: 0 }),
              options: [["percent_off", "Percent off"], ["amount_off", "Amount off per unit"], ["fixed_price", "Fixed unit price"]]
            }
          ) }),
          /* @__PURE__ */ e(F, { label: r.type === "percent_off" ? "Percent" : "Amount", htmlFor: `${l}-tier-${d}-value`, children: r.type === "percent_off" ? /* @__PURE__ */ e(E, { id: `${l}-tier-${d}-value`, value: r.value / 100, onChange: (m) => s(d, { value: Math.round((m ?? 0) * 100) }) }) : /* @__PURE__ */ e(Y, { id: `${l}-tier-${d}-value`, value: r.value, nullable: !1, onChange: (m) => s(d, { value: m ?? 0 }) }) }),
          /* @__PURE__ */ e(F, { label: "For", htmlFor: `${l}-tier-${d}-variant`, children: /* @__PURE__ */ e(
            A,
            {
              id: `${l}-tier-${d}-variant`,
              value: r.variant ?? "",
              onChange: (m) => s(d, { variant: m || null }),
              options: [["", "All variants"], ...c.type === "variable" ? c.variants.map((m) => [m.id, Re(c.options, m)]) : []]
            }
          ) }),
          /* @__PURE__ */ e(i, { type: "button", variant: "ghost", size: "sm", onClick: () => t({ tiers: c.tiers.filter((m, y) => y !== d) }), children: "Remove" })
        ] }, d))
      ]
    }
  );
}
function xt({ value: c, update: t, updateVariant: l, path: i }) {
  const s = c.variants[0];
  if (!s) return null;
  const r = (d) => c.type === "variable" ? t({ variants: c.variants.map((m) => ({ ...m, ...d })) }) : l(0, d);
  return /* @__PURE__ */ e(H, { title: "Package", description: c.type === "variable" ? "Applies to every variant; a variant can have its own weight under More." : "Used for shipping rates.", children: /* @__PURE__ */ n(le, { cols: 4, children: [
    /* @__PURE__ */ e(F, { label: "Weight (grams)", htmlFor: `${i}-weight`, children: /* @__PURE__ */ e(E, { id: `${i}-weight`, value: s.weight, onChange: (d) => r({ weight: d }) }) }),
    /* @__PURE__ */ e(F, { label: "Length (mm)", htmlFor: `${i}-length`, children: /* @__PURE__ */ e(E, { id: `${i}-length`, value: s.length, onChange: (d) => r({ length: d }) }) }),
    /* @__PURE__ */ e(F, { label: "Width (mm)", htmlFor: `${i}-width`, children: /* @__PURE__ */ e(E, { id: `${i}-width`, value: s.width, onChange: (d) => r({ width: d }) }) }),
    /* @__PURE__ */ e(F, { label: "Height (mm)", htmlFor: `${i}-height`, children: /* @__PURE__ */ e(E, { id: `${i}-height`, value: s.height, onChange: (d) => r({ height: d }) }) })
  ] }) });
}
const fe = {
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
function kt(c) {
  const [t, l] = q.useState({}), i = c.filter((s) => !(s in t));
  return q.useEffect(() => {
    if (i.length === 0) return;
    const s = i.map((r) => `ids[]=${r}`).join("&");
    Q(w(`api/terms?${s}`)).then((r) => l((d) => ({ ...d, ...Object.fromEntries(r.data.map((m) => [m.id, m.title])) }))).catch(() => {
    });
  }, [i.join(",")]), t;
}
function Nt({ option: c, onChange: t, onRemove: l, config: i, path: s }) {
  const { Button: r, Input: d, Badge: m } = T, { FieldRenderer: y } = ne, [u, k] = q.useState(""), x = () => {
    const g = u.split(",").map((f) => f.trim()).filter(Boolean).filter((f) => !c.values.some((p) => (p.label ?? "").toLowerCase() === f.toLowerCase()));
    g.length && t({ ...c, values: [...c.values, ...g.map((f) => ({ id: V(), label: f }))] }), k("");
  }, h = c.values.map((g) => g.term_id).filter((g) => !!g);
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-3 cm:rounded-md cm:border cm:p-3", children: [
    /* @__PURE__ */ n("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_1fr_auto]", children: [
      /* @__PURE__ */ e(F, { label: "Option name", htmlFor: `${s}-name`, children: /* @__PURE__ */ e(d, { id: `${s}-name`, value: c.name, placeholder: "Size", onChange: (g) => t({ ...c, name: g.target.value }) }) }),
      i.attribute_taxonomies.length > 0 ? /* @__PURE__ */ e(F, { label: "Values from", htmlFor: `${s}-source`, children: /* @__PURE__ */ e(
        A,
        {
          id: `${s}-source`,
          value: c.taxonomy ?? "",
          onChange: (g) => t({ ...c, taxonomy: g || null, values: [] }),
          options: [["", "Custom values"], ...i.attribute_taxonomies.map((g) => [g.handle, g.title])]
        }
      ) }) : /* @__PURE__ */ e("div", {}),
      /* @__PURE__ */ e(r, { type: "button", variant: "ghost", size: "sm", onClick: l, children: "Remove option" })
    ] }),
    c.taxonomy ? /* @__PURE__ */ e(
      y,
      {
        fields: [{ handle: "terms", type: "terms", label: "Values", config: { taxonomy: c.taxonomy } }],
        values: { terms: h },
        pathPrefix: `${s}-terms`,
        onChange: (g) => {
          const f = g.terms ?? [], p = c.values.filter((v) => v.term_id && f.includes(v.term_id)), a = f.filter((v) => !p.some(($) => $.term_id === v)).map((v) => ({ id: V(), term_id: v }));
          t({ ...c, values: [...p, ...a] });
        }
      }
    ) : /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-2", children: [
      /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: c.values.map((g) => /* @__PURE__ */ n(m, { variant: "secondary", className: "cm:gap-1", children: [
        g.label,
        /* @__PURE__ */ e("button", { type: "button", "aria-label": `Remove ${g.label}`, onClick: () => t({ ...c, values: c.values.filter((f) => f.id !== g.id) }), children: "×" })
      ] }, g.id)) }),
      /* @__PURE__ */ n("div", { className: "cm:flex cm:gap-2", children: [
        /* @__PURE__ */ e(
          d,
          {
            value: u,
            placeholder: "S, M, L",
            "aria-label": `Add values to ${c.name || "option"}`,
            onChange: (g) => k(g.target.value),
            onKeyDown: (g) => {
              g.key === "Enter" && (g.preventDefault(), x());
            }
          }
        ),
        /* @__PURE__ */ e(r, { type: "button", variant: "outline", onClick: x, children: "Add" })
      ] })
    ] })
  ] });
}
function _t({ variant: c, index: t, updateVariant: l, tab: i }) {
  const { FieldRenderer: s } = ne, r = `${i.path}-v${t}`, d = i.live?.variants[c.id];
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-4 cm:bg-muted/40 cm:p-4", children: [
    /* @__PURE__ */ n(le, { cols: 4, children: [
      /* @__PURE__ */ e(F, { label: "Cost", htmlFor: `${r}-cost`, children: /* @__PURE__ */ e(Y, { id: `${r}-cost`, value: c.cost, onChange: (m) => l(t, { cost: m }) }) }),
      /* @__PURE__ */ e(F, { label: "Barcode", htmlFor: `${r}-barcode`, children: /* @__PURE__ */ e(ie, { id: `${r}-barcode`, value: c.barcode, onChange: (m) => l(t, { barcode: m }) }) }),
      /* @__PURE__ */ e(F, { label: "Weight (g)", htmlFor: `${r}-weight`, children: /* @__PURE__ */ e(E, { id: `${r}-weight`, value: c.weight, onChange: (m) => l(t, { weight: m }), placeholder: "Product's" }) }),
      /* @__PURE__ */ e(F, { label: "Min / max / step", htmlFor: `${r}-min`, children: /* @__PURE__ */ n("div", { className: "cm:grid cm:grid-cols-3 cm:gap-1", children: [
        /* @__PURE__ */ e(E, { id: `${r}-min`, min: 1, value: c.min_qty, onChange: (m) => l(t, { min_qty: m ?? 1 }) }),
        /* @__PURE__ */ e(E, { min: 1, value: c.max_qty, onChange: (m) => l(t, { max_qty: m }), placeholder: "–" }),
        /* @__PURE__ */ e(E, { min: 1, value: c.qty_step, onChange: (m) => l(t, { qty_step: m ?? 1 }) })
      ] }) })
    ] }),
    i.config.features.inventory && /* @__PURE__ */ n(le, { cols: 4, children: [
      /* @__PURE__ */ e(ae, { id: `${r}-track`, label: "Track stock", checked: c.track_stock, onChange: (m) => l(t, { track_stock: m }) }),
      c.track_stock && (d?.track_stock && d.stock_quantity !== null ? /* @__PURE__ */ e(F, { label: "In stock", children: /* @__PURE__ */ n("p", { className: "cm:text-sm", children: [
        d.stock_quantity,
        " ",
        /* @__PURE__ */ e("span", { className: "cm:text-muted-foreground", children: "(change it in Shop → Inventory)" })
      ] }) }) : /* @__PURE__ */ e(F, { label: "Starting stock", htmlFor: `${r}-initial`, children: /* @__PURE__ */ e(E, { id: `${r}-initial`, value: c.initial_stock, onChange: (m) => l(t, { initial_stock: m }) }) })),
      c.track_stock ? /* @__PURE__ */ e(F, { label: "When sold out", htmlFor: `${r}-backorders`, children: /* @__PURE__ */ e(
        A,
        {
          id: `${r}-backorders`,
          value: c.backorders,
          onChange: (m) => l(t, { backorders: m }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }) : /* @__PURE__ */ e(F, { label: "Stock status", htmlFor: `${r}-status`, children: /* @__PURE__ */ e(
        A,
        {
          id: `${r}-status`,
          value: c.stock_status,
          onChange: (m) => l(t, { stock_status: m }),
          options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
        }
      ) })
    ] }),
    /* @__PURE__ */ e(
      s,
      {
        fields: [{ handle: "image", type: "asset", label: "Image", config: { image_only: !0 } }],
        values: { image: c.image },
        pathPrefix: `${r}-image`,
        onChange: (m) => l(t, { image: m.image ?? null })
      }
    )
  ] });
}
function Ct(c) {
  const { value: t, update: l, updateVariant: i, config: s, entryId: r, live: d } = c, { Button: m, Table: y, TableBody: u, TableCell: k, TableHead: x, TableHeader: h, TableRow: g, Switch: f } = T, [p, a] = q.useState(null), v = kt(t.options.flatMap((C) => C.values.map((_) => _.term_id).filter((_) => !!_))), $ = t.variants[0] ?? { ...fe, id: V() }, N = (C = t.options) => l({ options: C, variants: mt(C, t.variants, { ...$, initial_stock: null, image: null }, s.max_variants) });
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ e(
      H,
      {
        title: "Options",
        description: `Up to ${s.max_options} options, such as size and color. Variants are made for every combination.`,
        actions: t.options.length < s.max_options && /* @__PURE__ */ e(m, { type: "button", variant: "outline", size: "sm", onClick: () => l({ options: [...t.options, { id: V(), name: "", taxonomy: null, values: [] }] }), children: "Add option" }),
        children: t.options.map((C, _) => /* @__PURE__ */ e(
          Nt,
          {
            option: C,
            config: s,
            path: `${c.path}-o${_}`,
            onChange: (D) => N(t.options.map((S, M) => M === _ ? D : S)),
            onRemove: () => N(t.options.filter((D, S) => S !== _))
          },
          C.id
        ))
      }
    ),
    /* @__PURE__ */ n(
      H,
      {
        title: `Variants (${t.variants.length})`,
        description: "Each has its own SKU, price and stock. Switch one off to stop selling it without losing it.",
        actions: /* @__PURE__ */ e(m, { type: "button", variant: "outline", size: "sm", onClick: () => N(), children: "Regenerate" }),
        children: [
          t.options.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "Add an option with values to create variants." }) : /* @__PURE__ */ e("div", { className: "cm:overflow-x-auto cm:rounded-md cm:border", children: /* @__PURE__ */ n(y, { children: [
            /* @__PURE__ */ e(h, { children: /* @__PURE__ */ n(g, { children: [
              /* @__PURE__ */ e(x, { children: "Variant" }),
              /* @__PURE__ */ e(x, { children: "SKU" }),
              /* @__PURE__ */ e(x, { children: "Price" }),
              /* @__PURE__ */ e(x, { children: "Compare-at" }),
              s.features.inventory && /* @__PURE__ */ e(x, { children: "Stock" }),
              /* @__PURE__ */ e(x, { children: "On sale" }),
              /* @__PURE__ */ e(x, {})
            ] }) }),
            /* @__PURE__ */ e(u, { children: t.variants.map((C, _) => {
              const D = d?.variants[C.id];
              return /* @__PURE__ */ n(q.Fragment, { children: [
                /* @__PURE__ */ n(g, { className: C.active ? "" : "cm:opacity-60", children: [
                  /* @__PURE__ */ e(k, { className: "cm:font-medium cm:whitespace-nowrap", children: Re(t.options, C, v) }),
                  /* @__PURE__ */ e(k, { className: "cm:min-w-36", children: /* @__PURE__ */ e(Pe, { value: C.sku, entryId: r, onChange: (S) => i(_, { sku: S }) }) }),
                  /* @__PURE__ */ e(k, { className: "cm:min-w-32", children: /* @__PURE__ */ e(Y, { value: C.price, nullable: !1, onChange: (S) => i(_, { price: S ?? 0 }) }) }),
                  /* @__PURE__ */ e(k, { className: "cm:min-w-32", children: /* @__PURE__ */ e(Y, { value: C.compare_at_price, onChange: (S) => i(_, { compare_at_price: S }) }) }),
                  s.features.inventory && /* @__PURE__ */ e(k, { className: "cm:whitespace-nowrap cm:text-sm", children: C.track_stock ? D?.stock_quantity ?? C.initial_stock ?? 0 : /* @__PURE__ */ e(j, { children: C.stock_status.replace("_", " ") }) }),
                  /* @__PURE__ */ e(k, { children: /* @__PURE__ */ e(f, { checked: C.active, "aria-label": "Sell this variant", onCheckedChange: (S) => i(_, { active: S }) }) }),
                  /* @__PURE__ */ e(k, { children: /* @__PURE__ */ e(m, { type: "button", variant: "ghost", size: "sm", "aria-expanded": p === C.id, onClick: () => a(p === C.id ? null : C.id), children: p === C.id ? "Close" : "More" }) })
                ] }),
                p === C.id && /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(k, { colSpan: 7, className: "cm:p-0", children: /* @__PURE__ */ e(_t, { variant: C, index: _, updateVariant: i, tab: c }) }) })
              ] }, C.id);
            }) })
          ] }) }),
          t.variants.length > 0 && /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
            "Prices from ",
            re(Math.min(...t.variants.map((C) => C.price))),
            " to ",
            re(Math.max(...t.variants.map((C) => C.price))),
            "."
          ] })
        ]
      }
    )
  ] });
}
function wt(c) {
  const t = c ?? {}, l = (t.variants?.length ? t.variants : [{ ...fe, id: V() }]).map((i) => ({ ...fe, ...i, id: i.id ?? V() }));
  return {
    type: t.type ?? "simple",
    purchase_mode: t.purchase_mode ?? "default",
    external_links: t.external_links ?? [],
    requires_shipping: t.requires_shipping ?? !0,
    downloadable: t.downloadable ?? !1,
    featured: t.featured ?? !1,
    tax_class: t.tax_class ?? null,
    options: t.options ?? [],
    variants: l,
    bundle: t.bundle ?? null,
    downloads: t.downloads ?? [],
    delivery: t.delivery ?? null,
    tiers: t.tiers ?? []
  };
}
function $t({ field: c, value: t, onChange: l, errors: i, pathPrefix: s = "data.product" }) {
  K();
  const r = c.config ?? {}, d = wt(t), { props: m } = P.usePage(), y = m.entry?.id ?? null, [u, k] = q.useState(null);
  q.useEffect(() => {
    y && Q(w(`commerce/api/products/${y}`)).then((N) => k(N.data)).catch(() => {
    });
  }, [y, m.entry]);
  const x = (N) => {
    const C = { ...d, ...N };
    N.type && N.type !== "variable" && (C.options = [], C.variants = [{ ...C.variants[0], options: {} }]), N.type === "bundle" && !C.bundle && (C.bundle = { pricing: "fixed", value: 0, items: [] }), l(C);
  }, h = (N, C) => x({ variants: d.variants.map((_, D) => D === N ? { ..._, ...C } : _) }), g = [{ key: "general", label: "General", render: (N) => /* @__PURE__ */ e(vt, { ...N }) }];
  d.type === "variable" && g.push({ key: "variants", label: "Variants", render: (N) => /* @__PURE__ */ e(Ct, { ...N }) }), d.type === "bundle" && g.push({ key: "bundle", label: "Bundle", render: (N) => /* @__PURE__ */ e(ht, { ...N }) }), d.type !== "variable" && (r.features?.inventory ?? !0) && g.push({ key: "inventory", label: "Inventory", render: (N) => /* @__PURE__ */ e(bt, { ...N }) }), d.requires_shipping && g.push({ key: "shipping", label: "Shipping", render: (N) => /* @__PURE__ */ e(xt, { ...N }) }), (r.features?.pricing_rules !== !1 || d.tiers.length > 0) && g.push({ key: "pricing", label: "Bulk prices", render: (N) => /* @__PURE__ */ e(yt, { ...N }) }), d.downloadable && g.push({ key: "digital", label: "Digital", render: (N) => /* @__PURE__ */ e(gt, { ...N }) });
  for (const [N, C] of Object.entries(ee.productTabs()))
    g.push({ key: `ext-${N}`, label: C.label ?? N, render: (_) => /* @__PURE__ */ e(C, { ..._ }) });
  const [f, p] = q.useState("general"), a = g.find((N) => N.key === f) ?? g[0], v = i?.[s], $ = { value: d, update: x, updateVariant: h, config: r, live: u, entryId: y, path: s.replace(/\W+/g, "-") };
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-4 cm:rounded-lg cm:border cm:p-4", children: [
    u?.sync_status === "failed" && /* @__PURE__ */ n("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: [
      "The published version couldn't be applied to the store, so it can't be bought: ",
      u.sync_error,
      ". Fix it and publish again."
    ] }),
    v && /* @__PURE__ */ e("p", { role: "alert", className: "cm:text-sm cm:text-destructive", children: v }),
    /* @__PURE__ */ e("div", { role: "tablist", "aria-label": "Product data", className: "cm:flex cm:flex-wrap cm:gap-1 cm:border-b", children: g.map((N) => /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": N.key === a.key,
        onClick: () => p(N.key),
        className: me("cm:-mb-px cm:border-b-2 cm:px-3 cm:py-2 cm:text-sm", N.key === a.key ? "cm:border-primary cm:font-medium" : "cm:border-transparent cm:text-muted-foreground cm:hover:text-foreground"),
        children: N.label
      },
      N.key
    )) }),
    /* @__PURE__ */ e("div", { role: "tabpanel", children: a.render($) })
  ] });
}
const St = {
  commerce_money: st,
  commerce_datetime_range: it,
  commerce_region: Te,
  commerce_targets: dt,
  commerce_product: $t
};
function Dt() {
  Object.entries(St).forEach(([c, t]) => L.registerField(c, t));
}
function Ft() {
  Object.assign(ee.components, { EmptyState: be, MoneyInput: te, PageHeader: G, SchemaFormView: ye, SectionNav: je, SettingsLayout: he, StatusBadge: j });
}
Oe();
Ft();
Dt();
lt();
