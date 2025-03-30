import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname, 'src'),
  plugins: [vue()],
  server: {
    port: 8081,
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js',
      pouchdb: "pouchdb/dist/pouchdb",
      '@': resolve(__dirname, 'src'),
    },
  },
});
