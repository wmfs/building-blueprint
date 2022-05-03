const RangeMap = require('../shared/occupancy-range-map')

module.exports = function () {
  return async function setOccupancyRange (env, event) {
    const withinRange = ({ min, max }) => (min <= event.building.occupants && (event.building.occupants <= max || max === null))
    console.log('event.building.occupants: ' + event.building.occupants + ' \nwithinRange: ' + withinRange + '\nfsec: ' + event.building.fsec)

    const fsec = event.building.fsec
    let occupancyRange = event.building.occupants > 0 ? event.building.occupants : ''

    if (RangeMap.smallRangedFsec.includes(fsec)) {
      occupancyRange = RangeMap.smallRanges.find(withinRange).title
    } else if (RangeMap.largeRangedFsec.includes(fsec)) {
      occupancyRange = RangeMap.largeRanges.find(withinRange).title
    }

    event.building.occupancyRange = occupancyRange

    return event
  }
}
