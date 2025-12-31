import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';
import path from 'path';

const isDockerBuild = process.env.VITE_DOCKER_BUILD === 'true';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
            // En builds dentro de Docker evitamos ejecutar `php artisan`
            // y asumimos que los tipos ya fueron generados previamente.
            command: isDockerBuild ? 'true' : 'php artisan wayfinder:generate --with-form',
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
        },
    },
    esbuild: {
        jsx: 'automatic',
    },
    server: {
        watch: {
            ignored: ['**/vendor/**', '**/storage/**'],
        },
    },
});
