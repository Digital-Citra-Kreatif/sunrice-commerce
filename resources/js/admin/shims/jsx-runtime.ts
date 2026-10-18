/** The automatic JSX runtime, on the admin's React from window.Sunrice. */
import type * as ReactTypes from 'react';

const React = window.Sunrice.React;

type Props = Record<string, unknown> | null;

export const Fragment = React.Fragment;

export function jsx(type: ReactTypes.ElementType, props: Props, key?: ReactTypes.Key): ReactTypes.ReactElement {
    return React.createElement(type, key === undefined ? props : { ...props, key });
}

export const jsxs = jsx;
export const jsxDEV = jsx;
