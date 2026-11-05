import { i as d, u, a as s, b as t, j as n, c as a, P as h, d as m, S as f } from "./main-p2UnqZyH.js";
import { D as o } from "./DataTable-D06aocqP.js";
function x(e) {
  const { Button: i } = m, { Link: c } = d;
  return u(), s([{ label: "Shop", href: t("commerce") }, { label: e.title }]), /* @__PURE__ */ n("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ a(
      h,
      {
        title: e.title,
        description: e.description,
        actions: e.createUrl || e.exportUrl ? /* @__PURE__ */ n("div", { className: "cm:flex cm:gap-2", children: [
          e.exportUrl ? /* @__PURE__ */ a(i, { asChild: !0, variant: "outline", children: /* @__PURE__ */ a("a", { href: e.exportUrl + window.location.search, children: "Export CSV" }) }) : null,
          e.createUrl ? /* @__PURE__ */ a(i, { asChild: !0, children: /* @__PURE__ */ a(c, { href: t(e.createUrl), children: e.createLabel ?? "New" }) }) : null
        ] }) : null
      }
    ),
    /* @__PURE__ */ a(
      o,
      {
        ...e,
        bulkUrl: e.bulkUrl ? t(e.bulkUrl) : void 0,
        rowHref: (l) => l.href ? t(l.href) : null,
        renderCell: (l, r) => r.type === "badge" && l[r.key] != null ? /* @__PURE__ */ a(f, { tone: l[`${r.key}_tone`] ?? "neutral", children: String(l[r.key]) }) : void 0
      }
    )
  ] });
}
export {
  x as default
};
