import { i as n, d as c, u as s, a as t, j as u, b as l, P as m, c as o, S as h } from "./main-Dwve2_KU.js";
import { D as f } from "./DataTable-D-dXQn5v.js";
function U(e) {
  const { Button: i } = o, { Link: d } = n;
  return c(), s([{ label: "Shop", href: t("commerce") }, { label: e.title }]), /* @__PURE__ */ u("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-6", children: [
    /* @__PURE__ */ l(
      m,
      {
        title: e.title,
        description: e.description,
        primary: e.createUrl ? /* @__PURE__ */ l(i, { asChild: !0, children: /* @__PURE__ */ l(d, { href: t(e.createUrl), children: e.createLabel ?? "New" }) }) : void 0,
        menu: e.exportUrl ? [{ label: "Export CSV", href: e.exportUrl + window.location.search, download: !0 }] : void 0
      }
    ),
    /* @__PURE__ */ l(
      f,
      {
        ...e,
        bulkUrl: e.bulkUrl ? t(e.bulkUrl) : void 0,
        rowHref: (a) => a.href ? t(a.href) : null,
        renderCell: (a, r) => r.type === "badge" && a[r.key] != null ? /* @__PURE__ */ l(h, { tone: a[`${r.key}_tone`] ?? "neutral", children: String(a[r.key]) }) : void 0
      }
    )
  ] });
}
export {
  U as default
};
