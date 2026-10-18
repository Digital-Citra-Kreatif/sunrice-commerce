const je = { symbol: "Rp", position: "left", space: !1, thousands: ".", decimal: ",", decimals: 0 };
let Ne = je;
function Me(c) {
  Ne = { ...je, ...c ?? {} };
}
function Y(c, n = Ne) {
  const a = c < 0, r = Math.abs(Math.round(c)), s = 10 ** n.decimals, l = Math.floor(r / s).toString().replace(/\B(?=(\d{3})+(?!\d))/g, n.thousands), d = n.decimals > 0 ? n.decimal + String(r % s).padStart(n.decimals, "0") : "", u = l + d, x = n.space ? " " : "", o = n.position === "left" ? `${n.symbol}${x}${u}` : `${u}${x}${n.symbol}`;
  return a ? `-${o}` : o;
}
function Re(c, n = Ne) {
  let a = c.replace(n.symbol, "").replace(/\s/g, "");
  const r = a.startsWith("-");
  a = a.replace(/^-/, "").split(n.thousands).join("");
  const [s, l = ""] = a.split(n.decimal);
  if (!/^\d*$/.test(s) || !/^\d*$/.test(l) || s + l === "")
    return null;
  const d = Number(s || "0") * 10 ** n.decimals + Number(l.padEnd(n.decimals, "0").slice(0, n.decimals) || "0");
  return r ? -d : d;
}
const te = {
  orderPanels: {},
  dashboardWidgets: {},
  settingsSections: {},
  productTabs: {}
}, ne = {
  version: 1,
  registerOrderPanel: (c, n) => {
    te.orderPanels[c] = n;
  },
  registerDashboardWidget: (c, n) => {
    te.dashboardWidgets[c] = n;
  },
  registerSettingsSection: (c, n) => {
    te.settingsSections[c] = n;
  },
  registerProductTab: (c, n) => {
    te.productTabs[c] = n;
  },
  orderPanels: () => te.orderPanels,
  dashboardWidgets: () => te.dashboardWidgets,
  settingsSections: () => te.settingsSections,
  productTabs: () => te.productTabs,
  formatMoney: Y,
  parseMoney: Re,
  components: {}
};
function Ue() {
  window.SunriceCommerce = ne;
  const c = window.SunriceCommerceQueue ?? [];
  (() => {
    for (; c.length > 0; ) {
      const a = c.shift();
      try {
        a?.(ne);
      } catch (r) {
        console.error("SunriceCommerceQueue call failed", r);
      }
    }
  })(), c.push = ((...a) => (a.forEach((r) => r(ne)), c.length)), window.SunriceCommerceQueue = c;
}
const z = window.Sunrice, { React: T, ui: j, components: me, inertia: P, fetchJson: X, toast: He } = z;
function C(c = "") {
  return c.startsWith("/") ? c : z.adminUrl(c);
}
const Pe = window.Sunrice.React, A = Pe.Fragment;
function e(c, n, a) {
  return Pe.createElement(c, a === void 0 ? n : { ...n, key: a });
}
const t = e;
function V({ title: c, description: n, actions: a }) {
  const { Head: r } = P;
  return /* @__PURE__ */ t("div", { className: "cm:flex cm:flex-wrap cm:items-start cm:justify-between cm:gap-4", children: [
    /* @__PURE__ */ e(r, { title: c }),
    /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e("h1", { className: "cm:text-xl cm:font-semibold cm:tracking-tight", children: c }),
      n && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: n })
    ] }),
    a && /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: a })
  ] });
}
function Ie(c) {
  var n, a, r = "";
  if (typeof c == "string" || typeof c == "number") r += c;
  else if (typeof c == "object") if (Array.isArray(c)) {
    var s = c.length;
    for (n = 0; n < s; n++) c[n] && (a = Ie(c[n])) && (r && (r += " "), r += a);
  } else for (a in c) c[a] && (r && (r += " "), r += a);
  return r;
}
function Ke() {
  for (var c, n, a = 0, r = "", s = arguments.length; a < s; a++) (c = arguments[a]) && (n = Ie(c)) && (r && (r += " "), r += n);
  return r;
}
function J(...c) {
  return Ke(c);
}
const Se = {
  ok: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  success: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  warning: "cm:bg-amber-500/10 cm:text-amber-700 cm:dark:text-amber-400",
  error: "cm:bg-red-500/10 cm:text-red-700 cm:dark:text-red-400",
  info: "cm:bg-sky-500/10 cm:text-sky-700 cm:dark:text-sky-400",
  neutral: "cm:bg-muted cm:text-muted-foreground"
};
function R({ tone: c = "neutral", children: n }) {
  return /* @__PURE__ */ e("span", { className: J("cm:inline-flex cm:items-center cm:rounded-full cm:px-2 cm:py-0.5 cm:text-xs cm:font-medium", Se[c] ?? Se.neutral), children: n });
}
function de({ title: c, description: n, action: a }) {
  return /* @__PURE__ */ t("div", { className: "cm:flex cm:flex-col cm:items-center cm:gap-2 cm:rounded-lg cm:border cm:border-dashed cm:px-6 cm:py-10 cm:text-center", children: [
    /* @__PURE__ */ e("p", { className: "cm:font-medium", children: c }),
    n && /* @__PURE__ */ e("p", { className: "cm:max-w-md cm:text-sm cm:text-muted-foreground", children: n }),
    a && /* @__PURE__ */ e("div", { className: "cm:mt-2", children: a })
  ] });
}
function W() {
  const { props: c } = P.usePage(), n = c.commerce ?? {};
  return Me(n.currency), n;
}
function We({ status: c, confirmations: n }) {
  const { Card: a, CardContent: r, Button: s, Input: l, Dialog: d, DialogContent: u, DialogFooter: x, DialogHeader: o, DialogTitle: N } = j, { Link: y, router: h } = P;
  W(), z.useBreadcrumbs([{ label: "Shop", href: C("commerce") }, { label: "Payments to verify" }]);
  const [p, _] = T.useState(null), [g, i] = T.useState(""), v = (f) => {
    const w = f.expected_amount !== null && f.amount_value < f.expected_amount;
    w && !window.confirm(`${f.amount} is less than the ${f.expected} expected. Approve anyway?`) || h.post(C(`commerce/confirmations/${f.id}/approve`), { anyway: w }, { preserveScroll: !0 });
  };
  return /* @__PURE__ */ t("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-5xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(V, { title: "Payments to verify", description: "Customers' transfer confirmations. Compare the proof with the amount expected, then approve or reject." }),
    /* @__PURE__ */ e("div", { className: "cm:flex cm:gap-2", children: ["submitted", "approved", "rejected"].map((f) => /* @__PURE__ */ e(s, { size: "sm", variant: f === c ? "default" : "outline", asChild: !0, children: /* @__PURE__ */ e(y, { href: C(`commerce/confirmations?status=${f}`), children: f === "submitted" ? "Waiting" : f[0].toUpperCase() + f.slice(1) }) }, f)) }),
    n.length === 0 && /* @__PURE__ */ e(de, { title: c === "submitted" ? "Nothing to verify" : "None yet" }),
    n.map((f) => /* @__PURE__ */ e(a, { children: /* @__PURE__ */ t(r, { className: "cm:grid cm:gap-4 cm:pt-6 cm:md:grid-cols-[1fr_16rem]", children: [
      /* @__PURE__ */ t("div", { className: "cm:grid cm:content-start cm:gap-1 cm:text-sm", children: [
        /* @__PURE__ */ t("p", { className: "cm:text-base cm:font-medium", children: [
          /* @__PURE__ */ e(y, { href: C(f.order.href), className: "cm:hover:underline", children: f.order.number }),
          " · ",
          f.order.customer
        ] }),
        /* @__PURE__ */ t("p", { children: [
          "Sent ",
          /* @__PURE__ */ e("strong", { children: f.amount }),
          f.expected && /* @__PURE__ */ t(A, { children: [
            " · expected ",
            /* @__PURE__ */ e("strong", { children: f.expected })
          ] }),
          f.expected_amount !== null && f.amount_value < f.expected_amount && /* @__PURE__ */ t(A, { children: [
            " ",
            /* @__PURE__ */ e(R, { tone: "warning", children: "Less than expected" })
          ] })
        ] }),
        /* @__PURE__ */ t("p", { children: [
          "From ",
          f.sender_name,
          f.sender_bank ? ` (${f.sender_bank})` : "",
          " on ",
          f.transferred_at ?? "—"
        ] }),
        f.destination && /* @__PURE__ */ t("p", { children: [
          "Into ",
          f.destination.bank,
          " ",
          f.destination.number,
          " · ",
          f.destination.holder
        ] }),
        f.method && /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: f.method }),
        f.note && /* @__PURE__ */ t("p", { className: "cm:whitespace-pre-line cm:text-muted-foreground", children: [
          "“",
          f.note,
          "”"
        ] }),
        f.review_note && /* @__PURE__ */ t("p", { className: "cm:text-muted-foreground", children: [
          "Rejected: ",
          f.review_note
        ] }),
        f.status === "submitted" && /* @__PURE__ */ t("div", { className: "cm:mt-2 cm:flex cm:gap-2", children: [
          /* @__PURE__ */ e(s, { size: "sm", onClick: () => v(f), children: "Approve" }),
          /* @__PURE__ */ e(s, { size: "sm", variant: "outline", onClick: () => {
            _(f), i("");
          }, children: "Reject" })
        ] })
      ] }),
      /* @__PURE__ */ e("div", { children: f.proof_url ? f.proof_is_pdf ? /* @__PURE__ */ e("a", { href: f.proof_url, target: "_blank", rel: "noreferrer", className: "cm:underline", children: "Open the PDF proof" }) : /* @__PURE__ */ e("a", { href: f.proof_url, target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ e("img", { src: f.proof_url, alt: `Proof for ${f.order.number}`, className: "cm:max-h-72 cm:w-full cm:rounded-md cm:border cm:object-contain" }) }) : /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No proof attached." }) })
    ] }) }, f.id)),
    /* @__PURE__ */ e(d, { open: p !== null, onOpenChange: (f) => !f && _(null), children: /* @__PURE__ */ t(u, { children: [
      /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(N, { children: "Reject this confirmation?" }) }),
      /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "The customer is emailed the reason and can confirm again; the payment deadline resumes." }),
      /* @__PURE__ */ e(l, { "aria-label": "Reason", placeholder: "e.g. We haven't received the transfer yet", value: g, onChange: (f) => i(f.target.value) }),
      /* @__PURE__ */ t(x, { children: [
        /* @__PURE__ */ e(s, { variant: "outline", onClick: () => _(null), children: "Back" }),
        /* @__PURE__ */ e(s, { disabled: g.trim() === "", onClick: () => p && h.post(C(`commerce/confirmations/${p.id}/reject`), { reason: g }, { preserveScroll: !0, onSuccess: () => _(null) }), children: "Reject" })
      ] })
    ] }) })
  ] });
}
const be = (c) => c ? new Date(c).toLocaleDateString(void 0, { dateStyle: "medium" }) : "—";
function Qe({ customer: c, account: n, roleOptions: a, orders: r, can: s }) {
  const { Card: l, CardContent: d, CardHeader: u, CardTitle: x, Button: o, Input: N, Label: y, Textarea: h, Switch: p, Checkbox: _ } = j, { Link: g, router: i } = P;
  W(), z.useBreadcrumbs([{ label: "Shop", href: C("commerce") }, { label: "Customers", href: C("commerce/customers") }, { label: c.name ?? c.email }]);
  const v = P.useForm({ name: c.name ?? "", phone: c.phone ?? "", note: c.note ?? "", accepts_marketing: c.accepts_marketing, roles: n?.roles ?? [] }), [f, w] = T.useState(!1), $ = (S) => i.post(C(`commerce/customers/${c.id}/${S}`), {}, { preserveScroll: !0 });
  return /* @__PURE__ */ t("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-5xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      V,
      {
        title: c.name ?? c.email,
        description: /* @__PURE__ */ t(A, { children: [
          c.email,
          c.phone ? ` · ${c.phone}` : ""
        ] }),
        actions: /* @__PURE__ */ t(A, { children: [
          c.deletion_requested_at && /* @__PURE__ */ t(R, { tone: "warning", children: [
            "Deletion requested ",
            be(c.deletion_requested_at)
          ] }),
          n ? /* @__PURE__ */ e(R, { tone: "ok", children: "Registered" }) : /* @__PURE__ */ e(R, { children: "Guest" })
        ] })
      }
    ),
    /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-3", children: [["Orders", String(c.orders_count)], ["Spent", c.total_spent], ["Last order", be(c.last_order_at)]].map(([S, b]) => /* @__PURE__ */ e(l, { children: /* @__PURE__ */ t(d, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
      /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: S }),
      /* @__PURE__ */ e("span", { className: "cm:text-xl cm:font-semibold", children: b })
    ] }) }, S)) }),
    /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[2fr_1fr]", children: [
      /* @__PURE__ */ t("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(x, { children: "Orders" }) }),
          /* @__PURE__ */ e(d, { children: r.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No orders yet." }) : /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1", children: r.map((S) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ t(g, { href: C(S.href), className: "cm:flex cm:justify-between cm:rounded cm:p-2 cm:hover:bg-muted", children: [
            /* @__PURE__ */ t("span", { children: [
              S.number,
              " · ",
              be(S.date)
            ] }),
            /* @__PURE__ */ t("span", { children: [
              /* @__PURE__ */ e(R, { children: S.status }),
              " ",
              S.total
            ] })
          ] }) }, S.id)) }) })
        ] }),
        /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(x, { children: "Addresses" }) }),
          /* @__PURE__ */ e(d, { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: c.addresses.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No saved addresses." }) : c.addresses.map((S) => /* @__PURE__ */ t("div", { className: "cm:rounded-md cm:border cm:p-3 cm:text-sm", children: [
            S.label && /* @__PURE__ */ e("p", { className: "cm:font-medium", children: S.label }),
            /* @__PURE__ */ e("p", { className: "cm:whitespace-pre-line", children: S.text }),
            /* @__PURE__ */ t("div", { className: "cm:mt-1 cm:flex cm:gap-1", children: [
              S.default_shipping && /* @__PURE__ */ e(R, { children: "Shipping" }),
              S.default_billing && /* @__PURE__ */ e(R, { children: "Billing" })
            ] })
          ] }, S.id)) })
        ] })
      ] }),
      /* @__PURE__ */ t("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(x, { children: "Details" }) }),
          /* @__PURE__ */ e(d, { children: /* @__PURE__ */ t("form", { className: "cm:grid cm:gap-3", onSubmit: (S) => {
            S.preventDefault(), v.put(C(`commerce/customers/${c.id}`), { preserveScroll: !0 });
          }, children: [
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(y, { htmlFor: "c-name", children: "Name" }),
              /* @__PURE__ */ e(N, { id: "c-name", disabled: !s.edit, value: v.data.name, onChange: (S) => v.setData("name", S.target.value) })
            ] }),
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(y, { htmlFor: "c-phone", children: "Phone" }),
              /* @__PURE__ */ e(N, { id: "c-phone", disabled: !s.edit, value: v.data.phone, onChange: (S) => v.setData("phone", S.target.value) })
            ] }),
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(y, { htmlFor: "c-note", children: "Note (staff only)" }),
              /* @__PURE__ */ e(h, { id: "c-note", disabled: !s.edit, value: v.data.note, onChange: (S) => v.setData("note", S.target.value) })
            ] }),
            /* @__PURE__ */ t("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e(p, { id: "c-marketing", disabled: !s.edit, checked: v.data.accepts_marketing, onCheckedChange: (S) => v.setData("accepts_marketing", S) }),
              /* @__PURE__ */ e(y, { htmlFor: "c-marketing", children: "Accepts marketing" })
            ] }),
            n && /* @__PURE__ */ t("fieldset", { className: "cm:grid cm:gap-1.5", children: [
              /* @__PURE__ */ e("legend", { className: "cm:mb-1 cm:text-sm cm:font-medium", children: "Roles" }),
              a.map((S) => /* @__PURE__ */ t("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
                /* @__PURE__ */ e(
                  _,
                  {
                    disabled: !s.edit,
                    checked: v.data.roles.includes(S),
                    onCheckedChange: (b) => v.setData("roles", b ? [...v.data.roles, S] : v.data.roles.filter((F) => F !== S))
                  }
                ),
                S
              ] }, S))
            ] }),
            s.edit && /* @__PURE__ */ e(o, { type: "submit", disabled: v.processing, children: "Save" })
          ] }) })
        ] }),
        n && /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(x, { children: "Account" }) }),
          /* @__PURE__ */ t(d, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            /* @__PURE__ */ t("p", { children: [
              "Email ",
              n.email_verified ? "verified" : "not verified"
            ] }),
            n.google && /* @__PURE__ */ t("p", { children: [
              "Google: ",
              n.google
            ] }),
            s.edit && /* @__PURE__ */ e(o, { variant: "outline", size: "sm", onClick: () => $("password-reset"), children: "Send a password reset link" }),
            s.edit && !n.email_verified && /* @__PURE__ */ e(o, { variant: "outline", size: "sm", onClick: () => $("verify"), children: "Mark email verified" })
          ] })
        ] }),
        s.delete && !c.anonymized && /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(x, { children: "Remove personal data" }) }),
          /* @__PURE__ */ t(d, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "Name, email, phone and addresses are deleted; orders keep their amounts." }),
            f ? /* @__PURE__ */ t("div", { className: "cm:flex cm:gap-2", children: [
              /* @__PURE__ */ e(o, { variant: "destructive", size: "sm", onClick: () => $("anonymize"), children: "Remove for good" }),
              /* @__PURE__ */ e(o, { variant: "outline", size: "sm", onClick: () => w(!1), children: "Cancel" })
            ] }) : /* @__PURE__ */ e(o, { variant: "outline", size: "sm", onClick: () => w(!0), children: "Anonymize" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
const Ve = T.lazy(() => import("./ChartImpl-BR4UHoT6.js"));
function ke(c) {
  const n = /* @__PURE__ */ e("div", { className: "cm:animate-pulse cm:rounded-md cm:bg-muted", style: { height: c.height ?? 260 } });
  return /* @__PURE__ */ e(T.Suspense, { fallback: n, children: /* @__PURE__ */ e(Ve, { ...c }) });
}
function _e({ kpi: c }) {
  const { Card: n, CardContent: a } = j, { Link: r } = P, s = c.change ?? null, l = /* @__PURE__ */ t(a, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
    /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: c.label }),
    /* @__PURE__ */ e("span", { className: "cm:text-2xl cm:font-semibold cm:tabular-nums", children: c.value }),
    s !== null && /* @__PURE__ */ t(
      "span",
      {
        className: J("cm:text-xs cm:font-medium", s > 0 ? "cm:text-emerald-600" : s < 0 ? "cm:text-red-600" : "cm:text-muted-foreground"),
        title: "Compared with the previous period",
        children: [
          /* @__PURE__ */ e("span", { "aria-hidden": !0, children: s > 0 ? "▲" : s < 0 ? "▼" : "•" }),
          " ",
          Math.abs(s).toLocaleString(void 0, { maximumFractionDigits: 1 }),
          "%",
          /* @__PURE__ */ t("span", { className: "cm:sr-only", children: [
            s > 0 ? " up" : s < 0 ? " down" : "",
            " from the previous period"
          ] })
        ]
      }
    ),
    c.hint && /* @__PURE__ */ e("span", { className: "cm:text-xs cm:text-muted-foreground", children: c.hint })
  ] });
  return /* @__PURE__ */ e(n, { children: c.href ? /* @__PURE__ */ e(r, { href: C(c.href), className: "cm:block", children: l }) : l });
}
const Ge = { pending: "warning", on_hold: "warning", processing: "info", completed: "ok", cancelled: "neutral", refunded: "neutral", failed: "error" }, Xe = (c) => (/* @__PURE__ */ new Date(`${c}T00:00:00`)).toLocaleDateString(void 0, { day: "numeric", month: "short" });
function Je({ mode: c, setup: n, health: a, period: r, analytics: s, canReports: l, kpis: d, sales: u, topProducts: x, todo: o, widgets: N, recentOrders: y }) {
  const { Card: h, CardContent: p, CardHeader: _, CardTitle: g, CardDescription: i, Button: v } = j, { Link: f } = P;
  W();
  const w = n.filter((b) => !b.done), $ = a.filter((b) => b.status !== "ok"), S = Object.entries(ne.dashboardWidgets()).filter(([b]) => N !== void 0 && b in N);
  return /* @__PURE__ */ t("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(V, { title: "Store", description: /* @__PURE__ */ t(A, { children: [
      "Selling mode: ",
      c.label
    ] }) }),
    w.length > 0 && /* @__PURE__ */ t(h, { children: [
      /* @__PURE__ */ t(_, { children: [
        /* @__PURE__ */ e(g, { children: "Set up your store" }),
        /* @__PURE__ */ t(i, { children: [
          n.length - w.length,
          " of ",
          n.length,
          " done"
        ] })
      ] }),
      /* @__PURE__ */ e(p, { className: "cm:grid cm:gap-2", children: n.map((b) => /* @__PURE__ */ t(f, { href: C(b.href), className: "cm:flex cm:items-start cm:gap-3 cm:rounded-md cm:p-2 cm:hover:bg-muted", children: [
        /* @__PURE__ */ e("span", { "aria-hidden": !0, className: b.done ? "cm:text-emerald-600" : "cm:text-muted-foreground", children: b.done ? "✓" : "○" }),
        /* @__PURE__ */ t("span", { className: "cm:grid", children: [
          /* @__PURE__ */ e("span", { className: b.done ? "cm:text-muted-foreground cm:line-through" : "cm:font-medium", children: b.label }),
          b.description && /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: b.description })
        ] })
      ] }, b.key)) })
    ] }),
    $.length > 0 && /* @__PURE__ */ t(h, { children: [
      /* @__PURE__ */ e(_, { children: /* @__PURE__ */ e(g, { children: "Needs attention" }) }),
      /* @__PURE__ */ e(p, { className: "cm:grid cm:gap-3", children: $.map((b) => /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ t("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
          /* @__PURE__ */ e(R, { tone: b.status, children: b.status === "error" ? "Problem" : "Warning" }),
          /* @__PURE__ */ e("span", { className: "cm:font-medium", children: b.label })
        ] }),
        /* @__PURE__ */ e("p", { className: "cm:text-sm", children: b.message }),
        b.fix && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: b.fix })
      ] }, b.key)) })
    ] }),
    s && /* @__PURE__ */ t("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2", children: [
      /* @__PURE__ */ e("div", { role: "group", "aria-label": "Period", className: "cm:flex cm:gap-1", children: r.options.map((b) => /* @__PURE__ */ e(
        v,
        {
          size: "sm",
          variant: b.value === r.key ? "default" : "outline",
          "aria-pressed": b.value === r.key,
          onClick: () => P.router.get(C("commerce"), { period: b.value }, { preserveScroll: !0, preserveState: !0 }),
          children: b.label
        },
        b.value
      )) }),
      l && /* @__PURE__ */ e(f, { href: C("commerce/reports/sales"), className: "cm:text-sm cm:underline", children: "All reports" })
    ] }),
    /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2 cm:lg:grid-cols-5", children: d === void 0 ? [0, 1, 2, 3, 4].map((b) => /* @__PURE__ */ e("div", { className: "cm:h-24 cm:animate-pulse cm:rounded-lg cm:bg-muted" }, b)) : d.map((b) => /* @__PURE__ */ e(_e, { kpi: b }, b.key)) }),
    s && /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-4 cm:lg:grid-cols-3", children: [
      /* @__PURE__ */ t(h, { className: "cm:lg:col-span-2", children: [
        /* @__PURE__ */ t(_, { children: [
          /* @__PURE__ */ e(g, { children: "Sales" }),
          /* @__PURE__ */ e(i, { children: "Total sales per day, against the previous period" })
        ] }),
        /* @__PURE__ */ e(p, { children: u === void 0 ? /* @__PURE__ */ e("div", { className: "cm:h-64 cm:animate-pulse cm:rounded-md cm:bg-muted" }) : /* @__PURE__ */ e(
          ke,
          {
            label: "Total sales per day",
            data: u,
            xKey: "date",
            formatX: Xe,
            format: (b) => Y(b),
            series: [{ key: "total", label: "This period" }, { key: "previous", label: "Previous period", dashed: !0 }]
          }
        ) })
      ] }),
      /* @__PURE__ */ t(h, { children: [
        /* @__PURE__ */ e(_, { children: /* @__PURE__ */ e(g, { children: "Top products" }) }),
        /* @__PURE__ */ e(p, { children: x === void 0 ? /* @__PURE__ */ e("div", { className: "cm:h-40 cm:animate-pulse cm:rounded-md cm:bg-muted" }) : x.length === 0 ? /* @__PURE__ */ e(de, { title: "No sales yet", description: "Best sellers in this period show up here." }) : /* @__PURE__ */ e("ol", { className: "cm:grid cm:gap-2", children: x.map((b) => /* @__PURE__ */ t("li", { className: "cm:flex cm:justify-between cm:gap-2 cm:text-sm", children: [
          b.href ? /* @__PURE__ */ e(f, { href: C(b.href), className: "cm:truncate cm:hover:underline", children: b.title }) : /* @__PURE__ */ e("span", { className: "cm:truncate", children: b.title }),
          /* @__PURE__ */ t("span", { className: "cm:shrink-0 cm:tabular-nums cm:text-muted-foreground", children: [
            b.units,
            " · ",
            b.revenue
          ] })
        ] }, b.product_id)) }) })
      ] })
    ] }),
    /* @__PURE__ */ t(h, { children: [
      /* @__PURE__ */ e(_, { children: /* @__PURE__ */ e(g, { children: "To do" }) }),
      /* @__PURE__ */ e(p, { children: o === void 0 ? /* @__PURE__ */ e("div", { className: "cm:h-16 cm:animate-pulse cm:rounded-md cm:bg-muted" }) : o.length === 0 ? /* @__PURE__ */ e(de, { title: "Nothing to do", description: "Orders to process and payments to verify show up here." }) : /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1", children: o.map((b) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ t(f, { href: C(b.href), className: "cm:flex cm:justify-between cm:rounded-md cm:p-2 cm:hover:bg-muted", children: [
        /* @__PURE__ */ e("span", { children: b.label }),
        /* @__PURE__ */ e("span", { className: "cm:font-semibold", children: b.count })
      ] }) }, b.key)) }) })
    ] }),
    y !== void 0 && y.length > 0 && /* @__PURE__ */ t(h, { children: [
      /* @__PURE__ */ e(_, { children: /* @__PURE__ */ e(g, { children: "Recent orders" }) }),
      /* @__PURE__ */ e(p, { children: /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1", children: y.map((b) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ t(f, { href: C(b.href), className: "cm:grid cm:grid-cols-[1fr_auto] cm:items-center cm:gap-x-3 cm:rounded-md cm:p-2 cm:hover:bg-muted cm:sm:grid-cols-[8rem_1fr_auto_auto]", children: [
        /* @__PURE__ */ e("span", { className: "cm:font-medium", children: b.number }),
        /* @__PURE__ */ e("span", { className: "cm:truncate cm:text-muted-foreground", children: b.customer }),
        /* @__PURE__ */ e(R, { tone: Ge[b.status_key], children: b.status }),
        /* @__PURE__ */ e("span", { className: "cm:tabular-nums", children: b.total })
      ] }) }, b.id)) }) })
    ] }),
    S.map(([b, F]) => /* @__PURE__ */ e(F, { ...N?.[b] }, b))
  ] });
}
const Ye = { in_stock: "ok", out_of_stock: "error", backorder: "warning" };
function Ze({ row: c, reasons: n, onClose: a }) {
  const { Dialog: r, DialogContent: s, DialogHeader: l, DialogTitle: d, DialogDescription: u, DialogFooter: x, Button: o, Input: N, Label: y } = j, h = P.useForm({ mode: "add", quantity: 0, reason: "manual", note: "" }), [p, _] = T.useState(null);
  T.useEffect(() => {
    X(C(`commerce/inventory/${c.id}/history`)).then((i) => _(i.data)).catch(() => _([]));
  }, [c.id]);
  const g = h.data.mode === "set" ? h.data.quantity : (c.stock_quantity ?? 0) + h.data.quantity;
  return /* @__PURE__ */ e(r, { open: !0, onOpenChange: (i) => !i && a(), children: /* @__PURE__ */ t(s, { className: "cm:max-w-lg", children: [
    /* @__PURE__ */ t(l, { children: [
      /* @__PURE__ */ e(d, { children: "Adjust stock" }),
      /* @__PURE__ */ t(u, { children: [
        c.product_title,
        c.sku ? ` · ${c.sku}` : "",
        ". Now: ",
        c.track_stock ? c.stock_quantity ?? 0 : "not tracked",
        "."
      ] })
    ] }),
    /* @__PURE__ */ t("form", { id: "adjust-stock", className: "cm:grid cm:gap-3", onSubmit: (i) => {
      i.preventDefault(), h.post(C(`commerce/inventory/${c.id}/adjust`), { preserveScroll: !0, onSuccess: a });
    }, children: [
      /* @__PURE__ */ t("div", { className: "cm:grid cm:grid-cols-2 cm:gap-3", children: [
        /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(y, { htmlFor: "adjust-mode", children: "Change" }),
          /* @__PURE__ */ t("select", { id: "adjust-mode", className: "cm:h-9 cm:rounded-md cm:border cm:bg-background cm:px-3 cm:text-sm", value: h.data.mode, onChange: (i) => h.setData("mode", i.target.value), children: [
            /* @__PURE__ */ e("option", { value: "add", children: "Add or remove" }),
            /* @__PURE__ */ e("option", { value: "set", children: "Set to" })
          ] })
        ] }),
        /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(y, { htmlFor: "adjust-quantity", children: h.data.mode === "set" ? "New stock" : "Units (+/−)" }),
          /* @__PURE__ */ e(N, { id: "adjust-quantity", type: "number", value: h.data.quantity, onChange: (i) => h.setData("quantity", Number(i.target.value)) }),
          h.errors.quantity && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-destructive", children: h.errors.quantity })
        ] })
      ] }),
      /* @__PURE__ */ t("div", { className: "cm:grid cm:grid-cols-2 cm:gap-3", children: [
        /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(y, { htmlFor: "adjust-reason", children: "Reason" }),
          /* @__PURE__ */ e("select", { id: "adjust-reason", className: "cm:h-9 cm:rounded-md cm:border cm:bg-background cm:px-3 cm:text-sm", value: h.data.reason, onChange: (i) => h.setData("reason", i.target.value), children: n.map((i) => /* @__PURE__ */ e("option", { value: i, children: i[0].toUpperCase() + i.slice(1) }, i)) })
        ] }),
        /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(y, { htmlFor: "adjust-note", children: "Note" }),
          /* @__PURE__ */ e(N, { id: "adjust-note", value: h.data.note, onChange: (i) => h.setData("note", i.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ t("p", { className: "cm:text-sm", children: [
        "Stock after: ",
        /* @__PURE__ */ e("strong", { children: g })
      ] })
    ] }),
    /* @__PURE__ */ t("div", { className: "cm:grid cm:max-h-56 cm:gap-1 cm:overflow-auto cm:border-t cm:pt-3 cm:text-sm", children: [
      /* @__PURE__ */ e("p", { className: "cm:font-medium", children: "History" }),
      p === null ? /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "Loading…" }) : p.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "No changes yet." }) : p.map((i) => /* @__PURE__ */ t("div", { className: "cm:flex cm:justify-between cm:gap-3", children: [
        /* @__PURE__ */ t("span", { children: [
          i.delta > 0 ? `+${i.delta}` : i.delta,
          " → ",
          i.quantity_after,
          " · ",
          i.reason,
          i.reference ? ` (${i.reference.type} #${i.reference.id})` : "",
          i.note ? ` · ${i.note}` : ""
        ] }),
        /* @__PURE__ */ t("span", { className: "cm:whitespace-nowrap cm:text-muted-foreground", children: [
          i.user ? `${i.user}, ` : "",
          new Date(i.at).toLocaleString()
        ] })
      ] }, i.id))
    ] }),
    /* @__PURE__ */ t(x, { children: [
      /* @__PURE__ */ e(o, { variant: "outline", type: "button", onClick: a, children: "Cancel" }),
      /* @__PURE__ */ e(o, { type: "submit", form: "adjust-stock", disabled: h.processing, children: "Save" })
    ] })
  ] }) });
}
function et(c) {
  const { DataTable: n } = me, [a, r] = T.useState(null);
  return W(), z.useBreadcrumbs([{ label: "Shop", href: C("commerce") }, { label: "Inventory" }]), /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(V, { title: "Inventory", description: "Stock of every product variant. Every change is recorded." }),
    /* @__PURE__ */ e(
      n,
      {
        ...c,
        searchPlaceholder: "Search products or SKUs…",
        onRowClick: c.can.adjust ? (s) => r(s) : void 0,
        renderCell: (s, l) => {
          if (l.key === "status") return /* @__PURE__ */ e(R, { tone: s.low ? "warning" : Ye[s.status], children: s.low ? "Low" : s.status.replace(/_/g, " ") });
          if (l.key === "stock_quantity") return s.track_stock ? s.stock_quantity : /* @__PURE__ */ e("span", { className: "cm:text-muted-foreground", children: "—" });
        }
      }
    ),
    a && /* @__PURE__ */ e(Ze, { row: a, reasons: c.reasons, onClose: () => r(null) })
  ] });
}
function se({
  value: c,
  onChange: n,
  id: a,
  placeholder: r,
  allowNull: s = !0,
  invalid: l
}) {
  const { Input: d } = j, u = (h) => h == null ? "" : Y(h).replace(/^[^\d-]+|[^\d]+$/g, ""), [x, o] = T.useState(u(c)), [N, y] = T.useState(!1);
  return T.useEffect(() => {
    N || o(u(c));
  }, [c, N]), /* @__PURE__ */ e(
    d,
    {
      id: a,
      inputMode: "decimal",
      value: x,
      placeholder: r,
      "aria-invalid": l || void 0,
      onFocus: () => y(!0),
      onChange: (h) => {
        o(h.target.value);
        const p = h.target.value.trim() === "" ? s ? null : 0 : Re(h.target.value);
        (p !== null || h.target.value.trim() === "") && n(p);
      },
      onBlur: () => {
        y(!1), o(u(c));
      }
    }
  );
}
const $e = [
  { key: "province_code", label: "Province" },
  { key: "city_code", label: "City / regency" },
  { key: "district_code", label: "District" },
  { key: "village_code", label: "Village" }
], tt = { province: 1, city: 2, district: 3, village: 4 }, fe = /* @__PURE__ */ new Map();
function nt(c, n) {
  const a = n ? `${c}?parent=${encodeURIComponent(n)}` : c;
  return fe.has(a) || fe.set(a, X(a).then((r) => r.data).catch(() => (fe.delete(a), []))), fe.get(a);
}
const De = "cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm cm:disabled:opacity-50";
function Be({ field: c, value: n, onChange: a, pathPrefix: r }) {
  const { Label: s } = j, l = c.config ?? {}, d = String(l.api ?? ""), u = tt[l.depth ?? "district"] ?? 3, x = l.country_options ?? [], o = { country: "ID", province_code: null, city_code: null, district_code: null, village_code: null, ...n ?? {} }, N = $e.slice(0, u), [y, h] = T.useState({}), p = [null, o.province_code, o.city_code, o.district_code];
  T.useEffect(() => {
    o.country !== "ID" || !d || N.forEach((g, i) => {
      const v = p[i];
      i > 0 && !v || nt(d, v).then((f) => h((w) => ({ ...w, [g.key]: f })));
    });
  }, [d, o.country, o.province_code, o.city_code, o.district_code]);
  const _ = (g, i) => {
    const v = { ...o };
    v[N[g].key] = i || null, $e.slice(g + 1).forEach((f) => {
      v[f.key] = null;
    }), a(v);
  };
  return /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    x.length > 0 && /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(s, { htmlFor: `${r}-country`, children: "Country" }),
      /* @__PURE__ */ e(
        "select",
        {
          id: `${r}-country`,
          className: De,
          value: o.country,
          onChange: (g) => a({ country: g.target.value, province_code: null, city_code: null, district_code: null, village_code: null }),
          children: x.map((g) => /* @__PURE__ */ e("option", { value: g.value, children: g.label }, g.value))
        }
      )
    ] }),
    o.country === "ID" && N.map((g, i) => /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(s, { htmlFor: `${r}-${g.key}`, children: g.label }),
      /* @__PURE__ */ t(
        "select",
        {
          id: `${r}-${g.key}`,
          className: De,
          value: o[g.key] ?? "",
          disabled: i > 0 && !p[i],
          onChange: (v) => _(i, v.target.value),
          children: [
            /* @__PURE__ */ e("option", { value: "", children: "Choose…" }),
            (y[g.key] ?? []).map((v) => /* @__PURE__ */ e("option", { value: v.code, children: v.name }, v.code))
          ]
        }
      )
    ] }, g.key))
  ] });
}
function ct({ mode: c, order: n, paymentMethods: a, canOverride: r, variantsUrl: s, previewUrl: l, submitUrl: d }) {
  const { Card: u, CardContent: x, CardHeader: o, CardTitle: N, Button: y, Input: h, Label: p, Checkbox: _, Textarea: g } = j;
  W(), z.useBreadcrumbs([
    { label: "Shop", href: C("commerce") },
    { label: "Orders", href: C("commerce/orders") },
    ...n ? [{ label: n.number, href: C(`commerce/orders/${n.id}`) }] : [],
    { label: c === "create" ? "New order" : c === "quote" ? "Quote" : "Edit items" }
  ]);
  const i = P.useForm({
    email: "",
    name: "",
    phone: "",
    lines: n?.lines ?? [],
    shipping: n?.shipping ?? { label: "", cost: 0 },
    discount: n?.discount ?? { label: "", amount: 0 },
    shipping_address: { name: "", phone: "", country: "ID", province_code: null, city_code: null, district_code: null, village_code: null, line1: "", line2: "", postal_code: "" },
    payment_status: "unpaid",
    payment_method: a[0]?.value ?? "",
    reference: "",
    note: "",
    send_link: !1,
    notify: !1,
    valid_until: n?.valid_until ?? "",
    send: !0
  }), v = i.errors, [f, w] = T.useState(""), [$, S] = T.useState([]), [b, F] = T.useState(null);
  T.useEffect(() => {
    if (f.trim().length < 2) {
      S([]);
      return;
    }
    const k = setTimeout(() => X(`${C(s)}&q=${encodeURIComponent(f)}`).then((I) => S(I.data)).catch(() => S([])), 250);
    return () => clearTimeout(k);
  }, [f]), T.useEffect(() => {
    if (i.data.lines.length === 0) {
      F(null);
      return;
    }
    const k = setTimeout(() => {
      X(C(l), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        lines: i.data.lines.map(({ item_id: I, variant_id: B, quantity: H, unit_price: D }) => ({ item_id: I, variant_id: B, quantity: H, unit_price: D })),
        shipping: i.data.shipping,
        discount: i.data.discount,
        shipping_address: c === "create" ? i.data.shipping_address : void 0
      }) }).then(F).catch(() => F(null));
    }, 300);
    return () => clearTimeout(k);
  }, [JSON.stringify([i.data.lines, i.data.shipping, i.data.discount, i.data.shipping_address])]);
  const M = (k) => {
    const I = i.data.lines.findIndex((B) => B.variant_id === k.id && !B.item_id);
    i.setData("lines", I >= 0 ? i.data.lines.map((B, H) => H === I ? { ...B, quantity: B.quantity + 1 } : B) : [...i.data.lines, { variant_id: k.id, label: k.label, sku: k.sku, quantity: 1, price: k.price, unit_price: null }]), w(""), S([]);
  }, ee = (k, I) => i.setData("lines", i.data.lines.map((B, H) => H === k ? { ...B, ...I } : B)), ae = (k) => {
    k.preventDefault(), i.transform((I) => ({ ...I, lines: I.lines.map(({ item_id: B, variant_id: H, quantity: D, unit_price: U }) => ({ item_id: B, variant_id: H, quantity: D, unit_price: U })) })), c === "create" ? i.post(C(d)) : i.put(C(d));
  }, re = (k) => b?.lines.find((I) => I.variant_id === k);
  return /* @__PURE__ */ t("form", { onSubmit: ae, className: "cm:mx-auto cm:grid cm:w-full cm:max-w-5xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      V,
      {
        title: c === "create" ? "New order" : c === "quote" ? `Quote ${n?.number}` : `Edit ${n?.number}`,
        description: c === "edit" ? "Existing lines keep their price; new lines use today's price. The stock difference is reserved or given back." : c === "quote" ? `For ${n?.customer}. Set the prices, shipping and discount, then send it.` : "An order for a customer, from a chat or a call."
      }
    ),
    /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[2fr_1fr]", children: [
      /* @__PURE__ */ t("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ t(u, { children: [
          /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(N, { children: "Products" }) }),
          /* @__PURE__ */ t(x, { className: "cm:grid cm:gap-3", children: [
            /* @__PURE__ */ t("div", { className: "cm:relative", children: [
              /* @__PURE__ */ e(h, { placeholder: "Search products by name or SKU…", value: f, onChange: (k) => w(k.target.value), "aria-label": "Search products" }),
              $.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-10 cm:mt-1 cm:max-h-64 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: $.map((k) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ e("button", { type: "button", className: "cm:flex cm:w-full cm:justify-between cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted", onClick: () => M(k), children: /* @__PURE__ */ t("span", { children: [
                k.label,
                k.sku ? /* @__PURE__ */ t("span", { className: "cm:text-muted-foreground", children: [
                  " · ",
                  k.sku
                ] }) : null
              ] }) }) }, k.id)) })
            ] }),
            v.lines && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-destructive", children: v.lines }),
            i.data.lines.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No products yet." }) : /* @__PURE__ */ e("ul", { className: "cm:divide-y cm:divide-border", children: i.data.lines.map((k, I) => /* @__PURE__ */ t("li", { className: "cm:grid cm:items-center cm:gap-2 cm:py-2 cm:sm:grid-cols-[1fr_5rem_9rem_7rem_auto]", children: [
              /* @__PURE__ */ t("div", { className: "cm:min-w-0 cm:text-sm", children: [
                /* @__PURE__ */ e("p", { className: "cm:font-medium", children: k.label }),
                k.sku && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: k.sku })
              ] }),
              /* @__PURE__ */ e(h, { type: "number", min: 1, "aria-label": "Quantity", value: k.quantity, onChange: (B) => ee(I, { quantity: Math.max(1, Number(B.target.value)) }) }),
              r ? /* @__PURE__ */ e(se, { value: k.unit_price, placeholder: re(k.variant_id)?.unit_price_formatted ?? "", onChange: (B) => ee(I, { unit_price: B }) }) : /* @__PURE__ */ e("span", { className: "cm:text-sm", children: re(k.variant_id)?.unit_price_formatted ?? "…" }),
              /* @__PURE__ */ e("span", { className: "cm:text-sm cm:font-medium cm:sm:text-right", children: re(k.variant_id)?.total ?? "" }),
              /* @__PURE__ */ e(y, { type: "button", variant: "ghost", size: "sm", "aria-label": "Remove", onClick: () => i.setData("lines", i.data.lines.filter((B, H) => H !== I)), children: "×" })
            ] }, `${k.item_id ?? "n"}-${k.variant_id}-${I}`)) }),
            b?.notices.map((k, I) => /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-amber-700", children: k }, I))
          ] })
        ] }),
        c === "create" && /* @__PURE__ */ t(u, { children: [
          /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(N, { children: "Customer" }) }),
          /* @__PURE__ */ t(x, { className: "cm:grid cm:gap-3 cm:sm:grid-cols-3", children: [
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(p, { htmlFor: "m-email", children: "Email *" }),
              /* @__PURE__ */ e(h, { id: "m-email", type: "email", value: i.data.email, onChange: (k) => i.setData("email", k.target.value) }),
              v.email && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-destructive", children: v.email })
            ] }),
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(p, { htmlFor: "m-name", children: "Name" }),
              /* @__PURE__ */ e(h, { id: "m-name", value: i.data.name, onChange: (k) => i.setData("name", k.target.value) })
            ] }),
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(p, { htmlFor: "m-phone", children: "Phone" }),
              /* @__PURE__ */ e(h, { id: "m-phone", value: i.data.phone, onChange: (k) => i.setData("phone", k.target.value) })
            ] })
          ] })
        ] }),
        c === "create" && (b?.needs_shipping ?? !0) && /* @__PURE__ */ t(u, { children: [
          /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(N, { children: "Shipping address" }) }),
          /* @__PURE__ */ t(x, { className: "cm:grid cm:gap-3", children: [
            /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: ["name", "phone"].map((k) => /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(p, { htmlFor: `a-${k}`, children: k === "name" ? "Recipient" : "Phone" }),
              /* @__PURE__ */ e(h, { id: `a-${k}`, value: String(i.data.shipping_address[k] ?? ""), onChange: (I) => i.setData("shipping_address", { ...i.data.shipping_address, [k]: I.target.value }) })
            ] }, k)) }),
            /* @__PURE__ */ e(
              Be,
              {
                field: { handle: "region", type: "commerce_region", label: "Region", config: { depth: "village" } },
                pathPrefix: "shipping_address",
                value: i.data.shipping_address,
                onChange: (k) => i.setData("shipping_address", { ...i.data.shipping_address, ...k ?? {} })
              }
            ),
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(p, { htmlFor: "a-line1", children: "Street address" }),
              /* @__PURE__ */ e(h, { id: "a-line1", value: String(i.data.shipping_address.line1 ?? ""), onChange: (k) => i.setData("shipping_address", { ...i.data.shipping_address, line1: k.target.value }) })
            ] }),
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1 cm:sm:w-48", children: [
              /* @__PURE__ */ e(p, { htmlFor: "a-postal", children: "Postal code" }),
              /* @__PURE__ */ e(h, { id: "a-postal", value: String(i.data.shipping_address.postal_code ?? ""), onChange: (k) => i.setData("shipping_address", { ...i.data.shipping_address, postal_code: k.target.value }) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ t("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ t(u, { children: [
          /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(N, { children: "Shipping and discount" }) }),
          /* @__PURE__ */ t(x, { className: "cm:grid cm:gap-3", children: [
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(p, { htmlFor: "s-label", children: "Shipping method" }),
              /* @__PURE__ */ e(h, { id: "s-label", placeholder: "JNE REG", value: i.data.shipping.label, onChange: (k) => i.setData("shipping", { ...i.data.shipping, label: k.target.value }) })
            ] }),
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(p, { htmlFor: "s-cost", children: "Shipping cost" }),
              /* @__PURE__ */ e(se, { id: "s-cost", allowNull: !1, value: i.data.shipping.cost, onChange: (k) => i.setData("shipping", { ...i.data.shipping, cost: k ?? 0 }) })
            ] }),
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(p, { htmlFor: "d-label", children: "Discount label" }),
              /* @__PURE__ */ e(h, { id: "d-label", value: i.data.discount.label, onChange: (k) => i.setData("discount", { ...i.data.discount, label: k.target.value }) })
            ] }),
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(p, { htmlFor: "d-amount", children: "Discount" }),
              /* @__PURE__ */ e(se, { id: "d-amount", allowNull: !1, value: i.data.discount.amount, onChange: (k) => i.setData("discount", { ...i.data.discount, amount: k ?? 0 }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ t(u, { children: [
          /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(N, { children: "Total" }) }),
          /* @__PURE__ */ e(x, { className: "cm:grid cm:gap-1 cm:text-sm", children: b ? /* @__PURE__ */ t(A, { children: [
            /* @__PURE__ */ t("p", { className: "cm:flex cm:justify-between", children: [
              /* @__PURE__ */ e("span", { children: "Subtotal" }),
              /* @__PURE__ */ e("span", { children: b.totals.subtotal })
            ] }),
            /* @__PURE__ */ t("p", { className: "cm:flex cm:justify-between", children: [
              /* @__PURE__ */ e("span", { children: "Discount" }),
              /* @__PURE__ */ t("span", { children: [
                "−",
                b.totals.discount
              ] })
            ] }),
            /* @__PURE__ */ t("p", { className: "cm:flex cm:justify-between", children: [
              /* @__PURE__ */ e("span", { children: "Shipping" }),
              /* @__PURE__ */ e("span", { children: b.totals.shipping })
            ] }),
            /* @__PURE__ */ t("p", { className: "cm:flex cm:justify-between cm:text-base cm:font-semibold", children: [
              /* @__PURE__ */ e("span", { children: "Total" }),
              /* @__PURE__ */ e("span", { children: b.totals.total })
            ] })
          ] }) : /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "Add products to see the total." }) })
        ] }),
        c === "create" && /* @__PURE__ */ t(u, { children: [
          /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(N, { children: "Payment" }) }),
          /* @__PURE__ */ t(x, { className: "cm:grid cm:gap-3 cm:text-sm", children: [
            ["unpaid", "paid"].map((k) => /* @__PURE__ */ t("label", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e("input", { type: "radio", name: "payment_status", checked: i.data.payment_status === k, onChange: () => i.setData("payment_status", k) }),
              k === "unpaid" ? "Unpaid: the customer pays later" : "Paid already"
            ] }, k)),
            a.length > 0 && /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(p, { htmlFor: "p-method", children: "Method" }),
              /* @__PURE__ */ t("select", { id: "p-method", className: "cm:h-9 cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3", value: i.data.payment_method, onChange: (k) => i.setData("payment_method", k.target.value), children: [
                /* @__PURE__ */ e("option", { value: "", children: "—" }),
                a.map((k) => /* @__PURE__ */ e("option", { value: k.value, children: k.label }, k.value))
              ] })
            ] }),
            i.data.payment_status === "paid" ? /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(p, { htmlFor: "p-ref", children: "Reference" }),
              /* @__PURE__ */ e(h, { id: "p-ref", value: i.data.reference, onChange: (k) => i.setData("reference", k.target.value) })
            ] }) : /* @__PURE__ */ t("label", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e(_, { checked: i.data.send_link, onCheckedChange: (k) => i.setData("send_link", k === !0) }),
              " Email the customer the link to pay"
            ] }),
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(p, { htmlFor: "m-note", children: "Internal note" }),
              /* @__PURE__ */ e(g, { id: "m-note", value: i.data.note, onChange: (k) => i.setData("note", k.target.value) })
            ] })
          ] })
        ] }),
        c === "quote" && /* @__PURE__ */ t(u, { children: [
          /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(N, { children: "Validity" }) }),
          /* @__PURE__ */ t(x, { className: "cm:grid cm:gap-3 cm:text-sm", children: [
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(p, { htmlFor: "q-valid", children: "Valid until" }),
              /* @__PURE__ */ e(h, { id: "q-valid", type: "date", value: i.data.valid_until, onChange: (k) => i.setData("valid_until", k.target.value) }),
              v.valid_until && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-destructive", children: v.valid_until })
            ] }),
            /* @__PURE__ */ t("label", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e(_, { checked: i.data.send, onCheckedChange: (k) => i.setData("send", k === !0) }),
              " Send it to the customer now"
            ] })
          ] })
        ] }),
        c === "edit" && /* @__PURE__ */ t("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
          /* @__PURE__ */ e(_, { checked: i.data.notify, onCheckedChange: (k) => i.setData("notify", k === !0) }),
          " Tell the customer about the change"
        ] }),
        /* @__PURE__ */ e(y, { type: "submit", disabled: i.processing || i.data.lines.length === 0, children: c === "create" ? "Create order" : c === "quote" ? i.data.send ? "Send quote" : "Save quote" : "Save changes" })
      ] })
    ] })
  ] });
}
function at({ order: c, couriers: n, onClose: a }) {
  const { Dialog: r, DialogContent: s, DialogFooter: l, DialogHeader: d, DialogTitle: u, Button: x, Input: o, Label: N } = j, y = c.items.filter((g) => g.unfulfilled > 0), h = P.useForm({
    courier: n[0]?.key ?? "",
    courier_name: "",
    service: "",
    tracking_number: "",
    items: y.map((g) => ({ order_item_id: g.id, quantity: g.unfulfilled }))
  }), p = h.errors;
  return /* @__PURE__ */ e(r, { open: !0, onOpenChange: (g) => !g && a(), children: /* @__PURE__ */ t(s, { children: [
    /* @__PURE__ */ e(d, { children: /* @__PURE__ */ e(u, { children: "Add a shipment" }) }),
    /* @__PURE__ */ t("form", { className: "cm:grid cm:gap-3", onSubmit: (g) => {
      g.preventDefault(), h.post(C(`commerce/orders/${c.id}/shipments`), { preserveScroll: !0, onSuccess: a });
    }, children: [
      /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(N, { htmlFor: "s-courier", children: "Courier" }),
        /* @__PURE__ */ t("select", { id: "s-courier", className: "cm:h-9 cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm", value: h.data.courier, onChange: (g) => h.setData("courier", g.target.value), children: [
          n.map((g) => /* @__PURE__ */ e("option", { value: g.key, children: g.name }, g.key)),
          /* @__PURE__ */ e("option", { value: "", children: "Other…" })
        ] })
      ] }),
      h.data.courier === "" && /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(N, { htmlFor: "s-name", children: "Courier name" }),
        /* @__PURE__ */ e(o, { id: "s-name", value: h.data.courier_name, onChange: (g) => h.setData("courier_name", g.target.value) })
      ] }),
      /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(N, { htmlFor: "s-service", children: "Service" }),
        /* @__PURE__ */ e(o, { id: "s-service", placeholder: "REG, YES…", value: h.data.service, onChange: (g) => h.setData("service", g.target.value) })
      ] }),
      /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(N, { htmlFor: "s-tracking", children: "Tracking number" }),
        /* @__PURE__ */ e(o, { id: "s-tracking", value: h.data.tracking_number, onChange: (g) => h.setData("tracking_number", g.target.value) })
      ] }),
      /* @__PURE__ */ t("fieldset", { className: "cm:grid cm:gap-2", children: [
        /* @__PURE__ */ e("legend", { className: "cm:mb-1 cm:text-sm cm:font-medium", children: "In this parcel" }),
        y.map((g, i) => /* @__PURE__ */ t("label", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:text-sm", children: [
          /* @__PURE__ */ t("span", { children: [
            g.name,
            g.variant_title ? ` · ${g.variant_title}` : "",
            " ",
            /* @__PURE__ */ t("span", { className: "cm:text-muted-foreground", children: [
              "(",
              g.unfulfilled,
              " left)"
            ] })
          ] }),
          /* @__PURE__ */ e(
            o,
            {
              type: "number",
              min: 0,
              max: g.unfulfilled,
              className: "cm:w-20",
              value: h.data.items[i].quantity,
              onChange: (v) => h.setData("items", h.data.items.map((f, w) => w === i ? { ...f, quantity: Number(v.target.value) } : f))
            }
          )
        ] }, g.id)),
        p.items && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-destructive", children: p.items })
      ] }),
      /* @__PURE__ */ t(l, { children: [
        /* @__PURE__ */ e(x, { type: "button", variant: "outline", onClick: a, children: "Cancel" }),
        /* @__PURE__ */ e(x, { type: "submit", disabled: h.processing, children: "Save shipment" })
      ] })
    ] })
  ] }) });
}
function rt({ order: c, onClose: n }) {
  const { Dialog: a, DialogContent: r, DialogFooter: s, DialogHeader: l, DialogTitle: d, DialogDescription: u, Button: x, Input: o, Label: N, Checkbox: y } = j, h = P.useForm({
    amount: c.totals.refundable,
    reason: "",
    restock: !1,
    items: c.items.map((_) => ({ order_item_id: _.id, quantity: 0 }))
  }), p = h.errors;
  return /* @__PURE__ */ e(a, { open: !0, onOpenChange: (_) => !_ && n(), children: /* @__PURE__ */ t(r, { children: [
    /* @__PURE__ */ t(l, { children: [
      /* @__PURE__ */ e(d, { children: "Refund" }),
      /* @__PURE__ */ e(u, { children: "Record money you returned to the customer." })
    ] }),
    /* @__PURE__ */ t("form", { className: "cm:grid cm:gap-3", onSubmit: (_) => {
      _.preventDefault(), h.post(C(`commerce/orders/${c.id}/refunds`), { preserveScroll: !0, onSuccess: n });
    }, children: [
      /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(N, { htmlFor: "r-amount", children: "Amount" }),
        /* @__PURE__ */ e(se, { id: "r-amount", value: h.data.amount, onChange: (_) => h.setData("amount", _) }),
        p.amount && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-destructive", children: p.amount })
      ] }),
      /* @__PURE__ */ t("fieldset", { className: "cm:grid cm:gap-2", children: [
        /* @__PURE__ */ e("legend", { className: "cm:mb-1 cm:text-sm cm:font-medium", children: "Items returned (optional)" }),
        c.items.map((_, g) => /* @__PURE__ */ t("label", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:text-sm", children: [
          /* @__PURE__ */ t("span", { children: [
            _.name,
            _.variant_title ? ` · ${_.variant_title}` : ""
          ] }),
          /* @__PURE__ */ e(
            o,
            {
              type: "number",
              min: 0,
              max: _.quantity - _.refunded_quantity,
              className: "cm:w-20",
              value: h.data.items[g].quantity,
              onChange: (i) => h.setData("items", h.data.items.map((v, f) => f === g ? { ...v, quantity: Number(i.target.value) } : v))
            }
          )
        ] }, _.id))
      ] }),
      /* @__PURE__ */ t("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
        /* @__PURE__ */ e(y, { checked: h.data.restock, onCheckedChange: (_) => h.setData("restock", _ === !0) }),
        " Put the returned items back in stock"
      ] }),
      /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(N, { htmlFor: "r-reason", children: "Reason" }),
        /* @__PURE__ */ e(o, { id: "r-reason", value: h.data.reason, onChange: (_) => h.setData("reason", _.target.value) })
      ] }),
      /* @__PURE__ */ t(s, { children: [
        /* @__PURE__ */ e(x, { type: "button", variant: "outline", onClick: n, children: "Cancel" }),
        /* @__PURE__ */ e(x, { type: "submit", disabled: h.processing, children: "Record refund" })
      ] })
    ] })
  ] }) });
}
const K = (c) => c ? new Date(c).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" }) : "—", ge = (c) => ({
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
function lt(c) {
  const { order: n, transitions: a, can: r, panels: s } = c, { Card: l, CardContent: d, CardHeader: u, CardTitle: x, Button: o, Textarea: N, Label: y, Checkbox: h, Input: p, Dialog: _, DialogContent: g, DialogFooter: i, DialogHeader: v, DialogTitle: f, DialogDescription: w } = j, { Link: $, router: S } = P;
  W(), z.useBreadcrumbs([{ label: "Shop", href: C("commerce") }, { label: "Orders", href: C("commerce/orders") }, { label: n.number }]);
  const b = `commerce/orders/${n.id}`, [F, M] = T.useState(null), [ee, ae] = T.useState(""), [re, k] = T.useState(!1), [I, B] = T.useState(!1), [H, D] = T.useState(!1), U = P.useForm({ message: "", customer: !1 }), O = P.useForm({ reference: "", paid_at: "", account: "" }), ve = ne.orderPanels(), we = (m, E) => S.post(C(`${b}/transition`), { to: m, reason: E ?? null }, { preserveScroll: !0, onFinish: () => M(null) });
  return /* @__PURE__ */ t("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      V,
      {
        title: `${n.type === "quote" ? "Quote" : "Order"} ${n.number}`,
        description: /* @__PURE__ */ t(A, { children: [
          "Placed ",
          K(n.placed_at),
          " · ",
          n.channel,
          n.trashed ? " · in the trash" : ""
        ] }),
        actions: /* @__PURE__ */ t("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
          /* @__PURE__ */ e(R, { tone: ge(n.status), children: n.status_label }),
          n.type === "order" && /* @__PURE__ */ e(R, { tone: ge(n.payment_status), children: n.payment_label }),
          n.type === "order" && n.fulfillment_status !== "not_required" && /* @__PURE__ */ e(R, { tone: ge(n.fulfillment_status), children: n.fulfillment_label }),
          /* @__PURE__ */ e(o, { variant: "outline", size: "sm", asChild: !0, children: /* @__PURE__ */ e("a", { href: n.storefront_url, target: "_blank", rel: "noreferrer", children: "Customer view" }) })
        ] })
      }
    ),
    /* @__PURE__ */ t("div", { className: "cm:flex cm:flex-wrap cm:gap-2", children: [
      a.filter((m) => m.permission).map((m) => /* @__PURE__ */ e(
        o,
        {
          size: "sm",
          variant: m.to === "cancelled" ? "outline" : "default",
          disabled: !m.allowed,
          title: m.reason ?? void 0,
          onClick: () => m.to === "cancelled" || m.to === "on_hold" ? M(m) : we(m.to),
          children: m.to === "cancelled" ? "Cancel order" : `Mark ${m.label.toLowerCase()}`
        },
        m.to
      )),
      r.mark_paid && /* @__PURE__ */ e(o, { size: "sm", variant: "outline", onClick: () => k(!0), children: "Mark paid" }),
      r.shipments && n.items.some((m) => m.unfulfilled > 0) && /* @__PURE__ */ e(o, { size: "sm", variant: "outline", onClick: () => B(!0), children: "Add shipment" }),
      r.refund && /* @__PURE__ */ e(o, { size: "sm", variant: "outline", onClick: () => D(!0), children: "Refund" }),
      r.send_link && /* @__PURE__ */ e(o, { size: "sm", variant: "outline", onClick: () => S.post(C(`${b}/payment-link`), {}, { preserveScroll: !0 }), children: "Send payment link" }),
      r.edit_items && /* @__PURE__ */ e(o, { size: "sm", variant: "outline", asChild: !0, children: /* @__PURE__ */ e($, { href: C(`${b}/edit`), children: "Edit items" }) }),
      r.respond_quote && /* @__PURE__ */ e(o, { size: "sm", asChild: !0, children: /* @__PURE__ */ e($, { href: C(`${b}/quote`), children: n.status === "quoted" ? "Edit quote" : "Send a quote" }) }),
      r.delete && !n.trashed && /* @__PURE__ */ e(
        o,
        {
          size: "sm",
          variant: "ghost",
          className: "cm:ml-auto cm:text-destructive",
          onClick: () => window.confirm("Move this order to the trash?") && S.delete(C(b)),
          children: "Trash"
        }
      ),
      r.delete && n.trashed && /* @__PURE__ */ e(o, { size: "sm", variant: "outline", className: "cm:ml-auto", onClick: () => S.post(C(`${b}/restore`)), children: "Restore" }),
      r.force_delete && /* @__PURE__ */ e(
        o,
        {
          size: "sm",
          variant: "ghost",
          className: "cm:text-destructive",
          onClick: () => window.confirm("Delete this order for good? This can't be undone.") && S.delete(C(`${b}/force`)),
          children: "Delete for good"
        }
      )
    ] }),
    /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[2fr_1fr]", children: [
      /* @__PURE__ */ t("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(x, { children: "Items" }) }),
          /* @__PURE__ */ t(d, { className: "cm:grid cm:gap-4", children: [
            /* @__PURE__ */ e("ul", { className: "cm:divide-y cm:divide-border", children: n.items.map((m) => /* @__PURE__ */ t("li", { className: "cm:grid cm:gap-1 cm:py-3 cm:first:pt-0 cm:sm:grid-cols-[1fr_auto] cm:sm:gap-4", children: [
              /* @__PURE__ */ t("div", { className: "cm:min-w-0", children: [
                /* @__PURE__ */ t("p", { className: "cm:font-medium", children: [
                  m.product_href ? /* @__PURE__ */ e($, { href: C(m.product_href), className: "cm:hover:underline", children: m.name }) : m.name,
                  m.variant_title && /* @__PURE__ */ t("span", { className: "cm:text-muted-foreground", children: [
                    " · ",
                    m.variant_title
                  ] })
                ] }),
                /* @__PURE__ */ t("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  m.sku && /* @__PURE__ */ t(A, { children: [
                    "SKU ",
                    m.sku,
                    " · "
                  ] }),
                  m.price_source.label,
                  m.requires_shipping && n.fulfillment_status !== "not_required" && /* @__PURE__ */ t(A, { children: [
                    " · shipped ",
                    m.fulfilled_quantity,
                    "/",
                    m.quantity
                  ] }),
                  m.refunded_quantity > 0 && /* @__PURE__ */ t(A, { children: [
                    " · refunded ",
                    m.refunded_quantity
                  ] })
                ] }),
                m.components.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:mt-1 cm:text-xs cm:text-muted-foreground", children: m.components.map((E, ze) => /* @__PURE__ */ t("li", { children: [
                  E.quantity,
                  " × ",
                  E.name
                ] }, ze)) })
              ] }),
              /* @__PURE__ */ t("div", { className: "cm:text-sm cm:sm:text-right", children: [
                /* @__PURE__ */ t("p", { children: [
                  m.quantity,
                  " × ",
                  m.regular_unit_price && /* @__PURE__ */ e("del", { className: "cm:text-muted-foreground", children: m.regular_unit_price }),
                  " ",
                  m.unit_price_formatted
                ] }),
                m.discount && /* @__PURE__ */ t("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  "−",
                  m.discount
                ] }),
                /* @__PURE__ */ e("p", { className: "cm:font-medium", children: m.total })
              ] })
            ] }, m.id)) }),
            /* @__PURE__ */ t("dl", { className: "cm:grid cm:gap-1 cm:border-t cm:pt-3 cm:text-sm", children: [
              /* @__PURE__ */ e(le, { label: "Subtotal", value: n.totals.subtotal }),
              n.adjustments.filter((m) => m.kind !== "tax").map((m, E) => /* @__PURE__ */ e(le, { label: `${m.label}${m.code ? ` (${m.code})` : ""}`, value: m.amount, muted: !0 }, E)),
              n.totals.shipping !== null && /* @__PURE__ */ e(le, { label: `Shipping${n.shipping_method?.label ? ` · ${n.shipping_method.label}` : ""}`, value: n.totals.shipping }),
              n.adjustments.filter((m) => m.kind === "tax").map((m, E) => /* @__PURE__ */ e(le, { label: `${m.label}${m.included ? " (included)" : ""}`, value: m.amount, muted: !0 }, `t${E}`)),
              /* @__PURE__ */ e(le, { label: "Total", value: n.totals.total, strong: !0 }),
              n.type === "order" && /* @__PURE__ */ e(le, { label: "Paid", value: n.totals.paid, muted: !0 }),
              n.totals.refunded && /* @__PURE__ */ e(le, { label: "Refunded", value: `−${n.totals.refunded}`, muted: !0 })
            ] })
          ] })
        ] }),
        (n.payments.length > 0 || n.confirmations.length > 0) && /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(x, { children: "Payments" }) }),
          /* @__PURE__ */ t(d, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            n.payments.map((m) => /* @__PURE__ */ t("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2 cm:rounded-md cm:border cm:p-3", children: [
              /* @__PURE__ */ t("div", { children: [
                /* @__PURE__ */ t("p", { className: "cm:font-medium", children: [
                  m.method,
                  " · ",
                  m.amount
                ] }),
                /* @__PURE__ */ t("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  m.reference && /* @__PURE__ */ t(A, { children: [
                    "Ref ",
                    m.reference,
                    " · "
                  ] }),
                  m.paid_at ? `Paid ${K(m.paid_at)}` : m.expires_at ? `Due ${K(m.expires_at)}` : "",
                  m.refunded && ` · refunded ${m.refunded}`
                ] })
              ] }),
              /* @__PURE__ */ e(R, { tone: ge(m.status), children: m.status.replace(/_/g, " ") })
            ] }, m.id)),
            n.confirmations.map((m) => /* @__PURE__ */ t("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2 cm:rounded-md cm:border cm:border-dashed cm:p-3", children: [
              /* @__PURE__ */ t("span", { children: [
                "Confirmation from ",
                m.sender_name,
                m.sender_bank ? ` (${m.sender_bank})` : "",
                " · ",
                m.amount,
                m.proof_url && /* @__PURE__ */ t(A, { children: [
                  " · ",
                  /* @__PURE__ */ e("a", { href: m.proof_url, target: "_blank", rel: "noreferrer", className: "cm:underline", children: "proof" })
                ] })
              ] }),
              /* @__PURE__ */ t("span", { className: "cm:flex cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ e(R, { tone: m.status === "approved" ? "ok" : m.status === "rejected" ? "error" : "warning", children: m.status }),
                m.can_review && /* @__PURE__ */ e(o, { size: "sm", asChild: !0, children: /* @__PURE__ */ e($, { href: C("commerce/confirmations"), children: "Review" }) })
              ] })
            ] }, m.id))
          ] })
        ] }),
        n.shipments.length > 0 && /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(x, { children: "Shipments" }) }),
          /* @__PURE__ */ e(d, { className: "cm:grid cm:gap-2 cm:text-sm", children: n.shipments.map((m) => /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1 cm:rounded-md cm:border cm:p-3", children: [
            /* @__PURE__ */ t("div", { className: "cm:flex cm:items-center cm:justify-between", children: [
              /* @__PURE__ */ t("span", { className: "cm:font-medium", children: [
                m.courier,
                m.service ? ` ${m.service}` : "",
                m.tracking_number && /* @__PURE__ */ t(A, { children: [
                  " · ",
                  m.tracking_url ? /* @__PURE__ */ e("a", { href: m.tracking_url, target: "_blank", rel: "noreferrer", className: "cm:underline", children: m.tracking_number }) : m.tracking_number
                ] })
              ] }),
              /* @__PURE__ */ e(R, { tone: ge(m.status), children: m.status.replace(/_/g, " ") })
            ] }),
            /* @__PURE__ */ t("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
              m.items.map((E) => `${E.quantity} × ${E.name}`).join(", "),
              " · shipped ",
              K(m.shipped_at),
              m.delivered_at ? ` · delivered ${K(m.delivered_at)}` : ""
            ] }),
            r.shipments && m.status !== "delivered" && /* @__PURE__ */ e("div", { children: /* @__PURE__ */ e(o, { size: "sm", variant: "outline", onClick: () => S.post(C(`${b}/shipments/${m.id}/delivered`), {}, { preserveScroll: !0 }), children: "Mark delivered" }) })
          ] }, m.id)) })
        ] }),
        n.downloads.length > 0 && /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(x, { children: "Downloads" }) }),
          /* @__PURE__ */ e(d, { className: "cm:grid cm:gap-2 cm:text-sm", children: n.downloads.map((m) => /* @__PURE__ */ t("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2 cm:rounded-md cm:border cm:p-3", children: [
            /* @__PURE__ */ t("span", { children: [
              /* @__PURE__ */ e("span", { className: "cm:font-medium", children: m.name }),
              " · ",
              m.count,
              " downloaded",
              m.remaining !== null ? ` · ${m.remaining} left` : "",
              m.expires_at ? ` · until ${K(m.expires_at)}` : ""
            ] }),
            /* @__PURE__ */ t("span", { className: "cm:flex cm:items-center cm:gap-1", children: [
              /* @__PURE__ */ e(R, { tone: m.state === "active" ? "ok" : "warning", children: m.state.replace("_", " ") }),
              r.edit && ["resend", "extend", "reset", "revoke"].map((E) => /* @__PURE__ */ e(o, { size: "sm", variant: "ghost", onClick: () => S.post(C(`${b}/downloads/${m.id}`), { action: E }, { preserveScroll: !0 }), children: { resend: "Resend", extend: "+7 days", reset: "Reset count", revoke: "Revoke" }[E] }, E))
            ] })
          ] }, m.id)) })
        ] }),
        n.refunds.length > 0 && /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(x, { children: "Refunds" }) }),
          /* @__PURE__ */ e(d, { className: "cm:grid cm:gap-1 cm:text-sm", children: n.refunds.map((m) => /* @__PURE__ */ t("p", { children: [
            m.amount,
            " · ",
            K(m.created_at),
            m.reason ? ` · ${m.reason}` : "",
            m.restock ? " · restocked" : ""
          ] }, m.id)) })
        ] }),
        s.map((m) => {
          const E = ve[m.key];
          return E ? /* @__PURE__ */ t(l, { children: [
            /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(x, { children: m.label }) }),
            /* @__PURE__ */ e(d, { children: /* @__PURE__ */ e(E, { order: n, data: m.data }) })
          ] }, m.key) : null;
        }),
        /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(x, { children: "Timeline" }) }),
          /* @__PURE__ */ t(d, { className: "cm:grid cm:gap-4", children: [
            r.edit && /* @__PURE__ */ t("form", { className: "cm:grid cm:gap-2", onSubmit: (m) => {
              m.preventDefault(), U.post(C(`${b}/notes`), { preserveScroll: !0, onSuccess: () => U.reset() });
            }, children: [
              /* @__PURE__ */ e(y, { htmlFor: "o-note", className: "cm:sr-only", children: "Note" }),
              /* @__PURE__ */ e(N, { id: "o-note", placeholder: "Add a note…", value: U.data.message, onChange: (m) => U.setData("message", m.target.value) }),
              /* @__PURE__ */ t("div", { className: "cm:flex cm:items-center cm:justify-between cm:gap-2", children: [
                /* @__PURE__ */ t("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
                  /* @__PURE__ */ e(h, { checked: U.data.customer, onCheckedChange: (m) => U.setData("customer", m === !0) }),
                  " Send to the customer"
                ] }),
                /* @__PURE__ */ e(o, { size: "sm", type: "submit", disabled: U.processing || U.data.message.trim() === "", children: "Add note" })
              ] })
            ] }),
            /* @__PURE__ */ e("ol", { className: "cm:grid cm:gap-3 cm:text-sm", children: n.timeline.map((m) => /* @__PURE__ */ t("li", { className: "cm:grid cm:gap-0.5 cm:border-l-2 cm:pl-3", style: { borderColor: m.visibility === "customer" ? "var(--color-primary, currentColor)" : void 0 }, children: [
              /* @__PURE__ */ e("span", { className: "cm:whitespace-pre-line", children: m.message }),
              /* @__PURE__ */ t("span", { className: "cm:text-xs cm:text-muted-foreground", children: [
                K(m.created_at),
                " · ",
                m.actor ?? m.source,
                m.visibility === "customer" ? " · to the customer" : ""
              ] })
            ] }, m.id)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ t("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(x, { children: "Customer" }) }),
          /* @__PURE__ */ t(d, { className: "cm:grid cm:gap-1 cm:text-sm", children: [
            /* @__PURE__ */ e("p", { className: "cm:font-medium", children: n.customer.href ? /* @__PURE__ */ e($, { href: C(n.customer.href), className: "cm:hover:underline", children: n.customer.name ?? n.customer.email }) : n.customer.name ?? n.customer.email }),
            n.customer.email && /* @__PURE__ */ e("a", { href: `mailto:${n.customer.email}`, className: "cm:text-muted-foreground cm:hover:underline", children: n.customer.email }),
            n.customer.phone && /* @__PURE__ */ e("a", { href: `https://wa.me/${n.customer.phone.replace(/\D/g, "")}`, target: "_blank", rel: "noreferrer", className: "cm:text-muted-foreground cm:hover:underline", children: n.customer.phone }),
            n.customer.guest && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: "Guest checkout" })
          ] })
        ] }),
        /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ t(u, { className: "cm:flex cm:flex-row cm:items-center cm:justify-between", children: [
            /* @__PURE__ */ e(x, { children: "Addresses" }),
            r.edit_addresses && /* @__PURE__ */ e(o, { size: "sm", variant: "ghost", asChild: !0, children: /* @__PURE__ */ e($, { href: C(`${b}/addresses`), children: "Edit" }) })
          ] }),
          /* @__PURE__ */ t(d, { className: "cm:grid cm:gap-3 cm:text-sm", children: [
            n.pickup && /* @__PURE__ */ t("div", { children: [
              /* @__PURE__ */ e("p", { className: "cm:text-xs cm:font-medium cm:uppercase cm:text-muted-foreground", children: "Pickup" }),
              /* @__PURE__ */ t("p", { children: [
                n.pickup.name,
                /* @__PURE__ */ e("br", {}),
                n.pickup.address
              ] })
            ] }),
            n.shipping_address_text && /* @__PURE__ */ t("div", { children: [
              /* @__PURE__ */ e("p", { className: "cm:text-xs cm:font-medium cm:uppercase cm:text-muted-foreground", children: "Shipping" }),
              /* @__PURE__ */ e("p", { className: "cm:whitespace-pre-line", children: n.shipping_address_text })
            ] }),
            n.billing_address_text && n.billing_address_text !== n.shipping_address_text && /* @__PURE__ */ t("div", { children: [
              /* @__PURE__ */ e("p", { className: "cm:text-xs cm:font-medium cm:uppercase cm:text-muted-foreground", children: "Billing" }),
              /* @__PURE__ */ e("p", { className: "cm:whitespace-pre-line", children: n.billing_address_text })
            ] }),
            n.dropship && /* @__PURE__ */ t("div", { children: [
              /* @__PURE__ */ e("p", { className: "cm:text-xs cm:font-medium cm:uppercase cm:text-muted-foreground", children: "Dropshipper" }),
              /* @__PURE__ */ t("p", { children: [
                n.dropship.name,
                " · ",
                n.dropship.phone
              ] })
            ] }),
            !n.shipping_address_text && !n.billing_address_text && !n.pickup && /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "No address." })
          ] })
        ] }),
        (n.customer_note || n.fields && Object.keys(n.fields).length > 0) && /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(x, { children: "From the customer" }) }),
          /* @__PURE__ */ t(d, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            n.customer_note && /* @__PURE__ */ e("p", { className: "cm:whitespace-pre-line", children: n.customer_note }),
            n.fields && Object.entries(n.fields).map(([m, E]) => /* @__PURE__ */ t("p", { children: [
              /* @__PURE__ */ t("span", { className: "cm:text-muted-foreground", children: [
                m.replace(/_/g, " "),
                ":"
              ] }),
              " ",
              String(E ?? "")
            ] }, m))
          ] })
        ] }),
        /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(x, { children: "Details" }) }),
          /* @__PURE__ */ t(d, { className: "cm:grid cm:gap-1 cm:text-sm", children: [
            n.payment_method_title && /* @__PURE__ */ t("p", { children: [
              "Payment: ",
              n.payment_method_title
            ] }),
            n.expires_at && n.payment_status === "unpaid" && /* @__PURE__ */ t("p", { children: [
              "Pay before ",
              K(n.expires_at)
            ] }),
            n.paid_at && /* @__PURE__ */ t("p", { children: [
              "Paid ",
              K(n.paid_at)
            ] }),
            n.completed_at && /* @__PURE__ */ t("p", { children: [
              "Completed ",
              K(n.completed_at)
            ] }),
            n.cancelled_at && /* @__PURE__ */ t("p", { children: [
              "Cancelled ",
              K(n.cancelled_at),
              n.cancel_reason ? ` — ${n.cancel_reason}` : ""
            ] }),
            n.quote_valid_until && /* @__PURE__ */ t("p", { children: [
              "Quote valid until ",
              K(n.quote_valid_until)
            ] }),
            n.documents.length > 0 && /* @__PURE__ */ e("div", { className: "cm:mt-2 cm:flex cm:flex-wrap cm:gap-2", children: n.documents.map((m) => /* @__PURE__ */ e(o, { size: "sm", variant: "outline", asChild: !0, children: /* @__PURE__ */ t("a", { href: m.url, target: "_blank", rel: "noreferrer", children: [
              m.label,
              m.number ? ` ${m.number}` : ""
            ] }) }, m.type)) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e(_, { open: F !== null, onOpenChange: (m) => !m && M(null), children: /* @__PURE__ */ t(g, { children: [
      /* @__PURE__ */ t(v, { children: [
        /* @__PURE__ */ e(f, { children: F?.to === "cancelled" ? "Cancel this order?" : "Put this order on hold?" }),
        /* @__PURE__ */ e(w, { children: F?.to === "cancelled" ? "Stock, flash sale quantities and voucher uses are given back." : "It can go back to its status later." })
      ] }),
      /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(y, { htmlFor: "o-reason", children: "Reason (on the timeline)" }),
        /* @__PURE__ */ e(p, { id: "o-reason", value: ee, onChange: (m) => ae(m.target.value) })
      ] }),
      /* @__PURE__ */ t(i, { children: [
        /* @__PURE__ */ e(o, { variant: "outline", onClick: () => M(null), children: "Back" }),
        /* @__PURE__ */ e(o, { onClick: () => F && we(F.to, ee), children: "Confirm" })
      ] })
    ] }) }),
    /* @__PURE__ */ e(_, { open: re, onOpenChange: k, children: /* @__PURE__ */ t(g, { children: [
      /* @__PURE__ */ t(v, { children: [
        /* @__PURE__ */ e(f, { children: "Mark as paid" }),
        /* @__PURE__ */ t(w, { children: [
          "Record a payment you received outside the store (",
          n.totals.total,
          ")."
        ] })
      ] }),
      /* @__PURE__ */ t("form", { className: "cm:grid cm:gap-3", onSubmit: (m) => {
        m.preventDefault(), O.post(C(`${b}/mark-paid`), { preserveScroll: !0, onSuccess: () => k(!1) });
      }, children: [
        /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(y, { htmlFor: "p-ref", children: "Reference" }),
          /* @__PURE__ */ e(p, { id: "p-ref", value: O.data.reference, onChange: (m) => O.setData("reference", m.target.value) })
        ] }),
        /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(y, { htmlFor: "p-date", children: "Paid on" }),
          /* @__PURE__ */ e(p, { id: "p-date", type: "datetime-local", value: O.data.paid_at, onChange: (m) => O.setData("paid_at", m.target.value) })
        ] }),
        /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(y, { htmlFor: "p-acc", children: "Into account" }),
          /* @__PURE__ */ e(p, { id: "p-acc", value: O.data.account, onChange: (m) => O.setData("account", m.target.value) })
        ] }),
        /* @__PURE__ */ e(i, { children: /* @__PURE__ */ e(o, { type: "submit", disabled: O.processing, children: "Record payment" }) })
      ] })
    ] }) }),
    I && /* @__PURE__ */ e(at, { order: n, couriers: c.couriers, onClose: () => B(!1) }),
    H && /* @__PURE__ */ e(rt, { order: n, onClose: () => D(!1) })
  ] });
}
function le({ label: c, value: n, muted: a, strong: r }) {
  return /* @__PURE__ */ t("div", { className: `cm:flex cm:justify-between cm:gap-4 ${a ? "cm:text-muted-foreground" : ""} ${r ? "cm:text-base cm:font-semibold" : ""}`, children: [
    /* @__PURE__ */ e("dt", { children: c }),
    /* @__PURE__ */ e("dd", { children: n })
  ] });
}
const it = { published: "ok", draft: "neutral", scheduled: "info", trashed: "error" };
function st(c) {
  const { DataTable: n } = me, { Button: a } = j, { Link: r } = P;
  return W(), z.useBreadcrumbs([{ label: "Shop", href: C("commerce") }, { label: "Products" }]), /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      V,
      {
        title: "Products",
        description: "Products are entries: opening one goes to the editor.",
        actions: /* @__PURE__ */ e(a, { asChild: !0, children: /* @__PURE__ */ e(r, { href: C(c.createUrl), children: "New product" }) })
      }
    ),
    /* @__PURE__ */ e(
      n,
      {
        ...c,
        searchPlaceholder: "Search titles or SKUs…",
        rowHref: (s) => C(s.href),
        renderCell: (s, l) => {
          switch (l.key) {
            case "product_title":
              return /* @__PURE__ */ t("span", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ e("span", { className: "cm:font-medium", children: s.product_title }),
                s.featured && /* @__PURE__ */ e(R, { tone: "info", children: "Featured" }),
                s.sync_failed && /* @__PURE__ */ e("span", { title: s.sync_error ?? "", children: /* @__PURE__ */ e(R, { tone: "error", children: "Can't be bought" }) })
              ] });
            case "state":
              return /* @__PURE__ */ e(R, { tone: it[s.state], children: s.state });
            case "stock":
              return s.stock === null ? "—" : /* @__PURE__ */ e("span", { className: s.in_stock === !1 ? "cm:text-destructive" : "", children: s.stock });
            case "type":
              return /* @__PURE__ */ e(R, { children: s.type });
            default:
              return;
          }
        }
      }
    )
  ] });
}
const Ee = (c) => c.toLocaleString(void 0, { maximumFractionDigits: 0 });
function ie(c, n) {
  return c == null || c === "" ? "—" : typeof c != "number" ? n === "date" && /^\d{4}-\d{2}-\d{2}$/.test(String(c)) ? (/* @__PURE__ */ new Date(`${c}T00:00:00`)).toLocaleDateString() : String(c) : n === "money" ? Y(c) : n === "percent" ? `${c.toLocaleString(void 0, { maximumFractionDigits: 1 })}%` : Ee(c);
}
const ye = (c) => c === "money" || c === "count" || c === "percent";
function dt({ report: c, reports: n, period: a, result: r, exportUrl: s }) {
  const {
    Card: l,
    CardContent: d,
    CardHeader: u,
    CardTitle: x,
    CardDescription: o,
    Button: N,
    Input: y,
    Label: h,
    Select: p,
    SelectContent: _,
    SelectItem: g,
    SelectTrigger: i,
    SelectValue: v,
    Table: f,
    TableBody: w,
    TableCell: $,
    TableHead: S,
    TableHeader: b,
    TableRow: F
  } = j, { Link: M, router: ee } = P;
  W(), z.useBreadcrumbs([{ label: "Shop", href: C("commerce") }, { label: "Reports", href: C("commerce/reports") }, { label: c.label }]);
  const [ae, re] = T.useState(a.from), [k, I] = T.useState(a.to), B = (D) => ee.get(C(`commerce/reports/${c.key}`), { from: a.from, to: a.to, interval: a.interval, compare: a.compare, ...D }, { preserveScroll: !0 }), H = r.chart && r.columns.find((D) => D.key === r.chart?.series[0]?.key)?.kind === "money" ? (D) => Y(D) : Ee;
  return /* @__PURE__ */ t("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:grid-cols-1 cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      V,
      {
        title: "Reports",
        description: c.description || void 0,
        actions: s ? /* @__PURE__ */ e(N, { asChild: !0, variant: "outline", children: /* @__PURE__ */ e("a", { href: s, children: "Export CSV" }) }) : void 0
      }
    ),
    /* @__PURE__ */ e("nav", { "aria-label": "Reports", className: "cm:flex cm:flex-wrap cm:gap-1", children: n.map((D) => /* @__PURE__ */ e(
      M,
      {
        href: C(`commerce/reports/${D.key}`),
        "aria-current": D.key === c.key ? "page" : void 0,
        className: J("cm:rounded-md cm:px-3 cm:py-1.5 cm:text-sm", D.key === c.key ? "cm:bg-primary cm:text-primary-foreground" : "cm:hover:bg-muted"),
        children: D.label
      },
      D.key
    )) }),
    c.usesDates && /* @__PURE__ */ e(l, { children: /* @__PURE__ */ t(d, { className: "cm:flex cm:flex-wrap cm:items-end cm:gap-3 cm:pt-6", children: [
      /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(h, { htmlFor: "report-preset", children: "Period" }),
        /* @__PURE__ */ t(p, { value: a.preset ?? "custom", onValueChange: (D) => D !== "custom" && ee.get(C(`commerce/reports/${c.key}`), { period: D, compare: a.compare }, { preserveScroll: !0 }), children: [
          /* @__PURE__ */ e(i, { id: "report-preset", className: "cm:w-44", children: /* @__PURE__ */ e(v, {}) }),
          /* @__PURE__ */ t(_, { children: [
            Object.entries(a.presets).map(([D, U]) => /* @__PURE__ */ e(g, { value: D, children: U }, D)),
            /* @__PURE__ */ e(g, { value: "custom", children: "Custom" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ t("form", { className: "cm:flex cm:flex-wrap cm:items-end cm:gap-3", onSubmit: (D) => {
        D.preventDefault(), B({ from: ae, to: k });
      }, children: [
        /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(h, { htmlFor: "report-from", children: "From" }),
          /* @__PURE__ */ e(y, { id: "report-from", type: "date", value: ae, max: k, onChange: (D) => re(D.target.value) })
        ] }),
        /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(h, { htmlFor: "report-to", children: "To" }),
          /* @__PURE__ */ e(y, { id: "report-to", type: "date", value: k, min: ae, onChange: (D) => I(D.target.value) })
        ] }),
        /* @__PURE__ */ e(N, { type: "submit", variant: "outline", children: "Apply" })
      ] }),
      /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(h, { htmlFor: "report-compare", children: "Compare with" }),
        /* @__PURE__ */ t(p, { value: a.compare, onValueChange: (D) => B({ compare: D }), children: [
          /* @__PURE__ */ e(i, { id: "report-compare", className: "cm:w-44", children: /* @__PURE__ */ e(v, {}) }),
          /* @__PURE__ */ t(_, { children: [
            /* @__PURE__ */ e(g, { value: "previous", children: "Previous period" }),
            /* @__PURE__ */ e(g, { value: "year", children: "Same period last year" }),
            /* @__PURE__ */ e(g, { value: "none", children: "Nothing" })
          ] })
        ] })
      ] }),
      c.key === "sales" && /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(h, { htmlFor: "report-interval", children: "Group by" }),
        /* @__PURE__ */ t(p, { value: a.interval, onValueChange: (D) => B({ interval: D }), children: [
          /* @__PURE__ */ e(i, { id: "report-interval", className: "cm:w-32", children: /* @__PURE__ */ e(v, {}) }),
          /* @__PURE__ */ t(_, { children: [
            /* @__PURE__ */ e(g, { value: "day", children: "Day" }),
            /* @__PURE__ */ e(g, { value: "week", children: "Week" }),
            /* @__PURE__ */ e(g, { value: "month", children: "Month" })
          ] })
        ] })
      ] })
    ] }) }),
    r.summary.length > 0 && /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2 cm:lg:grid-cols-5", children: r.summary.map((D) => /* @__PURE__ */ e(_e, { kpi: { key: D.key, label: D.label, value: ie(D.value, D.kind), change: D.change } }, D.key)) }),
    r.chart && r.chart.data.length > 0 && /* @__PURE__ */ t(l, { children: [
      /* @__PURE__ */ t(u, { children: [
        /* @__PURE__ */ e(x, { children: c.label }),
        c.usesDates && /* @__PURE__ */ t(o, { children: [
          ie(a.from, "date"),
          " – ",
          ie(a.to, "date")
        ] })
      ] }),
      /* @__PURE__ */ e(d, { children: /* @__PURE__ */ e(
        ke,
        {
          label: c.label,
          kind: r.chart.kind,
          data: r.chart.data,
          xKey: r.chart.xKey,
          series: r.chart.series,
          format: H,
          formatX: r.chart.xKey === "date" ? (D) => ie(D, "date") : void 0
        }
      ) })
    ] }),
    /* @__PURE__ */ e(l, { children: /* @__PURE__ */ e(d, { className: "cm:pt-6", children: r.rows.length === 0 ? /* @__PURE__ */ e(de, { title: "Nothing to show", description: c.usesDates ? "There is no data for this period." : "Nothing needs attention." }) : /* @__PURE__ */ e("div", { className: "cm:overflow-x-auto", children: /* @__PURE__ */ t(f, { children: [
      /* @__PURE__ */ e(b, { children: /* @__PURE__ */ e(F, { children: r.columns.map((D) => /* @__PURE__ */ e(S, { className: ye(D.kind) ? "cm:text-right" : void 0, children: D.label }, D.key)) }) }),
      /* @__PURE__ */ t(w, { children: [
        r.rows.map((D, U) => /* @__PURE__ */ e(F, { children: r.columns.map((O, ve) => /* @__PURE__ */ e($, { className: J(ye(O.kind) && "cm:text-right cm:tabular-nums"), children: ve === 0 && D.href ? /* @__PURE__ */ e(M, { href: C(D.href), className: "cm:underline-offset-2 cm:hover:underline", children: ie(D[O.key], O.kind) }) : ie(D[O.key], O.kind) }, O.key)) }, U)),
        r.totals && /* @__PURE__ */ e(F, { className: "cm:font-semibold", children: r.columns.map((D) => /* @__PURE__ */ e($, { className: J(ye(D.kind) && "cm:text-right cm:tabular-nums"), children: ie(r.totals?.[D.key], D.kind) }, D.key)) })
      ] })
    ] }) }) }) })
  ] });
}
function Le({ items: c, current: n, label: a = "Sections" }) {
  const { Link: r } = P;
  return /* @__PURE__ */ e("nav", { "aria-label": a, className: "cm:flex cm:gap-1 cm:overflow-x-auto cm:md:flex-col", children: c.map((s) => /* @__PURE__ */ e(
    r,
    {
      href: C(s.href),
      "aria-current": s.key === n ? "page" : void 0,
      className: J(
        "cm:whitespace-nowrap cm:rounded-md cm:px-3 cm:py-1.5 cm:text-sm cm:text-muted-foreground cm:hover:bg-muted cm:hover:text-foreground",
        s.key === n && "cm:bg-muted cm:font-medium cm:text-foreground"
      ),
      children: s.label
    },
    s.key
  )) });
}
function pe({ sections: c, current: n, title: a, description: r, children: s }) {
  const { SettingsTabs: l } = me;
  return W(), z.useBreadcrumbs([{ label: "Settings", href: C("settings") }, { label: "Store", href: C("commerce/settings") }, { label: a }]), /* @__PURE__ */ t("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(l, { current: "store" }),
    /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-6 cm:md:grid-cols-[12rem_1fr]", children: [
      /* @__PURE__ */ e(Le, { items: c, current: n, label: "Store settings" }),
      /* @__PURE__ */ t("div", { className: "cm:grid cm:min-w-0 cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ e(V, { title: a, description: r }),
        s
      ] })
    ] })
  ] });
}
function mt({ sections: c, emails: n }) {
  const { Card: a, CardContent: r, CardHeader: s, CardTitle: l, Switch: d, Button: u } = j, { Link: x, router: o } = P, N = [["To customers", n.filter((y) => y.audience === "customer")], ["To staff", n.filter((y) => y.audience === "staff")]];
  return /* @__PURE__ */ e(pe, { sections: c, current: "emails", title: "Emails", description: "What the store sends, and to whom. Open an email to change its texts, recipients and attachments.", children: N.map(([y, h]) => h.length > 0 && /* @__PURE__ */ t(a, { children: [
    /* @__PURE__ */ e(s, { children: /* @__PURE__ */ e(l, { children: y }) }),
    /* @__PURE__ */ e(r, { className: "cm:p-0", children: /* @__PURE__ */ e("ul", { className: "cm:divide-y cm:divide-border", children: h.map((p) => /* @__PURE__ */ t("li", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:px-6 cm:py-3", children: [
      /* @__PURE__ */ t("div", { className: "cm:min-w-0", children: [
        /* @__PURE__ */ e(x, { href: C(p.edit_url), className: "cm:font-medium cm:hover:underline", children: p.label }),
        p.description && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: p.description })
      ] }),
      /* @__PURE__ */ t("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
        p.preview_url && /* @__PURE__ */ t(A, { children: [
          /* @__PURE__ */ e(u, { size: "sm", variant: "ghost", asChild: !0, children: /* @__PURE__ */ e("a", { href: p.preview_url, target: "_blank", rel: "noreferrer", children: "Preview" }) }),
          /* @__PURE__ */ e(u, { size: "sm", variant: "ghost", onClick: () => o.post(C(`commerce/settings/emails/${p.key}/test`), {}, { preserveScroll: !0 }), children: "Send test" })
        ] }),
        p.locked ? /* @__PURE__ */ e(R, { children: "Always sent" }) : /* @__PURE__ */ e(
          d,
          {
            checked: p.enabled,
            "aria-label": `Send ${p.label}`,
            onCheckedChange: (_) => o.put(C(`commerce/settings/emails/${p.key}/enabled`), { enabled: _ }, { preserveScroll: !0 })
          }
        )
      ] })
    ] }, p.key)) }) })
  ] }, y)) });
}
function ot({ sections: c, mode: n, groups: a, updateUrl: r }) {
  const { Card: s, CardContent: l, CardHeader: d, CardTitle: u, Switch: x, Button: o, Dialog: N, DialogContent: y, DialogDescription: h, DialogFooter: p, DialogHeader: _, DialogTitle: g } = j, { errors: i } = P.usePage().props, [v, f] = T.useState(null), [w, $] = T.useState(null), S = (b, F) => {
    $(b.key), P.router.put(r.replace("__key__", b.key), { on: F }, { preserveScroll: !0, onFinish: () => $(null) });
  };
  return /* @__PURE__ */ t(
    pe,
    {
      sections: c,
      current: "features",
      title: "Features",
      description: /* @__PURE__ */ t(A, { children: [
        "Switch store modules on or off. Selling mode: ",
        /* @__PURE__ */ e("strong", { children: n.label }),
        ". Switching off never deletes data."
      ] }),
      children: [
        i.feature && /* @__PURE__ */ e("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: i.feature }),
        a.map((b) => /* @__PURE__ */ t(s, { children: [
          /* @__PURE__ */ e(d, { children: /* @__PURE__ */ e(u, { children: b.label }) }),
          /* @__PURE__ */ e(l, { className: "cm:grid cm:gap-0 cm:divide-y cm:divide-border", children: b.features.map((F) => /* @__PURE__ */ t("div", { className: "cm:flex cm:items-start cm:justify-between cm:gap-4 cm:py-3 cm:first:pt-0 cm:last:pb-0", children: [
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ t("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ e("label", { htmlFor: `feature-${F.key}`, className: "cm:font-medium", children: F.label }),
                F.core && /* @__PURE__ */ e(R, { children: "Always on" }),
                F.switched_on && !F.active && /* @__PURE__ */ t(R, { tone: "warning", children: [
                  "Off — ",
                  F.reasons.join("; ").replace(/^Needs /, "needs ")
                ] }),
                F.essential && /* @__PURE__ */ t(R, { tone: "info", children: [
                  "Needed by ",
                  n.label
                ] })
              ] }),
              /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: F.description }),
              F.requires.length > 0 && /* @__PURE__ */ t("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                "Needs: ",
                F.requires.join(", ")
              ] })
            ] }),
            /* @__PURE__ */ e(
              x,
              {
                id: `feature-${F.key}`,
                checked: F.switched_on,
                disabled: F.core || w === F.key,
                onCheckedChange: (M) => !M && F.dependents.length > 0 ? f(F) : S(F, M)
              }
            )
          ] }, F.key)) })
        ] }, b.key)),
        /* @__PURE__ */ e(N, { open: v !== null, onOpenChange: (b) => !b && f(null), children: /* @__PURE__ */ t(y, { children: [
          /* @__PURE__ */ t(_, { children: [
            /* @__PURE__ */ t(g, { children: [
              "Switch off ",
              v?.label,
              "?"
            ] }),
            /* @__PURE__ */ t(h, { children: [
              "These are switched off with it: ",
              v?.dependents.map((b) => b.label).join(", "),
              ". Their data is kept."
            ] })
          ] }),
          /* @__PURE__ */ t(p, { children: [
            /* @__PURE__ */ e(o, { variant: "outline", onClick: () => f(null), children: "Cancel" }),
            /* @__PURE__ */ e(
              o,
              {
                variant: "destructive",
                onClick: () => {
                  v && S(v, !1), f(null);
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
function ut({ sections: c, methods: n, instanceTypes: a }) {
  const { Card: r, CardContent: s, Button: l, Switch: d } = j, { Link: u, router: x } = P, o = (N, y) => x.post(C("commerce/settings/payments/move"), { key: N, direction: y }, { preserveScroll: !0 });
  return /* @__PURE__ */ t(pe, { sections: c, current: "payments", title: "Payments", description: "Payment methods offered at checkout and on the pay page, in this order.", children: [
    n.length === 0 && /* @__PURE__ */ e(de, { title: "No payment methods", description: "Switch on Bank transfer, QRIS and cash on delivery in Features, or install a gateway package." }),
    n.length > 0 && /* @__PURE__ */ e(r, { children: /* @__PURE__ */ e(s, { className: "cm:p-0", children: /* @__PURE__ */ e("ul", { className: "cm:divide-y cm:divide-border", children: n.map((N, y) => /* @__PURE__ */ t("li", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:px-4 cm:py-3", children: [
      /* @__PURE__ */ t("div", { className: "cm:min-w-0", children: [
        /* @__PURE__ */ e(u, { href: C(N.edit_url), className: "cm:font-medium cm:hover:underline", children: N.title }),
        /* @__PURE__ */ t("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
          N.type,
          N.instance ? ` · ${N.key}` : ""
        ] })
      ] }),
      /* @__PURE__ */ t("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
        !N.active && /* @__PURE__ */ e(R, { children: "Off" }),
        /* @__PURE__ */ e(l, { variant: "ghost", size: "sm", "aria-label": "Move up", disabled: y === 0, onClick: () => o(N.key, "up"), children: "↑" }),
        /* @__PURE__ */ e(l, { variant: "ghost", size: "sm", "aria-label": "Move down", disabled: y === n.length - 1, onClick: () => o(N.key, "down"), children: "↓" }),
        /* @__PURE__ */ e(
          d,
          {
            checked: N.active,
            "aria-label": `${N.title} active`,
            onCheckedChange: (h) => x.put(C(`commerce/settings/payments/${N.key}/active`), { active: h }, { preserveScroll: !0 })
          }
        )
      ] })
    ] }, N.key)) }) }) }),
    a.length > 0 && /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:gap-2", children: a.map((N) => /* @__PURE__ */ t(l, { variant: "outline", onClick: () => x.post(C("commerce/settings/payments/instances"), { type: N.key }), children: [
      "Add ",
      N.label.toLowerCase()
    ] }, N.key)) })
  ] });
}
function Ce({ form: c, footer: n }) {
  const { FieldRenderer: a } = me, { Button: r } = j, { data: s, setData: l, errors: d, processing: u, isDirty: x, ...o } = P.useForm({ values: c.values });
  return /* @__PURE__ */ t(
    "form",
    {
      className: "cm:grid cm:gap-6",
      onSubmit: (N) => {
        N.preventDefault(), o[c.method](c.action, { preserveScroll: !0 });
      },
      children: [
        d.section && /* @__PURE__ */ e("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: d.section }),
        /* @__PURE__ */ e(
          a,
          {
            fields: c.fields,
            values: s.values,
            errors: d,
            pathPrefix: "values",
            onChange: (N) => l("values", N)
          }
        ),
        /* @__PURE__ */ t("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
          /* @__PURE__ */ e(r, { type: "submit", disabled: u, children: c.submitLabel }),
          x && /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: "Unsaved changes" }),
          n
        ] })
      ]
    }
  );
}
function ht({ section: c, sections: n, form: a }) {
  const r = ne.settingsSections()[c.key];
  return /* @__PURE__ */ e(pe, { sections: n, current: c.key, title: `${c.label} settings`, children: r ? /* @__PURE__ */ e(r, { section: c, form: a }, c.key) : /* @__PURE__ */ e(Ce, { form: a }, c.key) });
}
function pt({ sections: c, zones: n, types: a, couriers: r, moveUrl: s }) {
  const { Card: l, CardContent: d, CardHeader: u, CardTitle: x, Button: o, Select: N, SelectContent: y, SelectItem: h, SelectTrigger: p, SelectValue: _ } = j, { Link: g } = P, i = (v, f, w) => P.router.post(C(s), { kind: v, id: f, direction: w }, { preserveScroll: !0 });
  return /* @__PURE__ */ t(
    pe,
    {
      sections: c,
      current: "shipping",
      title: "Shipping",
      description: "Zones are checked in order and the first one matching the address gives its methods. Pickup methods are offered everywhere.",
      children: [
        /* @__PURE__ */ e("div", { className: "cm:flex cm:justify-end", children: /* @__PURE__ */ e(o, { asChild: !0, children: /* @__PURE__ */ e(g, { href: C("commerce/settings/shipping/zones/create"), children: "Add zone" }) }) }),
        n.length === 0 && /* @__PURE__ */ e(de, { title: "No shipping zones yet", description: "Without a zone, checkout offers no shipping. Add one for your country or provinces." }),
        n.map((v, f) => /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ t(u, { className: "cm:flex cm:flex-row cm:items-start cm:justify-between cm:gap-4", children: [
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ t(x, { className: "cm:flex cm:items-center cm:gap-2", children: [
                v.name,
                v.everywhere_else && /* @__PURE__ */ e(R, { tone: "info", children: "Everywhere else" })
              ] }),
              !v.everywhere_else && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: v.regions.length > 0 ? v.regions.join(", ") : "No regions" })
            ] }),
            /* @__PURE__ */ t("div", { className: "cm:flex cm:shrink-0 cm:gap-1", children: [
              /* @__PURE__ */ e(o, { variant: "ghost", size: "sm", "aria-label": "Move up", disabled: f === 0, onClick: () => i("zone", v.id, "up"), children: "↑" }),
              /* @__PURE__ */ e(o, { variant: "ghost", size: "sm", "aria-label": "Move down", disabled: f === n.length - 1, onClick: () => i("zone", v.id, "down"), children: "↓" }),
              /* @__PURE__ */ e(o, { variant: "outline", size: "sm", asChild: !0, children: /* @__PURE__ */ e(g, { href: C(v.edit_url), children: "Edit" }) })
            ] })
          ] }),
          /* @__PURE__ */ t(d, { className: "cm:grid cm:gap-3", children: [
            v.methods.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No methods in this zone." }),
            v.methods.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:divide-y cm:divide-border cm:rounded-md cm:border", children: v.methods.map((w, $) => /* @__PURE__ */ t("li", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:px-3 cm:py-2", children: [
              /* @__PURE__ */ t("div", { className: "cm:min-w-0", children: [
                /* @__PURE__ */ e(g, { href: C(w.edit_url), className: "cm:font-medium cm:hover:underline", children: w.title }),
                /* @__PURE__ */ t("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  w.type,
                  w.etd ? ` · ${w.etd}` : ""
                ] })
              ] }),
              /* @__PURE__ */ t("div", { className: "cm:flex cm:items-center cm:gap-1", children: [
                !w.active && /* @__PURE__ */ e(R, { children: "Inactive" }),
                /* @__PURE__ */ e(o, { variant: "ghost", size: "sm", "aria-label": "Move up", disabled: $ === 0, onClick: () => i("method", w.id, "up"), children: "↑" }),
                /* @__PURE__ */ e(o, { variant: "ghost", size: "sm", "aria-label": "Move down", disabled: $ === v.methods.length - 1, onClick: () => i("method", w.id, "down"), children: "↓" })
              ] })
            ] }, w.id)) }),
            /* @__PURE__ */ e("div", { children: /* @__PURE__ */ t(N, { value: "", onValueChange: (w) => P.router.visit(C(`commerce/settings/shipping/zones/${v.id}/methods/create?type=${w}`)), children: [
              /* @__PURE__ */ e(p, { className: "cm:w-48", "aria-label": `Add a method to ${v.name}`, children: /* @__PURE__ */ e(_, { placeholder: "Add method…" }) }),
              /* @__PURE__ */ e(y, { children: a.map((w) => /* @__PURE__ */ e(h, { value: w.key, children: w.label }, w.key)) })
            ] }) })
          ] })
        ] }, v.id)),
        /* @__PURE__ */ t(l, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(x, { children: "Courier presets" }) }),
          /* @__PURE__ */ t(d, { children: [
            /* @__PURE__ */ e("p", { className: "cm:mb-3 cm:text-sm cm:text-muted-foreground", children: "Offered when adding a shipment; the tracking link is filled in from the tracking number. Add more in config/commerce.php or with Commerce::registerCourier()." }),
            /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1 cm:text-sm cm:sm:grid-cols-2", children: r.map((v) => /* @__PURE__ */ t("li", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e("span", { className: "cm:font-medium", children: v.name }),
              !v.tracking_url && /* @__PURE__ */ e("span", { className: "cm:text-xs cm:text-muted-foreground", children: "(no tracking link)" })
            ] }, v.key)) })
          ] })
        ] })
      ]
    }
  );
}
function gt({ title: c, description: n, form: a, breadcrumbs: r = [], deleteUrl: s, deleteConfirm: l }) {
  const { Button: d } = j;
  return W(), z.useBreadcrumbs([...r.map((u) => ({ ...u, href: u.href ? C(u.href) : void 0 })), { label: c }]), /* @__PURE__ */ t("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-3xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(V, { title: c, description: n }),
    /* @__PURE__ */ e(Ce, { form: a, footer: s ? /* @__PURE__ */ e(
      d,
      {
        type: "button",
        variant: "ghost",
        className: "cm:ml-auto cm:text-destructive",
        onClick: () => window.confirm(l ?? "Delete this?") && P.router.delete(C(s)),
        children: "Delete"
      }
    ) : null })
  ] });
}
function ft(c) {
  const { DataTable: n } = me, { Button: a } = j, { Link: r } = P;
  return W(), z.useBreadcrumbs([{ label: "Shop", href: C("commerce") }, { label: c.title }]), /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      V,
      {
        title: c.title,
        description: c.description,
        actions: c.createUrl || c.exportUrl ? /* @__PURE__ */ t("div", { className: "cm:flex cm:gap-2", children: [
          c.exportUrl ? /* @__PURE__ */ e(a, { asChild: !0, variant: "outline", children: /* @__PURE__ */ e("a", { href: c.exportUrl + window.location.search, children: "Export CSV" }) }) : null,
          c.createUrl ? /* @__PURE__ */ e(a, { asChild: !0, children: /* @__PURE__ */ e(r, { href: C(c.createUrl), children: c.createLabel ?? "New" }) }) : null
        ] }) : null
      }
    ),
    /* @__PURE__ */ e(
      n,
      {
        ...c,
        bulkUrl: c.bulkUrl ? C(c.bulkUrl) : void 0,
        rowHref: (s) => s.href ? C(s.href) : null,
        renderCell: (s, l) => l.type === "badge" && s[l.key] != null ? /* @__PURE__ */ e(R, { tone: s[`${l.key}_tone`] ?? "neutral", children: String(s[l.key]) }) : void 0
      }
    )
  ] });
}
const vt = {
  "Commerce/Confirmations/Index": We,
  "Commerce/Customers/Show": Qe,
  "Commerce/Dashboard": Je,
  "Commerce/Inventory/Index": et,
  "Commerce/Orders/Editor": ct,
  "Commerce/Orders/Show": lt,
  "Commerce/Products/Index": st,
  "Commerce/Reports/Show": dt,
  "Commerce/Settings/Section": ht,
  "Commerce/Settings/Emails": mt,
  "Commerce/Settings/Features": ot,
  "Commerce/Settings/Payments": ut,
  "Commerce/Settings/Shipping": pt,
  "Commerce/Shared/SchemaForm": gt,
  "Commerce/Shared/ResourceIndex": ft
};
function bt() {
  Object.entries(vt).forEach(([c, n]) => z.registerPage(c, n));
}
function Fe(c) {
  if (!c) return "";
  const n = new Date(c);
  if (Number.isNaN(n.getTime())) return "";
  const a = (r) => String(r).padStart(2, "0");
  return `${n.getFullYear()}-${a(n.getMonth() + 1)}-${a(n.getDate())}T${a(n.getHours())}:${a(n.getMinutes())}`;
}
function Te(c) {
  return c ? new Date(c).toISOString() : null;
}
function yt({ value: c, onChange: n, pathPrefix: a }) {
  const { Input: r, Label: s } = j, l = { start: c?.start ?? null, end: c?.end ?? null };
  return /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(s, { htmlFor: `${a}-start`, children: "Starts" }),
      /* @__PURE__ */ e(
        r,
        {
          id: `${a}-start`,
          type: "datetime-local",
          value: Fe(l.start),
          onChange: (d) => n({ ...l, start: Te(d.target.value) })
        }
      )
    ] }),
    /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(s, { htmlFor: `${a}-end`, children: "Ends" }),
      /* @__PURE__ */ e(
        r,
        {
          id: `${a}-end`,
          type: "datetime-local",
          value: Fe(l.end),
          onChange: (d) => n({ ...l, end: Te(d.target.value) })
        }
      )
    ] })
  ] });
}
function xt({ field: c, value: n, onChange: a, errors: r, pathPrefix: s }) {
  return W(), /* @__PURE__ */ e(
    se,
    {
      id: s,
      value: n,
      onChange: a,
      allowNull: c.config?.allow_null !== !1,
      invalid: !!(s && r?.[s])
    }
  );
}
function Nt({ field: c, value: n, onChange: a, pathPrefix: r }) {
  const { Input: s, Badge: l } = j, d = c.config ?? {}, u = Array.isArray(n) ? n : [], [x, o] = T.useState(""), [N, y] = T.useState([]), [h, p] = T.useState(!1);
  T.useEffect(() => {
    if (!h) return;
    const i = new URLSearchParams({ q: x });
    (d.types ?? []).forEach((f) => i.append("types[]", f)), (d.taxonomies ?? []).forEach((f) => i.append("taxonomies[]", f));
    const v = setTimeout(() => X(`${d.api}?${i}`).then((f) => y(f.data)).catch(() => y([])), 200);
    return () => clearTimeout(v);
  }, [x, h]);
  const _ = (i) => u.some((v) => v.type === i.type && v.id === i.id), g = { product: "Product", variant: "Variant", term: "Category/brand" };
  return /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-2", children: [
    u.length > 0 && /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: u.map((i) => /* @__PURE__ */ t(l, { variant: "secondary", className: "cm:gap-1", children: [
      /* @__PURE__ */ t("span", { className: "cm:text-muted-foreground", children: [
        g[i.type],
        ":"
      ] }),
      " ",
      i.label,
      /* @__PURE__ */ e("button", { type: "button", "aria-label": `Remove ${i.label}`, onClick: () => a(u.filter((v) => !(v.type === i.type && v.id === i.id))), children: "×" })
    ] }, `${i.type}:${i.id}`)) }),
    /* @__PURE__ */ t("div", { className: "cm:relative", children: [
      /* @__PURE__ */ e(
        s,
        {
          id: r,
          value: x,
          placeholder: "Search products, SKUs, categories, brands…",
          onFocus: () => p(!0),
          onBlur: () => setTimeout(() => p(!1), 150),
          onChange: (i) => o(i.target.value)
        }
      ),
      h && N.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-20 cm:mt-1 cm:max-h-72 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: N.map((i) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ t(
        "button",
        {
          type: "button",
          disabled: _(i),
          className: "cm:flex cm:w-full cm:justify-between cm:gap-3 cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted cm:disabled:opacity-50",
          onMouseDown: (v) => v.preventDefault(),
          onClick: () => {
            a([...u, { type: i.type, id: i.id, label: i.label }]), o("");
          },
          children: [
            /* @__PURE__ */ e("span", { children: i.label }),
            /* @__PURE__ */ e("span", { className: "cm:text-xs cm:text-muted-foreground", children: i.group })
          ]
        }
      ) }, `${i.type}:${i.id}`)) })
    ] })
  ] });
}
function Z() {
  return (globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`).replace(/-/g, "").slice(0, 32);
}
function qe(c) {
  return Object.keys(c).sort().map((n) => `${n}=${c[n]}`).join("|");
}
function kt(c) {
  let n = [{}];
  for (const a of c) {
    if (a.values.length === 0) return [];
    const r = [];
    for (const s of n)
      for (const l of a.values)
        r.push({ ...s, [a.id]: l.id });
    n = r;
  }
  return c.length === 0 ? [] : n;
}
function _t(c, n, a, r = 100) {
  const s = new Map(n.map((l) => [qe(l.options), l]));
  return kt(c).slice(0, r).map((l) => {
    const d = s.get(qe(l));
    return d ? { ...d, options: l } : { ...a, id: Z(), sku: null, options: l, active: !0, price: a.price ?? 0 };
  });
}
function Oe(c, n, a = {}) {
  return c.map((r) => {
    const s = r.values.find((l) => l.id === n.options[r.id]);
    return s ? s.label ?? (s.term_id ? a[s.term_id] ?? `#${s.term_id}` : "?") : "?";
  }).join(" / ");
}
function q({ label: c, hint: n, children: a, htmlFor: r, className: s }) {
  const { Label: l } = j;
  return /* @__PURE__ */ t("div", { className: J("cm:grid cm:gap-1.5", s), children: [
    /* @__PURE__ */ e(l, { htmlFor: r, children: c }),
    a,
    n && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: n })
  ] });
}
function ue({ children: c, cols: n = 3 }) {
  return /* @__PURE__ */ e("div", { className: J("cm:grid cm:gap-4", { 2: "cm:sm:grid-cols-2", 3: "cm:sm:grid-cols-2 cm:lg:grid-cols-3", 4: "cm:sm:grid-cols-2 cm:lg:grid-cols-4" }[n]), children: c });
}
function L({ id: c, value: n, onChange: a, min: r = 0, placeholder: s }) {
  const { Input: l } = j;
  return /* @__PURE__ */ e(
    l,
    {
      id: c,
      type: "number",
      inputMode: "numeric",
      min: r,
      value: n ?? "",
      placeholder: s,
      onChange: (d) => a(d.target.value === "" ? null : Math.round(Number(d.target.value)))
    }
  );
}
function he({ id: c, value: n, onChange: a, placeholder: r, onBlur: s }) {
  const { Input: l } = j;
  return /* @__PURE__ */ e(
    l,
    {
      id: c,
      value: n ?? "",
      placeholder: r,
      onBlur: s,
      onChange: (d) => a(d.target.value === "" ? null : d.target.value)
    }
  );
}
function ce({ id: c, value: n, onChange: a, nullable: r = !0 }) {
  return /* @__PURE__ */ e(se, { id: c, value: n, allowNull: r, onChange: a });
}
function oe({ id: c, label: n, checked: a, onChange: r, hint: s }) {
  const { Switch: l, Label: d } = j;
  return /* @__PURE__ */ t("div", { className: "cm:flex cm:items-start cm:gap-3", children: [
    /* @__PURE__ */ e(l, { id: c, checked: a, onCheckedChange: r }),
    /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-0.5", children: [
      /* @__PURE__ */ e(d, { htmlFor: c, children: n }),
      s && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: s })
    ] })
  ] });
}
const Ct = "cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm";
function Q({ id: c, value: n, onChange: a, options: r }) {
  return /* @__PURE__ */ e("select", { id: c, className: Ct, value: n, onChange: (s) => a(s.target.value), children: r.map(([s, l]) => /* @__PURE__ */ e("option", { value: s, children: l }, s)) });
}
function G({ title: c, description: n, children: a, actions: r }) {
  return /* @__PURE__ */ t("section", { className: "cm:grid cm:gap-4", children: [
    /* @__PURE__ */ t("div", { className: "cm:flex cm:items-start cm:justify-between cm:gap-3", children: [
      /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-0.5", children: [
        /* @__PURE__ */ e("h3", { className: "cm:text-sm cm:font-semibold", children: c }),
        n && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: n })
      ] }),
      r
    ] }),
    a
  ] });
}
function wt({ value: c, update: n, path: a }) {
  const { Button: r, Input: s } = j, l = c.bundle ?? { pricing: "fixed", value: 0, items: [] }, [d, u] = T.useState({}), [x, o] = T.useState(""), [N, y] = T.useState([]), h = l.items.map((g) => g.variant_id).filter((g) => !!g);
  T.useEffect(() => {
    const g = h.filter((i) => !d[i]);
    g.length !== 0 && X(C(`commerce/api/variants?${g.map((i) => `ids[]=${i}`).join("&")}`)).then((i) => u((v) => ({ ...v, ...Object.fromEntries(i.data.map((f) => [f.id, f])) }))).catch(() => {
    });
  }, [h.join(",")]), T.useEffect(() => {
    if (x.trim().length < 2) return y([]);
    const g = setTimeout(() => X(C(`commerce/api/variants?q=${encodeURIComponent(x)}`)).then((i) => y(i.data)).catch(() => {
    }), 250);
    return () => clearTimeout(g);
  }, [x]);
  const p = (g) => n({ bundle: { ...l, ...g } }), _ = l.items.reduce((g, i) => g + (d[i.variant_id ?? 0]?.price ?? 0) * i.quantity, 0);
  return /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ t(G, { title: "Products in the bundle", description: "Bundles take their stock from these products.", children: [
      l.items.map((g, i) => /* @__PURE__ */ t("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ e("span", { className: "cm:flex-1 cm:text-sm", children: d[g.variant_id ?? 0]?.label ?? `#${g.variant_id}` }),
        /* @__PURE__ */ e("div", { className: "cm:w-24", children: /* @__PURE__ */ e(L, { min: 1, value: g.quantity, onChange: (v) => p({ items: l.items.map((f, w) => w === i ? { ...f, quantity: v ?? 1 } : f) }) }) }),
        /* @__PURE__ */ e(r, { type: "button", variant: "ghost", size: "sm", onClick: () => p({ items: l.items.filter((v, f) => f !== i) }), children: "Remove" })
      ] }, i)),
      /* @__PURE__ */ t("div", { className: "cm:relative", children: [
        /* @__PURE__ */ e(s, { value: x, placeholder: "Search products or SKUs to add…", "aria-label": "Add a product to the bundle", onChange: (g) => o(g.target.value) }),
        N.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-10 cm:mt-1 cm:max-h-64 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: N.map((g) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            className: "cm:flex cm:w-full cm:justify-between cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted",
            onClick: () => {
              u((i) => ({ ...i, [g.id]: g })), p({ items: [...l.items, { variant_id: g.id, quantity: 1 }] }), o("");
            },
            children: [
              /* @__PURE__ */ t("span", { children: [
                g.label,
                g.sku && /* @__PURE__ */ t("span", { className: "cm:text-muted-foreground", children: [
                  " · ",
                  g.sku
                ] })
              ] }),
              /* @__PURE__ */ e("span", { children: Y(g.price) })
            ]
          }
        ) }, g.id)) })
      ] })
    ] }),
    /* @__PURE__ */ e(G, { title: "Bundle price", description: `The products cost ${Y(_)} together.`, children: /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(q, { label: "Price", htmlFor: `${a}-bundle-pricing`, children: /* @__PURE__ */ e(
        Q,
        {
          id: `${a}-bundle-pricing`,
          value: l.pricing,
          onChange: (g) => p({ pricing: g, value: 0 }),
          options: [["fixed", "Its own price (General tab)"], ["percent_off", "Total minus a percentage"], ["amount_off", "Total minus an amount"]]
        }
      ) }),
      l.pricing === "percent_off" && /* @__PURE__ */ e(q, { label: "Percent off", htmlFor: `${a}-bundle-value`, children: /* @__PURE__ */ e(L, { id: `${a}-bundle-value`, value: l.value / 100, onChange: (g) => p({ value: Math.round((g ?? 0) * 100) }) }) }),
      l.pricing === "amount_off" && /* @__PURE__ */ e(q, { label: "Amount off", htmlFor: `${a}-bundle-value`, children: /* @__PURE__ */ e(ce, { id: `${a}-bundle-value`, value: l.value, nullable: !1, onChange: (g) => p({ value: g ?? 0 }) }) })
    ] }) })
  ] });
}
function St() {
  return decodeURIComponent(document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/)?.[1] ?? "");
}
function $t({ value: c, update: n, path: a }) {
  const { Button: r } = j, [s, l] = T.useState(!1), d = T.useRef(null), u = c.delivery ?? { modes: ["link", "account"], download_limit: null, expiry_days: null }, x = (y) => n({ delivery: { ...u, ...y } }), o = (y, h) => n({ downloads: c.downloads.map((p, _) => _ === y ? { ...p, ...h } : p) }), N = async (y) => {
    if (y?.length) {
      l(!0);
      try {
        const h = [];
        for (const p of Array.from(y)) {
          const _ = new FormData();
          _.append("file", p);
          const g = await fetch(C("commerce/api/downloads"), { method: "POST", body: _, headers: { "X-XSRF-TOKEN": St(), Accept: "application/json" }, credentials: "same-origin" }), i = await g.json();
          if (!g.ok) throw new Error(i.message ?? "Upload failed");
          h.push({ id: Z(), type: "file", file_id: i.data.id, url: null, name: p.name.replace(/\.[^.]+$/, ""), file: i.data });
        }
        n({ downloads: [...c.downloads, ...h] });
      } catch (h) {
        He.error(h instanceof Error ? h.message : "Upload failed");
      } finally {
        l(!1), d.current && (d.current.value = "");
      }
    }
  };
  return /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ t(
      G,
      {
        title: "Files and links",
        description: "Files are stored privately and only served to customers who bought them.",
        actions: /* @__PURE__ */ t("div", { className: "cm:flex cm:gap-2", children: [
          /* @__PURE__ */ e(r, { type: "button", variant: "outline", size: "sm", disabled: s, onClick: () => d.current?.click(), children: s ? "Uploading…" : "Upload file" }),
          /* @__PURE__ */ e(r, { type: "button", variant: "outline", size: "sm", onClick: () => n({ downloads: [...c.downloads, { id: Z(), type: "url", file_id: null, url: null, name: "" }] }), children: "Add link" }),
          /* @__PURE__ */ e("input", { ref: d, type: "file", multiple: !0, hidden: !0, onChange: (y) => N(y.target.files) })
        ] }),
        children: [
          c.downloads.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No files yet." }),
          c.downloads.map((y, h) => /* @__PURE__ */ t("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(q, { label: "Name", htmlFor: `${a}-dl-${h}`, children: /* @__PURE__ */ e(he, { id: `${a}-dl-${h}`, value: y.name, onChange: (p) => o(h, { name: p ?? "" }) }) }),
            y.type === "url" ? /* @__PURE__ */ e(q, { label: "Link", htmlFor: `${a}-dl-${h}-url`, children: /* @__PURE__ */ e(he, { id: `${a}-dl-${h}-url`, value: y.url, placeholder: "https://", onChange: (p) => o(h, { url: p }) }) }) : /* @__PURE__ */ e(q, { label: "File", children: /* @__PURE__ */ e("p", { className: "cm:truncate cm:text-sm cm:text-muted-foreground", children: y.file?.filename ?? `File #${y.file_id}` }) }),
            /* @__PURE__ */ e(r, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ downloads: c.downloads.filter((p, _) => _ !== h) }), children: "Remove" })
          ] }, y.id ?? h))
        ]
      }
    ),
    /* @__PURE__ */ t(G, { title: "Delivery", children: [
      /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-3", children: [["attachment", "Attach files to the email"], ["link", "Download links in the email"], ["account", "Library in My Account"]].map(([y, h]) => /* @__PURE__ */ e(
        oe,
        {
          id: `${a}-mode-${y}`,
          label: h,
          checked: u.modes.includes(y),
          onChange: (p) => x({ modes: p ? [...u.modes, y] : u.modes.filter((_) => _ !== y) })
        },
        y
      )) }),
      /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
        /* @__PURE__ */ e(q, { label: "Downloads per file", htmlFor: `${a}-limit`, hint: "Empty: unlimited.", children: /* @__PURE__ */ e(L, { id: `${a}-limit`, min: 1, value: u.download_limit, onChange: (y) => x({ download_limit: y }) }) }),
        /* @__PURE__ */ e(q, { label: "Links expire after (days)", htmlFor: `${a}-expiry`, hint: "Empty: never.", children: /* @__PURE__ */ e(L, { id: `${a}-expiry`, min: 1, value: u.expiry_days, onChange: (y) => x({ expiry_days: y }) }) })
      ] })
    ] })
  ] });
}
function Ae({ id: c, value: n, onChange: a, entryId: r }) {
  const [s, l] = T.useState(null);
  return /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
    /* @__PURE__ */ e(he, { id: c, value: n, onChange: (u) => {
      l(null), a(u);
    }, onBlur: () => {
      if (!n) return l(null);
      const u = new URLSearchParams({ sku: n, entry: String(r ?? 0) });
      X(C(`commerce/api/sku-check?${u}`)).then((x) => l(x.available ? null : x.product ?? "another product")).catch(() => l(null));
    } }),
    s && /* @__PURE__ */ t("p", { className: "cm:text-xs cm:text-destructive", children: [
      "Already used by ",
      s,
      "."
    ] })
  ] });
}
const Dt = [
  ["default", "Follow the store (selling mode)"],
  ["cart", "Add to cart"],
  ["inquiry", "Inquiry form"],
  ["whatsapp", "Ask on WhatsApp"],
  ["external", "Links to other shops"],
  ["none", "No button (display only)"]
];
function Ft({ value: c, update: n, updateVariant: a, config: r, entryId: s, path: l }) {
  const { Button: d } = j, u = [["simple", "Simple product"]];
  (r.features.variants || c.type === "variable") && u.push(["variable", "Variable product (sizes, colors…)"]), (r.features.bundles || c.type === "bundle") && u.push(["bundle", "Bundle of other products"]);
  const x = c.variants[0];
  return /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ t(ue, { cols: 2, children: [
      /* @__PURE__ */ e(q, { label: "Product type", htmlFor: `${l}-type`, children: /* @__PURE__ */ e(Q, { id: `${l}-type`, value: c.type, options: u, onChange: (o) => n({ type: o }) }) }),
      /* @__PURE__ */ e(q, { label: "Button on the product page", htmlFor: `${l}-mode`, hint: "'Follow the store' uses the selling mode set in Settings → Store.", children: /* @__PURE__ */ e(Q, { id: `${l}-mode`, value: c.purchase_mode, options: Dt, onChange: (o) => n({ purchase_mode: o }) }) })
    ] }),
    c.type !== "variable" && x && /* @__PURE__ */ e(G, { title: "Price", children: /* @__PURE__ */ t(ue, { cols: 4, children: [
      /* @__PURE__ */ e(q, { label: "Price", htmlFor: `${l}-price`, children: /* @__PURE__ */ e(ce, { id: `${l}-price`, value: x.price, nullable: !1, onChange: (o) => a(0, { price: o ?? 0 }) }) }),
      /* @__PURE__ */ e(q, { label: "Compare-at price", htmlFor: `${l}-compare`, hint: "Shown struck through when higher.", children: /* @__PURE__ */ e(ce, { id: `${l}-compare`, value: x.compare_at_price, onChange: (o) => a(0, { compare_at_price: o }) }) }),
      /* @__PURE__ */ e(q, { label: "Cost", htmlFor: `${l}-cost`, hint: "For profit reports; never shown.", children: /* @__PURE__ */ e(ce, { id: `${l}-cost`, value: x.cost, onChange: (o) => a(0, { cost: o }) }) }),
      /* @__PURE__ */ e(q, { label: "SKU", htmlFor: `${l}-sku`, children: /* @__PURE__ */ e(Ae, { id: `${l}-sku`, value: x.sku, entryId: s, onChange: (o) => a(0, { sku: o }) }) })
    ] }) }),
    (c.purchase_mode === "external" || c.external_links.length > 0) && /* @__PURE__ */ e(
      G,
      {
        title: "Links to other shops",
        description: "Buttons such as 'Buy on Tokopedia'.",
        actions: c.external_links.length < 10 && /* @__PURE__ */ e(d, { type: "button", variant: "outline", size: "sm", onClick: () => n({ external_links: [...c.external_links, { preset: "tokopedia", label: null, url: null }] }), children: "Add link" }),
        children: c.external_links.map((o, N) => {
          const y = (h) => n({ external_links: c.external_links.map((p, _) => _ === N ? { ...p, ...h } : p) });
          return /* @__PURE__ */ t("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[10rem_1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(q, { label: "Shop", htmlFor: `${l}-link-${N}-preset`, children: /* @__PURE__ */ e(
              Q,
              {
                id: `${l}-link-${N}-preset`,
                value: o.preset ?? "",
                onChange: (h) => y({ preset: h || null }),
                options: [...Object.entries(r.link_presets), ["", "Other…"]]
              }
            ) }),
            /* @__PURE__ */ e(q, { label: "Button label", htmlFor: `${l}-link-${N}-label`, children: /* @__PURE__ */ e(he, { id: `${l}-link-${N}-label`, value: o.label, placeholder: o.preset ? `Buy on ${r.link_presets[o.preset]}` : "", onChange: (h) => y({ label: h }) }) }),
            /* @__PURE__ */ e(q, { label: "Link", htmlFor: `${l}-link-${N}-url`, children: /* @__PURE__ */ e(he, { id: `${l}-link-${N}-url`, value: o.url, placeholder: "https://", onChange: (h) => y({ url: h }) }) }),
            /* @__PURE__ */ e(d, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ external_links: c.external_links.filter((h, p) => p !== N) }), children: "Remove" })
          ] }, N);
        })
      }
    ),
    /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(oe, { id: `${l}-shipping`, label: "Needs shipping", checked: c.requires_shipping, onChange: (o) => n({ requires_shipping: o }), hint: "Off for services and digital products." }),
      (r.features.digital || c.downloadable) && /* @__PURE__ */ e(oe, { id: `${l}-downloadable`, label: "Downloadable", checked: c.downloadable, onChange: (o) => n({ downloadable: o }), hint: "Customers get files or links after paying." }),
      /* @__PURE__ */ e(oe, { id: `${l}-featured`, label: "Featured", checked: c.featured, onChange: (o) => n({ featured: o }), hint: "Shown first when sorting by featured." })
    ] }),
    r.features.taxes && /* @__PURE__ */ e(q, { label: "Tax class", htmlFor: `${l}-tax`, children: /* @__PURE__ */ e(
      Q,
      {
        id: `${l}-tax`,
        value: c.tax_class ?? "",
        onChange: (o) => n({ tax_class: o || null }),
        options: [["", "Standard"], ...r.tax_classes.filter((o) => o !== "standard").map((o) => [o, o])]
      }
    ) })
  ] });
}
function Tt({ value: c, updateVariant: n, live: a, path: r }) {
  const s = c.variants[0];
  if (!s) return null;
  const l = a?.variants[s.id];
  return /* @__PURE__ */ t(G, { title: "Stock", children: [
    /* @__PURE__ */ e(
      oe,
      {
        id: `${r}-track`,
        label: "Track stock",
        checked: s.track_stock,
        onChange: (d) => n(0, { track_stock: d }),
        hint: "Count units: orders take them, cancellations give them back."
      }
    ),
    s.track_stock ? /* @__PURE__ */ t(ue, { cols: 3, children: [
      l?.track_stock && l.stock_quantity !== null ? /* @__PURE__ */ e(q, { label: "In stock", hint: "Change it in Shop → Inventory, so every change is recorded.", children: /* @__PURE__ */ e("p", { className: "cm:text-2xl cm:font-semibold", children: l.stock_quantity }) }) : /* @__PURE__ */ e(q, { label: "Starting stock", htmlFor: `${r}-initial`, hint: "Set once, when the product is published.", children: /* @__PURE__ */ e(L, { id: `${r}-initial`, value: s.initial_stock, onChange: (d) => n(0, { initial_stock: d }) }) }),
      /* @__PURE__ */ e(q, { label: "When sold out", htmlFor: `${r}-backorders`, children: /* @__PURE__ */ e(
        Q,
        {
          id: `${r}-backorders`,
          value: s.backorders,
          onChange: (d) => n(0, { backorders: d }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }),
      /* @__PURE__ */ e(q, { label: "Low stock at", htmlFor: `${r}-low`, hint: "Empty: the store's setting.", children: /* @__PURE__ */ e(L, { id: `${r}-low`, value: s.low_stock_threshold, onChange: (d) => n(0, { low_stock_threshold: d }) }) })
    ] }) : /* @__PURE__ */ e(q, { label: "Stock status", htmlFor: `${r}-status`, children: /* @__PURE__ */ e(
      Q,
      {
        id: `${r}-status`,
        value: s.stock_status,
        onChange: (d) => n(0, { stock_status: d }),
        options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
      }
    ) })
  ] });
}
function qt({ value: c, update: n, path: a }) {
  const { Button: r } = j, s = (l, d) => n({ tiers: c.tiers.map((u, x) => x === l ? { ...u, ...d } : u) });
  return /* @__PURE__ */ t(
    G,
    {
      title: "Bulk prices",
      description: "Lower unit prices for larger quantities. The best matching tier applies.",
      actions: c.tiers.length < 20 && /* @__PURE__ */ e(
        r,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          onClick: () => n({ tiers: [...c.tiers, { min_qty: (c.tiers.at(-1)?.min_qty ?? 1) + 9, type: "percent_off", value: 500, variant: null }] }),
          children: "Add tier"
        }
      ),
      children: [
        c.tiers.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No bulk prices." }),
        c.tiers.map((l, d) => /* @__PURE__ */ t("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[8rem_12rem_1fr_1fr_auto]", children: [
          /* @__PURE__ */ e(q, { label: "From (units)", htmlFor: `${a}-tier-${d}-min`, children: /* @__PURE__ */ e(L, { id: `${a}-tier-${d}-min`, min: 2, value: l.min_qty, onChange: (u) => s(d, { min_qty: u ?? 2 }) }) }),
          /* @__PURE__ */ e(q, { label: "Price", htmlFor: `${a}-tier-${d}-type`, children: /* @__PURE__ */ e(
            Q,
            {
              id: `${a}-tier-${d}-type`,
              value: l.type,
              onChange: (u) => s(d, { type: u, value: 0 }),
              options: [["percent_off", "Percent off"], ["amount_off", "Amount off per unit"], ["fixed_price", "Fixed unit price"]]
            }
          ) }),
          /* @__PURE__ */ e(q, { label: l.type === "percent_off" ? "Percent" : "Amount", htmlFor: `${a}-tier-${d}-value`, children: l.type === "percent_off" ? /* @__PURE__ */ e(L, { id: `${a}-tier-${d}-value`, value: l.value / 100, onChange: (u) => s(d, { value: Math.round((u ?? 0) * 100) }) }) : /* @__PURE__ */ e(ce, { id: `${a}-tier-${d}-value`, value: l.value, nullable: !1, onChange: (u) => s(d, { value: u ?? 0 }) }) }),
          /* @__PURE__ */ e(q, { label: "For", htmlFor: `${a}-tier-${d}-variant`, children: /* @__PURE__ */ e(
            Q,
            {
              id: `${a}-tier-${d}-variant`,
              value: l.variant ?? "",
              onChange: (u) => s(d, { variant: u || null }),
              options: [["", "All variants"], ...c.type === "variable" ? c.variants.map((u) => [u.id, Oe(c.options, u)]) : []]
            }
          ) }),
          /* @__PURE__ */ e(r, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ tiers: c.tiers.filter((u, x) => x !== d) }), children: "Remove" })
        ] }, d))
      ]
    }
  );
}
function jt({ value: c, update: n, updateVariant: a, path: r }) {
  const s = c.variants[0];
  if (!s) return null;
  const l = (d) => c.type === "variable" ? n({ variants: c.variants.map((u) => ({ ...u, ...d })) }) : a(0, d);
  return /* @__PURE__ */ e(G, { title: "Package", description: c.type === "variable" ? "Applies to every variant; a variant can have its own weight under More." : "Used for shipping rates.", children: /* @__PURE__ */ t(ue, { cols: 4, children: [
    /* @__PURE__ */ e(q, { label: "Weight (grams)", htmlFor: `${r}-weight`, children: /* @__PURE__ */ e(L, { id: `${r}-weight`, value: s.weight, onChange: (d) => l({ weight: d }) }) }),
    /* @__PURE__ */ e(q, { label: "Length (mm)", htmlFor: `${r}-length`, children: /* @__PURE__ */ e(L, { id: `${r}-length`, value: s.length, onChange: (d) => l({ length: d }) }) }),
    /* @__PURE__ */ e(q, { label: "Width (mm)", htmlFor: `${r}-width`, children: /* @__PURE__ */ e(L, { id: `${r}-width`, value: s.width, onChange: (d) => l({ width: d }) }) }),
    /* @__PURE__ */ e(q, { label: "Height (mm)", htmlFor: `${r}-height`, children: /* @__PURE__ */ e(L, { id: `${r}-height`, value: s.height, onChange: (d) => l({ height: d }) }) })
  ] }) });
}
const xe = {
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
function Rt(c) {
  const [n, a] = T.useState({}), r = c.filter((s) => !(s in n));
  return T.useEffect(() => {
    if (r.length === 0) return;
    const s = r.map((l) => `ids[]=${l}`).join("&");
    X(C(`api/terms?${s}`)).then((l) => a((d) => ({ ...d, ...Object.fromEntries(l.data.map((u) => [u.id, u.title])) }))).catch(() => {
    });
  }, [r.join(",")]), n;
}
function Pt({ option: c, onChange: n, onRemove: a, config: r, path: s }) {
  const { Button: l, Input: d, Badge: u } = j, { FieldRenderer: x } = me, [o, N] = T.useState(""), y = () => {
    const p = o.split(",").map((_) => _.trim()).filter(Boolean).filter((_) => !c.values.some((g) => (g.label ?? "").toLowerCase() === _.toLowerCase()));
    p.length && n({ ...c, values: [...c.values, ...p.map((_) => ({ id: Z(), label: _ }))] }), N("");
  }, h = c.values.map((p) => p.term_id).filter((p) => !!p);
  return /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-3 cm:rounded-md cm:border cm:p-3", children: [
    /* @__PURE__ */ t("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_1fr_auto]", children: [
      /* @__PURE__ */ e(q, { label: "Option name", htmlFor: `${s}-name`, children: /* @__PURE__ */ e(d, { id: `${s}-name`, value: c.name, placeholder: "Size", onChange: (p) => n({ ...c, name: p.target.value }) }) }),
      r.attribute_taxonomies.length > 0 ? /* @__PURE__ */ e(q, { label: "Values from", htmlFor: `${s}-source`, children: /* @__PURE__ */ e(
        Q,
        {
          id: `${s}-source`,
          value: c.taxonomy ?? "",
          onChange: (p) => n({ ...c, taxonomy: p || null, values: [] }),
          options: [["", "Custom values"], ...r.attribute_taxonomies.map((p) => [p.handle, p.title])]
        }
      ) }) : /* @__PURE__ */ e("div", {}),
      /* @__PURE__ */ e(l, { type: "button", variant: "ghost", size: "sm", onClick: a, children: "Remove option" })
    ] }),
    c.taxonomy ? /* @__PURE__ */ e(
      x,
      {
        fields: [{ handle: "terms", type: "terms", label: "Values", config: { taxonomy: c.taxonomy } }],
        values: { terms: h },
        pathPrefix: `${s}-terms`,
        onChange: (p) => {
          const _ = p.terms ?? [], g = c.values.filter((v) => v.term_id && _.includes(v.term_id)), i = _.filter((v) => !g.some((f) => f.term_id === v)).map((v) => ({ id: Z(), term_id: v }));
          n({ ...c, values: [...g, ...i] });
        }
      }
    ) : /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-2", children: [
      /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: c.values.map((p) => /* @__PURE__ */ t(u, { variant: "secondary", className: "cm:gap-1", children: [
        p.label,
        /* @__PURE__ */ e("button", { type: "button", "aria-label": `Remove ${p.label}`, onClick: () => n({ ...c, values: c.values.filter((_) => _.id !== p.id) }), children: "×" })
      ] }, p.id)) }),
      /* @__PURE__ */ t("div", { className: "cm:flex cm:gap-2", children: [
        /* @__PURE__ */ e(
          d,
          {
            value: o,
            placeholder: "S, M, L",
            "aria-label": `Add values to ${c.name || "option"}`,
            onChange: (p) => N(p.target.value),
            onKeyDown: (p) => {
              p.key === "Enter" && (p.preventDefault(), y());
            }
          }
        ),
        /* @__PURE__ */ e(l, { type: "button", variant: "outline", onClick: y, children: "Add" })
      ] })
    ] })
  ] });
}
function It({ variant: c, index: n, updateVariant: a, tab: r }) {
  const { FieldRenderer: s } = me, l = `${r.path}-v${n}`, d = r.live?.variants[c.id];
  return /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-4 cm:bg-muted/40 cm:p-4", children: [
    /* @__PURE__ */ t(ue, { cols: 4, children: [
      /* @__PURE__ */ e(q, { label: "Cost", htmlFor: `${l}-cost`, children: /* @__PURE__ */ e(ce, { id: `${l}-cost`, value: c.cost, onChange: (u) => a(n, { cost: u }) }) }),
      /* @__PURE__ */ e(q, { label: "Barcode", htmlFor: `${l}-barcode`, children: /* @__PURE__ */ e(he, { id: `${l}-barcode`, value: c.barcode, onChange: (u) => a(n, { barcode: u }) }) }),
      /* @__PURE__ */ e(q, { label: "Weight (g)", htmlFor: `${l}-weight`, children: /* @__PURE__ */ e(L, { id: `${l}-weight`, value: c.weight, onChange: (u) => a(n, { weight: u }), placeholder: "Product's" }) }),
      /* @__PURE__ */ e(q, { label: "Min / max / step", htmlFor: `${l}-min`, children: /* @__PURE__ */ t("div", { className: "cm:grid cm:grid-cols-3 cm:gap-1", children: [
        /* @__PURE__ */ e(L, { id: `${l}-min`, min: 1, value: c.min_qty, onChange: (u) => a(n, { min_qty: u ?? 1 }) }),
        /* @__PURE__ */ e(L, { min: 1, value: c.max_qty, onChange: (u) => a(n, { max_qty: u }), placeholder: "–" }),
        /* @__PURE__ */ e(L, { min: 1, value: c.qty_step, onChange: (u) => a(n, { qty_step: u ?? 1 }) })
      ] }) })
    ] }),
    r.config.features.inventory && /* @__PURE__ */ t(ue, { cols: 4, children: [
      /* @__PURE__ */ e(oe, { id: `${l}-track`, label: "Track stock", checked: c.track_stock, onChange: (u) => a(n, { track_stock: u }) }),
      c.track_stock && (d?.track_stock && d.stock_quantity !== null ? /* @__PURE__ */ e(q, { label: "In stock", children: /* @__PURE__ */ t("p", { className: "cm:text-sm", children: [
        d.stock_quantity,
        " ",
        /* @__PURE__ */ e("span", { className: "cm:text-muted-foreground", children: "(change it in Shop → Inventory)" })
      ] }) }) : /* @__PURE__ */ e(q, { label: "Starting stock", htmlFor: `${l}-initial`, children: /* @__PURE__ */ e(L, { id: `${l}-initial`, value: c.initial_stock, onChange: (u) => a(n, { initial_stock: u }) }) })),
      c.track_stock ? /* @__PURE__ */ e(q, { label: "When sold out", htmlFor: `${l}-backorders`, children: /* @__PURE__ */ e(
        Q,
        {
          id: `${l}-backorders`,
          value: c.backorders,
          onChange: (u) => a(n, { backorders: u }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }) : /* @__PURE__ */ e(q, { label: "Stock status", htmlFor: `${l}-status`, children: /* @__PURE__ */ e(
        Q,
        {
          id: `${l}-status`,
          value: c.stock_status,
          onChange: (u) => a(n, { stock_status: u }),
          options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
        }
      ) })
    ] }),
    /* @__PURE__ */ e(
      s,
      {
        fields: [{ handle: "image", type: "asset", label: "Image", config: { image_only: !0 } }],
        values: { image: c.image },
        pathPrefix: `${l}-image`,
        onChange: (u) => a(n, { image: u.image ?? null })
      }
    )
  ] });
}
function Bt(c) {
  const { value: n, update: a, updateVariant: r, config: s, entryId: l, live: d } = c, { Button: u, Table: x, TableBody: o, TableCell: N, TableHead: y, TableHeader: h, TableRow: p, Switch: _ } = j, [g, i] = T.useState(null), v = Rt(n.options.flatMap(($) => $.values.map((S) => S.term_id).filter((S) => !!S))), f = n.variants[0] ?? { ...xe, id: Z() }, w = ($ = n.options) => a({ options: $, variants: _t($, n.variants, { ...f, initial_stock: null, image: null }, s.max_variants) });
  return /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ e(
      G,
      {
        title: "Options",
        description: `Up to ${s.max_options} options, such as size and color. Variants are made for every combination.`,
        actions: n.options.length < s.max_options && /* @__PURE__ */ e(u, { type: "button", variant: "outline", size: "sm", onClick: () => a({ options: [...n.options, { id: Z(), name: "", taxonomy: null, values: [] }] }), children: "Add option" }),
        children: n.options.map(($, S) => /* @__PURE__ */ e(
          Pt,
          {
            option: $,
            config: s,
            path: `${c.path}-o${S}`,
            onChange: (b) => w(n.options.map((F, M) => M === S ? b : F)),
            onRemove: () => w(n.options.filter((b, F) => F !== S))
          },
          $.id
        ))
      }
    ),
    /* @__PURE__ */ t(
      G,
      {
        title: `Variants (${n.variants.length})`,
        description: "Each has its own SKU, price and stock. Switch one off to stop selling it without losing it.",
        actions: /* @__PURE__ */ e(u, { type: "button", variant: "outline", size: "sm", onClick: () => w(), children: "Regenerate" }),
        children: [
          n.options.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "Add an option with values to create variants." }) : /* @__PURE__ */ e("div", { className: "cm:overflow-x-auto cm:rounded-md cm:border", children: /* @__PURE__ */ t(x, { children: [
            /* @__PURE__ */ e(h, { children: /* @__PURE__ */ t(p, { children: [
              /* @__PURE__ */ e(y, { children: "Variant" }),
              /* @__PURE__ */ e(y, { children: "SKU" }),
              /* @__PURE__ */ e(y, { children: "Price" }),
              /* @__PURE__ */ e(y, { children: "Compare-at" }),
              s.features.inventory && /* @__PURE__ */ e(y, { children: "Stock" }),
              /* @__PURE__ */ e(y, { children: "On sale" }),
              /* @__PURE__ */ e(y, {})
            ] }) }),
            /* @__PURE__ */ e(o, { children: n.variants.map(($, S) => {
              const b = d?.variants[$.id];
              return /* @__PURE__ */ t(T.Fragment, { children: [
                /* @__PURE__ */ t(p, { className: $.active ? "" : "cm:opacity-60", children: [
                  /* @__PURE__ */ e(N, { className: "cm:font-medium cm:whitespace-nowrap", children: Oe(n.options, $, v) }),
                  /* @__PURE__ */ e(N, { className: "cm:min-w-36", children: /* @__PURE__ */ e(Ae, { value: $.sku, entryId: l, onChange: (F) => r(S, { sku: F }) }) }),
                  /* @__PURE__ */ e(N, { className: "cm:min-w-32", children: /* @__PURE__ */ e(ce, { value: $.price, nullable: !1, onChange: (F) => r(S, { price: F ?? 0 }) }) }),
                  /* @__PURE__ */ e(N, { className: "cm:min-w-32", children: /* @__PURE__ */ e(ce, { value: $.compare_at_price, onChange: (F) => r(S, { compare_at_price: F }) }) }),
                  s.features.inventory && /* @__PURE__ */ e(N, { className: "cm:whitespace-nowrap cm:text-sm", children: $.track_stock ? b?.stock_quantity ?? $.initial_stock ?? 0 : /* @__PURE__ */ e(R, { children: $.stock_status.replace("_", " ") }) }),
                  /* @__PURE__ */ e(N, { children: /* @__PURE__ */ e(_, { checked: $.active, "aria-label": "Sell this variant", onCheckedChange: (F) => r(S, { active: F }) }) }),
                  /* @__PURE__ */ e(N, { children: /* @__PURE__ */ e(u, { type: "button", variant: "ghost", size: "sm", "aria-expanded": g === $.id, onClick: () => i(g === $.id ? null : $.id), children: g === $.id ? "Close" : "More" }) })
                ] }),
                g === $.id && /* @__PURE__ */ e(p, { children: /* @__PURE__ */ e(N, { colSpan: 7, className: "cm:p-0", children: /* @__PURE__ */ e(It, { variant: $, index: S, updateVariant: r, tab: c }) }) })
              ] }, $.id);
            }) })
          ] }) }),
          n.variants.length > 0 && /* @__PURE__ */ t("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
            "Prices from ",
            Y(Math.min(...n.variants.map(($) => $.price))),
            " to ",
            Y(Math.max(...n.variants.map(($) => $.price))),
            "."
          ] })
        ]
      }
    )
  ] });
}
function Et(c) {
  const n = c ?? {}, a = (n.variants?.length ? n.variants : [{ ...xe, id: Z() }]).map((r) => ({ ...xe, ...r, id: r.id ?? Z() }));
  return {
    type: n.type ?? "simple",
    purchase_mode: n.purchase_mode ?? "default",
    external_links: n.external_links ?? [],
    requires_shipping: n.requires_shipping ?? !0,
    downloadable: n.downloadable ?? !1,
    featured: n.featured ?? !1,
    tax_class: n.tax_class ?? null,
    options: n.options ?? [],
    variants: a,
    bundle: n.bundle ?? null,
    downloads: n.downloads ?? [],
    delivery: n.delivery ?? null,
    tiers: n.tiers ?? []
  };
}
function Lt({ field: c, value: n, onChange: a, errors: r, pathPrefix: s = "data.product" }) {
  W();
  const l = c.config ?? {}, d = Et(n), { props: u } = P.usePage(), x = u.entry?.id ?? null, [o, N] = T.useState(null);
  T.useEffect(() => {
    x && X(C(`commerce/api/products/${x}`)).then((w) => N(w.data)).catch(() => {
    });
  }, [x, u.entry]);
  const y = (w) => {
    const $ = { ...d, ...w };
    w.type && w.type !== "variable" && ($.options = [], $.variants = [{ ...$.variants[0], options: {} }]), w.type === "bundle" && !$.bundle && ($.bundle = { pricing: "fixed", value: 0, items: [] }), a($);
  }, h = (w, $) => y({ variants: d.variants.map((S, b) => b === w ? { ...S, ...$ } : S) }), p = [{ key: "general", label: "General", render: (w) => /* @__PURE__ */ e(Ft, { ...w }) }];
  d.type === "variable" && p.push({ key: "variants", label: "Variants", render: (w) => /* @__PURE__ */ e(Bt, { ...w }) }), d.type === "bundle" && p.push({ key: "bundle", label: "Bundle", render: (w) => /* @__PURE__ */ e(wt, { ...w }) }), d.type !== "variable" && (l.features?.inventory ?? !0) && p.push({ key: "inventory", label: "Inventory", render: (w) => /* @__PURE__ */ e(Tt, { ...w }) }), d.requires_shipping && p.push({ key: "shipping", label: "Shipping", render: (w) => /* @__PURE__ */ e(jt, { ...w }) }), (l.features?.pricing_rules !== !1 || d.tiers.length > 0) && p.push({ key: "pricing", label: "Bulk prices", render: (w) => /* @__PURE__ */ e(qt, { ...w }) }), d.downloadable && p.push({ key: "digital", label: "Digital", render: (w) => /* @__PURE__ */ e($t, { ...w }) });
  for (const [w, $] of Object.entries(ne.productTabs()))
    p.push({ key: `ext-${w}`, label: $.label ?? w, render: (S) => /* @__PURE__ */ e($, { ...S }) });
  const [_, g] = T.useState("general"), i = p.find((w) => w.key === _) ?? p[0], v = r?.[s], f = { value: d, update: y, updateVariant: h, config: l, live: o, entryId: x, path: s.replace(/\W+/g, "-") };
  return /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-4 cm:rounded-lg cm:border cm:p-4", children: [
    o?.sync_status === "failed" && /* @__PURE__ */ t("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: [
      "The published version couldn't be applied to the store, so it can't be bought: ",
      o.sync_error,
      ". Fix it and publish again."
    ] }),
    v && /* @__PURE__ */ e("p", { role: "alert", className: "cm:text-sm cm:text-destructive", children: v }),
    /* @__PURE__ */ e("div", { role: "tablist", "aria-label": "Product data", className: "cm:flex cm:flex-wrap cm:gap-1 cm:border-b", children: p.map((w) => /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": w.key === i.key,
        onClick: () => g(w.key),
        className: J("cm:-mb-px cm:border-b-2 cm:px-3 cm:py-2 cm:text-sm", w.key === i.key ? "cm:border-primary cm:font-medium" : "cm:border-transparent cm:text-muted-foreground cm:hover:text-foreground"),
        children: w.label
      },
      w.key
    )) }),
    /* @__PURE__ */ e("div", { role: "tabpanel", children: i.render(f) })
  ] });
}
const Ot = {
  commerce_money: xt,
  commerce_datetime_range: yt,
  commerce_region: Be,
  commerce_targets: Nt,
  commerce_product: Lt
};
function At() {
  Object.entries(Ot).forEach(([c, n]) => z.registerField(c, n));
}
function zt({ sales: c, orders: n, todo: a }) {
  const { Card: r, CardContent: s, CardHeader: l, CardTitle: d, CardDescription: u } = j, { Link: x } = P;
  return /* @__PURE__ */ t(r, { children: [
    /* @__PURE__ */ t(l, { children: [
      /* @__PURE__ */ e(d, { children: /* @__PURE__ */ e(x, { href: C("commerce"), className: "cm:hover:underline", children: "Store" }) }),
      /* @__PURE__ */ e(u, { children: "Today" })
    ] }),
    /* @__PURE__ */ t(s, { className: "cm:grid cm:gap-3", children: [
      c === void 0 ? /* @__PURE__ */ e("div", { className: "cm:h-12 cm:animate-pulse cm:rounded-md cm:bg-muted" }) : /* @__PURE__ */ t("div", { className: "cm:flex cm:items-baseline cm:justify-between", children: [
        /* @__PURE__ */ e("span", { className: "cm:text-2xl cm:font-semibold cm:tabular-nums", children: c }),
        /* @__PURE__ */ t("span", { className: "cm:text-sm cm:text-muted-foreground", children: [
          n,
          " ",
          n === 1 ? "order" : "orders"
        ] })
      ] }),
      a && a.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1 cm:text-sm", children: a.map((o) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ t(x, { href: C(o.href), className: "cm:flex cm:justify-between cm:hover:underline", children: [
        /* @__PURE__ */ e("span", { children: o.label }),
        /* @__PURE__ */ e("span", { className: "cm:font-semibold", children: o.count })
      ] }) }, o.key)) })
    ] })
  ] });
}
function Mt() {
  Object.assign(ne.components, { Chart: ke, EmptyState: de, KpiCard: _e, MoneyInput: se, PageHeader: V, SchemaFormView: Ce, SectionNav: Le, SettingsLayout: pe, StatusBadge: R }), z.registerDashboardCard?.("commerce-store", zt);
}
Ue();
Mt();
At();
bt();
export {
  A as F,
  e as a,
  Ke as c,
  t as j
};
