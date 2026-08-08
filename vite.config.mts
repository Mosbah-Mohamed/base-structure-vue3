import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  server: { port: 3000 },
  plugins: [
    vue(),
    tailwindcss(),
    Components({
      dirs: [
        'src/components/ui',
        'src/components/layout',
        'src/components/global',
        'src/components/global/form',
      ],
      dts: 'components.d.ts',
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        'vue-i18n',
        'pinia',
        {
          '@tanstack/vue-query': ['useQuery', 'useMutation', 'useQueryClient'],
        },
      ],
      dirs: ['src/composables'],
      dts: 'auto-imports.d.ts',
      vueTemplate: true,
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
      },
    }),
    VueI18nPlugin({
      runtimeOnly: true,
      compositionOnly: true,
      include: [fileURLToPath(new URL('./src/plugins/i18n/locales/**', import.meta.url))],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
