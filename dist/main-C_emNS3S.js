const bt = { symbol: "Rp", position: "left", space: !1, thousands: ".", decimal: ",", decimals: 0 };
let Xe = bt;
function Mt(n) {
  Xe = { ...bt, ...n ?? {} };
}
function oe(n, c = Xe) {
  const r = n < 0, a = Math.abs(Math.round(n)), i = 10 ** c.decimals, l = Math.floor(a / i).toString().replace(/\B(?=(\d{3})+(?!\d))/g, c.thousands), o = c.decimals > 0 ? c.decimal + String(a % i).padStart(c.decimals, "0") : "", g = l + o, x = c.space ? " " : "", p = c.position === "left" ? `${c.symbol}${x}${g}` : `${g}${x}${c.symbol}`;
  return r ? `-${p}` : p;
}
function yt(n, c = Xe) {
  let r = n.replace(c.symbol, "").replace(/\s/g, "");
  const a = r.startsWith("-");
  r = r.replace(/^-/, "").split(c.thousands).join("");
  const [i, l = ""] = r.split(c.decimal);
  if (!/^\d*$/.test(i) || !/^\d*$/.test(l) || i + l === "")
    return null;
  const o = Number(i || "0") * 10 ** c.decimals + Number(l.padEnd(c.decimals, "0").slice(0, c.decimals) || "0");
  return a ? -o : o;
}
const ge = {
  orderPanels: {},
  dashboardWidgets: {},
  settingsSections: {},
  productTabs: {}
}, ve = {
  version: 1,
  registerOrderPanel: (n, c) => {
    ge.orderPanels[n] = c;
  },
  registerDashboardWidget: (n, c) => {
    ge.dashboardWidgets[n] = c;
  },
  registerSettingsSection: (n, c) => {
    ge.settingsSections[n] = c;
  },
  registerProductTab: (n, c) => {
    ge.productTabs[n] = c;
  },
  orderPanels: () => ge.orderPanels,
  dashboardWidgets: () => ge.dashboardWidgets,
  settingsSections: () => ge.settingsSections,
  productTabs: () => ge.productTabs,
  formatMoney: oe,
  parseMoney: yt,
  components: {}
};
function Ut() {
  window.SunriceCommerce = ve;
  const n = window.SunriceCommerceQueue ?? [];
  (() => {
    for (; n.length > 0; ) {
      const r = n.shift();
      try {
        r?.(ve);
      } catch (a) {
        console.error("SunriceCommerceQueue call failed", a);
      }
    }
  })(), n.push = ((...r) => (r.forEach((a) => a(ve)), n.length)), window.SunriceCommerceQueue = n;
}
const W = window.Sunrice, { React: F, ui: O, components: ye, inertia: E, fetchJson: te, toast: Re } = W;
function N(n = "") {
  return n.startsWith("/") ? n : W.adminUrl(n);
}
const xt = window.Sunrice.React, z = xt.Fragment;
function e(n, c, r) {
  return xt.createElement(n, r === void 0 ? c : { ...c, key: r });
}
const t = e;
function X({ title: n, description: c, actions: r }) {
  const { Head: a } = E;
  return /* @__PURE__ */ t("div", { className: "cm:flex cm:flex-wrap cm:items-start cm:justify-between cm:gap-4", children: [
    /* @__PURE__ */ e(a, { title: n }),
    /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e("h1", { className: "cm:text-xl cm:font-semibold cm:tracking-tight", children: n }),
      c && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: c })
    ] }),
    r && /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: r })
  ] });
}
function kt(n) {
  var c, r, a = "";
  if (typeof n == "string" || typeof n == "number") a += n;
  else if (typeof n == "object") if (Array.isArray(n)) {
    var i = n.length;
    for (c = 0; c < i; c++) n[c] && (r = kt(n[c])) && (a && (a += " "), a += r);
  } else for (r in n) n[r] && (a && (a += " "), a += r);
  return a;
}
function Ht() {
  for (var n, c, r = 0, a = "", i = arguments.length; r < i; r++) (n = arguments[r]) && (c = kt(n)) && (a && (a += " "), a += c);
  return a;
}
function de(...n) {
  return Ht(n);
}
const ot = {
  ok: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  success: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  warning: "cm:bg-amber-500/10 cm:text-amber-700 cm:dark:text-amber-400",
  error: "cm:bg-red-500/10 cm:text-red-700 cm:dark:text-red-400",
  info: "cm:bg-sky-500/10 cm:text-sky-700 cm:dark:text-sky-400",
  neutral: "cm:bg-muted cm:text-muted-foreground"
};
function L({ tone: n = "neutral", children: c }) {
  return /* @__PURE__ */ e("span", { className: de("cm:inline-flex cm:items-center cm:rounded-full cm:px-2 cm:py-0.5 cm:text-xs cm:font-medium", ot[n] ?? ot.neutral), children: c });
}
function Ce({ title: n, description: c, action: r }) {
  return /* @__PURE__ */ t("div", { className: "cm:flex cm:flex-col cm:items-center cm:gap-2 cm:rounded-lg cm:border cm:border-dashed cm:px-6 cm:py-10 cm:text-center", children: [
    /* @__PURE__ */ e("p", { className: "cm:font-medium", children: n }),
    c && /* @__PURE__ */ e("p", { className: "cm:max-w-md cm:text-sm cm:text-muted-foreground", children: c }),
    r && /* @__PURE__ */ e("div", { className: "cm:mt-2", children: r })
  ] });
}
function G() {
  const { props: n } = E.usePage(), c = n.commerce ?? {};
  return Mt(c.currency), c;
}
function Kt({ status: n, confirmations: c }) {
  const { Card: r, CardContent: a, Button: i, Input: l, Dialog: o, DialogContent: g, DialogFooter: x, DialogHeader: p, DialogTitle: y } = O, { Link: f, router: m } = E;
  G(), W.useBreadcrumbs([{ label: "Shop", href: N("commerce") }, { label: "Payments to verify" }]);
  const [u, C] = F.useState(null), [h, s] = F.useState(""), v = (b) => {
    const _ = b.expected_amount !== null && b.amount_value < b.expected_amount;
    _ && !window.confirm(`${b.amount} is less than the ${b.expected} expected. Approve anyway?`) || m.post(N(`commerce/confirmations/${b.id}/approve`), { anyway: _ }, { preserveScroll: !0 });
  };
  return /* @__PURE__ */ t("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-5xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(X, { title: "Payments to verify", description: "Customers' transfer confirmations. Compare the proof with the amount expected, then approve or reject." }),
    /* @__PURE__ */ e("div", { className: "cm:flex cm:gap-2", children: ["submitted", "approved", "rejected"].map((b) => /* @__PURE__ */ e(i, { size: "sm", variant: b === n ? "default" : "outline", asChild: !0, children: /* @__PURE__ */ e(f, { href: N(`commerce/confirmations?status=${b}`), children: b === "submitted" ? "Waiting" : b[0].toUpperCase() + b.slice(1) }) }, b)) }),
    c.length === 0 && /* @__PURE__ */ e(Ce, { title: n === "submitted" ? "Nothing to verify" : "None yet" }),
    c.map((b) => /* @__PURE__ */ e(r, { children: /* @__PURE__ */ t(a, { className: "cm:grid cm:gap-4 cm:pt-6 cm:md:grid-cols-[1fr_16rem]", children: [
      /* @__PURE__ */ t("div", { className: "cm:grid cm:content-start cm:gap-1 cm:text-sm", children: [
        /* @__PURE__ */ t("p", { className: "cm:text-base cm:font-medium", children: [
          /* @__PURE__ */ e(f, { href: N(b.order.href), className: "cm:hover:underline", children: b.order.number }),
          " · ",
          b.order.customer
        ] }),
        /* @__PURE__ */ t("p", { children: [
          "Sent ",
          /* @__PURE__ */ e("strong", { children: b.amount }),
          b.expected && /* @__PURE__ */ t(z, { children: [
            " · expected ",
            /* @__PURE__ */ e("strong", { children: b.expected })
          ] }),
          b.expected_amount !== null && b.amount_value < b.expected_amount && /* @__PURE__ */ t(z, { children: [
            " ",
            /* @__PURE__ */ e(L, { tone: "warning", children: "Less than expected" })
          ] })
        ] }),
        /* @__PURE__ */ t("p", { children: [
          "From ",
          b.sender_name,
          b.sender_bank ? ` (${b.sender_bank})` : "",
          " on ",
          b.transferred_at ?? "—"
        ] }),
        b.destination && /* @__PURE__ */ t("p", { children: [
          "Into ",
          b.destination.bank,
          " ",
          b.destination.number,
          " · ",
          b.destination.holder
        ] }),
        b.method && /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: b.method }),
        b.note && /* @__PURE__ */ t("p", { className: "cm:whitespace-pre-line cm:text-muted-foreground", children: [
          "“",
          b.note,
          "”"
        ] }),
        b.review_note && /* @__PURE__ */ t("p", { className: "cm:text-muted-foreground", children: [
          "Rejected: ",
          b.review_note
        ] }),
        b.status === "submitted" && /* @__PURE__ */ t("div", { className: "cm:mt-2 cm:flex cm:gap-2", children: [
          /* @__PURE__ */ e(i, { size: "sm", onClick: () => v(b), children: "Approve" }),
          /* @__PURE__ */ e(i, { size: "sm", variant: "outline", onClick: () => {
            C(b), s("");
          }, children: "Reject" })
        ] })
      ] }),
      /* @__PURE__ */ e("div", { children: b.proof_url ? b.proof_is_pdf ? /* @__PURE__ */ e("a", { href: b.proof_url, target: "_blank", rel: "noreferrer", className: "cm:underline", children: "Open the PDF proof" }) : /* @__PURE__ */ e("a", { href: b.proof_url, target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ e("img", { src: b.proof_url, alt: `Proof for ${b.order.number}`, className: "cm:max-h-72 cm:w-full cm:rounded-md cm:border cm:object-contain" }) }) : /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No proof attached." }) })
    ] }) }, b.id)),
    /* @__PURE__ */ e(o, { open: u !== null, onOpenChange: (b) => !b && C(null), children: /* @__PURE__ */ t(g, { children: [
      /* @__PURE__ */ e(p, { children: /* @__PURE__ */ e(y, { children: "Reject this confirmation?" }) }),
      /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "The customer is emailed the reason and can confirm again; the payment deadline resumes." }),
      /* @__PURE__ */ e(l, { "aria-label": "Reason", placeholder: "e.g. We haven't received the transfer yet", value: h, onChange: (b) => s(b.target.value) }),
      /* @__PURE__ */ t(x, { children: [
        /* @__PURE__ */ e(i, { variant: "outline", onClick: () => C(null), children: "Back" }),
        /* @__PURE__ */ e(i, { disabled: h.trim() === "", onClick: () => u && m.post(N(`commerce/confirmations/${u.id}/reject`), { reason: h }, { preserveScroll: !0, onSuccess: () => C(null) }), children: "Reject" })
      ] })
    ] }) })
  ] });
}
const We = (n) => n ? new Date(n).toLocaleDateString(void 0, { dateStyle: "medium" }) : "—";
function Wt({ customer: n, account: c, roleOptions: r, orders: a, can: i }) {
  const { Card: l, CardContent: o, CardHeader: g, CardTitle: x, Button: p, Input: y, Label: f, Textarea: m, Switch: u, Checkbox: C } = O, { Link: h, router: s } = E;
  G(), W.useBreadcrumbs([{ label: "Shop", href: N("commerce") }, { label: "Customers", href: N("commerce/customers") }, { label: n.name ?? n.email }]);
  const v = E.useForm({ name: n.name ?? "", phone: n.phone ?? "", note: n.note ?? "", accepts_marketing: n.accepts_marketing, roles: c?.roles ?? [] }), [b, _] = F.useState(!1), D = ($) => s.post(N(`commerce/customers/${n.id}/${$}`), {}, { preserveScroll: !0 });
  return /* @__PURE__ */ t("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-5xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      X,
      {
        title: n.name ?? n.email,
        description: /* @__PURE__ */ t(z, { children: [
          n.email,
          n.phone ? ` · ${n.phone}` : ""
        ] }),
        actions: /* @__PURE__ */ t(z, { children: [
          n.deletion_requested_at && /* @__PURE__ */ t(L, { tone: "warning", children: [
            "Deletion requested ",
            We(n.deletion_requested_at)
          ] }),
          c ? /* @__PURE__ */ e(L, { tone: "ok", children: "Registered" }) : /* @__PURE__ */ e(L, { children: "Guest" })
        ] })
      }
    ),
    /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-3", children: [["Orders", String(n.orders_count)], ["Spent", n.total_spent], ["Last order", We(n.last_order_at)]].map(([$, k]) => /* @__PURE__ */ e(l, { children: /* @__PURE__ */ t(o, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
      /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: $ }),
      /* @__PURE__ */ e("span", { className: "cm:text-xl cm:font-semibold", children: k })
    ] }) }, $)) }),
    /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[2fr_1fr]", children: [
      /* @__PURE__ */ t("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: "Orders" }) }),
          /* @__PURE__ */ e(o, { children: a.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No orders yet." }) : /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1", children: a.map(($) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ t(h, { href: N($.href), className: "cm:flex cm:justify-between cm:rounded cm:p-2 cm:hover:bg-muted", children: [
            /* @__PURE__ */ t("span", { children: [
              $.number,
              " · ",
              We($.date)
            ] }),
            /* @__PURE__ */ t("span", { children: [
              /* @__PURE__ */ e(L, { children: $.status }),
              " ",
              $.total
            ] })
          ] }) }, $.id)) }) })
        ] }),
        /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: "Addresses" }) }),
          /* @__PURE__ */ e(o, { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: n.addresses.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No saved addresses." }) : n.addresses.map(($) => /* @__PURE__ */ t("div", { className: "cm:rounded-md cm:border cm:p-3 cm:text-sm", children: [
            $.label && /* @__PURE__ */ e("p", { className: "cm:font-medium", children: $.label }),
            /* @__PURE__ */ e("p", { className: "cm:whitespace-pre-line", children: $.text }),
            /* @__PURE__ */ t("div", { className: "cm:mt-1 cm:flex cm:gap-1", children: [
              $.default_shipping && /* @__PURE__ */ e(L, { children: "Shipping" }),
              $.default_billing && /* @__PURE__ */ e(L, { children: "Billing" })
            ] })
          ] }, $.id)) })
        ] })
      ] }),
      /* @__PURE__ */ t("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: "Details" }) }),
          /* @__PURE__ */ e(o, { children: /* @__PURE__ */ t("form", { className: "cm:grid cm:gap-3", onSubmit: ($) => {
            $.preventDefault(), v.put(N(`commerce/customers/${n.id}`), { preserveScroll: !0 });
          }, children: [
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(f, { htmlFor: "c-name", children: "Name" }),
              /* @__PURE__ */ e(y, { id: "c-name", disabled: !i.edit, value: v.data.name, onChange: ($) => v.setData("name", $.target.value) })
            ] }),
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(f, { htmlFor: "c-phone", children: "Phone" }),
              /* @__PURE__ */ e(y, { id: "c-phone", disabled: !i.edit, value: v.data.phone, onChange: ($) => v.setData("phone", $.target.value) })
            ] }),
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(f, { htmlFor: "c-note", children: "Note (staff only)" }),
              /* @__PURE__ */ e(m, { id: "c-note", disabled: !i.edit, value: v.data.note, onChange: ($) => v.setData("note", $.target.value) })
            ] }),
            /* @__PURE__ */ t("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e(u, { id: "c-marketing", disabled: !i.edit, checked: v.data.accepts_marketing, onCheckedChange: ($) => v.setData("accepts_marketing", $) }),
              /* @__PURE__ */ e(f, { htmlFor: "c-marketing", children: "Accepts marketing" })
            ] }),
            c && /* @__PURE__ */ t("fieldset", { className: "cm:grid cm:gap-1.5", children: [
              /* @__PURE__ */ e("legend", { className: "cm:mb-1 cm:text-sm cm:font-medium", children: "Roles" }),
              r.map(($) => /* @__PURE__ */ t("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
                /* @__PURE__ */ e(
                  C,
                  {
                    disabled: !i.edit,
                    checked: v.data.roles.includes($),
                    onCheckedChange: (k) => v.setData("roles", k ? [...v.data.roles, $] : v.data.roles.filter((j) => j !== $))
                  }
                ),
                $
              ] }, $))
            ] }),
            i.edit && /* @__PURE__ */ e(p, { type: "submit", disabled: v.processing, children: "Save" })
          ] }) })
        ] }),
        c && /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: "Account" }) }),
          /* @__PURE__ */ t(o, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            /* @__PURE__ */ t("p", { children: [
              "Email ",
              c.email_verified ? "verified" : "not verified"
            ] }),
            c.google && /* @__PURE__ */ t("p", { children: [
              "Google: ",
              c.google
            ] }),
            i.edit && /* @__PURE__ */ e(p, { variant: "outline", size: "sm", onClick: () => D("password-reset"), children: "Send a password reset link" }),
            i.edit && !c.email_verified && /* @__PURE__ */ e(p, { variant: "outline", size: "sm", onClick: () => D("verify"), children: "Mark email verified" })
          ] })
        ] }),
        i.delete && !n.anonymized && /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: "Remove personal data" }) }),
          /* @__PURE__ */ t(o, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "Name, email, phone and addresses are deleted; orders keep their amounts." }),
            b ? /* @__PURE__ */ t("div", { className: "cm:flex cm:gap-2", children: [
              /* @__PURE__ */ e(p, { variant: "destructive", size: "sm", onClick: () => D("anonymize"), children: "Remove for good" }),
              /* @__PURE__ */ e(p, { variant: "outline", size: "sm", onClick: () => _(!1), children: "Cancel" })
            ] }) : /* @__PURE__ */ e(p, { variant: "outline", size: "sm", onClick: () => _(!0), children: "Anonymize" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
const Vt = F.lazy(() => import("./ChartImpl-DK9zx5lo.js"));
function Ye(n) {
  const c = /* @__PURE__ */ e("div", { className: "cm:animate-pulse cm:rounded-md cm:bg-muted", style: { height: n.height ?? 260 } });
  return /* @__PURE__ */ e(F.Suspense, { fallback: c, children: /* @__PURE__ */ e(Vt, { ...n }) });
}
function fe({ kpi: n }) {
  const { Card: c, CardContent: r } = O, { Link: a } = E, i = n.change ?? null, l = /* @__PURE__ */ t(r, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
    /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: n.label }),
    /* @__PURE__ */ e("span", { className: "cm:text-2xl cm:font-semibold cm:tabular-nums", children: n.value }),
    i !== null && /* @__PURE__ */ t(
      "span",
      {
        className: de("cm:text-xs cm:font-medium", i > 0 ? "cm:text-emerald-600" : i < 0 ? "cm:text-red-600" : "cm:text-muted-foreground"),
        title: "Compared with the previous period",
        children: [
          /* @__PURE__ */ e("span", { "aria-hidden": !0, children: i > 0 ? "▲" : i < 0 ? "▼" : "•" }),
          " ",
          Math.abs(i).toLocaleString(void 0, { maximumFractionDigits: 1 }),
          "%",
          /* @__PURE__ */ t("span", { className: "cm:sr-only", children: [
            i > 0 ? " up" : i < 0 ? " down" : "",
            " from the previous period"
          ] })
        ]
      }
    ),
    n.hint && /* @__PURE__ */ e("span", { className: "cm:text-xs cm:text-muted-foreground", children: n.hint })
  ] });
  return /* @__PURE__ */ e(c, { children: n.href ? /* @__PURE__ */ e(a, { href: N(n.href), className: "cm:block", children: l }) : l });
}
const Qt = { pending: "warning", on_hold: "warning", processing: "info", completed: "ok", cancelled: "neutral", refunded: "neutral", failed: "error" }, Gt = (n) => (/* @__PURE__ */ new Date(`${n}T00:00:00`)).toLocaleDateString(void 0, { day: "numeric", month: "short" });
function Jt({ mode: n, setup: c, health: r, period: a, analytics: i, canReports: l, kpis: o, sales: g, topProducts: x, todo: p, widgets: y, recentOrders: f }) {
  const { Card: m, CardContent: u, CardHeader: C, CardTitle: h, CardDescription: s, Button: v } = O, { Link: b } = E;
  G();
  const _ = c.filter((k) => !k.done), D = r.filter((k) => k.status !== "ok"), $ = Object.entries(ve.dashboardWidgets()).filter(([k]) => y !== void 0 && k in y);
  return /* @__PURE__ */ t("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(X, { title: "Store", description: /* @__PURE__ */ t(z, { children: [
      "Selling mode: ",
      n.label
    ] }) }),
    _.length > 0 && /* @__PURE__ */ t(m, { children: [
      /* @__PURE__ */ t(C, { children: [
        /* @__PURE__ */ e(h, { children: "Set up your store" }),
        /* @__PURE__ */ t(s, { children: [
          c.length - _.length,
          " of ",
          c.length,
          " done"
        ] })
      ] }),
      /* @__PURE__ */ e(u, { className: "cm:grid cm:gap-2", children: c.map((k) => /* @__PURE__ */ t(b, { href: N(k.href), className: "cm:flex cm:items-start cm:gap-3 cm:rounded-md cm:p-2 cm:hover:bg-muted", children: [
        /* @__PURE__ */ e("span", { "aria-hidden": !0, className: k.done ? "cm:text-emerald-600" : "cm:text-muted-foreground", children: k.done ? "✓" : "○" }),
        /* @__PURE__ */ t("span", { className: "cm:grid", children: [
          /* @__PURE__ */ e("span", { className: k.done ? "cm:text-muted-foreground cm:line-through" : "cm:font-medium", children: k.label }),
          k.description && /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: k.description })
        ] })
      ] }, k.key)) })
    ] }),
    D.length > 0 && /* @__PURE__ */ t(m, { children: [
      /* @__PURE__ */ e(C, { children: /* @__PURE__ */ e(h, { children: "Needs attention" }) }),
      /* @__PURE__ */ e(u, { className: "cm:grid cm:gap-3", children: D.map((k) => /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ t("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
          /* @__PURE__ */ e(L, { tone: k.status, children: k.status === "error" ? "Problem" : "Warning" }),
          /* @__PURE__ */ e("span", { className: "cm:font-medium", children: k.label })
        ] }),
        /* @__PURE__ */ e("p", { className: "cm:text-sm", children: k.message }),
        k.fix && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: k.fix })
      ] }, k.key)) })
    ] }),
    i && /* @__PURE__ */ t("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2", children: [
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
      l && /* @__PURE__ */ e(b, { href: N("commerce/reports/sales"), className: "cm:text-sm cm:underline", children: "All reports" })
    ] }),
    /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2 cm:lg:grid-cols-5", children: o === void 0 ? [0, 1, 2, 3, 4].map((k) => /* @__PURE__ */ e("div", { className: "cm:h-24 cm:animate-pulse cm:rounded-lg cm:bg-muted" }, k)) : o.map((k) => /* @__PURE__ */ e(fe, { kpi: k }, k.key)) }),
    i && /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-4 cm:lg:grid-cols-3", children: [
      /* @__PURE__ */ t(m, { className: "cm:lg:col-span-2", children: [
        /* @__PURE__ */ t(C, { children: [
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
            format: (k) => oe(k),
            series: [{ key: "total", label: "This period" }, { key: "previous", label: "Previous period", dashed: !0 }]
          }
        ) })
      ] }),
      /* @__PURE__ */ t(m, { children: [
        /* @__PURE__ */ e(C, { children: /* @__PURE__ */ e(h, { children: "Top products" }) }),
        /* @__PURE__ */ e(u, { children: x === void 0 ? /* @__PURE__ */ e("div", { className: "cm:h-40 cm:animate-pulse cm:rounded-md cm:bg-muted" }) : x.length === 0 ? /* @__PURE__ */ e(Ce, { title: "No sales yet", description: "Best sellers in this period show up here." }) : /* @__PURE__ */ e("ol", { className: "cm:grid cm:gap-2", children: x.map((k) => /* @__PURE__ */ t("li", { className: "cm:flex cm:justify-between cm:gap-2 cm:text-sm", children: [
          k.href ? /* @__PURE__ */ e(b, { href: N(k.href), className: "cm:truncate cm:hover:underline", children: k.title }) : /* @__PURE__ */ e("span", { className: "cm:truncate", children: k.title }),
          /* @__PURE__ */ t("span", { className: "cm:shrink-0 cm:tabular-nums cm:text-muted-foreground", children: [
            k.units,
            " · ",
            k.revenue
          ] })
        ] }, k.product_id)) }) })
      ] })
    ] }),
    /* @__PURE__ */ t(m, { children: [
      /* @__PURE__ */ e(C, { children: /* @__PURE__ */ e(h, { children: "To do" }) }),
      /* @__PURE__ */ e(u, { children: p === void 0 ? /* @__PURE__ */ e("div", { className: "cm:h-16 cm:animate-pulse cm:rounded-md cm:bg-muted" }) : p.length === 0 ? /* @__PURE__ */ e(Ce, { title: "Nothing to do", description: "Orders to process and payments to verify show up here." }) : /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1", children: p.map((k) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ t(b, { href: N(k.href), className: "cm:flex cm:justify-between cm:rounded-md cm:p-2 cm:hover:bg-muted", children: [
        /* @__PURE__ */ e("span", { children: k.label }),
        /* @__PURE__ */ e("span", { className: "cm:font-semibold", children: k.count })
      ] }) }, k.key)) }) })
    ] }),
    f !== void 0 && f.length > 0 && /* @__PURE__ */ t(m, { children: [
      /* @__PURE__ */ e(C, { children: /* @__PURE__ */ e(h, { children: "Recent orders" }) }),
      /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1", children: f.map((k) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ t(b, { href: N(k.href), className: "cm:grid cm:grid-cols-[1fr_auto] cm:items-center cm:gap-x-3 cm:rounded-md cm:p-2 cm:hover:bg-muted cm:sm:grid-cols-[8rem_1fr_auto_auto]", children: [
        /* @__PURE__ */ e("span", { className: "cm:font-medium", children: k.number }),
        /* @__PURE__ */ e("span", { className: "cm:truncate cm:text-muted-foreground", children: k.customer }),
        /* @__PURE__ */ e(L, { tone: Qt[k.status_key], children: k.status }),
        /* @__PURE__ */ e("span", { className: "cm:tabular-nums", children: k.total })
      ] }) }, k.id)) }) })
    ] }),
    $.map(([k, j]) => /* @__PURE__ */ e(j, { ...y?.[k] }, k))
  ] });
}
const Xt = { in_stock: "ok", out_of_stock: "error", backorder: "warning" };
function Yt({ row: n, reasons: c, onClose: r }) {
  const { Dialog: a, DialogContent: i, DialogHeader: l, DialogTitle: o, DialogDescription: g, DialogFooter: x, Button: p, Input: y, Label: f } = O, m = E.useForm({ mode: "add", quantity: 0, reason: "manual", note: "" }), [u, C] = F.useState(null);
  F.useEffect(() => {
    te(N(`commerce/inventory/${n.id}/history`)).then((s) => C(s.data)).catch(() => C([]));
  }, [n.id]);
  const h = m.data.mode === "set" ? m.data.quantity : (n.stock_quantity ?? 0) + m.data.quantity;
  return /* @__PURE__ */ e(a, { open: !0, onOpenChange: (s) => !s && r(), children: /* @__PURE__ */ t(i, { className: "cm:max-w-lg", children: [
    /* @__PURE__ */ t(l, { children: [
      /* @__PURE__ */ e(o, { children: "Adjust stock" }),
      /* @__PURE__ */ t(g, { children: [
        n.product_title,
        n.sku ? ` · ${n.sku}` : "",
        ". Now: ",
        n.track_stock ? n.stock_quantity ?? 0 : "not tracked",
        "."
      ] })
    ] }),
    /* @__PURE__ */ t("form", { id: "adjust-stock", className: "cm:grid cm:gap-3", onSubmit: (s) => {
      s.preventDefault(), m.post(N(`commerce/inventory/${n.id}/adjust`), { preserveScroll: !0, onSuccess: r });
    }, children: [
      /* @__PURE__ */ t("div", { className: "cm:grid cm:grid-cols-2 cm:gap-3", children: [
        /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(f, { htmlFor: "adjust-mode", children: "Change" }),
          /* @__PURE__ */ t("select", { id: "adjust-mode", className: "cm:h-9 cm:rounded-md cm:border cm:bg-background cm:px-3 cm:text-sm", value: m.data.mode, onChange: (s) => m.setData("mode", s.target.value), children: [
            /* @__PURE__ */ e("option", { value: "add", children: "Add or remove" }),
            /* @__PURE__ */ e("option", { value: "set", children: "Set to" })
          ] })
        ] }),
        /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(f, { htmlFor: "adjust-quantity", children: m.data.mode === "set" ? "New stock" : "Units (+/−)" }),
          /* @__PURE__ */ e(y, { id: "adjust-quantity", type: "number", value: m.data.quantity, onChange: (s) => m.setData("quantity", Number(s.target.value)) }),
          m.errors.quantity && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-destructive", children: m.errors.quantity })
        ] })
      ] }),
      /* @__PURE__ */ t("div", { className: "cm:grid cm:grid-cols-2 cm:gap-3", children: [
        /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(f, { htmlFor: "adjust-reason", children: "Reason" }),
          /* @__PURE__ */ e("select", { id: "adjust-reason", className: "cm:h-9 cm:rounded-md cm:border cm:bg-background cm:px-3 cm:text-sm", value: m.data.reason, onChange: (s) => m.setData("reason", s.target.value), children: c.map((s) => /* @__PURE__ */ e("option", { value: s, children: s[0].toUpperCase() + s.slice(1) }, s)) })
        ] }),
        /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(f, { htmlFor: "adjust-note", children: "Note" }),
          /* @__PURE__ */ e(y, { id: "adjust-note", value: m.data.note, onChange: (s) => m.setData("note", s.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ t("p", { className: "cm:text-sm", children: [
        "Stock after: ",
        /* @__PURE__ */ e("strong", { children: h })
      ] })
    ] }),
    /* @__PURE__ */ t("div", { className: "cm:grid cm:max-h-56 cm:gap-1 cm:overflow-auto cm:border-t cm:pt-3 cm:text-sm", children: [
      /* @__PURE__ */ e("p", { className: "cm:font-medium", children: "History" }),
      u === null ? /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "Loading…" }) : u.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "No changes yet." }) : u.map((s) => /* @__PURE__ */ t("div", { className: "cm:flex cm:justify-between cm:gap-3", children: [
        /* @__PURE__ */ t("span", { children: [
          s.delta > 0 ? `+${s.delta}` : s.delta,
          " → ",
          s.quantity_after,
          " · ",
          s.reason,
          s.reference ? ` (${s.reference.type} #${s.reference.id})` : "",
          s.note ? ` · ${s.note}` : ""
        ] }),
        /* @__PURE__ */ t("span", { className: "cm:whitespace-nowrap cm:text-muted-foreground", children: [
          s.user ? `${s.user}, ` : "",
          new Date(s.at).toLocaleString()
        ] })
      ] }, s.id))
    ] }),
    /* @__PURE__ */ t(x, { children: [
      /* @__PURE__ */ e(p, { variant: "outline", type: "button", onClick: r, children: "Cancel" }),
      /* @__PURE__ */ e(p, { type: "submit", form: "adjust-stock", disabled: m.processing, children: "Save" })
    ] })
  ] }) });
}
function Zt(n) {
  const { DataTable: c } = ye, [r, a] = F.useState(null);
  return G(), W.useBreadcrumbs([{ label: "Shop", href: N("commerce") }, { label: "Inventory" }]), /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(X, { title: "Inventory", description: "Stock of every product variant. Every change is recorded." }),
    /* @__PURE__ */ e(
      c,
      {
        ...n,
        searchPlaceholder: "Search products or SKUs…",
        onRowClick: n.can.adjust ? (i) => a(i) : void 0,
        renderCell: (i, l) => {
          if (l.key === "status") return /* @__PURE__ */ e(L, { tone: i.low ? "warning" : Xt[i.status], children: i.low ? "Low" : i.status.replace(/_/g, " ") });
          if (l.key === "stock_quantity") return i.track_stock ? i.stock_quantity : /* @__PURE__ */ e("span", { className: "cm:text-muted-foreground", children: "—" });
        }
      }
    ),
    r && /* @__PURE__ */ e(Yt, { row: r, reasons: n.reasons, onClose: () => a(null) })
  ] });
}
function mt(n) {
  switch (n?.input) {
    case "days":
      return 30;
    case "number":
      return 1;
    case "money":
      return 0;
    case "select":
      return n.options?.[0]?.value ?? "";
    case "products":
    case "categories":
      return [];
    case "text":
      return "";
    default:
      return null;
  }
}
function en(n) {
  const c = [];
  for (const [r, a] of Object.entries(n)) {
    let i = c.find(([l]) => l === a.group);
    i || (i = [a.group, []], c.push(i)), i[1].push([r, a]);
  }
  return c;
}
function Ve(n, c) {
  return n.rules.every((r) => {
    const a = c[r.rule];
    return a ? a.input === "none" ? !0 : a.input === "products" || a.input === "categories" ? Array.isArray(r.value) && r.value.length > 0 : a.input === "days" || a.input === "number" || a.input === "money" ? r.value !== "" && r.value !== null && Number(r.value) >= 0 : String(r.value ?? "").trim() !== "" : !1;
  });
}
function tn(n, c, r, a) {
  const i = `{${c}}`, l = r ?? n.length, o = a ?? l;
  return { text: n.slice(0, l) + i + n.slice(o), cursor: l + i.length };
}
function nn(n, c) {
  const r = /* @__PURE__ */ new Set();
  for (const a of n.matchAll(/\{([a-z_]+)(?:\|[^{}]*)?\}/g))
    c.includes(a[1]) || r.add(a[1]);
  return [...r];
}
function ze(n, c) {
  return c > 0 ? `${Math.round(n / c * 1e3) / 10}%` : "—";
}
function Nt({ field: n, value: c, onChange: r, pathPrefix: a }) {
  const { Input: i, Badge: l } = O, o = n.config ?? {}, g = Array.isArray(c) ? c : [], [x, p] = F.useState(""), [y, f] = F.useState([]), [m, u] = F.useState(!1);
  F.useEffect(() => {
    if (!m) return;
    const s = new URLSearchParams({ q: x });
    (o.types ?? []).forEach((b) => s.append("types[]", b)), (o.taxonomies ?? []).forEach((b) => s.append("taxonomies[]", b));
    const v = setTimeout(() => te(`${o.api}?${s}`).then((b) => f(b.data)).catch(() => f([])), 200);
    return () => clearTimeout(v);
  }, [x, m]);
  const C = (s) => g.some((v) => v.type === s.type && v.id === s.id), h = { product: "Product", variant: "Variant", term: "Category/brand" };
  return /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-2", children: [
    g.length > 0 && /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: g.map((s) => /* @__PURE__ */ t(l, { variant: "secondary", className: "cm:gap-1", children: [
      /* @__PURE__ */ t("span", { className: "cm:text-muted-foreground", children: [
        h[s.type],
        ":"
      ] }),
      " ",
      s.label,
      /* @__PURE__ */ e("button", { type: "button", "aria-label": `Remove ${s.label}`, onClick: () => r(g.filter((v) => !(v.type === s.type && v.id === s.id))), children: "×" })
    ] }, `${s.type}:${s.id}`)) }),
    /* @__PURE__ */ t("div", { className: "cm:relative", children: [
      /* @__PURE__ */ e(
        i,
        {
          id: a,
          value: x,
          placeholder: "Search products, SKUs, categories, brands…",
          onFocus: () => u(!0),
          onBlur: () => setTimeout(() => u(!1), 150),
          onChange: (s) => p(s.target.value)
        }
      ),
      m && y.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-20 cm:mt-1 cm:max-h-72 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: y.map((s) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ t(
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
function rn({ campaign: n, locales: c, mainLocale: r, rules: a, tags: i, triggers: l, templates: o, reachable: g, bodyFields: x, currency: p }) {
  const {
    Card: y,
    CardContent: f,
    CardHeader: m,
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
  } = O, { FieldRenderer: U, InputError: ae } = ye, { router: le } = E, d = n.type === "automation", B = d ? "commerce/marketing/automations" : "commerce/marketing/campaigns";
  G(), W.useBreadcrumbs([
    { label: "Shop", href: N("commerce") },
    { label: "Marketing", href: N("commerce/marketing") },
    { label: d ? "Automations" : "Campaigns", href: N(B) },
    { label: n.id ? n.name : "New" }
  ]);
  const Te = E.useForm({
    name: n.name,
    trigger: n.trigger ?? "",
    delay: n.delay ?? "",
    voucher_code: n.voucher_code,
    audience: n.audience,
    content: n.content
  }), { data: P, setData: xe, errors: Pe, processing: et, isDirty: Oe } = Te, [ue, Dt] = F.useState(r), [ie, tt] = F.useState(null), [Ft, nt] = F.useState(!1), [se, Tt] = F.useState(null), [ct, rt] = F.useState(!1), Le = F.useMemo(() => se ? URL.createObjectURL(new Blob([se.html], { type: "text/html" })) : null, [se]);
  F.useEffect(() => () => {
    Le && URL.revokeObjectURL(Le);
  }, [Le]);
  const [jt, Ee] = F.useState(!1), [Ie, qt] = F.useState(""), at = F.useRef(null), Ue = l.find((S) => S.key === P.trigger), lt = n.id !== null && !Oe, Rt = JSON.stringify(P.audience);
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
    rules: P.audience.rules.map((J, H) => H === S ? R.rule !== void 0 ? { rule: R.rule, value: mt(a[R.rule]) } : { ...J, ...R } : J)
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
  }, Ot = () => {
    const S = { preserveScroll: !0, onError: () => Re.error("Check the highlighted fields.") };
    n.id ? Te.put(N(`commerce/marketing/${n.id}`), S) : Te.post(N(d ? "commerce/marketing/automations" : "commerce/marketing/campaigns"), S);
  }, st = () => ({ content: P.content, audience: P.audience, voucher_code: P.voucher_code, locale: ue }), Lt = () => {
    rt(!0), te(N("commerce/marketing/preview"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(st())
    }).then(Tt).catch(() => Re.error("The preview couldn't be made.")).finally(() => rt(!1));
  }, Et = () => le.post(N("commerce/marketing/test"), st(), { preserveScroll: !0 }), It = (S) => {
    const R = o.find((J) => J.key === S);
    R && (Oe && !window.confirm("Replace the audience and texts with this template?") || xe({ ...P, audience: R.audience, content: { ...P.content, ...R.content }, name: P.name || R.label }));
  }, At = (S) => {
    const R = l.find((H) => H.key === S);
    if (!R) return;
    const J = Oe && !window.confirm(`Start from the "${R.label}" texts?`);
    xe({ ...P, trigger: S, delay: R.delay.default, content: J ? P.content : { ...P.content, ...R.content } });
  }, dt = P.content[ue] ?? { subject: "", preheader: "", body: "", button_label: "", button_url: "" }, Bt = Object.values(P.content).map((S) => `${S.subject} ${S.preheader} ${S.body} ${S.button_label} ${S.button_url}`).join(" "), Ke = nn(Bt, Object.keys(i)), he = (S) => Pe[S], Be = (S, R, J, H) => {
    const pe = `content.${ue}.${S}`;
    return /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1.5", children: [
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
  return /* @__PURE__ */ t("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      X,
      {
        title: n.id ? n.name : d ? "New automation" : "New campaign",
        description: d ? "Sent by itself to each customer the trigger finds, while it is on." : "Sent once, to the customers who match the audience and accept marketing.",
        actions: /* @__PURE__ */ t(z, { children: [
          n.id && /* @__PURE__ */ e(L, { tone: cn[n.status] ?? "neutral", children: n.status }),
          n.id && d && /* @__PURE__ */ t("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
            /* @__PURE__ */ e(
              b,
              {
                checked: n.status === "active",
                disabled: Oe,
                "aria-label": "Automation on",
                onCheckedChange: (S) => le.post(N(`commerce/marketing/${n.id}/status`), { active: S }, { preserveScroll: !0 })
              }
            ),
            n.status === "active" ? "On" : "Off"
          ] }),
          n.id && n.sent_count > 0 && /* @__PURE__ */ e(h, { variant: "outline", asChild: !0, children: /* @__PURE__ */ e(E.Link, { href: N(`commerce/marketing/${n.id}`), children: "Results" }) }),
          /* @__PURE__ */ e(h, { variant: "outline", onClick: Et, children: "Send me a test" }),
          /* @__PURE__ */ e(h, { onClick: Ot, disabled: et, children: et ? "Saving…" : "Save" }),
          !d && /* @__PURE__ */ e(h, { variant: "default", disabled: !lt, title: lt ? void 0 : "Save first", onClick: () => Ee(!0), children: "Send…" })
        ] })
      }
    ),
    n.status === "scheduled" && n.scheduled_at && /* @__PURE__ */ t("div", { role: "status", className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2 cm:rounded-md cm:border cm:border-sky-500/30 cm:bg-sky-500/5 cm:px-4 cm:py-3 cm:text-sm", children: [
      /* @__PURE__ */ t("span", { children: [
        "Scheduled for ",
        new Date(n.scheduled_at).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" }),
        ". Changes you save go out with it."
      ] }),
      /* @__PURE__ */ e(h, { size: "sm", variant: "outline", onClick: () => le.post(N(`commerce/marketing/${n.id}/unschedule`), {}, { preserveScroll: !0 }), children: "Back to draft" })
    ] }),
    Pe.campaign && /* @__PURE__ */ e("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-4 cm:py-3 cm:text-sm cm:text-destructive", children: Pe.campaign }),
    /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]", children: [
      /* @__PURE__ */ t("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        o.length > 0 && /* @__PURE__ */ t(y, { children: [
          /* @__PURE__ */ t(m, { children: [
            /* @__PURE__ */ e(u, { children: "Start from" }),
            /* @__PURE__ */ e(C, { children: "A template fills in the audience and the texts. You can change everything." })
          ] }),
          /* @__PURE__ */ e(f, { className: "cm:grid cm:gap-2 cm:sm:grid-cols-2", children: o.map((S) => /* @__PURE__ */ t(
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
        /* @__PURE__ */ t(y, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(u, { children: "Details" }) }),
          /* @__PURE__ */ t(f, { className: "cm:grid cm:gap-4", children: [
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1.5", children: [
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
            d && /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2", children: [
              /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1.5", children: [
                /* @__PURE__ */ e(v, { htmlFor: "trigger", children: "When" }),
                /* @__PURE__ */ t(j, { value: P.trigger, onValueChange: At, children: [
                  /* @__PURE__ */ e(ne, { id: "trigger", children: /* @__PURE__ */ e(ce, { placeholder: "Choose a trigger" }) }),
                  /* @__PURE__ */ e(M, { children: l.map((S) => /* @__PURE__ */ e(Y, { value: S.key, children: S.label }, S.key)) })
                ] }),
                Ue && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: Ue.description }),
                /* @__PURE__ */ e(ae, { message: he("trigger") })
              ] }),
              /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1.5", children: [
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
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1.5", children: [
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
              /* @__PURE__ */ t("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                "Shown where the text has ",
                "{voucher_code}",
                ". Create the voucher in Shop → Vouchers."
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ t(y, { children: [
          /* @__PURE__ */ t(m, { children: [
            /* @__PURE__ */ e(u, { children: "Audience" }),
            /* @__PURE__ */ e(C, { children: d ? "Optional: only customers who also match these rules get it." : `Customers who accept marketing (${g.toLocaleString()}), narrowed by these rules.` })
          ] }),
          /* @__PURE__ */ t(f, { className: "cm:grid cm:gap-3", children: [
            P.audience.rules.length > 1 && /* @__PURE__ */ t("div", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
              "Match",
              /* @__PURE__ */ t(j, { value: P.audience.match, onValueChange: (S) => Ae({ ...P.audience, match: S }), children: [
                /* @__PURE__ */ e(ne, { className: "cm:w-28", "aria-label": "Match", children: /* @__PURE__ */ e(ce, {}) }),
                /* @__PURE__ */ t(M, { children: [
                  /* @__PURE__ */ e(Y, { value: "all", children: "all rules" }),
                  /* @__PURE__ */ e(Y, { value: "any", children: "any rule" })
                ] })
              ] })
            ] }),
            P.audience.rules.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: d ? "No extra rules: everyone the trigger finds." : "No rules: everyone who accepts marketing." }),
            P.audience.rules.map((S, R) => {
              const J = a[S.rule];
              return /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-2 cm:rounded-md cm:border cm:p-3 cm:sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] cm:sm:items-start", children: [
                /* @__PURE__ */ t(j, { value: S.rule, onValueChange: (H) => it(R, { rule: H }), children: [
                  /* @__PURE__ */ e(ne, { "aria-label": "Rule", children: /* @__PURE__ */ e(ce, { placeholder: "Choose a rule" }) }),
                  /* @__PURE__ */ e(M, { children: en(a).map(([H, pe]) => /* @__PURE__ */ t(F.Fragment, { children: [
                    /* @__PURE__ */ e("div", { className: "cm:px-2 cm:pt-2 cm:pb-1 cm:text-xs cm:font-medium cm:text-muted-foreground", children: H }),
                    pe.map(([we, zt]) => /* @__PURE__ */ e(Y, { value: we, children: zt.label }, we))
                  ] }, H)) })
                ] }),
                /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
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
            /* @__PURE__ */ t("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-3", children: [
              /* @__PURE__ */ e(
                h,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  onClick: () => Ae({ ...P.audience, rules: [...P.audience.rules, { rule: "no_order_for_days", value: mt(a.no_order_for_days) }] }),
                  children: "Add rule"
                }
              ),
              /* @__PURE__ */ e("p", { className: "cm:text-sm", "aria-live": "polite", children: d && P.audience.rules.length === 0 ? null : Ve(P.audience, a) ? Ft || ie === null ? /* @__PURE__ */ e("span", { className: "cm:text-muted-foreground", children: "Counting…" }) : /* @__PURE__ */ t(z, { children: [
                /* @__PURE__ */ e("strong", { children: ie.count.toLocaleString() }),
                " ",
                ie.count === 1 ? "customer matches" : "customers match",
                d ? " these rules now" : ""
              ] }) : /* @__PURE__ */ e("span", { className: "cm:text-muted-foreground", children: "Fill in the rules to see who matches." }) })
            ] }),
            ie && ie.sample.length > 0 && Ve(P.audience, a) && !(d && P.audience.rules.length === 0) && /* @__PURE__ */ t("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
              "For example: ",
              ie.sample.map((S) => S.name || S.email).join(", ")
            ] })
          ] })
        ] }),
        /* @__PURE__ */ t(y, { children: [
          /* @__PURE__ */ t(m, { children: [
            /* @__PURE__ */ e(u, { children: "Email" }),
            /* @__PURE__ */ t(C, { children: [
              "Each customer gets it in their language; empty parts use ",
              c.find((S) => S.code === r)?.name ?? r,
              "."
            ] })
          ] }),
          /* @__PURE__ */ t(f, { className: "cm:grid cm:gap-4", children: [
            /* @__PURE__ */ t(_, { value: ue, onValueChange: Dt, children: [
              c.length > 1 && /* @__PURE__ */ e(D, { children: c.map((S) => /* @__PURE__ */ t($, { value: S.code, children: [
                S.name,
                S.code === r ? " (main)" : ""
              ] }, S.code)) }),
              c.map((S) => /* @__PURE__ */ e(k, { value: S.code, className: "cm:grid cm:gap-4 cm:pt-2", children: S.code === ue && /* @__PURE__ */ t(z, { children: [
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
                /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2", children: [
                  Be("button_label", "Button text", "Shop now", "Optional. Leave empty for no button."),
                  Be("button_url", "Button link", "{store_url}", "https://…, /a-page, or a smart tag like {cart_url}.")
                ] })
              ] }) }, S.code))
            ] }),
            Ke.length > 0 && /* @__PURE__ */ t("p", { role: "alert", className: "cm:text-sm cm:text-amber-700 cm:dark:text-amber-400", children: [
              "Unknown smart ",
              Ke.length === 1 ? "tag" : "tags",
              ": ",
              Ke.map((S) => `{${S}}`).join(", "),
              ". They will be sent as typed."
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ t("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ t(y, { children: [
          /* @__PURE__ */ t(m, { children: [
            /* @__PURE__ */ e(u, { children: "Smart tags" }),
            /* @__PURE__ */ t(C, { children: [
              "Replaced for each customer. Click one to put it in the subject, preview text or button you were editing (or to copy it for the text). Add a fallback after a bar: ",
              "{first_name|there}",
              "."
            ] })
          ] }),
          /* @__PURE__ */ e(f, { children: /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1", children: Object.entries(i).map(([S, R]) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ t(
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
        /* @__PURE__ */ t(y, { children: [
          /* @__PURE__ */ t(m, { children: [
            /* @__PURE__ */ e(u, { children: "Preview" }),
            /* @__PURE__ */ t(C, { children: [
              "With the first matching customer",
              se ? ` (${se.to})` : "",
              ", in the language you are editing."
            ] })
          ] }),
          /* @__PURE__ */ t(f, { className: "cm:grid cm:gap-3", children: [
            /* @__PURE__ */ e(h, { type: "button", variant: "outline", onClick: Lt, disabled: ct, children: ct ? "Rendering…" : se ? "Refresh preview" : "Show preview" }),
            se && /* @__PURE__ */ t(z, { children: [
              /* @__PURE__ */ t("p", { className: "cm:text-sm", children: [
                /* @__PURE__ */ e("span", { className: "cm:text-muted-foreground", children: "Subject:" }),
                " ",
                se.subject
              ] }),
              /* @__PURE__ */ e(
                "a",
                {
                  className: "cm:text-xs cm:underline cm:text-muted-foreground",
                  target: "_blank",
                  rel: "noreferrer",
                  href: Le ?? void 0,
                  children: "Open full size"
                }
              ),
              /* @__PURE__ */ e("iframe", { title: "Email preview", srcDoc: se.html, sandbox: "", className: "cm:h-[32rem] cm:w-full cm:rounded-md cm:border cm:bg-white" })
            ] })
          ] })
        ] }),
        n.id && /* @__PURE__ */ t("div", { className: "cm:flex cm:flex-wrap cm:gap-2", children: [
          /* @__PURE__ */ e(h, { type: "button", variant: "ghost", size: "sm", onClick: () => le.post(N(`commerce/marketing/${n.id}/duplicate`)), children: "Duplicate" }),
          /* @__PURE__ */ e(
            h,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              className: "cm:text-destructive",
              onClick: () => window.confirm(`Delete "${n.name}"? Its results go too.`) && le.delete(N(`commerce/marketing/${n.id}`)),
              children: "Delete"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e(w, { open: jt, onOpenChange: Ee, children: /* @__PURE__ */ t(I, { children: [
      /* @__PURE__ */ t(A, { children: [
        /* @__PURE__ */ t(Q, { children: [
          'Send "',
          n.name,
          '"'
        ] }),
        /* @__PURE__ */ t(T, { children: [
          ie ? `${ie.count.toLocaleString()} ${ie.count === 1 ? "customer" : "customers"} match now.` : "",
          " The audience is counted again when sending starts; each customer gets it once."
        ] })
      ] }),
      /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1.5", children: [
        /* @__PURE__ */ e(v, { htmlFor: "send_at", children: "Send at (optional)" }),
        /* @__PURE__ */ e(s, { id: "send_at", type: "datetime-local", value: Ie, onChange: (S) => qt(S.target.value) }),
        /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: "Empty: now. Emails go out in the background, in batches." }),
        /* @__PURE__ */ e(ae, { message: he("at") })
      ] }),
      /* @__PURE__ */ t(V, { children: [
        /* @__PURE__ */ e(h, { variant: "outline", onClick: () => Ee(!1), children: "Not yet" }),
        /* @__PURE__ */ e(h, { onClick: () => le.post(N(`commerce/marketing/${n.id}/send`), Ie ? { at: new Date(Ie).toISOString() } : {}, {
          preserveScroll: !0,
          onSuccess: () => Ee(!1)
        }), children: Ie ? "Schedule" : "Send now" })
      ] })
    ] }) })
  ] });
}
function an({ def: n, value: c, currency: r, path: a, onChange: i }) {
  const { Input: l, Select: o, SelectContent: g, SelectItem: x, SelectTrigger: p, SelectValue: y } = O;
  if (!n || n.input === "none") return /* @__PURE__ */ e("span", { className: "cm:self-center cm:text-sm cm:text-muted-foreground", children: "—" });
  if (n.input === "select")
    return /* @__PURE__ */ t(o, { value: String(c ?? ""), onValueChange: i, children: [
      /* @__PURE__ */ e(p, { "aria-label": n.label, children: /* @__PURE__ */ e(y, { placeholder: "Choose" }) }),
      /* @__PURE__ */ e(g, { children: (n.options ?? []).map((m) => /* @__PURE__ */ e(x, { value: m.value, children: m.label }, m.value)) })
    ] });
  if (n.input === "products" || n.input === "categories") {
    const m = { handle: a, type: "commerce_targets", config: { api: N("commerce/api/targets"), types: n.input === "products" ? ["product"] : ["term"] } }, u = (Array.isArray(c) ? c : []).map((C) => ({ ...C, type: n.input === "products" ? "product" : "term" }));
    return /* @__PURE__ */ e(Nt, { field: m, value: u, pathPrefix: a, onChange: (C) => i((C ?? []).map((h) => ({ id: h.id, label: h.label }))) });
  }
  const f = n.input === "days" || n.input === "number" || n.input === "money";
  return /* @__PURE__ */ t("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
    n.input === "money" && /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: r }),
    /* @__PURE__ */ e(
      l,
      {
        "aria-label": n.label,
        type: f ? "number" : "text",
        min: f ? 0 : void 0,
        value: String(c ?? ""),
        onChange: (m) => i(f && m.target.value !== "" ? Number(m.target.value) : m.target.value)
      }
    ),
    n.input === "days" && /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: "days" })
  ] });
}
const Qe = (n) => `${n.toLocaleString()} ${n === 1 ? "person" : "people"}`, je = (n) => n ? new Date(n).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" }) : "—", ut = { sent: "ok", queued: "info", sending: "info", failed: "error", skipped: "neutral", active: "ok", paused: "warning", cancelled: "error", scheduled: "info" };
function ln({ campaign: n, stats: c, links: r, recipients: a }) {
  const { Card: i, CardContent: l, CardHeader: o, CardTitle: g, CardDescription: x, Button: p, Table: y, TableBody: f, TableCell: m, TableHead: u, TableHeader: C, TableRow: h } = O, { router: s, Link: v } = E, b = n.type === "automation";
  return G(), W.useBreadcrumbs([
    { label: "Shop", href: N("commerce") },
    { label: "Marketing", href: N("commerce/marketing") },
    { label: b ? "Automations" : "Campaigns", href: N(b ? "commerce/marketing/automations" : "commerce/marketing/campaigns") },
    { label: n.name }
  ]), F.useEffect(() => {
    if (c.queued === 0 && n.status !== "sending") return;
    const _ = setInterval(() => s.reload({ only: ["campaign", "stats", "links", "recipients"] }), 5e3);
    return () => clearInterval(_);
  }, [c.queued, n.status]), /* @__PURE__ */ t("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      X,
      {
        title: n.name,
        description: /* @__PURE__ */ t(z, { children: [
          "Subject: ",
          n.subject,
          n.trigger ? ` · ${n.trigger}` : "",
          n.started_at ? ` · started ${je(n.started_at)}` : "",
          n.finished_at ? `, finished ${je(n.finished_at)}` : ""
        ] }),
        actions: /* @__PURE__ */ t(z, { children: [
          /* @__PURE__ */ e(L, { tone: ut[n.status] ?? "neutral", children: n.status }),
          n.status === "sending" && /* @__PURE__ */ e(p, { variant: "outline", onClick: () => window.confirm("Stop sending? Emails not yet sent won't go out.") && s.post(N(`commerce/marketing/${n.id}/cancel`), {}, { preserveScroll: !0 }), children: "Stop sending" }),
          n.editable && /* @__PURE__ */ e(p, { variant: "outline", asChild: !0, children: /* @__PURE__ */ e(v, { href: N(`commerce/marketing/${n.id}/edit`), children: "Edit" }) }),
          /* @__PURE__ */ e(p, { variant: "outline", onClick: () => s.post(N(`commerce/marketing/${n.id}/duplicate`)), children: "Duplicate" })
        ] })
      }
    ),
    n.status === "sending" && c.recipients === 0 && /* @__PURE__ */ e("p", { role: "status", className: "cm:rounded-md cm:border cm:border-sky-500/30 cm:bg-sky-500/5 cm:px-4 cm:py-3 cm:text-sm", children: "Finding the recipients. The queue worker does this in the background (php artisan queue:work)." }),
    c.queued > 0 && /* @__PURE__ */ t("p", { role: "status", className: "cm:rounded-md cm:border cm:border-sky-500/30 cm:bg-sky-500/5 cm:px-4 cm:py-3 cm:text-sm", children: [
      c.queued.toLocaleString(),
      " ",
      c.queued === 1 ? "email is" : "emails are",
      " waiting to be sent by the queue worker."
    ] }),
    /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2 cm:lg:grid-cols-5", children: [
      /* @__PURE__ */ e(fe, { kpi: { key: "sent", label: "Sent", value: c.sent.toLocaleString(), hint: c.failed > 0 ? `${c.failed} failed` : `of ${c.recipients.toLocaleString()} recipients` } }),
      /* @__PURE__ */ e(fe, { kpi: { key: "opened", label: "Opened", value: ze(c.opened, c.sent), hint: Qe(c.opened) } }),
      /* @__PURE__ */ e(fe, { kpi: { key: "clicked", label: "Clicked", value: ze(c.clicked, c.sent), hint: Qe(c.clicked) } }),
      /* @__PURE__ */ e(fe, { kpi: { key: "ctor", label: "Clicked after opening", value: ze(c.clicked, c.opened), hint: "Of those who opened" } }),
      /* @__PURE__ */ e(fe, { kpi: { key: "unsubscribed", label: "Unsubscribed", value: ze(c.unsubscribed, c.sent), hint: Qe(c.unsubscribed) } })
    ] }),
    /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: "Opens are counted when the email's images load, so they are approximate: some inboxes load images for everyone, others never. A click also counts as an open." }),
    /* @__PURE__ */ t(i, { children: [
      /* @__PURE__ */ t(o, { children: [
        /* @__PURE__ */ e(g, { children: "Links" }),
        /* @__PURE__ */ e(x, { children: "Clicks on each link in the email." })
      ] }),
      /* @__PURE__ */ e(l, { className: "cm:p-0", children: r.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:px-6 cm:pb-6 cm:text-sm cm:text-muted-foreground", children: "No clicks yet." }) : /* @__PURE__ */ t(y, { children: [
        /* @__PURE__ */ e(C, { children: /* @__PURE__ */ t(h, { children: [
          /* @__PURE__ */ e(u, { children: "Link" }),
          /* @__PURE__ */ e(u, { className: "cm:text-right", children: "People" }),
          /* @__PURE__ */ e(u, { className: "cm:text-right", children: "Clicks" })
        ] }) }),
        /* @__PURE__ */ e(f, { children: r.map((_) => /* @__PURE__ */ t(h, { children: [
          /* @__PURE__ */ e(m, { className: "cm:max-w-md cm:truncate", children: /* @__PURE__ */ e("a", { href: _.url, target: "_blank", rel: "noreferrer", className: "cm:hover:underline", children: _.url }) }),
          /* @__PURE__ */ e(m, { className: "cm:text-right cm:tabular-nums", children: _.unique_clicks }),
          /* @__PURE__ */ e(m, { className: "cm:text-right cm:tabular-nums", children: _.clicks })
        ] }, _.url)) })
      ] }) })
    ] }),
    /* @__PURE__ */ t(i, { children: [
      /* @__PURE__ */ t(o, { children: [
        /* @__PURE__ */ e(g, { children: "Latest recipients" }),
        /* @__PURE__ */ e(x, { children: "The 50 most recent." })
      ] }),
      /* @__PURE__ */ e(l, { className: "cm:p-0", children: a.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:px-6 cm:pb-6 cm:text-sm cm:text-muted-foreground", children: "Nobody yet." }) : /* @__PURE__ */ t(y, { children: [
        /* @__PURE__ */ e(C, { children: /* @__PURE__ */ t(h, { children: [
          /* @__PURE__ */ e(u, { children: "Email" }),
          /* @__PURE__ */ e(u, { children: "Status" }),
          /* @__PURE__ */ e(u, { children: "Sent" }),
          /* @__PURE__ */ e(u, { children: "Opened" }),
          /* @__PURE__ */ e(u, { children: "Clicked" })
        ] }) }),
        /* @__PURE__ */ e(f, { children: a.map((_) => /* @__PURE__ */ t(h, { children: [
          /* @__PURE__ */ t(m, { children: [
            _.email,
            _.unsubscribed && /* @__PURE__ */ t(z, { children: [
              " ",
              /* @__PURE__ */ e(L, { tone: "warning", children: "unsubscribed" })
            ] })
          ] }),
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e("span", { title: _.error ?? void 0, children: /* @__PURE__ */ e(L, { tone: ut[_.status] ?? "neutral", children: _.status }) }) }),
          /* @__PURE__ */ e(m, { className: "cm:whitespace-nowrap", children: je(_.sent_at) }),
          /* @__PURE__ */ e(m, { className: "cm:whitespace-nowrap", children: je(_.opened_at) }),
          /* @__PURE__ */ e(m, { className: "cm:whitespace-nowrap", children: je(_.clicked_at) })
        ] }, `${_.email}-${_.sent_at}`)) })
      ] }) })
    ] })
  ] });
}
function _e({
  value: n,
  onChange: c,
  id: r,
  placeholder: a,
  allowNull: i = !0,
  invalid: l
}) {
  const { Input: o } = O, g = (m) => m == null ? "" : oe(m).replace(/^[^\d-]+|[^\d]+$/g, ""), [x, p] = F.useState(g(n)), [y, f] = F.useState(!1);
  return F.useEffect(() => {
    y || p(g(n));
  }, [n, y]), /* @__PURE__ */ e(
    o,
    {
      id: r,
      inputMode: "decimal",
      value: x,
      placeholder: a,
      "aria-invalid": l || void 0,
      onFocus: () => f(!0),
      onChange: (m) => {
        p(m.target.value);
        const u = m.target.value.trim() === "" ? i ? null : 0 : yt(m.target.value);
        (u !== null || m.target.value.trim() === "") && c(u);
      },
      onBlur: () => {
        f(!1), p(g(n));
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
function dn(n, c) {
  const r = c ? `${n}?parent=${encodeURIComponent(c)}` : n;
  return Me.has(r) || Me.set(r, te(r).then((a) => a.data).catch(() => (Me.delete(r), []))), Me.get(r);
}
const pt = "cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm cm:disabled:opacity-50";
function _t({ field: n, value: c, onChange: r, pathPrefix: a }) {
  const { Label: i } = O, l = n.config ?? {}, o = String(l.api ?? ""), g = sn[l.depth ?? "district"] ?? 3, x = l.country_options ?? [], p = { country: "ID", province_code: null, city_code: null, district_code: null, village_code: null, ...c ?? {} }, y = ht.slice(0, g), [f, m] = F.useState({}), u = [null, p.province_code, p.city_code, p.district_code];
  F.useEffect(() => {
    p.country !== "ID" || !o || y.forEach((h, s) => {
      const v = u[s];
      s > 0 && !v || dn(o, v).then((b) => m((_) => ({ ..._, [h.key]: b })));
    });
  }, [o, p.country, p.province_code, p.city_code, p.district_code]);
  const C = (h, s) => {
    const v = { ...p };
    v[y[h].key] = s || null, ht.slice(h + 1).forEach((b) => {
      v[b.key] = null;
    }), r(v);
  };
  return /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    x.length > 0 && /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(i, { htmlFor: `${a}-country`, children: "Country" }),
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
    p.country === "ID" && y.map((h, s) => /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(i, { htmlFor: `${a}-${h.key}`, children: h.label }),
      /* @__PURE__ */ t(
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
function on({ mode: n, order: c, paymentMethods: r, canOverride: a, variantsUrl: i, previewUrl: l, submitUrl: o }) {
  const { Card: g, CardContent: x, CardHeader: p, CardTitle: y, Button: f, Input: m, Label: u, Checkbox: C, Textarea: h } = O;
  G(), W.useBreadcrumbs([
    { label: "Shop", href: N("commerce") },
    { label: "Orders", href: N("commerce/orders") },
    ...c ? [{ label: c.number, href: N(`commerce/orders/${c.id}`) }] : [],
    { label: n === "create" ? "New order" : n === "quote" ? "Quote" : "Edit items" }
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
    const w = setTimeout(() => te(`${N(i)}&q=${encodeURIComponent(b)}`).then((I) => $(I.data)).catch(() => $([])), 250);
    return () => clearTimeout(w);
  }, [b]), F.useEffect(() => {
    if (s.data.lines.length === 0) {
      j(null);
      return;
    }
    const w = setTimeout(() => {
      te(N(l), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        lines: s.data.lines.map(({ item_id: I, variant_id: A, quantity: Q, unit_price: T }) => ({ item_id: I, variant_id: A, quantity: Q, unit_price: T })),
        shipping: s.data.shipping,
        discount: s.data.discount,
        shipping_address: n === "create" ? s.data.shipping_address : void 0
      }) }).then(j).catch(() => j(null));
    }, 300);
    return () => clearTimeout(w);
  }, [JSON.stringify([s.data.lines, s.data.shipping, s.data.discount, s.data.shipping_address])]);
  const M = (w) => {
    const I = s.data.lines.findIndex((A) => A.variant_id === w.id && !A.item_id);
    s.setData("lines", I >= 0 ? s.data.lines.map((A, Q) => Q === I ? { ...A, quantity: A.quantity + 1 } : A) : [...s.data.lines, { variant_id: w.id, label: w.label, sku: w.sku, quantity: 1, price: w.price, unit_price: null }]), _(""), $([]);
  }, Y = (w, I) => s.setData("lines", s.data.lines.map((A, Q) => Q === w ? { ...A, ...I } : A)), ne = (w) => {
    w.preventDefault(), s.transform((I) => ({ ...I, lines: I.lines.map(({ item_id: A, variant_id: Q, quantity: T, unit_price: V }) => ({ item_id: A, variant_id: Q, quantity: T, unit_price: V })) })), n === "create" ? s.post(N(o)) : s.put(N(o));
  }, ce = (w) => k?.lines.find((I) => I.variant_id === w);
  return /* @__PURE__ */ t("form", { onSubmit: ne, className: "cm:mx-auto cm:grid cm:w-full cm:max-w-5xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      X,
      {
        title: n === "create" ? "New order" : n === "quote" ? `Quote ${c?.number}` : `Edit ${c?.number}`,
        description: n === "edit" ? "Existing lines keep their price; new lines use today's price. The stock difference is reserved or given back." : n === "quote" ? `For ${c?.customer}. Set the prices, shipping and discount, then send it.` : "An order for a customer, from a chat or a call."
      }
    ),
    /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[2fr_1fr]", children: [
      /* @__PURE__ */ t("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ t(g, { children: [
          /* @__PURE__ */ e(p, { children: /* @__PURE__ */ e(y, { children: "Products" }) }),
          /* @__PURE__ */ t(x, { className: "cm:grid cm:gap-3", children: [
            /* @__PURE__ */ t("div", { className: "cm:relative", children: [
              /* @__PURE__ */ e(m, { placeholder: "Search products by name or SKU…", value: b, onChange: (w) => _(w.target.value), "aria-label": "Search products" }),
              D.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-10 cm:mt-1 cm:max-h-64 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: D.map((w) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ e("button", { type: "button", className: "cm:flex cm:w-full cm:justify-between cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted", onClick: () => M(w), children: /* @__PURE__ */ t("span", { children: [
                w.label,
                w.sku ? /* @__PURE__ */ t("span", { className: "cm:text-muted-foreground", children: [
                  " · ",
                  w.sku
                ] }) : null
              ] }) }) }, w.id)) })
            ] }),
            v.lines && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-destructive", children: v.lines }),
            s.data.lines.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No products yet." }) : /* @__PURE__ */ e("ul", { className: "cm:divide-y cm:divide-border", children: s.data.lines.map((w, I) => /* @__PURE__ */ t("li", { className: "cm:grid cm:items-center cm:gap-2 cm:py-2 cm:sm:grid-cols-[1fr_5rem_9rem_7rem_auto]", children: [
              /* @__PURE__ */ t("div", { className: "cm:min-w-0 cm:text-sm", children: [
                /* @__PURE__ */ e("p", { className: "cm:font-medium", children: w.label }),
                w.sku && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: w.sku })
              ] }),
              /* @__PURE__ */ e(m, { type: "number", min: 1, "aria-label": "Quantity", value: w.quantity, onChange: (A) => Y(I, { quantity: Math.max(1, Number(A.target.value)) }) }),
              a ? /* @__PURE__ */ e(_e, { value: w.unit_price, placeholder: ce(w.variant_id)?.unit_price_formatted ?? "", onChange: (A) => Y(I, { unit_price: A }) }) : /* @__PURE__ */ e("span", { className: "cm:text-sm", children: ce(w.variant_id)?.unit_price_formatted ?? "…" }),
              /* @__PURE__ */ e("span", { className: "cm:text-sm cm:font-medium cm:sm:text-right", children: ce(w.variant_id)?.total ?? "" }),
              /* @__PURE__ */ e(f, { type: "button", variant: "ghost", size: "sm", "aria-label": "Remove", onClick: () => s.setData("lines", s.data.lines.filter((A, Q) => Q !== I)), children: "×" })
            ] }, `${w.item_id ?? "n"}-${w.variant_id}-${I}`)) }),
            k?.notices.map((w, I) => /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-amber-700", children: w }, I))
          ] })
        ] }),
        n === "create" && /* @__PURE__ */ t(g, { children: [
          /* @__PURE__ */ e(p, { children: /* @__PURE__ */ e(y, { children: "Customer" }) }),
          /* @__PURE__ */ t(x, { className: "cm:grid cm:gap-3 cm:sm:grid-cols-3", children: [
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(u, { htmlFor: "m-email", children: "Email *" }),
              /* @__PURE__ */ e(m, { id: "m-email", type: "email", value: s.data.email, onChange: (w) => s.setData("email", w.target.value) }),
              v.email && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-destructive", children: v.email })
            ] }),
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(u, { htmlFor: "m-name", children: "Name" }),
              /* @__PURE__ */ e(m, { id: "m-name", value: s.data.name, onChange: (w) => s.setData("name", w.target.value) })
            ] }),
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(u, { htmlFor: "m-phone", children: "Phone" }),
              /* @__PURE__ */ e(m, { id: "m-phone", value: s.data.phone, onChange: (w) => s.setData("phone", w.target.value) })
            ] })
          ] })
        ] }),
        n === "create" && (k?.needs_shipping ?? !0) && /* @__PURE__ */ t(g, { children: [
          /* @__PURE__ */ e(p, { children: /* @__PURE__ */ e(y, { children: "Shipping address" }) }),
          /* @__PURE__ */ t(x, { className: "cm:grid cm:gap-3", children: [
            /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: ["name", "phone"].map((w) => /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(u, { htmlFor: `a-${w}`, children: w === "name" ? "Recipient" : "Phone" }),
              /* @__PURE__ */ e(m, { id: `a-${w}`, value: String(s.data.shipping_address[w] ?? ""), onChange: (I) => s.setData("shipping_address", { ...s.data.shipping_address, [w]: I.target.value }) })
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
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(u, { htmlFor: "a-line1", children: "Street address" }),
              /* @__PURE__ */ e(m, { id: "a-line1", value: String(s.data.shipping_address.line1 ?? ""), onChange: (w) => s.setData("shipping_address", { ...s.data.shipping_address, line1: w.target.value }) })
            ] }),
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1 cm:sm:w-48", children: [
              /* @__PURE__ */ e(u, { htmlFor: "a-postal", children: "Postal code" }),
              /* @__PURE__ */ e(m, { id: "a-postal", value: String(s.data.shipping_address.postal_code ?? ""), onChange: (w) => s.setData("shipping_address", { ...s.data.shipping_address, postal_code: w.target.value }) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ t("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ t(g, { children: [
          /* @__PURE__ */ e(p, { children: /* @__PURE__ */ e(y, { children: "Shipping and discount" }) }),
          /* @__PURE__ */ t(x, { className: "cm:grid cm:gap-3", children: [
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(u, { htmlFor: "s-label", children: "Shipping method" }),
              /* @__PURE__ */ e(m, { id: "s-label", placeholder: "JNE REG", value: s.data.shipping.label, onChange: (w) => s.setData("shipping", { ...s.data.shipping, label: w.target.value }) })
            ] }),
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(u, { htmlFor: "s-cost", children: "Shipping cost" }),
              /* @__PURE__ */ e(_e, { id: "s-cost", allowNull: !1, value: s.data.shipping.cost, onChange: (w) => s.setData("shipping", { ...s.data.shipping, cost: w ?? 0 }) })
            ] }),
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(u, { htmlFor: "d-label", children: "Discount label" }),
              /* @__PURE__ */ e(m, { id: "d-label", value: s.data.discount.label, onChange: (w) => s.setData("discount", { ...s.data.discount, label: w.target.value }) })
            ] }),
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(u, { htmlFor: "d-amount", children: "Discount" }),
              /* @__PURE__ */ e(_e, { id: "d-amount", allowNull: !1, value: s.data.discount.amount, onChange: (w) => s.setData("discount", { ...s.data.discount, amount: w ?? 0 }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ t(g, { children: [
          /* @__PURE__ */ e(p, { children: /* @__PURE__ */ e(y, { children: "Total" }) }),
          /* @__PURE__ */ e(x, { className: "cm:grid cm:gap-1 cm:text-sm", children: k ? /* @__PURE__ */ t(z, { children: [
            /* @__PURE__ */ t("p", { className: "cm:flex cm:justify-between", children: [
              /* @__PURE__ */ e("span", { children: "Subtotal" }),
              /* @__PURE__ */ e("span", { children: k.totals.subtotal })
            ] }),
            /* @__PURE__ */ t("p", { className: "cm:flex cm:justify-between", children: [
              /* @__PURE__ */ e("span", { children: "Discount" }),
              /* @__PURE__ */ t("span", { children: [
                "−",
                k.totals.discount
              ] })
            ] }),
            /* @__PURE__ */ t("p", { className: "cm:flex cm:justify-between", children: [
              /* @__PURE__ */ e("span", { children: "Shipping" }),
              /* @__PURE__ */ e("span", { children: k.totals.shipping })
            ] }),
            /* @__PURE__ */ t("p", { className: "cm:flex cm:justify-between cm:text-base cm:font-semibold", children: [
              /* @__PURE__ */ e("span", { children: "Total" }),
              /* @__PURE__ */ e("span", { children: k.totals.total })
            ] })
          ] }) : /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "Add products to see the total." }) })
        ] }),
        n === "create" && /* @__PURE__ */ t(g, { children: [
          /* @__PURE__ */ e(p, { children: /* @__PURE__ */ e(y, { children: "Payment" }) }),
          /* @__PURE__ */ t(x, { className: "cm:grid cm:gap-3 cm:text-sm", children: [
            ["unpaid", "paid"].map((w) => /* @__PURE__ */ t("label", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e("input", { type: "radio", name: "payment_status", checked: s.data.payment_status === w, onChange: () => s.setData("payment_status", w) }),
              w === "unpaid" ? "Unpaid: the customer pays later" : "Paid already"
            ] }, w)),
            r.length > 0 && /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(u, { htmlFor: "p-method", children: "Method" }),
              /* @__PURE__ */ t("select", { id: "p-method", className: "cm:h-9 cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3", value: s.data.payment_method, onChange: (w) => s.setData("payment_method", w.target.value), children: [
                /* @__PURE__ */ e("option", { value: "", children: "—" }),
                r.map((w) => /* @__PURE__ */ e("option", { value: w.value, children: w.label }, w.value))
              ] })
            ] }),
            s.data.payment_status === "paid" ? /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(u, { htmlFor: "p-ref", children: "Reference" }),
              /* @__PURE__ */ e(m, { id: "p-ref", value: s.data.reference, onChange: (w) => s.setData("reference", w.target.value) })
            ] }) : /* @__PURE__ */ t("label", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e(C, { checked: s.data.send_link, onCheckedChange: (w) => s.setData("send_link", w === !0) }),
              " Email the customer the link to pay"
            ] }),
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(u, { htmlFor: "m-note", children: "Internal note" }),
              /* @__PURE__ */ e(h, { id: "m-note", value: s.data.note, onChange: (w) => s.setData("note", w.target.value) })
            ] })
          ] })
        ] }),
        n === "quote" && /* @__PURE__ */ t(g, { children: [
          /* @__PURE__ */ e(p, { children: /* @__PURE__ */ e(y, { children: "Validity" }) }),
          /* @__PURE__ */ t(x, { className: "cm:grid cm:gap-3 cm:text-sm", children: [
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(u, { htmlFor: "q-valid", children: "Valid until" }),
              /* @__PURE__ */ e(m, { id: "q-valid", type: "date", value: s.data.valid_until, onChange: (w) => s.setData("valid_until", w.target.value) }),
              v.valid_until && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-destructive", children: v.valid_until })
            ] }),
            /* @__PURE__ */ t("label", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e(C, { checked: s.data.send, onCheckedChange: (w) => s.setData("send", w === !0) }),
              " Send it to the customer now"
            ] })
          ] })
        ] }),
        n === "edit" && /* @__PURE__ */ t("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
          /* @__PURE__ */ e(C, { checked: s.data.notify, onCheckedChange: (w) => s.setData("notify", w === !0) }),
          " Tell the customer about the change"
        ] }),
        /* @__PURE__ */ e(f, { type: "submit", disabled: s.processing || s.data.lines.length === 0, children: n === "create" ? "Create order" : n === "quote" ? s.data.send ? "Send quote" : "Save quote" : "Save changes" })
      ] })
    ] })
  ] });
}
function mn({ order: n, couriers: c, onClose: r }) {
  const { Dialog: a, DialogContent: i, DialogFooter: l, DialogHeader: o, DialogTitle: g, Button: x, Input: p, Label: y } = O, f = n.items.filter((h) => h.unfulfilled > 0), m = E.useForm({
    courier: c[0]?.key ?? "",
    courier_name: "",
    service: "",
    tracking_number: "",
    items: f.map((h) => ({ order_item_id: h.id, quantity: h.unfulfilled }))
  }), u = m.errors;
  return /* @__PURE__ */ e(a, { open: !0, onOpenChange: (h) => !h && r(), children: /* @__PURE__ */ t(i, { children: [
    /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(g, { children: "Add a shipment" }) }),
    /* @__PURE__ */ t("form", { className: "cm:grid cm:gap-3", onSubmit: (h) => {
      h.preventDefault(), m.post(N(`commerce/orders/${n.id}/shipments`), { preserveScroll: !0, onSuccess: r });
    }, children: [
      /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(y, { htmlFor: "s-courier", children: "Courier" }),
        /* @__PURE__ */ t("select", { id: "s-courier", className: "cm:h-9 cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm", value: m.data.courier, onChange: (h) => m.setData("courier", h.target.value), children: [
          c.map((h) => /* @__PURE__ */ e("option", { value: h.key, children: h.name }, h.key)),
          /* @__PURE__ */ e("option", { value: "", children: "Other…" })
        ] })
      ] }),
      m.data.courier === "" && /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(y, { htmlFor: "s-name", children: "Courier name" }),
        /* @__PURE__ */ e(p, { id: "s-name", value: m.data.courier_name, onChange: (h) => m.setData("courier_name", h.target.value) })
      ] }),
      /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(y, { htmlFor: "s-service", children: "Service" }),
        /* @__PURE__ */ e(p, { id: "s-service", placeholder: "REG, YES…", value: m.data.service, onChange: (h) => m.setData("service", h.target.value) })
      ] }),
      /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(y, { htmlFor: "s-tracking", children: "Tracking number" }),
        /* @__PURE__ */ e(p, { id: "s-tracking", value: m.data.tracking_number, onChange: (h) => m.setData("tracking_number", h.target.value) })
      ] }),
      /* @__PURE__ */ t("fieldset", { className: "cm:grid cm:gap-2", children: [
        /* @__PURE__ */ e("legend", { className: "cm:mb-1 cm:text-sm cm:font-medium", children: "In this parcel" }),
        f.map((h, s) => /* @__PURE__ */ t("label", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:text-sm", children: [
          /* @__PURE__ */ t("span", { children: [
            h.name,
            h.variant_title ? ` · ${h.variant_title}` : "",
            " ",
            /* @__PURE__ */ t("span", { className: "cm:text-muted-foreground", children: [
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
              value: m.data.items[s].quantity,
              onChange: (v) => m.setData("items", m.data.items.map((b, _) => _ === s ? { ...b, quantity: Number(v.target.value) } : b))
            }
          )
        ] }, h.id)),
        u.items && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-destructive", children: u.items })
      ] }),
      /* @__PURE__ */ t(l, { children: [
        /* @__PURE__ */ e(x, { type: "button", variant: "outline", onClick: r, children: "Cancel" }),
        /* @__PURE__ */ e(x, { type: "submit", disabled: m.processing, children: "Save shipment" })
      ] })
    ] })
  ] }) });
}
function un({ order: n, onClose: c }) {
  const { Dialog: r, DialogContent: a, DialogFooter: i, DialogHeader: l, DialogTitle: o, DialogDescription: g, Button: x, Input: p, Label: y, Checkbox: f } = O, m = E.useForm({
    amount: n.totals.refundable,
    reason: "",
    restock: !1,
    items: n.items.map((C) => ({ order_item_id: C.id, quantity: 0 }))
  }), u = m.errors;
  return /* @__PURE__ */ e(r, { open: !0, onOpenChange: (C) => !C && c(), children: /* @__PURE__ */ t(a, { children: [
    /* @__PURE__ */ t(l, { children: [
      /* @__PURE__ */ e(o, { children: "Refund" }),
      /* @__PURE__ */ e(g, { children: "Record money you returned to the customer." })
    ] }),
    /* @__PURE__ */ t("form", { className: "cm:grid cm:gap-3", onSubmit: (C) => {
      C.preventDefault(), m.post(N(`commerce/orders/${n.id}/refunds`), { preserveScroll: !0, onSuccess: c });
    }, children: [
      /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(y, { htmlFor: "r-amount", children: "Amount" }),
        /* @__PURE__ */ e(_e, { id: "r-amount", value: m.data.amount, onChange: (C) => m.setData("amount", C) }),
        u.amount && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-destructive", children: u.amount })
      ] }),
      /* @__PURE__ */ t("fieldset", { className: "cm:grid cm:gap-2", children: [
        /* @__PURE__ */ e("legend", { className: "cm:mb-1 cm:text-sm cm:font-medium", children: "Items returned (optional)" }),
        n.items.map((C, h) => /* @__PURE__ */ t("label", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:text-sm", children: [
          /* @__PURE__ */ t("span", { children: [
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
              value: m.data.items[h].quantity,
              onChange: (s) => m.setData("items", m.data.items.map((v, b) => b === h ? { ...v, quantity: Number(s.target.value) } : v))
            }
          )
        ] }, C.id))
      ] }),
      /* @__PURE__ */ t("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
        /* @__PURE__ */ e(f, { checked: m.data.restock, onCheckedChange: (C) => m.setData("restock", C === !0) }),
        " Put the returned items back in stock"
      ] }),
      /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(y, { htmlFor: "r-reason", children: "Reason" }),
        /* @__PURE__ */ e(p, { id: "r-reason", value: m.data.reason, onChange: (C) => m.setData("reason", C.target.value) })
      ] }),
      /* @__PURE__ */ t(i, { children: [
        /* @__PURE__ */ e(x, { type: "button", variant: "outline", onClick: c, children: "Cancel" }),
        /* @__PURE__ */ e(x, { type: "submit", disabled: m.processing, children: "Record refund" })
      ] })
    ] })
  ] }) });
}
const Z = (n) => n ? new Date(n).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" }) : "—", qe = (n) => ({
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
})[n] ?? "neutral";
function hn(n) {
  const { order: c, transitions: r, can: a, panels: i } = n, { Card: l, CardContent: o, CardHeader: g, CardTitle: x, Button: p, Textarea: y, Label: f, Checkbox: m, Input: u, Dialog: C, DialogContent: h, DialogFooter: s, DialogHeader: v, DialogTitle: b, DialogDescription: _ } = O, { Link: D, router: $ } = E;
  G(), W.useBreadcrumbs([{ label: "Shop", href: N("commerce") }, { label: "Orders", href: N("commerce/orders") }, { label: c.number }]);
  const k = `commerce/orders/${c.id}`, [j, M] = F.useState(null), [Y, ne] = F.useState(""), [ce, w] = F.useState(!1), [I, A] = F.useState(!1), [Q, T] = F.useState(!1), V = E.useForm({ message: "", customer: !1 }), U = E.useForm({ reference: "", paid_at: "", account: "" }), ae = ve.orderPanels(), le = (d, B) => $.post(N(`${k}/transition`), { to: d, reason: B ?? null }, { preserveScroll: !0, onFinish: () => M(null) });
  return /* @__PURE__ */ t("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      X,
      {
        title: `${c.type === "quote" ? "Quote" : "Order"} ${c.number}`,
        description: /* @__PURE__ */ t(z, { children: [
          "Placed ",
          Z(c.placed_at),
          " · ",
          c.channel,
          c.trashed ? " · in the trash" : ""
        ] }),
        actions: /* @__PURE__ */ t("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
          /* @__PURE__ */ e(L, { tone: qe(c.status), children: c.status_label }),
          c.type === "order" && /* @__PURE__ */ e(L, { tone: qe(c.payment_status), children: c.payment_label }),
          c.type === "order" && c.fulfillment_status !== "not_required" && /* @__PURE__ */ e(L, { tone: qe(c.fulfillment_status), children: c.fulfillment_label }),
          /* @__PURE__ */ e(p, { variant: "outline", size: "sm", asChild: !0, children: /* @__PURE__ */ e("a", { href: c.storefront_url, target: "_blank", rel: "noreferrer", children: "Customer view" }) })
        ] })
      }
    ),
    /* @__PURE__ */ t("div", { className: "cm:flex cm:flex-wrap cm:gap-2", children: [
      r.filter((d) => d.permission).map((d) => /* @__PURE__ */ e(
        p,
        {
          size: "sm",
          variant: d.to === "cancelled" ? "outline" : "default",
          disabled: !d.allowed,
          title: d.reason ?? void 0,
          onClick: () => d.to === "cancelled" || d.to === "on_hold" ? M(d) : le(d.to),
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
    /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[2fr_1fr]", children: [
      /* @__PURE__ */ t("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: "Items" }) }),
          /* @__PURE__ */ t(o, { className: "cm:grid cm:gap-4", children: [
            /* @__PURE__ */ e("ul", { className: "cm:divide-y cm:divide-border", children: c.items.map((d) => /* @__PURE__ */ t("li", { className: "cm:grid cm:gap-1 cm:py-3 cm:first:pt-0 cm:sm:grid-cols-[1fr_auto] cm:sm:gap-4", children: [
              /* @__PURE__ */ t("div", { className: "cm:min-w-0", children: [
                /* @__PURE__ */ t("p", { className: "cm:font-medium", children: [
                  d.product_href ? /* @__PURE__ */ e(D, { href: N(d.product_href), className: "cm:hover:underline", children: d.name }) : d.name,
                  d.variant_title && /* @__PURE__ */ t("span", { className: "cm:text-muted-foreground", children: [
                    " · ",
                    d.variant_title
                  ] })
                ] }),
                /* @__PURE__ */ t("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  d.sku && /* @__PURE__ */ t(z, { children: [
                    "SKU ",
                    d.sku,
                    " · "
                  ] }),
                  d.price_source.label,
                  d.requires_shipping && c.fulfillment_status !== "not_required" && /* @__PURE__ */ t(z, { children: [
                    " · shipped ",
                    d.fulfilled_quantity,
                    "/",
                    d.quantity
                  ] }),
                  d.refunded_quantity > 0 && /* @__PURE__ */ t(z, { children: [
                    " · refunded ",
                    d.refunded_quantity
                  ] })
                ] }),
                d.components.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:mt-1 cm:text-xs cm:text-muted-foreground", children: d.components.map((B, Te) => /* @__PURE__ */ t("li", { children: [
                  B.quantity,
                  " × ",
                  B.name
                ] }, Te)) })
              ] }),
              /* @__PURE__ */ t("div", { className: "cm:text-sm cm:sm:text-right", children: [
                /* @__PURE__ */ t("p", { children: [
                  d.quantity,
                  " × ",
                  d.regular_unit_price && /* @__PURE__ */ e("del", { className: "cm:text-muted-foreground", children: d.regular_unit_price }),
                  " ",
                  d.unit_price_formatted
                ] }),
                d.discount && /* @__PURE__ */ t("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  "−",
                  d.discount
                ] }),
                /* @__PURE__ */ e("p", { className: "cm:font-medium", children: d.total })
              ] })
            ] }, d.id)) }),
            /* @__PURE__ */ t("dl", { className: "cm:grid cm:gap-1 cm:border-t cm:pt-3 cm:text-sm", children: [
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
        (c.payments.length > 0 || c.confirmations.length > 0) && /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: "Payments" }) }),
          /* @__PURE__ */ t(o, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            c.payments.map((d) => /* @__PURE__ */ t("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2 cm:rounded-md cm:border cm:p-3", children: [
              /* @__PURE__ */ t("div", { children: [
                /* @__PURE__ */ t("p", { className: "cm:font-medium", children: [
                  d.method,
                  " · ",
                  d.amount
                ] }),
                /* @__PURE__ */ t("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  d.reference && /* @__PURE__ */ t(z, { children: [
                    "Ref ",
                    d.reference,
                    " · "
                  ] }),
                  d.paid_at ? `Paid ${Z(d.paid_at)}` : d.expires_at ? `Due ${Z(d.expires_at)}` : "",
                  d.refunded && ` · refunded ${d.refunded}`
                ] })
              ] }),
              /* @__PURE__ */ e(L, { tone: qe(d.status), children: d.status.replace(/_/g, " ") })
            ] }, d.id)),
            c.confirmations.map((d) => /* @__PURE__ */ t("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2 cm:rounded-md cm:border cm:border-dashed cm:p-3", children: [
              /* @__PURE__ */ t("span", { children: [
                "Confirmation from ",
                d.sender_name,
                d.sender_bank ? ` (${d.sender_bank})` : "",
                " · ",
                d.amount,
                d.proof_url && /* @__PURE__ */ t(z, { children: [
                  " · ",
                  /* @__PURE__ */ e("a", { href: d.proof_url, target: "_blank", rel: "noreferrer", className: "cm:underline", children: "proof" })
                ] })
              ] }),
              /* @__PURE__ */ t("span", { className: "cm:flex cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ e(L, { tone: d.status === "approved" ? "ok" : d.status === "rejected" ? "error" : "warning", children: d.status }),
                d.can_review && /* @__PURE__ */ e(p, { size: "sm", asChild: !0, children: /* @__PURE__ */ e(D, { href: N("commerce/confirmations"), children: "Review" }) })
              ] })
            ] }, d.id))
          ] })
        ] }),
        c.shipments.length > 0 && /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: "Shipments" }) }),
          /* @__PURE__ */ e(o, { className: "cm:grid cm:gap-2 cm:text-sm", children: c.shipments.map((d) => /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1 cm:rounded-md cm:border cm:p-3", children: [
            /* @__PURE__ */ t("div", { className: "cm:flex cm:items-center cm:justify-between", children: [
              /* @__PURE__ */ t("span", { className: "cm:font-medium", children: [
                d.courier,
                d.service ? ` ${d.service}` : "",
                d.tracking_number && /* @__PURE__ */ t(z, { children: [
                  " · ",
                  d.tracking_url ? /* @__PURE__ */ e("a", { href: d.tracking_url, target: "_blank", rel: "noreferrer", className: "cm:underline", children: d.tracking_number }) : d.tracking_number
                ] })
              ] }),
              /* @__PURE__ */ e(L, { tone: qe(d.status), children: d.status.replace(/_/g, " ") })
            ] }),
            /* @__PURE__ */ t("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
              d.items.map((B) => `${B.quantity} × ${B.name}`).join(", "),
              " · shipped ",
              Z(d.shipped_at),
              d.delivered_at ? ` · delivered ${Z(d.delivered_at)}` : ""
            ] }),
            a.shipments && d.status !== "delivered" && /* @__PURE__ */ e("div", { children: /* @__PURE__ */ e(p, { size: "sm", variant: "outline", onClick: () => $.post(N(`${k}/shipments/${d.id}/delivered`), {}, { preserveScroll: !0 }), children: "Mark delivered" }) })
          ] }, d.id)) })
        ] }),
        c.downloads.length > 0 && /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: "Downloads" }) }),
          /* @__PURE__ */ e(o, { className: "cm:grid cm:gap-2 cm:text-sm", children: c.downloads.map((d) => /* @__PURE__ */ t("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2 cm:rounded-md cm:border cm:p-3", children: [
            /* @__PURE__ */ t("span", { children: [
              /* @__PURE__ */ e("span", { className: "cm:font-medium", children: d.name }),
              " · ",
              d.count,
              " downloaded",
              d.remaining !== null ? ` · ${d.remaining} left` : "",
              d.expires_at ? ` · until ${Z(d.expires_at)}` : ""
            ] }),
            /* @__PURE__ */ t("span", { className: "cm:flex cm:items-center cm:gap-1", children: [
              /* @__PURE__ */ e(L, { tone: d.state === "active" ? "ok" : "warning", children: d.state.replace("_", " ") }),
              a.edit && ["resend", "extend", "reset", "revoke"].map((B) => /* @__PURE__ */ e(p, { size: "sm", variant: "ghost", onClick: () => $.post(N(`${k}/downloads/${d.id}`), { action: B }, { preserveScroll: !0 }), children: { resend: "Resend", extend: "+7 days", reset: "Reset count", revoke: "Revoke" }[B] }, B))
            ] })
          ] }, d.id)) })
        ] }),
        c.refunds.length > 0 && /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: "Refunds" }) }),
          /* @__PURE__ */ e(o, { className: "cm:grid cm:gap-1 cm:text-sm", children: c.refunds.map((d) => /* @__PURE__ */ t("p", { children: [
            d.amount,
            " · ",
            Z(d.created_at),
            d.reason ? ` · ${d.reason}` : "",
            d.restock ? " · restocked" : ""
          ] }, d.id)) })
        ] }),
        i.map((d) => {
          const B = ae[d.key];
          return B ? /* @__PURE__ */ t(l, { children: [
            /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: d.label }) }),
            /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(B, { order: c, data: d.data }) })
          ] }, d.key) : null;
        }),
        /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: "Timeline" }) }),
          /* @__PURE__ */ t(o, { className: "cm:grid cm:gap-4", children: [
            a.edit && /* @__PURE__ */ t("form", { className: "cm:grid cm:gap-2", onSubmit: (d) => {
              d.preventDefault(), V.post(N(`${k}/notes`), { preserveScroll: !0, onSuccess: () => V.reset() });
            }, children: [
              /* @__PURE__ */ e(f, { htmlFor: "o-note", className: "cm:sr-only", children: "Note" }),
              /* @__PURE__ */ e(y, { id: "o-note", placeholder: "Add a note…", value: V.data.message, onChange: (d) => V.setData("message", d.target.value) }),
              /* @__PURE__ */ t("div", { className: "cm:flex cm:items-center cm:justify-between cm:gap-2", children: [
                /* @__PURE__ */ t("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
                  /* @__PURE__ */ e(m, { checked: V.data.customer, onCheckedChange: (d) => V.setData("customer", d === !0) }),
                  " Send to the customer"
                ] }),
                /* @__PURE__ */ e(p, { size: "sm", type: "submit", disabled: V.processing || V.data.message.trim() === "", children: "Add note" })
              ] })
            ] }),
            /* @__PURE__ */ e("ol", { className: "cm:grid cm:gap-3 cm:text-sm", children: c.timeline.map((d) => /* @__PURE__ */ t("li", { className: "cm:grid cm:gap-0.5 cm:border-l-2 cm:pl-3", style: { borderColor: d.visibility === "customer" ? "var(--color-primary, currentColor)" : void 0 }, children: [
              /* @__PURE__ */ e("span", { className: "cm:whitespace-pre-line", children: d.message }),
              /* @__PURE__ */ t("span", { className: "cm:text-xs cm:text-muted-foreground", children: [
                Z(d.created_at),
                " · ",
                d.actor ?? d.source,
                d.visibility === "customer" ? " · to the customer" : ""
              ] })
            ] }, d.id)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ t("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: "Customer" }) }),
          /* @__PURE__ */ t(o, { className: "cm:grid cm:gap-1 cm:text-sm", children: [
            /* @__PURE__ */ e("p", { className: "cm:font-medium", children: c.customer.href ? /* @__PURE__ */ e(D, { href: N(c.customer.href), className: "cm:hover:underline", children: c.customer.name ?? c.customer.email }) : c.customer.name ?? c.customer.email }),
            c.customer.email && /* @__PURE__ */ e("a", { href: `mailto:${c.customer.email}`, className: "cm:text-muted-foreground cm:hover:underline", children: c.customer.email }),
            c.customer.phone && /* @__PURE__ */ e("a", { href: `https://wa.me/${c.customer.phone.replace(/\D/g, "")}`, target: "_blank", rel: "noreferrer", className: "cm:text-muted-foreground cm:hover:underline", children: c.customer.phone }),
            c.customer.guest && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: "Guest checkout" })
          ] })
        ] }),
        /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ t(g, { className: "cm:flex cm:flex-row cm:items-center cm:justify-between", children: [
            /* @__PURE__ */ e(x, { children: "Addresses" }),
            a.edit_addresses && /* @__PURE__ */ e(p, { size: "sm", variant: "ghost", asChild: !0, children: /* @__PURE__ */ e(D, { href: N(`${k}/addresses`), children: "Edit" }) })
          ] }),
          /* @__PURE__ */ t(o, { className: "cm:grid cm:gap-3 cm:text-sm", children: [
            c.pickup && /* @__PURE__ */ t("div", { children: [
              /* @__PURE__ */ e("p", { className: "cm:text-xs cm:font-medium cm:uppercase cm:text-muted-foreground", children: "Pickup" }),
              /* @__PURE__ */ t("p", { children: [
                c.pickup.name,
                /* @__PURE__ */ e("br", {}),
                c.pickup.address
              ] })
            ] }),
            c.shipping_address_text && /* @__PURE__ */ t("div", { children: [
              /* @__PURE__ */ e("p", { className: "cm:text-xs cm:font-medium cm:uppercase cm:text-muted-foreground", children: "Shipping" }),
              /* @__PURE__ */ e("p", { className: "cm:whitespace-pre-line", children: c.shipping_address_text })
            ] }),
            c.billing_address_text && c.billing_address_text !== c.shipping_address_text && /* @__PURE__ */ t("div", { children: [
              /* @__PURE__ */ e("p", { className: "cm:text-xs cm:font-medium cm:uppercase cm:text-muted-foreground", children: "Billing" }),
              /* @__PURE__ */ e("p", { className: "cm:whitespace-pre-line", children: c.billing_address_text })
            ] }),
            c.dropship && /* @__PURE__ */ t("div", { children: [
              /* @__PURE__ */ e("p", { className: "cm:text-xs cm:font-medium cm:uppercase cm:text-muted-foreground", children: "Dropshipper" }),
              /* @__PURE__ */ t("p", { children: [
                c.dropship.name,
                " · ",
                c.dropship.phone
              ] })
            ] }),
            !c.shipping_address_text && !c.billing_address_text && !c.pickup && /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "No address." })
          ] })
        ] }),
        (c.customer_note || c.fields && Object.keys(c.fields).length > 0) && /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: "From the customer" }) }),
          /* @__PURE__ */ t(o, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            c.customer_note && /* @__PURE__ */ e("p", { className: "cm:whitespace-pre-line", children: c.customer_note }),
            c.fields && Object.entries(c.fields).map(([d, B]) => /* @__PURE__ */ t("p", { children: [
              /* @__PURE__ */ t("span", { className: "cm:text-muted-foreground", children: [
                d.replace(/_/g, " "),
                ":"
              ] }),
              " ",
              String(B ?? "")
            ] }, d))
          ] })
        ] }),
        /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: "Details" }) }),
          /* @__PURE__ */ t(o, { className: "cm:grid cm:gap-1 cm:text-sm", children: [
            c.payment_method_title && /* @__PURE__ */ t("p", { children: [
              "Payment: ",
              c.payment_method_title
            ] }),
            c.expires_at && c.payment_status === "unpaid" && /* @__PURE__ */ t("p", { children: [
              "Pay before ",
              Z(c.expires_at)
            ] }),
            c.paid_at && /* @__PURE__ */ t("p", { children: [
              "Paid ",
              Z(c.paid_at)
            ] }),
            c.completed_at && /* @__PURE__ */ t("p", { children: [
              "Completed ",
              Z(c.completed_at)
            ] }),
            c.cancelled_at && /* @__PURE__ */ t("p", { children: [
              "Cancelled ",
              Z(c.cancelled_at),
              c.cancel_reason ? ` — ${c.cancel_reason}` : ""
            ] }),
            c.quote_valid_until && /* @__PURE__ */ t("p", { children: [
              "Quote valid until ",
              Z(c.quote_valid_until)
            ] }),
            c.documents.length > 0 && /* @__PURE__ */ e("div", { className: "cm:mt-2 cm:flex cm:flex-wrap cm:gap-2", children: c.documents.map((d) => /* @__PURE__ */ e(p, { size: "sm", variant: "outline", asChild: !0, children: /* @__PURE__ */ t("a", { href: d.url, target: "_blank", rel: "noreferrer", children: [
              d.label,
              d.number ? ` ${d.number}` : ""
            ] }) }, d.type)) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e(C, { open: j !== null, onOpenChange: (d) => !d && M(null), children: /* @__PURE__ */ t(h, { children: [
      /* @__PURE__ */ t(v, { children: [
        /* @__PURE__ */ e(b, { children: j?.to === "cancelled" ? "Cancel this order?" : "Put this order on hold?" }),
        /* @__PURE__ */ e(_, { children: j?.to === "cancelled" ? "Stock, flash sale quantities and voucher uses are given back." : "It can go back to its status later." })
      ] }),
      /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(f, { htmlFor: "o-reason", children: "Reason (on the timeline)" }),
        /* @__PURE__ */ e(u, { id: "o-reason", value: Y, onChange: (d) => ne(d.target.value) })
      ] }),
      /* @__PURE__ */ t(s, { children: [
        /* @__PURE__ */ e(p, { variant: "outline", onClick: () => M(null), children: "Back" }),
        /* @__PURE__ */ e(p, { onClick: () => j && le(j.to, Y), children: "Confirm" })
      ] })
    ] }) }),
    /* @__PURE__ */ e(C, { open: ce, onOpenChange: w, children: /* @__PURE__ */ t(h, { children: [
      /* @__PURE__ */ t(v, { children: [
        /* @__PURE__ */ e(b, { children: "Mark as paid" }),
        /* @__PURE__ */ t(_, { children: [
          "Record a payment you received outside the store (",
          c.totals.total,
          ")."
        ] })
      ] }),
      /* @__PURE__ */ t("form", { className: "cm:grid cm:gap-3", onSubmit: (d) => {
        d.preventDefault(), U.post(N(`${k}/mark-paid`), { preserveScroll: !0, onSuccess: () => w(!1) });
      }, children: [
        /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(f, { htmlFor: "p-ref", children: "Reference" }),
          /* @__PURE__ */ e(u, { id: "p-ref", value: U.data.reference, onChange: (d) => U.setData("reference", d.target.value) })
        ] }),
        /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(f, { htmlFor: "p-date", children: "Paid on" }),
          /* @__PURE__ */ e(u, { id: "p-date", type: "datetime-local", value: U.data.paid_at, onChange: (d) => U.setData("paid_at", d.target.value) })
        ] }),
        /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(f, { htmlFor: "p-acc", children: "Into account" }),
          /* @__PURE__ */ e(u, { id: "p-acc", value: U.data.account, onChange: (d) => U.setData("account", d.target.value) })
        ] }),
        /* @__PURE__ */ e(s, { children: /* @__PURE__ */ e(p, { type: "submit", disabled: U.processing, children: "Record payment" }) })
      ] })
    ] }) }),
    I && /* @__PURE__ */ e(mn, { order: c, couriers: n.couriers, onClose: () => A(!1) }),
    Q && /* @__PURE__ */ e(un, { order: c, onClose: () => T(!1) })
  ] });
}
function ke({ label: n, value: c, muted: r, strong: a }) {
  return /* @__PURE__ */ t("div", { className: `cm:flex cm:justify-between cm:gap-4 ${r ? "cm:text-muted-foreground" : ""} ${a ? "cm:text-base cm:font-semibold" : ""}`, children: [
    /* @__PURE__ */ e("dt", { children: n }),
    /* @__PURE__ */ e("dd", { children: c })
  ] });
}
const pn = { published: "ok", draft: "neutral", scheduled: "info", trashed: "error" };
function gn(n) {
  const { DataTable: c } = ye, { Button: r } = O, { Link: a } = E;
  return G(), W.useBreadcrumbs([{ label: "Shop", href: N("commerce") }, { label: "Products" }]), /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      X,
      {
        title: "Products",
        description: "Products are entries: opening one goes to the editor.",
        actions: /* @__PURE__ */ e(r, { asChild: !0, children: /* @__PURE__ */ e(a, { href: N(n.createUrl), children: "New product" }) })
      }
    ),
    /* @__PURE__ */ e(
      c,
      {
        ...n,
        searchPlaceholder: "Search titles or SKUs…",
        rowHref: (i) => N(i.href),
        renderCell: (i, l) => {
          switch (l.key) {
            case "product_title":
              return /* @__PURE__ */ t("span", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ e("span", { className: "cm:font-medium", children: i.product_title }),
                i.featured && /* @__PURE__ */ e(L, { tone: "info", children: "Featured" }),
                i.sync_failed && /* @__PURE__ */ e("span", { title: i.sync_error ?? "", children: /* @__PURE__ */ e(L, { tone: "error", children: "Can't be bought" }) })
              ] });
            case "state":
              return /* @__PURE__ */ e(L, { tone: pn[i.state], children: i.state });
            case "stock":
              return i.stock === null ? "—" : /* @__PURE__ */ e("span", { className: i.in_stock === !1 ? "cm:text-destructive" : "", children: i.stock });
            case "type":
              return /* @__PURE__ */ e(L, { children: i.type });
            default:
              return;
          }
        }
      }
    )
  ] });
}
const Ct = (n) => n.toLocaleString(void 0, { maximumFractionDigits: 0 });
function Ne(n, c) {
  return n == null || n === "" ? "—" : typeof n != "number" ? c === "date" && /^\d{4}-\d{2}-\d{2}$/.test(String(n)) ? (/* @__PURE__ */ new Date(`${n}T00:00:00`)).toLocaleDateString() : String(n) : c === "money" ? oe(n) : c === "percent" ? `${n.toLocaleString(void 0, { maximumFractionDigits: 1 })}%` : Ct(n);
}
const Ge = (n) => n === "money" || n === "count" || n === "percent";
function fn({ report: n, reports: c, period: r, result: a, exportUrl: i }) {
  const {
    Card: l,
    CardContent: o,
    CardHeader: g,
    CardTitle: x,
    CardDescription: p,
    Button: y,
    Input: f,
    Label: m,
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
  } = O, { Link: M, router: Y } = E;
  G(), W.useBreadcrumbs([{ label: "Shop", href: N("commerce") }, { label: "Reports", href: N("commerce/reports") }, { label: n.label }]);
  const [ne, ce] = F.useState(r.from), [w, I] = F.useState(r.to), A = (T) => Y.get(N(`commerce/reports/${n.key}`), { from: r.from, to: r.to, interval: r.interval, compare: r.compare, ...T }, { preserveScroll: !0 }), Q = a.chart && a.columns.find((T) => T.key === a.chart?.series[0]?.key)?.kind === "money" ? (T) => oe(T) : Ct;
  return /* @__PURE__ */ t("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:grid-cols-1 cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      X,
      {
        title: "Reports",
        description: n.description || void 0,
        actions: i ? /* @__PURE__ */ e(y, { asChild: !0, variant: "outline", children: /* @__PURE__ */ e("a", { href: i, children: "Export CSV" }) }) : void 0
      }
    ),
    /* @__PURE__ */ e("nav", { "aria-label": "Reports", className: "cm:flex cm:flex-wrap cm:gap-1", children: c.map((T) => /* @__PURE__ */ e(
      M,
      {
        href: N(`commerce/reports/${T.key}`),
        "aria-current": T.key === n.key ? "page" : void 0,
        className: de("cm:rounded-md cm:px-3 cm:py-1.5 cm:text-sm", T.key === n.key ? "cm:bg-primary cm:text-primary-foreground" : "cm:hover:bg-muted"),
        children: T.label
      },
      T.key
    )) }),
    n.usesDates && /* @__PURE__ */ e(l, { children: /* @__PURE__ */ t(o, { className: "cm:flex cm:flex-wrap cm:items-end cm:gap-3 cm:pt-6", children: [
      /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(m, { htmlFor: "report-preset", children: "Period" }),
        /* @__PURE__ */ t(u, { value: r.preset ?? "custom", onValueChange: (T) => T !== "custom" && Y.get(N(`commerce/reports/${n.key}`), { period: T, compare: r.compare }, { preserveScroll: !0 }), children: [
          /* @__PURE__ */ e(s, { id: "report-preset", className: "cm:w-44", children: /* @__PURE__ */ e(v, {}) }),
          /* @__PURE__ */ t(C, { children: [
            Object.entries(r.presets).map(([T, V]) => /* @__PURE__ */ e(h, { value: T, children: V }, T)),
            /* @__PURE__ */ e(h, { value: "custom", children: "Custom" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ t("form", { className: "cm:flex cm:flex-wrap cm:items-end cm:gap-3", onSubmit: (T) => {
        T.preventDefault(), A({ from: ne, to: w });
      }, children: [
        /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(m, { htmlFor: "report-from", children: "From" }),
          /* @__PURE__ */ e(f, { id: "report-from", type: "date", value: ne, max: w, onChange: (T) => ce(T.target.value) })
        ] }),
        /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(m, { htmlFor: "report-to", children: "To" }),
          /* @__PURE__ */ e(f, { id: "report-to", type: "date", value: w, min: ne, onChange: (T) => I(T.target.value) })
        ] }),
        /* @__PURE__ */ e(y, { type: "submit", variant: "outline", children: "Apply" })
      ] }),
      /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(m, { htmlFor: "report-compare", children: "Compare with" }),
        /* @__PURE__ */ t(u, { value: r.compare, onValueChange: (T) => A({ compare: T }), children: [
          /* @__PURE__ */ e(s, { id: "report-compare", className: "cm:w-44", children: /* @__PURE__ */ e(v, {}) }),
          /* @__PURE__ */ t(C, { children: [
            /* @__PURE__ */ e(h, { value: "previous", children: "Previous period" }),
            /* @__PURE__ */ e(h, { value: "year", children: "Same period last year" }),
            /* @__PURE__ */ e(h, { value: "none", children: "Nothing" })
          ] })
        ] })
      ] }),
      n.key === "sales" && /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(m, { htmlFor: "report-interval", children: "Group by" }),
        /* @__PURE__ */ t(u, { value: r.interval, onValueChange: (T) => A({ interval: T }), children: [
          /* @__PURE__ */ e(s, { id: "report-interval", className: "cm:w-32", children: /* @__PURE__ */ e(v, {}) }),
          /* @__PURE__ */ t(C, { children: [
            /* @__PURE__ */ e(h, { value: "day", children: "Day" }),
            /* @__PURE__ */ e(h, { value: "week", children: "Week" }),
            /* @__PURE__ */ e(h, { value: "month", children: "Month" })
          ] })
        ] })
      ] })
    ] }) }),
    a.summary.length > 0 && /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2 cm:lg:grid-cols-5", children: a.summary.map((T) => /* @__PURE__ */ e(fe, { kpi: { key: T.key, label: T.label, value: Ne(T.value, T.kind), change: T.change } }, T.key)) }),
    a.chart && a.chart.data.length > 0 && /* @__PURE__ */ t(l, { children: [
      /* @__PURE__ */ t(g, { children: [
        /* @__PURE__ */ e(x, { children: n.label }),
        n.usesDates && /* @__PURE__ */ t(p, { children: [
          Ne(r.from, "date"),
          " – ",
          Ne(r.to, "date")
        ] })
      ] }),
      /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(
        Ye,
        {
          label: n.label,
          kind: a.chart.kind,
          data: a.chart.data,
          xKey: a.chart.xKey,
          series: a.chart.series,
          format: Q,
          formatX: a.chart.xKey === "date" ? (T) => Ne(T, "date") : void 0
        }
      ) })
    ] }),
    /* @__PURE__ */ e(l, { children: /* @__PURE__ */ e(o, { className: "cm:pt-6", children: a.rows.length === 0 ? /* @__PURE__ */ e(Ce, { title: "Nothing to show", description: n.usesDates ? "There is no data for this period." : "Nothing needs attention." }) : /* @__PURE__ */ e("div", { className: "cm:overflow-x-auto", children: /* @__PURE__ */ t(b, { children: [
      /* @__PURE__ */ e(k, { children: /* @__PURE__ */ e(j, { children: a.columns.map((T) => /* @__PURE__ */ e($, { className: Ge(T.kind) ? "cm:text-right" : void 0, children: T.label }, T.key)) }) }),
      /* @__PURE__ */ t(_, { children: [
        a.rows.map((T, V) => /* @__PURE__ */ e(j, { children: a.columns.map((U, ae) => /* @__PURE__ */ e(D, { className: de(Ge(U.kind) && "cm:text-right cm:tabular-nums"), children: ae === 0 && T.href ? /* @__PURE__ */ e(M, { href: N(T.href), className: "cm:underline-offset-2 cm:hover:underline", children: Ne(T[U.key], U.kind) }) : Ne(T[U.key], U.kind) }, U.key)) }, V)),
        a.totals && /* @__PURE__ */ e(j, { className: "cm:font-semibold", children: a.columns.map((T) => /* @__PURE__ */ e(D, { className: de(Ge(T.kind) && "cm:text-right cm:tabular-nums"), children: Ne(a.totals?.[T.key], T.kind) }, T.key)) })
      ] })
    ] }) }) }) })
  ] });
}
function wt({ items: n, current: c, label: r = "Sections" }) {
  const { Link: a } = E;
  return /* @__PURE__ */ e("nav", { "aria-label": r, className: "cm:flex cm:gap-1 cm:overflow-x-auto cm:md:flex-col", children: n.map((i) => /* @__PURE__ */ e(
    a,
    {
      href: N(i.href),
      "aria-current": i.key === c ? "page" : void 0,
      className: de(
        "cm:whitespace-nowrap cm:rounded-md cm:px-3 cm:py-1.5 cm:text-sm cm:text-muted-foreground cm:hover:bg-muted cm:hover:text-foreground",
        i.key === c && "cm:bg-muted cm:font-medium cm:text-foreground"
      ),
      children: i.label
    },
    i.key
  )) });
}
function Fe({ sections: n, current: c, title: r, description: a, children: i }) {
  const { SettingsTabs: l } = ye;
  return G(), W.useBreadcrumbs([{ label: "Settings", href: N("settings") }, { label: "Store", href: N("commerce/settings") }, { label: r }]), /* @__PURE__ */ t("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(l, { current: "store" }),
    /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-6 cm:md:grid-cols-[12rem_1fr]", children: [
      /* @__PURE__ */ e(wt, { items: n, current: c, label: "Store settings" }),
      /* @__PURE__ */ t("div", { className: "cm:grid cm:min-w-0 cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ e(X, { title: r, description: a }),
        i
      ] })
    ] })
  ] });
}
function vn({ sections: n, emails: c }) {
  const { Card: r, CardContent: a, CardHeader: i, CardTitle: l, Switch: o, Button: g } = O, { Link: x, router: p } = E, y = [["To customers", c.filter((f) => f.audience === "customer")], ["To staff", c.filter((f) => f.audience === "staff")]];
  return /* @__PURE__ */ e(Fe, { sections: n, current: "emails", title: "Emails", description: "What the store sends, and to whom. Open an email to change its texts, recipients and attachments.", children: y.map(([f, m]) => m.length > 0 && /* @__PURE__ */ t(r, { children: [
    /* @__PURE__ */ e(i, { children: /* @__PURE__ */ e(l, { children: f }) }),
    /* @__PURE__ */ e(a, { className: "cm:p-0", children: /* @__PURE__ */ e("ul", { className: "cm:divide-y cm:divide-border", children: m.map((u) => /* @__PURE__ */ t("li", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:px-6 cm:py-3", children: [
      /* @__PURE__ */ t("div", { className: "cm:min-w-0", children: [
        /* @__PURE__ */ e(x, { href: N(u.edit_url), className: "cm:font-medium cm:hover:underline", children: u.label }),
        u.description && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: u.description })
      ] }),
      /* @__PURE__ */ t("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
        u.preview_url && /* @__PURE__ */ t(z, { children: [
          /* @__PURE__ */ e(g, { size: "sm", variant: "ghost", asChild: !0, children: /* @__PURE__ */ e("a", { href: u.preview_url, target: "_blank", rel: "noreferrer", children: "Preview" }) }),
          /* @__PURE__ */ e(g, { size: "sm", variant: "ghost", onClick: () => p.post(N(`commerce/settings/emails/${u.key}/test`), {}, { preserveScroll: !0 }), children: "Send test" })
        ] }),
        u.locked ? /* @__PURE__ */ e(L, { children: "Always sent" }) : /* @__PURE__ */ e(
          o,
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
function bn({ sections: n, mode: c, groups: r, updateUrl: a }) {
  const { Card: i, CardContent: l, CardHeader: o, CardTitle: g, Switch: x, Button: p, Dialog: y, DialogContent: f, DialogDescription: m, DialogFooter: u, DialogHeader: C, DialogTitle: h } = O, { errors: s } = E.usePage().props, [v, b] = F.useState(null), [_, D] = F.useState(null), $ = (k, j) => {
    D(k.key), E.router.put(a.replace("__key__", k.key), { on: j }, { preserveScroll: !0, onFinish: () => D(null) });
  };
  return /* @__PURE__ */ t(
    Fe,
    {
      sections: n,
      current: "features",
      title: "Features",
      description: /* @__PURE__ */ t(z, { children: [
        "Switch store modules on or off. Selling mode: ",
        /* @__PURE__ */ e("strong", { children: c.label }),
        ". Switching off never deletes data."
      ] }),
      children: [
        s.feature && /* @__PURE__ */ e("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: s.feature }),
        r.map((k) => /* @__PURE__ */ t(i, { children: [
          /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(g, { children: k.label }) }),
          /* @__PURE__ */ e(l, { className: "cm:grid cm:gap-0 cm:divide-y cm:divide-border", children: k.features.map((j) => /* @__PURE__ */ t("div", { className: "cm:flex cm:items-start cm:justify-between cm:gap-4 cm:py-3 cm:first:pt-0 cm:last:pb-0", children: [
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ t("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ e("label", { htmlFor: `feature-${j.key}`, className: "cm:font-medium", children: j.label }),
                j.core && /* @__PURE__ */ e(L, { children: "Always on" }),
                j.switched_on && !j.active && /* @__PURE__ */ t(L, { tone: "warning", children: [
                  "Off — ",
                  j.reasons.join("; ").replace(/^Needs /, "needs ")
                ] }),
                j.essential && /* @__PURE__ */ t(L, { tone: "info", children: [
                  "Needed by ",
                  c.label
                ] })
              ] }),
              /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: j.description }),
              j.requires.length > 0 && /* @__PURE__ */ t("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
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
        /* @__PURE__ */ e(y, { open: v !== null, onOpenChange: (k) => !k && b(null), children: /* @__PURE__ */ t(f, { children: [
          /* @__PURE__ */ t(C, { children: [
            /* @__PURE__ */ t(h, { children: [
              "Switch off ",
              v?.label,
              "?"
            ] }),
            /* @__PURE__ */ t(m, { children: [
              "These are switched off with it: ",
              v?.dependents.map((k) => k.label).join(", "),
              ". Their data is kept."
            ] })
          ] }),
          /* @__PURE__ */ t(u, { children: [
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
function yn({ sections: n, methods: c, instanceTypes: r }) {
  const { Card: a, CardContent: i, Button: l, Switch: o } = O, { Link: g, router: x } = E, p = (y, f) => x.post(N("commerce/settings/payments/move"), { key: y, direction: f }, { preserveScroll: !0 });
  return /* @__PURE__ */ t(Fe, { sections: n, current: "payments", title: "Payments", description: "Payment methods offered at checkout and on the pay page, in this order.", children: [
    c.length === 0 && /* @__PURE__ */ e(Ce, { title: "No payment methods", description: "Switch on Bank transfer, QRIS and cash on delivery in Features, or install a gateway package." }),
    c.length > 0 && /* @__PURE__ */ e(a, { children: /* @__PURE__ */ e(i, { className: "cm:p-0", children: /* @__PURE__ */ e("ul", { className: "cm:divide-y cm:divide-border", children: c.map((y, f) => /* @__PURE__ */ t("li", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:px-4 cm:py-3", children: [
      /* @__PURE__ */ t("div", { className: "cm:min-w-0", children: [
        /* @__PURE__ */ e(g, { href: N(y.edit_url), className: "cm:font-medium cm:hover:underline", children: y.title }),
        /* @__PURE__ */ t("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
          y.type,
          y.instance ? ` · ${y.key}` : ""
        ] })
      ] }),
      /* @__PURE__ */ t("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
        !y.active && /* @__PURE__ */ e(L, { children: "Off" }),
        /* @__PURE__ */ e(l, { variant: "ghost", size: "sm", "aria-label": "Move up", disabled: f === 0, onClick: () => p(y.key, "up"), children: "↑" }),
        /* @__PURE__ */ e(l, { variant: "ghost", size: "sm", "aria-label": "Move down", disabled: f === c.length - 1, onClick: () => p(y.key, "down"), children: "↓" }),
        /* @__PURE__ */ e(
          o,
          {
            checked: y.active,
            "aria-label": `${y.title} active`,
            onCheckedChange: (m) => x.put(N(`commerce/settings/payments/${y.key}/active`), { active: m }, { preserveScroll: !0 })
          }
        )
      ] })
    ] }, y.key)) }) }) }),
    r.length > 0 && /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:gap-2", children: r.map((y) => /* @__PURE__ */ t(l, { variant: "outline", onClick: () => x.post(N("commerce/settings/payments/instances"), { type: y.key }), children: [
      "Add ",
      y.label.toLowerCase()
    ] }, y.key)) })
  ] });
}
function Ze({ form: n, footer: c }) {
  const { FieldRenderer: r } = ye, { Button: a } = O, { data: i, setData: l, errors: o, processing: g, isDirty: x, ...p } = E.useForm({ values: n.values });
  return /* @__PURE__ */ t(
    "form",
    {
      className: "cm:grid cm:gap-6",
      onSubmit: (y) => {
        y.preventDefault(), p[n.method](n.action, { preserveScroll: !0 });
      },
      children: [
        o.section && /* @__PURE__ */ e("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: o.section }),
        /* @__PURE__ */ e(
          r,
          {
            fields: n.fields,
            values: i.values,
            errors: o,
            pathPrefix: "values",
            onChange: (y) => l("values", y)
          }
        ),
        /* @__PURE__ */ t("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
          /* @__PURE__ */ e(a, { type: "submit", disabled: g, children: n.submitLabel }),
          x && /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: "Unsaved changes" }),
          c
        ] })
      ]
    }
  );
}
function xn({ section: n, sections: c, form: r }) {
  const a = ve.settingsSections()[n.key];
  return /* @__PURE__ */ e(Fe, { sections: c, current: n.key, title: `${n.label} settings`, children: a ? /* @__PURE__ */ e(a, { section: n, form: r }, n.key) : /* @__PURE__ */ e(Ze, { form: r }, n.key) });
}
function kn({ sections: n, zones: c, types: r, couriers: a, moveUrl: i }) {
  const { Card: l, CardContent: o, CardHeader: g, CardTitle: x, Button: p, Select: y, SelectContent: f, SelectItem: m, SelectTrigger: u, SelectValue: C } = O, { Link: h } = E, s = (v, b, _) => E.router.post(N(i), { kind: v, id: b, direction: _ }, { preserveScroll: !0 });
  return /* @__PURE__ */ t(
    Fe,
    {
      sections: n,
      current: "shipping",
      title: "Shipping",
      description: "Zones are checked in order and the first one matching the address gives its methods. Pickup methods are offered everywhere.",
      children: [
        /* @__PURE__ */ e("div", { className: "cm:flex cm:justify-end", children: /* @__PURE__ */ e(p, { asChild: !0, children: /* @__PURE__ */ e(h, { href: N("commerce/settings/shipping/zones/create"), children: "Add zone" }) }) }),
        c.length === 0 && /* @__PURE__ */ e(Ce, { title: "No shipping zones yet", description: "Without a zone, checkout offers no shipping. Add one for your country or provinces." }),
        c.map((v, b) => /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ t(g, { className: "cm:flex cm:flex-row cm:items-start cm:justify-between cm:gap-4", children: [
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ t(x, { className: "cm:flex cm:items-center cm:gap-2", children: [
                v.name,
                v.everywhere_else && /* @__PURE__ */ e(L, { tone: "info", children: "Everywhere else" })
              ] }),
              !v.everywhere_else && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: v.regions.length > 0 ? v.regions.join(", ") : "No regions" })
            ] }),
            /* @__PURE__ */ t("div", { className: "cm:flex cm:shrink-0 cm:gap-1", children: [
              /* @__PURE__ */ e(p, { variant: "ghost", size: "sm", "aria-label": "Move up", disabled: b === 0, onClick: () => s("zone", v.id, "up"), children: "↑" }),
              /* @__PURE__ */ e(p, { variant: "ghost", size: "sm", "aria-label": "Move down", disabled: b === c.length - 1, onClick: () => s("zone", v.id, "down"), children: "↓" }),
              /* @__PURE__ */ e(p, { variant: "outline", size: "sm", asChild: !0, children: /* @__PURE__ */ e(h, { href: N(v.edit_url), children: "Edit" }) })
            ] })
          ] }),
          /* @__PURE__ */ t(o, { className: "cm:grid cm:gap-3", children: [
            v.methods.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No methods in this zone." }),
            v.methods.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:divide-y cm:divide-border cm:rounded-md cm:border", children: v.methods.map((_, D) => /* @__PURE__ */ t("li", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:px-3 cm:py-2", children: [
              /* @__PURE__ */ t("div", { className: "cm:min-w-0", children: [
                /* @__PURE__ */ e(h, { href: N(_.edit_url), className: "cm:font-medium cm:hover:underline", children: _.title }),
                /* @__PURE__ */ t("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  _.type,
                  _.etd ? ` · ${_.etd}` : ""
                ] })
              ] }),
              /* @__PURE__ */ t("div", { className: "cm:flex cm:items-center cm:gap-1", children: [
                !_.active && /* @__PURE__ */ e(L, { children: "Inactive" }),
                /* @__PURE__ */ e(p, { variant: "ghost", size: "sm", "aria-label": "Move up", disabled: D === 0, onClick: () => s("method", _.id, "up"), children: "↑" }),
                /* @__PURE__ */ e(p, { variant: "ghost", size: "sm", "aria-label": "Move down", disabled: D === v.methods.length - 1, onClick: () => s("method", _.id, "down"), children: "↓" })
              ] })
            ] }, _.id)) }),
            /* @__PURE__ */ e("div", { children: /* @__PURE__ */ t(y, { value: "", onValueChange: (_) => E.router.visit(N(`commerce/settings/shipping/zones/${v.id}/methods/create?type=${_}`)), children: [
              /* @__PURE__ */ e(u, { className: "cm:w-48", "aria-label": `Add a method to ${v.name}`, children: /* @__PURE__ */ e(C, { placeholder: "Add method…" }) }),
              /* @__PURE__ */ e(f, { children: r.map((_) => /* @__PURE__ */ e(m, { value: _.key, children: _.label }, _.key)) })
            ] }) })
          ] })
        ] }, v.id)),
        /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(x, { children: "Courier presets" }) }),
          /* @__PURE__ */ t(o, { children: [
            /* @__PURE__ */ e("p", { className: "cm:mb-3 cm:text-sm cm:text-muted-foreground", children: "Offered when adding a shipment; the tracking link is filled in from the tracking number. Add more in config/commerce.php or with Commerce::registerCourier()." }),
            /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1 cm:text-sm cm:sm:grid-cols-2", children: a.map((v) => /* @__PURE__ */ t("li", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e("span", { className: "cm:font-medium", children: v.name }),
              !v.tracking_url && /* @__PURE__ */ e("span", { className: "cm:text-xs cm:text-muted-foreground", children: "(no tracking link)" })
            ] }, v.key)) })
          ] })
        ] })
      ]
    }
  );
}
function Nn({ title: n, description: c, form: r, breadcrumbs: a = [], deleteUrl: i, deleteConfirm: l }) {
  const { Button: o } = O;
  return G(), W.useBreadcrumbs([...a.map((g) => ({ ...g, href: g.href ? N(g.href) : void 0 })), { label: n }]), /* @__PURE__ */ t("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-3xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(X, { title: n, description: c }),
    /* @__PURE__ */ e(Ze, { form: r, footer: i ? /* @__PURE__ */ e(
      o,
      {
        type: "button",
        variant: "ghost",
        className: "cm:ml-auto cm:text-destructive",
        onClick: () => window.confirm(l ?? "Delete this?") && E.router.delete(N(i)),
        children: "Delete"
      }
    ) : null })
  ] });
}
function _n(n) {
  const { DataTable: c } = ye, { Button: r } = O, { Link: a } = E;
  return G(), W.useBreadcrumbs([{ label: "Shop", href: N("commerce") }, { label: n.title }]), /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      X,
      {
        title: n.title,
        description: n.description,
        actions: n.createUrl || n.exportUrl ? /* @__PURE__ */ t("div", { className: "cm:flex cm:gap-2", children: [
          n.exportUrl ? /* @__PURE__ */ e(r, { asChild: !0, variant: "outline", children: /* @__PURE__ */ e("a", { href: n.exportUrl + window.location.search, children: "Export CSV" }) }) : null,
          n.createUrl ? /* @__PURE__ */ e(r, { asChild: !0, children: /* @__PURE__ */ e(a, { href: N(n.createUrl), children: n.createLabel ?? "New" }) }) : null
        ] }) : null
      }
    ),
    /* @__PURE__ */ e(
      c,
      {
        ...n,
        bulkUrl: n.bulkUrl ? N(n.bulkUrl) : void 0,
        rowHref: (i) => i.href ? N(i.href) : null,
        renderCell: (i, l) => l.type === "badge" && i[l.key] != null ? /* @__PURE__ */ e(L, { tone: i[`${l.key}_tone`] ?? "neutral", children: String(i[l.key]) }) : void 0
      }
    )
  ] });
}
const Cn = {
  "Commerce/Confirmations/Index": Kt,
  "Commerce/Customers/Show": Wt,
  "Commerce/Dashboard": Jt,
  "Commerce/Inventory/Index": Zt,
  "Commerce/Marketing/Editor": rn,
  "Commerce/Marketing/Report": ln,
  "Commerce/Orders/Editor": on,
  "Commerce/Orders/Show": hn,
  "Commerce/Products/Index": gn,
  "Commerce/Reports/Show": fn,
  "Commerce/Settings/Section": xn,
  "Commerce/Settings/Emails": vn,
  "Commerce/Settings/Features": bn,
  "Commerce/Settings/Payments": yn,
  "Commerce/Settings/Shipping": kn,
  "Commerce/Shared/SchemaForm": Nn,
  "Commerce/Shared/ResourceIndex": _n
};
function wn() {
  Object.entries(Cn).forEach(([n, c]) => W.registerPage(n, c));
}
function gt(n) {
  if (!n) return "";
  const c = new Date(n);
  if (Number.isNaN(c.getTime())) return "";
  const r = (a) => String(a).padStart(2, "0");
  return `${c.getFullYear()}-${r(c.getMonth() + 1)}-${r(c.getDate())}T${r(c.getHours())}:${r(c.getMinutes())}`;
}
function ft(n) {
  return n ? new Date(n).toISOString() : null;
}
function Sn({ value: n, onChange: c, pathPrefix: r }) {
  const { Input: a, Label: i } = O, l = { start: n?.start ?? null, end: n?.end ?? null };
  return /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(i, { htmlFor: `${r}-start`, children: "Starts" }),
      /* @__PURE__ */ e(
        a,
        {
          id: `${r}-start`,
          type: "datetime-local",
          value: gt(l.start),
          onChange: (o) => c({ ...l, start: ft(o.target.value) })
        }
      )
    ] }),
    /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(i, { htmlFor: `${r}-end`, children: "Ends" }),
      /* @__PURE__ */ e(
        a,
        {
          id: `${r}-end`,
          type: "datetime-local",
          value: gt(l.end),
          onChange: (o) => c({ ...l, end: ft(o.target.value) })
        }
      )
    ] })
  ] });
}
function $n({ field: n, value: c, onChange: r, errors: a, pathPrefix: i }) {
  return G(), /* @__PURE__ */ e(
    _e,
    {
      id: i,
      value: c,
      onChange: r,
      allowNull: n.config?.allow_null !== !1,
      invalid: !!(i && a?.[i])
    }
  );
}
function me() {
  return (globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`).replace(/-/g, "").slice(0, 32);
}
function vt(n) {
  return Object.keys(n).sort().map((c) => `${c}=${n[c]}`).join("|");
}
function Dn(n) {
  let c = [{}];
  for (const r of n) {
    if (r.values.length === 0) return [];
    const a = [];
    for (const i of c)
      for (const l of r.values)
        a.push({ ...i, [r.id]: l.id });
    c = a;
  }
  return n.length === 0 ? [] : c;
}
function Fn(n, c, r, a = 100) {
  const i = new Map(c.map((l) => [vt(l.options), l]));
  return Dn(n).slice(0, a).map((l) => {
    const o = i.get(vt(l));
    return o ? { ...o, options: l } : { ...r, id: me(), sku: null, options: l, active: !0, price: r.price ?? 0 };
  });
}
function St(n, c, r = {}) {
  return n.map((a) => {
    const i = a.values.find((l) => l.id === c.options[a.id]);
    return i ? i.label ?? (i.term_id ? r[i.term_id] ?? `#${i.term_id}` : "?") : "?";
  }).join(" / ");
}
function q({ label: n, hint: c, children: r, htmlFor: a, className: i }) {
  const { Label: l } = O;
  return /* @__PURE__ */ t("div", { className: de("cm:grid cm:gap-1.5", i), children: [
    /* @__PURE__ */ e(l, { htmlFor: a, children: n }),
    r,
    c && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: c })
  ] });
}
function $e({ children: n, cols: c = 3 }) {
  return /* @__PURE__ */ e("div", { className: de("cm:grid cm:gap-4", { 2: "cm:sm:grid-cols-2", 3: "cm:sm:grid-cols-2 cm:lg:grid-cols-3", 4: "cm:sm:grid-cols-2 cm:lg:grid-cols-4" }[c]), children: n });
}
function K({ id: n, value: c, onChange: r, min: a = 0, placeholder: i }) {
  const { Input: l } = O;
  return /* @__PURE__ */ e(
    l,
    {
      id: n,
      type: "number",
      inputMode: "numeric",
      min: a,
      value: c ?? "",
      placeholder: i,
      onChange: (o) => r(o.target.value === "" ? null : Math.round(Number(o.target.value)))
    }
  );
}
function De({ id: n, value: c, onChange: r, placeholder: a, onBlur: i }) {
  const { Input: l } = O;
  return /* @__PURE__ */ e(
    l,
    {
      id: n,
      value: c ?? "",
      placeholder: a,
      onBlur: i,
      onChange: (o) => r(o.target.value === "" ? null : o.target.value)
    }
  );
}
function be({ id: n, value: c, onChange: r, nullable: a = !0 }) {
  return /* @__PURE__ */ e(_e, { id: n, value: c, allowNull: a, onChange: r });
}
function Se({ id: n, label: c, checked: r, onChange: a, hint: i }) {
  const { Switch: l, Label: o } = O;
  return /* @__PURE__ */ t("div", { className: "cm:flex cm:items-start cm:gap-3", children: [
    /* @__PURE__ */ e(l, { id: n, checked: r, onCheckedChange: a }),
    /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-0.5", children: [
      /* @__PURE__ */ e(o, { htmlFor: n, children: c }),
      i && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: i })
    ] })
  ] });
}
const Tn = "cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm";
function ee({ id: n, value: c, onChange: r, options: a }) {
  return /* @__PURE__ */ e("select", { id: n, className: Tn, value: c, onChange: (i) => r(i.target.value), children: a.map(([i, l]) => /* @__PURE__ */ e("option", { value: i, children: l }, i)) });
}
function re({ title: n, description: c, children: r, actions: a }) {
  return /* @__PURE__ */ t("section", { className: "cm:grid cm:gap-4", children: [
    /* @__PURE__ */ t("div", { className: "cm:flex cm:items-start cm:justify-between cm:gap-3", children: [
      /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-0.5", children: [
        /* @__PURE__ */ e("h3", { className: "cm:text-sm cm:font-semibold", children: n }),
        c && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: c })
      ] }),
      a
    ] }),
    r
  ] });
}
function jn({ value: n, update: c, path: r }) {
  const { Button: a, Input: i } = O, l = n.bundle ?? { pricing: "fixed", value: 0, items: [] }, [o, g] = F.useState({}), [x, p] = F.useState(""), [y, f] = F.useState([]), m = l.items.map((h) => h.variant_id).filter((h) => !!h);
  F.useEffect(() => {
    const h = m.filter((s) => !o[s]);
    h.length !== 0 && te(N(`commerce/api/variants?${h.map((s) => `ids[]=${s}`).join("&")}`)).then((s) => g((v) => ({ ...v, ...Object.fromEntries(s.data.map((b) => [b.id, b])) }))).catch(() => {
    });
  }, [m.join(",")]), F.useEffect(() => {
    if (x.trim().length < 2) return f([]);
    const h = setTimeout(() => te(N(`commerce/api/variants?q=${encodeURIComponent(x)}`)).then((s) => f(s.data)).catch(() => {
    }), 250);
    return () => clearTimeout(h);
  }, [x]);
  const u = (h) => c({ bundle: { ...l, ...h } }), C = l.items.reduce((h, s) => h + (o[s.variant_id ?? 0]?.price ?? 0) * s.quantity, 0);
  return /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ t(re, { title: "Products in the bundle", description: "Bundles take their stock from these products.", children: [
      l.items.map((h, s) => /* @__PURE__ */ t("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ e("span", { className: "cm:flex-1 cm:text-sm", children: o[h.variant_id ?? 0]?.label ?? `#${h.variant_id}` }),
        /* @__PURE__ */ e("div", { className: "cm:w-24", children: /* @__PURE__ */ e(K, { min: 1, value: h.quantity, onChange: (v) => u({ items: l.items.map((b, _) => _ === s ? { ...b, quantity: v ?? 1 } : b) }) }) }),
        /* @__PURE__ */ e(a, { type: "button", variant: "ghost", size: "sm", onClick: () => u({ items: l.items.filter((v, b) => b !== s) }), children: "Remove" })
      ] }, s)),
      /* @__PURE__ */ t("div", { className: "cm:relative", children: [
        /* @__PURE__ */ e(i, { value: x, placeholder: "Search products or SKUs to add…", "aria-label": "Add a product to the bundle", onChange: (h) => p(h.target.value) }),
        y.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-10 cm:mt-1 cm:max-h-64 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: y.map((h) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            className: "cm:flex cm:w-full cm:justify-between cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted",
            onClick: () => {
              g((s) => ({ ...s, [h.id]: h })), u({ items: [...l.items, { variant_id: h.id, quantity: 1 }] }), p("");
            },
            children: [
              /* @__PURE__ */ t("span", { children: [
                h.label,
                h.sku && /* @__PURE__ */ t("span", { className: "cm:text-muted-foreground", children: [
                  " · ",
                  h.sku
                ] })
              ] }),
              /* @__PURE__ */ e("span", { children: oe(h.price) })
            ]
          }
        ) }, h.id)) })
      ] })
    ] }),
    /* @__PURE__ */ e(re, { title: "Bundle price", description: `The products cost ${oe(C)} together.`, children: /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(q, { label: "Price", htmlFor: `${r}-bundle-pricing`, children: /* @__PURE__ */ e(
        ee,
        {
          id: `${r}-bundle-pricing`,
          value: l.pricing,
          onChange: (h) => u({ pricing: h, value: 0 }),
          options: [["fixed", "Its own price (General tab)"], ["percent_off", "Total minus a percentage"], ["amount_off", "Total minus an amount"]]
        }
      ) }),
      l.pricing === "percent_off" && /* @__PURE__ */ e(q, { label: "Percent off", htmlFor: `${r}-bundle-value`, children: /* @__PURE__ */ e(K, { id: `${r}-bundle-value`, value: l.value / 100, onChange: (h) => u({ value: Math.round((h ?? 0) * 100) }) }) }),
      l.pricing === "amount_off" && /* @__PURE__ */ e(q, { label: "Amount off", htmlFor: `${r}-bundle-value`, children: /* @__PURE__ */ e(be, { id: `${r}-bundle-value`, value: l.value, nullable: !1, onChange: (h) => u({ value: h ?? 0 }) }) })
    ] }) })
  ] });
}
function qn() {
  return decodeURIComponent(document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/)?.[1] ?? "");
}
function Rn({ value: n, update: c, path: r }) {
  const { Button: a } = O, [i, l] = F.useState(!1), o = F.useRef(null), g = n.delivery ?? { modes: ["link", "account"], download_limit: null, expiry_days: null }, x = (f) => c({ delivery: { ...g, ...f } }), p = (f, m) => c({ downloads: n.downloads.map((u, C) => C === f ? { ...u, ...m } : u) }), y = async (f) => {
    if (f?.length) {
      l(!0);
      try {
        const m = [];
        for (const u of Array.from(f)) {
          const C = new FormData();
          C.append("file", u);
          const h = await fetch(N("commerce/api/downloads"), { method: "POST", body: C, headers: { "X-XSRF-TOKEN": qn(), Accept: "application/json" }, credentials: "same-origin" }), s = await h.json();
          if (!h.ok) throw new Error(s.message ?? "Upload failed");
          m.push({ id: me(), type: "file", file_id: s.data.id, url: null, name: u.name.replace(/\.[^.]+$/, ""), file: s.data });
        }
        c({ downloads: [...n.downloads, ...m] });
      } catch (m) {
        Re.error(m instanceof Error ? m.message : "Upload failed");
      } finally {
        l(!1), o.current && (o.current.value = "");
      }
    }
  };
  return /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ t(
      re,
      {
        title: "Files and links",
        description: "Files are stored privately and only served to customers who bought them.",
        actions: /* @__PURE__ */ t("div", { className: "cm:flex cm:gap-2", children: [
          /* @__PURE__ */ e(a, { type: "button", variant: "outline", size: "sm", disabled: i, onClick: () => o.current?.click(), children: i ? "Uploading…" : "Upload file" }),
          /* @__PURE__ */ e(a, { type: "button", variant: "outline", size: "sm", onClick: () => c({ downloads: [...n.downloads, { id: me(), type: "url", file_id: null, url: null, name: "" }] }), children: "Add link" }),
          /* @__PURE__ */ e("input", { ref: o, type: "file", multiple: !0, hidden: !0, onChange: (f) => y(f.target.files) })
        ] }),
        children: [
          n.downloads.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No files yet." }),
          n.downloads.map((f, m) => /* @__PURE__ */ t("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(q, { label: "Name", htmlFor: `${r}-dl-${m}`, children: /* @__PURE__ */ e(De, { id: `${r}-dl-${m}`, value: f.name, onChange: (u) => p(m, { name: u ?? "" }) }) }),
            f.type === "url" ? /* @__PURE__ */ e(q, { label: "Link", htmlFor: `${r}-dl-${m}-url`, children: /* @__PURE__ */ e(De, { id: `${r}-dl-${m}-url`, value: f.url, placeholder: "https://", onChange: (u) => p(m, { url: u }) }) }) : /* @__PURE__ */ e(q, { label: "File", children: /* @__PURE__ */ e("p", { className: "cm:truncate cm:text-sm cm:text-muted-foreground", children: f.file?.filename ?? `File #${f.file_id}` }) }),
            /* @__PURE__ */ e(a, { type: "button", variant: "ghost", size: "sm", onClick: () => c({ downloads: n.downloads.filter((u, C) => C !== m) }), children: "Remove" })
          ] }, f.id ?? m))
        ]
      }
    ),
    /* @__PURE__ */ t(re, { title: "Delivery", children: [
      /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-3", children: [["attachment", "Attach files to the email"], ["link", "Download links in the email"], ["account", "Library in My Account"]].map(([f, m]) => /* @__PURE__ */ e(
        Se,
        {
          id: `${r}-mode-${f}`,
          label: m,
          checked: g.modes.includes(f),
          onChange: (u) => x({ modes: u ? [...g.modes, f] : g.modes.filter((C) => C !== f) })
        },
        f
      )) }),
      /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
        /* @__PURE__ */ e(q, { label: "Downloads per file", htmlFor: `${r}-limit`, hint: "Empty: unlimited.", children: /* @__PURE__ */ e(K, { id: `${r}-limit`, min: 1, value: g.download_limit, onChange: (f) => x({ download_limit: f }) }) }),
        /* @__PURE__ */ e(q, { label: "Links expire after (days)", htmlFor: `${r}-expiry`, hint: "Empty: never.", children: /* @__PURE__ */ e(K, { id: `${r}-expiry`, min: 1, value: g.expiry_days, onChange: (f) => x({ expiry_days: f }) }) })
      ] })
    ] })
  ] });
}
function $t({ id: n, value: c, onChange: r, entryId: a }) {
  const [i, l] = F.useState(null);
  return /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
    /* @__PURE__ */ e(De, { id: n, value: c, onChange: (g) => {
      l(null), r(g);
    }, onBlur: () => {
      if (!c) return l(null);
      const g = new URLSearchParams({ sku: c, entry: String(a ?? 0) });
      te(N(`commerce/api/sku-check?${g}`)).then((x) => l(x.available ? null : x.product ?? "another product")).catch(() => l(null));
    } }),
    i && /* @__PURE__ */ t("p", { className: "cm:text-xs cm:text-destructive", children: [
      "Already used by ",
      i,
      "."
    ] })
  ] });
}
const Pn = [
  ["default", "Follow the store (selling mode)"],
  ["cart", "Add to cart"],
  ["inquiry", "Inquiry form"],
  ["whatsapp", "Ask on WhatsApp"],
  ["external", "Links to other shops"],
  ["none", "No button (display only)"]
];
function On({ value: n, update: c, updateVariant: r, config: a, entryId: i, path: l }) {
  const { Button: o } = O, g = [["simple", "Simple product"]];
  (a.features.variants || n.type === "variable") && g.push(["variable", "Variable product (sizes, colors…)"]), (a.features.bundles || n.type === "bundle") && g.push(["bundle", "Bundle of other products"]);
  const x = n.variants[0];
  return /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ t($e, { cols: 2, children: [
      /* @__PURE__ */ e(q, { label: "Product type", htmlFor: `${l}-type`, children: /* @__PURE__ */ e(ee, { id: `${l}-type`, value: n.type, options: g, onChange: (p) => c({ type: p }) }) }),
      /* @__PURE__ */ e(q, { label: "Button on the product page", htmlFor: `${l}-mode`, hint: "'Follow the store' uses the selling mode set in Settings → Store.", children: /* @__PURE__ */ e(ee, { id: `${l}-mode`, value: n.purchase_mode, options: Pn, onChange: (p) => c({ purchase_mode: p }) }) })
    ] }),
    n.type !== "variable" && x && /* @__PURE__ */ e(re, { title: "Price", children: /* @__PURE__ */ t($e, { cols: 4, children: [
      /* @__PURE__ */ e(q, { label: "Price", htmlFor: `${l}-price`, children: /* @__PURE__ */ e(be, { id: `${l}-price`, value: x.price, nullable: !1, onChange: (p) => r(0, { price: p ?? 0 }) }) }),
      /* @__PURE__ */ e(q, { label: "Compare-at price", htmlFor: `${l}-compare`, hint: "Shown struck through when higher.", children: /* @__PURE__ */ e(be, { id: `${l}-compare`, value: x.compare_at_price, onChange: (p) => r(0, { compare_at_price: p }) }) }),
      /* @__PURE__ */ e(q, { label: "Cost", htmlFor: `${l}-cost`, hint: "For profit reports; never shown.", children: /* @__PURE__ */ e(be, { id: `${l}-cost`, value: x.cost, onChange: (p) => r(0, { cost: p }) }) }),
      /* @__PURE__ */ e(q, { label: "SKU", htmlFor: `${l}-sku`, children: /* @__PURE__ */ e($t, { id: `${l}-sku`, value: x.sku, entryId: i, onChange: (p) => r(0, { sku: p }) }) })
    ] }) }),
    (n.purchase_mode === "external" || n.external_links.length > 0) && /* @__PURE__ */ e(
      re,
      {
        title: "Links to other shops",
        description: "Buttons such as 'Buy on Tokopedia'.",
        actions: n.external_links.length < 10 && /* @__PURE__ */ e(o, { type: "button", variant: "outline", size: "sm", onClick: () => c({ external_links: [...n.external_links, { preset: "tokopedia", label: null, url: null }] }), children: "Add link" }),
        children: n.external_links.map((p, y) => {
          const f = (m) => c({ external_links: n.external_links.map((u, C) => C === y ? { ...u, ...m } : u) });
          return /* @__PURE__ */ t("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[10rem_1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(q, { label: "Shop", htmlFor: `${l}-link-${y}-preset`, children: /* @__PURE__ */ e(
              ee,
              {
                id: `${l}-link-${y}-preset`,
                value: p.preset ?? "",
                onChange: (m) => f({ preset: m || null }),
                options: [...Object.entries(a.link_presets), ["", "Other…"]]
              }
            ) }),
            /* @__PURE__ */ e(q, { label: "Button label", htmlFor: `${l}-link-${y}-label`, children: /* @__PURE__ */ e(De, { id: `${l}-link-${y}-label`, value: p.label, placeholder: p.preset ? `Buy on ${a.link_presets[p.preset]}` : "", onChange: (m) => f({ label: m }) }) }),
            /* @__PURE__ */ e(q, { label: "Link", htmlFor: `${l}-link-${y}-url`, children: /* @__PURE__ */ e(De, { id: `${l}-link-${y}-url`, value: p.url, placeholder: "https://", onChange: (m) => f({ url: m }) }) }),
            /* @__PURE__ */ e(o, { type: "button", variant: "ghost", size: "sm", onClick: () => c({ external_links: n.external_links.filter((m, u) => u !== y) }), children: "Remove" })
          ] }, y);
        })
      }
    ),
    /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(Se, { id: `${l}-shipping`, label: "Needs shipping", checked: n.requires_shipping, onChange: (p) => c({ requires_shipping: p }), hint: "Off for services and digital products." }),
      (a.features.digital || n.downloadable) && /* @__PURE__ */ e(Se, { id: `${l}-downloadable`, label: "Downloadable", checked: n.downloadable, onChange: (p) => c({ downloadable: p }), hint: "Customers get files or links after paying." }),
      /* @__PURE__ */ e(Se, { id: `${l}-featured`, label: "Featured", checked: n.featured, onChange: (p) => c({ featured: p }), hint: "Shown first when sorting by featured." })
    ] }),
    a.features.taxes && /* @__PURE__ */ e(q, { label: "Tax class", htmlFor: `${l}-tax`, children: /* @__PURE__ */ e(
      ee,
      {
        id: `${l}-tax`,
        value: n.tax_class ?? "",
        onChange: (p) => c({ tax_class: p || null }),
        options: [["", "Standard"], ...a.tax_classes.filter((p) => p !== "standard").map((p) => [p, p])]
      }
    ) })
  ] });
}
function Ln({ value: n, updateVariant: c, live: r, path: a }) {
  const i = n.variants[0];
  if (!i) return null;
  const l = r?.variants[i.id];
  return /* @__PURE__ */ t(re, { title: "Stock", children: [
    /* @__PURE__ */ e(
      Se,
      {
        id: `${a}-track`,
        label: "Track stock",
        checked: i.track_stock,
        onChange: (o) => c(0, { track_stock: o }),
        hint: "Count units: orders take them, cancellations give them back."
      }
    ),
    i.track_stock ? /* @__PURE__ */ t($e, { cols: 3, children: [
      l?.track_stock && l.stock_quantity !== null ? /* @__PURE__ */ e(q, { label: "In stock", hint: "Change it in Shop → Inventory, so every change is recorded.", children: /* @__PURE__ */ e("p", { className: "cm:text-2xl cm:font-semibold", children: l.stock_quantity }) }) : /* @__PURE__ */ e(q, { label: "Starting stock", htmlFor: `${a}-initial`, hint: "Set once, when the product is published.", children: /* @__PURE__ */ e(K, { id: `${a}-initial`, value: i.initial_stock, onChange: (o) => c(0, { initial_stock: o }) }) }),
      /* @__PURE__ */ e(q, { label: "When sold out", htmlFor: `${a}-backorders`, children: /* @__PURE__ */ e(
        ee,
        {
          id: `${a}-backorders`,
          value: i.backorders,
          onChange: (o) => c(0, { backorders: o }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }),
      /* @__PURE__ */ e(q, { label: "Low stock at", htmlFor: `${a}-low`, hint: "Empty: the store's setting.", children: /* @__PURE__ */ e(K, { id: `${a}-low`, value: i.low_stock_threshold, onChange: (o) => c(0, { low_stock_threshold: o }) }) })
    ] }) : /* @__PURE__ */ e(q, { label: "Stock status", htmlFor: `${a}-status`, children: /* @__PURE__ */ e(
      ee,
      {
        id: `${a}-status`,
        value: i.stock_status,
        onChange: (o) => c(0, { stock_status: o }),
        options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
      }
    ) })
  ] });
}
function En({ value: n, update: c, path: r }) {
  const { Button: a } = O, i = (l, o) => c({ tiers: n.tiers.map((g, x) => x === l ? { ...g, ...o } : g) });
  return /* @__PURE__ */ t(
    re,
    {
      title: "Bulk prices",
      description: "Lower unit prices for larger quantities. The best matching tier applies.",
      actions: n.tiers.length < 20 && /* @__PURE__ */ e(
        a,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          onClick: () => c({ tiers: [...n.tiers, { min_qty: (n.tiers.at(-1)?.min_qty ?? 1) + 9, type: "percent_off", value: 500, variant: null }] }),
          children: "Add tier"
        }
      ),
      children: [
        n.tiers.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No bulk prices." }),
        n.tiers.map((l, o) => /* @__PURE__ */ t("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[8rem_12rem_1fr_1fr_auto]", children: [
          /* @__PURE__ */ e(q, { label: "From (units)", htmlFor: `${r}-tier-${o}-min`, children: /* @__PURE__ */ e(K, { id: `${r}-tier-${o}-min`, min: 2, value: l.min_qty, onChange: (g) => i(o, { min_qty: g ?? 2 }) }) }),
          /* @__PURE__ */ e(q, { label: "Price", htmlFor: `${r}-tier-${o}-type`, children: /* @__PURE__ */ e(
            ee,
            {
              id: `${r}-tier-${o}-type`,
              value: l.type,
              onChange: (g) => i(o, { type: g, value: 0 }),
              options: [["percent_off", "Percent off"], ["amount_off", "Amount off per unit"], ["fixed_price", "Fixed unit price"]]
            }
          ) }),
          /* @__PURE__ */ e(q, { label: l.type === "percent_off" ? "Percent" : "Amount", htmlFor: `${r}-tier-${o}-value`, children: l.type === "percent_off" ? /* @__PURE__ */ e(K, { id: `${r}-tier-${o}-value`, value: l.value / 100, onChange: (g) => i(o, { value: Math.round((g ?? 0) * 100) }) }) : /* @__PURE__ */ e(be, { id: `${r}-tier-${o}-value`, value: l.value, nullable: !1, onChange: (g) => i(o, { value: g ?? 0 }) }) }),
          /* @__PURE__ */ e(q, { label: "For", htmlFor: `${r}-tier-${o}-variant`, children: /* @__PURE__ */ e(
            ee,
            {
              id: `${r}-tier-${o}-variant`,
              value: l.variant ?? "",
              onChange: (g) => i(o, { variant: g || null }),
              options: [["", "All variants"], ...n.type === "variable" ? n.variants.map((g) => [g.id, St(n.options, g)]) : []]
            }
          ) }),
          /* @__PURE__ */ e(a, { type: "button", variant: "ghost", size: "sm", onClick: () => c({ tiers: n.tiers.filter((g, x) => x !== o) }), children: "Remove" })
        ] }, o))
      ]
    }
  );
}
function In({ value: n, update: c, updateVariant: r, path: a }) {
  const i = n.variants[0];
  if (!i) return null;
  const l = (o) => n.type === "variable" ? c({ variants: n.variants.map((g) => ({ ...g, ...o })) }) : r(0, o);
  return /* @__PURE__ */ e(re, { title: "Package", description: n.type === "variable" ? "Applies to every variant; a variant can have its own weight under More." : "Used for shipping rates.", children: /* @__PURE__ */ t($e, { cols: 4, children: [
    /* @__PURE__ */ e(q, { label: "Weight (grams)", htmlFor: `${a}-weight`, children: /* @__PURE__ */ e(K, { id: `${a}-weight`, value: i.weight, onChange: (o) => l({ weight: o }) }) }),
    /* @__PURE__ */ e(q, { label: "Length (mm)", htmlFor: `${a}-length`, children: /* @__PURE__ */ e(K, { id: `${a}-length`, value: i.length, onChange: (o) => l({ length: o }) }) }),
    /* @__PURE__ */ e(q, { label: "Width (mm)", htmlFor: `${a}-width`, children: /* @__PURE__ */ e(K, { id: `${a}-width`, value: i.width, onChange: (o) => l({ width: o }) }) }),
    /* @__PURE__ */ e(q, { label: "Height (mm)", htmlFor: `${a}-height`, children: /* @__PURE__ */ e(K, { id: `${a}-height`, value: i.height, onChange: (o) => l({ height: o }) }) })
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
function An(n) {
  const [c, r] = F.useState({}), a = n.filter((i) => !(i in c));
  return F.useEffect(() => {
    if (a.length === 0) return;
    const i = a.map((l) => `ids[]=${l}`).join("&");
    te(N(`api/terms?${i}`)).then((l) => r((o) => ({ ...o, ...Object.fromEntries(l.data.map((g) => [g.id, g.title])) }))).catch(() => {
    });
  }, [a.join(",")]), c;
}
function Bn({ option: n, onChange: c, onRemove: r, config: a, path: i }) {
  const { Button: l, Input: o, Badge: g } = O, { FieldRenderer: x } = ye, [p, y] = F.useState(""), f = () => {
    const u = p.split(",").map((C) => C.trim()).filter(Boolean).filter((C) => !n.values.some((h) => (h.label ?? "").toLowerCase() === C.toLowerCase()));
    u.length && c({ ...n, values: [...n.values, ...u.map((C) => ({ id: me(), label: C }))] }), y("");
  }, m = n.values.map((u) => u.term_id).filter((u) => !!u);
  return /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-3 cm:rounded-md cm:border cm:p-3", children: [
    /* @__PURE__ */ t("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_1fr_auto]", children: [
      /* @__PURE__ */ e(q, { label: "Option name", htmlFor: `${i}-name`, children: /* @__PURE__ */ e(o, { id: `${i}-name`, value: n.name, placeholder: "Size", onChange: (u) => c({ ...n, name: u.target.value }) }) }),
      a.attribute_taxonomies.length > 0 ? /* @__PURE__ */ e(q, { label: "Values from", htmlFor: `${i}-source`, children: /* @__PURE__ */ e(
        ee,
        {
          id: `${i}-source`,
          value: n.taxonomy ?? "",
          onChange: (u) => c({ ...n, taxonomy: u || null, values: [] }),
          options: [["", "Custom values"], ...a.attribute_taxonomies.map((u) => [u.handle, u.title])]
        }
      ) }) : /* @__PURE__ */ e("div", {}),
      /* @__PURE__ */ e(l, { type: "button", variant: "ghost", size: "sm", onClick: r, children: "Remove option" })
    ] }),
    n.taxonomy ? /* @__PURE__ */ e(
      x,
      {
        fields: [{ handle: "terms", type: "terms", label: "Values", config: { taxonomy: n.taxonomy } }],
        values: { terms: m },
        pathPrefix: `${i}-terms`,
        onChange: (u) => {
          const C = u.terms ?? [], h = n.values.filter((v) => v.term_id && C.includes(v.term_id)), s = C.filter((v) => !h.some((b) => b.term_id === v)).map((v) => ({ id: me(), term_id: v }));
          c({ ...n, values: [...h, ...s] });
        }
      }
    ) : /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-2", children: [
      /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: n.values.map((u) => /* @__PURE__ */ t(g, { variant: "secondary", className: "cm:gap-1", children: [
        u.label,
        /* @__PURE__ */ e("button", { type: "button", "aria-label": `Remove ${u.label}`, onClick: () => c({ ...n, values: n.values.filter((C) => C.id !== u.id) }), children: "×" })
      ] }, u.id)) }),
      /* @__PURE__ */ t("div", { className: "cm:flex cm:gap-2", children: [
        /* @__PURE__ */ e(
          o,
          {
            value: p,
            placeholder: "S, M, L",
            "aria-label": `Add values to ${n.name || "option"}`,
            onChange: (u) => y(u.target.value),
            onKeyDown: (u) => {
              u.key === "Enter" && (u.preventDefault(), f());
            }
          }
        ),
        /* @__PURE__ */ e(l, { type: "button", variant: "outline", onClick: f, children: "Add" })
      ] })
    ] })
  ] });
}
function zn({ variant: n, index: c, updateVariant: r, tab: a }) {
  const { FieldRenderer: i } = ye, l = `${a.path}-v${c}`, o = a.live?.variants[n.id];
  return /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-4 cm:bg-muted/40 cm:p-4", children: [
    /* @__PURE__ */ t($e, { cols: 4, children: [
      /* @__PURE__ */ e(q, { label: "Cost", htmlFor: `${l}-cost`, children: /* @__PURE__ */ e(be, { id: `${l}-cost`, value: n.cost, onChange: (g) => r(c, { cost: g }) }) }),
      /* @__PURE__ */ e(q, { label: "Barcode", htmlFor: `${l}-barcode`, children: /* @__PURE__ */ e(De, { id: `${l}-barcode`, value: n.barcode, onChange: (g) => r(c, { barcode: g }) }) }),
      /* @__PURE__ */ e(q, { label: "Weight (g)", htmlFor: `${l}-weight`, children: /* @__PURE__ */ e(K, { id: `${l}-weight`, value: n.weight, onChange: (g) => r(c, { weight: g }), placeholder: "Product's" }) }),
      /* @__PURE__ */ e(q, { label: "Min / max / step", htmlFor: `${l}-min`, children: /* @__PURE__ */ t("div", { className: "cm:grid cm:grid-cols-3 cm:gap-1", children: [
        /* @__PURE__ */ e(K, { id: `${l}-min`, min: 1, value: n.min_qty, onChange: (g) => r(c, { min_qty: g ?? 1 }) }),
        /* @__PURE__ */ e(K, { min: 1, value: n.max_qty, onChange: (g) => r(c, { max_qty: g }), placeholder: "–" }),
        /* @__PURE__ */ e(K, { min: 1, value: n.qty_step, onChange: (g) => r(c, { qty_step: g ?? 1 }) })
      ] }) })
    ] }),
    a.config.features.inventory && /* @__PURE__ */ t($e, { cols: 4, children: [
      /* @__PURE__ */ e(Se, { id: `${l}-track`, label: "Track stock", checked: n.track_stock, onChange: (g) => r(c, { track_stock: g }) }),
      n.track_stock && (o?.track_stock && o.stock_quantity !== null ? /* @__PURE__ */ e(q, { label: "In stock", children: /* @__PURE__ */ t("p", { className: "cm:text-sm", children: [
        o.stock_quantity,
        " ",
        /* @__PURE__ */ e("span", { className: "cm:text-muted-foreground", children: "(change it in Shop → Inventory)" })
      ] }) }) : /* @__PURE__ */ e(q, { label: "Starting stock", htmlFor: `${l}-initial`, children: /* @__PURE__ */ e(K, { id: `${l}-initial`, value: n.initial_stock, onChange: (g) => r(c, { initial_stock: g }) }) })),
      n.track_stock ? /* @__PURE__ */ e(q, { label: "When sold out", htmlFor: `${l}-backorders`, children: /* @__PURE__ */ e(
        ee,
        {
          id: `${l}-backorders`,
          value: n.backorders,
          onChange: (g) => r(c, { backorders: g }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }) : /* @__PURE__ */ e(q, { label: "Stock status", htmlFor: `${l}-status`, children: /* @__PURE__ */ e(
        ee,
        {
          id: `${l}-status`,
          value: n.stock_status,
          onChange: (g) => r(c, { stock_status: g }),
          options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
        }
      ) })
    ] }),
    /* @__PURE__ */ e(
      i,
      {
        fields: [{ handle: "image", type: "asset", label: "Image", config: { image_only: !0 } }],
        values: { image: n.image },
        pathPrefix: `${l}-image`,
        onChange: (g) => r(c, { image: g.image ?? null })
      }
    )
  ] });
}
function Mn(n) {
  const { value: c, update: r, updateVariant: a, config: i, entryId: l, live: o } = n, { Button: g, Table: x, TableBody: p, TableCell: y, TableHead: f, TableHeader: m, TableRow: u, Switch: C } = O, [h, s] = F.useState(null), v = An(c.options.flatMap((D) => D.values.map(($) => $.term_id).filter(($) => !!$))), b = c.variants[0] ?? { ...Je, id: me() }, _ = (D = c.options) => r({ options: D, variants: Fn(D, c.variants, { ...b, initial_stock: null, image: null }, i.max_variants) });
  return /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ e(
      re,
      {
        title: "Options",
        description: `Up to ${i.max_options} options, such as size and color. Variants are made for every combination.`,
        actions: c.options.length < i.max_options && /* @__PURE__ */ e(g, { type: "button", variant: "outline", size: "sm", onClick: () => r({ options: [...c.options, { id: me(), name: "", taxonomy: null, values: [] }] }), children: "Add option" }),
        children: c.options.map((D, $) => /* @__PURE__ */ e(
          Bn,
          {
            option: D,
            config: i,
            path: `${n.path}-o${$}`,
            onChange: (k) => _(c.options.map((j, M) => M === $ ? k : j)),
            onRemove: () => _(c.options.filter((k, j) => j !== $))
          },
          D.id
        ))
      }
    ),
    /* @__PURE__ */ t(
      re,
      {
        title: `Variants (${c.variants.length})`,
        description: "Each has its own SKU, price and stock. Switch one off to stop selling it without losing it.",
        actions: /* @__PURE__ */ e(g, { type: "button", variant: "outline", size: "sm", onClick: () => _(), children: "Regenerate" }),
        children: [
          c.options.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "Add an option with values to create variants." }) : /* @__PURE__ */ e("div", { className: "cm:overflow-x-auto cm:rounded-md cm:border", children: /* @__PURE__ */ t(x, { children: [
            /* @__PURE__ */ e(m, { children: /* @__PURE__ */ t(u, { children: [
              /* @__PURE__ */ e(f, { children: "Variant" }),
              /* @__PURE__ */ e(f, { children: "SKU" }),
              /* @__PURE__ */ e(f, { children: "Price" }),
              /* @__PURE__ */ e(f, { children: "Compare-at" }),
              i.features.inventory && /* @__PURE__ */ e(f, { children: "Stock" }),
              /* @__PURE__ */ e(f, { children: "On sale" }),
              /* @__PURE__ */ e(f, {})
            ] }) }),
            /* @__PURE__ */ e(p, { children: c.variants.map((D, $) => {
              const k = o?.variants[D.id];
              return /* @__PURE__ */ t(F.Fragment, { children: [
                /* @__PURE__ */ t(u, { className: D.active ? "" : "cm:opacity-60", children: [
                  /* @__PURE__ */ e(y, { className: "cm:font-medium cm:whitespace-nowrap", children: St(c.options, D, v) }),
                  /* @__PURE__ */ e(y, { className: "cm:min-w-36", children: /* @__PURE__ */ e($t, { value: D.sku, entryId: l, onChange: (j) => a($, { sku: j }) }) }),
                  /* @__PURE__ */ e(y, { className: "cm:min-w-32", children: /* @__PURE__ */ e(be, { value: D.price, nullable: !1, onChange: (j) => a($, { price: j ?? 0 }) }) }),
                  /* @__PURE__ */ e(y, { className: "cm:min-w-32", children: /* @__PURE__ */ e(be, { value: D.compare_at_price, onChange: (j) => a($, { compare_at_price: j }) }) }),
                  i.features.inventory && /* @__PURE__ */ e(y, { className: "cm:whitespace-nowrap cm:text-sm", children: D.track_stock ? k?.stock_quantity ?? D.initial_stock ?? 0 : /* @__PURE__ */ e(L, { children: D.stock_status.replace("_", " ") }) }),
                  /* @__PURE__ */ e(y, { children: /* @__PURE__ */ e(C, { checked: D.active, "aria-label": "Sell this variant", onCheckedChange: (j) => a($, { active: j }) }) }),
                  /* @__PURE__ */ e(y, { children: /* @__PURE__ */ e(g, { type: "button", variant: "ghost", size: "sm", "aria-expanded": h === D.id, onClick: () => s(h === D.id ? null : D.id), children: h === D.id ? "Close" : "More" }) })
                ] }),
                h === D.id && /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(y, { colSpan: 7, className: "cm:p-0", children: /* @__PURE__ */ e(zn, { variant: D, index: $, updateVariant: a, tab: n }) }) })
              ] }, D.id);
            }) })
          ] }) }),
          c.variants.length > 0 && /* @__PURE__ */ t("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
            "Prices from ",
            oe(Math.min(...c.variants.map((D) => D.price))),
            " to ",
            oe(Math.max(...c.variants.map((D) => D.price))),
            "."
          ] })
        ]
      }
    )
  ] });
}
function Un(n) {
  const c = n ?? {}, r = (c.variants?.length ? c.variants : [{ ...Je, id: me() }]).map((a) => ({ ...Je, ...a, id: a.id ?? me() }));
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
function Hn({ field: n, value: c, onChange: r, errors: a, pathPrefix: i = "data.product" }) {
  G();
  const l = n.config ?? {}, o = Un(c), { props: g } = E.usePage(), x = g.entry?.id ?? null, [p, y] = F.useState(null);
  F.useEffect(() => {
    x && te(N(`commerce/api/products/${x}`)).then((_) => y(_.data)).catch(() => {
    });
  }, [x, g.entry]);
  const f = (_) => {
    const D = { ...o, ..._ };
    _.type && _.type !== "variable" && (D.options = [], D.variants = [{ ...D.variants[0], options: {} }]), _.type === "bundle" && !D.bundle && (D.bundle = { pricing: "fixed", value: 0, items: [] }), r(D);
  }, m = (_, D) => f({ variants: o.variants.map(($, k) => k === _ ? { ...$, ...D } : $) }), u = [{ key: "general", label: "General", render: (_) => /* @__PURE__ */ e(On, { ..._ }) }];
  o.type === "variable" && u.push({ key: "variants", label: "Variants", render: (_) => /* @__PURE__ */ e(Mn, { ..._ }) }), o.type === "bundle" && u.push({ key: "bundle", label: "Bundle", render: (_) => /* @__PURE__ */ e(jn, { ..._ }) }), o.type !== "variable" && (l.features?.inventory ?? !0) && u.push({ key: "inventory", label: "Inventory", render: (_) => /* @__PURE__ */ e(Ln, { ..._ }) }), o.requires_shipping && u.push({ key: "shipping", label: "Shipping", render: (_) => /* @__PURE__ */ e(In, { ..._ }) }), (l.features?.pricing_rules !== !1 || o.tiers.length > 0) && u.push({ key: "pricing", label: "Bulk prices", render: (_) => /* @__PURE__ */ e(En, { ..._ }) }), o.downloadable && u.push({ key: "digital", label: "Digital", render: (_) => /* @__PURE__ */ e(Rn, { ..._ }) });
  for (const [_, D] of Object.entries(ve.productTabs()))
    u.push({ key: `ext-${_}`, label: D.label ?? _, render: ($) => /* @__PURE__ */ e(D, { ...$ }) });
  const [C, h] = F.useState("general"), s = u.find((_) => _.key === C) ?? u[0], v = a?.[i], b = { value: o, update: f, updateVariant: m, config: l, live: p, entryId: x, path: i.replace(/\W+/g, "-") };
  return /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-4 cm:rounded-lg cm:border cm:p-4", children: [
    p?.sync_status === "failed" && /* @__PURE__ */ t("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: [
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
        className: de("cm:-mb-px cm:border-b-2 cm:px-3 cm:py-2 cm:text-sm", _.key === s.key ? "cm:border-primary cm:font-medium" : "cm:border-transparent cm:text-muted-foreground cm:hover:text-foreground"),
        children: _.label
      },
      _.key
    )) }),
    /* @__PURE__ */ e("div", { role: "tabpanel", children: s.render(b) })
  ] });
}
const Kn = {
  commerce_money: $n,
  commerce_datetime_range: Sn,
  commerce_region: _t,
  commerce_targets: Nt,
  commerce_product: Hn
};
function Wn() {
  Object.entries(Kn).forEach(([n, c]) => W.registerField(n, c));
}
function Vn({ sales: n, orders: c, todo: r }) {
  const { Card: a, CardContent: i, CardHeader: l, CardTitle: o, CardDescription: g } = O, { Link: x } = E;
  return /* @__PURE__ */ t(a, { children: [
    /* @__PURE__ */ t(l, { children: [
      /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(x, { href: N("commerce"), className: "cm:hover:underline", children: "Store" }) }),
      /* @__PURE__ */ e(g, { children: "Today" })
    ] }),
    /* @__PURE__ */ t(i, { className: "cm:grid cm:gap-3", children: [
      n === void 0 ? /* @__PURE__ */ e("div", { className: "cm:h-12 cm:animate-pulse cm:rounded-md cm:bg-muted" }) : /* @__PURE__ */ t("div", { className: "cm:flex cm:items-baseline cm:justify-between", children: [
        /* @__PURE__ */ e("span", { className: "cm:text-2xl cm:font-semibold cm:tabular-nums", children: n }),
        /* @__PURE__ */ t("span", { className: "cm:text-sm cm:text-muted-foreground", children: [
          c,
          " ",
          c === 1 ? "order" : "orders"
        ] })
      ] }),
      r && r.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1 cm:text-sm", children: r.map((p) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ t(x, { href: N(p.href), className: "cm:flex cm:justify-between cm:hover:underline", children: [
        /* @__PURE__ */ e("span", { children: p.label }),
        /* @__PURE__ */ e("span", { className: "cm:font-semibold", children: p.count })
      ] }) }, p.key)) })
    ] })
  ] });
}
function Qn() {
  Object.assign(ve.components, { Chart: Ye, EmptyState: Ce, KpiCard: fe, MoneyInput: _e, PageHeader: X, SchemaFormView: Ze, SectionNav: wt, SettingsLayout: Fe, StatusBadge: L }), W.registerDashboardCard?.("commerce-store", Vn);
}
Ut();
Qn();
Wn();
wn();
export {
  z as F,
  e as a,
  Ht as c,
  t as j
};
