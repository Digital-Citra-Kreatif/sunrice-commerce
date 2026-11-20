import { inertia } from './sunrice';
import { setMoneyFormat, type MoneyFormat } from './money';
import { setUnits } from './units';

/** The `commerce` shared prop (CommerceServiceProvider, Inertia::share). */
export interface CommerceShared {
    currency?: Partial<MoneyFormat>;
    units?: { weight?: string; dimension?: string };
}

/** Keep the money format and units in step with the page props. */
export function useCommerceShared(): CommerceShared {
    const { props } = inertia.usePage<{ commerce?: CommerceShared }>();
    const shared = props.commerce ?? {};
    setMoneyFormat(shared.currency);
    setUnits(shared.units);

    return shared;
}

export interface MenuItem {
    key: string;
    label: string;
    href: string;
}
