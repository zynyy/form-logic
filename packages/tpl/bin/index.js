#!/usr/bin/env node --experimental-modules --experimental-specifier-resolution=node

'use strict';

process.on('unhandledRejection', (err) => {
  throw err;
});

import { Command } from 'commander';

import pkg from '../package.json';

import scripts from '../scripts';

const { genList, removeList } = scripts;

const program = new Command();

program.name('generate tpl file').description('生成各种模版代码').version(pkg.version);

program
  .command('list')
  .description('列表模板')
  .action(() => {
    genList();
  });

program
  .command('remote-list')
  .description('移除列表生成的相关文件')
  .action(() => {
    removeList();
  });

program.parse(process.argv);
