const path = require('path');

/* eslint-disable import/no-extraneous-dependencies */
const {
  override,
  addWebpackAlias,
  addWebpackExternals,
  addWebpackModuleRule,
  addWebpackPlugin,
} = require('customize-cra');

const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const eslintConfig = require('./.eslintrc.js');

const useEslintConfig = (configRules) => (config) => {
  config.module.rules = config.module.rules.map((rule) => {
    if (rule.use && rule.use.some((use) => use.options && use.options.useEslintrc !== 0)) {
      const ruleUse = rule.use[0];
      const baseOptions = ruleUse.options;
      const baseConfig = baseOptions.baseConfig || {};
      ruleUse.options = {
        useEslintrc: false,
        ignore: true,
        baseConfig: { ...baseConfig, ...configRules },
      };
      return rule;
    }
    return rule;
  });
  return config;
};


const useSupportCjs = () => (config) => {
  config.module.rules = config.module.rules.map(rule => {
    if (rule.oneOf instanceof Array) {
      rule.oneOf[rule.oneOf.length - 1].exclude = [/\.(js|mjs|jsx|cjs|ts|tsx)$/, /\.html$/, /\.json$/];
    }
    return rule;
  });
  return config;
};

module.exports = override(
  addWebpackExternals(), // cdn

  addWebpackPlugin(
    new MonacoWebpackPlugin({
      languages: ['javascript', 'json'],
    }),
  ),
  //  addBundleVisualizer(),
  addWebpackAlias({
    '@': path.resolve(__dirname, './src/'),
  }),
  useEslintConfig(eslintConfig),
  addWebpackModuleRule({
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    issuer: /\.[jt]sx?$/,
    use: ['babel-loader', '@svgr/webpack', 'url-loader'],
  }),
  useSupportCjs(),
);
