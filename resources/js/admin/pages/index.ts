import { definePlugin } from '../lib/sunrice';

/**
 * The Commerce/ pages, each its own chunk, loaded the first time it opens.
 */
const pages: Record<string, () => Promise<unknown>> = {
    'Commerce/Confirmations/Index': () => import('./Confirmations/Index'),
    'Commerce/Customers/Show': () => import('./Customers/Show'),
    'Commerce/Dashboard': () => import('./Dashboard'),
    'Commerce/Inventory/Index': () => import('./Inventory/Index'),
    'Commerce/Marketing/Editor': () => import('./Marketing/Editor'),
    'Commerce/Marketing/Report': () => import('./Marketing/Report'),
    'Commerce/Orders/Editor': () => import('./Orders/Editor'),
    'Commerce/Orders/Show': () => import('./Orders/Show'),
    'Commerce/Products/Index': () => import('./Products/Index'),
    'Commerce/Products/Import': () => import('./Products/Import'),
    'Commerce/Reports/Show': () => import('./Reports/Show'),
    'Commerce/Settings/Section': () => import('./Settings/Section'),
    'Commerce/Settings/Emails': () => import('./Settings/Emails'),
    'Commerce/Settings/Features': () => import('./Settings/Features'),
    'Commerce/Settings/Payments': () => import('./Settings/Payments'),
    'Commerce/Settings/Shipping': () => import('./Settings/Shipping'),
    'Commerce/Shared/SchemaForm': () => import('./Shared/SchemaForm'),
    'Commerce/Shared/ResourceIndex': () => import('./Shared/ResourceIndex'),
};

export function registerPages(): void {
    definePlugin(pages);
}
