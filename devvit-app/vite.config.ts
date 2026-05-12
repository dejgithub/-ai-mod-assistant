import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: path.resolve(__dirname, 'src/server/index.ts'),
      formats: ['cjs'],
      fileName: () => 'server.js',
    },
    rollupOptions: {
      external: [
        '@devvit/public-api',
        '@devvit/web/server',
        '@devvit/web/shared',
      ],
    },
    minify: false,
    sourcemap: true,
  },
});
