import * as ReactModule from '../shims/react';
import * as InertiaModule from '../shims/inertia';
import * as UiModule from '../shims/ui';
import type { SunriceRuntime } from '../sunrice';

type AnyComponent = React.ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

/** The panel's runtime (window.Sunrice, version 3), as @imajiner/admin-sdk uses it. */
export const RUNTIME_VERSION = 3;

const runtime = (): SunriceRuntime => window.Sunrice;

/** The panel's React, Inertia and UI components (window.Sunrice.modules). */
export const React = ReactModule as unknown as typeof import('react');
export const ui = UiModule as unknown as Record<string, AnyComponent> & { toast: { success(message: string): void; error(message: string): void } };
export interface InertiaRouter {
    visit(url: string, options?: Record<string, unknown>): void;
    get(url: string, data?: Record<string, unknown>, options?: Record<string, unknown>): void;
    post(url: string, data?: unknown, options?: Record<string, unknown>): void;
    put(url: string, data?: unknown, options?: Record<string, unknown>): void;
    patch(url: string, data?: unknown, options?: Record<string, unknown>): void;
    delete(url: string, options?: Record<string, unknown>): void;
    reload(options?: Record<string, unknown>): void;
}

export interface InertiaForm<T extends Record<string, unknown>> {
    data: T;
    setData: (key: keyof T | T, value?: unknown) => void;
    errors: Partial<Record<string, string>>;
    processing: boolean;
    isDirty: boolean;
    post: (url: string, options?: Record<string, unknown>) => void;
    put: (url: string, options?: Record<string, unknown>) => void;
    patch: (url: string, options?: Record<string, unknown>) => void;
    delete: (url: string, options?: Record<string, unknown>) => void;
    reset: (...fields: string[]) => void;
    transform: (callback: (data: T) => Record<string, unknown>) => void;
}

/** The panel's Inertia (@inertiajs/react), typed as the bundle uses it. */
export const inertia = {
    router: InertiaModule.router as InertiaRouter,
    Link: InertiaModule.Link as AnyComponent,
    Head: InertiaModule.Head as AnyComponent,
    usePage: InertiaModule.usePage as <P = Record<string, unknown>>() => { props: P & Record<string, unknown>; url: string },
    useForm: InertiaModule.useForm as <T extends Record<string, unknown>>(data: T) => InertiaForm<T>,
};
export const toast = ui.toast;

/** The header's breadcrumbs for this page. */
export const useBreadcrumbs = UiModule.useBreadcrumbs as (crumbs: Array<{ label: string; href?: string }>) => void;

/** The panel's words in the user's language. */
export function t(text: string, replace?: Record<string, string | number | null | undefined>): string {
    return runtime().t(text, replace);
}

/**
 * An admin address: "commerce/orders" → "/admin/commerce/orders". Absolute
 * paths (route(..., false) from the server already carry the admin path)
 * are kept as they are.
 */
export function adminUrl(path = ''): string {
    return path.startsWith('/') ? path : runtime().adminUrl(path);
}

/** A JSON request to the admin, with the session's CSRF token; refuses on an error status. */
export async function fetchJson<T = unknown>(url: string, init: RequestInit = {}): Promise<T> {
    const token = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
    const response = await fetch(url, {
        credentials: 'same-origin',
        ...init,
        headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest', ...(token ? { 'X-CSRF-TOKEN': token } : {}), ...init.headers },
    });
    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
}

/**
 * The bundle's entry: registers the Commerce/ pages with the panel, each
 * loaded the first time it opens, refusing a panel whose runtime this
 * bundle wasn't built for (as @imajiner/admin-sdk's definePlugin() does).
 */
export function definePlugin(pages: Record<string, () => Promise<unknown>>): void {
    const sunrice = runtime();
    if (sunrice.version !== RUNTIME_VERSION) {
        throw new Error(`[commerce] This bundle was built for admin runtime ${RUNTIME_VERSION}, but the panel runs ${sunrice.version}. Update sunrice/commerce.`);
    }
    for (const [name, load] of Object.entries(pages)) {
        sunrice.registerPageLoader(name, load as () => Promise<{ default: AnyComponent }>);
    }
}
