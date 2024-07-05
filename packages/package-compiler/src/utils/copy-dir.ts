import fse from 'fs-extra';

import fs from 'node:fs';
import { join } from 'node:path';
import { getConfig, isDir, isFile, isStoriesScript } from './index';

const { ensureDirSync, copyFile } = fse;

const IGNORE_DIR = ['__test__', 'stories', 'low-code-meta', '.DS_Store', 'test', 'demo'];

export const copyDir = (src: string, dest: string): Promise<any> => {
  const files = fs.readdirSync(src);

  const { ignoreCopyDir } = getConfig();

  ensureDirSync(dest);

  const ignoreDir = IGNORE_DIR.concat(ignoreCopyDir || []);

  return Promise.all(
    files.map((filename) => {
      if (ignoreDir.includes(filename)) {
        return Promise.resolve();
      }

      const filePath = join(src, filename);
      const copyFilePath = join(dest, filename);

      if (isDir(filePath)) {
        ensureDirSync(copyFilePath);
        return copyDir(filePath, copyFilePath);
      }
      if (isFile(filePath) && !isStoriesScript(filePath)) {
        return copyFile(filePath, copyFilePath);
      }
      return Promise.resolve();
    }),
  );
};
