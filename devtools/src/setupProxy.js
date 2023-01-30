// https://github.com/chimurai/http-proxy-middleware#example
const { createProxyMiddleware } = require('http-proxy-middleware');

const { ip, port } = require('../formlogic.config');

module.exports = function (app) {
  app.use(
    '/local-api',
    createProxyMiddleware({
      target: `http://${ip}:${port}`,
      changeOrigin: true,
    }),
  );
};
