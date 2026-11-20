import { i as m, j as t, q as A, b as e, c as E, a as s, E as M, S as f } from "./main-txcRj4Ln.js";
function $({ sections: v, zones: n, types: x, couriers: N, couriersUrl: y, moveUrl: b }) {
  const { Card: o, CardContent: h, CardHeader: u, CardTitle: p, Button: r, Select: k, SelectContent: w, SelectItem: C, SelectTrigger: S, SelectValue: j } = E, { Link: a } = m, l = (i, d, c) => m.router.post(s(b), { kind: i, id: d, direction: c }, { preserveScroll: !0 });
  return /* @__PURE__ */ t(
    A,
    {
      sections: v,
      current: "shipping",
      title: "Shipping",
      description: "Zones are checked in order and the first one matching the address gives its methods. Pickup methods are offered everywhere.",
      children: [
        /* @__PURE__ */ e("div", { className: "cm:flex cm:justify-end", children: /* @__PURE__ */ e(r, { asChild: !0, children: /* @__PURE__ */ e(a, { href: s("commerce/settings/shipping/zones/create"), children: "Add zone" }) }) }),
        n.length === 0 && /* @__PURE__ */ e(M, { title: "No shipping zones yet", description: "Without a zone, checkout offers no shipping. Add one for your country or provinces." }),
        n.map((i, d) => /* @__PURE__ */ t(o, { children: [
          /* @__PURE__ */ t(u, { className: "cm:flex cm:flex-row cm:items-start cm:justify-between cm:gap-4", children: [
            /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ t(p, { className: "cm:flex cm:items-center cm:gap-2", children: [
                i.name,
                i.everywhere_else && /* @__PURE__ */ e(f, { tone: "info", children: "Everywhere else" })
              ] }),
              !i.everywhere_else && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: i.regions.length > 0 ? i.regions.join(", ") : "No regions" })
            ] }),
            /* @__PURE__ */ t("div", { className: "cm:flex cm:shrink-0 cm:gap-1", children: [
              /* @__PURE__ */ e(r, { variant: "ghost", size: "sm", "aria-label": "Move up", disabled: d === 0, onClick: () => l("zone", i.id, "up"), children: "↑" }),
              /* @__PURE__ */ e(r, { variant: "ghost", size: "sm", "aria-label": "Move down", disabled: d === n.length - 1, onClick: () => l("zone", i.id, "down"), children: "↓" }),
              /* @__PURE__ */ e(r, { variant: "outline", size: "sm", asChild: !0, children: /* @__PURE__ */ e(a, { href: s(i.edit_url), children: "Edit" }) })
            ] })
          ] }),
          /* @__PURE__ */ t(h, { className: "cm:grid cm:gap-3", children: [
            i.overlap && /* @__PURE__ */ t("p", { className: "cm:rounded-md cm:bg-muted cm:px-3 cm:py-2 cm:text-sm", children: [
              /* @__PURE__ */ e("strong", { children: i.overlap.all ? "All addresses" : "Some addresses" }),
              " in this zone match ",
              i.overlap.zones.join(", "),
              " first. Move this zone above ",
              i.overlap.zones.length === 1 ? "that zone" : "those zones",
              " if its delivery methods should take priority."
            ] }),
            i.methods.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No methods in this zone." }),
            i.methods.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:divide-y cm:divide-border cm:rounded-md cm:border", children: i.methods.map((c, g) => /* @__PURE__ */ t("li", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:px-3 cm:py-2", children: [
              /* @__PURE__ */ t("div", { className: "cm:min-w-0", children: [
                /* @__PURE__ */ e(a, { href: s(c.edit_url), className: "cm:font-medium cm:hover:underline", children: c.title }),
                /* @__PURE__ */ t("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  c.type,
                  c.etd ? ` · ${c.etd}` : ""
                ] })
              ] }),
              /* @__PURE__ */ t("div", { className: "cm:flex cm:items-center cm:gap-1", children: [
                !c.active && /* @__PURE__ */ e(f, { children: "Inactive" }),
                /* @__PURE__ */ e(r, { variant: "ghost", size: "sm", "aria-label": "Move up", disabled: g === 0, onClick: () => l("method", c.id, "up"), children: "↑" }),
                /* @__PURE__ */ e(r, { variant: "ghost", size: "sm", "aria-label": "Move down", disabled: g === i.methods.length - 1, onClick: () => l("method", c.id, "down"), children: "↓" })
              ] })
            ] }, c.id)) }),
            /* @__PURE__ */ e("div", { children: /* @__PURE__ */ t(k, { value: "", onValueChange: (c) => m.router.visit(s(`commerce/settings/shipping/zones/${i.id}/methods/create?type=${c}`)), children: [
              /* @__PURE__ */ e(S, { className: "cm:w-48", "aria-label": `Add a method to ${i.name}`, children: /* @__PURE__ */ e(j, { placeholder: "Add method…" }) }),
              /* @__PURE__ */ e(w, { children: x.map((c) => /* @__PURE__ */ e(C, { value: c.key, children: c.label }, c.key)) })
            ] }) })
          ] })
        ] }, i.id)),
        /* @__PURE__ */ t(o, { children: [
          /* @__PURE__ */ t(u, { className: "cm:flex cm:flex-row cm:items-center cm:justify-between cm:gap-3", children: [
            /* @__PURE__ */ e(p, { children: "Courier presets" }),
            /* @__PURE__ */ e(r, { asChild: !0, variant: "outline", size: "sm", children: /* @__PURE__ */ e(a, { href: s(y), children: "Edit couriers" }) })
          ] }),
          /* @__PURE__ */ t(h, { children: [
            /* @__PURE__ */ e("p", { className: "cm:mb-3 cm:text-sm cm:text-muted-foreground", children: "Offered when adding a shipment; the tracking link is filled in from the tracking number." }),
            /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1 cm:text-sm cm:sm:grid-cols-2", children: N.map((i) => /* @__PURE__ */ t("li", { className: "cm:flex cm:items-center cm:gap-2", children: [
              /* @__PURE__ */ e("span", { className: i.active ? "cm:font-medium" : "cm:font-medium cm:text-muted-foreground cm:line-through", children: i.name }),
              !i.active && /* @__PURE__ */ e("span", { className: "cm:text-xs cm:text-muted-foreground", children: "(off)" }),
              !i.tracking_url && /* @__PURE__ */ e("span", { className: "cm:text-xs cm:text-muted-foreground", children: "(no tracking link)" })
            ] }, i.key)) })
          ] })
        ] })
      ]
    }
  );
}
export {
  $ as default
};
