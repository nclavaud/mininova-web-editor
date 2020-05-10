import { combineReducers } from 'redux';
import { reducer as patchReducer } from './patch';

export const reducer = combineReducers({
  patch: patchReducer,
});
