import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue'; // Assuming you're using Vue

export default defineConfig({
  root: './src', // Sets the root directory to ./src
  plugins: [vue({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 2
          }
        }
      }
  })], // Include the Vue plugin (adjust if you're not using Vue)
  resolve: {
    alias: {
      vue: '@vue/compat',
      '@': '/'
    }
  },
  build: {
    // Adjust the output directory since root is now src
    outDir: '../dist', // Outputs to project root/dist instead of src/dist
    emptyOutDir: true // Clears the output directory before building
  },
  server: {
    port: 8081
  }
});