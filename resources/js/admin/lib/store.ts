import { inertia } from './sunrice';
import { setMoneyFormat, type MoneyFormat } from './money';

/** The `commerce` shared prop (CommerceServiceProvider, Inertia::share). */
export interface CommerceShared {
    currency?: Partial<MoneyFormat>;
}

/** Keep the money format in step with the page props. */
export function useCommerceShared(): CommerceShared {
    const { props } = inertia.usePage<{ commerce?: CommerceShared }>();
    const shared = props.commerce ?? {};
    setMoneyFormat(shared.currency);

    return shared;
}

export interface MenuItem {
    key: string;
    label: string;
    href: string;
}
