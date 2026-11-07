import { i as n, u as c, a as s, b as t, j as u, c as l, P as m, d as o, S as h } from "./main-DVaJaMrz.js";
import { D as f } from "./DataTable-Byd2fWIw.js";
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
