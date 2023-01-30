const path = require('path');

/* eslint-disable import/no-extraneous-dependencies */
const {
  override,
  addWebpackAlias,
  addWebpackExternals,
  addWebpackModuleRule,
  addWebpackPlugin,
  overrideDevServer,
  watchAll,
  setWebpackOptimizationSplitChunks,
} = require('customize-cra');

const SSEStream = require('ssestream');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const CopyPlugin = require('copy-webpack-plugin');

const createPages = (pages) => {
  return pages.map(({ filename, template, chunk }) => {
    return new HtmlWebpackPlugin({
      filename,
      template,
      inject: 'body',
      chunks: [chunk],
    });
  });
};

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

const reloadServer = (app, compiler) => {
  app.get('/reload', (req, res, next) => {
    const sseStream = new SSEStream(req);
    sseStream.pipe(res);

    let closed = false;

    const reloadPlugin = () => {
      if (!closed) {
        sseStream.write(
          {
            event: 'compiled successfully',
            data: {
              action: 'reload extension and refresh current page',
            },
          },
          'utf-8',
          (err) => {
            if (err) {
              console.error(err);
            }
          },
        );

        setTimeout(() => {
          sseStream.unpipe(res);
        }, 100);
      }
    };

    compiler.hooks.done.tap('chrome reload plugin', reloadPlugin);

    res.on('close', () => {
      closed = true;
      sseStream.unpipe(res);
    });

    next();
  });
};

const addEntry = () => (config) => {
  config.entry = {
    main: path.resolve(__dirname, 'src/index.tsx'),
    popup: path.resolve(__dirname, 'src/popup.tsx'),
    devPanel: path.resolve(__dirname, 'src/devPanel.tsx'),
    inject: path.resolve(__dirname, 'src/inject.ts'),
    backend: path.resolve(__dirname, 'src/backend.ts'),
    contentScript: path.resolve(__dirname, 'src/contentScript.ts'),
    background: path.resolve(__dirname, 'src/background.ts'),
    devtools: path.resolve(__dirname, 'src/devtools.ts'),
  };

  config.plugins = config.plugins
    .map((plugin) => {
      if (plugin.constructor?.name === 'HtmlWebpackPlugin') {
        return new HtmlWebpackPlugin({
          ...plugin.userOptions,
          chunks: ['main'],
        });
      }
      return plugin;
    })
    .concat(
      createPages([
        {
          filename: 'popup.html',
          template: path.resolve(__dirname, 'public/index.html'),
          chunk: 'popup',
        },
        {
          filename: 'devtools.html',
          template: path.resolve(__dirname, 'public/index.html'),
          chunk: 'devtools',
        },
        {
          filename: 'devpanel.html',
          template: path.resolve(__dirname, 'public/index.html'),
          chunk: 'devPanel',
        },
      ]),
    );

  config.output.filename = (pathData) => {
    if (['inject', 'backend', 'background', 'contentScript'].includes(pathData.chunk.name)) {
      return 'static/js/[name].js';
    }
    return 'static/js/[name].bundle.[chunkhash].js';
  };

  return config;
};

const devServerConfig = () => (config) => {
  return {
    ...config,
    setupMiddlewares(middlewares, devServer) {
      reloadServer(devServer.app, devServer.compiler);
      return middlewares;
    },
  };
};

const useSupportCjs = () => (config) => {
  config.module.rules = config.module.rules.map((rule) => {
    if (rule.oneOf instanceof Array) {
      rule.oneOf[rule.oneOf.length - 1].exclude = [
        /\.(js|mjs|jsx|cjs|ts|tsx)$/,
        /\.html$/,
        /\.json$/,
      ];
    }
    return rule;
  });
  return config;
};

module.exports = {
  webpack: override(
    addWebpackExternals(), // cdn
    setWebpackOptimizationSplitChunks({
      chunks: 'all',
    }),
    addWebpackPlugin(
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'src/low-code-meta/model-page'),
            to: 'low-code-meta/model-page',
          },
          {
            from: path.resolve(
              __dirname,
              'node_modules/@formlogic/component/node_modules/monaco-editor/min/vs',
            ),
            to: 'monaco-editor/vs',
          },
        ],
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
    addEntry(),
  ),
  devServer: overrideDevServer(devServerConfig(), watchAll()),
};
