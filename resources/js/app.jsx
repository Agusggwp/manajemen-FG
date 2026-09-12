import '../css/app.css';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import AppLayout from '@/components/layouts/AppLayout';
import { Toaster } from '@/components/ui/sonner';

const appName = import.meta.env.VITE_APP_NAME || 'ARTDEVATA Photography';

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: async (name) => {
        const page = await resolvePageComponent(`./pages/${name}.jsx`, import.meta.glob('./pages/**/*.jsx'));
        
        // Auto-assign default persistent layout if not explicitly defined on the page
        if (page.default.layout === undefined) {
            if (name.startsWith('Admin/') || name.startsWith('Photographer/')) {
                page.default.layout = (children) => <AppLayout>{children}</AppLayout>;
            }
        }
        
        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <>
                <App {...props} />
                <Toaster />
            </>
        );
    },
    progress: {
        color: '#0f172a',
    },
});

