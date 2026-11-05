function c(n) {
  switch (n?.input) {
    case "days":
      return 30;
    case "number":
      return 1;
    case "money":
      return 0;
    case "select":
      return n.options?.[0]?.value ?? "";
    case "products":
    case "categories":
      return [];
    case "text":
      return "";
    default:
      return null;
  }
}
function i(n) {
  const u = [];
  for (const [t, e] of Object.entries(n)) {
    let r = u.find(([s]) => s === e.group);
    r || (r = [e.group, []], u.push(r)), r[1].push([t, e]);
  }
  return u;
}
function l(n, u) {
  return n.rules.every((t) => {
    const e = u[t.rule];
    return e ? e.input === "none" ? !0 : e.input === "products" || e.input === "categories" ? Array.isArray(t.value) && t.value.length > 0 : e.input === "days" || e.input === "number" || e.input === "money" ? t.value !== "" && t.value !== null && Number(t.value) >= 0 : String(t.value ?? "").trim() !== "" : !1;
  });
}
function f(n, u, t, e) {
  const r = `{${u}}`, s = t ?? n.length, o = e ?? s;
  return { text: n.slice(0, s) + r + n.slice(o), cursor: s + r.length };
}
function p(n, u) {
  const t = /* @__PURE__ */ new Set();
  for (const e of n.matchAll(/\{([a-z_]+)(?:\|[^{}]*)?\}/g))
    u.includes(e[1]) || t.add(e[1]);
  return [...t];
}
function d(n, u) {
  return u > 0 ? `${Math.round(n / u * 1e3) / 10}%` : "—";
}
export {
  l as a,
  c as d,
  i as g,
  f as i,
  d as r,
  p as u
};
