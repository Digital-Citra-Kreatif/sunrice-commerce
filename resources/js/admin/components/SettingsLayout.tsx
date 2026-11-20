import type { ReactNode } from 'react';
import { adminUrl, useBreadcrumbs } from '../lib/sunrice';
import { useCommerceShared, type MenuItem } from '../lib/store';
import { PageHeader } from './PageHeader';
import { SectionNav } from './SectionNav';

/**
 * Store settings with a section menu beside the current form on desktop.
 * With `parent` (a page inside a section, e.g. one payment method), the
 * breadcrumbs and the header's back button lead to it.
 */
export function SettingsLayout({ sections, current, title, description, primary, parent, children }: {
    sections: MenuItem[];
    current: string;
    title: string;
    description?: ReactNode;
    primary?: ReactNode;
    parent?: { label: string; href: string };
    children: ReactNode;
}) {
    useCommerceShared();
    const back = parent ? { label: parent.label, href: adminUrl(parent.href) } : undefined;
    useBreadcrumbs([{ label: 'Shop' }, { label: 'Store settings', href: adminUrl('commerce/settings') }, ...(back ? [back] : []), { label: title }]);

    return (
        <div className="cm:grid cm:gap-6 cm:lg:grid-cols-[12rem_minmax(0,1fr)] cm:lg:items-start">
            <SectionNav items={sections} current={current} label="Store settings" />
            <div className="cm:flex cm:min-w-0 cm:flex-col cm:gap-6">
                <PageHeader title={title} description={description} primary={primary} back={back} />
                {children}
            </div>
        </div>
    );
}
