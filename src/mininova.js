import * as R from 'ramda';
import { cc, nrpn, sysex } from './midi';
import { CommandType } from './midi.command';

// is it really handshake?
const sequenceHandshake = [0x7F, 0x60, 0x21, 0x00, 0x00, 0x00, 0x00];
const sequencePreHandshake = [0x7F, 0x62, 0x01, 0x00, 0x00, 0x00, 0x00];
const sequenceLoadCurrentPatch = [0x7F, 0x40, 0x00, 0x00, 0x00, 0x00, 0x00];
const sequencePatchResponse = [0xF0, 0x00, 0x20, 0x29, 0x03, 0x01, 0x7F, 0x00, 0x00, 0x09, 0x04];

const MIDINOVA_SIGNATURE = [0x00, 0x20, 0x29, 0x03, 0x01];
export const mininovaSysex = values => sysex(MIDINOVA_SIGNATURE.concat(values));

export const isPatch = message =>
  R.equals(R.take(sequencePatchResponse.length, Array.from(message)), sequencePatchResponse);

export const loadPatch = mininovaSysex(sequenceLoadCurrentPatch);

export const selectPatch = emit => {
  emit(mininovaSysex(sequencePreHandshake));
  setTimeout(() => emit(mininovaSysex(sequenceHandshake)), 1000);
  setTimeout(() => emit(nrpn(63, 0, 1)), 2000);
  setTimeout(() => emit(loadPatch), 3000);
};

const _cc = R.curry(cc);

const decodeCC = ([, x]) => x;

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const notesSequence = (noteFrom, octaveFrom, noteTo, octaveTo) => {
  const indexFrom = notes.indexOf(noteFrom);
  const indexTo = notes.indexOf(noteTo);
  const sequence = [];
  let index = indexFrom;
  let octave = octaveFrom;
  while (octave < octaveTo || (octave === octaveTo && index <= indexTo)) {
    sequence.push(`${notes[index]}${octave || ''}`);
    index++;
    if (index === notes.length) {
      index = 0;
      octave++;
    }
  }
  return sequence;
};

const waveforms = [
  'Sine',
  'Triangle',
  'Sawtooth',
  'Saw9:1PW',
  'Saw8:2PW',
  'Saw7:3PW',
  'Saw6:4PW',
  'Saw5:5PW',
  'Saw4:6PW',
  'Saw3:7PW',
  'Saw2:8PW',
  'Saw1:9PW',
  'PW',
  'Square',
  'BassCamp',
  'Bass_FM',
  'EP_Dull',
  'EP_Bell',
  'Clav',
  'DoubReed',
  'Retro',
  'StrnMch1',
  'StrnMch2',
  'Organ_1',
  'Organ_2',
  'EvilOrg',
  'HiStuff',
  'Bell_FM1',
  'Bell_FM2',
  'DigBell1',
  'DigBell2',
  'DigBell3',
  'DigBell4',
  'DigiPad',
  'Wtable 1',
  'Wtable 2',
  'Wtable 3',
  'Wtable 4',
  'Wtable 5',
  'Wtable 6',
  'Wtable 7',
  'Wtable 8',
  'Wtable 9',
  'Wtable10',
  'Wtable11',
  'Wtable12',
  'Wtable13',
  'Wtable14',
  'Wtable15',
  'Wtable16',
  'Wtable17',
  'Wtable18',
  'Wtable19',
  'Wtable20',
  'Wtable21',
  'Wtable22',
  'Wtable23',
  'Wtable24',
  'Wtable25',
  'Wtable26',
  'Wtable27',
  'Wtable28',
  'Wtable29',
  'Wtable30',
  'Wtable31',
  'Wtable32',
  'Wtable33',
  'Wtable34',
  'Wtable35',
  'Wtable36',
  'AudInL/M',
  // Two audio sources are included in the Waveform table;
  // although the MiniNova only has a single audio input (AudInL/M),
  // AudioInR is included for compatibility with UltraNova Patches
  'AudioInR',
];

export const controls = {
  'patch-name': {
      label: 'Name',
      range: [],
      type: CommandType.None,
      init: '',
  },
  'tempo': {
    label: 'Tempo',
    range: [40, 250],
    init: 40,
    type: CommandType.NRPN,
    mapFrom: [
      [2, 63, 0, [40, 127]],
      [2, 63, 1, [0, 122]],
    ],
    decode: ([, , x, y]) => (x<<7)|y,
    msg: x => nrpn(2, 63, x>>7, x&127),
  },
  'osc-1-wave': {
    label: 'Wave',
    enum: waveforms,
    init: 2,
    msg: _cc(19),
  },
  'osc-1-wtint': {
    label: 'Wave Table Interpolation',
    range: [0, 127],
    init: 127,
    msg: _cc(20),
  },
  'osc-1-pwwti': {
    label: 'Pulse Width / Wave Table index',
    range: [0, 127],
    init: 64,
    msg: _cc(21),
  },
  'osc-1-vsync': {
    label: 'Virtual Sync',
    range: [0, 127],
    init: 0,
    msg: _cc(22),
  },
  'osc-1-hardness': {
    label: 'Hardness',
    range: [0, 127],
    init: 0,
    msg: _cc(23),
  },
  'osc-1-density': {
    label: 'Density',
    range: [0, 127],
    init: 0,
    msg: _cc(24),
  },
  'osc-1-densitydetune': {
    label: 'Density Detune',
    range: [0, 127],
    init: 0,
    msg: _cc(25),
  },
  'osc-1-semitones': {
    label: 'Semitones',
    range: [0, 127],
    init: 64,
    msg: _cc(26),
  },
  'osc-1-cents': {
    label: 'Detune cents',
    range: [0, 127],
    init: 64,
    msg: _cc(27),
  },
  'osc-1-pitch': {
    range: [52, 76],
    label: 'Pitch Wheel',
    init: 76,
    msg: _cc(28),
  },
  'osc-2-wave': {
    label: 'Wave',
    enum: waveforms,
    init: 2,
    msg: _cc(29),
  },
  'osc-2-wtint': {
    label: 'Wave Table Interpolation',
    range: [0, 127],
    init: 127,
    msg: _cc(30),
  },
  'osc-2-pwwti': {
    label: 'Pulse Width / Wave Table index',
    range: [0, 127],
    init: 64,
    msg: _cc(31),
  },
  'osc-2-vsync': {
    label: 'Virtual Sync',
    range: [0, 127],
    init: 0,
    msg: _cc(33),
  },
  'osc-2-hardness': {
    label: 'Hardness',
    range: [0, 127],
    init: 0,
    msg: _cc(34),
  },
  'osc-2-density': {
    label: 'Density',
    range: [0, 127],
    init: 0,
    msg: _cc(35),
  },
  'osc-2-densitydetune': {
    label: 'Density Detune',
    range: [0, 127],
    init: 0,
    msg: _cc(36),
  },
  'osc-2-semitones': {
    label: 'Semitones',
    range: [0, 127],
    init: 64,
    msg: _cc(37),
  },
  'osc-2-cents': {
    label: 'Detune cents',
    range: [0, 127],
    init: 64,
    msg: _cc(39),
  },
  'osc-2-pitch': {
    label: 'Pitch Wheel',
    range: [52, 76],
    init: 76,
    msg: _cc(40),
  },
  'osc-3-wave': {
    label: 'Wave',
    enum: waveforms,
    init: 2,
    msg: _cc(41),
  },
  'osc-3-wtint': {
    label: 'Wave Table Interpolation',
    range: [0, 127],
    init: 127,
    msg: _cc(42),
  },
  'osc-3-pwwti': {
    label: 'Pulse Width / Wave Table index',
    range: [0, 127],
    init: 64,
    msg: _cc(43),
  },
  'osc-3-vsync': {
    label: 'Virtual Sync',
    range: [0, 127],
    init: 0,
    msg: _cc(44),
  },
  'osc-3-hardness': {
    label: 'Hardness',
    range: [0, 127],
    init: 0,
    msg: _cc(45),
  },
  'osc-3-density': {
    label: 'Density',
    range: [0, 127],
    init: 0,
    msg: _cc(46),
  },
  'osc-3-densitydetune': {
    label: 'Density Detune',
    range: [0, 127],
    init: 0,
    msg: _cc(47),
  },
  'osc-3-semitones': {
    label: 'Semitones',
    range: [0, 127],
    init: 64,
    msg: _cc(48),
  },
  'osc-3-cents': {
    label: 'Detune cents',
    range: [0, 127],
    init: 64,
    msg: _cc(49),
  },
  'osc-3-pitch': {
    label: 'Pitch Wheel',
    range: [52, 76],
    init: 76,
    msg: _cc(50),
  },
  'osc-vibrato-depth': {
    short: 'ModVib',
    label: 'Vibrato Depth',
    range: [0, 127],
    init: 0,
    msg: _cc(77),
    type: CommandType.ControlChange,
    mapFrom: [77, [0, 127]],
    decode: decodeCC,
  },
  'osc-vibrato-speed': {
    short: 'MVibRate',
    label: 'Vibrato Rate',
    range: [0, 127],
    init: 65,
    msg: _cc(76),
    type: CommandType.ControlChange,
    mapFrom: [76, [0, 127]],
    decode: decodeCC,
  },
  'osc-drift': {
    short: 'OscDrift',
    label: 'Oscillator Drift',
    range: [0, 127],
    init: 0,
    msg: _cc(16),
    type: CommandType.ControlChange,
    mapFrom: [16, [0, 127]],
    decode: decodeCC,
  },
  'osc-phase': {
    short: 'OscPhase',
    label: 'Oscillator Phase',
    range: [0, 350],
    init: 0,
    msg: _cc(17),
    type: CommandType.ControlChange,
    mapFrom: [17, [0, 120]],
    decode: decodeCC,
  },
  'osc-fixed-note': {
    short: 'FixNote',
    label: 'Single Fixed Note',
    enum: ['Off'].concat(notesSequence('C#', -2, 'G', 8)),
    init: 0,
    msg: _cc(18),
    type: CommandType.ControlChange,
    mapFrom: [18, [0, 127]],
    decode: decodeCC,
  },
  'osc-1-level': {
    short: 'O1Level',
    label: 'Oscillator 1 Level',
    range: [0, 127],
    init: 127,
    msg: _cc(51),
    type: CommandType.ControlChange,
    mapFrom: [51, [0, 127]],
    decode: decodeCC,
  },
  'osc-2-level': {
    short: 'O2Level',
    label: 'Oscillator 2 Level',
    range: [0, 127],
    init: 127,
    msg: _cc(52),
    type: CommandType.ControlChange,
    mapFrom: [52, [0, 127]],
    decode: decodeCC,
  },
  'osc-3-level': {
    short: 'O3Level',
    label: 'Oscillator 3 Level',
    range: [0, 127],
    init: 127,
    msg: _cc(53),
    type: CommandType.ControlChange,
    mapFrom: [53, [0, 127]],
    decode: decodeCC,
  },
  'ring-mod-level-1-3': {
    short: 'RM1*3Lvl',
    label: 'Ring Modulator Level (Oscs. 1 * 3)',
    range: [0, 127],
    init: 0,
    msg: _cc(54),
    type: CommandType.ControlChange,
    mapFrom: [54, [0, 127]],
    decode: decodeCC,
  },
  'ring-mod-level-2-3': {
    short: 'RM1*3Lvl',
    label: 'Ring Modulator Level (Oscs. 2 * 3)',
    range: [0, 127],
    init: 0,
    msg: _cc(55),
    type: CommandType.ControlChange,
    mapFrom: [55, [0, 127]],
    decode: decodeCC,
  },
  'noise-level': {
    short: 'NoiseLvl',
    label: 'Noise Source Level',
    range: [0, 127],
    init: 0,
    msg: _cc(56),
    type: CommandType.ControlChange,
    mapFrom: [56, [0, 127]],
    decode: decodeCC,
  },
  'noise-type': {
    short: 'NoiseTyp',
    label: 'Noise Source Type',
    enum: ['White', 'High', 'Band', 'HiBand'],
    init: 0,
    msg: _cc(57),
    type: CommandType.ControlChange,
    mapFrom: [57, [0, 3]],
    decode: decodeCC,
  },
  'filter-routing': {
      label: 'Filter Routing',
      enum: ['Bypass', 'Single', 'Series', 'Parallel', 'Parallel 2', 'Drum'],
      init: 0,
      msg: _cc(60),
      type: CommandType.ControlChange,
      mapFrom: [60, [0,5]],
      decode: decodeCC,
  },
  'filter-balance': {
      label: 'Filter Balance',
      type: CommandType.ControlChange,
      range: [-64,63],
      init: 0,
      msg: _cc(61),
      mapFrom: [61,[0,127]],
      offset: -64,
      decode: ([, x]) => x-64,
  },
  'filter-freqlink': {
      label: 'Filter FreqLink',
      enum: ['Off', 'On'],
      type: CommandType.NRPN,
      range: [0,127],
      init: 42,
      mapFrom: [
        [0, 122, [42, 43]],
      ],
      decode: ([, , y]) => y-42,
      msg: x => nrpn(0, 122, (x+42)&127),
  },
  'filter-reslink': {
      label: 'Filter ResLink',
      type: CommandType.NRPN,
      enum: ['Off', 'On'],
      range: [0,127],
      init: 44,
      mapFrom: [
        [0, 122, [44, 45]],
      ],
      decode: ([, , y]) => y-44,
      msg: x => nrpn(0, 122, (x+44)&127),
  },
  'filter-1-drive': {
    label: 'Drive',
    range: [0, 127],
    init: 0,
    msg: _cc(63),
    type: CommandType.ControlChange,
    mapFrom: [63, [0, 127]],
    decode: decodeCC,
  },
  'filter-1-drive-type': {
    label: 'Drive Type',
    enum: ['Diode', 'Valve', 'Clipper', 'XOver', 'Rectify', 'BitsDown', 'RateDOwn'],
    init: 0,
    msg: _cc(65),
    type: CommandType.ControlChange,
    mapFrom: [65, [0, 6]],
    decode: decodeCC,
  },
  'filter-1-type': {
    label: 'Type',
    enum: ['LP6NoRES', 'LP12', 'LP18', 'LP24', 'BP6/\\6', 'BP12/\\12', 'BP6/\\12', 'BP12/\\6', 'BP6/\\18', 'BP18/\\6', 'HP6NoRes', 'HP12', 'HP18', 'HP24'],
    init: 0,
    msg: _cc(68),
    type: CommandType.ControlChange,
    mapFrom: [68, [0, 13]],
    decode: decodeCC,

  },
  'filter-1-track': {
    label: 'Track',
    range: [0, 127],
    init: 0,
    msg: _cc(69),
    type: CommandType.ControlChange,
    mapFrom: [69, [0, 127]],
    decode: decodeCC,
  },
  'filter-1-resonance': {
    label: 'Resonance',
    range: [0, 127],
    init: 0,
    msg: _cc(71),
    type: CommandType.ControlChange,
    mapFrom: [71, [0, 127]],
    decode: decodeCC,
  },
  'filter-1-frequency': {
    label: 'Frequency',
    range: [0, 127],
    init: 0,
    msg: _cc(74),
    type: CommandType.ControlChange,
    mapFrom: [74, [0, 127]],
    decode: decodeCC,
  },
  'filter-1-qnormalize': {
    label: 'Q Normalize',
    range: [0, 127],
    init: 0,
    msg: _cc(78),
    type: CommandType.ControlChange,
    mapFrom: [78, [0, 127]],
    decode: decodeCC,
  },
  'filter-1-env2-to-freq': {
      label: "Env2 To Freq",
      type: CommandType.ControlChange,
      range: [-64,63],
      init: 0,
      msg: _cc(79),
      mapFrom: [79,[0,127]],
      offset: -64,
      decode: ([, x]) => x-64,
  },
  'filter-2-drive': {
    label: 'Drive',
    range: [0, 127],
    init: 0,
    msg: _cc(80),
    type: CommandType.ControlChange,
    mapFrom: [80, [0, 127]],
    decode: decodeCC,
  },
  'filter-2-drive-type': {
    label: 'Drive Type',
    enum: ['Diode', 'Valve', 'Clipper', 'XOver', 'Rectify', 'BitsDown', 'RateDOwn'],
    init: 0,
    msg: _cc(81),
    type: CommandType.ControlChange,
    mapFrom: [81, [0, 6]],
    decode: decodeCC,
  },
  'filter-2-type': {
    label: 'Type',
    enum: ['LP6NoRES', 'LP12', 'LP18', 'LP24', 'BP6/\\6', 'BP12/\\12', 'BP6/\\12', 'BP12/\\6', 'BP6/\\18', 'BP18/\\6', 'HP6NoRes', 'HP12', 'HP18', 'HP24'],
    init: 0,
    msg: _cc(82),
    type: CommandType.ControlChange,
    mapFrom: [82, [0, 13]],
    decode: decodeCC,

  },
  'filter-2-track': {
    label: 'Track',
    range: [0, 127],
    init: 0,
    msg: _cc(84),
    type: CommandType.ControlChange,
    mapFrom: [84, [0, 127]],
    decode: decodeCC,
  },
  'filter-2-resonance': {
    label: 'Resonance',
    range: [0, 127],
    init: 0,
    msg: _cc(85),
    type: CommandType.ControlChange,
    mapFrom: [85, [0, 127]],
    decode: decodeCC,
  },
  'filter-2-frequency': {
    label: 'Frequency',
    range: [0, 127],
    init: 0,
    msg: _cc(83),
    type: CommandType.ControlChange,
    mapFrom: [83, [0, 127]],
    decode: decodeCC,
  },
  'filter-2-qnormalize': {
    label: 'Q Normalize',
    range: [0, 127],
    init: 0,
    msg: _cc(86),
    type: CommandType.ControlChange,
    mapFrom: [86, [0, 127]],
    decode: decodeCC,
  },
  'filter-2-env2-to-freq': {
      label: "Env2 To Freq",
      type: CommandType.ControlChange,
      range: [-64,63],
      init: 0,
      msg: _cc(87),
      mapFrom: [87,[0,127]],
      offset: -64,
      decode: ([, x]) => x-64,
  },

};

const inRange = (x, [min, max]) => x >= min && x <= max;

export const findControl = (command) => {
  for (let [controlId, control] of Object.entries(controls)) {
    if (!control.mapFrom) {
      continue;
    }
    if (undefined === control.type || control.type !== command.type) {
      continue;
    }
    const maps = Array.isArray(control.mapFrom[0]) ? control.mapFrom : [control.mapFrom];
    if (maps.some(map => map.every((expectedValue, i) => {
      if (Array.isArray(expectedValue)) {
        return inRange(command.values[i], expectedValue);
      } else {
        return command.values[i] === expectedValue;
      }
    }))) {
      return {
        id: controlId,
        value: control.decode(command.values),
      }
    }
  }
  return undefined;
};
