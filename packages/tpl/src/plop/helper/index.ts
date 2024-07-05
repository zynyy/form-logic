import { sep, resolve } from 'node:path';
import { CustomActionConfig, NodePlopAPI } from 'node-plop';
import { Answers } from 'inquirer';
import fs from 'node:fs';
import type { PathLike } from 'node:fs';

const getFullData = (data: Answers, cfg: CustomActionConfig<string>) =>
  Object.assign({}, cfg.data, data);

export const normalizePath = (path: string) => {
  return sep === '\\' ? path.replace(/\\/g, '/') : path;
};

export const makeDestPath = (
  data: Answers,
  cfg: CustomActionConfig<string>,
  plop: NodePlopAPI,
) => {
  return resolve(
    plop.getDestBasePath(),
    plop.renderString(normalizePath(cfg.path) || '', getFullData(data, cfg)),
  );
};

export const readFile = (path: PathLike) => fs.promises.readFile(path, 'utf8');

export const getRenderedTemplatePath = (
  data: Answers,
  cfg: CustomActionConfig<string>,
  plop: NodePlopAPI,
) => {
  if (cfg.templateFile) {
    const absTemplatePath = resolve(plop.getPlopfilePath(), cfg.templateFile);
    return plop.renderString(
      normalizePath(absTemplatePath),
      getFullData(data, cfg),
    );
  }
  return null;
};

export const getTemplate = async (
  data: Answers,
  cfg: CustomActionConfig<string>,
  plop: NodePlopAPI,
) => {
  const makeTmplPath = (p: string) => resolve(plop.getPlopfilePath(), p);

  let { template } = cfg;

  if (cfg.templateFile) {
    template = await readFile(makeTmplPath(cfg.templateFile));
  }
  if (template == null) {
    template = '';
  }

  return template;
};

export const getRenderedTemplate = async (
  data: Answers,
  cfg: CustomActionConfig<string>,
  plop: NodePlopAPI,
) => {
  const template = await getTemplate(data, cfg, plop);

  return plop.renderString(template, getFullData(data, cfg));
};

export const getRelativeToBasePath = (filePath: string, plop: NodePlopAPI) => {
  return filePath.replace(resolve(plop.getDestBasePath()), '');
};

export const throwStringError = (err: any) => {
  if (typeof err === 'string') {
    throw err;
  } else {
    throw err.message || JSON.stringify(err);
  }
};
