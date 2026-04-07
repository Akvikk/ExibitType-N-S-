import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/ExibitType-N-S-/',
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      '@': path.resolve('./'),
    },
  }
});
