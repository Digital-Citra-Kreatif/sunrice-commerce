import { api } from '../lib/api';
import { EmptyState } from './EmptyState';
import { MoneyInput } from './MoneyInput';
import { PageHeader } from './PageHeader';
import { SchemaFormView } from './SchemaFormView';
import { SectionNav } from './SectionNav';
import { SettingsLayout } from './SettingsLayout';
import { StatusBadge } from './StatusBadge';

/** Building blocks shared with extension packages (window.SunriceCommerce.components). */
export function installComponents(): void {
    Object.assign(api.components, { EmptyState, MoneyInput, PageHeader, SchemaFormView, SectionNav, SettingsLayout, StatusBadge });
}
