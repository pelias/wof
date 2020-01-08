#!/usr/bin/env node

require('yargs')
  .scriptName('wof')
  .usage('$0 <cmd> [args]')
  // .completion('completion')
  .option('verbose', {
    type: 'boolean',
    default: false,
    alias: 'v',
    describe: 'enable verbose logging'
  })
  .commandDir('cmd')
  .showHelpOnFail(true)
  .demandCommand(1, '')
  .help()
  .parse()
