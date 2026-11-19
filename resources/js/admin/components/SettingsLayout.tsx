import type { ReactNode } from 'react';
import { adminUrl, useBreadcrumbs } from '../lib/sunrice';
import { useCommerceShared, type MenuItem } from '../lib/store';
import { PageHeader } from './PageHeader';
import { SectionNav } from './SectionNav';

/** Store settings with a section menu beside the current form on desktop. */
export function SettingsLayout({ sections, current, title, description, primary, children }: {
    sections: MenuItem[];
    current: string;
    title: string;
    description?: ReactNode;
    primary?: ReactNode;
    children: ReactNode;
}) {
    useCommerceShared();
    useBreadcrumbs([{ label: 'Shop' }, { label: 'Store settings', href: adminUrl('commerce/settings') }, { label: title }]);

    return (
        <div className="cm:grid cm:gap-6 cm:lg:grid-cols-[12rem_minmax(0,1fr)] cm:lg:items-start">
            <SectionNav items={sections} current={current} label="Store settings" />
            <div className="cm:flex cm:min-w-0 cm:flex-col cm:gap-6">
                <PageHeader title={title} description={description} primary={primary} />
                {children}
            </div>
        </div>
    );
}
