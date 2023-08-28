#!/usr/bin/env node

import logger from '../lib/logger/logger.js';
import checkNodeVersion from '../lib/node-version-check/index.js';
import { Command } from 'commander';
import pkg from '../package.json' assert { type: 'json' };
import util from './util.js';
import apix from '../index.js';

checkNodeVersion();

const program = new Command();

program.name('apix').version(pkg.version, '-v, --version'); //.addHelpCommand(false);

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
