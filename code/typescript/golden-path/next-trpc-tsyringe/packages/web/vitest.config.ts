import path from 'node:path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 60000,
    hookTimeout: 60000,
    setupFiles: ['dotenv/config'],
  },
  // @ts-expect-error
  plugins: [swc.vite()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
});
