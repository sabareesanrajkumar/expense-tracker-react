const initialState = {
  darkMode: false,
  isPremiumActivated: false,
};

const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return { ...state, darkMode: !state.darkMode };
    case 'ACTIVATE_PREMIUM':
      return { ...state, isPremiumActivated: true };
    default:
      return state;
  }
};

export default themeReducer;
