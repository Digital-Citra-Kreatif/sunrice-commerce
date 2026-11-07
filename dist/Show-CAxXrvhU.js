import { i as C, u as j, a as A, b as g, R as B, j as i, c as e, P as L, F as k, S as m, d as $ } from "./main-BZm25ssn.js";
const u = (d) => d ? new Date(d).toLocaleDateString(void 0, { dateStyle: "medium" }) : "—";
function P({ customer: d, account: r, roleOptions: S, orders: N, can: l }) {
  const { Card: n, CardContent: t, CardHeader: h, CardTitle: o, Button: s, Input: x, Label: p, Textarea: _, Switch: D, Checkbox: w } = $, { Link: y, router: z } = C;
  j(), A([{ label: "Shop", href: g("commerce") }, { label: "Customers", href: g("commerce/customers") }, { label: d.name ?? d.email }]);
  const c = C.useForm({ name: d.name ?? "", phone: d.phone ?? "", note: d.note ?? "", accepts_marketing: d.accepts_marketing, roles: r?.roles ?? [] }), [F, b] = B.useState(!1), f = (a) => z.post(g(`commerce/customers/${d.id}/${a}`), {}, { preserveScroll: !0 });
  return /* @__PURE__ */ i("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-6", children: [
    /* @__PURE__ */ e(
      L,
      {
        title: d.name ?? d.email,
        description: /* @__PURE__ */ i(k, { children: [
          d.email,
          d.phone ? ` · ${d.phone}` : ""
        ] }),
        actions: /* @__PURE__ */ i(k, { children: [
          d.deletion_requested_at && /* @__PURE__ */ i(m, { tone: "warning", children: [
            "Deletion requested ",
            u(d.deletion_requested_at)
          ] }),
          r ? /* @__PURE__ */ e(m, { tone: "ok", children: "Registered" }) : /* @__PURE__ */ e(m, { children: "Guest" })
        ] })
      }
    ),
    /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-3", children: [["Orders", String(d.orders_count)], ["Spent", d.total_spent], ["Last order", u(d.last_order_at)]].map(([a, v]) => /* @__PURE__ */ e(n, { children: /* @__PURE__ */ i(t, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
      /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: a }),
      /* @__PURE__ */ e("span", { className: "cm:text-xl cm:font-semibold", children: v })
    ] }) }, a)) }),
    /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[2fr_1fr]", children: [
      /* @__PURE__ */ i("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ i(n, { children: [
          /* @__PURE__ */ e(h, { children: /* @__PURE__ */ e(o, { children: "Orders" }) }),
          /* @__PURE__ */ e(t, { children: N.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No orders yet." }) : /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1", children: N.map((a) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ i(y, { href: g(a.href), className: "cm:flex cm:justify-between cm:rounded cm:p-2 cm:hover:bg-muted", children: [
            /* @__PURE__ */ i("span", { children: [
              a.number,
              " · ",
              u(a.date)
            ] }),
            /* @__PURE__ */ i("span", { children: [
              /* @__PURE__ */ e(m, { children: a.status }),
              " ",
              a.total
            ] })
          ] }) }, a.id)) }) })
        ] }),
        /* @__PURE__ */ i(n, { children: [
          /* @__PURE__ */ e(h, { children: /* @__PURE__ */ e(o, { children: "Addresses" }) }),
          /* @__PURE__ */ e(t, { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: d.addresses.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No saved addresses." }) : d.addresses.map((a) => /* @__PURE__ */ i("div", { className: "cm:rounded-md cm:border cm:p-3 cm:text-sm", children: [
            a.label && /* @__PURE__ */ e("p", { className: "cm:font-medium", children: a.label }),
            /* @__PURE__ */ e("p", { className: "cm:whitespace-pre-line", children: a.text }),
            /* @__PURE__ */ i("div", { className: "cm:mt-1 cm:flex cm:gap-1", children: [
              a.default_shipping && /* @__PURE__ */ e(m, { children: "Shipping" }),
              a.default_billing && /* @__PURE__ */ e(m, { children: "Billing" })
            ] })
          ] }, a.id)) })
        ] })
      ] }),
      /* @__PURE__ */ i("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ i(n, { children: [
          /* @__PURE__ */ e(h, { children: /* @__PURE__ */ e(o, { children: "Details" }) }),
          /* @__PURE__ */ e(t, { children: /* @__PURE__ */ i("form", { className: "cm:grid cm:gap-3", onSubmit: (a) => {
            a.preventDefault(), c.put(g(`commerce/customers/${d.id}`), { preserveScroll: !0 });
          }, children: [
            /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(p, { htmlFor: "c-name", children: "Name" }),
              /* @__PURE__ */ e(x, { id: "c-name", disabled: !l.edit, value: c.data.name, onChange: (a) => c.setData("name", a.target.value) })
            ] }),
            /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(p, { htmlFor: "c-phone", children: "Phone" }),
              /* @__PURE__ */ e(x, { id: "c-phone", disabled: !l.edit, value: c.data.phone, onChange: (a) => c.setData("phone", a.target.value) })
            ] }),
            /* @__PURE__ */ i("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ e(p, { htmlFor: "c-note", children: "Note (staff only)" }),
              /* @__PURE__ */ e(_, { id: "c-note", disabled: !l.edit, value: c.data.note, onChange: (a) => c.setData("note", a.target.value) })
            ] }),
            /* @__PURE__ */ i("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e(D, { id: "c-marketing", disabled: !l.edit, checked: c.data.accepts_marketing, onCheckedChange: (a) => c.setData("accepts_marketing", a) }),
              /* @__PURE__ */ e(p, { htmlFor: "c-marketing", children: "Accepts marketing" })
            ] }),
            r && /* @__PURE__ */ i("fieldset", { className: "cm:grid cm:gap-1.5", children: [
              /* @__PURE__ */ e("legend", { className: "cm:mb-1 cm:text-sm cm:font-medium", children: "Roles" }),
              S.map((a) => /* @__PURE__ */ i("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
                /* @__PURE__ */ e(
                  w,
                  {
                    disabled: !l.edit,
                    checked: c.data.roles.includes(a),
                    onCheckedChange: (v) => c.setData("roles", v ? [...c.data.roles, a] : c.data.roles.filter((R) => R !== a))
                  }
                ),
                a
              ] }, a))
            ] }),
            l.edit && /* @__PURE__ */ e(s, { type: "submit", disabled: c.processing, children: "Save" })
          ] }) })
        ] }),
        r && /* @__PURE__ */ i(n, { children: [
          /* @__PURE__ */ e(h, { children: /* @__PURE__ */ e(o, { children: "Account" }) }),
          /* @__PURE__ */ i(t, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            /* @__PURE__ */ i("p", { children: [
              "Email ",
              r.email_verified ? "verified" : "not verified"
            ] }),
            r.google && /* @__PURE__ */ i("p", { children: [
              "Google: ",
              r.google
            ] }),
            l.edit && /* @__PURE__ */ e(s, { variant: "outline", size: "sm", onClick: () => f("password-reset"), children: "Send a password reset link" }),
            l.edit && !r.email_verified && /* @__PURE__ */ e(s, { variant: "outline", size: "sm", onClick: () => f("verify"), children: "Mark email verified" })
          ] })
        ] }),
        l.delete && !d.anonymized && /* @__PURE__ */ i(n, { children: [
          /* @__PURE__ */ e(h, { children: /* @__PURE__ */ e(o, { children: "Remove personal data" }) }),
          /* @__PURE__ */ i(t, { className: "cm:grid cm:gap-2 cm:text-sm", children: [
            /* @__PURE__ */ e("p", { className: "cm:text-muted-foreground", children: "Name, email, phone and addresses are deleted; orders keep their amounts." }),
            F ? /* @__PURE__ */ i("div", { className: "cm:flex cm:gap-2", children: [
              /* @__PURE__ */ e(s, { variant: "destructive", size: "sm", onClick: () => f("anonymize"), children: "Remove for good" }),
              /* @__PURE__ */ e(s, { variant: "outline", size: "sm", onClick: () => b(!1), children: "Cancel" })
            ] }) : /* @__PURE__ */ e(s, { variant: "outline", size: "sm", onClick: () => b(!0), children: "Anonymize" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  P as default
};
