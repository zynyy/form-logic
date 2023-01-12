const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  title: "demo",
  stories: [
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  webpackFinal: async (config) => {
    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin({
        extensions: config.resolve.extensions,
      }),
    ];
    return config;
  },

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/react-webpack5',
  core: {
    builder: 'webpack5',
    enableCrashReports: false, // 👈 Appends the crash reports to the telemetry events
  },
};
