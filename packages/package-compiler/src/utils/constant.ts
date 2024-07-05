import { fileURLToPath } from 'node:url';
import { join, dirname, sep } from 'node:path';

// Relative paths
const __dirname = dirname(fileURLToPath(import.meta.url));
export const CJS_DIR = join(__dirname, '..', '..', 'cjs');
export const DIST_DIR = join(__dirname, '..', '..', 'dist');

// Dist files
export const PACKAGE_ENTRY_FILE = join(DIST_DIR, 'package-entry.js');

export const STYLE_DEPS_JSON_FILE = join(DIST_DIR, 'style-deps.json');

// Config files
export const POSTCSS_CONFIG_FILE = join(CJS_DIR, 'postcss.config.cjs');
export const JEST_CONFIG_FILE = join(CJS_DIR, 'jest.config.cjs');

export const SCRIPT_EXTS = [
  '.js',
  '.jsx',
  '.vue',
  '.ts',
  '.tsx',
  '.mjs',
  '.cjs',
];

export const STYLE_EXTS = ['.css', '.less', '.scss'];

export const EXT_REGEXP = /\.\w+$/;
export const SFC_REGEXP = /\.(vue)$/;
export const DEMO_REGEXP = new RegExp('\\' + sep + 'demo$');
export const TEST_REGEXP = new RegExp('\\' + sep + 'test$');
export const TEST_DIR_REGEXP = new RegExp('\\' + sep + '__test__$');
export const ASSET_REGEXP = /\.(png|jpe?g|gif|webp|ico|jfif|svg|woff2?|ttf)$/i;
export const STYLE_REGEXP = /\.(css|less|scss)$/;
export const STORIES_SCRIPT_REGEXP = /\.stories\.(js|ts|jsx|tsx)$/;
export const SCRIPT_REGEXP = /\.(js|ts|jsx|tsx)$/;
export const JSX_REGEXP = /\.(j|t)sx$/;
export const ENTRY_EXTS = ['js', 'ts', 'tsx', 'jsx', 'vue'];
