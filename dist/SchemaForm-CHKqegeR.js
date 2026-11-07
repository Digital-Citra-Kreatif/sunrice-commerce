import { u as f, a as h, b as m, j as u, c as a, P as p, d as x, i as v, o as b } from "./main-Zvb9Pf3Y.js";
const n = "commerce-schema-form";
function g({ title: o, description: l, form: r, breadcrumbs: s = [], deleteUrl: t, deleteConfirm: d }) {
  const { Button: i } = x;
  f(), h([...s.map((e) => ({ ...e, href: e.href ? m(e.href) : void 0 })), { label: o }]);
  const c = [...s].reverse().find((e) => e.href && e.href !== "commerce");
  return /* @__PURE__ */ u("div", { className: "cm:flex cm:min-w-0 cm:max-w-5xl cm:flex-col cm:gap-6", children: [
    /* @__PURE__ */ a(
      p,
      {
        title: o,
        description: l,
        back: c?.href ? { href: m(c.href), label: `Back to ${c.label.toLowerCase()}` } : void 0,
        actions: t ? /* @__PURE__ */ a(
          i,
          {
            type: "button",
            variant: "outline",
            className: "cm:text-destructive",
            onClick: () => window.confirm(d ?? "Delete this?") && v.router.delete(m(t)),
            children: "Delete"
          }
        ) : void 0,
        primary: /* @__PURE__ */ a(i, { type: "submit", form: n, children: r.submitLabel })
      }
    ),
    /* @__PURE__ */ a(b, { form: r, id: n, storageKey: `commerce:form:${r.action.replace(/\/\d+/g, "")}` })
  ] });
}
export {
  g as default
};
