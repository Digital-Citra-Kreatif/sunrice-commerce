import type { ReactNode } from 'react';
import { adminUrl, inertia, ui, useBreadcrumbs } from '../lib/sunrice';
import { useCommerceShared, type MenuItem } from '../lib/store';
import { PageHeader } from './PageHeader';
import { SectionNav } from './SectionNav';

/**
 * Settings → Store: the panel's Settings menu beside the page, the store's
 * sections as tabs under the page's title (one menu at the side, as on
 * every settings page), then the section.
 */
export function SettingsLayout({ sections, current, title, description, primary, children }: {
    sections: MenuItem[];
    current: string;
    title: string;
    description?: ReactNode;
    primary?: ReactNode;
    children: ReactNode;
}) {
    const { SettingsLayout: PanelSettings } = ui;
    useCommerceShared();
    const settingsNav = (inertia.usePage<{ commerce?: { settingsNav?: unknown[] } }>().props.commerce?.settingsNav ?? []) as unknown[];
    useBreadcrumbs([{ label: 'Settings', href: adminUrl('settings') }, { label: 'Store', href: adminUrl('commerce/settings') }, { label: title }]);

    return (
        <div>
            <PanelSettings items={settingsNav} current="commerce-settings">
                <div className="cm:flex cm:min-w-0 cm:flex-col cm:gap-6">
                    <PageHeader title={title} description={description} primary={primary} />
                    <SectionNav items={sections} current={current} label="Store settings" />
                    {children}
                </div>
            </PanelSettings>
        </div>
    );
}
