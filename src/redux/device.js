import { noDevice } from '../debug';

const DEVICE_INPUT_SELECTED = 'DEVICE_INPUT_SELECTED';
const DEVICE_OUTPUT_SELECTED = 'DEVICE_OUTPUT_SELECTED';
const DEVICE_INPUT_OUTPUT_SELECTED = 'DEVICE_INPUT_OUTPUT_SELECTED';

export const deviceInputSelected = device => (
  {
    type: DEVICE_INPUT_SELECTED,
    payload: {
      device,
    },
  }
)

export const deviceOutputSelected = device => (
  {
    type: DEVICE_OUTPUT_SELECTED,
    payload: {
      device,
    },
  }
)

export const deviceInputOutputSelected = device => (
  {
    type: DEVICE_INPUT_OUTPUT_SELECTED,
    payload: {
      device,
    },
  }
)

const initialState = {
  input: noDevice,
  output: noDevice,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case DEVICE_INPUT_SELECTED:
      return {
        ...state,
        input: action.payload.device,
      };
    case DEVICE_OUTPUT_SELECTED:
      return {
        ...state,
        output: action.payload.device,
      };
    case DEVICE_INPUT_OUTPUT_SELECTED:
      return {
        ...state,
        input: action.payload.device,
        output: action.payload.device,
      };
    default:
      return state;
  }
};
