import path from 'path';

import { readIndexFileList } from './readFileList';

// 过滤文件夹内容
const filterFile = (fullPath) => {
  if (
    fullPath.length &&
    !fullPath.endsWith(`${path.sep}nodes`) &&
    !fullPath.endsWith(`${path.sep}logic`)
  ) {
    try {
      const fullPathArr = fullPath.split(path.sep);

      const latsIndex = fullPathArr.length - 1;

      const fullPathName = fullPathArr[latsIndex];
      const model = fullPathArr[latsIndex - 1];

      if (fullPathName && model) {
        const filePath = `./${model}/${fullPathName}`;

        return [fullPathName, filePath, fullPath];
      }
    } catch (err) {
      console.error(`${err}文件名称拆解失败请按照规则来`);
    }
  }
};

const autoLoadFile = (directory, extList = ['.ts']) => {
  return readIndexFileList(directory, extList)
    .map((item) => {
      const [_, fullPath] = item || {};

      return filterFile(fullPath);
    })
    .filter((val) => val);
};

export default autoLoadFile;
