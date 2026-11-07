import { i as v, j as a, n as g, c as t, E as f, d as k, b as i, S as x } from "./main-DVaJaMrz.js";
function w({ sections: o, methods: c, instanceTypes: l }) {
  const { Card: m, CardContent: p, Button: s, Switch: h } = k, { Link: u, router: r } = v, d = (e, n) => r.post(i("commerce/settings/payments/move"), { key: e, direction: n }, { preserveScroll: !0 });
  return /* @__PURE__ */ a(g, { sections: o, current: "payments", title: "Payments", description: "Payment methods offered at checkout and on the pay page, in this order.", children: [
    c.length === 0 && /* @__PURE__ */ t(f, { title: "No payment methods", description: "Switch on Bank transfer, QRIS and cash on delivery in Features, or install a gateway package." }),
    c.length > 0 && /* @__PURE__ */ t(m, { children: /* @__PURE__ */ t(p, { className: "cm:p-0", children: /* @__PURE__ */ t("ul", { className: "cm:divide-y cm:divide-border", children: c.map((e, n) => /* @__PURE__ */ a("li", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:px-4 cm:py-3", children: [
      /* @__PURE__ */ a("div", { className: "cm:min-w-0", children: [
        /* @__PURE__ */ t(u, { href: i(e.edit_url), className: "cm:font-medium cm:hover:underline", children: e.title }),
        /* @__PURE__ */ a("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
          e.type,
          e.instance ? ` · ${e.key}` : ""
        ] })
      ] }),
      /* @__PURE__ */ a("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
        !e.active && /* @__PURE__ */ t(x, { children: "Off" }),
        /* @__PURE__ */ t(s, { variant: "ghost", size: "sm", "aria-label": "Move up", disabled: n === 0, onClick: () => d(e.key, "up"), children: "↑" }),
        /* @__PURE__ */ t(s, { variant: "ghost", size: "sm", "aria-label": "Move down", disabled: n === c.length - 1, onClick: () => d(e.key, "down"), children: "↓" }),
        /* @__PURE__ */ t(
          h,
          {
            checked: e.active,
            "aria-label": `${e.title} active`,
            onCheckedChange: (y) => r.put(i(`commerce/settings/payments/${e.key}/active`), { active: y }, { preserveScroll: !0 })
          }
        )
      ] })
    ] }, e.key)) }) }) }),
    l.length > 0 && /* @__PURE__ */ t("div", { className: "cm:flex cm:flex-wrap cm:gap-2", children: l.map((e) => /* @__PURE__ */ a(s, { variant: "outline", onClick: () => r.post(i("commerce/settings/payments/instances"), { type: e.key }), children: [
      "Add ",
      e.label.toLowerCase()
    ] }, e.key)) })
  ] });
}
export {
  w as default
};
