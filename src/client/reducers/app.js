const initialState = {
  selectedPark: null,
  parks: [
    {
      id: 0,
      name: 'DisneyLand'
    },
    {
      id: 1,
      name: 'Universal Studios'
    },
    {
      id: 5,
      name: "EPCOT",
    },
  ],
};

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case "setSelectedPark": {
      return {
        ...state,
        selectedPark: action.payload,
      };
    }

    default:
      return state;
  }
};
