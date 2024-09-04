import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import ts from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from 'typescript';

export default [
  {
    input: [
      'src/index.ts',
      'src/index-fmt.ts',
      'src/index-rn.ts',
      'src/index-cli.ts',
      'src/format.ts',
      'src/sentry.ts',
      'src/sentry-rn.ts',
      'src/sentry-cli.ts',
      'src/config-cli.ts',
    ],
    output: [
      {
        format: 'cjs',
        dir: './dist',
        entryFileNames: '[name].cjs',
        exports: 'named',
        sourcemap: true,
      },
      {
        format: 'esm',
        dir: './dist',
        entryFileNames: '[name].mjs',
        exports: 'named',
        sourcemap: true,
      },
    ],
    external: [
      'lodash',
      'google-auth-library',
      'googleapis',
      '@sentry/cli',
      '@sentry/react',
      '@sentry/react-native',
      'localforage',
    ],
    plugins: [
      peerDepsExternal(),
      nodeResolve({
        modulesOnly: true,
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      }),
      commonjs({
        include: 'node_modules/**',
        ignoreDynamicRequires: true,
        sourceMap: true,
      }),
      ts({
        typescript,
        tsconfig: './tsconfig.json',
      }),
      babel({
        include: ['src/**/*.ts'],
        exclude: './node_modules/**',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        sourceMaps: true,
        babelHelpers: 'bundled',
      }),
      json({ include: 'node_modules/**' }),
    ],
  },
];
