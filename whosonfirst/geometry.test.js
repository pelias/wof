const geometry = require('./geometry')

module.exports.interface = (test) => {
  test('interface', (t) => {
    t.true(geometry.bbox)
    t.end()
  })
}

module.exports.bbox = (test) => {
  test('bbox - from properties', (t) => {
    t.deepEquals(geometry.bbox({
      properties: {
        'geom:bbox': '1.1,2.2,3.3,4.4'
      }
    }), [1.1, 2.2, 3.3, 4.4])
    t.end()
  })
  test('bbox - from properties - null island', (t) => {
    t.deepEquals(geometry.bbox({
      properties: {
        'geom:bbox': '0,0,0,0'
      }
    }), [0, 0, 0, 0])
    t.end()
  })
  test('bbox - from geometry', (t) => {
    t.deepEquals(geometry.bbox({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [[1.1, 2.2], [3.3, 4.4]]
      }
    }), [1.1, 2.2, 3.3, 4.4])
    t.end()
  })
  test('bbox - from geometry - null island', (t) => {
    t.deepEquals(geometry.bbox({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      }
    }), [0, 0, 0, 0])
    t.end()
  })
  test('bbox - force geometry', (t) => {
    t.deepEquals(geometry.bbox({
      type: 'Feature',
      properties: {
        'geom:bbox': '1.1,2.2,3.3,4.4'
      },
      geometry: {
        type: 'LineString',
        coordinates: [[5.5, 6.6], [7.7, 8.8]]
      }
    }, true), [5.5, 6.6, 7.7, 8.8])
    t.end()
  })
}

module.exports.centroid = (test) => {
  test('centroid - default', (t) => {
    t.deepEquals(geometry.centroid({}), { lon: 0, lat: 0 })
    t.end()
  })
  test('centroid - both namespace properties must be set', (t) => {
    t.deepEquals(geometry.centroid({
      properties: {
        'geom:longitude': 1.1
      }
    }), { lon: 0, lat: 0 })
    t.end()
  })
  test('centroid - both namespace properties must be valid', (t) => {
    t.deepEquals(geometry.centroid({
      properties: {
        'geom:longitude': 1.1,
        'geom:latitude': 'a'
      }
    }), { lon: 0, lat: 0 })
    t.end()
  })
  test('centroid - namespace properties can be strings', (t) => {
    t.deepEquals(geometry.centroid({
      properties: {
        'geom:longitude': '1.1',
        'geom:latitude': '2.2'
      }
    }), { lon: 1.1, lat: 2.2 })
    t.end()
  })

  test('centroid - use "geom" namespace where available', (t) => {
    t.deepEquals(geometry.centroid({
      properties: {
        'geom:longitude': 1.1,
        'geom:latitude': 2.2
      }
    }), { lon: 1.1, lat: 2.2 })
    t.end()
  })
  test('centroid - prefer "reversegeo" namespace', (t) => {
    t.deepEquals(geometry.centroid({
      properties: {
        'geom:longitude': 1.1,
        'geom:latitude': 2.2,
        'reversegeo:longitude': 3.3,
        'reversegeo:latitude': 4.4
      }
    }), { lon: 3.3, lat: 4.4 })
    t.end()
  })
  test('centroid - prefer "lbl" namespace', (t) => {
    t.deepEquals(geometry.centroid({
      properties: {
        'geom:longitude': 1.1,
        'geom:latitude': 2.2,
        'reversegeo:longitude': 3.3,
        'reversegeo:latitude': 4.4,
        'lbl:longitude': 5.5,
        'lbl:latitude': 6.6
      }
    }), { lon: 5.5, lat: 6.6 })
    t.end()
  })
}
