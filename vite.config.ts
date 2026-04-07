import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  base: './',
  plugins: [
    react(), 
    tailwindcss(),
    viteSingleFile()
  ],
  resolve: {
    alias: {
      '@': path.resolve('./'),
    },
  }
});
