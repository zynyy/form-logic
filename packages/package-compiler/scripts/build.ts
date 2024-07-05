import fse from 'fs-extra';
import { copyDir, isDir } from './copy-dir.js';
import babel from '@babel/core';
import { join } from 'node:path';
import { execa } from 'execa';
import { readFileSync } from 'node:fs';
import { createSpinner } from 'nanospinner';
import consola from 'consola';

const { remove, copy, readdir, removeSync, outputFileSync, existsSync } = fse;

export function replaceExt(path: string, ext: string) {
  return path.replace(/\.\w+$/, ext);
}

export const CWD = process.cwd();

export const LIB_DIR = join(CWD, 'lib');
export const SRC_DIR = join(CWD, 'src');

async function copySourceCode() {
  return Promise.all([copyDir(SRC_DIR, LIB_DIR)]);
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
        presets: [['@babel/preset-typescript', { isTSX: true, allExtensions: true }]],
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
  const cjsConfig = join(process.cwd(), 'tsconfig.cjs.json');

  if (existsSync(cjsConfig)) {
    await execa('tsc-alias', ['-p', cjsConfig]);
  }
}

async function buildCJSOutputs() {
  await compileDir(LIB_DIR);
}

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
    text: '打包输出 CommonJS',
    task: buildCJSOutputs,
  },
  {
    text: '替换别名路径',
    task: replaceAliasPaths,
  },
];

async function runBuildTasks() {
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

  consola.success('打包成功');
}

export async function clean() {
  consola.start('清理 lib');
  await Promise.all([remove(LIB_DIR)]);
  consola.success(`清理 lib 目录成功`);
}

export async function build() {
  try {
    await clean();
    await runBuildTasks();
  } catch (err) {
    consola.error('Build failed');
    process.exit(1);
  }
}

build().then();
