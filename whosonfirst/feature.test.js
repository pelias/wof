const feature = require('./feature')

module.exports.interface = (test) => {
  test('interface', (t) => {
    t.true(feature.getSource)
    t.end()
  })
}

module.exports.getSource = (test) => {
  test('getSource', (t) => {
    t.equal('unknown', feature.getSource({}))
    t.equal('GEOM_SRC', feature.getSource({
      properties: {
        'src:geom': 'GEOM_SRC'
      }
    }))

    // return src:geom even when src:alt_label available
    t.equal('GEOM_SRC', feature.getSource({
      properties: {
        'src:geom': 'GEOM_SRC',
        'src:alt_label': 'ALT_LABEL'
      }
    }))
    t.end()
  })
}

module.exports.getAltLabel = (test) => {
  test('getAltLabel', (t) => {
    t.false(feature.getAltLabel({}))
    t.equal('ALT_LABEL', feature.getAltLabel({
      properties: {
        'src:alt_label': 'ALT_LABEL'
      }
    }))
    t.end()
  })
}
