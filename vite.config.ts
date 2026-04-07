import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  base: '/ExibitType-N-S-/',
  plugins: [
    react(), 
    viteSingleFile(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'ExibitL 2.1',
        short_name: 'ExibitL',
        description: 'Offline Roulette Pattern Engine',
        theme_color: '#0a0510',
        background_color: '#0a0510',
        display: 'standalone'
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve('./'),
    },
  }
});
