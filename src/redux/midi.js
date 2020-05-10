const MIDI_DEVICES_DETECTED = 'MIDI_DEVICES_DETECTED';

export const midiDevicesDetected = (inputs, outputs) => (
  {
    type: MIDI_DEVICES_DETECTED,
    payload: {
      inputs,
        outputs,
    },
  }
);

const initialState = {
  isSupported: !!navigator.requestMIDIAccess,
  detectionComplete: false,
  inputs: [],
  outputs: [],
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case MIDI_DEVICES_DETECTED:
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
