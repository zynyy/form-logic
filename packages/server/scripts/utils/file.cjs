const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const generateFile = (filename, content, cb) => {
  fs.mkdir(path.dirname(filename), { recursive: true }, (err) => {
    if (err) throw err;

    try {
      fs.writeFileSync(filename, content);

      exec(`npx prettier ${filename} --write`);
      exec('git add .');

      console.log(`文件 ${filename} 生成成功`);

      if (cb) {
        cb();
      }
    } catch (err) {
      throw err;
    }
  });
};

const deleteDir = (path) => {
  if (getFileExists(path)) {
    const files = fs.readdirSync(path);
    files.forEach((file) => {
      const curPath = path + '/' + file;
      if (fs.statSync(curPath).isDirectory()) {
        deleteDir(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
    exec('git add .');
    console.log(`文件夹: ${path} 删除成功`);
  } else {
    console.log(`文件夹: ${path} 不存在`);
  }
};

const deleteFile = (filename, cb) => {
  fs.unlink(filename, (err) => {
    if (err) throw err;
    exec('git add .');
    console.log(`文件: ${filename} 删除成功`);
    if (cb) {
      cb();
    }
  });
};

const getFileExists = (path) => {
  return fs.existsSync(path);
};

const getFileContent = (filepath) => {
  return getFileExists(filepath) ? fs.readFileSync(filepath, 'utf-8') : '{}';
};

const getReaddir = (path) => {
  return fs.readdirSync(path);
};

const getJsonFileContent = (path) => {
  return JSON.parse(getFileContent(path) || '{}');
};

module.exports = {
  generateFile,
  getFileExists,
  getFileContent,
  deleteFile,
  getReaddir,
  getJsonFileContent,
  deleteDir,
};
