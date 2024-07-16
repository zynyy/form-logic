import fse from 'fs-extra';
import { execa } from 'execa';
import { join } from 'node:path';

import { compileStyle } from '@/compiler/css';
import { compileVueScript, compileSfc, compileBundlesVue } from '@/compiler/vue3';

import {
  isDir,
  isSfc,
  isAsset,
  isStyle,
  isScript,
  isDemoDir,
  isTestDir,
  isStoriesScript,
  isDeclareFile,
  SRC_DIR,
  LIB_DIR,
  ES_DIR,
  createSpinner,
  consola,
} from '@/utils';
import type { Format } from 'esbuild';

import { clean } from './clean';
import { copyDir } from '@/utils/copy-dir';
import { merge } from 'lodash-es';
import { TaskItem } from '@/interface';

const { remove, readdir, existsSync } = fse;

const compileFile = (filePath: string, format: Format) => {
  if (isDeclareFile(filePath) || isAsset(filePath)) {
    return Promise.resolve();
  }

  if (isStoriesScript(filePath)) {
    return remove(filePath);
  }

  if (isScript(filePath)) {
    return compileVueScript(filePath, format);
  }
  if (isStyle(filePath)) {
    return compileStyle(filePath);
  }
  return remove(filePath);
};

const preCompileDir = async (dir: string) => {
  const files = await readdir(dir);

  await Promise.all(
    files.map((filename) => {
      const filePath = join(dir, filename);

      if (isDemoDir(filePath) || isTestDir(filePath)) {
        return remove(filePath);
      }
      if (isDir(filePath)) {
        return preCompileDir(filePath);
      }
      if (isSfc(filePath)) {
        return compileSfc(filePath);
      }
      return Promise.resolve();
    }),
  );
};

const compileDir = async (dir: string, format: Format) => {
  const files = await readdir(dir);

  await Promise.all(
    files.map((filename) => {
      const filePath = join(dir, filename);

      return isDir(filePath) ? compileDir(filePath, format) : compileFile(filePath, format);
    }),
  );
};

const copySourceCode = () => {
  return Promise.all([copyDir(SRC_DIR, ES_DIR), copyDir(SRC_DIR, LIB_DIR)]);
};

const buildESMOutputs = async () => {
  await compileDir(ES_DIR, 'esm');
};

export const buildCJSOutputs = async () => {
  await compileDir(LIB_DIR, 'cjs');
};

export const buildTypeDeclarations = async () => {
  await buildSFC();

  const tsConfig = join(process.cwd(), 'tsconfig.declaration.json');

  if (existsSync(tsConfig)) {
    await execa('tsc', ['-p', tsConfig]);
  }
};

const replaceAliasPaths = async () => {
  const esmConfig = join(process.cwd(), 'tsconfig.esm.json');
  if (existsSync(esmConfig)) {
    await execa('tsc-alias', ['-p', esmConfig]);
  }

  const cjsConfig = join(process.cwd(), 'tsconfig.cjs.json');

  if (existsSync(cjsConfig)) {
    await execa('tsc-alias', ['-p', cjsConfig]);
  }
};

const buildSFC = async () => {
  await Promise.all([preCompileDir(ES_DIR), preCompileDir(LIB_DIR)]);
};

const buildBundledOutputs = async () => {
  await compileBundlesVue();
};

export const runBuildTasks = async (tasks: TaskItem[]) => {
  for (let i = 0; i < tasks.length; i++) {
    const { task, text } = tasks[i];
    const spinner = createSpinner(text).start();

    try {
      await task();
      spinner.success({ text });
    } catch (err) {
      spinner.error({ text });
      throw err;
    }
  }

  consola.success('打包编译成功');
};

const runBuild = async () => {
  const tasks = [
    {
      text: '复制源码',
      task: copySourceCode,
    },
    {
      text: 'sfc转js',
      task: buildSFC,
    },
    {
      text: '打包输出 ESModule',
      task: buildESMOutputs,
    },
    {
      text: '打包输出 CommonJS',
      task: buildCJSOutputs,
    },
    {
      text: '打包压缩',
      task: buildBundledOutputs,
    },
  ];
  consola.start('开始启动vue3打包任务');
  await runBuildTasks(tasks);
};

const runBuildTs = async () => {
  const tasks = [
    {
      text: '复制源码',
      task: copySourceCode,
    },
    {
      text: '打包ts类型',
      task: buildTypeDeclarations,
    },
    {
      text: '打包输出 ESModule',
      task: buildESMOutputs,
    },
    {
      text: '打包输出 CommonJS',
      task: buildCJSOutputs,
    },
    {
      text: '替换别名路径',
      task: replaceAliasPaths,
    },
    {
      text: '打包压缩',
      task: buildBundledOutputs,
    },
  ];

  consola.start('开始启动vue3+ts打包任务');
  await runBuildTasks(tasks);
};

export interface BuildOptions {
  useTypescript: boolean;
}

export const build = async (options?: Partial<BuildOptions>) => {
  const { useTypescript } = merge(
    {
      useTypescript: false,
    },
    options,
  );

  try {
    await clean();

    if (useTypescript) {
      await runBuildTs();
    } else {
      await runBuild();
    }
  } catch (err) {
    consola.error('打包编译失败');
    process.exit(1);
  }
};
