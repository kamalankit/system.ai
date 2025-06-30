module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Only keep react-native-reanimated/plugin
      // expo-router/babel is now included in babel-preset-expo
      'react-native-reanimated/plugin',
    ],
  };
};