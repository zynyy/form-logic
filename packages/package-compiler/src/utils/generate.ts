import fs from 'node:fs';
import path from 'node:path';
import child_process from 'child_process';
import consola from 'consola';

export const execPrettierAndGit = (filename: string) => {
  child_process.exec(`npx prettier ${filename} --write`);
  child_process.exec(`git add ${filename}`);
  consola.log(`[git]: ${filename}`);
};

export const generateFile = (filename: string, content: string, cb?: () => void) => {
  consola.start(`开始执行文件生成: ${filename}`);
  try {
    fs.mkdirSync(path.dirname(filename), { recursive: true });

    fs.writeFileSync(filename, content);

    execPrettierAndGit(filename);
    consola.success(`执行生成: ${filename} 文件成功`);

    if (cb) {
      cb();
    }
  } catch (e) {
    consola.error(`执行生成: ${filename} 文件失败`);
  }
};
