const sharedPresets = ['@babel/preset-react', '@babel/typescript'];
const shared = {
  presets: sharedPresets,
};

module.exports = {
  env: {
    esmUnbundled: shared,
    esmBundled: {
      ...shared,
      presets: [
        [
          '@babel/env',
          {
            targets: '> 0.25%, not dead',
          },
        ],
        ...sharedPresets,
      ],
    },
    cjs: {
      ...shared,
      presets: [
        [
          '@babel/env',
          {
            modules: 'commonjs',
          },
        ],
        ...sharedPresets,
      ],
    },
    test: {
      presets: ['@babel/env', ...sharedPresets],
    },
  },
};
