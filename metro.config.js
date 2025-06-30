const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

// Enable CSS support for web
config.resolver.assetExts.push('css');

// Ensure proper source extensions
config.resolver.sourceExts.push('js', 'jsx', 'json', 'ts', 'tsx', 'mjs');

module.exports = config;