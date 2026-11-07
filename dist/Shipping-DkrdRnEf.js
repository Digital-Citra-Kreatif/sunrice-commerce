import { i as m, j as r, n as j, c as e, d as A, b as s, E as _, S as f } from "./main-wV99lHGN.js";
function M({ sections: v, zones: d, types: x, couriers: N, moveUrl: k }) {
  const { Card: h, CardContent: o, CardHeader: g, CardTitle: p, Button: t, Select: b, SelectContent: y, SelectItem: C, SelectTrigger: w, SelectValue: S } = A, { Link: l } = m, n = (i, a, c) => m.router.post(s(k), { kind: i, id: a, direction: c }, { preserveScroll: !0 });
  return /* @__PURE__ */ r(
    j,
    {
      sections: v,
      current: "shipping",
      title: "Shipping",
      description: "Zones are checked in order and the first one matching the address gives its methods. Pickup methods are offered everywhere.",
      children: [
        /* @__PURE__ */ e("div", { className: "cm:flex cm:justify-end", children: /* @__PURE__ */ e(t, { asChild: !0, children: /* @__PURE__ */ e(l, { href: s("commerce/settings/shipping/zones/create"), children: "Add zone" }) }) }),
        d.length === 0 && /* @__PURE__ */ e(_, { title: "No shipping zones yet", description: "Without a zone, checkout offers no shipping. Add one for your country or provinces." }),
        d.map((i, a) => /* @__PURE__ */ r(h, { children: [
          /* @__PURE__ */ r(g, { className: "cm:flex cm:flex-row cm:items-start cm:justify-between cm:gap-4", children: [
            /* @__PURE__ */ r("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ r(p, { className: "cm:flex cm:items-center cm:gap-2", children: [
                i.name,
                i.everywhere_else && /* @__PURE__ */ e(f, { tone: "info", children: "Everywhere else" })
              ] }),
              !i.everywhere_else && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: i.regions.length > 0 ? i.regions.join(", ") : "No regions" })
            ] }),
            /* @__PURE__ */ r("div", { className: "cm:flex cm:shrink-0 cm:gap-1", children: [
              /* @__PURE__ */ e(t, { variant: "ghost", size: "sm", "aria-label": "Move up", disabled: a === 0, onClick: () => n("zone", i.id, "up"), children: "↑" }),
              /* @__PURE__ */ e(t, { variant: "ghost", size: "sm", "aria-label": "Move down", disabled: a === d.length - 1, onClick: () => n("zone", i.id, "down"), children: "↓" }),
              /* @__PURE__ */ e(t, { variant: "outline", size: "sm", asChild: !0, children: /* @__PURE__ */ e(l, { href: s(i.edit_url), children: "Edit" }) })
            ] })
          ] }),
          /* @__PURE__ */ r(o, { className: "cm:grid cm:gap-3", children: [
            i.methods.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No methods in this zone." }),
            i.methods.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:divide-y cm:divide-border cm:rounded-md cm:border", children: i.methods.map((c, u) => /* @__PURE__ */ r("li", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:px-3 cm:py-2", children: [
              /* @__PURE__ */ r("div", { className: "cm:min-w-0", children: [
                /* @__PURE__ */ e(l, { href: s(c.edit_url), className: "cm:font-medium cm:hover:underline", children: c.title }),
                /* @__PURE__ */ r("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  c.type,
                  c.etd ? ` · ${c.etd}` : ""
                ] })
              ] }),
              /* @__PURE__ */ r("div", { className: "cm:flex cm:items-center cm:gap-1", children: [
                !c.active && /* @__PURE__ */ e(f, { children: "Inactive" }),
                /* @__PURE__ */ e(t, { variant: "ghost", size: "sm", "aria-label": "Move up", disabled: u === 0, onClick: () => n("method", c.id, "up"), children: "↑" }),
                /* @__PURE__ */ e(t, { variant: "ghost", size: "sm", "aria-label": "Move down", disabled: u === i.methods.length - 1, onClick: () => n("method", c.id, "down"), children: "↓" })
              ] })
            ] }, c.id)) }),
            /* @__PURE__ */ e("div", { children: /* @__PURE__ */ r(b, { value: "", onValueChange: (c) => m.router.visit(s(`commerce/settings/shipping/zones/${i.id}/methods/create?type=${c}`)), children: [
              /* @__PURE__ */ e(w, { className: "cm:w-48", "aria-label": `Add a method to ${i.name}`, children: /* @__PURE__ */ e(S, { placeholder: "Add method…" }) }),
              /* @__PURE__ */ e(y, { children: x.map((c) => /* @__PURE__ */ e(C, { value: c.key, children: c.label }, c.key)) })
            ] }) })
          ] })
        ] }, i.id)),
        /* @__PURE__ */ r(h, { children: [
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e(p, { children: "Courier presets" }) }),
          /* @__PURE__ */ r(o, { children: [
            /* @__PURE__ */ e("p", { className: "cm:mb-3 cm:text-sm cm:text-muted-foreground", children: "Offered when adding a shipment; the tracking link is filled in from the tracking number. Add more in config/commerce.php or with Commerce::registerCourier()." }),
            /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1 cm:text-sm cm:sm:grid-cols-2", children: N.map((i) => /* @__PURE__ */ r("li", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e("span", { className: "cm:font-medium", children: i.name }),
              !i.tracking_url && /* @__PURE__ */ e("span", { className: "cm:text-xs cm:text-muted-foreground", children: "(no tracking link)" })
            ] }, i.key)) })
          ] })
        ] })
      ]
    }
  );
}
export {
  M as default
};
