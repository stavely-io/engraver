import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

import react from '@vitejs/plugin-react';

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const reportFile = `benchmark-report-${timestamp}.json`;

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    benchmark: {
      outputJson: path.resolve('../docs', 'benchmarks', 'data', reportFile),
      include: ['**/*.bench.?(c|m)[jt]s?(x)'],
    },
    coverage: {
      reporter: ['text', 'json', 'json-summary'],
      reportOnFailure: false,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      vexflow: path.resolve(__dirname, 'src/vexflow'),
    },
  },
});
