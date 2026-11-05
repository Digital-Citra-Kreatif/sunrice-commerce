import type { ReactNode } from 'react';
import { adminUrl, inertia, ui, useBreadcrumbs } from '../lib/sunrice';
import { useCommerceShared, type MenuItem } from '../lib/store';
import { PageHeader } from './PageHeader';
import { SectionNav } from './SectionNav';

/** Settings → Store: the panel's Settings menu, the store's section menu and the section. */
export function SettingsLayout({ sections, current, title, description, children }: {
    sections: MenuItem[];
    current: string;
    title: string;
    description?: ReactNode;
    children: ReactNode;
}) {
    const { SettingsLayout: PanelSettings } = ui;
    useCommerceShared();
    const settingsNav = (inertia.usePage<{ commerce?: { settingsNav?: unknown[] } }>().props.commerce?.settingsNav ?? []) as unknown[];
    useBreadcrumbs([{ label: 'Settings', href: adminUrl('settings') }, { label: 'Store', href: adminUrl('commerce/settings') }, { label: title }]);

    return (
        <div className="cm:p-4 cm:md:p-6">
            <PanelSettings items={settingsNav} current="commerce-settings">
                <div className="cm:grid cm:gap-6 cm:md:grid-cols-[12rem_1fr]">
                    <SectionNav items={sections} current={current} label="Store settings" />
                    <div className="cm:grid cm:min-w-0 cm:content-start cm:gap-6">
                        <PageHeader title={title} description={description} />
                        {children}
                    </div>
                </div>
            </PanelSettings>
        </div>
    );
}
