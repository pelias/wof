module.exports = {
  command: 'fs',
  describe: 'interact with files in the filesystem',
  builder: (yargs) => yargs
    .commandDir('fs')
    .usage('$0 <cmd> [args]')
    .demandCommand(1, '')
}
