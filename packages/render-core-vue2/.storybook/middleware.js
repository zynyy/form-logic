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
  app.use(
    '/api',
    createProxyMiddleware({
      target: `xx.com`,
      changeOrigin: true,
    }),
  );
  app.use(
    '/oss',
    createProxyMiddleware({
      target: `xx.com`,
      changeOrigin: true,
    }),
  );
};
