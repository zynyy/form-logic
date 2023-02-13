import fse from 'fs-extra';
import { execa } from 'execa';
import { join, } from 'node:path';

import { CSS_LANG } from './common/css.js';
import { createSpinner, consola } from './common/logger';

import { compileSfc } from './compiler/compile-sfc';
import { compileStyle } from './compiler/compile-style';
import { compileScript } from './compiler/compile-script';
import { compileBundles } from './compiler/compile-bundles';
import { genStyleDepsMap } from './compiler/gen-style-deps-map';
import { genComponentStyle } from './compiler/gen-component-style';
import { SRC_DIR, LIB_DIR, ES_DIR } from './constant.js';
import { genPackageStyle } from './compiler/gen-package-style';
import { genWebStormTypes } from './compiler/web-types';
import {
  isDir,
  isSfc,
  isAsset,
  isStyle,
  isScript,
  isDemoDir,
  isTestDir,
  setNodeEnv,
  setModuleEnv,
  setBuildTarget,
  isStoriesScript,
} from './common';
import type { Format } from 'esbuild';

const { remove, copy, readdir, existsSync } = fse;

async function compileFile(filePath: string, format: Format) {
  if (isStoriesScript(filePath)) {
    return remove(filePath);
  }

  if (isScript(filePath)) {
    return compileScript(filePath, format);
  }
  if (isStyle(filePath)) {
    return compileStyle(filePath);
  }
  if (isAsset(filePath)) {
    return Promise.resolve();
  }
  return remove(filePath);
}

/**
 * Pre-compile
 * 1. Remove unneeded dirs
 * 2. compile sfc into scripts/styles
 */
async function preCompileDir(dir: string) {
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
}

async function compileDir(dir: string, format: Format) {
  const files = await readdir(dir);
  await Promise.all(
    files.map((filename) => {
      const filePath = join(dir, filename);
      return isDir(filePath) ? compileDir(filePath, format) : compileFile(filePath, format);
    }),
  );
}

async function copySourceCode() {
  return Promise.all([copy(SRC_DIR, ES_DIR), copy(SRC_DIR, LIB_DIR)]);
}

async function buildESMOutputs() {
  setModuleEnv('esmodule');
  setBuildTarget('package');
  await compileDir(ES_DIR, 'esm');
}

async function buildCJSOutputs() {
  setModuleEnv('commonjs');
  setBuildTarget('package');
  await compileDir(LIB_DIR, 'cjs');
}

async function buildTypeDeclarations() {
  await Promise.all([preCompileDir(ES_DIR), preCompileDir(LIB_DIR)]);

  const tsConfig = join(process.cwd(), 'tsconfig.declaration.json');

  if (existsSync(tsConfig)) {
    await execa('tsc', ['-p', tsConfig]);
  }
}

async function replaceAliasPaths() {
  const esmConfig = join(process.cwd(), 'tsconfig.esm.json');

  if (existsSync(esmConfig)) {
    await execa('tsc-alias', ['-p', esmConfig]);
  }

  const cjsConfig = join(process.cwd(), 'tsconfig.cjs.json');

  if (existsSync(cjsConfig)) {
    await execa('tsc-alias', ['-p', cjsConfig]);
  }
}

async function buildStyleEntry() {
  await genStyleDepsMap();
  genComponentStyle();
}

async function buildPackageStyleEntry() {
  const styleEntryFile = join(LIB_DIR, `index.${CSS_LANG}`);

  genPackageStyle({
    outputPath: styleEntryFile,
    pathResolver: (path: string) => path.replace(SRC_DIR, '.'),
  });
}

async function buildBundledOutputs() {
  setModuleEnv('esmodule');
  await compileBundles();
  genWebStormTypes();
}

const tasks = [
  {
    text: 'Copy Source Code',
    task: copySourceCode,
  },
  {
    text: 'Build Component Style Entry',
    task: buildStyleEntry,
  },
  {
    text: 'Build Package Style Entry',
    task: buildPackageStyleEntry,
  },
  {
    text: 'Build Type Declarations',
    task: buildTypeDeclarations,
  },
  {
    text: 'Build ESModule Outputs',
    task: buildESMOutputs,
  },
  {
    text: 'Build CommonJS Outputs',
    task: buildCJSOutputs,
  },
  {
    text: 'Replace alias paths',
    task: replaceAliasPaths,
  },

  {
    text: 'Build Bundled Outputs',
    task: buildBundledOutputs,
  },
];

async function runBuildTasks() {
  for (let i = 0; i < tasks.length; i++) {
    const { task, text } = tasks[i];
    const spinner = createSpinner(text).start();

    try {
      /* eslint-disable no-await-in-loop */
      await task();
      spinner.success({ text });
    } catch (err) {
      spinner.error({ text });
      console.log(err);
      throw err;
    }
  }

  consola.success('Compile successfully');
}

export async function build() {
  setNodeEnv('production');

  try {
    await runBuildTasks();
  } catch (err) {
    consola.error('Build failed');
    process.exit(1);
  }
}

build().then(() => void 0);
