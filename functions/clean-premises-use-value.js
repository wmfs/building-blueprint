module.exports = function () {
  return function (event) {
    if (Array.isArray(event.premisesUse)) {
      event.premisesUse = event.premisesUse.filter(pu => typeof pu === 'string')
    }

    return event
  }
}