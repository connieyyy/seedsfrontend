const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Modify the assetExts configuration
config.resolver.assetExts.push("cjs");

module.exports = config;
