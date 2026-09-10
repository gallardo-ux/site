// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://example.com',
  image: {
    // Sharp's native binary is blocked by this machine's Windows Application
    // Control policy, so use the passthrough service. Images in src/assets/work
    // are already pre-sized .webp, so no runtime optimization is needed.
    service: { entrypoint: 'astro/assets/services/noop' },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
