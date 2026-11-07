/**
 * The few icons commerce's own components draw, in lucide's style (24×24, 2px strokes),
 * so they match the panel's icons without bundling an icon set.
 */
type IconProps = { className?: string };

function Icon({ className, children }: IconProps & { children: React.ReactNode }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            className={className ?? 'cm:size-4'} aria-hidden="true">
            {children}
        </svg>
    );
}

export const SearchIcon = (p: IconProps) => <Icon {...p}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Icon>;
export const ColumnsIcon = (p: IconProps) => <Icon {...p}><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18M15 3v18" /></Icon>;
export const FilterIcon = (p: IconProps) => <Icon {...p}><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></Icon>;
export const ArrowUpIcon = (p: IconProps) => <Icon {...p}><path d="m5 12 7-7 7 7M12 19V5" /></Icon>;
export const ArrowDownIcon = (p: IconProps) => <Icon {...p}><path d="M12 5v14M19 12l-7 7-7-7" /></Icon>;
export const ArrowUpDownIcon = (p: IconProps) => <Icon {...p}><path d="m21 16-4 4-4-4M17 20V4M3 8l4-4 4 4M7 4v16" /></Icon>;
export const ChevronLeftIcon = (p: IconProps) => <Icon {...p}><path d="m15 18-6-6 6-6" /></Icon>;
export const ChevronRightIcon = (p: IconProps) => <Icon {...p}><path d="m9 18 6-6-6-6" /></Icon>;
export const XIcon = (p: IconProps) => <Icon {...p}><path d="M18 6 6 18M6 6l12 12" /></Icon>;
