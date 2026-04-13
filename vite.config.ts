import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      exclude: ['src/**/__docs__', 'src/**/__test__'],
    }),
  ],
  build: {
    emptyOutDir: false,
    target: 'esnext',
    sourcemap: false,
    minify: 'oxc',
    lib: {
      entry: {
        'config-cli': resolve(__dirname, 'src/config-cli.ts'),
        format: resolve(__dirname, 'src/format.ts'),
        hooks: resolve(__dirname, 'src/hooks.ts'),
        i18n: resolve(__dirname, 'src/i18n.ts'),
        'index-cli': resolve(__dirname, 'src/index-cli.ts'),
        'index-rn': resolve(__dirname, 'src/index-rn.ts'),
        index: resolve(__dirname, 'src/index.ts'),
        'sentry-cli': resolve(__dirname, 'src/sentry-cli.ts'),
        'sentry-rn': resolve(__dirname, 'src/sentry-rn.ts'),
        sentry: resolve(__dirname, 'src/sentry.ts'),
        utils: resolve(__dirname, 'src/utils.ts'),
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react-native',
        'howler',
        'lodash-es',
        'google-auth-library',
        'googleapis',
        '@sentry/cli',
        '@sentry/react',
        '@sentry/react-native',
        'localforage',
        'fs',
        'path',
        'process',
        'os',
        'stream',
        'http',
        'https',
        'readline',
        'zlib',
        'url',
        'child_process',
        'crypto',
        'events',
        'util',
        'module',
        'events',
        /^node:/,
      ],
      output: {
        exports: 'named',
      },
    },
  },
});
