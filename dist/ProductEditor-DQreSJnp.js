import { b as e, p as W, j as c, c as j, M as Z, R as w, l as E, a as U, g as z, t as ee, S as te, n as ne, d as le, i as ie, e as ae } from "./main-txcRj4Ln.js";
function P() {
  return (globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`).replace(/-/g, "").slice(0, 32);
}
function H(t) {
  return Object.keys(t).sort().map((n) => `${n}=${t[n]}`).join("|");
}
function re(t) {
  let n = [{}];
  for (const a of t) {
    if (a.values.length === 0) return [];
    const s = [];
    for (const r of n)
      for (const l of a.values)
        s.push({ ...r, [a.id]: l.id });
    n = s;
  }
  return t.length === 0 ? [] : n;
}
function se(t, n, a, s = 100) {
  const r = new Map(n.map((l) => [H(l.options), l]));
  return re(t).slice(0, s).map((l) => {
    const i = r.get(H(l));
    return i ? { ...i, options: l } : { ...a, id: P(), sku: null, options: l, active: !0, price: a.price ?? 0 };
  });
}
function X(t, n, a = {}) {
  return t.map((s) => {
    const r = s.values.find((l) => l.id === n.options[s.id]);
    return r ? r.label ?? (r.term_id ? a[r.term_id] ?? `#${r.term_id}` : "?") : "?";
  }).join(" / ");
}
function f({ label: t, hint: n, children: a, htmlFor: s, className: r }) {
  const { Label: l } = j;
  return /* @__PURE__ */ c("div", { className: W("cm:grid cm:content-start cm:gap-1.5", r), children: [
    /* @__PURE__ */ e(l, { htmlFor: s, children: t }),
    a,
    n && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: n })
  ] });
}
function L({ children: t, cols: n = 3 }) {
  return /* @__PURE__ */ e("div", { className: W("cm:grid cm:items-start cm:gap-4", { 2: "cm:sm:grid-cols-2", 3: "cm:sm:grid-cols-2 cm:lg:grid-cols-3", 4: "cm:sm:grid-cols-2 cm:lg:grid-cols-4" }[n]), children: t });
}
function F({ id: t, value: n, onChange: a, min: s = 0, placeholder: r }) {
  const { Input: l } = j;
  return /* @__PURE__ */ e(
    l,
    {
      id: t,
      type: "number",
      inputMode: "numeric",
      min: s,
      value: n ?? "",
      placeholder: r,
      onChange: (i) => a(i.target.value === "" ? null : Math.round(Number(i.target.value)))
    }
  );
}
function M({ id: t, value: n, onChange: a, placeholder: s, onBlur: r }) {
  const { Input: l } = j;
  return /* @__PURE__ */ e(
    l,
    {
      id: t,
      value: n ?? "",
      placeholder: s,
      onBlur: r,
      onChange: (i) => a(i.target.value === "" ? null : i.target.value)
    }
  );
}
function O({ id: t, value: n, onChange: a, nullable: s = !0 }) {
  return /* @__PURE__ */ e(Z, { id: t, value: n, allowNull: s, onChange: a });
}
function R({ id: t, label: n, checked: a, onChange: s, hint: r, disabled: l = !1 }) {
  const { Switch: i, Label: o } = j;
  return /* @__PURE__ */ c("div", { className: "cm:flex cm:items-start cm:gap-3", children: [
    /* @__PURE__ */ e(i, { id: t, disabled: l, checked: a, onCheckedChange: s }),
    /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-0.5", children: [
      /* @__PURE__ */ e(o, { htmlFor: t, children: n }),
      r && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: r })
    ] })
  ] });
}
const oe = "cm:h-10 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm";
function A({ id: t, value: n, onChange: a, options: s }) {
  return /* @__PURE__ */ e("select", { id: t, className: oe, value: n, onChange: (r) => a(r.target.value), children: s.map(([r, l]) => /* @__PURE__ */ e("option", { value: r, children: l }, r)) });
}
function I({ title: t, description: n, children: a, actions: s }) {
  return /* @__PURE__ */ c("section", { className: "cm:grid cm:gap-4", children: [
    /* @__PURE__ */ c("div", { className: "cm:flex cm:items-start cm:justify-between cm:gap-3", children: [
      /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-0.5", children: [
        /* @__PURE__ */ e("h3", { className: "cm:text-sm cm:font-semibold", children: t }),
        n && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: n })
      ] }),
      s
    ] }),
    a
  ] });
}
function ce({ value: t, update: n, path: a }) {
  const { Button: s, Input: r } = j, l = t.bundle ?? { pricing: "fixed", value: 0, items: [] }, [i, o] = w.useState({}), [y, N] = w.useState(""), [C, h] = w.useState([]), k = l.items.map((m) => m.variant_id).filter((m) => !!m);
  w.useEffect(() => {
    const m = k.filter((b) => !(b in i));
    if (m.length === 0) return;
    const d = Object.fromEntries(m.map((b) => [b, null]));
    E(U(`commerce/api/variants?bundle_components=1&${m.map((b) => `ids[]=${b}`).join("&")}`)).then((b) => o((S) => ({ ...S, ...d, ...Object.fromEntries(b.data.map((p) => [p.id, p])) }))).catch(() => o((b) => ({ ...b, ...d })));
  }, [k.join(",")]), w.useEffect(() => {
    if (y.trim().length < 2) return h([]);
    const m = setTimeout(() => E(U(`commerce/api/variants?q=${encodeURIComponent(y)}`)).then((d) => h(d.data)).catch(() => {
    }), 250);
    return () => clearTimeout(m);
  }, [y]);
  const _ = (m) => n({ bundle: { ...l, ...m } }), u = l.items.reduce((m, d) => m + (i[d.variant_id ?? 0]?.price ?? 0) * d.quantity, 0), v = l.items.length > 0 && l.items.every((m) => i[m.variant_id ?? 0]?.available);
  return /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ c(I, { title: "Products in the bundle", description: "Bundles take their stock from these products.", children: [
      l.items.map((m, d) => {
        const b = m.variant_id ? i[m.variant_id] : null;
        return /* @__PURE__ */ c("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
          /* @__PURE__ */ c("div", { className: "cm:flex-1 cm:text-sm", children: [
            /* @__PURE__ */ e("span", { children: b?.label || (b === void 0 ? "Loading product…" : "Unavailable product") }),
            b?.available === !1 && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-destructive", children: "Replace this unavailable variant to sell the bundle." })
          ] }),
          /* @__PURE__ */ e("div", { className: "cm:w-24", children: /* @__PURE__ */ e(F, { min: 1, value: m.quantity, onChange: (S) => _({ items: l.items.map((p, x) => x === d ? { ...p, quantity: S ?? 1 } : p) }) }) }),
          /* @__PURE__ */ e(s, { type: "button", variant: "ghost", size: "sm", onClick: () => _({ items: l.items.filter((S, p) => p !== d) }), children: "Remove" })
        ] }, d);
      }),
      /* @__PURE__ */ c("div", { className: "cm:relative", children: [
        /* @__PURE__ */ e(r, { value: y, placeholder: "Search products or SKUs to add…", "aria-label": "Add a product to the bundle", onChange: (m) => N(m.target.value) }),
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
              /* @__PURE__ */ e("span", { children: z(m.price) })
            ]
          }
        ) }, m.id)) })
      ] })
    ] }),
    /* @__PURE__ */ e(I, { title: "Bundle price", description: v ? `The products cost ${z(u)} together.` : "Add available products to see the combined price.", children: /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(f, { label: "Price", htmlFor: `${a}-bundle-pricing`, children: /* @__PURE__ */ e(
        A,
        {
          id: `${a}-bundle-pricing`,
          value: l.pricing,
          onChange: (m) => _({ pricing: m, value: 0 }),
          options: [["fixed", "Its own price (General tab)"], ["percent_off", "Total minus a percentage"], ["amount_off", "Total minus an amount"]]
        }
      ) }),
      l.pricing === "percent_off" && /* @__PURE__ */ e(f, { label: "Percent off", htmlFor: `${a}-bundle-value`, children: /* @__PURE__ */ e(F, { id: `${a}-bundle-value`, value: l.value / 100, onChange: (m) => _({ value: Math.round((m ?? 0) * 100) }) }) }),
      l.pricing === "amount_off" && /* @__PURE__ */ e(f, { label: "Amount off", htmlFor: `${a}-bundle-value`, children: /* @__PURE__ */ e(O, { id: `${a}-bundle-value`, value: l.value, nullable: !1, onChange: (m) => _({ value: m ?? 0 }) }) })
    ] }) })
  ] });
}
function de() {
  return decodeURIComponent(document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/)?.[1] ?? "");
}
function me({ value: t, update: n, path: a }) {
  const { Button: s } = j, [r, l] = w.useState(!1), i = w.useRef(null), o = t.delivery ?? { modes: ["link", "account"], download_limit: null, expiry_days: null }, y = (h) => n({ delivery: { ...o, ...h } }), N = (h, k) => n({ downloads: t.downloads.map((_, u) => u === h ? { ..._, ...k } : _) }), C = async (h) => {
    if (h?.length) {
      l(!0);
      try {
        const k = [];
        for (const _ of Array.from(h)) {
          const u = new FormData();
          u.append("file", _);
          const v = await fetch(U("commerce/api/downloads"), { method: "POST", body: u, headers: { "X-XSRF-TOKEN": de(), Accept: "application/json" }, credentials: "same-origin" }), m = await v.json();
          if (!v.ok) throw new Error(m.message ?? "Upload failed");
          k.push({ id: P(), type: "file", file_id: m.data.id, url: null, name: _.name.replace(/\.[^.]+$/, ""), file: m.data });
        }
        n({ downloads: [...t.downloads, ...k] });
      } catch (k) {
        ee.error(k instanceof Error ? k.message : "Upload failed");
      } finally {
        l(!1), i.current && (i.current.value = "");
      }
    }
  };
  return /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ c(
      I,
      {
        title: "Files and links",
        description: "Files are stored privately and only served to customers who bought them.",
        actions: /* @__PURE__ */ c("div", { className: "cm:flex cm:gap-2", children: [
          /* @__PURE__ */ e(s, { type: "button", variant: "outline", size: "sm", disabled: r, onClick: () => i.current?.click(), children: r ? "Uploading…" : "Upload file" }),
          /* @__PURE__ */ e(s, { type: "button", variant: "outline", size: "sm", onClick: () => n({ downloads: [...t.downloads, { id: P(), type: "url", file_id: null, url: null, name: "" }] }), children: "Add link" }),
          /* @__PURE__ */ e("input", { ref: i, type: "file", multiple: !0, hidden: !0, onChange: (h) => C(h.target.files) })
        ] }),
        children: [
          t.downloads.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No files yet." }),
          t.downloads.map((h, k) => /* @__PURE__ */ c("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(f, { label: "Name", htmlFor: `${a}-dl-${k}`, children: /* @__PURE__ */ e(M, { id: `${a}-dl-${k}`, value: h.name, onChange: (_) => N(k, { name: _ ?? "" }) }) }),
            h.type === "url" ? /* @__PURE__ */ e(f, { label: "Link", htmlFor: `${a}-dl-${k}-url`, children: /* @__PURE__ */ e(M, { id: `${a}-dl-${k}-url`, value: h.url, placeholder: "https://", onChange: (_) => N(k, { url: _ }) }) }) : /* @__PURE__ */ e(f, { label: "File", children: /* @__PURE__ */ e("p", { className: "cm:truncate cm:text-sm cm:text-muted-foreground", children: h.file?.filename ?? `File #${h.file_id}` }) }),
            /* @__PURE__ */ e(s, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ downloads: t.downloads.filter((_, u) => u !== k) }), children: "Remove" })
          ] }, h.id ?? k))
        ]
      }
    ),
    /* @__PURE__ */ c(I, { title: "Delivery", children: [
      /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-3", children: [["attachment", "Attach files to the email"], ["link", "Download links in the email"], ["account", "Library in My Account"]].map(([h, k]) => /* @__PURE__ */ e(
        R,
        {
          id: `${a}-mode-${h}`,
          label: k,
          checked: o.modes.includes(h),
          onChange: (_) => y({ modes: _ ? [...o.modes, h] : o.modes.filter((u) => u !== h) })
        },
        h
      )) }),
      /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
        /* @__PURE__ */ e(f, { label: "Downloads per file", htmlFor: `${a}-limit`, hint: "Empty: unlimited.", children: /* @__PURE__ */ e(F, { id: `${a}-limit`, min: 1, value: o.download_limit, onChange: (h) => y({ download_limit: h }) }) }),
        /* @__PURE__ */ e(f, { label: "Links expire after (days)", htmlFor: `${a}-expiry`, hint: "Empty: never.", children: /* @__PURE__ */ e(F, { id: `${a}-expiry`, min: 1, value: o.expiry_days, onChange: (h) => y({ expiry_days: h }) }) })
      ] })
    ] })
  ] });
}
function J({ id: t, value: n, onChange: a, entryId: s }) {
  const [r, l] = w.useState(null);
  return /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-1", children: [
    /* @__PURE__ */ e(M, { id: t, value: n, onChange: (o) => {
      l(null), a(o);
    }, onBlur: () => {
      if (!n) return l(null);
      const o = new URLSearchParams({ sku: n, entry: String(s ?? 0) });
      E(U(`commerce/api/sku-check?${o}`)).then((y) => l(y.available ? null : y.product ?? "another product")).catch(() => l(null));
    } }),
    r && /* @__PURE__ */ c("p", { className: "cm:text-xs cm:text-destructive", children: [
      "Already used by ",
      r,
      "."
    ] })
  ] });
}
const G = [
  ["cart", "Add to cart"],
  ["inquiry", "Inquiry form"],
  ["whatsapp", "Ask on WhatsApp"],
  ["external", "Links to other shops"],
  ["none", "No button"]
];
function ue({ value: t, update: n, updateVariant: a, config: s, purchaseDefault: r, entryId: l, path: i }) {
  const { Button: o } = j, y = [["simple", "Simple product"]];
  (s.features.variants || t.type === "variable") && y.push(["variable", "Variable product (sizes, colors…)"]), (s.features.bundles || t.type === "bundle") && y.push(["bundle", "Bundle of other products"]);
  const N = t.variants[0], h = t.external_links.some((d) => d.url) ? r?.with_links : r?.without_links, k = G.find(([d]) => d === h?.type)?.[1], _ = h?.source_name ? `${h.source} settings (${h.source_name})` : `${h?.source ?? "store"} settings`, u = k ? `Default · ${k}` : "Default · Inherit settings", v = t.purchase_mode === "default" ? k ? `Inherited from ${_}.` : "Uses the closest saved setting in brand, category, or store." : "This product overrides the inherited setting.", m = t.purchase_mode === "external" || t.purchase_mode === "default" && r?.with_links.type === "external";
  return /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ c(L, { cols: 2, children: [
      /* @__PURE__ */ e(f, { label: "Product type", htmlFor: `${i}-type`, children: /* @__PURE__ */ e(A, { id: `${i}-type`, value: t.type, options: y, onChange: (d) => n({ type: d }) }) }),
      /* @__PURE__ */ e(f, { label: "Storefront button", htmlFor: `${i}-mode`, hint: v, children: /* @__PURE__ */ e(A, { id: `${i}-mode`, value: t.purchase_mode, options: [["default", u], ...G], onChange: (d) => n({ purchase_mode: d }) }) })
    ] }),
    t.type !== "variable" && N && /* @__PURE__ */ e(I, { title: "Pricing and SKU", children: /* @__PURE__ */ c(L, { cols: 4, children: [
      /* @__PURE__ */ e(f, { label: "Price", htmlFor: `${i}-price`, children: /* @__PURE__ */ e(O, { id: `${i}-price`, value: N.price, nullable: !1, onChange: (d) => a(0, { price: d ?? 0 }) }) }),
      /* @__PURE__ */ e(f, { label: "Compare-at price", htmlFor: `${i}-compare`, hint: "Shown struck through when higher.", children: /* @__PURE__ */ e(O, { id: `${i}-compare`, value: N.compare_at_price, onChange: (d) => a(0, { compare_at_price: d }) }) }),
      /* @__PURE__ */ e(f, { label: "Cost", htmlFor: `${i}-cost`, hint: "For profit reports; never shown.", children: /* @__PURE__ */ e(O, { id: `${i}-cost`, value: N.cost, onChange: (d) => a(0, { cost: d }) }) }),
      /* @__PURE__ */ e(f, { label: "SKU", htmlFor: `${i}-sku`, children: /* @__PURE__ */ e(J, { id: `${i}-sku`, value: N.sku, entryId: l, onChange: (d) => a(0, { sku: d }) }) })
    ] }) }),
    (m || t.external_links.length > 0) && /* @__PURE__ */ e(
      I,
      {
        title: "Links to other shops",
        description: "Buttons such as 'Buy on Tokopedia'.",
        actions: t.external_links.length < 10 && /* @__PURE__ */ e(o, { type: "button", variant: "outline", size: "sm", onClick: () => n({ external_links: [...t.external_links, { preset: "tokopedia", label: null, url: null }] }), children: "Add link" }),
        children: t.external_links.map((d, b) => {
          const S = (p) => n({ external_links: t.external_links.map((x, g) => g === b ? { ...x, ...p } : x) });
          return /* @__PURE__ */ c("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[10rem_1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(f, { label: "Shop", htmlFor: `${i}-link-${b}-preset`, children: /* @__PURE__ */ e(
              A,
              {
                id: `${i}-link-${b}-preset`,
                value: d.preset ?? "",
                onChange: (p) => S({ preset: p || null }),
                options: [...Object.entries(s.link_presets), ["", "Other…"]]
              }
            ) }),
            /* @__PURE__ */ e(f, { label: "Button label", htmlFor: `${i}-link-${b}-label`, children: /* @__PURE__ */ e(M, { id: `${i}-link-${b}-label`, value: d.label, placeholder: d.preset ? `Buy on ${s.link_presets[d.preset]}` : "", onChange: (p) => S({ label: p }) }) }),
            /* @__PURE__ */ e(f, { label: "Link", htmlFor: `${i}-link-${b}-url`, children: /* @__PURE__ */ e(M, { id: `${i}-link-${b}-url`, value: d.url, placeholder: "https://", onChange: (p) => S({ url: p }) }) }),
            /* @__PURE__ */ e(o, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ external_links: t.external_links.filter((p, x) => x !== b) }), children: "Remove" })
          ] }, b);
        })
      }
    ),
    /* @__PURE__ */ e(I, { title: "Fulfillment", children: /* @__PURE__ */ c(L, { cols: 2, children: [
      (s.features.digital || t.downloadable) && /* @__PURE__ */ e(R, { id: `${i}-downloadable`, label: "Downloadable", checked: t.downloadable, onChange: (d) => n({ downloadable: d }), hint: "Deliver files or links after payment." }),
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
    /* @__PURE__ */ e(I, { title: "Catalog and tax", children: /* @__PURE__ */ c(L, { cols: 2, children: [
      s.features.taxes && /* @__PURE__ */ e(f, { label: "Tax class", htmlFor: `${i}-tax`, children: /* @__PURE__ */ e(
        A,
        {
          id: `${i}-tax`,
          value: t.tax_class ?? "",
          onChange: (d) => n({ tax_class: d || null }),
          options: [["", "Standard"], ...s.tax_classes.filter((d) => d !== "standard").map((d) => [d, d])]
        }
      ) }),
      /* @__PURE__ */ e(R, { id: `${i}-featured`, label: "Featured", checked: t.featured, onChange: (d) => n({ featured: d }), hint: "Shown first when sorting by featured." })
    ] }) })
  ] });
}
function Q({ variantKey: t, tab: n, sku: a }) {
  const s = n.live?.variants[t], r = n.live?.stock_adjustment?.reasons, [l, i] = w.useState(!1), { Button: o } = j;
  return !s || s.stock_quantity === null ? null : /* @__PURE__ */ c(f, { label: "In stock", children: [
    /* @__PURE__ */ c("div", { className: "cm:flex cm:min-h-10 cm:flex-wrap cm:items-center cm:gap-x-3 cm:gap-y-1", children: [
      /* @__PURE__ */ e("strong", { className: "cm:text-lg cm:tabular-nums", "aria-live": "polite", children: s.stock_quantity }),
      r && /* @__PURE__ */ e(o, { type: "button", size: "sm", variant: "outline", onClick: () => i(!0), children: "Adjust stock" })
    ] }),
    l && r && /* @__PURE__ */ e(
      he,
      {
        id: s.id,
        stock: s.stock_quantity,
        sku: a,
        reasons: r,
        onClose: () => i(!1),
        onAdjusted: (y) => n.updateLiveStock(t, s.id, y)
      },
      s.id
    )
  ] });
}
function he({ id: t, stock: n, sku: a, reasons: s, onClose: r, onAdjusted: l }) {
  const { Button: i, Dialog: o, DialogContent: y, DialogDescription: N, DialogFooter: C, DialogHeader: h, DialogTitle: k, Input: _ } = j, [u, v] = w.useState("add"), [m, d] = w.useState(""), [b, S] = w.useState(s[0]), [p, x] = w.useState(null), [g, $] = w.useState(""), [q, B] = w.useState(!1), T = w.useId();
  async function V(D) {
    if (D.preventDefault(), D.stopPropagation(), !(q || g || m === "")) {
      B(!0), $("");
      try {
        const Y = await E(U(`commerce/inventory/${t}/adjust`), {
          method: "POST",
          signal: AbortSignal.timeout(15e3),
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: u, quantity: Number(m), reason: b, note: p })
        });
        l(Y.stock_quantity), r();
      } catch {
        $("The adjustment could not be confirmed. Check the current stock in Inventory before retrying.");
      } finally {
        B(!1);
      }
    }
  }
  return /* @__PURE__ */ e(o, { open: !0, onOpenChange: (D) => {
    !D && !q && r();
  }, children: /* @__PURE__ */ c(y, { className: "cm:max-w-lg", children: [
    /* @__PURE__ */ c(h, { children: [
      /* @__PURE__ */ e(k, { children: "Adjust stock" }),
      /* @__PURE__ */ c(N, { children: [
        a ? `${a} · ` : "",
        "Current stock: ",
        n,
        ". This saves immediately and records a stock movement."
      ] })
    ] }),
    /* @__PURE__ */ c("form", { id: T, className: "cm:grid cm:gap-4", onSubmit: V, children: [
      /* @__PURE__ */ c("div", { className: "cm:grid cm:items-start cm:gap-3 cm:sm:grid-cols-2", children: [
        /* @__PURE__ */ e(f, { label: "Adjustment", htmlFor: `${T}-mode`, children: /* @__PURE__ */ e(
          A,
          {
            id: `${T}-mode`,
            value: u,
            onChange: (D) => {
              v(D), d("");
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
            onChange: (D) => d(D.target.value)
          }
        ) }),
        /* @__PURE__ */ e(f, { label: "Reason", htmlFor: `${T}-reason`, children: /* @__PURE__ */ e(
          A,
          {
            id: `${T}-reason`,
            value: b,
            onChange: S,
            options: s.map((D) => [D, D[0].toUpperCase() + D.slice(1)])
          }
        ) }),
        /* @__PURE__ */ e(f, { label: "Note (optional)", htmlFor: `${T}-note`, children: /* @__PURE__ */ e(_, { id: `${T}-note`, value: p ?? "", maxLength: 255, onChange: (D) => x(D.target.value || null) }) })
      ] }),
      g && /* @__PURE__ */ e("p", { role: "alert", className: "cm:text-sm cm:text-destructive", children: g })
    ] }),
    /* @__PURE__ */ c(C, { children: [
      /* @__PURE__ */ e(i, { type: "button", variant: "ghost", disabled: q, onClick: r, children: "Cancel" }),
      /* @__PURE__ */ e(i, { type: "submit", form: T, disabled: q || m === "" || !!g, children: q ? "Saving…" : "Save adjustment" })
    ] })
  ] }) });
}
function pe(t) {
  const { value: n, updateVariant: a, live: s, path: r } = t, l = n.variants[0];
  if (!l) return null;
  const i = s?.variants[l.id];
  return /* @__PURE__ */ c(I, { title: "Stock", children: [
    /* @__PURE__ */ e(
      R,
      {
        id: `${r}-track`,
        label: "Track stock",
        checked: l.track_stock,
        onChange: (o) => a(0, { track_stock: o }),
        hint: "Reduce stock when an order is placed and restore it when the order is cancelled."
      }
    ),
    l.track_stock ? /* @__PURE__ */ c(L, { cols: 3, children: [
      i?.track_stock && i.stock_quantity !== null ? /* @__PURE__ */ e(Q, { variantKey: l.id, tab: t, sku: l.sku }) : /* @__PURE__ */ e(f, { label: "Starting stock", htmlFor: `${r}-initial`, hint: "Set once, when the product is published.", children: /* @__PURE__ */ e(F, { id: `${r}-initial`, value: l.initial_stock, onChange: (o) => a(0, { initial_stock: o }) }) }),
      /* @__PURE__ */ e(f, { label: "When sold out", htmlFor: `${r}-backorders`, children: /* @__PURE__ */ e(
        A,
        {
          id: `${r}-backorders`,
          value: l.backorders,
          onChange: (o) => a(0, { backorders: o }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }),
      /* @__PURE__ */ e(f, { label: "Low stock at", htmlFor: `${r}-low`, hint: "Empty: the store's setting.", children: /* @__PURE__ */ e(F, { id: `${r}-low`, value: l.low_stock_threshold, onChange: (o) => a(0, { low_stock_threshold: o }) }) })
    ] }) : /* @__PURE__ */ e(f, { label: "Stock status", htmlFor: `${r}-status`, children: /* @__PURE__ */ e(
      A,
      {
        id: `${r}-status`,
        value: l.stock_status,
        onChange: (o) => a(0, { stock_status: o }),
        options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
      }
    ) })
  ] });
}
function ge({ value: t, update: n, path: a }) {
  const { Button: s } = j, r = (l, i) => n({ tiers: t.tiers.map((o, y) => y === l ? { ...o, ...i } : o) });
  return /* @__PURE__ */ c(
    I,
    {
      title: "Bulk prices",
      description: "Lower unit prices for larger quantities. The best matching tier applies.",
      actions: t.tiers.length < 20 && /* @__PURE__ */ e(
        s,
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
          /* @__PURE__ */ e(f, { label: "From (units)", htmlFor: `${a}-tier-${i}-min`, children: /* @__PURE__ */ e(F, { id: `${a}-tier-${i}-min`, min: 2, value: l.min_qty, onChange: (o) => r(i, { min_qty: o ?? 2 }) }) }),
          /* @__PURE__ */ e(f, { label: "Price", htmlFor: `${a}-tier-${i}-type`, children: /* @__PURE__ */ e(
            A,
            {
              id: `${a}-tier-${i}-type`,
              value: l.type,
              onChange: (o) => r(i, { type: o, value: 0 }),
              options: [["percent_off", "Percent off"], ["amount_off", "Amount off per unit"], ["fixed_price", "Fixed unit price"]]
            }
          ) }),
          /* @__PURE__ */ e(f, { label: l.type === "percent_off" ? "Percent" : "Amount", htmlFor: `${a}-tier-${i}-value`, children: l.type === "percent_off" ? /* @__PURE__ */ e(F, { id: `${a}-tier-${i}-value`, value: l.value / 100, onChange: (o) => r(i, { value: Math.round((o ?? 0) * 100) }) }) : /* @__PURE__ */ e(O, { id: `${a}-tier-${i}-value`, value: l.value, nullable: !1, onChange: (o) => r(i, { value: o ?? 0 }) }) }),
          /* @__PURE__ */ e(f, { label: "For", htmlFor: `${a}-tier-${i}-variant`, children: /* @__PURE__ */ e(
            A,
            {
              id: `${a}-tier-${i}-variant`,
              value: l.variant ?? "",
              onChange: (o) => r(i, { variant: o || null }),
              options: [["", "All variants"], ...t.type === "variable" ? t.variants.map((o) => [o.id, X(t.options, o)]) : []]
            }
          ) }),
          /* @__PURE__ */ e(s, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ tiers: t.tiers.filter((o, y) => y !== i) }), children: "Remove" })
        ] }, i))
      ]
    }
  );
}
function fe({ value: t, update: n, updateVariant: a, path: s }) {
  const r = t.variants[0];
  if (!r) return null;
  const l = (i) => t.type === "variable" ? n({ variants: t.variants.map((o) => ({ ...o, ...i })) }) : a(0, i);
  return /* @__PURE__ */ e(I, { title: "Package", description: t.type === "variable" ? "Applies to every variant; a variant can have its own weight under More." : "Used for shipping rates.", children: /* @__PURE__ */ c(L, { cols: 4, children: [
    /* @__PURE__ */ e(f, { label: "Weight (grams)", htmlFor: `${s}-weight`, children: /* @__PURE__ */ e(F, { id: `${s}-weight`, value: r.weight, onChange: (i) => l({ weight: i }) }) }),
    /* @__PURE__ */ e(f, { label: "Length (mm)", htmlFor: `${s}-length`, children: /* @__PURE__ */ e(F, { id: `${s}-length`, value: r.length, onChange: (i) => l({ length: i }) }) }),
    /* @__PURE__ */ e(f, { label: "Width (mm)", htmlFor: `${s}-width`, children: /* @__PURE__ */ e(F, { id: `${s}-width`, value: r.width, onChange: (i) => l({ width: i }) }) }),
    /* @__PURE__ */ e(f, { label: "Height (mm)", htmlFor: `${s}-height`, children: /* @__PURE__ */ e(F, { id: `${s}-height`, value: r.height, onChange: (i) => l({ height: i }) }) })
  ] }) });
}
const K = {
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
function be({ option: t, onChange: n, onRemove: a, config: s, path: r }) {
  const { Button: l, Input: i, Badge: o } = j, [y, N] = w.useState(""), C = () => {
    const u = y.split(",").map((v) => v.trim()).filter(Boolean).filter((v) => !t.values.some((m) => (m.label ?? "").toLowerCase() === v.toLowerCase()));
    u.length && n({ ...t, values: [...t.values, ...u.map((v) => ({ id: P(), label: v }))] }), N("");
  }, h = s.attribute_taxonomies.find((u) => u.handle === t.taxonomy)?.title.slice(0, 60), k = (u) => {
    const v = s.attribute_taxonomies.find((d) => d.handle === u)?.title.slice(0, 60), m = t.name.trim() === "" || t.name === h;
    n({ ...t, name: m ? v ?? "" : t.name, taxonomy: u || null, values: [] });
  }, _ = t.values.map((u) => u.term_id).filter((u) => !!u);
  return /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-3 cm:rounded-md cm:border cm:p-3", children: [
    /* @__PURE__ */ c("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_1fr_auto]", children: [
      s.attribute_taxonomies.length > 0 && /* @__PURE__ */ e(f, { label: "Values from", htmlFor: `${r}-source`, children: /* @__PURE__ */ e(
        A,
        {
          id: `${r}-source`,
          value: t.taxonomy ?? "",
          onChange: k,
          options: [["", "Custom values"], ...s.attribute_taxonomies.map((u) => [u.handle, u.title])]
        }
      ) }),
      /* @__PURE__ */ e(f, { label: "Option name", htmlFor: `${r}-name`, children: /* @__PURE__ */ e(
        i,
        {
          id: `${r}-name`,
          value: t.name,
          placeholder: h ?? "e.g. Size",
          onChange: (u) => n({ ...t, name: u.target.value })
        }
      ) }),
      /* @__PURE__ */ e(l, { type: "button", variant: "ghost", size: "sm", onClick: a, children: "Remove option" })
    ] }),
    t.taxonomy ? /* @__PURE__ */ e(
      ne,
      {
        fields: [{ handle: "terms", type: "terms", label: "Values", config: {
          multiple: !0,
          options: (s.attribute_taxonomies.find((u) => u.handle === t.taxonomy)?.terms ?? []).map((u) => ({ value: String(u.id), label: u.title }))
        } }],
        values: { terms: _ },
        pathPrefix: `${r}-terms`,
        onChange: (u) => {
          const v = u.terms ?? [], m = t.values.filter((b) => b.term_id && v.includes(b.term_id)), d = v.filter((b) => !m.some((S) => S.term_id === b)).map((b) => ({ id: P(), term_id: b }));
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
            value: y,
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
function ve({ variant: t, index: n, updateVariant: a, tab: s }) {
  const { MediaPickerInput: r } = j, l = `${s.path}-v${n}`, i = s.live?.variants[t.id];
  return /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-4 cm:bg-muted/40 cm:p-4", children: [
    /* @__PURE__ */ c(L, { cols: 4, children: [
      /* @__PURE__ */ e(f, { label: "Cost", htmlFor: `${l}-cost`, children: /* @__PURE__ */ e(O, { id: `${l}-cost`, value: t.cost, onChange: (o) => a(n, { cost: o }) }) }),
      /* @__PURE__ */ e(f, { label: "Barcode", htmlFor: `${l}-barcode`, children: /* @__PURE__ */ e(M, { id: `${l}-barcode`, value: t.barcode, onChange: (o) => a(n, { barcode: o }) }) }),
      /* @__PURE__ */ e(f, { label: "Weight (g)", htmlFor: `${l}-weight`, children: /* @__PURE__ */ e(F, { id: `${l}-weight`, value: t.weight, onChange: (o) => a(n, { weight: o }), placeholder: "Product's" }) }),
      /* @__PURE__ */ e(f, { label: "Min / max / step", htmlFor: `${l}-min`, children: /* @__PURE__ */ c("div", { className: "cm:grid cm:grid-cols-3 cm:gap-1", children: [
        /* @__PURE__ */ e(F, { id: `${l}-min`, min: 1, value: t.min_qty, onChange: (o) => a(n, { min_qty: o ?? 1 }) }),
        /* @__PURE__ */ e(F, { min: 1, value: t.max_qty, onChange: (o) => a(n, { max_qty: o }), placeholder: "–" }),
        /* @__PURE__ */ e(F, { min: 1, value: t.qty_step, onChange: (o) => a(n, { qty_step: o ?? 1 }) })
      ] }) })
    ] }),
    s.config.features.inventory && /* @__PURE__ */ c(L, { cols: 4, children: [
      /* @__PURE__ */ e(R, { id: `${l}-track`, label: "Track stock", checked: t.track_stock, onChange: (o) => a(n, { track_stock: o }) }),
      t.track_stock && (i?.track_stock && i.stock_quantity !== null ? /* @__PURE__ */ e(Q, { variantKey: t.id, tab: s, sku: t.sku }) : /* @__PURE__ */ e(f, { label: "Starting stock", htmlFor: `${l}-initial`, children: /* @__PURE__ */ e(F, { id: `${l}-initial`, value: t.initial_stock, onChange: (o) => a(n, { initial_stock: o }) }) })),
      t.track_stock ? /* @__PURE__ */ e(f, { label: "When sold out", htmlFor: `${l}-backorders`, children: /* @__PURE__ */ e(
        A,
        {
          id: `${l}-backorders`,
          value: t.backorders,
          onChange: (o) => a(n, { backorders: o }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }) : /* @__PURE__ */ e(f, { label: "Stock status", htmlFor: `${l}-status`, children: /* @__PURE__ */ e(
        A,
        {
          id: `${l}-status`,
          value: t.stock_status,
          onChange: (o) => a(n, { stock_status: o }),
          options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
        }
      ) })
    ] }),
    /* @__PURE__ */ e(f, { label: "Image", htmlFor: `${l}-image`, children: /* @__PURE__ */ e(r, { id: `${l}-image`, value: t.image, types: ["image"], onChange: (o) => a(n, { image: o }) }) })
  ] });
}
function ke(t) {
  const { value: n, update: a, updateVariant: s, config: r, entryId: l, live: i } = t, { Button: o, Table: y, TableBody: N, TableCell: C, TableHead: h, TableHeader: k, TableRow: _, Switch: u } = j, [v, m] = w.useState(null), d = Object.fromEntries(t.config.attribute_taxonomies.flatMap((p) => p.terms.map((x) => [x.id, x.title]))), b = n.variants[0] ?? { ...K, id: P() }, S = (p = n.options) => a({ options: p, variants: se(p, n.variants, { ...b, initial_stock: null, image: null }, r.max_variants) });
  return /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ e(
      I,
      {
        title: "Options",
        description: `Up to ${r.max_options} options, such as size and color. Variants are made for every combination.`,
        actions: n.options.length < r.max_options && /* @__PURE__ */ e(o, { type: "button", variant: "outline", size: "sm", onClick: () => a({ options: [...n.options, { id: P(), name: "", taxonomy: null, values: [] }] }), children: "Add option" }),
        children: n.options.map((p, x) => /* @__PURE__ */ e(
          be,
          {
            option: p,
            config: r,
            path: `${t.path}-o${x}`,
            onChange: (g) => S(n.options.map(($, q) => q === x ? g : $)),
            onRemove: () => S(n.options.filter((g, $) => $ !== x))
          },
          p.id
        ))
      }
    ),
    /* @__PURE__ */ c(
      I,
      {
        title: `Variants (${n.variants.length})`,
        description: "Each has its own SKU, price and stock. Switch one off to stop selling it without losing it.",
        actions: /* @__PURE__ */ e(o, { type: "button", variant: "outline", size: "sm", onClick: () => S(), children: "Regenerate" }),
        children: [
          n.options.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "Add an option with values to create variants." }) : /* @__PURE__ */ e("div", { className: "cm:overflow-x-auto cm:rounded-md cm:border", children: /* @__PURE__ */ c(y, { children: [
            /* @__PURE__ */ e(k, { children: /* @__PURE__ */ c(_, { children: [
              /* @__PURE__ */ e(h, { children: "Variant" }),
              /* @__PURE__ */ e(h, { children: "SKU" }),
              /* @__PURE__ */ e(h, { children: "Price" }),
              /* @__PURE__ */ e(h, { children: "Compare-at" }),
              r.features.inventory && /* @__PURE__ */ e(h, { children: "Stock" }),
              /* @__PURE__ */ e(h, { children: "On sale" }),
              /* @__PURE__ */ e(h, {})
            ] }) }),
            /* @__PURE__ */ e(N, { children: n.variants.map((p, x) => {
              const g = i?.variants[p.id];
              return /* @__PURE__ */ c(w.Fragment, { children: [
                /* @__PURE__ */ c(_, { className: p.active ? "" : "cm:opacity-60", children: [
                  /* @__PURE__ */ e(C, { className: "cm:font-medium cm:whitespace-nowrap", children: X(n.options, p, d) }),
                  /* @__PURE__ */ e(C, { className: "cm:min-w-36", children: /* @__PURE__ */ e(J, { value: p.sku, entryId: l, onChange: ($) => s(x, { sku: $ }) }) }),
                  /* @__PURE__ */ e(C, { className: "cm:min-w-32", children: /* @__PURE__ */ e(O, { value: p.price, nullable: !1, onChange: ($) => s(x, { price: $ ?? 0 }) }) }),
                  /* @__PURE__ */ e(C, { className: "cm:min-w-32", children: /* @__PURE__ */ e(O, { value: p.compare_at_price, onChange: ($) => s(x, { compare_at_price: $ }) }) }),
                  r.features.inventory && /* @__PURE__ */ e(C, { className: "cm:whitespace-nowrap cm:text-sm", children: p.track_stock ? g?.stock_quantity ?? p.initial_stock ?? 0 : /* @__PURE__ */ e(te, { children: p.stock_status.replace("_", " ") }) }),
                  /* @__PURE__ */ e(C, { children: /* @__PURE__ */ e(u, { checked: p.active, "aria-label": "Sell this variant", onCheckedChange: ($) => s(x, { active: $ }) }) }),
                  /* @__PURE__ */ e(C, { children: /* @__PURE__ */ e(o, { type: "button", variant: "ghost", size: "sm", "aria-expanded": v === p.id, onClick: () => m(v === p.id ? null : p.id), children: v === p.id ? "Close" : "More" }) })
                ] }),
                v === p.id && /* @__PURE__ */ e(_, { children: /* @__PURE__ */ e(C, { colSpan: 7, className: "cm:p-0", children: /* @__PURE__ */ e(ve, { variant: p, index: x, updateVariant: s, tab: t }) }) })
              ] }, p.id);
            }) })
          ] }) }),
          n.variants.length > 0 && /* @__PURE__ */ c("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
            "Prices from ",
            z(Math.min(...n.variants.map((p) => p.price))),
            " to ",
            z(Math.max(...n.variants.map((p) => p.price))),
            "."
          ] })
        ]
      }
    )
  ] });
}
function ye(t) {
  const n = t ?? {}, a = (n.variants?.length ? n.variants : [{ ...K, id: P() }]).map((s) => ({ ...K, ...s, id: s.id ?? P() }));
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
function $e({ field: t, value: n, onChange: a, errors: s, id: r = "data-product" }) {
  le();
  const l = t.config ?? {}, i = ye(n), { props: o } = ie.usePage(), y = o.entry?.id ?? null, [N, C] = w.useState(), [h, k] = w.useState(null);
  w.useEffect(() => {
    if (!y) return;
    const g = new AbortController();
    return E(U(`commerce/api/products/${y}`), { signal: g.signal }).then(($) => {
      g.signal.aborted || (k($.data), C($.purchase_default));
    }).catch(() => {
    }), () => g.abort();
  }, [y, o.entry]);
  const _ = (g) => {
    const $ = { ...i, ...g };
    $.downloadable && ($.requires_shipping = !1), g.type && g.type !== "variable" && ($.options = [], $.variants = [{ ...$.variants[0], options: {} }]), g.type === "bundle" && !$.bundle && ($.bundle = { pricing: "fixed", value: 0, items: [] }), a($);
  }, u = (g, $) => _({ variants: i.variants.map((q, B) => B === g ? { ...q, ...$ } : q) }), v = [{ key: "general", label: "General", render: (g) => /* @__PURE__ */ e(ue, { ...g }) }];
  i.type === "variable" && v.push({ key: "variants", label: "Variants", render: (g) => /* @__PURE__ */ e(ke, { ...g }) }), i.type === "bundle" && v.push({ key: "bundle", label: "Bundle", render: (g) => /* @__PURE__ */ e(ce, { ...g }) }), i.type !== "variable" && (l.features?.inventory ?? !0) && v.push({ key: "inventory", label: "Inventory", render: (g) => /* @__PURE__ */ e(pe, { ...g }) }), i.requires_shipping && v.push({ key: "shipping", label: "Shipping", render: (g) => /* @__PURE__ */ e(fe, { ...g }) }), (l.features?.pricing_rules !== !1 || i.tiers.length > 0) && v.push({ key: "pricing", label: "Bulk pricing", render: (g) => /* @__PURE__ */ e(ge, { ...g }) }), i.downloadable && v.push({ key: "digital", label: "Digital", render: (g) => /* @__PURE__ */ e(me, { ...g }) });
  for (const [g, $] of Object.entries(ae.productTabs()))
    v.push({ key: `ext-${g}`, label: $.label ?? g, render: (q) => /* @__PURE__ */ e($, { ...q }) });
  const [m, d] = w.useState("general"), b = v.find((g) => g.key === m) ?? v[0], S = s?.[""], p = (g, $, q) => {
    k((B) => {
      const T = B?.variants[g];
      return !B || !T || T.id !== $ ? B : { ...B, variants: { ...B.variants, [g]: { ...T, stock_quantity: q } } };
    });
  }, x = { value: i, update: _, updateVariant: u, config: l, live: h, purchaseDefault: N ?? l.purchase_default, updateLiveStock: p, entryId: y, path: r };
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
        id: `${r}-tab-${g.key}`,
        role: "tab",
        "aria-controls": `${r}-panel`,
        "aria-selected": g.key === b.key,
        onClick: () => d(g.key),
        className: W("cm:-mb-px cm:border-b-2 cm:px-3 cm:py-2 cm:text-sm", g.key === b.key ? "cm:border-primary cm:font-medium" : "cm:border-transparent cm:text-muted-foreground cm:hover:text-foreground"),
        children: g.label
      },
      g.key
    )) }),
    /* @__PURE__ */ e("div", { id: `${r}-panel`, role: "tabpanel", "aria-labelledby": `${r}-tab-${b.key}`, children: b.render(x) })
  ] });
}
export {
  $e as default
};
