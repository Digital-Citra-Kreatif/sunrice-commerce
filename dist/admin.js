const Se = { symbol: "Rp", position: "left", space: !1, thousands: ".", decimal: ",", decimals: 0 };
let be = Se;
function Ee(c) {
  be = { ...Se, ...c ?? {} };
}
function re(c, t = be) {
  const i = c < 0, s = Math.abs(Math.round(c)), l = 10 ** t.decimals, r = Math.floor(s / l).toString().replace(/\B(?=(\d{3})+(?!\d))/g, t.thousands), d = t.decimals > 0 ? t.decimal + String(s % l).padStart(t.decimals, "0") : "", m = r + d, k = t.space ? " " : "", u = t.position === "left" ? `${t.symbol}${k}${m}` : `${m}${k}${t.symbol}`;
  return i ? `-${u}` : u;
}
function De(c, t = be) {
  let i = c.replace(t.symbol, "").replace(/\s/g, "");
  const s = i.startsWith("-");
  i = i.replace(/^-/, "").split(t.thousands).join("");
  const [l, r = ""] = i.split(t.decimal);
  if (!/^\d*$/.test(l) || !/^\d*$/.test(r) || l + r === "")
    return null;
  const d = Number(l || "0") * 10 ** t.decimals + Number(r.padEnd(t.decimals, "0").slice(0, t.decimals) || "0");
  return s ? -d : d;
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
const A = window.Sunrice, { React: D, ui: T, components: ne, inertia: R, fetchJson: G, toast: Ae } = A;
function w(c = "") {
  return c.startsWith("/") ? c : A.adminUrl(c);
}
const Fe = window.Sunrice.React, O = Fe.Fragment;
function e(c, t, i) {
  return Fe.createElement(c, i === void 0 ? t : { ...t, key: i });
}
const n = e;
function W({ title: c, description: t, actions: i }) {
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
function ue({ title: c, description: t, action: i }) {
  return /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-col cm:items-center cm:gap-2 cm:rounded-lg cm:border cm:border-dashed cm:px-6 cm:py-10 cm:text-center", children: [
    /* @__PURE__ */ e("p", { className: "cm:font-medium", children: c }),
    t && /* @__PURE__ */ e("p", { className: "cm:max-w-md cm:text-sm cm:text-muted-foreground", children: t }),
    i && /* @__PURE__ */ e("div", { className: "cm:mt-2", children: i })
  ] });
}
function M() {
  const { props: c } = R.usePage(), t = c.commerce ?? {};
  return Ee(t.currency), t;
}
function ze({ status: c, confirmations: t }) {
  const { Card: i, CardContent: s, Button: l, Input: r, Dialog: d, DialogContent: m, DialogFooter: k, DialogHeader: u, DialogTitle: y } = T, { Link: x, router: h } = R;
  M(), A.useBreadcrumbs([{ label: "Shop", href: w("commerce") }, { label: "Payments to verify" }]);
  const [g, f] = D.useState(null), [p, a] = D.useState(""), b = (v) => {
    const _ = v.expected_amount !== null && v.amount_value < v.expected_amount;
    _ && !window.confirm(`${v.amount} is less than the ${v.expected} expected. Approve anyway?`) || h.post(w(`commerce/confirmations/${v.id}/approve`), { anyway: _ }, { preserveScroll: !0 });
  };
  return /* @__PURE__ */ n("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-5xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(W, { title: "Payments to verify", description: "Customers' transfer confirmations. Compare the proof with the amount expected, then approve or reject." }),
    /* @__PURE__ */ e("div", { className: "cm:flex cm:gap-2", children: ["submitted", "approved", "rejected"].map((v) => /* @__PURE__ */ e(l, { size: "sm", variant: v === c ? "default" : "outline", asChild: !0, children: /* @__PURE__ */ e(x, { href: w(`commerce/confirmations?status=${v}`), children: v === "submitted" ? "Waiting" : v[0].toUpperCase() + v.slice(1) }) }, v)) }),
    t.length === 0 && /* @__PURE__ */ e(ue, { title: c === "submitted" ? "Nothing to verify" : "None yet" }),
    t.map((v) => /* @__PURE__ */ e(i, { children: /* @__PURE__ */ n(s, { className: "cm:grid cm:gap-4 cm:pt-6 cm:md:grid-cols-[1fr_16rem]", children: [
      /* @__PURE__ */ n("div", { className: "cm:grid cm:content-start cm:gap-1 cm:text-sm", children: [
        /* @__PURE__ */ n("p", { className: "cm:text-base cm:font-medium", children: [
          /* @__PURE__ */ e(x, { href: w(v.order.href), className: "cm:hover:underline", children: v.order.number }),
          " · ",
          v.order.customer
        ] }),
        /* @__PURE__ */ n("p", { children: [
          "Sent ",
          /* @__PURE__ */ e("strong", { children: v.amount }),
          v.expected && /* @__PURE__ */ n(O, { children: [
            " · expected ",
            /* @__PURE__ */ e("strong", { children: v.expected })
          ] }),
          v.expected_amount !== null && v.amount_value < v.expected_amount && /* @__PURE__ */ n(O, { children: [
            " ",
            /* @__PURE__ */ e(j, { tone: "warning", children: "Less than expected" })
          ] })
        ] }),
        /* @__PURE__ */ n("p", { children: [
          "From ",
          v.sender_name,
          v.sender_bank ? ` (${v.sender_bank})` : "",
          " on ",
          v.transferred_at ?? "—"
        ] }),
        v.destination && /* @__PURE__ */ n("p", { children: [
          "Into ",
          v.destination.bank,
          " ",
          v.destination.number,
          " · ",
          v.destination.holder
        ] }),
        v.method && /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: v.method }),
        v.note && /* @__PURE__ */ n("p", { className: "cm:whitespace-pre-line cm:text-muted-foreground", children: [
          "“",
          v.note,
          "”"
        ] }),
        v.review_note && /* @__PURE__ */ n("p", { className: "cm:text-muted-foreground", children: [
          "Rejected: ",
          v.review_note
        ] }),
        v.status === "submitted" && /* @__PURE__ */ n("div", { className: "cm:mt-2 cm:flex cm:gap-2", children: [
          /* @__PURE__ */ e(l, { size: "sm", onClick: () => b(v), children: "Approve" }),
          /* @__PURE__ */ e(l, { size: "sm", variant: "outline", onClick: () => {
            f(v), a("");
          }, children: "Reject" })
        ] })
      ] }),
      /* @__PURE__ */ e("div", { children: v.proof_url ? v.proof_is_pdf ? /* @__PURE__ */ e("a", { href: v.proof_url, target: "_blank", rel: "noreferrer", className: "cm:underline", children: "Open the PDF proof" }) : /* @__PURE__ */ e("a", { href: v.proof_url, target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ e("img", { src: v.proof_url, alt: `Proof for ${v.order.number}`, className: "cm:max-h-72 cm:w-full cm:rounded-md cm:border cm:object-contain" }) }) : /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No proof attached." }) })
    ] }) }, v.id)),
    /* @__PURE__ */ e(d, { open: g !== null, onOpenChange: (v) => !v && f(null), children: /* @__PURE__ */ n(m, { children: [
      /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(y, { children: "Reject this confirmation?" }) }),
      /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "The customer is emailed the reason and can confirm again; the payment deadline resumes." }),
      /* @__PURE__ */ e(r, { "aria-label": "Reason", placeholder: "e.g. We haven't received the transfer yet", value: p, onChange: (v) => a(v.target.value) }),
      /* @__PURE__ */ n(k, { children: [
        /* @__PURE__ */ e(l, { variant: "outline", onClick: () => f(null), children: "Back" }),
        /* @__PURE__ */ e(l, { disabled: p.trim() === "", onClick: () => g && h.post(w(`commerce/confirmations/${g.id}/reject`), { reason: p }, { preserveScroll: !0, onSuccess: () => f(null) }), children: "Reject" })
      ] })
    ] }) })
  ] });
}
const fe = (c) => c ? new Date(c).toLocaleDateString(void 0, { dateStyle: "medium" }) : "—";
function Me({ customer: c, account: t, roleOptions: i, orders: s, can: l }) {
  const { Card: r, CardContent: d, CardHeader: m, CardTitle: k, Button: u, Input: y, Label: x, Textarea: h, Switch: g, Checkbox: f } = T, { Link: p, router: a } = R;
  M(), A.useBreadcrumbs([{ label: "Shop", href: w("commerce") }, { label: "Customers", href: w("commerce/customers") }, { label: c.name ?? c.email }]);
  const b = R.useForm({ name: c.name ?? "", phone: c.phone ?? "", note: c.note ?? "", accepts_marketing: c.accepts_marketing, roles: t?.roles ?? [] }), [v, _] = D.useState(!1), $ = (C) => a.post(w(`commerce/customers/${c.id}/${C}`), {}, { preserveScroll: !0 });
  return /* @__PURE__ */ n("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-5xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      W,
      {
        title: c.name ?? c.email,
        description: /* @__PURE__ */ n(O, { children: [
          c.email,
          c.phone ? ` · ${c.phone}` : ""
        ] }),
        actions: /* @__PURE__ */ n(O, { children: [
          c.deletion_requested_at && /* @__PURE__ */ n(j, { tone: "warning", children: [
            "Deletion requested ",
            fe(c.deletion_requested_at)
          ] }),
          t ? /* @__PURE__ */ e(j, { tone: "ok", children: "Registered" }) : /* @__PURE__ */ e(j, { children: "Guest" })
        ] })
      }
    ),
    /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-3", children: [["Orders", String(c.orders_count)], ["Spent", c.total_spent], ["Last order", fe(c.last_order_at)]].map(([C, F]) => /* @__PURE__ */ e(r, { children: /* @__PURE__ */ n(d, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
      /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: C }),
      /* @__PURE__ */ e("span", { className: "cm:text-xl cm:font-semibold", children: F })
    ] }) }, C)) }),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[2fr_1fr]", children: [
      /* @__PURE__ */ n("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ n(r, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "Orders" }) }),
          /* @__PURE__ */ e(d, { children: s.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No orders yet." }) : /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1", children: s.map((C) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ n(p, { href: w(C.href), className: "cm:flex cm:justify-between cm:rounded cm:p-2 cm:hover:bg-muted", children: [
            /* @__PURE__ */ n("span", { children: [
              C.number,
              " · ",
              fe(C.date)
            ] }),
            /* @__PURE__ */ n("span", { children: [
              /* @__PURE__ */ e(j, { children: C.status }),
              " ",
              C.total
            ] })
          ] }) }, C.id)) }) })
        ] }),
        /* @__PURE__ */ n(r, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "Addresses" }) }),
          /* @__PURE__ */ e(d, { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: c.addresses.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No saved addresses." }) : c.addresses.map((C) => /* @__PURE__ */ n("div", { className: "cm:rounded-md cm:border cm:p-3 cm:text-sm", children: [
            C.label && /* @__PURE__ */ e("p", { className: "cm:font-medium", children: C.label }),
            /* @__PURE__ */ e("p", { className: "cm:whitespace-pre-line", children: C.text }),
            /* @__PURE__ */ n("div", { className: "cm:mt-1 cm:flex cm:gap-1", children: [
              C.default_shipping && /* @__PURE__ */ e(j, { children: "Shipping" }),
              C.default_billing && /* @__PURE__ */ e(j, { children: "Billing" })
            ] })
          ] }, C.id)) })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ n(r, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "Details" }) }),
          /* @__PURE__ */ e(d, { children: /* @__PURE__ */ n("form", { className: "cm:grid cm:gap-3", onSubmit: (C) => {
            C.preventDefault(), b.put(w(`commerce/customers/${c.id}`), { preserveScroll: !0 });
          }, children: [
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(x, { htmlFor: "c-name", children: "Name" }),
              /* @__PURE__ */ e(y, { id: "c-name", disabled: !l.edit, value: b.data.name, onChange: (C) => b.setData("name", C.target.value) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(x, { htmlFor: "c-phone", children: "Phone" }),
              /* @__PURE__ */ e(y, { id: "c-phone", disabled: !l.edit, value: b.data.phone, onChange: (C) => b.setData("phone", C.target.value) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(x, { htmlFor: "c-note", children: "Note (staff only)" }),
              /* @__PURE__ */ e(h, { id: "c-note", disabled: !l.edit, value: b.data.note, onChange: (C) => b.setData("note", C.target.value) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e(g, { id: "c-marketing", disabled: !l.edit, checked: b.data.accepts_marketing, onCheckedChange: (C) => b.setData("accepts_marketing", C) }),
              /* @__PURE__ */ e(x, { htmlFor: "c-marketing", children: "Accepts marketing" })
            ] }),
            t && /* @__PURE__ */ n("fieldset", { className: "cm:grid cm:gap-1.5", children: [
              /* @__PURE__ */ e("legend", { className: "cm:mb-1 cm:text-sm cm:font-medium", children: "Roles" }),
              i.map((C) => /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
                /* @__PURE__ */ e(
                  f,
                  {
                    disabled: !l.edit,
                    checked: b.data.roles.includes(C),
                    onCheckedChange: (F) => b.setData("roles", F ? [...b.data.roles, C] : b.data.roles.filter((S) => S !== C))
                  }
                ),
                C
              ] }, C))
            ] }),
            l.edit && /* @__PURE__ */ e(u, { type: "submit", disabled: b.processing, children: "Save" })
          ] }) })
        ] }),
        t && /* @__PURE__ */ n(r, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "Account" }) }),
          /* @__PURE__ */ n(d, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
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
        l.delete && !c.anonymized && /* @__PURE__ */ n(r, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "Remove personal data" }) }),
          /* @__PURE__ */ n(d, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "Name, email, phone and addresses are deleted; orders keep their amounts." }),
            v ? /* @__PURE__ */ n("div", { className: "cm:flex cm:gap-2", children: [
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
  const { Card: r, CardContent: d, CardHeader: m, CardTitle: k, CardDescription: u } = T, { Link: y } = R;
  M();
  const x = t.filter((f) => !f.done), h = i.filter((f) => f.status !== "ok"), g = Object.entries(ee.dashboardWidgets());
  return /* @__PURE__ */ n("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(W, { title: "Store", description: /* @__PURE__ */ n(O, { children: [
      "Selling mode: ",
      c.label
    ] }) }),
    x.length > 0 && /* @__PURE__ */ n(r, { children: [
      /* @__PURE__ */ n(m, { children: [
        /* @__PURE__ */ e(k, { children: "Set up your store" }),
        /* @__PURE__ */ n(u, { children: [
          t.length - x.length,
          " of ",
          t.length,
          " done"
        ] })
      ] }),
      /* @__PURE__ */ e(d, { className: "cm:grid cm:gap-2", children: t.map((f) => /* @__PURE__ */ n(y, { href: w(f.href), className: "cm:flex cm:items-start cm:gap-3 cm:rounded-md cm:p-2 cm:hover:bg-muted", children: [
        /* @__PURE__ */ e("span", { "aria-hidden": !0, className: f.done ? "cm:text-emerald-600" : "cm:text-muted-foreground", children: f.done ? "✓" : "○" }),
        /* @__PURE__ */ n("span", { className: "cm:grid", children: [
          /* @__PURE__ */ e("span", { className: f.done ? "cm:text-muted-foreground cm:line-through" : "cm:font-medium", children: f.label }),
          f.description && /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: f.description })
        ] })
      ] }, f.key)) })
    ] }),
    h.length > 0 && /* @__PURE__ */ n(r, { children: [
      /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "Needs attention" }) }),
      /* @__PURE__ */ e(d, { className: "cm:grid cm:gap-3", children: h.map((f) => /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
          /* @__PURE__ */ e(j, { tone: f.status, children: f.status === "error" ? "Problem" : "Warning" }),
          /* @__PURE__ */ e("span", { className: "cm:font-medium", children: f.label })
        ] }),
        /* @__PURE__ */ e("p", { className: "cm:text-sm", children: f.message }),
        f.fix && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: f.fix })
      ] }, f.key)) })
    ] }),
    /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2 cm:lg:grid-cols-4", children: s === void 0 ? [0, 1, 2, 3].map((f) => /* @__PURE__ */ e("div", { className: "cm:h-24 cm:animate-pulse cm:rounded-lg cm:bg-muted" }, f)) : s.map((f) => /* @__PURE__ */ e(r, { children: /* @__PURE__ */ n(d, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
      /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: f.label }),
      /* @__PURE__ */ e("span", { className: "cm:text-2xl cm:font-semibold", children: f.value }),
      f.hint && /* @__PURE__ */ e("span", { className: "cm:text-xs cm:text-muted-foreground", children: f.hint })
    ] }) }, f.key)) }),
    /* @__PURE__ */ n(r, { children: [
      /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "To do" }) }),
      /* @__PURE__ */ e(d, { children: l === void 0 ? /* @__PURE__ */ e("div", { className: "cm:h-16 cm:animate-pulse cm:rounded-md cm:bg-muted" }) : l.length === 0 ? /* @__PURE__ */ e(ue, { title: "Nothing to do", description: "Orders to process and payments to verify show up here." }) : /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1", children: l.map((f) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ n(y, { href: w(f.href), className: "cm:flex cm:justify-between cm:rounded-md cm:p-2 cm:hover:bg-muted", children: [
        /* @__PURE__ */ e("span", { children: f.label }),
        /* @__PURE__ */ e("span", { className: "cm:font-semibold", children: f.count })
      ] }) }, f.key)) }) })
    ] }),
    g.map(([f, p]) => /* @__PURE__ */ e(p, {}, f))
  ] });
}
const He = { in_stock: "ok", out_of_stock: "error", backorder: "warning" };
function Ke({ row: c, reasons: t, onClose: i }) {
  const { Dialog: s, DialogContent: l, DialogHeader: r, DialogTitle: d, DialogDescription: m, DialogFooter: k, Button: u, Input: y, Label: x } = T, h = R.useForm({ mode: "add", quantity: 0, reason: "manual", note: "" }), [g, f] = D.useState(null);
  D.useEffect(() => {
    G(w(`commerce/inventory/${c.id}/history`)).then((a) => f(a.data)).catch(() => f([]));
  }, [c.id]);
  const p = h.data.mode === "set" ? h.data.quantity : (c.stock_quantity ?? 0) + h.data.quantity;
  return /* @__PURE__ */ e(s, { open: !0, onOpenChange: (a) => !a && i(), children: /* @__PURE__ */ n(l, { className: "cm:max-w-lg", children: [
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
      a.preventDefault(), h.post(w(`commerce/inventory/${c.id}/adjust`), { preserveScroll: !0, onSuccess: i });
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
          /* @__PURE__ */ e(y, { id: "adjust-quantity", type: "number", value: h.data.quantity, onChange: (a) => h.setData("quantity", Number(a.target.value)) }),
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
          /* @__PURE__ */ e(y, { id: "adjust-note", value: h.data.note, onChange: (a) => h.setData("note", a.target.value) })
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
    /* @__PURE__ */ n(k, { children: [
      /* @__PURE__ */ e(u, { variant: "outline", type: "button", onClick: i, children: "Cancel" }),
      /* @__PURE__ */ e(u, { type: "submit", form: "adjust-stock", disabled: h.processing, children: "Save" })
    ] })
  ] }) });
}
function We(c) {
  const { DataTable: t } = ne, [i, s] = D.useState(null);
  return M(), A.useBreadcrumbs([{ label: "Shop", href: w("commerce") }, { label: "Inventory" }]), /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(W, { title: "Inventory", description: "Stock of every product variant. Every change is recorded." }),
    /* @__PURE__ */ e(
      t,
      {
        ...c,
        searchPlaceholder: "Search products or SKUs…",
        onRowClick: c.can.adjust ? (l) => s(l) : void 0,
        renderCell: (l, r) => {
          if (r.key === "status") return /* @__PURE__ */ e(j, { tone: l.low ? "warning" : He[l.status], children: l.low ? "Low" : l.status.replace(/_/g, " ") });
          if (r.key === "stock_quantity") return l.track_stock ? l.stock_quantity : /* @__PURE__ */ e("span", { className: "cm:text-muted-foreground", children: "—" });
        }
      }
    ),
    i && /* @__PURE__ */ e(Ke, { row: i, reasons: c.reasons, onClose: () => s(null) })
  ] });
}
function te({
  value: c,
  onChange: t,
  id: i,
  placeholder: s,
  allowNull: l = !0,
  invalid: r
}) {
  const { Input: d } = T, m = (h) => h == null ? "" : re(h).replace(/^[^\d-]+|[^\d]+$/g, ""), [k, u] = D.useState(m(c)), [y, x] = D.useState(!1);
  return D.useEffect(() => {
    y || u(m(c));
  }, [c, y]), /* @__PURE__ */ e(
    d,
    {
      id: i,
      inputMode: "decimal",
      value: k,
      placeholder: s,
      "aria-invalid": r || void 0,
      onFocus: () => x(!0),
      onChange: (h) => {
        u(h.target.value);
        const g = h.target.value.trim() === "" ? l ? null : 0 : De(h.target.value);
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
], Qe = { province: 1, city: 2, district: 3, village: 4 }, pe = /* @__PURE__ */ new Map();
function Ge(c, t) {
  const i = t ? `${c}?parent=${encodeURIComponent(t)}` : c;
  return pe.has(i) || pe.set(i, G(i).then((s) => s.data).catch(() => (pe.delete(i), []))), pe.get(i);
}
const _e = "cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm cm:disabled:opacity-50";
function Te({ field: c, value: t, onChange: i, pathPrefix: s }) {
  const { Label: l } = T, r = c.config ?? {}, d = String(r.api ?? ""), m = Qe[r.depth ?? "district"] ?? 3, k = r.country_options ?? [], u = { country: "ID", province_code: null, city_code: null, district_code: null, village_code: null, ...t ?? {} }, y = Ne.slice(0, m), [x, h] = D.useState({}), g = [null, u.province_code, u.city_code, u.district_code];
  D.useEffect(() => {
    u.country !== "ID" || !d || y.forEach((p, a) => {
      const b = g[a];
      a > 0 && !b || Ge(d, b).then((v) => h((_) => ({ ..._, [p.key]: v })));
    });
  }, [d, u.country, u.province_code, u.city_code, u.district_code]);
  const f = (p, a) => {
    const b = { ...u };
    b[y[p].key] = a || null, Ne.slice(p + 1).forEach((v) => {
      b[v.key] = null;
    }), i(b);
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
          onChange: (p) => i({ country: p.target.value, province_code: null, city_code: null, district_code: null, village_code: null }),
          children: k.map((p) => /* @__PURE__ */ e("option", { value: p.value, children: p.label }, p.value))
        }
      )
    ] }),
    u.country === "ID" && y.map((p, a) => /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(l, { htmlFor: `${s}-${p.key}`, children: p.label }),
      /* @__PURE__ */ n(
        "select",
        {
          id: `${s}-${p.key}`,
          className: _e,
          value: u[p.key] ?? "",
          disabled: a > 0 && !g[a],
          onChange: (b) => f(a, b.target.value),
          children: [
            /* @__PURE__ */ e("option", { value: "", children: "Choose…" }),
            (x[p.key] ?? []).map((b) => /* @__PURE__ */ e("option", { value: b.code, children: b.name }, b.code))
          ]
        }
      )
    ] }, p.key))
  ] });
}
function Ve({ mode: c, order: t, paymentMethods: i, canOverride: s, variantsUrl: l, previewUrl: r, submitUrl: d }) {
  const { Card: m, CardContent: k, CardHeader: u, CardTitle: y, Button: x, Input: h, Label: g, Checkbox: f, Textarea: p } = T;
  M(), A.useBreadcrumbs([
    { label: "Shop", href: w("commerce") },
    { label: "Orders", href: w("commerce/orders") },
    ...t ? [{ label: t.number, href: w(`commerce/orders/${t.id}`) }] : [],
    { label: c === "create" ? "New order" : c === "quote" ? "Quote" : "Edit items" }
  ]);
  const a = R.useForm({
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
  }), b = a.errors, [v, _] = D.useState(""), [$, C] = D.useState([]), [F, S] = D.useState(null);
  D.useEffect(() => {
    if (v.trim().length < 2) {
      C([]);
      return;
    }
    const N = setTimeout(() => G(`${w(l)}&q=${encodeURIComponent(v)}`).then((P) => C(P.data)).catch(() => C([])), 250);
    return () => clearTimeout(N);
  }, [v]), D.useEffect(() => {
    if (a.data.lines.length === 0) {
      S(null);
      return;
    }
    const N = setTimeout(() => {
      G(w(r), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        lines: a.data.lines.map(({ item_id: P, variant_id: I, quantity: H, unit_price: ce }) => ({ item_id: P, variant_id: I, quantity: H, unit_price: ce })),
        shipping: a.data.shipping,
        discount: a.data.discount,
        shipping_address: c === "create" ? a.data.shipping_address : void 0
      }) }).then(S).catch(() => S(null));
    }, 300);
    return () => clearTimeout(N);
  }, [JSON.stringify([a.data.lines, a.data.shipping, a.data.discount, a.data.shipping_address])]);
  const U = (N) => {
    const P = a.data.lines.findIndex((I) => I.variant_id === N.id && !I.item_id);
    a.setData("lines", P >= 0 ? a.data.lines.map((I, H) => H === P ? { ...I, quantity: I.quantity + 1 } : I) : [...a.data.lines, { variant_id: N.id, label: N.label, sku: N.sku, quantity: 1, price: N.price, unit_price: null }]), _(""), C([]);
  }, se = (N, P) => a.setData("lines", a.data.lines.map((I, H) => H === N ? { ...I, ...P } : I)), ge = (N) => {
    N.preventDefault(), a.transform((P) => ({ ...P, lines: P.lines.map(({ item_id: I, variant_id: H, quantity: ce, unit_price: Q }) => ({ item_id: I, variant_id: H, quantity: ce, unit_price: Q })) })), c === "create" ? a.post(w(d)) : a.put(w(d));
  }, de = (N) => F?.lines.find((P) => P.variant_id === N);
  return /* @__PURE__ */ n("form", { onSubmit: ge, className: "cm:mx-auto cm:grid cm:w-full cm:max-w-5xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      W,
      {
        title: c === "create" ? "New order" : c === "quote" ? `Quote ${t?.number}` : `Edit ${t?.number}`,
        description: c === "edit" ? "Existing lines keep their price; new lines use today's price. The stock difference is reserved or given back." : c === "quote" ? `For ${t?.customer}. Set the prices, shipping and discount, then send it.` : "An order for a customer, from a chat or a call."
      }
    ),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[2fr_1fr]", children: [
      /* @__PURE__ */ n("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ n(m, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(y, { children: "Products" }) }),
          /* @__PURE__ */ n(k, { className: "cm:grid cm:gap-3", children: [
            /* @__PURE__ */ n("div", { className: "cm:relative", children: [
              /* @__PURE__ */ e(h, { placeholder: "Search products by name or SKU…", value: v, onChange: (N) => _(N.target.value), "aria-label": "Search products" }),
              $.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-10 cm:mt-1 cm:max-h-64 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: $.map((N) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ e("button", { type: "button", className: "cm:flex cm:w-full cm:justify-between cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted", onClick: () => U(N), children: /* @__PURE__ */ n("span", { children: [
                N.label,
                N.sku ? /* @__PURE__ */ n("span", { className: "cm:text-muted-foreground", children: [
                  " · ",
                  N.sku
                ] }) : null
              ] }) }) }, N.id)) })
            ] }),
            b.lines && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-destructive", children: b.lines }),
            a.data.lines.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No products yet." }) : /* @__PURE__ */ e("ul", { className: "cm:divide-y cm:divide-border", children: a.data.lines.map((N, P) => /* @__PURE__ */ n("li", { className: "cm:grid cm:items-center cm:gap-2 cm:py-2 cm:sm:grid-cols-[1fr_5rem_9rem_7rem_auto]", children: [
              /* @__PURE__ */ n("div", { className: "cm:min-w-0 cm:text-sm", children: [
                /* @__PURE__ */ e("p", { className: "cm:font-medium", children: N.label }),
                N.sku && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: N.sku })
              ] }),
              /* @__PURE__ */ e(h, { type: "number", min: 1, "aria-label": "Quantity", value: N.quantity, onChange: (I) => se(P, { quantity: Math.max(1, Number(I.target.value)) }) }),
              s ? /* @__PURE__ */ e(te, { value: N.unit_price, placeholder: de(N.variant_id)?.unit_price_formatted ?? "", onChange: (I) => se(P, { unit_price: I }) }) : /* @__PURE__ */ e("span", { className: "cm:text-sm", children: de(N.variant_id)?.unit_price_formatted ?? "…" }),
              /* @__PURE__ */ e("span", { className: "cm:text-sm cm:font-medium cm:sm:text-right", children: de(N.variant_id)?.total ?? "" }),
              /* @__PURE__ */ e(x, { type: "button", variant: "ghost", size: "sm", "aria-label": "Remove", onClick: () => a.setData("lines", a.data.lines.filter((I, H) => H !== P)), children: "×" })
            ] }, `${N.item_id ?? "n"}-${N.variant_id}-${P}`)) }),
            F?.notices.map((N, P) => /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-amber-700", children: N }, P))
          ] })
        ] }),
        c === "create" && /* @__PURE__ */ n(m, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(y, { children: "Customer" }) }),
          /* @__PURE__ */ n(k, { className: "cm:grid cm:gap-3 cm:sm:grid-cols-3", children: [
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(g, { htmlFor: "m-email", children: "Email *" }),
              /* @__PURE__ */ e(h, { id: "m-email", type: "email", value: a.data.email, onChange: (N) => a.setData("email", N.target.value) }),
              b.email && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-destructive", children: b.email })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(g, { htmlFor: "m-name", children: "Name" }),
              /* @__PURE__ */ e(h, { id: "m-name", value: a.data.name, onChange: (N) => a.setData("name", N.target.value) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(g, { htmlFor: "m-phone", children: "Phone" }),
              /* @__PURE__ */ e(h, { id: "m-phone", value: a.data.phone, onChange: (N) => a.setData("phone", N.target.value) })
            ] })
          ] })
        ] }),
        c === "create" && (F?.needs_shipping ?? !0) && /* @__PURE__ */ n(m, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(y, { children: "Shipping address" }) }),
          /* @__PURE__ */ n(k, { className: "cm:grid cm:gap-3", children: [
            /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: ["name", "phone"].map((N) => /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(g, { htmlFor: `a-${N}`, children: N === "name" ? "Recipient" : "Phone" }),
              /* @__PURE__ */ e(h, { id: `a-${N}`, value: String(a.data.shipping_address[N] ?? ""), onChange: (P) => a.setData("shipping_address", { ...a.data.shipping_address, [N]: P.target.value }) })
            ] }, N)) }),
            /* @__PURE__ */ e(
              Te,
              {
                field: { handle: "region", type: "commerce_region", label: "Region", config: { depth: "village" } },
                pathPrefix: "shipping_address",
                value: a.data.shipping_address,
                onChange: (N) => a.setData("shipping_address", { ...a.data.shipping_address, ...N ?? {} })
              }
            ),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(g, { htmlFor: "a-line1", children: "Street address" }),
              /* @__PURE__ */ e(h, { id: "a-line1", value: String(a.data.shipping_address.line1 ?? ""), onChange: (N) => a.setData("shipping_address", { ...a.data.shipping_address, line1: N.target.value }) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1 cm:sm:w-48", children: [
              /* @__PURE__ */ e(g, { htmlFor: "a-postal", children: "Postal code" }),
              /* @__PURE__ */ e(h, { id: "a-postal", value: String(a.data.shipping_address.postal_code ?? ""), onChange: (N) => a.setData("shipping_address", { ...a.data.shipping_address, postal_code: N.target.value }) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ n(m, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(y, { children: "Shipping and discount" }) }),
          /* @__PURE__ */ n(k, { className: "cm:grid cm:gap-3", children: [
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(g, { htmlFor: "s-label", children: "Shipping method" }),
              /* @__PURE__ */ e(h, { id: "s-label", placeholder: "JNE REG", value: a.data.shipping.label, onChange: (N) => a.setData("shipping", { ...a.data.shipping, label: N.target.value }) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(g, { htmlFor: "s-cost", children: "Shipping cost" }),
              /* @__PURE__ */ e(te, { id: "s-cost", allowNull: !1, value: a.data.shipping.cost, onChange: (N) => a.setData("shipping", { ...a.data.shipping, cost: N ?? 0 }) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(g, { htmlFor: "d-label", children: "Discount label" }),
              /* @__PURE__ */ e(h, { id: "d-label", value: a.data.discount.label, onChange: (N) => a.setData("discount", { ...a.data.discount, label: N.target.value }) })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(g, { htmlFor: "d-amount", children: "Discount" }),
              /* @__PURE__ */ e(te, { id: "d-amount", allowNull: !1, value: a.data.discount.amount, onChange: (N) => a.setData("discount", { ...a.data.discount, amount: N ?? 0 }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ n(m, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(y, { children: "Total" }) }),
          /* @__PURE__ */ e(k, { className: "cm:grid cm:gap-1 cm:text-sm", children: F ? /* @__PURE__ */ n(O, { children: [
            /* @__PURE__ */ n("p", { className: "cm:flex cm:justify-between", children: [
              /* @__PURE__ */ e("span", { children: "Subtotal" }),
              /* @__PURE__ */ e("span", { children: F.totals.subtotal })
            ] }),
            /* @__PURE__ */ n("p", { className: "cm:flex cm:justify-between", children: [
              /* @__PURE__ */ e("span", { children: "Discount" }),
              /* @__PURE__ */ n("span", { children: [
                "−",
                F.totals.discount
              ] })
            ] }),
            /* @__PURE__ */ n("p", { className: "cm:flex cm:justify-between", children: [
              /* @__PURE__ */ e("span", { children: "Shipping" }),
              /* @__PURE__ */ e("span", { children: F.totals.shipping })
            ] }),
            /* @__PURE__ */ n("p", { className: "cm:flex cm:justify-between cm:text-base cm:font-semibold", children: [
              /* @__PURE__ */ e("span", { children: "Total" }),
              /* @__PURE__ */ e("span", { children: F.totals.total })
            ] })
          ] }) : /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "Add products to see the total." }) })
        ] }),
        c === "create" && /* @__PURE__ */ n(m, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(y, { children: "Payment" }) }),
          /* @__PURE__ */ n(k, { className: "cm:grid cm:gap-3 cm:text-sm", children: [
            ["unpaid", "paid"].map((N) => /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e("input", { type: "radio", name: "payment_status", checked: a.data.payment_status === N, onChange: () => a.setData("payment_status", N) }),
              N === "unpaid" ? "Unpaid: the customer pays later" : "Paid already"
            ] }, N)),
            i.length > 0 && /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(g, { htmlFor: "p-method", children: "Method" }),
              /* @__PURE__ */ n("select", { id: "p-method", className: "cm:h-9 cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3", value: a.data.payment_method, onChange: (N) => a.setData("payment_method", N.target.value), children: [
                /* @__PURE__ */ e("option", { value: "", children: "—" }),
                i.map((N) => /* @__PURE__ */ e("option", { value: N.value, children: N.label }, N.value))
              ] })
            ] }),
            a.data.payment_status === "paid" ? /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(g, { htmlFor: "p-ref", children: "Reference" }),
              /* @__PURE__ */ e(h, { id: "p-ref", value: a.data.reference, onChange: (N) => a.setData("reference", N.target.value) })
            ] }) : /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e(f, { checked: a.data.send_link, onCheckedChange: (N) => a.setData("send_link", N === !0) }),
              " Email the customer the link to pay"
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(g, { htmlFor: "m-note", children: "Internal note" }),
              /* @__PURE__ */ e(p, { id: "m-note", value: a.data.note, onChange: (N) => a.setData("note", N.target.value) })
            ] })
          ] })
        ] }),
        c === "quote" && /* @__PURE__ */ n(m, { children: [
          /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(y, { children: "Validity" }) }),
          /* @__PURE__ */ n(k, { className: "cm:grid cm:gap-3 cm:text-sm", children: [
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(g, { htmlFor: "q-valid", children: "Valid until" }),
              /* @__PURE__ */ e(h, { id: "q-valid", type: "date", value: a.data.valid_until, onChange: (N) => a.setData("valid_until", N.target.value) }),
              b.valid_until && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-destructive", children: b.valid_until })
            ] }),
            /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e(f, { checked: a.data.send, onCheckedChange: (N) => a.setData("send", N === !0) }),
              " Send it to the customer now"
            ] })
          ] })
        ] }),
        c === "edit" && /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
          /* @__PURE__ */ e(f, { checked: a.data.notify, onCheckedChange: (N) => a.setData("notify", N === !0) }),
          " Tell the customer about the change"
        ] }),
        /* @__PURE__ */ e(x, { type: "submit", disabled: a.processing || a.data.lines.length === 0, children: c === "create" ? "Create order" : c === "quote" ? a.data.send ? "Send quote" : "Save quote" : "Save changes" })
      ] })
    ] })
  ] });
}
function Je({ order: c, couriers: t, onClose: i }) {
  const { Dialog: s, DialogContent: l, DialogFooter: r, DialogHeader: d, DialogTitle: m, Button: k, Input: u, Label: y } = T, x = c.items.filter((p) => p.unfulfilled > 0), h = R.useForm({
    courier: t[0]?.key ?? "",
    courier_name: "",
    service: "",
    tracking_number: "",
    items: x.map((p) => ({ order_item_id: p.id, quantity: p.unfulfilled }))
  }), g = h.errors;
  return /* @__PURE__ */ e(s, { open: !0, onOpenChange: (p) => !p && i(), children: /* @__PURE__ */ n(l, { children: [
    /* @__PURE__ */ e(d, { children: /* @__PURE__ */ e(m, { children: "Add a shipment" }) }),
    /* @__PURE__ */ n("form", { className: "cm:grid cm:gap-3", onSubmit: (p) => {
      p.preventDefault(), h.post(w(`commerce/orders/${c.id}/shipments`), { preserveScroll: !0, onSuccess: i });
    }, children: [
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(y, { htmlFor: "s-courier", children: "Courier" }),
        /* @__PURE__ */ n("select", { id: "s-courier", className: "cm:h-9 cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm", value: h.data.courier, onChange: (p) => h.setData("courier", p.target.value), children: [
          t.map((p) => /* @__PURE__ */ e("option", { value: p.key, children: p.name }, p.key)),
          /* @__PURE__ */ e("option", { value: "", children: "Other…" })
        ] })
      ] }),
      h.data.courier === "" && /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(y, { htmlFor: "s-name", children: "Courier name" }),
        /* @__PURE__ */ e(u, { id: "s-name", value: h.data.courier_name, onChange: (p) => h.setData("courier_name", p.target.value) })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(y, { htmlFor: "s-service", children: "Service" }),
        /* @__PURE__ */ e(u, { id: "s-service", placeholder: "REG, YES…", value: h.data.service, onChange: (p) => h.setData("service", p.target.value) })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(y, { htmlFor: "s-tracking", children: "Tracking number" }),
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
              onChange: (b) => h.setData("items", h.data.items.map((v, _) => _ === a ? { ...v, quantity: Number(b.target.value) } : v))
            }
          )
        ] }, p.id)),
        g.items && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-destructive", children: g.items })
      ] }),
      /* @__PURE__ */ n(r, { children: [
        /* @__PURE__ */ e(k, { type: "button", variant: "outline", onClick: i, children: "Cancel" }),
        /* @__PURE__ */ e(k, { type: "submit", disabled: h.processing, children: "Save shipment" })
      ] })
    ] })
  ] }) });
}
function Xe({ order: c, onClose: t }) {
  const { Dialog: i, DialogContent: s, DialogFooter: l, DialogHeader: r, DialogTitle: d, DialogDescription: m, Button: k, Input: u, Label: y, Checkbox: x } = T, h = R.useForm({
    amount: c.totals.refundable,
    reason: "",
    restock: !1,
    items: c.items.map((f) => ({ order_item_id: f.id, quantity: 0 }))
  }), g = h.errors;
  return /* @__PURE__ */ e(i, { open: !0, onOpenChange: (f) => !f && t(), children: /* @__PURE__ */ n(s, { children: [
    /* @__PURE__ */ n(r, { children: [
      /* @__PURE__ */ e(d, { children: "Refund" }),
      /* @__PURE__ */ e(m, { children: "Record money you returned to the customer." })
    ] }),
    /* @__PURE__ */ n("form", { className: "cm:grid cm:gap-3", onSubmit: (f) => {
      f.preventDefault(), h.post(w(`commerce/orders/${c.id}/refunds`), { preserveScroll: !0, onSuccess: t });
    }, children: [
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(y, { htmlFor: "r-amount", children: "Amount" }),
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
              onChange: (a) => h.setData("items", h.data.items.map((b, v) => v === p ? { ...b, quantity: Number(a.target.value) } : b))
            }
          )
        ] }, f.id))
      ] }),
      /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
        /* @__PURE__ */ e(x, { checked: h.data.restock, onCheckedChange: (f) => h.setData("restock", f === !0) }),
        " Put the returned items back in stock"
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(y, { htmlFor: "r-reason", children: "Reason" }),
        /* @__PURE__ */ e(u, { id: "r-reason", value: h.data.reason, onChange: (f) => h.setData("reason", f.target.value) })
      ] }),
      /* @__PURE__ */ n(l, { children: [
        /* @__PURE__ */ e(k, { type: "button", variant: "outline", onClick: t, children: "Cancel" }),
        /* @__PURE__ */ e(k, { type: "submit", disabled: h.processing, children: "Record refund" })
      ] })
    ] })
  ] }) });
}
const L = (c) => c ? new Date(c).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" }) : "—", oe = (c) => ({
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
  const { order: t, transitions: i, can: s, panels: l } = c, { Card: r, CardContent: d, CardHeader: m, CardTitle: k, Button: u, Textarea: y, Label: x, Checkbox: h, Input: g, Dialog: f, DialogContent: p, DialogFooter: a, DialogHeader: b, DialogTitle: v, DialogDescription: _ } = T, { Link: $, router: C } = R;
  M(), A.useBreadcrumbs([{ label: "Shop", href: w("commerce") }, { label: "Orders", href: w("commerce/orders") }, { label: t.number }]);
  const F = `commerce/orders/${t.id}`, [S, U] = D.useState(null), [se, ge] = D.useState(""), [de, N] = D.useState(!1), [P, I] = D.useState(!1), [H, ce] = D.useState(!1), Q = R.useForm({ message: "", customer: !1 }), J = R.useForm({ reference: "", paid_at: "", account: "" }), Ie = ee.orderPanels(), xe = (o, E) => C.post(w(`${F}/transition`), { to: o, reason: E ?? null }, { preserveScroll: !0, onFinish: () => U(null) });
  return /* @__PURE__ */ n("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      W,
      {
        title: `${t.type === "quote" ? "Quote" : "Order"} ${t.number}`,
        description: /* @__PURE__ */ n(O, { children: [
          "Placed ",
          L(t.placed_at),
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
      i.filter((o) => o.permission).map((o) => /* @__PURE__ */ e(
        u,
        {
          size: "sm",
          variant: o.to === "cancelled" ? "outline" : "default",
          disabled: !o.allowed,
          title: o.reason ?? void 0,
          onClick: () => o.to === "cancelled" || o.to === "on_hold" ? U(o) : xe(o.to),
          children: o.to === "cancelled" ? "Cancel order" : `Mark ${o.label.toLowerCase()}`
        },
        o.to
      )),
      s.mark_paid && /* @__PURE__ */ e(u, { size: "sm", variant: "outline", onClick: () => N(!0), children: "Mark paid" }),
      s.shipments && t.items.some((o) => o.unfulfilled > 0) && /* @__PURE__ */ e(u, { size: "sm", variant: "outline", onClick: () => I(!0), children: "Add shipment" }),
      s.refund && /* @__PURE__ */ e(u, { size: "sm", variant: "outline", onClick: () => ce(!0), children: "Refund" }),
      s.send_link && /* @__PURE__ */ e(u, { size: "sm", variant: "outline", onClick: () => C.post(w(`${F}/payment-link`), {}, { preserveScroll: !0 }), children: "Send payment link" }),
      s.edit_items && /* @__PURE__ */ e(u, { size: "sm", variant: "outline", asChild: !0, children: /* @__PURE__ */ e($, { href: w(`${F}/edit`), children: "Edit items" }) }),
      s.respond_quote && /* @__PURE__ */ e(u, { size: "sm", asChild: !0, children: /* @__PURE__ */ e($, { href: w(`${F}/quote`), children: t.status === "quoted" ? "Edit quote" : "Send a quote" }) }),
      s.delete && !t.trashed && /* @__PURE__ */ e(
        u,
        {
          size: "sm",
          variant: "ghost",
          className: "cm:ml-auto cm:text-destructive",
          onClick: () => window.confirm("Move this order to the trash?") && C.delete(w(F)),
          children: "Trash"
        }
      ),
      s.delete && t.trashed && /* @__PURE__ */ e(u, { size: "sm", variant: "outline", className: "cm:ml-auto", onClick: () => C.post(w(`${F}/restore`)), children: "Restore" }),
      s.force_delete && /* @__PURE__ */ e(
        u,
        {
          size: "sm",
          variant: "ghost",
          className: "cm:text-destructive",
          onClick: () => window.confirm("Delete this order for good? This can't be undone.") && C.delete(w(`${F}/force`)),
          children: "Delete for good"
        }
      )
    ] }),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[2fr_1fr]", children: [
      /* @__PURE__ */ n("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ n(r, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "Items" }) }),
          /* @__PURE__ */ n(d, { className: "cm:grid cm:gap-4", children: [
            /* @__PURE__ */ e("ul", { className: "cm:divide-y cm:divide-border", children: t.items.map((o) => /* @__PURE__ */ n("li", { className: "cm:grid cm:gap-1 cm:py-3 cm:first:pt-0 cm:sm:grid-cols-[1fr_auto] cm:sm:gap-4", children: [
              /* @__PURE__ */ n("div", { className: "cm:min-w-0", children: [
                /* @__PURE__ */ n("p", { className: "cm:font-medium", children: [
                  o.product_href ? /* @__PURE__ */ e($, { href: w(o.product_href), className: "cm:hover:underline", children: o.name }) : o.name,
                  o.variant_title && /* @__PURE__ */ n("span", { className: "cm:text-muted-foreground", children: [
                    " · ",
                    o.variant_title
                  ] })
                ] }),
                /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  o.sku && /* @__PURE__ */ n(O, { children: [
                    "SKU ",
                    o.sku,
                    " · "
                  ] }),
                  o.price_source.label,
                  o.requires_shipping && t.fulfillment_status !== "not_required" && /* @__PURE__ */ n(O, { children: [
                    " · shipped ",
                    o.fulfilled_quantity,
                    "/",
                    o.quantity
                  ] }),
                  o.refunded_quantity > 0 && /* @__PURE__ */ n(O, { children: [
                    " · refunded ",
                    o.refunded_quantity
                  ] })
                ] }),
                o.components.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:mt-1 cm:text-xs cm:text-muted-foreground", children: o.components.map((E, Be) => /* @__PURE__ */ n("li", { children: [
                  E.quantity,
                  " × ",
                  E.name
                ] }, Be)) })
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
              t.adjustments.filter((o) => o.kind !== "tax").map((o, E) => /* @__PURE__ */ e(Z, { label: `${o.label}${o.code ? ` (${o.code})` : ""}`, value: o.amount, muted: !0 }, E)),
              t.totals.shipping !== null && /* @__PURE__ */ e(Z, { label: `Shipping${t.shipping_method?.label ? ` · ${t.shipping_method.label}` : ""}`, value: t.totals.shipping }),
              t.adjustments.filter((o) => o.kind === "tax").map((o, E) => /* @__PURE__ */ e(Z, { label: `${o.label}${o.included ? " (included)" : ""}`, value: o.amount, muted: !0 }, `t${E}`)),
              /* @__PURE__ */ e(Z, { label: "Total", value: t.totals.total, strong: !0 }),
              t.type === "order" && /* @__PURE__ */ e(Z, { label: "Paid", value: t.totals.paid, muted: !0 }),
              t.totals.refunded && /* @__PURE__ */ e(Z, { label: "Refunded", value: `−${t.totals.refunded}`, muted: !0 })
            ] })
          ] })
        ] }),
        (t.payments.length > 0 || t.confirmations.length > 0) && /* @__PURE__ */ n(r, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "Payments" }) }),
          /* @__PURE__ */ n(d, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            t.payments.map((o) => /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2 cm:rounded-md cm:border cm:p-3", children: [
              /* @__PURE__ */ n("div", { children: [
                /* @__PURE__ */ n("p", { className: "cm:font-medium", children: [
                  o.method,
                  " · ",
                  o.amount
                ] }),
                /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  o.reference && /* @__PURE__ */ n(O, { children: [
                    "Ref ",
                    o.reference,
                    " · "
                  ] }),
                  o.paid_at ? `Paid ${L(o.paid_at)}` : o.expires_at ? `Due ${L(o.expires_at)}` : "",
                  o.refunded && ` · refunded ${o.refunded}`
                ] })
              ] }),
              /* @__PURE__ */ e(j, { tone: oe(o.status), children: o.status.replace(/_/g, " ") })
            ] }, o.id)),
            t.confirmations.map((o) => /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2 cm:rounded-md cm:border cm:border-dashed cm:p-3", children: [
              /* @__PURE__ */ n("span", { children: [
                "Confirmation from ",
                o.sender_name,
                o.sender_bank ? ` (${o.sender_bank})` : "",
                " · ",
                o.amount,
                o.proof_url && /* @__PURE__ */ n(O, { children: [
                  " · ",
                  /* @__PURE__ */ e("a", { href: o.proof_url, target: "_blank", rel: "noreferrer", className: "cm:underline", children: "proof" })
                ] })
              ] }),
              /* @__PURE__ */ n("span", { className: "cm:flex cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ e(j, { tone: o.status === "approved" ? "ok" : o.status === "rejected" ? "error" : "warning", children: o.status }),
                o.can_review && /* @__PURE__ */ e(u, { size: "sm", asChild: !0, children: /* @__PURE__ */ e($, { href: w("commerce/confirmations"), children: "Review" }) })
              ] })
            ] }, o.id))
          ] })
        ] }),
        t.shipments.length > 0 && /* @__PURE__ */ n(r, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "Shipments" }) }),
          /* @__PURE__ */ e(d, { className: "cm:grid cm:gap-2 cm:text-sm", children: t.shipments.map((o) => /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1 cm:rounded-md cm:border cm:p-3", children: [
            /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:justify-between", children: [
              /* @__PURE__ */ n("span", { className: "cm:font-medium", children: [
                o.courier,
                o.service ? ` ${o.service}` : "",
                o.tracking_number && /* @__PURE__ */ n(O, { children: [
                  " · ",
                  o.tracking_url ? /* @__PURE__ */ e("a", { href: o.tracking_url, target: "_blank", rel: "noreferrer", className: "cm:underline", children: o.tracking_number }) : o.tracking_number
                ] })
              ] }),
              /* @__PURE__ */ e(j, { tone: oe(o.status), children: o.status.replace(/_/g, " ") })
            ] }),
            /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
              o.items.map((E) => `${E.quantity} × ${E.name}`).join(", "),
              " · shipped ",
              L(o.shipped_at),
              o.delivered_at ? ` · delivered ${L(o.delivered_at)}` : ""
            ] }),
            s.shipments && o.status !== "delivered" && /* @__PURE__ */ e("div", { children: /* @__PURE__ */ e(u, { size: "sm", variant: "outline", onClick: () => C.post(w(`${F}/shipments/${o.id}/delivered`), {}, { preserveScroll: !0 }), children: "Mark delivered" }) })
          ] }, o.id)) })
        ] }),
        t.refunds.length > 0 && /* @__PURE__ */ n(r, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "Refunds" }) }),
          /* @__PURE__ */ e(d, { className: "cm:grid cm:gap-1 cm:text-sm", children: t.refunds.map((o) => /* @__PURE__ */ n("p", { children: [
            o.amount,
            " · ",
            L(o.created_at),
            o.reason ? ` · ${o.reason}` : "",
            o.restock ? " · restocked" : ""
          ] }, o.id)) })
        ] }),
        l.map((o) => {
          const E = Ie[o.key];
          return E ? /* @__PURE__ */ n(r, { children: [
            /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: o.label }) }),
            /* @__PURE__ */ e(d, { children: /* @__PURE__ */ e(E, { order: t, data: o.data }) })
          ] }, o.key) : null;
        }),
        /* @__PURE__ */ n(r, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "Timeline" }) }),
          /* @__PURE__ */ n(d, { className: "cm:grid cm:gap-4", children: [
            s.edit && /* @__PURE__ */ n("form", { className: "cm:grid cm:gap-2", onSubmit: (o) => {
              o.preventDefault(), Q.post(w(`${F}/notes`), { preserveScroll: !0, onSuccess: () => Q.reset() });
            }, children: [
              /* @__PURE__ */ e(x, { htmlFor: "o-note", className: "cm:sr-only", children: "Note" }),
              /* @__PURE__ */ e(y, { id: "o-note", placeholder: "Add a note…", value: Q.data.message, onChange: (o) => Q.setData("message", o.target.value) }),
              /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:justify-between cm:gap-2", children: [
                /* @__PURE__ */ n("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
                  /* @__PURE__ */ e(h, { checked: Q.data.customer, onCheckedChange: (o) => Q.setData("customer", o === !0) }),
                  " Send to the customer"
                ] }),
                /* @__PURE__ */ e(u, { size: "sm", type: "submit", disabled: Q.processing || Q.data.message.trim() === "", children: "Add note" })
              ] })
            ] }),
            /* @__PURE__ */ e("ol", { className: "cm:grid cm:gap-3 cm:text-sm", children: t.timeline.map((o) => /* @__PURE__ */ n("li", { className: "cm:grid cm:gap-0.5 cm:border-l-2 cm:pl-3", style: { borderColor: o.visibility === "customer" ? "var(--color-primary, currentColor)" : void 0 }, children: [
              /* @__PURE__ */ e("span", { className: "cm:whitespace-pre-line", children: o.message }),
              /* @__PURE__ */ n("span", { className: "cm:text-xs cm:text-muted-foreground", children: [
                L(o.created_at),
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
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "Customer" }) }),
          /* @__PURE__ */ n(d, { className: "cm:grid cm:gap-1 cm:text-sm", children: [
            /* @__PURE__ */ e("p", { className: "cm:font-medium", children: t.customer.href ? /* @__PURE__ */ e($, { href: w(t.customer.href), className: "cm:hover:underline", children: t.customer.name ?? t.customer.email }) : t.customer.name ?? t.customer.email }),
            t.customer.email && /* @__PURE__ */ e("a", { href: `mailto:${t.customer.email}`, className: "cm:text-muted-foreground cm:hover:underline", children: t.customer.email }),
            t.customer.phone && /* @__PURE__ */ e("a", { href: `https://wa.me/${t.customer.phone.replace(/\D/g, "")}`, target: "_blank", rel: "noreferrer", className: "cm:text-muted-foreground cm:hover:underline", children: t.customer.phone }),
            t.customer.guest && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: "Guest checkout" })
          ] })
        ] }),
        /* @__PURE__ */ n(r, { children: [
          /* @__PURE__ */ n(m, { className: "cm:flex cm:flex-row cm:items-center cm:justify-between", children: [
            /* @__PURE__ */ e(k, { children: "Addresses" }),
            s.edit_addresses && /* @__PURE__ */ e(u, { size: "sm", variant: "ghost", asChild: !0, children: /* @__PURE__ */ e($, { href: w(`${F}/addresses`), children: "Edit" }) })
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
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "From the customer" }) }),
          /* @__PURE__ */ n(d, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            t.customer_note && /* @__PURE__ */ e("p", { className: "cm:whitespace-pre-line", children: t.customer_note }),
            t.fields && Object.entries(t.fields).map(([o, E]) => /* @__PURE__ */ n("p", { children: [
              /* @__PURE__ */ n("span", { className: "cm:text-muted-foreground", children: [
                o.replace(/_/g, " "),
                ":"
              ] }),
              " ",
              String(E ?? "")
            ] }, o))
          ] })
        ] }),
        /* @__PURE__ */ n(r, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "Details" }) }),
          /* @__PURE__ */ n(d, { className: "cm:grid cm:gap-1 cm:text-sm", children: [
            t.payment_method_title && /* @__PURE__ */ n("p", { children: [
              "Payment: ",
              t.payment_method_title
            ] }),
            t.expires_at && t.payment_status === "unpaid" && /* @__PURE__ */ n("p", { children: [
              "Pay before ",
              L(t.expires_at)
            ] }),
            t.paid_at && /* @__PURE__ */ n("p", { children: [
              "Paid ",
              L(t.paid_at)
            ] }),
            t.completed_at && /* @__PURE__ */ n("p", { children: [
              "Completed ",
              L(t.completed_at)
            ] }),
            t.cancelled_at && /* @__PURE__ */ n("p", { children: [
              "Cancelled ",
              L(t.cancelled_at),
              t.cancel_reason ? ` — ${t.cancel_reason}` : ""
            ] }),
            t.quote_valid_until && /* @__PURE__ */ n("p", { children: [
              "Quote valid until ",
              L(t.quote_valid_until)
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
    /* @__PURE__ */ e(f, { open: S !== null, onOpenChange: (o) => !o && U(null), children: /* @__PURE__ */ n(p, { children: [
      /* @__PURE__ */ n(b, { children: [
        /* @__PURE__ */ e(v, { children: S?.to === "cancelled" ? "Cancel this order?" : "Put this order on hold?" }),
        /* @__PURE__ */ e(_, { children: S?.to === "cancelled" ? "Stock, flash sale quantities and voucher uses are given back." : "It can go back to its status later." })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ e(x, { htmlFor: "o-reason", children: "Reason (on the timeline)" }),
        /* @__PURE__ */ e(g, { id: "o-reason", value: se, onChange: (o) => ge(o.target.value) })
      ] }),
      /* @__PURE__ */ n(a, { children: [
        /* @__PURE__ */ e(u, { variant: "outline", onClick: () => U(null), children: "Back" }),
        /* @__PURE__ */ e(u, { onClick: () => S && xe(S.to, se), children: "Confirm" })
      ] })
    ] }) }),
    /* @__PURE__ */ e(f, { open: de, onOpenChange: N, children: /* @__PURE__ */ n(p, { children: [
      /* @__PURE__ */ n(b, { children: [
        /* @__PURE__ */ e(v, { children: "Mark as paid" }),
        /* @__PURE__ */ n(_, { children: [
          "Record a payment you received outside the store (",
          t.totals.total,
          ")."
        ] })
      ] }),
      /* @__PURE__ */ n("form", { className: "cm:grid cm:gap-3", onSubmit: (o) => {
        o.preventDefault(), J.post(w(`${F}/mark-paid`), { preserveScroll: !0, onSuccess: () => N(!1) });
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
  const { DataTable: t } = ne, { Button: i } = T, { Link: s } = R;
  return M(), A.useBreadcrumbs([{ label: "Shop", href: w("commerce") }, { label: "Products" }]), /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      W,
      {
        title: "Products",
        description: "Products are entries: opening one goes to the editor.",
        actions: /* @__PURE__ */ e(i, { asChild: !0, children: /* @__PURE__ */ e(s, { href: w(c.createUrl), children: "New product" }) })
      }
    ),
    /* @__PURE__ */ e(
      t,
      {
        ...c,
        searchPlaceholder: "Search titles or SKUs…",
        rowHref: (l) => w(l.href),
        renderCell: (l, r) => {
          switch (r.key) {
            case "product_title":
              return /* @__PURE__ */ n("span", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ e("span", { className: "cm:font-medium", children: l.product_title }),
                l.featured && /* @__PURE__ */ e(j, { tone: "info", children: "Featured" }),
                l.sync_failed && /* @__PURE__ */ e("span", { title: l.sync_error ?? "", children: /* @__PURE__ */ e(j, { tone: "error", children: "Can't be bought" }) })
              ] });
            case "state":
              return /* @__PURE__ */ e(j, { tone: Ze[l.state], children: l.state });
            case "stock":
              return l.stock === null ? "—" : /* @__PURE__ */ e("span", { className: l.in_stock === !1 ? "cm:text-destructive" : "", children: l.stock });
            case "type":
              return /* @__PURE__ */ e(j, { children: l.type });
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
      href: w(l.href),
      "aria-current": l.key === t ? "page" : void 0,
      className: me(
        "cm:whitespace-nowrap cm:rounded-md cm:px-3 cm:py-1.5 cm:text-sm cm:text-muted-foreground cm:hover:bg-muted cm:hover:text-foreground",
        l.key === t && "cm:bg-muted cm:font-medium cm:text-foreground"
      ),
      children: l.label
    },
    l.key
  )) });
}
function he({ sections: c, current: t, title: i, description: s, children: l }) {
  const { SettingsTabs: r } = ne;
  return M(), A.useBreadcrumbs([{ label: "Settings", href: w("settings") }, { label: "Store", href: w("commerce/settings") }, { label: i }]), /* @__PURE__ */ n("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(r, { current: "store" }),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6 cm:md:grid-cols-[12rem_1fr]", children: [
      /* @__PURE__ */ e(je, { items: c, current: t, label: "Store settings" }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:min-w-0 cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ e(W, { title: i, description: s }),
        l
      ] })
    ] })
  ] });
}
function tt({ sections: c, mode: t, groups: i, updateUrl: s }) {
  const { Card: l, CardContent: r, CardHeader: d, CardTitle: m, Switch: k, Button: u, Dialog: y, DialogContent: x, DialogDescription: h, DialogFooter: g, DialogHeader: f, DialogTitle: p } = T, { errors: a } = R.usePage().props, [b, v] = D.useState(null), [_, $] = D.useState(null), C = (F, S) => {
    $(F.key), R.router.put(s.replace("__key__", F.key), { on: S }, { preserveScroll: !0, onFinish: () => $(null) });
  };
  return /* @__PURE__ */ n(
    he,
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
        a.feature && /* @__PURE__ */ e("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: a.feature }),
        i.map((F) => /* @__PURE__ */ n(l, { children: [
          /* @__PURE__ */ e(d, { children: /* @__PURE__ */ e(m, { children: F.label }) }),
          /* @__PURE__ */ e(r, { className: "cm:grid cm:gap-0 cm:divide-y cm:divide-border", children: F.features.map((S) => /* @__PURE__ */ n("div", { className: "cm:flex cm:items-start cm:justify-between cm:gap-4 cm:py-3 cm:first:pt-0 cm:last:pb-0", children: [
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
              k,
              {
                id: `feature-${S.key}`,
                checked: S.switched_on,
                disabled: S.core || _ === S.key,
                onCheckedChange: (U) => !U && S.dependents.length > 0 ? v(S) : C(S, U)
              }
            )
          ] }, S.key)) })
        ] }, F.key)),
        /* @__PURE__ */ e(y, { open: b !== null, onOpenChange: (F) => !F && v(null), children: /* @__PURE__ */ n(x, { children: [
          /* @__PURE__ */ n(f, { children: [
            /* @__PURE__ */ n(p, { children: [
              "Switch off ",
              b?.label,
              "?"
            ] }),
            /* @__PURE__ */ n(h, { children: [
              "These are switched off with it: ",
              b?.dependents.map((F) => F.label).join(", "),
              ". Their data is kept."
            ] })
          ] }),
          /* @__PURE__ */ n(g, { children: [
            /* @__PURE__ */ e(u, { variant: "outline", onClick: () => v(null), children: "Cancel" }),
            /* @__PURE__ */ e(
              u,
              {
                variant: "destructive",
                onClick: () => {
                  b && C(b, !1), v(null);
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
function nt({ sections: c, methods: t, instanceTypes: i }) {
  const { Card: s, CardContent: l, Button: r, Switch: d } = T, { Link: m, router: k } = R, u = (y, x) => k.post(w("commerce/settings/payments/move"), { key: y, direction: x }, { preserveScroll: !0 });
  return /* @__PURE__ */ n(he, { sections: c, current: "payments", title: "Payments", description: "Payment methods offered at checkout and on the pay page, in this order.", children: [
    t.length === 0 && /* @__PURE__ */ e(ue, { title: "No payment methods", description: "Switch on Bank transfer, QRIS and cash on delivery in Features, or install a gateway package." }),
    t.length > 0 && /* @__PURE__ */ e(s, { children: /* @__PURE__ */ e(l, { className: "cm:p-0", children: /* @__PURE__ */ e("ul", { className: "cm:divide-y cm:divide-border", children: t.map((y, x) => /* @__PURE__ */ n("li", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:px-4 cm:py-3", children: [
      /* @__PURE__ */ n("div", { className: "cm:min-w-0", children: [
        /* @__PURE__ */ e(m, { href: w(y.edit_url), className: "cm:font-medium cm:hover:underline", children: y.title }),
        /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
          y.type,
          y.instance ? ` · ${y.key}` : ""
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
        !y.active && /* @__PURE__ */ e(j, { children: "Off" }),
        /* @__PURE__ */ e(r, { variant: "ghost", size: "sm", "aria-label": "Move up", disabled: x === 0, onClick: () => u(y.key, "up"), children: "↑" }),
        /* @__PURE__ */ e(r, { variant: "ghost", size: "sm", "aria-label": "Move down", disabled: x === t.length - 1, onClick: () => u(y.key, "down"), children: "↓" }),
        /* @__PURE__ */ e(
          d,
          {
            checked: y.active,
            "aria-label": `${y.title} active`,
            onCheckedChange: (h) => k.put(w(`commerce/settings/payments/${y.key}/active`), { active: h }, { preserveScroll: !0 })
          }
        )
      ] })
    ] }, y.key)) }) }) }),
    i.length > 0 && /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:gap-2", children: i.map((y) => /* @__PURE__ */ n(r, { variant: "outline", onClick: () => k.post(w("commerce/settings/payments/instances"), { type: y.key }), children: [
      "Add ",
      y.label.toLowerCase()
    ] }, y.key)) })
  ] });
}
function ye({ form: c, footer: t }) {
  const { FieldRenderer: i } = ne, { Button: s } = T, { data: l, setData: r, errors: d, processing: m, isDirty: k, ...u } = R.useForm({ values: c.values });
  return /* @__PURE__ */ n(
    "form",
    {
      className: "cm:grid cm:gap-6",
      onSubmit: (y) => {
        y.preventDefault(), u[c.method](c.action, { preserveScroll: !0 });
      },
      children: [
        d.section && /* @__PURE__ */ e("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: d.section }),
        /* @__PURE__ */ e(
          i,
          {
            fields: c.fields,
            values: l.values,
            errors: d,
            pathPrefix: "values",
            onChange: (y) => r("values", y)
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
function ct({ section: c, sections: t, form: i }) {
  return /* @__PURE__ */ e(he, { sections: t, current: c.key, title: `${c.label} settings`, children: /* @__PURE__ */ e(ye, { form: i }, c.key) });
}
function at({ sections: c, zones: t, types: i, couriers: s, moveUrl: l }) {
  const { Card: r, CardContent: d, CardHeader: m, CardTitle: k, Button: u, Select: y, SelectContent: x, SelectItem: h, SelectTrigger: g, SelectValue: f } = T, { Link: p } = R, a = (b, v, _) => R.router.post(w(l), { kind: b, id: v, direction: _ }, { preserveScroll: !0 });
  return /* @__PURE__ */ n(
    he,
    {
      sections: c,
      current: "shipping",
      title: "Shipping",
      description: "Zones are checked in order and the first one matching the address gives its methods. Pickup methods are offered everywhere.",
      children: [
        /* @__PURE__ */ e("div", { className: "cm:flex cm:justify-end", children: /* @__PURE__ */ e(u, { asChild: !0, children: /* @__PURE__ */ e(p, { href: w("commerce/settings/shipping/zones/create"), children: "Add zone" }) }) }),
        t.length === 0 && /* @__PURE__ */ e(ue, { title: "No shipping zones yet", description: "Without a zone, checkout offers no shipping. Add one for your country or provinces." }),
        t.map((b, v) => /* @__PURE__ */ n(r, { children: [
          /* @__PURE__ */ n(m, { className: "cm:flex cm:flex-row cm:items-start cm:justify-between cm:gap-4", children: [
            /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ n(k, { className: "cm:flex cm:items-center cm:gap-2", children: [
                b.name,
                b.everywhere_else && /* @__PURE__ */ e(j, { tone: "info", children: "Everywhere else" })
              ] }),
              !b.everywhere_else && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: b.regions.length > 0 ? b.regions.join(", ") : "No regions" })
            ] }),
            /* @__PURE__ */ n("div", { className: "cm:flex cm:shrink-0 cm:gap-1", children: [
              /* @__PURE__ */ e(u, { variant: "ghost", size: "sm", "aria-label": "Move up", disabled: v === 0, onClick: () => a("zone", b.id, "up"), children: "↑" }),
              /* @__PURE__ */ e(u, { variant: "ghost", size: "sm", "aria-label": "Move down", disabled: v === t.length - 1, onClick: () => a("zone", b.id, "down"), children: "↓" }),
              /* @__PURE__ */ e(u, { variant: "outline", size: "sm", asChild: !0, children: /* @__PURE__ */ e(p, { href: w(b.edit_url), children: "Edit" }) })
            ] })
          ] }),
          /* @__PURE__ */ n(d, { className: "cm:grid cm:gap-3", children: [
            b.methods.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No methods in this zone." }),
            b.methods.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:divide-y cm:divide-border cm:rounded-md cm:border", children: b.methods.map((_, $) => /* @__PURE__ */ n("li", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:px-3 cm:py-2", children: [
              /* @__PURE__ */ n("div", { className: "cm:min-w-0", children: [
                /* @__PURE__ */ e(p, { href: w(_.edit_url), className: "cm:font-medium cm:hover:underline", children: _.title }),
                /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  _.type,
                  _.etd ? ` · ${_.etd}` : ""
                ] })
              ] }),
              /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:gap-1", children: [
                !_.active && /* @__PURE__ */ e(j, { children: "Inactive" }),
                /* @__PURE__ */ e(u, { variant: "ghost", size: "sm", "aria-label": "Move up", disabled: $ === 0, onClick: () => a("method", _.id, "up"), children: "↑" }),
                /* @__PURE__ */ e(u, { variant: "ghost", size: "sm", "aria-label": "Move down", disabled: $ === b.methods.length - 1, onClick: () => a("method", _.id, "down"), children: "↓" })
              ] })
            ] }, _.id)) }),
            /* @__PURE__ */ e("div", { children: /* @__PURE__ */ n(y, { value: "", onValueChange: (_) => R.router.visit(w(`commerce/settings/shipping/zones/${b.id}/methods/create?type=${_}`)), children: [
              /* @__PURE__ */ e(g, { className: "cm:w-48", "aria-label": `Add a method to ${b.name}`, children: /* @__PURE__ */ e(f, { placeholder: "Add method…" }) }),
              /* @__PURE__ */ e(x, { children: i.map((_) => /* @__PURE__ */ e(h, { value: _.key, children: _.label }, _.key)) })
            ] }) })
          ] })
        ] }, b.id)),
        /* @__PURE__ */ n(r, { children: [
          /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(k, { children: "Courier presets" }) }),
          /* @__PURE__ */ n(d, { children: [
            /* @__PURE__ */ e("p", { className: "cm:mb-3 cm:text-sm cm:text-muted-foreground", children: "Offered when adding a shipment; the tracking link is filled in from the tracking number. Add more in config/commerce.php or with Commerce::registerCourier()." }),
            /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1 cm:text-sm cm:sm:grid-cols-2", children: s.map((b) => /* @__PURE__ */ n("li", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e("span", { className: "cm:font-medium", children: b.name }),
              !b.tracking_url && /* @__PURE__ */ e("span", { className: "cm:text-xs cm:text-muted-foreground", children: "(no tracking link)" })
            ] }, b.key)) })
          ] })
        ] })
      ]
    }
  );
}
function rt({ title: c, description: t, form: i, breadcrumbs: s = [], deleteUrl: l, deleteConfirm: r }) {
  const { Button: d } = T;
  return M(), A.useBreadcrumbs([...s.map((m) => ({ ...m, href: m.href ? w(m.href) : void 0 })), { label: c }]), /* @__PURE__ */ n("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-3xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(W, { title: c, description: t }),
    /* @__PURE__ */ e(ye, { form: i, footer: l ? /* @__PURE__ */ e(
      d,
      {
        type: "button",
        variant: "ghost",
        className: "cm:ml-auto cm:text-destructive",
        onClick: () => window.confirm(r ?? "Delete this?") && R.router.delete(w(l)),
        children: "Delete"
      }
    ) : null })
  ] });
}
function it(c) {
  const { DataTable: t } = ne, { Button: i } = T, { Link: s } = R;
  return M(), A.useBreadcrumbs([{ label: "Shop", href: w("commerce") }, { label: c.title }]), /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      W,
      {
        title: c.title,
        description: c.description,
        actions: c.createUrl ? /* @__PURE__ */ e(i, { asChild: !0, children: /* @__PURE__ */ e(s, { href: w(c.createUrl), children: c.createLabel ?? "New" }) }) : null
      }
    ),
    /* @__PURE__ */ e(
      t,
      {
        ...c,
        bulkUrl: c.bulkUrl ? w(c.bulkUrl) : void 0,
        rowHref: (l) => l.href ? w(l.href) : null,
        renderCell: (l, r) => r.type === "badge" && l[r.key] != null ? /* @__PURE__ */ e(j, { tone: l[`${r.key}_tone`] ?? "neutral", children: String(l[r.key]) }) : void 0
      }
    )
  ] });
}
const lt = {
  "Commerce/Confirmations/Index": ze,
  "Commerce/Customers/Show": Me,
  "Commerce/Dashboard": Ue,
  "Commerce/Inventory/Index": We,
  "Commerce/Orders/Editor": Ve,
  "Commerce/Orders/Show": Ye,
  "Commerce/Products/Index": et,
  "Commerce/Settings/Section": ct,
  "Commerce/Settings/Features": tt,
  "Commerce/Settings/Payments": nt,
  "Commerce/Settings/Shipping": at,
  "Commerce/Shared/SchemaForm": rt,
  "Commerce/Shared/ResourceIndex": it
};
function st() {
  Object.entries(lt).forEach(([c, t]) => A.registerPage(c, t));
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
function dt({ value: c, onChange: t, pathPrefix: i }) {
  const { Input: s, Label: l } = T, r = { start: c?.start ?? null, end: c?.end ?? null };
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(l, { htmlFor: `${i}-start`, children: "Starts" }),
      /* @__PURE__ */ e(
        s,
        {
          id: `${i}-start`,
          type: "datetime-local",
          value: Ce(r.start),
          onChange: (d) => t({ ...r, start: we(d.target.value) })
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
          value: Ce(r.end),
          onChange: (d) => t({ ...r, end: we(d.target.value) })
        }
      )
    ] })
  ] });
}
function ot({ field: c, value: t, onChange: i, errors: s, pathPrefix: l }) {
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
function mt({ field: c, value: t, onChange: i, pathPrefix: s }) {
  const { Input: l, Badge: r } = T, d = c.config ?? {}, m = Array.isArray(t) ? t : [], [k, u] = D.useState(""), [y, x] = D.useState([]), [h, g] = D.useState(!1);
  D.useEffect(() => {
    if (!h) return;
    const a = new URLSearchParams({ q: k });
    (d.types ?? []).forEach((v) => a.append("types[]", v)), (d.taxonomies ?? []).forEach((v) => a.append("taxonomies[]", v));
    const b = setTimeout(() => G(`${d.api}?${a}`).then((v) => x(v.data)).catch(() => x([])), 200);
    return () => clearTimeout(b);
  }, [k, h]);
  const f = (a) => m.some((b) => b.type === a.type && b.id === a.id), p = { product: "Product", variant: "Variant", term: "Category/brand" };
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-2", children: [
    m.length > 0 && /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: m.map((a) => /* @__PURE__ */ n(r, { variant: "secondary", className: "cm:gap-1", children: [
      /* @__PURE__ */ n("span", { className: "cm:text-muted-foreground", children: [
        p[a.type],
        ":"
      ] }),
      " ",
      a.label,
      /* @__PURE__ */ e("button", { type: "button", "aria-label": `Remove ${a.label}`, onClick: () => i(m.filter((b) => !(b.type === a.type && b.id === a.id))), children: "×" })
    ] }, `${a.type}:${a.id}`)) }),
    /* @__PURE__ */ n("div", { className: "cm:relative", children: [
      /* @__PURE__ */ e(
        l,
        {
          id: s,
          value: k,
          placeholder: "Search products, SKUs, categories, brands…",
          onFocus: () => g(!0),
          onBlur: () => setTimeout(() => g(!1), 150),
          onChange: (a) => u(a.target.value)
        }
      ),
      h && y.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-20 cm:mt-1 cm:max-h-72 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: y.map((a) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: f(a),
          className: "cm:flex cm:w-full cm:justify-between cm:gap-3 cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted cm:disabled:opacity-50",
          onMouseDown: (b) => b.preventDefault(),
          onClick: () => {
            i([...m, { type: a.type, id: a.id, label: a.label }]), u("");
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
function ut(c) {
  let t = [{}];
  for (const i of c) {
    if (i.values.length === 0) return [];
    const s = [];
    for (const l of t)
      for (const r of i.values)
        s.push({ ...l, [i.id]: r.id });
    t = s;
  }
  return c.length === 0 ? [] : t;
}
function ht(c, t, i, s = 100) {
  const l = new Map(t.map((r) => [$e(r.options), r]));
  return ut(c).slice(0, s).map((r) => {
    const d = l.get($e(r));
    return d ? { ...d, options: r } : { ...i, id: V(), sku: null, options: r, active: !0, price: i.price ?? 0 };
  });
}
function Re(c, t, i = {}) {
  return c.map((s) => {
    const l = s.values.find((r) => r.id === t.options[s.id]);
    return l ? l.label ?? (l.term_id ? i[l.term_id] ?? `#${l.term_id}` : "?") : "?";
  }).join(" / ");
}
function q({ label: c, hint: t, children: i, htmlFor: s, className: l }) {
  const { Label: r } = T;
  return /* @__PURE__ */ n("div", { className: me("cm:grid cm:gap-1.5", l), children: [
    /* @__PURE__ */ e(r, { htmlFor: s, children: c }),
    i,
    t && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: t })
  ] });
}
function ie({ children: c, cols: t = 3 }) {
  return /* @__PURE__ */ e("div", { className: me("cm:grid cm:gap-4", { 2: "cm:sm:grid-cols-2", 3: "cm:sm:grid-cols-2 cm:lg:grid-cols-3", 4: "cm:sm:grid-cols-2 cm:lg:grid-cols-4" }[t]), children: c });
}
function B({ id: c, value: t, onChange: i, min: s = 0, placeholder: l }) {
  const { Input: r } = T;
  return /* @__PURE__ */ e(
    r,
    {
      id: c,
      type: "number",
      inputMode: "numeric",
      min: s,
      value: t ?? "",
      placeholder: l,
      onChange: (d) => i(d.target.value === "" ? null : Math.round(Number(d.target.value)))
    }
  );
}
function le({ id: c, value: t, onChange: i, placeholder: s, onBlur: l }) {
  const { Input: r } = T;
  return /* @__PURE__ */ e(
    r,
    {
      id: c,
      value: t ?? "",
      placeholder: s,
      onBlur: l,
      onChange: (d) => i(d.target.value === "" ? null : d.target.value)
    }
  );
}
function Y({ id: c, value: t, onChange: i, nullable: s = !0 }) {
  return /* @__PURE__ */ e(te, { id: c, value: t, allowNull: s, onChange: i });
}
function ae({ id: c, label: t, checked: i, onChange: s, hint: l }) {
  const { Switch: r, Label: d } = T;
  return /* @__PURE__ */ n("div", { className: "cm:flex cm:items-start cm:gap-3", children: [
    /* @__PURE__ */ e(r, { id: c, checked: i, onCheckedChange: s }),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-0.5", children: [
      /* @__PURE__ */ e(d, { htmlFor: c, children: t }),
      l && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: l })
    ] })
  ] });
}
const pt = "cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm";
function z({ id: c, value: t, onChange: i, options: s }) {
  return /* @__PURE__ */ e("select", { id: c, className: pt, value: t, onChange: (l) => i(l.target.value), children: s.map(([l, r]) => /* @__PURE__ */ e("option", { value: l, children: r }, l)) });
}
function K({ title: c, description: t, children: i, actions: s }) {
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
function gt({ value: c, update: t, path: i }) {
  const { Button: s, Input: l } = T, r = c.bundle ?? { pricing: "fixed", value: 0, items: [] }, [d, m] = D.useState({}), [k, u] = D.useState(""), [y, x] = D.useState([]), h = r.items.map((p) => p.variant_id).filter((p) => !!p);
  D.useEffect(() => {
    const p = h.filter((a) => !d[a]);
    p.length !== 0 && G(w(`commerce/api/variants?${p.map((a) => `ids[]=${a}`).join("&")}`)).then((a) => m((b) => ({ ...b, ...Object.fromEntries(a.data.map((v) => [v.id, v])) }))).catch(() => {
    });
  }, [h.join(",")]), D.useEffect(() => {
    if (k.trim().length < 2) return x([]);
    const p = setTimeout(() => G(w(`commerce/api/variants?q=${encodeURIComponent(k)}`)).then((a) => x(a.data)).catch(() => {
    }), 250);
    return () => clearTimeout(p);
  }, [k]);
  const g = (p) => t({ bundle: { ...r, ...p } }), f = r.items.reduce((p, a) => p + (d[a.variant_id ?? 0]?.price ?? 0) * a.quantity, 0);
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ n(K, { title: "Products in the bundle", description: "Bundles take their stock from these products.", children: [
      r.items.map((p, a) => /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ e("span", { className: "cm:flex-1 cm:text-sm", children: d[p.variant_id ?? 0]?.label ?? `#${p.variant_id}` }),
        /* @__PURE__ */ e("div", { className: "cm:w-24", children: /* @__PURE__ */ e(B, { min: 1, value: p.quantity, onChange: (b) => g({ items: r.items.map((v, _) => _ === a ? { ...v, quantity: b ?? 1 } : v) }) }) }),
        /* @__PURE__ */ e(s, { type: "button", variant: "ghost", size: "sm", onClick: () => g({ items: r.items.filter((b, v) => v !== a) }), children: "Remove" })
      ] }, a)),
      /* @__PURE__ */ n("div", { className: "cm:relative", children: [
        /* @__PURE__ */ e(l, { value: k, placeholder: "Search products or SKUs to add…", "aria-label": "Add a product to the bundle", onChange: (p) => u(p.target.value) }),
        y.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-10 cm:mt-1 cm:max-h-64 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: y.map((p) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ n(
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
    /* @__PURE__ */ e(K, { title: "Bundle price", description: `The products cost ${re(f)} together.`, children: /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(q, { label: "Price", htmlFor: `${i}-bundle-pricing`, children: /* @__PURE__ */ e(
        z,
        {
          id: `${i}-bundle-pricing`,
          value: r.pricing,
          onChange: (p) => g({ pricing: p, value: 0 }),
          options: [["fixed", "Its own price (General tab)"], ["percent_off", "Total minus a percentage"], ["amount_off", "Total minus an amount"]]
        }
      ) }),
      r.pricing === "percent_off" && /* @__PURE__ */ e(q, { label: "Percent off", htmlFor: `${i}-bundle-value`, children: /* @__PURE__ */ e(B, { id: `${i}-bundle-value`, value: r.value / 100, onChange: (p) => g({ value: Math.round((p ?? 0) * 100) }) }) }),
      r.pricing === "amount_off" && /* @__PURE__ */ e(q, { label: "Amount off", htmlFor: `${i}-bundle-value`, children: /* @__PURE__ */ e(Y, { id: `${i}-bundle-value`, value: r.value, nullable: !1, onChange: (p) => g({ value: p ?? 0 }) }) })
    ] }) })
  ] });
}
function ft() {
  return decodeURIComponent(document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/)?.[1] ?? "");
}
function vt({ value: c, update: t, path: i }) {
  const { Button: s } = T, [l, r] = D.useState(!1), d = D.useRef(null), m = c.delivery ?? { modes: ["link", "account"], download_limit: null, expiry_days: null }, k = (x) => t({ delivery: { ...m, ...x } }), u = (x, h) => t({ downloads: c.downloads.map((g, f) => f === x ? { ...g, ...h } : g) }), y = async (x) => {
    if (x?.length) {
      r(!0);
      try {
        const h = [];
        for (const g of Array.from(x)) {
          const f = new FormData();
          f.append("file", g);
          const p = await fetch(w("commerce/api/downloads"), { method: "POST", body: f, headers: { "X-XSRF-TOKEN": ft(), Accept: "application/json" }, credentials: "same-origin" }), a = await p.json();
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
      K,
      {
        title: "Files and links",
        description: "Files are stored privately and only served to customers who bought them.",
        actions: /* @__PURE__ */ n("div", { className: "cm:flex cm:gap-2", children: [
          /* @__PURE__ */ e(s, { type: "button", variant: "outline", size: "sm", disabled: l, onClick: () => d.current?.click(), children: l ? "Uploading…" : "Upload file" }),
          /* @__PURE__ */ e(s, { type: "button", variant: "outline", size: "sm", onClick: () => t({ downloads: [...c.downloads, { id: V(), type: "url", file_id: null, url: null, name: "" }] }), children: "Add link" }),
          /* @__PURE__ */ e("input", { ref: d, type: "file", multiple: !0, hidden: !0, onChange: (x) => y(x.target.files) })
        ] }),
        children: [
          c.downloads.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No files yet." }),
          c.downloads.map((x, h) => /* @__PURE__ */ n("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(q, { label: "Name", htmlFor: `${i}-dl-${h}`, children: /* @__PURE__ */ e(le, { id: `${i}-dl-${h}`, value: x.name, onChange: (g) => u(h, { name: g ?? "" }) }) }),
            x.type === "url" ? /* @__PURE__ */ e(q, { label: "Link", htmlFor: `${i}-dl-${h}-url`, children: /* @__PURE__ */ e(le, { id: `${i}-dl-${h}-url`, value: x.url, placeholder: "https://", onChange: (g) => u(h, { url: g }) }) }) : /* @__PURE__ */ e(q, { label: "File", children: /* @__PURE__ */ e("p", { className: "cm:truncate cm:text-sm cm:text-muted-foreground", children: x.file?.filename ?? `File #${x.file_id}` }) }),
            /* @__PURE__ */ e(s, { type: "button", variant: "ghost", size: "sm", onClick: () => t({ downloads: c.downloads.filter((g, f) => f !== h) }), children: "Remove" })
          ] }, x.id ?? h))
        ]
      }
    ),
    /* @__PURE__ */ n(K, { title: "Delivery", children: [
      /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-3", children: [["attachment", "Attach files to the email"], ["link", "Download links in the email"], ["account", "Library in My Account"]].map(([x, h]) => /* @__PURE__ */ e(
        ae,
        {
          id: `${i}-mode-${x}`,
          label: h,
          checked: m.modes.includes(x),
          onChange: (g) => k({ modes: g ? [...m.modes, x] : m.modes.filter((f) => f !== x) })
        },
        x
      )) }),
      /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
        /* @__PURE__ */ e(q, { label: "Downloads per file", htmlFor: `${i}-limit`, hint: "Empty: unlimited.", children: /* @__PURE__ */ e(B, { id: `${i}-limit`, min: 1, value: m.download_limit, onChange: (x) => k({ download_limit: x }) }) }),
        /* @__PURE__ */ e(q, { label: "Links expire after (days)", htmlFor: `${i}-expiry`, hint: "Empty: never.", children: /* @__PURE__ */ e(B, { id: `${i}-expiry`, min: 1, value: m.expiry_days, onChange: (x) => k({ expiry_days: x }) }) })
      ] })
    ] })
  ] });
}
function Pe({ id: c, value: t, onChange: i, entryId: s }) {
  const [l, r] = D.useState(null);
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-1", children: [
    /* @__PURE__ */ e(le, { id: c, value: t, onChange: (m) => {
      r(null), i(m);
    }, onBlur: () => {
      if (!t) return r(null);
      const m = new URLSearchParams({ sku: t, entry: String(s ?? 0) });
      G(w(`commerce/api/sku-check?${m}`)).then((k) => r(k.available ? null : k.product ?? "another product")).catch(() => r(null));
    } }),
    l && /* @__PURE__ */ n("p", { className: "cm:text-xs cm:text-destructive", children: [
      "Already used by ",
      l,
      "."
    ] })
  ] });
}
const bt = [
  ["default", "Follow the store (selling mode)"],
  ["cart", "Add to cart"],
  ["inquiry", "Inquiry form"],
  ["whatsapp", "Ask on WhatsApp"],
  ["external", "Links to other shops"],
  ["none", "No button (display only)"]
];
function yt({ value: c, update: t, updateVariant: i, config: s, entryId: l, path: r }) {
  const { Button: d } = T, m = [["simple", "Simple product"]];
  (s.features.variants || c.type === "variable") && m.push(["variable", "Variable product (sizes, colors…)"]), (s.features.bundles || c.type === "bundle") && m.push(["bundle", "Bundle of other products"]);
  const k = c.variants[0];
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ n(ie, { cols: 2, children: [
      /* @__PURE__ */ e(q, { label: "Product type", htmlFor: `${r}-type`, children: /* @__PURE__ */ e(z, { id: `${r}-type`, value: c.type, options: m, onChange: (u) => t({ type: u }) }) }),
      /* @__PURE__ */ e(q, { label: "Button on the product page", htmlFor: `${r}-mode`, hint: "'Follow the store' uses the selling mode set in Settings → Store.", children: /* @__PURE__ */ e(z, { id: `${r}-mode`, value: c.purchase_mode, options: bt, onChange: (u) => t({ purchase_mode: u }) }) })
    ] }),
    c.type !== "variable" && k && /* @__PURE__ */ e(K, { title: "Price", children: /* @__PURE__ */ n(ie, { cols: 4, children: [
      /* @__PURE__ */ e(q, { label: "Price", htmlFor: `${r}-price`, children: /* @__PURE__ */ e(Y, { id: `${r}-price`, value: k.price, nullable: !1, onChange: (u) => i(0, { price: u ?? 0 }) }) }),
      /* @__PURE__ */ e(q, { label: "Compare-at price", htmlFor: `${r}-compare`, hint: "Shown struck through when higher.", children: /* @__PURE__ */ e(Y, { id: `${r}-compare`, value: k.compare_at_price, onChange: (u) => i(0, { compare_at_price: u }) }) }),
      /* @__PURE__ */ e(q, { label: "Cost", htmlFor: `${r}-cost`, hint: "For profit reports; never shown.", children: /* @__PURE__ */ e(Y, { id: `${r}-cost`, value: k.cost, onChange: (u) => i(0, { cost: u }) }) }),
      /* @__PURE__ */ e(q, { label: "SKU", htmlFor: `${r}-sku`, children: /* @__PURE__ */ e(Pe, { id: `${r}-sku`, value: k.sku, entryId: l, onChange: (u) => i(0, { sku: u }) }) })
    ] }) }),
    (c.purchase_mode === "external" || c.external_links.length > 0) && /* @__PURE__ */ e(
      K,
      {
        title: "Links to other shops",
        description: "Buttons such as 'Buy on Tokopedia'.",
        actions: c.external_links.length < 10 && /* @__PURE__ */ e(d, { type: "button", variant: "outline", size: "sm", onClick: () => t({ external_links: [...c.external_links, { preset: "tokopedia", label: null, url: null }] }), children: "Add link" }),
        children: c.external_links.map((u, y) => {
          const x = (h) => t({ external_links: c.external_links.map((g, f) => f === y ? { ...g, ...h } : g) });
          return /* @__PURE__ */ n("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[10rem_1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(q, { label: "Shop", htmlFor: `${r}-link-${y}-preset`, children: /* @__PURE__ */ e(
              z,
              {
                id: `${r}-link-${y}-preset`,
                value: u.preset ?? "",
                onChange: (h) => x({ preset: h || null }),
                options: [...Object.entries(s.link_presets), ["", "Other…"]]
              }
            ) }),
            /* @__PURE__ */ e(q, { label: "Button label", htmlFor: `${r}-link-${y}-label`, children: /* @__PURE__ */ e(le, { id: `${r}-link-${y}-label`, value: u.label, placeholder: u.preset ? `Buy on ${s.link_presets[u.preset]}` : "", onChange: (h) => x({ label: h }) }) }),
            /* @__PURE__ */ e(q, { label: "Link", htmlFor: `${r}-link-${y}-url`, children: /* @__PURE__ */ e(le, { id: `${r}-link-${y}-url`, value: u.url, placeholder: "https://", onChange: (h) => x({ url: h }) }) }),
            /* @__PURE__ */ e(d, { type: "button", variant: "ghost", size: "sm", onClick: () => t({ external_links: c.external_links.filter((h, g) => g !== y) }), children: "Remove" })
          ] }, y);
        })
      }
    ),
    /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(ae, { id: `${r}-shipping`, label: "Needs shipping", checked: c.requires_shipping, onChange: (u) => t({ requires_shipping: u }), hint: "Off for services and digital products." }),
      (s.features.digital || c.downloadable) && /* @__PURE__ */ e(ae, { id: `${r}-downloadable`, label: "Downloadable", checked: c.downloadable, onChange: (u) => t({ downloadable: u }), hint: "Customers get files or links after paying." }),
      /* @__PURE__ */ e(ae, { id: `${r}-featured`, label: "Featured", checked: c.featured, onChange: (u) => t({ featured: u }), hint: "Shown first when sorting by featured." })
    ] }),
    s.features.taxes && /* @__PURE__ */ e(q, { label: "Tax class", htmlFor: `${r}-tax`, children: /* @__PURE__ */ e(
      z,
      {
        id: `${r}-tax`,
        value: c.tax_class ?? "",
        onChange: (u) => t({ tax_class: u || null }),
        options: [["", "Standard"], ...s.tax_classes.filter((u) => u !== "standard").map((u) => [u, u])]
      }
    ) })
  ] });
}
function xt({ value: c, updateVariant: t, live: i, path: s }) {
  const l = c.variants[0];
  if (!l) return null;
  const r = i?.variants[l.id];
  return /* @__PURE__ */ n(K, { title: "Stock", children: [
    /* @__PURE__ */ e(
      ae,
      {
        id: `${s}-track`,
        label: "Track stock",
        checked: l.track_stock,
        onChange: (d) => t(0, { track_stock: d }),
        hint: "Count units: orders take them, cancellations give them back."
      }
    ),
    l.track_stock ? /* @__PURE__ */ n(ie, { cols: 3, children: [
      r?.track_stock && r.stock_quantity !== null ? /* @__PURE__ */ e(q, { label: "In stock", hint: "Change it in Shop → Inventory, so every change is recorded.", children: /* @__PURE__ */ e("p", { className: "cm:text-2xl cm:font-semibold", children: r.stock_quantity }) }) : /* @__PURE__ */ e(q, { label: "Starting stock", htmlFor: `${s}-initial`, hint: "Set once, when the product is published.", children: /* @__PURE__ */ e(B, { id: `${s}-initial`, value: l.initial_stock, onChange: (d) => t(0, { initial_stock: d }) }) }),
      /* @__PURE__ */ e(q, { label: "When sold out", htmlFor: `${s}-backorders`, children: /* @__PURE__ */ e(
        z,
        {
          id: `${s}-backorders`,
          value: l.backorders,
          onChange: (d) => t(0, { backorders: d }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }),
      /* @__PURE__ */ e(q, { label: "Low stock at", htmlFor: `${s}-low`, hint: "Empty: the store's setting.", children: /* @__PURE__ */ e(B, { id: `${s}-low`, value: l.low_stock_threshold, onChange: (d) => t(0, { low_stock_threshold: d }) }) })
    ] }) : /* @__PURE__ */ e(q, { label: "Stock status", htmlFor: `${s}-status`, children: /* @__PURE__ */ e(
      z,
      {
        id: `${s}-status`,
        value: l.stock_status,
        onChange: (d) => t(0, { stock_status: d }),
        options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
      }
    ) })
  ] });
}
function kt({ value: c, update: t, path: i }) {
  const { Button: s } = T, l = (r, d) => t({ tiers: c.tiers.map((m, k) => k === r ? { ...m, ...d } : m) });
  return /* @__PURE__ */ n(
    K,
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
        c.tiers.map((r, d) => /* @__PURE__ */ n("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[8rem_12rem_1fr_1fr_auto]", children: [
          /* @__PURE__ */ e(q, { label: "From (units)", htmlFor: `${i}-tier-${d}-min`, children: /* @__PURE__ */ e(B, { id: `${i}-tier-${d}-min`, min: 2, value: r.min_qty, onChange: (m) => l(d, { min_qty: m ?? 2 }) }) }),
          /* @__PURE__ */ e(q, { label: "Price", htmlFor: `${i}-tier-${d}-type`, children: /* @__PURE__ */ e(
            z,
            {
              id: `${i}-tier-${d}-type`,
              value: r.type,
              onChange: (m) => l(d, { type: m, value: 0 }),
              options: [["percent_off", "Percent off"], ["amount_off", "Amount off per unit"], ["fixed_price", "Fixed unit price"]]
            }
          ) }),
          /* @__PURE__ */ e(q, { label: r.type === "percent_off" ? "Percent" : "Amount", htmlFor: `${i}-tier-${d}-value`, children: r.type === "percent_off" ? /* @__PURE__ */ e(B, { id: `${i}-tier-${d}-value`, value: r.value / 100, onChange: (m) => l(d, { value: Math.round((m ?? 0) * 100) }) }) : /* @__PURE__ */ e(Y, { id: `${i}-tier-${d}-value`, value: r.value, nullable: !1, onChange: (m) => l(d, { value: m ?? 0 }) }) }),
          /* @__PURE__ */ e(q, { label: "For", htmlFor: `${i}-tier-${d}-variant`, children: /* @__PURE__ */ e(
            z,
            {
              id: `${i}-tier-${d}-variant`,
              value: r.variant ?? "",
              onChange: (m) => l(d, { variant: m || null }),
              options: [["", "All variants"], ...c.type === "variable" ? c.variants.map((m) => [m.id, Re(c.options, m)]) : []]
            }
          ) }),
          /* @__PURE__ */ e(s, { type: "button", variant: "ghost", size: "sm", onClick: () => t({ tiers: c.tiers.filter((m, k) => k !== d) }), children: "Remove" })
        ] }, d))
      ]
    }
  );
}
function Nt({ value: c, update: t, updateVariant: i, path: s }) {
  const l = c.variants[0];
  if (!l) return null;
  const r = (d) => c.type === "variable" ? t({ variants: c.variants.map((m) => ({ ...m, ...d })) }) : i(0, d);
  return /* @__PURE__ */ e(K, { title: "Package", description: c.type === "variable" ? "Applies to every variant; a variant can have its own weight under More." : "Used for shipping rates.", children: /* @__PURE__ */ n(ie, { cols: 4, children: [
    /* @__PURE__ */ e(q, { label: "Weight (grams)", htmlFor: `${s}-weight`, children: /* @__PURE__ */ e(B, { id: `${s}-weight`, value: l.weight, onChange: (d) => r({ weight: d }) }) }),
    /* @__PURE__ */ e(q, { label: "Length (mm)", htmlFor: `${s}-length`, children: /* @__PURE__ */ e(B, { id: `${s}-length`, value: l.length, onChange: (d) => r({ length: d }) }) }),
    /* @__PURE__ */ e(q, { label: "Width (mm)", htmlFor: `${s}-width`, children: /* @__PURE__ */ e(B, { id: `${s}-width`, value: l.width, onChange: (d) => r({ width: d }) }) }),
    /* @__PURE__ */ e(q, { label: "Height (mm)", htmlFor: `${s}-height`, children: /* @__PURE__ */ e(B, { id: `${s}-height`, value: l.height, onChange: (d) => r({ height: d }) }) })
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
function _t(c) {
  const [t, i] = D.useState({}), s = c.filter((l) => !(l in t));
  return D.useEffect(() => {
    if (s.length === 0) return;
    const l = s.map((r) => `ids[]=${r}`).join("&");
    G(w(`api/terms?${l}`)).then((r) => i((d) => ({ ...d, ...Object.fromEntries(r.data.map((m) => [m.id, m.title])) }))).catch(() => {
    });
  }, [s.join(",")]), t;
}
function Ct({ option: c, onChange: t, onRemove: i, config: s, path: l }) {
  const { Button: r, Input: d, Badge: m } = T, { FieldRenderer: k } = ne, [u, y] = D.useState(""), x = () => {
    const g = u.split(",").map((f) => f.trim()).filter(Boolean).filter((f) => !c.values.some((p) => (p.label ?? "").toLowerCase() === f.toLowerCase()));
    g.length && t({ ...c, values: [...c.values, ...g.map((f) => ({ id: V(), label: f }))] }), y("");
  }, h = c.values.map((g) => g.term_id).filter((g) => !!g);
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-3 cm:rounded-md cm:border cm:p-3", children: [
    /* @__PURE__ */ n("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_1fr_auto]", children: [
      /* @__PURE__ */ e(q, { label: "Option name", htmlFor: `${l}-name`, children: /* @__PURE__ */ e(d, { id: `${l}-name`, value: c.name, placeholder: "Size", onChange: (g) => t({ ...c, name: g.target.value }) }) }),
      s.attribute_taxonomies.length > 0 ? /* @__PURE__ */ e(q, { label: "Values from", htmlFor: `${l}-source`, children: /* @__PURE__ */ e(
        z,
        {
          id: `${l}-source`,
          value: c.taxonomy ?? "",
          onChange: (g) => t({ ...c, taxonomy: g || null, values: [] }),
          options: [["", "Custom values"], ...s.attribute_taxonomies.map((g) => [g.handle, g.title])]
        }
      ) }) : /* @__PURE__ */ e("div", {}),
      /* @__PURE__ */ e(r, { type: "button", variant: "ghost", size: "sm", onClick: i, children: "Remove option" })
    ] }),
    c.taxonomy ? /* @__PURE__ */ e(
      k,
      {
        fields: [{ handle: "terms", type: "terms", label: "Values", config: { taxonomy: c.taxonomy } }],
        values: { terms: h },
        pathPrefix: `${l}-terms`,
        onChange: (g) => {
          const f = g.terms ?? [], p = c.values.filter((b) => b.term_id && f.includes(b.term_id)), a = f.filter((b) => !p.some((v) => v.term_id === b)).map((b) => ({ id: V(), term_id: b }));
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
            onChange: (g) => y(g.target.value),
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
function wt({ variant: c, index: t, updateVariant: i, tab: s }) {
  const { FieldRenderer: l } = ne, r = `${s.path}-v${t}`, d = s.live?.variants[c.id];
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-4 cm:bg-muted/40 cm:p-4", children: [
    /* @__PURE__ */ n(ie, { cols: 4, children: [
      /* @__PURE__ */ e(q, { label: "Cost", htmlFor: `${r}-cost`, children: /* @__PURE__ */ e(Y, { id: `${r}-cost`, value: c.cost, onChange: (m) => i(t, { cost: m }) }) }),
      /* @__PURE__ */ e(q, { label: "Barcode", htmlFor: `${r}-barcode`, children: /* @__PURE__ */ e(le, { id: `${r}-barcode`, value: c.barcode, onChange: (m) => i(t, { barcode: m }) }) }),
      /* @__PURE__ */ e(q, { label: "Weight (g)", htmlFor: `${r}-weight`, children: /* @__PURE__ */ e(B, { id: `${r}-weight`, value: c.weight, onChange: (m) => i(t, { weight: m }), placeholder: "Product's" }) }),
      /* @__PURE__ */ e(q, { label: "Min / max / step", htmlFor: `${r}-min`, children: /* @__PURE__ */ n("div", { className: "cm:grid cm:grid-cols-3 cm:gap-1", children: [
        /* @__PURE__ */ e(B, { id: `${r}-min`, min: 1, value: c.min_qty, onChange: (m) => i(t, { min_qty: m ?? 1 }) }),
        /* @__PURE__ */ e(B, { min: 1, value: c.max_qty, onChange: (m) => i(t, { max_qty: m }), placeholder: "–" }),
        /* @__PURE__ */ e(B, { min: 1, value: c.qty_step, onChange: (m) => i(t, { qty_step: m ?? 1 }) })
      ] }) })
    ] }),
    s.config.features.inventory && /* @__PURE__ */ n(ie, { cols: 4, children: [
      /* @__PURE__ */ e(ae, { id: `${r}-track`, label: "Track stock", checked: c.track_stock, onChange: (m) => i(t, { track_stock: m }) }),
      c.track_stock && (d?.track_stock && d.stock_quantity !== null ? /* @__PURE__ */ e(q, { label: "In stock", children: /* @__PURE__ */ n("p", { className: "cm:text-sm", children: [
        d.stock_quantity,
        " ",
        /* @__PURE__ */ e("span", { className: "cm:text-muted-foreground", children: "(change it in Shop → Inventory)" })
      ] }) }) : /* @__PURE__ */ e(q, { label: "Starting stock", htmlFor: `${r}-initial`, children: /* @__PURE__ */ e(B, { id: `${r}-initial`, value: c.initial_stock, onChange: (m) => i(t, { initial_stock: m }) }) })),
      c.track_stock ? /* @__PURE__ */ e(q, { label: "When sold out", htmlFor: `${r}-backorders`, children: /* @__PURE__ */ e(
        z,
        {
          id: `${r}-backorders`,
          value: c.backorders,
          onChange: (m) => i(t, { backorders: m }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }) : /* @__PURE__ */ e(q, { label: "Stock status", htmlFor: `${r}-status`, children: /* @__PURE__ */ e(
        z,
        {
          id: `${r}-status`,
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
        pathPrefix: `${r}-image`,
        onChange: (m) => i(t, { image: m.image ?? null })
      }
    )
  ] });
}
function $t(c) {
  const { value: t, update: i, updateVariant: s, config: l, entryId: r, live: d } = c, { Button: m, Table: k, TableBody: u, TableCell: y, TableHead: x, TableHeader: h, TableRow: g, Switch: f } = T, [p, a] = D.useState(null), b = _t(t.options.flatMap(($) => $.values.map((C) => C.term_id).filter((C) => !!C))), v = t.variants[0] ?? { ...ve, id: V() }, _ = ($ = t.options) => i({ options: $, variants: ht($, t.variants, { ...v, initial_stock: null, image: null }, l.max_variants) });
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ e(
      K,
      {
        title: "Options",
        description: `Up to ${l.max_options} options, such as size and color. Variants are made for every combination.`,
        actions: t.options.length < l.max_options && /* @__PURE__ */ e(m, { type: "button", variant: "outline", size: "sm", onClick: () => i({ options: [...t.options, { id: V(), name: "", taxonomy: null, values: [] }] }), children: "Add option" }),
        children: t.options.map(($, C) => /* @__PURE__ */ e(
          Ct,
          {
            option: $,
            config: l,
            path: `${c.path}-o${C}`,
            onChange: (F) => _(t.options.map((S, U) => U === C ? F : S)),
            onRemove: () => _(t.options.filter((F, S) => S !== C))
          },
          $.id
        ))
      }
    ),
    /* @__PURE__ */ n(
      K,
      {
        title: `Variants (${t.variants.length})`,
        description: "Each has its own SKU, price and stock. Switch one off to stop selling it without losing it.",
        actions: /* @__PURE__ */ e(m, { type: "button", variant: "outline", size: "sm", onClick: () => _(), children: "Regenerate" }),
        children: [
          t.options.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "Add an option with values to create variants." }) : /* @__PURE__ */ e("div", { className: "cm:overflow-x-auto cm:rounded-md cm:border", children: /* @__PURE__ */ n(k, { children: [
            /* @__PURE__ */ e(h, { children: /* @__PURE__ */ n(g, { children: [
              /* @__PURE__ */ e(x, { children: "Variant" }),
              /* @__PURE__ */ e(x, { children: "SKU" }),
              /* @__PURE__ */ e(x, { children: "Price" }),
              /* @__PURE__ */ e(x, { children: "Compare-at" }),
              l.features.inventory && /* @__PURE__ */ e(x, { children: "Stock" }),
              /* @__PURE__ */ e(x, { children: "On sale" }),
              /* @__PURE__ */ e(x, {})
            ] }) }),
            /* @__PURE__ */ e(u, { children: t.variants.map(($, C) => {
              const F = d?.variants[$.id];
              return /* @__PURE__ */ n(D.Fragment, { children: [
                /* @__PURE__ */ n(g, { className: $.active ? "" : "cm:opacity-60", children: [
                  /* @__PURE__ */ e(y, { className: "cm:font-medium cm:whitespace-nowrap", children: Re(t.options, $, b) }),
                  /* @__PURE__ */ e(y, { className: "cm:min-w-36", children: /* @__PURE__ */ e(Pe, { value: $.sku, entryId: r, onChange: (S) => s(C, { sku: S }) }) }),
                  /* @__PURE__ */ e(y, { className: "cm:min-w-32", children: /* @__PURE__ */ e(Y, { value: $.price, nullable: !1, onChange: (S) => s(C, { price: S ?? 0 }) }) }),
                  /* @__PURE__ */ e(y, { className: "cm:min-w-32", children: /* @__PURE__ */ e(Y, { value: $.compare_at_price, onChange: (S) => s(C, { compare_at_price: S }) }) }),
                  l.features.inventory && /* @__PURE__ */ e(y, { className: "cm:whitespace-nowrap cm:text-sm", children: $.track_stock ? F?.stock_quantity ?? $.initial_stock ?? 0 : /* @__PURE__ */ e(j, { children: $.stock_status.replace("_", " ") }) }),
                  /* @__PURE__ */ e(y, { children: /* @__PURE__ */ e(f, { checked: $.active, "aria-label": "Sell this variant", onCheckedChange: (S) => s(C, { active: S }) }) }),
                  /* @__PURE__ */ e(y, { children: /* @__PURE__ */ e(m, { type: "button", variant: "ghost", size: "sm", "aria-expanded": p === $.id, onClick: () => a(p === $.id ? null : $.id), children: p === $.id ? "Close" : "More" }) })
                ] }),
                p === $.id && /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(y, { colSpan: 7, className: "cm:p-0", children: /* @__PURE__ */ e(wt, { variant: $, index: C, updateVariant: s, tab: c }) }) })
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
function St(c) {
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
function Dt({ field: c, value: t, onChange: i, errors: s, pathPrefix: l = "data.product" }) {
  M();
  const r = c.config ?? {}, d = St(t), { props: m } = R.usePage(), k = m.entry?.id ?? null, [u, y] = D.useState(null);
  D.useEffect(() => {
    k && G(w(`commerce/api/products/${k}`)).then((_) => y(_.data)).catch(() => {
    });
  }, [k, m.entry]);
  const x = (_) => {
    const $ = { ...d, ..._ };
    _.type && _.type !== "variable" && ($.options = [], $.variants = [{ ...$.variants[0], options: {} }]), _.type === "bundle" && !$.bundle && ($.bundle = { pricing: "fixed", value: 0, items: [] }), i($);
  }, h = (_, $) => x({ variants: d.variants.map((C, F) => F === _ ? { ...C, ...$ } : C) }), g = [{ key: "general", label: "General", render: (_) => /* @__PURE__ */ e(yt, { ..._ }) }];
  d.type === "variable" && g.push({ key: "variants", label: "Variants", render: (_) => /* @__PURE__ */ e($t, { ..._ }) }), d.type === "bundle" && g.push({ key: "bundle", label: "Bundle", render: (_) => /* @__PURE__ */ e(gt, { ..._ }) }), d.type !== "variable" && (r.features?.inventory ?? !0) && g.push({ key: "inventory", label: "Inventory", render: (_) => /* @__PURE__ */ e(xt, { ..._ }) }), d.requires_shipping && g.push({ key: "shipping", label: "Shipping", render: (_) => /* @__PURE__ */ e(Nt, { ..._ }) }), (r.features?.pricing_rules !== !1 || d.tiers.length > 0) && g.push({ key: "pricing", label: "Bulk prices", render: (_) => /* @__PURE__ */ e(kt, { ..._ }) }), d.downloadable && g.push({ key: "digital", label: "Digital", render: (_) => /* @__PURE__ */ e(vt, { ..._ }) });
  for (const [_, $] of Object.entries(ee.productTabs()))
    g.push({ key: `ext-${_}`, label: $.label ?? _, render: (C) => /* @__PURE__ */ e($, { ...C }) });
  const [f, p] = D.useState("general"), a = g.find((_) => _.key === f) ?? g[0], b = s?.[l], v = { value: d, update: x, updateVariant: h, config: r, live: u, entryId: k, path: l.replace(/\W+/g, "-") };
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-4 cm:rounded-lg cm:border cm:p-4", children: [
    u?.sync_status === "failed" && /* @__PURE__ */ n("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: [
      "The published version couldn't be applied to the store, so it can't be bought: ",
      u.sync_error,
      ". Fix it and publish again."
    ] }),
    b && /* @__PURE__ */ e("p", { role: "alert", className: "cm:text-sm cm:text-destructive", children: b }),
    /* @__PURE__ */ e("div", { role: "tablist", "aria-label": "Product data", className: "cm:flex cm:flex-wrap cm:gap-1 cm:border-b", children: g.map((_) => /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": _.key === a.key,
        onClick: () => p(_.key),
        className: me("cm:-mb-px cm:border-b-2 cm:px-3 cm:py-2 cm:text-sm", _.key === a.key ? "cm:border-primary cm:font-medium" : "cm:border-transparent cm:text-muted-foreground cm:hover:text-foreground"),
        children: _.label
      },
      _.key
    )) }),
    /* @__PURE__ */ e("div", { role: "tabpanel", children: a.render(v) })
  ] });
}
const Ft = {
  commerce_money: ot,
  commerce_datetime_range: dt,
  commerce_region: Te,
  commerce_targets: mt,
  commerce_product: Dt
};
function qt() {
  Object.entries(Ft).forEach(([c, t]) => A.registerField(c, t));
}
function Tt() {
  Object.assign(ee.components, { EmptyState: ue, MoneyInput: te, PageHeader: W, SchemaFormView: ye, SectionNav: je, SettingsLayout: he, StatusBadge: j });
}
Oe();
Tt();
qt();
st();
