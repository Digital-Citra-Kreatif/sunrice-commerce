/**
 * `react-dom` for the commerce bundle: the panel's own copy, from
 * window.Sunrice.modules (the panel's runtime, version 3), so the bundle
 * shares the admin's single React, Inertia and UI. Generated from
 * @imajiner/admin-sdk's SHARED_MODULES (tests/Frontend checks the list).
 */
const m = (globalThis as { Sunrice?: { modules?: Record<string, Record<string, any>> } }).Sunrice?.modules?.["react-dom"]; // eslint-disable-line @typescript-eslint/no-explicit-any
if (!m) {
    throw new Error('[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).');
}

export default m;
export const createPortal = m.createPortal;
export const flushSync = m.flushSync;
export const preconnect = m.preconnect;
export const prefetchDNS = m.prefetchDNS;
export const preinit = m.preinit;
export const preinitModule = m.preinitModule;
export const preload = m.preload;
export const preloadModule = m.preloadModule;
export const requestFormReset = m.requestFormReset;
export const unstable_batchedUpdates = m.unstable_batchedUpdates;
export const useFormState = m.useFormState;
export const useFormStatus = m.useFormStatus;
export const version = m.version;
