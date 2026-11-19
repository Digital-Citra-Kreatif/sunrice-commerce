import { c as e, m as K, j as m, d as T, M as Y, R as x, h as L, b as R, g as E, t as Z, S as ee, k as te, u as ne, i as le, e as ie } from "./main-K9ySWjuN.js";
function D() {
  return (globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`).replace(/-/g, "").slice(0, 32);
}
function H(t) {
  return Object.keys(t).sort().map((l) => `${l}=${t[l]}`).join("|");
}
function re(t) {
  let l = [{}];
  for (const i of t) {
    if (i.values.length === 0) return [];
    const r = [];
    for (const s of l)
      for (const n of i.values)
        r.push({ ...s, [i.id]: n.id });
    l = r;
  }
  return t.length === 0 ? [] : l;
}
function ae(t, l, i, r = 100) {
  const s = new Map(l.map((n) => [H(n.options), n]));
  return re(t).slice(0, r).map((n) => {
    const o = s.get(H(n));
    return o ? { ...o, options: n } : { ...i, id: D(), sku: null, options: n, active: !0, price: i.price ?? 0 };
  });
}
function G(t, l, i = {}) {
  return t.map((r) => {
    const s = r.values.find((n) => n.id === l.options[r.id]);
    return s ? s.label ?? (s.term_id ? i[s.term_id] ?? `#${s.term_id}` : "?") : "?";
  }).join(" / ");
}
function f({ label: t, hint: l, children: i, htmlFor: r, className: s }) {
  const { Label: n } = T;
  return /* @__PURE__ */ m("div", { className: K("cm:grid cm:content-start cm:gap-1.5", s), children: [
    /* @__PURE__ */ e(n, { htmlFor: r, children: t }),
    i,
    l && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: l })
  ] });
}
function M({ children: t, cols: l = 3 }) {
  return /* @__PURE__ */ e("div", { className: K("cm:grid cm:items-start cm:gap-4", { 2: "cm:sm:grid-cols-2", 3: "cm:sm:grid-cols-2 cm:lg:grid-cols-3", 4: "cm:sm:grid-cols-2 cm:lg:grid-cols-4" }[l]), children: t });
}
function w({ id: t, value: l, onChange: i, min: r = 0, placeholder: s }) {
  const { Input: n } = T;
  return /* @__PURE__ */ e(
    n,
    {
      id: t,
      type: "number",
      inputMode: "numeric",
      min: r,
      value: l ?? "",
      placeholder: s,
      onChange: (o) => i(o.target.value === "" ? null : Math.round(Number(o.target.value)))
    }
  );
}
function U({ id: t, value: l, onChange: i, placeholder: r, onBlur: s }) {
  const { Input: n } = T;
  return /* @__PURE__ */ e(
    n,
    {
      id: t,
      value: l ?? "",
      placeholder: r,
      onBlur: s,
      onChange: (o) => i(o.target.value === "" ? null : o.target.value)
    }
  );
}
function P({ id: t, value: l, onChange: i, nullable: r = !0 }) {
  return /* @__PURE__ */ e(Y, { id: t, value: l, allowNull: r, onChange: i });
}
function O({ id: t, label: l, checked: i, onChange: r, hint: s }) {
  const { Switch: n, Label: o } = T;
  return /* @__PURE__ */ m("div", { className: "cm:flex cm:items-start cm:gap-3", children: [
    /* @__PURE__ */ e(n, { id: t, checked: i, onCheckedChange: r }),
    /* @__PURE__ */ m("div", { className: "cm:grid cm:gap-0.5", children: [
      /* @__PURE__ */ e(o, { htmlFor: t, children: l }),
      s && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: s })
    ] })
  ] });
}
const se = "cm:h-10 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm";
function F({ id: t, value: l, onChange: i, options: r }) {
  return /* @__PURE__ */ e("select", { id: t, className: se, value: l, onChange: (s) => i(s.target.value), children: r.map(([s, n]) => /* @__PURE__ */ e("option", { value: s, children: n }, s)) });
}
function I({ title: t, description: l, children: i, actions: r }) {
  return /* @__PURE__ */ m("section", { className: "cm:grid cm:gap-4", children: [
    /* @__PURE__ */ m("div", { className: "cm:flex cm:items-start cm:justify-between cm:gap-3", children: [
      /* @__PURE__ */ m("div", { className: "cm:grid cm:gap-0.5", children: [
        /* @__PURE__ */ e("h3", { className: "cm:text-sm cm:font-semibold", children: t }),
        l && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: l })
      ] }),
      r
    ] }),
    i
  ] });
}
function oe({ value: t, update: l, path: i }) {
  const { Button: r, Input: s } = T, n = t.bundle ?? { pricing: "fixed", value: 0, items: [] }, [o, a] = x.useState({}), [v, h] = x.useState(""), [k, p] = x.useState([]), d = n.items.map((g) => g.variant_id).filter((g) => !!g);
  x.useEffect(() => {
    const g = d.filter((b) => !o[b]);
    g.length !== 0 && L(R(`commerce/api/variants?${g.map((b) => `ids[]=${b}`).join("&")}`)).then((b) => a((N) => ({ ...N, ...Object.fromEntries(b.data.map((q) => [q.id, q])) }))).catch(() => {
    });
  }, [d.join(",")]), x.useEffect(() => {
    if (v.trim().length < 2) return p([]);
    const g = setTimeout(() => L(R(`commerce/api/variants?q=${encodeURIComponent(v)}`)).then((b) => p(b.data)).catch(() => {
    }), 250);
    return () => clearTimeout(g);
  }, [v]);
  const u = (g) => l({ bundle: { ...n, ...g } }), _ = n.items.reduce((g, b) => g + (o[b.variant_id ?? 0]?.price ?? 0) * b.quantity, 0);
  return /* @__PURE__ */ m("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ m(I, { title: "Products in the bundle", description: "Bundles take their stock from these products.", children: [
      n.items.map((g, b) => /* @__PURE__ */ m("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ e("span", { className: "cm:flex-1 cm:text-sm", children: o[g.variant_id ?? 0]?.label ?? `#${g.variant_id}` }),
        /* @__PURE__ */ e("div", { className: "cm:w-24", children: /* @__PURE__ */ e(w, { min: 1, value: g.quantity, onChange: (N) => u({ items: n.items.map((q, j) => j === b ? { ...q, quantity: N ?? 1 } : q) }) }) }),
        /* @__PURE__ */ e(r, { type: "button", variant: "ghost", size: "sm", onClick: () => u({ items: n.items.filter((N, q) => q !== b) }), children: "Remove" })
      ] }, b)),
      /* @__PURE__ */ m("div", { className: "cm:relative", children: [
        /* @__PURE__ */ e(s, { value: v, placeholder: "Search products or SKUs to add…", "aria-label": "Add a product to the bundle", onChange: (g) => h(g.target.value) }),
        k.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-10 cm:mt-1 cm:max-h-64 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: k.map((g) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ m(
          "button",
          {
            type: "button",
            className: "cm:flex cm:w-full cm:justify-between cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted",
            onClick: () => {
              a((b) => ({ ...b, [g.id]: g })), u({ items: [...n.items, { variant_id: g.id, quantity: 1 }] }), h("");
            },
            children: [
              /* @__PURE__ */ m("span", { children: [
                g.label,
                g.sku && /* @__PURE__ */ m("span", { className: "cm:text-muted-foreground", children: [
                  " · ",
                  g.sku
                ] })
              ] }),
              /* @__PURE__ */ e("span", { children: E(g.price) })
            ]
          }
        ) }, g.id)) })
      ] })
    ] }),
    /* @__PURE__ */ e(I, { title: "Bundle price", description: `The products cost ${E(_)} together.`, children: /* @__PURE__ */ m("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(f, { label: "Price", htmlFor: `${i}-bundle-pricing`, children: /* @__PURE__ */ e(
        F,
        {
          id: `${i}-bundle-pricing`,
          value: n.pricing,
          onChange: (g) => u({ pricing: g, value: 0 }),
          options: [["fixed", "Its own price (General tab)"], ["percent_off", "Total minus a percentage"], ["amount_off", "Total minus an amount"]]
        }
      ) }),
      n.pricing === "percent_off" && /* @__PURE__ */ e(f, { label: "Percent off", htmlFor: `${i}-bundle-value`, children: /* @__PURE__ */ e(w, { id: `${i}-bundle-value`, value: n.value / 100, onChange: (g) => u({ value: Math.round((g ?? 0) * 100) }) }) }),
      n.pricing === "amount_off" && /* @__PURE__ */ e(f, { label: "Amount off", htmlFor: `${i}-bundle-value`, children: /* @__PURE__ */ e(P, { id: `${i}-bundle-value`, value: n.value, nullable: !1, onChange: (g) => u({ value: g ?? 0 }) }) })
    ] }) })
  ] });
}
function ce() {
  return decodeURIComponent(document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/)?.[1] ?? "");
}
function de({ value: t, update: l, path: i }) {
  const { Button: r } = T, [s, n] = x.useState(!1), o = x.useRef(null), a = t.delivery ?? { modes: ["link", "account"], download_limit: null, expiry_days: null }, v = (p) => l({ delivery: { ...a, ...p } }), h = (p, d) => l({ downloads: t.downloads.map((u, _) => _ === p ? { ...u, ...d } : u) }), k = async (p) => {
    if (p?.length) {
      n(!0);
      try {
        const d = [];
        for (const u of Array.from(p)) {
          const _ = new FormData();
          _.append("file", u);
          const g = await fetch(R("commerce/api/downloads"), { method: "POST", body: _, headers: { "X-XSRF-TOKEN": ce(), Accept: "application/json" }, credentials: "same-origin" }), b = await g.json();
          if (!g.ok) throw new Error(b.message ?? "Upload failed");
          d.push({ id: D(), type: "file", file_id: b.data.id, url: null, name: u.name.replace(/\.[^.]+$/, ""), file: b.data });
        }
        l({ downloads: [...t.downloads, ...d] });
      } catch (d) {
        Z.error(d instanceof Error ? d.message : "Upload failed");
      } finally {
        n(!1), o.current && (o.current.value = "");
      }
    }
  };
  return /* @__PURE__ */ m("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ m(
      I,
      {
        title: "Files and links",
        description: "Files are stored privately and only served to customers who bought them.",
        actions: /* @__PURE__ */ m("div", { className: "cm:flex cm:gap-2", children: [
          /* @__PURE__ */ e(r, { type: "button", variant: "outline", size: "sm", disabled: s, onClick: () => o.current?.click(), children: s ? "Uploading…" : "Upload file" }),
          /* @__PURE__ */ e(r, { type: "button", variant: "outline", size: "sm", onClick: () => l({ downloads: [...t.downloads, { id: D(), type: "url", file_id: null, url: null, name: "" }] }), children: "Add link" }),
          /* @__PURE__ */ e("input", { ref: o, type: "file", multiple: !0, hidden: !0, onChange: (p) => k(p.target.files) })
        ] }),
        children: [
          t.downloads.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No files yet." }),
          t.downloads.map((p, d) => /* @__PURE__ */ m("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(f, { label: "Name", htmlFor: `${i}-dl-${d}`, children: /* @__PURE__ */ e(U, { id: `${i}-dl-${d}`, value: p.name, onChange: (u) => h(d, { name: u ?? "" }) }) }),
            p.type === "url" ? /* @__PURE__ */ e(f, { label: "Link", htmlFor: `${i}-dl-${d}-url`, children: /* @__PURE__ */ e(U, { id: `${i}-dl-${d}-url`, value: p.url, placeholder: "https://", onChange: (u) => h(d, { url: u }) }) }) : /* @__PURE__ */ e(f, { label: "File", children: /* @__PURE__ */ e("p", { className: "cm:truncate cm:text-sm cm:text-muted-foreground", children: p.file?.filename ?? `File #${p.file_id}` }) }),
            /* @__PURE__ */ e(r, { type: "button", variant: "ghost", size: "sm", onClick: () => l({ downloads: t.downloads.filter((u, _) => _ !== d) }), children: "Remove" })
          ] }, p.id ?? d))
        ]
      }
    ),
    /* @__PURE__ */ m(I, { title: "Delivery", children: [
      /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-3", children: [["attachment", "Attach files to the email"], ["link", "Download links in the email"], ["account", "Library in My Account"]].map(([p, d]) => /* @__PURE__ */ e(
        O,
        {
          id: `${i}-mode-${p}`,
          label: d,
          checked: a.modes.includes(p),
          onChange: (u) => v({ modes: u ? [...a.modes, p] : a.modes.filter((_) => _ !== p) })
        },
        p
      )) }),
      /* @__PURE__ */ m("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
        /* @__PURE__ */ e(f, { label: "Downloads per file", htmlFor: `${i}-limit`, hint: "Empty: unlimited.", children: /* @__PURE__ */ e(w, { id: `${i}-limit`, min: 1, value: a.download_limit, onChange: (p) => v({ download_limit: p }) }) }),
        /* @__PURE__ */ e(f, { label: "Links expire after (days)", htmlFor: `${i}-expiry`, hint: "Empty: never.", children: /* @__PURE__ */ e(w, { id: `${i}-expiry`, min: 1, value: a.expiry_days, onChange: (p) => v({ expiry_days: p }) }) })
      ] })
    ] })
  ] });
}
function X({ id: t, value: l, onChange: i, entryId: r }) {
  const [s, n] = x.useState(null);
  return /* @__PURE__ */ m("div", { className: "cm:grid cm:gap-1", children: [
    /* @__PURE__ */ e(U, { id: t, value: l, onChange: (a) => {
      n(null), i(a);
    }, onBlur: () => {
      if (!l) return n(null);
      const a = new URLSearchParams({ sku: l, entry: String(r ?? 0) });
      L(R(`commerce/api/sku-check?${a}`)).then((v) => n(v.available ? null : v.product ?? "another product")).catch(() => n(null));
    } }),
    s && /* @__PURE__ */ m("p", { className: "cm:text-xs cm:text-destructive", children: [
      "Already used by ",
      s,
      "."
    ] })
  ] });
}
const me = [
  ["default", "Follow the store (selling mode)"],
  ["cart", "Add to cart"],
  ["inquiry", "Inquiry form"],
  ["whatsapp", "Ask on WhatsApp"],
  ["external", "Links to other shops"],
  ["none", "No button (display only)"]
];
function ue({ value: t, update: l, updateVariant: i, config: r, entryId: s, path: n }) {
  const { Button: o } = T, a = [["simple", "Simple product"]];
  (r.features.variants || t.type === "variable") && a.push(["variable", "Variable product (sizes, colors…)"]), (r.features.bundles || t.type === "bundle") && a.push(["bundle", "Bundle of other products"]);
  const v = t.variants[0];
  return /* @__PURE__ */ m("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ m(M, { cols: 2, children: [
      /* @__PURE__ */ e(f, { label: "Product type", htmlFor: `${n}-type`, children: /* @__PURE__ */ e(F, { id: `${n}-type`, value: t.type, options: a, onChange: (h) => l({ type: h }) }) }),
      /* @__PURE__ */ e(f, { label: "Storefront button", htmlFor: `${n}-mode`, hint: "Uses the selling mode in Store settings unless overridden here.", children: /* @__PURE__ */ e(F, { id: `${n}-mode`, value: t.purchase_mode, options: me, onChange: (h) => l({ purchase_mode: h }) }) })
    ] }),
    t.type !== "variable" && v && /* @__PURE__ */ e(I, { title: "Pricing and SKU", children: /* @__PURE__ */ m(M, { cols: 4, children: [
      /* @__PURE__ */ e(f, { label: "Price", htmlFor: `${n}-price`, children: /* @__PURE__ */ e(P, { id: `${n}-price`, value: v.price, nullable: !1, onChange: (h) => i(0, { price: h ?? 0 }) }) }),
      /* @__PURE__ */ e(f, { label: "Compare-at price", htmlFor: `${n}-compare`, hint: "Shown struck through when higher.", children: /* @__PURE__ */ e(P, { id: `${n}-compare`, value: v.compare_at_price, onChange: (h) => i(0, { compare_at_price: h }) }) }),
      /* @__PURE__ */ e(f, { label: "Cost", htmlFor: `${n}-cost`, hint: "For profit reports; never shown.", children: /* @__PURE__ */ e(P, { id: `${n}-cost`, value: v.cost, onChange: (h) => i(0, { cost: h }) }) }),
      /* @__PURE__ */ e(f, { label: "SKU", htmlFor: `${n}-sku`, children: /* @__PURE__ */ e(X, { id: `${n}-sku`, value: v.sku, entryId: s, onChange: (h) => i(0, { sku: h }) }) })
    ] }) }),
    (t.purchase_mode === "external" || t.external_links.length > 0) && /* @__PURE__ */ e(
      I,
      {
        title: "Links to other shops",
        description: "Buttons such as 'Buy on Tokopedia'.",
        actions: t.external_links.length < 10 && /* @__PURE__ */ e(o, { type: "button", variant: "outline", size: "sm", onClick: () => l({ external_links: [...t.external_links, { preset: "tokopedia", label: null, url: null }] }), children: "Add link" }),
        children: t.external_links.map((h, k) => {
          const p = (d) => l({ external_links: t.external_links.map((u, _) => _ === k ? { ...u, ...d } : u) });
          return /* @__PURE__ */ m("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[10rem_1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(f, { label: "Shop", htmlFor: `${n}-link-${k}-preset`, children: /* @__PURE__ */ e(
              F,
              {
                id: `${n}-link-${k}-preset`,
                value: h.preset ?? "",
                onChange: (d) => p({ preset: d || null }),
                options: [...Object.entries(r.link_presets), ["", "Other…"]]
              }
            ) }),
            /* @__PURE__ */ e(f, { label: "Button label", htmlFor: `${n}-link-${k}-label`, children: /* @__PURE__ */ e(U, { id: `${n}-link-${k}-label`, value: h.label, placeholder: h.preset ? `Buy on ${r.link_presets[h.preset]}` : "", onChange: (d) => p({ label: d }) }) }),
            /* @__PURE__ */ e(f, { label: "Link", htmlFor: `${n}-link-${k}-url`, children: /* @__PURE__ */ e(U, { id: `${n}-link-${k}-url`, value: h.url, placeholder: "https://", onChange: (d) => p({ url: d }) }) }),
            /* @__PURE__ */ e(o, { type: "button", variant: "ghost", size: "sm", onClick: () => l({ external_links: t.external_links.filter((d, u) => u !== k) }), children: "Remove" })
          ] }, k);
        })
      }
    ),
    /* @__PURE__ */ m("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(O, { id: `${n}-shipping`, label: "Needs shipping", checked: t.requires_shipping, onChange: (h) => l({ requires_shipping: h }), hint: "Off for services and digital products." }),
      (r.features.digital || t.downloadable) && /* @__PURE__ */ e(O, { id: `${n}-downloadable`, label: "Downloadable", checked: t.downloadable, onChange: (h) => l({ downloadable: h }), hint: "Customers get files or links after paying." }),
      /* @__PURE__ */ e(O, { id: `${n}-featured`, label: "Featured", checked: t.featured, onChange: (h) => l({ featured: h }), hint: "Shown first when sorting by featured." })
    ] }),
    r.features.taxes && /* @__PURE__ */ e(f, { label: "Tax class", htmlFor: `${n}-tax`, children: /* @__PURE__ */ e(
      F,
      {
        id: `${n}-tax`,
        value: t.tax_class ?? "",
        onChange: (h) => l({ tax_class: h || null }),
        options: [["", "Standard"], ...r.tax_classes.filter((h) => h !== "standard").map((h) => [h, h])]
      }
    ) })
  ] });
}
function J({ variantKey: t, tab: l, sku: i }) {
  const r = l.live?.variants[t], s = l.live?.stock_adjustment?.reasons, [n, o] = x.useState(!1), { Button: a } = T;
  return !r || r.stock_quantity === null ? null : /* @__PURE__ */ m(f, { label: "In stock", children: [
    /* @__PURE__ */ m("div", { className: "cm:flex cm:min-h-10 cm:flex-wrap cm:items-center cm:gap-x-3 cm:gap-y-1", children: [
      /* @__PURE__ */ e("strong", { className: "cm:text-lg cm:tabular-nums", "aria-live": "polite", children: r.stock_quantity }),
      s && /* @__PURE__ */ e(a, { type: "button", size: "sm", variant: "outline", onClick: () => o(!0), children: "Adjust stock" })
    ] }),
    n && s && /* @__PURE__ */ e(
      he,
      {
        id: r.id,
        stock: r.stock_quantity,
        sku: i,
        reasons: s,
        onClose: () => o(!1),
        onAdjusted: (v) => l.updateLiveStock(t, r.id, v)
      },
      r.id
    )
  ] });
}
function he({ id: t, stock: l, sku: i, reasons: r, onClose: s, onAdjusted: n }) {
  const { Button: o, Dialog: a, DialogContent: v, DialogDescription: h, DialogFooter: k, DialogHeader: p, DialogTitle: d, Input: u } = T, [_, g] = x.useState("add"), [b, N] = x.useState(""), [q, j] = x.useState(r[0]), [c, y] = x.useState(null), [C, $] = x.useState(""), [A, W] = x.useState(!1), B = x.useId();
  async function Q(S) {
    if (S.preventDefault(), S.stopPropagation(), !(A || C || b === "")) {
      W(!0), $("");
      try {
        const V = await L(R(`commerce/inventory/${t}/adjust`), {
          method: "POST",
          signal: AbortSignal.timeout(15e3),
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: _, quantity: Number(b), reason: q, note: c })
        });
        n(V.stock_quantity), s();
      } catch {
        $("The adjustment could not be confirmed. Check the current stock in Inventory before retrying.");
      } finally {
        W(!1);
      }
    }
  }
  return /* @__PURE__ */ e(a, { open: !0, onOpenChange: (S) => {
    !S && !A && s();
  }, children: /* @__PURE__ */ m(v, { className: "cm:max-w-lg", children: [
    /* @__PURE__ */ m(p, { children: [
      /* @__PURE__ */ e(d, { children: "Adjust stock" }),
      /* @__PURE__ */ m(h, { children: [
        i ? `${i} · ` : "",
        "Current stock: ",
        l,
        ". This saves immediately and records a stock movement."
      ] })
    ] }),
    /* @__PURE__ */ m("form", { id: B, className: "cm:grid cm:gap-4", onSubmit: Q, children: [
      /* @__PURE__ */ m("div", { className: "cm:grid cm:items-start cm:gap-3 cm:sm:grid-cols-2", children: [
        /* @__PURE__ */ e(f, { label: "Adjustment", htmlFor: `${B}-mode`, children: /* @__PURE__ */ e(
          F,
          {
            id: `${B}-mode`,
            value: _,
            onChange: (S) => {
              g(S), N("");
            },
            options: [["add", "Add or remove units"], ["set", "Set total stock"]]
          }
        ) }),
        /* @__PURE__ */ e(f, { label: _ === "set" ? "New stock total" : "Units (+/−)", htmlFor: `${B}-quantity`, children: /* @__PURE__ */ e(
          u,
          {
            id: `${B}-quantity`,
            type: "number",
            inputMode: "numeric",
            required: !0,
            min: _ === "set" ? 0 : -1e6,
            max: 1e6,
            step: 1,
            value: b,
            onChange: (S) => N(S.target.value)
          }
        ) }),
        /* @__PURE__ */ e(f, { label: "Reason", htmlFor: `${B}-reason`, children: /* @__PURE__ */ e(
          F,
          {
            id: `${B}-reason`,
            value: q,
            onChange: j,
            options: r.map((S) => [S, S[0].toUpperCase() + S.slice(1)])
          }
        ) }),
        /* @__PURE__ */ e(f, { label: "Note (optional)", htmlFor: `${B}-note`, children: /* @__PURE__ */ e(u, { id: `${B}-note`, value: c ?? "", maxLength: 255, onChange: (S) => y(S.target.value || null) }) })
      ] }),
      C && /* @__PURE__ */ e("p", { role: "alert", className: "cm:text-sm cm:text-destructive", children: C })
    ] }),
    /* @__PURE__ */ m(k, { children: [
      /* @__PURE__ */ e(o, { type: "button", variant: "ghost", disabled: A, onClick: s, children: "Cancel" }),
      /* @__PURE__ */ e(o, { type: "submit", form: B, disabled: A || b === "" || !!C, children: A ? "Saving…" : "Save adjustment" })
    ] })
  ] }) });
}
function pe(t) {
  const { value: l, updateVariant: i, live: r, path: s } = t, n = l.variants[0];
  if (!n) return null;
  const o = r?.variants[n.id];
  return /* @__PURE__ */ m(I, { title: "Stock", children: [
    /* @__PURE__ */ e(
      O,
      {
        id: `${s}-track`,
        label: "Track stock",
        checked: n.track_stock,
        onChange: (a) => i(0, { track_stock: a }),
        hint: "Reduce stock when an order is placed and restore it when the order is cancelled."
      }
    ),
    n.track_stock ? /* @__PURE__ */ m(M, { cols: 3, children: [
      o?.track_stock && o.stock_quantity !== null ? /* @__PURE__ */ e(J, { variantKey: n.id, tab: t, sku: n.sku }) : /* @__PURE__ */ e(f, { label: "Starting stock", htmlFor: `${s}-initial`, hint: "Set once, when the product is published.", children: /* @__PURE__ */ e(w, { id: `${s}-initial`, value: n.initial_stock, onChange: (a) => i(0, { initial_stock: a }) }) }),
      /* @__PURE__ */ e(f, { label: "When sold out", htmlFor: `${s}-backorders`, children: /* @__PURE__ */ e(
        F,
        {
          id: `${s}-backorders`,
          value: n.backorders,
          onChange: (a) => i(0, { backorders: a }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }),
      /* @__PURE__ */ e(f, { label: "Low stock at", htmlFor: `${s}-low`, hint: "Empty: the store's setting.", children: /* @__PURE__ */ e(w, { id: `${s}-low`, value: n.low_stock_threshold, onChange: (a) => i(0, { low_stock_threshold: a }) }) })
    ] }) : /* @__PURE__ */ e(f, { label: "Stock status", htmlFor: `${s}-status`, children: /* @__PURE__ */ e(
      F,
      {
        id: `${s}-status`,
        value: n.stock_status,
        onChange: (a) => i(0, { stock_status: a }),
        options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
      }
    ) })
  ] });
}
function ge({ value: t, update: l, path: i }) {
  const { Button: r } = T, s = (n, o) => l({ tiers: t.tiers.map((a, v) => v === n ? { ...a, ...o } : a) });
  return /* @__PURE__ */ m(
    I,
    {
      title: "Bulk prices",
      description: "Lower unit prices for larger quantities. The best matching tier applies.",
      actions: t.tiers.length < 20 && /* @__PURE__ */ e(
        r,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          onClick: () => l({ tiers: [...t.tiers, { min_qty: (t.tiers.at(-1)?.min_qty ?? 1) + 9, type: "percent_off", value: 500, variant: null }] }),
          children: "Add tier"
        }
      ),
      children: [
        t.tiers.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No bulk prices." }),
        t.tiers.map((n, o) => /* @__PURE__ */ m("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[8rem_12rem_1fr_1fr_auto]", children: [
          /* @__PURE__ */ e(f, { label: "From (units)", htmlFor: `${i}-tier-${o}-min`, children: /* @__PURE__ */ e(w, { id: `${i}-tier-${o}-min`, min: 2, value: n.min_qty, onChange: (a) => s(o, { min_qty: a ?? 2 }) }) }),
          /* @__PURE__ */ e(f, { label: "Price", htmlFor: `${i}-tier-${o}-type`, children: /* @__PURE__ */ e(
            F,
            {
              id: `${i}-tier-${o}-type`,
              value: n.type,
              onChange: (a) => s(o, { type: a, value: 0 }),
              options: [["percent_off", "Percent off"], ["amount_off", "Amount off per unit"], ["fixed_price", "Fixed unit price"]]
            }
          ) }),
          /* @__PURE__ */ e(f, { label: n.type === "percent_off" ? "Percent" : "Amount", htmlFor: `${i}-tier-${o}-value`, children: n.type === "percent_off" ? /* @__PURE__ */ e(w, { id: `${i}-tier-${o}-value`, value: n.value / 100, onChange: (a) => s(o, { value: Math.round((a ?? 0) * 100) }) }) : /* @__PURE__ */ e(P, { id: `${i}-tier-${o}-value`, value: n.value, nullable: !1, onChange: (a) => s(o, { value: a ?? 0 }) }) }),
          /* @__PURE__ */ e(f, { label: "For", htmlFor: `${i}-tier-${o}-variant`, children: /* @__PURE__ */ e(
            F,
            {
              id: `${i}-tier-${o}-variant`,
              value: n.variant ?? "",
              onChange: (a) => s(o, { variant: a || null }),
              options: [["", "All variants"], ...t.type === "variable" ? t.variants.map((a) => [a.id, G(t.options, a)]) : []]
            }
          ) }),
          /* @__PURE__ */ e(r, { type: "button", variant: "ghost", size: "sm", onClick: () => l({ tiers: t.tiers.filter((a, v) => v !== o) }), children: "Remove" })
        ] }, o))
      ]
    }
  );
}
function fe({ value: t, update: l, updateVariant: i, path: r }) {
  const s = t.variants[0];
  if (!s) return null;
  const n = (o) => t.type === "variable" ? l({ variants: t.variants.map((a) => ({ ...a, ...o })) }) : i(0, o);
  return /* @__PURE__ */ e(I, { title: "Package", description: t.type === "variable" ? "Applies to every variant; a variant can have its own weight under More." : "Used for shipping rates.", children: /* @__PURE__ */ m(M, { cols: 4, children: [
    /* @__PURE__ */ e(f, { label: "Weight (grams)", htmlFor: `${r}-weight`, children: /* @__PURE__ */ e(w, { id: `${r}-weight`, value: s.weight, onChange: (o) => n({ weight: o }) }) }),
    /* @__PURE__ */ e(f, { label: "Length (mm)", htmlFor: `${r}-length`, children: /* @__PURE__ */ e(w, { id: `${r}-length`, value: s.length, onChange: (o) => n({ length: o }) }) }),
    /* @__PURE__ */ e(f, { label: "Width (mm)", htmlFor: `${r}-width`, children: /* @__PURE__ */ e(w, { id: `${r}-width`, value: s.width, onChange: (o) => n({ width: o }) }) }),
    /* @__PURE__ */ e(f, { label: "Height (mm)", htmlFor: `${r}-height`, children: /* @__PURE__ */ e(w, { id: `${r}-height`, value: s.height, onChange: (o) => n({ height: o }) }) })
  ] }) });
}
const z = {
  options: {},
  sku: null,
  barcode: null,
  price: 0,
  compare_at_price: null,
  cost: null,
  weight: null,
  length: null,
  width: null,
  height: null,
  image: null,
  requires_shipping: null,
  downloadable: null,
  track_stock: !1,
  initial_stock: null,
  backorders: "no",
  low_stock_threshold: null,
  stock_status: "in_stock",
  min_qty: 1,
  max_qty: null,
  qty_step: 1,
  active: !0,
  downloads: []
};
function be({ option: t, onChange: l, onRemove: i, config: r, path: s }) {
  const { Button: n, Input: o, Badge: a } = T, [v, h] = x.useState(""), k = () => {
    const d = v.split(",").map((u) => u.trim()).filter(Boolean).filter((u) => !t.values.some((_) => (_.label ?? "").toLowerCase() === u.toLowerCase()));
    d.length && l({ ...t, values: [...t.values, ...d.map((u) => ({ id: D(), label: u }))] }), h("");
  }, p = t.values.map((d) => d.term_id).filter((d) => !!d);
  return /* @__PURE__ */ m("div", { className: "cm:grid cm:gap-3 cm:rounded-md cm:border cm:p-3", children: [
    /* @__PURE__ */ m("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_1fr_auto]", children: [
      /* @__PURE__ */ e(f, { label: "Option name", htmlFor: `${s}-name`, children: /* @__PURE__ */ e(o, { id: `${s}-name`, value: t.name, placeholder: "Size", onChange: (d) => l({ ...t, name: d.target.value }) }) }),
      r.attribute_taxonomies.length > 0 ? /* @__PURE__ */ e(f, { label: "Values from", htmlFor: `${s}-source`, children: /* @__PURE__ */ e(
        F,
        {
          id: `${s}-source`,
          value: t.taxonomy ?? "",
          onChange: (d) => l({ ...t, taxonomy: d || null, values: [] }),
          options: [["", "Custom values"], ...r.attribute_taxonomies.map((d) => [d.handle, d.title])]
        }
      ) }) : /* @__PURE__ */ e("div", {}),
      /* @__PURE__ */ e(n, { type: "button", variant: "ghost", size: "sm", onClick: i, children: "Remove option" })
    ] }),
    t.taxonomy ? /* @__PURE__ */ e(
      te,
      {
        fields: [{ handle: "terms", type: "terms", label: "Values", config: {
          multiple: !0,
          options: (r.attribute_taxonomies.find((d) => d.handle === t.taxonomy)?.terms ?? []).map((d) => ({ value: String(d.id), label: d.title }))
        } }],
        values: { terms: p },
        pathPrefix: `${s}-terms`,
        onChange: (d) => {
          const u = d.terms ?? [], _ = t.values.filter((b) => b.term_id && u.includes(b.term_id)), g = u.filter((b) => !_.some((N) => N.term_id === b)).map((b) => ({ id: D(), term_id: b }));
          l({ ...t, values: [..._, ...g] });
        }
      }
    ) : /* @__PURE__ */ m("div", { className: "cm:grid cm:gap-2", children: [
      /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: t.values.map((d) => /* @__PURE__ */ m(a, { variant: "secondary", className: "cm:gap-1", children: [
        d.label,
        /* @__PURE__ */ e("button", { type: "button", "aria-label": `Remove ${d.label}`, onClick: () => l({ ...t, values: t.values.filter((u) => u.id !== d.id) }), children: "×" })
      ] }, d.id)) }),
      /* @__PURE__ */ m("div", { className: "cm:flex cm:gap-2", children: [
        /* @__PURE__ */ e(
          o,
          {
            value: v,
            placeholder: "S, M, L",
            "aria-label": `Add values to ${t.name || "option"}`,
            onChange: (d) => h(d.target.value),
            onKeyDown: (d) => {
              d.key === "Enter" && (d.preventDefault(), k());
            }
          }
        ),
        /* @__PURE__ */ e(n, { type: "button", variant: "outline", onClick: k, children: "Add" })
      ] })
    ] })
  ] });
}
function ve({ variant: t, index: l, updateVariant: i, tab: r }) {
  const { MediaPickerInput: s } = T, n = `${r.path}-v${l}`, o = r.live?.variants[t.id];
  return /* @__PURE__ */ m("div", { className: "cm:grid cm:gap-4 cm:bg-muted/40 cm:p-4", children: [
    /* @__PURE__ */ m(M, { cols: 4, children: [
      /* @__PURE__ */ e(f, { label: "Cost", htmlFor: `${n}-cost`, children: /* @__PURE__ */ e(P, { id: `${n}-cost`, value: t.cost, onChange: (a) => i(l, { cost: a }) }) }),
      /* @__PURE__ */ e(f, { label: "Barcode", htmlFor: `${n}-barcode`, children: /* @__PURE__ */ e(U, { id: `${n}-barcode`, value: t.barcode, onChange: (a) => i(l, { barcode: a }) }) }),
      /* @__PURE__ */ e(f, { label: "Weight (g)", htmlFor: `${n}-weight`, children: /* @__PURE__ */ e(w, { id: `${n}-weight`, value: t.weight, onChange: (a) => i(l, { weight: a }), placeholder: "Product's" }) }),
      /* @__PURE__ */ e(f, { label: "Min / max / step", htmlFor: `${n}-min`, children: /* @__PURE__ */ m("div", { className: "cm:grid cm:grid-cols-3 cm:gap-1", children: [
        /* @__PURE__ */ e(w, { id: `${n}-min`, min: 1, value: t.min_qty, onChange: (a) => i(l, { min_qty: a ?? 1 }) }),
        /* @__PURE__ */ e(w, { min: 1, value: t.max_qty, onChange: (a) => i(l, { max_qty: a }), placeholder: "–" }),
        /* @__PURE__ */ e(w, { min: 1, value: t.qty_step, onChange: (a) => i(l, { qty_step: a ?? 1 }) })
      ] }) })
    ] }),
    r.config.features.inventory && /* @__PURE__ */ m(M, { cols: 4, children: [
      /* @__PURE__ */ e(O, { id: `${n}-track`, label: "Track stock", checked: t.track_stock, onChange: (a) => i(l, { track_stock: a }) }),
      t.track_stock && (o?.track_stock && o.stock_quantity !== null ? /* @__PURE__ */ e(J, { variantKey: t.id, tab: r, sku: t.sku }) : /* @__PURE__ */ e(f, { label: "Starting stock", htmlFor: `${n}-initial`, children: /* @__PURE__ */ e(w, { id: `${n}-initial`, value: t.initial_stock, onChange: (a) => i(l, { initial_stock: a }) }) })),
      t.track_stock ? /* @__PURE__ */ e(f, { label: "When sold out", htmlFor: `${n}-backorders`, children: /* @__PURE__ */ e(
        F,
        {
          id: `${n}-backorders`,
          value: t.backorders,
          onChange: (a) => i(l, { backorders: a }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }) : /* @__PURE__ */ e(f, { label: "Stock status", htmlFor: `${n}-status`, children: /* @__PURE__ */ e(
        F,
        {
          id: `${n}-status`,
          value: t.stock_status,
          onChange: (a) => i(l, { stock_status: a }),
          options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
        }
      ) })
    ] }),
    /* @__PURE__ */ e(f, { label: "Image", htmlFor: `${n}-image`, children: /* @__PURE__ */ e(s, { id: `${n}-image`, value: t.image, types: ["image"], onChange: (a) => i(l, { image: a }) }) })
  ] });
}
function ke(t) {
  const { value: l, update: i, updateVariant: r, config: s, entryId: n, live: o } = t, { Button: a, Table: v, TableBody: h, TableCell: k, TableHead: p, TableHeader: d, TableRow: u, Switch: _ } = T, [g, b] = x.useState(null), N = Object.fromEntries(t.config.attribute_taxonomies.flatMap((c) => c.terms.map((y) => [y.id, y.title]))), q = l.variants[0] ?? { ...z, id: D() }, j = (c = l.options) => i({ options: c, variants: ae(c, l.variants, { ...q, initial_stock: null, image: null }, s.max_variants) });
  return /* @__PURE__ */ m("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ e(
      I,
      {
        title: "Options",
        description: `Up to ${s.max_options} options, such as size and color. Variants are made for every combination.`,
        actions: l.options.length < s.max_options && /* @__PURE__ */ e(a, { type: "button", variant: "outline", size: "sm", onClick: () => i({ options: [...l.options, { id: D(), name: "", taxonomy: null, values: [] }] }), children: "Add option" }),
        children: l.options.map((c, y) => /* @__PURE__ */ e(
          be,
          {
            option: c,
            config: s,
            path: `${t.path}-o${y}`,
            onChange: (C) => j(l.options.map(($, A) => A === y ? C : $)),
            onRemove: () => j(l.options.filter((C, $) => $ !== y))
          },
          c.id
        ))
      }
    ),
    /* @__PURE__ */ m(
      I,
      {
        title: `Variants (${l.variants.length})`,
        description: "Each has its own SKU, price and stock. Switch one off to stop selling it without losing it.",
        actions: /* @__PURE__ */ e(a, { type: "button", variant: "outline", size: "sm", onClick: () => j(), children: "Regenerate" }),
        children: [
          l.options.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "Add an option with values to create variants." }) : /* @__PURE__ */ e("div", { className: "cm:overflow-x-auto cm:rounded-md cm:border", children: /* @__PURE__ */ m(v, { children: [
            /* @__PURE__ */ e(d, { children: /* @__PURE__ */ m(u, { children: [
              /* @__PURE__ */ e(p, { children: "Variant" }),
              /* @__PURE__ */ e(p, { children: "SKU" }),
              /* @__PURE__ */ e(p, { children: "Price" }),
              /* @__PURE__ */ e(p, { children: "Compare-at" }),
              s.features.inventory && /* @__PURE__ */ e(p, { children: "Stock" }),
              /* @__PURE__ */ e(p, { children: "On sale" }),
              /* @__PURE__ */ e(p, {})
            ] }) }),
            /* @__PURE__ */ e(h, { children: l.variants.map((c, y) => {
              const C = o?.variants[c.id];
              return /* @__PURE__ */ m(x.Fragment, { children: [
                /* @__PURE__ */ m(u, { className: c.active ? "" : "cm:opacity-60", children: [
                  /* @__PURE__ */ e(k, { className: "cm:font-medium cm:whitespace-nowrap", children: G(l.options, c, N) }),
                  /* @__PURE__ */ e(k, { className: "cm:min-w-36", children: /* @__PURE__ */ e(X, { value: c.sku, entryId: n, onChange: ($) => r(y, { sku: $ }) }) }),
                  /* @__PURE__ */ e(k, { className: "cm:min-w-32", children: /* @__PURE__ */ e(P, { value: c.price, nullable: !1, onChange: ($) => r(y, { price: $ ?? 0 }) }) }),
                  /* @__PURE__ */ e(k, { className: "cm:min-w-32", children: /* @__PURE__ */ e(P, { value: c.compare_at_price, onChange: ($) => r(y, { compare_at_price: $ }) }) }),
                  s.features.inventory && /* @__PURE__ */ e(k, { className: "cm:whitespace-nowrap cm:text-sm", children: c.track_stock ? C?.stock_quantity ?? c.initial_stock ?? 0 : /* @__PURE__ */ e(ee, { children: c.stock_status.replace("_", " ") }) }),
                  /* @__PURE__ */ e(k, { children: /* @__PURE__ */ e(_, { checked: c.active, "aria-label": "Sell this variant", onCheckedChange: ($) => r(y, { active: $ }) }) }),
                  /* @__PURE__ */ e(k, { children: /* @__PURE__ */ e(a, { type: "button", variant: "ghost", size: "sm", "aria-expanded": g === c.id, onClick: () => b(g === c.id ? null : c.id), children: g === c.id ? "Close" : "More" }) })
                ] }),
                g === c.id && /* @__PURE__ */ e(u, { children: /* @__PURE__ */ e(k, { colSpan: 7, className: "cm:p-0", children: /* @__PURE__ */ e(ve, { variant: c, index: y, updateVariant: r, tab: t }) }) })
              ] }, c.id);
            }) })
          ] }) }),
          l.variants.length > 0 && /* @__PURE__ */ m("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
            "Prices from ",
            E(Math.min(...l.variants.map((c) => c.price))),
            " to ",
            E(Math.max(...l.variants.map((c) => c.price))),
            "."
          ] })
        ]
      }
    )
  ] });
}
function ye(t) {
  const l = t ?? {}, i = (l.variants?.length ? l.variants : [{ ...z, id: D() }]).map((r) => ({ ...z, ...r, id: r.id ?? D() }));
  return {
    type: l.type ?? "simple",
    purchase_mode: l.purchase_mode ?? "default",
    external_links: l.external_links ?? [],
    requires_shipping: l.requires_shipping ?? !0,
    downloadable: l.downloadable ?? !1,
    featured: l.featured ?? !1,
    tax_class: l.tax_class ?? null,
    options: l.options ?? [],
    variants: i,
    bundle: l.bundle ?? null,
    downloads: l.downloads ?? [],
    delivery: l.delivery ?? null,
    tiers: l.tiers ?? []
  };
}
function $e({ field: t, value: l, onChange: i, errors: r, id: s = "data-product" }) {
  ne();
  const n = t.config ?? {}, o = ye(l), { props: a } = le.usePage(), v = a.entry?.id ?? null, [h, k] = x.useState(null);
  x.useEffect(() => {
    if (!v) return;
    const c = new AbortController();
    return L(R(`commerce/api/products/${v}`), { signal: c.signal }).then((y) => {
      c.signal.aborted || k(y.data);
    }).catch(() => {
    }), () => c.abort();
  }, [v, a.entry]);
  const p = (c) => {
    const y = { ...o, ...c };
    c.type && c.type !== "variable" && (y.options = [], y.variants = [{ ...y.variants[0], options: {} }]), c.type === "bundle" && !y.bundle && (y.bundle = { pricing: "fixed", value: 0, items: [] }), i(y);
  }, d = (c, y) => p({ variants: o.variants.map((C, $) => $ === c ? { ...C, ...y } : C) }), u = [{ key: "general", label: "General", render: (c) => /* @__PURE__ */ e(ue, { ...c }) }];
  o.type === "variable" && u.push({ key: "variants", label: "Variants", render: (c) => /* @__PURE__ */ e(ke, { ...c }) }), o.type === "bundle" && u.push({ key: "bundle", label: "Bundle", render: (c) => /* @__PURE__ */ e(oe, { ...c }) }), o.type !== "variable" && (n.features?.inventory ?? !0) && u.push({ key: "inventory", label: "Inventory", render: (c) => /* @__PURE__ */ e(pe, { ...c }) }), o.requires_shipping && u.push({ key: "shipping", label: "Shipping", render: (c) => /* @__PURE__ */ e(fe, { ...c }) }), (n.features?.pricing_rules !== !1 || o.tiers.length > 0) && u.push({ key: "pricing", label: "Bulk pricing", render: (c) => /* @__PURE__ */ e(ge, { ...c }) }), o.downloadable && u.push({ key: "digital", label: "Digital", render: (c) => /* @__PURE__ */ e(de, { ...c }) });
  for (const [c, y] of Object.entries(ie.productTabs()))
    u.push({ key: `ext-${c}`, label: y.label ?? c, render: (C) => /* @__PURE__ */ e(y, { ...C }) });
  const [_, g] = x.useState("general"), b = u.find((c) => c.key === _) ?? u[0], N = r?.[""], j = { value: o, update: p, updateVariant: d, config: n, live: h, updateLiveStock: (c, y, C) => {
    k(($) => {
      const A = $?.variants[c];
      return !$ || !A || A.id !== y ? $ : { ...$, variants: { ...$.variants, [c]: { ...A, stock_quantity: C } } };
    });
  }, entryId: v, path: s };
  return /* @__PURE__ */ m("div", { className: "cm:grid cm:gap-4 cm:rounded-lg cm:border cm:p-4", children: [
    h?.sync_status === "failed" && /* @__PURE__ */ m("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: [
      "The published version couldn't be applied to the store, so it can't be bought: ",
      h.sync_error,
      ". Fix it and publish again."
    ] }),
    N && /* @__PURE__ */ e("p", { role: "alert", className: "cm:text-sm cm:text-destructive", children: N }),
    /* @__PURE__ */ e("div", { role: "tablist", "aria-label": "Product data", className: "cm:flex cm:flex-wrap cm:gap-1 cm:border-b", children: u.map((c) => /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": c.key === b.key,
        onClick: () => g(c.key),
        className: K("cm:-mb-px cm:border-b-2 cm:px-3 cm:py-2 cm:text-sm", c.key === b.key ? "cm:border-primary cm:font-medium" : "cm:border-transparent cm:text-muted-foreground cm:hover:text-foreground"),
        children: c.label
      },
      c.key
    )) }),
    /* @__PURE__ */ e("div", { role: "tabpanel", children: b.render(j) })
  ] });
}
export {
  $e as default
};
