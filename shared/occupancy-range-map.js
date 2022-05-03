const RangeMap = {
  smallRangedFsec: [
    'OTHER_SLEEPING',
    'SHOP',
    'PUBLIC_BUILDING-OTHER',
    'FACTORY',
    'OTHER_WORKPLACE'
  ],
  largeRangedFsec: [
    'HOSPITAL',
    'HOSTEL',
    'HOTEL',
    'FURTHER_EDUCATION',
    'PUBLIC_BUILDING',
    'LICENSED_PREMISE',
    'SCHOOL',
    'OFFICE'
  ],
  smallRanges: [
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
  ],
  largeRanges: [
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
}

module.exports = RangeMap
