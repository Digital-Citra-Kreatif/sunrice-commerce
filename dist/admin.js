const se = { symbol: "Rp", position: "left", space: !1, thousands: ".", decimal: ",", decimals: 0 };
let V = se;
function be(t) {
  V = { ...se, ...t ?? {} };
}
function z(t, n = V) {
  const c = t < 0, l = Math.abs(Math.round(t)), a = 10 ** n.decimals, r = Math.floor(l / a).toString().replace(/\B(?=(\d{3})+(?!\d))/g, n.thousands), s = n.decimals > 0 ? n.decimal + String(l % a).padStart(n.decimals, "0") : "", o = r + s, b = n.space ? " " : "", m = n.position === "left" ? `${n.symbol}${b}${o}` : `${o}${b}${n.symbol}`;
  return c ? `-${m}` : m;
}
function oe(t, n = V) {
  let c = t.replace(n.symbol, "").replace(/\s/g, "");
  const l = c.startsWith("-");
  c = c.replace(/^-/, "").split(n.thousands).join("");
  const [a, r = ""] = c.split(n.decimal);
  if (!/^\d*$/.test(a) || !/^\d*$/.test(r) || a + r === "")
    return null;
  const s = Number(a || "0") * 10 ** n.decimals + Number(r.padEnd(n.decimals, "0").slice(0, n.decimals) || "0");
  return l ? -s : s;
}
const E = {
  orderPanels: {},
  dashboardWidgets: {},
  settingsSections: {},
  productTabs: {}
}, M = {
  version: 1,
  registerOrderPanel: (t, n) => {
    E.orderPanels[t] = n;
  },
  registerDashboardWidget: (t, n) => {
    E.dashboardWidgets[t] = n;
  },
  registerSettingsSection: (t, n) => {
    E.settingsSections[t] = n;
  },
  registerProductTab: (t, n) => {
    E.productTabs[t] = n;
  },
  orderPanels: () => E.orderPanels,
  dashboardWidgets: () => E.dashboardWidgets,
  settingsSections: () => E.settingsSections,
  productTabs: () => E.productTabs,
  formatMoney: z,
  parseMoney: oe,
  components: {}
};
function ve() {
  window.SunriceCommerce = M;
  const t = window.SunriceCommerceQueue ?? [];
  (() => {
    for (; t.length > 0; ) {
      const c = t.shift();
      try {
        c?.(M);
      } catch (l) {
        console.error("SunriceCommerceQueue call failed", l);
      }
    }
  })(), t.push = ((...c) => (c.forEach((l) => l(M)), t.length)), window.SunriceCommerceQueue = t;
}
const R = window.Sunrice, { React: $, ui: S, components: W, inertia: B, adminUrl: D, fetchJson: O, toast: ye } = R, de = window.Sunrice.React, me = de.Fragment;
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
function G({ title: t, description: n, actions: c }) {
  const { Head: l } = B;
  return /* @__PURE__ */ i("div", { className: "cm:flex cm:flex-wrap cm:items-start cm:justify-between cm:gap-4", children: [
    /* @__PURE__ */ e(l, { title: t }),
    /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e("h1", { className: "cm:text-xl cm:font-semibold cm:tracking-tight", children: t }),
      n && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: n })
    ] }),
    c && /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: c })
  ] });
}
function he(t) {
  var n, c, l = "";
  if (typeof t == "string" || typeof t == "number") l += t;
  else if (typeof t == "object") if (Array.isArray(t)) {
    var a = t.length;
    for (n = 0; n < a; n++) t[n] && (c = he(t[n])) && (l && (l += " "), l += c);
  } else for (c in t) t[c] && (l && (l += " "), l += c);
  return l;
}
function ke() {
  for (var t, n, c = 0, l = "", a = arguments.length; c < a; c++) (t = arguments[c]) && (n = he(t)) && (l && (l += " "), l += n);
  return l;
}
function Q(...t) {
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
function j({ tone: t = "neutral", children: n }) {
  return /* @__PURE__ */ e("span", { className: Q("cm:inline-flex cm:items-center cm:rounded-full cm:px-2 cm:py-0.5 cm:text-xs cm:font-medium", ne[t] ?? ne.neutral), children: n });
}
function A() {
  const { props: t } = B.usePage(), n = t.commerce ?? {};
  return be(n.currency), n;
}
function xe({ mode: t, setup: n, health: c, kpis: l, todo: a }) {
  const { Card: r, CardContent: s, CardHeader: o, CardTitle: b, CardDescription: m } = S, { Link: v } = B;
  A();
  const f = n.filter((g) => !g.done), p = c.filter((g) => g.status !== "ok"), d = Object.entries(M.dashboardWidgets());
  return /* @__PURE__ */ i("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(G, { title: "Store", description: /* @__PURE__ */ i(me, { children: [
      "Selling mode: ",
      t.label
    ] }) }),
    f.length > 0 && /* @__PURE__ */ i(r, { children: [
      /* @__PURE__ */ i(o, { children: [
        /* @__PURE__ */ e(b, { children: "Set up your store" }),
        /* @__PURE__ */ i(m, { children: [
          n.length - f.length,
          " of ",
          n.length,
          " done"
        ] })
      ] }),
      /* @__PURE__ */ e(s, { className: "cm:grid cm:gap-2", children: n.map((g) => /* @__PURE__ */ i(v, { href: D(g.href), className: "cm:flex cm:items-start cm:gap-3 cm:rounded-md cm:p-2 cm:hover:bg-muted", children: [
        /* @__PURE__ */ e("span", { "aria-hidden": !0, className: g.done ? "cm:text-emerald-600" : "cm:text-muted-foreground", children: g.done ? "✓" : "○" }),
        /* @__PURE__ */ i("span", { className: "cm:grid", children: [
          /* @__PURE__ */ e("span", { className: g.done ? "cm:text-muted-foreground cm:line-through" : "cm:font-medium", children: g.label }),
          g.description && /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: g.description })
        ] })
      ] }, g.key)) })
    ] }),
    p.length > 0 && /* @__PURE__ */ i(r, { children: [
      /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(b, { children: "Needs attention" }) }),
      /* @__PURE__ */ e(s, { className: "cm:grid cm:gap-3", children: p.map((g) => /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ i("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
          /* @__PURE__ */ e(j, { tone: g.status, children: g.status === "error" ? "Problem" : "Warning" }),
          /* @__PURE__ */ e("span", { className: "cm:font-medium", children: g.label })
        ] }),
        /* @__PURE__ */ e("p", { className: "cm:text-sm", children: g.message }),
        g.fix && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: g.fix })
      ] }, g.key)) })
    ] }),
    /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2 cm:lg:grid-cols-4", children: l === void 0 ? [0, 1, 2, 3].map((g) => /* @__PURE__ */ e("div", { className: "cm:h-24 cm:animate-pulse cm:rounded-lg cm:bg-muted" }, g)) : l.map((g) => /* @__PURE__ */ e(r, { children: /* @__PURE__ */ i(s, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
      /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: g.label }),
      /* @__PURE__ */ e("span", { className: "cm:text-2xl cm:font-semibold", children: g.value }),
      g.hint && /* @__PURE__ */ e("span", { className: "cm:text-xs cm:text-muted-foreground", children: g.hint })
    ] }) }, g.key)) }),
    /* @__PURE__ */ i(r, { children: [
      /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(b, { children: "To do" }) }),
      /* @__PURE__ */ e(s, { children: a === void 0 ? /* @__PURE__ */ e("div", { className: "cm:h-16 cm:animate-pulse cm:rounded-md cm:bg-muted" }) : a.length === 0 ? /* @__PURE__ */ e(ue, { title: "Nothing to do", description: "Orders to process and payments to verify show up here." }) : /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1", children: a.map((g) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ i(v, { href: D(g.href), className: "cm:flex cm:justify-between cm:rounded-md cm:p-2 cm:hover:bg-muted", children: [
        /* @__PURE__ */ e("span", { children: g.label }),
        /* @__PURE__ */ e("span", { className: "cm:font-semibold", children: g.count })
      ] }) }, g.key)) }) })
    ] }),
    d.map(([g, h]) => /* @__PURE__ */ e(h, {}, g))
  ] });
}
const _e = { in_stock: "ok", out_of_stock: "error", backorder: "warning" };
function Ne({ row: t, reasons: n, onClose: c }) {
  const { Dialog: l, DialogContent: a, DialogHeader: r, DialogTitle: s, DialogDescription: o, DialogFooter: b, Button: m, Input: v, Label: f } = S, p = B.useForm({ mode: "add", quantity: 0, reason: "manual", note: "" }), [d, g] = $.useState(null);
  $.useEffect(() => {
    O(D(`commerce/inventory/${t.id}/history`)).then((u) => g(u.data)).catch(() => g([]));
  }, [t.id]);
  const h = p.data.mode === "set" ? p.data.quantity : (t.stock_quantity ?? 0) + p.data.quantity;
  return /* @__PURE__ */ e(l, { open: !0, onOpenChange: (u) => !u && c(), children: /* @__PURE__ */ i(a, { className: "cm:max-w-lg", children: [
    /* @__PURE__ */ i(r, { children: [
      /* @__PURE__ */ e(s, { children: "Adjust stock" }),
      /* @__PURE__ */ i(o, { children: [
        t.product_title,
        t.sku ? ` · ${t.sku}` : "",
        ". Now: ",
        t.track_stock ? t.stock_quantity ?? 0 : "not tracked",
        "."
      ] })
    ] }),
    /* @__PURE__ */ i("form", { id: "adjust-stock", className: "cm:grid cm:gap-3", onSubmit: (u) => {
      u.preventDefault(), p.post(D(`commerce/inventory/${t.id}/adjust`), { preserveScroll: !0, onSuccess: c });
    }, children: [
      /* @__PURE__ */ i("div", { className: "cm:grid cm:grid-cols-2 cm:gap-3", children: [
        /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(f, { htmlFor: "adjust-mode", children: "Change" }),
          /* @__PURE__ */ i("select", { id: "adjust-mode", className: "cm:h-9 cm:rounded-md cm:border cm:bg-background cm:px-3 cm:text-sm", value: p.data.mode, onChange: (u) => p.setData("mode", u.target.value), children: [
            /* @__PURE__ */ e("option", { value: "add", children: "Add or remove" }),
            /* @__PURE__ */ e("option", { value: "set", children: "Set to" })
          ] })
        ] }),
        /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(f, { htmlFor: "adjust-quantity", children: p.data.mode === "set" ? "New stock" : "Units (+/−)" }),
          /* @__PURE__ */ e(v, { id: "adjust-quantity", type: "number", value: p.data.quantity, onChange: (u) => p.setData("quantity", Number(u.target.value)) }),
          p.errors.quantity && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-destructive", children: p.errors.quantity })
        ] })
      ] }),
      /* @__PURE__ */ i("div", { className: "cm:grid cm:grid-cols-2 cm:gap-3", children: [
        /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(f, { htmlFor: "adjust-reason", children: "Reason" }),
          /* @__PURE__ */ e("select", { id: "adjust-reason", className: "cm:h-9 cm:rounded-md cm:border cm:bg-background cm:px-3 cm:text-sm", value: p.data.reason, onChange: (u) => p.setData("reason", u.target.value), children: n.map((u) => /* @__PURE__ */ e("option", { value: u, children: u[0].toUpperCase() + u.slice(1) }, u)) })
        ] }),
        /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(f, { htmlFor: "adjust-note", children: "Note" }),
          /* @__PURE__ */ e(v, { id: "adjust-note", value: p.data.note, onChange: (u) => p.setData("note", u.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ i("p", { className: "cm:text-sm", children: [
        "Stock after: ",
        /* @__PURE__ */ e("strong", { children: h })
      ] })
    ] }),
    /* @__PURE__ */ i("div", { className: "cm:grid cm:max-h-56 cm:gap-1 cm:overflow-auto cm:border-t cm:pt-3 cm:text-sm", children: [
      /* @__PURE__ */ e("p", { className: "cm:font-medium", children: "History" }),
      d === null ? /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "Loading…" }) : d.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "No changes yet." }) : d.map((u) => /* @__PURE__ */ i("div", { className: "cm:flex cm:justify-between cm:gap-3", children: [
        /* @__PURE__ */ i("span", { children: [
          u.delta > 0 ? `+${u.delta}` : u.delta,
          " → ",
          u.quantity_after,
          " · ",
          u.reason,
          u.reference ? ` (${u.reference.type} #${u.reference.id})` : "",
          u.note ? ` · ${u.note}` : ""
        ] }),
        /* @__PURE__ */ i("span", { className: "cm:whitespace-nowrap cm:text-muted-foreground", children: [
          u.user ? `${u.user}, ` : "",
          new Date(u.at).toLocaleString()
        ] })
      ] }, u.id))
    ] }),
    /* @__PURE__ */ i(b, { children: [
      /* @__PURE__ */ e(m, { variant: "outline", type: "button", onClick: c, children: "Cancel" }),
      /* @__PURE__ */ e(m, { type: "submit", form: "adjust-stock", disabled: p.processing, children: "Save" })
    ] })
  ] }) });
}
function $e(t) {
  const { DataTable: n } = W, [c, l] = $.useState(null);
  return A(), R.useBreadcrumbs([{ label: "Shop", href: D("commerce") }, { label: "Inventory" }]), /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(G, { title: "Inventory", description: "Stock of every product variant. Every change is recorded." }),
    /* @__PURE__ */ e(
      n,
      {
        ...t,
        searchPlaceholder: "Search products or SKUs…",
        onRowClick: t.can.adjust ? (a) => l(a) : void 0,
        renderCell: (a, r) => {
          if (r.key === "status") return /* @__PURE__ */ e(j, { tone: a.low ? "warning" : _e[a.status], children: a.low ? "Low" : a.status.replace(/_/g, " ") });
          if (r.key === "stock_quantity") return a.track_stock ? a.stock_quantity : /* @__PURE__ */ e("span", { className: "cm:text-muted-foreground", children: "—" });
        }
      }
    ),
    c && /* @__PURE__ */ e(Ne, { row: c, reasons: t.reasons, onClose: () => l(null) })
  ] });
}
const we = { published: "ok", draft: "neutral", scheduled: "info", trashed: "error" };
function Ce(t) {
  const { DataTable: n } = W, { Button: c } = S, { Link: l } = B;
  return A(), R.useBreadcrumbs([{ label: "Shop", href: D("commerce") }, { label: "Products" }]), /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      G,
      {
        title: "Products",
        description: "Products are entries: opening one goes to the editor.",
        actions: /* @__PURE__ */ e(c, { asChild: !0, children: /* @__PURE__ */ e(l, { href: D(t.createUrl), children: "New product" }) })
      }
    ),
    /* @__PURE__ */ e(
      n,
      {
        ...t,
        searchPlaceholder: "Search titles or SKUs…",
        rowHref: (a) => D(a.href),
        renderCell: (a, r) => {
          switch (r.key) {
            case "product_title":
              return /* @__PURE__ */ i("span", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ e("span", { className: "cm:font-medium", children: a.product_title }),
                a.featured && /* @__PURE__ */ e(j, { tone: "info", children: "Featured" }),
                a.sync_failed && /* @__PURE__ */ e("span", { title: a.sync_error ?? "", children: /* @__PURE__ */ e(j, { tone: "error", children: "Can't be bought" }) })
              ] });
            case "state":
              return /* @__PURE__ */ e(j, { tone: we[a.state], children: a.state });
            case "stock":
              return a.stock === null ? "—" : /* @__PURE__ */ e("span", { className: a.in_stock === !1 ? "cm:text-destructive" : "", children: a.stock });
            case "type":
              return /* @__PURE__ */ e(j, { children: a.type });
            default:
              return;
          }
        }
      }
    )
  ] });
}
function ge({ items: t, current: n, label: c = "Sections" }) {
  const { Link: l } = B;
  return /* @__PURE__ */ e("nav", { "aria-label": c, className: "cm:flex cm:gap-1 cm:overflow-x-auto cm:md:flex-col", children: t.map((a) => /* @__PURE__ */ e(
    l,
    {
      href: D(a.href),
      "aria-current": a.key === n ? "page" : void 0,
      className: Q(
        "cm:whitespace-nowrap cm:rounded-md cm:px-3 cm:py-1.5 cm:text-sm cm:text-muted-foreground cm:hover:bg-muted cm:hover:text-foreground",
        a.key === n && "cm:bg-muted cm:font-medium cm:text-foreground"
      ),
      children: a.label
    },
    a.key
  )) });
}
function Z({ sections: t, current: n, title: c, description: l, children: a }) {
  const { SettingsTabs: r } = W;
  return A(), R.useBreadcrumbs([{ label: "Settings", href: D("settings") }, { label: "Store", href: D("commerce/settings") }, { label: c }]), /* @__PURE__ */ i("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(r, { current: "store" }),
    /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-6 cm:md:grid-cols-[12rem_1fr]", children: [
      /* @__PURE__ */ e(ge, { items: t, current: n, label: "Store settings" }),
      /* @__PURE__ */ i("div", { className: "cm:grid cm:min-w-0 cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ e(G, { title: c, description: l }),
        a
      ] })
    ] })
  ] });
}
function Se({ sections: t, mode: n, groups: c, updateUrl: l }) {
  const { Card: a, CardContent: r, CardHeader: s, CardTitle: o, Switch: b, Button: m, Dialog: v, DialogContent: f, DialogDescription: p, DialogFooter: d, DialogHeader: g, DialogTitle: h } = S, { errors: u } = B.usePage().props, [_, w] = $.useState(null), [k, y] = $.useState(null), C = (F, N) => {
    y(F.key), B.router.put(l.replace("__key__", F.key), { on: N }, { preserveScroll: !0, onFinish: () => y(null) });
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
        u.feature && /* @__PURE__ */ e("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: u.feature }),
        c.map((F) => /* @__PURE__ */ i(a, { children: [
          /* @__PURE__ */ e(s, { children: /* @__PURE__ */ e(o, { children: F.label }) }),
          /* @__PURE__ */ e(r, { className: "cm:grid cm:gap-0 cm:divide-y cm:divide-border", children: F.features.map((N) => /* @__PURE__ */ i("div", { className: "cm:flex cm:items-start cm:justify-between cm:gap-4 cm:py-3 cm:first:pt-0 cm:last:pb-0", children: [
            /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ i("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ e("label", { htmlFor: `feature-${N.key}`, className: "cm:font-medium", children: N.label }),
                N.core && /* @__PURE__ */ e(j, { children: "Always on" }),
                N.switched_on && !N.active && /* @__PURE__ */ i(j, { tone: "warning", children: [
                  "Off — ",
                  N.reasons.join("; ").replace(/^Needs /, "needs ")
                ] }),
                N.essential && /* @__PURE__ */ i(j, { tone: "info", children: [
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
                disabled: N.core || k === N.key,
                onCheckedChange: (X) => !X && N.dependents.length > 0 ? w(N) : C(N, X)
              }
            )
          ] }, N.key)) })
        ] }, F.key)),
        /* @__PURE__ */ e(v, { open: _ !== null, onOpenChange: (F) => !F && w(null), children: /* @__PURE__ */ i(f, { children: [
          /* @__PURE__ */ i(g, { children: [
            /* @__PURE__ */ i(h, { children: [
              "Switch off ",
              _?.label,
              "?"
            ] }),
            /* @__PURE__ */ i(p, { children: [
              "These are switched off with it: ",
              _?.dependents.map((F) => F.label).join(", "),
              ". Their data is kept."
            ] })
          ] }),
          /* @__PURE__ */ i(d, { children: [
            /* @__PURE__ */ e(m, { variant: "outline", onClick: () => w(null), children: "Cancel" }),
            /* @__PURE__ */ e(
              m,
              {
                variant: "destructive",
                onClick: () => {
                  _ && C(_, !1), w(null);
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
  const { FieldRenderer: c } = W, { Button: l } = S, { data: a, setData: r, errors: s, processing: o, isDirty: b, ...m } = B.useForm({ values: t.values });
  return /* @__PURE__ */ i(
    "form",
    {
      className: "cm:grid cm:gap-6",
      onSubmit: (v) => {
        v.preventDefault(), m[t.method](t.action, { preserveScroll: !0 });
      },
      children: [
        s.section && /* @__PURE__ */ e("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: s.section }),
        /* @__PURE__ */ e(
          c,
          {
            fields: t.fields,
            values: a.values,
            errors: s,
            pathPrefix: "values",
            onChange: (v) => r("values", v)
          }
        ),
        /* @__PURE__ */ i("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
          /* @__PURE__ */ e(l, { type: "submit", disabled: o, children: t.submitLabel }),
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
function Te({ title: t, description: n, form: c, breadcrumbs: l = [] }) {
  return A(), R.useBreadcrumbs([...l, { label: t }]), /* @__PURE__ */ i("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-3xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(G, { title: t, description: n }),
    /* @__PURE__ */ e(ee, { form: c })
  ] });
}
const De = {
  "Commerce/Dashboard": xe,
  "Commerce/Inventory/Index": $e,
  "Commerce/Products/Index": Ce,
  "Commerce/Settings/Section": Fe,
  "Commerce/Settings/Features": Se,
  "Commerce/Shared/SchemaForm": Te
};
function qe() {
  Object.entries(De).forEach(([t, n]) => R.registerPage(t, n));
}
function ce(t) {
  if (!t) return "";
  const n = new Date(t);
  if (Number.isNaN(n.getTime())) return "";
  const c = (l) => String(l).padStart(2, "0");
  return `${n.getFullYear()}-${c(n.getMonth() + 1)}-${c(n.getDate())}T${c(n.getHours())}:${c(n.getMinutes())}`;
}
function re(t) {
  return t ? new Date(t).toISOString() : null;
}
function je({ value: t, onChange: n, pathPrefix: c }) {
  const { Input: l, Label: a } = S, r = { start: t?.start ?? null, end: t?.end ?? null };
  return /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(a, { htmlFor: `${c}-start`, children: "Starts" }),
      /* @__PURE__ */ e(
        l,
        {
          id: `${c}-start`,
          type: "datetime-local",
          value: ce(r.start),
          onChange: (s) => n({ ...r, start: re(s.target.value) })
        }
      )
    ] }),
    /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(a, { htmlFor: `${c}-end`, children: "Ends" }),
      /* @__PURE__ */ e(
        l,
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
  placeholder: l,
  allowNull: a = !0,
  invalid: r
}) {
  const { Input: s } = S, o = (p) => p == null ? "" : z(p).replace(/^[^\d-]+|[^\d]+$/g, ""), [b, m] = $.useState(o(t)), [v, f] = $.useState(!1);
  return $.useEffect(() => {
    v || m(o(t));
  }, [t, v]), /* @__PURE__ */ e(
    s,
    {
      id: c,
      inputMode: "decimal",
      value: b,
      placeholder: l,
      "aria-invalid": r || void 0,
      onFocus: () => f(!0),
      onChange: (p) => {
        m(p.target.value);
        const d = p.target.value.trim() === "" ? a ? null : 0 : oe(p.target.value);
        (d !== null || p.target.value.trim() === "") && n(d);
      },
      onBlur: () => {
        f(!1), m(o(t));
      }
    }
  );
}
function Ie({ field: t, value: n, onChange: c, errors: l, pathPrefix: a }) {
  return A(), /* @__PURE__ */ e(
    te,
    {
      id: a,
      value: n,
      onChange: c,
      allowNull: t.config?.allow_null !== !1,
      invalid: !!(a && l?.[a])
    }
  );
}
const le = [
  { key: "province_code", label: "Province" },
  { key: "city_code", label: "City / regency" },
  { key: "district_code", label: "District" },
  { key: "village_code", label: "Village" }
], Be = { province: 1, city: 2, district: 3, village: 4 }, J = /* @__PURE__ */ new Map();
function Pe(t, n) {
  const c = n ? `${t}?parent=${encodeURIComponent(n)}` : t;
  return J.has(c) || J.set(c, O(c).then((l) => l.data).catch(() => (J.delete(c), []))), J.get(c);
}
const ae = "cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm cm:disabled:opacity-50";
function Ee({ field: t, value: n, onChange: c, pathPrefix: l }) {
  const { Label: a } = S, r = t.config ?? {}, s = String(r.api ?? ""), o = Be[r.depth ?? "district"] ?? 3, b = r.country_options ?? [], m = { country: "ID", province_code: null, city_code: null, district_code: null, village_code: null, ...n ?? {} }, v = le.slice(0, o), [f, p] = $.useState({}), d = [null, m.province_code, m.city_code, m.district_code];
  $.useEffect(() => {
    m.country !== "ID" || !s || v.forEach((h, u) => {
      const _ = d[u];
      u > 0 && !_ || Pe(s, _).then((w) => p((k) => ({ ...k, [h.key]: w })));
    });
  }, [s, m.country, m.province_code, m.city_code, m.district_code]);
  const g = (h, u) => {
    const _ = { ...m };
    _[v[h].key] = u || null, le.slice(h + 1).forEach((w) => {
      _[w.key] = null;
    }), c(_);
  };
  return /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    b.length > 0 && /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(a, { htmlFor: `${l}-country`, children: "Country" }),
      /* @__PURE__ */ e(
        "select",
        {
          id: `${l}-country`,
          className: ae,
          value: m.country,
          onChange: (h) => c({ country: h.target.value, province_code: null, city_code: null, district_code: null, village_code: null }),
          children: b.map((h) => /* @__PURE__ */ e("option", { value: h.value, children: h.label }, h.value))
        }
      )
    ] }),
    m.country === "ID" && v.map((h, u) => /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(a, { htmlFor: `${l}-${h.key}`, children: h.label }),
      /* @__PURE__ */ i(
        "select",
        {
          id: `${l}-${h.key}`,
          className: ae,
          value: m[h.key] ?? "",
          disabled: u > 0 && !d[u],
          onChange: (_) => g(u, _.target.value),
          children: [
            /* @__PURE__ */ e("option", { value: "", children: "Choose…" }),
            (f[h.key] ?? []).map((_) => /* @__PURE__ */ e("option", { value: _.code, children: _.name }, _.code))
          ]
        }
      )
    ] }, h.key))
  ] });
}
function P() {
  return (globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`).replace(/-/g, "").slice(0, 32);
}
function ie(t) {
  return Object.keys(t).sort().map((n) => `${n}=${t[n]}`).join("|");
}
function Le(t) {
  let n = [{}];
  for (const c of t) {
    if (c.values.length === 0) return [];
    const l = [];
    for (const a of n)
      for (const r of c.values)
        l.push({ ...a, [c.id]: r.id });
    n = l;
  }
  return t.length === 0 ? [] : n;
}
function Oe(t, n, c, l = 100) {
  const a = new Map(n.map((r) => [ie(r.options), r]));
  return Le(t).slice(0, l).map((r) => {
    const s = a.get(ie(r));
    return s ? { ...s, options: r } : { ...c, id: P(), sku: null, options: r, active: !0, price: c.price ?? 0 };
  });
}
function pe(t, n, c = {}) {
  return t.map((l) => {
    const a = l.values.find((r) => r.id === n.options[l.id]);
    return a ? a.label ?? (a.term_id ? c[a.term_id] ?? `#${a.term_id}` : "?") : "?";
  }).join(" / ");
}
function x({ label: t, hint: n, children: c, htmlFor: l, className: a }) {
  const { Label: r } = S;
  return /* @__PURE__ */ i("div", { className: Q("cm:grid cm:gap-1.5", a), children: [
    /* @__PURE__ */ e(r, { htmlFor: l, children: t }),
    c,
    n && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: n })
  ] });
}
function K({ children: t, cols: n = 3 }) {
  return /* @__PURE__ */ e("div", { className: Q("cm:grid cm:gap-4", { 2: "cm:sm:grid-cols-2", 3: "cm:sm:grid-cols-2 cm:lg:grid-cols-3", 4: "cm:sm:grid-cols-2 cm:lg:grid-cols-4" }[n]), children: t });
}
function T({ id: t, value: n, onChange: c, min: l = 0, placeholder: a }) {
  const { Input: r } = S;
  return /* @__PURE__ */ e(
    r,
    {
      id: t,
      type: "number",
      inputMode: "numeric",
      min: l,
      value: n ?? "",
      placeholder: a,
      onChange: (s) => c(s.target.value === "" ? null : Math.round(Number(s.target.value)))
    }
  );
}
function H({ id: t, value: n, onChange: c, placeholder: l, onBlur: a }) {
  const { Input: r } = S;
  return /* @__PURE__ */ e(
    r,
    {
      id: t,
      value: n ?? "",
      placeholder: l,
      onBlur: a,
      onChange: (s) => c(s.target.value === "" ? null : s.target.value)
    }
  );
}
function L({ id: t, value: n, onChange: c, nullable: l = !0 }) {
  return /* @__PURE__ */ e(te, { id: t, value: n, allowNull: l, onChange: c });
}
function U({ id: t, label: n, checked: c, onChange: l, hint: a }) {
  const { Switch: r, Label: s } = S;
  return /* @__PURE__ */ i("div", { className: "cm:flex cm:items-start cm:gap-3", children: [
    /* @__PURE__ */ e(r, { id: t, checked: c, onCheckedChange: l }),
    /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-0.5", children: [
      /* @__PURE__ */ e(s, { htmlFor: t, children: n }),
      a && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: a })
    ] })
  ] });
}
const Re = "cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm";
function q({ id: t, value: n, onChange: c, options: l }) {
  return /* @__PURE__ */ e("select", { id: t, className: Re, value: n, onChange: (a) => c(a.target.value), children: l.map(([a, r]) => /* @__PURE__ */ e("option", { value: a, children: r }, a)) });
}
function I({ title: t, description: n, children: c, actions: l }) {
  return /* @__PURE__ */ i("section", { className: "cm:grid cm:gap-4", children: [
    /* @__PURE__ */ i("div", { className: "cm:flex cm:items-start cm:justify-between cm:gap-3", children: [
      /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-0.5", children: [
        /* @__PURE__ */ e("h3", { className: "cm:text-sm cm:font-semibold", children: t }),
        n && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: n })
      ] }),
      l
    ] }),
    c
  ] });
}
function Ae({ value: t, update: n, path: c }) {
  const { Button: l, Input: a } = S, r = t.bundle ?? { pricing: "fixed", value: 0, items: [] }, [s, o] = $.useState({}), [b, m] = $.useState(""), [v, f] = $.useState([]), p = r.items.map((h) => h.variant_id).filter((h) => !!h);
  $.useEffect(() => {
    const h = p.filter((u) => !s[u]);
    h.length !== 0 && O(D(`commerce/api/variants?${h.map((u) => `ids[]=${u}`).join("&")}`)).then((u) => o((_) => ({ ..._, ...Object.fromEntries(u.data.map((w) => [w.id, w])) }))).catch(() => {
    });
  }, [p.join(",")]), $.useEffect(() => {
    if (b.trim().length < 2) return f([]);
    const h = setTimeout(() => O(D(`commerce/api/variants?q=${encodeURIComponent(b)}`)).then((u) => f(u.data)).catch(() => {
    }), 250);
    return () => clearTimeout(h);
  }, [b]);
  const d = (h) => n({ bundle: { ...r, ...h } }), g = r.items.reduce((h, u) => h + (s[u.variant_id ?? 0]?.price ?? 0) * u.quantity, 0);
  return /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ i(I, { title: "Products in the bundle", description: "Bundles take their stock from these products.", children: [
      r.items.map((h, u) => /* @__PURE__ */ i("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ e("span", { className: "cm:flex-1 cm:text-sm", children: s[h.variant_id ?? 0]?.label ?? `#${h.variant_id}` }),
        /* @__PURE__ */ e("div", { className: "cm:w-24", children: /* @__PURE__ */ e(T, { min: 1, value: h.quantity, onChange: (_) => d({ items: r.items.map((w, k) => k === u ? { ...w, quantity: _ ?? 1 } : w) }) }) }),
        /* @__PURE__ */ e(l, { type: "button", variant: "ghost", size: "sm", onClick: () => d({ items: r.items.filter((_, w) => w !== u) }), children: "Remove" })
      ] }, u)),
      /* @__PURE__ */ i("div", { className: "cm:relative", children: [
        /* @__PURE__ */ e(a, { value: b, placeholder: "Search products or SKUs to add…", "aria-label": "Add a product to the bundle", onChange: (h) => m(h.target.value) }),
        v.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-10 cm:mt-1 cm:max-h-64 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: v.map((h) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            className: "cm:flex cm:w-full cm:justify-between cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted",
            onClick: () => {
              o((u) => ({ ...u, [h.id]: h })), d({ items: [...r.items, { variant_id: h.id, quantity: 1 }] }), m("");
            },
            children: [
              /* @__PURE__ */ i("span", { children: [
                h.label,
                h.sku && /* @__PURE__ */ i("span", { className: "cm:text-muted-foreground", children: [
                  " · ",
                  h.sku
                ] })
              ] }),
              /* @__PURE__ */ e("span", { children: z(h.price) })
            ]
          }
        ) }, h.id)) })
      ] })
    ] }),
    /* @__PURE__ */ e(I, { title: "Bundle price", description: `The products cost ${z(g)} together.`, children: /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(x, { label: "Price", htmlFor: `${c}-bundle-pricing`, children: /* @__PURE__ */ e(
        q,
        {
          id: `${c}-bundle-pricing`,
          value: r.pricing,
          onChange: (h) => d({ pricing: h, value: 0 }),
          options: [["fixed", "Its own price (General tab)"], ["percent_off", "Total minus a percentage"], ["amount_off", "Total minus an amount"]]
        }
      ) }),
      r.pricing === "percent_off" && /* @__PURE__ */ e(x, { label: "Percent off", htmlFor: `${c}-bundle-value`, children: /* @__PURE__ */ e(T, { id: `${c}-bundle-value`, value: r.value / 100, onChange: (h) => d({ value: Math.round((h ?? 0) * 100) }) }) }),
      r.pricing === "amount_off" && /* @__PURE__ */ e(x, { label: "Amount off", htmlFor: `${c}-bundle-value`, children: /* @__PURE__ */ e(L, { id: `${c}-bundle-value`, value: r.value, nullable: !1, onChange: (h) => d({ value: h ?? 0 }) }) })
    ] }) })
  ] });
}
function Me() {
  return decodeURIComponent(document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/)?.[1] ?? "");
}
function Ue({ value: t, update: n, path: c }) {
  const { Button: l } = S, [a, r] = $.useState(!1), s = $.useRef(null), o = t.delivery ?? { modes: ["link", "account"], download_limit: null, expiry_days: null }, b = (f) => n({ delivery: { ...o, ...f } }), m = (f, p) => n({ downloads: t.downloads.map((d, g) => g === f ? { ...d, ...p } : d) }), v = async (f) => {
    if (f?.length) {
      r(!0);
      try {
        const p = [];
        for (const d of Array.from(f)) {
          const g = new FormData();
          g.append("file", d);
          const h = await fetch(D("commerce/api/downloads"), { method: "POST", body: g, headers: { "X-XSRF-TOKEN": Me(), Accept: "application/json" }, credentials: "same-origin" }), u = await h.json();
          if (!h.ok) throw new Error(u.message ?? "Upload failed");
          p.push({ id: P(), type: "file", file_id: u.data.id, url: null, name: d.name.replace(/\.[^.]+$/, ""), file: u.data });
        }
        n({ downloads: [...t.downloads, ...p] });
      } catch (p) {
        ye.error(p instanceof Error ? p.message : "Upload failed");
      } finally {
        r(!1), s.current && (s.current.value = "");
      }
    }
  };
  return /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ i(
      I,
      {
        title: "Files and links",
        description: "Files are stored privately and only served to customers who bought them.",
        actions: /* @__PURE__ */ i("div", { className: "cm:flex cm:gap-2", children: [
          /* @__PURE__ */ e(l, { type: "button", variant: "outline", size: "sm", disabled: a, onClick: () => s.current?.click(), children: a ? "Uploading…" : "Upload file" }),
          /* @__PURE__ */ e(l, { type: "button", variant: "outline", size: "sm", onClick: () => n({ downloads: [...t.downloads, { id: P(), type: "url", file_id: null, url: null, name: "" }] }), children: "Add link" }),
          /* @__PURE__ */ e("input", { ref: s, type: "file", multiple: !0, hidden: !0, onChange: (f) => v(f.target.files) })
        ] }),
        children: [
          t.downloads.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No files yet." }),
          t.downloads.map((f, p) => /* @__PURE__ */ i("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(x, { label: "Name", htmlFor: `${c}-dl-${p}`, children: /* @__PURE__ */ e(H, { id: `${c}-dl-${p}`, value: f.name, onChange: (d) => m(p, { name: d ?? "" }) }) }),
            f.type === "url" ? /* @__PURE__ */ e(x, { label: "Link", htmlFor: `${c}-dl-${p}-url`, children: /* @__PURE__ */ e(H, { id: `${c}-dl-${p}-url`, value: f.url, placeholder: "https://", onChange: (d) => m(p, { url: d }) }) }) : /* @__PURE__ */ e(x, { label: "File", children: /* @__PURE__ */ e("p", { className: "cm:truncate cm:text-sm cm:text-muted-foreground", children: f.file?.filename ?? `File #${f.file_id}` }) }),
            /* @__PURE__ */ e(l, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ downloads: t.downloads.filter((d, g) => g !== p) }), children: "Remove" })
          ] }, f.id ?? p))
        ]
      }
    ),
    /* @__PURE__ */ i(I, { title: "Delivery", children: [
      /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-3", children: [["attachment", "Attach files to the email"], ["link", "Download links in the email"], ["account", "Library in My Account"]].map(([f, p]) => /* @__PURE__ */ e(
        U,
        {
          id: `${c}-mode-${f}`,
          label: p,
          checked: o.modes.includes(f),
          onChange: (d) => b({ modes: d ? [...o.modes, f] : o.modes.filter((g) => g !== f) })
        },
        f
      )) }),
      /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
        /* @__PURE__ */ e(x, { label: "Downloads per file", htmlFor: `${c}-limit`, hint: "Empty: unlimited.", children: /* @__PURE__ */ e(T, { id: `${c}-limit`, min: 1, value: o.download_limit, onChange: (f) => b({ download_limit: f }) }) }),
        /* @__PURE__ */ e(x, { label: "Links expire after (days)", htmlFor: `${c}-expiry`, hint: "Empty: never.", children: /* @__PURE__ */ e(T, { id: `${c}-expiry`, min: 1, value: o.expiry_days, onChange: (f) => b({ expiry_days: f }) }) })
      ] })
    ] })
  ] });
}
function fe({ id: t, value: n, onChange: c, entryId: l }) {
  const [a, r] = $.useState(null);
  return /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
    /* @__PURE__ */ e(H, { id: t, value: n, onChange: (o) => {
      r(null), c(o);
    }, onBlur: () => {
      if (!n) return r(null);
      const o = new URLSearchParams({ sku: n, entry: String(l ?? 0) });
      O(D(`commerce/api/sku-check?${o}`)).then((b) => r(b.available ? null : b.product ?? "another product")).catch(() => r(null));
    } }),
    a && /* @__PURE__ */ i("p", { className: "cm:text-xs cm:text-destructive", children: [
      "Already used by ",
      a,
      "."
    ] })
  ] });
}
const ze = [
  ["default", "Follow the store (selling mode)"],
  ["cart", "Add to cart"],
  ["inquiry", "Inquiry form"],
  ["whatsapp", "Ask on WhatsApp"],
  ["external", "Links to other shops"],
  ["none", "No button (display only)"]
];
function Ke({ value: t, update: n, updateVariant: c, config: l, entryId: a, path: r }) {
  const { Button: s } = S, o = [["simple", "Simple product"]];
  (l.features.variants || t.type === "variable") && o.push(["variable", "Variable product (sizes, colors…)"]), (l.features.bundles || t.type === "bundle") && o.push(["bundle", "Bundle of other products"]);
  const b = t.variants[0];
  return /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ i(K, { cols: 2, children: [
      /* @__PURE__ */ e(x, { label: "Product type", htmlFor: `${r}-type`, children: /* @__PURE__ */ e(q, { id: `${r}-type`, value: t.type, options: o, onChange: (m) => n({ type: m }) }) }),
      /* @__PURE__ */ e(x, { label: "Button on the product page", htmlFor: `${r}-mode`, hint: "'Follow the store' uses the selling mode set in Settings → Store.", children: /* @__PURE__ */ e(q, { id: `${r}-mode`, value: t.purchase_mode, options: ze, onChange: (m) => n({ purchase_mode: m }) }) })
    ] }),
    t.type !== "variable" && b && /* @__PURE__ */ e(I, { title: "Price", children: /* @__PURE__ */ i(K, { cols: 4, children: [
      /* @__PURE__ */ e(x, { label: "Price", htmlFor: `${r}-price`, children: /* @__PURE__ */ e(L, { id: `${r}-price`, value: b.price, nullable: !1, onChange: (m) => c(0, { price: m ?? 0 }) }) }),
      /* @__PURE__ */ e(x, { label: "Compare-at price", htmlFor: `${r}-compare`, hint: "Shown struck through when higher.", children: /* @__PURE__ */ e(L, { id: `${r}-compare`, value: b.compare_at_price, onChange: (m) => c(0, { compare_at_price: m }) }) }),
      /* @__PURE__ */ e(x, { label: "Cost", htmlFor: `${r}-cost`, hint: "For profit reports; never shown.", children: /* @__PURE__ */ e(L, { id: `${r}-cost`, value: b.cost, onChange: (m) => c(0, { cost: m }) }) }),
      /* @__PURE__ */ e(x, { label: "SKU", htmlFor: `${r}-sku`, children: /* @__PURE__ */ e(fe, { id: `${r}-sku`, value: b.sku, entryId: a, onChange: (m) => c(0, { sku: m }) }) })
    ] }) }),
    (t.purchase_mode === "external" || t.external_links.length > 0) && /* @__PURE__ */ e(
      I,
      {
        title: "Links to other shops",
        description: "Buttons such as 'Buy on Tokopedia'.",
        actions: t.external_links.length < 10 && /* @__PURE__ */ e(s, { type: "button", variant: "outline", size: "sm", onClick: () => n({ external_links: [...t.external_links, { preset: "tokopedia", label: null, url: null }] }), children: "Add link" }),
        children: t.external_links.map((m, v) => {
          const f = (p) => n({ external_links: t.external_links.map((d, g) => g === v ? { ...d, ...p } : d) });
          return /* @__PURE__ */ i("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[10rem_1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(x, { label: "Shop", htmlFor: `${r}-link-${v}-preset`, children: /* @__PURE__ */ e(
              q,
              {
                id: `${r}-link-${v}-preset`,
                value: m.preset ?? "",
                onChange: (p) => f({ preset: p || null }),
                options: [...Object.entries(l.link_presets), ["", "Other…"]]
              }
            ) }),
            /* @__PURE__ */ e(x, { label: "Button label", htmlFor: `${r}-link-${v}-label`, children: /* @__PURE__ */ e(H, { id: `${r}-link-${v}-label`, value: m.label, placeholder: m.preset ? `Buy on ${l.link_presets[m.preset]}` : "", onChange: (p) => f({ label: p }) }) }),
            /* @__PURE__ */ e(x, { label: "Link", htmlFor: `${r}-link-${v}-url`, children: /* @__PURE__ */ e(H, { id: `${r}-link-${v}-url`, value: m.url, placeholder: "https://", onChange: (p) => f({ url: p }) }) }),
            /* @__PURE__ */ e(s, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ external_links: t.external_links.filter((p, d) => d !== v) }), children: "Remove" })
          ] }, v);
        })
      }
    ),
    /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(U, { id: `${r}-shipping`, label: "Needs shipping", checked: t.requires_shipping, onChange: (m) => n({ requires_shipping: m }), hint: "Off for services and digital products." }),
      (l.features.digital || t.downloadable) && /* @__PURE__ */ e(U, { id: `${r}-downloadable`, label: "Downloadable", checked: t.downloadable, onChange: (m) => n({ downloadable: m }), hint: "Customers get files or links after paying." }),
      /* @__PURE__ */ e(U, { id: `${r}-featured`, label: "Featured", checked: t.featured, onChange: (m) => n({ featured: m }), hint: "Shown first when sorting by featured." })
    ] }),
    l.features.taxes && /* @__PURE__ */ e(x, { label: "Tax class", htmlFor: `${r}-tax`, children: /* @__PURE__ */ e(
      q,
      {
        id: `${r}-tax`,
        value: t.tax_class ?? "",
        onChange: (m) => n({ tax_class: m || null }),
        options: [["", "Standard"], ...l.tax_classes.filter((m) => m !== "standard").map((m) => [m, m])]
      }
    ) })
  ] });
}
function He({ value: t, updateVariant: n, live: c, path: l }) {
  const a = t.variants[0];
  if (!a) return null;
  const r = c?.variants[a.id];
  return /* @__PURE__ */ i(I, { title: "Stock", children: [
    /* @__PURE__ */ e(
      U,
      {
        id: `${l}-track`,
        label: "Track stock",
        checked: a.track_stock,
        onChange: (s) => n(0, { track_stock: s }),
        hint: "Count units: orders take them, cancellations give them back."
      }
    ),
    a.track_stock ? /* @__PURE__ */ i(K, { cols: 3, children: [
      r?.track_stock && r.stock_quantity !== null ? /* @__PURE__ */ e(x, { label: "In stock", hint: "Change it in Shop → Inventory, so every change is recorded.", children: /* @__PURE__ */ e("p", { className: "cm:text-2xl cm:font-semibold", children: r.stock_quantity }) }) : /* @__PURE__ */ e(x, { label: "Starting stock", htmlFor: `${l}-initial`, hint: "Set once, when the product is published.", children: /* @__PURE__ */ e(T, { id: `${l}-initial`, value: a.initial_stock, onChange: (s) => n(0, { initial_stock: s }) }) }),
      /* @__PURE__ */ e(x, { label: "When sold out", htmlFor: `${l}-backorders`, children: /* @__PURE__ */ e(
        q,
        {
          id: `${l}-backorders`,
          value: a.backorders,
          onChange: (s) => n(0, { backorders: s }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }),
      /* @__PURE__ */ e(x, { label: "Low stock at", htmlFor: `${l}-low`, hint: "Empty: the store's setting.", children: /* @__PURE__ */ e(T, { id: `${l}-low`, value: a.low_stock_threshold, onChange: (s) => n(0, { low_stock_threshold: s }) }) })
    ] }) : /* @__PURE__ */ e(x, { label: "Stock status", htmlFor: `${l}-status`, children: /* @__PURE__ */ e(
      q,
      {
        id: `${l}-status`,
        value: a.stock_status,
        onChange: (s) => n(0, { stock_status: s }),
        options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
      }
    ) })
  ] });
}
function We({ value: t, update: n, path: c }) {
  const { Button: l } = S, a = (r, s) => n({ tiers: t.tiers.map((o, b) => b === r ? { ...o, ...s } : o) });
  return /* @__PURE__ */ i(
    I,
    {
      title: "Bulk prices",
      description: "Lower unit prices for larger quantities. The best matching tier applies.",
      actions: t.tiers.length < 20 && /* @__PURE__ */ e(
        l,
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
          /* @__PURE__ */ e(x, { label: "From (units)", htmlFor: `${c}-tier-${s}-min`, children: /* @__PURE__ */ e(T, { id: `${c}-tier-${s}-min`, min: 2, value: r.min_qty, onChange: (o) => a(s, { min_qty: o ?? 2 }) }) }),
          /* @__PURE__ */ e(x, { label: "Price", htmlFor: `${c}-tier-${s}-type`, children: /* @__PURE__ */ e(
            q,
            {
              id: `${c}-tier-${s}-type`,
              value: r.type,
              onChange: (o) => a(s, { type: o, value: 0 }),
              options: [["percent_off", "Percent off"], ["amount_off", "Amount off per unit"], ["fixed_price", "Fixed unit price"]]
            }
          ) }),
          /* @__PURE__ */ e(x, { label: r.type === "percent_off" ? "Percent" : "Amount", htmlFor: `${c}-tier-${s}-value`, children: r.type === "percent_off" ? /* @__PURE__ */ e(T, { id: `${c}-tier-${s}-value`, value: r.value / 100, onChange: (o) => a(s, { value: Math.round((o ?? 0) * 100) }) }) : /* @__PURE__ */ e(L, { id: `${c}-tier-${s}-value`, value: r.value, nullable: !1, onChange: (o) => a(s, { value: o ?? 0 }) }) }),
          /* @__PURE__ */ e(x, { label: "For", htmlFor: `${c}-tier-${s}-variant`, children: /* @__PURE__ */ e(
            q,
            {
              id: `${c}-tier-${s}-variant`,
              value: r.variant ?? "",
              onChange: (o) => a(s, { variant: o || null }),
              options: [["", "All variants"], ...t.type === "variable" ? t.variants.map((o) => [o.id, pe(t.options, o)]) : []]
            }
          ) }),
          /* @__PURE__ */ e(l, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ tiers: t.tiers.filter((o, b) => b !== s) }), children: "Remove" })
        ] }, s))
      ]
    }
  );
}
function Ge({ value: t, update: n, updateVariant: c, path: l }) {
  const a = t.variants[0];
  if (!a) return null;
  const r = (s) => t.type === "variable" ? n({ variants: t.variants.map((o) => ({ ...o, ...s })) }) : c(0, s);
  return /* @__PURE__ */ e(I, { title: "Package", description: t.type === "variable" ? "Applies to every variant; a variant can have its own weight under More." : "Used for shipping rates.", children: /* @__PURE__ */ i(K, { cols: 4, children: [
    /* @__PURE__ */ e(x, { label: "Weight (grams)", htmlFor: `${l}-weight`, children: /* @__PURE__ */ e(T, { id: `${l}-weight`, value: a.weight, onChange: (s) => r({ weight: s }) }) }),
    /* @__PURE__ */ e(x, { label: "Length (mm)", htmlFor: `${l}-length`, children: /* @__PURE__ */ e(T, { id: `${l}-length`, value: a.length, onChange: (s) => r({ length: s }) }) }),
    /* @__PURE__ */ e(x, { label: "Width (mm)", htmlFor: `${l}-width`, children: /* @__PURE__ */ e(T, { id: `${l}-width`, value: a.width, onChange: (s) => r({ width: s }) }) }),
    /* @__PURE__ */ e(x, { label: "Height (mm)", htmlFor: `${l}-height`, children: /* @__PURE__ */ e(T, { id: `${l}-height`, value: a.height, onChange: (s) => r({ height: s }) }) })
  ] }) });
}
const Y = {
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
function Qe(t) {
  const [n, c] = $.useState({}), l = t.filter((a) => !(a in n));
  return $.useEffect(() => {
    if (l.length === 0) return;
    const a = l.map((r) => `ids[]=${r}`).join("&");
    O(D(`api/terms?${a}`)).then((r) => c((s) => ({ ...s, ...Object.fromEntries(r.data.map((o) => [o.id, o.title])) }))).catch(() => {
    });
  }, [l.join(",")]), n;
}
function Xe({ option: t, onChange: n, onRemove: c, config: l, path: a }) {
  const { Button: r, Input: s, Badge: o } = S, { FieldRenderer: b } = W, [m, v] = $.useState(""), f = () => {
    const d = m.split(",").map((g) => g.trim()).filter(Boolean).filter((g) => !t.values.some((h) => (h.label ?? "").toLowerCase() === g.toLowerCase()));
    d.length && n({ ...t, values: [...t.values, ...d.map((g) => ({ id: P(), label: g }))] }), v("");
  }, p = t.values.map((d) => d.term_id).filter((d) => !!d);
  return /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-3 cm:rounded-md cm:border cm:p-3", children: [
    /* @__PURE__ */ i("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_1fr_auto]", children: [
      /* @__PURE__ */ e(x, { label: "Option name", htmlFor: `${a}-name`, children: /* @__PURE__ */ e(s, { id: `${a}-name`, value: t.name, placeholder: "Size", onChange: (d) => n({ ...t, name: d.target.value }) }) }),
      l.attribute_taxonomies.length > 0 ? /* @__PURE__ */ e(x, { label: "Values from", htmlFor: `${a}-source`, children: /* @__PURE__ */ e(
        q,
        {
          id: `${a}-source`,
          value: t.taxonomy ?? "",
          onChange: (d) => n({ ...t, taxonomy: d || null, values: [] }),
          options: [["", "Custom values"], ...l.attribute_taxonomies.map((d) => [d.handle, d.title])]
        }
      ) }) : /* @__PURE__ */ e("div", {}),
      /* @__PURE__ */ e(r, { type: "button", variant: "ghost", size: "sm", onClick: c, children: "Remove option" })
    ] }),
    t.taxonomy ? /* @__PURE__ */ e(
      b,
      {
        fields: [{ handle: "terms", type: "terms", label: "Values", config: { taxonomy: t.taxonomy } }],
        values: { terms: p },
        pathPrefix: `${a}-terms`,
        onChange: (d) => {
          const g = d.terms ?? [], h = t.values.filter((_) => _.term_id && g.includes(_.term_id)), u = g.filter((_) => !h.some((w) => w.term_id === _)).map((_) => ({ id: P(), term_id: _ }));
          n({ ...t, values: [...h, ...u] });
        }
      }
    ) : /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-2", children: [
      /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: t.values.map((d) => /* @__PURE__ */ i(o, { variant: "secondary", className: "cm:gap-1", children: [
        d.label,
        /* @__PURE__ */ e("button", { type: "button", "aria-label": `Remove ${d.label}`, onClick: () => n({ ...t, values: t.values.filter((g) => g.id !== d.id) }), children: "×" })
      ] }, d.id)) }),
      /* @__PURE__ */ i("div", { className: "cm:flex cm:gap-2", children: [
        /* @__PURE__ */ e(
          s,
          {
            value: m,
            placeholder: "S, M, L",
            "aria-label": `Add values to ${t.name || "option"}`,
            onChange: (d) => v(d.target.value),
            onKeyDown: (d) => {
              d.key === "Enter" && (d.preventDefault(), f());
            }
          }
        ),
        /* @__PURE__ */ e(r, { type: "button", variant: "outline", onClick: f, children: "Add" })
      ] })
    ] })
  ] });
}
function Je({ variant: t, index: n, updateVariant: c, tab: l }) {
  const { FieldRenderer: a } = W, r = `${l.path}-v${n}`, s = l.live?.variants[t.id];
  return /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-4 cm:bg-muted/40 cm:p-4", children: [
    /* @__PURE__ */ i(K, { cols: 4, children: [
      /* @__PURE__ */ e(x, { label: "Cost", htmlFor: `${r}-cost`, children: /* @__PURE__ */ e(L, { id: `${r}-cost`, value: t.cost, onChange: (o) => c(n, { cost: o }) }) }),
      /* @__PURE__ */ e(x, { label: "Barcode", htmlFor: `${r}-barcode`, children: /* @__PURE__ */ e(H, { id: `${r}-barcode`, value: t.barcode, onChange: (o) => c(n, { barcode: o }) }) }),
      /* @__PURE__ */ e(x, { label: "Weight (g)", htmlFor: `${r}-weight`, children: /* @__PURE__ */ e(T, { id: `${r}-weight`, value: t.weight, onChange: (o) => c(n, { weight: o }), placeholder: "Product's" }) }),
      /* @__PURE__ */ e(x, { label: "Min / max / step", htmlFor: `${r}-min`, children: /* @__PURE__ */ i("div", { className: "cm:grid cm:grid-cols-3 cm:gap-1", children: [
        /* @__PURE__ */ e(T, { id: `${r}-min`, min: 1, value: t.min_qty, onChange: (o) => c(n, { min_qty: o ?? 1 }) }),
        /* @__PURE__ */ e(T, { min: 1, value: t.max_qty, onChange: (o) => c(n, { max_qty: o }), placeholder: "–" }),
        /* @__PURE__ */ e(T, { min: 1, value: t.qty_step, onChange: (o) => c(n, { qty_step: o ?? 1 }) })
      ] }) })
    ] }),
    l.config.features.inventory && /* @__PURE__ */ i(K, { cols: 4, children: [
      /* @__PURE__ */ e(U, { id: `${r}-track`, label: "Track stock", checked: t.track_stock, onChange: (o) => c(n, { track_stock: o }) }),
      t.track_stock && (s?.track_stock && s.stock_quantity !== null ? /* @__PURE__ */ e(x, { label: "In stock", children: /* @__PURE__ */ i("p", { className: "cm:text-sm", children: [
        s.stock_quantity,
        " ",
        /* @__PURE__ */ e("span", { className: "cm:text-muted-foreground", children: "(change it in Shop → Inventory)" })
      ] }) }) : /* @__PURE__ */ e(x, { label: "Starting stock", htmlFor: `${r}-initial`, children: /* @__PURE__ */ e(T, { id: `${r}-initial`, value: t.initial_stock, onChange: (o) => c(n, { initial_stock: o }) }) })),
      t.track_stock ? /* @__PURE__ */ e(x, { label: "When sold out", htmlFor: `${r}-backorders`, children: /* @__PURE__ */ e(
        q,
        {
          id: `${r}-backorders`,
          value: t.backorders,
          onChange: (o) => c(n, { backorders: o }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }) : /* @__PURE__ */ e(x, { label: "Stock status", htmlFor: `${r}-status`, children: /* @__PURE__ */ e(
        q,
        {
          id: `${r}-status`,
          value: t.stock_status,
          onChange: (o) => c(n, { stock_status: o }),
          options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
        }
      ) })
    ] }),
    /* @__PURE__ */ e(
      a,
      {
        fields: [{ handle: "image", type: "asset", label: "Image", config: { image_only: !0 } }],
        values: { image: t.image },
        pathPrefix: `${r}-image`,
        onChange: (o) => c(n, { image: o.image ?? null })
      }
    )
  ] });
}
function Ye(t) {
  const { value: n, update: c, updateVariant: l, config: a, entryId: r, live: s } = t, { Button: o, Table: b, TableBody: m, TableCell: v, TableHead: f, TableHeader: p, TableRow: d, Switch: g } = S, [h, u] = $.useState(null), _ = Qe(n.options.flatMap((y) => y.values.map((C) => C.term_id).filter((C) => !!C))), w = n.variants[0] ?? { ...Y, id: P() }, k = (y = n.options) => c({ options: y, variants: Oe(y, n.variants, { ...w, initial_stock: null, image: null }, a.max_variants) });
  return /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ e(
      I,
      {
        title: "Options",
        description: `Up to ${a.max_options} options, such as size and color. Variants are made for every combination.`,
        actions: n.options.length < a.max_options && /* @__PURE__ */ e(o, { type: "button", variant: "outline", size: "sm", onClick: () => c({ options: [...n.options, { id: P(), name: "", taxonomy: null, values: [] }] }), children: "Add option" }),
        children: n.options.map((y, C) => /* @__PURE__ */ e(
          Xe,
          {
            option: y,
            config: a,
            path: `${t.path}-o${C}`,
            onChange: (F) => k(n.options.map((N, X) => X === C ? F : N)),
            onRemove: () => k(n.options.filter((F, N) => N !== C))
          },
          y.id
        ))
      }
    ),
    /* @__PURE__ */ i(
      I,
      {
        title: `Variants (${n.variants.length})`,
        description: "Each has its own SKU, price and stock. Switch one off to stop selling it without losing it.",
        actions: /* @__PURE__ */ e(o, { type: "button", variant: "outline", size: "sm", onClick: () => k(), children: "Regenerate" }),
        children: [
          n.options.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "Add an option with values to create variants." }) : /* @__PURE__ */ e("div", { className: "cm:overflow-x-auto cm:rounded-md cm:border", children: /* @__PURE__ */ i(b, { children: [
            /* @__PURE__ */ e(p, { children: /* @__PURE__ */ i(d, { children: [
              /* @__PURE__ */ e(f, { children: "Variant" }),
              /* @__PURE__ */ e(f, { children: "SKU" }),
              /* @__PURE__ */ e(f, { children: "Price" }),
              /* @__PURE__ */ e(f, { children: "Compare-at" }),
              a.features.inventory && /* @__PURE__ */ e(f, { children: "Stock" }),
              /* @__PURE__ */ e(f, { children: "On sale" }),
              /* @__PURE__ */ e(f, {})
            ] }) }),
            /* @__PURE__ */ e(m, { children: n.variants.map((y, C) => {
              const F = s?.variants[y.id];
              return /* @__PURE__ */ i($.Fragment, { children: [
                /* @__PURE__ */ i(d, { className: y.active ? "" : "cm:opacity-60", children: [
                  /* @__PURE__ */ e(v, { className: "cm:font-medium cm:whitespace-nowrap", children: pe(n.options, y, _) }),
                  /* @__PURE__ */ e(v, { className: "cm:min-w-36", children: /* @__PURE__ */ e(fe, { value: y.sku, entryId: r, onChange: (N) => l(C, { sku: N }) }) }),
                  /* @__PURE__ */ e(v, { className: "cm:min-w-32", children: /* @__PURE__ */ e(L, { value: y.price, nullable: !1, onChange: (N) => l(C, { price: N ?? 0 }) }) }),
                  /* @__PURE__ */ e(v, { className: "cm:min-w-32", children: /* @__PURE__ */ e(L, { value: y.compare_at_price, onChange: (N) => l(C, { compare_at_price: N }) }) }),
                  a.features.inventory && /* @__PURE__ */ e(v, { className: "cm:whitespace-nowrap cm:text-sm", children: y.track_stock ? F?.stock_quantity ?? y.initial_stock ?? 0 : /* @__PURE__ */ e(j, { children: y.stock_status.replace("_", " ") }) }),
                  /* @__PURE__ */ e(v, { children: /* @__PURE__ */ e(g, { checked: y.active, "aria-label": "Sell this variant", onCheckedChange: (N) => l(C, { active: N }) }) }),
                  /* @__PURE__ */ e(v, { children: /* @__PURE__ */ e(o, { type: "button", variant: "ghost", size: "sm", "aria-expanded": h === y.id, onClick: () => u(h === y.id ? null : y.id), children: h === y.id ? "Close" : "More" }) })
                ] }),
                h === y.id && /* @__PURE__ */ e(d, { children: /* @__PURE__ */ e(v, { colSpan: 7, className: "cm:p-0", children: /* @__PURE__ */ e(Je, { variant: y, index: C, updateVariant: l, tab: t }) }) })
              ] }, y.id);
            }) })
          ] }) }),
          n.variants.length > 0 && /* @__PURE__ */ i("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
            "Prices from ",
            z(Math.min(...n.variants.map((y) => y.price))),
            " to ",
            z(Math.max(...n.variants.map((y) => y.price))),
            "."
          ] })
        ]
      }
    )
  ] });
}
function Ve(t) {
  const n = t ?? {}, c = (n.variants?.length ? n.variants : [{ ...Y, id: P() }]).map((l) => ({ ...Y, ...l, id: l.id ?? P() }));
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
function Ze({ field: t, value: n, onChange: c, errors: l, pathPrefix: a = "data.product" }) {
  A();
  const r = t.config ?? {}, s = Ve(n), { props: o } = B.usePage(), b = o.entry?.id ?? null, [m, v] = $.useState(null);
  $.useEffect(() => {
    b && O(D(`commerce/api/products/${b}`)).then((k) => v(k.data)).catch(() => {
    });
  }, [b, o.entry]);
  const f = (k) => {
    const y = { ...s, ...k };
    k.type && k.type !== "variable" && (y.options = [], y.variants = [{ ...y.variants[0], options: {} }]), k.type === "bundle" && !y.bundle && (y.bundle = { pricing: "fixed", value: 0, items: [] }), c(y);
  }, p = (k, y) => f({ variants: s.variants.map((C, F) => F === k ? { ...C, ...y } : C) }), d = [{ key: "general", label: "General", render: (k) => /* @__PURE__ */ e(Ke, { ...k }) }];
  s.type === "variable" && d.push({ key: "variants", label: "Variants", render: (k) => /* @__PURE__ */ e(Ye, { ...k }) }), s.type === "bundle" && d.push({ key: "bundle", label: "Bundle", render: (k) => /* @__PURE__ */ e(Ae, { ...k }) }), s.type !== "variable" && (r.features?.inventory ?? !0) && d.push({ key: "inventory", label: "Inventory", render: (k) => /* @__PURE__ */ e(He, { ...k }) }), s.requires_shipping && d.push({ key: "shipping", label: "Shipping", render: (k) => /* @__PURE__ */ e(Ge, { ...k }) }), d.push({ key: "pricing", label: "Bulk prices", render: (k) => /* @__PURE__ */ e(We, { ...k }) }), s.downloadable && d.push({ key: "digital", label: "Digital", render: (k) => /* @__PURE__ */ e(Ue, { ...k }) });
  for (const [k, y] of Object.entries(M.productTabs()))
    d.push({ key: `ext-${k}`, label: y.label ?? k, render: (C) => /* @__PURE__ */ e(y, { ...C }) });
  const [g, h] = $.useState("general"), u = d.find((k) => k.key === g) ?? d[0], _ = l?.[a], w = { value: s, update: f, updateVariant: p, config: r, live: m, entryId: b, path: a.replace(/\W+/g, "-") };
  return /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-4 cm:rounded-lg cm:border cm:p-4", children: [
    m?.sync_status === "failed" && /* @__PURE__ */ i("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: [
      "The published version couldn't be applied to the store, so it can't be bought: ",
      m.sync_error,
      ". Fix it and publish again."
    ] }),
    _ && /* @__PURE__ */ e("p", { role: "alert", className: "cm:text-sm cm:text-destructive", children: _ }),
    /* @__PURE__ */ e("div", { role: "tablist", "aria-label": "Product data", className: "cm:flex cm:flex-wrap cm:gap-1 cm:border-b", children: d.map((k) => /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": k.key === u.key,
        onClick: () => h(k.key),
        className: Q("cm:-mb-px cm:border-b-2 cm:px-3 cm:py-2 cm:text-sm", k.key === u.key ? "cm:border-primary cm:font-medium" : "cm:border-transparent cm:text-muted-foreground cm:hover:text-foreground"),
        children: k.label
      },
      k.key
    )) }),
    /* @__PURE__ */ e("div", { role: "tabpanel", children: u.render(w) })
  ] });
}
const et = {
  commerce_money: Ie,
  commerce_datetime_range: je,
  commerce_region: Ee,
  commerce_product: Ze
};
function tt() {
  Object.entries(et).forEach(([t, n]) => R.registerField(t, n));
}
function nt() {
  Object.assign(M.components, { EmptyState: ue, MoneyInput: te, PageHeader: G, SchemaFormView: ee, SectionNav: ge, SettingsLayout: Z, StatusBadge: j });
}
ve();
nt();
tt();
qe();
