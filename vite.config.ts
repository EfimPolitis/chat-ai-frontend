//@ts-ignore
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  root: './',
  plugins: [react(), TanStackRouterVite()],
  resolve: {
    alias: {
      '@/api': resolve(__dirname, './src/api'),
      '@/hooks': resolve(__dirname, './src/hooks'),
      '@/types': resolve(__dirname, './src/types'),
      '@/styles': resolve(__dirname, './src/styles'),
      '@/services': resolve(__dirname, './src/services'),
      '@/constants': resolve(__dirname, './src/constants'),
      '@/components': resolve(__dirname, './src/components'),
    },
  },
  build: {
    outDir: 'dist',
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: ['profunions.ru', 'www.profunions.ru'],
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: ['profunions.ru', 'www.profunions.ru'],
  },
});
