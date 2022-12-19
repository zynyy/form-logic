const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');


module.exports = {
  webpackFinal: async (config) => {
    console.log(config.resolve.plugins);
    config.resolve.plugins = [
      ...(config.resolve.plugins || []),

      new TsconfigPathsPlugin({
        extensions: config.resolve.extensions,
      }),

    ];
    return config;
  },
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/react-webpack5',
  core: {
    builder: {
      name: 'webpack5',
    },
    enableCrashReports: false, // 👈 Appends the crash reports to the telemetry events
  },
};
