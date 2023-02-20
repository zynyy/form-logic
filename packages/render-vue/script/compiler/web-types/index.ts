import glob from 'fast-glob';
import { join } from 'node:path';
import fse from 'fs-extra';
import { mdParser } from './parser.js';
import { formatter } from './formatter.js';
import { genWebTypes } from './web-types.js';
import { Options, VueTag } from './type.js';
import { normalizePath } from './utils.js';
import { SRC_DIR, DIST_DIR, getPackageJson } from '../../common/constant.js';


async function readMarkdown(options: Options) {
  const mds = await glob(normalizePath(`${options.path}/**/*.md`));
  return mds.filter((md) => options.test.test(md)).map((path) => fse.readFileSync(path, 'utf-8'));
}

export async function parseAndWrite(options: Options) {
  if (!options.outputDir) {
    throw new Error('outputDir can not be empty.');
  }

  const mds = await readMarkdown(options);
  const vueTags: VueTag[] = [];

  mds.forEach((md) => {
    const parsedMd = mdParser(md);
    formatter(vueTags, parsedMd, options.tagPrefix, options.name);
  });

  const webTypes = genWebTypes(vueTags, options);
  fse.outputFileSync(join(options.outputDir, 'web-types.json'), JSON.stringify(webTypes));
}

export function genWebStormTypes(tagPrefix?: string) {
  const pkgJson = getPackageJson();

  parseAndWrite({
    name: pkgJson.name,
    path: SRC_DIR,
    test: /README\.md/,
    version: pkgJson.version,
    outputDir: DIST_DIR,
    tagPrefix,
  });
}
