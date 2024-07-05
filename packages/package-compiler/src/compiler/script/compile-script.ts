import fse from 'fs-extra';
import babel from '@babel/core';
import esbuild, { type Format } from 'esbuild';
import { sep } from 'node:path';
import { isJsx, replaceExt, getConfig } from '@/utils';
import { replaceCSSImportExt } from '@/utils/css';

import consola from 'consola';
import { replaceScriptImportExt } from '@/compiler/script/get-deps';

const { readFileSync, removeSync, outputFileSync } = fse;

export async function compileScript(filePath: string, format: Format): Promise<void> {
  if (filePath.includes('.d.ts')) {
    return;
  }

  const extensionMap = getConfig().build?.extensions;
  const extension = extensionMap?.[format] || '.js';

  let code = readFileSync(filePath, 'utf-8');

  if (!filePath.includes(`${sep}style${sep}`)) {
    code = replaceCSSImportExt(code);
  }
  code = replaceScriptImportExt(code, filePath, extension);

  if (isJsx(filePath)) {
    const babelResult = await babel.transformAsync(code, {
      filename: filePath,
      babelrc: false,
      presets: ['@babel/preset-typescript'],
      plugins: [
        [
          '@vue/babel-plugin-jsx',
          {
            enableObjectSlots: false,
          },
        ],
      ],
    });
    if (babelResult?.code) {
      code = babelResult.code;
    }
  }

  try {
    const esbuildResult = await esbuild.transform(code, {
      loader: 'ts',
      target: 'es2016',
      format,
    });

    const jsFilePath = replaceExt(filePath, extension);

    removeSync(filePath);
    outputFileSync(jsFilePath, esbuildResult.code);
  } catch {
    consola.error(filePath, format);
  }
}
