const se = { symbol: "Rp", position: "left", space: !1, thousands: ".", decimal: ",", decimals: 0 };
let Y = se;
function be(t) {
  Y = { ...se, ...t ?? {} };
}
function H(t, n = Y) {
  const c = t < 0, a = Math.abs(Math.round(t)), l = 10 ** n.decimals, r = Math.floor(a / l).toString().replace(/\B(?=(\d{3})+(?!\d))/g, n.thousands), s = n.decimals > 0 ? n.decimal + String(a % l).padStart(n.decimals, "0") : "", d = r + s, b = n.space ? " " : "", u = n.position === "left" ? `${n.symbol}${b}${d}` : `${d}${b}${n.symbol}`;
  return c ? `-${u}` : u;
}
function oe(t, n = Y) {
  let c = t.replace(n.symbol, "").replace(/\s/g, "");
  const a = c.startsWith("-");
  c = c.replace(/^-/, "").split(n.thousands).join("");
  const [l, r = ""] = c.split(n.decimal);
  if (!/^\d*$/.test(l) || !/^\d*$/.test(r) || l + r === "")
    return null;
  const s = Number(l || "0") * 10 ** n.decimals + Number(r.padEnd(n.decimals, "0").slice(0, n.decimals) || "0");
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
  formatMoney: H,
  parseMoney: oe,
  components: {}
};
function ve() {
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
const A = window.Sunrice, { React: $, ui: F, components: U, inertia: I, adminUrl: C, fetchJson: L, toast: ye } = A, de = window.Sunrice.React, me = de.Fragment;
function e(t, n, c) {
  return de.createElement(t, c === void 0 ? n : { ...n, key: c });
}
const i = e;
function ue({ title: t, description: n, action: c }) {
  return /* @__PURE__ */ i("div", { className: "cm:flex cm:flex-col cm:items-center cm:gap-2 cm:rounded-lg cm:border cm:border-dashed cm:px-6 cm:py-10 cm:text-center", children: [
    /* @__PURE__ */ e("p", { className: "cm:font-medium", children: t }),
    n && /* @__PURE__ */ e("p", { className: "cm:max-w-md cm:text-sm cm:text-muted-foreground", children: n }),
    c && /* @__PURE__ */ e("div", { className: "cm:mt-2", children: c })
  ] });
}
function M({ title: t, description: n, actions: c }) {
  const { Head: a } = I;
  return /* @__PURE__ */ i("div", { className: "cm:flex cm:flex-wrap cm:items-start cm:justify-between cm:gap-4", children: [
    /* @__PURE__ */ e(a, { title: t }),
    /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e("h1", { className: "cm:text-xl cm:font-semibold cm:tracking-tight", children: t }),
      n && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: n })
    ] }),
    c && /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: c })
  ] });
}
function he(t) {
  var n, c, a = "";
  if (typeof t == "string" || typeof t == "number") a += t;
  else if (typeof t == "object") if (Array.isArray(t)) {
    var l = t.length;
    for (n = 0; n < l; n++) t[n] && (c = he(t[n])) && (a && (a += " "), a += c);
  } else for (c in t) t[c] && (a && (a += " "), a += c);
  return a;
}
function ke() {
  for (var t, n, c = 0, a = "", l = arguments.length; c < l; c++) (t = arguments[c]) && (n = he(t)) && (a && (a += " "), a += n);
  return a;
}
function G(...t) {
  return ke(t);
}
const ne = {
  ok: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  success: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  warning: "cm:bg-amber-500/10 cm:text-amber-700 cm:dark:text-amber-400",
  error: "cm:bg-red-500/10 cm:text-red-700 cm:dark:text-red-400",
  info: "cm:bg-sky-500/10 cm:text-sky-700 cm:dark:text-sky-400",
  neutral: "cm:bg-muted cm:text-muted-foreground"
};
function q({ tone: t = "neutral", children: n }) {
  return /* @__PURE__ */ e("span", { className: G("cm:inline-flex cm:items-center cm:rounded-full cm:px-2 cm:py-0.5 cm:text-xs cm:font-medium", ne[t] ?? ne.neutral), children: n });
}
function O() {
  const { props: t } = I.usePage(), n = t.commerce ?? {};
  return be(n.currency), n;
}
function xe({ mode: t, setup: n, health: c, kpis: a, todo: l }) {
  const { Card: r, CardContent: s, CardHeader: d, CardTitle: b, CardDescription: u } = F, { Link: v } = I;
  O();
  const f = n.filter((p) => !p.done), g = c.filter((p) => p.status !== "ok"), m = Object.entries(z.dashboardWidgets());
  return /* @__PURE__ */ i("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(M, { title: "Store", description: /* @__PURE__ */ i(me, { children: [
      "Selling mode: ",
      t.label
    ] }) }),
    f.length > 0 && /* @__PURE__ */ i(r, { children: [
      /* @__PURE__ */ i(d, { children: [
        /* @__PURE__ */ e(b, { children: "Set up your store" }),
        /* @__PURE__ */ i(u, { children: [
          n.length - f.length,
          " of ",
          n.length,
          " done"
        ] })
      ] }),
      /* @__PURE__ */ e(s, { className: "cm:grid cm:gap-2", children: n.map((p) => /* @__PURE__ */ i(v, { href: C(p.href), className: "cm:flex cm:items-start cm:gap-3 cm:rounded-md cm:p-2 cm:hover:bg-muted", children: [
        /* @__PURE__ */ e("span", { "aria-hidden": !0, className: p.done ? "cm:text-emerald-600" : "cm:text-muted-foreground", children: p.done ? "✓" : "○" }),
        /* @__PURE__ */ i("span", { className: "cm:grid", children: [
          /* @__PURE__ */ e("span", { className: p.done ? "cm:text-muted-foreground cm:line-through" : "cm:font-medium", children: p.label }),
          p.description && /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: p.description })
        ] })
      ] }, p.key)) })
    ] }),
    g.length > 0 && /* @__PURE__ */ i(r, { children: [
      /* @__PURE__ */ e(d, { children: /* @__PURE__ */ e(b, { children: "Needs attention" }) }),
      /* @__PURE__ */ e(s, { className: "cm:grid cm:gap-3", children: g.map((p) => /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ i("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
          /* @__PURE__ */ e(q, { tone: p.status, children: p.status === "error" ? "Problem" : "Warning" }),
          /* @__PURE__ */ e("span", { className: "cm:font-medium", children: p.label })
        ] }),
        /* @__PURE__ */ e("p", { className: "cm:text-sm", children: p.message }),
        p.fix && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: p.fix })
      ] }, p.key)) })
    ] }),
    /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2 cm:lg:grid-cols-4", children: a === void 0 ? [0, 1, 2, 3].map((p) => /* @__PURE__ */ e("div", { className: "cm:h-24 cm:animate-pulse cm:rounded-lg cm:bg-muted" }, p)) : a.map((p) => /* @__PURE__ */ e(r, { children: /* @__PURE__ */ i(s, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
      /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: p.label }),
      /* @__PURE__ */ e("span", { className: "cm:text-2xl cm:font-semibold", children: p.value }),
      p.hint && /* @__PURE__ */ e("span", { className: "cm:text-xs cm:text-muted-foreground", children: p.hint })
    ] }) }, p.key)) }),
    /* @__PURE__ */ i(r, { children: [
      /* @__PURE__ */ e(d, { children: /* @__PURE__ */ e(b, { children: "To do" }) }),
      /* @__PURE__ */ e(s, { children: l === void 0 ? /* @__PURE__ */ e("div", { className: "cm:h-16 cm:animate-pulse cm:rounded-md cm:bg-muted" }) : l.length === 0 ? /* @__PURE__ */ e(ue, { title: "Nothing to do", description: "Orders to process and payments to verify show up here." }) : /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1", children: l.map((p) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ i(v, { href: C(p.href), className: "cm:flex cm:justify-between cm:rounded-md cm:p-2 cm:hover:bg-muted", children: [
        /* @__PURE__ */ e("span", { children: p.label }),
        /* @__PURE__ */ e("span", { className: "cm:font-semibold", children: p.count })
      ] }) }, p.key)) }) })
    ] }),
    m.map(([p, h]) => /* @__PURE__ */ e(h, {}, p))
  ] });
}
const _e = { in_stock: "ok", out_of_stock: "error", backorder: "warning" };
function Ne({ row: t, reasons: n, onClose: c }) {
  const { Dialog: a, DialogContent: l, DialogHeader: r, DialogTitle: s, DialogDescription: d, DialogFooter: b, Button: u, Input: v, Label: f } = F, g = I.useForm({ mode: "add", quantity: 0, reason: "manual", note: "" }), [m, p] = $.useState(null);
  $.useEffect(() => {
    L(C(`commerce/inventory/${t.id}/history`)).then((o) => p(o.data)).catch(() => p([]));
  }, [t.id]);
  const h = g.data.mode === "set" ? g.data.quantity : (t.stock_quantity ?? 0) + g.data.quantity;
  return /* @__PURE__ */ e(a, { open: !0, onOpenChange: (o) => !o && c(), children: /* @__PURE__ */ i(l, { className: "cm:max-w-lg", children: [
    /* @__PURE__ */ i(r, { children: [
      /* @__PURE__ */ e(s, { children: "Adjust stock" }),
      /* @__PURE__ */ i(d, { children: [
        t.product_title,
        t.sku ? ` · ${t.sku}` : "",
        ". Now: ",
        t.track_stock ? t.stock_quantity ?? 0 : "not tracked",
        "."
      ] })
    ] }),
    /* @__PURE__ */ i("form", { id: "adjust-stock", className: "cm:grid cm:gap-3", onSubmit: (o) => {
      o.preventDefault(), g.post(C(`commerce/inventory/${t.id}/adjust`), { preserveScroll: !0, onSuccess: c });
    }, children: [
      /* @__PURE__ */ i("div", { className: "cm:grid cm:grid-cols-2 cm:gap-3", children: [
        /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(f, { htmlFor: "adjust-mode", children: "Change" }),
          /* @__PURE__ */ i("select", { id: "adjust-mode", className: "cm:h-9 cm:rounded-md cm:border cm:bg-background cm:px-3 cm:text-sm", value: g.data.mode, onChange: (o) => g.setData("mode", o.target.value), children: [
            /* @__PURE__ */ e("option", { value: "add", children: "Add or remove" }),
            /* @__PURE__ */ e("option", { value: "set", children: "Set to" })
          ] })
        ] }),
        /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(f, { htmlFor: "adjust-quantity", children: g.data.mode === "set" ? "New stock" : "Units (+/−)" }),
          /* @__PURE__ */ e(v, { id: "adjust-quantity", type: "number", value: g.data.quantity, onChange: (o) => g.setData("quantity", Number(o.target.value)) }),
          g.errors.quantity && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-destructive", children: g.errors.quantity })
        ] })
      ] }),
      /* @__PURE__ */ i("div", { className: "cm:grid cm:grid-cols-2 cm:gap-3", children: [
        /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(f, { htmlFor: "adjust-reason", children: "Reason" }),
          /* @__PURE__ */ e("select", { id: "adjust-reason", className: "cm:h-9 cm:rounded-md cm:border cm:bg-background cm:px-3 cm:text-sm", value: g.data.reason, onChange: (o) => g.setData("reason", o.target.value), children: n.map((o) => /* @__PURE__ */ e("option", { value: o, children: o[0].toUpperCase() + o.slice(1) }, o)) })
        ] }),
        /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(f, { htmlFor: "adjust-note", children: "Note" }),
          /* @__PURE__ */ e(v, { id: "adjust-note", value: g.data.note, onChange: (o) => g.setData("note", o.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ i("p", { className: "cm:text-sm", children: [
        "Stock after: ",
        /* @__PURE__ */ e("strong", { children: h })
      ] })
    ] }),
    /* @__PURE__ */ i("div", { className: "cm:grid cm:max-h-56 cm:gap-1 cm:overflow-auto cm:border-t cm:pt-3 cm:text-sm", children: [
      /* @__PURE__ */ e("p", { className: "cm:font-medium", children: "History" }),
      m === null ? /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "Loading…" }) : m.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "No changes yet." }) : m.map((o) => /* @__PURE__ */ i("div", { className: "cm:flex cm:justify-between cm:gap-3", children: [
        /* @__PURE__ */ i("span", { children: [
          o.delta > 0 ? `+${o.delta}` : o.delta,
          " → ",
          o.quantity_after,
          " · ",
          o.reason,
          o.reference ? ` (${o.reference.type} #${o.reference.id})` : "",
          o.note ? ` · ${o.note}` : ""
        ] }),
        /* @__PURE__ */ i("span", { className: "cm:whitespace-nowrap cm:text-muted-foreground", children: [
          o.user ? `${o.user}, ` : "",
          new Date(o.at).toLocaleString()
        ] })
      ] }, o.id))
    ] }),
    /* @__PURE__ */ i(b, { children: [
      /* @__PURE__ */ e(u, { variant: "outline", type: "button", onClick: c, children: "Cancel" }),
      /* @__PURE__ */ e(u, { type: "submit", form: "adjust-stock", disabled: g.processing, children: "Save" })
    ] })
  ] }) });
}
function $e(t) {
  const { DataTable: n } = U, [c, a] = $.useState(null);
  return O(), A.useBreadcrumbs([{ label: "Shop", href: C("commerce") }, { label: "Inventory" }]), /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(M, { title: "Inventory", description: "Stock of every product variant. Every change is recorded." }),
    /* @__PURE__ */ e(
      n,
      {
        ...t,
        searchPlaceholder: "Search products or SKUs…",
        onRowClick: t.can.adjust ? (l) => a(l) : void 0,
        renderCell: (l, r) => {
          if (r.key === "status") return /* @__PURE__ */ e(q, { tone: l.low ? "warning" : _e[l.status], children: l.low ? "Low" : l.status.replace(/_/g, " ") });
          if (r.key === "stock_quantity") return l.track_stock ? l.stock_quantity : /* @__PURE__ */ e("span", { className: "cm:text-muted-foreground", children: "—" });
        }
      }
    ),
    c && /* @__PURE__ */ e(Ne, { row: c, reasons: t.reasons, onClose: () => a(null) })
  ] });
}
const we = { published: "ok", draft: "neutral", scheduled: "info", trashed: "error" };
function Ce(t) {
  const { DataTable: n } = U, { Button: c } = F, { Link: a } = I;
  return O(), A.useBreadcrumbs([{ label: "Shop", href: C("commerce") }, { label: "Products" }]), /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      M,
      {
        title: "Products",
        description: "Products are entries: opening one goes to the editor.",
        actions: /* @__PURE__ */ e(c, { asChild: !0, children: /* @__PURE__ */ e(a, { href: C(t.createUrl), children: "New product" }) })
      }
    ),
    /* @__PURE__ */ e(
      n,
      {
        ...t,
        searchPlaceholder: "Search titles or SKUs…",
        rowHref: (l) => C(l.href),
        renderCell: (l, r) => {
          switch (r.key) {
            case "product_title":
              return /* @__PURE__ */ i("span", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ e("span", { className: "cm:font-medium", children: l.product_title }),
                l.featured && /* @__PURE__ */ e(q, { tone: "info", children: "Featured" }),
                l.sync_failed && /* @__PURE__ */ e("span", { title: l.sync_error ?? "", children: /* @__PURE__ */ e(q, { tone: "error", children: "Can't be bought" }) })
              ] });
            case "state":
              return /* @__PURE__ */ e(q, { tone: we[l.state], children: l.state });
            case "stock":
              return l.stock === null ? "—" : /* @__PURE__ */ e("span", { className: l.in_stock === !1 ? "cm:text-destructive" : "", children: l.stock });
            case "type":
              return /* @__PURE__ */ e(q, { children: l.type });
            default:
              return;
          }
        }
      }
    )
  ] });
}
function ge({ items: t, current: n, label: c = "Sections" }) {
  const { Link: a } = I;
  return /* @__PURE__ */ e("nav", { "aria-label": c, className: "cm:flex cm:gap-1 cm:overflow-x-auto cm:md:flex-col", children: t.map((l) => /* @__PURE__ */ e(
    a,
    {
      href: C(l.href),
      "aria-current": l.key === n ? "page" : void 0,
      className: G(
        "cm:whitespace-nowrap cm:rounded-md cm:px-3 cm:py-1.5 cm:text-sm cm:text-muted-foreground cm:hover:bg-muted cm:hover:text-foreground",
        l.key === n && "cm:bg-muted cm:font-medium cm:text-foreground"
      ),
      children: l.label
    },
    l.key
  )) });
}
function Z({ sections: t, current: n, title: c, description: a, children: l }) {
  const { SettingsTabs: r } = U;
  return O(), A.useBreadcrumbs([{ label: "Settings", href: C("settings") }, { label: "Store", href: C("commerce/settings") }, { label: c }]), /* @__PURE__ */ i("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(r, { current: "store" }),
    /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-6 cm:md:grid-cols-[12rem_1fr]", children: [
      /* @__PURE__ */ e(ge, { items: t, current: n, label: "Store settings" }),
      /* @__PURE__ */ i("div", { className: "cm:grid cm:min-w-0 cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ e(M, { title: c, description: a }),
        l
      ] })
    ] })
  ] });
}
function Se({ sections: t, mode: n, groups: c, updateUrl: a }) {
  const { Card: l, CardContent: r, CardHeader: s, CardTitle: d, Switch: b, Button: u, Dialog: v, DialogContent: f, DialogDescription: g, DialogFooter: m, DialogHeader: p, DialogTitle: h } = F, { errors: o } = I.usePage().props, [y, w] = $.useState(null), [x, k] = $.useState(null), S = (T, N) => {
    k(T.key), I.router.put(a.replace("__key__", T.key), { on: N }, { preserveScroll: !0, onFinish: () => k(null) });
  };
  return /* @__PURE__ */ i(
    Z,
    {
      sections: t,
      current: "features",
      title: "Features",
      description: /* @__PURE__ */ i(me, { children: [
        "Switch store modules on or off. Selling mode: ",
        /* @__PURE__ */ e("strong", { children: n.label }),
        ". Switching off never deletes data."
      ] }),
      children: [
        o.feature && /* @__PURE__ */ e("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: o.feature }),
        c.map((T) => /* @__PURE__ */ i(l, { children: [
          /* @__PURE__ */ e(s, { children: /* @__PURE__ */ e(d, { children: T.label }) }),
          /* @__PURE__ */ e(r, { className: "cm:grid cm:gap-0 cm:divide-y cm:divide-border", children: T.features.map((N) => /* @__PURE__ */ i("div", { className: "cm:flex cm:items-start cm:justify-between cm:gap-4 cm:py-3 cm:first:pt-0 cm:last:pb-0", children: [
            /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ i("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ e("label", { htmlFor: `feature-${N.key}`, className: "cm:font-medium", children: N.label }),
                N.core && /* @__PURE__ */ e(q, { children: "Always on" }),
                N.switched_on && !N.active && /* @__PURE__ */ i(q, { tone: "warning", children: [
                  "Off — ",
                  N.reasons.join("; ").replace(/^Needs /, "needs ")
                ] }),
                N.essential && /* @__PURE__ */ i(q, { tone: "info", children: [
                  "Needed by ",
                  n.label
                ] })
              ] }),
              /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: N.description }),
              N.requires.length > 0 && /* @__PURE__ */ i("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                "Needs: ",
                N.requires.join(", ")
              ] })
            ] }),
            /* @__PURE__ */ e(
              b,
              {
                id: `feature-${N.key}`,
                checked: N.switched_on,
                disabled: N.core || x === N.key,
                onCheckedChange: (X) => !X && N.dependents.length > 0 ? w(N) : S(N, X)
              }
            )
          ] }, N.key)) })
        ] }, T.key)),
        /* @__PURE__ */ e(v, { open: y !== null, onOpenChange: (T) => !T && w(null), children: /* @__PURE__ */ i(f, { children: [
          /* @__PURE__ */ i(p, { children: [
            /* @__PURE__ */ i(h, { children: [
              "Switch off ",
              y?.label,
              "?"
            ] }),
            /* @__PURE__ */ i(g, { children: [
              "These are switched off with it: ",
              y?.dependents.map((T) => T.label).join(", "),
              ". Their data is kept."
            ] })
          ] }),
          /* @__PURE__ */ i(m, { children: [
            /* @__PURE__ */ e(u, { variant: "outline", onClick: () => w(null), children: "Cancel" }),
            /* @__PURE__ */ e(
              u,
              {
                variant: "destructive",
                onClick: () => {
                  y && S(y, !1), w(null);
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
function ee({ form: t, footer: n }) {
  const { FieldRenderer: c } = U, { Button: a } = F, { data: l, setData: r, errors: s, processing: d, isDirty: b, ...u } = I.useForm({ values: t.values });
  return /* @__PURE__ */ i(
    "form",
    {
      className: "cm:grid cm:gap-6",
      onSubmit: (v) => {
        v.preventDefault(), u[t.method](t.action, { preserveScroll: !0 });
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
            onChange: (v) => r("values", v)
          }
        ),
        /* @__PURE__ */ i("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
          /* @__PURE__ */ e(a, { type: "submit", disabled: d, children: t.submitLabel }),
          b && /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: "Unsaved changes" }),
          n
        ] })
      ]
    }
  );
}
function Fe({ section: t, sections: n, form: c }) {
  return /* @__PURE__ */ e(Z, { sections: n, current: t.key, title: `${t.label} settings`, children: /* @__PURE__ */ e(ee, { form: c }, t.key) });
}
function Te({ title: t, description: n, form: c, breadcrumbs: a = [], deleteUrl: l, deleteConfirm: r }) {
  const { Button: s } = F;
  return O(), A.useBreadcrumbs([...a.map((d) => ({ ...d, href: d.href ? C(d.href) : void 0 })), { label: t }]), /* @__PURE__ */ i("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-3xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(M, { title: t, description: n }),
    /* @__PURE__ */ e(ee, { form: c, footer: l ? /* @__PURE__ */ e(
      s,
      {
        type: "button",
        variant: "ghost",
        className: "cm:ml-auto cm:text-destructive",
        onClick: () => window.confirm(r ?? "Delete this?") && I.router.delete(C(l)),
        children: "Delete"
      }
    ) : null })
  ] });
}
function De(t) {
  const { DataTable: n } = U, { Button: c } = F, { Link: a } = I;
  return O(), A.useBreadcrumbs([{ label: "Shop", href: C("commerce") }, { label: t.title }]), /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      M,
      {
        title: t.title,
        description: t.description,
        actions: t.createUrl ? /* @__PURE__ */ e(c, { asChild: !0, children: /* @__PURE__ */ e(a, { href: C(t.createUrl), children: t.createLabel ?? "New" }) }) : null
      }
    ),
    /* @__PURE__ */ e(
      n,
      {
        ...t,
        bulkUrl: t.bulkUrl ? C(t.bulkUrl) : void 0,
        rowHref: (l) => l.href ? C(l.href) : null,
        renderCell: (l, r) => r.type === "badge" && l[r.key] != null ? /* @__PURE__ */ e(q, { tone: l[`${r.key}_tone`] ?? "neutral", children: String(l[r.key]) }) : void 0
      }
    )
  ] });
}
const qe = {
  "Commerce/Dashboard": xe,
  "Commerce/Inventory/Index": $e,
  "Commerce/Products/Index": Ce,
  "Commerce/Settings/Section": Fe,
  "Commerce/Settings/Features": Se,
  "Commerce/Shared/SchemaForm": Te,
  "Commerce/Shared/ResourceIndex": De
};
function je() {
  Object.entries(qe).forEach(([t, n]) => A.registerPage(t, n));
}
function ce(t) {
  if (!t) return "";
  const n = new Date(t);
  if (Number.isNaN(n.getTime())) return "";
  const c = (a) => String(a).padStart(2, "0");
  return `${n.getFullYear()}-${c(n.getMonth() + 1)}-${c(n.getDate())}T${c(n.getHours())}:${c(n.getMinutes())}`;
}
function re(t) {
  return t ? new Date(t).toISOString() : null;
}
function Ie({ value: t, onChange: n, pathPrefix: c }) {
  const { Input: a, Label: l } = F, r = { start: t?.start ?? null, end: t?.end ?? null };
  return /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(l, { htmlFor: `${c}-start`, children: "Starts" }),
      /* @__PURE__ */ e(
        a,
        {
          id: `${c}-start`,
          type: "datetime-local",
          value: ce(r.start),
          onChange: (s) => n({ ...r, start: re(s.target.value) })
        }
      )
    ] }),
    /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(l, { htmlFor: `${c}-end`, children: "Ends" }),
      /* @__PURE__ */ e(
        a,
        {
          id: `${c}-end`,
          type: "datetime-local",
          value: ce(r.end),
          onChange: (s) => n({ ...r, end: re(s.target.value) })
        }
      )
    ] })
  ] });
}
function te({
  value: t,
  onChange: n,
  id: c,
  placeholder: a,
  allowNull: l = !0,
  invalid: r
}) {
  const { Input: s } = F, d = (g) => g == null ? "" : H(g).replace(/^[^\d-]+|[^\d]+$/g, ""), [b, u] = $.useState(d(t)), [v, f] = $.useState(!1);
  return $.useEffect(() => {
    v || u(d(t));
  }, [t, v]), /* @__PURE__ */ e(
    s,
    {
      id: c,
      inputMode: "decimal",
      value: b,
      placeholder: a,
      "aria-invalid": r || void 0,
      onFocus: () => f(!0),
      onChange: (g) => {
        u(g.target.value);
        const m = g.target.value.trim() === "" ? l ? null : 0 : oe(g.target.value);
        (m !== null || g.target.value.trim() === "") && n(m);
      },
      onBlur: () => {
        f(!1), u(d(t));
      }
    }
  );
}
function Be({ field: t, value: n, onChange: c, errors: a, pathPrefix: l }) {
  return O(), /* @__PURE__ */ e(
    te,
    {
      id: l,
      value: n,
      onChange: c,
      allowNull: t.config?.allow_null !== !1,
      invalid: !!(l && a?.[l])
    }
  );
}
const le = [
  { key: "province_code", label: "Province" },
  { key: "city_code", label: "City / regency" },
  { key: "district_code", label: "District" },
  { key: "village_code", label: "Village" }
], Ee = { province: 1, city: 2, district: 3, village: 4 }, J = /* @__PURE__ */ new Map();
function Pe(t, n) {
  const c = n ? `${t}?parent=${encodeURIComponent(n)}` : t;
  return J.has(c) || J.set(c, L(c).then((a) => a.data).catch(() => (J.delete(c), []))), J.get(c);
}
const ae = "cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm cm:disabled:opacity-50";
function Re({ field: t, value: n, onChange: c, pathPrefix: a }) {
  const { Label: l } = F, r = t.config ?? {}, s = String(r.api ?? ""), d = Ee[r.depth ?? "district"] ?? 3, b = r.country_options ?? [], u = { country: "ID", province_code: null, city_code: null, district_code: null, village_code: null, ...n ?? {} }, v = le.slice(0, d), [f, g] = $.useState({}), m = [null, u.province_code, u.city_code, u.district_code];
  $.useEffect(() => {
    u.country !== "ID" || !s || v.forEach((h, o) => {
      const y = m[o];
      o > 0 && !y || Pe(s, y).then((w) => g((x) => ({ ...x, [h.key]: w })));
    });
  }, [s, u.country, u.province_code, u.city_code, u.district_code]);
  const p = (h, o) => {
    const y = { ...u };
    y[v[h].key] = o || null, le.slice(h + 1).forEach((w) => {
      y[w.key] = null;
    }), c(y);
  };
  return /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    b.length > 0 && /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(l, { htmlFor: `${a}-country`, children: "Country" }),
      /* @__PURE__ */ e(
        "select",
        {
          id: `${a}-country`,
          className: ae,
          value: u.country,
          onChange: (h) => c({ country: h.target.value, province_code: null, city_code: null, district_code: null, village_code: null }),
          children: b.map((h) => /* @__PURE__ */ e("option", { value: h.value, children: h.label }, h.value))
        }
      )
    ] }),
    u.country === "ID" && v.map((h, o) => /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(l, { htmlFor: `${a}-${h.key}`, children: h.label }),
      /* @__PURE__ */ i(
        "select",
        {
          id: `${a}-${h.key}`,
          className: ae,
          value: u[h.key] ?? "",
          disabled: o > 0 && !m[o],
          onChange: (y) => p(o, y.target.value),
          children: [
            /* @__PURE__ */ e("option", { value: "", children: "Choose…" }),
            (f[h.key] ?? []).map((y) => /* @__PURE__ */ e("option", { value: y.code, children: y.name }, y.code))
          ]
        }
      )
    ] }, h.key))
  ] });
}
function Le({ field: t, value: n, onChange: c, pathPrefix: a }) {
  const { Input: l, Badge: r } = F, s = t.config ?? {}, d = Array.isArray(n) ? n : [], [b, u] = $.useState(""), [v, f] = $.useState([]), [g, m] = $.useState(!1);
  $.useEffect(() => {
    if (!g) return;
    const o = new URLSearchParams({ q: b });
    (s.types ?? []).forEach((w) => o.append("types[]", w)), (s.taxonomies ?? []).forEach((w) => o.append("taxonomies[]", w));
    const y = setTimeout(() => L(`${s.api}?${o}`).then((w) => f(w.data)).catch(() => f([])), 200);
    return () => clearTimeout(y);
  }, [b, g]);
  const p = (o) => d.some((y) => y.type === o.type && y.id === o.id), h = { product: "Product", variant: "Variant", term: "Category/brand" };
  return /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-2", children: [
    d.length > 0 && /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: d.map((o) => /* @__PURE__ */ i(r, { variant: "secondary", className: "cm:gap-1", children: [
      /* @__PURE__ */ i("span", { className: "cm:text-muted-foreground", children: [
        h[o.type],
        ":"
      ] }),
      " ",
      o.label,
      /* @__PURE__ */ e("button", { type: "button", "aria-label": `Remove ${o.label}`, onClick: () => c(d.filter((y) => !(y.type === o.type && y.id === o.id))), children: "×" })
    ] }, `${o.type}:${o.id}`)) }),
    /* @__PURE__ */ i("div", { className: "cm:relative", children: [
      /* @__PURE__ */ e(
        l,
        {
          id: a,
          value: b,
          placeholder: "Search products, SKUs, categories, brands…",
          onFocus: () => m(!0),
          onBlur: () => setTimeout(() => m(!1), 150),
          onChange: (o) => u(o.target.value)
        }
      ),
      g && v.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-20 cm:mt-1 cm:max-h-72 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: v.map((o) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ i(
        "button",
        {
          type: "button",
          disabled: p(o),
          className: "cm:flex cm:w-full cm:justify-between cm:gap-3 cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted cm:disabled:opacity-50",
          onMouseDown: (y) => y.preventDefault(),
          onClick: () => {
            c([...d, { type: o.type, id: o.id, label: o.label }]), u("");
          },
          children: [
            /* @__PURE__ */ e("span", { children: o.label }),
            /* @__PURE__ */ e("span", { className: "cm:text-xs cm:text-muted-foreground", children: o.group })
          ]
        }
      ) }, `${o.type}:${o.id}`)) })
    ] })
  ] });
}
function E() {
  return (globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`).replace(/-/g, "").slice(0, 32);
}
function ie(t) {
  return Object.keys(t).sort().map((n) => `${n}=${t[n]}`).join("|");
}
function Ae(t) {
  let n = [{}];
  for (const c of t) {
    if (c.values.length === 0) return [];
    const a = [];
    for (const l of n)
      for (const r of c.values)
        a.push({ ...l, [c.id]: r.id });
    n = a;
  }
  return t.length === 0 ? [] : n;
}
function Oe(t, n, c, a = 100) {
  const l = new Map(n.map((r) => [ie(r.options), r]));
  return Ae(t).slice(0, a).map((r) => {
    const s = l.get(ie(r));
    return s ? { ...s, options: r } : { ...c, id: E(), sku: null, options: r, active: !0, price: c.price ?? 0 };
  });
}
function pe(t, n, c = {}) {
  return t.map((a) => {
    const l = a.values.find((r) => r.id === n.options[a.id]);
    return l ? l.label ?? (l.term_id ? c[l.term_id] ?? `#${l.term_id}` : "?") : "?";
  }).join(" / ");
}
function _({ label: t, hint: n, children: c, htmlFor: a, className: l }) {
  const { Label: r } = F;
  return /* @__PURE__ */ i("div", { className: G("cm:grid cm:gap-1.5", l), children: [
    /* @__PURE__ */ e(r, { htmlFor: a, children: t }),
    c,
    n && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: n })
  ] });
}
function W({ children: t, cols: n = 3 }) {
  return /* @__PURE__ */ e("div", { className: G("cm:grid cm:gap-4", { 2: "cm:sm:grid-cols-2", 3: "cm:sm:grid-cols-2 cm:lg:grid-cols-3", 4: "cm:sm:grid-cols-2 cm:lg:grid-cols-4" }[n]), children: t });
}
function D({ id: t, value: n, onChange: c, min: a = 0, placeholder: l }) {
  const { Input: r } = F;
  return /* @__PURE__ */ e(
    r,
    {
      id: t,
      type: "number",
      inputMode: "numeric",
      min: a,
      value: n ?? "",
      placeholder: l,
      onChange: (s) => c(s.target.value === "" ? null : Math.round(Number(s.target.value)))
    }
  );
}
function Q({ id: t, value: n, onChange: c, placeholder: a, onBlur: l }) {
  const { Input: r } = F;
  return /* @__PURE__ */ e(
    r,
    {
      id: t,
      value: n ?? "",
      placeholder: a,
      onBlur: l,
      onChange: (s) => c(s.target.value === "" ? null : s.target.value)
    }
  );
}
function R({ id: t, value: n, onChange: c, nullable: a = !0 }) {
  return /* @__PURE__ */ e(te, { id: t, value: n, allowNull: a, onChange: c });
}
function K({ id: t, label: n, checked: c, onChange: a, hint: l }) {
  const { Switch: r, Label: s } = F;
  return /* @__PURE__ */ i("div", { className: "cm:flex cm:items-start cm:gap-3", children: [
    /* @__PURE__ */ e(r, { id: t, checked: c, onCheckedChange: a }),
    /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-0.5", children: [
      /* @__PURE__ */ e(s, { htmlFor: t, children: n }),
      l && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: l })
    ] })
  ] });
}
const Ue = "cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm";
function j({ id: t, value: n, onChange: c, options: a }) {
  return /* @__PURE__ */ e("select", { id: t, className: Ue, value: n, onChange: (l) => c(l.target.value), children: a.map(([l, r]) => /* @__PURE__ */ e("option", { value: l, children: r }, l)) });
}
function B({ title: t, description: n, children: c, actions: a }) {
  return /* @__PURE__ */ i("section", { className: "cm:grid cm:gap-4", children: [
    /* @__PURE__ */ i("div", { className: "cm:flex cm:items-start cm:justify-between cm:gap-3", children: [
      /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-0.5", children: [
        /* @__PURE__ */ e("h3", { className: "cm:text-sm cm:font-semibold", children: t }),
        n && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: n })
      ] }),
      a
    ] }),
    c
  ] });
}
function Me({ value: t, update: n, path: c }) {
  const { Button: a, Input: l } = F, r = t.bundle ?? { pricing: "fixed", value: 0, items: [] }, [s, d] = $.useState({}), [b, u] = $.useState(""), [v, f] = $.useState([]), g = r.items.map((h) => h.variant_id).filter((h) => !!h);
  $.useEffect(() => {
    const h = g.filter((o) => !s[o]);
    h.length !== 0 && L(C(`commerce/api/variants?${h.map((o) => `ids[]=${o}`).join("&")}`)).then((o) => d((y) => ({ ...y, ...Object.fromEntries(o.data.map((w) => [w.id, w])) }))).catch(() => {
    });
  }, [g.join(",")]), $.useEffect(() => {
    if (b.trim().length < 2) return f([]);
    const h = setTimeout(() => L(C(`commerce/api/variants?q=${encodeURIComponent(b)}`)).then((o) => f(o.data)).catch(() => {
    }), 250);
    return () => clearTimeout(h);
  }, [b]);
  const m = (h) => n({ bundle: { ...r, ...h } }), p = r.items.reduce((h, o) => h + (s[o.variant_id ?? 0]?.price ?? 0) * o.quantity, 0);
  return /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ i(B, { title: "Products in the bundle", description: "Bundles take their stock from these products.", children: [
      r.items.map((h, o) => /* @__PURE__ */ i("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ e("span", { className: "cm:flex-1 cm:text-sm", children: s[h.variant_id ?? 0]?.label ?? `#${h.variant_id}` }),
        /* @__PURE__ */ e("div", { className: "cm:w-24", children: /* @__PURE__ */ e(D, { min: 1, value: h.quantity, onChange: (y) => m({ items: r.items.map((w, x) => x === o ? { ...w, quantity: y ?? 1 } : w) }) }) }),
        /* @__PURE__ */ e(a, { type: "button", variant: "ghost", size: "sm", onClick: () => m({ items: r.items.filter((y, w) => w !== o) }), children: "Remove" })
      ] }, o)),
      /* @__PURE__ */ i("div", { className: "cm:relative", children: [
        /* @__PURE__ */ e(l, { value: b, placeholder: "Search products or SKUs to add…", "aria-label": "Add a product to the bundle", onChange: (h) => u(h.target.value) }),
        v.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-10 cm:mt-1 cm:max-h-64 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: v.map((h) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            className: "cm:flex cm:w-full cm:justify-between cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted",
            onClick: () => {
              d((o) => ({ ...o, [h.id]: h })), m({ items: [...r.items, { variant_id: h.id, quantity: 1 }] }), u("");
            },
            children: [
              /* @__PURE__ */ i("span", { children: [
                h.label,
                h.sku && /* @__PURE__ */ i("span", { className: "cm:text-muted-foreground", children: [
                  " · ",
                  h.sku
                ] })
              ] }),
              /* @__PURE__ */ e("span", { children: H(h.price) })
            ]
          }
        ) }, h.id)) })
      ] })
    ] }),
    /* @__PURE__ */ e(B, { title: "Bundle price", description: `The products cost ${H(p)} together.`, children: /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(_, { label: "Price", htmlFor: `${c}-bundle-pricing`, children: /* @__PURE__ */ e(
        j,
        {
          id: `${c}-bundle-pricing`,
          value: r.pricing,
          onChange: (h) => m({ pricing: h, value: 0 }),
          options: [["fixed", "Its own price (General tab)"], ["percent_off", "Total minus a percentage"], ["amount_off", "Total minus an amount"]]
        }
      ) }),
      r.pricing === "percent_off" && /* @__PURE__ */ e(_, { label: "Percent off", htmlFor: `${c}-bundle-value`, children: /* @__PURE__ */ e(D, { id: `${c}-bundle-value`, value: r.value / 100, onChange: (h) => m({ value: Math.round((h ?? 0) * 100) }) }) }),
      r.pricing === "amount_off" && /* @__PURE__ */ e(_, { label: "Amount off", htmlFor: `${c}-bundle-value`, children: /* @__PURE__ */ e(R, { id: `${c}-bundle-value`, value: r.value, nullable: !1, onChange: (h) => m({ value: h ?? 0 }) }) })
    ] }) })
  ] });
}
function ze() {
  return decodeURIComponent(document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/)?.[1] ?? "");
}
function Ke({ value: t, update: n, path: c }) {
  const { Button: a } = F, [l, r] = $.useState(!1), s = $.useRef(null), d = t.delivery ?? { modes: ["link", "account"], download_limit: null, expiry_days: null }, b = (f) => n({ delivery: { ...d, ...f } }), u = (f, g) => n({ downloads: t.downloads.map((m, p) => p === f ? { ...m, ...g } : m) }), v = async (f) => {
    if (f?.length) {
      r(!0);
      try {
        const g = [];
        for (const m of Array.from(f)) {
          const p = new FormData();
          p.append("file", m);
          const h = await fetch(C("commerce/api/downloads"), { method: "POST", body: p, headers: { "X-XSRF-TOKEN": ze(), Accept: "application/json" }, credentials: "same-origin" }), o = await h.json();
          if (!h.ok) throw new Error(o.message ?? "Upload failed");
          g.push({ id: E(), type: "file", file_id: o.data.id, url: null, name: m.name.replace(/\.[^.]+$/, ""), file: o.data });
        }
        n({ downloads: [...t.downloads, ...g] });
      } catch (g) {
        ye.error(g instanceof Error ? g.message : "Upload failed");
      } finally {
        r(!1), s.current && (s.current.value = "");
      }
    }
  };
  return /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ i(
      B,
      {
        title: "Files and links",
        description: "Files are stored privately and only served to customers who bought them.",
        actions: /* @__PURE__ */ i("div", { className: "cm:flex cm:gap-2", children: [
          /* @__PURE__ */ e(a, { type: "button", variant: "outline", size: "sm", disabled: l, onClick: () => s.current?.click(), children: l ? "Uploading…" : "Upload file" }),
          /* @__PURE__ */ e(a, { type: "button", variant: "outline", size: "sm", onClick: () => n({ downloads: [...t.downloads, { id: E(), type: "url", file_id: null, url: null, name: "" }] }), children: "Add link" }),
          /* @__PURE__ */ e("input", { ref: s, type: "file", multiple: !0, hidden: !0, onChange: (f) => v(f.target.files) })
        ] }),
        children: [
          t.downloads.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No files yet." }),
          t.downloads.map((f, g) => /* @__PURE__ */ i("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(_, { label: "Name", htmlFor: `${c}-dl-${g}`, children: /* @__PURE__ */ e(Q, { id: `${c}-dl-${g}`, value: f.name, onChange: (m) => u(g, { name: m ?? "" }) }) }),
            f.type === "url" ? /* @__PURE__ */ e(_, { label: "Link", htmlFor: `${c}-dl-${g}-url`, children: /* @__PURE__ */ e(Q, { id: `${c}-dl-${g}-url`, value: f.url, placeholder: "https://", onChange: (m) => u(g, { url: m }) }) }) : /* @__PURE__ */ e(_, { label: "File", children: /* @__PURE__ */ e("p", { className: "cm:truncate cm:text-sm cm:text-muted-foreground", children: f.file?.filename ?? `File #${f.file_id}` }) }),
            /* @__PURE__ */ e(a, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ downloads: t.downloads.filter((m, p) => p !== g) }), children: "Remove" })
          ] }, f.id ?? g))
        ]
      }
    ),
    /* @__PURE__ */ i(B, { title: "Delivery", children: [
      /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-3", children: [["attachment", "Attach files to the email"], ["link", "Download links in the email"], ["account", "Library in My Account"]].map(([f, g]) => /* @__PURE__ */ e(
        K,
        {
          id: `${c}-mode-${f}`,
          label: g,
          checked: d.modes.includes(f),
          onChange: (m) => b({ modes: m ? [...d.modes, f] : d.modes.filter((p) => p !== f) })
        },
        f
      )) }),
      /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
        /* @__PURE__ */ e(_, { label: "Downloads per file", htmlFor: `${c}-limit`, hint: "Empty: unlimited.", children: /* @__PURE__ */ e(D, { id: `${c}-limit`, min: 1, value: d.download_limit, onChange: (f) => b({ download_limit: f }) }) }),
        /* @__PURE__ */ e(_, { label: "Links expire after (days)", htmlFor: `${c}-expiry`, hint: "Empty: never.", children: /* @__PURE__ */ e(D, { id: `${c}-expiry`, min: 1, value: d.expiry_days, onChange: (f) => b({ expiry_days: f }) }) })
      ] })
    ] })
  ] });
}
function fe({ id: t, value: n, onChange: c, entryId: a }) {
  const [l, r] = $.useState(null);
  return /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
    /* @__PURE__ */ e(Q, { id: t, value: n, onChange: (d) => {
      r(null), c(d);
    }, onBlur: () => {
      if (!n) return r(null);
      const d = new URLSearchParams({ sku: n, entry: String(a ?? 0) });
      L(C(`commerce/api/sku-check?${d}`)).then((b) => r(b.available ? null : b.product ?? "another product")).catch(() => r(null));
    } }),
    l && /* @__PURE__ */ i("p", { className: "cm:text-xs cm:text-destructive", children: [
      "Already used by ",
      l,
      "."
    ] })
  ] });
}
const He = [
  ["default", "Follow the store (selling mode)"],
  ["cart", "Add to cart"],
  ["inquiry", "Inquiry form"],
  ["whatsapp", "Ask on WhatsApp"],
  ["external", "Links to other shops"],
  ["none", "No button (display only)"]
];
function We({ value: t, update: n, updateVariant: c, config: a, entryId: l, path: r }) {
  const { Button: s } = F, d = [["simple", "Simple product"]];
  (a.features.variants || t.type === "variable") && d.push(["variable", "Variable product (sizes, colors…)"]), (a.features.bundles || t.type === "bundle") && d.push(["bundle", "Bundle of other products"]);
  const b = t.variants[0];
  return /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ i(W, { cols: 2, children: [
      /* @__PURE__ */ e(_, { label: "Product type", htmlFor: `${r}-type`, children: /* @__PURE__ */ e(j, { id: `${r}-type`, value: t.type, options: d, onChange: (u) => n({ type: u }) }) }),
      /* @__PURE__ */ e(_, { label: "Button on the product page", htmlFor: `${r}-mode`, hint: "'Follow the store' uses the selling mode set in Settings → Store.", children: /* @__PURE__ */ e(j, { id: `${r}-mode`, value: t.purchase_mode, options: He, onChange: (u) => n({ purchase_mode: u }) }) })
    ] }),
    t.type !== "variable" && b && /* @__PURE__ */ e(B, { title: "Price", children: /* @__PURE__ */ i(W, { cols: 4, children: [
      /* @__PURE__ */ e(_, { label: "Price", htmlFor: `${r}-price`, children: /* @__PURE__ */ e(R, { id: `${r}-price`, value: b.price, nullable: !1, onChange: (u) => c(0, { price: u ?? 0 }) }) }),
      /* @__PURE__ */ e(_, { label: "Compare-at price", htmlFor: `${r}-compare`, hint: "Shown struck through when higher.", children: /* @__PURE__ */ e(R, { id: `${r}-compare`, value: b.compare_at_price, onChange: (u) => c(0, { compare_at_price: u }) }) }),
      /* @__PURE__ */ e(_, { label: "Cost", htmlFor: `${r}-cost`, hint: "For profit reports; never shown.", children: /* @__PURE__ */ e(R, { id: `${r}-cost`, value: b.cost, onChange: (u) => c(0, { cost: u }) }) }),
      /* @__PURE__ */ e(_, { label: "SKU", htmlFor: `${r}-sku`, children: /* @__PURE__ */ e(fe, { id: `${r}-sku`, value: b.sku, entryId: l, onChange: (u) => c(0, { sku: u }) }) })
    ] }) }),
    (t.purchase_mode === "external" || t.external_links.length > 0) && /* @__PURE__ */ e(
      B,
      {
        title: "Links to other shops",
        description: "Buttons such as 'Buy on Tokopedia'.",
        actions: t.external_links.length < 10 && /* @__PURE__ */ e(s, { type: "button", variant: "outline", size: "sm", onClick: () => n({ external_links: [...t.external_links, { preset: "tokopedia", label: null, url: null }] }), children: "Add link" }),
        children: t.external_links.map((u, v) => {
          const f = (g) => n({ external_links: t.external_links.map((m, p) => p === v ? { ...m, ...g } : m) });
          return /* @__PURE__ */ i("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[10rem_1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(_, { label: "Shop", htmlFor: `${r}-link-${v}-preset`, children: /* @__PURE__ */ e(
              j,
              {
                id: `${r}-link-${v}-preset`,
                value: u.preset ?? "",
                onChange: (g) => f({ preset: g || null }),
                options: [...Object.entries(a.link_presets), ["", "Other…"]]
              }
            ) }),
            /* @__PURE__ */ e(_, { label: "Button label", htmlFor: `${r}-link-${v}-label`, children: /* @__PURE__ */ e(Q, { id: `${r}-link-${v}-label`, value: u.label, placeholder: u.preset ? `Buy on ${a.link_presets[u.preset]}` : "", onChange: (g) => f({ label: g }) }) }),
            /* @__PURE__ */ e(_, { label: "Link", htmlFor: `${r}-link-${v}-url`, children: /* @__PURE__ */ e(Q, { id: `${r}-link-${v}-url`, value: u.url, placeholder: "https://", onChange: (g) => f({ url: g }) }) }),
            /* @__PURE__ */ e(s, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ external_links: t.external_links.filter((g, m) => m !== v) }), children: "Remove" })
          ] }, v);
        })
      }
    ),
    /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(K, { id: `${r}-shipping`, label: "Needs shipping", checked: t.requires_shipping, onChange: (u) => n({ requires_shipping: u }), hint: "Off for services and digital products." }),
      (a.features.digital || t.downloadable) && /* @__PURE__ */ e(K, { id: `${r}-downloadable`, label: "Downloadable", checked: t.downloadable, onChange: (u) => n({ downloadable: u }), hint: "Customers get files or links after paying." }),
      /* @__PURE__ */ e(K, { id: `${r}-featured`, label: "Featured", checked: t.featured, onChange: (u) => n({ featured: u }), hint: "Shown first when sorting by featured." })
    ] }),
    a.features.taxes && /* @__PURE__ */ e(_, { label: "Tax class", htmlFor: `${r}-tax`, children: /* @__PURE__ */ e(
      j,
      {
        id: `${r}-tax`,
        value: t.tax_class ?? "",
        onChange: (u) => n({ tax_class: u || null }),
        options: [["", "Standard"], ...a.tax_classes.filter((u) => u !== "standard").map((u) => [u, u])]
      }
    ) })
  ] });
}
function Qe({ value: t, updateVariant: n, live: c, path: a }) {
  const l = t.variants[0];
  if (!l) return null;
  const r = c?.variants[l.id];
  return /* @__PURE__ */ i(B, { title: "Stock", children: [
    /* @__PURE__ */ e(
      K,
      {
        id: `${a}-track`,
        label: "Track stock",
        checked: l.track_stock,
        onChange: (s) => n(0, { track_stock: s }),
        hint: "Count units: orders take them, cancellations give them back."
      }
    ),
    l.track_stock ? /* @__PURE__ */ i(W, { cols: 3, children: [
      r?.track_stock && r.stock_quantity !== null ? /* @__PURE__ */ e(_, { label: "In stock", hint: "Change it in Shop → Inventory, so every change is recorded.", children: /* @__PURE__ */ e("p", { className: "cm:text-2xl cm:font-semibold", children: r.stock_quantity }) }) : /* @__PURE__ */ e(_, { label: "Starting stock", htmlFor: `${a}-initial`, hint: "Set once, when the product is published.", children: /* @__PURE__ */ e(D, { id: `${a}-initial`, value: l.initial_stock, onChange: (s) => n(0, { initial_stock: s }) }) }),
      /* @__PURE__ */ e(_, { label: "When sold out", htmlFor: `${a}-backorders`, children: /* @__PURE__ */ e(
        j,
        {
          id: `${a}-backorders`,
          value: l.backorders,
          onChange: (s) => n(0, { backorders: s }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }),
      /* @__PURE__ */ e(_, { label: "Low stock at", htmlFor: `${a}-low`, hint: "Empty: the store's setting.", children: /* @__PURE__ */ e(D, { id: `${a}-low`, value: l.low_stock_threshold, onChange: (s) => n(0, { low_stock_threshold: s }) }) })
    ] }) : /* @__PURE__ */ e(_, { label: "Stock status", htmlFor: `${a}-status`, children: /* @__PURE__ */ e(
      j,
      {
        id: `${a}-status`,
        value: l.stock_status,
        onChange: (s) => n(0, { stock_status: s }),
        options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
      }
    ) })
  ] });
}
function Ge({ value: t, update: n, path: c }) {
  const { Button: a } = F, l = (r, s) => n({ tiers: t.tiers.map((d, b) => b === r ? { ...d, ...s } : d) });
  return /* @__PURE__ */ i(
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
        t.tiers.map((r, s) => /* @__PURE__ */ i("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[8rem_12rem_1fr_1fr_auto]", children: [
          /* @__PURE__ */ e(_, { label: "From (units)", htmlFor: `${c}-tier-${s}-min`, children: /* @__PURE__ */ e(D, { id: `${c}-tier-${s}-min`, min: 2, value: r.min_qty, onChange: (d) => l(s, { min_qty: d ?? 2 }) }) }),
          /* @__PURE__ */ e(_, { label: "Price", htmlFor: `${c}-tier-${s}-type`, children: /* @__PURE__ */ e(
            j,
            {
              id: `${c}-tier-${s}-type`,
              value: r.type,
              onChange: (d) => l(s, { type: d, value: 0 }),
              options: [["percent_off", "Percent off"], ["amount_off", "Amount off per unit"], ["fixed_price", "Fixed unit price"]]
            }
          ) }),
          /* @__PURE__ */ e(_, { label: r.type === "percent_off" ? "Percent" : "Amount", htmlFor: `${c}-tier-${s}-value`, children: r.type === "percent_off" ? /* @__PURE__ */ e(D, { id: `${c}-tier-${s}-value`, value: r.value / 100, onChange: (d) => l(s, { value: Math.round((d ?? 0) * 100) }) }) : /* @__PURE__ */ e(R, { id: `${c}-tier-${s}-value`, value: r.value, nullable: !1, onChange: (d) => l(s, { value: d ?? 0 }) }) }),
          /* @__PURE__ */ e(_, { label: "For", htmlFor: `${c}-tier-${s}-variant`, children: /* @__PURE__ */ e(
            j,
            {
              id: `${c}-tier-${s}-variant`,
              value: r.variant ?? "",
              onChange: (d) => l(s, { variant: d || null }),
              options: [["", "All variants"], ...t.type === "variable" ? t.variants.map((d) => [d.id, pe(t.options, d)]) : []]
            }
          ) }),
          /* @__PURE__ */ e(a, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ tiers: t.tiers.filter((d, b) => b !== s) }), children: "Remove" })
        ] }, s))
      ]
    }
  );
}
function Xe({ value: t, update: n, updateVariant: c, path: a }) {
  const l = t.variants[0];
  if (!l) return null;
  const r = (s) => t.type === "variable" ? n({ variants: t.variants.map((d) => ({ ...d, ...s })) }) : c(0, s);
  return /* @__PURE__ */ e(B, { title: "Package", description: t.type === "variable" ? "Applies to every variant; a variant can have its own weight under More." : "Used for shipping rates.", children: /* @__PURE__ */ i(W, { cols: 4, children: [
    /* @__PURE__ */ e(_, { label: "Weight (grams)", htmlFor: `${a}-weight`, children: /* @__PURE__ */ e(D, { id: `${a}-weight`, value: l.weight, onChange: (s) => r({ weight: s }) }) }),
    /* @__PURE__ */ e(_, { label: "Length (mm)", htmlFor: `${a}-length`, children: /* @__PURE__ */ e(D, { id: `${a}-length`, value: l.length, onChange: (s) => r({ length: s }) }) }),
    /* @__PURE__ */ e(_, { label: "Width (mm)", htmlFor: `${a}-width`, children: /* @__PURE__ */ e(D, { id: `${a}-width`, value: l.width, onChange: (s) => r({ width: s }) }) }),
    /* @__PURE__ */ e(_, { label: "Height (mm)", htmlFor: `${a}-height`, children: /* @__PURE__ */ e(D, { id: `${a}-height`, value: l.height, onChange: (s) => r({ height: s }) }) })
  ] }) });
}
const V = {
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
function Je(t) {
  const [n, c] = $.useState({}), a = t.filter((l) => !(l in n));
  return $.useEffect(() => {
    if (a.length === 0) return;
    const l = a.map((r) => `ids[]=${r}`).join("&");
    L(C(`api/terms?${l}`)).then((r) => c((s) => ({ ...s, ...Object.fromEntries(r.data.map((d) => [d.id, d.title])) }))).catch(() => {
    });
  }, [a.join(",")]), n;
}
function Ve({ option: t, onChange: n, onRemove: c, config: a, path: l }) {
  const { Button: r, Input: s, Badge: d } = F, { FieldRenderer: b } = U, [u, v] = $.useState(""), f = () => {
    const m = u.split(",").map((p) => p.trim()).filter(Boolean).filter((p) => !t.values.some((h) => (h.label ?? "").toLowerCase() === p.toLowerCase()));
    m.length && n({ ...t, values: [...t.values, ...m.map((p) => ({ id: E(), label: p }))] }), v("");
  }, g = t.values.map((m) => m.term_id).filter((m) => !!m);
  return /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-3 cm:rounded-md cm:border cm:p-3", children: [
    /* @__PURE__ */ i("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_1fr_auto]", children: [
      /* @__PURE__ */ e(_, { label: "Option name", htmlFor: `${l}-name`, children: /* @__PURE__ */ e(s, { id: `${l}-name`, value: t.name, placeholder: "Size", onChange: (m) => n({ ...t, name: m.target.value }) }) }),
      a.attribute_taxonomies.length > 0 ? /* @__PURE__ */ e(_, { label: "Values from", htmlFor: `${l}-source`, children: /* @__PURE__ */ e(
        j,
        {
          id: `${l}-source`,
          value: t.taxonomy ?? "",
          onChange: (m) => n({ ...t, taxonomy: m || null, values: [] }),
          options: [["", "Custom values"], ...a.attribute_taxonomies.map((m) => [m.handle, m.title])]
        }
      ) }) : /* @__PURE__ */ e("div", {}),
      /* @__PURE__ */ e(r, { type: "button", variant: "ghost", size: "sm", onClick: c, children: "Remove option" })
    ] }),
    t.taxonomy ? /* @__PURE__ */ e(
      b,
      {
        fields: [{ handle: "terms", type: "terms", label: "Values", config: { taxonomy: t.taxonomy } }],
        values: { terms: g },
        pathPrefix: `${l}-terms`,
        onChange: (m) => {
          const p = m.terms ?? [], h = t.values.filter((y) => y.term_id && p.includes(y.term_id)), o = p.filter((y) => !h.some((w) => w.term_id === y)).map((y) => ({ id: E(), term_id: y }));
          n({ ...t, values: [...h, ...o] });
        }
      }
    ) : /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-2", children: [
      /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: t.values.map((m) => /* @__PURE__ */ i(d, { variant: "secondary", className: "cm:gap-1", children: [
        m.label,
        /* @__PURE__ */ e("button", { type: "button", "aria-label": `Remove ${m.label}`, onClick: () => n({ ...t, values: t.values.filter((p) => p.id !== m.id) }), children: "×" })
      ] }, m.id)) }),
      /* @__PURE__ */ i("div", { className: "cm:flex cm:gap-2", children: [
        /* @__PURE__ */ e(
          s,
          {
            value: u,
            placeholder: "S, M, L",
            "aria-label": `Add values to ${t.name || "option"}`,
            onChange: (m) => v(m.target.value),
            onKeyDown: (m) => {
              m.key === "Enter" && (m.preventDefault(), f());
            }
          }
        ),
        /* @__PURE__ */ e(r, { type: "button", variant: "outline", onClick: f, children: "Add" })
      ] })
    ] })
  ] });
}
function Ye({ variant: t, index: n, updateVariant: c, tab: a }) {
  const { FieldRenderer: l } = U, r = `${a.path}-v${n}`, s = a.live?.variants[t.id];
  return /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-4 cm:bg-muted/40 cm:p-4", children: [
    /* @__PURE__ */ i(W, { cols: 4, children: [
      /* @__PURE__ */ e(_, { label: "Cost", htmlFor: `${r}-cost`, children: /* @__PURE__ */ e(R, { id: `${r}-cost`, value: t.cost, onChange: (d) => c(n, { cost: d }) }) }),
      /* @__PURE__ */ e(_, { label: "Barcode", htmlFor: `${r}-barcode`, children: /* @__PURE__ */ e(Q, { id: `${r}-barcode`, value: t.barcode, onChange: (d) => c(n, { barcode: d }) }) }),
      /* @__PURE__ */ e(_, { label: "Weight (g)", htmlFor: `${r}-weight`, children: /* @__PURE__ */ e(D, { id: `${r}-weight`, value: t.weight, onChange: (d) => c(n, { weight: d }), placeholder: "Product's" }) }),
      /* @__PURE__ */ e(_, { label: "Min / max / step", htmlFor: `${r}-min`, children: /* @__PURE__ */ i("div", { className: "cm:grid cm:grid-cols-3 cm:gap-1", children: [
        /* @__PURE__ */ e(D, { id: `${r}-min`, min: 1, value: t.min_qty, onChange: (d) => c(n, { min_qty: d ?? 1 }) }),
        /* @__PURE__ */ e(D, { min: 1, value: t.max_qty, onChange: (d) => c(n, { max_qty: d }), placeholder: "–" }),
        /* @__PURE__ */ e(D, { min: 1, value: t.qty_step, onChange: (d) => c(n, { qty_step: d ?? 1 }) })
      ] }) })
    ] }),
    a.config.features.inventory && /* @__PURE__ */ i(W, { cols: 4, children: [
      /* @__PURE__ */ e(K, { id: `${r}-track`, label: "Track stock", checked: t.track_stock, onChange: (d) => c(n, { track_stock: d }) }),
      t.track_stock && (s?.track_stock && s.stock_quantity !== null ? /* @__PURE__ */ e(_, { label: "In stock", children: /* @__PURE__ */ i("p", { className: "cm:text-sm", children: [
        s.stock_quantity,
        " ",
        /* @__PURE__ */ e("span", { className: "cm:text-muted-foreground", children: "(change it in Shop → Inventory)" })
      ] }) }) : /* @__PURE__ */ e(_, { label: "Starting stock", htmlFor: `${r}-initial`, children: /* @__PURE__ */ e(D, { id: `${r}-initial`, value: t.initial_stock, onChange: (d) => c(n, { initial_stock: d }) }) })),
      t.track_stock ? /* @__PURE__ */ e(_, { label: "When sold out", htmlFor: `${r}-backorders`, children: /* @__PURE__ */ e(
        j,
        {
          id: `${r}-backorders`,
          value: t.backorders,
          onChange: (d) => c(n, { backorders: d }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }) : /* @__PURE__ */ e(_, { label: "Stock status", htmlFor: `${r}-status`, children: /* @__PURE__ */ e(
        j,
        {
          id: `${r}-status`,
          value: t.stock_status,
          onChange: (d) => c(n, { stock_status: d }),
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
        onChange: (d) => c(n, { image: d.image ?? null })
      }
    )
  ] });
}
function Ze(t) {
  const { value: n, update: c, updateVariant: a, config: l, entryId: r, live: s } = t, { Button: d, Table: b, TableBody: u, TableCell: v, TableHead: f, TableHeader: g, TableRow: m, Switch: p } = F, [h, o] = $.useState(null), y = Je(n.options.flatMap((k) => k.values.map((S) => S.term_id).filter((S) => !!S))), w = n.variants[0] ?? { ...V, id: E() }, x = (k = n.options) => c({ options: k, variants: Oe(k, n.variants, { ...w, initial_stock: null, image: null }, l.max_variants) });
  return /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ e(
      B,
      {
        title: "Options",
        description: `Up to ${l.max_options} options, such as size and color. Variants are made for every combination.`,
        actions: n.options.length < l.max_options && /* @__PURE__ */ e(d, { type: "button", variant: "outline", size: "sm", onClick: () => c({ options: [...n.options, { id: E(), name: "", taxonomy: null, values: [] }] }), children: "Add option" }),
        children: n.options.map((k, S) => /* @__PURE__ */ e(
          Ve,
          {
            option: k,
            config: l,
            path: `${t.path}-o${S}`,
            onChange: (T) => x(n.options.map((N, X) => X === S ? T : N)),
            onRemove: () => x(n.options.filter((T, N) => N !== S))
          },
          k.id
        ))
      }
    ),
    /* @__PURE__ */ i(
      B,
      {
        title: `Variants (${n.variants.length})`,
        description: "Each has its own SKU, price and stock. Switch one off to stop selling it without losing it.",
        actions: /* @__PURE__ */ e(d, { type: "button", variant: "outline", size: "sm", onClick: () => x(), children: "Regenerate" }),
        children: [
          n.options.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "Add an option with values to create variants." }) : /* @__PURE__ */ e("div", { className: "cm:overflow-x-auto cm:rounded-md cm:border", children: /* @__PURE__ */ i(b, { children: [
            /* @__PURE__ */ e(g, { children: /* @__PURE__ */ i(m, { children: [
              /* @__PURE__ */ e(f, { children: "Variant" }),
              /* @__PURE__ */ e(f, { children: "SKU" }),
              /* @__PURE__ */ e(f, { children: "Price" }),
              /* @__PURE__ */ e(f, { children: "Compare-at" }),
              l.features.inventory && /* @__PURE__ */ e(f, { children: "Stock" }),
              /* @__PURE__ */ e(f, { children: "On sale" }),
              /* @__PURE__ */ e(f, {})
            ] }) }),
            /* @__PURE__ */ e(u, { children: n.variants.map((k, S) => {
              const T = s?.variants[k.id];
              return /* @__PURE__ */ i($.Fragment, { children: [
                /* @__PURE__ */ i(m, { className: k.active ? "" : "cm:opacity-60", children: [
                  /* @__PURE__ */ e(v, { className: "cm:font-medium cm:whitespace-nowrap", children: pe(n.options, k, y) }),
                  /* @__PURE__ */ e(v, { className: "cm:min-w-36", children: /* @__PURE__ */ e(fe, { value: k.sku, entryId: r, onChange: (N) => a(S, { sku: N }) }) }),
                  /* @__PURE__ */ e(v, { className: "cm:min-w-32", children: /* @__PURE__ */ e(R, { value: k.price, nullable: !1, onChange: (N) => a(S, { price: N ?? 0 }) }) }),
                  /* @__PURE__ */ e(v, { className: "cm:min-w-32", children: /* @__PURE__ */ e(R, { value: k.compare_at_price, onChange: (N) => a(S, { compare_at_price: N }) }) }),
                  l.features.inventory && /* @__PURE__ */ e(v, { className: "cm:whitespace-nowrap cm:text-sm", children: k.track_stock ? T?.stock_quantity ?? k.initial_stock ?? 0 : /* @__PURE__ */ e(q, { children: k.stock_status.replace("_", " ") }) }),
                  /* @__PURE__ */ e(v, { children: /* @__PURE__ */ e(p, { checked: k.active, "aria-label": "Sell this variant", onCheckedChange: (N) => a(S, { active: N }) }) }),
                  /* @__PURE__ */ e(v, { children: /* @__PURE__ */ e(d, { type: "button", variant: "ghost", size: "sm", "aria-expanded": h === k.id, onClick: () => o(h === k.id ? null : k.id), children: h === k.id ? "Close" : "More" }) })
                ] }),
                h === k.id && /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(v, { colSpan: 7, className: "cm:p-0", children: /* @__PURE__ */ e(Ye, { variant: k, index: S, updateVariant: a, tab: t }) }) })
              ] }, k.id);
            }) })
          ] }) }),
          n.variants.length > 0 && /* @__PURE__ */ i("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
            "Prices from ",
            H(Math.min(...n.variants.map((k) => k.price))),
            " to ",
            H(Math.max(...n.variants.map((k) => k.price))),
            "."
          ] })
        ]
      }
    )
  ] });
}
function et(t) {
  const n = t ?? {}, c = (n.variants?.length ? n.variants : [{ ...V, id: E() }]).map((a) => ({ ...V, ...a, id: a.id ?? E() }));
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
function tt({ field: t, value: n, onChange: c, errors: a, pathPrefix: l = "data.product" }) {
  O();
  const r = t.config ?? {}, s = et(n), { props: d } = I.usePage(), b = d.entry?.id ?? null, [u, v] = $.useState(null);
  $.useEffect(() => {
    b && L(C(`commerce/api/products/${b}`)).then((x) => v(x.data)).catch(() => {
    });
  }, [b, d.entry]);
  const f = (x) => {
    const k = { ...s, ...x };
    x.type && x.type !== "variable" && (k.options = [], k.variants = [{ ...k.variants[0], options: {} }]), x.type === "bundle" && !k.bundle && (k.bundle = { pricing: "fixed", value: 0, items: [] }), c(k);
  }, g = (x, k) => f({ variants: s.variants.map((S, T) => T === x ? { ...S, ...k } : S) }), m = [{ key: "general", label: "General", render: (x) => /* @__PURE__ */ e(We, { ...x }) }];
  s.type === "variable" && m.push({ key: "variants", label: "Variants", render: (x) => /* @__PURE__ */ e(Ze, { ...x }) }), s.type === "bundle" && m.push({ key: "bundle", label: "Bundle", render: (x) => /* @__PURE__ */ e(Me, { ...x }) }), s.type !== "variable" && (r.features?.inventory ?? !0) && m.push({ key: "inventory", label: "Inventory", render: (x) => /* @__PURE__ */ e(Qe, { ...x }) }), s.requires_shipping && m.push({ key: "shipping", label: "Shipping", render: (x) => /* @__PURE__ */ e(Xe, { ...x }) }), (r.features?.pricing_rules !== !1 || s.tiers.length > 0) && m.push({ key: "pricing", label: "Bulk prices", render: (x) => /* @__PURE__ */ e(Ge, { ...x }) }), s.downloadable && m.push({ key: "digital", label: "Digital", render: (x) => /* @__PURE__ */ e(Ke, { ...x }) });
  for (const [x, k] of Object.entries(z.productTabs()))
    m.push({ key: `ext-${x}`, label: k.label ?? x, render: (S) => /* @__PURE__ */ e(k, { ...S }) });
  const [p, h] = $.useState("general"), o = m.find((x) => x.key === p) ?? m[0], y = a?.[l], w = { value: s, update: f, updateVariant: g, config: r, live: u, entryId: b, path: l.replace(/\W+/g, "-") };
  return /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-4 cm:rounded-lg cm:border cm:p-4", children: [
    u?.sync_status === "failed" && /* @__PURE__ */ i("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: [
      "The published version couldn't be applied to the store, so it can't be bought: ",
      u.sync_error,
      ". Fix it and publish again."
    ] }),
    y && /* @__PURE__ */ e("p", { role: "alert", className: "cm:text-sm cm:text-destructive", children: y }),
    /* @__PURE__ */ e("div", { role: "tablist", "aria-label": "Product data", className: "cm:flex cm:flex-wrap cm:gap-1 cm:border-b", children: m.map((x) => /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": x.key === o.key,
        onClick: () => h(x.key),
        className: G("cm:-mb-px cm:border-b-2 cm:px-3 cm:py-2 cm:text-sm", x.key === o.key ? "cm:border-primary cm:font-medium" : "cm:border-transparent cm:text-muted-foreground cm:hover:text-foreground"),
        children: x.label
      },
      x.key
    )) }),
    /* @__PURE__ */ e("div", { role: "tabpanel", children: o.render(w) })
  ] });
}
const nt = {
  commerce_money: Be,
  commerce_datetime_range: Ie,
  commerce_region: Re,
  commerce_targets: Le,
  commerce_product: tt
};
function ct() {
  Object.entries(nt).forEach(([t, n]) => A.registerField(t, n));
}
function rt() {
  Object.assign(z.components, { EmptyState: ue, MoneyInput: te, PageHeader: M, SchemaFormView: ee, SectionNav: ge, SettingsLayout: Z, StatusBadge: q });
}
ve();
rt();
ct();
je();
