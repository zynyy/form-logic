const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api/local-api',
    createProxyMiddleware({
      target: `http://127.0.0.1:3200`,
      changeOrigin: true,
      pathRewrite: (path) => {
        return path.replace(/^\/api/, '');
      },
    }),
  );
};
