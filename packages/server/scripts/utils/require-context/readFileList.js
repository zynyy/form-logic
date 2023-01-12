import fs from 'fs';

import path from 'path';

const getPathInfo = (p) => path.parse(p);

const fileInfo = (fullPath) => {
  if (fullPath.length) {
    try {
      const fullPathArr = fullPath.split(path.sep);

      const latsIndex = fullPathArr.length - 1;

      const fullPathName = fullPathArr[latsIndex];

      if (fullPathName) {
        return [fullPathName, fullPath];
      }
    } catch (err) {
      console.error(`${err}文件名称拆解失败请按照规则来`);
    }
  }
};

export const readAllFileList = (directory, extList) => {
  const filesList = [];

  if (fs.existsSync(directory)) {
    const files = fs.readdirSync(directory);

    files.forEach((item) => {
      const fullPath = path.join(directory, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        filesList.push(...readAllFileList(path.join(directory, item), extList));
      } else {
        const info = getPathInfo(fullPath);
        if (extList.includes(info.ext)) {
          filesList.push([info.name, info.dir]);
        }
      }
    });
  }

  return filesList;
};

export const readIndexFileList = (directory, extList) => {
  const filesList = [];

  if (fs.existsSync(directory)) {
    const files = fs.readdirSync(directory);

    const indexExt = extList.map((ext) => {
      return `index${ext}`;
    });

    files
      .filter((val) => {
        const fullPath = path.join(directory, val);
        const stat = fs.statSync(fullPath);

        if (stat.isFile()) {
          return indexExt.includes(val);
        }

        return stat.isDirectory();
      })
      .forEach((item) => {
        const fullPath = path.join(directory, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          filesList.push(...readIndexFileList(path.join(directory, item), extList));
        } else {
          const info = getPathInfo(fullPath);

          if (extList.includes(info.ext)) {
            const fullPathInfo = fileInfo(info.dir);

            if (fullPathInfo) {
              filesList.push(fullPathInfo);
            }
          }
        }
      });
  }

  return filesList;
};
