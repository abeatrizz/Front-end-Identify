const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json', 'web.jsx', 'web.js', 'web.ts', 'web.tsx'];

module.exports = config; 