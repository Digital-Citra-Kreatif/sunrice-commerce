import { u, a as l, b as s, j as d, c as a, P as h, n as f, d as p, i as x } from "./main-p2UnqZyH.js";
function g({ title: m, description: c, form: t, breadcrumbs: o = [], deleteUrl: r, deleteConfirm: i }) {
  const { Button: n } = p;
  return u(), l([...o.map((e) => ({ ...e, href: e.href ? s(e.href) : void 0 })), { label: m }]), /* @__PURE__ */ d("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-3xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ a(h, { title: m, description: c }),
    /* @__PURE__ */ a(f, { form: t, footer: r ? /* @__PURE__ */ a(
      n,
      {
        type: "button",
        variant: "ghost",
        className: "cm:ml-auto cm:text-destructive",
        onClick: () => window.confirm(i ?? "Delete this?") && x.router.delete(s(r)),
        children: "Delete"
      }
    ) : null })
  ] });
}
export {
  g as default
};
