const { EnvironmentPlugin } = require("webpack");
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const WithBundleAnalyzer = require("@next/bundle-analyzer");

const withBundleAnalyzer = WithBundleAnalyzer({
  enabled: process.env.ANALYZE === "true"
});
const { parsed: myEnv } = dotenvExpand(dotenv.config());

if (!myEnv.APP_ID || !myEnv.ENVIRONMENT || !myEnv.VERSION) {
  throw Error("environment variables not setup, please check README");
} else {
  console.log(".env", myEnv);
}

module.exports = withBundleAnalyzer({
  webpack: config => {
    config.plugins.push(new EnvironmentPlugin(myEnv));
    config.resolve.plugins.push(new TsconfigPathsPlugin());

    return config;
  }
});
