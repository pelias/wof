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
