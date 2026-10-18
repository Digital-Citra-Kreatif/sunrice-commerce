import type * as ReactTypes from 'react';
import { formatMoney, parseMoney, type MoneyFormat } from './money';

type Component = ReactTypes.ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * window.SunriceCommerce: the commerce admin's extension API for extension
 * packages (gateways, couriers, loyalty…). Scripts that may load before
 * this bundle queue their calls:
 *
 *     (window.SunriceCommerceQueue ||= []).push((api) => api.registerOrderPanel('loyalty', Panel));
 *
 * Keep this surface small and stable: it is a public API.
 */
export interface SunriceCommerceApi {
    version: number;
    registerOrderPanel(name: string, component: Component): void;
    registerDashboardWidget(name: string, component: Component): void;
    registerSettingsSection(name: string, component: Component): void;
    registerProductTab(name: string, component: Component): void;
    orderPanels(): Record<string, Component>;
    dashboardWidgets(): Record<string, Component>;
    settingsSections(): Record<string, Component>;
    productTabs(): Record<string, Component>;
    formatMoney(amount: number, format?: MoneyFormat): string;
    parseMoney(text: string, format?: MoneyFormat): number | null;
    components: Record<string, Component>;
}

const registries = {
    orderPanels: {} as Record<string, Component>,
    dashboardWidgets: {} as Record<string, Component>,
    settingsSections: {} as Record<string, Component>,
    productTabs: {} as Record<string, Component>,
};

export const api: SunriceCommerceApi = {
    version: 1,
    registerOrderPanel: (name, component) => { registries.orderPanels[name] = component; },
    registerDashboardWidget: (name, component) => { registries.dashboardWidgets[name] = component; },
    registerSettingsSection: (name, component) => { registries.settingsSections[name] = component; },
    registerProductTab: (name, component) => { registries.productTabs[name] = component; },
    orderPanels: () => registries.orderPanels,
    dashboardWidgets: () => registries.dashboardWidgets,
    settingsSections: () => registries.settingsSections,
    productTabs: () => registries.productTabs,
    formatMoney,
    parseMoney,
    components: {},
};


/** Install window.SunriceCommerce and run the calls queued before it existed. */
export function installCommerceApi(): void {
    window.SunriceCommerce = api;
    const queue = window.SunriceCommerceQueue ?? [];
    const drain = () => {
        while (queue.length > 0) {
            const call = queue.shift();
            try {
                call?.(api);
            } catch (error) {
                console.error('SunriceCommerceQueue call failed', error);
            }
        }
    };
    drain();
    // Later pushes run at once.
    queue.push = ((...calls: Array<(api: SunriceCommerceApi) => void>) => {
        calls.forEach((call) => call(api));

        return queue.length;
    }) as typeof queue.push;
    window.SunriceCommerceQueue = queue;
}
