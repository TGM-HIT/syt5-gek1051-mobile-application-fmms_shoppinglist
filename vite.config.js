import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  root: resolve(__dirname, 'src'),
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate', // Automatically update service worker
      includeAssets: [
        'favicon.ico',
        'assets/*',
        'index.html',
        'shoppinglist.css',
        'shoppinglist.js'
      ],
      workbox: {
        runtimeCaching: [
          // Caching Vue and other JS libraries
          {
            urlPattern: ({ request }) => request.destination === 'script' || request.destination === 'style',
            handler: 'CacheFirst', // Cache JS and CSS files
            options: {
              cacheName: 'assets-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 1 day
              },
            },
          },
          // Caching HTML files with NetworkFirst (fetch from the network first)
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
            },
          },
          // Caching assets like images and fonts
          {
            urlPattern: ({ url }) => /.*\.(js|css|json|woff2|woff|ttf|eot|svg|png|jpg|jpeg|gif|ico)/.test(url.pathname),
            handler: 'StaleWhileRevalidate', // Cache assets and update the cache in the background
            options: {
              cacheName: 'assets-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // Cache for 1 week
              },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 8081,
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js',
      pouchdb: 'pouchdb/dist/pouchdb',
      '@': resolve(__dirname, 'src'),
    },
  },
});
