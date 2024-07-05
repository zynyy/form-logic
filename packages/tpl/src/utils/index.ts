import { fileURLToPath } from 'node:url';

export const getFullFilePath = (fileURL: string, filePath: string) => {
  return fileURLToPath(new URL(filePath, fileURL));
};

export * from './to';
export * from './is';
export * from './constant';
