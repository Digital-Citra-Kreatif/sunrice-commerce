const Se = { symbol: "Rp", position: "left", space: !1, thousands: ".", decimal: ",", decimals: 0 };
let be = Se;
function Be(c) {
  be = { ...Se, ...c ?? {} };
}
function re(c, t = be) {
  const i = c < 0, s = Math.abs(Math.round(c)), l = 10 ** t.decimals, a = Math.floor(s / l).toString().replace(/\B(?=(\d{3})+(?!\d))/g, t.thousands), o = t.decimals > 0 ? t.decimal + String(s % l).padStart(t.decimals, "0") : "", m = a + o, k = t.space ? " " : "", u = t.position === "left" ? `${t.symbol}${k}${m}` : `${m}${k}${t.symbol}`;
  return i ? `-${u}` : u;
}
function De(c, t = be) {
  let i = c.replace(t.symbol, "").replace(/\s/g, "");
  const s = i.startsWith("-");
  i = i.replace(/^-/, "").split(t.thousands).join("");
  const [l, a = ""] = i.split(t.decimal);
  if (!/^\d*$/.test(l) || !/^\d*$/.test(a) || l + a === "")
    return null;
  const o = Number(l || "0") * 10 ** t.decimals + Number(a.padEnd(t.decimals, "0").slice(0, t.decimals) || "0");
  return s ? -o : o;
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
      const i = c.shift();
      try {
        i?.(ee);
      } catch (s) {
        console.error("SunriceCommerceQueue call failed", s);
      }
    }
  })(), c.push = ((...i) => (i.forEach((s) => s(ee)), c.length)), window.SunriceCommerceQueue = c;
}
const L = window.Sunrice, { React: F, ui: j, components: ne, inertia: R, fetchJson: G, toast: Ae } = L;
function C(c = "") {
  return c.startsWith("/") ? c : L.adminUrl(c);
}
const Fe = window.Sunrice.React, O = Fe.Fragment;
function e(c, t, i) {
  return Fe.createElement(c, i === void 0 ? t : { ...t, key: i });
}
const n = e;
function K({ title: c, description: t, actions: i }) {
  const { Head: s } = R;
  return /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-wrap cm:items-start cm:justify-between cm:gap-4", children: [
    /* @__PURE__ */ e(s, { title: c }),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e("h1", { className: "cm:text-xl cm:font-semibold cm:tracking-tight", children: c }),
      t && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: t })
    ] }),
    i && /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: i })
  ] });
}
function qe(c) {
  var t, i, s = "";
  if (typeof c == "string" || typeof c == "number") s += c;
  else if (typeof c == "object") if (Array.isArray(c)) {
    var l = c.length;
    for (t = 0; t < l; t++) c[t] && (i = qe(c[t])) && (s && (s += " "), s += i);
  } else for (i in c) c[i] && (s && (s += " "), s += i);
  return s;
}
function Le() {
  for (var c, t, i = 0, s = "", l = arguments.length; i < l; i++) (c = arguments[i]) && (t = qe(c)) && (s && (s += " "), s += t);
  return s;
}
function ue(...c) {
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
function T({ tone: c = "neutral", children: t }) {
  return /* @__PURE__ */ e("span", { className: ue("cm:inline-flex cm:items-center cm:rounded-full cm:px-2 cm:py-0.5 cm:text-xs cm:font-medium", ke[c] ?? ke.neutral), children: t });
}
function he({ title: c, description: t, action: i }) {
  return /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-col cm:items-center cm:gap-2 cm:rounded-lg cm:border cm:border-dashed cm:px-6 cm:py-10 cm:text-center", children: [
    /* @__PURE__ */ e("p", { className: "cm:font-medium", children: c }),
    t && /* @__PURE__ */ e("p", { className: "cm:max-w-md cm:text-sm cm:text-muted-foreground", children: t }),
    i && /* @__PURE__ */ e("div", { className: "cm:mt-2", children: i })
  ] });
}
function M() {
  const { props: c } = R.usePage(), t = c.commerce ?? {};
  return Be(t.currency), t;
}
function ze({ status: c, confirmations: t }) {
  const { Card: i, CardContent: s, Button: l, Input: a, Dialog: o, DialogContent: m, DialogFooter: k, DialogHeader: u, DialogTitle: x } = j, { Link: v, router: h } = R;
  M(), L.useBreadcrumbs([{ label: "Shop", href: C("commerce") }, { label: "Payments to verify" }]);
  const [p, f] = F.useState(null), [g, r] = F.useState(""), y = (b) => {
    const _ = b.expected_amount !== null && b.amount_value < b.expected_amount;
    _ && !window.confirm(`${b.amount} is less than the ${b.expected} expected. Approve anyway?`) || h.post(C(`commerce/confirmations/${b.id}/approve`), { anyway: _ }, { preserveScroll: !0 });
  };
  return /* @__PURE__ */ n("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-5xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(K, { title: "Payments to verify", description: "Customers' transfer confirmations. Compare the proof with the amount expected, then approve or reject." }),
    /* @__PURE__ */ e("div", { className: "cm:flex cm:gap-2", children: ["submitted", "approved", "rejected"].map((b) => /* @__PURE__ */ e(l, { size: "sm", variant: b === c ? "default" : "outline", asChild: !0, children: /* @__PURE__ */ e(v, { href: C(`commerce/confirmations?status=${b}`), children: b === "submitted" ? "Waiting" : b[0].toUpperCase() + b.slice(1) }) }, b)) }),
    t.length === 0 && /* @__PURE__ */ e(he, { title: c === "submitted" ? "Nothing to verify" : "None yet" }),
    t.map((b) => /* @__PURE__ */ e(i, { children: /* @__PURE__ */ n(s, { className: "cm:grid cm:gap-4 cm:pt-6 cm:md:grid-cols-[1fr_16rem]", children: [
      /* @__PURE__ */ n("div", { className: "cm:grid cm:content-start cm:gap-1 cm:text-sm", children: [
        /* @__PURE__ */ n("p", { className: "cm:text-base cm:font-medium", children: [
          /* @__PURE__ */ e(v, { href: C(b.order.href), className: "cm:hover:underline", children: b.order.number }),
          " · ",
          b.order.customer
        ] }),
        /* @__PURE__ */ n("p", { children: [
          "Sent ",
          /* @__PURE__ */ e("strong", { children: b.amount }),
          b.expected && /* @__PURE__ */ n(O, { children: [
            " · expected ",
            /* @__PURE__ */ e("strong", { children: b.expected })
          ] }),
          b.expected_amount !== null && b.amount_value < b.expected_amount && /* @__PURE__ */ n(O, { children: [
            " ",
            /* @__PURE__ */ e(T, { tone: "warning", children: "Less than expected" })
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
          /* @__PURE__ */ e(l, { size: "sm", onClick: () => y(b), children: "Approve" }),
          /* @__PURE__ */ e(l, { size: "sm", variant: "outline", onClick: () => {
            f(b), r("");
          }, children: "Reject" })
        ] })
      ] }),
      /* @__PURE__ */ e("div", { children: b.proof_url ? b.proof_is_pdf ? /* @__PURE__ */ e("a", { href: b.proof_url, target: "_blank", rel: "noreferrer", className: "cm:underline", children: "Open the PDF proof" }) : /* @__PURE__ */ e("a", { href: b.proof_url, target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ e("img", { src: b.proof_url, alt: `Proof for ${b.order.number}`, className: "cm:max-h-72 cm:w-full cm:rounded-md cm:border cm:object-contain" }) }) : /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No proof attached." }) })
    ] }) }, b.id)),
    /* @__PURE__ */ e(o, { open: p !== null, onOpenChange: (b) => !b && f(null), children: /* @__PURE__ */ n(m, { children: [
      /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(x, { children: "Reject this confirmation?" }) }),
      /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "The customer is emailed the reason and can confirm again; the payment deadline resumes." }),
      /* @__PURE__ */ e(a, { "aria-label": "Reason", placeholder: "e.g. We haven't received the transfer yet", value: g, onChange: (b) => r(b.target.value) }),
      /* @__PURE__ */ n(k, { children: [
        /* @__PURE__ */ e(l, { variant: "outline", onClick: () => f(null), children: "Back" }),
        /* @__PURE__ */ e(l, { disabled: g.trim() === "", onClick: () => p && h.post(C(`commerce/confirmations/${p.id}/reject`), { reason: g }, { preserveScroll: !0, onSuccess: () => f(null) }), children: "Reject" })
      ] })
    ] }) })
  ] });
}
const fe = (c) => c ? new Date(c).toLocaleDateString(void 0, { dateStyle: "medium" }) : "—";
function Me({ customer: c, account: t, roleOptions: i, orders: s, can: l }) {
  const { Card: a, CardContent: o, CardHeader: m, CardTitle: k, Button: u, Input: x, Label: v, Textarea: h, Switch: p, Checkbox: f } = j, { Link: g, router: r } = R;
  M(), L.useBreadcrumbs([{ label: "Shop", href: C("commerce") }, { label: "Customers", href: C("commerce/customers") }, { label: c.name ?? c.email }]);
  const y = R.useForm({ name: c.name ?? "", phone: c.phone ?? "", note: c.note ?? "", accepts_marketing: c.accepts_marketing, roles: t?.roles ?? [] }), [b, _] = F.useState(!1), $ = (w) => r.post(C(`commerce/customers/${c.id}/${w}`), {}, { preserveScroll: !0 });
  return /* @__PURE__ */ n("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-5xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      K,
      {
        title: c.name ?? c.email,
        description: /* @__PURE__ */ n(O, { children: [
          c.email,
          c.phone ? ` · ${c.phone}` : ""
        ] }),
        actions: /* @__PURE__ */ n(O, { children: [
          c.deletion_requested_at && /* @__PURE__ */ n(T, { tone: "warning", children: [
            "Deletion requested ",
            fe(c.deletion_requested_at)
          ] }),
          t ? /* @__PURE__ */ e(T, { tone: "ok", children: "Registered" }) : /* @__PURE__ */ e(T, { children: "Guest" })
        ] })
      }
    ),
    /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-3", children: [["Orders", String(c.orders_count)], ["Spent", c.total_spent], ["Last order", fe(c.last_order_at)]].map(([w, D]) => /* @__PURE__ */ e(a, { children: /* @__PURE__ */ n(o, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
      /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: w }),
      /* @__PURE__ */ e("span", { className: "cm:text-xl cm:font-semibold", children: D })
    ] }) }, w)) }),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[2fr_1fr]", children: [
      /* @__PURE__ */ n("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ n(a, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "Orders" }) }),
          /* @__PURE__ */ e(o, { children: s.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No orders yet." }) : /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1", children: s.map((w) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ n(g, { href: C(w.href), className: "cm:flex cm:justify-between cm:rounded cm:p-2 cm:hover:bg-muted", children: [
            /* @__PURE__ */ n("span", { children: [
              w.number,
              " · ",
              fe(w.date)
            ] }),
            /* @__PURE__ */ n("span", { children: [
              /* @__PURE__ */ e(T, { children: w.status }),
              " ",
              w.total
            ] })
          ] }) }, w.id)) }) })
        ] }),
        /* @__PURE__ */ n(a, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "Addresses" }) }),
          /* @__PURE__ */ e(o, { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: c.addresses.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No saved addresses." }) : c.addresses.map((w) => /* @__PURE__ */ n("div", { className: "cm:rounded-md cm:border cm:p-3 cm:text-sm", children: [
            w.label && /* @__PURE__ */ e("p", { className: "cm:font-medium", children: w.label }),
            /* @__PURE__ */ e("p", { className: "cm:whitespace-pre-line", children: w.text }),
            /* @__PURE__ */ n("div", { className: "cm:mt-1 cm:flex cm:gap-1", children: [
              w.default_shipping && /* @__PURE__ */ e(T, { children: "Shipping" }),
              w.default_billing && /* @__PURE__ */ e(T, { children: "Billing" })
            ] })
          ] }, w.id)) })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ n(a, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "Details" }) }),
          /* @__PURE__ */ e(o, { children: /* @__PURE__ */ n("form", { className: "cm:grid cm:gap-3", onSubmit: (w) => {
            w.preventDefault(), y.put(C(`commerce/customers/${c.id}`), { preserveScroll: !0 });
          }, children: [
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(v, { htmlFor: "c-name", children: "Name" }),
              /* @__PURE__ */ e(x, { id: "c-name", disabled: !l.edit, value: y.data.name, onChange: (w) => y.setData("name", w.target.value) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(v, { htmlFor: "c-phone", children: "Phone" }),
              /* @__PURE__ */ e(x, { id: "c-phone", disabled: !l.edit, value: y.data.phone, onChange: (w) => y.setData("phone", w.target.value) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(v, { htmlFor: "c-note", children: "Note (staff only)" }),
              /* @__PURE__ */ e(h, { id: "c-note", disabled: !l.edit, value: y.data.note, onChange: (w) => y.setData("note", w.target.value) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e(p, { id: "c-marketing", disabled: !l.edit, checked: y.data.accepts_marketing, onCheckedChange: (w) => y.setData("accepts_marketing", w) }),
              /* @__PURE__ */ e(v, { htmlFor: "c-marketing", children: "Accepts marketing" })
            ] }),
            t && /* @__PURE__ */ n("fieldset", { className: "cm:grid cm:gap-1.5", children: [
              /* @__PURE__ */ e("legend", { className: "cm:mb-1 cm:text-sm cm:font-medium", children: "Roles" }),
              i.map((w) => /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
                /* @__PURE__ */ e(
                  f,
                  {
                    disabled: !l.edit,
                    checked: y.data.roles.includes(w),
                    onCheckedChange: (D) => y.setData("roles", D ? [...y.data.roles, w] : y.data.roles.filter((S) => S !== w))
                  }
                ),
                w
              ] }, w))
            ] }),
            l.edit && /* @__PURE__ */ e(u, { type: "submit", disabled: y.processing, children: "Save" })
          ] }) })
        ] }),
        t && /* @__PURE__ */ n(a, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "Account" }) }),
          /* @__PURE__ */ n(o, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            /* @__PURE__ */ n("p", { children: [
              "Email ",
              t.email_verified ? "verified" : "not verified"
            ] }),
            t.google && /* @__PURE__ */ n("p", { children: [
              "Google: ",
              t.google
            ] }),
            l.edit && /* @__PURE__ */ e(u, { variant: "outline", size: "sm", onClick: () => $("password-reset"), children: "Send a password reset link" }),
            l.edit && !t.email_verified && /* @__PURE__ */ e(u, { variant: "outline", size: "sm", onClick: () => $("verify"), children: "Mark email verified" })
          ] })
        ] }),
        l.delete && !c.anonymized && /* @__PURE__ */ n(a, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "Remove personal data" }) }),
          /* @__PURE__ */ n(o, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "Name, email, phone and addresses are deleted; orders keep their amounts." }),
            b ? /* @__PURE__ */ n("div", { className: "cm:flex cm:gap-2", children: [
              /* @__PURE__ */ e(u, { variant: "destructive", size: "sm", onClick: () => $("anonymize"), children: "Remove for good" }),
              /* @__PURE__ */ e(u, { variant: "outline", size: "sm", onClick: () => _(!1), children: "Cancel" })
            ] }) : /* @__PURE__ */ e(u, { variant: "outline", size: "sm", onClick: () => _(!0), children: "Anonymize" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function Ue({ mode: c, setup: t, health: i, kpis: s, todo: l }) {
  const { Card: a, CardContent: o, CardHeader: m, CardTitle: k, CardDescription: u } = j, { Link: x } = R;
  M();
  const v = t.filter((f) => !f.done), h = i.filter((f) => f.status !== "ok"), p = Object.entries(ee.dashboardWidgets());
  return /* @__PURE__ */ n("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(K, { title: "Store", description: /* @__PURE__ */ n(O, { children: [
      "Selling mode: ",
      c.label
    ] }) }),
    v.length > 0 && /* @__PURE__ */ n(a, { children: [
      /* @__PURE__ */ n(m, { children: [
        /* @__PURE__ */ e(k, { children: "Set up your store" }),
        /* @__PURE__ */ n(u, { children: [
          t.length - v.length,
          " of ",
          t.length,
          " done"
        ] })
      ] }),
      /* @__PURE__ */ e(o, { className: "cm:grid cm:gap-2", children: t.map((f) => /* @__PURE__ */ n(x, { href: C(f.href), className: "cm:flex cm:items-start cm:gap-3 cm:rounded-md cm:p-2 cm:hover:bg-muted", children: [
        /* @__PURE__ */ e("span", { "aria-hidden": !0, className: f.done ? "cm:text-emerald-600" : "cm:text-muted-foreground", children: f.done ? "✓" : "○" }),
        /* @__PURE__ */ n("span", { className: "cm:grid", children: [
          /* @__PURE__ */ e("span", { className: f.done ? "cm:text-muted-foreground cm:line-through" : "cm:font-medium", children: f.label }),
          f.description && /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: f.description })
        ] })
      ] }, f.key)) })
    ] }),
    h.length > 0 && /* @__PURE__ */ n(a, { children: [
      /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "Needs attention" }) }),
      /* @__PURE__ */ e(o, { className: "cm:grid cm:gap-3", children: h.map((f) => /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
          /* @__PURE__ */ e(T, { tone: f.status, children: f.status === "error" ? "Problem" : "Warning" }),
          /* @__PURE__ */ e("span", { className: "cm:font-medium", children: f.label })
        ] }),
        /* @__PURE__ */ e("p", { className: "cm:text-sm", children: f.message }),
        f.fix && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: f.fix })
      ] }, f.key)) })
    ] }),
    /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2 cm:lg:grid-cols-4", children: s === void 0 ? [0, 1, 2, 3].map((f) => /* @__PURE__ */ e("div", { className: "cm:h-24 cm:animate-pulse cm:rounded-lg cm:bg-muted" }, f)) : s.map((f) => /* @__PURE__ */ e(a, { children: /* @__PURE__ */ n(o, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
      /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: f.label }),
      /* @__PURE__ */ e("span", { className: "cm:text-2xl cm:font-semibold", children: f.value }),
      f.hint && /* @__PURE__ */ e("span", { className: "cm:text-xs cm:text-muted-foreground", children: f.hint })
    ] }) }, f.key)) }),
    /* @__PURE__ */ n(a, { children: [
      /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "To do" }) }),
      /* @__PURE__ */ e(o, { children: l === void 0 ? /* @__PURE__ */ e("div", { className: "cm:h-16 cm:animate-pulse cm:rounded-md cm:bg-muted" }) : l.length === 0 ? /* @__PURE__ */ e(he, { title: "Nothing to do", description: "Orders to process and payments to verify show up here." }) : /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1", children: l.map((f) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ n(x, { href: C(f.href), className: "cm:flex cm:justify-between cm:rounded-md cm:p-2 cm:hover:bg-muted", children: [
        /* @__PURE__ */ e("span", { children: f.label }),
        /* @__PURE__ */ e("span", { className: "cm:font-semibold", children: f.count })
      ] }) }, f.key)) }) })
    ] }),
    p.map(([f, g]) => /* @__PURE__ */ e(g, {}, f))
  ] });
}
const He = { in_stock: "ok", out_of_stock: "error", backorder: "warning" };
function We({ row: c, reasons: t, onClose: i }) {
  const { Dialog: s, DialogContent: l, DialogHeader: a, DialogTitle: o, DialogDescription: m, DialogFooter: k, Button: u, Input: x, Label: v } = j, h = R.useForm({ mode: "add", quantity: 0, reason: "manual", note: "" }), [p, f] = F.useState(null);
  F.useEffect(() => {
    G(C(`commerce/inventory/${c.id}/history`)).then((r) => f(r.data)).catch(() => f([]));
  }, [c.id]);
  const g = h.data.mode === "set" ? h.data.quantity : (c.stock_quantity ?? 0) + h.data.quantity;
  return /* @__PURE__ */ e(s, { open: !0, onOpenChange: (r) => !r && i(), children: /* @__PURE__ */ n(l, { className: "cm:max-w-lg", children: [
    /* @__PURE__ */ n(a, { children: [
      /* @__PURE__ */ e(o, { children: "Adjust stock" }),
      /* @__PURE__ */ n(m, { children: [
        c.product_title,
        c.sku ? ` · ${c.sku}` : "",
        ". Now: ",
        c.track_stock ? c.stock_quantity ?? 0 : "not tracked",
        "."
      ] })
    ] }),
    /* @__PURE__ */ n("form", { id: "adjust-stock", className: "cm:grid cm:gap-3", onSubmit: (r) => {
      r.preventDefault(), h.post(C(`commerce/inventory/${c.id}/adjust`), { preserveScroll: !0, onSuccess: i });
    }, children: [
      /* @__PURE__ */ n("div", { className: "cm:grid cm:grid-cols-2 cm:gap-3", children: [
        /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(v, { htmlFor: "adjust-mode", children: "Change" }),
          /* @__PURE__ */ n("select", { id: "adjust-mode", className: "cm:h-9 cm:rounded-md cm:border cm:bg-background cm:px-3 cm:text-sm", value: h.data.mode, onChange: (r) => h.setData("mode", r.target.value), children: [
            /* @__PURE__ */ e("option", { value: "add", children: "Add or remove" }),
            /* @__PURE__ */ e("option", { value: "set", children: "Set to" })
          ] })
        ] }),
        /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(v, { htmlFor: "adjust-quantity", children: h.data.mode === "set" ? "New stock" : "Units (+/−)" }),
          /* @__PURE__ */ e(x, { id: "adjust-quantity", type: "number", value: h.data.quantity, onChange: (r) => h.setData("quantity", Number(r.target.value)) }),
          h.errors.quantity && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-destructive", children: h.errors.quantity })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:grid-cols-2 cm:gap-3", children: [
        /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(v, { htmlFor: "adjust-reason", children: "Reason" }),
          /* @__PURE__ */ e("select", { id: "adjust-reason", className: "cm:h-9 cm:rounded-md cm:border cm:bg-background cm:px-3 cm:text-sm", value: h.data.reason, onChange: (r) => h.setData("reason", r.target.value), children: t.map((r) => /* @__PURE__ */ e("option", { value: r, children: r[0].toUpperCase() + r.slice(1) }, r)) })
        ] }),
        /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(v, { htmlFor: "adjust-note", children: "Note" }),
          /* @__PURE__ */ e(x, { id: "adjust-note", value: h.data.note, onChange: (r) => h.setData("note", r.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ n("p", { className: "cm:text-sm", children: [
        "Stock after: ",
        /* @__PURE__ */ e("strong", { children: g })
      ] })
    ] }),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:max-h-56 cm:gap-1 cm:overflow-auto cm:border-t cm:pt-3 cm:text-sm", children: [
      /* @__PURE__ */ e("p", { className: "cm:font-medium", children: "History" }),
      p === null ? /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "Loading…" }) : p.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "No changes yet." }) : p.map((r) => /* @__PURE__ */ n("div", { className: "cm:flex cm:justify-between cm:gap-3", children: [
        /* @__PURE__ */ n("span", { children: [
          r.delta > 0 ? `+${r.delta}` : r.delta,
          " → ",
          r.quantity_after,
          " · ",
          r.reason,
          r.reference ? ` (${r.reference.type} #${r.reference.id})` : "",
          r.note ? ` · ${r.note}` : ""
        ] }),
        /* @__PURE__ */ n("span", { className: "cm:whitespace-nowrap cm:text-muted-foreground", children: [
          r.user ? `${r.user}, ` : "",
          new Date(r.at).toLocaleString()
        ] })
      ] }, r.id))
    ] }),
    /* @__PURE__ */ n(k, { children: [
      /* @__PURE__ */ e(u, { variant: "outline", type: "button", onClick: i, children: "Cancel" }),
      /* @__PURE__ */ e(u, { type: "submit", form: "adjust-stock", disabled: h.processing, children: "Save" })
    ] })
  ] }) });
}
function Ke(c) {
  const { DataTable: t } = ne, [i, s] = F.useState(null);
  return M(), L.useBreadcrumbs([{ label: "Shop", href: C("commerce") }, { label: "Inventory" }]), /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(K, { title: "Inventory", description: "Stock of every product variant. Every change is recorded." }),
    /* @__PURE__ */ e(
      t,
      {
        ...c,
        searchPlaceholder: "Search products or SKUs…",
        onRowClick: c.can.adjust ? (l) => s(l) : void 0,
        renderCell: (l, a) => {
          if (a.key === "status") return /* @__PURE__ */ e(T, { tone: l.low ? "warning" : He[l.status], children: l.low ? "Low" : l.status.replace(/_/g, " ") });
          if (a.key === "stock_quantity") return l.track_stock ? l.stock_quantity : /* @__PURE__ */ e("span", { className: "cm:text-muted-foreground", children: "—" });
        }
      }
    ),
    i && /* @__PURE__ */ e(We, { row: i, reasons: c.reasons, onClose: () => s(null) })
  ] });
}
function te({
  value: c,
  onChange: t,
  id: i,
  placeholder: s,
  allowNull: l = !0,
  invalid: a
}) {
  const { Input: o } = j, m = (h) => h == null ? "" : re(h).replace(/^[^\d-]+|[^\d]+$/g, ""), [k, u] = F.useState(m(c)), [x, v] = F.useState(!1);
  return F.useEffect(() => {
    x || u(m(c));
  }, [c, x]), /* @__PURE__ */ e(
    o,
    {
      id: i,
      inputMode: "decimal",
      value: k,
      placeholder: s,
      "aria-invalid": a || void 0,
      onFocus: () => v(!0),
      onChange: (h) => {
        u(h.target.value);
        const p = h.target.value.trim() === "" ? l ? null : 0 : De(h.target.value);
        (p !== null || h.target.value.trim() === "") && t(p);
      },
      onBlur: () => {
        v(!1), u(m(c));
      }
    }
  );
}
const Ne = [
  { key: "province_code", label: "Province" },
  { key: "city_code", label: "City / regency" },
  { key: "district_code", label: "District" },
  { key: "village_code", label: "Village" }
], Qe = { province: 1, city: 2, district: 3, village: 4 }, pe = /* @__PURE__ */ new Map();
function Ge(c, t) {
  const i = t ? `${c}?parent=${encodeURIComponent(t)}` : c;
  return pe.has(i) || pe.set(i, G(i).then((s) => s.data).catch(() => (pe.delete(i), []))), pe.get(i);
}
const _e = "cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm cm:disabled:opacity-50";
function Te({ field: c, value: t, onChange: i, pathPrefix: s }) {
  const { Label: l } = j, a = c.config ?? {}, o = String(a.api ?? ""), m = Qe[a.depth ?? "district"] ?? 3, k = a.country_options ?? [], u = { country: "ID", province_code: null, city_code: null, district_code: null, village_code: null, ...t ?? {} }, x = Ne.slice(0, m), [v, h] = F.useState({}), p = [null, u.province_code, u.city_code, u.district_code];
  F.useEffect(() => {
    u.country !== "ID" || !o || x.forEach((g, r) => {
      const y = p[r];
      r > 0 && !y || Ge(o, y).then((b) => h((_) => ({ ..._, [g.key]: b })));
    });
  }, [o, u.country, u.province_code, u.city_code, u.district_code]);
  const f = (g, r) => {
    const y = { ...u };
    y[x[g].key] = r || null, Ne.slice(g + 1).forEach((b) => {
      y[b.key] = null;
    }), i(y);
  };
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    k.length > 0 && /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(l, { htmlFor: `${s}-country`, children: "Country" }),
      /* @__PURE__ */ e(
        "select",
        {
          id: `${s}-country`,
          className: _e,
          value: u.country,
          onChange: (g) => i({ country: g.target.value, province_code: null, city_code: null, district_code: null, village_code: null }),
          children: k.map((g) => /* @__PURE__ */ e("option", { value: g.value, children: g.label }, g.value))
        }
      )
    ] }),
    u.country === "ID" && x.map((g, r) => /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(l, { htmlFor: `${s}-${g.key}`, children: g.label }),
      /* @__PURE__ */ n(
        "select",
        {
          id: `${s}-${g.key}`,
          className: _e,
          value: u[g.key] ?? "",
          disabled: r > 0 && !p[r],
          onChange: (y) => f(r, y.target.value),
          children: [
            /* @__PURE__ */ e("option", { value: "", children: "Choose…" }),
            (v[g.key] ?? []).map((y) => /* @__PURE__ */ e("option", { value: y.code, children: y.name }, y.code))
          ]
        }
      )
    ] }, g.key))
  ] });
}
function Ve({ mode: c, order: t, paymentMethods: i, canOverride: s, variantsUrl: l, previewUrl: a, submitUrl: o }) {
  const { Card: m, CardContent: k, CardHeader: u, CardTitle: x, Button: v, Input: h, Label: p, Checkbox: f, Textarea: g } = j;
  M(), L.useBreadcrumbs([
    { label: "Shop", href: C("commerce") },
    { label: "Orders", href: C("commerce/orders") },
    ...t ? [{ label: t.number, href: C(`commerce/orders/${t.id}`) }] : [],
    { label: c === "create" ? "New order" : c === "quote" ? "Quote" : "Edit items" }
  ]);
  const r = R.useForm({
    email: "",
    name: "",
    phone: "",
    lines: t?.lines ?? [],
    shipping: t?.shipping ?? { label: "", cost: 0 },
    discount: t?.discount ?? { label: "", amount: 0 },
    shipping_address: { name: "", phone: "", country: "ID", province_code: null, city_code: null, district_code: null, village_code: null, line1: "", line2: "", postal_code: "" },
    payment_status: "unpaid",
    payment_method: i[0]?.value ?? "",
    reference: "",
    note: "",
    send_link: !1,
    notify: !1,
    valid_until: t?.valid_until ?? "",
    send: !0
  }), y = r.errors, [b, _] = F.useState(""), [$, w] = F.useState([]), [D, S] = F.useState(null);
  F.useEffect(() => {
    if (b.trim().length < 2) {
      w([]);
      return;
    }
    const N = setTimeout(() => G(`${C(l)}&q=${encodeURIComponent(b)}`).then((P) => w(P.data)).catch(() => w([])), 250);
    return () => clearTimeout(N);
  }, [b]), F.useEffect(() => {
    if (r.data.lines.length === 0) {
      S(null);
      return;
    }
    const N = setTimeout(() => {
      G(C(a), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        lines: r.data.lines.map(({ item_id: P, variant_id: I, quantity: H, unit_price: ce }) => ({ item_id: P, variant_id: I, quantity: H, unit_price: ce })),
        shipping: r.data.shipping,
        discount: r.data.discount,
        shipping_address: c === "create" ? r.data.shipping_address : void 0
      }) }).then(S).catch(() => S(null));
    }, 300);
    return () => clearTimeout(N);
  }, [JSON.stringify([r.data.lines, r.data.shipping, r.data.discount, r.data.shipping_address])]);
  const U = (N) => {
    const P = r.data.lines.findIndex((I) => I.variant_id === N.id && !I.item_id);
    r.setData("lines", P >= 0 ? r.data.lines.map((I, H) => H === P ? { ...I, quantity: I.quantity + 1 } : I) : [...r.data.lines, { variant_id: N.id, label: N.label, sku: N.sku, quantity: 1, price: N.price, unit_price: null }]), _(""), w([]);
  }, de = (N, P) => r.setData("lines", r.data.lines.map((I, H) => H === N ? { ...I, ...P } : I)), ge = (N) => {
    N.preventDefault(), r.transform((P) => ({ ...P, lines: P.lines.map(({ item_id: I, variant_id: H, quantity: ce, unit_price: Q }) => ({ item_id: I, variant_id: H, quantity: ce, unit_price: Q })) })), c === "create" ? r.post(C(o)) : r.put(C(o));
  }, oe = (N) => D?.lines.find((P) => P.variant_id === N);
  return /* @__PURE__ */ n("form", { onSubmit: ge, className: "cm:mx-auto cm:grid cm:w-full cm:max-w-5xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      K,
      {
        title: c === "create" ? "New order" : c === "quote" ? `Quote ${t?.number}` : `Edit ${t?.number}`,
        description: c === "edit" ? "Existing lines keep their price; new lines use today's price. The stock difference is reserved or given back." : c === "quote" ? `For ${t?.customer}. Set the prices, shipping and discount, then send it.` : "An order for a customer, from a chat or a call."
      }
    ),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[2fr_1fr]", children: [
      /* @__PURE__ */ n("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ n(m, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(x, { children: "Products" }) }),
          /* @__PURE__ */ n(k, { className: "cm:grid cm:gap-3", children: [
            /* @__PURE__ */ n("div", { className: "cm:relative", children: [
              /* @__PURE__ */ e(h, { placeholder: "Search products by name or SKU…", value: b, onChange: (N) => _(N.target.value), "aria-label": "Search products" }),
              $.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-10 cm:mt-1 cm:max-h-64 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: $.map((N) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ e("button", { type: "button", className: "cm:flex cm:w-full cm:justify-between cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted", onClick: () => U(N), children: /* @__PURE__ */ n("span", { children: [
                N.label,
                N.sku ? /* @__PURE__ */ n("span", { className: "cm:text-muted-foreground", children: [
                  " · ",
                  N.sku
                ] }) : null
              ] }) }) }, N.id)) })
            ] }),
            y.lines && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-destructive", children: y.lines }),
            r.data.lines.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No products yet." }) : /* @__PURE__ */ e("ul", { className: "cm:divide-y cm:divide-border", children: r.data.lines.map((N, P) => /* @__PURE__ */ n("li", { className: "cm:grid cm:items-center cm:gap-2 cm:py-2 cm:sm:grid-cols-[1fr_5rem_9rem_7rem_auto]", children: [
              /* @__PURE__ */ n("div", { className: "cm:min-w-0 cm:text-sm", children: [
                /* @__PURE__ */ e("p", { className: "cm:font-medium", children: N.label }),
                N.sku && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: N.sku })
              ] }),
              /* @__PURE__ */ e(h, { type: "number", min: 1, "aria-label": "Quantity", value: N.quantity, onChange: (I) => de(P, { quantity: Math.max(1, Number(I.target.value)) }) }),
              s ? /* @__PURE__ */ e(te, { value: N.unit_price, placeholder: oe(N.variant_id)?.unit_price_formatted ?? "", onChange: (I) => de(P, { unit_price: I }) }) : /* @__PURE__ */ e("span", { className: "cm:text-sm", children: oe(N.variant_id)?.unit_price_formatted ?? "…" }),
              /* @__PURE__ */ e("span", { className: "cm:text-sm cm:font-medium cm:sm:text-right", children: oe(N.variant_id)?.total ?? "" }),
              /* @__PURE__ */ e(v, { type: "button", variant: "ghost", size: "sm", "aria-label": "Remove", onClick: () => r.setData("lines", r.data.lines.filter((I, H) => H !== P)), children: "×" })
            ] }, `${N.item_id ?? "n"}-${N.variant_id}-${P}`)) }),
            D?.notices.map((N, P) => /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-amber-700", children: N }, P))
          ] })
        ] }),
        c === "create" && /* @__PURE__ */ n(m, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(x, { children: "Customer" }) }),
          /* @__PURE__ */ n(k, { className: "cm:grid cm:gap-3 cm:sm:grid-cols-3", children: [
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(p, { htmlFor: "m-email", children: "Email *" }),
              /* @__PURE__ */ e(h, { id: "m-email", type: "email", value: r.data.email, onChange: (N) => r.setData("email", N.target.value) }),
              y.email && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-destructive", children: y.email })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(p, { htmlFor: "m-name", children: "Name" }),
              /* @__PURE__ */ e(h, { id: "m-name", value: r.data.name, onChange: (N) => r.setData("name", N.target.value) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(p, { htmlFor: "m-phone", children: "Phone" }),
              /* @__PURE__ */ e(h, { id: "m-phone", value: r.data.phone, onChange: (N) => r.setData("phone", N.target.value) })
            ] })
          ] })
        ] }),
        c === "create" && (D?.needs_shipping ?? !0) && /* @__PURE__ */ n(m, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(x, { children: "Shipping address" }) }),
          /* @__PURE__ */ n(k, { className: "cm:grid cm:gap-3", children: [
            /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: ["name", "phone"].map((N) => /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(p, { htmlFor: `a-${N}`, children: N === "name" ? "Recipient" : "Phone" }),
              /* @__PURE__ */ e(h, { id: `a-${N}`, value: String(r.data.shipping_address[N] ?? ""), onChange: (P) => r.setData("shipping_address", { ...r.data.shipping_address, [N]: P.target.value }) })
            ] }, N)) }),
            /* @__PURE__ */ e(
              Te,
              {
                field: { handle: "region", type: "commerce_region", label: "Region", config: { depth: "village" } },
                pathPrefix: "shipping_address",
                value: r.data.shipping_address,
                onChange: (N) => r.setData("shipping_address", { ...r.data.shipping_address, ...N ?? {} })
              }
            ),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(p, { htmlFor: "a-line1", children: "Street address" }),
              /* @__PURE__ */ e(h, { id: "a-line1", value: String(r.data.shipping_address.line1 ?? ""), onChange: (N) => r.setData("shipping_address", { ...r.data.shipping_address, line1: N.target.value }) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1 cm:sm:w-48", children: [
              /* @__PURE__ */ e(p, { htmlFor: "a-postal", children: "Postal code" }),
              /* @__PURE__ */ e(h, { id: "a-postal", value: String(r.data.shipping_address.postal_code ?? ""), onChange: (N) => r.setData("shipping_address", { ...r.data.shipping_address, postal_code: N.target.value }) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ n(m, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(x, { children: "Shipping and discount" }) }),
          /* @__PURE__ */ n(k, { className: "cm:grid cm:gap-3", children: [
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(p, { htmlFor: "s-label", children: "Shipping method" }),
              /* @__PURE__ */ e(h, { id: "s-label", placeholder: "JNE REG", value: r.data.shipping.label, onChange: (N) => r.setData("shipping", { ...r.data.shipping, label: N.target.value }) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(p, { htmlFor: "s-cost", children: "Shipping cost" }),
              /* @__PURE__ */ e(te, { id: "s-cost", allowNull: !1, value: r.data.shipping.cost, onChange: (N) => r.setData("shipping", { ...r.data.shipping, cost: N ?? 0 }) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(p, { htmlFor: "d-label", children: "Discount label" }),
              /* @__PURE__ */ e(h, { id: "d-label", value: r.data.discount.label, onChange: (N) => r.setData("discount", { ...r.data.discount, label: N.target.value }) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(p, { htmlFor: "d-amount", children: "Discount" }),
              /* @__PURE__ */ e(te, { id: "d-amount", allowNull: !1, value: r.data.discount.amount, onChange: (N) => r.setData("discount", { ...r.data.discount, amount: N ?? 0 }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ n(m, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(x, { children: "Total" }) }),
          /* @__PURE__ */ e(k, { className: "cm:grid cm:gap-1 cm:text-sm", children: D ? /* @__PURE__ */ n(O, { children: [
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
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(x, { children: "Payment" }) }),
          /* @__PURE__ */ n(k, { className: "cm:grid cm:gap-3 cm:text-sm", children: [
            ["unpaid", "paid"].map((N) => /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e("input", { type: "radio", name: "payment_status", checked: r.data.payment_status === N, onChange: () => r.setData("payment_status", N) }),
              N === "unpaid" ? "Unpaid: the customer pays later" : "Paid already"
            ] }, N)),
            i.length > 0 && /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(p, { htmlFor: "p-method", children: "Method" }),
              /* @__PURE__ */ n("select", { id: "p-method", className: "cm:h-9 cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3", value: r.data.payment_method, onChange: (N) => r.setData("payment_method", N.target.value), children: [
                /* @__PURE__ */ e("option", { value: "", children: "—" }),
                i.map((N) => /* @__PURE__ */ e("option", { value: N.value, children: N.label }, N.value))
              ] })
            ] }),
            r.data.payment_status === "paid" ? /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(p, { htmlFor: "p-ref", children: "Reference" }),
              /* @__PURE__ */ e(h, { id: "p-ref", value: r.data.reference, onChange: (N) => r.setData("reference", N.target.value) })
            ] }) : /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e(f, { checked: r.data.send_link, onCheckedChange: (N) => r.setData("send_link", N === !0) }),
              " Email the customer the link to pay"
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(p, { htmlFor: "m-note", children: "Internal note" }),
              /* @__PURE__ */ e(g, { id: "m-note", value: r.data.note, onChange: (N) => r.setData("note", N.target.value) })
            ] })
          ] })
        ] }),
        c === "quote" && /* @__PURE__ */ n(m, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(x, { children: "Validity" }) }),
          /* @__PURE__ */ n(k, { className: "cm:grid cm:gap-3 cm:text-sm", children: [
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(p, { htmlFor: "q-valid", children: "Valid until" }),
              /* @__PURE__ */ e(h, { id: "q-valid", type: "date", value: r.data.valid_until, onChange: (N) => r.setData("valid_until", N.target.value) }),
              y.valid_until && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-destructive", children: y.valid_until })
            ] }),
            /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e(f, { checked: r.data.send, onCheckedChange: (N) => r.setData("send", N === !0) }),
              " Send it to the customer now"
            ] })
          ] })
        ] }),
        c === "edit" && /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
          /* @__PURE__ */ e(f, { checked: r.data.notify, onCheckedChange: (N) => r.setData("notify", N === !0) }),
          " Tell the customer about the change"
        ] }),
        /* @__PURE__ */ e(v, { type: "submit", disabled: r.processing || r.data.lines.length === 0, children: c === "create" ? "Create order" : c === "quote" ? r.data.send ? "Send quote" : "Save quote" : "Save changes" })
      ] })
    ] })
  ] });
}
function Je({ order: c, couriers: t, onClose: i }) {
  const { Dialog: s, DialogContent: l, DialogFooter: a, DialogHeader: o, DialogTitle: m, Button: k, Input: u, Label: x } = j, v = c.items.filter((g) => g.unfulfilled > 0), h = R.useForm({
    courier: t[0]?.key ?? "",
    courier_name: "",
    service: "",
    tracking_number: "",
    items: v.map((g) => ({ order_item_id: g.id, quantity: g.unfulfilled }))
  }), p = h.errors;
  return /* @__PURE__ */ e(s, { open: !0, onOpenChange: (g) => !g && i(), children: /* @__PURE__ */ n(l, { children: [
    /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(m, { children: "Add a shipment" }) }),
    /* @__PURE__ */ n("form", { className: "cm:grid cm:gap-3", onSubmit: (g) => {
      g.preventDefault(), h.post(C(`commerce/orders/${c.id}/shipments`), { preserveScroll: !0, onSuccess: i });
    }, children: [
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(x, { htmlFor: "s-courier", children: "Courier" }),
        /* @__PURE__ */ n("select", { id: "s-courier", className: "cm:h-9 cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm", value: h.data.courier, onChange: (g) => h.setData("courier", g.target.value), children: [
          t.map((g) => /* @__PURE__ */ e("option", { value: g.key, children: g.name }, g.key)),
          /* @__PURE__ */ e("option", { value: "", children: "Other…" })
        ] })
      ] }),
      h.data.courier === "" && /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(x, { htmlFor: "s-name", children: "Courier name" }),
        /* @__PURE__ */ e(u, { id: "s-name", value: h.data.courier_name, onChange: (g) => h.setData("courier_name", g.target.value) })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(x, { htmlFor: "s-service", children: "Service" }),
        /* @__PURE__ */ e(u, { id: "s-service", placeholder: "REG, YES…", value: h.data.service, onChange: (g) => h.setData("service", g.target.value) })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(x, { htmlFor: "s-tracking", children: "Tracking number" }),
        /* @__PURE__ */ e(u, { id: "s-tracking", value: h.data.tracking_number, onChange: (g) => h.setData("tracking_number", g.target.value) })
      ] }),
      /* @__PURE__ */ n("fieldset", { className: "cm:grid cm:gap-2", children: [
        /* @__PURE__ */ e("legend", { className: "cm:mb-1 cm:text-sm cm:font-medium", children: "In this parcel" }),
        v.map((g, r) => /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:text-sm", children: [
          /* @__PURE__ */ n("span", { children: [
            g.name,
            g.variant_title ? ` · ${g.variant_title}` : "",
            " ",
            /* @__PURE__ */ n("span", { className: "cm:text-muted-foreground", children: [
              "(",
              g.unfulfilled,
              " left)"
            ] })
          ] }),
          /* @__PURE__ */ e(
            u,
            {
              type: "number",
              min: 0,
              max: g.unfulfilled,
              className: "cm:w-20",
              value: h.data.items[r].quantity,
              onChange: (y) => h.setData("items", h.data.items.map((b, _) => _ === r ? { ...b, quantity: Number(y.target.value) } : b))
            }
          )
        ] }, g.id)),
        p.items && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-destructive", children: p.items })
      ] }),
      /* @__PURE__ */ n(a, { children: [
        /* @__PURE__ */ e(k, { type: "button", variant: "outline", onClick: i, children: "Cancel" }),
        /* @__PURE__ */ e(k, { type: "submit", disabled: h.processing, children: "Save shipment" })
      ] })
    ] })
  ] }) });
}
function Xe({ order: c, onClose: t }) {
  const { Dialog: i, DialogContent: s, DialogFooter: l, DialogHeader: a, DialogTitle: o, DialogDescription: m, Button: k, Input: u, Label: x, Checkbox: v } = j, h = R.useForm({
    amount: c.totals.refundable,
    reason: "",
    restock: !1,
    items: c.items.map((f) => ({ order_item_id: f.id, quantity: 0 }))
  }), p = h.errors;
  return /* @__PURE__ */ e(i, { open: !0, onOpenChange: (f) => !f && t(), children: /* @__PURE__ */ n(s, { children: [
    /* @__PURE__ */ n(a, { children: [
      /* @__PURE__ */ e(o, { children: "Refund" }),
      /* @__PURE__ */ e(m, { children: "Record money you returned to the customer." })
    ] }),
    /* @__PURE__ */ n("form", { className: "cm:grid cm:gap-3", onSubmit: (f) => {
      f.preventDefault(), h.post(C(`commerce/orders/${c.id}/refunds`), { preserveScroll: !0, onSuccess: t });
    }, children: [
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(x, { htmlFor: "r-amount", children: "Amount" }),
        /* @__PURE__ */ e(te, { id: "r-amount", value: h.data.amount, onChange: (f) => h.setData("amount", f) }),
        p.amount && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-destructive", children: p.amount })
      ] }),
      /* @__PURE__ */ n("fieldset", { className: "cm:grid cm:gap-2", children: [
        /* @__PURE__ */ e("legend", { className: "cm:mb-1 cm:text-sm cm:font-medium", children: "Items returned (optional)" }),
        c.items.map((f, g) => /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:text-sm", children: [
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
              value: h.data.items[g].quantity,
              onChange: (r) => h.setData("items", h.data.items.map((y, b) => b === g ? { ...y, quantity: Number(r.target.value) } : y))
            }
          )
        ] }, f.id))
      ] }),
      /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
        /* @__PURE__ */ e(v, { checked: h.data.restock, onCheckedChange: (f) => h.setData("restock", f === !0) }),
        " Put the returned items back in stock"
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(x, { htmlFor: "r-reason", children: "Reason" }),
        /* @__PURE__ */ e(u, { id: "r-reason", value: h.data.reason, onChange: (f) => h.setData("reason", f.target.value) })
      ] }),
      /* @__PURE__ */ n(l, { children: [
        /* @__PURE__ */ e(k, { type: "button", variant: "outline", onClick: t, children: "Cancel" }),
        /* @__PURE__ */ e(k, { type: "submit", disabled: h.processing, children: "Record refund" })
      ] })
    ] })
  ] }) });
}
const A = (c) => c ? new Date(c).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" }) : "—", me = (c) => ({
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
function Ye(c) {
  const { order: t, transitions: i, can: s, panels: l } = c, { Card: a, CardContent: o, CardHeader: m, CardTitle: k, Button: u, Textarea: x, Label: v, Checkbox: h, Input: p, Dialog: f, DialogContent: g, DialogFooter: r, DialogHeader: y, DialogTitle: b, DialogDescription: _ } = j, { Link: $, router: w } = R;
  M(), L.useBreadcrumbs([{ label: "Shop", href: C("commerce") }, { label: "Orders", href: C("commerce/orders") }, { label: t.number }]);
  const D = `commerce/orders/${t.id}`, [S, U] = F.useState(null), [de, ge] = F.useState(""), [oe, N] = F.useState(!1), [P, I] = F.useState(!1), [H, ce] = F.useState(!1), Q = R.useForm({ message: "", customer: !1 }), J = R.useForm({ reference: "", paid_at: "", account: "" }), Ie = ee.orderPanels(), xe = (d, E) => w.post(C(`${D}/transition`), { to: d, reason: E ?? null }, { preserveScroll: !0, onFinish: () => U(null) });
  return /* @__PURE__ */ n("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      K,
      {
        title: `${t.type === "quote" ? "Quote" : "Order"} ${t.number}`,
        description: /* @__PURE__ */ n(O, { children: [
          "Placed ",
          A(t.placed_at),
          " · ",
          t.channel,
          t.trashed ? " · in the trash" : ""
        ] }),
        actions: /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
          /* @__PURE__ */ e(T, { tone: me(t.status), children: t.status_label }),
          t.type === "order" && /* @__PURE__ */ e(T, { tone: me(t.payment_status), children: t.payment_label }),
          t.type === "order" && t.fulfillment_status !== "not_required" && /* @__PURE__ */ e(T, { tone: me(t.fulfillment_status), children: t.fulfillment_label }),
          /* @__PURE__ */ e(u, { variant: "outline", size: "sm", asChild: !0, children: /* @__PURE__ */ e("a", { href: t.storefront_url, target: "_blank", rel: "noreferrer", children: "Customer view" }) })
        ] })
      }
    ),
    /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-wrap cm:gap-2", children: [
      i.filter((d) => d.permission).map((d) => /* @__PURE__ */ e(
        u,
        {
          size: "sm",
          variant: d.to === "cancelled" ? "outline" : "default",
          disabled: !d.allowed,
          title: d.reason ?? void 0,
          onClick: () => d.to === "cancelled" || d.to === "on_hold" ? U(d) : xe(d.to),
          children: d.to === "cancelled" ? "Cancel order" : `Mark ${d.label.toLowerCase()}`
        },
        d.to
      )),
      s.mark_paid && /* @__PURE__ */ e(u, { size: "sm", variant: "outline", onClick: () => N(!0), children: "Mark paid" }),
      s.shipments && t.items.some((d) => d.unfulfilled > 0) && /* @__PURE__ */ e(u, { size: "sm", variant: "outline", onClick: () => I(!0), children: "Add shipment" }),
      s.refund && /* @__PURE__ */ e(u, { size: "sm", variant: "outline", onClick: () => ce(!0), children: "Refund" }),
      s.send_link && /* @__PURE__ */ e(u, { size: "sm", variant: "outline", onClick: () => w.post(C(`${D}/payment-link`), {}, { preserveScroll: !0 }), children: "Send payment link" }),
      s.edit_items && /* @__PURE__ */ e(u, { size: "sm", variant: "outline", asChild: !0, children: /* @__PURE__ */ e($, { href: C(`${D}/edit`), children: "Edit items" }) }),
      s.respond_quote && /* @__PURE__ */ e(u, { size: "sm", asChild: !0, children: /* @__PURE__ */ e($, { href: C(`${D}/quote`), children: t.status === "quoted" ? "Edit quote" : "Send a quote" }) }),
      s.delete && !t.trashed && /* @__PURE__ */ e(
        u,
        {
          size: "sm",
          variant: "ghost",
          className: "cm:ml-auto cm:text-destructive",
          onClick: () => window.confirm("Move this order to the trash?") && w.delete(C(D)),
          children: "Trash"
        }
      ),
      s.delete && t.trashed && /* @__PURE__ */ e(u, { size: "sm", variant: "outline", className: "cm:ml-auto", onClick: () => w.post(C(`${D}/restore`)), children: "Restore" }),
      s.force_delete && /* @__PURE__ */ e(
        u,
        {
          size: "sm",
          variant: "ghost",
          className: "cm:text-destructive",
          onClick: () => window.confirm("Delete this order for good? This can't be undone.") && w.delete(C(`${D}/force`)),
          children: "Delete for good"
        }
      )
    ] }),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[2fr_1fr]", children: [
      /* @__PURE__ */ n("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ n(a, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "Items" }) }),
          /* @__PURE__ */ n(o, { className: "cm:grid cm:gap-4", children: [
            /* @__PURE__ */ e("ul", { className: "cm:divide-y cm:divide-border", children: t.items.map((d) => /* @__PURE__ */ n("li", { className: "cm:grid cm:gap-1 cm:py-3 cm:first:pt-0 cm:sm:grid-cols-[1fr_auto] cm:sm:gap-4", children: [
              /* @__PURE__ */ n("div", { className: "cm:min-w-0", children: [
                /* @__PURE__ */ n("p", { className: "cm:font-medium", children: [
                  d.product_href ? /* @__PURE__ */ e($, { href: C(d.product_href), className: "cm:hover:underline", children: d.name }) : d.name,
                  d.variant_title && /* @__PURE__ */ n("span", { className: "cm:text-muted-foreground", children: [
                    " · ",
                    d.variant_title
                  ] })
                ] }),
                /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  d.sku && /* @__PURE__ */ n(O, { children: [
                    "SKU ",
                    d.sku,
                    " · "
                  ] }),
                  d.price_source.label,
                  d.requires_shipping && t.fulfillment_status !== "not_required" && /* @__PURE__ */ n(O, { children: [
                    " · shipped ",
                    d.fulfilled_quantity,
                    "/",
                    d.quantity
                  ] }),
                  d.refunded_quantity > 0 && /* @__PURE__ */ n(O, { children: [
                    " · refunded ",
                    d.refunded_quantity
                  ] })
                ] }),
                d.components.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:mt-1 cm:text-xs cm:text-muted-foreground", children: d.components.map((E, Ee) => /* @__PURE__ */ n("li", { children: [
                  E.quantity,
                  " × ",
                  E.name
                ] }, Ee)) })
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
              /* @__PURE__ */ e(Z, { label: "Subtotal", value: t.totals.subtotal }),
              t.adjustments.filter((d) => d.kind !== "tax").map((d, E) => /* @__PURE__ */ e(Z, { label: `${d.label}${d.code ? ` (${d.code})` : ""}`, value: d.amount, muted: !0 }, E)),
              t.totals.shipping !== null && /* @__PURE__ */ e(Z, { label: `Shipping${t.shipping_method?.label ? ` · ${t.shipping_method.label}` : ""}`, value: t.totals.shipping }),
              t.adjustments.filter((d) => d.kind === "tax").map((d, E) => /* @__PURE__ */ e(Z, { label: `${d.label}${d.included ? " (included)" : ""}`, value: d.amount, muted: !0 }, `t${E}`)),
              /* @__PURE__ */ e(Z, { label: "Total", value: t.totals.total, strong: !0 }),
              t.type === "order" && /* @__PURE__ */ e(Z, { label: "Paid", value: t.totals.paid, muted: !0 }),
              t.totals.refunded && /* @__PURE__ */ e(Z, { label: "Refunded", value: `−${t.totals.refunded}`, muted: !0 })
            ] })
          ] })
        ] }),
        (t.payments.length > 0 || t.confirmations.length > 0) && /* @__PURE__ */ n(a, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "Payments" }) }),
          /* @__PURE__ */ n(o, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            t.payments.map((d) => /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2 cm:rounded-md cm:border cm:p-3", children: [
              /* @__PURE__ */ n("div", { children: [
                /* @__PURE__ */ n("p", { className: "cm:font-medium", children: [
                  d.method,
                  " · ",
                  d.amount
                ] }),
                /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  d.reference && /* @__PURE__ */ n(O, { children: [
                    "Ref ",
                    d.reference,
                    " · "
                  ] }),
                  d.paid_at ? `Paid ${A(d.paid_at)}` : d.expires_at ? `Due ${A(d.expires_at)}` : "",
                  d.refunded && ` · refunded ${d.refunded}`
                ] })
              ] }),
              /* @__PURE__ */ e(T, { tone: me(d.status), children: d.status.replace(/_/g, " ") })
            ] }, d.id)),
            t.confirmations.map((d) => /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2 cm:rounded-md cm:border cm:border-dashed cm:p-3", children: [
              /* @__PURE__ */ n("span", { children: [
                "Confirmation from ",
                d.sender_name,
                d.sender_bank ? ` (${d.sender_bank})` : "",
                " · ",
                d.amount,
                d.proof_url && /* @__PURE__ */ n(O, { children: [
                  " · ",
                  /* @__PURE__ */ e("a", { href: d.proof_url, target: "_blank", rel: "noreferrer", className: "cm:underline", children: "proof" })
                ] })
              ] }),
              /* @__PURE__ */ n("span", { className: "cm:flex cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ e(T, { tone: d.status === "approved" ? "ok" : d.status === "rejected" ? "error" : "warning", children: d.status }),
                d.can_review && /* @__PURE__ */ e(u, { size: "sm", asChild: !0, children: /* @__PURE__ */ e($, { href: C("commerce/confirmations"), children: "Review" }) })
              ] })
            ] }, d.id))
          ] })
        ] }),
        t.shipments.length > 0 && /* @__PURE__ */ n(a, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "Shipments" }) }),
          /* @__PURE__ */ e(o, { className: "cm:grid cm:gap-2 cm:text-sm", children: t.shipments.map((d) => /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1 cm:rounded-md cm:border cm:p-3", children: [
            /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:justify-between", children: [
              /* @__PURE__ */ n("span", { className: "cm:font-medium", children: [
                d.courier,
                d.service ? ` ${d.service}` : "",
                d.tracking_number && /* @__PURE__ */ n(O, { children: [
                  " · ",
                  d.tracking_url ? /* @__PURE__ */ e("a", { href: d.tracking_url, target: "_blank", rel: "noreferrer", className: "cm:underline", children: d.tracking_number }) : d.tracking_number
                ] })
              ] }),
              /* @__PURE__ */ e(T, { tone: me(d.status), children: d.status.replace(/_/g, " ") })
            ] }),
            /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
              d.items.map((E) => `${E.quantity} × ${E.name}`).join(", "),
              " · shipped ",
              A(d.shipped_at),
              d.delivered_at ? ` · delivered ${A(d.delivered_at)}` : ""
            ] }),
            s.shipments && d.status !== "delivered" && /* @__PURE__ */ e("div", { children: /* @__PURE__ */ e(u, { size: "sm", variant: "outline", onClick: () => w.post(C(`${D}/shipments/${d.id}/delivered`), {}, { preserveScroll: !0 }), children: "Mark delivered" }) })
          ] }, d.id)) })
        ] }),
        t.downloads.length > 0 && /* @__PURE__ */ n(a, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "Downloads" }) }),
          /* @__PURE__ */ e(o, { className: "cm:grid cm:gap-2 cm:text-sm", children: t.downloads.map((d) => /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2 cm:rounded-md cm:border cm:p-3", children: [
            /* @__PURE__ */ n("span", { children: [
              /* @__PURE__ */ e("span", { className: "cm:font-medium", children: d.name }),
              " · ",
              d.count,
              " downloaded",
              d.remaining !== null ? ` · ${d.remaining} left` : "",
              d.expires_at ? ` · until ${A(d.expires_at)}` : ""
            ] }),
            /* @__PURE__ */ n("span", { className: "cm:flex cm:items-center cm:gap-1", children: [
              /* @__PURE__ */ e(T, { tone: d.state === "active" ? "ok" : "warning", children: d.state.replace("_", " ") }),
              s.edit && ["resend", "extend", "reset", "revoke"].map((E) => /* @__PURE__ */ e(u, { size: "sm", variant: "ghost", onClick: () => w.post(C(`${D}/downloads/${d.id}`), { action: E }, { preserveScroll: !0 }), children: { resend: "Resend", extend: "+7 days", reset: "Reset count", revoke: "Revoke" }[E] }, E))
            ] })
          ] }, d.id)) })
        ] }),
        t.refunds.length > 0 && /* @__PURE__ */ n(a, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "Refunds" }) }),
          /* @__PURE__ */ e(o, { className: "cm:grid cm:gap-1 cm:text-sm", children: t.refunds.map((d) => /* @__PURE__ */ n("p", { children: [
            d.amount,
            " · ",
            A(d.created_at),
            d.reason ? ` · ${d.reason}` : "",
            d.restock ? " · restocked" : ""
          ] }, d.id)) })
        ] }),
        l.map((d) => {
          const E = Ie[d.key];
          return E ? /* @__PURE__ */ n(a, { children: [
            /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: d.label }) }),
            /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(E, { order: t, data: d.data }) })
          ] }, d.key) : null;
        }),
        /* @__PURE__ */ n(a, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "Timeline" }) }),
          /* @__PURE__ */ n(o, { className: "cm:grid cm:gap-4", children: [
            s.edit && /* @__PURE__ */ n("form", { className: "cm:grid cm:gap-2", onSubmit: (d) => {
              d.preventDefault(), Q.post(C(`${D}/notes`), { preserveScroll: !0, onSuccess: () => Q.reset() });
            }, children: [
              /* @__PURE__ */ e(v, { htmlFor: "o-note", className: "cm:sr-only", children: "Note" }),
              /* @__PURE__ */ e(x, { id: "o-note", placeholder: "Add a note…", value: Q.data.message, onChange: (d) => Q.setData("message", d.target.value) }),
              /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:justify-between cm:gap-2", children: [
                /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
                  /* @__PURE__ */ e(h, { checked: Q.data.customer, onCheckedChange: (d) => Q.setData("customer", d === !0) }),
                  " Send to the customer"
                ] }),
                /* @__PURE__ */ e(u, { size: "sm", type: "submit", disabled: Q.processing || Q.data.message.trim() === "", children: "Add note" })
              ] })
            ] }),
            /* @__PURE__ */ e("ol", { className: "cm:grid cm:gap-3 cm:text-sm", children: t.timeline.map((d) => /* @__PURE__ */ n("li", { className: "cm:grid cm:gap-0.5 cm:border-l-2 cm:pl-3", style: { borderColor: d.visibility === "customer" ? "var(--color-primary, currentColor)" : void 0 }, children: [
              /* @__PURE__ */ e("span", { className: "cm:whitespace-pre-line", children: d.message }),
              /* @__PURE__ */ n("span", { className: "cm:text-xs cm:text-muted-foreground", children: [
                A(d.created_at),
                " · ",
                d.actor ?? d.source,
                d.visibility === "customer" ? " · to the customer" : ""
              ] })
            ] }, d.id)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ n(a, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "Customer" }) }),
          /* @__PURE__ */ n(o, { className: "cm:grid cm:gap-1 cm:text-sm", children: [
            /* @__PURE__ */ e("p", { className: "cm:font-medium", children: t.customer.href ? /* @__PURE__ */ e($, { href: C(t.customer.href), className: "cm:hover:underline", children: t.customer.name ?? t.customer.email }) : t.customer.name ?? t.customer.email }),
            t.customer.email && /* @__PURE__ */ e("a", { href: `mailto:${t.customer.email}`, className: "cm:text-muted-foreground cm:hover:underline", children: t.customer.email }),
            t.customer.phone && /* @__PURE__ */ e("a", { href: `https://wa.me/${t.customer.phone.replace(/\D/g, "")}`, target: "_blank", rel: "noreferrer", className: "cm:text-muted-foreground cm:hover:underline", children: t.customer.phone }),
            t.customer.guest && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: "Guest checkout" })
          ] })
        ] }),
        /* @__PURE__ */ n(a, { children: [
          /* @__PURE__ */ n(m, { className: "cm:flex cm:flex-row cm:items-center cm:justify-between", children: [
            /* @__PURE__ */ e(k, { children: "Addresses" }),
            s.edit_addresses && /* @__PURE__ */ e(u, { size: "sm", variant: "ghost", asChild: !0, children: /* @__PURE__ */ e($, { href: C(`${D}/addresses`), children: "Edit" }) })
          ] }),
          /* @__PURE__ */ n(o, { className: "cm:grid cm:gap-3 cm:text-sm", children: [
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
        (t.customer_note || t.fields && Object.keys(t.fields).length > 0) && /* @__PURE__ */ n(a, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "From the customer" }) }),
          /* @__PURE__ */ n(o, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            t.customer_note && /* @__PURE__ */ e("p", { className: "cm:whitespace-pre-line", children: t.customer_note }),
            t.fields && Object.entries(t.fields).map(([d, E]) => /* @__PURE__ */ n("p", { children: [
              /* @__PURE__ */ n("span", { className: "cm:text-muted-foreground", children: [
                d.replace(/_/g, " "),
                ":"
              ] }),
              " ",
              String(E ?? "")
            ] }, d))
          ] })
        ] }),
        /* @__PURE__ */ n(a, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "Details" }) }),
          /* @__PURE__ */ n(o, { className: "cm:grid cm:gap-1 cm:text-sm", children: [
            t.payment_method_title && /* @__PURE__ */ n("p", { children: [
              "Payment: ",
              t.payment_method_title
            ] }),
            t.expires_at && t.payment_status === "unpaid" && /* @__PURE__ */ n("p", { children: [
              "Pay before ",
              A(t.expires_at)
            ] }),
            t.paid_at && /* @__PURE__ */ n("p", { children: [
              "Paid ",
              A(t.paid_at)
            ] }),
            t.completed_at && /* @__PURE__ */ n("p", { children: [
              "Completed ",
              A(t.completed_at)
            ] }),
            t.cancelled_at && /* @__PURE__ */ n("p", { children: [
              "Cancelled ",
              A(t.cancelled_at),
              t.cancel_reason ? ` — ${t.cancel_reason}` : ""
            ] }),
            t.quote_valid_until && /* @__PURE__ */ n("p", { children: [
              "Quote valid until ",
              A(t.quote_valid_until)
            ] }),
            t.documents.length > 0 && /* @__PURE__ */ e("div", { className: "cm:mt-2 cm:flex cm:flex-wrap cm:gap-2", children: t.documents.map((d) => /* @__PURE__ */ e(u, { size: "sm", variant: "outline", asChild: !0, children: /* @__PURE__ */ n("a", { href: d.url, target: "_blank", rel: "noreferrer", children: [
              d.label,
              d.number ? ` ${d.number}` : ""
            ] }) }, d.type)) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e(f, { open: S !== null, onOpenChange: (d) => !d && U(null), children: /* @__PURE__ */ n(g, { children: [
      /* @__PURE__ */ n(y, { children: [
        /* @__PURE__ */ e(b, { children: S?.to === "cancelled" ? "Cancel this order?" : "Put this order on hold?" }),
        /* @__PURE__ */ e(_, { children: S?.to === "cancelled" ? "Stock, flash sale quantities and voucher uses are given back." : "It can go back to its status later." })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(v, { htmlFor: "o-reason", children: "Reason (on the timeline)" }),
        /* @__PURE__ */ e(p, { id: "o-reason", value: de, onChange: (d) => ge(d.target.value) })
      ] }),
      /* @__PURE__ */ n(r, { children: [
        /* @__PURE__ */ e(u, { variant: "outline", onClick: () => U(null), children: "Back" }),
        /* @__PURE__ */ e(u, { onClick: () => S && xe(S.to, de), children: "Confirm" })
      ] })
    ] }) }),
    /* @__PURE__ */ e(f, { open: oe, onOpenChange: N, children: /* @__PURE__ */ n(g, { children: [
      /* @__PURE__ */ n(y, { children: [
        /* @__PURE__ */ e(b, { children: "Mark as paid" }),
        /* @__PURE__ */ n(_, { children: [
          "Record a payment you received outside the store (",
          t.totals.total,
          ")."
        ] })
      ] }),
      /* @__PURE__ */ n("form", { className: "cm:grid cm:gap-3", onSubmit: (d) => {
        d.preventDefault(), J.post(C(`${D}/mark-paid`), { preserveScroll: !0, onSuccess: () => N(!1) });
      }, children: [
        /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(v, { htmlFor: "p-ref", children: "Reference" }),
          /* @__PURE__ */ e(p, { id: "p-ref", value: J.data.reference, onChange: (d) => J.setData("reference", d.target.value) })
        ] }),
        /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(v, { htmlFor: "p-date", children: "Paid on" }),
          /* @__PURE__ */ e(p, { id: "p-date", type: "datetime-local", value: J.data.paid_at, onChange: (d) => J.setData("paid_at", d.target.value) })
        ] }),
        /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ e(v, { htmlFor: "p-acc", children: "Into account" }),
          /* @__PURE__ */ e(p, { id: "p-acc", value: J.data.account, onChange: (d) => J.setData("account", d.target.value) })
        ] }),
        /* @__PURE__ */ e(r, { children: /* @__PURE__ */ e(u, { type: "submit", disabled: J.processing, children: "Record payment" }) })
      ] })
    ] }) }),
    P && /* @__PURE__ */ e(Je, { order: t, couriers: c.couriers, onClose: () => I(!1) }),
    H && /* @__PURE__ */ e(Xe, { order: t, onClose: () => ce(!1) })
  ] });
}
function Z({ label: c, value: t, muted: i, strong: s }) {
  return /* @__PURE__ */ n("div", { className: `cm:flex cm:justify-between cm:gap-4 ${i ? "cm:text-muted-foreground" : ""} ${s ? "cm:text-base cm:font-semibold" : ""}`, children: [
    /* @__PURE__ */ e("dt", { children: c }),
    /* @__PURE__ */ e("dd", { children: t })
  ] });
}
const Ze = { published: "ok", draft: "neutral", scheduled: "info", trashed: "error" };
function et(c) {
  const { DataTable: t } = ne, { Button: i } = j, { Link: s } = R;
  return M(), L.useBreadcrumbs([{ label: "Shop", href: C("commerce") }, { label: "Products" }]), /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      K,
      {
        title: "Products",
        description: "Products are entries: opening one goes to the editor.",
        actions: /* @__PURE__ */ e(i, { asChild: !0, children: /* @__PURE__ */ e(s, { href: C(c.createUrl), children: "New product" }) })
      }
    ),
    /* @__PURE__ */ e(
      t,
      {
        ...c,
        searchPlaceholder: "Search titles or SKUs…",
        rowHref: (l) => C(l.href),
        renderCell: (l, a) => {
          switch (a.key) {
            case "product_title":
              return /* @__PURE__ */ n("span", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ e("span", { className: "cm:font-medium", children: l.product_title }),
                l.featured && /* @__PURE__ */ e(T, { tone: "info", children: "Featured" }),
                l.sync_failed && /* @__PURE__ */ e("span", { title: l.sync_error ?? "", children: /* @__PURE__ */ e(T, { tone: "error", children: "Can't be bought" }) })
              ] });
            case "state":
              return /* @__PURE__ */ e(T, { tone: Ze[l.state], children: l.state });
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
function je({ items: c, current: t, label: i = "Sections" }) {
  const { Link: s } = R;
  return /* @__PURE__ */ e("nav", { "aria-label": i, className: "cm:flex cm:gap-1 cm:overflow-x-auto cm:md:flex-col", children: c.map((l) => /* @__PURE__ */ e(
    s,
    {
      href: C(l.href),
      "aria-current": l.key === t ? "page" : void 0,
      className: ue(
        "cm:whitespace-nowrap cm:rounded-md cm:px-3 cm:py-1.5 cm:text-sm cm:text-muted-foreground cm:hover:bg-muted cm:hover:text-foreground",
        l.key === t && "cm:bg-muted cm:font-medium cm:text-foreground"
      ),
      children: l.label
    },
    l.key
  )) });
}
function se({ sections: c, current: t, title: i, description: s, children: l }) {
  const { SettingsTabs: a } = ne;
  return M(), L.useBreadcrumbs([{ label: "Settings", href: C("settings") }, { label: "Store", href: C("commerce/settings") }, { label: i }]), /* @__PURE__ */ n("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(a, { current: "store" }),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6 cm:md:grid-cols-[12rem_1fr]", children: [
      /* @__PURE__ */ e(je, { items: c, current: t, label: "Store settings" }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:min-w-0 cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ e(K, { title: i, description: s }),
        l
      ] })
    ] })
  ] });
}
function tt({ sections: c, emails: t }) {
  const { Card: i, CardContent: s, CardHeader: l, CardTitle: a, Switch: o, Button: m } = j, { Link: k, router: u } = R, x = [["To customers", t.filter((v) => v.audience === "customer")], ["To staff", t.filter((v) => v.audience === "staff")]];
  return /* @__PURE__ */ e(se, { sections: c, current: "emails", title: "Emails", description: "What the store sends, and to whom. Open an email to change its texts, recipients and attachments.", children: x.map(([v, h]) => h.length > 0 && /* @__PURE__ */ n(i, { children: [
    /* @__PURE__ */ e(l, { children: /* @__PURE__ */ e(a, { children: v }) }),
    /* @__PURE__ */ e(s, { className: "cm:p-0", children: /* @__PURE__ */ e("ul", { className: "cm:divide-y cm:divide-border", children: h.map((p) => /* @__PURE__ */ n("li", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:px-6 cm:py-3", children: [
      /* @__PURE__ */ n("div", { className: "cm:min-w-0", children: [
        /* @__PURE__ */ e(k, { href: C(p.edit_url), className: "cm:font-medium cm:hover:underline", children: p.label }),
        p.description && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: p.description })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
        p.preview_url && /* @__PURE__ */ n(O, { children: [
          /* @__PURE__ */ e(m, { size: "sm", variant: "ghost", asChild: !0, children: /* @__PURE__ */ e("a", { href: p.preview_url, target: "_blank", rel: "noreferrer", children: "Preview" }) }),
          /* @__PURE__ */ e(m, { size: "sm", variant: "ghost", onClick: () => u.post(C(`commerce/settings/emails/${p.key}/test`), {}, { preserveScroll: !0 }), children: "Send test" })
        ] }),
        p.locked ? /* @__PURE__ */ e(T, { children: "Always sent" }) : /* @__PURE__ */ e(
          o,
          {
            checked: p.enabled,
            "aria-label": `Send ${p.label}`,
            onCheckedChange: (f) => u.put(C(`commerce/settings/emails/${p.key}/enabled`), { enabled: f }, { preserveScroll: !0 })
          }
        )
      ] })
    ] }, p.key)) }) })
  ] }, v)) });
}
function nt({ sections: c, mode: t, groups: i, updateUrl: s }) {
  const { Card: l, CardContent: a, CardHeader: o, CardTitle: m, Switch: k, Button: u, Dialog: x, DialogContent: v, DialogDescription: h, DialogFooter: p, DialogHeader: f, DialogTitle: g } = j, { errors: r } = R.usePage().props, [y, b] = F.useState(null), [_, $] = F.useState(null), w = (D, S) => {
    $(D.key), R.router.put(s.replace("__key__", D.key), { on: S }, { preserveScroll: !0, onFinish: () => $(null) });
  };
  return /* @__PURE__ */ n(
    se,
    {
      sections: c,
      current: "features",
      title: "Features",
      description: /* @__PURE__ */ n(O, { children: [
        "Switch store modules on or off. Selling mode: ",
        /* @__PURE__ */ e("strong", { children: t.label }),
        ". Switching off never deletes data."
      ] }),
      children: [
        r.feature && /* @__PURE__ */ e("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: r.feature }),
        i.map((D) => /* @__PURE__ */ n(l, { children: [
          /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(m, { children: D.label }) }),
          /* @__PURE__ */ e(a, { className: "cm:grid cm:gap-0 cm:divide-y cm:divide-border", children: D.features.map((S) => /* @__PURE__ */ n("div", { className: "cm:flex cm:items-start cm:justify-between cm:gap-4 cm:py-3 cm:first:pt-0 cm:last:pb-0", children: [
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ e("label", { htmlFor: `feature-${S.key}`, className: "cm:font-medium", children: S.label }),
                S.core && /* @__PURE__ */ e(T, { children: "Always on" }),
                S.switched_on && !S.active && /* @__PURE__ */ n(T, { tone: "warning", children: [
                  "Off — ",
                  S.reasons.join("; ").replace(/^Needs /, "needs ")
                ] }),
                S.essential && /* @__PURE__ */ n(T, { tone: "info", children: [
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
              k,
              {
                id: `feature-${S.key}`,
                checked: S.switched_on,
                disabled: S.core || _ === S.key,
                onCheckedChange: (U) => !U && S.dependents.length > 0 ? b(S) : w(S, U)
              }
            )
          ] }, S.key)) })
        ] }, D.key)),
        /* @__PURE__ */ e(x, { open: y !== null, onOpenChange: (D) => !D && b(null), children: /* @__PURE__ */ n(v, { children: [
          /* @__PURE__ */ n(f, { children: [
            /* @__PURE__ */ n(g, { children: [
              "Switch off ",
              y?.label,
              "?"
            ] }),
            /* @__PURE__ */ n(h, { children: [
              "These are switched off with it: ",
              y?.dependents.map((D) => D.label).join(", "),
              ". Their data is kept."
            ] })
          ] }),
          /* @__PURE__ */ n(p, { children: [
            /* @__PURE__ */ e(u, { variant: "outline", onClick: () => b(null), children: "Cancel" }),
            /* @__PURE__ */ e(
              u,
              {
                variant: "destructive",
                onClick: () => {
                  y && w(y, !1), b(null);
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
function ct({ sections: c, methods: t, instanceTypes: i }) {
  const { Card: s, CardContent: l, Button: a, Switch: o } = j, { Link: m, router: k } = R, u = (x, v) => k.post(C("commerce/settings/payments/move"), { key: x, direction: v }, { preserveScroll: !0 });
  return /* @__PURE__ */ n(se, { sections: c, current: "payments", title: "Payments", description: "Payment methods offered at checkout and on the pay page, in this order.", children: [
    t.length === 0 && /* @__PURE__ */ e(he, { title: "No payment methods", description: "Switch on Bank transfer, QRIS and cash on delivery in Features, or install a gateway package." }),
    t.length > 0 && /* @__PURE__ */ e(s, { children: /* @__PURE__ */ e(l, { className: "cm:p-0", children: /* @__PURE__ */ e("ul", { className: "cm:divide-y cm:divide-border", children: t.map((x, v) => /* @__PURE__ */ n("li", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:px-4 cm:py-3", children: [
      /* @__PURE__ */ n("div", { className: "cm:min-w-0", children: [
        /* @__PURE__ */ e(m, { href: C(x.edit_url), className: "cm:font-medium cm:hover:underline", children: x.title }),
        /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
          x.type,
          x.instance ? ` · ${x.key}` : ""
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
        !x.active && /* @__PURE__ */ e(T, { children: "Off" }),
        /* @__PURE__ */ e(a, { variant: "ghost", size: "sm", "aria-label": "Move up", disabled: v === 0, onClick: () => u(x.key, "up"), children: "↑" }),
        /* @__PURE__ */ e(a, { variant: "ghost", size: "sm", "aria-label": "Move down", disabled: v === t.length - 1, onClick: () => u(x.key, "down"), children: "↓" }),
        /* @__PURE__ */ e(
          o,
          {
            checked: x.active,
            "aria-label": `${x.title} active`,
            onCheckedChange: (h) => k.put(C(`commerce/settings/payments/${x.key}/active`), { active: h }, { preserveScroll: !0 })
          }
        )
      ] })
    ] }, x.key)) }) }) }),
    i.length > 0 && /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:gap-2", children: i.map((x) => /* @__PURE__ */ n(a, { variant: "outline", onClick: () => k.post(C("commerce/settings/payments/instances"), { type: x.key }), children: [
      "Add ",
      x.label.toLowerCase()
    ] }, x.key)) })
  ] });
}
function ye({ form: c, footer: t }) {
  const { FieldRenderer: i } = ne, { Button: s } = j, { data: l, setData: a, errors: o, processing: m, isDirty: k, ...u } = R.useForm({ values: c.values });
  return /* @__PURE__ */ n(
    "form",
    {
      className: "cm:grid cm:gap-6",
      onSubmit: (x) => {
        x.preventDefault(), u[c.method](c.action, { preserveScroll: !0 });
      },
      children: [
        o.section && /* @__PURE__ */ e("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: o.section }),
        /* @__PURE__ */ e(
          i,
          {
            fields: c.fields,
            values: l.values,
            errors: o,
            pathPrefix: "values",
            onChange: (x) => a("values", x)
          }
        ),
        /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
          /* @__PURE__ */ e(s, { type: "submit", disabled: m, children: c.submitLabel }),
          k && /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: "Unsaved changes" }),
          t
        ] })
      ]
    }
  );
}
function at({ section: c, sections: t, form: i }) {
  return /* @__PURE__ */ e(se, { sections: t, current: c.key, title: `${c.label} settings`, children: /* @__PURE__ */ e(ye, { form: i }, c.key) });
}
function rt({ sections: c, zones: t, types: i, couriers: s, moveUrl: l }) {
  const { Card: a, CardContent: o, CardHeader: m, CardTitle: k, Button: u, Select: x, SelectContent: v, SelectItem: h, SelectTrigger: p, SelectValue: f } = j, { Link: g } = R, r = (y, b, _) => R.router.post(C(l), { kind: y, id: b, direction: _ }, { preserveScroll: !0 });
  return /* @__PURE__ */ n(
    se,
    {
      sections: c,
      current: "shipping",
      title: "Shipping",
      description: "Zones are checked in order and the first one matching the address gives its methods. Pickup methods are offered everywhere.",
      children: [
        /* @__PURE__ */ e("div", { className: "cm:flex cm:justify-end", children: /* @__PURE__ */ e(u, { asChild: !0, children: /* @__PURE__ */ e(g, { href: C("commerce/settings/shipping/zones/create"), children: "Add zone" }) }) }),
        t.length === 0 && /* @__PURE__ */ e(he, { title: "No shipping zones yet", description: "Without a zone, checkout offers no shipping. Add one for your country or provinces." }),
        t.map((y, b) => /* @__PURE__ */ n(a, { children: [
          /* @__PURE__ */ n(m, { className: "cm:flex cm:flex-row cm:items-start cm:justify-between cm:gap-4", children: [
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ n(k, { className: "cm:flex cm:items-center cm:gap-2", children: [
                y.name,
                y.everywhere_else && /* @__PURE__ */ e(T, { tone: "info", children: "Everywhere else" })
              ] }),
              !y.everywhere_else && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: y.regions.length > 0 ? y.regions.join(", ") : "No regions" })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:flex cm:shrink-0 cm:gap-1", children: [
              /* @__PURE__ */ e(u, { variant: "ghost", size: "sm", "aria-label": "Move up", disabled: b === 0, onClick: () => r("zone", y.id, "up"), children: "↑" }),
              /* @__PURE__ */ e(u, { variant: "ghost", size: "sm", "aria-label": "Move down", disabled: b === t.length - 1, onClick: () => r("zone", y.id, "down"), children: "↓" }),
              /* @__PURE__ */ e(u, { variant: "outline", size: "sm", asChild: !0, children: /* @__PURE__ */ e(g, { href: C(y.edit_url), children: "Edit" }) })
            ] })
          ] }),
          /* @__PURE__ */ n(o, { className: "cm:grid cm:gap-3", children: [
            y.methods.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No methods in this zone." }),
            y.methods.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:divide-y cm:divide-border cm:rounded-md cm:border", children: y.methods.map((_, $) => /* @__PURE__ */ n("li", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:px-3 cm:py-2", children: [
              /* @__PURE__ */ n("div", { className: "cm:min-w-0", children: [
                /* @__PURE__ */ e(g, { href: C(_.edit_url), className: "cm:font-medium cm:hover:underline", children: _.title }),
                /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  _.type,
                  _.etd ? ` · ${_.etd}` : ""
                ] })
              ] }),
              /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:gap-1", children: [
                !_.active && /* @__PURE__ */ e(T, { children: "Inactive" }),
                /* @__PURE__ */ e(u, { variant: "ghost", size: "sm", "aria-label": "Move up", disabled: $ === 0, onClick: () => r("method", _.id, "up"), children: "↑" }),
                /* @__PURE__ */ e(u, { variant: "ghost", size: "sm", "aria-label": "Move down", disabled: $ === y.methods.length - 1, onClick: () => r("method", _.id, "down"), children: "↓" })
              ] })
            ] }, _.id)) }),
            /* @__PURE__ */ e("div", { children: /* @__PURE__ */ n(x, { value: "", onValueChange: (_) => R.router.visit(C(`commerce/settings/shipping/zones/${y.id}/methods/create?type=${_}`)), children: [
              /* @__PURE__ */ e(p, { className: "cm:w-48", "aria-label": `Add a method to ${y.name}`, children: /* @__PURE__ */ e(f, { placeholder: "Add method…" }) }),
              /* @__PURE__ */ e(v, { children: i.map((_) => /* @__PURE__ */ e(h, { value: _.key, children: _.label }, _.key)) })
            ] }) })
          ] })
        ] }, y.id)),
        /* @__PURE__ */ n(a, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "Courier presets" }) }),
          /* @__PURE__ */ n(o, { children: [
            /* @__PURE__ */ e("p", { className: "cm:mb-3 cm:text-sm cm:text-muted-foreground", children: "Offered when adding a shipment; the tracking link is filled in from the tracking number. Add more in config/commerce.php or with Commerce::registerCourier()." }),
            /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1 cm:text-sm cm:sm:grid-cols-2", children: s.map((y) => /* @__PURE__ */ n("li", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e("span", { className: "cm:font-medium", children: y.name }),
              !y.tracking_url && /* @__PURE__ */ e("span", { className: "cm:text-xs cm:text-muted-foreground", children: "(no tracking link)" })
            ] }, y.key)) })
          ] })
        ] })
      ]
    }
  );
}
function it({ title: c, description: t, form: i, breadcrumbs: s = [], deleteUrl: l, deleteConfirm: a }) {
  const { Button: o } = j;
  return M(), L.useBreadcrumbs([...s.map((m) => ({ ...m, href: m.href ? C(m.href) : void 0 })), { label: c }]), /* @__PURE__ */ n("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-3xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(K, { title: c, description: t }),
    /* @__PURE__ */ e(ye, { form: i, footer: l ? /* @__PURE__ */ e(
      o,
      {
        type: "button",
        variant: "ghost",
        className: "cm:ml-auto cm:text-destructive",
        onClick: () => window.confirm(a ?? "Delete this?") && R.router.delete(C(l)),
        children: "Delete"
      }
    ) : null })
  ] });
}
function lt(c) {
  const { DataTable: t } = ne, { Button: i } = j, { Link: s } = R;
  return M(), L.useBreadcrumbs([{ label: "Shop", href: C("commerce") }, { label: c.title }]), /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      K,
      {
        title: c.title,
        description: c.description,
        actions: c.createUrl ? /* @__PURE__ */ e(i, { asChild: !0, children: /* @__PURE__ */ e(s, { href: C(c.createUrl), children: c.createLabel ?? "New" }) }) : null
      }
    ),
    /* @__PURE__ */ e(
      t,
      {
        ...c,
        bulkUrl: c.bulkUrl ? C(c.bulkUrl) : void 0,
        rowHref: (l) => l.href ? C(l.href) : null,
        renderCell: (l, a) => a.type === "badge" && l[a.key] != null ? /* @__PURE__ */ e(T, { tone: l[`${a.key}_tone`] ?? "neutral", children: String(l[a.key]) }) : void 0
      }
    )
  ] });
}
const st = {
  "Commerce/Confirmations/Index": ze,
  "Commerce/Customers/Show": Me,
  "Commerce/Dashboard": Ue,
  "Commerce/Inventory/Index": Ke,
  "Commerce/Orders/Editor": Ve,
  "Commerce/Orders/Show": Ye,
  "Commerce/Products/Index": et,
  "Commerce/Settings/Section": at,
  "Commerce/Settings/Emails": tt,
  "Commerce/Settings/Features": nt,
  "Commerce/Settings/Payments": ct,
  "Commerce/Settings/Shipping": rt,
  "Commerce/Shared/SchemaForm": it,
  "Commerce/Shared/ResourceIndex": lt
};
function dt() {
  Object.entries(st).forEach(([c, t]) => L.registerPage(c, t));
}
function Ce(c) {
  if (!c) return "";
  const t = new Date(c);
  if (Number.isNaN(t.getTime())) return "";
  const i = (s) => String(s).padStart(2, "0");
  return `${t.getFullYear()}-${i(t.getMonth() + 1)}-${i(t.getDate())}T${i(t.getHours())}:${i(t.getMinutes())}`;
}
function we(c) {
  return c ? new Date(c).toISOString() : null;
}
function ot({ value: c, onChange: t, pathPrefix: i }) {
  const { Input: s, Label: l } = j, a = { start: c?.start ?? null, end: c?.end ?? null };
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(l, { htmlFor: `${i}-start`, children: "Starts" }),
      /* @__PURE__ */ e(
        s,
        {
          id: `${i}-start`,
          type: "datetime-local",
          value: Ce(a.start),
          onChange: (o) => t({ ...a, start: we(o.target.value) })
        }
      )
    ] }),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(l, { htmlFor: `${i}-end`, children: "Ends" }),
      /* @__PURE__ */ e(
        s,
        {
          id: `${i}-end`,
          type: "datetime-local",
          value: Ce(a.end),
          onChange: (o) => t({ ...a, end: we(o.target.value) })
        }
      )
    ] })
  ] });
}
function mt({ field: c, value: t, onChange: i, errors: s, pathPrefix: l }) {
  return M(), /* @__PURE__ */ e(
    te,
    {
      id: l,
      value: t,
      onChange: i,
      allowNull: c.config?.allow_null !== !1,
      invalid: !!(l && s?.[l])
    }
  );
}
function ut({ field: c, value: t, onChange: i, pathPrefix: s }) {
  const { Input: l, Badge: a } = j, o = c.config ?? {}, m = Array.isArray(t) ? t : [], [k, u] = F.useState(""), [x, v] = F.useState([]), [h, p] = F.useState(!1);
  F.useEffect(() => {
    if (!h) return;
    const r = new URLSearchParams({ q: k });
    (o.types ?? []).forEach((b) => r.append("types[]", b)), (o.taxonomies ?? []).forEach((b) => r.append("taxonomies[]", b));
    const y = setTimeout(() => G(`${o.api}?${r}`).then((b) => v(b.data)).catch(() => v([])), 200);
    return () => clearTimeout(y);
  }, [k, h]);
  const f = (r) => m.some((y) => y.type === r.type && y.id === r.id), g = { product: "Product", variant: "Variant", term: "Category/brand" };
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-2", children: [
    m.length > 0 && /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: m.map((r) => /* @__PURE__ */ n(a, { variant: "secondary", className: "cm:gap-1", children: [
      /* @__PURE__ */ n("span", { className: "cm:text-muted-foreground", children: [
        g[r.type],
        ":"
      ] }),
      " ",
      r.label,
      /* @__PURE__ */ e("button", { type: "button", "aria-label": `Remove ${r.label}`, onClick: () => i(m.filter((y) => !(y.type === r.type && y.id === r.id))), children: "×" })
    ] }, `${r.type}:${r.id}`)) }),
    /* @__PURE__ */ n("div", { className: "cm:relative", children: [
      /* @__PURE__ */ e(
        l,
        {
          id: s,
          value: k,
          placeholder: "Search products, SKUs, categories, brands…",
          onFocus: () => p(!0),
          onBlur: () => setTimeout(() => p(!1), 150),
          onChange: (r) => u(r.target.value)
        }
      ),
      h && x.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-20 cm:mt-1 cm:max-h-72 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: x.map((r) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: f(r),
          className: "cm:flex cm:w-full cm:justify-between cm:gap-3 cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted cm:disabled:opacity-50",
          onMouseDown: (y) => y.preventDefault(),
          onClick: () => {
            i([...m, { type: r.type, id: r.id, label: r.label }]), u("");
          },
          children: [
            /* @__PURE__ */ e("span", { children: r.label }),
            /* @__PURE__ */ e("span", { className: "cm:text-xs cm:text-muted-foreground", children: r.group })
          ]
        }
      ) }, `${r.type}:${r.id}`)) })
    ] })
  ] });
}
function V() {
  return (globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`).replace(/-/g, "").slice(0, 32);
}
function $e(c) {
  return Object.keys(c).sort().map((t) => `${t}=${c[t]}`).join("|");
}
function ht(c) {
  let t = [{}];
  for (const i of c) {
    if (i.values.length === 0) return [];
    const s = [];
    for (const l of t)
      for (const a of i.values)
        s.push({ ...l, [i.id]: a.id });
    t = s;
  }
  return c.length === 0 ? [] : t;
}
function pt(c, t, i, s = 100) {
  const l = new Map(t.map((a) => [$e(a.options), a]));
  return ht(c).slice(0, s).map((a) => {
    const o = l.get($e(a));
    return o ? { ...o, options: a } : { ...i, id: V(), sku: null, options: a, active: !0, price: i.price ?? 0 };
  });
}
function Re(c, t, i = {}) {
  return c.map((s) => {
    const l = s.values.find((a) => a.id === t.options[s.id]);
    return l ? l.label ?? (l.term_id ? i[l.term_id] ?? `#${l.term_id}` : "?") : "?";
  }).join(" / ");
}
function q({ label: c, hint: t, children: i, htmlFor: s, className: l }) {
  const { Label: a } = j;
  return /* @__PURE__ */ n("div", { className: ue("cm:grid cm:gap-1.5", l), children: [
    /* @__PURE__ */ e(a, { htmlFor: s, children: c }),
    i,
    t && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: t })
  ] });
}
function ie({ children: c, cols: t = 3 }) {
  return /* @__PURE__ */ e("div", { className: ue("cm:grid cm:gap-4", { 2: "cm:sm:grid-cols-2", 3: "cm:sm:grid-cols-2 cm:lg:grid-cols-3", 4: "cm:sm:grid-cols-2 cm:lg:grid-cols-4" }[t]), children: c });
}
function B({ id: c, value: t, onChange: i, min: s = 0, placeholder: l }) {
  const { Input: a } = j;
  return /* @__PURE__ */ e(
    a,
    {
      id: c,
      type: "number",
      inputMode: "numeric",
      min: s,
      value: t ?? "",
      placeholder: l,
      onChange: (o) => i(o.target.value === "" ? null : Math.round(Number(o.target.value)))
    }
  );
}
function le({ id: c, value: t, onChange: i, placeholder: s, onBlur: l }) {
  const { Input: a } = j;
  return /* @__PURE__ */ e(
    a,
    {
      id: c,
      value: t ?? "",
      placeholder: s,
      onBlur: l,
      onChange: (o) => i(o.target.value === "" ? null : o.target.value)
    }
  );
}
function Y({ id: c, value: t, onChange: i, nullable: s = !0 }) {
  return /* @__PURE__ */ e(te, { id: c, value: t, allowNull: s, onChange: i });
}
function ae({ id: c, label: t, checked: i, onChange: s, hint: l }) {
  const { Switch: a, Label: o } = j;
  return /* @__PURE__ */ n("div", { className: "cm:flex cm:items-start cm:gap-3", children: [
    /* @__PURE__ */ e(a, { id: c, checked: i, onCheckedChange: s }),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-0.5", children: [
      /* @__PURE__ */ e(o, { htmlFor: c, children: t }),
      l && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: l })
    ] })
  ] });
}
const gt = "cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm";
function z({ id: c, value: t, onChange: i, options: s }) {
  return /* @__PURE__ */ e("select", { id: c, className: gt, value: t, onChange: (l) => i(l.target.value), children: s.map(([l, a]) => /* @__PURE__ */ e("option", { value: l, children: a }, l)) });
}
function W({ title: c, description: t, children: i, actions: s }) {
  return /* @__PURE__ */ n("section", { className: "cm:grid cm:gap-4", children: [
    /* @__PURE__ */ n("div", { className: "cm:flex cm:items-start cm:justify-between cm:gap-3", children: [
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-0.5", children: [
        /* @__PURE__ */ e("h3", { className: "cm:text-sm cm:font-semibold", children: c }),
        t && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: t })
      ] }),
      s
    ] }),
    i
  ] });
}
function ft({ value: c, update: t, path: i }) {
  const { Button: s, Input: l } = j, a = c.bundle ?? { pricing: "fixed", value: 0, items: [] }, [o, m] = F.useState({}), [k, u] = F.useState(""), [x, v] = F.useState([]), h = a.items.map((g) => g.variant_id).filter((g) => !!g);
  F.useEffect(() => {
    const g = h.filter((r) => !o[r]);
    g.length !== 0 && G(C(`commerce/api/variants?${g.map((r) => `ids[]=${r}`).join("&")}`)).then((r) => m((y) => ({ ...y, ...Object.fromEntries(r.data.map((b) => [b.id, b])) }))).catch(() => {
    });
  }, [h.join(",")]), F.useEffect(() => {
    if (k.trim().length < 2) return v([]);
    const g = setTimeout(() => G(C(`commerce/api/variants?q=${encodeURIComponent(k)}`)).then((r) => v(r.data)).catch(() => {
    }), 250);
    return () => clearTimeout(g);
  }, [k]);
  const p = (g) => t({ bundle: { ...a, ...g } }), f = a.items.reduce((g, r) => g + (o[r.variant_id ?? 0]?.price ?? 0) * r.quantity, 0);
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ n(W, { title: "Products in the bundle", description: "Bundles take their stock from these products.", children: [
      a.items.map((g, r) => /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ e("span", { className: "cm:flex-1 cm:text-sm", children: o[g.variant_id ?? 0]?.label ?? `#${g.variant_id}` }),
        /* @__PURE__ */ e("div", { className: "cm:w-24", children: /* @__PURE__ */ e(B, { min: 1, value: g.quantity, onChange: (y) => p({ items: a.items.map((b, _) => _ === r ? { ...b, quantity: y ?? 1 } : b) }) }) }),
        /* @__PURE__ */ e(s, { type: "button", variant: "ghost", size: "sm", onClick: () => p({ items: a.items.filter((y, b) => b !== r) }), children: "Remove" })
      ] }, r)),
      /* @__PURE__ */ n("div", { className: "cm:relative", children: [
        /* @__PURE__ */ e(l, { value: k, placeholder: "Search products or SKUs to add…", "aria-label": "Add a product to the bundle", onChange: (g) => u(g.target.value) }),
        x.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-10 cm:mt-1 cm:max-h-64 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: x.map((g) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "cm:flex cm:w-full cm:justify-between cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted",
            onClick: () => {
              m((r) => ({ ...r, [g.id]: g })), p({ items: [...a.items, { variant_id: g.id, quantity: 1 }] }), u("");
            },
            children: [
              /* @__PURE__ */ n("span", { children: [
                g.label,
                g.sku && /* @__PURE__ */ n("span", { className: "cm:text-muted-foreground", children: [
                  " · ",
                  g.sku
                ] })
              ] }),
              /* @__PURE__ */ e("span", { children: re(g.price) })
            ]
          }
        ) }, g.id)) })
      ] })
    ] }),
    /* @__PURE__ */ e(W, { title: "Bundle price", description: `The products cost ${re(f)} together.`, children: /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(q, { label: "Price", htmlFor: `${i}-bundle-pricing`, children: /* @__PURE__ */ e(
        z,
        {
          id: `${i}-bundle-pricing`,
          value: a.pricing,
          onChange: (g) => p({ pricing: g, value: 0 }),
          options: [["fixed", "Its own price (General tab)"], ["percent_off", "Total minus a percentage"], ["amount_off", "Total minus an amount"]]
        }
      ) }),
      a.pricing === "percent_off" && /* @__PURE__ */ e(q, { label: "Percent off", htmlFor: `${i}-bundle-value`, children: /* @__PURE__ */ e(B, { id: `${i}-bundle-value`, value: a.value / 100, onChange: (g) => p({ value: Math.round((g ?? 0) * 100) }) }) }),
      a.pricing === "amount_off" && /* @__PURE__ */ e(q, { label: "Amount off", htmlFor: `${i}-bundle-value`, children: /* @__PURE__ */ e(Y, { id: `${i}-bundle-value`, value: a.value, nullable: !1, onChange: (g) => p({ value: g ?? 0 }) }) })
    ] }) })
  ] });
}
function vt() {
  return decodeURIComponent(document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/)?.[1] ?? "");
}
function bt({ value: c, update: t, path: i }) {
  const { Button: s } = j, [l, a] = F.useState(!1), o = F.useRef(null), m = c.delivery ?? { modes: ["link", "account"], download_limit: null, expiry_days: null }, k = (v) => t({ delivery: { ...m, ...v } }), u = (v, h) => t({ downloads: c.downloads.map((p, f) => f === v ? { ...p, ...h } : p) }), x = async (v) => {
    if (v?.length) {
      a(!0);
      try {
        const h = [];
        for (const p of Array.from(v)) {
          const f = new FormData();
          f.append("file", p);
          const g = await fetch(C("commerce/api/downloads"), { method: "POST", body: f, headers: { "X-XSRF-TOKEN": vt(), Accept: "application/json" }, credentials: "same-origin" }), r = await g.json();
          if (!g.ok) throw new Error(r.message ?? "Upload failed");
          h.push({ id: V(), type: "file", file_id: r.data.id, url: null, name: p.name.replace(/\.[^.]+$/, ""), file: r.data });
        }
        t({ downloads: [...c.downloads, ...h] });
      } catch (h) {
        Ae.error(h instanceof Error ? h.message : "Upload failed");
      } finally {
        a(!1), o.current && (o.current.value = "");
      }
    }
  };
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ n(
      W,
      {
        title: "Files and links",
        description: "Files are stored privately and only served to customers who bought them.",
        actions: /* @__PURE__ */ n("div", { className: "cm:flex cm:gap-2", children: [
          /* @__PURE__ */ e(s, { type: "button", variant: "outline", size: "sm", disabled: l, onClick: () => o.current?.click(), children: l ? "Uploading…" : "Upload file" }),
          /* @__PURE__ */ e(s, { type: "button", variant: "outline", size: "sm", onClick: () => t({ downloads: [...c.downloads, { id: V(), type: "url", file_id: null, url: null, name: "" }] }), children: "Add link" }),
          /* @__PURE__ */ e("input", { ref: o, type: "file", multiple: !0, hidden: !0, onChange: (v) => x(v.target.files) })
        ] }),
        children: [
          c.downloads.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No files yet." }),
          c.downloads.map((v, h) => /* @__PURE__ */ n("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(q, { label: "Name", htmlFor: `${i}-dl-${h}`, children: /* @__PURE__ */ e(le, { id: `${i}-dl-${h}`, value: v.name, onChange: (p) => u(h, { name: p ?? "" }) }) }),
            v.type === "url" ? /* @__PURE__ */ e(q, { label: "Link", htmlFor: `${i}-dl-${h}-url`, children: /* @__PURE__ */ e(le, { id: `${i}-dl-${h}-url`, value: v.url, placeholder: "https://", onChange: (p) => u(h, { url: p }) }) }) : /* @__PURE__ */ e(q, { label: "File", children: /* @__PURE__ */ e("p", { className: "cm:truncate cm:text-sm cm:text-muted-foreground", children: v.file?.filename ?? `File #${v.file_id}` }) }),
            /* @__PURE__ */ e(s, { type: "button", variant: "ghost", size: "sm", onClick: () => t({ downloads: c.downloads.filter((p, f) => f !== h) }), children: "Remove" })
          ] }, v.id ?? h))
        ]
      }
    ),
    /* @__PURE__ */ n(W, { title: "Delivery", children: [
      /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-3", children: [["attachment", "Attach files to the email"], ["link", "Download links in the email"], ["account", "Library in My Account"]].map(([v, h]) => /* @__PURE__ */ e(
        ae,
        {
          id: `${i}-mode-${v}`,
          label: h,
          checked: m.modes.includes(v),
          onChange: (p) => k({ modes: p ? [...m.modes, v] : m.modes.filter((f) => f !== v) })
        },
        v
      )) }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
        /* @__PURE__ */ e(q, { label: "Downloads per file", htmlFor: `${i}-limit`, hint: "Empty: unlimited.", children: /* @__PURE__ */ e(B, { id: `${i}-limit`, min: 1, value: m.download_limit, onChange: (v) => k({ download_limit: v }) }) }),
        /* @__PURE__ */ e(q, { label: "Links expire after (days)", htmlFor: `${i}-expiry`, hint: "Empty: never.", children: /* @__PURE__ */ e(B, { id: `${i}-expiry`, min: 1, value: m.expiry_days, onChange: (v) => k({ expiry_days: v }) }) })
      ] })
    ] })
  ] });
}
function Pe({ id: c, value: t, onChange: i, entryId: s }) {
  const [l, a] = F.useState(null);
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
    /* @__PURE__ */ e(le, { id: c, value: t, onChange: (m) => {
      a(null), i(m);
    }, onBlur: () => {
      if (!t) return a(null);
      const m = new URLSearchParams({ sku: t, entry: String(s ?? 0) });
      G(C(`commerce/api/sku-check?${m}`)).then((k) => a(k.available ? null : k.product ?? "another product")).catch(() => a(null));
    } }),
    l && /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-destructive", children: [
      "Already used by ",
      l,
      "."
    ] })
  ] });
}
const yt = [
  ["default", "Follow the store (selling mode)"],
  ["cart", "Add to cart"],
  ["inquiry", "Inquiry form"],
  ["whatsapp", "Ask on WhatsApp"],
  ["external", "Links to other shops"],
  ["none", "No button (display only)"]
];
function xt({ value: c, update: t, updateVariant: i, config: s, entryId: l, path: a }) {
  const { Button: o } = j, m = [["simple", "Simple product"]];
  (s.features.variants || c.type === "variable") && m.push(["variable", "Variable product (sizes, colors…)"]), (s.features.bundles || c.type === "bundle") && m.push(["bundle", "Bundle of other products"]);
  const k = c.variants[0];
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ n(ie, { cols: 2, children: [
      /* @__PURE__ */ e(q, { label: "Product type", htmlFor: `${a}-type`, children: /* @__PURE__ */ e(z, { id: `${a}-type`, value: c.type, options: m, onChange: (u) => t({ type: u }) }) }),
      /* @__PURE__ */ e(q, { label: "Button on the product page", htmlFor: `${a}-mode`, hint: "'Follow the store' uses the selling mode set in Settings → Store.", children: /* @__PURE__ */ e(z, { id: `${a}-mode`, value: c.purchase_mode, options: yt, onChange: (u) => t({ purchase_mode: u }) }) })
    ] }),
    c.type !== "variable" && k && /* @__PURE__ */ e(W, { title: "Price", children: /* @__PURE__ */ n(ie, { cols: 4, children: [
      /* @__PURE__ */ e(q, { label: "Price", htmlFor: `${a}-price`, children: /* @__PURE__ */ e(Y, { id: `${a}-price`, value: k.price, nullable: !1, onChange: (u) => i(0, { price: u ?? 0 }) }) }),
      /* @__PURE__ */ e(q, { label: "Compare-at price", htmlFor: `${a}-compare`, hint: "Shown struck through when higher.", children: /* @__PURE__ */ e(Y, { id: `${a}-compare`, value: k.compare_at_price, onChange: (u) => i(0, { compare_at_price: u }) }) }),
      /* @__PURE__ */ e(q, { label: "Cost", htmlFor: `${a}-cost`, hint: "For profit reports; never shown.", children: /* @__PURE__ */ e(Y, { id: `${a}-cost`, value: k.cost, onChange: (u) => i(0, { cost: u }) }) }),
      /* @__PURE__ */ e(q, { label: "SKU", htmlFor: `${a}-sku`, children: /* @__PURE__ */ e(Pe, { id: `${a}-sku`, value: k.sku, entryId: l, onChange: (u) => i(0, { sku: u }) }) })
    ] }) }),
    (c.purchase_mode === "external" || c.external_links.length > 0) && /* @__PURE__ */ e(
      W,
      {
        title: "Links to other shops",
        description: "Buttons such as 'Buy on Tokopedia'.",
        actions: c.external_links.length < 10 && /* @__PURE__ */ e(o, { type: "button", variant: "outline", size: "sm", onClick: () => t({ external_links: [...c.external_links, { preset: "tokopedia", label: null, url: null }] }), children: "Add link" }),
        children: c.external_links.map((u, x) => {
          const v = (h) => t({ external_links: c.external_links.map((p, f) => f === x ? { ...p, ...h } : p) });
          return /* @__PURE__ */ n("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[10rem_1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(q, { label: "Shop", htmlFor: `${a}-link-${x}-preset`, children: /* @__PURE__ */ e(
              z,
              {
                id: `${a}-link-${x}-preset`,
                value: u.preset ?? "",
                onChange: (h) => v({ preset: h || null }),
                options: [...Object.entries(s.link_presets), ["", "Other…"]]
              }
            ) }),
            /* @__PURE__ */ e(q, { label: "Button label", htmlFor: `${a}-link-${x}-label`, children: /* @__PURE__ */ e(le, { id: `${a}-link-${x}-label`, value: u.label, placeholder: u.preset ? `Buy on ${s.link_presets[u.preset]}` : "", onChange: (h) => v({ label: h }) }) }),
            /* @__PURE__ */ e(q, { label: "Link", htmlFor: `${a}-link-${x}-url`, children: /* @__PURE__ */ e(le, { id: `${a}-link-${x}-url`, value: u.url, placeholder: "https://", onChange: (h) => v({ url: h }) }) }),
            /* @__PURE__ */ e(o, { type: "button", variant: "ghost", size: "sm", onClick: () => t({ external_links: c.external_links.filter((h, p) => p !== x) }), children: "Remove" })
          ] }, x);
        })
      }
    ),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(ae, { id: `${a}-shipping`, label: "Needs shipping", checked: c.requires_shipping, onChange: (u) => t({ requires_shipping: u }), hint: "Off for services and digital products." }),
      (s.features.digital || c.downloadable) && /* @__PURE__ */ e(ae, { id: `${a}-downloadable`, label: "Downloadable", checked: c.downloadable, onChange: (u) => t({ downloadable: u }), hint: "Customers get files or links after paying." }),
      /* @__PURE__ */ e(ae, { id: `${a}-featured`, label: "Featured", checked: c.featured, onChange: (u) => t({ featured: u }), hint: "Shown first when sorting by featured." })
    ] }),
    s.features.taxes && /* @__PURE__ */ e(q, { label: "Tax class", htmlFor: `${a}-tax`, children: /* @__PURE__ */ e(
      z,
      {
        id: `${a}-tax`,
        value: c.tax_class ?? "",
        onChange: (u) => t({ tax_class: u || null }),
        options: [["", "Standard"], ...s.tax_classes.filter((u) => u !== "standard").map((u) => [u, u])]
      }
    ) })
  ] });
}
function kt({ value: c, updateVariant: t, live: i, path: s }) {
  const l = c.variants[0];
  if (!l) return null;
  const a = i?.variants[l.id];
  return /* @__PURE__ */ n(W, { title: "Stock", children: [
    /* @__PURE__ */ e(
      ae,
      {
        id: `${s}-track`,
        label: "Track stock",
        checked: l.track_stock,
        onChange: (o) => t(0, { track_stock: o }),
        hint: "Count units: orders take them, cancellations give them back."
      }
    ),
    l.track_stock ? /* @__PURE__ */ n(ie, { cols: 3, children: [
      a?.track_stock && a.stock_quantity !== null ? /* @__PURE__ */ e(q, { label: "In stock", hint: "Change it in Shop → Inventory, so every change is recorded.", children: /* @__PURE__ */ e("p", { className: "cm:text-2xl cm:font-semibold", children: a.stock_quantity }) }) : /* @__PURE__ */ e(q, { label: "Starting stock", htmlFor: `${s}-initial`, hint: "Set once, when the product is published.", children: /* @__PURE__ */ e(B, { id: `${s}-initial`, value: l.initial_stock, onChange: (o) => t(0, { initial_stock: o }) }) }),
      /* @__PURE__ */ e(q, { label: "When sold out", htmlFor: `${s}-backorders`, children: /* @__PURE__ */ e(
        z,
        {
          id: `${s}-backorders`,
          value: l.backorders,
          onChange: (o) => t(0, { backorders: o }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }),
      /* @__PURE__ */ e(q, { label: "Low stock at", htmlFor: `${s}-low`, hint: "Empty: the store's setting.", children: /* @__PURE__ */ e(B, { id: `${s}-low`, value: l.low_stock_threshold, onChange: (o) => t(0, { low_stock_threshold: o }) }) })
    ] }) : /* @__PURE__ */ e(q, { label: "Stock status", htmlFor: `${s}-status`, children: /* @__PURE__ */ e(
      z,
      {
        id: `${s}-status`,
        value: l.stock_status,
        onChange: (o) => t(0, { stock_status: o }),
        options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
      }
    ) })
  ] });
}
function Nt({ value: c, update: t, path: i }) {
  const { Button: s } = j, l = (a, o) => t({ tiers: c.tiers.map((m, k) => k === a ? { ...m, ...o } : m) });
  return /* @__PURE__ */ n(
    W,
    {
      title: "Bulk prices",
      description: "Lower unit prices for larger quantities. The best matching tier applies.",
      actions: c.tiers.length < 20 && /* @__PURE__ */ e(
        s,
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
        c.tiers.map((a, o) => /* @__PURE__ */ n("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[8rem_12rem_1fr_1fr_auto]", children: [
          /* @__PURE__ */ e(q, { label: "From (units)", htmlFor: `${i}-tier-${o}-min`, children: /* @__PURE__ */ e(B, { id: `${i}-tier-${o}-min`, min: 2, value: a.min_qty, onChange: (m) => l(o, { min_qty: m ?? 2 }) }) }),
          /* @__PURE__ */ e(q, { label: "Price", htmlFor: `${i}-tier-${o}-type`, children: /* @__PURE__ */ e(
            z,
            {
              id: `${i}-tier-${o}-type`,
              value: a.type,
              onChange: (m) => l(o, { type: m, value: 0 }),
              options: [["percent_off", "Percent off"], ["amount_off", "Amount off per unit"], ["fixed_price", "Fixed unit price"]]
            }
          ) }),
          /* @__PURE__ */ e(q, { label: a.type === "percent_off" ? "Percent" : "Amount", htmlFor: `${i}-tier-${o}-value`, children: a.type === "percent_off" ? /* @__PURE__ */ e(B, { id: `${i}-tier-${o}-value`, value: a.value / 100, onChange: (m) => l(o, { value: Math.round((m ?? 0) * 100) }) }) : /* @__PURE__ */ e(Y, { id: `${i}-tier-${o}-value`, value: a.value, nullable: !1, onChange: (m) => l(o, { value: m ?? 0 }) }) }),
          /* @__PURE__ */ e(q, { label: "For", htmlFor: `${i}-tier-${o}-variant`, children: /* @__PURE__ */ e(
            z,
            {
              id: `${i}-tier-${o}-variant`,
              value: a.variant ?? "",
              onChange: (m) => l(o, { variant: m || null }),
              options: [["", "All variants"], ...c.type === "variable" ? c.variants.map((m) => [m.id, Re(c.options, m)]) : []]
            }
          ) }),
          /* @__PURE__ */ e(s, { type: "button", variant: "ghost", size: "sm", onClick: () => t({ tiers: c.tiers.filter((m, k) => k !== o) }), children: "Remove" })
        ] }, o))
      ]
    }
  );
}
function _t({ value: c, update: t, updateVariant: i, path: s }) {
  const l = c.variants[0];
  if (!l) return null;
  const a = (o) => c.type === "variable" ? t({ variants: c.variants.map((m) => ({ ...m, ...o })) }) : i(0, o);
  return /* @__PURE__ */ e(W, { title: "Package", description: c.type === "variable" ? "Applies to every variant; a variant can have its own weight under More." : "Used for shipping rates.", children: /* @__PURE__ */ n(ie, { cols: 4, children: [
    /* @__PURE__ */ e(q, { label: "Weight (grams)", htmlFor: `${s}-weight`, children: /* @__PURE__ */ e(B, { id: `${s}-weight`, value: l.weight, onChange: (o) => a({ weight: o }) }) }),
    /* @__PURE__ */ e(q, { label: "Length (mm)", htmlFor: `${s}-length`, children: /* @__PURE__ */ e(B, { id: `${s}-length`, value: l.length, onChange: (o) => a({ length: o }) }) }),
    /* @__PURE__ */ e(q, { label: "Width (mm)", htmlFor: `${s}-width`, children: /* @__PURE__ */ e(B, { id: `${s}-width`, value: l.width, onChange: (o) => a({ width: o }) }) }),
    /* @__PURE__ */ e(q, { label: "Height (mm)", htmlFor: `${s}-height`, children: /* @__PURE__ */ e(B, { id: `${s}-height`, value: l.height, onChange: (o) => a({ height: o }) }) })
  ] }) });
}
const ve = {
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
function Ct(c) {
  const [t, i] = F.useState({}), s = c.filter((l) => !(l in t));
  return F.useEffect(() => {
    if (s.length === 0) return;
    const l = s.map((a) => `ids[]=${a}`).join("&");
    G(C(`api/terms?${l}`)).then((a) => i((o) => ({ ...o, ...Object.fromEntries(a.data.map((m) => [m.id, m.title])) }))).catch(() => {
    });
  }, [s.join(",")]), t;
}
function wt({ option: c, onChange: t, onRemove: i, config: s, path: l }) {
  const { Button: a, Input: o, Badge: m } = j, { FieldRenderer: k } = ne, [u, x] = F.useState(""), v = () => {
    const p = u.split(",").map((f) => f.trim()).filter(Boolean).filter((f) => !c.values.some((g) => (g.label ?? "").toLowerCase() === f.toLowerCase()));
    p.length && t({ ...c, values: [...c.values, ...p.map((f) => ({ id: V(), label: f }))] }), x("");
  }, h = c.values.map((p) => p.term_id).filter((p) => !!p);
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-3 cm:rounded-md cm:border cm:p-3", children: [
    /* @__PURE__ */ n("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_1fr_auto]", children: [
      /* @__PURE__ */ e(q, { label: "Option name", htmlFor: `${l}-name`, children: /* @__PURE__ */ e(o, { id: `${l}-name`, value: c.name, placeholder: "Size", onChange: (p) => t({ ...c, name: p.target.value }) }) }),
      s.attribute_taxonomies.length > 0 ? /* @__PURE__ */ e(q, { label: "Values from", htmlFor: `${l}-source`, children: /* @__PURE__ */ e(
        z,
        {
          id: `${l}-source`,
          value: c.taxonomy ?? "",
          onChange: (p) => t({ ...c, taxonomy: p || null, values: [] }),
          options: [["", "Custom values"], ...s.attribute_taxonomies.map((p) => [p.handle, p.title])]
        }
      ) }) : /* @__PURE__ */ e("div", {}),
      /* @__PURE__ */ e(a, { type: "button", variant: "ghost", size: "sm", onClick: i, children: "Remove option" })
    ] }),
    c.taxonomy ? /* @__PURE__ */ e(
      k,
      {
        fields: [{ handle: "terms", type: "terms", label: "Values", config: { taxonomy: c.taxonomy } }],
        values: { terms: h },
        pathPrefix: `${l}-terms`,
        onChange: (p) => {
          const f = p.terms ?? [], g = c.values.filter((y) => y.term_id && f.includes(y.term_id)), r = f.filter((y) => !g.some((b) => b.term_id === y)).map((y) => ({ id: V(), term_id: y }));
          t({ ...c, values: [...g, ...r] });
        }
      }
    ) : /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-2", children: [
      /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: c.values.map((p) => /* @__PURE__ */ n(m, { variant: "secondary", className: "cm:gap-1", children: [
        p.label,
        /* @__PURE__ */ e("button", { type: "button", "aria-label": `Remove ${p.label}`, onClick: () => t({ ...c, values: c.values.filter((f) => f.id !== p.id) }), children: "×" })
      ] }, p.id)) }),
      /* @__PURE__ */ n("div", { className: "cm:flex cm:gap-2", children: [
        /* @__PURE__ */ e(
          o,
          {
            value: u,
            placeholder: "S, M, L",
            "aria-label": `Add values to ${c.name || "option"}`,
            onChange: (p) => x(p.target.value),
            onKeyDown: (p) => {
              p.key === "Enter" && (p.preventDefault(), v());
            }
          }
        ),
        /* @__PURE__ */ e(a, { type: "button", variant: "outline", onClick: v, children: "Add" })
      ] })
    ] })
  ] });
}
function $t({ variant: c, index: t, updateVariant: i, tab: s }) {
  const { FieldRenderer: l } = ne, a = `${s.path}-v${t}`, o = s.live?.variants[c.id];
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-4 cm:bg-muted/40 cm:p-4", children: [
    /* @__PURE__ */ n(ie, { cols: 4, children: [
      /* @__PURE__ */ e(q, { label: "Cost", htmlFor: `${a}-cost`, children: /* @__PURE__ */ e(Y, { id: `${a}-cost`, value: c.cost, onChange: (m) => i(t, { cost: m }) }) }),
      /* @__PURE__ */ e(q, { label: "Barcode", htmlFor: `${a}-barcode`, children: /* @__PURE__ */ e(le, { id: `${a}-barcode`, value: c.barcode, onChange: (m) => i(t, { barcode: m }) }) }),
      /* @__PURE__ */ e(q, { label: "Weight (g)", htmlFor: `${a}-weight`, children: /* @__PURE__ */ e(B, { id: `${a}-weight`, value: c.weight, onChange: (m) => i(t, { weight: m }), placeholder: "Product's" }) }),
      /* @__PURE__ */ e(q, { label: "Min / max / step", htmlFor: `${a}-min`, children: /* @__PURE__ */ n("div", { className: "cm:grid cm:grid-cols-3 cm:gap-1", children: [
        /* @__PURE__ */ e(B, { id: `${a}-min`, min: 1, value: c.min_qty, onChange: (m) => i(t, { min_qty: m ?? 1 }) }),
        /* @__PURE__ */ e(B, { min: 1, value: c.max_qty, onChange: (m) => i(t, { max_qty: m }), placeholder: "–" }),
        /* @__PURE__ */ e(B, { min: 1, value: c.qty_step, onChange: (m) => i(t, { qty_step: m ?? 1 }) })
      ] }) })
    ] }),
    s.config.features.inventory && /* @__PURE__ */ n(ie, { cols: 4, children: [
      /* @__PURE__ */ e(ae, { id: `${a}-track`, label: "Track stock", checked: c.track_stock, onChange: (m) => i(t, { track_stock: m }) }),
      c.track_stock && (o?.track_stock && o.stock_quantity !== null ? /* @__PURE__ */ e(q, { label: "In stock", children: /* @__PURE__ */ n("p", { className: "cm:text-sm", children: [
        o.stock_quantity,
        " ",
        /* @__PURE__ */ e("span", { className: "cm:text-muted-foreground", children: "(change it in Shop → Inventory)" })
      ] }) }) : /* @__PURE__ */ e(q, { label: "Starting stock", htmlFor: `${a}-initial`, children: /* @__PURE__ */ e(B, { id: `${a}-initial`, value: c.initial_stock, onChange: (m) => i(t, { initial_stock: m }) }) })),
      c.track_stock ? /* @__PURE__ */ e(q, { label: "When sold out", htmlFor: `${a}-backorders`, children: /* @__PURE__ */ e(
        z,
        {
          id: `${a}-backorders`,
          value: c.backorders,
          onChange: (m) => i(t, { backorders: m }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }) : /* @__PURE__ */ e(q, { label: "Stock status", htmlFor: `${a}-status`, children: /* @__PURE__ */ e(
        z,
        {
          id: `${a}-status`,
          value: c.stock_status,
          onChange: (m) => i(t, { stock_status: m }),
          options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
        }
      ) })
    ] }),
    /* @__PURE__ */ e(
      l,
      {
        fields: [{ handle: "image", type: "asset", label: "Image", config: { image_only: !0 } }],
        values: { image: c.image },
        pathPrefix: `${a}-image`,
        onChange: (m) => i(t, { image: m.image ?? null })
      }
    )
  ] });
}
function St(c) {
  const { value: t, update: i, updateVariant: s, config: l, entryId: a, live: o } = c, { Button: m, Table: k, TableBody: u, TableCell: x, TableHead: v, TableHeader: h, TableRow: p, Switch: f } = j, [g, r] = F.useState(null), y = Ct(t.options.flatMap(($) => $.values.map((w) => w.term_id).filter((w) => !!w))), b = t.variants[0] ?? { ...ve, id: V() }, _ = ($ = t.options) => i({ options: $, variants: pt($, t.variants, { ...b, initial_stock: null, image: null }, l.max_variants) });
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ e(
      W,
      {
        title: "Options",
        description: `Up to ${l.max_options} options, such as size and color. Variants are made for every combination.`,
        actions: t.options.length < l.max_options && /* @__PURE__ */ e(m, { type: "button", variant: "outline", size: "sm", onClick: () => i({ options: [...t.options, { id: V(), name: "", taxonomy: null, values: [] }] }), children: "Add option" }),
        children: t.options.map(($, w) => /* @__PURE__ */ e(
          wt,
          {
            option: $,
            config: l,
            path: `${c.path}-o${w}`,
            onChange: (D) => _(t.options.map((S, U) => U === w ? D : S)),
            onRemove: () => _(t.options.filter((D, S) => S !== w))
          },
          $.id
        ))
      }
    ),
    /* @__PURE__ */ n(
      W,
      {
        title: `Variants (${t.variants.length})`,
        description: "Each has its own SKU, price and stock. Switch one off to stop selling it without losing it.",
        actions: /* @__PURE__ */ e(m, { type: "button", variant: "outline", size: "sm", onClick: () => _(), children: "Regenerate" }),
        children: [
          t.options.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "Add an option with values to create variants." }) : /* @__PURE__ */ e("div", { className: "cm:overflow-x-auto cm:rounded-md cm:border", children: /* @__PURE__ */ n(k, { children: [
            /* @__PURE__ */ e(h, { children: /* @__PURE__ */ n(p, { children: [
              /* @__PURE__ */ e(v, { children: "Variant" }),
              /* @__PURE__ */ e(v, { children: "SKU" }),
              /* @__PURE__ */ e(v, { children: "Price" }),
              /* @__PURE__ */ e(v, { children: "Compare-at" }),
              l.features.inventory && /* @__PURE__ */ e(v, { children: "Stock" }),
              /* @__PURE__ */ e(v, { children: "On sale" }),
              /* @__PURE__ */ e(v, {})
            ] }) }),
            /* @__PURE__ */ e(u, { children: t.variants.map(($, w) => {
              const D = o?.variants[$.id];
              return /* @__PURE__ */ n(F.Fragment, { children: [
                /* @__PURE__ */ n(p, { className: $.active ? "" : "cm:opacity-60", children: [
                  /* @__PURE__ */ e(x, { className: "cm:font-medium cm:whitespace-nowrap", children: Re(t.options, $, y) }),
                  /* @__PURE__ */ e(x, { className: "cm:min-w-36", children: /* @__PURE__ */ e(Pe, { value: $.sku, entryId: a, onChange: (S) => s(w, { sku: S }) }) }),
                  /* @__PURE__ */ e(x, { className: "cm:min-w-32", children: /* @__PURE__ */ e(Y, { value: $.price, nullable: !1, onChange: (S) => s(w, { price: S ?? 0 }) }) }),
                  /* @__PURE__ */ e(x, { className: "cm:min-w-32", children: /* @__PURE__ */ e(Y, { value: $.compare_at_price, onChange: (S) => s(w, { compare_at_price: S }) }) }),
                  l.features.inventory && /* @__PURE__ */ e(x, { className: "cm:whitespace-nowrap cm:text-sm", children: $.track_stock ? D?.stock_quantity ?? $.initial_stock ?? 0 : /* @__PURE__ */ e(T, { children: $.stock_status.replace("_", " ") }) }),
                  /* @__PURE__ */ e(x, { children: /* @__PURE__ */ e(f, { checked: $.active, "aria-label": "Sell this variant", onCheckedChange: (S) => s(w, { active: S }) }) }),
                  /* @__PURE__ */ e(x, { children: /* @__PURE__ */ e(m, { type: "button", variant: "ghost", size: "sm", "aria-expanded": g === $.id, onClick: () => r(g === $.id ? null : $.id), children: g === $.id ? "Close" : "More" }) })
                ] }),
                g === $.id && /* @__PURE__ */ e(p, { children: /* @__PURE__ */ e(x, { colSpan: 7, className: "cm:p-0", children: /* @__PURE__ */ e($t, { variant: $, index: w, updateVariant: s, tab: c }) }) })
              ] }, $.id);
            }) })
          ] }) }),
          t.variants.length > 0 && /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
            "Prices from ",
            re(Math.min(...t.variants.map(($) => $.price))),
            " to ",
            re(Math.max(...t.variants.map(($) => $.price))),
            "."
          ] })
        ]
      }
    )
  ] });
}
function Dt(c) {
  const t = c ?? {}, i = (t.variants?.length ? t.variants : [{ ...ve, id: V() }]).map((s) => ({ ...ve, ...s, id: s.id ?? V() }));
  return {
    type: t.type ?? "simple",
    purchase_mode: t.purchase_mode ?? "default",
    external_links: t.external_links ?? [],
    requires_shipping: t.requires_shipping ?? !0,
    downloadable: t.downloadable ?? !1,
    featured: t.featured ?? !1,
    tax_class: t.tax_class ?? null,
    options: t.options ?? [],
    variants: i,
    bundle: t.bundle ?? null,
    downloads: t.downloads ?? [],
    delivery: t.delivery ?? null,
    tiers: t.tiers ?? []
  };
}
function Ft({ field: c, value: t, onChange: i, errors: s, pathPrefix: l = "data.product" }) {
  M();
  const a = c.config ?? {}, o = Dt(t), { props: m } = R.usePage(), k = m.entry?.id ?? null, [u, x] = F.useState(null);
  F.useEffect(() => {
    k && G(C(`commerce/api/products/${k}`)).then((_) => x(_.data)).catch(() => {
    });
  }, [k, m.entry]);
  const v = (_) => {
    const $ = { ...o, ..._ };
    _.type && _.type !== "variable" && ($.options = [], $.variants = [{ ...$.variants[0], options: {} }]), _.type === "bundle" && !$.bundle && ($.bundle = { pricing: "fixed", value: 0, items: [] }), i($);
  }, h = (_, $) => v({ variants: o.variants.map((w, D) => D === _ ? { ...w, ...$ } : w) }), p = [{ key: "general", label: "General", render: (_) => /* @__PURE__ */ e(xt, { ..._ }) }];
  o.type === "variable" && p.push({ key: "variants", label: "Variants", render: (_) => /* @__PURE__ */ e(St, { ..._ }) }), o.type === "bundle" && p.push({ key: "bundle", label: "Bundle", render: (_) => /* @__PURE__ */ e(ft, { ..._ }) }), o.type !== "variable" && (a.features?.inventory ?? !0) && p.push({ key: "inventory", label: "Inventory", render: (_) => /* @__PURE__ */ e(kt, { ..._ }) }), o.requires_shipping && p.push({ key: "shipping", label: "Shipping", render: (_) => /* @__PURE__ */ e(_t, { ..._ }) }), (a.features?.pricing_rules !== !1 || o.tiers.length > 0) && p.push({ key: "pricing", label: "Bulk prices", render: (_) => /* @__PURE__ */ e(Nt, { ..._ }) }), o.downloadable && p.push({ key: "digital", label: "Digital", render: (_) => /* @__PURE__ */ e(bt, { ..._ }) });
  for (const [_, $] of Object.entries(ee.productTabs()))
    p.push({ key: `ext-${_}`, label: $.label ?? _, render: (w) => /* @__PURE__ */ e($, { ...w }) });
  const [f, g] = F.useState("general"), r = p.find((_) => _.key === f) ?? p[0], y = s?.[l], b = { value: o, update: v, updateVariant: h, config: a, live: u, entryId: k, path: l.replace(/\W+/g, "-") };
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-4 cm:rounded-lg cm:border cm:p-4", children: [
    u?.sync_status === "failed" && /* @__PURE__ */ n("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: [
      "The published version couldn't be applied to the store, so it can't be bought: ",
      u.sync_error,
      ". Fix it and publish again."
    ] }),
    y && /* @__PURE__ */ e("p", { role: "alert", className: "cm:text-sm cm:text-destructive", children: y }),
    /* @__PURE__ */ e("div", { role: "tablist", "aria-label": "Product data", className: "cm:flex cm:flex-wrap cm:gap-1 cm:border-b", children: p.map((_) => /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": _.key === r.key,
        onClick: () => g(_.key),
        className: ue("cm:-mb-px cm:border-b-2 cm:px-3 cm:py-2 cm:text-sm", _.key === r.key ? "cm:border-primary cm:font-medium" : "cm:border-transparent cm:text-muted-foreground cm:hover:text-foreground"),
        children: _.label
      },
      _.key
    )) }),
    /* @__PURE__ */ e("div", { role: "tabpanel", children: r.render(b) })
  ] });
}
const qt = {
  commerce_money: mt,
  commerce_datetime_range: ot,
  commerce_region: Te,
  commerce_targets: ut,
  commerce_product: Ft
};
function Tt() {
  Object.entries(qt).forEach(([c, t]) => L.registerField(c, t));
}
function jt() {
  Object.assign(ee.components, { EmptyState: he, MoneyInput: te, PageHeader: K, SchemaFormView: ye, SectionNav: je, SettingsLayout: se, StatusBadge: T });
}
Oe();
jt();
Tt();
dt();
