import { getPkgDeps, checkFile } from './utils';
import createServer from './utils/createServer';
import watchFile from './utils/watchFile';

import { toArray, getButtonMeta, getContainerMeta } from './utils/fieldMeta';

import { getModelPageAllData } from './utils/modelPage';

import { componentRouter } from './router/component';

import { getModelAllData, getModelDetail } from './utils/model';

import { getModelLogic, getCommonLogic } from './utils/logic';

import { DEFAULT_CONFIG } from './utils/constant.cjs';
import { modelRouter } from './router/model';
import { logicRouter } from './router/logic';
import { modelPageRouter } from './router/modelPage';
import { fieldMetaRouter } from './router/fieldMeta';

import { getConfig } from './utils/config.cjs';
import { validateRulesRouter } from './router/validateRules';

class Dev {
  config = DEFAULT_CONFIG;

  constructor() {
    this.config = getConfig();
  }

  connect = async (req, res) => {
    this.send(res, {
      connect: true,
    });
  };

  getPkgDependencies = async (req, res) => {
    this.send(res, {
      pkgDependencies: getPkgDeps(),
    });
  };

  send = (res, data, msg) => {
    const json = {
      code: msg ? 500 : 200,
      msg: msg ?? '',
      data: data ?? {},
    };
    res.status(200).json(json);
  };

  sendPage = (res, { data, current, pageSize }) => {
    const startIndex = (current - 1) * pageSize;

    const endIndex = current * pageSize;

    this.send(res, {
      current,
      pageSize,
      total: data.length,
      list: data.slice(startIndex, endIndex),
    });
  };

  modelOrPageList = async (req, res) => {
    const { type, model } = req.query;

    const { outputPath } = this.config || {};

    if (type === 'model') {
      const modelData = getModelAllData({ outputPath });

      return this.send(res, modelData);
    }

    const pageConfigData = getModelPageAllData({ outputPath, model });
    return this.send(res, pageConfigData);
  };

  modelFiledList = (req, res) => {
    const { model, isContainer, isColumn, isButton } = req.query;

    if (!model) {
      return this.send(res, false, `model 不能为空`);
    }

    const { outputPath } = this.config || {};

    if (isColumn) {
      const { metas } = getModelDetail({
        outputPath,
        code: model,
      });
      return this.send(res, toArray(metas));
    }

    if (isButton) {
      return this.send(res, getButtonMeta({ outputPath }));
    }

    if (isContainer) {
      return this.send(res, getContainerMeta({ outputPath }));
    }

    return this.send(res, []);
  };

  modelLogicList = async (req, res) => {
    const { model } = req.query;

    const { outputPath } = this.config || {};
    const modelLogic = getModelLogic({ outputPath, modelCode: model });
    const comLogic = getCommonLogic({ outputPath, modelCode: model });

    return this.send(res, modelLogic.concat(comLogic));
  };

  sequential = async (req, res) => {
    const { time } = req.query;

    setTimeout(() => {
      this.send(res, time);
    }, time * 1000);
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
    app.use(modelPageRouter);
    app.use(logicRouter);
    app.use(modelRouter);
    app.use(componentRouter);
    app.use(fieldMetaRouter);
    app.use(validateRulesRouter);

    app.get('/local-api/sequential', this.sequential);

    app.get('/local-api/connect', this.connect);
    app.get('/local-api/pkgDependencies', this.getPkgDependencies);
    app.get('/local-api/model-or-page/list', this.modelOrPageList);
    app.get('/local-api/model-filed/list', this.modelFiledList);
    app.get('/local-api/model-logic/list', this.modelLogicList);

    app.use(function (req, res) {
      res.status(404).json({
        code: 200,
        msg: '404',
        data: {
          url: req.url,
        },
      });
    });
  };
}

export const devServer = () => {
  const server = new Dev();
  server.run();
};
