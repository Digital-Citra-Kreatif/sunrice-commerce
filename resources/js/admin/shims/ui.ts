/**
 * `@imajiner/admin-sdk/ui` for the commerce bundle: the panel's own copy, from
 * window.Sunrice.modules (the panel's runtime, version 3), so the bundle
 * shares the admin's single React, Inertia and UI. Generated from
 * @imajiner/admin-sdk's SHARED_MODULES (tests/Frontend checks the list).
 */
const m = (globalThis as { Sunrice?: { modules?: Record<string, Record<string, any>> } }).Sunrice?.modules?.["@imajiner/admin-sdk/ui"]; // eslint-disable-line @typescript-eslint/no-explicit-any
if (!m) {
    throw new Error('[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).');
}

export const Badge = m.Badge;
export const Button = m.Button;
export const Card = m.Card;
export const CardContent = m.CardContent;
export const CardDescription = m.CardDescription;
export const CardFooter = m.CardFooter;
export const CardHeader = m.CardHeader;
export const cardSummary = m.cardSummary;
export const CardTitle = m.CardTitle;
export const Checkbox = m.Checkbox;
export const CodeEditor = m.CodeEditor;
export const CollapsibleCard = m.CollapsibleCard;
export const CollapsibleCardGroup = m.CollapsibleCardGroup;
export const Command = m.Command;
export const CommandEmpty = m.CommandEmpty;
export const CommandGroup = m.CommandGroup;
export const CommandInput = m.CommandInput;
export const CommandItem = m.CommandItem;
export const CommandList = m.CommandList;
export const CommandSeparator = m.CommandSeparator;
export const DatePicker = m.DatePicker;
export const DeveloperHelp = m.DeveloperHelp;
export const Dialog = m.Dialog;
export const DialogContent = m.DialogContent;
export const DialogDescription = m.DialogDescription;
export const DialogFooter = m.DialogFooter;
export const DialogHeader = m.DialogHeader;
export const DialogTitle = m.DialogTitle;
export const DialogTrigger = m.DialogTrigger;
export const DropdownMenu = m.DropdownMenu;
export const DropdownMenuCheckboxItem = m.DropdownMenuCheckboxItem;
export const DropdownMenuContent = m.DropdownMenuContent;
export const DropdownMenuItem = m.DropdownMenuItem;
export const DropdownMenuLabel = m.DropdownMenuLabel;
export const DropdownMenuSeparator = m.DropdownMenuSeparator;
export const DropdownMenuTrigger = m.DropdownMenuTrigger;
export const FormSections = m.FormSections;
export const Input = m.Input;
export const KeptEditsNotice = m.KeptEditsNotice;
export const Label = m.Label;
export const LanguageTabs = m.LanguageTabs;
export const LinkAttributes = m.LinkAttributes;
export const LinkSourcePicker = m.LinkSourcePicker;
export const MediaPickerInput = m.MediaPickerInput;
export const moveItem = m.moveItem;
export const PageHeader = m.PageHeader;
export const Popover = m.Popover;
export const PopoverAnchor = m.PopoverAnchor;
export const PopoverContent = m.PopoverContent;
export const PopoverTrigger = m.PopoverTrigger;
export const registerCommandSource = m.registerCommandSource;
export const RichTextEditor = m.RichTextEditor;
export const Select = m.Select;
export const SelectContent = m.SelectContent;
export const SelectItem = m.SelectItem;
export const SelectTrigger = m.SelectTrigger;
export const SelectValue = m.SelectValue;
export const Separator = m.Separator;
export const SettingsLayout = m.SettingsLayout;
export const SettingsNav = m.SettingsNav;
export const Skeleton = m.Skeleton;
export const SortableHandle = m.SortableHandle;
export const SortableList = m.SortableList;
export const Switch = m.Switch;
export const Table = m.Table;
export const TableBody = m.TableBody;
export const TableCell = m.TableCell;
export const TableHead = m.TableHead;
export const TableHeader = m.TableHeader;
export const TableRow = m.TableRow;
export const Tabs = m.Tabs;
export const TabsContent = m.TabsContent;
export const TabsList = m.TabsList;
export const TabsTrigger = m.TabsTrigger;
export const Textarea = m.Textarea;
export const Tooltip = m.Tooltip;
export const TooltipContent = m.TooltipContent;
export const TooltipTrigger = m.TooltipTrigger;
export const toast = m.toast;
export const TrashBanner = m.TrashBanner;
export const TrashHint = m.TrashHint;
export const TrashTitle = m.TrashTitle;
export const useBreadcrumbs = m.useBreadcrumbs;
export const useEditLock = m.useEditLock;
export const useTablePreferences = m.useTablePreferences;
export const useUnsavedChanges = m.useUnsavedChanges;
export const ViewingNotice = m.ViewingNotice;
