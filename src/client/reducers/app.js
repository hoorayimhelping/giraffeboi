const initialState = {
  selectedPark: null,
  parks: [
    {
      id: 6,
      name: 'Magic Kingdom'
    },
    {
      id: 7,
      name: 'Disney California Adventure'
    },
    {
      id: 5,
      name: "EPCOT",
    },
  ],
  selectedParkRides: []
};

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case "setSelectedPark": {
      return {
        ...state,
        selectedPark: action.payload,
      };
    }

    case 'setSelectedParkRides': {
      return {
        ...state,
        selectedParkRides: action.payload
      }
    }

    default:
      return state;
  }
};
