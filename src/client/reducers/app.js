const initialState = {
  selectedPark: null,
  parks: []
}

export const appReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'setSelectedPark': {
      console.log('reducer setSelectedPark', action)
      return {
        ...state,
        selectedPark: action.payload
      }
    }
    default:
      return state
  }
}
