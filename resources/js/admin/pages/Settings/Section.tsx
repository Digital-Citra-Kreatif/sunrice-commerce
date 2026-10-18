import { api } from '../../lib/api';
import { SchemaFormView, type SchemaFormProps } from '../../components/SchemaFormView';
import { SettingsLayout } from '../../components/SettingsLayout';
import type { MenuItem } from '../../lib/store';

/**
 * A store settings section. Extensions render their own section with
 * window.SunriceCommerce.registerSettingsSection(key, Component): the
 * component gets the schema form (values, action) and replaces the form.
 */
export default function Section({ section, sections, form }: { section: { key: string; label: string }; sections: MenuItem[]; form: SchemaFormProps }) {
    const Custom = api.settingsSections()[section.key];

    return (
        <SettingsLayout sections={sections} current={section.key} title={`${section.label} settings`}>
            {/* A fresh form per section: values don't carry over between sections. */}
            {Custom ? <Custom key={section.key} section={section} form={form} /> : <SchemaFormView key={section.key} form={form} />}
        </SettingsLayout>
    );
}
