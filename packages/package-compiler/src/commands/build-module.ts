import fse from 'fs-extra';
import { copyDir } from '@/utils/copy-dir';
import babel from '@babel/core';
import { join } from 'node:path';
import { execa } from 'execa';
import { readFileSync } from 'node:fs';
import { createSpinner } from 'nanospinner';
import consola from 'consola';

import { CWD, isDir, ES_DIR, SRC_DIR } from '@/utils';
import { TaskItem } from '@/interface';

const { remove, readdir, removeSync, outputFileSync, existsSync } = fse;

export function replaceExt(path: string, ext: string) {
  return path.replace(/\.\w+$/, ext);
}

async function copySourceCode() {
  return Promise.all([copyDir(SRC_DIR, ES_DIR)]);
}

async function buildTypeDeclarations() {
  const tsConfig = join(CWD, 'tsconfig.declaration.json');

  if (existsSync(tsConfig)) {
    await execa('tsc', ['-p', tsConfig]);
  }
}

const compileScript = async (filePath: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    let code = readFileSync(filePath, 'utf-8');

    babel
      .transformAsync(code, {
        filename: filePath,
        babelrc: false,
        presets: [['@babel/preset-typescript']],
        plugins: [],
      })
      .then((result: any) => {
        if (result) {
          const jsFilePath = replaceExt(filePath, '.js');

          removeSync(filePath);
          outputFileSync(jsFilePath, result.code);
          resolve(jsFilePath);
        }
      })
      .catch(reject);
  });
};

async function compileFile(filePath: string) {
  if (filePath.includes('/copy-directory/') || filePath.endsWith('d.ts')) {
    return Promise.resolve(filePath);
  }

  if (/\.(js|ts|jsx|tsx)$/.test(filePath)) {
    return compileScript(filePath);
  }

  return Promise.resolve(filePath);
}

async function compileDir(dir: string) {
  const files = await readdir(dir);

  await Promise.all(
    files.map((filename) => {
      const filePath = join(dir, filename);

      return isDir(filePath) ? compileDir(filePath) : compileFile(filePath);
    }),
  );
}

async function replaceAliasPaths() {
  const esmConfig = join(process.cwd(), 'tsconfig.esm.json');

  if (existsSync(esmConfig)) {
    await execa('tsc-alias', ['-p', esmConfig]);
  } else {
    consola.warn('无法找到 tsconfig.esm.json 文件');
  }
}

async function buildESMOutputs() {
  await compileDir(ES_DIR);
}

async function runBuildTasks(tasks: TaskItem[]) {
  for (let i = 0; i < tasks.length; i++) {
    const { task, text } = tasks[i];
    const spinner = createSpinner(text).start();

    try {
      await task();
      spinner.success({ text });
    } catch (err) {
      spinner.error({ text });
      console.log(err);
      throw err;
    }
  }

  consola.success('编译打包成功');
}

const clean = async () => {
  consola.start('清理 esm');
  await Promise.all([remove(ES_DIR)]);
  consola.success(`清理 esm 目录成功`);
};

export const runBuild = async () => {
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
      text: '替换别名路径',
      task: replaceAliasPaths,
    },
  ];
  consola.start('开始启动ESModule打包任务');
  await runBuildTasks(tasks);
};

export const build = async () => {
  try {
    await clean();
    await runBuild();
  } catch (err) {
    consola.error('Build failed');
    process.exit(1);
  }
};
