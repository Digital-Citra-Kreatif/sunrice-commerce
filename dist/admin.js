const h = { symbol: "Rp", position: "left", space: !1, thousands: ".", decimal: ",", decimals: 0 };
let p = h;
function b(s, e = p) {
  const t = s < 0, n = Math.abs(Math.round(s)), r = 10 ** e.decimals, c = Math.floor(n / r).toString().replace(/\B(?=(\d{3})+(?!\d))/g, e.thousands), o = e.decimals > 0 ? e.decimal + String(n % r).padStart(e.decimals, "0") : "", l = c + o, u = e.space ? " " : "", g = e.position === "left" ? `${e.symbol}${u}${l}` : `${l}${u}${e.symbol}`;
  return t ? `-${g}` : g;
}
function m(s, e = p) {
  let t = s.replace(e.symbol, "").replace(/\s/g, "");
  const n = t.startsWith("-");
  t = t.replace(/^-/, "").split(e.thousands).join("");
  const [r, c = ""] = t.split(e.decimal);
  if (!/^\d*$/.test(r) || !/^\d*$/.test(c) || r + c === "")
    return null;
  const o = Number(r || "0") * 10 ** e.decimals + Number(c.padEnd(e.decimals, "0").slice(0, e.decimals) || "0");
  return n ? -o : o;
}
const i = {
  orderPanels: {},
  dashboardWidgets: {},
  settingsSections: {},
  productTabs: {}
}, a = {
  version: 1,
  registerOrderPanel: (s, e) => {
    i.orderPanels[s] = e;
  },
  registerDashboardWidget: (s, e) => {
    i.dashboardWidgets[s] = e;
  },
  registerSettingsSection: (s, e) => {
    i.settingsSections[s] = e;
  },
  registerProductTab: (s, e) => {
    i.productTabs[s] = e;
  },
  orderPanels: () => i.orderPanels,
  dashboardWidgets: () => i.dashboardWidgets,
  settingsSections: () => i.settingsSections,
  productTabs: () => i.productTabs,
  formatMoney: b,
  parseMoney: m,
  components: {}
};
function S() {
  window.SunriceCommerce = a;
  const s = window.SunriceCommerceQueue ?? [];
  (() => {
    for (; s.length > 0; ) {
      const t = s.shift();
      try {
        t?.(a);
      } catch (n) {
        console.error("SunriceCommerceQueue call failed", n);
      }
    }
  })(), s.push = ((...t) => (t.forEach((n) => n(a)), s.length)), window.SunriceCommerceQueue = s;
}
const d = window.Sunrice, { React: y, ui: W, components: C, inertia: M, adminUrl: T, fetchJson: E, toast: j } = d, w = {};
function f() {
  Object.entries(w).forEach(([s, e]) => d.registerPage(s, e));
}
const $ = {};
function P() {
  Object.entries($).forEach(([s, e]) => d.registerField(s, e));
}
S();
P();
f();
