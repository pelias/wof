module.exports = {
  command: 'feature',
  describe: 'misc functions for working with feature streams',
  builder: (yargs) => yargs
    .commandDir('feature')
    .usage('$0 <cmd> [args]')
    .demandCommand(1, '')
}
