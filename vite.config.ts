import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
    preview: {
        port: 8291,
    },
    server: {
        port: 8291,
    },
});
