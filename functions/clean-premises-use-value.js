module.exports = function () {
  return function (event) {
    if (event && Array.isArray(event.premisesUse)) {
      event.premisesUse = event.premisesUse.filter(pu => typeof pu === 'string')
    }

    return event
  }
}
