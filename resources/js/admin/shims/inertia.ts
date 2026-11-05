/**
 * `@inertiajs/react` for the commerce bundle: the panel's own copy, from
 * window.Sunrice.modules (the panel's runtime, version 3), so the bundle
 * shares the admin's single React, Inertia and UI. Generated from
 * @imajiner/admin-sdk's SHARED_MODULES (tests/Frontend checks the list).
 */
const m = (globalThis as { Sunrice?: { modules?: Record<string, Record<string, any>> } }).Sunrice?.modules?.["@inertiajs/react"]; // eslint-disable-line @typescript-eslint/no-explicit-any
if (!m) {
    throw new Error('[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).');
}

export const App = m.App;
export const Deferred = m.Deferred;
export const Form = m.Form;
export const Head = m.Head;
export const InfiniteScroll = m.InfiniteScroll;
export const Link = m.Link;
export const WhenMounted = m.WhenMounted;
export const WhenVisible = m.WhenVisible;
export const config = m.config;
export const createInertiaApp = m.createInertiaApp;
export const http = m.http;
export const progress = m.progress;
export const resetLayoutProps = m.resetLayoutProps;
export const router = m.router;
export const setLayoutProps = m.setLayoutProps;
export const useForm = m.useForm;
export const useFormContext = m.useFormContext;
export const useHttp = m.useHttp;
export const usePage = m.usePage;
export const usePoll = m.usePoll;
export const usePrefetch = m.usePrefetch;
export const useRemember = m.useRemember;
