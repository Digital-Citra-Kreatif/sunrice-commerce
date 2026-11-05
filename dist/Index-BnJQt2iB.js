import { R as m, u as b, a as j, b as u, j as a, c as t, P as x, S as D, i as S, g as q, d as C } from "./main-BtYEwHjd.js";
import { D as _ } from "./DataTable-wHP2fYK-.js";
const $ = { in_stock: "ok", out_of_stock: "error", backorder: "warning" };
function F({ row: n, reasons: d, onClose: s }) {
  const { Dialog: r, DialogContent: o, DialogHeader: v, DialogTitle: y, DialogDescription: f, DialogFooter: k, Button: h, Input: g, Label: i } = C, c = S.useForm({ mode: "add", quantity: 0, reason: "manual", note: "" }), [l, p] = m.useState(null);
  m.useEffect(() => {
    q(u(`commerce/inventory/${n.id}/history`)).then((e) => p(e.data)).catch(() => p([]));
  }, [n.id]);
  const N = c.data.mode === "set" ? c.data.quantity : (n.stock_quantity ?? 0) + c.data.quantity;
  return /* @__PURE__ */ t(r, { open: !0, onOpenChange: (e) => !e && s(), children: /* @__PURE__ */ a(o, { className: "cm:max-w-lg", children: [
    /* @__PURE__ */ a(v, { children: [
      /* @__PURE__ */ t(y, { children: "Adjust stock" }),
      /* @__PURE__ */ a(f, { children: [
        n.product_title,
        n.sku ? ` · ${n.sku}` : "",
        ". Now: ",
        n.track_stock ? n.stock_quantity ?? 0 : "not tracked",
        "."
      ] })
    ] }),
    /* @__PURE__ */ a("form", { id: "adjust-stock", className: "cm:grid cm:gap-3", onSubmit: (e) => {
      e.preventDefault(), c.post(u(`commerce/inventory/${n.id}/adjust`), { preserveScroll: !0, onSuccess: s });
    }, children: [
      /* @__PURE__ */ a("div", { className: "cm:grid cm:grid-cols-2 cm:gap-3", children: [
        /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ t(i, { htmlFor: "adjust-mode", children: "Change" }),
          /* @__PURE__ */ a("select", { id: "adjust-mode", className: "cm:h-9 cm:rounded-md cm:border cm:bg-background cm:px-3 cm:text-sm", value: c.data.mode, onChange: (e) => c.setData("mode", e.target.value), children: [
            /* @__PURE__ */ t("option", { value: "add", children: "Add or remove" }),
            /* @__PURE__ */ t("option", { value: "set", children: "Set to" })
          ] })
        ] }),
        /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ t(i, { htmlFor: "adjust-quantity", children: c.data.mode === "set" ? "New stock" : "Units (+/−)" }),
          /* @__PURE__ */ t(g, { id: "adjust-quantity", type: "number", value: c.data.quantity, onChange: (e) => c.setData("quantity", Number(e.target.value)) }),
          c.errors.quantity && /* @__PURE__ */ t("p", { className: "cm:text-xs cm:text-destructive", children: c.errors.quantity })
        ] })
      ] }),
      /* @__PURE__ */ a("div", { className: "cm:grid cm:grid-cols-2 cm:gap-3", children: [
        /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ t(i, { htmlFor: "adjust-reason", children: "Reason" }),
          /* @__PURE__ */ t("select", { id: "adjust-reason", className: "cm:h-9 cm:rounded-md cm:border cm:bg-background cm:px-3 cm:text-sm", value: c.data.reason, onChange: (e) => c.setData("reason", e.target.value), children: d.map((e) => /* @__PURE__ */ t("option", { value: e, children: e[0].toUpperCase() + e.slice(1) }, e)) })
        ] }),
        /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ t(i, { htmlFor: "adjust-note", children: "Note" }),
          /* @__PURE__ */ t(g, { id: "adjust-note", value: c.data.note, onChange: (e) => c.setData("note", e.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ a("p", { className: "cm:text-sm", children: [
        "Stock after: ",
        /* @__PURE__ */ t("strong", { children: N })
      ] })
    ] }),
    /* @__PURE__ */ a("div", { className: "cm:grid cm:max-h-56 cm:gap-1 cm:overflow-auto cm:border-t cm:pt-3 cm:text-sm", children: [
      /* @__PURE__ */ t("p", { className: "cm:font-medium", children: "History" }),
      l === null ? /* @__PURE__ */ t("p", { className: "cm:text-muted-foreground", children: "Loading…" }) : l.length === 0 ? /* @__PURE__ */ t("p", { className: "cm:text-muted-foreground", children: "No changes yet." }) : l.map((e) => /* @__PURE__ */ a("div", { className: "cm:flex cm:justify-between cm:gap-3", children: [
        /* @__PURE__ */ a("span", { children: [
          e.delta > 0 ? `+${e.delta}` : e.delta,
          " → ",
          e.quantity_after,
          " · ",
          e.reason,
          e.reference ? ` (${e.reference.type} #${e.reference.id})` : "",
          e.note ? ` · ${e.note}` : ""
        ] }),
        /* @__PURE__ */ a("span", { className: "cm:whitespace-nowrap cm:text-muted-foreground", children: [
          e.user ? `${e.user}, ` : "",
          new Date(e.at).toLocaleString()
        ] })
      ] }, e.id))
    ] }),
    /* @__PURE__ */ a(k, { children: [
      /* @__PURE__ */ t(h, { variant: "outline", type: "button", onClick: s, children: "Cancel" }),
      /* @__PURE__ */ t(h, { type: "submit", form: "adjust-stock", disabled: c.processing, children: "Save" })
    ] })
  ] }) });
}
function H(n) {
  const [d, s] = m.useState(null);
  return b(), j([{ label: "Shop", href: u("commerce") }, { label: "Inventory" }]), /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ t(x, { title: "Inventory", description: "Stock of every product variant. Every change is recorded." }),
    /* @__PURE__ */ t(
      _,
      {
        ...n,
        searchPlaceholder: "Search products or SKUs…",
        onRowClick: n.can.adjust ? (r) => s(r) : void 0,
        renderCell: (r, o) => {
          if (o.key === "status") return /* @__PURE__ */ t(D, { tone: r.low ? "warning" : $[r.status], children: r.low ? "Low" : r.status.replace(/_/g, " ") });
          if (o.key === "stock_quantity") return r.track_stock ? r.stock_quantity : /* @__PURE__ */ t("span", { className: "cm:text-muted-foreground", children: "—" });
        }
      }
    ),
    d && /* @__PURE__ */ t(F, { row: d, reasons: n.reasons, onClose: () => s(null) })
  ] });
}
export {
  H as default
};
