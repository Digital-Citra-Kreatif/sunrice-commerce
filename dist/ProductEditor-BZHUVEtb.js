import { b as e, p as V, j as d, c as D, M as ae, R as x, H as X, I as Q, l as K, a as R, g as H, t as re, J as W, L as M, S as se, n as oe, d as ce, i as de, e as me } from "./main-Dwve2_KU.js";
function j() {
  return (globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`).replace(/-/g, "").slice(0, 32);
}
function Y(t) {
  return Object.keys(t).sort().map((n) => `${n}=${t[n]}`).join("|");
}
function ue(t) {
  let n = [{}];
  for (const a of t) {
    if (a.values.length === 0) return [];
    const r = [];
    for (const s of n)
      for (const i of a.values)
        r.push({ ...s, [a.id]: i.id });
    n = r;
  }
  return t.length === 0 ? [] : n;
}
function he(t, n, a, r = 100) {
  const s = new Map(n.map((i) => [Y(i.options), i]));
  return ue(t).slice(0, r).map((i) => {
    const l = s.get(Y(i));
    return l ? { ...l, options: i } : { ...a, id: j(), sku: null, options: i, active: !0, price: a.price ?? 0 };
  });
}
function ee(t, n, a = {}) {
  return t.map((r) => {
    const s = r.values.find((i) => i.id === n.options[r.id]);
    return s ? s.label ?? (s.term_id ? a[s.term_id] ?? `#${s.term_id}` : "?") : "?";
  }).join(" / ");
}
function f({ label: t, hint: n, children: a, htmlFor: r, className: s }) {
  const { Label: i } = D;
  return /* @__PURE__ */ d("div", { className: V("cm:grid cm:content-start cm:gap-1.5", s), children: [
    /* @__PURE__ */ e(i, { htmlFor: r, children: t }),
    a,
    n && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: n })
  ] });
}
function B({ children: t, cols: n = 3 }) {
  return /* @__PURE__ */ e("div", { className: V("cm:grid cm:items-start cm:gap-4", { 2: "cm:sm:grid-cols-2", 3: "cm:sm:grid-cols-2 cm:lg:grid-cols-3", 4: "cm:sm:grid-cols-2 cm:lg:grid-cols-4" }[n]), children: t });
}
function P({ id: t, value: n, onChange: a, min: r = 0, placeholder: s }) {
  const { Input: i } = D;
  return /* @__PURE__ */ e(
    i,
    {
      id: t,
      type: "number",
      inputMode: "numeric",
      min: r,
      value: n ?? "",
      placeholder: s,
      onChange: (l) => a(l.target.value === "" ? null : Math.round(Number(l.target.value)))
    }
  );
}
function z({ id: t, value: n, onChange: a, unit: r, placeholder: s }) {
  const { Input: i } = D, [l, o] = x.useState(() => X(n, r));
  return x.useEffect(() => {
    Q(l, r) !== n && o(X(n, r));
  }, [n, r]), /* @__PURE__ */ e(
    i,
    {
      id: t,
      type: "text",
      inputMode: "decimal",
      value: l,
      placeholder: s,
      onChange: (y) => {
        o(y.target.value), a(Q(y.target.value, r));
      }
    }
  );
}
function E({ id: t, value: n, onChange: a, placeholder: r, onBlur: s }) {
  const { Input: i } = D;
  return /* @__PURE__ */ e(
    i,
    {
      id: t,
      value: n ?? "",
      placeholder: r,
      onBlur: s,
      onChange: (l) => a(l.target.value === "" ? null : l.target.value)
    }
  );
}
function O({ id: t, value: n, onChange: a, nullable: r = !0, placeholder: s }) {
  return /* @__PURE__ */ e(ae, { id: t, value: n, allowNull: r, onChange: a, placeholder: s });
}
function L({ id: t, label: n, checked: a, onChange: r, hint: s, disabled: i = !1 }) {
  const { Switch: l, Label: o } = D;
  return /* @__PURE__ */ d("div", { className: "cm:flex cm:items-start cm:gap-3", children: [
    /* @__PURE__ */ e(l, { id: t, disabled: i, checked: a, onCheckedChange: r }),
    /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-0.5", children: [
      /* @__PURE__ */ e(o, { htmlFor: t, children: n }),
      s && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: s })
    ] })
  ] });
}
const pe = "cm:h-10 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm";
function I({ id: t, value: n, onChange: a, options: r }) {
  return /* @__PURE__ */ e("select", { id: t, className: pe, value: n, onChange: (s) => a(s.target.value), children: r.map(([s, i]) => /* @__PURE__ */ e("option", { value: s, children: i }, s)) });
}
function A({ title: t, description: n, children: a, actions: r }) {
  return /* @__PURE__ */ d("section", { className: "cm:grid cm:gap-4", children: [
    /* @__PURE__ */ d("div", { className: "cm:flex cm:items-start cm:justify-between cm:gap-3", children: [
      /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-0.5", children: [
        /* @__PURE__ */ e("h3", { className: "cm:text-sm cm:font-semibold", children: t }),
        n && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: n })
      ] }),
      r
    ] }),
    a
  ] });
}
function ge({ value: t, update: n, path: a }) {
  const { Button: r, Input: s } = D, i = t.bundle ?? { pricing: "fixed", value: 0, items: [] }, [l, o] = x.useState({}), [y, N] = x.useState(""), [C, h] = x.useState([]), k = i.items.map((m) => m.variant_id).filter((m) => !!m);
  x.useEffect(() => {
    const m = k.filter((b) => !(b in l));
    if (m.length === 0) return;
    const c = Object.fromEntries(m.map((b) => [b, null]));
    K(R(`commerce/api/variants?bundle_components=1&${m.map((b) => `ids[]=${b}`).join("&")}`)).then((b) => o((S) => ({ ...S, ...c, ...Object.fromEntries(b.data.map((g) => [g.id, g])) }))).catch(() => o((b) => ({ ...b, ...c })));
  }, [k.join(",")]), x.useEffect(() => {
    if (y.trim().length < 2) return h([]);
    const m = setTimeout(() => K(R(`commerce/api/variants?q=${encodeURIComponent(y)}`)).then((c) => h(c.data)).catch(() => {
    }), 250);
    return () => clearTimeout(m);
  }, [y]);
  const _ = (m) => n({ bundle: { ...i, ...m } }), u = i.items.reduce((m, c) => m + (l[c.variant_id ?? 0]?.price ?? 0) * c.quantity, 0), v = i.items.length > 0 && i.items.every((m) => l[m.variant_id ?? 0]?.available);
  return /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ d(A, { title: "Products in the bundle", description: "Bundles take their stock from these products.", children: [
      i.items.map((m, c) => {
        const b = m.variant_id ? l[m.variant_id] : null;
        return /* @__PURE__ */ d("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
          /* @__PURE__ */ d("div", { className: "cm:flex-1 cm:text-sm", children: [
            /* @__PURE__ */ e("span", { children: b?.label || (b === void 0 ? "Loading product…" : "Unavailable product") }),
            b?.available === !1 && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-destructive", children: "Replace this unavailable variant to sell the bundle." })
          ] }),
          /* @__PURE__ */ e("div", { className: "cm:w-24", children: /* @__PURE__ */ e(P, { min: 1, value: m.quantity, onChange: (S) => _({ items: i.items.map((g, w) => w === c ? { ...g, quantity: S ?? 1 } : g) }) }) }),
          /* @__PURE__ */ e(r, { type: "button", variant: "ghost", size: "sm", onClick: () => _({ items: i.items.filter((S, g) => g !== c) }), children: "Remove" })
        ] }, c);
      }),
      /* @__PURE__ */ d("div", { className: "cm:relative", children: [
        /* @__PURE__ */ e(s, { value: y, placeholder: "Search products or SKUs to add…", "aria-label": "Add a product to the bundle", onChange: (m) => N(m.target.value) }),
        C.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-10 cm:mt-1 cm:max-h-64 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: C.map((m) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ d(
          "button",
          {
            type: "button",
            className: "cm:flex cm:w-full cm:justify-between cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted",
            onClick: () => {
              o((c) => ({ ...c, [m.id]: m })), _({ items: [...i.items, { variant_id: m.id, quantity: 1 }] }), N("");
            },
            children: [
              /* @__PURE__ */ d("span", { children: [
                m.label,
                m.sku && /* @__PURE__ */ d("span", { className: "cm:text-muted-foreground", children: [
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
    /* @__PURE__ */ e(A, { title: "Bundle price", description: v ? `The products cost ${H(u)} together.` : "Add available products to see the combined price.", children: /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(f, { label: "Price", htmlFor: `${a}-bundle-pricing`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${a}-bundle-pricing`,
          value: i.pricing,
          onChange: (m) => _({ pricing: m, value: 0 }),
          options: [["fixed", "Its own price (General tab)"], ["percent_off", "Total minus a percentage"], ["amount_off", "Total minus an amount"]]
        }
      ) }),
      i.pricing === "percent_off" && /* @__PURE__ */ e(f, { label: "Percent off", htmlFor: `${a}-bundle-value`, children: /* @__PURE__ */ e(P, { id: `${a}-bundle-value`, value: i.value / 100, onChange: (m) => _({ value: Math.round((m ?? 0) * 100) }) }) }),
      i.pricing === "amount_off" && /* @__PURE__ */ e(f, { label: "Amount off", htmlFor: `${a}-bundle-value`, children: /* @__PURE__ */ e(O, { id: `${a}-bundle-value`, value: i.value, nullable: !1, onChange: (m) => _({ value: m ?? 0 }) }) })
    ] }) })
  ] });
}
function fe() {
  return decodeURIComponent(document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/)?.[1] ?? "");
}
function be({ value: t, update: n, path: a }) {
  const { Button: r } = D, [s, i] = x.useState(!1), l = x.useRef(null), o = t.delivery ?? { modes: ["link", "account"], download_limit: null, expiry_days: null }, y = (h) => n({ delivery: { ...o, ...h } }), N = (h, k) => n({ downloads: t.downloads.map((_, u) => u === h ? { ..._, ...k } : _) }), C = async (h) => {
    if (h?.length) {
      i(!0);
      try {
        const k = [];
        for (const _ of Array.from(h)) {
          const u = new FormData();
          u.append("file", _);
          const v = await fetch(R("commerce/api/downloads"), { method: "POST", body: u, headers: { "X-XSRF-TOKEN": fe(), Accept: "application/json" }, credentials: "same-origin" }), m = await v.json();
          if (!v.ok) throw new Error(m.message ?? "Upload failed");
          k.push({ id: j(), type: "file", file_id: m.data.id, url: null, name: _.name.replace(/\.[^.]+$/, ""), file: m.data });
        }
        n({ downloads: [...t.downloads, ...k] });
      } catch (k) {
        re.error(k instanceof Error ? k.message : "Upload failed");
      } finally {
        i(!1), l.current && (l.current.value = "");
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
          /* @__PURE__ */ e(r, { type: "button", variant: "outline", size: "sm", disabled: s, onClick: () => l.current?.click(), children: s ? "Uploading…" : "Upload file" }),
          /* @__PURE__ */ e(r, { type: "button", variant: "outline", size: "sm", onClick: () => n({ downloads: [...t.downloads, { id: j(), type: "url", file_id: null, url: null, name: "" }] }), children: "Add link" }),
          /* @__PURE__ */ e("input", { ref: l, type: "file", multiple: !0, hidden: !0, onChange: (h) => C(h.target.files) })
        ] }),
        children: [
          t.downloads.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No files yet." }),
          t.downloads.map((h, k) => /* @__PURE__ */ d("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(f, { label: "Name", htmlFor: `${a}-dl-${k}`, children: /* @__PURE__ */ e(E, { id: `${a}-dl-${k}`, value: h.name, onChange: (_) => N(k, { name: _ ?? "" }) }) }),
            h.type === "url" ? /* @__PURE__ */ e(f, { label: "Link", htmlFor: `${a}-dl-${k}-url`, children: /* @__PURE__ */ e(E, { id: `${a}-dl-${k}-url`, value: h.url, placeholder: "https://", onChange: (_) => N(k, { url: _ }) }) }) : /* @__PURE__ */ e(f, { label: "File", children: /* @__PURE__ */ e("p", { className: "cm:truncate cm:text-sm cm:text-muted-foreground", children: h.file?.filename ?? `File #${h.file_id}` }) }),
            /* @__PURE__ */ e(r, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ downloads: t.downloads.filter((_, u) => u !== k) }), children: "Remove" })
          ] }, h.id ?? k))
        ]
      }
    ),
    /* @__PURE__ */ d(A, { title: "Delivery", children: [
      /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-3", children: [["attachment", "Attach files to the email"], ["link", "Download links in the email"], ["account", "Library in My Account"]].map(([h, k]) => /* @__PURE__ */ e(
        L,
        {
          id: `${a}-mode-${h}`,
          label: k,
          checked: o.modes.includes(h),
          onChange: (_) => y({ modes: _ ? [...o.modes, h] : o.modes.filter((u) => u !== h) })
        },
        h
      )) }),
      /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
        /* @__PURE__ */ e(f, { label: "Downloads per file", htmlFor: `${a}-limit`, hint: "Empty: unlimited.", children: /* @__PURE__ */ e(P, { id: `${a}-limit`, min: 1, value: o.download_limit, onChange: (h) => y({ download_limit: h }) }) }),
        /* @__PURE__ */ e(f, { label: "Links expire after (days)", htmlFor: `${a}-expiry`, hint: "Empty: never.", children: /* @__PURE__ */ e(P, { id: `${a}-expiry`, min: 1, value: o.expiry_days, onChange: (h) => y({ expiry_days: h }) }) })
      ] })
    ] })
  ] });
}
function te({ id: t, value: n, onChange: a, entryId: r }) {
  const [s, i] = x.useState(null);
  return /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-1", children: [
    /* @__PURE__ */ e(E, { id: t, value: n, onChange: (o) => {
      i(null), a(o);
    }, onBlur: () => {
      if (!n) return i(null);
      const o = new URLSearchParams({ sku: n, entry: String(r ?? 0) });
      K(R(`commerce/api/sku-check?${o}`)).then((y) => i(y.available ? null : y.product ?? "another product")).catch(() => i(null));
    } }),
    s && /* @__PURE__ */ d("p", { className: "cm:text-xs cm:text-destructive", children: [
      "Already used by ",
      s,
      "."
    ] })
  ] });
}
const Z = [
  ["cart", "Add to cart"],
  ["inquiry", "Inquiry form"],
  ["whatsapp", "Ask on WhatsApp"],
  ["external", "Links to other shops"],
  ["none", "No button"]
];
function ve({ value: t, update: n, updateVariant: a, config: r, purchaseDefault: s, entryId: i, path: l }) {
  const { Button: o } = D, y = [["simple", "Simple product"]];
  (r.features.variants || t.type === "variable") && y.push(["variable", "Variable product (sizes, colors…)"]), (r.features.bundles || t.type === "bundle") && y.push(["bundle", "Bundle of other products"]);
  const N = t.variants[0], h = t.external_links.some((c) => c.url) ? s?.with_links : s?.without_links, k = Z.find(([c]) => c === h?.type)?.[1], _ = h?.source_name ? `${h.source} settings (${h.source_name})` : `${h?.source ?? "store"} settings`, u = k ? `Default · ${k}` : "Default · Inherit settings", v = t.purchase_mode === "default" ? k ? `Inherited from ${_}.` : "Uses the closest saved setting in brand, category, or store." : "This product overrides the inherited setting.", m = t.purchase_mode === "external" || t.purchase_mode === "default" && s?.with_links.type === "external";
  return /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ d(B, { cols: 2, children: [
      /* @__PURE__ */ e(f, { label: "Product type", htmlFor: `${l}-type`, children: /* @__PURE__ */ e(I, { id: `${l}-type`, value: t.type, options: y, onChange: (c) => n({ type: c }) }) }),
      /* @__PURE__ */ e(f, { label: "Storefront button", htmlFor: `${l}-mode`, hint: v, children: /* @__PURE__ */ e(I, { id: `${l}-mode`, value: t.purchase_mode, options: [["default", u], ...Z], onChange: (c) => n({ purchase_mode: c }) }) })
    ] }),
    t.type !== "variable" && N && /* @__PURE__ */ e(A, { title: "Pricing and SKU", children: /* @__PURE__ */ d(B, { cols: 4, children: [
      /* @__PURE__ */ e(f, { label: "Price", htmlFor: `${l}-price`, hint: "Empty: price on request. Customers ask for a quote and you price it.", children: /* @__PURE__ */ e(O, { id: `${l}-price`, value: N.price, placeholder: "On request", onChange: (c) => a(0, { price: c }) }) }),
      /* @__PURE__ */ e(f, { label: "Compare-at price", htmlFor: `${l}-compare`, hint: "Shown struck through when higher.", children: /* @__PURE__ */ e(O, { id: `${l}-compare`, value: N.compare_at_price, onChange: (c) => a(0, { compare_at_price: c }) }) }),
      /* @__PURE__ */ e(f, { label: "Cost", htmlFor: `${l}-cost`, hint: "For profit reports; never shown.", children: /* @__PURE__ */ e(O, { id: `${l}-cost`, value: N.cost, onChange: (c) => a(0, { cost: c }) }) }),
      /* @__PURE__ */ e(f, { label: "SKU", htmlFor: `${l}-sku`, children: /* @__PURE__ */ e(te, { id: `${l}-sku`, value: N.sku, entryId: i, onChange: (c) => a(0, { sku: c }) }) })
    ] }) }),
    (m || t.external_links.length > 0) && /* @__PURE__ */ e(
      A,
      {
        title: "Links to other shops",
        description: "Buttons such as 'Buy on Tokopedia'.",
        actions: t.external_links.length < 10 && /* @__PURE__ */ e(o, { type: "button", variant: "outline", size: "sm", onClick: () => n({ external_links: [...t.external_links, { preset: "tokopedia", label: null, url: null }] }), children: "Add link" }),
        children: t.external_links.map((c, b) => {
          const S = (g) => n({ external_links: t.external_links.map((w, p) => p === b ? { ...w, ...g } : w) });
          return /* @__PURE__ */ d("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[10rem_1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(f, { label: "Shop", htmlFor: `${l}-link-${b}-preset`, children: /* @__PURE__ */ e(
              I,
              {
                id: `${l}-link-${b}-preset`,
                value: c.preset ?? "",
                onChange: (g) => S({ preset: g || null }),
                options: [...Object.entries(r.link_presets), ["", "Other…"]]
              }
            ) }),
            /* @__PURE__ */ e(f, { label: "Button label", htmlFor: `${l}-link-${b}-label`, children: /* @__PURE__ */ e(E, { id: `${l}-link-${b}-label`, value: c.label, placeholder: c.preset ? `Buy on ${r.link_presets[c.preset]}` : "", onChange: (g) => S({ label: g }) }) }),
            /* @__PURE__ */ e(f, { label: "Link", htmlFor: `${l}-link-${b}-url`, children: /* @__PURE__ */ e(E, { id: `${l}-link-${b}-url`, value: c.url, placeholder: "https://", onChange: (g) => S({ url: g }) }) }),
            /* @__PURE__ */ e(o, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ external_links: t.external_links.filter((g, w) => w !== b) }), children: "Remove" })
          ] }, b);
        })
      }
    ),
    /* @__PURE__ */ e(A, { title: "Fulfillment", children: /* @__PURE__ */ d(B, { cols: 2, children: [
      (r.features.digital || t.downloadable) && /* @__PURE__ */ e(L, { id: `${l}-downloadable`, label: "Downloadable", checked: t.downloadable, onChange: (c) => n({ downloadable: c }), hint: "Deliver files or links after payment." }),
      (r.features.loyalty || t.gift_card) && /* @__PURE__ */ e(
        L,
        {
          id: `${l}-gift-card`,
          label: "Gift card",
          checked: t.gift_card,
          onChange: (c) => n({ gift_card: c }),
          hint: "Paying for it emails a code per unit, worth its price. Customers redeem it for loyalty points in My Account."
        }
      ),
      /* @__PURE__ */ e(
        L,
        {
          id: `${l}-shipping`,
          label: "Needs shipping",
          checked: t.requires_shipping,
          disabled: t.downloadable || t.gift_card,
          onChange: (c) => n({ requires_shipping: c }),
          hint: t.downloadable ? "Downloads are delivered digitally." : t.gift_card ? "Gift cards are sent by email." : "Turn off for services or other items without delivery."
        }
      )
    ] }) }),
    /* @__PURE__ */ e(A, { title: "Catalog and tax", children: /* @__PURE__ */ d(B, { cols: 2, children: [
      r.features.taxes && /* @__PURE__ */ e(f, { label: "Tax class", htmlFor: `${l}-tax`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${l}-tax`,
          value: t.tax_class ?? "",
          onChange: (c) => n({ tax_class: c || null }),
          options: [["", "Standard"], ...r.tax_classes.filter((c) => c !== "standard").map((c) => [c, c])]
        }
      ) }),
      /* @__PURE__ */ e(L, { id: `${l}-featured`, label: "Featured", checked: t.featured, onChange: (c) => n({ featured: c }), hint: "Shown first when sorting by featured." })
    ] }) })
  ] });
}
function ne({ variantKey: t, tab: n, sku: a }) {
  const r = n.live?.variants[t], s = n.live?.stock_adjustment?.reasons, [i, l] = x.useState(!1), { Button: o } = D;
  return !r || r.stock_quantity === null ? null : /* @__PURE__ */ d(f, { label: "In stock", children: [
    /* @__PURE__ */ d("div", { className: "cm:flex cm:min-h-10 cm:flex-wrap cm:items-center cm:gap-x-3 cm:gap-y-1", children: [
      /* @__PURE__ */ e("strong", { className: "cm:text-lg cm:tabular-nums", "aria-live": "polite", children: r.stock_quantity }),
      s && /* @__PURE__ */ e(o, { type: "button", size: "sm", variant: "outline", onClick: () => l(!0), children: "Adjust stock" })
    ] }),
    i && s && /* @__PURE__ */ e(
      ye,
      {
        id: r.id,
        stock: r.stock_quantity,
        sku: a,
        reasons: s,
        onClose: () => l(!1),
        onAdjusted: (y) => n.updateLiveStock(t, r.id, y)
      },
      r.id
    )
  ] });
}
function ye({ id: t, stock: n, sku: a, reasons: r, onClose: s, onAdjusted: i }) {
  const { Button: l, Dialog: o, DialogContent: y, DialogDescription: N, DialogFooter: C, DialogHeader: h, DialogTitle: k, Input: _ } = D, [u, v] = x.useState("add"), [m, c] = x.useState(""), [b, S] = x.useState(r[0]), [g, w] = x.useState(null), [p, $] = x.useState(""), [F, U] = x.useState(!1), q = x.useId();
  async function le(T) {
    if (T.preventDefault(), T.stopPropagation(), !(F || p || m === "")) {
      U(!0), $("");
      try {
        const ie = await K(R(`commerce/inventory/${t}/adjust`), {
          method: "POST",
          signal: AbortSignal.timeout(15e3),
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: u, quantity: Number(m), reason: b, note: g })
        });
        i(ie.stock_quantity), s();
      } catch {
        $("The adjustment could not be confirmed. Check the current stock in Inventory before retrying.");
      } finally {
        U(!1);
      }
    }
  }
  return /* @__PURE__ */ e(o, { open: !0, onOpenChange: (T) => {
    !T && !F && s();
  }, children: /* @__PURE__ */ d(y, { className: "cm:max-w-lg", children: [
    /* @__PURE__ */ d(h, { children: [
      /* @__PURE__ */ e(k, { children: "Adjust stock" }),
      /* @__PURE__ */ d(N, { children: [
        a ? `${a} · ` : "",
        "Current stock: ",
        n,
        ". This saves immediately and records a stock movement."
      ] })
    ] }),
    /* @__PURE__ */ d("form", { id: q, className: "cm:grid cm:gap-4", onSubmit: le, children: [
      /* @__PURE__ */ d("div", { className: "cm:grid cm:items-start cm:gap-3 cm:sm:grid-cols-2", children: [
        /* @__PURE__ */ e(f, { label: "Adjustment", htmlFor: `${q}-mode`, children: /* @__PURE__ */ e(
          I,
          {
            id: `${q}-mode`,
            value: u,
            onChange: (T) => {
              v(T), c("");
            },
            options: [["add", "Add or remove units"], ["set", "Set total stock"]]
          }
        ) }),
        /* @__PURE__ */ e(f, { label: u === "set" ? "New stock total" : "Units (+/−)", htmlFor: `${q}-quantity`, children: /* @__PURE__ */ e(
          _,
          {
            id: `${q}-quantity`,
            type: "number",
            inputMode: "numeric",
            required: !0,
            min: u === "set" ? 0 : -1e6,
            max: 1e6,
            step: 1,
            value: m,
            onChange: (T) => c(T.target.value)
          }
        ) }),
        /* @__PURE__ */ e(f, { label: "Reason", htmlFor: `${q}-reason`, children: /* @__PURE__ */ e(
          I,
          {
            id: `${q}-reason`,
            value: b,
            onChange: S,
            options: r.map((T) => [T, T[0].toUpperCase() + T.slice(1)])
          }
        ) }),
        /* @__PURE__ */ e(f, { label: "Note (optional)", htmlFor: `${q}-note`, children: /* @__PURE__ */ e(_, { id: `${q}-note`, value: g ?? "", maxLength: 255, onChange: (T) => w(T.target.value || null) }) })
      ] }),
      p && /* @__PURE__ */ e("p", { role: "alert", className: "cm:text-sm cm:text-destructive", children: p })
    ] }),
    /* @__PURE__ */ d(C, { children: [
      /* @__PURE__ */ e(l, { type: "button", variant: "ghost", disabled: F, onClick: s, children: "Cancel" }),
      /* @__PURE__ */ e(l, { type: "submit", form: q, disabled: F || m === "" || !!p, children: F ? "Saving…" : "Save adjustment" })
    ] })
  ] }) });
}
function ke(t) {
  const { value: n, updateVariant: a, live: r, path: s } = t, i = n.variants[0];
  if (!i) return null;
  const l = r?.variants[i.id];
  return /* @__PURE__ */ d(A, { title: "Stock", children: [
    /* @__PURE__ */ e(
      L,
      {
        id: `${s}-track`,
        label: "Track stock",
        checked: i.track_stock,
        onChange: (o) => a(0, { track_stock: o }),
        hint: "Reduce stock when an order is placed and restore it when the order is cancelled."
      }
    ),
    i.track_stock ? /* @__PURE__ */ d(B, { cols: 3, children: [
      l?.track_stock && l.stock_quantity !== null ? /* @__PURE__ */ e(ne, { variantKey: i.id, tab: t, sku: i.sku }) : /* @__PURE__ */ e(f, { label: "Starting stock", htmlFor: `${s}-initial`, hint: "Set once, when the product is published.", children: /* @__PURE__ */ e(P, { id: `${s}-initial`, value: i.initial_stock, onChange: (o) => a(0, { initial_stock: o }) }) }),
      /* @__PURE__ */ e(f, { label: "When sold out", htmlFor: `${s}-backorders`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${s}-backorders`,
          value: i.backorders,
          onChange: (o) => a(0, { backorders: o }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }),
      /* @__PURE__ */ e(f, { label: "Low stock at", htmlFor: `${s}-low`, hint: "Empty: the store's setting.", children: /* @__PURE__ */ e(P, { id: `${s}-low`, value: i.low_stock_threshold, onChange: (o) => a(0, { low_stock_threshold: o }) }) })
    ] }) : /* @__PURE__ */ e(f, { label: "Stock status", htmlFor: `${s}-status`, children: /* @__PURE__ */ e(
      I,
      {
        id: `${s}-status`,
        value: i.stock_status,
        onChange: (o) => a(0, { stock_status: o }),
        options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
      }
    ) })
  ] });
}
function _e({ value: t, update: n, path: a }) {
  const { Button: r } = D, s = (i, l) => n({ tiers: t.tiers.map((o, y) => y === i ? { ...o, ...l } : o) });
  return /* @__PURE__ */ d(
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
        t.tiers.map((i, l) => /* @__PURE__ */ d("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[8rem_12rem_1fr_1fr_auto]", children: [
          /* @__PURE__ */ e(f, { label: "From (units)", htmlFor: `${a}-tier-${l}-min`, children: /* @__PURE__ */ e(P, { id: `${a}-tier-${l}-min`, min: 2, value: i.min_qty, onChange: (o) => s(l, { min_qty: o ?? 2 }) }) }),
          /* @__PURE__ */ e(f, { label: "Price", htmlFor: `${a}-tier-${l}-type`, children: /* @__PURE__ */ e(
            I,
            {
              id: `${a}-tier-${l}-type`,
              value: i.type,
              onChange: (o) => s(l, { type: o, value: 0 }),
              options: [["percent_off", "Percent off"], ["amount_off", "Amount off per unit"], ["fixed_price", "Fixed unit price"]]
            }
          ) }),
          /* @__PURE__ */ e(f, { label: i.type === "percent_off" ? "Percent" : "Amount", htmlFor: `${a}-tier-${l}-value`, children: i.type === "percent_off" ? /* @__PURE__ */ e(P, { id: `${a}-tier-${l}-value`, value: i.value / 100, onChange: (o) => s(l, { value: Math.round((o ?? 0) * 100) }) }) : /* @__PURE__ */ e(O, { id: `${a}-tier-${l}-value`, value: i.value, nullable: !1, onChange: (o) => s(l, { value: o ?? 0 }) }) }),
          /* @__PURE__ */ e(f, { label: "For", htmlFor: `${a}-tier-${l}-variant`, children: /* @__PURE__ */ e(
            I,
            {
              id: `${a}-tier-${l}-variant`,
              value: i.variant ?? "",
              onChange: (o) => s(l, { variant: o || null }),
              options: [["", "All variants"], ...t.type === "variable" ? t.variants.map((o) => [o.id, ee(t.options, o)]) : []]
            }
          ) }),
          /* @__PURE__ */ e(r, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ tiers: t.tiers.filter((o, y) => y !== l) }), children: "Remove" })
        ] }, l))
      ]
    }
  );
}
function $e({ value: t, update: n, updateVariant: a, path: r }) {
  const s = t.variants[0];
  if (!s) return null;
  const i = (l) => t.type === "variable" ? n({ variants: t.variants.map((o) => ({ ...o, ...l })) }) : a(0, l);
  return /* @__PURE__ */ e(A, { title: "Package", description: t.type === "variable" ? "Applies to every variant; a variant can have its own weight under More." : "Used for shipping rates.", children: /* @__PURE__ */ d(B, { cols: 4, children: [
    /* @__PURE__ */ e(f, { label: `Weight (${W()})`, htmlFor: `${r}-weight`, children: /* @__PURE__ */ e(z, { id: `${r}-weight`, unit: W(), value: s.weight, onChange: (l) => i({ weight: l }) }) }),
    /* @__PURE__ */ e(f, { label: `Length (${M()})`, htmlFor: `${r}-length`, children: /* @__PURE__ */ e(z, { id: `${r}-length`, unit: M(), value: s.length, onChange: (l) => i({ length: l }) }) }),
    /* @__PURE__ */ e(f, { label: `Width (${M()})`, htmlFor: `${r}-width`, children: /* @__PURE__ */ e(z, { id: `${r}-width`, unit: M(), value: s.width, onChange: (l) => i({ width: l }) }) }),
    /* @__PURE__ */ e(f, { label: `Height (${M()})`, htmlFor: `${r}-height`, children: /* @__PURE__ */ e(z, { id: `${r}-height`, unit: M(), value: s.height, onChange: (l) => i({ height: l }) }) })
  ] }) });
}
const J = {
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
}, G = (t) => t.flatMap((n) => n.price === null ? [] : [n.price]);
function xe({ option: t, onChange: n, onRemove: a, config: r, path: s }) {
  const { Button: i, Input: l, Badge: o } = D, [y, N] = x.useState(""), C = () => {
    const u = y.split(",").map((v) => v.trim()).filter(Boolean).filter((v) => !t.values.some((m) => (m.label ?? "").toLowerCase() === v.toLowerCase()));
    u.length && n({ ...t, values: [...t.values, ...u.map((v) => ({ id: j(), label: v }))] }), N("");
  }, h = r.attribute_taxonomies.find((u) => u.handle === t.taxonomy)?.title.slice(0, 60), k = (u) => {
    const v = r.attribute_taxonomies.find((c) => c.handle === u)?.title.slice(0, 60), m = t.name.trim() === "" || t.name === h;
    n({ ...t, name: m ? v ?? "" : t.name, taxonomy: u || null, values: [] });
  }, _ = t.values.map((u) => u.term_id).filter((u) => !!u);
  return /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-3 cm:rounded-md cm:border cm:p-3", children: [
    /* @__PURE__ */ d("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_1fr_auto]", children: [
      r.attribute_taxonomies.length > 0 && /* @__PURE__ */ e(f, { label: "Values from", htmlFor: `${s}-source`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${s}-source`,
          value: t.taxonomy ?? "",
          onChange: k,
          options: [["", "Custom values"], ...r.attribute_taxonomies.map((u) => [u.handle, u.title])]
        }
      ) }),
      /* @__PURE__ */ e(f, { label: "Option name", htmlFor: `${s}-name`, children: /* @__PURE__ */ e(
        l,
        {
          id: `${s}-name`,
          value: t.name,
          placeholder: h ?? "e.g. Size",
          onChange: (u) => n({ ...t, name: u.target.value })
        }
      ) }),
      /* @__PURE__ */ e(i, { type: "button", variant: "ghost", size: "sm", onClick: a, children: "Remove option" })
    ] }),
    t.taxonomy ? /* @__PURE__ */ e(
      oe,
      {
        fields: [{ handle: "terms", type: "terms", label: "Values", config: {
          multiple: !0,
          options: (r.attribute_taxonomies.find((u) => u.handle === t.taxonomy)?.terms ?? []).map((u) => ({ value: String(u.id), label: u.title }))
        } }],
        values: { terms: _ },
        pathPrefix: `${s}-terms`,
        onChange: (u) => {
          const v = u.terms ?? [], m = t.values.filter((b) => b.term_id && v.includes(b.term_id)), c = v.filter((b) => !m.some((S) => S.term_id === b)).map((b) => ({ id: j(), term_id: b }));
          n({ ...t, values: [...m, ...c] });
        }
      }
    ) : /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-2", children: [
      /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: t.values.map((u) => /* @__PURE__ */ d(o, { variant: "secondary", className: "cm:gap-1", children: [
        u.label,
        /* @__PURE__ */ e("button", { type: "button", "aria-label": `Remove ${u.label}`, onClick: () => n({ ...t, values: t.values.filter((v) => v.id !== u.id) }), children: "×" })
      ] }, u.id)) }),
      /* @__PURE__ */ d("div", { className: "cm:flex cm:gap-2", children: [
        /* @__PURE__ */ e(
          l,
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
        /* @__PURE__ */ e(i, { type: "button", variant: "outline", onClick: C, children: "Add" })
      ] })
    ] })
  ] });
}
function we({ variant: t, index: n, updateVariant: a, tab: r }) {
  const { MediaPickerInput: s } = D, i = `${r.path}-v${n}`, l = r.live?.variants[t.id];
  return /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-4 cm:bg-muted/40 cm:p-4", children: [
    /* @__PURE__ */ d(B, { cols: 4, children: [
      /* @__PURE__ */ e(f, { label: "Cost", htmlFor: `${i}-cost`, children: /* @__PURE__ */ e(O, { id: `${i}-cost`, value: t.cost, onChange: (o) => a(n, { cost: o }) }) }),
      /* @__PURE__ */ e(f, { label: "Barcode", htmlFor: `${i}-barcode`, children: /* @__PURE__ */ e(E, { id: `${i}-barcode`, value: t.barcode, onChange: (o) => a(n, { barcode: o }) }) }),
      /* @__PURE__ */ e(f, { label: `Weight (${W()})`, htmlFor: `${i}-weight`, children: /* @__PURE__ */ e(z, { id: `${i}-weight`, unit: W(), value: t.weight, onChange: (o) => a(n, { weight: o }), placeholder: "Product's" }) }),
      /* @__PURE__ */ e(f, { label: "Min / max / step", htmlFor: `${i}-min`, children: /* @__PURE__ */ d("div", { className: "cm:grid cm:grid-cols-3 cm:gap-1", children: [
        /* @__PURE__ */ e(P, { id: `${i}-min`, min: 1, value: t.min_qty, onChange: (o) => a(n, { min_qty: o ?? 1 }) }),
        /* @__PURE__ */ e(P, { min: 1, value: t.max_qty, onChange: (o) => a(n, { max_qty: o }), placeholder: "–" }),
        /* @__PURE__ */ e(P, { min: 1, value: t.qty_step, onChange: (o) => a(n, { qty_step: o ?? 1 }) })
      ] }) })
    ] }),
    r.config.features.inventory && /* @__PURE__ */ d(B, { cols: 4, children: [
      /* @__PURE__ */ e(L, { id: `${i}-track`, label: "Track stock", checked: t.track_stock, onChange: (o) => a(n, { track_stock: o }) }),
      t.track_stock && (l?.track_stock && l.stock_quantity !== null ? /* @__PURE__ */ e(ne, { variantKey: t.id, tab: r, sku: t.sku }) : /* @__PURE__ */ e(f, { label: "Starting stock", htmlFor: `${i}-initial`, children: /* @__PURE__ */ e(P, { id: `${i}-initial`, value: t.initial_stock, onChange: (o) => a(n, { initial_stock: o }) }) })),
      t.track_stock ? /* @__PURE__ */ e(f, { label: "When sold out", htmlFor: `${i}-backorders`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${i}-backorders`,
          value: t.backorders,
          onChange: (o) => a(n, { backorders: o }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }) : /* @__PURE__ */ e(f, { label: "Stock status", htmlFor: `${i}-status`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${i}-status`,
          value: t.stock_status,
          onChange: (o) => a(n, { stock_status: o }),
          options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
        }
      ) })
    ] }),
    /* @__PURE__ */ e(f, { label: "Image", htmlFor: `${i}-image`, children: /* @__PURE__ */ e(s, { id: `${i}-image`, value: t.image, types: ["image"], onChange: (o) => a(n, { image: o }) }) })
  ] });
}
function Ce(t) {
  const { value: n, update: a, updateVariant: r, config: s, entryId: i, live: l } = t, { Button: o, Table: y, TableBody: N, TableCell: C, TableHead: h, TableHeader: k, TableRow: _, Switch: u } = D, [v, m] = x.useState(null), c = Object.fromEntries(t.config.attribute_taxonomies.flatMap((g) => g.terms.map((w) => [w.id, w.title]))), b = n.variants[0] ?? { ...J, id: j() }, S = (g = n.options) => a({ options: g, variants: he(g, n.variants, { ...b, initial_stock: null, image: null }, s.max_variants) });
  return /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ e(
      A,
      {
        title: "Options",
        description: `Up to ${s.max_options} options, such as size and color. Variants are made for every combination.`,
        actions: n.options.length < s.max_options && /* @__PURE__ */ e(o, { type: "button", variant: "outline", size: "sm", onClick: () => a({ options: [...n.options, { id: j(), name: "", taxonomy: null, values: [] }] }), children: "Add option" }),
        children: n.options.map((g, w) => /* @__PURE__ */ e(
          xe,
          {
            option: g,
            config: s,
            path: `${t.path}-o${w}`,
            onChange: (p) => S(n.options.map(($, F) => F === w ? p : $)),
            onRemove: () => S(n.options.filter((p, $) => $ !== w))
          },
          g.id
        ))
      }
    ),
    /* @__PURE__ */ d(
      A,
      {
        title: `Variants (${n.variants.length})`,
        description: "Each has its own SKU, price and stock. Switch one off to stop selling it without losing it.",
        actions: /* @__PURE__ */ e(o, { type: "button", variant: "outline", size: "sm", onClick: () => S(), children: "Regenerate" }),
        children: [
          n.options.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "Add an option with values to create variants." }) : /* @__PURE__ */ e("div", { className: "cm:overflow-x-auto cm:rounded-md cm:border", children: /* @__PURE__ */ d(y, { children: [
            /* @__PURE__ */ e(k, { children: /* @__PURE__ */ d(_, { children: [
              /* @__PURE__ */ e(h, { children: "Variant" }),
              /* @__PURE__ */ e(h, { children: "SKU" }),
              /* @__PURE__ */ e(h, { children: "Price" }),
              /* @__PURE__ */ e(h, { children: "Compare-at" }),
              s.features.inventory && /* @__PURE__ */ e(h, { children: "Stock" }),
              /* @__PURE__ */ e(h, { children: "On sale" }),
              /* @__PURE__ */ e(h, {})
            ] }) }),
            /* @__PURE__ */ e(N, { children: n.variants.map((g, w) => {
              const p = l?.variants[g.id];
              return /* @__PURE__ */ d(x.Fragment, { children: [
                /* @__PURE__ */ d(_, { className: g.active ? "" : "cm:opacity-60", children: [
                  /* @__PURE__ */ e(C, { className: "cm:font-medium cm:whitespace-nowrap", children: ee(n.options, g, c) }),
                  /* @__PURE__ */ e(C, { className: "cm:min-w-36", children: /* @__PURE__ */ e(te, { value: g.sku, entryId: i, onChange: ($) => r(w, { sku: $ }) }) }),
                  /* @__PURE__ */ e(C, { className: "cm:min-w-32", children: /* @__PURE__ */ e(O, { value: g.price, placeholder: "On request", onChange: ($) => r(w, { price: $ }) }) }),
                  /* @__PURE__ */ e(C, { className: "cm:min-w-32", children: /* @__PURE__ */ e(O, { value: g.compare_at_price, onChange: ($) => r(w, { compare_at_price: $ }) }) }),
                  s.features.inventory && /* @__PURE__ */ e(C, { className: "cm:whitespace-nowrap cm:text-sm", children: g.track_stock ? p?.stock_quantity ?? g.initial_stock ?? 0 : /* @__PURE__ */ e(se, { children: g.stock_status.replace("_", " ") }) }),
                  /* @__PURE__ */ e(C, { children: /* @__PURE__ */ e(u, { checked: g.active, "aria-label": "Sell this variant", onCheckedChange: ($) => r(w, { active: $ }) }) }),
                  /* @__PURE__ */ e(C, { children: /* @__PURE__ */ e(o, { type: "button", variant: "ghost", size: "sm", "aria-expanded": v === g.id, onClick: () => m(v === g.id ? null : g.id), children: v === g.id ? "Close" : "More" }) })
                ] }),
                v === g.id && /* @__PURE__ */ e(_, { children: /* @__PURE__ */ e(C, { colSpan: 7, className: "cm:p-0", children: /* @__PURE__ */ e(we, { variant: g, index: w, updateVariant: r, tab: t }) }) })
              ] }, g.id);
            }) })
          ] }) }),
          G(n.variants).length > 0 && /* @__PURE__ */ d("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
            "Prices from ",
            H(Math.min(...G(n.variants))),
            " to ",
            H(Math.max(...G(n.variants))),
            ".",
            G(n.variants).length < n.variants.length && " Variants without a price are on request."
          ] })
        ]
      }
    )
  ] });
}
function Ne(t) {
  const n = t ?? {}, a = (n.variants?.length ? n.variants : [{ ...J, id: j() }]).map((r) => ({ ...J, ...r, id: r.id ?? j() }));
  return {
    type: n.type ?? "simple",
    purchase_mode: n.purchase_mode ?? "default",
    external_links: n.external_links ?? [],
    requires_shipping: !n.downloadable && !n.gift_card && (n.requires_shipping ?? !0),
    downloadable: n.downloadable ?? !1,
    gift_card: n.gift_card ?? !1,
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
function Fe({ field: t, value: n, onChange: a, errors: r, id: s = "data-product" }) {
  ce();
  const i = t.config ?? {}, l = Ne(n), { props: o } = de.usePage(), y = o.entry?.id ?? null, [N, C] = x.useState(), [h, k] = x.useState(null);
  x.useEffect(() => {
    if (!y) return;
    const p = new AbortController();
    return K(R(`commerce/api/products/${y}`), { signal: p.signal }).then(($) => {
      p.signal.aborted || (k($.data), C($.purchase_default));
    }).catch(() => {
    }), () => p.abort();
  }, [y, o.entry]);
  const _ = (p) => {
    const $ = { ...l, ...p };
    $.downloadable && ($.requires_shipping = !1), p.type && p.type !== "variable" && ($.options = [], $.variants = [{ ...$.variants[0], options: {} }]), p.type === "bundle" && !$.bundle && ($.bundle = { pricing: "fixed", value: 0, items: [] }), a($);
  }, u = (p, $) => _({ variants: l.variants.map((F, U) => U === p ? { ...F, ...$ } : F) }), v = [{ key: "general", label: "General", render: (p) => /* @__PURE__ */ e(ve, { ...p }) }];
  l.type === "variable" && v.push({ key: "variants", label: "Variants", render: (p) => /* @__PURE__ */ e(Ce, { ...p }) }), l.type === "bundle" && v.push({ key: "bundle", label: "Bundle", render: (p) => /* @__PURE__ */ e(ge, { ...p }) }), l.type !== "variable" && (i.features?.inventory ?? !0) && v.push({ key: "inventory", label: "Inventory", render: (p) => /* @__PURE__ */ e(ke, { ...p }) }), l.requires_shipping && v.push({ key: "shipping", label: "Shipping", render: (p) => /* @__PURE__ */ e($e, { ...p }) }), (i.features?.pricing_rules !== !1 || l.tiers.length > 0) && v.push({ key: "pricing", label: "Bulk pricing", render: (p) => /* @__PURE__ */ e(_e, { ...p }) }), l.downloadable && v.push({ key: "digital", label: "Digital", render: (p) => /* @__PURE__ */ e(be, { ...p }) });
  for (const [p, $] of Object.entries(me.productTabs()))
    v.push({ key: `ext-${p}`, label: $.label ?? p, render: (F) => /* @__PURE__ */ e($, { ...F }) });
  const [m, c] = x.useState("general"), b = v.find((p) => p.key === m) ?? v[0], S = r?.[""], g = (p, $, F) => {
    k((U) => {
      const q = U?.variants[p];
      return !U || !q || q.id !== $ ? U : { ...U, variants: { ...U.variants, [p]: { ...q, stock_quantity: F } } };
    });
  }, w = { value: l, update: _, updateVariant: u, config: i, live: h, purchaseDefault: N ?? i.purchase_default, updateLiveStock: g, entryId: y, path: s };
  return /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-5", children: [
    h?.sync_status === "failed" && /* @__PURE__ */ d("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: [
      "The published version couldn't be applied to the store, so it can't be bought: ",
      h.sync_error,
      ". Fix it and publish again."
    ] }),
    S && /* @__PURE__ */ e("p", { role: "alert", className: "cm:text-sm cm:text-destructive", children: S }),
    /* @__PURE__ */ e("div", { role: "tablist", "aria-label": "Product data", className: "cm:flex cm:flex-wrap cm:gap-x-2 cm:border-b", children: v.map((p) => /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        id: `${s}-tab-${p.key}`,
        role: "tab",
        "aria-controls": `${s}-panel`,
        "aria-selected": p.key === b.key,
        onClick: () => c(p.key),
        className: V("cm:-mb-px cm:border-b-2 cm:px-3 cm:py-2 cm:text-sm", p.key === b.key ? "cm:border-primary cm:font-medium" : "cm:border-transparent cm:text-muted-foreground cm:hover:text-foreground"),
        children: p.label
      },
      p.key
    )) }),
    /* @__PURE__ */ e("div", { id: `${s}-panel`, role: "tabpanel", "aria-labelledby": `${s}-tab-${b.key}`, children: b.render(w) })
  ] });
}
export {
  Fe as default
};
