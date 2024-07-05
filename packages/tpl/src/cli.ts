import { Command } from 'commander';

import { cliVersion } from './cliVersion';

const program = new Command();

program.version(`@formlogic/tpl ${cliVersion}`);

program
  .command('init-plop')
  .description('初始化 plop')
  .option('--useTypescript', '是否使用生成typeScript文件')
  .action(async (options) => {
    const { createInitPlopFile } = await import('./plop/index.js');
    return createInitPlopFile(options);
  });

program
  .command('plop')
  .description('生成模板文件')
  .option('-p, --plopfile <plopfile>', '请输入一个plop配置文件路径')
  .option('-g, --generatorName <generatorName>', '请输入一个模板名称')
  .action(async (options) => {
    const { plop } = await import('./plop/index.js');
    return plop(options);
  });

program.parse();
