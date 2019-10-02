const { EnvironmentPlugin } = require("webpack");
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const WithBundleAnalyzer = require("@next/bundle-analyzer");
const withCSS = require("@zeit/next-css");

const withBundleAnalyzer = WithBundleAnalyzer({
  enabled: process.env.ANALYZE === "true"
});
const { parsed: myEnv } = dotenvExpand(dotenv.config());

if (!myEnv.APP_ID || !myEnv.ENVIRONMENT || !myEnv.VERSION) {
  throw Error("environment variables not setup, please check README");
} else {
  console.log(".env", myEnv);
}

function removeMinimizeOptionFromCssLoaders(config) {
  console.warn(
    "Removing `minimize` option from `css-loader` entries in Webpack config"
  );

  config.module.rules.forEach(rule => {
    if (Array.isArray(rule.use)) {
      rule.use.forEach(u => {
        if (u.loader === "css-loader" && u.options) {
          delete u.options.minimize;
        }
      });
    }
  });

  return config;
}

module.exports = withCSS(
  withBundleAnalyzer({
    webpack: config => {
      config.plugins.push(new EnvironmentPlugin(myEnv));
      config.resolve.plugins.push(new TsconfigPathsPlugin());

      config = removeMinimizeOptionFromCssLoaders(config);
      return config;
    }
  })
);
