import { noDevice } from '../debug';

const initialState = {
  input: noDevice,
  output: noDevice,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'DEVICE_SELECT_INPUT':
      return {
        ...state,
        input: action.payload.device,
      };
    case 'DEVICE_SELECT_OUTPUT':
      return {
        ...state,
        output: action.payload.device,
      };
    case 'DEVICE_SELECT_IO':
      return {
        ...state,
        input: action.payload.device,
        output: action.payload.device,
      };
    default:
      return state;
  }
};
