import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'pdf-preview.vue'),
      name: 'VuePdfPreview',
      fileName: (format) => `vue-pdf-preview.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', 'vue3-pdf-app', 'vue3-pdf-app/dist/icons/main.css'],
      output: {
        globals: {
          vue: 'Vue',
          'vue3-pdf-app': 'VuePdfApp',
        },
      },
    },
  },
});
