import fse from 'fs-extra';
import {
  ASSET_REGEXP,
  DEMO_REGEXP,
  JSX_REGEXP,
  SCRIPT_REGEXP,
  SFC_REGEXP,
  STORIES_SCRIPT_REGEXP,
  STYLE_REGEXP,
  TEST_DIR_REGEXP,
  TEST_REGEXP,
} from './constant';
const { lstatSync } = fse;

export const isDir = (dir: string) => lstatSync(dir).isDirectory();
export const isFile = (dir: string) => lstatSync(dir).isFile();
export const isDemoDir = (dir: string) => DEMO_REGEXP.test(dir);
export const isTestDir = (dir: string) => TEST_REGEXP.test(dir) || TEST_DIR_REGEXP.test(dir);
export const isAsset = (path: string) => ASSET_REGEXP.test(path);
export const isSfc = (path: string) => SFC_REGEXP.test(path);
export const isStyle = (path: string) => STYLE_REGEXP.test(path);
export const isScript = (path: string) => SCRIPT_REGEXP.test(path);
export const isDeclareFile = (path: string) => path.endsWith('.d.ts');
export const isJsx = (path: string) => JSX_REGEXP.test(path);

export const isStoriesScript = (path: string) => STORIES_SCRIPT_REGEXP.test(path);
