import { controls } from '../mininova';

const initialState = [];
for (let [id, control] of Object.entries(controls)) {
  initialState[id] = control.init;
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PATCH_DUMP_RECEIVED':
      return {
        ...state,
        'osc-1-wave': action.payload.data[46],
        'osc-1-semitones': action.payload.data[53],
        'osc-1-cents': action.payload.data[54],
        'osc-1-vsync': action.payload.data[49],
        'osc-1-pwwti': action.payload.data[48],
        'osc-1-hardness': action.payload.data[50],
        'osc-1-density': action.payload.data[51],
        'osc-1-densitydetune': action.payload.data[52],
        'osc-1-pitch': action.payload.data[55],
        'osc-1-wtint': action.payload.data[47],
        'osc-2-wave': action.payload.data[56],
        'osc-2-semitones': action.payload.data[63],
        'osc-2-cents': action.payload.data[64],
        'osc-2-vsync': action.payload.data[59],
        'osc-2-pwwti': action.payload.data[58],
        'osc-2-hardness': action.payload.data[60],
        'osc-2-density': action.payload.data[61],
        'osc-2-densitydetune': action.payload.data[62],
        'osc-2-pitch': action.payload.data[65],
        'osc-2-wtint': action.payload.data[57],
        'osc-3-wave': action.payload.data[66],
        'osc-3-semitones': action.payload.data[73],
        'osc-3-cents': action.payload.data[74],
        'osc-3-vsync': action.payload.data[69],
        'osc-3-pwwti': action.payload.data[68],
        'osc-3-hardness': action.payload.data[70],
        'osc-3-density': action.payload.data[71],
        'osc-3-densitydetune': action.payload.data[72],
        'osc-3-pitch': action.payload.data[75],
        'osc-3-wtint': action.payload.data[67],
      };
    case 'CONTROL_CHANGED':
      return {
        ...state,
        [action.payload.id]: action.payload.value,
      };
    default:
      return state;
  }
};
