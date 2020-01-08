module.exports = {
  command: 'sqlite',
  describe: 'interact with SQLite databases',
  builder: (yargs) => yargs
    .commandDir('sqlite')
    .usage('$0 <cmd> [args]')
    .demandCommand(1, '')
}
