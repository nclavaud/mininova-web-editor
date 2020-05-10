const initialState = {
  isSupported: !!navigator.requestMIDIAccess,
  detectionComplete: false,
  inputs: [],
  outputs: [],
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'MIDI_DEVICES_DETECTED':
      return {
        ...state,
        detectionComplete: true,
        inputs: action.payload.inputs,
        outputs: action.payload.outputs,
      };
    default:
      return state;
  }
};
