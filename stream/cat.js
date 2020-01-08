const shell = require('./shell')

module.exports = () => shell.spawn(
  'cat',
  [],
  { stdio: ['pipe', 'inherit', 'inherit'] }
).stdin
