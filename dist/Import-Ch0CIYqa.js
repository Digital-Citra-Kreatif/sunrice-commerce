import { i as x, a as N, b as l, j as r, c as e, P as w, d as v } from "./main-BZm25ssn.js";
import { I as y } from "./InputError-Ah7nZD43.js";
const h = (t) => t === null || t === "" ? "—" : typeof t == "boolean" ? t ? "yes" : "no" : String(t);
function C(t) {
  const { Button: s, Input: p, Label: u } = v, { useForm: g, router: f, Link: b } = x;
  N([{ label: "Shop", href: l("commerce") }, { label: "Products", href: l("commerce/products") }, { label: "Import" }]);
  const a = g({ file: null }), i = t.preview ?? [], n = i.filter((c) => c.error === null && Object.keys(c.changes).length > 0), m = i.filter((c) => c.error !== null);
  return /* @__PURE__ */ r("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-6 cm:max-w-5xl", children: [
    /* @__PURE__ */ e(w, { title: "Import products", description: "Change prices, stock and more from a CSV: rows are matched by SKU, and blank cells keep the value." }),
    /* @__PURE__ */ r("form", { className: "cm:grid cm:max-w-xl cm:gap-3", onSubmit: (c) => {
      c.preventDefault(), a.post(l("commerce/products/import"), { forceFormData: !0 });
    }, children: [
      /* @__PURE__ */ e(u, { htmlFor: "import-file", children: "CSV file" }),
      /* @__PURE__ */ e(
        p,
        {
          id: "import-file",
          type: "file",
          accept: ".csv,text/csv",
          "aria-describedby": "import-help",
          onChange: (c) => a.setData("file", c.target.files?.[0] ?? null)
        }
      ),
      /* @__PURE__ */ r("p", { id: "import-help", className: "cm:text-sm cm:text-muted-foreground", children: [
        "Start from ",
        /* @__PURE__ */ e("a", { className: "cm:underline", href: l("commerce/products/export"), children: "the export" }),
        ". Columns: ",
        t.columns.join(", "),
        "; the import changes ",
        t.changeable.filter((c) => c !== "stock" || t.canAdjustStock).join(", "),
        ". Amounts in the store's currency with a dot for decimals; 0 clears a compare-at price or cost. Up to ",
        t.maxRows,
        " rows."
      ] }),
      /* @__PURE__ */ e(y, { message: a.errors.file }),
      /* @__PURE__ */ e("div", { children: /* @__PURE__ */ e(s, { type: "submit", disabled: a.processing || a.data.file === null, children: "Preview changes" }) })
    ] }),
    t.preview !== null && /* @__PURE__ */ r("section", { className: "cm:grid cm:gap-3", "aria-labelledby": "preview-title", children: [
      /* @__PURE__ */ r("h2", { id: "preview-title", className: "cm:text-lg cm:font-semibold", children: [
        n.length,
        " ",
        n.length === 1 ? "variant changes" : "variants change",
        m.length > 0 ? `, ${m.length} rows can't be used` : ""
      ] }),
      /* @__PURE__ */ e("div", { className: "cm:overflow-x-auto cm:rounded-lg cm:border", children: /* @__PURE__ */ r("table", { className: "cm:w-full cm:text-sm", children: [
        /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ r("tr", { className: "cm:border-b cm:text-left", children: [
          /* @__PURE__ */ e("th", { className: "cm:p-2", children: "Line" }),
          /* @__PURE__ */ e("th", { className: "cm:p-2", children: "SKU" }),
          /* @__PURE__ */ e("th", { className: "cm:p-2", children: "Product" }),
          /* @__PURE__ */ e("th", { className: "cm:p-2", children: "Changes" })
        ] }) }),
        /* @__PURE__ */ e("tbody", { children: i.filter((c) => c.error !== null || Object.keys(c.changes).length > 0).map((c) => /* @__PURE__ */ r("tr", { className: "cm:border-b cm:align-top", children: [
          /* @__PURE__ */ e("td", { className: "cm:p-2", children: c.line }),
          /* @__PURE__ */ e("td", { className: "cm:p-2 cm:font-mono", children: c.sku || "—" }),
          /* @__PURE__ */ e("td", { className: "cm:p-2", children: c.product || "—" }),
          /* @__PURE__ */ e("td", { className: "cm:p-2", children: c.error !== null ? /* @__PURE__ */ e("span", { className: "cm:text-destructive", children: c.error }) : /* @__PURE__ */ e("ul", { children: Object.entries(c.changes).map(([o, d]) => /* @__PURE__ */ r("li", { children: [
            o,
            ": ",
            h(d.from),
            " → ",
            /* @__PURE__ */ e("strong", { children: h(d.to) })
          ] }, o)) }) })
        ] }, c.line)) })
      ] }) }),
      /* @__PURE__ */ r("div", { className: "cm:flex cm:gap-2", children: [
        /* @__PURE__ */ r(s, { type: "button", disabled: n.length === 0, onClick: () => f.post(l("commerce/products/import/apply"), { token: t.token }), children: [
          "Apply ",
          n.length,
          " ",
          n.length === 1 ? "change" : "changes"
        ] }),
        /* @__PURE__ */ e(s, { asChild: !0, variant: "outline", children: /* @__PURE__ */ e(b, { href: l("commerce/products"), children: "Cancel" }) })
      ] })
    ] })
  ] });
}
export {
  C as default
};
