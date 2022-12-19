const {
  getConfig,
  DEFAULT_CONFIG,
  getPkgDeps,
  generateLogic,
  getLogicDsl,
  checkFile,
} = require('./utils');
const createServer = require('./utils/createServer');
const watchFile = require('./utils/watchFile');

class Dev {
  config = DEFAULT_CONFIG;

  constructor() {
    this.config = getConfig();
  }

  sendBody = (data, msg) => {
    return {
      code: msg ? 500 : 200,
      msg: msg ?? '',
      data: data || {},
    };
  };

  send = (res, json) => {
    res.status(200).json(json).end();
  };

  save = async (req, res) => {
    const { dsl, code, files, pageCode } = req.body;

    if (!code) {
      this.send(res, this.sendBody(false, `code 不能为空`));
      return;
    }

    const { outputPath, fileExt } = this.config || {};

    generateLogic({
      outputPath,
      code,
      pageCode,
      files,
      dsl,
      fileExtension: fileExt,
    });

    this.send(
      res,
      this.sendBody({
        dsl,
        files,
      }),
    );
  };

  connect = (req, res) => {
    this.send(
      res,
      this.sendBody({
        connect: true,
      }),
    );
  };

  getPkgDependencies = (req, res) => {
    this.send(res, {
      pkgDependencies: getPkgDeps(),
    });
  };

  logicDetail = (req, res) => {
    const { code, pageCode } = req.query;

    if (!code) {
      this.send(res, this.sendBody(false, `code 不能为空`));
      return;
    }

    const { outputPath, fileExt } = this.config || {};

    const dsl = getLogicDsl({
      outputPath,
      fileExt,
      code,
      pageCode,
    });

    this.send(res, this.sendBody(dsl));
  };

  run = () => {
    const { port, outputPath, fileExt } = this.config || {};

    if (outputPath) {
      watchFile(outputPath);
      checkFile(outputPath, fileExt);
    } else {
      throw '配置文件formlogic.config.js里的outputPath不能为空';
    }

    const app = createServer(port);

    app.post('/local-api/save', this.save);
    app.get('/local-api/connect', this.connect);
    app.get('/local-api/pkgDependencies', this.getPkgDependencies);
    app.get('/local-api/logicDetail', this.logicDetail);
  };
}

const devServer = new Dev();

devServer.run();
