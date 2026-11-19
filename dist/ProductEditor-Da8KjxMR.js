import { c as e, m as W, j as d, d as B, M as Z, R as w, h as E, b as M, g as z, t as ee, S as te, k as ne, u as le, i as ie, e as re } from "./main-BCUTrJ9y.js";
function j() {
  return (globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`).replace(/-/g, "").slice(0, 32);
}
function H(t) {
  return Object.keys(t).sort().map((n) => `${n}=${t[n]}`).join("|");
}
function ae(t) {
  let n = [{}];
  for (const r of t) {
    if (r.values.length === 0) return [];
    const s = [];
    for (const a of n)
      for (const l of r.values)
        s.push({ ...a, [r.id]: l.id });
    n = s;
  }
  return t.length === 0 ? [] : n;
}
function se(t, n, r, s = 100) {
  const a = new Map(n.map((l) => [H(l.options), l]));
  return ae(t).slice(0, s).map((l) => {
    const i = a.get(H(l));
    return i ? { ...i, options: l } : { ...r, id: j(), sku: null, options: l, active: !0, price: r.price ?? 0 };
  });
}
function X(t, n, r = {}) {
  return t.map((s) => {
    const a = s.values.find((l) => l.id === n.options[s.id]);
    return a ? a.label ?? (a.term_id ? r[a.term_id] ?? `#${a.term_id}` : "?") : "?";
  }).join(" / ");
}
function g({ label: t, hint: n, children: r, htmlFor: s, className: a }) {
  const { Label: l } = B;
  return /* @__PURE__ */ d("div", { className: W("cm:grid cm:content-start cm:gap-1.5", a), children: [
    /* @__PURE__ */ e(l, { htmlFor: s, children: t }),
    r,
    n && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: n })
  ] });
}
function L({ children: t, cols: n = 3 }) {
  return /* @__PURE__ */ e("div", { className: W("cm:grid cm:items-start cm:gap-4", { 2: "cm:sm:grid-cols-2", 3: "cm:sm:grid-cols-2 cm:lg:grid-cols-3", 4: "cm:sm:grid-cols-2 cm:lg:grid-cols-4" }[n]), children: t });
}
function S({ id: t, value: n, onChange: r, min: s = 0, placeholder: a }) {
  const { Input: l } = B;
  return /* @__PURE__ */ e(
    l,
    {
      id: t,
      type: "number",
      inputMode: "numeric",
      min: s,
      value: n ?? "",
      placeholder: a,
      onChange: (i) => r(i.target.value === "" ? null : Math.round(Number(i.target.value)))
    }
  );
}
function U({ id: t, value: n, onChange: r, placeholder: s, onBlur: a }) {
  const { Input: l } = B;
  return /* @__PURE__ */ e(
    l,
    {
      id: t,
      value: n ?? "",
      placeholder: s,
      onBlur: a,
      onChange: (i) => r(i.target.value === "" ? null : i.target.value)
    }
  );
}
function O({ id: t, value: n, onChange: r, nullable: s = !0 }) {
  return /* @__PURE__ */ e(Z, { id: t, value: n, allowNull: s, onChange: r });
}
function R({ id: t, label: n, checked: r, onChange: s, hint: a, disabled: l = !1 }) {
  const { Switch: i, Label: o } = B;
  return /* @__PURE__ */ d("div", { className: "cm:flex cm:items-start cm:gap-3", children: [
    /* @__PURE__ */ e(i, { id: t, disabled: l, checked: r, onCheckedChange: s }),
    /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-0.5", children: [
      /* @__PURE__ */ e(o, { htmlFor: t, children: n }),
      a && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: a })
    ] })
  ] });
}
const oe = "cm:h-10 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm";
function I({ id: t, value: n, onChange: r, options: s }) {
  return /* @__PURE__ */ e("select", { id: t, className: oe, value: n, onChange: (a) => r(a.target.value), children: s.map(([a, l]) => /* @__PURE__ */ e("option", { value: a, children: l }, a)) });
}
function A({ title: t, description: n, children: r, actions: s }) {
  return /* @__PURE__ */ d("section", { className: "cm:grid cm:gap-4", children: [
    /* @__PURE__ */ d("div", { className: "cm:flex cm:items-start cm:justify-between cm:gap-3", children: [
      /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-0.5", children: [
        /* @__PURE__ */ e("h3", { className: "cm:text-sm cm:font-semibold", children: t }),
        n && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: n })
      ] }),
      s
    ] }),
    r
  ] });
}
function ce({ value: t, update: n, path: r }) {
  const { Button: s, Input: a } = B, l = t.bundle ?? { pricing: "fixed", value: 0, items: [] }, [i, o] = w.useState({}), [k, N] = w.useState(""), [x, h] = w.useState([]), c = l.items.map((m) => m.variant_id).filter((m) => !!m);
  w.useEffect(() => {
    const m = c.filter((v) => !i[v]);
    m.length !== 0 && E(M(`commerce/api/variants?${m.map((v) => `ids[]=${v}`).join("&")}`)).then((v) => o((p) => ({ ...p, ...Object.fromEntries(v.data.map((_) => [_.id, _])) }))).catch(() => {
    });
  }, [c.join(",")]), w.useEffect(() => {
    if (k.trim().length < 2) return h([]);
    const m = setTimeout(() => E(M(`commerce/api/variants?q=${encodeURIComponent(k)}`)).then((v) => h(v.data)).catch(() => {
    }), 250);
    return () => clearTimeout(m);
  }, [k]);
  const b = (m) => n({ bundle: { ...l, ...m } }), $ = l.items.reduce((m, v) => m + (i[v.variant_id ?? 0]?.price ?? 0) * v.quantity, 0);
  return /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ d(A, { title: "Products in the bundle", description: "Bundles take their stock from these products.", children: [
      l.items.map((m, v) => /* @__PURE__ */ d("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ e("span", { className: "cm:flex-1 cm:text-sm", children: i[m.variant_id ?? 0]?.label ?? `#${m.variant_id}` }),
        /* @__PURE__ */ e("div", { className: "cm:w-24", children: /* @__PURE__ */ e(S, { min: 1, value: m.quantity, onChange: (p) => b({ items: l.items.map((_, F) => F === v ? { ..._, quantity: p ?? 1 } : _) }) }) }),
        /* @__PURE__ */ e(s, { type: "button", variant: "ghost", size: "sm", onClick: () => b({ items: l.items.filter((p, _) => _ !== v) }), children: "Remove" })
      ] }, v)),
      /* @__PURE__ */ d("div", { className: "cm:relative", children: [
        /* @__PURE__ */ e(a, { value: k, placeholder: "Search products or SKUs to add…", "aria-label": "Add a product to the bundle", onChange: (m) => N(m.target.value) }),
        x.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-10 cm:mt-1 cm:max-h-64 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: x.map((m) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ d(
          "button",
          {
            type: "button",
            className: "cm:flex cm:w-full cm:justify-between cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted",
            onClick: () => {
              o((v) => ({ ...v, [m.id]: m })), b({ items: [...l.items, { variant_id: m.id, quantity: 1 }] }), N("");
            },
            children: [
              /* @__PURE__ */ d("span", { children: [
                m.label,
                m.sku && /* @__PURE__ */ d("span", { className: "cm:text-muted-foreground", children: [
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
    /* @__PURE__ */ e(A, { title: "Bundle price", description: `The products cost ${z($)} together.`, children: /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(g, { label: "Price", htmlFor: `${r}-bundle-pricing`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${r}-bundle-pricing`,
          value: l.pricing,
          onChange: (m) => b({ pricing: m, value: 0 }),
          options: [["fixed", "Its own price (General tab)"], ["percent_off", "Total minus a percentage"], ["amount_off", "Total minus an amount"]]
        }
      ) }),
      l.pricing === "percent_off" && /* @__PURE__ */ e(g, { label: "Percent off", htmlFor: `${r}-bundle-value`, children: /* @__PURE__ */ e(S, { id: `${r}-bundle-value`, value: l.value / 100, onChange: (m) => b({ value: Math.round((m ?? 0) * 100) }) }) }),
      l.pricing === "amount_off" && /* @__PURE__ */ e(g, { label: "Amount off", htmlFor: `${r}-bundle-value`, children: /* @__PURE__ */ e(O, { id: `${r}-bundle-value`, value: l.value, nullable: !1, onChange: (m) => b({ value: m ?? 0 }) }) })
    ] }) })
  ] });
}
function de() {
  return decodeURIComponent(document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/)?.[1] ?? "");
}
function me({ value: t, update: n, path: r }) {
  const { Button: s } = B, [a, l] = w.useState(!1), i = w.useRef(null), o = t.delivery ?? { modes: ["link", "account"], download_limit: null, expiry_days: null }, k = (h) => n({ delivery: { ...o, ...h } }), N = (h, c) => n({ downloads: t.downloads.map((b, $) => $ === h ? { ...b, ...c } : b) }), x = async (h) => {
    if (h?.length) {
      l(!0);
      try {
        const c = [];
        for (const b of Array.from(h)) {
          const $ = new FormData();
          $.append("file", b);
          const m = await fetch(M("commerce/api/downloads"), { method: "POST", body: $, headers: { "X-XSRF-TOKEN": de(), Accept: "application/json" }, credentials: "same-origin" }), v = await m.json();
          if (!m.ok) throw new Error(v.message ?? "Upload failed");
          c.push({ id: j(), type: "file", file_id: v.data.id, url: null, name: b.name.replace(/\.[^.]+$/, ""), file: v.data });
        }
        n({ downloads: [...t.downloads, ...c] });
      } catch (c) {
        ee.error(c instanceof Error ? c.message : "Upload failed");
      } finally {
        l(!1), i.current && (i.current.value = "");
      }
    }
  };
  return /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ d(
      A,
      {
        title: "Files and links",
        description: "Files are stored privately and only served to customers who bought them.",
        actions: /* @__PURE__ */ d("div", { className: "cm:flex cm:gap-2", children: [
          /* @__PURE__ */ e(s, { type: "button", variant: "outline", size: "sm", disabled: a, onClick: () => i.current?.click(), children: a ? "Uploading…" : "Upload file" }),
          /* @__PURE__ */ e(s, { type: "button", variant: "outline", size: "sm", onClick: () => n({ downloads: [...t.downloads, { id: j(), type: "url", file_id: null, url: null, name: "" }] }), children: "Add link" }),
          /* @__PURE__ */ e("input", { ref: i, type: "file", multiple: !0, hidden: !0, onChange: (h) => x(h.target.files) })
        ] }),
        children: [
          t.downloads.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No files yet." }),
          t.downloads.map((h, c) => /* @__PURE__ */ d("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(g, { label: "Name", htmlFor: `${r}-dl-${c}`, children: /* @__PURE__ */ e(U, { id: `${r}-dl-${c}`, value: h.name, onChange: (b) => N(c, { name: b ?? "" }) }) }),
            h.type === "url" ? /* @__PURE__ */ e(g, { label: "Link", htmlFor: `${r}-dl-${c}-url`, children: /* @__PURE__ */ e(U, { id: `${r}-dl-${c}-url`, value: h.url, placeholder: "https://", onChange: (b) => N(c, { url: b }) }) }) : /* @__PURE__ */ e(g, { label: "File", children: /* @__PURE__ */ e("p", { className: "cm:truncate cm:text-sm cm:text-muted-foreground", children: h.file?.filename ?? `File #${h.file_id}` }) }),
            /* @__PURE__ */ e(s, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ downloads: t.downloads.filter((b, $) => $ !== c) }), children: "Remove" })
          ] }, h.id ?? c))
        ]
      }
    ),
    /* @__PURE__ */ d(A, { title: "Delivery", children: [
      /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-3", children: [["attachment", "Attach files to the email"], ["link", "Download links in the email"], ["account", "Library in My Account"]].map(([h, c]) => /* @__PURE__ */ e(
        R,
        {
          id: `${r}-mode-${h}`,
          label: c,
          checked: o.modes.includes(h),
          onChange: (b) => k({ modes: b ? [...o.modes, h] : o.modes.filter(($) => $ !== h) })
        },
        h
      )) }),
      /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
        /* @__PURE__ */ e(g, { label: "Downloads per file", htmlFor: `${r}-limit`, hint: "Empty: unlimited.", children: /* @__PURE__ */ e(S, { id: `${r}-limit`, min: 1, value: o.download_limit, onChange: (h) => k({ download_limit: h }) }) }),
        /* @__PURE__ */ e(g, { label: "Links expire after (days)", htmlFor: `${r}-expiry`, hint: "Empty: never.", children: /* @__PURE__ */ e(S, { id: `${r}-expiry`, min: 1, value: o.expiry_days, onChange: (h) => k({ expiry_days: h }) }) })
      ] })
    ] })
  ] });
}
function J({ id: t, value: n, onChange: r, entryId: s }) {
  const [a, l] = w.useState(null);
  return /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-1", children: [
    /* @__PURE__ */ e(U, { id: t, value: n, onChange: (o) => {
      l(null), r(o);
    }, onBlur: () => {
      if (!n) return l(null);
      const o = new URLSearchParams({ sku: n, entry: String(s ?? 0) });
      E(M(`commerce/api/sku-check?${o}`)).then((k) => l(k.available ? null : k.product ?? "another product")).catch(() => l(null));
    } }),
    a && /* @__PURE__ */ d("p", { className: "cm:text-xs cm:text-destructive", children: [
      "Already used by ",
      a,
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
function ue({ value: t, update: n, updateVariant: r, config: s, purchaseDefault: a, entryId: l, path: i }) {
  const { Button: o } = B, k = [["simple", "Simple product"]];
  (s.features.variants || t.type === "variable") && k.push(["variable", "Variable product (sizes, colors…)"]), (s.features.bundles || t.type === "bundle") && k.push(["bundle", "Bundle of other products"]);
  const N = t.variants[0], h = t.external_links.some((p) => p.url) ? a?.with_links : a?.without_links, c = G.find(([p]) => p === h?.type)?.[1], b = h?.source_name ? `${h.source} settings (${h.source_name})` : `${h?.source ?? "store"} settings`, $ = c ? `Default · ${c}` : "Default · Inherit settings", m = t.purchase_mode === "default" ? c ? `Inherited from ${b}.` : "Uses the closest saved setting in brand, category, or store." : "This product overrides the inherited setting.", v = t.purchase_mode === "external" || t.purchase_mode === "default" && a?.with_links.type === "external";
  return /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ d(L, { cols: 2, children: [
      /* @__PURE__ */ e(g, { label: "Product type", htmlFor: `${i}-type`, children: /* @__PURE__ */ e(I, { id: `${i}-type`, value: t.type, options: k, onChange: (p) => n({ type: p }) }) }),
      /* @__PURE__ */ e(g, { label: "Storefront button", htmlFor: `${i}-mode`, hint: m, children: /* @__PURE__ */ e(I, { id: `${i}-mode`, value: t.purchase_mode, options: [["default", $], ...G], onChange: (p) => n({ purchase_mode: p }) }) })
    ] }),
    t.type !== "variable" && N && /* @__PURE__ */ e(A, { title: "Pricing and SKU", children: /* @__PURE__ */ d(L, { cols: 4, children: [
      /* @__PURE__ */ e(g, { label: "Price", htmlFor: `${i}-price`, children: /* @__PURE__ */ e(O, { id: `${i}-price`, value: N.price, nullable: !1, onChange: (p) => r(0, { price: p ?? 0 }) }) }),
      /* @__PURE__ */ e(g, { label: "Compare-at price", htmlFor: `${i}-compare`, hint: "Shown struck through when higher.", children: /* @__PURE__ */ e(O, { id: `${i}-compare`, value: N.compare_at_price, onChange: (p) => r(0, { compare_at_price: p }) }) }),
      /* @__PURE__ */ e(g, { label: "Cost", htmlFor: `${i}-cost`, hint: "For profit reports; never shown.", children: /* @__PURE__ */ e(O, { id: `${i}-cost`, value: N.cost, onChange: (p) => r(0, { cost: p }) }) }),
      /* @__PURE__ */ e(g, { label: "SKU", htmlFor: `${i}-sku`, children: /* @__PURE__ */ e(J, { id: `${i}-sku`, value: N.sku, entryId: l, onChange: (p) => r(0, { sku: p }) }) })
    ] }) }),
    (v || t.external_links.length > 0) && /* @__PURE__ */ e(
      A,
      {
        title: "Links to other shops",
        description: "Buttons such as 'Buy on Tokopedia'.",
        actions: t.external_links.length < 10 && /* @__PURE__ */ e(o, { type: "button", variant: "outline", size: "sm", onClick: () => n({ external_links: [...t.external_links, { preset: "tokopedia", label: null, url: null }] }), children: "Add link" }),
        children: t.external_links.map((p, _) => {
          const F = (f) => n({ external_links: t.external_links.map((C, u) => u === _ ? { ...C, ...f } : C) });
          return /* @__PURE__ */ d("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[10rem_1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(g, { label: "Shop", htmlFor: `${i}-link-${_}-preset`, children: /* @__PURE__ */ e(
              I,
              {
                id: `${i}-link-${_}-preset`,
                value: p.preset ?? "",
                onChange: (f) => F({ preset: f || null }),
                options: [...Object.entries(s.link_presets), ["", "Other…"]]
              }
            ) }),
            /* @__PURE__ */ e(g, { label: "Button label", htmlFor: `${i}-link-${_}-label`, children: /* @__PURE__ */ e(U, { id: `${i}-link-${_}-label`, value: p.label, placeholder: p.preset ? `Buy on ${s.link_presets[p.preset]}` : "", onChange: (f) => F({ label: f }) }) }),
            /* @__PURE__ */ e(g, { label: "Link", htmlFor: `${i}-link-${_}-url`, children: /* @__PURE__ */ e(U, { id: `${i}-link-${_}-url`, value: p.url, placeholder: "https://", onChange: (f) => F({ url: f }) }) }),
            /* @__PURE__ */ e(o, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ external_links: t.external_links.filter((f, C) => C !== _) }), children: "Remove" })
          ] }, _);
        })
      }
    ),
    /* @__PURE__ */ e(A, { title: "Fulfillment", children: /* @__PURE__ */ d(L, { cols: 2, children: [
      (s.features.digital || t.downloadable) && /* @__PURE__ */ e(R, { id: `${i}-downloadable`, label: "Downloadable", checked: t.downloadable, onChange: (p) => n({ downloadable: p }), hint: "Deliver files or links after payment." }),
      /* @__PURE__ */ e(
        R,
        {
          id: `${i}-shipping`,
          label: "Needs shipping",
          checked: t.requires_shipping,
          disabled: t.downloadable,
          onChange: (p) => n({ requires_shipping: p }),
          hint: t.downloadable ? "Downloads are delivered digitally." : "Turn off for services or other items without delivery."
        }
      )
    ] }) }),
    /* @__PURE__ */ e(A, { title: "Catalog and tax", children: /* @__PURE__ */ d(L, { cols: 2, children: [
      s.features.taxes && /* @__PURE__ */ e(g, { label: "Tax class", htmlFor: `${i}-tax`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${i}-tax`,
          value: t.tax_class ?? "",
          onChange: (p) => n({ tax_class: p || null }),
          options: [["", "Standard"], ...s.tax_classes.filter((p) => p !== "standard").map((p) => [p, p])]
        }
      ) }),
      /* @__PURE__ */ e(R, { id: `${i}-featured`, label: "Featured", checked: t.featured, onChange: (p) => n({ featured: p }), hint: "Shown first when sorting by featured." })
    ] }) })
  ] });
}
function Q({ variantKey: t, tab: n, sku: r }) {
  const s = n.live?.variants[t], a = n.live?.stock_adjustment?.reasons, [l, i] = w.useState(!1), { Button: o } = B;
  return !s || s.stock_quantity === null ? null : /* @__PURE__ */ d(g, { label: "In stock", children: [
    /* @__PURE__ */ d("div", { className: "cm:flex cm:min-h-10 cm:flex-wrap cm:items-center cm:gap-x-3 cm:gap-y-1", children: [
      /* @__PURE__ */ e("strong", { className: "cm:text-lg cm:tabular-nums", "aria-live": "polite", children: s.stock_quantity }),
      a && /* @__PURE__ */ e(o, { type: "button", size: "sm", variant: "outline", onClick: () => i(!0), children: "Adjust stock" })
    ] }),
    l && a && /* @__PURE__ */ e(
      he,
      {
        id: s.id,
        stock: s.stock_quantity,
        sku: r,
        reasons: a,
        onClose: () => i(!1),
        onAdjusted: (k) => n.updateLiveStock(t, s.id, k)
      },
      s.id
    )
  ] });
}
function he({ id: t, stock: n, sku: r, reasons: s, onClose: a, onAdjusted: l }) {
  const { Button: i, Dialog: o, DialogContent: k, DialogDescription: N, DialogFooter: x, DialogHeader: h, DialogTitle: c, Input: b } = B, [$, m] = w.useState("add"), [v, p] = w.useState(""), [_, F] = w.useState(s[0]), [f, C] = w.useState(null), [u, y] = w.useState(""), [q, P] = w.useState(!1), T = w.useId();
  async function V(D) {
    if (D.preventDefault(), D.stopPropagation(), !(q || u || v === "")) {
      P(!0), y("");
      try {
        const Y = await E(M(`commerce/inventory/${t}/adjust`), {
          method: "POST",
          signal: AbortSignal.timeout(15e3),
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: $, quantity: Number(v), reason: _, note: f })
        });
        l(Y.stock_quantity), a();
      } catch {
        y("The adjustment could not be confirmed. Check the current stock in Inventory before retrying.");
      } finally {
        P(!1);
      }
    }
  }
  return /* @__PURE__ */ e(o, { open: !0, onOpenChange: (D) => {
    !D && !q && a();
  }, children: /* @__PURE__ */ d(k, { className: "cm:max-w-lg", children: [
    /* @__PURE__ */ d(h, { children: [
      /* @__PURE__ */ e(c, { children: "Adjust stock" }),
      /* @__PURE__ */ d(N, { children: [
        r ? `${r} · ` : "",
        "Current stock: ",
        n,
        ". This saves immediately and records a stock movement."
      ] })
    ] }),
    /* @__PURE__ */ d("form", { id: T, className: "cm:grid cm:gap-4", onSubmit: V, children: [
      /* @__PURE__ */ d("div", { className: "cm:grid cm:items-start cm:gap-3 cm:sm:grid-cols-2", children: [
        /* @__PURE__ */ e(g, { label: "Adjustment", htmlFor: `${T}-mode`, children: /* @__PURE__ */ e(
          I,
          {
            id: `${T}-mode`,
            value: $,
            onChange: (D) => {
              m(D), p("");
            },
            options: [["add", "Add or remove units"], ["set", "Set total stock"]]
          }
        ) }),
        /* @__PURE__ */ e(g, { label: $ === "set" ? "New stock total" : "Units (+/−)", htmlFor: `${T}-quantity`, children: /* @__PURE__ */ e(
          b,
          {
            id: `${T}-quantity`,
            type: "number",
            inputMode: "numeric",
            required: !0,
            min: $ === "set" ? 0 : -1e6,
            max: 1e6,
            step: 1,
            value: v,
            onChange: (D) => p(D.target.value)
          }
        ) }),
        /* @__PURE__ */ e(g, { label: "Reason", htmlFor: `${T}-reason`, children: /* @__PURE__ */ e(
          I,
          {
            id: `${T}-reason`,
            value: _,
            onChange: F,
            options: s.map((D) => [D, D[0].toUpperCase() + D.slice(1)])
          }
        ) }),
        /* @__PURE__ */ e(g, { label: "Note (optional)", htmlFor: `${T}-note`, children: /* @__PURE__ */ e(b, { id: `${T}-note`, value: f ?? "", maxLength: 255, onChange: (D) => C(D.target.value || null) }) })
      ] }),
      u && /* @__PURE__ */ e("p", { role: "alert", className: "cm:text-sm cm:text-destructive", children: u })
    ] }),
    /* @__PURE__ */ d(x, { children: [
      /* @__PURE__ */ e(i, { type: "button", variant: "ghost", disabled: q, onClick: a, children: "Cancel" }),
      /* @__PURE__ */ e(i, { type: "submit", form: T, disabled: q || v === "" || !!u, children: q ? "Saving…" : "Save adjustment" })
    ] })
  ] }) });
}
function pe(t) {
  const { value: n, updateVariant: r, live: s, path: a } = t, l = n.variants[0];
  if (!l) return null;
  const i = s?.variants[l.id];
  return /* @__PURE__ */ d(A, { title: "Stock", children: [
    /* @__PURE__ */ e(
      R,
      {
        id: `${a}-track`,
        label: "Track stock",
        checked: l.track_stock,
        onChange: (o) => r(0, { track_stock: o }),
        hint: "Reduce stock when an order is placed and restore it when the order is cancelled."
      }
    ),
    l.track_stock ? /* @__PURE__ */ d(L, { cols: 3, children: [
      i?.track_stock && i.stock_quantity !== null ? /* @__PURE__ */ e(Q, { variantKey: l.id, tab: t, sku: l.sku }) : /* @__PURE__ */ e(g, { label: "Starting stock", htmlFor: `${a}-initial`, hint: "Set once, when the product is published.", children: /* @__PURE__ */ e(S, { id: `${a}-initial`, value: l.initial_stock, onChange: (o) => r(0, { initial_stock: o }) }) }),
      /* @__PURE__ */ e(g, { label: "When sold out", htmlFor: `${a}-backorders`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${a}-backorders`,
          value: l.backorders,
          onChange: (o) => r(0, { backorders: o }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }),
      /* @__PURE__ */ e(g, { label: "Low stock at", htmlFor: `${a}-low`, hint: "Empty: the store's setting.", children: /* @__PURE__ */ e(S, { id: `${a}-low`, value: l.low_stock_threshold, onChange: (o) => r(0, { low_stock_threshold: o }) }) })
    ] }) : /* @__PURE__ */ e(g, { label: "Stock status", htmlFor: `${a}-status`, children: /* @__PURE__ */ e(
      I,
      {
        id: `${a}-status`,
        value: l.stock_status,
        onChange: (o) => r(0, { stock_status: o }),
        options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
      }
    ) })
  ] });
}
function ge({ value: t, update: n, path: r }) {
  const { Button: s } = B, a = (l, i) => n({ tiers: t.tiers.map((o, k) => k === l ? { ...o, ...i } : o) });
  return /* @__PURE__ */ d(
    A,
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
        t.tiers.map((l, i) => /* @__PURE__ */ d("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[8rem_12rem_1fr_1fr_auto]", children: [
          /* @__PURE__ */ e(g, { label: "From (units)", htmlFor: `${r}-tier-${i}-min`, children: /* @__PURE__ */ e(S, { id: `${r}-tier-${i}-min`, min: 2, value: l.min_qty, onChange: (o) => a(i, { min_qty: o ?? 2 }) }) }),
          /* @__PURE__ */ e(g, { label: "Price", htmlFor: `${r}-tier-${i}-type`, children: /* @__PURE__ */ e(
            I,
            {
              id: `${r}-tier-${i}-type`,
              value: l.type,
              onChange: (o) => a(i, { type: o, value: 0 }),
              options: [["percent_off", "Percent off"], ["amount_off", "Amount off per unit"], ["fixed_price", "Fixed unit price"]]
            }
          ) }),
          /* @__PURE__ */ e(g, { label: l.type === "percent_off" ? "Percent" : "Amount", htmlFor: `${r}-tier-${i}-value`, children: l.type === "percent_off" ? /* @__PURE__ */ e(S, { id: `${r}-tier-${i}-value`, value: l.value / 100, onChange: (o) => a(i, { value: Math.round((o ?? 0) * 100) }) }) : /* @__PURE__ */ e(O, { id: `${r}-tier-${i}-value`, value: l.value, nullable: !1, onChange: (o) => a(i, { value: o ?? 0 }) }) }),
          /* @__PURE__ */ e(g, { label: "For", htmlFor: `${r}-tier-${i}-variant`, children: /* @__PURE__ */ e(
            I,
            {
              id: `${r}-tier-${i}-variant`,
              value: l.variant ?? "",
              onChange: (o) => a(i, { variant: o || null }),
              options: [["", "All variants"], ...t.type === "variable" ? t.variants.map((o) => [o.id, X(t.options, o)]) : []]
            }
          ) }),
          /* @__PURE__ */ e(s, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ tiers: t.tiers.filter((o, k) => k !== i) }), children: "Remove" })
        ] }, i))
      ]
    }
  );
}
function fe({ value: t, update: n, updateVariant: r, path: s }) {
  const a = t.variants[0];
  if (!a) return null;
  const l = (i) => t.type === "variable" ? n({ variants: t.variants.map((o) => ({ ...o, ...i })) }) : r(0, i);
  return /* @__PURE__ */ e(A, { title: "Package", description: t.type === "variable" ? "Applies to every variant; a variant can have its own weight under More." : "Used for shipping rates.", children: /* @__PURE__ */ d(L, { cols: 4, children: [
    /* @__PURE__ */ e(g, { label: "Weight (grams)", htmlFor: `${s}-weight`, children: /* @__PURE__ */ e(S, { id: `${s}-weight`, value: a.weight, onChange: (i) => l({ weight: i }) }) }),
    /* @__PURE__ */ e(g, { label: "Length (mm)", htmlFor: `${s}-length`, children: /* @__PURE__ */ e(S, { id: `${s}-length`, value: a.length, onChange: (i) => l({ length: i }) }) }),
    /* @__PURE__ */ e(g, { label: "Width (mm)", htmlFor: `${s}-width`, children: /* @__PURE__ */ e(S, { id: `${s}-width`, value: a.width, onChange: (i) => l({ width: i }) }) }),
    /* @__PURE__ */ e(g, { label: "Height (mm)", htmlFor: `${s}-height`, children: /* @__PURE__ */ e(S, { id: `${s}-height`, value: a.height, onChange: (i) => l({ height: i }) }) })
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
function be({ option: t, onChange: n, onRemove: r, config: s, path: a }) {
  const { Button: l, Input: i, Badge: o } = B, [k, N] = w.useState(""), x = () => {
    const c = k.split(",").map((b) => b.trim()).filter(Boolean).filter((b) => !t.values.some(($) => ($.label ?? "").toLowerCase() === b.toLowerCase()));
    c.length && n({ ...t, values: [...t.values, ...c.map((b) => ({ id: j(), label: b }))] }), N("");
  }, h = t.values.map((c) => c.term_id).filter((c) => !!c);
  return /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-3 cm:rounded-md cm:border cm:p-3", children: [
    /* @__PURE__ */ d("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_1fr_auto]", children: [
      /* @__PURE__ */ e(g, { label: "Option name", htmlFor: `${a}-name`, children: /* @__PURE__ */ e(i, { id: `${a}-name`, value: t.name, placeholder: "Size", onChange: (c) => n({ ...t, name: c.target.value }) }) }),
      s.attribute_taxonomies.length > 0 ? /* @__PURE__ */ e(g, { label: "Values from", htmlFor: `${a}-source`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${a}-source`,
          value: t.taxonomy ?? "",
          onChange: (c) => n({ ...t, taxonomy: c || null, values: [] }),
          options: [["", "Custom values"], ...s.attribute_taxonomies.map((c) => [c.handle, c.title])]
        }
      ) }) : /* @__PURE__ */ e("div", {}),
      /* @__PURE__ */ e(l, { type: "button", variant: "ghost", size: "sm", onClick: r, children: "Remove option" })
    ] }),
    t.taxonomy ? /* @__PURE__ */ e(
      ne,
      {
        fields: [{ handle: "terms", type: "terms", label: "Values", config: {
          multiple: !0,
          options: (s.attribute_taxonomies.find((c) => c.handle === t.taxonomy)?.terms ?? []).map((c) => ({ value: String(c.id), label: c.title }))
        } }],
        values: { terms: h },
        pathPrefix: `${a}-terms`,
        onChange: (c) => {
          const b = c.terms ?? [], $ = t.values.filter((v) => v.term_id && b.includes(v.term_id)), m = b.filter((v) => !$.some((p) => p.term_id === v)).map((v) => ({ id: j(), term_id: v }));
          n({ ...t, values: [...$, ...m] });
        }
      }
    ) : /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-2", children: [
      /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: t.values.map((c) => /* @__PURE__ */ d(o, { variant: "secondary", className: "cm:gap-1", children: [
        c.label,
        /* @__PURE__ */ e("button", { type: "button", "aria-label": `Remove ${c.label}`, onClick: () => n({ ...t, values: t.values.filter((b) => b.id !== c.id) }), children: "×" })
      ] }, c.id)) }),
      /* @__PURE__ */ d("div", { className: "cm:flex cm:gap-2", children: [
        /* @__PURE__ */ e(
          i,
          {
            value: k,
            placeholder: "S, M, L",
            "aria-label": `Add values to ${t.name || "option"}`,
            onChange: (c) => N(c.target.value),
            onKeyDown: (c) => {
              c.key === "Enter" && (c.preventDefault(), x());
            }
          }
        ),
        /* @__PURE__ */ e(l, { type: "button", variant: "outline", onClick: x, children: "Add" })
      ] })
    ] })
  ] });
}
function ve({ variant: t, index: n, updateVariant: r, tab: s }) {
  const { MediaPickerInput: a } = B, l = `${s.path}-v${n}`, i = s.live?.variants[t.id];
  return /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-4 cm:bg-muted/40 cm:p-4", children: [
    /* @__PURE__ */ d(L, { cols: 4, children: [
      /* @__PURE__ */ e(g, { label: "Cost", htmlFor: `${l}-cost`, children: /* @__PURE__ */ e(O, { id: `${l}-cost`, value: t.cost, onChange: (o) => r(n, { cost: o }) }) }),
      /* @__PURE__ */ e(g, { label: "Barcode", htmlFor: `${l}-barcode`, children: /* @__PURE__ */ e(U, { id: `${l}-barcode`, value: t.barcode, onChange: (o) => r(n, { barcode: o }) }) }),
      /* @__PURE__ */ e(g, { label: "Weight (g)", htmlFor: `${l}-weight`, children: /* @__PURE__ */ e(S, { id: `${l}-weight`, value: t.weight, onChange: (o) => r(n, { weight: o }), placeholder: "Product's" }) }),
      /* @__PURE__ */ e(g, { label: "Min / max / step", htmlFor: `${l}-min`, children: /* @__PURE__ */ d("div", { className: "cm:grid cm:grid-cols-3 cm:gap-1", children: [
        /* @__PURE__ */ e(S, { id: `${l}-min`, min: 1, value: t.min_qty, onChange: (o) => r(n, { min_qty: o ?? 1 }) }),
        /* @__PURE__ */ e(S, { min: 1, value: t.max_qty, onChange: (o) => r(n, { max_qty: o }), placeholder: "–" }),
        /* @__PURE__ */ e(S, { min: 1, value: t.qty_step, onChange: (o) => r(n, { qty_step: o ?? 1 }) })
      ] }) })
    ] }),
    s.config.features.inventory && /* @__PURE__ */ d(L, { cols: 4, children: [
      /* @__PURE__ */ e(R, { id: `${l}-track`, label: "Track stock", checked: t.track_stock, onChange: (o) => r(n, { track_stock: o }) }),
      t.track_stock && (i?.track_stock && i.stock_quantity !== null ? /* @__PURE__ */ e(Q, { variantKey: t.id, tab: s, sku: t.sku }) : /* @__PURE__ */ e(g, { label: "Starting stock", htmlFor: `${l}-initial`, children: /* @__PURE__ */ e(S, { id: `${l}-initial`, value: t.initial_stock, onChange: (o) => r(n, { initial_stock: o }) }) })),
      t.track_stock ? /* @__PURE__ */ e(g, { label: "When sold out", htmlFor: `${l}-backorders`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${l}-backorders`,
          value: t.backorders,
          onChange: (o) => r(n, { backorders: o }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }) : /* @__PURE__ */ e(g, { label: "Stock status", htmlFor: `${l}-status`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${l}-status`,
          value: t.stock_status,
          onChange: (o) => r(n, { stock_status: o }),
          options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
        }
      ) })
    ] }),
    /* @__PURE__ */ e(g, { label: "Image", htmlFor: `${l}-image`, children: /* @__PURE__ */ e(a, { id: `${l}-image`, value: t.image, types: ["image"], onChange: (o) => r(n, { image: o }) }) })
  ] });
}
function ke(t) {
  const { value: n, update: r, updateVariant: s, config: a, entryId: l, live: i } = t, { Button: o, Table: k, TableBody: N, TableCell: x, TableHead: h, TableHeader: c, TableRow: b, Switch: $ } = B, [m, v] = w.useState(null), p = Object.fromEntries(t.config.attribute_taxonomies.flatMap((f) => f.terms.map((C) => [C.id, C.title]))), _ = n.variants[0] ?? { ...K, id: j() }, F = (f = n.options) => r({ options: f, variants: se(f, n.variants, { ..._, initial_stock: null, image: null }, a.max_variants) });
  return /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ e(
      A,
      {
        title: "Options",
        description: `Up to ${a.max_options} options, such as size and color. Variants are made for every combination.`,
        actions: n.options.length < a.max_options && /* @__PURE__ */ e(o, { type: "button", variant: "outline", size: "sm", onClick: () => r({ options: [...n.options, { id: j(), name: "", taxonomy: null, values: [] }] }), children: "Add option" }),
        children: n.options.map((f, C) => /* @__PURE__ */ e(
          be,
          {
            option: f,
            config: a,
            path: `${t.path}-o${C}`,
            onChange: (u) => F(n.options.map((y, q) => q === C ? u : y)),
            onRemove: () => F(n.options.filter((u, y) => y !== C))
          },
          f.id
        ))
      }
    ),
    /* @__PURE__ */ d(
      A,
      {
        title: `Variants (${n.variants.length})`,
        description: "Each has its own SKU, price and stock. Switch one off to stop selling it without losing it.",
        actions: /* @__PURE__ */ e(o, { type: "button", variant: "outline", size: "sm", onClick: () => F(), children: "Regenerate" }),
        children: [
          n.options.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "Add an option with values to create variants." }) : /* @__PURE__ */ e("div", { className: "cm:overflow-x-auto cm:rounded-md cm:border", children: /* @__PURE__ */ d(k, { children: [
            /* @__PURE__ */ e(c, { children: /* @__PURE__ */ d(b, { children: [
              /* @__PURE__ */ e(h, { children: "Variant" }),
              /* @__PURE__ */ e(h, { children: "SKU" }),
              /* @__PURE__ */ e(h, { children: "Price" }),
              /* @__PURE__ */ e(h, { children: "Compare-at" }),
              a.features.inventory && /* @__PURE__ */ e(h, { children: "Stock" }),
              /* @__PURE__ */ e(h, { children: "On sale" }),
              /* @__PURE__ */ e(h, {})
            ] }) }),
            /* @__PURE__ */ e(N, { children: n.variants.map((f, C) => {
              const u = i?.variants[f.id];
              return /* @__PURE__ */ d(w.Fragment, { children: [
                /* @__PURE__ */ d(b, { className: f.active ? "" : "cm:opacity-60", children: [
                  /* @__PURE__ */ e(x, { className: "cm:font-medium cm:whitespace-nowrap", children: X(n.options, f, p) }),
                  /* @__PURE__ */ e(x, { className: "cm:min-w-36", children: /* @__PURE__ */ e(J, { value: f.sku, entryId: l, onChange: (y) => s(C, { sku: y }) }) }),
                  /* @__PURE__ */ e(x, { className: "cm:min-w-32", children: /* @__PURE__ */ e(O, { value: f.price, nullable: !1, onChange: (y) => s(C, { price: y ?? 0 }) }) }),
                  /* @__PURE__ */ e(x, { className: "cm:min-w-32", children: /* @__PURE__ */ e(O, { value: f.compare_at_price, onChange: (y) => s(C, { compare_at_price: y }) }) }),
                  a.features.inventory && /* @__PURE__ */ e(x, { className: "cm:whitespace-nowrap cm:text-sm", children: f.track_stock ? u?.stock_quantity ?? f.initial_stock ?? 0 : /* @__PURE__ */ e(te, { children: f.stock_status.replace("_", " ") }) }),
                  /* @__PURE__ */ e(x, { children: /* @__PURE__ */ e($, { checked: f.active, "aria-label": "Sell this variant", onCheckedChange: (y) => s(C, { active: y }) }) }),
                  /* @__PURE__ */ e(x, { children: /* @__PURE__ */ e(o, { type: "button", variant: "ghost", size: "sm", "aria-expanded": m === f.id, onClick: () => v(m === f.id ? null : f.id), children: m === f.id ? "Close" : "More" }) })
                ] }),
                m === f.id && /* @__PURE__ */ e(b, { children: /* @__PURE__ */ e(x, { colSpan: 7, className: "cm:p-0", children: /* @__PURE__ */ e(ve, { variant: f, index: C, updateVariant: s, tab: t }) }) })
              ] }, f.id);
            }) })
          ] }) }),
          n.variants.length > 0 && /* @__PURE__ */ d("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
            "Prices from ",
            z(Math.min(...n.variants.map((f) => f.price))),
            " to ",
            z(Math.max(...n.variants.map((f) => f.price))),
            "."
          ] })
        ]
      }
    )
  ] });
}
function ye(t) {
  const n = t ?? {}, r = (n.variants?.length ? n.variants : [{ ...K, id: j() }]).map((s) => ({ ...K, ...s, id: s.id ?? j() }));
  return {
    type: n.type ?? "simple",
    purchase_mode: n.purchase_mode ?? "default",
    external_links: n.external_links ?? [],
    requires_shipping: !n.downloadable && (n.requires_shipping ?? !0),
    downloadable: n.downloadable ?? !1,
    featured: n.featured ?? !1,
    tax_class: n.tax_class ?? null,
    options: n.options ?? [],
    variants: r,
    bundle: n.bundle ?? null,
    downloads: n.downloads ?? [],
    delivery: n.delivery ?? null,
    tiers: n.tiers ?? []
  };
}
function $e({ field: t, value: n, onChange: r, errors: s, id: a = "data-product" }) {
  le();
  const l = t.config ?? {}, i = ye(n), { props: o } = ie.usePage(), k = o.entry?.id ?? null, [N, x] = w.useState(), [h, c] = w.useState(null);
  w.useEffect(() => {
    if (!k) return;
    const u = new AbortController();
    return E(M(`commerce/api/products/${k}`), { signal: u.signal }).then((y) => {
      u.signal.aborted || (c(y.data), x(y.purchase_default));
    }).catch(() => {
    }), () => u.abort();
  }, [k, o.entry]);
  const b = (u) => {
    const y = { ...i, ...u };
    y.downloadable && (y.requires_shipping = !1), u.type && u.type !== "variable" && (y.options = [], y.variants = [{ ...y.variants[0], options: {} }]), u.type === "bundle" && !y.bundle && (y.bundle = { pricing: "fixed", value: 0, items: [] }), r(y);
  }, $ = (u, y) => b({ variants: i.variants.map((q, P) => P === u ? { ...q, ...y } : q) }), m = [{ key: "general", label: "General", render: (u) => /* @__PURE__ */ e(ue, { ...u }) }];
  i.type === "variable" && m.push({ key: "variants", label: "Variants", render: (u) => /* @__PURE__ */ e(ke, { ...u }) }), i.type === "bundle" && m.push({ key: "bundle", label: "Bundle", render: (u) => /* @__PURE__ */ e(ce, { ...u }) }), i.type !== "variable" && (l.features?.inventory ?? !0) && m.push({ key: "inventory", label: "Inventory", render: (u) => /* @__PURE__ */ e(pe, { ...u }) }), i.requires_shipping && m.push({ key: "shipping", label: "Shipping", render: (u) => /* @__PURE__ */ e(fe, { ...u }) }), (l.features?.pricing_rules !== !1 || i.tiers.length > 0) && m.push({ key: "pricing", label: "Bulk pricing", render: (u) => /* @__PURE__ */ e(ge, { ...u }) }), i.downloadable && m.push({ key: "digital", label: "Digital", render: (u) => /* @__PURE__ */ e(me, { ...u }) });
  for (const [u, y] of Object.entries(re.productTabs()))
    m.push({ key: `ext-${u}`, label: y.label ?? u, render: (q) => /* @__PURE__ */ e(y, { ...q }) });
  const [v, p] = w.useState("general"), _ = m.find((u) => u.key === v) ?? m[0], F = s?.[""], f = (u, y, q) => {
    c((P) => {
      const T = P?.variants[u];
      return !P || !T || T.id !== y ? P : { ...P, variants: { ...P.variants, [u]: { ...T, stock_quantity: q } } };
    });
  }, C = { value: i, update: b, updateVariant: $, config: l, live: h, purchaseDefault: N ?? l.purchase_default, updateLiveStock: f, entryId: k, path: a };
  return /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-5", children: [
    h?.sync_status === "failed" && /* @__PURE__ */ d("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: [
      "The published version couldn't be applied to the store, so it can't be bought: ",
      h.sync_error,
      ". Fix it and publish again."
    ] }),
    F && /* @__PURE__ */ e("p", { role: "alert", className: "cm:text-sm cm:text-destructive", children: F }),
    /* @__PURE__ */ e("div", { role: "tablist", "aria-label": "Product data", className: "cm:flex cm:flex-wrap cm:gap-x-2 cm:border-b", children: m.map((u) => /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        id: `${a}-tab-${u.key}`,
        role: "tab",
        "aria-controls": `${a}-panel`,
        "aria-selected": u.key === _.key,
        onClick: () => p(u.key),
        className: W("cm:-mb-px cm:border-b-2 cm:px-3 cm:py-2 cm:text-sm", u.key === _.key ? "cm:border-primary cm:font-medium" : "cm:border-transparent cm:text-muted-foreground cm:hover:text-foreground"),
        children: u.label
      },
      u.key
    )) }),
    /* @__PURE__ */ e("div", { id: `${a}-panel`, role: "tabpanel", "aria-labelledby": `${a}-tab-${_.key}`, children: _.render(C) })
  ] });
}
export {
  $e as default
};
