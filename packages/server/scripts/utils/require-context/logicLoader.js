const path = require('path');
const fs = require('fs');

const getPathInfo = (p) => path.parse(p);

/**
 * @description // 递归读取文件，类似于webpack的require.context()
 *
 * @param {String} directory 文件目录
 * @param {Boolean} useSubdirectories 是否查询子目录，默认false
 * @param {array} extList 查询文件后缀，默认 ['.js']
 *
 */

function readFileList(directory, useSubdirectories, extList) {
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

        if (stat.isDirectory() && useSubdirectories) {
          filesList.push(...readFileList(path.join(directory, item), useSubdirectories, extList));
        } else {
          const info = getPathInfo(fullPath);

          if (extList.includes(info.ext)) {
            const fullPathObj = filterFile(info.dir);

            if (fullPathObj) {
              filesList.push(fullPathObj);
            }
          }
        }
      });
  }

  return filesList;
}

function autoLoadFile(directory, useSubdirectories = false, extList = ['.ts']) {
  // 递归读取文件

  return readFileList(directory, useSubdirectories, extList);
}
// 过滤文件夹内容
function filterFile(fullPath) {
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

        return [fullPathName, filePath];
      }
    } catch (err) {
      console.error(`${err}文件名称拆解失败请按照规则来`);
    }
  }
}

module.exports = autoLoadFile;
