import { combineReducers } from 'redux';
import { reducer as deviceReducer } from './device';
import { reducer as midiReducer } from './midi';
import { reducer as patchReducer } from './patch';
import { reducer as usbReducer } from './usb';

export const reducer = combineReducers({
  device: deviceReducer,
  midi: midiReducer,
  patch: patchReducer,
  usb: usbReducer,
});
