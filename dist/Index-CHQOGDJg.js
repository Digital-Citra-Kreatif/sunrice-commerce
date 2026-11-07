import { i as o, u as i, a as u, b as r, j as s, c as t, P as m, d as h, S as a } from "./main-DqBD_5_V.js";
import { D as p } from "./DataTable-3ORWGZQn.js";
const f = { published: "ok", draft: "neutral", scheduled: "info", trashed: "error" };
function S(c) {
  const { Button: n } = h, { Link: l } = o;
  return i(), u([{ label: "Shop", href: r("commerce") }, { label: "Products" }]), /* @__PURE__ */ s("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-6", children: [
    /* @__PURE__ */ t(
      m,
      {
        title: "Products",
        description: "Products are entries: opening one goes to the editor.",
        primary: /* @__PURE__ */ t(n, { asChild: !0, children: /* @__PURE__ */ t(l, { href: r(c.createUrl), children: "New product" }) }),
        menu: [
          { label: "Export CSV", href: r("commerce/products/export"), download: !0 },
          { label: "Import CSV", href: r("commerce/products/import") }
        ]
      }
    ),
    /* @__PURE__ */ t(
      p,
      {
        ...c,
        searchPlaceholder: "Search titles or SKUs…",
        rowHref: (e) => r(e.href),
        renderCell: (e, d) => {
          switch (d.key) {
            case "product_title":
              return /* @__PURE__ */ s("span", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ t("span", { className: "cm:font-medium", children: e.product_title }),
                e.featured && /* @__PURE__ */ t(a, { tone: "info", children: "Featured" }),
                e.sync_failed && /* @__PURE__ */ t("span", { title: e.sync_error ?? "", children: /* @__PURE__ */ t(a, { tone: "error", children: "Can't be bought" }) })
              ] });
            case "state":
              return /* @__PURE__ */ t(a, { tone: f[e.state], children: e.state });
            case "stock":
              return e.stock === null ? "—" : /* @__PURE__ */ t("span", { className: e.in_stock === !1 ? "cm:text-destructive" : "", children: e.stock });
            case "type":
              return /* @__PURE__ */ t(a, { children: e.type });
            default:
              return;
          }
        }
      }
    )
  ] });
}
export {
  S as default
};
