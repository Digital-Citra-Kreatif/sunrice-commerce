import type { SunriceApi } from '../sunrice';

/** The admin's extension API (window.Sunrice). */
export const Sunrice: SunriceApi = window.Sunrice;
export const { React, ui, components, inertia, adminUrl, fetchJson, toast } = Sunrice;
