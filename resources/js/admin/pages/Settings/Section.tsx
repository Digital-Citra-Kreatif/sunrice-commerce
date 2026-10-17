import { SchemaFormView, type SchemaFormProps } from '../../components/SchemaFormView';
import { SettingsLayout } from '../../components/SettingsLayout';
import type { MenuItem } from '../../lib/store';

export default function Section({ section, sections, form }: { section: { key: string; label: string }; sections: MenuItem[]; form: SchemaFormProps }) {
    return (
        <SettingsLayout sections={sections} current={section.key} title={`${section.label} settings`}>
            {/* A fresh form per section: values don't carry over between sections. */}
            <SchemaFormView key={section.key} form={form} />
        </SettingsLayout>
    );
}
