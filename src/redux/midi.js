const initialState = {
  isSupported: !!navigator.requestMIDIAccess,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
