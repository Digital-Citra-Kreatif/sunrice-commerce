import { api } from '../lib/api';
import { Chart } from './Chart';
import { EmptyState } from './EmptyState';
import { KpiCard } from './KpiCard';
import { MoneyInput } from './MoneyInput';
import { PageHeader } from './PageHeader';
import { SchemaFormView } from './SchemaFormView';
import { SectionNav } from './SectionNav';
import { SettingsLayout } from './SettingsLayout';
import { StatusBadge } from './StatusBadge';
import { StoreCard } from './StoreCard';
import { Sunrice } from '../lib/sunrice';

/** Building blocks shared with extension packages (window.SunriceCommerce.components). */
export function installComponents(): void {
    Object.assign(api.components, { Chart, EmptyState, KpiCard, MoneyInput, PageHeader, SchemaFormView, SectionNav, SettingsLayout, StatusBadge });
    // The Store card on Sunrice's dashboard, where Sunrice supports dashboard cards (U2).
    Sunrice.registerDashboardCard?.('commerce-store', StoreCard);
}
