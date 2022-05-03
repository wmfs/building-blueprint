module.exports = function () {
  return async function setOccupancyRange (env, event) {
    const smallRangeFsec = ['OTHER_SLEEPING', 'SHOP', 'PUBLIC_BUILDING-OTHER', 'FACTORY', 'OTHER_WORKPLACE']
    const largeRangeFsec = ['HOSPITAL', 'HOSTEL', 'HOTEL', 'FURTHER_EDUCATION', 'PUBLIC_BUILDING', 'LICENSED_PREMISE', 'SCHOOL', 'OFFICE']
    const smallRanges = [
      {
        title: '1 - 50',
        min: 1,
        max: 50
      },
      {
        title: '51 - 200',
        min: 51,
        max: 200
      },
      {
        title: '200+',
        min: 201,
        max: null
      }
    ]
    const largeRanges = [
      {
        title: '1 - 50',
        min: 1,
        max: 50
      },
      {
        title: '51 - 200',
        min: 51,
        max: 200
      },
      {
        title: '201 - 1000',
        min: 201,
        max: 1000
      },
      {
        title: '1000+',
        min: 1001,
        max: null
      }
    ]

    const withinRange = ({ min, max }) => (min <= event.building.occupants && (event.building.occupants <= max || max === null))

    const fsec = event.building.fsec
    let occupancyRange = event.building.occupants > 0 ? event.building.occupants : ''

    if (smallRangeFsec.includes(fsec)) {
      occupancyRange = smallRanges.find(withinRange).title
    } else if (largeRangeFsec.includes(fsec)) {
      occupancyRange = largeRanges.find(withinRange).title
    }

    event.building.occupancyRange = occupancyRange

    return event
  }
}
