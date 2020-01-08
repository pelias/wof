module.exports = {
  command: 'bundle',
  describe: 'interact with tar bundles',
  builder: (yargs) => yargs
    .commandDir('bundle')
    .usage('$0 <cmd> [args]')
    .demandCommand(1, '')
}
