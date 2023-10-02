const _ = require('lodash')
const _spr = require('../spr')
const filters = require('./_filters')
const feature = require('../feature')

/**
 * This is a semi-official view of the data used for generating shapefile extracts.
 *
 * The shapefile format is fairly restrictive:
 * - no column name may be longer than 10 chars
 * - a file can only contain a single geometry type (and the multi-equivalent, except MULTIPOINT)
 * - no individual file within the set may be over 2GB in size
 *
 * @see: esri.com/content/dam/esrisites/sitecore-archive/Files/Pdfs/library/whitepapers/pdfs/shapefile.pdf
 */

module.exports = (feat, params) => {
  // param filters
  if (!filters.params(feat, params)) return null

  const spr = _spr(feat)

  // exportable filters
  if (!filters.exportable(feat, spr)) return null

  feat.properties = {
    /* standard places response */
    id: spr.id,
    parent_id: spr.parent_id,
    name: spr.name,
    placetype: spr.placetype,
    placelocal: feature.getPlaceTypeLocal(feat),
    country: spr.country,
    repo: spr.repo,
    lat: spr.latitude,
    lon: spr.longitude,
    min_lat: spr.min_latitude,
    min_lon: spr.min_longitude,
    max_lat: spr.max_latitude,
    max_lon: spr.max_longitude,

    /* zoom levels */
    min_zoom: _.get(feat, 'properties.mz:min_zoom', ''),
    max_zoom: _.get(feat, 'properties.mz:max_zoom', ''),
    min_label: _.get(feat, 'properties.lbl:min_zoom', ''),
    max_label: _.get(feat, 'properties.lbl:max_zoom', ''),

    modified: new Date(spr.lastmodified * 1000).toISOString().split('T')[0],

    /* extended properties */
    is_funky: _.get(feat, 'properties.mz:is_funky', ''),
    population: _.get(feat, 'properties.wof:population', ''),
    /* country and dependency are collectively "admin 0" for most general end users */
    country_id: _.get(feat, 'properties.wof:hierarchy[0].country_id', _.get(feat, 'properties.wof:hierarchy[0].dependency_id', '')),
    region_id: _.get(feat, 'properties.wof:hierarchy[0].region_id', ''),
    county_id: _.get(feat, 'properties.wof:hierarchy[0].county_id', ''),

    /* national concordances */
    concord_ke: _.get(feat, 'properties.wof:concordances_official', ''),
    concord_id: _.get(feat, `properties.wof:concordances[${_.get(feat, 'properties.wof:concordances_official', '')}]`),

    /* international concordances */
    iso_code: _.get(feat, 'properties.wof:concordances.iso:code', ''),
    hasc_id: _.get(feat, 'properties.wof:concordances.hasc:id', ''),

    /* widely available concordances */
    gn_id: _.get(feat, 'properties.wof:concordances.gn:id', ''),
    wd_id: _.get(feat, 'properties.wof:concordances.wd:id', ''),

    /* translations */
    ...[
      'ara', 'ben', 'deu', 'eng', 'ell', 'fas', 'fra', 'heb', 'hin', 'hun', 'ind', 'ita',
      'jpn', 'kor', 'nld', 'pol', 'por', 'rus', 'spa', 'swe', 'tur', 'ukr', 'urd', 'vie', 'zho'
    ].reduce((names, code) => {
      names[`name_${code}`] = _.get(feat, `properties.name:${code}_x_preferred[0]`, '')
      return names
    }, {}),

    /* geometry */
    geom_src: _.get(feat, 'properties.src:geom', '')
  }

  return feat
}
