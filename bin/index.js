#!/usr/bin/env node

import checkNodeVersion from '../lib/node-version-check/index.js';
import { Command } from 'commander';
import util from './util.js';
import apix from '../index.js';
import fs from 'fs/promises';
const pkg = JSON.parse(await fs.readFile('./package.json', 'utf8'));

checkNodeVersion();

const program = new Command();

program.name('apix').version(pkg.version, '-v, --version');

program
  .command('run')
  .description('execute Postman collections from a given path')
  .argument('<collections>', 'a path to one or more collections')
  .usage('<collection> [options]')
  .option(
    '-e, --environment <path>',
    'Specify a URL or path to a Postman Environment'
  )
  .option(
    '--parallel',
    'If more than one collection are present in the given <collection> path, the flag enable parallel execution'
  )
  .option('-k, --insecure', 'Disables SSL validations')
  .action((collections, command) => {
    const options = util.commanderToObject(command);

    apix.run(collections, options);
  });

program.parse();
