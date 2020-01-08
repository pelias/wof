module.exports = {
  command: 'git',
  describe: 'interact with git repositories',
  builder: (yargs) => yargs
    .commandDir('git')
    .usage('$0 <cmd> [args]')
    .demandCommand(1, '')
}
