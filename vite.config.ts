import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

const shim = (name: string) => fileURLToPath(new URL(`./resources/js/admin/shims/${name}.ts`, import.meta.url));

/**
 * The admin bundle the panel loads on the Commerce/ pages and, for the
 * field inputs, on the CMS's (CommercePlugin's PluginBundle). React,
 * ReactDOM, Inertia and the panel's UI are not bundled: the shims read
 * them from window.Sunrice.modules, so the bundle shares the panel's.
 */
export default defineConfig({
    plugins: [tailwindcss()],
    // Library mode leaves process.env in dependencies (recharts, redux); the browser has none.
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
    resolve: {
        alias: [
            { find: /^react\/jsx-runtime$/, replacement: shim('jsx-runtime') },
            { find: /^react\/jsx-dev-runtime$/, replacement: shim('jsx-runtime') },
            { find: /^react-dom$/, replacement: shim('react-dom') },
            { find: /^react$/, replacement: shim('react') },
            { find: /^@inertiajs\/react$/, replacement: shim('inertia') },
            { find: '@', replacement: fileURLToPath(new URL('./resources/js/admin', import.meta.url)) },
        ],
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        manifest: 'manifest.json',
        cssCodeSplit: false,
        lib: {
            entry: fileURLToPath(new URL('./resources/js/admin/main.tsx', import.meta.url)),
            formats: ['es'],
            fileName: () => 'admin.js',
            cssFileName: 'admin',
        },
    },
});
