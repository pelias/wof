const hierarchies = require('./hierarchies')

module.exports.interface = (test) => {
  test('interface', (t) => {
    t.equal(typeof hierarchies.deduplicate, 'function')
    t.equal(hierarchies.deduplicate.length, 1)
    t.end()
  })
}

module.exports.deduplicate = (test) => {
  test('deduplicate - zero branches', (t) => {
    t.deepEquals(hierarchies.deduplicate([]), [])
    t.end()
  })
  test('deduplicate - one equal branch', (t) => {
    t.deepEquals(hierarchies.deduplicate([
      { a: '1', b: '2' }
    ]), [
      { a: '1', b: '2' }
    ])
    t.end()
  })
  test('deduplicate - two equal branches', (t) => {
    t.deepEquals(hierarchies.deduplicate([
      { a: '1', b: '2' },
      { a: '1', b: '3' },
      { a: '1', b: '2' }
    ]), [
      { a: '1', b: '2' },
      { a: '1', b: '3' }
    ])
    t.end()
  })
  test('deduplicate - three equal branches', (t) => {
    t.deepEquals(hierarchies.deduplicate([
      { a: '1', b: '2' },
      { a: '1', b: '2' },
      { a: '1', b: '3' },
      { a: '1', b: '2' }
    ]), [
      { a: '1', b: '2' },
      { a: '1', b: '3' }
    ])
    t.end()
  })
  test('deduplicate - one subset branch', (t) => {
    t.deepEquals(hierarchies.deduplicate([
      { a: '1', b: '2' },
      { a: '1', b: '2', c: '3' }
    ]), [
      { a: '1', b: '2', c: '3' }
    ])
    t.end()
  })
  test('deduplicate - two subset branches', (t) => {
    t.deepEquals(hierarchies.deduplicate([
      { a: '1', b: '2' },
      { a: '1', b: '2', c: '3', d: '4' },
      { a: '1', b: '2', c: '3' }
    ]), [
      { a: '1', b: '2', c: '3', d: '4' }
    ])
    t.end()
  })
  test('deduplicate - complex', (t) => {
    t.deepEquals(hierarchies.deduplicate([
      { a: '1' },
      { a: '1', b: '2' },
      { a: '5', b: '6' },
      { a: '1', b: '2', c: '3' },
      { a: '1', b: '2', c: '3', d: '4' },
      { a: '5', b: '6', c: '3', d: '4' },
      { a: '1', b: '2', c: '3', d: '4', e: '5' },
      { a: '5', b: '6', c: '3', d: '4' },
      { a: '1', b: '2', c: '3', d: '4' },
      { a: '1', b: '2', c: '3' },
      { a: '3', b: '4' },
      { a: '1', b: '2' },
      { a: '1' }
    ]), [
      { a: '5', b: '6', c: '3', d: '4' },
      { a: '1', b: '2', c: '3', d: '4', e: '5' },
      { a: '3', b: '4' }
    ])
    t.end()
  })
}
