import { i as p, R as g, j as c, m as T, c as i, d as B, S as s, F as q } from "./main-BtYEwHjd.js";
function O({ sections: u, mode: r, groups: y, updateUrl: b }) {
  const { Card: f, CardContent: v, CardHeader: x, CardTitle: k, Switch: w, Button: d, Dialog: C, DialogContent: S, DialogDescription: N, DialogFooter: j, DialogHeader: D, DialogTitle: F } = B, { errors: a } = p.usePage().props, [l, t] = g.useState(null), [_, o] = g.useState(null), m = (n, e) => {
    o(n.key), p.router.put(b.replace("__key__", n.key), { on: e }, { preserveScroll: !0, onFinish: () => o(null) });
  };
  return /* @__PURE__ */ c(
    T,
    {
      sections: u,
      current: "features",
      title: "Features",
      description: /* @__PURE__ */ c(q, { children: [
        "Switch store modules on or off. Selling mode: ",
        /* @__PURE__ */ i("strong", { children: r.label }),
        ". Switching off never deletes data."
      ] }),
      children: [
        a.feature && /* @__PURE__ */ i("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: a.feature }),
        y.map((n) => /* @__PURE__ */ c(f, { children: [
          /* @__PURE__ */ i(x, { children: /* @__PURE__ */ i(k, { children: n.label }) }),
          /* @__PURE__ */ i(v, { className: "cm:grid cm:gap-0 cm:divide-y cm:divide-border", children: n.features.map((e) => /* @__PURE__ */ c("div", { className: "cm:flex cm:items-start cm:justify-between cm:gap-4 cm:py-3 cm:first:pt-0 cm:last:pb-0", children: [
            /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ c("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ i("label", { htmlFor: `feature-${e.key}`, className: "cm:font-medium", children: e.label }),
                e.core && /* @__PURE__ */ i(s, { children: "Always on" }),
                e.switched_on && !e.active && /* @__PURE__ */ c(s, { tone: "warning", children: [
                  "Off — ",
                  e.reasons.join("; ").replace(/^Needs /, "needs ")
                ] }),
                e.essential && /* @__PURE__ */ c(s, { tone: "info", children: [
                  "Needed by ",
                  r.label
                ] })
              ] }),
              /* @__PURE__ */ i("p", { className: "cm:text-sm cm:text-muted-foreground", children: e.description }),
              e.requires.length > 0 && /* @__PURE__ */ c("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                "Needs: ",
                e.requires.join(", ")
              ] })
            ] }),
            /* @__PURE__ */ i(
              w,
              {
                id: `feature-${e.key}`,
                checked: e.switched_on,
                disabled: e.core || _ === e.key,
                onCheckedChange: (h) => !h && e.dependents.length > 0 ? t(e) : m(e, h)
              }
            )
          ] }, e.key)) })
        ] }, n.key)),
        /* @__PURE__ */ i(C, { open: l !== null, onOpenChange: (n) => !n && t(null), children: /* @__PURE__ */ c(S, { children: [
          /* @__PURE__ */ c(D, { children: [
            /* @__PURE__ */ c(F, { children: [
              "Switch off ",
              l?.label,
              "?"
            ] }),
            /* @__PURE__ */ c(N, { children: [
              "These are switched off with it: ",
              l?.dependents.map((n) => n.label).join(", "),
              ". Their data is kept."
            ] })
          ] }),
          /* @__PURE__ */ c(j, { children: [
            /* @__PURE__ */ i(d, { variant: "outline", onClick: () => t(null), children: "Cancel" }),
            /* @__PURE__ */ i(
              d,
              {
                variant: "destructive",
                onClick: () => {
                  l && m(l, !1), t(null);
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
export {
  O as default
};
