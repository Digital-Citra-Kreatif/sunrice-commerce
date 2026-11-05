import { e as n, c as t, m as i, n as u } from "./main-p2UnqZyH.js";
function m({ section: e, sections: r, form: a }) {
  const s = n.settingsSections()[e.key];
  return /* @__PURE__ */ t(i, { sections: r, current: e.key, title: `${e.label} settings`, children: s ? /* @__PURE__ */ t(s, { section: e, form: a }, e.key) : /* @__PURE__ */ t(u, { form: a }, e.key) });
}
export {
  m as default
};
