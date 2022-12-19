const express = require('express');
const bodyParser = require('body-parser');

const { DEFAULT_EXPRESS_PORT } = require('./index');

const createServer = (port) => {
  const app = express();

  const nowPort = port || DEFAULT_EXPRESS_PORT;

  app.use(bodyParser.json({ limit: '50mb' }));

  app.use(bodyParser.urlencoded({ extended: false }));

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  app.listen(nowPort, () => {
    console.log(`Express started on port ${nowPort}`);
  });
  return app;
};

module.exports = createServer;
