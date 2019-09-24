const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
});

module.exports = withBundleAnalyzer({
  webpack: (config, options) => {
    config.resolve.plugins.push(new TsconfigPathsPlugin());

    return config;
  }
});
