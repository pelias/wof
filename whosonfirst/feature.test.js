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
    // Makkah, Saudi Arabia
    t.deepEqual(['مقاطعة (muhafazah)'], feature.getPlacetypeLocal({
      properties: {
        'wof:lang_x_official': 'ara',
        'label:ara_x_preferred_placetype': 'مقاطعة',
        'label:ara_latn_x_preferred_placetype': 'muhafazah',
        'label:eng_x_preferred_placetype': 'region',
        'wof:placetype': 'region'
      }
    }))
    // Glasgow, Scotland, UK
    t.deepEqual(['unitary district'], feature.getPlacetypeLocal({
      properties: {
        'wof:lang_x_official': 'eng',
        'label:eng_x_preferred_placetype': 'unitary district',
        'wof:placetype_local': 'unitary district',
        'wof:placetype': 'county'
      }
    }))
    // Madrid, province in Spain
    t.deepEqual(['provincia'], feature.getPlacetypeLocal({
      properties: {
        'wof:lang_x_official': 'spa',
        'label:eng_x_preferred_placetype': 'provincia',
        'label:eng_x_preferred_placetype': 'province',
        'wof:placetype_local': 'autonomous community',   // old junk data
        'wof:placetype': 'region'
      }
    }))   
    t.end()
  })
}
