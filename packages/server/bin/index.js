#!/usr/bin/env node --experimental-modules --experimental-specifier-resolution=node

'use strict';

process.on('unhandledRejection', (err) => {
  throw err;
});

import { Command } from 'commander';

import pkg from '../package.json';

import scripts from '../scripts';

const { devServer } = scripts;

const program = new Command();

program.name('server low code').description('管理低代码的服务').version(pkg.version);

program
  .command('dev')
  .description('本地服务')
  .action(() => {
    devServer();
  });

program.parse(process.argv);
