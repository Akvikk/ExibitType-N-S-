import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

const isSingleFile = process.env.SINGLE_FILE === '1';

export default defineConfig({
  base: isSingleFile ? './' : '/ExibitType-N-S-/',
  plugins: [
    react(), 
    tailwindcss(),
    ...(isSingleFile ? [viteSingleFile()] : [])
  ],
  resolve: {
    alias: {
      '@': path.resolve('./'),
    },
  }
});
