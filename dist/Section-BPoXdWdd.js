import { e as m, R as n, b as t, o as c, k as g, c as u } from "./main-BjsacfA0.js";
function l({ section: e, sections: r, form: a }) {
  const s = m.settingsSections()[e.key], [i, o] = n.useState(!1);
  return /* @__PURE__ */ t(
    c,
    {
      sections: r,
      current: e.key,
      title: `${e.label} settings`,
      primary: s ? void 0 : /* @__PURE__ */ t(u.Button, { type: "submit", form: "commerce-settings-form", disabled: i, children: "Save" }),
      children: s ? /* @__PURE__ */ t(s, { section: e, form: a }, e.key) : /* @__PURE__ */ t(g, { form: a, id: "commerce-settings-form", onProcessing: o, storageKey: `commerce:settings:${e.key}` }, e.key)
    }
  );
}
export {
  l as default
};
