import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export async function compileSass(filePath: string) {
  const { compile } = require('sass');
  const { css } = compile(filePath, {
    loadPaths: ['node_modules'],
  });
  return css;
}
