const path = require('path')
const all = require('require-all')
const stream = all(path.join(__dirname, '../../../stream'))

module.exports = {
  command: 'format',
  describe: 'reformat a feature stream',
  builder: (yargs) => {
    yargs.option('open', {
      type: 'string',
      default: '',
      describe: 'Tokens to emit at the start of the stream.'
    })
    yargs.option('sep', {
      type: 'string',
      default: '\n',
      describe: 'Tokens to emit after each recod in the stream.'
    })
    yargs.option('close', {
      type: 'string',
      default: '',
      describe: 'Tokens to emit at the end of the stream.'
    })
    yargs.option('indent', {
      type: 'number',
      default: 0,
      describe: 'Pretty print using this number of space characters.'
    })
  },
  handler: (yargs) => {
    process.stdin
      .pipe(stream.json.parse())
      .pipe(stream.json.stringify(yargs.open, yargs.sep, yargs.close, yargs.indent))
      .pipe(process.stdout)
  }
}
