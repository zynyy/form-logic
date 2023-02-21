import { readFileSync } from 'node:fs';
import { fileURLToPath, } from 'node:url';
import { join, dirname, } from 'node:path';

function findRootDir(dir: string): string {
  return dir;
}

// Root paths
export const CWD = process.cwd();
export const ROOT = findRootDir(CWD);
export const ESM_DIR = join(ROOT, 'esm');
export const LIB_DIR = join(ROOT, 'lib');

export const PACKAGE_JSON_FILE = join(ROOT, 'package.json');

// Relative paths
const __dirname = dirname(fileURLToPath(import.meta.url));
export const CJS_DIR = join(__dirname, '..', '..', 'cjs');
export const DIST_DIR = join(__dirname, '..', '..', 'dist');
export const CONFIG_DIR = join(__dirname, '..', 'config');
export const SITE_SRC_DIR = join(__dirname, '..', '..', 'site');

// Dist files
export const PACKAGE_ENTRY_FILE = join(DIST_DIR, 'package-entry.js');
export const PACKAGE_STYLE_FILE = join(DIST_DIR, 'package-style.css');

export const STYLE_DEPS_JSON_FILE = join(DIST_DIR, 'style-deps.json');

// Config files
export const POSTCSS_CONFIG_FILE = join(CJS_DIR, 'postcss.config.cjs');

export const JEST_CONFIG_FILE = join(ROOT, 'jest.config.js');

export const SCRIPT_EXTS = ['.js', '.jsx', '.vue', '.ts', '.tsx', '.mjs', '.cjs'];
export const STYLE_EXTS = ['.css', '.less', '.scss'];

export function getPackageJson() {
  const rawJson = readFileSync(PACKAGE_JSON_FILE, 'utf-8');
  return JSON.parse(rawJson);
}

function getSrcDir() {
  return join(ROOT, 'src');
}

export const SRC_DIR = getSrcDir();
export const STYLE_DIR = join(SRC_DIR, 'style');
