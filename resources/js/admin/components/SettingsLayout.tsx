import type { ReactNode } from 'react';
import { adminUrl, components, Sunrice } from '../lib/sunrice';
import { useCommerceShared, type MenuItem } from '../lib/store';
import { PageHeader } from './PageHeader';
import { SectionNav } from './SectionNav';

/** Settings → Store: the Settings tabs, the section menu and the section. */
export function SettingsLayout({ sections, current, title, description, children }: {
    sections: MenuItem[];
    current: string;
    title: string;
    description?: ReactNode;
    children: ReactNode;
}) {
    const { SettingsTabs } = components;
    useCommerceShared();
    Sunrice.useBreadcrumbs([{ label: 'Settings', href: adminUrl('settings') }, { label: 'Store', href: adminUrl('commerce/settings') }, { label: title }]);

    return (
        <div className="cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6">
            <SettingsTabs current="store" />
            <div className="cm:grid cm:gap-6 cm:md:grid-cols-[12rem_1fr]">
                <SectionNav items={sections} current={current} label="Store settings" />
                <div className="cm:grid cm:min-w-0 cm:content-start cm:gap-6">
                    <PageHeader title={title} description={description} />
                    {children}
                </div>
            </div>
        </div>
    );
}
