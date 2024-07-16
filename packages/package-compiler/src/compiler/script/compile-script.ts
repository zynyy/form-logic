import babel from '@babel/core';
import fse from 'fs-extra';
import { getConfig, replaceExt } from '@/utils';
import { replaceCSSImportExt } from '@/utils/css';
import { replaceScriptImportExt } from '@/compiler/script/get-deps';
import esbuild, { Format } from 'esbuild';

const { readFileSync, removeSync, outputFileSync } = fse;

export const compileScript = (filePath: string, format: Format): Promise<undefined> => {
  return new Promise((resolve, reject) => {
    let code = readFileSync(filePath, 'utf-8');

    const { transformCode } = getConfig().build || {};

    code = replaceCSSImportExt(code);
    code = replaceScriptImportExt(code, filePath, '');
    code = transformCode?.(code) || code;

    babel
      .transformAsync(code, {
        filename: filePath,
        babelrc: false,
        presets: [
          ['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
        ],
        plugins: [],
      })
      .then(async (result: any) => {
        if (result) {
          const jsFilePath = replaceExt(filePath, '.js');

          const esbuildResult = await esbuild.transform(result.code, {
            loader: 'ts',
            target: 'es2016',
            format,
          });

          removeSync(filePath);
          outputFileSync(jsFilePath, esbuildResult.code);

          resolve(result);
        }
      })
      .catch(reject);
  });
};
