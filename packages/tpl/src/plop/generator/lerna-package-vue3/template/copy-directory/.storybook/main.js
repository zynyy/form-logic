const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const path = require('node:path');

module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  staticDirs: [],
  addons: [
    {
      name: '@storybook/addon-storysource',
      options: {
        rule: {
          // test: [/\.stories\.jsx?$/], This is default
          include: [path.resolve(__dirname, '../src')], // You can specify directories
        },
        loaderOptions: {
          prettierConfig: { printWidth: 80, singleQuote: false },
        },
      },
    },
  ],
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

    config.module.rules = config.module.rules.concat([
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
  framework: '@storybook/vue3-webpack5',
  core: {
    builder: '@storybook/builder-webpack5',
    enableCrashReports: false, // 👈 Appends the crash reports to the telemetry events
  },
};
