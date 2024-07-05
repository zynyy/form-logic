//https://github.com/plopjs/plop
import nodePlop, { NodePlopAPI, PlopCfg } from 'node-plop';
import Liftoff from 'liftoff';
import v8flags from 'v8flags';
import interpret from 'interpret';
import path from 'node:path';
import { merge } from 'lodash-es';
import fs from 'node:fs';
import chalk from 'chalk';
import ora from 'ora';

import plopFile from './plopfile';
import { getFullFilePath } from '@/utils';

import { generateFile } from '@formlogic/package-compiler';

const DEFAULT_PLOP_FILE = getFullFilePath(import.meta.url, './plopfile.js');

const Plop = new Liftoff({
  name: 'plop',
  // @ts-ignore
  extensions: interpret.jsVariants,
  v8flags: v8flags,
});

const DefaultOptions = {};

const progressSpinner = ora({
  stream: process.stdout,
  isEnabled: true,
});

const defaultChoosingMessage = chalk.blue('[PLOP]') + ' 请选择一个生成器模板.';

export const chooseOptionFromList = async (plopList: any, message: any) => {
  const plop = await nodePlop();
  const generator = plop.setGenerator('choose', {
    prompts: [
      {
        type: 'list',
        name: 'generator',
        message: message || defaultChoosingMessage,
        choices: plopList.map(function (p: any) {
          return {
            name: p.name + chalk.gray(!!p.description ? ' - ' + p.description : ''),
            value: p.name,
          };
        }),
      },
    ],
  });
  return generator.runPrompts().then((results) => results.generator);
};

const typeDisplay = {
  function: chalk.yellow('->'),
  add: chalk.green('++'),
  'copy-file': chalk.green('++'),
  addMany: chalk.green('+!'),
  modify: `${chalk.green('+')}${chalk.red('-')}`,
  append: chalk.green('_+'),
  skip: chalk.green('--'),
};

export const typeMap = (name: keyof typeof typeDisplay) => {
  const dimType = chalk.dim(name);
  return typeDisplay[name] || dimType;
};

const doThePlop = (generator: any, bypassArr: any) => {
  let failedActions = false;
  generator
    .runPrompts(bypassArr)
    .then(async (answers: any) => {
      return answers;
    })
    .then((answers: any) => {
      const onComment = (msg: string) => {
        progressSpinner.info(msg);
        progressSpinner.start();
      };
      const onSuccess = (change: any) => {
        let line = '';
        if (change.type) {
          line += ` ${typeMap(change.type)}`;
        }
        if (change.path) {
          line += ` ${change.path}`;
        }
        progressSpinner.succeed(line);
        progressSpinner.start();
      };
      const onFailure = (fail: any) => {
        let line = '';
        if (fail.type) {
          line += ` ${typeMap(fail.type)}`;
        }
        if (fail.path) {
          line += ` ${fail.path}`;
        }
        const errMsg = fail.error || fail.message;
        if (errMsg) {
          line += ` ${errMsg}`;
        }
        progressSpinner.fail(line);
        failedActions = true;
        progressSpinner.start();
      };
      progressSpinner.start();
      return generator.runActions(answers, { onSuccess, onFailure, onComment }).then(() => {
        progressSpinner.stop();
        if (failedActions) {
          process.exit(1);
        }
      });
    })
    .catch((err: any) => {
      console.error(chalk.red('[ERROR]'), err.message);
      process.exit(1);
    });
};

export interface PlopOptions extends Liftoff.PrepareOptions, PlopCfg {
  generatorName?: string;
  plopFile?: string;
}

const createPlop = async (options: PlopOptions) => {
  const { configPath, generatorName, destBasePath, force } = merge(DefaultOptions, options);

  let plop: NodePlopAPI;
  try {
    plop = await nodePlop(configPath || DEFAULT_PLOP_FILE, {
      destBasePath: destBasePath ? path.resolve(destBasePath) : undefined,
      force: force,
    });
  } catch (e) {
    console.error(chalk.red('[PLOP] ') + ` 无法读取配置文件 ${configPath}`, e);
    return;
  }

  if (configPath) {
    plopFile(plop);
  }

  const generators = plop.getGeneratorList();

  if (!generators.length) {
    console.error(chalk.red('[PLOP] ') + ` 无法找到一个生成器模板`);
    process.exit(1);
  }

  const generatorNames = generators.map((item) => item.name);

  // // look up a generator and run it with calculated bypass data
  const runGeneratorByName = (name: string) => {
    const generator = plop.getGenerator(name);
    doThePlop(generator, []);
  };

  if (generatorName) {
    if (generatorNames.includes(generatorName)) {
      runGeneratorByName(generatorName);
    } else {
      console.error(chalk.red('[PLOP] ') + `无法找到 ${generatorName} 生成器模板`);
      process.exit(1);
    }
  } else {
    if (generatorNames.length === 1) {
      runGeneratorByName(generatorNames[0]);
    }

    if (generators.length > 1) {
      chooseOptionFromList(generators, plop.getWelcomeMessage())
        .then(runGeneratorByName)
        .catch((err) => {
          console.error(chalk.red('[PLOP] ') + '选择生成器时出现问题', err);
        });
    }
  }

  return plop;
};

export const run = (options: PlopOptions) => {
  return (env: Liftoff.LiftoffEnv) => {
    createPlop(merge(options, env));
  };
};

export const plop = async (options: PlopOptions) => {
  const { cwd, preload, plopFile, completion } = options;
  Plop.prepare(
    {
      cwd,
      preload,
      completion,
      configPath: plopFile,
    },
    function (env) {
      Plop.execute(env, run(options));
    },
  );
};

export const createInitPlopFile = (options: { useTypescript: boolean }) => {
  const { useTypescript } = options || {};

  const initString = (() => {
    if (useTypescript) {
      return (
        "import type { NodePlopAPI } from 'node-plop'\n" +
        '\n' +
        'export default   (plop: NodePlopAPI) => {\n' +
        "\tplop.setGenerator('basics', {\n" +
        "\t\tdescription: '描述模板的作用',\n" +
        '\t\tprompts: [],\n' +
        '\t\tactions: []\n' +
        '\t});\n\n' +
        '\n' +
        '}\n' +
        '\n'
      );
    } else {
      return (
        'export default  (plop) => {\n\n' +
        "\tplop.setGenerator('basics', {\n" +
        "\t\tdescription: '描述模板的作用',\n" +
        '\t\tprompts: [],\n' +
        '\t\tactions: []\n' +
        '\t});\n\n' +
        '};'
      );
    }
  })();

  [`js`, `ts`, `cjs`, `mjs`].forEach((ext) => {
    const name = `plopfile.${ext}`;
    if (fs.existsSync(process.cwd() + `/${name}`)) {
      throw Error(`${name} 文件已存在无须初始化`);
    }
  });

  const outExt = useTypescript ? `ts` : `mjs`;

  generateFile(`${process.cwd()}/plopfile.${outExt}`, initString);
};
