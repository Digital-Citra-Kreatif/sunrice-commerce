import { i as w, u as k, a as l, j as t, b as c, P as y, c as v, F as C } from "./main-BjsacfA0.js";
import { I as S } from "./InputError-DQixNzA2.js";
const h = (r) => r === null || r === "" ? "—" : typeof r == "boolean" ? r ? "yes" : "no" : String(r);
function P(r) {
  const { Button: o, Input: g, Label: f } = v, { useForm: b, router: x, Link: N } = w;
  k([{ label: "Shop", href: l("commerce") }, { label: "Products", href: l("commerce/products") }, { label: "Import" }]);
  const a = b({ file: null, create: !1, publish: !1 }), i = r.preview ?? [], s = i.filter((e) => e.error === null && e.create), d = new Set(s.map((e) => e.create.product.toLowerCase())).size, n = i.filter((e) => e.error === null && (Object.keys(e.changes).length > 0 || e.create)), p = i.filter((e) => e.error !== null);
  return /* @__PURE__ */ t("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-6 cm:max-w-5xl", children: [
    /* @__PURE__ */ c(y, { title: "Import products", description: "Change prices, stock and more from a CSV: rows are matched by SKU, and blank cells keep the value." }),
    r.result && /* @__PURE__ */ t("section", { className: "cm:grid cm:gap-2 cm:rounded-lg cm:border cm:p-4", "aria-labelledby": "import-result-title", children: [
      /* @__PURE__ */ c("h2", { id: "import-result-title", className: "cm:font-semibold", children: "Import results" }),
      /* @__PURE__ */ t("p", { className: "cm:text-sm", children: [
        r.result.summary,
        " Some changes were skipped."
      ] }),
      /* @__PURE__ */ c("ul", { className: "cm:list-disc cm:space-y-1 cm:pl-5 cm:text-sm", children: r.result.skipped.map((e, m) => /* @__PURE__ */ t("li", { children: [
        "Line ",
        e.line,
        " · ",
        /* @__PURE__ */ c("strong", { children: e.sku }),
        " · ",
        e.reason
      ] }, m)) })
    ] }),
    /* @__PURE__ */ t("form", { className: "cm:grid cm:max-w-xl cm:gap-3", onSubmit: (e) => {
      e.preventDefault(), a.post(l("commerce/products/import"), { forceFormData: !0 });
    }, children: [
      /* @__PURE__ */ c(f, { htmlFor: "import-file", children: "CSV file" }),
      /* @__PURE__ */ c(
        g,
        {
          id: "import-file",
          type: "file",
          accept: ".csv,text/csv",
          "aria-describedby": "import-help",
          onChange: (e) => a.setData("file", e.target.files?.[0] ?? null)
        }
      ),
      /* @__PURE__ */ t("p", { id: "import-help", className: "cm:text-sm cm:text-muted-foreground", children: [
        r.canExport && /* @__PURE__ */ t(C, { children: [
          "Start from ",
          /* @__PURE__ */ c("a", { className: "cm:underline", href: l("commerce/products/export"), children: "the export" }),
          ". "
        ] }),
        "Columns: ",
        r.columns.join(", "),
        "; the import changes ",
        r.changeable.filter((e) => e !== "stock" || r.canAdjustStock).join(", "),
        ". Amounts in the store's currency with a dot for decimals; 0 clears a compare-at price or cost. Up to ",
        r.maxRows,
        " rows."
      ] }),
      r.canCreate && /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-2 cm:text-sm", children: [
        /* @__PURE__ */ t("label", { className: "cm:flex cm:items-start cm:gap-2", children: [
          /* @__PURE__ */ c("input", { type: "checkbox", className: "cm:mt-1", checked: a.data.create, onChange: (e) => a.setData("create", e.target.checked) }),
          /* @__PURE__ */ t("span", { children: [
            "Create products for SKUs no product has. Rows with the same ",
            /* @__PURE__ */ c("code", { children: "product" }),
            " become one product, their ",
            /* @__PURE__ */ c("code", { children: "variant" }),
            " (S, M…) its variants; ",
            /* @__PURE__ */ c("code", { children: "option" }),
            " names them (Size by default) and ",
            /* @__PURE__ */ c("code", { children: "category" }),
            " files the product under a category. Each new row needs a price."
          ] })
        ] }),
        a.data.create && /* @__PURE__ */ t("label", { className: "cm:flex cm:items-center cm:gap-2 cm:pl-6", children: [
          /* @__PURE__ */ c("input", { type: "checkbox", checked: a.data.publish, onChange: (e) => a.setData("publish", e.target.checked) }),
          /* @__PURE__ */ c("span", { children: "Publish new products (otherwise they're drafts, to add photos first)" })
        ] })
      ] }),
      /* @__PURE__ */ c(S, { message: a.errors.file }),
      /* @__PURE__ */ c("div", { children: /* @__PURE__ */ c(o, { type: "submit", disabled: a.processing || a.data.file === null, children: "Preview changes" }) })
    ] }),
    r.preview !== null && /* @__PURE__ */ t("section", { className: "cm:grid cm:gap-3", "aria-labelledby": "preview-title", children: [
      /* @__PURE__ */ t("h2", { id: "preview-title", className: "cm:text-lg cm:font-semibold", children: [
        n.length - s.length,
        " ",
        n.length - s.length === 1 ? "variant changes" : "variants change",
        d > 0 ? `, ${d} new ${d === 1 ? "product" : "products"} (${s.length} ${s.length === 1 ? "variant" : "variants"})` : "",
        p.length > 0 ? `, ${p.length} rows can't be used` : ""
      ] }),
      /* @__PURE__ */ c("div", { className: "cm:overflow-x-auto cm:rounded-lg cm:border", children: /* @__PURE__ */ t("table", { className: "cm:w-full cm:text-sm", children: [
        /* @__PURE__ */ c("thead", { children: /* @__PURE__ */ t("tr", { className: "cm:border-b cm:text-left", children: [
          /* @__PURE__ */ c("th", { className: "cm:p-2", children: "Line" }),
          /* @__PURE__ */ c("th", { className: "cm:p-2", children: "SKU" }),
          /* @__PURE__ */ c("th", { className: "cm:p-2", children: "Product" }),
          /* @__PURE__ */ c("th", { className: "cm:p-2", children: "Changes" })
        ] }) }),
        /* @__PURE__ */ c("tbody", { children: i.filter((e) => e.error !== null || Object.keys(e.changes).length > 0 || e.create).map((e) => /* @__PURE__ */ t("tr", { className: "cm:border-b cm:align-top", children: [
          /* @__PURE__ */ c("td", { className: "cm:p-2", children: e.line }),
          /* @__PURE__ */ c("td", { className: "cm:p-2 cm:font-mono", children: e.sku || "—" }),
          /* @__PURE__ */ c("td", { className: "cm:p-2", children: e.product || "—" }),
          /* @__PURE__ */ c("td", { className: "cm:p-2", children: e.error !== null ? /* @__PURE__ */ c("span", { className: "cm:text-destructive", children: e.error }) : e.create ? /* @__PURE__ */ t("span", { children: [
            /* @__PURE__ */ c("strong", { children: "New" }),
            " · price ",
            h(e.create.price),
            e.create.stock !== null ? ` · stock ${e.create.stock}` : ""
          ] }) : /* @__PURE__ */ c("ul", { children: Object.entries(e.changes).map(([m, u]) => /* @__PURE__ */ t("li", { children: [
            m,
            ": ",
            h(u.from),
            " → ",
            /* @__PURE__ */ c("strong", { children: h(u.to) })
          ] }, m)) }) })
        ] }, e.line)) })
      ] }) }),
      /* @__PURE__ */ t("div", { className: "cm:flex cm:gap-2", children: [
        /* @__PURE__ */ t(o, { type: "button", disabled: n.length === 0, onClick: () => x.post(l("commerce/products/import/apply"), { token: r.token }), children: [
          "Apply ",
          n.length,
          " ",
          n.length === 1 ? "change" : "changes"
        ] }),
        /* @__PURE__ */ c(o, { asChild: !0, variant: "outline", children: /* @__PURE__ */ c(N, { href: l("commerce/products"), children: "Cancel" }) })
      ] })
    ] })
  ] });
}
export {
  P as default
};
