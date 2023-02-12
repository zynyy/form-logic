const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require("path");

module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  staticDirs: [{ from: path.resolve(__dirname, '../src/low-code-meta/model-page'), to: '/low-code-meta/model-page' }],
  webpackFinal: async (config) => {
    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin({
        extensions: config.resolve.extensions,
      }),
    ];

    config.module.rules = config.module.rules
      .map((item) => {
        if (item.test.test('.tsx')) {
          return {
            ...item,
            test: /\.stories.tsx$/,
          };
        }

        return item;
      })
      .concat([
        {
          test: /\.tsx$/,
          use: ['babel-loader'],
        },
        {
          test: /\.less$/i,
          use: [
            // compiles Less to CSS
            'style-loader',
            'css-loader',
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                }

              },
            },
          ],
        },
      ]);
    debugger;

    return config;
  },

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/vue3-webpack5',
  core: {
    builder: '@storybook/builder-webpack5',
    enableCrashReports: false, // 👈 Appends the crash reports to the telemetry events
  },
};
