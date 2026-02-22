import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                demo: resolve(__dirname, 'demo.html'),
                pricing: resolve(__dirname, 'pricing.html'),
                compare: resolve(__dirname, 'compare.html'),
                help: resolve(__dirname, 'help.html'),
                contact: resolve(__dirname, 'contact.html'),
                create: resolve(__dirname, 'create.html'),
                about: resolve(__dirname, 'about.html'),
                checkout: resolve(__dirname, 'checkout.html'),
                success: resolve(__dirname, 'success.html'),
                privacy: resolve(__dirname, 'privacy.html'),
                terms: resolve(__dirname, 'terms.html'),
                refund: resolve(__dirname, 'refund.html'),
                'data-policy': resolve(__dirname, 'data-policy.html'),
                'delete-request': resolve(__dirname, 'delete-request.html'),
            },
        },
    },
});