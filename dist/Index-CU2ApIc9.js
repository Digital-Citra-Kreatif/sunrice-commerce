import { i as l, u as o, a as u, b as a, j as c, c as t, P as m, d as h, S as r } from "./main-Bwk0AAzX.js";
import { D as p } from "./DataTable-BP67JUx_.js";
const f = { published: "ok", draft: "neutral", scheduled: "info", trashed: "error" };
function k(s) {
  const { Button: n } = h, { Link: d } = l;
  return o(), u([{ label: "Shop", href: a("commerce") }, { label: "Products" }]), /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ t(
      m,
      {
        title: "Products",
        description: "Products are entries: opening one goes to the editor.",
        actions: /* @__PURE__ */ t(n, { asChild: !0, children: /* @__PURE__ */ t(d, { href: a(s.createUrl), children: "New product" }) })
      }
    ),
    /* @__PURE__ */ t(
      p,
      {
        ...s,
        searchPlaceholder: "Search titles or SKUs…",
        rowHref: (e) => a(e.href),
        renderCell: (e, i) => {
          switch (i.key) {
            case "product_title":
              return /* @__PURE__ */ c("span", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ t("span", { className: "cm:font-medium", children: e.product_title }),
                e.featured && /* @__PURE__ */ t(r, { tone: "info", children: "Featured" }),
                e.sync_failed && /* @__PURE__ */ t("span", { title: e.sync_error ?? "", children: /* @__PURE__ */ t(r, { tone: "error", children: "Can't be bought" }) })
              ] });
            case "state":
              return /* @__PURE__ */ t(r, { tone: f[e.state], children: e.state });
            case "stock":
              return e.stock === null ? "—" : /* @__PURE__ */ t("span", { className: e.in_stock === !1 ? "cm:text-destructive" : "", children: e.stock });
            case "type":
              return /* @__PURE__ */ t(r, { children: e.type });
            default:
              return;
          }
        }
      }
    )
  ] });
}
export {
  k as default
};
