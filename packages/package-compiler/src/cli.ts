import { Command } from 'commander';

import { cliVersion } from './cliVersion';

const program = new Command();

program.version(`@formlogic/package-compiler ${cliVersion}`);

program
  .command('clean')
  .description('清除esm、lib、dist文件')
  .action(async () => {
    const { clean } = await import('./commands/clean.js');
    return clean();
  });

program
  .command('build-vue3')
  .description('编译vue3生产包')
  .action(async () => {
    const { build } = await import('./commands/build-vue3.js');
    return build();
  });

program
  .command('build-vue3-ts')
  .description('编译vue3+ts生产包')
  .action(async () => {
    const { build } = await import('./commands/build-vue2.js');
    return build({
      useTypescript: true,
    });
  });

program
  .command('build-vue2')
  .description('编译vue2生产包')
  .action(async () => {
    const { build } = await import('./commands/build-vue2.js');
    return build();
  });

program
  .command('build-vue2-ts')
  .description('编译vue2+ts生产包')
  .action(async () => {
    const { build } = await import('./commands/build-vue2.js');
    return build({
      useTypescript: true,
    });
  });

program
  .command('build-react-ts')
  .description('编译react+ts生产包')
  .action(async () => {
    const { build } = await import('./commands/build-react.js');
    return build({
      useTypescript: true,
    });
  });

program
  .command('build-react')
  .description('编译react生产包')
  .action(async () => {
    const { build } = await import('./commands/build-react.js');
    return build({
      useTypescript: false,
    });
  });

program.command('build-module').action(async () => {
  const { build } = await import('./commands/build-module.js');
  return build();
});


program.parse();
