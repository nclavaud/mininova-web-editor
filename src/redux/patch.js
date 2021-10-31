import { controls } from '../mininova';

const PATCH_CONTROL_CHANGED = 'PATCH_CONTROL_CHANGED';
const PATCH_DUMP_RECEIVED = 'PATCH_DUMP_RECEIVED';

export const patchControlChanged = (id, value) => (
  {
    type: PATCH_CONTROL_CHANGED,
    payload: {
      id,
      value,
    },
  }
);

export const patchDumpReceived = data => (
  {
    type: PATCH_DUMP_RECEIVED,
    payload: {
      data,
    },
  }
);

const initialState = [];
for (let [id, control] of Object.entries(controls)) {
  initialState[id] = control.init;
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case PATCH_DUMP_RECEIVED:
      var name = '';
      for (var i=15;i<31;i++) {
          name += String.fromCharCode(action.payload.data[i]);
      }
      console.log("NAME: ",name);
      return {
        ...state,
        'patch-name':name,
        'osc-vibrato-depth': action.payload.data[42],
        'osc-vibrato-speed': action.payload.data[41],
        'osc-drift': action.payload.data[43],
        'osc-phase': action.payload.data[44],
        'osc-fixed-note': action.payload.data[45],
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
        'osc-1-level': action.payload.data[76],
        'osc-2-level': action.payload.data[77],
        'osc-3-level': action.payload.data[78],
        'ring-mod-level-1-3': action.payload.data[79],
        'ring-mod-level-2-3': action.payload.data[80],
        'noise-level': action.payload.data[81],
        'noise-type': action.payload.data[82],
        'filter-routing': action.payload.data[86],
        'filter-balance': action.payload.data[87]-64,
        'filter-freqlink':action.payload.data[88]&1,
        'filter-reslink': action.payload.data[88]&1-1,
        'filter-1-drive': action.payload.data[89],
        'filter-1-drive-type': action.payload.data[90],
        'filter-1-type': action.payload.data[91],
        'filter-1-track': action.payload.data[93],
        'filter-1-resonance': action.payload.data[94],
        'filter-1-frequency': action.payload.data[92],
        'filter-1-qnormalize': action.payload.data[95],
        'filter-1-env2-to-freq': action.payload.data[96],
        'filter-2-drive': action.payload.data[97],
        'filter-2-drive-type': action.payload.data[98],
        'filter-2-type': action.payload.data[99],
        'filter-2-track': action.payload.data[100],
        'filter-2-resonance': action.payload.data[103],
        'filter-2-frequency': action.payload.data[101],
        'filter-2-qnormalize': action.payload.data[104],
        'filter-2-env2-to-freq': action.payload.data[102],

      };
    case PATCH_CONTROL_CHANGED:
      return {
        ...state,
        [action.payload.id]: action.payload.value,
      };
    default:
      return state;
  }
};
