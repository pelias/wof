const file = require('./file')

module.exports.interface = (test) => {
  test('interface', (t) => {
    t.true(file.path.fromID)
    t.true(file.path.fromFeature)
    t.end()
  })
}

module.exports.fromID = (test) => {
  test('fromID', (t) => {
    t.equal(file.path.fromID(1), '1/1.geojson')
    t.equal(file.path.fromID(12), '12/12.geojson')
    t.equal(file.path.fromID(123), '123/123.geojson')
    t.equal(file.path.fromID(1234), '123/4/1234.geojson')
    t.equal(file.path.fromID(12345), '123/45/12345.geojson')
    t.equal(file.path.fromID(123456), '123/456/123456.geojson')
    t.equal(file.path.fromID(1234567), '123/456/7/1234567.geojson')
    t.equal(file.path.fromID(12345678), '123/456/78/12345678.geojson')
    t.equal(file.path.fromID(123456789), '123/456/789/123456789.geojson')
    t.equal(file.path.fromID(1234567890), '123/456/789/0/1234567890.geojson')
    t.end()
  })
  test('fromID - alt geometry', (t) => {
    t.equal(file.path.fromID(1, 'example'), '1/1-alt-example.geojson')
    t.equal(file.path.fromID(12, 'example'), '12/12-alt-example.geojson')
    t.equal(file.path.fromID(123, 'example'), '123/123-alt-example.geojson')
    t.equal(file.path.fromID(1234, 'example'), '123/4/1234-alt-example.geojson')
    t.equal(file.path.fromID(12345, 'example'), '123/45/12345-alt-example.geojson')
    t.equal(file.path.fromID(123456, 'example'), '123/456/123456-alt-example.geojson')
    t.equal(file.path.fromID(1234567, 'example'), '123/456/7/1234567-alt-example.geojson')
    t.equal(file.path.fromID(12345678, 'example'), '123/456/78/12345678-alt-example.geojson')
    t.equal(file.path.fromID(123456789, 'example'), '123/456/789/123456789-alt-example.geojson')
    t.equal(file.path.fromID(1234567890, 'example'), '123/456/789/0/1234567890-alt-example.geojson')
    t.end()
  })
}

module.exports.fromFeature = (test) => {
  test('fromFeature', (t) => {
    t.equal(file.path.fromFeature({ properties: { 'wof:id': 1 } }), '1/1.geojson')
    t.equal(file.path.fromFeature({ properties: { 'wof:id': 12 } }), '12/12.geojson')
    t.equal(file.path.fromFeature({ properties: { 'wof:id': 123 } }), '123/123.geojson')
    t.equal(file.path.fromFeature({ properties: { 'wof:id': 1234 } }), '123/4/1234.geojson')
    t.equal(file.path.fromFeature({ properties: { 'wof:id': 12345 } }), '123/45/12345.geojson')
    t.equal(file.path.fromFeature({ properties: { 'wof:id': 123456 } }), '123/456/123456.geojson')
    t.equal(file.path.fromFeature({ properties: { 'wof:id': 1234567 } }), '123/456/7/1234567.geojson')
    t.equal(file.path.fromFeature({ properties: { 'wof:id': 12345678 } }), '123/456/78/12345678.geojson')
    t.equal(file.path.fromFeature({ properties: { 'wof:id': 123456789 } }), '123/456/789/123456789.geojson')
    t.equal(file.path.fromFeature({ properties: { 'wof:id': 1234567890 } }), '123/456/789/0/1234567890.geojson')
    t.end()
  })
  test('fromFeature - alt geometry', (t) => {
    const alt = { 'src:alt_label': 'example' }
    t.equal(file.path.fromFeature({ properties: { ...alt, 'wof:id': 1 } }), '1/1-alt-example.geojson')
    t.equal(file.path.fromFeature({ properties: { ...alt, 'wof:id': 12 } }), '12/12-alt-example.geojson')
    t.equal(file.path.fromFeature({ properties: { ...alt, 'wof:id': 123 } }), '123/123-alt-example.geojson')
    t.equal(file.path.fromFeature({ properties: { ...alt, 'wof:id': 1234 } }), '123/4/1234-alt-example.geojson')
    t.equal(file.path.fromFeature({ properties: { ...alt, 'wof:id': 12345 } }), '123/45/12345-alt-example.geojson')
    t.equal(file.path.fromFeature({ properties: { ...alt, 'wof:id': 123456 } }), '123/456/123456-alt-example.geojson')
    t.equal(file.path.fromFeature({ properties: { ...alt, 'wof:id': 1234567 } }), '123/456/7/1234567-alt-example.geojson')
    t.equal(file.path.fromFeature({ properties: { ...alt, 'wof:id': 12345678 } }), '123/456/78/12345678-alt-example.geojson')
    t.equal(file.path.fromFeature({ properties: { ...alt, 'wof:id': 123456789 } }), '123/456/789/123456789-alt-example.geojson')
    t.equal(file.path.fromFeature({ properties: { ...alt, 'wof:id': 1234567890 } }), '123/456/789/0/1234567890-alt-example.geojson')
    t.end()
  })
}
