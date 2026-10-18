import type { SunriceApi } from '../sunrice';

/** The admin's extension API (window.Sunrice). */
export const Sunrice: SunriceApi = window.Sunrice;
export const { React, ui, components, inertia, fetchJson, toast } = Sunrice;

/**
 * An admin address: "commerce/orders" → "/cms/commerce/orders". Absolute
 * paths (route(..., false) from the server already carry the admin path)
 * are kept as they are.
 */
export function adminUrl(path = ''): string {
    return path.startsWith('/') ? path : Sunrice.adminUrl(path);
}
