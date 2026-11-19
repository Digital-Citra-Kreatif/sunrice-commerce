import type { ReactNode } from 'react';
import { inertia, ui } from '../lib/sunrice';

export interface HeaderMenuItem {
    label: ReactNode;
    href?: string;
    onSelect?: () => void;
    icon?: ReactNode;
    external?: boolean;
    download?: boolean;
    group?: string;
    destructive?: boolean;
}

/**
 * The panel's page header (title in the display style, description, back
 * button) with commerce's actions: `primary`, the one prominent button,
 * `menu`, the secondary actions in a "⋮" menu, and `actions`, other
 * buttons before them. Also sets the document title.
 */
export function PageHeader({ title, description, actions, primary, menu, back, children }: {
    title: string;
    description?: ReactNode;
    actions?: ReactNode;
    primary?: ReactNode;
    menu?: HeaderMenuItem[];
    back?: { href: string; label: string };
    children?: ReactNode;
}) {
    const { Head } = inertia;
    const { PageHeader: PanelHeader } = ui;

    return (
        <>
            <Head title={title} />
            <PanelHeader title={title} description={description} actions={actions} primary={primary} menu={menu?.length ? menu : undefined} back={back}>
                {children}
            </PanelHeader>
        </>
    );
}
