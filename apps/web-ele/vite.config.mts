import type { VbenViteConfig } from '@vben/vite-config';

import { defineConfig } from '@vben/vite-config';

import ElementPlus from 'unplugin-element-plus/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';

const config: VbenViteConfig = defineConfig(async () => {
  return {
    application: {},
    vite: {
      plugins: [
        ElementPlus({
          format: 'esm',
          useSource: true,
        }),
        Components({
          resolvers: [ElementPlusResolver()],
          dts: 'types/components.d.ts',
        }),
      ],
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'http://localhost:5320/api',
            ws: true,
          },
        },
      },
    },
  };
});

export default config;
