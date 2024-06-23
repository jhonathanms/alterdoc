import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { PrimeVueResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import VueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    VueDevTools(),
    Components({
      resolvers: [PrimeVueResolver()]
    }),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      pwaAssets: {
        disabled: false,
        config: true
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Alterdoc',
        short_name: 'Alterdoc',
        start_url: '/',
        display: 'standalone',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        icons: [
          {
            src: './src/assets/icon/windows11/StoreLogo.scale-400.png',
            sizes: '200x200',
            type: 'image/png'
          },
          {
            src: './src/assets/icon/windows11/StoreLogo.scale-400.png',
            sizes: '200x200',
            type: 'image/png'
          },
          {
            src: './src/assets/icon/windows11/Square150x150Logo.scale-400.png',
            sizes: '600x600',
            type: 'image/png'
          },
          {
            src: './src/assets/icon/windows11/Wide310x150Logo.scale-400.png',
            sizes: '1240x600',
            type: 'image/png',
          }
        ]
      },
      devOptions: {
        enabled: true,
        navigateFallback: './index.html',
        suppressWarnings: true,
        type: 'module'
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
