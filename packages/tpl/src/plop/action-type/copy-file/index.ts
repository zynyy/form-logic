import { CustomActionConfig, NodePlopAPI } from 'node-plop';
import { Answers } from 'inquirer';
import fs from 'node:fs';
import { join } from 'node:path';
import { isDir, isFile } from '@/utils/is';
import fse from 'fs-extra';
import { getRelativeToBasePath, makeDestPath, throwStringError } from '../../helper';

const copyDir = (src: string, dest: string): Promise<any> => {
  const files = fs.readdirSync(src);

  return Promise.all(
    files.map((filename) => {
      const filePath = join(src, filename);
      const copyFilePath = join(dest, filename);

      if (isDir(filePath)) {
        fse.ensureDirSync(copyFilePath);
        return copyDir(filePath, copyFilePath);
      }
      if (isFile(filePath) && !fs.existsSync(copyFilePath)) {
        return fse.copyFile(filePath, copyFilePath);
      }
      return Promise.resolve();
    }),
  );
};

export const copyFile = async (
  answers: Answers,
  config: CustomActionConfig<string>,
  plop: NodePlopAPI,
): Promise<string> => {
  const { templateFile } = config;

  const fileDestPath = makeDestPath(answers, config, plop);

  try {
    await copyDir(templateFile, fileDestPath);
    return getRelativeToBasePath(fileDestPath, plop);
  } catch (err) {
    throwStringError(err);
    return '';
  }
};
