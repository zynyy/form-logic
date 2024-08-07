import { join, dirname, isAbsolute } from 'node:path';
import { existsSync } from 'node:fs';
import consola from 'consola';
import { pathToFileURL } from 'node:url';
import { readFileSync } from 'node:fs';

const findRootDir = (dir: string): string => {
  if (existsSync(join(dir, 'formlogic.config.mjs'))) {
    return dir;
  }

  const parentDir = dirname(dir);
  if (dir === parentDir) {
    return dir;
  }

  return findRootDir(parentDir);
};

// Root paths
export const CWD = process.cwd();
export const ROOT = findRootDir(CWD);
export const ES_DIR = join(ROOT, 'esm');
export const LIB_DIR = join(ROOT, 'lib');
export const ROOT_DIST_DIR = join(ROOT, 'dist');
export const DOCS_DIR = join(ROOT, 'docs');
export const SITE_DIST_DIR = join(ROOT, 'site-dist');
export const CUBE_CONFIG_FILE = join(ROOT, 'formlogic.config.mjs');
export const PACKAGE_JSON_FILE = join(ROOT, 'package.json');

const getCubeConfigAsync = async () => {
  try {
    // https://github.com/nodejs/node/issues/31710
    // absolute file paths don't work on Windows
    return (await import(pathToFileURL(CUBE_CONFIG_FILE).href)).default;
  } catch (err) {
    consola.warn(err);
    return {};
  }
};

const cubeConfig = await getCubeConfigAsync();

export const getConfig = () => {
  return cubeConfig;
};

const getSrcDir = () => {
  const cubeConfig = getConfig();
  const srcDir = cubeConfig.build?.srcDir;

  if (srcDir) {
    if (isAbsolute(srcDir)) {
      return srcDir;
    }
    return join(ROOT, srcDir);
  }
  return join(ROOT, 'src');
};

export const getPackageJson = () => {
  const rawJson = readFileSync(PACKAGE_JSON_FILE, 'utf-8');
  return JSON.parse(rawJson);
};

export const SRC_DIR = getSrcDir();
export const STYLE_DIR = join(SRC_DIR, 'style');
