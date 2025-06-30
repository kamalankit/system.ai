const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable CSS support for web
config.resolver.assetExts.push('css');

// Ensure proper source extensions
config.resolver.sourceExts.push('js', 'jsx', 'json', 'ts', 'tsx', 'mjs');

module.exports = config;