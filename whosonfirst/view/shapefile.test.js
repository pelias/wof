const view = require('./shapefile')

const fixture = require('path').join(__dirname, '../../test/fixtures/85676857.geojson')
const california = JSON.parse(require('fs').readFileSync(fixture, 'utf8'))

module.exports.shapefile = (test) => {
  test('shapefile', (t) => {
    t.deepEqual({
      id: 85676857,
      parent_id: 85632253,
      name: 'Makkah',
      placetype: 'region',
      placelocal: 'مقاطعة (muhafazah)',
      country: 'SA',
      repo: 'whosonfirst-data-admin-sa',
      lat: 21.939103,
      lon: 41.689276,
      min_lat: 18.461195,
      min_lon: 38.643749,
      max_lat: 23.694888,
      max_lon: 43.829112,
      min_zoom: 6.6,
      max_zoom: 11,
      min_label: 8,
      max_label: '',
      modified: '2023-08-01',
      is_funky: '',
      population: 6662597,
      country_id: 85632253,
      region_id: 85676857,
      county_id: '',
      gn_id: 104514,
      wd_id: 'Q234167',
      usgeo_id: '',
      hasc_id: 'SA.MK',
      name_ara: 'مكة',
      name_ben: 'মক্কা অঞ্চল',
      name_deu: 'Provinz Mekka',
      name_eng: 'Makkah',
      name_ell: 'Επαρχία Μάκκα',
      name_fas: 'استان مکه',
      name_fra: 'La Mecque',
      name_heb: 'מחוז מכה',
      name_hin: 'मक्का प्रान्त',
      name_hun: 'Mekka tartomány',
      name_ind: 'Provinsi Makkah',
      name_ita: 'provincia della Mecca',
      name_jpn: 'マッカ',
      name_kor: '막카',
      name_nld: 'Mekka',
      name_pol: 'Mekka',
      name_por: 'Meca',
      name_rus: 'Мекка',
      name_spa: 'Provincia de La Meca',
      name_swe: 'Mekka',
      name_tur: 'Mekke Bölgesi',
      name_ukr: 'Мекка',
      name_urd: 'صوبہ المکہ',
      name_vie: 'Khu vực Makkah',
      name_zho: '麦加',
      geom_src: 'whosonfirst'
    },
    view(california).properties)

    t.end()
  })
}
