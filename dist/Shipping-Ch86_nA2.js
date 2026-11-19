import { i as m, j as c, o as j, b as e, c as A, a as s, E as M, S as f } from "./main-BjsacfA0.js";
function E({ sections: v, zones: l, types: x, couriers: N, moveUrl: y }) {
  const { Card: o, CardContent: h, CardHeader: p, CardTitle: g, Button: t, Select: b, SelectContent: k, SelectItem: C, SelectTrigger: w, SelectValue: S } = A, { Link: n } = m, a = (i, d, r) => m.router.post(s(y), { kind: i, id: d, direction: r }, { preserveScroll: !0 });
  return /* @__PURE__ */ c(
    j,
    {
      sections: v,
      current: "shipping",
      title: "Shipping",
      description: "Zones are checked in order and the first one matching the address gives its methods. Pickup methods are offered everywhere.",
      children: [
        /* @__PURE__ */ e("div", { className: "cm:flex cm:justify-end", children: /* @__PURE__ */ e(t, { asChild: !0, children: /* @__PURE__ */ e(n, { href: s("commerce/settings/shipping/zones/create"), children: "Add zone" }) }) }),
        l.length === 0 && /* @__PURE__ */ e(M, { title: "No shipping zones yet", description: "Without a zone, checkout offers no shipping. Add one for your country or provinces." }),
        l.map((i, d) => /* @__PURE__ */ c(o, { children: [
          /* @__PURE__ */ c(p, { className: "cm:flex cm:flex-row cm:items-start cm:justify-between cm:gap-4", children: [
            /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ c(g, { className: "cm:flex cm:items-center cm:gap-2", children: [
                i.name,
                i.everywhere_else && /* @__PURE__ */ e(f, { tone: "info", children: "Everywhere else" })
              ] }),
              !i.everywhere_else && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: i.regions.length > 0 ? i.regions.join(", ") : "No regions" })
            ] }),
            /* @__PURE__ */ c("div", { className: "cm:flex cm:shrink-0 cm:gap-1", children: [
              /* @__PURE__ */ e(t, { variant: "ghost", size: "sm", "aria-label": "Move up", disabled: d === 0, onClick: () => a("zone", i.id, "up"), children: "↑" }),
              /* @__PURE__ */ e(t, { variant: "ghost", size: "sm", "aria-label": "Move down", disabled: d === l.length - 1, onClick: () => a("zone", i.id, "down"), children: "↓" }),
              /* @__PURE__ */ e(t, { variant: "outline", size: "sm", asChild: !0, children: /* @__PURE__ */ e(n, { href: s(i.edit_url), children: "Edit" }) })
            ] })
          ] }),
          /* @__PURE__ */ c(h, { className: "cm:grid cm:gap-3", children: [
            i.overlap && /* @__PURE__ */ c("p", { className: "cm:rounded-md cm:bg-muted cm:px-3 cm:py-2 cm:text-sm", children: [
              /* @__PURE__ */ e("strong", { children: i.overlap.all ? "All addresses" : "Some addresses" }),
              " in this zone match ",
              i.overlap.zones.join(", "),
              " first. Move this zone above ",
              i.overlap.zones.length === 1 ? "that zone" : "those zones",
              " if its delivery methods should take priority."
            ] }),
            i.methods.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No methods in this zone." }),
            i.methods.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:divide-y cm:divide-border cm:rounded-md cm:border", children: i.methods.map((r, u) => /* @__PURE__ */ c("li", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:px-3 cm:py-2", children: [
              /* @__PURE__ */ c("div", { className: "cm:min-w-0", children: [
                /* @__PURE__ */ e(n, { href: s(r.edit_url), className: "cm:font-medium cm:hover:underline", children: r.title }),
                /* @__PURE__ */ c("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                  r.type,
                  r.etd ? ` · ${r.etd}` : ""
                ] })
              ] }),
              /* @__PURE__ */ c("div", { className: "cm:flex cm:items-center cm:gap-1", children: [
                !r.active && /* @__PURE__ */ e(f, { children: "Inactive" }),
                /* @__PURE__ */ e(t, { variant: "ghost", size: "sm", "aria-label": "Move up", disabled: u === 0, onClick: () => a("method", r.id, "up"), children: "↑" }),
                /* @__PURE__ */ e(t, { variant: "ghost", size: "sm", "aria-label": "Move down", disabled: u === i.methods.length - 1, onClick: () => a("method", r.id, "down"), children: "↓" })
              ] })
            ] }, r.id)) }),
            /* @__PURE__ */ e("div", { children: /* @__PURE__ */ c(b, { value: "", onValueChange: (r) => m.router.visit(s(`commerce/settings/shipping/zones/${i.id}/methods/create?type=${r}`)), children: [
              /* @__PURE__ */ e(w, { className: "cm:w-48", "aria-label": `Add a method to ${i.name}`, children: /* @__PURE__ */ e(S, { placeholder: "Add method…" }) }),
              /* @__PURE__ */ e(k, { children: x.map((r) => /* @__PURE__ */ e(C, { value: r.key, children: r.label }, r.key)) })
            ] }) })
          ] })
        ] }, i.id)),
        /* @__PURE__ */ c(o, { children: [
          /* @__PURE__ */ e(p, { children: /* @__PURE__ */ e(g, { children: "Courier presets" }) }),
          /* @__PURE__ */ c(h, { children: [
            /* @__PURE__ */ e("p", { className: "cm:mb-3 cm:text-sm cm:text-muted-foreground", children: "Offered when adding a shipment; the tracking link is filled in from the tracking number. Add more in config/commerce.php or with Commerce::registerCourier()." }),
            /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1 cm:text-sm cm:sm:grid-cols-2", children: N.map((i) => /* @__PURE__ */ c("li", { className: "cm:flex cm:items-center cm:gap-2", children: [
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
  E as default
};
