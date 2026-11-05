/**
 * `react/jsx-runtime` for the commerce bundle: the panel's own copy, from
 * window.Sunrice.modules (the panel's runtime, version 3), so the bundle
 * shares the admin's single React, Inertia and UI. Generated from
 * @imajiner/admin-sdk's SHARED_MODULES (tests/Frontend checks the list).
 */
const m = (globalThis as { Sunrice?: { modules?: Record<string, Record<string, any>> } }).Sunrice?.modules?.["react/jsx-runtime"]; // eslint-disable-line @typescript-eslint/no-explicit-any
if (!m) {
    throw new Error('[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).');
}

export const Fragment = m.Fragment;
export const jsx = m.jsx;
export const jsxs = m.jsxs;
export const jsxDEV = m.jsx;
