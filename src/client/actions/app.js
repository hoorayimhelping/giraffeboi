export const setSelectedPark = (parkId) => {
  return {type: 'setSelectedPark', payload: parkId}
}

export const setSelectedParkRides = (rides) => {
  return {type: 'setSelectedParkRides', payload: rides}
}
