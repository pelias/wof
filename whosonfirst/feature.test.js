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

module.exports.getAltPlacetypes = (test) => {
  test('getAltPlacetypes', (t) => {
    t.deepEqual([], feature.getAltPlacetypes({}))
    t.deepEqual(['ALT_PLACETYPE'], feature.getAltPlacetypes({
      properties: { 'wof:placetype_alt': 'ALT_PLACETYPE' }
    }))
    t.deepEqual(['ALT_PLACETYPE', 'ALT_PLACETYPE2'], feature.getAltPlacetypes({
      properties: { 'wof:placetype_alt': ['ALT_PLACETYPE', 'ALT_PLACETYPE2'] }
    }))
    t.end()
  })
}

module.exports.getLocalLanguages = (test) => {
  test('getLocalLanguages', (t) => {
    t.deepEqual([], feature.getLocalLanguages({}))
    t.deepEqual(['und'], feature.getLocalLanguages({
      properties: { 'wof:lang_x_official': 'UND' }
    }))
    t.deepEqual(['und', 'eng'], feature.getLocalLanguages({
      properties: { 'wof:lang_x_official': ['UND', 'ENG', ''] }
    }))
    t.deepEqual(['und'], feature.getLocalLanguages({
      properties: { 'wof:lang_x_official': 'UND' }
    }, 'official'))
    t.deepEqual(['und', 'eng'], feature.getLocalLanguages({
      properties: { 'wof:lang_x_official': ['UND', 'ENG', 1] }
    }, 'official'))
    t.deepEqual(['und'], feature.getLocalLanguages({
      properties: { 'wof:lang_x_spoken': 'UND' }
    }, 'spoken'))
    t.deepEqual(['und', 'eng'], feature.getLocalLanguages({
      properties: { 'wof:lang_x_spoken': ['UND', 'ENG', {}] }
    }, 'spoken'))
    t.end()
  })
}

module.exports.getPlacetypeLocal = (test) => {
  test('getPlacetypeLocal', (t) => {
    t.deepEqual([], feature.getPlacetypeLocal({}))
    t.deepEqual(['LOCAL_PLACETYPE'], feature.getPlacetypeLocal({
      properties: { 'wof:placetype_local': 'LOCAL_PLACETYPE' }
    }))
    t.deepEqual(['LOCAL_PLACETYPE'], feature.getPlacetypeLocal({
      properties: { 'wof:placetype_local': ['LOCAL_PLACETYPE'] }
    }))
    t.deepEqual(['ENDONYM_PLACETYPE', 'LOCAL_PLACETYPE'], feature.getPlacetypeLocal({
      properties: {
        'wof:lang_x_official': 'und',
        'label:und_x_preferred_placetype': 'ENDONYM_PLACETYPE',
        'wof:placetype_local': 'LOCAL_PLACETYPE'
      }
    }))
    t.end()
  })
}

module.exports.getOfficialConcordanceKey = (test) => {
  test('getOfficialConcordanceKey', (t) => {
    t.deepEqual([], feature.getOfficialConcordanceKey({}))
    t.deepEqual(['abc:id'], feature.getOfficialConcordanceKey({
      properties: {
        'wof:concordances_official': 'abc:id'
      }
    }))
    t.deepEqual(['abc:id'], feature.getOfficialConcordanceKey({
      properties: {
        'wof:concordances_official': 'abc:id',
        'wof:concordances': { 'abc:id': '06001' }
      }
    }))
    t.end()
  })
}

module.exports.getOfficialConcordanceValue = (test) => {
  test('getOfficialConcordanceValue', (t) => {
    t.deepEqual([], feature.getOfficialConcordanceValue({}))
    t.deepEqual([], feature.getOfficialConcordanceValue({
      properties: {
        'wof:concordances_official': 'abc:id'
      }
    }))
    t.deepEqual(['06001'], feature.getOfficialConcordanceValue({
      properties: {
        'wof:concordances_official': 'abc:id',
        'wof:concordances': { 'abc:id': '06001' }
      }
    }))
    t.end()
  })
}
