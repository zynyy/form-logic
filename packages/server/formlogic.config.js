// 本文件是 formlogic 相关配置执行 formlogic-server dev 时自动生成
// 如果修改了此配置需要重新执行 formlogic-server dev
const path = require('path');

module.exports = {
  projectName: '@formlogic/server',
  outputPath: path.join(__dirname, './src/low-code-meta'),
  ip: '127.0.0.1',
  port: '3200',
  npmRegistry: 'https://registry.npmjs.com/',
  fileExt:"ts"
};
