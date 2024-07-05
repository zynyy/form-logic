import fse from 'fs-extra';
import { join } from 'node:path';
import { SRC_DIR, getConfig } from './getConfig.js';
import { InlineConfig, loadConfigFromFile, mergeConfig } from 'vite';

const { existsSync, readdirSync, readFileSync, outputFileSync } = fse;

import { ENTRY_EXTS, EXT_REGEXP } from './constant.js';

export * from './constant.js';
export * from './getConfig.js';
export * from './is.js';
export * from './logger';

export function removeExt(path: string) {
  return path.replace('.js', '');
}

export function replaceExt(path: string, ext: string) {
  return path.replace(EXT_REGEXP, ext);
}

export function hasDefaultExport(code: string) {
  return code.includes('export default') || code.includes('export { default }');
}

export function getComponents() {
  const EXCLUDES = ['.DS_Store'];
  const dirs = readdirSync(SRC_DIR);

  return dirs
    .filter((dir) => !EXCLUDES.includes(dir))
    .filter((dir) =>
      ENTRY_EXTS.some((ext) => {
        const path = join(SRC_DIR, dir, `index.${ext}`);
        if (existsSync(path)) {
          return hasDefaultExport(readFileSync(path, 'utf-8'));
        }

        return false;
      }),
    );
}

export function normalizePath(path: string): string {
  return path.replace(/\\/g, '/');
}

export type ModuleEnv = 'esmodule' | 'commonjs';
export type NodeEnv = 'production' | 'development' | 'test';
export type BuildTarget = 'site' | 'package';

// smarter outputFileSync
// skip output if file content unchanged
export function smartOutputFile(filePath: string, content: string) {
  if (existsSync(filePath)) {
    const previousContent = readFileSync(filePath, 'utf-8');

    if (previousContent === content) {
      return;
    }
  }

  outputFileSync(filePath, content);
}

export async function mergeCustomViteConfig(
  config: InlineConfig,
  mode: 'production' | 'development',
): Promise<InlineConfig> {
  const customConfig = getConfig();
  const configureVite = customConfig?.vite;

  const userConfig = await loadConfigFromFile(
    {
      mode,
      command: mode === 'development' ? 'serve' : 'build',
    },
    undefined,
    process.cwd(),
  );

  if (configureVite) {
    const ret = typeof configureVite === 'function' ? configureVite(config) : configureVite;
    if (ret) {
      config = ret;
    }
  }

  if (userConfig) {
    return mergeConfig(config, userConfig.config);
  }
  return config;
}
