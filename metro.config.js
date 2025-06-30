const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure these extensions are supported
config.resolver.assetExts.push('css');

// Add platform extensions for better resolution
config.resolver.platforms = ['native', 'android', 'ios', 'web'];

module.exports = config;