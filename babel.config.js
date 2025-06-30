module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': './', // now `@/components/...` maps to project root
          },
        },
      ],
      'react-native-reanimated/plugin', // must be last
    ],
  };
};
