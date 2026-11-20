import { d as u, u as v, a as r, R as p, j as x, b as a, P as b, c as g, i as w, m as S } from "./main-CFlXDyeG.js";
const n = "commerce-schema-form";
function y({ title: t, description: l, form: s, breadcrumbs: o = [], deleteUrl: i, deleteConfirm: d }) {
  const { Button: m } = g;
  u(), v([...o.map((e) => ({ ...e, href: e.href ? r(e.href) : void 0 })), { label: t }]);
  const [f, h] = p.useState(!1), c = [...o].reverse().find((e) => e.href && e.href !== "commerce");
  return /* @__PURE__ */ x("div", { className: "cm:flex cm:min-w-0 cm:max-w-5xl cm:flex-col cm:gap-6", children: [
    /* @__PURE__ */ a(
      b,
      {
        title: t,
        description: l,
        back: c?.href ? { href: r(c.href), label: `Back to ${c.label.toLowerCase()}` } : void 0,
        actions: i ? /* @__PURE__ */ a(
          m,
          {
            type: "button",
            variant: "outline",
            className: "cm:text-destructive",
            onClick: () => window.confirm(d ?? "Delete this?") && w.router.delete(r(i)),
            children: "Delete"
          }
        ) : void 0,
        primary: /* @__PURE__ */ a(m, { type: "submit", form: n, disabled: f, children: s.submitLabel })
      }
    ),
    /* @__PURE__ */ a(S, { form: s, id: n, onProcessing: h, storageKey: `commerce:form:${s.action.replace(/\/\d+/g, "")}` })
  ] });
}
export {
  y as default
};
