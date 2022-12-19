const fs = require('fs');

const axios = require('axios');

const md5 = require('md5');
let prevMd5 = {};
const getCode = (path) => {
  const arrs = path.replace(/\\/g, '/').split('/'); // path.split('/');
  arrs.shift();
  return arrs.shift();
};

const getCellId = (path) => {
  return path.replace(/\\/g, '/').split('/').pop().slice(0, -3);
};

const sendBackEndUpdate = (url, prams) => {
  axios.post(url, prams).then((res) => {
    console.log(res);
  });
};

const watchFile = (filePath, url) => {



  fs.mkdir(filePath, { recursive: true }, (err) => {
    if (err) throw err;

    fs.watch(
      filePath,
      {
        recursive: true,
      },
      (event, filename) => {
        const fullPath = filePath + filename;

        // const stat = fs.statSync(fullPath);
        //
        // const currentMd5 = md5(fs.readFileSync(fullPath));
        //
        // if (currentMd5 === prevMd5[fp]) {
        //   return;
        // }
        //
        // // 小于300 毫秒属于创建
        // if (new Date() - stat.birthtime <= 300) {
        //   console.log('属于文件创建不更新');
        //   // updateExportFile();
        //   return;
        // }
        //
        // prevMd5[fp] = currentMd5;
      },
    );
  });
};

module.exports = watchFile;
