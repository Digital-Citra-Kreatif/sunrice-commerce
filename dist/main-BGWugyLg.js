const bt = { symbol: "Rp", position: "left", space: !1, thousands: ".", decimal: ",", decimals: 0 };
let Xe = bt;
function Mt(t) {
  Xe = { ...bt, ...t ?? {} };
}
function me(t, c = Xe) {
  const r = t < 0, a = Math.abs(Math.round(t)), l = 10 ** c.decimals, i = Math.floor(a / l).toString().replace(/\B(?=(\d{3})+(?!\d))/g, c.thousands), m = c.decimals > 0 ? c.decimal + String(a % l).padStart(c.decimals, "0") : "", g = i + m, x = c.space ? " " : "", p = c.position === "left" ? `${c.symbol}${x}${g}` : `${g}${x}${c.symbol}`;
  return r ? `-${p}` : p;
}
function yt(t, c = Xe) {
  let r = t.replace(c.symbol, "").replace(/\s/g, "");
  const a = r.startsWith("-");
  r = r.replace(/^-/, "").split(c.thousands).join("");
  const [l, i = ""] = r.split(c.decimal);
  if (!/^\d*$/.test(l) || !/^\d*$/.test(i) || l + i === "")
    return null;
  const m = Number(l || "0") * 10 ** c.decimals + Number(i.padEnd(c.decimals, "0").slice(0, c.decimals) || "0");
  return a ? -m : m;
}
const ge = {
  orderPanels: {},
  dashboardWidgets: {},
  settingsSections: {},
  productTabs: {}
}, ve = {
  version: 1,
  registerOrderPanel: (t, c) => {
    ge.orderPanels[t] = c;
  },
  registerDashboardWidget: (t, c) => {
    ge.dashboardWidgets[t] = c;
  },
  registerSettingsSection: (t, c) => {
    ge.settingsSections[t] = c;
  },
  registerProductTab: (t, c) => {
    ge.productTabs[t] = c;
  },
  orderPanels: () => ge.orderPanels,
  dashboardWidgets: () => ge.dashboardWidgets,
  settingsSections: () => ge.settingsSections,
  productTabs: () => ge.productTabs,
  formatMoney: me,
  parseMoney: yt,
  components: {}
};
function Ut() {
  window.SunriceCommerce = ve;
  const t = window.SunriceCommerceQueue ?? [];
  (() => {
    for (; t.length > 0; ) {
      const r = t.shift();
      try {
        r?.(ve);
      } catch (a) {
        console.error("SunriceCommerceQueue call failed", a);
      }
    }
  })(), t.push = ((...r) => (r.forEach((a) => a(ve)), t.length)), window.SunriceCommerceQueue = t;
}
const W = window.Sunrice, { React: F, ui: L, components: ye, inertia: E, fetchJson: te, toast: Re } = W;
function N(t = "") {
  return t.startsWith("/") ? t : W.adminUrl(t);
}
const xt = window.Sunrice.React, z = xt.Fragment;
function e(t, c, r) {
  return xt.createElement(t, r === void 0 ? c : { ...c, key: r });
}
const n = e;
function X({ title: t, description: c, actions: r }) {
  const { Head: a } = E;
  return /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-wrap cm:items-start cm:justify-between cm:gap-4", children: [
    /* @__PURE__ */ e(a, { title: t }),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e("h1", { className: "cm:text-xl cm:font-semibold cm:tracking-tight", children: t }),
      c && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: c })
    ] }),
    r && /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: r })
  ] });
}
function kt(t) {
  var c, r, a = "";
  if (typeof t == "string" || typeof t == "number") a += t;
  else if (typeof t == "object") if (Array.isArray(t)) {
    var l = t.length;
    for (c = 0; c < l; c++) t[c] && (r = kt(t[c])) && (a && (a += " "), a += r);
  } else for (r in t) t[r] && (a && (a += " "), a += r);
  return a;
}
function Ht() {
  for (var t, c, r = 0, a = "", l = arguments.length; r < l; r++) (t = arguments[r]) && (c = kt(t)) && (a && (a += " "), a += c);
  return a;
}
function le(...t) {
  return Ht(t);
}
const mt = {
  ok: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  success: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  warning: "cm:bg-amber-500/10 cm:text-amber-700 cm:dark:text-amber-400",
  error: "cm:bg-red-500/10 cm:text-red-700 cm:dark:text-red-400",
  info: "cm:bg-sky-500/10 cm:text-sky-700 cm:dark:text-sky-400",
  neutral: "cm:bg-muted cm:text-muted-foreground"
};
function O({ tone: t = "neutral", children: c }) {
  return /* @__PURE__ */ e("span", { className: le("cm:inline-flex cm:items-center cm:rounded-full cm:px-2 cm:py-0.5 cm:text-xs cm:font-medium", mt[t] ?? mt.neutral), children: c });
}
function Ce({ title: t, description: c, action: r }) {
  return /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-col cm:items-center cm:gap-2 cm:rounded-lg cm:border cm:border-dashed cm:px-6 cm:py-10 cm:text-center", children: [
    /* @__PURE__ */ e("p", { className: "cm:font-medium", children: t }),
    c && /* @__PURE__ */ e("p", { className: "cm:max-w-md cm:text-sm cm:text-muted-foreground", children: c }),
    r && /* @__PURE__ */ e("div", { className: "cm:mt-2", children: r })
  ] });
}
function G() {
  const { props: t } = E.usePage(), c = t.commerce ?? {};
  return Mt(c.currency), c;
}
function Kt({ status: t, confirmations: c }) {
  const { Card: r, CardContent: a, Button: l, Input: i, Dialog: m, DialogContent: g, DialogFooter: x, DialogHeader: p, DialogTitle: y } = L, { Link: f, router: o } = E;
  G(), W.useBreadcrumbs([{ label: "Shop", href: N("commerce") }, { label: "Payments to verify" }]);
  const [u, C] = F.useState(null), [h, s] = F.useState(""), v = (b) => {
    const _ = b.expected_amount !== null && b.amount_value < b.expected_amount;
    _ && !window.confirm(`${b.amount} is less than the ${b.expected} expected. Approve anyway?`) || o.post(N(`commerce/confirmations/${b.id}/approve`), { anyway: _ }, { preserveScroll: !0 });
  };
  return /* @__PURE__ */ n("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-5xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(X, { title: "Payments to verify", description: "Customers' transfer confirmations. Compare the proof with the amount expected, then approve or reject." }),
    /* @__PURE__ */ e("div", { className: "cm:flex cm:gap-2", children: ["submitted", "approved", "rejected"].map((b) => /* @__PURE__ */ e(l, { size: "sm", variant: b === t ? "default" : "outline", asChild: !0, children: /* @__PURE__ */ e(f, { href: N(`commerce/confirmations?status=${b}`), children: b === "submitted" ? "Waiting" : b[0].toUpperCase() + b.slice(1) }) }, b)) }),
    c.length === 0 && /* @__PURE__ */ e(Ce, { title: t === "submitted" ? "Nothing to verify" : "None yet" }),
    c.map((b) => /* @__PURE__ */ e(r, { children: /* @__PURE__ */ n(a, { className: "cm:grid cm:gap-4 cm:pt-6 cm:md:grid-cols-[1fr_16rem]", children: [
      /* @__PURE__ */ n("div", { className: "cm:grid cm:content-start cm:gap-1 cm:text-sm", children: [
        /* @__PURE__ */ n("p", { className: "cm:text-base cm:font-medium", children: [
          /* @__PURE__ */ e(f, { href: N(b.order.href), className: "cm:hover:underline", children: b.order.number }),
          " · ",
          b.order.customer
        ] }),
        /* @__PURE__ */ n("p", { children: [
          "Sent ",
          /* @__PURE__ */ e("strong", { children: b.amount }),
          b.expected && /* @__PURE__ */ n(z, { children: [
            " · expected ",
            /* @__PURE__ */ e("strong", { children: b.expected })
          ] }),
          b.expected_amount !== null && b.amount_value < b.expected_amount && /* @__PURE__ */ n(z, { children: [
            " ",
            /* @__PURE__ */ e(O, { tone: "warning", children: "Less than expected" })
          ] })
        ] }),
        /* @__PURE__ */ n("p", { children: [
          "From ",
          b.sender_name,
          b.sender_bank ? ` (${b.sender_bank})` : "",
          " on ",
          b.transferred_at ?? "—"
        ] }),
        b.destination && /* @__PURE__ */ n("p", { children: [
          "Into ",
          b.destination.bank,
          " ",
          b.destination.number,
          " · ",
          b.destination.holder
        ] }),
        b.method && /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: b.method }),
        b.note && /* @__PURE__ */ n("p", { className: "cm:whitespace-pre-line cm:text-muted-foreground", children: [
          "“",
          b.note,
          "”"
        ] }),
        b.review_note && /* @__PURE__ */ n("p", { className: "cm:text-muted-foreground", children: [
          "Rejected: ",
          b.review_note
        ] }),
        b.status === "submitted" && /* @__PURE__ */ n("div", { className: "cm:mt-2 cm:flex cm:gap-2", children: [
          /* @__PURE__ */ e(l, { size: "sm", onClick: () => v(b), children: "Approve" }),
          /* @__PURE__ */ e(l, { size: "sm", variant: "outline", onClick: () => {
            C(b), s("");
          }, children: "Reject" })
        ] })
      ] }),
      /* @__PURE__ */ e("div", { children: b.proof_url ? b.proof_is_pdf ? /* @__PURE__ */ e("a", { href: b.proof_url, target: "_blank", rel: "noreferrer", className: "cm:underline", children: "Open the PDF proof" }) : /* @__PURE__ */ e("a", { href: b.proof_url, target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ e("img", { src: b.proof_url, alt: `Proof for ${b.order.number}`, className: "cm:max-h-72 cm:w-full cm:rounded-md cm:border cm:object-contain" }) }) : /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No proof attached." }) })
    ] }) }, b.id)),
    /* @__PURE__ */ e(m, { open: u !== null, onOpenChange: (b) => !b && C(null), children: /* @__PURE__ */ n(g, { children: [
      /* @__PURE__ */ e(p, { children: /* @__PURE__ */ e(y, { children: "Reject this confirmation?" }) }),
      /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "The customer is emailed the reason and can confirm again; the payment deadline resumes." }),
      /* @__PURE__ */ e(i, { "aria-label": "Reason", placeholder: "e.g. We haven't received the transfer yet", value: h, onChange: (b) => s(b.target.value) }),
      /* @__PURE__ */ n(x, { children: [
        /* @__PURE__ */ e(l, { variant: "outline", onClick: () => C(null), children: "Back" }),
        /* @__PURE__ */ e(l, { disabled: h.trim() === "", onClick: () => u && o.post(N(`commerce/confirmations/${u.id}/reject`), { reason: h }, { preserveScroll: !0, onSuccess: () => C(null) }), children: "Reject" })
      ] })
    ] }) })
  ] });
}
const We = (t) => t ? new Date(t).toLocaleDateString(void 0, { dateStyle: "medium" }) : "—";
function Wt({ customer: t, account: c, roleOptions: r, orders: a, can: l }) {
  const { Card: i, CardContent: m, CardHeader: g, CardTitle: x, Button: p, Input: y, Label: f, Textarea: o, Switch: u, Checkbox: C } = L, { Link: h, router: s } = E;
  G(), W.useBreadcrumbs([{ label: "Shop", href: N("commerce") }, { label: "Customers", href: N("commerce/customers") }, { label: t.name ?? t.email }]);
  const v = E.useForm({ name: t.name ?? "", phone: t.phone ?? "", note: t.note ?? "", accepts_marketing: t.accepts_marketing, roles: c?.roles ?? [] }), [b, _] = F.useState(!1), D = ($) => s.post(N(`commerce/customers/${t.id}/${$}`), {}, { preserveScroll: !0 });
  return /* @__PURE__ */ n("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-5xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      X,
      {
        title: t.name ?? t.email,
        description: /* @__PURE__ */ n(z, { children: [
          t.email,
          t.phone ? ` · ${t.phone}` : ""
        ] }),
        actions: /* @__PURE__ */ n(z, { children: [
          t.deletion_requested_at && /* @__PURE__ */ n(O, { tone: "warning", children: [
            "Deletion requested ",
            We(t.deletion_requested_at)
          ] }),
          c ? /* @__PURE__ */ e(O, { tone: "ok", children: "Registered" }) : /* @__PURE__ */ e(O, { children: "Guest" })
        ] })
      }
    ),
    /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-3", children: [["Orders", String(t.orders_count)], ["Spent", t.total_spent], ["Last order", We(t.last_order_at)]].map(([$, k]) => /* @__PURE__ */ e(i, { children: /* @__PURE__ */ n(m, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
      /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: $ }),
      /* @__PURE__ */ e("span", { className: "cm:text-xl cm:font-semibold", children: k })
    ] }) }, $)) }),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[2fr_1fr]", children: [
      /* @__PURE__ */ n("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ n(i, { children: [
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: "Orders" }) }),
          /* @__PURE__ */ e(m, { children: a.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No orders yet." }) : /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1", children: a.map(($) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ n(h, { href: N($.href), className: "cm:flex cm:justify-between cm:rounded cm:p-2 cm:hover:bg-muted", children: [
            /* @__PURE__ */ n("span", { children: [
              $.number,
              " · ",
              We($.date)
            ] }),
            /* @__PURE__ */ n("span", { children: [
              /* @__PURE__ */ e(O, { children: $.status }),
              " ",
              $.total
            ] })
          ] }) }, $.id)) }) })
        ] }),
        /* @__PURE__ */ n(i, { children: [
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: "Addresses" }) }),
          /* @__PURE__ */ e(m, { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: t.addresses.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No saved addresses." }) : t.addresses.map(($) => /* @__PURE__ */ n("div", { className: "cm:rounded-md cm:border cm:p-3 cm:text-sm", children: [
            $.label && /* @__PURE__ */ e("p", { className: "cm:font-medium", children: $.label }),
            /* @__PURE__ */ e("p", { className: "cm:whitespace-pre-line", children: $.text }),
            /* @__PURE__ */ n("div", { className: "cm:mt-1 cm:flex cm:gap-1", children: [
              $.default_shipping && /* @__PURE__ */ e(O, { children: "Shipping" }),
              $.default_billing && /* @__PURE__ */ e(O, { children: "Billing" })
            ] })
          ] }, $.id)) })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ n(i, { children: [
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: "Details" }) }),
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ n("form", { className: "cm:grid cm:gap-3", onSubmit: ($) => {
            $.preventDefault(), v.put(N(`commerce/customers/${t.id}`), { preserveScroll: !0 });
          }, children: [
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(f, { htmlFor: "c-name", children: "Name" }),
              /* @__PURE__ */ e(y, { id: "c-name", disabled: !l.edit, value: v.data.name, onChange: ($) => v.setData("name", $.target.value) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(f, { htmlFor: "c-phone", children: "Phone" }),
              /* @__PURE__ */ e(y, { id: "c-phone", disabled: !l.edit, value: v.data.phone, onChange: ($) => v.setData("phone", $.target.value) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(f, { htmlFor: "c-note", children: "Note (staff only)" }),
              /* @__PURE__ */ e(o, { id: "c-note", disabled: !l.edit, value: v.data.note, onChange: ($) => v.setData("note", $.target.value) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e(u, { id: "c-marketing", disabled: !l.edit, checked: v.data.accepts_marketing, onCheckedChange: ($) => v.setData("accepts_marketing", $) }),
              /* @__PURE__ */ e(f, { htmlFor: "c-marketing", children: "Accepts marketing" })
            ] }),
            c && /* @__PURE__ */ n("fieldset", { className: "cm:grid cm:gap-1.5", children: [
              /* @__PURE__ */ e("legend", { className: "cm:mb-1 cm:text-sm cm:font-medium", children: "Roles" }),
              r.map(($) => /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
                /* @__PURE__ */ e(
                  C,
                  {
                    disabled: !l.edit,
                    checked: v.data.roles.includes($),
                    onCheckedChange: (k) => v.setData("roles", k ? [...v.data.roles, $] : v.data.roles.filter((j) => j !== $))
                  }
                ),
                $
              ] }, $))
            ] }),
            l.edit && /* @__PURE__ */ e(p, { type: "submit", disabled: v.processing, children: "Save" })
          ] }) })
        ] }),
        c && /* @__PURE__ */ n(i, { children: [
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: "Account" }) }),
          /* @__PURE__ */ n(m, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            /* @__PURE__ */ n("p", { children: [
              "Email ",
              c.email_verified ? "verified" : "not verified"
            ] }),
            c.google && /* @__PURE__ */ n("p", { children: [
              "Google: ",
              c.google
            ] }),
            l.edit && /* @__PURE__ */ e(p, { variant: "outline", size: "sm", onClick: () => D("password-reset"), children: "Send a password reset link" }),
            l.edit && !c.email_verified && /* @__PURE__ */ e(p, { variant: "outline", size: "sm", onClick: () => D("verify"), children: "Mark email verified" })
          ] })
        ] }),
        l.delete && !t.anonymized && /* @__PURE__ */ n(i, { children: [
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: "Remove personal data" }) }),
          /* @__PURE__ */ n(m, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "Name, email, phone and addresses are deleted; orders keep their amounts." }),
            b ? /* @__PURE__ */ n("div", { className: "cm:flex cm:gap-2", children: [
              /* @__PURE__ */ e(p, { variant: "destructive", size: "sm", onClick: () => D("anonymize"), children: "Remove for good" }),
              /* @__PURE__ */ e(p, { variant: "outline", size: "sm", onClick: () => _(!1), children: "Cancel" })
            ] }) : /* @__PURE__ */ e(p, { variant: "outline", size: "sm", onClick: () => _(!0), children: "Anonymize" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
const Vt = F.lazy(() => import("./ChartImpl-D_HsDLEQ.js"));
function Ye(t) {
  const c = /* @__PURE__ */ e("div", { className: "cm:animate-pulse cm:rounded-md cm:bg-muted", style: { height: t.height ?? 260 } });
  return /* @__PURE__ */ e(F.Suspense, { fallback: c, children: /* @__PURE__ */ e(Vt, { ...t }) });
}
function fe({ kpi: t }) {
  const { Card: c, CardContent: r } = L, { Link: a } = E, l = t.change ?? null, i = /* @__PURE__ */ n(r, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
    /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: t.label }),
    /* @__PURE__ */ e("span", { className: "cm:text-2xl cm:font-semibold cm:tabular-nums", children: t.value }),
    l !== null && /* @__PURE__ */ n(
      "span",
      {
        className: le("cm:text-xs cm:font-medium", l > 0 ? "cm:text-emerald-600" : l < 0 ? "cm:text-red-600" : "cm:text-muted-foreground"),
        title: "Compared with the previous period",
        children: [
          /* @__PURE__ */ e("span", { "aria-hidden": !0, children: l > 0 ? "▲" : l < 0 ? "▼" : "•" }),
          " ",
          Math.abs(l).toLocaleString(void 0, { maximumFractionDigits: 1 }),
          "%",
          /* @__PURE__ */ n("span", { className: "cm:sr-only", children: [
            l > 0 ? " up" : l < 0 ? " down" : "",
            " from the previous period"
          ] })
        ]
      }
    ),
    t.hint && /* @__PURE__ */ e("span", { className: "cm:text-xs cm:text-muted-foreground", children: t.hint })
  ] });
  return /* @__PURE__ */ e(c, { children: t.href ? /* @__PURE__ */ e(a, { href: N(t.href), className: "cm:block", children: i }) : i });
}
const Qt = { pending: "warning", on_hold: "warning", processing: "info", completed: "ok", cancelled: "neutral", refunded: "neutral", failed: "error" }, Gt = (t) => (/* @__PURE__ */ new Date(`${t}T00:00:00`)).toLocaleDateString(void 0, { day: "numeric", month: "short" });
function Jt({ mode: t, setup: c, health: r, period: a, analytics: l, canReports: i, kpis: m, sales: g, topProducts: x, todo: p, widgets: y, recentOrders: f }) {
  const { Card: o, CardContent: u, CardHeader: C, CardTitle: h, CardDescription: s, Button: v } = L, { Link: b } = E;
  G();
  const _ = c.filter((k) => !k.done), D = r.filter((k) => k.status !== "ok"), $ = Object.entries(ve.dashboardWidgets()).filter(([k]) => y !== void 0 && k in y);
  return /* @__PURE__ */ n("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(X, { title: "Store", description: /* @__PURE__ */ n(z, { children: [
      "Selling mode: ",
      t.label
    ] }) }),
    _.length > 0 && /* @__PURE__ */ n(o, { children: [
      /* @__PURE__ */ n(C, { children: [
        /* @__PURE__ */ e(h, { children: "Set up your store" }),
        /* @__PURE__ */ n(s, { children: [
          c.length - _.length,
          " of ",
          c.length,
          " done"
        ] })
      ] }),
      /* @__PURE__ */ e(u, { className: "cm:grid cm:gap-2", children: c.map((k) => /* @__PURE__ */ n(b, { href: N(k.href), className: "cm:flex cm:items-start cm:gap-3 cm:rounded-md cm:p-2 cm:hover:bg-muted", children: [
        /* @__PURE__ */ e("span", { "aria-hidden": !0, className: k.done ? "cm:text-emerald-600" : "cm:text-muted-foreground", children: k.done ? "✓" : "○" }),
        /* @__PURE__ */ n("span", { className: "cm:grid", children: [
          /* @__PURE__ */ e("span", { className: k.done ? "cm:text-muted-foreground cm:line-through" : "cm:font-medium", children: k.label }),
          k.description && /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: k.description })
        ] })
      ] }, k.key)) })
    ] }),
    D.length > 0 && /* @__PURE__ */ n(o, { children: [
      /* @__PURE__ */ e(C, { children: /* @__PURE__ */ e(h, { children: "Needs attention" }) }),
      /* @__PURE__ */ e(u, { className: "cm:grid cm:gap-3", children: D.map((k) => /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
          /* @__PURE__ */ e(O, { tone: k.status, children: k.status === "error" ? "Problem" : "Warning" }),
          /* @__PURE__ */ e("span", { className: "cm:font-medium", children: k.label })
        ] }),
        /* @__PURE__ */ e("p", { className: "cm:text-sm", children: k.message }),
        k.fix && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: k.fix })
      ] }, k.key)) })
    ] }),
    l && /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2", children: [
      /* @__PURE__ */ e("div", { role: "group", "aria-label": "Period", className: "cm:flex cm:gap-1", children: a.options.map((k) => /* @__PURE__ */ e(
        v,
        {
          size: "sm",
          variant: k.value === a.key ? "default" : "outline",
          "aria-pressed": k.value === a.key,
          onClick: () => E.router.get(N("commerce"), { period: k.value }, { preserveScroll: !0, preserveState: !0 }),
          children: k.label
        },
        k.value
      )) }),
      i && /* @__PURE__ */ e(b, { href: N("commerce/reports/sales"), className: "cm:text-sm cm:underline", children: "All reports" })
    ] }),
    /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2 cm:lg:grid-cols-5", children: m === void 0 ? [0, 1, 2, 3, 4].map((k) => /* @__PURE__ */ e("div", { className: "cm:h-24 cm:animate-pulse cm:rounded-lg cm:bg-muted" }, k)) : m.map((k) => /* @__PURE__ */ e(fe, { kpi: k }, k.key)) }),
    l && /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-4 cm:lg:grid-cols-3", children: [
      /* @__PURE__ */ n(o, { className: "cm:lg:col-span-2", children: [
        /* @__PURE__ */ n(C, { children: [
          /* @__PURE__ */ e(h, { children: "Sales" }),
          /* @__PURE__ */ e(s, { children: "Total sales per day, against the previous period" })
        ] }),
        /* @__PURE__ */ e(u, { children: g === void 0 ? /* @__PURE__ */ e("div", { className: "cm:h-64 cm:animate-pulse cm:rounded-md cm:bg-muted" }) : /* @__PURE__ */ e(
          Ye,
          {
            label: "Total sales per day",
            data: g,
            xKey: "date",
            formatX: Gt,
            format: (k) => me(k),
            series: [{ key: "total", label: "This period" }, { key: "previous", label: "Previous period", dashed: !0 }]
          }
        ) })
      ] }),
      /* @__PURE__ */ n(o, { children: [
        /* @__PURE__ */ e(C, { children: /* @__PURE__ */ e(h, { children: "Top products" }) }),
        /* @__PURE__ */ e(u, { children: x === void 0 ? /* @__PURE__ */ e("div", { className: "cm:h-40 cm:animate-pulse cm:rounded-md cm:bg-muted" }) : x.length === 0 ? /* @__PURE__ */ e(Ce, { title: "No sales yet", description: "Best sellers in this period show up here." }) : /* @__PURE__ */ e("ol", { className: "cm:grid cm:gap-2", children: x.map((k) => /* @__PURE__ */ n("li", { className: "cm:flex cm:justify-between cm:gap-2 cm:text-sm", children: [
          k.href ? /* @__PURE__ */ e(b, { href: N(k.href), className: "cm:truncate cm:hover:underline", children: k.title }) : /* @__PURE__ */ e("span", { className: "cm:truncate", children: k.title }),
          /* @__PURE__ */ n("span", { className: "cm:shrink-0 cm:tabular-nums cm:text-muted-foreground", children: [
            k.units,
            " · ",
            k.revenue
          ] })
        ] }, k.product_id)) }) })
      ] })
    ] }),
    /* @__PURE__ */ n(o, { children: [
      /* @__PURE__ */ e(C, { children: /* @__PURE__ */ e(h, { children: "To do" }) }),
      /* @__PURE__ */ e(u, { children: p === void 0 ? /* @__PURE__ */ e("div", { className: "cm:h-16 cm:animate-pulse cm:rounded-md cm:bg-muted" }) : p.length === 0 ? /* @__PURE__ */ e(Ce, { title: "Nothing to do", description: "Orders to process and payments to verify show up here." }) : /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1", children: p.map((k) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ n(b, { href: N(k.href), className: "cm:flex cm:justify-between cm:rounded-md cm:p-2 cm:hover:bg-muted", children: [
        /* @__PURE__ */ e("span", { children: k.label }),
        /* @__PURE__ */ e("span", { className: "cm:font-semibold", children: k.count })
      ] }) }, k.key)) }) })
    ] }),
    f !== void 0 && f.length > 0 && /* @__PURE__ */ n(o, { children: [
      /* @__PURE__ */ e(C, { children: /* @__PURE__ */ e(h, { children: "Recent orders" }) }),
      /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1", children: f.map((k) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ n(b, { href: N(k.href), className: "cm:grid cm:grid-cols-[1fr_auto] cm:items-center cm:gap-x-3 cm:rounded-md cm:p-2 cm:hover:bg-muted cm:sm:grid-cols-[8rem_1fr_auto_auto]", children: [
        /* @__PURE__ */ e("span", { className: "cm:font-medium", children: k.number }),
        /* @__PURE__ */ e("span", { className: "cm:truncate cm:text-muted-foreground", children: k.customer }),
        /* @__PURE__ */ e(O, { tone: Qt[k.status_key], children: k.status }),
        /* @__PURE__ */ e("span", { className: "cm:tabular-nums", children: k.total })
      ] }) }, k.id)) }) })
    ] }),
    $.map(([k, j]) => /* @__PURE__ */ e(j, { ...y?.[k] }, k))
  ] });
}
const Xt = { in_stock: "ok", out_of_stock: "error", backorder: "warning" };
function Yt({ row: t, reasons: c, onClose: r }) {
  const { Dialog: a, DialogContent: l, DialogHeader: i, DialogTitle: m, DialogDescription: g, DialogFooter: x, Button: p, Input: y, Label: f } = L, o = E.useForm({ mode: "add", quantity: 0, reason: "manual", note: "" }), [u, C] = F.useState(null);
  F.useEffect(() => {
    te(N(`commerce/inventory/${t.id}/history`)).then((s) => C(s.data)).catch(() => C([]));
  }, [t.id]);
  const h = o.data.mode === "set" ? o.data.quantity : (t.stock_quantity ?? 0) + o.data.quantity;
  return /* @__PURE__ */ e(a, { open: !0, onOpenChange: (s) => !s && r(), children: /* @__PURE__ */ n(l, { className: "cm:max-w-lg", children: [
    /* @__PURE__ */ n(i, { children: [
      /* @__PURE__ */ e(m, { children: "Adjust stock" }),
      /* @__PURE__ */ n(g, { children: [
        t.product_title,
        t.sku ? ` · ${t.sku}` : "",
        ". Now: ",
        t.track_stock ? t.stock_quantity ?? 0 : "not tracked",
        "."
      ] })
    ] }),
    /* @__PURE__ */ n("form", { id: "adjust-stock", className: "cm:grid cm:gap-3", onSubmit: (s) => {
      s.preventDefault(), o.post(N(`commerce/inventory/${t.id}/adjust`), { preserveScroll: !0, onSuccess: r });
    }, children: [
      /* @__PURE__ */ n("div", { className: "cm:grid cm:grid-cols-2 cm:gap-3", children: [
        /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(f, { htmlFor: "adjust-mode", children: "Change" }),
          /* @__PURE__ */ n("select", { id: "adjust-mode", className: "cm:h-9 cm:rounded-md cm:border cm:bg-background cm:px-3 cm:text-sm", value: o.data.mode, onChange: (s) => o.setData("mode", s.target.value), children: [
            /* @__PURE__ */ e("option", { value: "add", children: "Add or remove" }),
            /* @__PURE__ */ e("option", { value: "set", children: "Set to" })
          ] })
        ] }),
        /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(f, { htmlFor: "adjust-quantity", children: o.data.mode === "set" ? "New stock" : "Units (+/−)" }),
          /* @__PURE__ */ e(y, { id: "adjust-quantity", type: "number", value: o.data.quantity, onChange: (s) => o.setData("quantity", Number(s.target.value)) }),
          o.errors.quantity && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-destructive", children: o.errors.quantity })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:grid-cols-2 cm:gap-3", children: [
        /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(f, { htmlFor: "adjust-reason", children: "Reason" }),
          /* @__PURE__ */ e("select", { id: "adjust-reason", className: "cm:h-9 cm:rounded-md cm:border cm:bg-background cm:px-3 cm:text-sm", value: o.data.reason, onChange: (s) => o.setData("reason", s.target.value), children: c.map((s) => /* @__PURE__ */ e("option", { value: s, children: s[0].toUpperCase() + s.slice(1) }, s)) })
        ] }),
        /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(f, { htmlFor: "adjust-note", children: "Note" }),
          /* @__PURE__ */ e(y, { id: "adjust-note", value: o.data.note, onChange: (s) => o.setData("note", s.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ n("p", { className: "cm:text-sm", children: [
        "Stock after: ",
        /* @__PURE__ */ e("strong", { children: h })
      ] })
    ] }),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:max-h-56 cm:gap-1 cm:overflow-auto cm:border-t cm:pt-3 cm:text-sm", children: [
      /* @__PURE__ */ e("p", { className: "cm:font-medium", children: "History" }),
      u === null ? /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "Loading…" }) : u.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "No changes yet." }) : u.map((s) => /* @__PURE__ */ n("div", { className: "cm:flex cm:justify-between cm:gap-3", children: [
        /* @__PURE__ */ n("span", { children: [
          s.delta > 0 ? `+${s.delta}` : s.delta,
          " → ",
          s.quantity_after,
          " · ",
          s.reason,
          s.reference ? ` (${s.reference.type} #${s.reference.id})` : "",
          s.note ? ` · ${s.note}` : ""
        ] }),
        /* @__PURE__ */ n("span", { className: "cm:whitespace-nowrap cm:text-muted-foreground", children: [
          s.user ? `${s.user}, ` : "",
          new Date(s.at).toLocaleString()
        ] })
      ] }, s.id))
    ] }),
    /* @__PURE__ */ n(x, { children: [
      /* @__PURE__ */ e(p, { variant: "outline", type: "button", onClick: r, children: "Cancel" }),
      /* @__PURE__ */ e(p, { type: "submit", form: "adjust-stock", disabled: o.processing, children: "Save" })
    ] })
  ] }) });
}
function Zt(t) {
  const { DataTable: c } = ye, [r, a] = F.useState(null);
  return G(), W.useBreadcrumbs([{ label: "Shop", href: N("commerce") }, { label: "Inventory" }]), /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(X, { title: "Inventory", description: "Stock of every product variant. Every change is recorded." }),
    /* @__PURE__ */ e(
      c,
      {
        ...t,
        searchPlaceholder: "Search products or SKUs…",
        onRowClick: t.can.adjust ? (l) => a(l) : void 0,
        renderCell: (l, i) => {
          if (i.key === "status") return /* @__PURE__ */ e(O, { tone: l.low ? "warning" : Xt[l.status], children: l.low ? "Low" : l.status.replace(/_/g, " ") });
          if (i.key === "stock_quantity") return l.track_stock ? l.stock_quantity : /* @__PURE__ */ e("span", { className: "cm:text-muted-foreground", children: "—" });
        }
      }
    ),
    r && /* @__PURE__ */ e(Yt, { row: r, reasons: t.reasons, onClose: () => a(null) })
  ] });
}
function ot(t) {
  switch (t?.input) {
    case "days":
      return 30;
    case "number":
      return 1;
    case "money":
      return 0;
    case "select":
      return t.options?.[0]?.value ?? "";
    case "products":
    case "categories":
      return [];
    case "text":
      return "";
    default:
      return null;
  }
}
function en(t) {
  const c = [];
  for (const [r, a] of Object.entries(t)) {
    let l = c.find(([i]) => i === a.group);
    l || (l = [a.group, []], c.push(l)), l[1].push([r, a]);
  }
  return c;
}
function Ve(t, c) {
  return t.rules.every((r) => {
    const a = c[r.rule];
    return a ? a.input === "none" ? !0 : a.input === "products" || a.input === "categories" ? Array.isArray(r.value) && r.value.length > 0 : a.input === "days" || a.input === "number" || a.input === "money" ? r.value !== "" && r.value !== null && Number(r.value) >= 0 : String(r.value ?? "").trim() !== "" : !1;
  });
}
function tn(t, c, r, a) {
  const l = `{${c}}`, i = r ?? t.length, m = a ?? i;
  return { text: t.slice(0, i) + l + t.slice(m), cursor: i + l.length };
}
function nn(t, c) {
  const r = /* @__PURE__ */ new Set();
  for (const a of t.matchAll(/\{([a-z_]+)(?:\|[^{}]*)?\}/g))
    c.includes(a[1]) || r.add(a[1]);
  return [...r];
}
function ze(t, c) {
  return c > 0 ? `${Math.round(t / c * 1e3) / 10}%` : "—";
}
function Nt({ field: t, value: c, onChange: r, pathPrefix: a }) {
  const { Input: l, Badge: i } = L, m = t.config ?? {}, g = Array.isArray(c) ? c : [], [x, p] = F.useState(""), [y, f] = F.useState([]), [o, u] = F.useState(!1);
  F.useEffect(() => {
    if (!o) return;
    const s = new URLSearchParams({ q: x });
    (m.types ?? []).forEach((b) => s.append("types[]", b)), (m.taxonomies ?? []).forEach((b) => s.append("taxonomies[]", b));
    const v = setTimeout(() => te(`${m.api}?${s}`).then((b) => f(b.data)).catch(() => f([])), 200);
    return () => clearTimeout(v);
  }, [x, o]);
  const C = (s) => g.some((v) => v.type === s.type && v.id === s.id), h = { product: "Product", variant: "Variant", term: "Category/brand" };
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-2", children: [
    g.length > 0 && /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: g.map((s) => /* @__PURE__ */ n(i, { variant: "secondary", className: "cm:gap-1", children: [
      /* @__PURE__ */ n("span", { className: "cm:text-muted-foreground", children: [
        h[s.type],
        ":"
      ] }),
      " ",
      s.label,
      /* @__PURE__ */ e("button", { type: "button", "aria-label": `Remove ${s.label}`, onClick: () => r(g.filter((v) => !(v.type === s.type && v.id === s.id))), children: "×" })
    ] }, `${s.type}:${s.id}`)) }),
    /* @__PURE__ */ n("div", { className: "cm:relative", children: [
      /* @__PURE__ */ e(
        l,
        {
          id: a,
          value: x,
          placeholder: "Search products, SKUs, categories, brands…",
          onFocus: () => u(!0),
          onBlur: () => setTimeout(() => u(!1), 150),
          onChange: (s) => p(s.target.value)
        }
      ),
      o && y.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-20 cm:mt-1 cm:max-h-72 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: y.map((s) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: C(s),
          className: "cm:flex cm:w-full cm:justify-between cm:gap-3 cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted cm:disabled:opacity-50",
          onMouseDown: (v) => v.preventDefault(),
          onClick: () => {
            r([...g, { type: s.type, id: s.id, label: s.label }]), p("");
          },
          children: [
            /* @__PURE__ */ e("span", { children: s.label }),
            /* @__PURE__ */ e("span", { className: "cm:text-xs cm:text-muted-foreground", children: s.group })
          ]
        }
      ) }, `${s.type}:${s.id}`)) })
    ] })
  ] });
}
const cn = { active: "ok", paused: "warning", scheduled: "info", draft: "neutral" };
function rn({ campaign: t, locales: c, mainLocale: r, rules: a, tags: l, triggers: i, templates: m, reachable: g, bodyFields: x, currency: p }) {
  const {
    Card: y,
    CardContent: f,
    CardHeader: o,
    CardTitle: u,
    CardDescription: C,
    Button: h,
    Input: s,
    Label: v,
    Switch: b,
    Tabs: _,
    TabsList: D,
    TabsTrigger: $,
    TabsContent: k,
    Select: j,
    SelectContent: M,
    SelectItem: Y,
    SelectTrigger: ne,
    SelectValue: ce,
    Dialog: w,
    DialogContent: I,
    DialogHeader: A,
    DialogTitle: Q,
    DialogDescription: T,
    DialogFooter: V
  } = L, { FieldRenderer: U, InputError: ae } = ye, { router: ie } = E, d = t.type === "automation", B = d ? "commerce/marketing/automations" : "commerce/marketing/campaigns";
  G(), W.useBreadcrumbs([
    { label: "Shop", href: N("commerce") },
    { label: "Marketing", href: N("commerce/marketing") },
    { label: d ? "Automations" : "Campaigns", href: N(B) },
    { label: t.id ? t.name : "New" }
  ]);
  const Te = E.useForm({
    name: t.name,
    trigger: t.trigger ?? "",
    delay: t.delay ?? "",
    voucher_code: t.voucher_code,
    audience: t.audience,
    content: t.content
  }), { data: P, setData: xe, errors: Pe, processing: et, isDirty: Le } = Te, [ue, Dt] = F.useState(r), [se, tt] = F.useState(null), [Ft, nt] = F.useState(!1), [de, Tt] = F.useState(null), [ct, rt] = F.useState(!1), Oe = F.useMemo(() => de ? URL.createObjectURL(new Blob([de.html], { type: "text/html" })) : null, [de]);
  F.useEffect(() => () => {
    Oe && URL.revokeObjectURL(Oe);
  }, [Oe]);
  const [jt, Ee] = F.useState(!1), [Ie, qt] = F.useState(""), at = F.useRef(null), Ue = i.find((S) => S.key === P.trigger), lt = t.id !== null && !Le, Rt = JSON.stringify(P.audience);
  F.useEffect(() => {
    if (!Ve(P.audience, a)) return;
    nt(!0);
    const S = setTimeout(() => {
      te(N("commerce/marketing/audience"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audience: P.audience })
      }).then(tt).catch(() => tt(null)).finally(() => nt(!1));
    }, 400);
    return () => clearTimeout(S);
  }, [Rt]);
  const Ae = (S) => xe("audience", S), it = (S, R) => Ae({
    ...P.audience,
    rules: P.audience.rules.map((J, H) => H === S ? R.rule !== void 0 ? { rule: R.rule, value: ot(a[R.rule]) } : { ...J, ...R } : J)
  }), He = (S, R) => xe("content", { ...P.content, [ue]: { ...P.content[ue], [S]: R } }), Pt = (S) => {
    const R = at.current;
    if (R && document.body.contains(R.el)) {
      const { text: J, cursor: H } = tn(R.el.value, S, R.el.selectionStart, R.el.selectionEnd);
      He(R.part, J), requestAnimationFrame(() => {
        R.el.focus(), R.el.setSelectionRange(H, H);
      });
      return;
    }
    navigator.clipboard?.writeText(`{${S}}`).then(() => Re.success(`Copied {${S}}. Paste it into the text.`), () => Re.error(`Type {${S}} into the text.`));
  }, Lt = () => {
    const S = { preserveScroll: !0, onError: () => Re.error("Check the highlighted fields.") };
    t.id ? Te.put(N(`commerce/marketing/${t.id}`), S) : Te.post(N(d ? "commerce/marketing/automations" : "commerce/marketing/campaigns"), S);
  }, st = () => ({ content: P.content, audience: P.audience, voucher_code: P.voucher_code, locale: ue }), Ot = () => {
    rt(!0), te(N("commerce/marketing/preview"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(st())
    }).then(Tt).catch(() => Re.error("The preview couldn't be made.")).finally(() => rt(!1));
  }, Et = () => ie.post(N("commerce/marketing/test"), st(), { preserveScroll: !0 }), It = (S) => {
    const R = m.find((J) => J.key === S);
    R && (Le && !window.confirm("Replace the audience and texts with this template?") || xe({ ...P, audience: R.audience, content: { ...P.content, ...R.content }, name: P.name || R.label }));
  }, At = (S) => {
    const R = i.find((H) => H.key === S);
    if (!R) return;
    const J = Le && !window.confirm(`Start from the "${R.label}" texts?`);
    xe({ ...P, trigger: S, delay: R.delay.default, content: J ? P.content : { ...P.content, ...R.content } });
  }, dt = P.content[ue] ?? { subject: "", preheader: "", body: "", button_label: "", button_url: "" }, Bt = Object.values(P.content).map((S) => `${S.subject} ${S.preheader} ${S.body} ${S.button_label} ${S.button_url}`).join(" "), Ke = nn(Bt, Object.keys(l)), he = (S) => Pe[S], Be = (S, R, J, H) => {
    const pe = `content.${ue}.${S}`;
    return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1.5", children: [
      /* @__PURE__ */ e(v, { htmlFor: pe, children: R }),
      /* @__PURE__ */ e(
        s,
        {
          id: pe,
          value: dt[S],
          placeholder: J,
          "aria-invalid": he(pe) ? !0 : void 0,
          onFocus: (we) => {
            at.current = { part: S, el: we.target };
          },
          onChange: (we) => He(S, we.target.value)
        }
      ),
      H && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: H }),
      /* @__PURE__ */ e(ae, { message: he(pe) })
    ] });
  };
  return /* @__PURE__ */ n("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      X,
      {
        title: t.id ? t.name : d ? "New automation" : "New campaign",
        description: d ? "Sent by itself to each customer the trigger finds, while it is on." : "Sent once, to the customers who match the audience and accept marketing.",
        actions: /* @__PURE__ */ n(z, { children: [
          t.id && /* @__PURE__ */ e(O, { tone: cn[t.status] ?? "neutral", children: t.status }),
          t.id && d && /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
            /* @__PURE__ */ e(
              b,
              {
                checked: t.status === "active",
                disabled: Le,
                "aria-label": "Automation on",
                onCheckedChange: (S) => ie.post(N(`commerce/marketing/${t.id}/status`), { active: S }, { preserveScroll: !0 })
              }
            ),
            t.status === "active" ? "On" : "Off"
          ] }),
          t.id && t.sent_count > 0 && /* @__PURE__ */ e(h, { variant: "outline", asChild: !0, children: /* @__PURE__ */ e(E.Link, { href: N(`commerce/marketing/${t.id}`), children: "Results" }) }),
          /* @__PURE__ */ e(h, { variant: "outline", onClick: Et, children: "Send me a test" }),
          /* @__PURE__ */ e(h, { onClick: Lt, disabled: et, children: et ? "Saving…" : "Save" }),
          !d && /* @__PURE__ */ e(h, { variant: "default", disabled: !lt, title: lt ? void 0 : "Save first", onClick: () => Ee(!0), children: "Send…" })
        ] })
      }
    ),
    t.status === "scheduled" && t.scheduled_at && /* @__PURE__ */ n("div", { role: "status", className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2 cm:rounded-md cm:border cm:border-sky-500/30 cm:bg-sky-500/5 cm:px-4 cm:py-3 cm:text-sm", children: [
      /* @__PURE__ */ n("span", { children: [
        "Scheduled for ",
        new Date(t.scheduled_at).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" }),
        ". Changes you save go out with it."
      ] }),
      /* @__PURE__ */ e(h, { size: "sm", variant: "outline", onClick: () => ie.post(N(`commerce/marketing/${t.id}/unschedule`), {}, { preserveScroll: !0 }), children: "Back to draft" })
    ] }),
    Pe.campaign && /* @__PURE__ */ e("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-4 cm:py-3 cm:text-sm cm:text-destructive", children: Pe.campaign }),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]", children: [
      /* @__PURE__ */ n("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        m.length > 0 && /* @__PURE__ */ n(y, { children: [
          /* @__PURE__ */ n(o, { children: [
            /* @__PURE__ */ e(u, { children: "Start from" }),
            /* @__PURE__ */ e(C, { children: "A template fills in the audience and the texts. You can change everything." })
          ] }),
          /* @__PURE__ */ e(f, { className: "cm:grid cm:gap-2 cm:sm:grid-cols-2", children: m.map((S) => /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: () => It(S.key),
              className: "cm:rounded-md cm:border cm:p-3 cm:text-left cm:transition-colors cm:hover:bg-muted",
              children: [
                /* @__PURE__ */ e("span", { className: "cm:block cm:text-sm cm:font-medium", children: S.label }),
                /* @__PURE__ */ e("span", { className: "cm:block cm:text-xs cm:text-muted-foreground", children: S.description })
              ]
            },
            S.key
          )) })
        ] }),
        /* @__PURE__ */ n(y, { children: [
          /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(u, { children: "Details" }) }),
          /* @__PURE__ */ n(f, { className: "cm:grid cm:gap-4", children: [
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1.5", children: [
              /* @__PURE__ */ e(v, { htmlFor: "name", children: "Name" }),
              /* @__PURE__ */ e(
                s,
                {
                  id: "name",
                  value: P.name,
                  placeholder: d ? "Abandoned cart reminder" : "May newsletter",
                  onChange: (S) => xe("name", S.target.value)
                }
              ),
              /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: "Only staff see it." }),
              /* @__PURE__ */ e(ae, { message: he("name") })
            ] }),
            d && /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2", children: [
              /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1.5", children: [
                /* @__PURE__ */ e(v, { htmlFor: "trigger", children: "When" }),
                /* @__PURE__ */ n(j, { value: P.trigger, onValueChange: At, children: [
                  /* @__PURE__ */ e(ne, { id: "trigger", children: /* @__PURE__ */ e(ce, { placeholder: "Choose a trigger" }) }),
                  /* @__PURE__ */ e(M, { children: i.map((S) => /* @__PURE__ */ e(Y, { value: S.key, children: S.label }, S.key)) })
                ] }),
                Ue && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: Ue.description }),
                /* @__PURE__ */ e(ae, { message: he("trigger") })
              ] }),
              /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1.5", children: [
                /* @__PURE__ */ e(v, { htmlFor: "delay", children: Ue?.delay.label ?? "Delay" }),
                /* @__PURE__ */ e(
                  s,
                  {
                    id: "delay",
                    type: "number",
                    min: 0,
                    value: P.delay,
                    className: "cm:max-w-32",
                    onChange: (S) => xe("delay", S.target.value)
                  }
                ),
                /* @__PURE__ */ e(ae, { message: he("delay") })
              ] })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1.5", children: [
              /* @__PURE__ */ e(v, { htmlFor: "voucher_code", children: "Voucher code (optional)" }),
              /* @__PURE__ */ e(
                s,
                {
                  id: "voucher_code",
                  value: P.voucher_code,
                  className: "cm:max-w-60",
                  placeholder: "WELCOME10",
                  onChange: (S) => xe("voucher_code", S.target.value)
                }
              ),
              /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                "Shown where the text has ",
                "{voucher_code}",
                ". Create the voucher in Shop → Vouchers."
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ n(y, { children: [
          /* @__PURE__ */ n(o, { children: [
            /* @__PURE__ */ e(u, { children: "Audience" }),
            /* @__PURE__ */ e(C, { children: d ? "Optional: only customers who also match these rules get it." : `Customers who accept marketing (${g.toLocaleString()}), narrowed by these rules.` })
          ] }),
          /* @__PURE__ */ n(f, { className: "cm:grid cm:gap-3", children: [
            P.audience.rules.length > 1 && /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
              "Match",
              /* @__PURE__ */ n(j, { value: P.audience.match, onValueChange: (S) => Ae({ ...P.audience, match: S }), children: [
                /* @__PURE__ */ e(ne, { className: "cm:w-28", "aria-label": "Match", children: /* @__PURE__ */ e(ce, {}) }),
                /* @__PURE__ */ n(M, { children: [
                  /* @__PURE__ */ e(Y, { value: "all", children: "all rules" }),
                  /* @__PURE__ */ e(Y, { value: "any", children: "any rule" })
                ] })
              ] })
            ] }),
            P.audience.rules.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: d ? "No extra rules: everyone the trigger finds." : "No rules: everyone who accepts marketing." }),
            P.audience.rules.map((S, R) => {
              const J = a[S.rule];
              return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-2 cm:rounded-md cm:border cm:p-3 cm:sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] cm:sm:items-start", children: [
                /* @__PURE__ */ n(j, { value: S.rule, onValueChange: (H) => it(R, { rule: H }), children: [
                  /* @__PURE__ */ e(ne, { "aria-label": "Rule", children: /* @__PURE__ */ e(ce, { placeholder: "Choose a rule" }) }),
                  /* @__PURE__ */ e(M, { children: en(a).map(([H, pe]) => /* @__PURE__ */ n(F.Fragment, { children: [
                    /* @__PURE__ */ e("div", { className: "cm:px-2 cm:pt-2 cm:pb-1 cm:text-xs cm:font-medium cm:text-muted-foreground", children: H }),
                    pe.map(([we, zt]) => /* @__PURE__ */ e(Y, { value: we, children: zt.label }, we))
                  ] }, H)) })
                ] }),
                /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
                  /* @__PURE__ */ e(an, { def: J, value: S.value, currency: p, path: `audience.rules.${R}.value`, onChange: (H) => it(R, { value: H }) }),
                  /* @__PURE__ */ e(ae, { message: he(`audience.rules.${R}.value`) ?? he(`audience.rules.${R}.rule`) })
                ] }),
                /* @__PURE__ */ e(
                  h,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "sm",
                    "aria-label": "Remove rule",
                    onClick: () => Ae({ ...P.audience, rules: P.audience.rules.filter((H, pe) => pe !== R) }),
                    children: "Remove"
                  }
                )
              ] }, R);
            }),
            /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-3", children: [
              /* @__PURE__ */ e(
                h,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  onClick: () => Ae({ ...P.audience, rules: [...P.audience.rules, { rule: "no_order_for_days", value: ot(a.no_order_for_days) }] }),
                  children: "Add rule"
                }
              ),
              /* @__PURE__ */ e("p", { className: "cm:text-sm", "aria-live": "polite", children: d && P.audience.rules.length === 0 ? null : Ve(P.audience, a) ? Ft || se === null ? /* @__PURE__ */ e("span", { className: "cm:text-muted-foreground", children: "Counting…" }) : /* @__PURE__ */ n(z, { children: [
                /* @__PURE__ */ e("strong", { children: se.count.toLocaleString() }),
                " ",
                se.count === 1 ? "customer matches" : "customers match",
                d ? " these rules now" : ""
              ] }) : /* @__PURE__ */ e("span", { className: "cm:text-muted-foreground", children: "Fill in the rules to see who matches." }) })
            ] }),
            se && se.sample.length > 0 && Ve(P.audience, a) && !(d && P.audience.rules.length === 0) && /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
              "For example: ",
              se.sample.map((S) => S.name || S.email).join(", ")
            ] })
          ] })
        ] }),
        /* @__PURE__ */ n(y, { children: [
          /* @__PURE__ */ n(o, { children: [
            /* @__PURE__ */ e(u, { children: "Email" }),
            /* @__PURE__ */ n(C, { children: [
              "Each customer gets it in their language; empty parts use ",
              c.find((S) => S.code === r)?.name ?? r,
              "."
            ] })
          ] }),
          /* @__PURE__ */ n(f, { className: "cm:grid cm:gap-4", children: [
            /* @__PURE__ */ n(_, { value: ue, onValueChange: Dt, children: [
              c.length > 1 && /* @__PURE__ */ e(D, { children: c.map((S) => /* @__PURE__ */ n($, { value: S.code, children: [
                S.name,
                S.code === r ? " (main)" : ""
              ] }, S.code)) }),
              c.map((S) => /* @__PURE__ */ e(k, { value: S.code, className: "cm:grid cm:gap-4 cm:pt-2", children: S.code === ue && /* @__PURE__ */ n(z, { children: [
                Be("subject", "Subject", "Hi {first_name|there}, something new for you"),
                Be("preheader", "Preview text", "Shown after the subject in the inbox", "Optional. Most inboxes show it next to the subject."),
                /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-1.5", children: /* @__PURE__ */ e(
                  U,
                  {
                    fields: x,
                    values: { body: dt.body },
                    errors: Pe,
                    pathPrefix: `content.${ue}`,
                    onChange: (R) => He("body", String(R.body ?? ""))
                  }
                ) }),
                /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2", children: [
                  Be("button_label", "Button text", "Shop now", "Optional. Leave empty for no button."),
                  Be("button_url", "Button link", "{store_url}", "https://…, /a-page, or a smart tag like {cart_url}.")
                ] })
              ] }) }, S.code))
            ] }),
            Ke.length > 0 && /* @__PURE__ */ n("p", { role: "alert", className: "cm:text-sm cm:text-amber-700 cm:dark:text-amber-400", children: [
              "Unknown smart ",
              Ke.length === 1 ? "tag" : "tags",
              ": ",
              Ke.map((S) => `{${S}}`).join(", "),
              ". They will be sent as typed."
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ n(y, { children: [
          /* @__PURE__ */ n(o, { children: [
            /* @__PURE__ */ e(u, { children: "Smart tags" }),
            /* @__PURE__ */ n(C, { children: [
              "Replaced for each customer. Click one to put it in the subject, preview text or button you were editing (or to copy it for the text). Add a fallback after a bar: ",
              "{first_name|there}",
              "."
            ] })
          ] }),
          /* @__PURE__ */ e(f, { children: /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1", children: Object.entries(l).map(([S, R]) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onMouseDown: (J) => J.preventDefault(),
              onClick: () => Pt(S),
              className: "cm:flex cm:w-full cm:items-baseline cm:justify-between cm:gap-2 cm:rounded cm:px-2 cm:py-1 cm:text-left cm:hover:bg-muted",
              children: [
                /* @__PURE__ */ e("code", { className: "cm:text-xs", children: `{${S}}` }),
                /* @__PURE__ */ e("span", { className: "cm:text-xs cm:text-muted-foreground", children: R })
              ]
            }
          ) }, S)) }) })
        ] }),
        /* @__PURE__ */ n(y, { children: [
          /* @__PURE__ */ n(o, { children: [
            /* @__PURE__ */ e(u, { children: "Preview" }),
            /* @__PURE__ */ n(C, { children: [
              "With the first matching customer",
              de ? ` (${de.to})` : "",
              ", in the language you are editing."
            ] })
          ] }),
          /* @__PURE__ */ n(f, { className: "cm:grid cm:gap-3", children: [
            /* @__PURE__ */ e(h, { type: "button", variant: "outline", onClick: Ot, disabled: ct, children: ct ? "Rendering…" : de ? "Refresh preview" : "Show preview" }),
            de && /* @__PURE__ */ n(z, { children: [
              /* @__PURE__ */ n("p", { className: "cm:text-sm", children: [
                /* @__PURE__ */ e("span", { className: "cm:text-muted-foreground", children: "Subject:" }),
                " ",
                de.subject
              ] }),
              /* @__PURE__ */ e(
                "a",
                {
                  className: "cm:text-xs cm:underline cm:text-muted-foreground",
                  target: "_blank",
                  rel: "noreferrer",
                  href: Oe ?? void 0,
                  children: "Open full size"
                }
              ),
              /* @__PURE__ */ e("iframe", { title: "Email preview", srcDoc: de.html, sandbox: "", className: "cm:h-[32rem] cm:w-full cm:rounded-md cm:border cm:bg-white" })
            ] })
          ] })
        ] }),
        t.id && /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-wrap cm:gap-2", children: [
          /* @__PURE__ */ e(h, { type: "button", variant: "ghost", size: "sm", onClick: () => ie.post(N(`commerce/marketing/${t.id}/duplicate`)), children: "Duplicate" }),
          /* @__PURE__ */ e(
            h,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              className: "cm:text-destructive",
              onClick: () => window.confirm(`Delete "${t.name}"? Its results go too.`) && ie.delete(N(`commerce/marketing/${t.id}`)),
              children: "Delete"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e(w, { open: jt, onOpenChange: Ee, children: /* @__PURE__ */ n(I, { children: [
      /* @__PURE__ */ n(A, { children: [
        /* @__PURE__ */ n(Q, { children: [
          'Send "',
          t.name,
          '"'
        ] }),
        /* @__PURE__ */ n(T, { children: [
          se ? `${se.count.toLocaleString()} ${se.count === 1 ? "customer" : "customers"} match now.` : "",
          " The audience is counted again when sending starts; each customer gets it once."
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1.5", children: [
        /* @__PURE__ */ e(v, { htmlFor: "send_at", children: "Send at (optional)" }),
        /* @__PURE__ */ e(s, { id: "send_at", type: "datetime-local", value: Ie, onChange: (S) => qt(S.target.value) }),
        /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: "Empty: now. Emails go out in the background, in batches." }),
        /* @__PURE__ */ e(ae, { message: he("at") })
      ] }),
      /* @__PURE__ */ n(V, { children: [
        /* @__PURE__ */ e(h, { variant: "outline", onClick: () => Ee(!1), children: "Not yet" }),
        /* @__PURE__ */ e(h, { onClick: () => ie.post(N(`commerce/marketing/${t.id}/send`), Ie ? { at: new Date(Ie).toISOString() } : {}, {
          preserveScroll: !0,
          onSuccess: () => Ee(!1)
        }), children: Ie ? "Schedule" : "Send now" })
      ] })
    ] }) })
  ] });
}
function an({ def: t, value: c, currency: r, path: a, onChange: l }) {
  const { Input: i, Select: m, SelectContent: g, SelectItem: x, SelectTrigger: p, SelectValue: y } = L;
  if (!t || t.input === "none") return /* @__PURE__ */ e("span", { className: "cm:self-center cm:text-sm cm:text-muted-foreground", children: "—" });
  if (t.input === "select")
    return /* @__PURE__ */ n(m, { value: String(c ?? ""), onValueChange: l, children: [
      /* @__PURE__ */ e(p, { "aria-label": t.label, children: /* @__PURE__ */ e(y, { placeholder: "Choose" }) }),
      /* @__PURE__ */ e(g, { children: (t.options ?? []).map((o) => /* @__PURE__ */ e(x, { value: o.value, children: o.label }, o.value)) })
    ] });
  if (t.input === "products" || t.input === "categories") {
    const o = { handle: a, type: "commerce_targets", config: { api: N("commerce/api/targets"), types: t.input === "products" ? ["product"] : ["term"] } }, u = (Array.isArray(c) ? c : []).map((C) => ({ ...C, type: t.input === "products" ? "product" : "term" }));
    return /* @__PURE__ */ e(Nt, { field: o, value: u, pathPrefix: a, onChange: (C) => l((C ?? []).map((h) => ({ id: h.id, label: h.label }))) });
  }
  const f = t.input === "days" || t.input === "number" || t.input === "money";
  return /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
    t.input === "money" && /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: r }),
    /* @__PURE__ */ e(
      i,
      {
        "aria-label": t.label,
        type: f ? "number" : "text",
        min: f ? 0 : void 0,
        value: String(c ?? ""),
        onChange: (o) => l(f && o.target.value !== "" ? Number(o.target.value) : o.target.value)
      }
    ),
    t.input === "days" && /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: "days" })
  ] });
}
const Qe = (t) => `${t.toLocaleString()} ${t === 1 ? "person" : "people"}`, je = (t) => t ? new Date(t).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" }) : "—", ut = { sent: "ok", queued: "info", sending: "info", failed: "error", skipped: "neutral", active: "ok", paused: "warning", cancelled: "error", scheduled: "info" };
function ln({ campaign: t, stats: c, links: r, recipients: a }) {
  const { Card: l, CardContent: i, CardHeader: m, CardTitle: g, CardDescription: x, Button: p, Table: y, TableBody: f, TableCell: o, TableHead: u, TableHeader: C, TableRow: h } = L, { router: s, Link: v } = E, b = t.type === "automation";
  return G(), W.useBreadcrumbs([
    { label: "Shop", href: N("commerce") },
    { label: "Marketing", href: N("commerce/marketing") },
    { label: b ? "Automations" : "Campaigns", href: N(b ? "commerce/marketing/automations" : "commerce/marketing/campaigns") },
    { label: t.name }
  ]), F.useEffect(() => {
    if (c.queued === 0 && t.status !== "sending") return;
    const _ = setInterval(() => s.reload({ only: ["campaign", "stats", "links", "recipients"] }), 5e3);
    return () => clearInterval(_);
  }, [c.queued, t.status]), /* @__PURE__ */ n("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      X,
      {
        title: t.name,
        description: /* @__PURE__ */ n(z, { children: [
          "Subject: ",
          t.subject,
          t.trigger ? ` · ${t.trigger}` : "",
          t.started_at ? ` · started ${je(t.started_at)}` : "",
          t.finished_at ? `, finished ${je(t.finished_at)}` : ""
        ] }),
        actions: /* @__PURE__ */ n(z, { children: [
          /* @__PURE__ */ e(O, { tone: ut[t.status] ?? "neutral", children: t.status }),
          t.status === "sending" && /* @__PURE__ */ e(p, { variant: "outline", onClick: () => window.confirm("Stop sending? Emails not yet sent won't go out.") && s.post(N(`commerce/marketing/${t.id}/cancel`), {}, { preserveScroll: !0 }), children: "Stop sending" }),
          t.editable && /* @__PURE__ */ e(p, { variant: "outline", asChild: !0, children: /* @__PURE__ */ e(v, { href: N(`commerce/marketing/${t.id}/edit`), children: "Edit" }) }),
          /* @__PURE__ */ e(p, { variant: "outline", onClick: () => s.post(N(`commerce/marketing/${t.id}/duplicate`)), children: "Duplicate" })
        ] })
      }
    ),
    t.status === "sending" && c.recipients === 0 && /* @__PURE__ */ e("p", { role: "status", className: "cm:rounded-md cm:border cm:border-sky-500/30 cm:bg-sky-500/5 cm:px-4 cm:py-3 cm:text-sm", children: "Finding the recipients. The queue worker does this in the background (php artisan queue:work)." }),
    c.queued > 0 && /* @__PURE__ */ n("p", { role: "status", className: "cm:rounded-md cm:border cm:border-sky-500/30 cm:bg-sky-500/5 cm:px-4 cm:py-3 cm:text-sm", children: [
      c.queued.toLocaleString(),
      " ",
      c.queued === 1 ? "email is" : "emails are",
      " waiting to be sent by the queue worker."
    ] }),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2 cm:lg:grid-cols-5", children: [
      /* @__PURE__ */ e(fe, { kpi: { key: "sent", label: "Sent", value: c.sent.toLocaleString(), hint: c.failed > 0 ? `${c.failed} failed` : `of ${c.recipients.toLocaleString()} recipients` } }),
      /* @__PURE__ */ e(fe, { kpi: { key: "opened", label: "Opened", value: ze(c.opened, c.sent), hint: Qe(c.opened) } }),
      /* @__PURE__ */ e(fe, { kpi: { key: "clicked", label: "Clicked", value: ze(c.clicked, c.sent), hint: Qe(c.clicked) } }),
      /* @__PURE__ */ e(fe, { kpi: { key: "ctor", label: "Clicked after opening", value: ze(c.clicked, c.opened), hint: "Of those who opened" } }),
      /* @__PURE__ */ e(fe, { kpi: { key: "unsubscribed", label: "Unsubscribed", value: ze(c.unsubscribed, c.sent), hint: Qe(c.unsubscribed) } })
    ] }),
    /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: "Opens are counted when the email's images load, so they are approximate: some inboxes load images for everyone, others never. A click also counts as an open." }),
    /* @__PURE__ */ n(l, { children: [
      /* @__PURE__ */ n(m, { children: [
        /* @__PURE__ */ e(g, { children: "Links" }),
        /* @__PURE__ */ e(x, { children: "Clicks on each link in the email." })
      ] }),
      /* @__PURE__ */ e(i, { className: "cm:p-0", children: r.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:px-6 cm:pb-6 cm:text-sm cm:text-muted-foreground", children: "No clicks yet." }) : /* @__PURE__ */ n(y, { children: [
        /* @__PURE__ */ e(C, { children: /* @__PURE__ */ n(h, { children: [
          /* @__PURE__ */ e(u, { children: "Link" }),
          /* @__PURE__ */ e(u, { className: "cm:text-right", children: "People" }),
          /* @__PURE__ */ e(u, { className: "cm:text-right", children: "Clicks" })
        ] }) }),
        /* @__PURE__ */ e(f, { children: r.map((_) => /* @__PURE__ */ n(h, { children: [
          /* @__PURE__ */ e(o, { className: "cm:max-w-md cm:truncate", children: /* @__PURE__ */ e("a", { href: _.url, target: "_blank", rel: "noreferrer", className: "cm:hover:underline", children: _.url }) }),
          /* @__PURE__ */ e(o, { className: "cm:text-right cm:tabular-nums", children: _.unique_clicks }),
          /* @__PURE__ */ e(o, { className: "cm:text-right cm:tabular-nums", children: _.clicks })
        ] }, _.url)) })
      ] }) })
    ] }),
    /* @__PURE__ */ n(l, { children: [
      /* @__PURE__ */ n(m, { children: [
        /* @__PURE__ */ e(g, { children: "Latest recipients" }),
        /* @__PURE__ */ e(x, { children: "The 50 most recent." })
      ] }),
      /* @__PURE__ */ e(i, { className: "cm:p-0", children: a.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:px-6 cm:pb-6 cm:text-sm cm:text-muted-foreground", children: "Nobody yet." }) : /* @__PURE__ */ n(y, { children: [
        /* @__PURE__ */ e(C, { children: /* @__PURE__ */ n(h, { children: [
          /* @__PURE__ */ e(u, { children: "Email" }),
          /* @__PURE__ */ e(u, { children: "Status" }),
          /* @__PURE__ */ e(u, { children: "Sent" }),
          /* @__PURE__ */ e(u, { children: "Opened" }),
          /* @__PURE__ */ e(u, { children: "Clicked" })
        ] }) }),
        /* @__PURE__ */ e(f, { children: a.map((_) => /* @__PURE__ */ n(h, { children: [
          /* @__PURE__ */ n(o, { children: [
            _.email,
            _.unsubscribed && /* @__PURE__ */ n(z, { children: [
              " ",
              /* @__PURE__ */ e(O, { tone: "warning", children: "unsubscribed" })
            ] })
          ] }),
          /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e("span", { title: _.error ?? void 0, children: /* @__PURE__ */ e(O, { tone: ut[_.status] ?? "neutral", children: _.status }) }) }),
          /* @__PURE__ */ e(o, { className: "cm:whitespace-nowrap", children: je(_.sent_at) }),
          /* @__PURE__ */ e(o, { className: "cm:whitespace-nowrap", children: je(_.opened_at) }),
          /* @__PURE__ */ e(o, { className: "cm:whitespace-nowrap", children: je(_.clicked_at) })
        ] }, `${_.email}-${_.sent_at}`)) })
      ] }) })
    ] })
  ] });
}
function _e({
  value: t,
  onChange: c,
  id: r,
  placeholder: a,
  allowNull: l = !0,
  invalid: i
}) {
  const { Input: m } = L, g = (o) => o == null ? "" : me(o).replace(/^[^\d-]+|[^\d]+$/g, ""), [x, p] = F.useState(g(t)), [y, f] = F.useState(!1);
  return F.useEffect(() => {
    y || p(g(t));
  }, [t, y]), /* @__PURE__ */ e(
    m,
    {
      id: r,
      inputMode: "decimal",
      value: x,
      placeholder: a,
      "aria-invalid": i || void 0,
      onFocus: () => f(!0),
      onChange: (o) => {
        p(o.target.value);
        const u = o.target.value.trim() === "" ? l ? null : 0 : yt(o.target.value);
        (u !== null || o.target.value.trim() === "") && c(u);
      },
      onBlur: () => {
        f(!1), p(g(t));
      }
    }
  );
}
const ht = [
  { key: "province_code", label: "Province" },
  { key: "city_code", label: "City / regency" },
  { key: "district_code", label: "District" },
  { key: "village_code", label: "Village" }
], sn = { province: 1, city: 2, district: 3, village: 4 }, Me = /* @__PURE__ */ new Map();
function dn(t, c) {
  const r = c ? `${t}?parent=${encodeURIComponent(c)}` : t;
  return Me.has(r) || Me.set(r, te(r).then((a) => a.data).catch(() => (Me.delete(r), []))), Me.get(r);
}
const pt = "cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm cm:disabled:opacity-50";
function _t({ field: t, value: c, onChange: r, pathPrefix: a }) {
  const { Label: l } = L, i = t.config ?? {}, m = String(i.api ?? ""), g = sn[i.depth ?? "district"] ?? 3, x = i.country_options ?? [], p = { country: "ID", province_code: null, city_code: null, district_code: null, village_code: null, ...c ?? {} }, y = ht.slice(0, g), [f, o] = F.useState({}), u = [null, p.province_code, p.city_code, p.district_code];
  F.useEffect(() => {
    p.country !== "ID" || !m || y.forEach((h, s) => {
      const v = u[s];
      s > 0 && !v || dn(m, v).then((b) => o((_) => ({ ..._, [h.key]: b })));
    });
  }, [m, p.country, p.province_code, p.city_code, p.district_code]);
  const C = (h, s) => {
    const v = { ...p };
    v[y[h].key] = s || null, ht.slice(h + 1).forEach((b) => {
      v[b.key] = null;
    }), r(v);
  };
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    x.length > 0 && /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(l, { htmlFor: `${a}-country`, children: "Country" }),
      /* @__PURE__ */ e(
        "select",
        {
          id: `${a}-country`,
          className: pt,
          value: p.country,
          onChange: (h) => r({ country: h.target.value, province_code: null, city_code: null, district_code: null, village_code: null }),
          children: x.map((h) => /* @__PURE__ */ e("option", { value: h.value, children: h.label }, h.value))
        }
      )
    ] }),
    p.country === "ID" && y.map((h, s) => /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(l, { htmlFor: `${a}-${h.key}`, children: h.label }),
      /* @__PURE__ */ n(
        "select",
        {
          id: `${a}-${h.key}`,
          className: pt,
          value: p[h.key] ?? "",
          disabled: s > 0 && !u[s],
          onChange: (v) => C(s, v.target.value),
          children: [
            /* @__PURE__ */ e("option", { value: "", children: "Choose…" }),
            (f[h.key] ?? []).map((v) => /* @__PURE__ */ e("option", { value: v.code, children: v.name }, v.code))
          ]
        }
      )
    ] }, h.key))
  ] });
}
function mn({ mode: t, order: c, paymentMethods: r, canOverride: a, variantsUrl: l, previewUrl: i, submitUrl: m }) {
  const { Card: g, CardContent: x, CardHeader: p, CardTitle: y, Button: f, Input: o, Label: u, Checkbox: C, Textarea: h } = L;
  G(), W.useBreadcrumbs([
    { label: "Shop", href: N("commerce") },
    { label: "Orders", href: N("commerce/orders") },
    ...c ? [{ label: c.number, href: N(`commerce/orders/${c.id}`) }] : [],
    { label: t === "create" ? "New order" : t === "quote" ? "Quote" : "Edit items" }
  ]);
  const s = E.useForm({
    email: "",
    name: "",
    phone: "",
    lines: c?.lines ?? [],
    shipping: c?.shipping ?? { label: "", cost: 0 },
    discount: c?.discount ?? { label: "", amount: 0 },
    shipping_address: { name: "", phone: "", country: "ID", province_code: null, city_code: null, district_code: null, village_code: null, line1: "", line2: "", postal_code: "" },
    payment_status: "unpaid",
    payment_method: r[0]?.value ?? "",
    reference: "",
    note: "",
    send_link: !1,
    notify: !1,
    valid_until: c?.valid_until ?? "",
    send: !0
  }), v = s.errors, [b, _] = F.useState(""), [D, $] = F.useState([]), [k, j] = F.useState(null);
  F.useEffect(() => {
    if (b.trim().length < 2) {
      $([]);
      return;
    }
    const w = setTimeout(() => te(`${N(l)}&q=${encodeURIComponent(b)}`).then((I) => $(I.data)).catch(() => $([])), 250);
    return () => clearTimeout(w);
  }, [b]), F.useEffect(() => {
    if (s.data.lines.length === 0) {
      j(null);
      return;
    }
    const w = setTimeout(() => {
      te(N(i), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        lines: s.data.lines.map(({ item_id: I, variant_id: A, quantity: Q, unit_price: T }) => ({ item_id: I, variant_id: A, quantity: Q, unit_price: T })),
        shipping: s.data.shipping,
        discount: s.data.discount,
        shipping_address: t === "create" ? s.data.shipping_address : void 0
      }) }).then(j).catch(() => j(null));
    }, 300);
    return () => clearTimeout(w);
  }, [JSON.stringify([s.data.lines, s.data.shipping, s.data.discount, s.data.shipping_address])]);
  const M = (w) => {
    const I = s.data.lines.findIndex((A) => A.variant_id === w.id && !A.item_id);
    s.setData("lines", I >= 0 ? s.data.lines.map((A, Q) => Q === I ? { ...A, quantity: A.quantity + 1 } : A) : [...s.data.lines, { variant_id: w.id, label: w.label, sku: w.sku, quantity: 1, price: w.price, unit_price: null }]), _(""), $([]);
  }, Y = (w, I) => s.setData("lines", s.data.lines.map((A, Q) => Q === w ? { ...A, ...I } : A)), ne = (w) => {
    w.preventDefault(), s.transform((I) => ({ ...I, lines: I.lines.map(({ item_id: A, variant_id: Q, quantity: T, unit_price: V }) => ({ item_id: A, variant_id: Q, quantity: T, unit_price: V })) })), t === "create" ? s.post(N(m)) : s.put(N(m));
  }, ce = (w) => k?.lines.find((I) => I.variant_id === w);
  return /* @__PURE__ */ n("form", { onSubmit: ne, className: "cm:mx-auto cm:grid cm:w-full cm:max-w-5xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      X,
      {
        title: t === "create" ? "New order" : t === "quote" ? `Quote ${c?.number}` : `Edit ${c?.number}`,
        description: t === "edit" ? "Existing lines keep their price; new lines use today's price. The stock difference is reserved or given back." : t === "quote" ? `For ${c?.customer}. Set the prices, shipping and discount, then send it.` : "An order for a customer, from a chat or a call."
      }
    ),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[2fr_1fr]", children: [
      /* @__PURE__ */ n("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ n(g, { children: [
          /* @__PURE__ */ e(p, { children: /* @__PURE__ */ e(y, { children: "Products" }) }),
          /* @__PURE__ */ n(x, { className: "cm:grid cm:gap-3", children: [
            /* @__PURE__ */ n("div", { className: "cm:relative", children: [
              /* @__PURE__ */ e(o, { placeholder: "Search products by name or SKU…", value: b, onChange: (w) => _(w.target.value), "aria-label": "Search products" }),
              D.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-10 cm:mt-1 cm:max-h-64 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: D.map((w) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ e("button", { type: "button", className: "cm:flex cm:w-full cm:justify-between cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted", onClick: () => M(w), children: /* @__PURE__ */ n("span", { children: [
                w.label,
                w.sku ? /* @__PURE__ */ n("span", { className: "cm:text-muted-foreground", children: [
                  " · ",
                  w.sku
                ] }) : null
              ] }) }) }, w.id)) })
            ] }),
            v.lines && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-destructive", children: v.lines }),
            s.data.lines.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No products yet." }) : /* @__PURE__ */ e("ul", { className: "cm:divide-y cm:divide-border", children: s.data.lines.map((w, I) => /* @__PURE__ */ n("li", { className: "cm:grid cm:items-center cm:gap-2 cm:py-2 cm:sm:grid-cols-[1fr_5rem_9rem_7rem_auto]", children: [
              /* @__PURE__ */ n("div", { className: "cm:min-w-0 cm:text-sm", children: [
                /* @__PURE__ */ e("p", { className: "cm:font-medium", children: w.label }),
                w.sku && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: w.sku })
              ] }),
              /* @__PURE__ */ e(o, { type: "number", min: 1, "aria-label": "Quantity", value: w.quantity, onChange: (A) => Y(I, { quantity: Math.max(1, Number(A.target.value)) }) }),
              a ? /* @__PURE__ */ e(_e, { value: w.unit_price, placeholder: ce(w.variant_id)?.unit_price_formatted ?? "", onChange: (A) => Y(I, { unit_price: A }) }) : /* @__PURE__ */ e("span", { className: "cm:text-sm", children: ce(w.variant_id)?.unit_price_formatted ?? "…" }),
              /* @__PURE__ */ e("span", { className: "cm:text-sm cm:font-medium cm:sm:text-right", children: ce(w.variant_id)?.total ?? "" }),
              /* @__PURE__ */ e(f, { type: "button", variant: "ghost", size: "sm", "aria-label": "Remove", onClick: () => s.setData("lines", s.data.lines.filter((A, Q) => Q !== I)), children: "×" })
            ] }, `${w.item_id ?? "n"}-${w.variant_id}-${I}`)) }),
            k?.notices.map((w, I) => /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-amber-700", children: w }, I))
          ] })
        ] }),
        t === "create" && /* @__PURE__ */ n(g, { children: [
          /* @__PURE__ */ e(p, { children: /* @__PURE__ */ e(y, { children: "Customer" }) }),
          /* @__PURE__ */ n(x, { className: "cm:grid cm:gap-3 cm:sm:grid-cols-3", children: [
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(u, { htmlFor: "m-email", children: "Email *" }),
              /* @__PURE__ */ e(o, { id: "m-email", type: "email", value: s.data.email, onChange: (w) => s.setData("email", w.target.value) }),
              v.email && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-destructive", children: v.email })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(u, { htmlFor: "m-name", children: "Name" }),
              /* @__PURE__ */ e(o, { id: "m-name", value: s.data.name, onChange: (w) => s.setData("name", w.target.value) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(u, { htmlFor: "m-phone", children: "Phone" }),
              /* @__PURE__ */ e(o, { id: "m-phone", value: s.data.phone, onChange: (w) => s.setData("phone", w.target.value) })
            ] })
          ] })
        ] }),
        t === "create" && (k?.needs_shipping ?? !0) && /* @__PURE__ */ n(g, { children: [
          /* @__PURE__ */ e(p, { children: /* @__PURE__ */ e(y, { children: "Shipping address" }) }),
          /* @__PURE__ */ n(x, { className: "cm:grid cm:gap-3", children: [
            /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: ["name", "phone"].map((w) => /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(u, { htmlFor: `a-${w}`, children: w === "name" ? "Recipient" : "Phone" }),
              /* @__PURE__ */ e(o, { id: `a-${w}`, value: String(s.data.shipping_address[w] ?? ""), onChange: (I) => s.setData("shipping_address", { ...s.data.shipping_address, [w]: I.target.value }) })
            ] }, w)) }),
            /* @__PURE__ */ e(
              _t,
              {
                field: { handle: "region", type: "commerce_region", label: "Region", config: { depth: "village" } },
                pathPrefix: "shipping_address",
                value: s.data.shipping_address,
                onChange: (w) => s.setData("shipping_address", { ...s.data.shipping_address, ...w ?? {} })
              }
            ),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(u, { htmlFor: "a-line1", children: "Street address" }),
              /* @__PURE__ */ e(o, { id: "a-line1", value: String(s.data.shipping_address.line1 ?? ""), onChange: (w) => s.setData("shipping_address", { ...s.data.shipping_address, line1: w.target.value }) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1 cm:sm:w-48", children: [
              /* @__PURE__ */ e(u, { htmlFor: "a-postal", children: "Postal code" }),
              /* @__PURE__ */ e(o, { id: "a-postal", value: String(s.data.shipping_address.postal_code ?? ""), onChange: (w) => s.setData("shipping_address", { ...s.data.shipping_address, postal_code: w.target.value }) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ n(g, { children: [
          /* @__PURE__ */ e(p, { children: /* @__PURE__ */ e(y, { children: "Shipping and discount" }) }),
          /* @__PURE__ */ n(x, { className: "cm:grid cm:gap-3", children: [
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(u, { htmlFor: "s-label", children: "Shipping method" }),
              /* @__PURE__ */ e(o, { id: "s-label", placeholder: "JNE REG", value: s.data.shipping.label, onChange: (w) => s.setData("shipping", { ...s.data.shipping, label: w.target.value }) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(u, { htmlFor: "s-cost", children: "Shipping cost" }),
              /* @__PURE__ */ e(_e, { id: "s-cost", allowNull: !1, value: s.data.shipping.cost, onChange: (w) => s.setData("shipping", { ...s.data.shipping, cost: w ?? 0 }) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(u, { htmlFor: "d-label", children: "Discount label" }),
              /* @__PURE__ */ e(o, { id: "d-label", value: s.data.discount.label, onChange: (w) => s.setData("discount", { ...s.data.discount, label: w.target.value }) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(u, { htmlFor: "d-amount", children: "Discount" }),
              /* @__PURE__ */ e(_e, { id: "d-amount", allowNull: !1, value: s.data.discount.amount, onChange: (w) => s.setData("discount", { ...s.data.discount, amount: w ?? 0 }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ n(g, { children: [
          /* @__PURE__ */ e(p, { children: /* @__PURE__ */ e(y, { children: "Total" }) }),
          /* @__PURE__ */ e(x, { className: "cm:grid cm:gap-1 cm:text-sm", children: k ? /* @__PURE__ */ n(z, { children: [
            /* @__PURE__ */ n("p", { className: "cm:flex cm:justify-between", children: [
              /* @__PURE__ */ e("span", { children: "Subtotal" }),
              /* @__PURE__ */ e("span", { children: k.totals.subtotal })
            ] }),
            /* @__PURE__ */ n("p", { className: "cm:flex cm:justify-between", children: [
              /* @__PURE__ */ e("span", { children: "Discount" }),
              /* @__PURE__ */ n("span", { children: [
                "−",
                k.totals.discount
              ] })
            ] }),
            /* @__PURE__ */ n("p", { className: "cm:flex cm:justify-between", children: [
              /* @__PURE__ */ e("span", { children: "Shipping" }),
              /* @__PURE__ */ e("span", { children: k.totals.shipping })
            ] }),
            /* @__PURE__ */ n("p", { className: "cm:flex cm:justify-between cm:text-base cm:font-semibold", children: [
              /* @__PURE__ */ e("span", { children: "Total" }),
              /* @__PURE__ */ e("span", { children: k.totals.total })
            ] })
          ] }) : /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "Add products to see the total." }) })
        ] }),
        t === "create" && /* @__PURE__ */ n(g, { children: [
          /* @__PURE__ */ e(p, { children: /* @__PURE__ */ e(y, { children: "Payment" }) }),
          /* @__PURE__ */ n(x, { className: "cm:grid cm:gap-3 cm:text-sm", children: [
            ["unpaid", "paid"].map((w) => /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e("input", { type: "radio", name: "payment_status", checked: s.data.payment_status === w, onChange: () => s.setData("payment_status", w) }),
              w === "unpaid" ? "Unpaid: the customer pays later" : "Paid already"
            ] }, w)),
            r.length > 0 && /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(u, { htmlFor: "p-method", children: "Method" }),
              /* @__PURE__ */ n("select", { id: "p-method", className: "cm:h-9 cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3", value: s.data.payment_method, onChange: (w) => s.setData("payment_method", w.target.value), children: [
                /* @__PURE__ */ e("option", { value: "", children: "—" }),
                r.map((w) => /* @__PURE__ */ e("option", { value: w.value, children: w.label }, w.value))
              ] })
            ] }),
            s.data.payment_status === "paid" ? /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(u, { htmlFor: "p-ref", children: "Reference" }),
              /* @__PURE__ */ e(o, { id: "p-ref", value: s.data.reference, onChange: (w) => s.setData("reference", w.target.value) })
            ] }) : /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e(C, { checked: s.data.send_link, onCheckedChange: (w) => s.setData("send_link", w === !0) }),
              " Email the customer the link to pay"
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(u, { htmlFor: "m-note", children: "Internal note" }),
              /* @__PURE__ */ e(h, { id: "m-note", value: s.data.note, onChange: (w) => s.setData("note", w.target.value) })
            ] })
          ] })
        ] }),
        t === "quote" && /* @__PURE__ */ n(g, { children: [
          /* @__PURE__ */ e(p, { children: /* @__PURE__ */ e(y, { children: "Validity" }) }),
          /* @__PURE__ */ n(x, { className: "cm:grid cm:gap-3 cm:text-sm", children: [
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(u, { htmlFor: "q-valid", children: "Valid until" }),
              /* @__PURE__ */ e(o, { id: "q-valid", type: "date", value: s.data.valid_until, onChange: (w) => s.setData("valid_until", w.target.value) }),
              v.valid_until && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-destructive", children: v.valid_until })
            ] }),
            /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e(C, { checked: s.data.send, onCheckedChange: (w) => s.setData("send", w === !0) }),
              " Send it to the customer now"
            ] })
          ] })
        ] }),
        t === "edit" && /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
          /* @__PURE__ */ e(C, { checked: s.data.notify, onCheckedChange: (w) => s.setData("notify", w === !0) }),
          " Tell the customer about the change"
        ] }),
        /* @__PURE__ */ e(f, { type: "submit", disabled: s.processing || s.data.lines.length === 0, children: t === "create" ? "Create order" : t === "quote" ? s.data.send ? "Send quote" : "Save quote" : "Save changes" })
      ] })
    ] })
  ] });
}
function on({ order: t, couriers: c, onClose: r }) {
  const { Dialog: a, DialogContent: l, DialogFooter: i, DialogHeader: m, DialogTitle: g, Button: x, Input: p, Label: y } = L, f = t.items.filter((h) => h.unfulfilled > 0), o = E.useForm({
    courier: c[0]?.key ?? "",
    courier_name: "",
    service: "",
    tracking_number: "",
    items: f.map((h) => ({ order_item_id: h.id, quantity: h.unfulfilled }))
  }), u = o.errors;
  return /* @__PURE__ */ e(a, { open: !0, onOpenChange: (h) => !h && r(), children: /* @__PURE__ */ n(l, { children: [
    /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(g, { children: "Add a shipment" }) }),
    /* @__PURE__ */ n("form", { className: "cm:grid cm:gap-3", onSubmit: (h) => {
      h.preventDefault(), o.post(N(`commerce/orders/${t.id}/shipments`), { preserveScroll: !0, onSuccess: r });
    }, children: [
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(y, { htmlFor: "s-courier", children: "Courier" }),
        /* @__PURE__ */ n("select", { id: "s-courier", className: "cm:h-9 cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm", value: o.data.courier, onChange: (h) => o.setData("courier", h.target.value), children: [
          c.map((h) => /* @__PURE__ */ e("option", { value: h.key, children: h.name }, h.key)),
          /* @__PURE__ */ e("option", { value: "", children: "Other…" })
        ] })
      ] }),
      o.data.courier === "" && /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(y, { htmlFor: "s-name", children: "Courier name" }),
        /* @__PURE__ */ e(p, { id: "s-name", value: o.data.courier_name, onChange: (h) => o.setData("courier_name", h.target.value) })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(y, { htmlFor: "s-service", children: "Service" }),
        /* @__PURE__ */ e(p, { id: "s-service", placeholder: "REG, YES…", value: o.data.service, onChange: (h) => o.setData("service", h.target.value) })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(y, { htmlFor: "s-tracking", children: "Tracking number" }),
        /* @__PURE__ */ e(p, { id: "s-tracking", value: o.data.tracking_number, onChange: (h) => o.setData("tracking_number", h.target.value) })
      ] }),
      /* @__PURE__ */ n("fieldset", { className: "cm:grid cm:gap-2", children: [
        /* @__PURE__ */ e("legend", { className: "cm:mb-1 cm:text-sm cm:font-medium", children: "In this parcel" }),
        f.map((h, s) => /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:text-sm", children: [
          /* @__PURE__ */ n("span", { children: [
            h.name,
            h.variant_title ? ` · ${h.variant_title}` : "",
            " ",
            /* @__PURE__ */ n("span", { className: "cm:text-muted-foreground", children: [
              "(",
              h.unfulfilled,
              " left)"
            ] })
          ] }),
          /* @__PURE__ */ e(
            p,
            {
              type: "number",
              min: 0,
              max: h.unfulfilled,
              className: "cm:w-20",
              value: o.data.items[s].quantity,
              onChange: (v) => o.setData("items", o.data.items.map((b, _) => _ === s ? { ...b, quantity: Number(v.target.value) } : b))
            }
          )
        ] }, h.id)),
        u.items && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-destructive", children: u.items })
      ] }),
      /* @__PURE__ */ n(i, { children: [
        /* @__PURE__ */ e(x, { type: "button", variant: "outline", onClick: r, children: "Cancel" }),
        /* @__PURE__ */ e(x, { type: "submit", disabled: o.processing, children: "Save shipment" })
      ] })
    ] })
  ] }) });
}
function un({ order: t, onClose: c }) {
  const { Dialog: r, DialogContent: a, DialogFooter: l, DialogHeader: i, DialogTitle: m, DialogDescription: g, Button: x, Input: p, Label: y, Checkbox: f } = L, o = E.useForm({
    amount: t.totals.refundable,
    reason: "",
    restock: !1,
    items: t.items.map((C) => ({ order_item_id: C.id, quantity: 0 }))
  }), u = o.errors;
  return /* @__PURE__ */ e(r, { open: !0, onOpenChange: (C) => !C && c(), children: /* @__PURE__ */ n(a, { children: [
    /* @__PURE__ */ n(i, { children: [
      /* @__PURE__ */ e(m, { children: "Refund" }),
      /* @__PURE__ */ e(g, { children: "Record money you returned to the customer." })
    ] }),
    /* @__PURE__ */ n("form", { className: "cm:grid cm:gap-3", onSubmit: (C) => {
      C.preventDefault(), o.post(N(`commerce/orders/${t.id}/refunds`), { preserveScroll: !0, onSuccess: c });
    }, children: [
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(y, { htmlFor: "r-amount", children: "Amount" }),
        /* @__PURE__ */ e(_e, { id: "r-amount", value: o.data.amount, onChange: (C) => o.setData("amount", C) }),
        u.amount && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-destructive", children: u.amount })
      ] }),
      /* @__PURE__ */ n("fieldset", { className: "cm:grid cm:gap-2", children: [
        /* @__PURE__ */ e("legend", { className: "cm:mb-1 cm:text-sm cm:font-medium", children: "Items returned (optional)" }),
        t.items.map((C, h) => /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:text-sm", children: [
          /* @__PURE__ */ n("span", { children: [
            C.name,
            C.variant_title ? ` · ${C.variant_title}` : ""
          ] }),
          /* @__PURE__ */ e(
            p,
            {
              type: "number",
              min: 0,
              max: C.quantity - C.refunded_quantity,
              className: "cm:w-20",
              value: o.data.items[h].quantity,
              onChange: (s) => o.setData("items", o.data.items.map((v, b) => b === h ? { ...v, quantity: Number(s.target.value) } : v))
            }
          )
        ] }, C.id))
      ] }),
      /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
        /* @__PURE__ */ e(f, { checked: o.data.restock, onCheckedChange: (C) => o.setData("restock", C === !0) }),
        " Put the returned items back in stock"
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(y, { htmlFor: "r-reason", children: "Reason" }),
        /* @__PURE__ */ e(p, { id: "r-reason", value: o.data.reason, onChange: (C) => o.setData("reason", C.target.value) })
      ] }),
      /* @__PURE__ */ n(l, { children: [
        /* @__PURE__ */ e(x, { type: "button", variant: "outline", onClick: c, children: "Cancel" }),
        /* @__PURE__ */ e(x, { type: "submit", disabled: o.processing, children: "Record refund" })
      ] })
    ] })
  ] }) });
}
const Z = (t) => t ? new Date(t).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" }) : "—", qe = (t) => ({
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
})[t] ?? "neutral";
function hn(t) {
  const { order: c, transitions: r, can: a, panels: l } = t, { Card: i, CardContent: m, CardHeader: g, CardTitle: x, Button: p, Textarea: y, Label: f, Checkbox: o, Input: u, Dialog: C, DialogContent: h, DialogFooter: s, DialogHeader: v, DialogTitle: b, DialogDescription: _ } = L, { Link: D, router: $ } = E;
  G(), W.useBreadcrumbs([{ label: "Shop", href: N("commerce") }, { label: "Orders", href: N("commerce/orders") }, { label: c.number }]);
  const k = `commerce/orders/${c.id}`, [j, M] = F.useState(null), [Y, ne] = F.useState(""), [ce, w] = F.useState(!1), [I, A] = F.useState(!1), [Q, T] = F.useState(!1), V = E.useForm({ message: "", customer: !1 }), U = E.useForm({ reference: "", paid_at: "", account: "" }), ae = ve.orderPanels(), ie = (d, B) => $.post(N(`${k}/transition`), { to: d, reason: B ?? null }, { preserveScroll: !0, onFinish: () => M(null) });
  return /* @__PURE__ */ n("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      X,
      {
        title: `${c.type === "quote" ? "Quote" : "Order"} ${c.number}`,
        description: /* @__PURE__ */ n(z, { children: [
          "Placed ",
          Z(c.placed_at),
          " · ",
          c.channel,
          c.trashed ? " · in the trash" : ""
        ] }),
        actions: /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
          /* @__PURE__ */ e(O, { tone: qe(c.status), children: c.status_label }),
          c.type === "order" && /* @__PURE__ */ e(O, { tone: qe(c.payment_status), children: c.payment_label }),
          c.type === "order" && c.fulfillment_status !== "not_required" && /* @__PURE__ */ e(O, { tone: qe(c.fulfillment_status), children: c.fulfillment_label }),
          /* @__PURE__ */ e(p, { variant: "outline", size: "sm", asChild: !0, children: /* @__PURE__ */ e("a", { href: c.storefront_url, target: "_blank", rel: "noreferrer", children: "Customer view" }) })
        ] })
      }
    ),
    /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-wrap cm:gap-2", children: [
      r.filter((d) => d.permission).map((d) => /* @__PURE__ */ e(
        p,
        {
          size: "sm",
          variant: d.to === "cancelled" ? "outline" : "default",
          disabled: !d.allowed,
          title: d.reason ?? void 0,
          onClick: () => d.to === "cancelled" || d.to === "on_hold" ? M(d) : ie(d.to),
          children: d.to === "cancelled" ? "Cancel order" : `Mark ${d.label.toLowerCase()}`
        },
        d.to
      )),
      a.mark_paid && /* @__PURE__ */ e(p, { size: "sm", variant: "outline", onClick: () => w(!0), children: "Mark paid" }),
      a.shipments && c.items.some((d) => d.unfulfilled > 0) && /* @__PURE__ */ e(p, { size: "sm", variant: "outline", onClick: () => A(!0), children: "Add shipment" }),
      a.refund && /* @__PURE__ */ e(p, { size: "sm", variant: "outline", onClick: () => T(!0), children: "Refund" }),
      a.send_link && /* @__PURE__ */ e(p, { size: "sm", variant: "outline", onClick: () => $.post(N(`${k}/payment-link`), {}, { preserveScroll: !0 }), children: "Send payment link" }),
      a.edit_items && /* @__PURE__ */ e(p, { size: "sm", variant: "outline", asChild: !0, children: /* @__PURE__ */ e(D, { href: N(`${k}/edit`), children: "Edit items" }) }),
      a.respond_quote && /* @__PURE__ */ e(p, { size: "sm", asChild: !0, children: /* @__PURE__ */ e(D, { href: N(`${k}/quote`), children: c.status === "quoted" ? "Edit quote" : "Send a quote" }) }),
      a.delete && !c.trashed && /* @__PURE__ */ e(
        p,
        {
          size: "sm",
          variant: "ghost",
          className: "cm:ml-auto cm:text-destructive",
          onClick: () => window.confirm("Move this order to the trash?") && $.delete(N(k)),
          children: "Trash"
        }
      ),
      a.delete && c.trashed && /* @__PURE__ */ e(p, { size: "sm", variant: "outline", className: "cm:ml-auto", onClick: () => $.post(N(`${k}/restore`)), children: "Restore" }),
      a.force_delete && /* @__PURE__ */ e(
        p,
        {
          size: "sm",
          variant: "ghost",
          className: "cm:text-destructive",
          onClick: () => window.confirm("Delete this order for good? This can't be undone.") && $.delete(N(`${k}/force`)),
          children: "Delete for good"
        }
      )
    ] }),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[2fr_1fr]", children: [
      /* @__PURE__ */ n("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ n(i, { children: [
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: "Items" }) }),
          /* @__PURE__ */ n(m, { className: "cm:grid cm:gap-4", children: [
            /* @__PURE__ */ e("ul", { className: "cm:divide-y cm:divide-border", children: c.items.map((d) => /* @__PURE__ */ n("li", { className: "cm:grid cm:gap-1 cm:py-3 cm:first:pt-0 cm:sm:grid-cols-[1fr_auto] cm:sm:gap-4", children: [
              /* @__PURE__ */ n("div", { className: "cm:min-w-0", children: [
                /* @__PURE__ */ n("p", { className: "cm:font-medium", children: [
                  d.product_href ? /* @__PURE__ */ e(D, { href: N(d.product_href), className: "cm:hover:underline", children: d.name }) : d.name,
                  d.variant_title && /* @__PURE__ */ n("span", { className: "cm:text-muted-foreground", children: [
                    " · ",
                    d.variant_title
                  ] })
                ] }),
                /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  d.sku && /* @__PURE__ */ n(z, { children: [
                    "SKU ",
                    d.sku,
                    " · "
                  ] }),
                  d.price_source.label,
                  d.requires_shipping && c.fulfillment_status !== "not_required" && /* @__PURE__ */ n(z, { children: [
                    " · shipped ",
                    d.fulfilled_quantity,
                    "/",
                    d.quantity
                  ] }),
                  d.refunded_quantity > 0 && /* @__PURE__ */ n(z, { children: [
                    " · refunded ",
                    d.refunded_quantity
                  ] })
                ] }),
                d.components.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:mt-1 cm:text-xs cm:text-muted-foreground", children: d.components.map((B, Te) => /* @__PURE__ */ n("li", { children: [
                  B.quantity,
                  " × ",
                  B.name
                ] }, Te)) })
              ] }),
              /* @__PURE__ */ n("div", { className: "cm:text-sm cm:sm:text-right", children: [
                /* @__PURE__ */ n("p", { children: [
                  d.quantity,
                  " × ",
                  d.regular_unit_price && /* @__PURE__ */ e("del", { className: "cm:text-muted-foreground", children: d.regular_unit_price }),
                  " ",
                  d.unit_price_formatted
                ] }),
                d.discount && /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  "−",
                  d.discount
                ] }),
                /* @__PURE__ */ e("p", { className: "cm:font-medium", children: d.total })
              ] })
            ] }, d.id)) }),
            /* @__PURE__ */ n("dl", { className: "cm:grid cm:gap-1 cm:border-t cm:pt-3 cm:text-sm", children: [
              /* @__PURE__ */ e(ke, { label: "Subtotal", value: c.totals.subtotal }),
              c.adjustments.filter((d) => d.kind !== "tax").map((d, B) => /* @__PURE__ */ e(ke, { label: `${d.label}${d.code ? ` (${d.code})` : ""}`, value: d.amount, muted: !0 }, B)),
              c.totals.shipping !== null && /* @__PURE__ */ e(ke, { label: `Shipping${c.shipping_method?.label ? ` · ${c.shipping_method.label}` : ""}`, value: c.totals.shipping }),
              c.adjustments.filter((d) => d.kind === "tax").map((d, B) => /* @__PURE__ */ e(ke, { label: `${d.label}${d.included ? " (included)" : ""}`, value: d.amount, muted: !0 }, `t${B}`)),
              /* @__PURE__ */ e(ke, { label: "Total", value: c.totals.total, strong: !0 }),
              c.type === "order" && /* @__PURE__ */ e(ke, { label: "Paid", value: c.totals.paid, muted: !0 }),
              c.totals.refunded && /* @__PURE__ */ e(ke, { label: "Refunded", value: `−${c.totals.refunded}`, muted: !0 })
            ] })
          ] })
        ] }),
        (c.payments.length > 0 || c.confirmations.length > 0) && /* @__PURE__ */ n(i, { children: [
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: "Payments" }) }),
          /* @__PURE__ */ n(m, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            c.payments.map((d) => /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2 cm:rounded-md cm:border cm:p-3", children: [
              /* @__PURE__ */ n("div", { children: [
                /* @__PURE__ */ n("p", { className: "cm:font-medium", children: [
                  d.method,
                  " · ",
                  d.amount
                ] }),
                /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  d.reference && /* @__PURE__ */ n(z, { children: [
                    "Ref ",
                    d.reference,
                    " · "
                  ] }),
                  d.paid_at ? `Paid ${Z(d.paid_at)}` : d.expires_at ? `Due ${Z(d.expires_at)}` : "",
                  d.refunded && ` · refunded ${d.refunded}`
                ] })
              ] }),
              /* @__PURE__ */ e(O, { tone: qe(d.status), children: d.status.replace(/_/g, " ") })
            ] }, d.id)),
            c.confirmations.map((d) => /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2 cm:rounded-md cm:border cm:border-dashed cm:p-3", children: [
              /* @__PURE__ */ n("span", { children: [
                "Confirmation from ",
                d.sender_name,
                d.sender_bank ? ` (${d.sender_bank})` : "",
                " · ",
                d.amount,
                d.proof_url && /* @__PURE__ */ n(z, { children: [
                  " · ",
                  /* @__PURE__ */ e("a", { href: d.proof_url, target: "_blank", rel: "noreferrer", className: "cm:underline", children: "proof" })
                ] })
              ] }),
              /* @__PURE__ */ n("span", { className: "cm:flex cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ e(O, { tone: d.status === "approved" ? "ok" : d.status === "rejected" ? "error" : "warning", children: d.status }),
                d.can_review && /* @__PURE__ */ e(p, { size: "sm", asChild: !0, children: /* @__PURE__ */ e(D, { href: N("commerce/confirmations"), children: "Review" }) })
              ] })
            ] }, d.id))
          ] })
        ] }),
        c.shipments.length > 0 && /* @__PURE__ */ n(i, { children: [
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: "Shipments" }) }),
          /* @__PURE__ */ e(m, { className: "cm:grid cm:gap-2 cm:text-sm", children: c.shipments.map((d) => /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1 cm:rounded-md cm:border cm:p-3", children: [
            /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:justify-between", children: [
              /* @__PURE__ */ n("span", { className: "cm:font-medium", children: [
                d.courier,
                d.service ? ` ${d.service}` : "",
                d.tracking_number && /* @__PURE__ */ n(z, { children: [
                  " · ",
                  d.tracking_url ? /* @__PURE__ */ e("a", { href: d.tracking_url, target: "_blank", rel: "noreferrer", className: "cm:underline", children: d.tracking_number }) : d.tracking_number
                ] })
              ] }),
              /* @__PURE__ */ e(O, { tone: qe(d.status), children: d.status.replace(/_/g, " ") })
            ] }),
            /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
              d.items.map((B) => `${B.quantity} × ${B.name}`).join(", "),
              " · shipped ",
              Z(d.shipped_at),
              d.delivered_at ? ` · delivered ${Z(d.delivered_at)}` : ""
            ] }),
            a.shipments && d.status !== "delivered" && /* @__PURE__ */ e("div", { children: /* @__PURE__ */ e(p, { size: "sm", variant: "outline", onClick: () => $.post(N(`${k}/shipments/${d.id}/delivered`), {}, { preserveScroll: !0 }), children: "Mark delivered" }) })
          ] }, d.id)) })
        ] }),
        c.downloads.length > 0 && /* @__PURE__ */ n(i, { children: [
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: "Downloads" }) }),
          /* @__PURE__ */ e(m, { className: "cm:grid cm:gap-2 cm:text-sm", children: c.downloads.map((d) => /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2 cm:rounded-md cm:border cm:p-3", children: [
            /* @__PURE__ */ n("span", { children: [
              /* @__PURE__ */ e("span", { className: "cm:font-medium", children: d.name }),
              " · ",
              d.count,
              " downloaded",
              d.remaining !== null ? ` · ${d.remaining} left` : "",
              d.expires_at ? ` · until ${Z(d.expires_at)}` : ""
            ] }),
            /* @__PURE__ */ n("span", { className: "cm:flex cm:items-center cm:gap-1", children: [
              /* @__PURE__ */ e(O, { tone: d.state === "active" ? "ok" : "warning", children: d.state.replace("_", " ") }),
              a.edit && ["resend", "extend", "reset", "revoke"].map((B) => /* @__PURE__ */ e(p, { size: "sm", variant: "ghost", onClick: () => $.post(N(`${k}/downloads/${d.id}`), { action: B }, { preserveScroll: !0 }), children: { resend: "Resend", extend: "+7 days", reset: "Reset count", revoke: "Revoke" }[B] }, B))
            ] })
          ] }, d.id)) })
        ] }),
        c.refunds.length > 0 && /* @__PURE__ */ n(i, { children: [
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: "Refunds" }) }),
          /* @__PURE__ */ e(m, { className: "cm:grid cm:gap-1 cm:text-sm", children: c.refunds.map((d) => /* @__PURE__ */ n("p", { children: [
            d.amount,
            " · ",
            Z(d.created_at),
            d.reason ? ` · ${d.reason}` : "",
            d.restock ? " · restocked" : ""
          ] }, d.id)) })
        ] }),
        l.map((d) => {
          const B = ae[d.key];
          return B ? /* @__PURE__ */ n(i, { children: [
            /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: d.label }) }),
            /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(B, { order: c, data: d.data }) })
          ] }, d.key) : null;
        }),
        /* @__PURE__ */ n(i, { children: [
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: "Timeline" }) }),
          /* @__PURE__ */ n(m, { className: "cm:grid cm:gap-4", children: [
            a.edit && /* @__PURE__ */ n("form", { className: "cm:grid cm:gap-2", onSubmit: (d) => {
              d.preventDefault(), V.post(N(`${k}/notes`), { preserveScroll: !0, onSuccess: () => V.reset() });
            }, children: [
              /* @__PURE__ */ e(f, { htmlFor: "o-note", className: "cm:sr-only", children: "Note" }),
              /* @__PURE__ */ e(y, { id: "o-note", placeholder: "Add a note…", value: V.data.message, onChange: (d) => V.setData("message", d.target.value) }),
              /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:justify-between cm:gap-2", children: [
                /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
                  /* @__PURE__ */ e(o, { checked: V.data.customer, onCheckedChange: (d) => V.setData("customer", d === !0) }),
                  " Send to the customer"
                ] }),
                /* @__PURE__ */ e(p, { size: "sm", type: "submit", disabled: V.processing || V.data.message.trim() === "", children: "Add note" })
              ] })
            ] }),
            /* @__PURE__ */ e("ol", { className: "cm:grid cm:gap-3 cm:text-sm", children: c.timeline.map((d) => /* @__PURE__ */ n("li", { className: "cm:grid cm:gap-0.5 cm:border-l-2 cm:pl-3", style: { borderColor: d.visibility === "customer" ? "var(--color-primary, currentColor)" : void 0 }, children: [
              /* @__PURE__ */ e("span", { className: "cm:whitespace-pre-line", children: d.message }),
              /* @__PURE__ */ n("span", { className: "cm:text-xs cm:text-muted-foreground", children: [
                Z(d.created_at),
                " · ",
                d.actor ?? d.source,
                d.visibility === "customer" ? " · to the customer" : ""
              ] })
            ] }, d.id)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ n(i, { children: [
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: "Customer" }) }),
          /* @__PURE__ */ n(m, { className: "cm:grid cm:gap-1 cm:text-sm", children: [
            /* @__PURE__ */ e("p", { className: "cm:font-medium", children: c.customer.href ? /* @__PURE__ */ e(D, { href: N(c.customer.href), className: "cm:hover:underline", children: c.customer.name ?? c.customer.email }) : c.customer.name ?? c.customer.email }),
            c.customer.email && /* @__PURE__ */ e("a", { href: `mailto:${c.customer.email}`, className: "cm:text-muted-foreground cm:hover:underline", children: c.customer.email }),
            c.customer.phone && /* @__PURE__ */ e("a", { href: `https://wa.me/${c.customer.phone.replace(/\D/g, "")}`, target: "_blank", rel: "noreferrer", className: "cm:text-muted-foreground cm:hover:underline", children: c.customer.phone }),
            c.customer.guest && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: "Guest checkout" })
          ] })
        ] }),
        /* @__PURE__ */ n(i, { children: [
          /* @__PURE__ */ n(g, { className: "cm:flex cm:flex-row cm:items-center cm:justify-between", children: [
            /* @__PURE__ */ e(x, { children: "Addresses" }),
            a.edit_addresses && /* @__PURE__ */ e(p, { size: "sm", variant: "ghost", asChild: !0, children: /* @__PURE__ */ e(D, { href: N(`${k}/addresses`), children: "Edit" }) })
          ] }),
          /* @__PURE__ */ n(m, { className: "cm:grid cm:gap-3 cm:text-sm", children: [
            c.pickup && /* @__PURE__ */ n("div", { children: [
              /* @__PURE__ */ e("p", { className: "cm:text-xs cm:font-medium cm:uppercase cm:text-muted-foreground", children: "Pickup" }),
              /* @__PURE__ */ n("p", { children: [
                c.pickup.name,
                /* @__PURE__ */ e("br", {}),
                c.pickup.address
              ] })
            ] }),
            c.shipping_address_text && /* @__PURE__ */ n("div", { children: [
              /* @__PURE__ */ e("p", { className: "cm:text-xs cm:font-medium cm:uppercase cm:text-muted-foreground", children: "Shipping" }),
              /* @__PURE__ */ e("p", { className: "cm:whitespace-pre-line", children: c.shipping_address_text })
            ] }),
            c.billing_address_text && c.billing_address_text !== c.shipping_address_text && /* @__PURE__ */ n("div", { children: [
              /* @__PURE__ */ e("p", { className: "cm:text-xs cm:font-medium cm:uppercase cm:text-muted-foreground", children: "Billing" }),
              /* @__PURE__ */ e("p", { className: "cm:whitespace-pre-line", children: c.billing_address_text })
            ] }),
            c.dropship && /* @__PURE__ */ n("div", { children: [
              /* @__PURE__ */ e("p", { className: "cm:text-xs cm:font-medium cm:uppercase cm:text-muted-foreground", children: "Dropshipper" }),
              /* @__PURE__ */ n("p", { children: [
                c.dropship.name,
                " · ",
                c.dropship.phone
              ] })
            ] }),
            !c.shipping_address_text && !c.billing_address_text && !c.pickup && /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "No address." })
          ] })
        ] }),
        (c.customer_note || c.fields && Object.keys(c.fields).length > 0) && /* @__PURE__ */ n(i, { children: [
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: "From the customer" }) }),
          /* @__PURE__ */ n(m, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            c.customer_note && /* @__PURE__ */ e("p", { className: "cm:whitespace-pre-line", children: c.customer_note }),
            c.fields && Object.entries(c.fields).map(([d, B]) => /* @__PURE__ */ n("p", { children: [
              /* @__PURE__ */ n("span", { className: "cm:text-muted-foreground", children: [
                d.replace(/_/g, " "),
                ":"
              ] }),
              " ",
              String(B ?? "")
            ] }, d))
          ] })
        ] }),
        /* @__PURE__ */ n(i, { children: [
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: "Details" }) }),
          /* @__PURE__ */ n(m, { className: "cm:grid cm:gap-1 cm:text-sm", children: [
            c.payment_method_title && /* @__PURE__ */ n("p", { children: [
              "Payment: ",
              c.payment_method_title
            ] }),
            c.expires_at && c.payment_status === "unpaid" && /* @__PURE__ */ n("p", { children: [
              "Pay before ",
              Z(c.expires_at)
            ] }),
            c.paid_at && /* @__PURE__ */ n("p", { children: [
              "Paid ",
              Z(c.paid_at)
            ] }),
            c.completed_at && /* @__PURE__ */ n("p", { children: [
              "Completed ",
              Z(c.completed_at)
            ] }),
            c.cancelled_at && /* @__PURE__ */ n("p", { children: [
              "Cancelled ",
              Z(c.cancelled_at),
              c.cancel_reason ? ` — ${c.cancel_reason}` : ""
            ] }),
            c.quote_valid_until && /* @__PURE__ */ n("p", { children: [
              "Quote valid until ",
              Z(c.quote_valid_until)
            ] }),
            c.documents.length > 0 && /* @__PURE__ */ e("div", { className: "cm:mt-2 cm:flex cm:flex-wrap cm:gap-2", children: c.documents.map((d) => /* @__PURE__ */ e(p, { size: "sm", variant: "outline", asChild: !0, children: /* @__PURE__ */ n("a", { href: d.url, target: "_blank", rel: "noreferrer", children: [
              d.label,
              d.number ? ` ${d.number}` : ""
            ] }) }, d.type)) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e(C, { open: j !== null, onOpenChange: (d) => !d && M(null), children: /* @__PURE__ */ n(h, { children: [
      /* @__PURE__ */ n(v, { children: [
        /* @__PURE__ */ e(b, { children: j?.to === "cancelled" ? "Cancel this order?" : "Put this order on hold?" }),
        /* @__PURE__ */ e(_, { children: j?.to === "cancelled" ? "Stock, flash sale quantities and voucher uses are given back." : "It can go back to its status later." })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(f, { htmlFor: "o-reason", children: "Reason (on the timeline)" }),
        /* @__PURE__ */ e(u, { id: "o-reason", value: Y, onChange: (d) => ne(d.target.value) })
      ] }),
      /* @__PURE__ */ n(s, { children: [
        /* @__PURE__ */ e(p, { variant: "outline", onClick: () => M(null), children: "Back" }),
        /* @__PURE__ */ e(p, { onClick: () => j && ie(j.to, Y), children: "Confirm" })
      ] })
    ] }) }),
    /* @__PURE__ */ e(C, { open: ce, onOpenChange: w, children: /* @__PURE__ */ n(h, { children: [
      /* @__PURE__ */ n(v, { children: [
        /* @__PURE__ */ e(b, { children: "Mark as paid" }),
        /* @__PURE__ */ n(_, { children: [
          "Record a payment you received outside the store (",
          c.totals.total,
          ")."
        ] })
      ] }),
      /* @__PURE__ */ n("form", { className: "cm:grid cm:gap-3", onSubmit: (d) => {
        d.preventDefault(), U.post(N(`${k}/mark-paid`), { preserveScroll: !0, onSuccess: () => w(!1) });
      }, children: [
        /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(f, { htmlFor: "p-ref", children: "Reference" }),
          /* @__PURE__ */ e(u, { id: "p-ref", value: U.data.reference, onChange: (d) => U.setData("reference", d.target.value) })
        ] }),
        /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(f, { htmlFor: "p-date", children: "Paid on" }),
          /* @__PURE__ */ e(u, { id: "p-date", type: "datetime-local", value: U.data.paid_at, onChange: (d) => U.setData("paid_at", d.target.value) })
        ] }),
        /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(f, { htmlFor: "p-acc", children: "Into account" }),
          /* @__PURE__ */ e(u, { id: "p-acc", value: U.data.account, onChange: (d) => U.setData("account", d.target.value) })
        ] }),
        /* @__PURE__ */ e(s, { children: /* @__PURE__ */ e(p, { type: "submit", disabled: U.processing, children: "Record payment" }) })
      ] })
    ] }) }),
    I && /* @__PURE__ */ e(on, { order: c, couriers: t.couriers, onClose: () => A(!1) }),
    Q && /* @__PURE__ */ e(un, { order: c, onClose: () => T(!1) })
  ] });
}
function ke({ label: t, value: c, muted: r, strong: a }) {
  return /* @__PURE__ */ n("div", { className: `cm:flex cm:justify-between cm:gap-4 ${r ? "cm:text-muted-foreground" : ""} ${a ? "cm:text-base cm:font-semibold" : ""}`, children: [
    /* @__PURE__ */ e("dt", { children: t }),
    /* @__PURE__ */ e("dd", { children: c })
  ] });
}
const pn = { published: "ok", draft: "neutral", scheduled: "info", trashed: "error" };
function gn(t) {
  const { DataTable: c } = ye, { Button: r } = L, { Link: a } = E;
  return G(), W.useBreadcrumbs([{ label: "Shop", href: N("commerce") }, { label: "Products" }]), /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      X,
      {
        title: "Products",
        description: "Products are entries: opening one goes to the editor.",
        actions: /* @__PURE__ */ e(r, { asChild: !0, children: /* @__PURE__ */ e(a, { href: N(t.createUrl), children: "New product" }) })
      }
    ),
    /* @__PURE__ */ e(
      c,
      {
        ...t,
        searchPlaceholder: "Search titles or SKUs…",
        rowHref: (l) => N(l.href),
        renderCell: (l, i) => {
          switch (i.key) {
            case "product_title":
              return /* @__PURE__ */ n("span", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ e("span", { className: "cm:font-medium", children: l.product_title }),
                l.featured && /* @__PURE__ */ e(O, { tone: "info", children: "Featured" }),
                l.sync_failed && /* @__PURE__ */ e("span", { title: l.sync_error ?? "", children: /* @__PURE__ */ e(O, { tone: "error", children: "Can't be bought" }) })
              ] });
            case "state":
              return /* @__PURE__ */ e(O, { tone: pn[l.state], children: l.state });
            case "stock":
              return l.stock === null ? "—" : /* @__PURE__ */ e("span", { className: l.in_stock === !1 ? "cm:text-destructive" : "", children: l.stock });
            case "type":
              return /* @__PURE__ */ e(O, { children: l.type });
            default:
              return;
          }
        }
      }
    )
  ] });
}
const Ct = (t) => t.toLocaleString(void 0, { maximumFractionDigits: 0 });
function Ne(t, c) {
  return t == null || t === "" ? "—" : typeof t != "number" ? c === "date" && /^\d{4}-\d{2}-\d{2}$/.test(String(t)) ? (/* @__PURE__ */ new Date(`${t}T00:00:00`)).toLocaleDateString() : String(t) : c === "money" ? me(t) : c === "percent" ? `${t.toLocaleString(void 0, { maximumFractionDigits: 1 })}%` : Ct(t);
}
const Ge = (t) => t === "money" || t === "count" || t === "percent";
function fn({ report: t, reports: c, period: r, result: a, exportUrl: l }) {
  const {
    Card: i,
    CardContent: m,
    CardHeader: g,
    CardTitle: x,
    CardDescription: p,
    Button: y,
    Input: f,
    Label: o,
    Select: u,
    SelectContent: C,
    SelectItem: h,
    SelectTrigger: s,
    SelectValue: v,
    Table: b,
    TableBody: _,
    TableCell: D,
    TableHead: $,
    TableHeader: k,
    TableRow: j
  } = L, { Link: M, router: Y } = E;
  G(), W.useBreadcrumbs([{ label: "Shop", href: N("commerce") }, { label: "Reports", href: N("commerce/reports") }, { label: t.label }]);
  const [ne, ce] = F.useState(r.from), [w, I] = F.useState(r.to), A = (T) => Y.get(N(`commerce/reports/${t.key}`), { from: r.from, to: r.to, interval: r.interval, compare: r.compare, ...T }, { preserveScroll: !0 }), Q = a.chart && a.columns.find((T) => T.key === a.chart?.series[0]?.key)?.kind === "money" ? (T) => me(T) : Ct;
  return /* @__PURE__ */ n("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:grid-cols-1 cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      X,
      {
        title: "Reports",
        description: t.description || void 0,
        actions: l ? /* @__PURE__ */ e(y, { asChild: !0, variant: "outline", children: /* @__PURE__ */ e("a", { href: l, children: "Export CSV" }) }) : void 0
      }
    ),
    /* @__PURE__ */ e("nav", { "aria-label": "Reports", className: "cm:flex cm:flex-wrap cm:gap-1", children: c.map((T) => /* @__PURE__ */ e(
      M,
      {
        href: N(`commerce/reports/${T.key}`),
        "aria-current": T.key === t.key ? "page" : void 0,
        className: le("cm:rounded-md cm:px-3 cm:py-1.5 cm:text-sm", T.key === t.key ? "cm:bg-primary cm:text-primary-foreground" : "cm:hover:bg-muted"),
        children: T.label
      },
      T.key
    )) }),
    t.usesDates && /* @__PURE__ */ e(i, { children: /* @__PURE__ */ n(m, { className: "cm:flex cm:flex-wrap cm:items-end cm:gap-3 cm:pt-6", children: [
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(o, { htmlFor: "report-preset", children: "Period" }),
        /* @__PURE__ */ n(u, { value: r.preset ?? "custom", onValueChange: (T) => T !== "custom" && Y.get(N(`commerce/reports/${t.key}`), { period: T, compare: r.compare }, { preserveScroll: !0 }), children: [
          /* @__PURE__ */ e(s, { id: "report-preset", className: "cm:w-44", children: /* @__PURE__ */ e(v, {}) }),
          /* @__PURE__ */ n(C, { children: [
            Object.entries(r.presets).map(([T, V]) => /* @__PURE__ */ e(h, { value: T, children: V }, T)),
            /* @__PURE__ */ e(h, { value: "custom", children: "Custom" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ n("form", { className: "cm:flex cm:flex-wrap cm:items-end cm:gap-3", onSubmit: (T) => {
        T.preventDefault(), A({ from: ne, to: w });
      }, children: [
        /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(o, { htmlFor: "report-from", children: "From" }),
          /* @__PURE__ */ e(f, { id: "report-from", type: "date", value: ne, max: w, onChange: (T) => ce(T.target.value) })
        ] }),
        /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(o, { htmlFor: "report-to", children: "To" }),
          /* @__PURE__ */ e(f, { id: "report-to", type: "date", value: w, min: ne, onChange: (T) => I(T.target.value) })
        ] }),
        /* @__PURE__ */ e(y, { type: "submit", variant: "outline", children: "Apply" })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(o, { htmlFor: "report-compare", children: "Compare with" }),
        /* @__PURE__ */ n(u, { value: r.compare, onValueChange: (T) => A({ compare: T }), children: [
          /* @__PURE__ */ e(s, { id: "report-compare", className: "cm:w-44", children: /* @__PURE__ */ e(v, {}) }),
          /* @__PURE__ */ n(C, { children: [
            /* @__PURE__ */ e(h, { value: "previous", children: "Previous period" }),
            /* @__PURE__ */ e(h, { value: "year", children: "Same period last year" }),
            /* @__PURE__ */ e(h, { value: "none", children: "Nothing" })
          ] })
        ] })
      ] }),
      t.key === "sales" && /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(o, { htmlFor: "report-interval", children: "Group by" }),
        /* @__PURE__ */ n(u, { value: r.interval, onValueChange: (T) => A({ interval: T }), children: [
          /* @__PURE__ */ e(s, { id: "report-interval", className: "cm:w-32", children: /* @__PURE__ */ e(v, {}) }),
          /* @__PURE__ */ n(C, { children: [
            /* @__PURE__ */ e(h, { value: "day", children: "Day" }),
            /* @__PURE__ */ e(h, { value: "week", children: "Week" }),
            /* @__PURE__ */ e(h, { value: "month", children: "Month" })
          ] })
        ] })
      ] })
    ] }) }),
    a.summary.length > 0 && /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2 cm:lg:grid-cols-5", children: a.summary.map((T) => /* @__PURE__ */ e(fe, { kpi: { key: T.key, label: T.label, value: Ne(T.value, T.kind), change: T.change } }, T.key)) }),
    a.chart && a.chart.data.length > 0 && /* @__PURE__ */ n(i, { children: [
      /* @__PURE__ */ n(g, { children: [
        /* @__PURE__ */ e(x, { children: t.label }),
        t.usesDates && /* @__PURE__ */ n(p, { children: [
          Ne(r.from, "date"),
          " – ",
          Ne(r.to, "date")
        ] })
      ] }),
      /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(
        Ye,
        {
          label: t.label,
          kind: a.chart.kind,
          data: a.chart.data,
          xKey: a.chart.xKey,
          series: a.chart.series,
          format: Q,
          formatX: a.chart.xKey === "date" ? (T) => Ne(T, "date") : void 0
        }
      ) })
    ] }),
    /* @__PURE__ */ e(i, { children: /* @__PURE__ */ e(m, { className: "cm:pt-6", children: a.rows.length === 0 ? /* @__PURE__ */ e(Ce, { title: "Nothing to show", description: t.usesDates ? "There is no data for this period." : "Nothing needs attention." }) : /* @__PURE__ */ e("div", { className: "cm:overflow-x-auto", children: /* @__PURE__ */ n(b, { children: [
      /* @__PURE__ */ e(k, { children: /* @__PURE__ */ e(j, { children: a.columns.map((T) => /* @__PURE__ */ e($, { className: Ge(T.kind) ? "cm:text-right" : void 0, children: T.label }, T.key)) }) }),
      /* @__PURE__ */ n(_, { children: [
        a.rows.map((T, V) => /* @__PURE__ */ e(j, { children: a.columns.map((U, ae) => /* @__PURE__ */ e(D, { className: le(Ge(U.kind) && "cm:text-right cm:tabular-nums"), children: ae === 0 && T.href ? /* @__PURE__ */ e(M, { href: N(T.href), className: "cm:underline-offset-2 cm:hover:underline", children: Ne(T[U.key], U.kind) }) : Ne(T[U.key], U.kind) }, U.key)) }, V)),
        a.totals && /* @__PURE__ */ e(j, { className: "cm:font-semibold", children: a.columns.map((T) => /* @__PURE__ */ e(D, { className: le(Ge(T.kind) && "cm:text-right cm:tabular-nums"), children: Ne(a.totals?.[T.key], T.kind) }, T.key)) })
      ] })
    ] }) }) }) })
  ] });
}
function wt({ items: t, current: c, label: r = "Sections" }) {
  const { Link: a } = E;
  return /* @__PURE__ */ e("nav", { "aria-label": r, className: "cm:flex cm:gap-1 cm:overflow-x-auto cm:md:flex-col", children: t.map((l) => /* @__PURE__ */ e(
    a,
    {
      href: N(l.href),
      "aria-current": l.key === c ? "page" : void 0,
      className: le(
        "cm:whitespace-nowrap cm:rounded-md cm:px-3 cm:py-1.5 cm:text-sm cm:text-muted-foreground cm:hover:bg-muted cm:hover:text-foreground",
        l.key === c && "cm:bg-muted cm:font-medium cm:text-foreground"
      ),
      children: l.label
    },
    l.key
  )) });
}
function Fe({ sections: t, current: c, title: r, description: a, children: l }) {
  const { SettingsTabs: i } = ye;
  return G(), W.useBreadcrumbs([{ label: "Settings", href: N("settings") }, { label: "Store", href: N("commerce/settings") }, { label: r }]), /* @__PURE__ */ n("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(i, { current: "store" }),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6 cm:md:grid-cols-[12rem_1fr]", children: [
      /* @__PURE__ */ e(wt, { items: t, current: c, label: "Store settings" }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:min-w-0 cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ e(X, { title: r, description: a }),
        l
      ] })
    ] })
  ] });
}
function vn({ sections: t, emails: c }) {
  const { Card: r, CardContent: a, CardHeader: l, CardTitle: i, Switch: m, Button: g } = L, { Link: x, router: p } = E, y = [["To customers", c.filter((f) => f.audience === "customer")], ["To staff", c.filter((f) => f.audience === "staff")]];
  return /* @__PURE__ */ e(Fe, { sections: t, current: "emails", title: "Emails", description: "What the store sends, and to whom. Open an email to change its texts, recipients and attachments.", children: y.map(([f, o]) => o.length > 0 && /* @__PURE__ */ n(r, { children: [
    /* @__PURE__ */ e(l, { children: /* @__PURE__ */ e(i, { children: f }) }),
    /* @__PURE__ */ e(a, { className: "cm:p-0", children: /* @__PURE__ */ e("ul", { className: "cm:divide-y cm:divide-border", children: o.map((u) => /* @__PURE__ */ n("li", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:px-6 cm:py-3", children: [
      /* @__PURE__ */ n("div", { className: "cm:min-w-0", children: [
        /* @__PURE__ */ e(x, { href: N(u.edit_url), className: "cm:font-medium cm:hover:underline", children: u.label }),
        u.description && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: u.description })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
        u.preview_url && /* @__PURE__ */ n(z, { children: [
          /* @__PURE__ */ e(g, { size: "sm", variant: "ghost", asChild: !0, children: /* @__PURE__ */ e("a", { href: u.preview_url, target: "_blank", rel: "noreferrer", children: "Preview" }) }),
          /* @__PURE__ */ e(g, { size: "sm", variant: "ghost", onClick: () => p.post(N(`commerce/settings/emails/${u.key}/test`), {}, { preserveScroll: !0 }), children: "Send test" })
        ] }),
        u.locked ? /* @__PURE__ */ e(O, { children: "Always sent" }) : /* @__PURE__ */ e(
          m,
          {
            checked: u.enabled,
            "aria-label": `Send ${u.label}`,
            onCheckedChange: (C) => p.put(N(`commerce/settings/emails/${u.key}/enabled`), { enabled: C }, { preserveScroll: !0 })
          }
        )
      ] })
    ] }, u.key)) }) })
  ] }, f)) });
}
function bn({ sections: t, mode: c, groups: r, updateUrl: a }) {
  const { Card: l, CardContent: i, CardHeader: m, CardTitle: g, Switch: x, Button: p, Dialog: y, DialogContent: f, DialogDescription: o, DialogFooter: u, DialogHeader: C, DialogTitle: h } = L, { errors: s } = E.usePage().props, [v, b] = F.useState(null), [_, D] = F.useState(null), $ = (k, j) => {
    D(k.key), E.router.put(a.replace("__key__", k.key), { on: j }, { preserveScroll: !0, onFinish: () => D(null) });
  };
  return /* @__PURE__ */ n(
    Fe,
    {
      sections: t,
      current: "features",
      title: "Features",
      description: /* @__PURE__ */ n(z, { children: [
        "Switch store modules on or off. Selling mode: ",
        /* @__PURE__ */ e("strong", { children: c.label }),
        ". Switching off never deletes data."
      ] }),
      children: [
        s.feature && /* @__PURE__ */ e("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: s.feature }),
        r.map((k) => /* @__PURE__ */ n(l, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(g, { children: k.label }) }),
          /* @__PURE__ */ e(i, { className: "cm:grid cm:gap-0 cm:divide-y cm:divide-border", children: k.features.map((j) => /* @__PURE__ */ n("div", { className: "cm:flex cm:items-start cm:justify-between cm:gap-4 cm:py-3 cm:first:pt-0 cm:last:pb-0", children: [
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ e("label", { htmlFor: `feature-${j.key}`, className: "cm:font-medium", children: j.label }),
                j.core && /* @__PURE__ */ e(O, { children: "Always on" }),
                j.switched_on && !j.active && /* @__PURE__ */ n(O, { tone: "warning", children: [
                  "Off — ",
                  j.reasons.join("; ").replace(/^Needs /, "needs ")
                ] }),
                j.essential && /* @__PURE__ */ n(O, { tone: "info", children: [
                  "Needed by ",
                  c.label
                ] })
              ] }),
              /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: j.description }),
              j.requires.length > 0 && /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                "Needs: ",
                j.requires.join(", ")
              ] })
            ] }),
            /* @__PURE__ */ e(
              x,
              {
                id: `feature-${j.key}`,
                checked: j.switched_on,
                disabled: j.core || _ === j.key,
                onCheckedChange: (M) => !M && j.dependents.length > 0 ? b(j) : $(j, M)
              }
            )
          ] }, j.key)) })
        ] }, k.key)),
        /* @__PURE__ */ e(y, { open: v !== null, onOpenChange: (k) => !k && b(null), children: /* @__PURE__ */ n(f, { children: [
          /* @__PURE__ */ n(C, { children: [
            /* @__PURE__ */ n(h, { children: [
              "Switch off ",
              v?.label,
              "?"
            ] }),
            /* @__PURE__ */ n(o, { children: [
              "These are switched off with it: ",
              v?.dependents.map((k) => k.label).join(", "),
              ". Their data is kept."
            ] })
          ] }),
          /* @__PURE__ */ n(u, { children: [
            /* @__PURE__ */ e(p, { variant: "outline", onClick: () => b(null), children: "Cancel" }),
            /* @__PURE__ */ e(
              p,
              {
                variant: "destructive",
                onClick: () => {
                  v && $(v, !1), b(null);
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
function yn({ sections: t, methods: c, instanceTypes: r }) {
  const { Card: a, CardContent: l, Button: i, Switch: m } = L, { Link: g, router: x } = E, p = (y, f) => x.post(N("commerce/settings/payments/move"), { key: y, direction: f }, { preserveScroll: !0 });
  return /* @__PURE__ */ n(Fe, { sections: t, current: "payments", title: "Payments", description: "Payment methods offered at checkout and on the pay page, in this order.", children: [
    c.length === 0 && /* @__PURE__ */ e(Ce, { title: "No payment methods", description: "Switch on Bank transfer, QRIS and cash on delivery in Features, or install a gateway package." }),
    c.length > 0 && /* @__PURE__ */ e(a, { children: /* @__PURE__ */ e(l, { className: "cm:p-0", children: /* @__PURE__ */ e("ul", { className: "cm:divide-y cm:divide-border", children: c.map((y, f) => /* @__PURE__ */ n("li", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:px-4 cm:py-3", children: [
      /* @__PURE__ */ n("div", { className: "cm:min-w-0", children: [
        /* @__PURE__ */ e(g, { href: N(y.edit_url), className: "cm:font-medium cm:hover:underline", children: y.title }),
        /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
          y.type,
          y.instance ? ` · ${y.key}` : ""
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
        !y.active && /* @__PURE__ */ e(O, { children: "Off" }),
        /* @__PURE__ */ e(i, { variant: "ghost", size: "sm", "aria-label": "Move up", disabled: f === 0, onClick: () => p(y.key, "up"), children: "↑" }),
        /* @__PURE__ */ e(i, { variant: "ghost", size: "sm", "aria-label": "Move down", disabled: f === c.length - 1, onClick: () => p(y.key, "down"), children: "↓" }),
        /* @__PURE__ */ e(
          m,
          {
            checked: y.active,
            "aria-label": `${y.title} active`,
            onCheckedChange: (o) => x.put(N(`commerce/settings/payments/${y.key}/active`), { active: o }, { preserveScroll: !0 })
          }
        )
      ] })
    ] }, y.key)) }) }) }),
    r.length > 0 && /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:gap-2", children: r.map((y) => /* @__PURE__ */ n(i, { variant: "outline", onClick: () => x.post(N("commerce/settings/payments/instances"), { type: y.key }), children: [
      "Add ",
      y.label.toLowerCase()
    ] }, y.key)) })
  ] });
}
function Ze({ form: t, footer: c }) {
  const { FieldRenderer: r } = ye, { Button: a } = L, { data: l, setData: i, errors: m, processing: g, isDirty: x, ...p } = E.useForm({ values: t.values });
  return /* @__PURE__ */ n(
    "form",
    {
      className: "cm:grid cm:gap-6",
      onSubmit: (y) => {
        y.preventDefault(), p[t.method](t.action, { preserveScroll: !0 });
      },
      children: [
        m.section && /* @__PURE__ */ e("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: m.section }),
        /* @__PURE__ */ e(
          r,
          {
            fields: t.fields,
            values: l.values,
            errors: m,
            pathPrefix: "values",
            onChange: (y) => i("values", y)
          }
        ),
        /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
          /* @__PURE__ */ e(a, { type: "submit", disabled: g, children: t.submitLabel }),
          x && /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: "Unsaved changes" }),
          c
        ] })
      ]
    }
  );
}
function xn({ section: t, sections: c, form: r }) {
  const a = ve.settingsSections()[t.key];
  return /* @__PURE__ */ e(Fe, { sections: c, current: t.key, title: `${t.label} settings`, children: a ? /* @__PURE__ */ e(a, { section: t, form: r }, t.key) : /* @__PURE__ */ e(Ze, { form: r }, t.key) });
}
function kn({ sections: t, zones: c, types: r, couriers: a, moveUrl: l }) {
  const { Card: i, CardContent: m, CardHeader: g, CardTitle: x, Button: p, Select: y, SelectContent: f, SelectItem: o, SelectTrigger: u, SelectValue: C } = L, { Link: h } = E, s = (v, b, _) => E.router.post(N(l), { kind: v, id: b, direction: _ }, { preserveScroll: !0 });
  return /* @__PURE__ */ n(
    Fe,
    {
      sections: t,
      current: "shipping",
      title: "Shipping",
      description: "Zones are checked in order and the first one matching the address gives its methods. Pickup methods are offered everywhere.",
      children: [
        /* @__PURE__ */ e("div", { className: "cm:flex cm:justify-end", children: /* @__PURE__ */ e(p, { asChild: !0, children: /* @__PURE__ */ e(h, { href: N("commerce/settings/shipping/zones/create"), children: "Add zone" }) }) }),
        c.length === 0 && /* @__PURE__ */ e(Ce, { title: "No shipping zones yet", description: "Without a zone, checkout offers no shipping. Add one for your country or provinces." }),
        c.map((v, b) => /* @__PURE__ */ n(i, { children: [
          /* @__PURE__ */ n(g, { className: "cm:flex cm:flex-row cm:items-start cm:justify-between cm:gap-4", children: [
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ n(x, { className: "cm:flex cm:items-center cm:gap-2", children: [
                v.name,
                v.everywhere_else && /* @__PURE__ */ e(O, { tone: "info", children: "Everywhere else" })
              ] }),
              !v.everywhere_else && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: v.regions.length > 0 ? v.regions.join(", ") : "No regions" })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:flex cm:shrink-0 cm:gap-1", children: [
              /* @__PURE__ */ e(p, { variant: "ghost", size: "sm", "aria-label": "Move up", disabled: b === 0, onClick: () => s("zone", v.id, "up"), children: "↑" }),
              /* @__PURE__ */ e(p, { variant: "ghost", size: "sm", "aria-label": "Move down", disabled: b === c.length - 1, onClick: () => s("zone", v.id, "down"), children: "↓" }),
              /* @__PURE__ */ e(p, { variant: "outline", size: "sm", asChild: !0, children: /* @__PURE__ */ e(h, { href: N(v.edit_url), children: "Edit" }) })
            ] })
          ] }),
          /* @__PURE__ */ n(m, { className: "cm:grid cm:gap-3", children: [
            v.methods.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No methods in this zone." }),
            v.methods.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:divide-y cm:divide-border cm:rounded-md cm:border", children: v.methods.map((_, D) => /* @__PURE__ */ n("li", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:px-3 cm:py-2", children: [
              /* @__PURE__ */ n("div", { className: "cm:min-w-0", children: [
                /* @__PURE__ */ e(h, { href: N(_.edit_url), className: "cm:font-medium cm:hover:underline", children: _.title }),
                /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  _.type,
                  _.etd ? ` · ${_.etd}` : ""
                ] })
              ] }),
              /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:gap-1", children: [
                !_.active && /* @__PURE__ */ e(O, { children: "Inactive" }),
                /* @__PURE__ */ e(p, { variant: "ghost", size: "sm", "aria-label": "Move up", disabled: D === 0, onClick: () => s("method", _.id, "up"), children: "↑" }),
                /* @__PURE__ */ e(p, { variant: "ghost", size: "sm", "aria-label": "Move down", disabled: D === v.methods.length - 1, onClick: () => s("method", _.id, "down"), children: "↓" })
              ] })
            ] }, _.id)) }),
            /* @__PURE__ */ e("div", { children: /* @__PURE__ */ n(y, { value: "", onValueChange: (_) => E.router.visit(N(`commerce/settings/shipping/zones/${v.id}/methods/create?type=${_}`)), children: [
              /* @__PURE__ */ e(u, { className: "cm:w-48", "aria-label": `Add a method to ${v.name}`, children: /* @__PURE__ */ e(C, { placeholder: "Add method…" }) }),
              /* @__PURE__ */ e(f, { children: r.map((_) => /* @__PURE__ */ e(o, { value: _.key, children: _.label }, _.key)) })
            ] }) })
          ] })
        ] }, v.id)),
        /* @__PURE__ */ n(i, { children: [
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: "Courier presets" }) }),
          /* @__PURE__ */ n(m, { children: [
            /* @__PURE__ */ e("p", { className: "cm:mb-3 cm:text-sm cm:text-muted-foreground", children: "Offered when adding a shipment; the tracking link is filled in from the tracking number. Add more in config/commerce.php or with Commerce::registerCourier()." }),
            /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1 cm:text-sm cm:sm:grid-cols-2", children: a.map((v) => /* @__PURE__ */ n("li", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e("span", { className: "cm:font-medium", children: v.name }),
              !v.tracking_url && /* @__PURE__ */ e("span", { className: "cm:text-xs cm:text-muted-foreground", children: "(no tracking link)" })
            ] }, v.key)) })
          ] })
        ] })
      ]
    }
  );
}
function Nn({ title: t, description: c, form: r, breadcrumbs: a = [], deleteUrl: l, deleteConfirm: i }) {
  const { Button: m } = L;
  return G(), W.useBreadcrumbs([...a.map((g) => ({ ...g, href: g.href ? N(g.href) : void 0 })), { label: t }]), /* @__PURE__ */ n("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-3xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(X, { title: t, description: c }),
    /* @__PURE__ */ e(Ze, { form: r, footer: l ? /* @__PURE__ */ e(
      m,
      {
        type: "button",
        variant: "ghost",
        className: "cm:ml-auto cm:text-destructive",
        onClick: () => window.confirm(i ?? "Delete this?") && E.router.delete(N(l)),
        children: "Delete"
      }
    ) : null })
  ] });
}
function _n({ items: t, current: c, label: r }) {
  const { Link: a } = E;
  return /* @__PURE__ */ e("nav", { "aria-label": r, className: "cm:flex cm:gap-1 cm:overflow-x-auto cm:border-b", children: t.map((l) => /* @__PURE__ */ e(
    a,
    {
      href: N(l.href),
      "aria-current": l.key === c ? "page" : void 0,
      className: le(
        "cm:-mb-px cm:whitespace-nowrap cm:border-b-2 cm:border-transparent cm:px-3 cm:py-2 cm:text-sm cm:text-muted-foreground cm:hover:text-foreground",
        l.key === c && "cm:border-foreground cm:font-medium cm:text-foreground"
      ),
      children: l.label
    },
    l.key
  )) });
}
function Cn(t) {
  const { DataTable: c } = ye, { Button: r } = L, { Link: a } = E;
  return G(), W.useBreadcrumbs([{ label: "Shop", href: N("commerce") }, { label: t.title }]), /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      X,
      {
        title: t.title,
        description: t.description,
        actions: t.createUrl || t.exportUrl ? /* @__PURE__ */ n("div", { className: "cm:flex cm:gap-2", children: [
          t.exportUrl ? /* @__PURE__ */ e(r, { asChild: !0, variant: "outline", children: /* @__PURE__ */ e("a", { href: t.exportUrl + window.location.search, children: "Export CSV" }) }) : null,
          t.createUrl ? /* @__PURE__ */ e(r, { asChild: !0, children: /* @__PURE__ */ e(a, { href: N(t.createUrl), children: t.createLabel ?? "New" }) }) : null
        ] }) : null
      }
    ),
    t.tabs && t.tabs.length > 1 && /* @__PURE__ */ e(_n, { items: t.tabs, current: t.currentTab ?? "", label: t.title }),
    /* @__PURE__ */ e(
      c,
      {
        ...t,
        bulkUrl: t.bulkUrl ? N(t.bulkUrl) : void 0,
        rowHref: (l) => l.href ? N(l.href) : null,
        renderCell: (l, i) => i.type === "badge" && l[i.key] != null ? /* @__PURE__ */ e(O, { tone: l[`${i.key}_tone`] ?? "neutral", children: String(l[i.key]) }) : void 0
      }
    )
  ] });
}
const wn = {
  "Commerce/Confirmations/Index": Kt,
  "Commerce/Customers/Show": Wt,
  "Commerce/Dashboard": Jt,
  "Commerce/Inventory/Index": Zt,
  "Commerce/Marketing/Editor": rn,
  "Commerce/Marketing/Report": ln,
  "Commerce/Orders/Editor": mn,
  "Commerce/Orders/Show": hn,
  "Commerce/Products/Index": gn,
  "Commerce/Reports/Show": fn,
  "Commerce/Settings/Section": xn,
  "Commerce/Settings/Emails": vn,
  "Commerce/Settings/Features": bn,
  "Commerce/Settings/Payments": yn,
  "Commerce/Settings/Shipping": kn,
  "Commerce/Shared/SchemaForm": Nn,
  "Commerce/Shared/ResourceIndex": Cn
};
function Sn() {
  Object.entries(wn).forEach(([t, c]) => W.registerPage(t, c));
}
function gt(t) {
  if (!t) return "";
  const c = new Date(t);
  if (Number.isNaN(c.getTime())) return "";
  const r = (a) => String(a).padStart(2, "0");
  return `${c.getFullYear()}-${r(c.getMonth() + 1)}-${r(c.getDate())}T${r(c.getHours())}:${r(c.getMinutes())}`;
}
function ft(t) {
  return t ? new Date(t).toISOString() : null;
}
function $n({ value: t, onChange: c, pathPrefix: r }) {
  const { Input: a, Label: l } = L, i = { start: t?.start ?? null, end: t?.end ?? null };
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(l, { htmlFor: `${r}-start`, children: "Starts" }),
      /* @__PURE__ */ e(
        a,
        {
          id: `${r}-start`,
          type: "datetime-local",
          value: gt(i.start),
          onChange: (m) => c({ ...i, start: ft(m.target.value) })
        }
      )
    ] }),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(l, { htmlFor: `${r}-end`, children: "Ends" }),
      /* @__PURE__ */ e(
        a,
        {
          id: `${r}-end`,
          type: "datetime-local",
          value: gt(i.end),
          onChange: (m) => c({ ...i, end: ft(m.target.value) })
        }
      )
    ] })
  ] });
}
function Dn({ field: t, value: c, onChange: r, errors: a, pathPrefix: l }) {
  return G(), /* @__PURE__ */ e(
    _e,
    {
      id: l,
      value: c,
      onChange: r,
      allowNull: t.config?.allow_null !== !1,
      invalid: !!(l && a?.[l])
    }
  );
}
function oe() {
  return (globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`).replace(/-/g, "").slice(0, 32);
}
function vt(t) {
  return Object.keys(t).sort().map((c) => `${c}=${t[c]}`).join("|");
}
function Fn(t) {
  let c = [{}];
  for (const r of t) {
    if (r.values.length === 0) return [];
    const a = [];
    for (const l of c)
      for (const i of r.values)
        a.push({ ...l, [r.id]: i.id });
    c = a;
  }
  return t.length === 0 ? [] : c;
}
function Tn(t, c, r, a = 100) {
  const l = new Map(c.map((i) => [vt(i.options), i]));
  return Fn(t).slice(0, a).map((i) => {
    const m = l.get(vt(i));
    return m ? { ...m, options: i } : { ...r, id: oe(), sku: null, options: i, active: !0, price: r.price ?? 0 };
  });
}
function St(t, c, r = {}) {
  return t.map((a) => {
    const l = a.values.find((i) => i.id === c.options[a.id]);
    return l ? l.label ?? (l.term_id ? r[l.term_id] ?? `#${l.term_id}` : "?") : "?";
  }).join(" / ");
}
function q({ label: t, hint: c, children: r, htmlFor: a, className: l }) {
  const { Label: i } = L;
  return /* @__PURE__ */ n("div", { className: le("cm:grid cm:gap-1.5", l), children: [
    /* @__PURE__ */ e(i, { htmlFor: a, children: t }),
    r,
    c && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: c })
  ] });
}
function $e({ children: t, cols: c = 3 }) {
  return /* @__PURE__ */ e("div", { className: le("cm:grid cm:gap-4", { 2: "cm:sm:grid-cols-2", 3: "cm:sm:grid-cols-2 cm:lg:grid-cols-3", 4: "cm:sm:grid-cols-2 cm:lg:grid-cols-4" }[c]), children: t });
}
function K({ id: t, value: c, onChange: r, min: a = 0, placeholder: l }) {
  const { Input: i } = L;
  return /* @__PURE__ */ e(
    i,
    {
      id: t,
      type: "number",
      inputMode: "numeric",
      min: a,
      value: c ?? "",
      placeholder: l,
      onChange: (m) => r(m.target.value === "" ? null : Math.round(Number(m.target.value)))
    }
  );
}
function De({ id: t, value: c, onChange: r, placeholder: a, onBlur: l }) {
  const { Input: i } = L;
  return /* @__PURE__ */ e(
    i,
    {
      id: t,
      value: c ?? "",
      placeholder: a,
      onBlur: l,
      onChange: (m) => r(m.target.value === "" ? null : m.target.value)
    }
  );
}
function be({ id: t, value: c, onChange: r, nullable: a = !0 }) {
  return /* @__PURE__ */ e(_e, { id: t, value: c, allowNull: a, onChange: r });
}
function Se({ id: t, label: c, checked: r, onChange: a, hint: l }) {
  const { Switch: i, Label: m } = L;
  return /* @__PURE__ */ n("div", { className: "cm:flex cm:items-start cm:gap-3", children: [
    /* @__PURE__ */ e(i, { id: t, checked: r, onCheckedChange: a }),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-0.5", children: [
      /* @__PURE__ */ e(m, { htmlFor: t, children: c }),
      l && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: l })
    ] })
  ] });
}
const jn = "cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm";
function ee({ id: t, value: c, onChange: r, options: a }) {
  return /* @__PURE__ */ e("select", { id: t, className: jn, value: c, onChange: (l) => r(l.target.value), children: a.map(([l, i]) => /* @__PURE__ */ e("option", { value: l, children: i }, l)) });
}
function re({ title: t, description: c, children: r, actions: a }) {
  return /* @__PURE__ */ n("section", { className: "cm:grid cm:gap-4", children: [
    /* @__PURE__ */ n("div", { className: "cm:flex cm:items-start cm:justify-between cm:gap-3", children: [
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-0.5", children: [
        /* @__PURE__ */ e("h3", { className: "cm:text-sm cm:font-semibold", children: t }),
        c && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: c })
      ] }),
      a
    ] }),
    r
  ] });
}
function qn({ value: t, update: c, path: r }) {
  const { Button: a, Input: l } = L, i = t.bundle ?? { pricing: "fixed", value: 0, items: [] }, [m, g] = F.useState({}), [x, p] = F.useState(""), [y, f] = F.useState([]), o = i.items.map((h) => h.variant_id).filter((h) => !!h);
  F.useEffect(() => {
    const h = o.filter((s) => !m[s]);
    h.length !== 0 && te(N(`commerce/api/variants?${h.map((s) => `ids[]=${s}`).join("&")}`)).then((s) => g((v) => ({ ...v, ...Object.fromEntries(s.data.map((b) => [b.id, b])) }))).catch(() => {
    });
  }, [o.join(",")]), F.useEffect(() => {
    if (x.trim().length < 2) return f([]);
    const h = setTimeout(() => te(N(`commerce/api/variants?q=${encodeURIComponent(x)}`)).then((s) => f(s.data)).catch(() => {
    }), 250);
    return () => clearTimeout(h);
  }, [x]);
  const u = (h) => c({ bundle: { ...i, ...h } }), C = i.items.reduce((h, s) => h + (m[s.variant_id ?? 0]?.price ?? 0) * s.quantity, 0);
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ n(re, { title: "Products in the bundle", description: "Bundles take their stock from these products.", children: [
      i.items.map((h, s) => /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ e("span", { className: "cm:flex-1 cm:text-sm", children: m[h.variant_id ?? 0]?.label ?? `#${h.variant_id}` }),
        /* @__PURE__ */ e("div", { className: "cm:w-24", children: /* @__PURE__ */ e(K, { min: 1, value: h.quantity, onChange: (v) => u({ items: i.items.map((b, _) => _ === s ? { ...b, quantity: v ?? 1 } : b) }) }) }),
        /* @__PURE__ */ e(a, { type: "button", variant: "ghost", size: "sm", onClick: () => u({ items: i.items.filter((v, b) => b !== s) }), children: "Remove" })
      ] }, s)),
      /* @__PURE__ */ n("div", { className: "cm:relative", children: [
        /* @__PURE__ */ e(l, { value: x, placeholder: "Search products or SKUs to add…", "aria-label": "Add a product to the bundle", onChange: (h) => p(h.target.value) }),
        y.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-10 cm:mt-1 cm:max-h-64 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: y.map((h) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "cm:flex cm:w-full cm:justify-between cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted",
            onClick: () => {
              g((s) => ({ ...s, [h.id]: h })), u({ items: [...i.items, { variant_id: h.id, quantity: 1 }] }), p("");
            },
            children: [
              /* @__PURE__ */ n("span", { children: [
                h.label,
                h.sku && /* @__PURE__ */ n("span", { className: "cm:text-muted-foreground", children: [
                  " · ",
                  h.sku
                ] })
              ] }),
              /* @__PURE__ */ e("span", { children: me(h.price) })
            ]
          }
        ) }, h.id)) })
      ] })
    ] }),
    /* @__PURE__ */ e(re, { title: "Bundle price", description: `The products cost ${me(C)} together.`, children: /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(q, { label: "Price", htmlFor: `${r}-bundle-pricing`, children: /* @__PURE__ */ e(
        ee,
        {
          id: `${r}-bundle-pricing`,
          value: i.pricing,
          onChange: (h) => u({ pricing: h, value: 0 }),
          options: [["fixed", "Its own price (General tab)"], ["percent_off", "Total minus a percentage"], ["amount_off", "Total minus an amount"]]
        }
      ) }),
      i.pricing === "percent_off" && /* @__PURE__ */ e(q, { label: "Percent off", htmlFor: `${r}-bundle-value`, children: /* @__PURE__ */ e(K, { id: `${r}-bundle-value`, value: i.value / 100, onChange: (h) => u({ value: Math.round((h ?? 0) * 100) }) }) }),
      i.pricing === "amount_off" && /* @__PURE__ */ e(q, { label: "Amount off", htmlFor: `${r}-bundle-value`, children: /* @__PURE__ */ e(be, { id: `${r}-bundle-value`, value: i.value, nullable: !1, onChange: (h) => u({ value: h ?? 0 }) }) })
    ] }) })
  ] });
}
function Rn() {
  return decodeURIComponent(document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/)?.[1] ?? "");
}
function Pn({ value: t, update: c, path: r }) {
  const { Button: a } = L, [l, i] = F.useState(!1), m = F.useRef(null), g = t.delivery ?? { modes: ["link", "account"], download_limit: null, expiry_days: null }, x = (f) => c({ delivery: { ...g, ...f } }), p = (f, o) => c({ downloads: t.downloads.map((u, C) => C === f ? { ...u, ...o } : u) }), y = async (f) => {
    if (f?.length) {
      i(!0);
      try {
        const o = [];
        for (const u of Array.from(f)) {
          const C = new FormData();
          C.append("file", u);
          const h = await fetch(N("commerce/api/downloads"), { method: "POST", body: C, headers: { "X-XSRF-TOKEN": Rn(), Accept: "application/json" }, credentials: "same-origin" }), s = await h.json();
          if (!h.ok) throw new Error(s.message ?? "Upload failed");
          o.push({ id: oe(), type: "file", file_id: s.data.id, url: null, name: u.name.replace(/\.[^.]+$/, ""), file: s.data });
        }
        c({ downloads: [...t.downloads, ...o] });
      } catch (o) {
        Re.error(o instanceof Error ? o.message : "Upload failed");
      } finally {
        i(!1), m.current && (m.current.value = "");
      }
    }
  };
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ n(
      re,
      {
        title: "Files and links",
        description: "Files are stored privately and only served to customers who bought them.",
        actions: /* @__PURE__ */ n("div", { className: "cm:flex cm:gap-2", children: [
          /* @__PURE__ */ e(a, { type: "button", variant: "outline", size: "sm", disabled: l, onClick: () => m.current?.click(), children: l ? "Uploading…" : "Upload file" }),
          /* @__PURE__ */ e(a, { type: "button", variant: "outline", size: "sm", onClick: () => c({ downloads: [...t.downloads, { id: oe(), type: "url", file_id: null, url: null, name: "" }] }), children: "Add link" }),
          /* @__PURE__ */ e("input", { ref: m, type: "file", multiple: !0, hidden: !0, onChange: (f) => y(f.target.files) })
        ] }),
        children: [
          t.downloads.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No files yet." }),
          t.downloads.map((f, o) => /* @__PURE__ */ n("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(q, { label: "Name", htmlFor: `${r}-dl-${o}`, children: /* @__PURE__ */ e(De, { id: `${r}-dl-${o}`, value: f.name, onChange: (u) => p(o, { name: u ?? "" }) }) }),
            f.type === "url" ? /* @__PURE__ */ e(q, { label: "Link", htmlFor: `${r}-dl-${o}-url`, children: /* @__PURE__ */ e(De, { id: `${r}-dl-${o}-url`, value: f.url, placeholder: "https://", onChange: (u) => p(o, { url: u }) }) }) : /* @__PURE__ */ e(q, { label: "File", children: /* @__PURE__ */ e("p", { className: "cm:truncate cm:text-sm cm:text-muted-foreground", children: f.file?.filename ?? `File #${f.file_id}` }) }),
            /* @__PURE__ */ e(a, { type: "button", variant: "ghost", size: "sm", onClick: () => c({ downloads: t.downloads.filter((u, C) => C !== o) }), children: "Remove" })
          ] }, f.id ?? o))
        ]
      }
    ),
    /* @__PURE__ */ n(re, { title: "Delivery", children: [
      /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-3", children: [["attachment", "Attach files to the email"], ["link", "Download links in the email"], ["account", "Library in My Account"]].map(([f, o]) => /* @__PURE__ */ e(
        Se,
        {
          id: `${r}-mode-${f}`,
          label: o,
          checked: g.modes.includes(f),
          onChange: (u) => x({ modes: u ? [...g.modes, f] : g.modes.filter((C) => C !== f) })
        },
        f
      )) }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
        /* @__PURE__ */ e(q, { label: "Downloads per file", htmlFor: `${r}-limit`, hint: "Empty: unlimited.", children: /* @__PURE__ */ e(K, { id: `${r}-limit`, min: 1, value: g.download_limit, onChange: (f) => x({ download_limit: f }) }) }),
        /* @__PURE__ */ e(q, { label: "Links expire after (days)", htmlFor: `${r}-expiry`, hint: "Empty: never.", children: /* @__PURE__ */ e(K, { id: `${r}-expiry`, min: 1, value: g.expiry_days, onChange: (f) => x({ expiry_days: f }) }) })
      ] })
    ] })
  ] });
}
function $t({ id: t, value: c, onChange: r, entryId: a }) {
  const [l, i] = F.useState(null);
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
    /* @__PURE__ */ e(De, { id: t, value: c, onChange: (g) => {
      i(null), r(g);
    }, onBlur: () => {
      if (!c) return i(null);
      const g = new URLSearchParams({ sku: c, entry: String(a ?? 0) });
      te(N(`commerce/api/sku-check?${g}`)).then((x) => i(x.available ? null : x.product ?? "another product")).catch(() => i(null));
    } }),
    l && /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-destructive", children: [
      "Already used by ",
      l,
      "."
    ] })
  ] });
}
const Ln = [
  ["default", "Follow the store (selling mode)"],
  ["cart", "Add to cart"],
  ["inquiry", "Inquiry form"],
  ["whatsapp", "Ask on WhatsApp"],
  ["external", "Links to other shops"],
  ["none", "No button (display only)"]
];
function On({ value: t, update: c, updateVariant: r, config: a, entryId: l, path: i }) {
  const { Button: m } = L, g = [["simple", "Simple product"]];
  (a.features.variants || t.type === "variable") && g.push(["variable", "Variable product (sizes, colors…)"]), (a.features.bundles || t.type === "bundle") && g.push(["bundle", "Bundle of other products"]);
  const x = t.variants[0];
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ n($e, { cols: 2, children: [
      /* @__PURE__ */ e(q, { label: "Product type", htmlFor: `${i}-type`, children: /* @__PURE__ */ e(ee, { id: `${i}-type`, value: t.type, options: g, onChange: (p) => c({ type: p }) }) }),
      /* @__PURE__ */ e(q, { label: "Button on the product page", htmlFor: `${i}-mode`, hint: "'Follow the store' uses the selling mode set in Settings → Store.", children: /* @__PURE__ */ e(ee, { id: `${i}-mode`, value: t.purchase_mode, options: Ln, onChange: (p) => c({ purchase_mode: p }) }) })
    ] }),
    t.type !== "variable" && x && /* @__PURE__ */ e(re, { title: "Price", children: /* @__PURE__ */ n($e, { cols: 4, children: [
      /* @__PURE__ */ e(q, { label: "Price", htmlFor: `${i}-price`, children: /* @__PURE__ */ e(be, { id: `${i}-price`, value: x.price, nullable: !1, onChange: (p) => r(0, { price: p ?? 0 }) }) }),
      /* @__PURE__ */ e(q, { label: "Compare-at price", htmlFor: `${i}-compare`, hint: "Shown struck through when higher.", children: /* @__PURE__ */ e(be, { id: `${i}-compare`, value: x.compare_at_price, onChange: (p) => r(0, { compare_at_price: p }) }) }),
      /* @__PURE__ */ e(q, { label: "Cost", htmlFor: `${i}-cost`, hint: "For profit reports; never shown.", children: /* @__PURE__ */ e(be, { id: `${i}-cost`, value: x.cost, onChange: (p) => r(0, { cost: p }) }) }),
      /* @__PURE__ */ e(q, { label: "SKU", htmlFor: `${i}-sku`, children: /* @__PURE__ */ e($t, { id: `${i}-sku`, value: x.sku, entryId: l, onChange: (p) => r(0, { sku: p }) }) })
    ] }) }),
    (t.purchase_mode === "external" || t.external_links.length > 0) && /* @__PURE__ */ e(
      re,
      {
        title: "Links to other shops",
        description: "Buttons such as 'Buy on Tokopedia'.",
        actions: t.external_links.length < 10 && /* @__PURE__ */ e(m, { type: "button", variant: "outline", size: "sm", onClick: () => c({ external_links: [...t.external_links, { preset: "tokopedia", label: null, url: null }] }), children: "Add link" }),
        children: t.external_links.map((p, y) => {
          const f = (o) => c({ external_links: t.external_links.map((u, C) => C === y ? { ...u, ...o } : u) });
          return /* @__PURE__ */ n("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[10rem_1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(q, { label: "Shop", htmlFor: `${i}-link-${y}-preset`, children: /* @__PURE__ */ e(
              ee,
              {
                id: `${i}-link-${y}-preset`,
                value: p.preset ?? "",
                onChange: (o) => f({ preset: o || null }),
                options: [...Object.entries(a.link_presets), ["", "Other…"]]
              }
            ) }),
            /* @__PURE__ */ e(q, { label: "Button label", htmlFor: `${i}-link-${y}-label`, children: /* @__PURE__ */ e(De, { id: `${i}-link-${y}-label`, value: p.label, placeholder: p.preset ? `Buy on ${a.link_presets[p.preset]}` : "", onChange: (o) => f({ label: o }) }) }),
            /* @__PURE__ */ e(q, { label: "Link", htmlFor: `${i}-link-${y}-url`, children: /* @__PURE__ */ e(De, { id: `${i}-link-${y}-url`, value: p.url, placeholder: "https://", onChange: (o) => f({ url: o }) }) }),
            /* @__PURE__ */ e(m, { type: "button", variant: "ghost", size: "sm", onClick: () => c({ external_links: t.external_links.filter((o, u) => u !== y) }), children: "Remove" })
          ] }, y);
        })
      }
    ),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(Se, { id: `${i}-shipping`, label: "Needs shipping", checked: t.requires_shipping, onChange: (p) => c({ requires_shipping: p }), hint: "Off for services and digital products." }),
      (a.features.digital || t.downloadable) && /* @__PURE__ */ e(Se, { id: `${i}-downloadable`, label: "Downloadable", checked: t.downloadable, onChange: (p) => c({ downloadable: p }), hint: "Customers get files or links after paying." }),
      /* @__PURE__ */ e(Se, { id: `${i}-featured`, label: "Featured", checked: t.featured, onChange: (p) => c({ featured: p }), hint: "Shown first when sorting by featured." })
    ] }),
    a.features.taxes && /* @__PURE__ */ e(q, { label: "Tax class", htmlFor: `${i}-tax`, children: /* @__PURE__ */ e(
      ee,
      {
        id: `${i}-tax`,
        value: t.tax_class ?? "",
        onChange: (p) => c({ tax_class: p || null }),
        options: [["", "Standard"], ...a.tax_classes.filter((p) => p !== "standard").map((p) => [p, p])]
      }
    ) })
  ] });
}
function En({ value: t, updateVariant: c, live: r, path: a }) {
  const l = t.variants[0];
  if (!l) return null;
  const i = r?.variants[l.id];
  return /* @__PURE__ */ n(re, { title: "Stock", children: [
    /* @__PURE__ */ e(
      Se,
      {
        id: `${a}-track`,
        label: "Track stock",
        checked: l.track_stock,
        onChange: (m) => c(0, { track_stock: m }),
        hint: "Count units: orders take them, cancellations give them back."
      }
    ),
    l.track_stock ? /* @__PURE__ */ n($e, { cols: 3, children: [
      i?.track_stock && i.stock_quantity !== null ? /* @__PURE__ */ e(q, { label: "In stock", hint: "Change it in Shop → Inventory, so every change is recorded.", children: /* @__PURE__ */ e("p", { className: "cm:text-2xl cm:font-semibold", children: i.stock_quantity }) }) : /* @__PURE__ */ e(q, { label: "Starting stock", htmlFor: `${a}-initial`, hint: "Set once, when the product is published.", children: /* @__PURE__ */ e(K, { id: `${a}-initial`, value: l.initial_stock, onChange: (m) => c(0, { initial_stock: m }) }) }),
      /* @__PURE__ */ e(q, { label: "When sold out", htmlFor: `${a}-backorders`, children: /* @__PURE__ */ e(
        ee,
        {
          id: `${a}-backorders`,
          value: l.backorders,
          onChange: (m) => c(0, { backorders: m }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }),
      /* @__PURE__ */ e(q, { label: "Low stock at", htmlFor: `${a}-low`, hint: "Empty: the store's setting.", children: /* @__PURE__ */ e(K, { id: `${a}-low`, value: l.low_stock_threshold, onChange: (m) => c(0, { low_stock_threshold: m }) }) })
    ] }) : /* @__PURE__ */ e(q, { label: "Stock status", htmlFor: `${a}-status`, children: /* @__PURE__ */ e(
      ee,
      {
        id: `${a}-status`,
        value: l.stock_status,
        onChange: (m) => c(0, { stock_status: m }),
        options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
      }
    ) })
  ] });
}
function In({ value: t, update: c, path: r }) {
  const { Button: a } = L, l = (i, m) => c({ tiers: t.tiers.map((g, x) => x === i ? { ...g, ...m } : g) });
  return /* @__PURE__ */ n(
    re,
    {
      title: "Bulk prices",
      description: "Lower unit prices for larger quantities. The best matching tier applies.",
      actions: t.tiers.length < 20 && /* @__PURE__ */ e(
        a,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          onClick: () => c({ tiers: [...t.tiers, { min_qty: (t.tiers.at(-1)?.min_qty ?? 1) + 9, type: "percent_off", value: 500, variant: null }] }),
          children: "Add tier"
        }
      ),
      children: [
        t.tiers.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No bulk prices." }),
        t.tiers.map((i, m) => /* @__PURE__ */ n("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[8rem_12rem_1fr_1fr_auto]", children: [
          /* @__PURE__ */ e(q, { label: "From (units)", htmlFor: `${r}-tier-${m}-min`, children: /* @__PURE__ */ e(K, { id: `${r}-tier-${m}-min`, min: 2, value: i.min_qty, onChange: (g) => l(m, { min_qty: g ?? 2 }) }) }),
          /* @__PURE__ */ e(q, { label: "Price", htmlFor: `${r}-tier-${m}-type`, children: /* @__PURE__ */ e(
            ee,
            {
              id: `${r}-tier-${m}-type`,
              value: i.type,
              onChange: (g) => l(m, { type: g, value: 0 }),
              options: [["percent_off", "Percent off"], ["amount_off", "Amount off per unit"], ["fixed_price", "Fixed unit price"]]
            }
          ) }),
          /* @__PURE__ */ e(q, { label: i.type === "percent_off" ? "Percent" : "Amount", htmlFor: `${r}-tier-${m}-value`, children: i.type === "percent_off" ? /* @__PURE__ */ e(K, { id: `${r}-tier-${m}-value`, value: i.value / 100, onChange: (g) => l(m, { value: Math.round((g ?? 0) * 100) }) }) : /* @__PURE__ */ e(be, { id: `${r}-tier-${m}-value`, value: i.value, nullable: !1, onChange: (g) => l(m, { value: g ?? 0 }) }) }),
          /* @__PURE__ */ e(q, { label: "For", htmlFor: `${r}-tier-${m}-variant`, children: /* @__PURE__ */ e(
            ee,
            {
              id: `${r}-tier-${m}-variant`,
              value: i.variant ?? "",
              onChange: (g) => l(m, { variant: g || null }),
              options: [["", "All variants"], ...t.type === "variable" ? t.variants.map((g) => [g.id, St(t.options, g)]) : []]
            }
          ) }),
          /* @__PURE__ */ e(a, { type: "button", variant: "ghost", size: "sm", onClick: () => c({ tiers: t.tiers.filter((g, x) => x !== m) }), children: "Remove" })
        ] }, m))
      ]
    }
  );
}
function An({ value: t, update: c, updateVariant: r, path: a }) {
  const l = t.variants[0];
  if (!l) return null;
  const i = (m) => t.type === "variable" ? c({ variants: t.variants.map((g) => ({ ...g, ...m })) }) : r(0, m);
  return /* @__PURE__ */ e(re, { title: "Package", description: t.type === "variable" ? "Applies to every variant; a variant can have its own weight under More." : "Used for shipping rates.", children: /* @__PURE__ */ n($e, { cols: 4, children: [
    /* @__PURE__ */ e(q, { label: "Weight (grams)", htmlFor: `${a}-weight`, children: /* @__PURE__ */ e(K, { id: `${a}-weight`, value: l.weight, onChange: (m) => i({ weight: m }) }) }),
    /* @__PURE__ */ e(q, { label: "Length (mm)", htmlFor: `${a}-length`, children: /* @__PURE__ */ e(K, { id: `${a}-length`, value: l.length, onChange: (m) => i({ length: m }) }) }),
    /* @__PURE__ */ e(q, { label: "Width (mm)", htmlFor: `${a}-width`, children: /* @__PURE__ */ e(K, { id: `${a}-width`, value: l.width, onChange: (m) => i({ width: m }) }) }),
    /* @__PURE__ */ e(q, { label: "Height (mm)", htmlFor: `${a}-height`, children: /* @__PURE__ */ e(K, { id: `${a}-height`, value: l.height, onChange: (m) => i({ height: m }) }) })
  ] }) });
}
const Je = {
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
function Bn(t) {
  const [c, r] = F.useState({}), a = t.filter((l) => !(l in c));
  return F.useEffect(() => {
    if (a.length === 0) return;
    const l = a.map((i) => `ids[]=${i}`).join("&");
    te(N(`api/terms?${l}`)).then((i) => r((m) => ({ ...m, ...Object.fromEntries(i.data.map((g) => [g.id, g.title])) }))).catch(() => {
    });
  }, [a.join(",")]), c;
}
function zn({ option: t, onChange: c, onRemove: r, config: a, path: l }) {
  const { Button: i, Input: m, Badge: g } = L, { FieldRenderer: x } = ye, [p, y] = F.useState(""), f = () => {
    const u = p.split(",").map((C) => C.trim()).filter(Boolean).filter((C) => !t.values.some((h) => (h.label ?? "").toLowerCase() === C.toLowerCase()));
    u.length && c({ ...t, values: [...t.values, ...u.map((C) => ({ id: oe(), label: C }))] }), y("");
  }, o = t.values.map((u) => u.term_id).filter((u) => !!u);
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-3 cm:rounded-md cm:border cm:p-3", children: [
    /* @__PURE__ */ n("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_1fr_auto]", children: [
      /* @__PURE__ */ e(q, { label: "Option name", htmlFor: `${l}-name`, children: /* @__PURE__ */ e(m, { id: `${l}-name`, value: t.name, placeholder: "Size", onChange: (u) => c({ ...t, name: u.target.value }) }) }),
      a.attribute_taxonomies.length > 0 ? /* @__PURE__ */ e(q, { label: "Values from", htmlFor: `${l}-source`, children: /* @__PURE__ */ e(
        ee,
        {
          id: `${l}-source`,
          value: t.taxonomy ?? "",
          onChange: (u) => c({ ...t, taxonomy: u || null, values: [] }),
          options: [["", "Custom values"], ...a.attribute_taxonomies.map((u) => [u.handle, u.title])]
        }
      ) }) : /* @__PURE__ */ e("div", {}),
      /* @__PURE__ */ e(i, { type: "button", variant: "ghost", size: "sm", onClick: r, children: "Remove option" })
    ] }),
    t.taxonomy ? /* @__PURE__ */ e(
      x,
      {
        fields: [{ handle: "terms", type: "terms", label: "Values", config: { taxonomy: t.taxonomy } }],
        values: { terms: o },
        pathPrefix: `${l}-terms`,
        onChange: (u) => {
          const C = u.terms ?? [], h = t.values.filter((v) => v.term_id && C.includes(v.term_id)), s = C.filter((v) => !h.some((b) => b.term_id === v)).map((v) => ({ id: oe(), term_id: v }));
          c({ ...t, values: [...h, ...s] });
        }
      }
    ) : /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-2", children: [
      /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: t.values.map((u) => /* @__PURE__ */ n(g, { variant: "secondary", className: "cm:gap-1", children: [
        u.label,
        /* @__PURE__ */ e("button", { type: "button", "aria-label": `Remove ${u.label}`, onClick: () => c({ ...t, values: t.values.filter((C) => C.id !== u.id) }), children: "×" })
      ] }, u.id)) }),
      /* @__PURE__ */ n("div", { className: "cm:flex cm:gap-2", children: [
        /* @__PURE__ */ e(
          m,
          {
            value: p,
            placeholder: "S, M, L",
            "aria-label": `Add values to ${t.name || "option"}`,
            onChange: (u) => y(u.target.value),
            onKeyDown: (u) => {
              u.key === "Enter" && (u.preventDefault(), f());
            }
          }
        ),
        /* @__PURE__ */ e(i, { type: "button", variant: "outline", onClick: f, children: "Add" })
      ] })
    ] })
  ] });
}
function Mn({ variant: t, index: c, updateVariant: r, tab: a }) {
  const { FieldRenderer: l } = ye, i = `${a.path}-v${c}`, m = a.live?.variants[t.id];
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-4 cm:bg-muted/40 cm:p-4", children: [
    /* @__PURE__ */ n($e, { cols: 4, children: [
      /* @__PURE__ */ e(q, { label: "Cost", htmlFor: `${i}-cost`, children: /* @__PURE__ */ e(be, { id: `${i}-cost`, value: t.cost, onChange: (g) => r(c, { cost: g }) }) }),
      /* @__PURE__ */ e(q, { label: "Barcode", htmlFor: `${i}-barcode`, children: /* @__PURE__ */ e(De, { id: `${i}-barcode`, value: t.barcode, onChange: (g) => r(c, { barcode: g }) }) }),
      /* @__PURE__ */ e(q, { label: "Weight (g)", htmlFor: `${i}-weight`, children: /* @__PURE__ */ e(K, { id: `${i}-weight`, value: t.weight, onChange: (g) => r(c, { weight: g }), placeholder: "Product's" }) }),
      /* @__PURE__ */ e(q, { label: "Min / max / step", htmlFor: `${i}-min`, children: /* @__PURE__ */ n("div", { className: "cm:grid cm:grid-cols-3 cm:gap-1", children: [
        /* @__PURE__ */ e(K, { id: `${i}-min`, min: 1, value: t.min_qty, onChange: (g) => r(c, { min_qty: g ?? 1 }) }),
        /* @__PURE__ */ e(K, { min: 1, value: t.max_qty, onChange: (g) => r(c, { max_qty: g }), placeholder: "–" }),
        /* @__PURE__ */ e(K, { min: 1, value: t.qty_step, onChange: (g) => r(c, { qty_step: g ?? 1 }) })
      ] }) })
    ] }),
    a.config.features.inventory && /* @__PURE__ */ n($e, { cols: 4, children: [
      /* @__PURE__ */ e(Se, { id: `${i}-track`, label: "Track stock", checked: t.track_stock, onChange: (g) => r(c, { track_stock: g }) }),
      t.track_stock && (m?.track_stock && m.stock_quantity !== null ? /* @__PURE__ */ e(q, { label: "In stock", children: /* @__PURE__ */ n("p", { className: "cm:text-sm", children: [
        m.stock_quantity,
        " ",
        /* @__PURE__ */ e("span", { className: "cm:text-muted-foreground", children: "(change it in Shop → Inventory)" })
      ] }) }) : /* @__PURE__ */ e(q, { label: "Starting stock", htmlFor: `${i}-initial`, children: /* @__PURE__ */ e(K, { id: `${i}-initial`, value: t.initial_stock, onChange: (g) => r(c, { initial_stock: g }) }) })),
      t.track_stock ? /* @__PURE__ */ e(q, { label: "When sold out", htmlFor: `${i}-backorders`, children: /* @__PURE__ */ e(
        ee,
        {
          id: `${i}-backorders`,
          value: t.backorders,
          onChange: (g) => r(c, { backorders: g }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }) : /* @__PURE__ */ e(q, { label: "Stock status", htmlFor: `${i}-status`, children: /* @__PURE__ */ e(
        ee,
        {
          id: `${i}-status`,
          value: t.stock_status,
          onChange: (g) => r(c, { stock_status: g }),
          options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
        }
      ) })
    ] }),
    /* @__PURE__ */ e(
      l,
      {
        fields: [{ handle: "image", type: "asset", label: "Image", config: { image_only: !0 } }],
        values: { image: t.image },
        pathPrefix: `${i}-image`,
        onChange: (g) => r(c, { image: g.image ?? null })
      }
    )
  ] });
}
function Un(t) {
  const { value: c, update: r, updateVariant: a, config: l, entryId: i, live: m } = t, { Button: g, Table: x, TableBody: p, TableCell: y, TableHead: f, TableHeader: o, TableRow: u, Switch: C } = L, [h, s] = F.useState(null), v = Bn(c.options.flatMap((D) => D.values.map(($) => $.term_id).filter(($) => !!$))), b = c.variants[0] ?? { ...Je, id: oe() }, _ = (D = c.options) => r({ options: D, variants: Tn(D, c.variants, { ...b, initial_stock: null, image: null }, l.max_variants) });
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ e(
      re,
      {
        title: "Options",
        description: `Up to ${l.max_options} options, such as size and color. Variants are made for every combination.`,
        actions: c.options.length < l.max_options && /* @__PURE__ */ e(g, { type: "button", variant: "outline", size: "sm", onClick: () => r({ options: [...c.options, { id: oe(), name: "", taxonomy: null, values: [] }] }), children: "Add option" }),
        children: c.options.map((D, $) => /* @__PURE__ */ e(
          zn,
          {
            option: D,
            config: l,
            path: `${t.path}-o${$}`,
            onChange: (k) => _(c.options.map((j, M) => M === $ ? k : j)),
            onRemove: () => _(c.options.filter((k, j) => j !== $))
          },
          D.id
        ))
      }
    ),
    /* @__PURE__ */ n(
      re,
      {
        title: `Variants (${c.variants.length})`,
        description: "Each has its own SKU, price and stock. Switch one off to stop selling it without losing it.",
        actions: /* @__PURE__ */ e(g, { type: "button", variant: "outline", size: "sm", onClick: () => _(), children: "Regenerate" }),
        children: [
          c.options.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "Add an option with values to create variants." }) : /* @__PURE__ */ e("div", { className: "cm:overflow-x-auto cm:rounded-md cm:border", children: /* @__PURE__ */ n(x, { children: [
            /* @__PURE__ */ e(o, { children: /* @__PURE__ */ n(u, { children: [
              /* @__PURE__ */ e(f, { children: "Variant" }),
              /* @__PURE__ */ e(f, { children: "SKU" }),
              /* @__PURE__ */ e(f, { children: "Price" }),
              /* @__PURE__ */ e(f, { children: "Compare-at" }),
              l.features.inventory && /* @__PURE__ */ e(f, { children: "Stock" }),
              /* @__PURE__ */ e(f, { children: "On sale" }),
              /* @__PURE__ */ e(f, {})
            ] }) }),
            /* @__PURE__ */ e(p, { children: c.variants.map((D, $) => {
              const k = m?.variants[D.id];
              return /* @__PURE__ */ n(F.Fragment, { children: [
                /* @__PURE__ */ n(u, { className: D.active ? "" : "cm:opacity-60", children: [
                  /* @__PURE__ */ e(y, { className: "cm:font-medium cm:whitespace-nowrap", children: St(c.options, D, v) }),
                  /* @__PURE__ */ e(y, { className: "cm:min-w-36", children: /* @__PURE__ */ e($t, { value: D.sku, entryId: i, onChange: (j) => a($, { sku: j }) }) }),
                  /* @__PURE__ */ e(y, { className: "cm:min-w-32", children: /* @__PURE__ */ e(be, { value: D.price, nullable: !1, onChange: (j) => a($, { price: j ?? 0 }) }) }),
                  /* @__PURE__ */ e(y, { className: "cm:min-w-32", children: /* @__PURE__ */ e(be, { value: D.compare_at_price, onChange: (j) => a($, { compare_at_price: j }) }) }),
                  l.features.inventory && /* @__PURE__ */ e(y, { className: "cm:whitespace-nowrap cm:text-sm", children: D.track_stock ? k?.stock_quantity ?? D.initial_stock ?? 0 : /* @__PURE__ */ e(O, { children: D.stock_status.replace("_", " ") }) }),
                  /* @__PURE__ */ e(y, { children: /* @__PURE__ */ e(C, { checked: D.active, "aria-label": "Sell this variant", onCheckedChange: (j) => a($, { active: j }) }) }),
                  /* @__PURE__ */ e(y, { children: /* @__PURE__ */ e(g, { type: "button", variant: "ghost", size: "sm", "aria-expanded": h === D.id, onClick: () => s(h === D.id ? null : D.id), children: h === D.id ? "Close" : "More" }) })
                ] }),
                h === D.id && /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(y, { colSpan: 7, className: "cm:p-0", children: /* @__PURE__ */ e(Mn, { variant: D, index: $, updateVariant: a, tab: t }) }) })
              ] }, D.id);
            }) })
          ] }) }),
          c.variants.length > 0 && /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
            "Prices from ",
            me(Math.min(...c.variants.map((D) => D.price))),
            " to ",
            me(Math.max(...c.variants.map((D) => D.price))),
            "."
          ] })
        ]
      }
    )
  ] });
}
function Hn(t) {
  const c = t ?? {}, r = (c.variants?.length ? c.variants : [{ ...Je, id: oe() }]).map((a) => ({ ...Je, ...a, id: a.id ?? oe() }));
  return {
    type: c.type ?? "simple",
    purchase_mode: c.purchase_mode ?? "default",
    external_links: c.external_links ?? [],
    requires_shipping: c.requires_shipping ?? !0,
    downloadable: c.downloadable ?? !1,
    featured: c.featured ?? !1,
    tax_class: c.tax_class ?? null,
    options: c.options ?? [],
    variants: r,
    bundle: c.bundle ?? null,
    downloads: c.downloads ?? [],
    delivery: c.delivery ?? null,
    tiers: c.tiers ?? []
  };
}
function Kn({ field: t, value: c, onChange: r, errors: a, pathPrefix: l = "data.product" }) {
  G();
  const i = t.config ?? {}, m = Hn(c), { props: g } = E.usePage(), x = g.entry?.id ?? null, [p, y] = F.useState(null);
  F.useEffect(() => {
    x && te(N(`commerce/api/products/${x}`)).then((_) => y(_.data)).catch(() => {
    });
  }, [x, g.entry]);
  const f = (_) => {
    const D = { ...m, ..._ };
    _.type && _.type !== "variable" && (D.options = [], D.variants = [{ ...D.variants[0], options: {} }]), _.type === "bundle" && !D.bundle && (D.bundle = { pricing: "fixed", value: 0, items: [] }), r(D);
  }, o = (_, D) => f({ variants: m.variants.map(($, k) => k === _ ? { ...$, ...D } : $) }), u = [{ key: "general", label: "General", render: (_) => /* @__PURE__ */ e(On, { ..._ }) }];
  m.type === "variable" && u.push({ key: "variants", label: "Variants", render: (_) => /* @__PURE__ */ e(Un, { ..._ }) }), m.type === "bundle" && u.push({ key: "bundle", label: "Bundle", render: (_) => /* @__PURE__ */ e(qn, { ..._ }) }), m.type !== "variable" && (i.features?.inventory ?? !0) && u.push({ key: "inventory", label: "Inventory", render: (_) => /* @__PURE__ */ e(En, { ..._ }) }), m.requires_shipping && u.push({ key: "shipping", label: "Shipping", render: (_) => /* @__PURE__ */ e(An, { ..._ }) }), (i.features?.pricing_rules !== !1 || m.tiers.length > 0) && u.push({ key: "pricing", label: "Bulk prices", render: (_) => /* @__PURE__ */ e(In, { ..._ }) }), m.downloadable && u.push({ key: "digital", label: "Digital", render: (_) => /* @__PURE__ */ e(Pn, { ..._ }) });
  for (const [_, D] of Object.entries(ve.productTabs()))
    u.push({ key: `ext-${_}`, label: D.label ?? _, render: ($) => /* @__PURE__ */ e(D, { ...$ }) });
  const [C, h] = F.useState("general"), s = u.find((_) => _.key === C) ?? u[0], v = a?.[l], b = { value: m, update: f, updateVariant: o, config: i, live: p, entryId: x, path: l.replace(/\W+/g, "-") };
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-4 cm:rounded-lg cm:border cm:p-4", children: [
    p?.sync_status === "failed" && /* @__PURE__ */ n("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: [
      "The published version couldn't be applied to the store, so it can't be bought: ",
      p.sync_error,
      ". Fix it and publish again."
    ] }),
    v && /* @__PURE__ */ e("p", { role: "alert", className: "cm:text-sm cm:text-destructive", children: v }),
    /* @__PURE__ */ e("div", { role: "tablist", "aria-label": "Product data", className: "cm:flex cm:flex-wrap cm:gap-1 cm:border-b", children: u.map((_) => /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": _.key === s.key,
        onClick: () => h(_.key),
        className: le("cm:-mb-px cm:border-b-2 cm:px-3 cm:py-2 cm:text-sm", _.key === s.key ? "cm:border-primary cm:font-medium" : "cm:border-transparent cm:text-muted-foreground cm:hover:text-foreground"),
        children: _.label
      },
      _.key
    )) }),
    /* @__PURE__ */ e("div", { role: "tabpanel", children: s.render(b) })
  ] });
}
const Wn = {
  commerce_money: Dn,
  commerce_datetime_range: $n,
  commerce_region: _t,
  commerce_targets: Nt,
  commerce_product: Kn
};
function Vn() {
  Object.entries(Wn).forEach(([t, c]) => W.registerField(t, c));
}
function Qn({ sales: t, orders: c, todo: r }) {
  const { Card: a, CardContent: l, CardHeader: i, CardTitle: m, CardDescription: g } = L, { Link: x } = E;
  return /* @__PURE__ */ n(a, { children: [
    /* @__PURE__ */ n(i, { children: [
      /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(x, { href: N("commerce"), className: "cm:hover:underline", children: "Store" }) }),
      /* @__PURE__ */ e(g, { children: "Today" })
    ] }),
    /* @__PURE__ */ n(l, { className: "cm:grid cm:gap-3", children: [
      t === void 0 ? /* @__PURE__ */ e("div", { className: "cm:h-12 cm:animate-pulse cm:rounded-md cm:bg-muted" }) : /* @__PURE__ */ n("div", { className: "cm:flex cm:items-baseline cm:justify-between", children: [
        /* @__PURE__ */ e("span", { className: "cm:text-2xl cm:font-semibold cm:tabular-nums", children: t }),
        /* @__PURE__ */ n("span", { className: "cm:text-sm cm:text-muted-foreground", children: [
          c,
          " ",
          c === 1 ? "order" : "orders"
        ] })
      ] }),
      r && r.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1 cm:text-sm", children: r.map((p) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ n(x, { href: N(p.href), className: "cm:flex cm:justify-between cm:hover:underline", children: [
        /* @__PURE__ */ e("span", { children: p.label }),
        /* @__PURE__ */ e("span", { className: "cm:font-semibold", children: p.count })
      ] }) }, p.key)) })
    ] })
  ] });
}
function Gn() {
  Object.assign(ve.components, { Chart: Ye, EmptyState: Ce, KpiCard: fe, MoneyInput: _e, PageHeader: X, SchemaFormView: Ze, SectionNav: wt, SettingsLayout: Fe, StatusBadge: O }), W.registerDashboardCard?.("commerce-store", Qn);
}
Ut();
Gn();
Vn();
Sn();
export {
  z as F,
  e as a,
  Ht as c,
  n as j
};
