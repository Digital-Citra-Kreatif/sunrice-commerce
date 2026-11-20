import { b as e, p as J, j as c, c as D, M as ie, R as x, H as X, I as Q, l as K, a as M, g as H, t as ae, J as W, L as O, S as re, n as se, d as oe, i as ce, e as de } from "./main-DK8N8XXM.js";
function B() {
  return (globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`).replace(/-/g, "").slice(0, 32);
}
function V(t) {
  return Object.keys(t).sort().map((n) => `${n}=${t[n]}`).join("|");
}
function me(t) {
  let n = [{}];
  for (const a of t) {
    if (a.values.length === 0) return [];
    const r = [];
    for (const s of n)
      for (const l of a.values)
        r.push({ ...s, [a.id]: l.id });
    n = r;
  }
  return t.length === 0 ? [] : n;
}
function ue(t, n, a, r = 100) {
  const s = new Map(n.map((l) => [V(l.options), l]));
  return me(t).slice(0, r).map((l) => {
    const i = s.get(V(l));
    return i ? { ...i, options: l } : { ...a, id: B(), sku: null, options: l, active: !0, price: a.price ?? 0 };
  });
}
function Z(t, n, a = {}) {
  return t.map((r) => {
    const s = r.values.find((l) => l.id === n.options[r.id]);
    return s ? s.label ?? (s.term_id ? a[s.term_id] ?? `#${s.term_id}` : "?") : "?";
  }).join(" / ");
}
function f({ label: t, hint: n, children: a, htmlFor: r, className: s }) {
  const { Label: l } = D;
  return /* @__PURE__ */ c("div", { className: J("cm:grid cm:content-start cm:gap-1.5", s), children: [
    /* @__PURE__ */ e(l, { htmlFor: r, children: t }),
    a,
    n && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: n })
  ] });
}
function P({ children: t, cols: n = 3 }) {
  return /* @__PURE__ */ e("div", { className: J("cm:grid cm:items-start cm:gap-4", { 2: "cm:sm:grid-cols-2", 3: "cm:sm:grid-cols-2 cm:lg:grid-cols-3", 4: "cm:sm:grid-cols-2 cm:lg:grid-cols-4" }[n]), children: t });
}
function U({ id: t, value: n, onChange: a, min: r = 0, placeholder: s }) {
  const { Input: l } = D;
  return /* @__PURE__ */ e(
    l,
    {
      id: t,
      type: "number",
      inputMode: "numeric",
      min: r,
      value: n ?? "",
      placeholder: s,
      onChange: (i) => a(i.target.value === "" ? null : Math.round(Number(i.target.value)))
    }
  );
}
function z({ id: t, value: n, onChange: a, unit: r, placeholder: s }) {
  const { Input: l } = D, [i, o] = x.useState(() => X(n, r));
  return x.useEffect(() => {
    Q(i, r) !== n && o(X(n, r));
  }, [n, r]), /* @__PURE__ */ e(
    l,
    {
      id: t,
      type: "text",
      inputMode: "decimal",
      value: i,
      placeholder: s,
      onChange: (k) => {
        o(k.target.value), a(Q(k.target.value, r));
      }
    }
  );
}
function E({ id: t, value: n, onChange: a, placeholder: r, onBlur: s }) {
  const { Input: l } = D;
  return /* @__PURE__ */ e(
    l,
    {
      id: t,
      value: n ?? "",
      placeholder: r,
      onBlur: s,
      onChange: (i) => a(i.target.value === "" ? null : i.target.value)
    }
  );
}
function L({ id: t, value: n, onChange: a, nullable: r = !0 }) {
  return /* @__PURE__ */ e(ie, { id: t, value: n, allowNull: r, onChange: a });
}
function R({ id: t, label: n, checked: a, onChange: r, hint: s, disabled: l = !1 }) {
  const { Switch: i, Label: o } = D;
  return /* @__PURE__ */ c("div", { className: "cm:flex cm:items-start cm:gap-3", children: [
    /* @__PURE__ */ e(i, { id: t, disabled: l, checked: a, onCheckedChange: r }),
    /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-0.5", children: [
      /* @__PURE__ */ e(o, { htmlFor: t, children: n }),
      s && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: s })
    ] })
  ] });
}
const he = "cm:h-10 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm";
function I({ id: t, value: n, onChange: a, options: r }) {
  return /* @__PURE__ */ e("select", { id: t, className: he, value: n, onChange: (s) => a(s.target.value), children: r.map(([s, l]) => /* @__PURE__ */ e("option", { value: s, children: l }, s)) });
}
function A({ title: t, description: n, children: a, actions: r }) {
  return /* @__PURE__ */ c("section", { className: "cm:grid cm:gap-4", children: [
    /* @__PURE__ */ c("div", { className: "cm:flex cm:items-start cm:justify-between cm:gap-3", children: [
      /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-0.5", children: [
        /* @__PURE__ */ e("h3", { className: "cm:text-sm cm:font-semibold", children: t }),
        n && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: n })
      ] }),
      r
    ] }),
    a
  ] });
}
function pe({ value: t, update: n, path: a }) {
  const { Button: r, Input: s } = D, l = t.bundle ?? { pricing: "fixed", value: 0, items: [] }, [i, o] = x.useState({}), [k, N] = x.useState(""), [C, h] = x.useState([]), y = l.items.map((m) => m.variant_id).filter((m) => !!m);
  x.useEffect(() => {
    const m = y.filter((b) => !(b in i));
    if (m.length === 0) return;
    const d = Object.fromEntries(m.map((b) => [b, null]));
    K(M(`commerce/api/variants?bundle_components=1&${m.map((b) => `ids[]=${b}`).join("&")}`)).then((b) => o((S) => ({ ...S, ...d, ...Object.fromEntries(b.data.map((p) => [p.id, p])) }))).catch(() => o((b) => ({ ...b, ...d })));
  }, [y.join(",")]), x.useEffect(() => {
    if (k.trim().length < 2) return h([]);
    const m = setTimeout(() => K(M(`commerce/api/variants?q=${encodeURIComponent(k)}`)).then((d) => h(d.data)).catch(() => {
    }), 250);
    return () => clearTimeout(m);
  }, [k]);
  const _ = (m) => n({ bundle: { ...l, ...m } }), u = l.items.reduce((m, d) => m + (i[d.variant_id ?? 0]?.price ?? 0) * d.quantity, 0), v = l.items.length > 0 && l.items.every((m) => i[m.variant_id ?? 0]?.available);
  return /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ c(A, { title: "Products in the bundle", description: "Bundles take their stock from these products.", children: [
      l.items.map((m, d) => {
        const b = m.variant_id ? i[m.variant_id] : null;
        return /* @__PURE__ */ c("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
          /* @__PURE__ */ c("div", { className: "cm:flex-1 cm:text-sm", children: [
            /* @__PURE__ */ e("span", { children: b?.label || (b === void 0 ? "Loading product…" : "Unavailable product") }),
            b?.available === !1 && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-destructive", children: "Replace this unavailable variant to sell the bundle." })
          ] }),
          /* @__PURE__ */ e("div", { className: "cm:w-24", children: /* @__PURE__ */ e(U, { min: 1, value: m.quantity, onChange: (S) => _({ items: l.items.map((p, w) => w === d ? { ...p, quantity: S ?? 1 } : p) }) }) }),
          /* @__PURE__ */ e(r, { type: "button", variant: "ghost", size: "sm", onClick: () => _({ items: l.items.filter((S, p) => p !== d) }), children: "Remove" })
        ] }, d);
      }),
      /* @__PURE__ */ c("div", { className: "cm:relative", children: [
        /* @__PURE__ */ e(s, { value: k, placeholder: "Search products or SKUs to add…", "aria-label": "Add a product to the bundle", onChange: (m) => N(m.target.value) }),
        C.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-10 cm:mt-1 cm:max-h-64 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: C.map((m) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            className: "cm:flex cm:w-full cm:justify-between cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted",
            onClick: () => {
              o((d) => ({ ...d, [m.id]: m })), _({ items: [...l.items, { variant_id: m.id, quantity: 1 }] }), N("");
            },
            children: [
              /* @__PURE__ */ c("span", { children: [
                m.label,
                m.sku && /* @__PURE__ */ c("span", { className: "cm:text-muted-foreground", children: [
                  " · ",
                  m.sku
                ] })
              ] }),
              /* @__PURE__ */ e("span", { children: H(m.price) })
            ]
          }
        ) }, m.id)) })
      ] })
    ] }),
    /* @__PURE__ */ e(A, { title: "Bundle price", description: v ? `The products cost ${H(u)} together.` : "Add available products to see the combined price.", children: /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(f, { label: "Price", htmlFor: `${a}-bundle-pricing`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${a}-bundle-pricing`,
          value: l.pricing,
          onChange: (m) => _({ pricing: m, value: 0 }),
          options: [["fixed", "Its own price (General tab)"], ["percent_off", "Total minus a percentage"], ["amount_off", "Total minus an amount"]]
        }
      ) }),
      l.pricing === "percent_off" && /* @__PURE__ */ e(f, { label: "Percent off", htmlFor: `${a}-bundle-value`, children: /* @__PURE__ */ e(U, { id: `${a}-bundle-value`, value: l.value / 100, onChange: (m) => _({ value: Math.round((m ?? 0) * 100) }) }) }),
      l.pricing === "amount_off" && /* @__PURE__ */ e(f, { label: "Amount off", htmlFor: `${a}-bundle-value`, children: /* @__PURE__ */ e(L, { id: `${a}-bundle-value`, value: l.value, nullable: !1, onChange: (m) => _({ value: m ?? 0 }) }) })
    ] }) })
  ] });
}
function ge() {
  return decodeURIComponent(document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/)?.[1] ?? "");
}
function fe({ value: t, update: n, path: a }) {
  const { Button: r } = D, [s, l] = x.useState(!1), i = x.useRef(null), o = t.delivery ?? { modes: ["link", "account"], download_limit: null, expiry_days: null }, k = (h) => n({ delivery: { ...o, ...h } }), N = (h, y) => n({ downloads: t.downloads.map((_, u) => u === h ? { ..._, ...y } : _) }), C = async (h) => {
    if (h?.length) {
      l(!0);
      try {
        const y = [];
        for (const _ of Array.from(h)) {
          const u = new FormData();
          u.append("file", _);
          const v = await fetch(M("commerce/api/downloads"), { method: "POST", body: u, headers: { "X-XSRF-TOKEN": ge(), Accept: "application/json" }, credentials: "same-origin" }), m = await v.json();
          if (!v.ok) throw new Error(m.message ?? "Upload failed");
          y.push({ id: B(), type: "file", file_id: m.data.id, url: null, name: _.name.replace(/\.[^.]+$/, ""), file: m.data });
        }
        n({ downloads: [...t.downloads, ...y] });
      } catch (y) {
        ae.error(y instanceof Error ? y.message : "Upload failed");
      } finally {
        l(!1), i.current && (i.current.value = "");
      }
    }
  };
  return /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ c(
      A,
      {
        title: "Files and links",
        description: "Files are stored privately and only served to customers who bought them.",
        actions: /* @__PURE__ */ c("div", { className: "cm:flex cm:gap-2", children: [
          /* @__PURE__ */ e(r, { type: "button", variant: "outline", size: "sm", disabled: s, onClick: () => i.current?.click(), children: s ? "Uploading…" : "Upload file" }),
          /* @__PURE__ */ e(r, { type: "button", variant: "outline", size: "sm", onClick: () => n({ downloads: [...t.downloads, { id: B(), type: "url", file_id: null, url: null, name: "" }] }), children: "Add link" }),
          /* @__PURE__ */ e("input", { ref: i, type: "file", multiple: !0, hidden: !0, onChange: (h) => C(h.target.files) })
        ] }),
        children: [
          t.downloads.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No files yet." }),
          t.downloads.map((h, y) => /* @__PURE__ */ c("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(f, { label: "Name", htmlFor: `${a}-dl-${y}`, children: /* @__PURE__ */ e(E, { id: `${a}-dl-${y}`, value: h.name, onChange: (_) => N(y, { name: _ ?? "" }) }) }),
            h.type === "url" ? /* @__PURE__ */ e(f, { label: "Link", htmlFor: `${a}-dl-${y}-url`, children: /* @__PURE__ */ e(E, { id: `${a}-dl-${y}-url`, value: h.url, placeholder: "https://", onChange: (_) => N(y, { url: _ }) }) }) : /* @__PURE__ */ e(f, { label: "File", children: /* @__PURE__ */ e("p", { className: "cm:truncate cm:text-sm cm:text-muted-foreground", children: h.file?.filename ?? `File #${h.file_id}` }) }),
            /* @__PURE__ */ e(r, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ downloads: t.downloads.filter((_, u) => u !== y) }), children: "Remove" })
          ] }, h.id ?? y))
        ]
      }
    ),
    /* @__PURE__ */ c(A, { title: "Delivery", children: [
      /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-3", children: [["attachment", "Attach files to the email"], ["link", "Download links in the email"], ["account", "Library in My Account"]].map(([h, y]) => /* @__PURE__ */ e(
        R,
        {
          id: `${a}-mode-${h}`,
          label: y,
          checked: o.modes.includes(h),
          onChange: (_) => k({ modes: _ ? [...o.modes, h] : o.modes.filter((u) => u !== h) })
        },
        h
      )) }),
      /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
        /* @__PURE__ */ e(f, { label: "Downloads per file", htmlFor: `${a}-limit`, hint: "Empty: unlimited.", children: /* @__PURE__ */ e(U, { id: `${a}-limit`, min: 1, value: o.download_limit, onChange: (h) => k({ download_limit: h }) }) }),
        /* @__PURE__ */ e(f, { label: "Links expire after (days)", htmlFor: `${a}-expiry`, hint: "Empty: never.", children: /* @__PURE__ */ e(U, { id: `${a}-expiry`, min: 1, value: o.expiry_days, onChange: (h) => k({ expiry_days: h }) }) })
      ] })
    ] })
  ] });
}
function ee({ id: t, value: n, onChange: a, entryId: r }) {
  const [s, l] = x.useState(null);
  return /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-1", children: [
    /* @__PURE__ */ e(E, { id: t, value: n, onChange: (o) => {
      l(null), a(o);
    }, onBlur: () => {
      if (!n) return l(null);
      const o = new URLSearchParams({ sku: n, entry: String(r ?? 0) });
      K(M(`commerce/api/sku-check?${o}`)).then((k) => l(k.available ? null : k.product ?? "another product")).catch(() => l(null));
    } }),
    s && /* @__PURE__ */ c("p", { className: "cm:text-xs cm:text-destructive", children: [
      "Already used by ",
      s,
      "."
    ] })
  ] });
}
const Y = [
  ["cart", "Add to cart"],
  ["inquiry", "Inquiry form"],
  ["whatsapp", "Ask on WhatsApp"],
  ["external", "Links to other shops"],
  ["none", "No button"]
];
function be({ value: t, update: n, updateVariant: a, config: r, purchaseDefault: s, entryId: l, path: i }) {
  const { Button: o } = D, k = [["simple", "Simple product"]];
  (r.features.variants || t.type === "variable") && k.push(["variable", "Variable product (sizes, colors…)"]), (r.features.bundles || t.type === "bundle") && k.push(["bundle", "Bundle of other products"]);
  const N = t.variants[0], h = t.external_links.some((d) => d.url) ? s?.with_links : s?.without_links, y = Y.find(([d]) => d === h?.type)?.[1], _ = h?.source_name ? `${h.source} settings (${h.source_name})` : `${h?.source ?? "store"} settings`, u = y ? `Default · ${y}` : "Default · Inherit settings", v = t.purchase_mode === "default" ? y ? `Inherited from ${_}.` : "Uses the closest saved setting in brand, category, or store." : "This product overrides the inherited setting.", m = t.purchase_mode === "external" || t.purchase_mode === "default" && s?.with_links.type === "external";
  return /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ c(P, { cols: 2, children: [
      /* @__PURE__ */ e(f, { label: "Product type", htmlFor: `${i}-type`, children: /* @__PURE__ */ e(I, { id: `${i}-type`, value: t.type, options: k, onChange: (d) => n({ type: d }) }) }),
      /* @__PURE__ */ e(f, { label: "Storefront button", htmlFor: `${i}-mode`, hint: v, children: /* @__PURE__ */ e(I, { id: `${i}-mode`, value: t.purchase_mode, options: [["default", u], ...Y], onChange: (d) => n({ purchase_mode: d }) }) })
    ] }),
    t.type !== "variable" && N && /* @__PURE__ */ e(A, { title: "Pricing and SKU", children: /* @__PURE__ */ c(P, { cols: 4, children: [
      /* @__PURE__ */ e(f, { label: "Price", htmlFor: `${i}-price`, children: /* @__PURE__ */ e(L, { id: `${i}-price`, value: N.price, nullable: !1, onChange: (d) => a(0, { price: d ?? 0 }) }) }),
      /* @__PURE__ */ e(f, { label: "Compare-at price", htmlFor: `${i}-compare`, hint: "Shown struck through when higher.", children: /* @__PURE__ */ e(L, { id: `${i}-compare`, value: N.compare_at_price, onChange: (d) => a(0, { compare_at_price: d }) }) }),
      /* @__PURE__ */ e(f, { label: "Cost", htmlFor: `${i}-cost`, hint: "For profit reports; never shown.", children: /* @__PURE__ */ e(L, { id: `${i}-cost`, value: N.cost, onChange: (d) => a(0, { cost: d }) }) }),
      /* @__PURE__ */ e(f, { label: "SKU", htmlFor: `${i}-sku`, children: /* @__PURE__ */ e(ee, { id: `${i}-sku`, value: N.sku, entryId: l, onChange: (d) => a(0, { sku: d }) }) })
    ] }) }),
    (m || t.external_links.length > 0) && /* @__PURE__ */ e(
      A,
      {
        title: "Links to other shops",
        description: "Buttons such as 'Buy on Tokopedia'.",
        actions: t.external_links.length < 10 && /* @__PURE__ */ e(o, { type: "button", variant: "outline", size: "sm", onClick: () => n({ external_links: [...t.external_links, { preset: "tokopedia", label: null, url: null }] }), children: "Add link" }),
        children: t.external_links.map((d, b) => {
          const S = (p) => n({ external_links: t.external_links.map((w, g) => g === b ? { ...w, ...p } : w) });
          return /* @__PURE__ */ c("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[10rem_1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(f, { label: "Shop", htmlFor: `${i}-link-${b}-preset`, children: /* @__PURE__ */ e(
              I,
              {
                id: `${i}-link-${b}-preset`,
                value: d.preset ?? "",
                onChange: (p) => S({ preset: p || null }),
                options: [...Object.entries(r.link_presets), ["", "Other…"]]
              }
            ) }),
            /* @__PURE__ */ e(f, { label: "Button label", htmlFor: `${i}-link-${b}-label`, children: /* @__PURE__ */ e(E, { id: `${i}-link-${b}-label`, value: d.label, placeholder: d.preset ? `Buy on ${r.link_presets[d.preset]}` : "", onChange: (p) => S({ label: p }) }) }),
            /* @__PURE__ */ e(f, { label: "Link", htmlFor: `${i}-link-${b}-url`, children: /* @__PURE__ */ e(E, { id: `${i}-link-${b}-url`, value: d.url, placeholder: "https://", onChange: (p) => S({ url: p }) }) }),
            /* @__PURE__ */ e(o, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ external_links: t.external_links.filter((p, w) => w !== b) }), children: "Remove" })
          ] }, b);
        })
      }
    ),
    /* @__PURE__ */ e(A, { title: "Fulfillment", children: /* @__PURE__ */ c(P, { cols: 2, children: [
      (r.features.digital || t.downloadable) && /* @__PURE__ */ e(R, { id: `${i}-downloadable`, label: "Downloadable", checked: t.downloadable, onChange: (d) => n({ downloadable: d }), hint: "Deliver files or links after payment." }),
      /* @__PURE__ */ e(
        R,
        {
          id: `${i}-shipping`,
          label: "Needs shipping",
          checked: t.requires_shipping,
          disabled: t.downloadable,
          onChange: (d) => n({ requires_shipping: d }),
          hint: t.downloadable ? "Downloads are delivered digitally." : "Turn off for services or other items without delivery."
        }
      )
    ] }) }),
    /* @__PURE__ */ e(A, { title: "Catalog and tax", children: /* @__PURE__ */ c(P, { cols: 2, children: [
      r.features.taxes && /* @__PURE__ */ e(f, { label: "Tax class", htmlFor: `${i}-tax`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${i}-tax`,
          value: t.tax_class ?? "",
          onChange: (d) => n({ tax_class: d || null }),
          options: [["", "Standard"], ...r.tax_classes.filter((d) => d !== "standard").map((d) => [d, d])]
        }
      ) }),
      /* @__PURE__ */ e(R, { id: `${i}-featured`, label: "Featured", checked: t.featured, onChange: (d) => n({ featured: d }), hint: "Shown first when sorting by featured." })
    ] }) })
  ] });
}
function te({ variantKey: t, tab: n, sku: a }) {
  const r = n.live?.variants[t], s = n.live?.stock_adjustment?.reasons, [l, i] = x.useState(!1), { Button: o } = D;
  return !r || r.stock_quantity === null ? null : /* @__PURE__ */ c(f, { label: "In stock", children: [
    /* @__PURE__ */ c("div", { className: "cm:flex cm:min-h-10 cm:flex-wrap cm:items-center cm:gap-x-3 cm:gap-y-1", children: [
      /* @__PURE__ */ e("strong", { className: "cm:text-lg cm:tabular-nums", "aria-live": "polite", children: r.stock_quantity }),
      s && /* @__PURE__ */ e(o, { type: "button", size: "sm", variant: "outline", onClick: () => i(!0), children: "Adjust stock" })
    ] }),
    l && s && /* @__PURE__ */ e(
      ve,
      {
        id: r.id,
        stock: r.stock_quantity,
        sku: a,
        reasons: s,
        onClose: () => i(!1),
        onAdjusted: (k) => n.updateLiveStock(t, r.id, k)
      },
      r.id
    )
  ] });
}
function ve({ id: t, stock: n, sku: a, reasons: r, onClose: s, onAdjusted: l }) {
  const { Button: i, Dialog: o, DialogContent: k, DialogDescription: N, DialogFooter: C, DialogHeader: h, DialogTitle: y, Input: _ } = D, [u, v] = x.useState("add"), [m, d] = x.useState(""), [b, S] = x.useState(r[0]), [p, w] = x.useState(null), [g, $] = x.useState(""), [F, j] = x.useState(!1), T = x.useId();
  async function ne(q) {
    if (q.preventDefault(), q.stopPropagation(), !(F || g || m === "")) {
      j(!0), $("");
      try {
        const le = await K(M(`commerce/inventory/${t}/adjust`), {
          method: "POST",
          signal: AbortSignal.timeout(15e3),
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: u, quantity: Number(m), reason: b, note: p })
        });
        l(le.stock_quantity), s();
      } catch {
        $("The adjustment could not be confirmed. Check the current stock in Inventory before retrying.");
      } finally {
        j(!1);
      }
    }
  }
  return /* @__PURE__ */ e(o, { open: !0, onOpenChange: (q) => {
    !q && !F && s();
  }, children: /* @__PURE__ */ c(k, { className: "cm:max-w-lg", children: [
    /* @__PURE__ */ c(h, { children: [
      /* @__PURE__ */ e(y, { children: "Adjust stock" }),
      /* @__PURE__ */ c(N, { children: [
        a ? `${a} · ` : "",
        "Current stock: ",
        n,
        ". This saves immediately and records a stock movement."
      ] })
    ] }),
    /* @__PURE__ */ c("form", { id: T, className: "cm:grid cm:gap-4", onSubmit: ne, children: [
      /* @__PURE__ */ c("div", { className: "cm:grid cm:items-start cm:gap-3 cm:sm:grid-cols-2", children: [
        /* @__PURE__ */ e(f, { label: "Adjustment", htmlFor: `${T}-mode`, children: /* @__PURE__ */ e(
          I,
          {
            id: `${T}-mode`,
            value: u,
            onChange: (q) => {
              v(q), d("");
            },
            options: [["add", "Add or remove units"], ["set", "Set total stock"]]
          }
        ) }),
        /* @__PURE__ */ e(f, { label: u === "set" ? "New stock total" : "Units (+/−)", htmlFor: `${T}-quantity`, children: /* @__PURE__ */ e(
          _,
          {
            id: `${T}-quantity`,
            type: "number",
            inputMode: "numeric",
            required: !0,
            min: u === "set" ? 0 : -1e6,
            max: 1e6,
            step: 1,
            value: m,
            onChange: (q) => d(q.target.value)
          }
        ) }),
        /* @__PURE__ */ e(f, { label: "Reason", htmlFor: `${T}-reason`, children: /* @__PURE__ */ e(
          I,
          {
            id: `${T}-reason`,
            value: b,
            onChange: S,
            options: r.map((q) => [q, q[0].toUpperCase() + q.slice(1)])
          }
        ) }),
        /* @__PURE__ */ e(f, { label: "Note (optional)", htmlFor: `${T}-note`, children: /* @__PURE__ */ e(_, { id: `${T}-note`, value: p ?? "", maxLength: 255, onChange: (q) => w(q.target.value || null) }) })
      ] }),
      g && /* @__PURE__ */ e("p", { role: "alert", className: "cm:text-sm cm:text-destructive", children: g })
    ] }),
    /* @__PURE__ */ c(C, { children: [
      /* @__PURE__ */ e(i, { type: "button", variant: "ghost", disabled: F, onClick: s, children: "Cancel" }),
      /* @__PURE__ */ e(i, { type: "submit", form: T, disabled: F || m === "" || !!g, children: F ? "Saving…" : "Save adjustment" })
    ] })
  ] }) });
}
function ke(t) {
  const { value: n, updateVariant: a, live: r, path: s } = t, l = n.variants[0];
  if (!l) return null;
  const i = r?.variants[l.id];
  return /* @__PURE__ */ c(A, { title: "Stock", children: [
    /* @__PURE__ */ e(
      R,
      {
        id: `${s}-track`,
        label: "Track stock",
        checked: l.track_stock,
        onChange: (o) => a(0, { track_stock: o }),
        hint: "Reduce stock when an order is placed and restore it when the order is cancelled."
      }
    ),
    l.track_stock ? /* @__PURE__ */ c(P, { cols: 3, children: [
      i?.track_stock && i.stock_quantity !== null ? /* @__PURE__ */ e(te, { variantKey: l.id, tab: t, sku: l.sku }) : /* @__PURE__ */ e(f, { label: "Starting stock", htmlFor: `${s}-initial`, hint: "Set once, when the product is published.", children: /* @__PURE__ */ e(U, { id: `${s}-initial`, value: l.initial_stock, onChange: (o) => a(0, { initial_stock: o }) }) }),
      /* @__PURE__ */ e(f, { label: "When sold out", htmlFor: `${s}-backorders`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${s}-backorders`,
          value: l.backorders,
          onChange: (o) => a(0, { backorders: o }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }),
      /* @__PURE__ */ e(f, { label: "Low stock at", htmlFor: `${s}-low`, hint: "Empty: the store's setting.", children: /* @__PURE__ */ e(U, { id: `${s}-low`, value: l.low_stock_threshold, onChange: (o) => a(0, { low_stock_threshold: o }) }) })
    ] }) : /* @__PURE__ */ e(f, { label: "Stock status", htmlFor: `${s}-status`, children: /* @__PURE__ */ e(
      I,
      {
        id: `${s}-status`,
        value: l.stock_status,
        onChange: (o) => a(0, { stock_status: o }),
        options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
      }
    ) })
  ] });
}
function ye({ value: t, update: n, path: a }) {
  const { Button: r } = D, s = (l, i) => n({ tiers: t.tiers.map((o, k) => k === l ? { ...o, ...i } : o) });
  return /* @__PURE__ */ c(
    A,
    {
      title: "Bulk prices",
      description: "Lower unit prices for larger quantities. The best matching tier applies.",
      actions: t.tiers.length < 20 && /* @__PURE__ */ e(
        r,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          onClick: () => n({ tiers: [...t.tiers, { min_qty: (t.tiers.at(-1)?.min_qty ?? 1) + 9, type: "percent_off", value: 500, variant: null }] }),
          children: "Add tier"
        }
      ),
      children: [
        t.tiers.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No bulk prices." }),
        t.tiers.map((l, i) => /* @__PURE__ */ c("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[8rem_12rem_1fr_1fr_auto]", children: [
          /* @__PURE__ */ e(f, { label: "From (units)", htmlFor: `${a}-tier-${i}-min`, children: /* @__PURE__ */ e(U, { id: `${a}-tier-${i}-min`, min: 2, value: l.min_qty, onChange: (o) => s(i, { min_qty: o ?? 2 }) }) }),
          /* @__PURE__ */ e(f, { label: "Price", htmlFor: `${a}-tier-${i}-type`, children: /* @__PURE__ */ e(
            I,
            {
              id: `${a}-tier-${i}-type`,
              value: l.type,
              onChange: (o) => s(i, { type: o, value: 0 }),
              options: [["percent_off", "Percent off"], ["amount_off", "Amount off per unit"], ["fixed_price", "Fixed unit price"]]
            }
          ) }),
          /* @__PURE__ */ e(f, { label: l.type === "percent_off" ? "Percent" : "Amount", htmlFor: `${a}-tier-${i}-value`, children: l.type === "percent_off" ? /* @__PURE__ */ e(U, { id: `${a}-tier-${i}-value`, value: l.value / 100, onChange: (o) => s(i, { value: Math.round((o ?? 0) * 100) }) }) : /* @__PURE__ */ e(L, { id: `${a}-tier-${i}-value`, value: l.value, nullable: !1, onChange: (o) => s(i, { value: o ?? 0 }) }) }),
          /* @__PURE__ */ e(f, { label: "For", htmlFor: `${a}-tier-${i}-variant`, children: /* @__PURE__ */ e(
            I,
            {
              id: `${a}-tier-${i}-variant`,
              value: l.variant ?? "",
              onChange: (o) => s(i, { variant: o || null }),
              options: [["", "All variants"], ...t.type === "variable" ? t.variants.map((o) => [o.id, Z(t.options, o)]) : []]
            }
          ) }),
          /* @__PURE__ */ e(r, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ tiers: t.tiers.filter((o, k) => k !== i) }), children: "Remove" })
        ] }, i))
      ]
    }
  );
}
function _e({ value: t, update: n, updateVariant: a, path: r }) {
  const s = t.variants[0];
  if (!s) return null;
  const l = (i) => t.type === "variable" ? n({ variants: t.variants.map((o) => ({ ...o, ...i })) }) : a(0, i);
  return /* @__PURE__ */ e(A, { title: "Package", description: t.type === "variable" ? "Applies to every variant; a variant can have its own weight under More." : "Used for shipping rates.", children: /* @__PURE__ */ c(P, { cols: 4, children: [
    /* @__PURE__ */ e(f, { label: `Weight (${W()})`, htmlFor: `${r}-weight`, children: /* @__PURE__ */ e(z, { id: `${r}-weight`, unit: W(), value: s.weight, onChange: (i) => l({ weight: i }) }) }),
    /* @__PURE__ */ e(f, { label: `Length (${O()})`, htmlFor: `${r}-length`, children: /* @__PURE__ */ e(z, { id: `${r}-length`, unit: O(), value: s.length, onChange: (i) => l({ length: i }) }) }),
    /* @__PURE__ */ e(f, { label: `Width (${O()})`, htmlFor: `${r}-width`, children: /* @__PURE__ */ e(z, { id: `${r}-width`, unit: O(), value: s.width, onChange: (i) => l({ width: i }) }) }),
    /* @__PURE__ */ e(f, { label: `Height (${O()})`, htmlFor: `${r}-height`, children: /* @__PURE__ */ e(z, { id: `${r}-height`, unit: O(), value: s.height, onChange: (i) => l({ height: i }) }) })
  ] }) });
}
const G = {
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
function $e({ option: t, onChange: n, onRemove: a, config: r, path: s }) {
  const { Button: l, Input: i, Badge: o } = D, [k, N] = x.useState(""), C = () => {
    const u = k.split(",").map((v) => v.trim()).filter(Boolean).filter((v) => !t.values.some((m) => (m.label ?? "").toLowerCase() === v.toLowerCase()));
    u.length && n({ ...t, values: [...t.values, ...u.map((v) => ({ id: B(), label: v }))] }), N("");
  }, h = r.attribute_taxonomies.find((u) => u.handle === t.taxonomy)?.title.slice(0, 60), y = (u) => {
    const v = r.attribute_taxonomies.find((d) => d.handle === u)?.title.slice(0, 60), m = t.name.trim() === "" || t.name === h;
    n({ ...t, name: m ? v ?? "" : t.name, taxonomy: u || null, values: [] });
  }, _ = t.values.map((u) => u.term_id).filter((u) => !!u);
  return /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-3 cm:rounded-md cm:border cm:p-3", children: [
    /* @__PURE__ */ c("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_1fr_auto]", children: [
      r.attribute_taxonomies.length > 0 && /* @__PURE__ */ e(f, { label: "Values from", htmlFor: `${s}-source`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${s}-source`,
          value: t.taxonomy ?? "",
          onChange: y,
          options: [["", "Custom values"], ...r.attribute_taxonomies.map((u) => [u.handle, u.title])]
        }
      ) }),
      /* @__PURE__ */ e(f, { label: "Option name", htmlFor: `${s}-name`, children: /* @__PURE__ */ e(
        i,
        {
          id: `${s}-name`,
          value: t.name,
          placeholder: h ?? "e.g. Size",
          onChange: (u) => n({ ...t, name: u.target.value })
        }
      ) }),
      /* @__PURE__ */ e(l, { type: "button", variant: "ghost", size: "sm", onClick: a, children: "Remove option" })
    ] }),
    t.taxonomy ? /* @__PURE__ */ e(
      se,
      {
        fields: [{ handle: "terms", type: "terms", label: "Values", config: {
          multiple: !0,
          options: (r.attribute_taxonomies.find((u) => u.handle === t.taxonomy)?.terms ?? []).map((u) => ({ value: String(u.id), label: u.title }))
        } }],
        values: { terms: _ },
        pathPrefix: `${s}-terms`,
        onChange: (u) => {
          const v = u.terms ?? [], m = t.values.filter((b) => b.term_id && v.includes(b.term_id)), d = v.filter((b) => !m.some((S) => S.term_id === b)).map((b) => ({ id: B(), term_id: b }));
          n({ ...t, values: [...m, ...d] });
        }
      }
    ) : /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-2", children: [
      /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: t.values.map((u) => /* @__PURE__ */ c(o, { variant: "secondary", className: "cm:gap-1", children: [
        u.label,
        /* @__PURE__ */ e("button", { type: "button", "aria-label": `Remove ${u.label}`, onClick: () => n({ ...t, values: t.values.filter((v) => v.id !== u.id) }), children: "×" })
      ] }, u.id)) }),
      /* @__PURE__ */ c("div", { className: "cm:flex cm:gap-2", children: [
        /* @__PURE__ */ e(
          i,
          {
            value: k,
            placeholder: "S, M, L",
            "aria-label": `Add values to ${t.name || "option"}`,
            onChange: (u) => N(u.target.value),
            onKeyDown: (u) => {
              u.key === "Enter" && (u.preventDefault(), C());
            }
          }
        ),
        /* @__PURE__ */ e(l, { type: "button", variant: "outline", onClick: C, children: "Add" })
      ] })
    ] })
  ] });
}
function xe({ variant: t, index: n, updateVariant: a, tab: r }) {
  const { MediaPickerInput: s } = D, l = `${r.path}-v${n}`, i = r.live?.variants[t.id];
  return /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-4 cm:bg-muted/40 cm:p-4", children: [
    /* @__PURE__ */ c(P, { cols: 4, children: [
      /* @__PURE__ */ e(f, { label: "Cost", htmlFor: `${l}-cost`, children: /* @__PURE__ */ e(L, { id: `${l}-cost`, value: t.cost, onChange: (o) => a(n, { cost: o }) }) }),
      /* @__PURE__ */ e(f, { label: "Barcode", htmlFor: `${l}-barcode`, children: /* @__PURE__ */ e(E, { id: `${l}-barcode`, value: t.barcode, onChange: (o) => a(n, { barcode: o }) }) }),
      /* @__PURE__ */ e(f, { label: `Weight (${W()})`, htmlFor: `${l}-weight`, children: /* @__PURE__ */ e(z, { id: `${l}-weight`, unit: W(), value: t.weight, onChange: (o) => a(n, { weight: o }), placeholder: "Product's" }) }),
      /* @__PURE__ */ e(f, { label: "Min / max / step", htmlFor: `${l}-min`, children: /* @__PURE__ */ c("div", { className: "cm:grid cm:grid-cols-3 cm:gap-1", children: [
        /* @__PURE__ */ e(U, { id: `${l}-min`, min: 1, value: t.min_qty, onChange: (o) => a(n, { min_qty: o ?? 1 }) }),
        /* @__PURE__ */ e(U, { min: 1, value: t.max_qty, onChange: (o) => a(n, { max_qty: o }), placeholder: "–" }),
        /* @__PURE__ */ e(U, { min: 1, value: t.qty_step, onChange: (o) => a(n, { qty_step: o ?? 1 }) })
      ] }) })
    ] }),
    r.config.features.inventory && /* @__PURE__ */ c(P, { cols: 4, children: [
      /* @__PURE__ */ e(R, { id: `${l}-track`, label: "Track stock", checked: t.track_stock, onChange: (o) => a(n, { track_stock: o }) }),
      t.track_stock && (i?.track_stock && i.stock_quantity !== null ? /* @__PURE__ */ e(te, { variantKey: t.id, tab: r, sku: t.sku }) : /* @__PURE__ */ e(f, { label: "Starting stock", htmlFor: `${l}-initial`, children: /* @__PURE__ */ e(U, { id: `${l}-initial`, value: t.initial_stock, onChange: (o) => a(n, { initial_stock: o }) }) })),
      t.track_stock ? /* @__PURE__ */ e(f, { label: "When sold out", htmlFor: `${l}-backorders`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${l}-backorders`,
          value: t.backorders,
          onChange: (o) => a(n, { backorders: o }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }) : /* @__PURE__ */ e(f, { label: "Stock status", htmlFor: `${l}-status`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${l}-status`,
          value: t.stock_status,
          onChange: (o) => a(n, { stock_status: o }),
          options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
        }
      ) })
    ] }),
    /* @__PURE__ */ e(f, { label: "Image", htmlFor: `${l}-image`, children: /* @__PURE__ */ e(s, { id: `${l}-image`, value: t.image, types: ["image"], onChange: (o) => a(n, { image: o }) }) })
  ] });
}
function we(t) {
  const { value: n, update: a, updateVariant: r, config: s, entryId: l, live: i } = t, { Button: o, Table: k, TableBody: N, TableCell: C, TableHead: h, TableHeader: y, TableRow: _, Switch: u } = D, [v, m] = x.useState(null), d = Object.fromEntries(t.config.attribute_taxonomies.flatMap((p) => p.terms.map((w) => [w.id, w.title]))), b = n.variants[0] ?? { ...G, id: B() }, S = (p = n.options) => a({ options: p, variants: ue(p, n.variants, { ...b, initial_stock: null, image: null }, s.max_variants) });
  return /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ e(
      A,
      {
        title: "Options",
        description: `Up to ${s.max_options} options, such as size and color. Variants are made for every combination.`,
        actions: n.options.length < s.max_options && /* @__PURE__ */ e(o, { type: "button", variant: "outline", size: "sm", onClick: () => a({ options: [...n.options, { id: B(), name: "", taxonomy: null, values: [] }] }), children: "Add option" }),
        children: n.options.map((p, w) => /* @__PURE__ */ e(
          $e,
          {
            option: p,
            config: s,
            path: `${t.path}-o${w}`,
            onChange: (g) => S(n.options.map(($, F) => F === w ? g : $)),
            onRemove: () => S(n.options.filter((g, $) => $ !== w))
          },
          p.id
        ))
      }
    ),
    /* @__PURE__ */ c(
      A,
      {
        title: `Variants (${n.variants.length})`,
        description: "Each has its own SKU, price and stock. Switch one off to stop selling it without losing it.",
        actions: /* @__PURE__ */ e(o, { type: "button", variant: "outline", size: "sm", onClick: () => S(), children: "Regenerate" }),
        children: [
          n.options.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "Add an option with values to create variants." }) : /* @__PURE__ */ e("div", { className: "cm:overflow-x-auto cm:rounded-md cm:border", children: /* @__PURE__ */ c(k, { children: [
            /* @__PURE__ */ e(y, { children: /* @__PURE__ */ c(_, { children: [
              /* @__PURE__ */ e(h, { children: "Variant" }),
              /* @__PURE__ */ e(h, { children: "SKU" }),
              /* @__PURE__ */ e(h, { children: "Price" }),
              /* @__PURE__ */ e(h, { children: "Compare-at" }),
              s.features.inventory && /* @__PURE__ */ e(h, { children: "Stock" }),
              /* @__PURE__ */ e(h, { children: "On sale" }),
              /* @__PURE__ */ e(h, {})
            ] }) }),
            /* @__PURE__ */ e(N, { children: n.variants.map((p, w) => {
              const g = i?.variants[p.id];
              return /* @__PURE__ */ c(x.Fragment, { children: [
                /* @__PURE__ */ c(_, { className: p.active ? "" : "cm:opacity-60", children: [
                  /* @__PURE__ */ e(C, { className: "cm:font-medium cm:whitespace-nowrap", children: Z(n.options, p, d) }),
                  /* @__PURE__ */ e(C, { className: "cm:min-w-36", children: /* @__PURE__ */ e(ee, { value: p.sku, entryId: l, onChange: ($) => r(w, { sku: $ }) }) }),
                  /* @__PURE__ */ e(C, { className: "cm:min-w-32", children: /* @__PURE__ */ e(L, { value: p.price, nullable: !1, onChange: ($) => r(w, { price: $ ?? 0 }) }) }),
                  /* @__PURE__ */ e(C, { className: "cm:min-w-32", children: /* @__PURE__ */ e(L, { value: p.compare_at_price, onChange: ($) => r(w, { compare_at_price: $ }) }) }),
                  s.features.inventory && /* @__PURE__ */ e(C, { className: "cm:whitespace-nowrap cm:text-sm", children: p.track_stock ? g?.stock_quantity ?? p.initial_stock ?? 0 : /* @__PURE__ */ e(re, { children: p.stock_status.replace("_", " ") }) }),
                  /* @__PURE__ */ e(C, { children: /* @__PURE__ */ e(u, { checked: p.active, "aria-label": "Sell this variant", onCheckedChange: ($) => r(w, { active: $ }) }) }),
                  /* @__PURE__ */ e(C, { children: /* @__PURE__ */ e(o, { type: "button", variant: "ghost", size: "sm", "aria-expanded": v === p.id, onClick: () => m(v === p.id ? null : p.id), children: v === p.id ? "Close" : "More" }) })
                ] }),
                v === p.id && /* @__PURE__ */ e(_, { children: /* @__PURE__ */ e(C, { colSpan: 7, className: "cm:p-0", children: /* @__PURE__ */ e(xe, { variant: p, index: w, updateVariant: r, tab: t }) }) })
              ] }, p.id);
            }) })
          ] }) }),
          n.variants.length > 0 && /* @__PURE__ */ c("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
            "Prices from ",
            H(Math.min(...n.variants.map((p) => p.price))),
            " to ",
            H(Math.max(...n.variants.map((p) => p.price))),
            "."
          ] })
        ]
      }
    )
  ] });
}
function Ce(t) {
  const n = t ?? {}, a = (n.variants?.length ? n.variants : [{ ...G, id: B() }]).map((r) => ({ ...G, ...r, id: r.id ?? B() }));
  return {
    type: n.type ?? "simple",
    purchase_mode: n.purchase_mode ?? "default",
    external_links: n.external_links ?? [],
    requires_shipping: !n.downloadable && (n.requires_shipping ?? !0),
    downloadable: n.downloadable ?? !1,
    featured: n.featured ?? !1,
    tax_class: n.tax_class ?? null,
    options: n.options ?? [],
    variants: a,
    bundle: n.bundle ?? null,
    downloads: n.downloads ?? [],
    delivery: n.delivery ?? null,
    tiers: n.tiers ?? []
  };
}
function Se({ field: t, value: n, onChange: a, errors: r, id: s = "data-product" }) {
  oe();
  const l = t.config ?? {}, i = Ce(n), { props: o } = ce.usePage(), k = o.entry?.id ?? null, [N, C] = x.useState(), [h, y] = x.useState(null);
  x.useEffect(() => {
    if (!k) return;
    const g = new AbortController();
    return K(M(`commerce/api/products/${k}`), { signal: g.signal }).then(($) => {
      g.signal.aborted || (y($.data), C($.purchase_default));
    }).catch(() => {
    }), () => g.abort();
  }, [k, o.entry]);
  const _ = (g) => {
    const $ = { ...i, ...g };
    $.downloadable && ($.requires_shipping = !1), g.type && g.type !== "variable" && ($.options = [], $.variants = [{ ...$.variants[0], options: {} }]), g.type === "bundle" && !$.bundle && ($.bundle = { pricing: "fixed", value: 0, items: [] }), a($);
  }, u = (g, $) => _({ variants: i.variants.map((F, j) => j === g ? { ...F, ...$ } : F) }), v = [{ key: "general", label: "General", render: (g) => /* @__PURE__ */ e(be, { ...g }) }];
  i.type === "variable" && v.push({ key: "variants", label: "Variants", render: (g) => /* @__PURE__ */ e(we, { ...g }) }), i.type === "bundle" && v.push({ key: "bundle", label: "Bundle", render: (g) => /* @__PURE__ */ e(pe, { ...g }) }), i.type !== "variable" && (l.features?.inventory ?? !0) && v.push({ key: "inventory", label: "Inventory", render: (g) => /* @__PURE__ */ e(ke, { ...g }) }), i.requires_shipping && v.push({ key: "shipping", label: "Shipping", render: (g) => /* @__PURE__ */ e(_e, { ...g }) }), (l.features?.pricing_rules !== !1 || i.tiers.length > 0) && v.push({ key: "pricing", label: "Bulk pricing", render: (g) => /* @__PURE__ */ e(ye, { ...g }) }), i.downloadable && v.push({ key: "digital", label: "Digital", render: (g) => /* @__PURE__ */ e(fe, { ...g }) });
  for (const [g, $] of Object.entries(de.productTabs()))
    v.push({ key: `ext-${g}`, label: $.label ?? g, render: (F) => /* @__PURE__ */ e($, { ...F }) });
  const [m, d] = x.useState("general"), b = v.find((g) => g.key === m) ?? v[0], S = r?.[""], p = (g, $, F) => {
    y((j) => {
      const T = j?.variants[g];
      return !j || !T || T.id !== $ ? j : { ...j, variants: { ...j.variants, [g]: { ...T, stock_quantity: F } } };
    });
  }, w = { value: i, update: _, updateVariant: u, config: l, live: h, purchaseDefault: N ?? l.purchase_default, updateLiveStock: p, entryId: k, path: s };
  return /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-5", children: [
    h?.sync_status === "failed" && /* @__PURE__ */ c("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: [
      "The published version couldn't be applied to the store, so it can't be bought: ",
      h.sync_error,
      ". Fix it and publish again."
    ] }),
    S && /* @__PURE__ */ e("p", { role: "alert", className: "cm:text-sm cm:text-destructive", children: S }),
    /* @__PURE__ */ e("div", { role: "tablist", "aria-label": "Product data", className: "cm:flex cm:flex-wrap cm:gap-x-2 cm:border-b", children: v.map((g) => /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        id: `${s}-tab-${g.key}`,
        role: "tab",
        "aria-controls": `${s}-panel`,
        "aria-selected": g.key === b.key,
        onClick: () => d(g.key),
        className: J("cm:-mb-px cm:border-b-2 cm:px-3 cm:py-2 cm:text-sm", g.key === b.key ? "cm:border-primary cm:font-medium" : "cm:border-transparent cm:text-muted-foreground cm:hover:text-foreground"),
        children: g.label
      },
      g.key
    )) }),
    /* @__PURE__ */ e("div", { id: `${s}-panel`, role: "tabpanel", "aria-labelledby": `${s}-tab-${b.key}`, children: b.render(w) })
  ] });
}
export {
  Se as default
};
