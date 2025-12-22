import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: __dirname,
  base: '/react-split-pane/',
  resolve: {
    alias: {
      '../src': resolve(__dirname, '../src'),
    },
  },
  build: {
    outDir: resolve(__dirname, '../dist-examples'),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    open: true,
  },
});
