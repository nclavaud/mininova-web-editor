const initialState = {
  isSupported: !!navigator.usb,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
