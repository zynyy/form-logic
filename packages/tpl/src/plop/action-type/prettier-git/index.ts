import { CustomActionConfig } from 'node-plop';
import { throwStringError } from '../../helper';
import { execPrettierAndGit } from '@formlogic/package-compiler';
import { Answers } from 'inquirer';

export const prettierGit = async (
  answers: Answers,
  config: CustomActionConfig<string>,
): Promise<string> => {
  const { data } = config;
  // @ts-ignore
  const { files } = data || {};

  try {
    if (Array.isArray(files)) {
      await Promise.all(
        files.map((file) => {
          execPrettierAndGit(file);
          return Promise.resolve();
        }),
      );
    }

    return '';
  } catch (err) {
    throwStringError(err);
    return '';
  }
};
