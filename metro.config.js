
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude website folder and build artifacts from Metro watcher and resolver
const blacklistRE = /.*[/\\]website[/\\](\.next|node_modules|.*)/;

config.resolver.blockList = [
  ...(Array.isArray(config.resolver.blockList) ? config.resolver.blockList : [config.resolver.blockList].filter(Boolean)),
  blacklistRE,
];

module.exports = config;
