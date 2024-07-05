const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  staticDirs: [],
  env: (config) => {
    return {
      ...config,
      VUE_APP_BASE_API: '/api',
    };
  },
  webpackFinal: async (config) => {
    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin({
        extensions: config.resolve.extensions,
      }),
    ];

    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@formlogic/render-core-vue3': path.resolve(__dirname, '../src/index'),
      };
    }

    config.module.rules = config.module.rules
      .map((item) => {
        if (item.test?.test('.tsx')) {
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
                },
              },
            },
          ],
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            // compiles Less to CSS
            'style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {},
            },
          ],
        },
      ]);

    return config;
  },

  addons: [],
  framework: '@storybook/vue3-webpack5',
  core: {
    builder: '@storybook/builder-webpack5',
    enableCrashReports: false, // 👈 Appends the crash reports to the telemetry events
  },
};
