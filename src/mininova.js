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

const animtrigger = [
    'Off',
    'A1 ReTrig',
    'A2 ReTrig',
    'A3 ReTrig',
    'A4 ReTrig',
    'A5 ReTrig',
    'A6 ReTrig',
    'A7 ReTrig',
    'A8 ReTrig',
    'A1 Trigger',
    'A2 Trigger',
    'A3 Trigger',
    'A4 Trigger',
    'A5 Trigger',
    'A6 Trigger',
    'A7 Trigger',
    'A8 Trigger',
    'A1 Enable',
    'A2 Enable',
    'A3 Enable',
    'A4 Enable',
    'A5 Enable',
    'A6 Enable',
    'A7 Enable',
    'A8 Enable',
];

const lfowaveform = [
    'Sine',
    'Triange',
    'Sawtooth',
    'Square',
    'Rand S/H',
    'Time S/H',
    'PianoEnv',
    'Seq 1',
    'Seq 2',
    'Seq 3',
    'Seq 4',
    'Seq 5',
    'Seq 6',
    'Seq 7',
    'Altern 1',
    'Altern 2',
    'Altern 3',
    'Altern 4',
    'Altern 5',
    'Altern 6',
    'Altern 7',
    'Altern 8',
    'Chromat',
    'Chrom 16',
    'Major',
    'Major 7',
    'Minor7',
    'MinArp1',
    'MinArp2',
    'Diminish',
    'DecMinor',
    'Minor3rd',
    'Pedal',
    '4ths',
    '4ths x12',
    '1625 Maj',
    '1625 Min',
    '2511'
];

const sync = [
    'Off',
    '32nd T',
    '32nd',
    '16th T',
    '16th',
    '8th T',
    '16th D',
    '8th',
    '4th T',
    '8th D',
    '4th',
    '1 + 1/3',
    '4th D',
    '2nd',
    '2 + 2/3',
    '3 beats',
    '4 beats',
    '5 + 1/3',
    '6 beats',
    '8 beats',
    '10 + 2/3',
    '12 beats',
    '13 + 1/3',
    '16 beats',
    '18 beats',
    '18 + 2/3',
    '20 beats',
    '21 + 1/3',
    '24 beats',
    '28 beats',
    '30 beats',
    '32 beats',
    '36 beats',
    '42 beats',
    '48 beats',
    '64 beats',
];

const fxnames = [
    'Bypass', 
    'EQ', 
    'Compres1', 
    'Compres2', 
    'Distort1', 
    'Distort2', 
    'Delay1', 
    'Delay2', 
    'Reverb1', 
    'Reverb2', 
    'Chorus1', 
    'Chorus2', 
    'Chorus3', 
    'Chorus4', 
    'Gator'
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
  'pre-fx-level': {
      label: 'Pre FX Level',
      range: [-12,18],
      init:0,
      msg: _cc(58),
      type: CommandType.ControlChange,
      mapFrom: [58,[52,82]],
      offset:-64,
      decode: ([, x]) => x-64,
  },
  'post-fx-level': {
      label: 'Post FX Level',
      range: [-12,18],
      init:0,
      msg: _cc(59),
      type: CommandType.ControlChange,
      mapFrom: [59,[52,82]],
      offset:-64,
      decode: ([, x]) => x-64,
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

  'env-1-attack': {
    label: "Attack",
    type: CommandType.ControlChange,
    range: [0,127],
    init: 0,
    msg: _cc(73),
    mapFrom: [73, [0, 127]],
    decode: decodeCC,
  },
  'env-1-decay': {    
    label: "Decay",
    type: CommandType.ControlChange,
    range: [0,127],
    init: 0,
    msg: _cc(75),
    mapFrom: [75, [0, 127]],
    decode: decodeCC,
  },
  'env-1-sustain':{
    label: "Sustain",
    type: CommandType.ControlChange,
    range: [0,127],
    init: 0,
    msg: _cc(70),
    mapFrom: [70, [0, 127]],
    decode: decodeCC,
  },
  'env-1-release': {
    label: "Release",
    type: CommandType.ControlChange,
    range: [0,127],
    init: 0,
    msg: _cc(72),
    mapFrom: [72, [0, 127]],
    decode: decodeCC,
  },
  'env-1-trigger': {
      label: 'Trigger',
      enum: ['Single', 'Multi'],
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 122, [0, 1]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 122, (x)&127),
  },
  'env-1-velocity': {
    label: 'Velocity',
    type: CommandType.ControlChange,
    range: [-64,63],
    init: 0,
    msg: _cc(108),
    mapFrom: [108,[0,127]],
    offset: -64,
    decode: ([, x]) => x-64,
  },
  'env-1-sustain-rate': {
    label: 'Sustain Rate',
    type: CommandType.ControlChange,
    range: [-64,63],
    init: 0,
    msg: _cc(109),
    mapFrom: [109,[0,127]],
    offset: -64,
    decode: ([, x]) => x-64,
  },
  'env-1-sustain-time': {
    label: 'Sustain Time',
    type: CommandType.ControlChange,
    range: [0,127],
    init: 0,
    msg: _cc(110),
    mapFrom: [110,[0,127]],
    decode: decodeCC
  },
  'env-1-ad-repeats': {
    label: 'AD Repeats',
    type: CommandType.ControlChange,
    range: [0,127],
    init: 0,
    msg: _cc(111),
    mapFrom: [111,[0,127]],
    decode: decodeCC
  },
  'env-1-attack-track': {
    label: 'Attack Track',
    type: CommandType.ControlChange,
    range: [-64,63],
    init: 0,
    msg: _cc(112),
    mapFrom: [112,[0,127]],
    offset: -64,
    decode: ([, x]) => x-64,
  },
  'env-1-decay-track': {
    label: 'Decay Track',
    type: CommandType.ControlChange,
    range: [-64,63],
    init: 0,
    msg: _cc(113),
    mapFrom: [113,[0,127]],
    offset: -64,
    decode: ([, x]) => x-64,
  },
  'env-1-level-track': {
    label: 'Level Track',
    type: CommandType.ControlChange,
    range: [-64,63],
    init: 0,
    msg: _cc(114),
    mapFrom: [114,[0,127]],
    offset: -64,
    decode: ([, x]) => x-64,
  },
  'env-1-attack-slope': {
    label: 'Attack Slope',
    type: CommandType.ControlChange,
    range: [0,127],
    init: 0,
    msg: _cc(115),
    mapFrom: [115,[0,127]],
    decode: decodeCC
  },
  'env-1-decay-slope': {
    label: 'Decay Slope',
    type: CommandType.ControlChange,
    range: [0,127],
    init: 0,
    msg: _cc(116),
    mapFrom: [116,[0,127]],
    decode: decodeCC
  },
  'env-1-anim-trigger': {
    label: 'Anim Trigger',
    enum: ['Off', 'A1ReTrig', 'A2ReTrig','A3ReTrig', 'A4ReTrig', 'A5ReTrig', 'A6ReTrig','A7ReTrig', 'A8ReTrig'],
    init: 0,
    msg: _cc(117),
    type: CommandType.ControlChange,
    mapFrom: [117, [0, 8]],
    decode: decodeCC,
  },

  'env-2-attack': {
    label: "Attack",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 1, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 1, x&127),
  },
  'env-2-decay': {    
    label: "Decay",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 2, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 2, x&127),
  },
  'env-2-sustain':{
    label: "Sustain",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 3, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 3, x&127),
  },
  'env-2-release': {
    label: "Release",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 4, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 4, x&127),
  },
  'env-2-trigger': {
      label: 'Trigger',
      enum: ['Single', 'Multi'],
      type: CommandType.NRPN,
      range: [0,127],
      init: 2,
      mapFrom: [
        [0, 122, [2, 3]],
      ],
      decode: ([, , y]) => y-2,
      msg: x => nrpn(0, 122, (x+2)&127),
  },
  'env-2-velocity': {
    label: "Velocity",
    type: CommandType.NRPN,
    range: [-64,63],
    init: 0,
    mapFrom: [
      [0, 0, [0, 127]],
    ],
    decode: ([, , y]) => y-64,
    msg: x => nrpn(0, 0, (x+64)&127),
  },
  'env-2-sustain-rate': {
    label: "Sustain Rate",
    type: CommandType.NRPN,
    range: [-64,63],
    init: 0,
    mapFrom: [
      [0, 5, [0, 127]],
    ],
    decode: ([, , y]) => y-64,
    msg: x => nrpn(0, 5, (x+64)&127),
  },
  'env-2-sustain-time': {
    label: "Sustain Time",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 6, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 6, x&127),
  },
  'env-2-ad-repeats': {
    label: "AD Repeats",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 7, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 7, x&127),
  },
  'env-2-attack-track': {
    label: "Attack Track",
    type: CommandType.NRPN,
    range: [-64,63],
    init: 0,
    mapFrom: [
      [0, 8, [0, 127]],
    ],
    decode: ([, , y]) => y-64,
    msg: x => nrpn(0, 8, (x+64)&127),
  },
  'env-2-decay-track': {
    label: "Decay Track",
    type: CommandType.NRPN,
    range: [-64,63],
    init: 0,
    mapFrom: [
      [0, 9, [0, 127]],
    ],
    decode: ([, , y]) => y-64,
    msg: x => nrpn(0, 9, (x+64)&127),

  },
  'env-2-level-track':{
    label: "Level Track",
    type: CommandType.NRPN,
    range: [-64,63],
    init: 0,
    mapFrom: [
      [0, 10, [0, 127]],
    ],
    decode: ([, , y]) => y-64,
    msg: x => nrpn(0, 10, (x+64)&127),
  },
  'env-2-attack-slope': {
    label: "Attack Slope",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 11, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 11, x&127),
  },
  'env-2-decay-slope': {
    label: "Attack Slope",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 12, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 12, x&127),
  },
  'env-2-anim-trigger': {
      label: 'Anim Trigger',
      enum: animtrigger,
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 13, [0, 24]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 13, (x)&127),
  },

  'env-3-delay': {
    label: "Delay",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 14, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 14, x&127),
  },

  'env-3-attack': {
    label: "Attack",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 15, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 15, x&127),
  },
  'env-3-decay': {    
    label: "Decay",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 16, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 16, x&127),
  },
  'env-3-sustain':{
    label: "Sustain",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 17, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 17, x&127),
  },
  'env-3-release': {
    label: "Release",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 18, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 18, x&127),
  },
  'env-3-trigger': {
      label: 'Trigger',
      enum: ['Single', 'Multi'],
      type: CommandType.NRPN,
      range: [0,127],
      init: 2,
      mapFrom: [
        [0, 122, [4, 5]],
      ],
      decode: ([, , y]) => y-4,
      msg: x => nrpn(0, 122, (x+4)&127),
  },
  'env-3-sustain-rate': {
    label: "Sustain Rate",
    type: CommandType.NRPN,
    range: [-64,63],
    init: 0,
    mapFrom: [
      [0, 19, [0, 127]],
    ],
    decode: ([, , y]) => y-64,
    msg: x => nrpn(0, 19, (x+64)&127),
  },
  'env-3-sustain-time': {
    label: "Sustain Time",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 20, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 20, x&127),
  },
  'env-3-ad-repeats': {
    label: "AD Repeats",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 21, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 21, x&127),
  },
  'env-3-attack-track': {
    label: "Attack Track",
    type: CommandType.NRPN,
    range: [-64,63],
    init: 0,
    mapFrom: [
      [0, 22, [0, 127]],
    ],
    decode: ([, , y]) => y-64,
    msg: x => nrpn(0, 22, (x+64)&127),
  },
  'env-3-decay-track': {
    label: "Decay Track",
    type: CommandType.NRPN,
    range: [-64,63],
    init: 0,
    mapFrom: [
      [0, 23, [0, 127]],
    ],
    decode: ([, , y]) => y-64,
    msg: x => nrpn(0, 23, (x+64)&127),

  },
  'env-3-level-track':{
    label: "Level Track",
    type: CommandType.NRPN,
    range: [-64,63],
    init: 0,
    mapFrom: [
      [0, 24, [0, 127]],
    ],
    decode: ([, , y]) => y-64,
    msg: x => nrpn(0, 24, (x+64)&127),
  },
  'env-3-attack-slope': {
    label: "Attack Slope",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 25, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 25, x&127),
  },
  'env-3-decay-slope': {
    label: "Attack Slope",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 26, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 26, x&127),
  },
  'env-3-anim-trigger': {
      label: 'Anim Trigger',
      enum: animtrigger,
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 27, [0, 24]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 27, (x)&127),
  },

  'env-4-delay': {
    label: "Delay",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 28, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 28, x&127),
  },

  'env-4-attack': {
    label: "Attack",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 29, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 29, x&127),
  },
  'env-4-decay': {    
    label: "Decay",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 30, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 30, x&127),
  },
  'env-4-sustain':{
    label: "Sustain",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 31, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 31, x&127),
  },
  'env-4-release': {
    label: "Release",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 32, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 32, x&127),
  },
  'env-4-trigger': {
      label: 'Trigger',
      enum: ['Single', 'Multi'],
      type: CommandType.NRPN,
      range: [0,127],
      init: 2,
      mapFrom: [
        [0, 122, [6, 7]],
      ],
      decode: ([, , y]) => y-6,
      msg: x => nrpn(0, 122, (x+6)&127),
  },
  'env-4-sustain-rate': {
    label: "Sustain Rate",
    type: CommandType.NRPN,
    range: [-64,63],
    init: 0,
    mapFrom: [
      [0, 33, [0, 127]],
    ],
    decode: ([, , y]) => y-64,
    msg: x => nrpn(0, 33, (x+64)&127),
  },
  'env-4-sustain-time': {
    label: "Sustain Time",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 34, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 34, x&127),
  },
  'env-4-ad-repeats': {
    label: "AD Repeats",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 35, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 35, x&127),
  },
  'env-4-attack-track': {
    label: "Attack Track",
    type: CommandType.NRPN,
    range: [-64,63],
    init: 0,
    mapFrom: [
      [0, 36, [0, 127]],
    ],
    decode: ([, , y]) => y-64,
    msg: x => nrpn(0, 36, (x+64)&127),
  },
  'env-4-decay-track': {
    label: "Decay Track",
    type: CommandType.NRPN,
    range: [-64,63],
    init: 0,
    mapFrom: [
      [0, 37, [0, 127]],
    ],
    decode: ([, , y]) => y-64,
    msg: x => nrpn(0, 37, (x+64)&127),

  },
  'env-4-level-track':{
    label: "Level Track",
    type: CommandType.NRPN,
    range: [-64,63],
    init: 0,
    mapFrom: [
      [0, 38, [0, 127]],
    ],
    decode: ([, , y]) => y-64,
    msg: x => nrpn(0, 38, (x+64)&127),
  },
  'env-4-attack-slope': {
    label: "Attack Slope",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 39, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 39, x&127),
  },
  'env-4-decay-slope': {
    label: "Attack Slope",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 40, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 40, x&127),
  },
  'env-4-anim-trigger': {
      label: 'Anim Trigger',
      enum: animtrigger,
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 41, [0, 24]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 41, (x)&127),
  },
  'env-5-delay': {
    label: "Delay",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 42, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 42, x&127),
  },
  'env-5-attack': {
    label: "Attack",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 43, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 43, x&127),
  },
  'env-5-decay': {    
    label: "Decay",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 44, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 44, x&127),
  },
  'env-5-sustain':{
    label: "Sustain",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 45, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 45, x&127),
  },
  'env-5-release': {
    label: "Release",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 46, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 46, x&127),
  },
  'env-5-trigger': {
      label: 'Trigger',
      enum: ['Single', 'Multi'],
      type: CommandType.NRPN,
      range: [0,127],
      init: 2,
      mapFrom: [
        [0, 122, [8, 9]],
      ],
      decode: ([, , y]) => y-8,
      msg: x => nrpn(0, 122, (x+8)&127),
  },
  'env-5-sustain-rate': {
    label: "Sustain Rate",
    type: CommandType.NRPN,
    range: [-64,63],
    init: 0,
    mapFrom: [
      [0, 47, [0, 127]],
    ],
    decode: ([, , y]) => y-64,
    msg: x => nrpn(0, 47, (x+64)&127),
  },
  'env-5-sustain-time': {
    label: "Sustain Time",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 48, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 48, x&127),
  },
  'env-5-ad-repeats': {
    label: "AD Repeats",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 49, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 49, x&127),
  },
  'env-5-attack-track': {
    label: "Attack Track",
    type: CommandType.NRPN,
    range: [-64,63],
    init: 0,
    mapFrom: [
      [0, 50, [0, 127]],
    ],
    decode: ([, , y]) => y-64,
    msg: x => nrpn(0, 50, (x+64)&127),
  },
  'env-5-decay-track': {
    label: "Decay Track",
    type: CommandType.NRPN,
    range: [-64,63],
    init: 0,
    mapFrom: [
      [0, 51, [0, 127]],
    ],
    decode: ([, , y]) => y-64,
    msg: x => nrpn(0, 51, (x+64)&127),

  },
  'env-5-level-track':{
    label: "Level Track",
    type: CommandType.NRPN,
    range: [-64,63],
    init: 0,
    mapFrom: [
      [0, 52, [0, 127]],
    ],
    decode: ([, , y]) => y-64,
    msg: x => nrpn(0, 52, (x+64)&127),
  },
  'env-5-attack-slope': {
    label: "Attack Slope",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 53, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 53, x&127),
  },
  'env-5-decay-slope': {
    label: "Attack Slope",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 54, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 54, x&127),
  },
  'env-5-anim-trigger': {
      label: 'Anim Trigger',
      enum: animtrigger,
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 55, [0, 24]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 55, (x)&127),
  },

  'env-6-delay': {
    label: "Attack",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 56, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0,56, x&127),
  },

  'env-6-attack': {
    label: "Attack",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 57, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 57, x&127),
  },
  'env-6-decay': {    
    label: "Decay",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 58, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 58, x&127),
  },
  'env-6-sustain':{
    label: "Sustain",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 59, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 59, x&127),
  },
  'env-6-release': {
    label: "Release",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 60, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 60, x&127),
  },
  'env-6-trigger': {
      label: 'Trigger',
      enum: ['Single', 'Multi'],
      type: CommandType.NRPN,
      range: [0,127],
      init: 2,
      mapFrom: [
        [0, 122, [10, 11]],
      ],
      decode: ([, , y]) => y-10,
      msg: x => nrpn(0, 122, (x+10)&127),
  },
  'env-6-sustain-rate': {
    label: "Sustain Rate",
    type: CommandType.NRPN,
    range: [-64,63],
    init: 0,
    mapFrom: [
      [0, 61, [0, 127]],
    ],
    decode: ([, , y]) => y-64,
    msg: x => nrpn(0, 61, (x+64)&127),
  },
  'env-6-sustain-time': {
    label: "Sustain Time",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 62, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 62, x&127),
  },
  'env-6-ad-repeats': {
    label: "AD Repeats",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 63, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 63, x&127),
  },
  'env-6-attack-track': {
    label: "Attack Track",
    type: CommandType.NRPN,
    range: [-64,63],
    init: 0,
    mapFrom: [
      [0, 64, [0, 127]],
    ],
    decode: ([, , y]) => y-64,
    msg: x => nrpn(0, 64, (x+64)&127),
  },
  'env-6-decay-track': {
    label: "Decay Track",
    type: CommandType.NRPN,
    range: [-64,63],
    init: 0,
    mapFrom: [
      [0, 65, [0, 127]],
    ],
    decode: ([, , y]) => y-64,
    msg: x => nrpn(0, 65, (x+64)&127),

  },
  'env-6-level-track':{
    label: "Level Track",
    type: CommandType.NRPN,
    range: [-64,63],
    init: 0,
    mapFrom: [
      [0, 66, [0, 127]],
    ],
    decode: ([, , y]) => y-64,
    msg: x => nrpn(0, 66, (x+64)&127),
  },
  'env-6-attack-slope': {
    label: "Attack Slope",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 67, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 67, x&127),
  },
  'env-6-decay-slope': {
    label: "Attack Slope",
    type: CommandType.NRPN,
    range: [0,127],
    init: 0,
    mapFrom: [
      [0, 68, [0, 127]],
    ],
    decode: ([, , y]) => y,
    msg: x => nrpn(0, 68, x&127),
  },
  'env-6-anim-trigger': {
      label: 'Anim Trigger',
      enum: animtrigger,
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 69, [0, 24]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 69, (x)&127),
  },

  'lfo-1-waveform': {
      label: 'Waveform',
      enum: lfowaveform,
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 70, [0, 24]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 70, (x)&127),

  },
  'lfo-1-phase-offset': {
      label: 'Phase Offset',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 71, [0, 119]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 71, (x)&127),
  },
  'lfo-1-slew-rate': {
      label: 'Slew Rate',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 72, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 72, (x)&127),
  },
  'lfo-1-delay': {
      label: 'Delay',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 74, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 74, (x)&127),
  },
  'lfo-1-delay-sync': {
      label: 'Delay Sync',
      enum: sync,
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 75, [0, 35]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 75, (x)&127),
  },
  'lfo-1-rate': {
      label: 'Rate',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 76, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 76, (x)&127),
  },
  'lfo-1-rate-sync': {
      label: 'Rate Sync',
      enum: sync,
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 77, [0, 35]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 77, (x)&127),
  },
  'lfo-1-one-shot': {
      label: 'OneShot',
      enum: ['Normal', 'OneShot'],
      type: CommandType.NRPN,
      range: [0,127],
      init: 12,
      mapFrom: [
        [0, 122, [12, 13]],
      ],
      decode: ([, , y]) => y-12,
      msg: x => nrpn(0, 122, (x+12)&127),
  },
  'lfo-1-key-sync': {
      label: 'KeySync',
      enum: ['Freerun', 'KeySync'],
      type: CommandType.NRPN,
      range: [0,127],
      init: 14,
      mapFrom: [
        [0, 122, [14, 15]],
      ],
      decode: ([, , y]) => y-14,
      msg: x => nrpn(0, 122, (x+14)&127),
  },
  'lfo-1-common-sync': {
      label: 'Common Sync',
      enum: ['Normal', 'Common'],
      type: CommandType.NRPN,
      range: [0,127],
      init: 16,
      mapFrom: [
        [0, 122, [16, 17]],
      ],
      decode: ([, , y]) => y-16,
      msg: x => nrpn(0, 122, (x+16)&127),
  },
  'lfo-1-delay-trigger': {
      label: 'Delay Trigger',
      enum: ['Single', 'Multi'],
      type: CommandType.NRPN,
      range: [0,127],
      init: 18,
      mapFrom: [
        [0, 122, [18, 19]],
      ],
      decode: ([, , y]) => y-18,
      msg: x => nrpn(0, 122, (x+18)&127),
  },
  'lfo-1-fade-mode': {
      label: 'Fade Mode',
      enum: ['Fade In', 'Fade Out', 'Gate In', 'Gate Out'],
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 123, [0, 3]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 123, (x)&127),
  },

  'lfo-2-waveform': {
      label: 'Waveform',
      enum: lfowaveform,
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 79, [0, 24]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 79, (x)&127),

  },
  'lfo-2-phase-offset': {
      label: 'Phase Offset',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 80, [0, 119]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 80, (x)&127),
  },
  'lfo-2-slew-rate': {
      label: 'Slew Rate',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 81, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 81, (x)&127),
  },
  'lfo-2-delay': {
      label: 'Delay',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 83, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 83, (x)&127),
  },
  'lfo-2-delay-sync': {
      label: 'Delay Sync',
      enum: sync,
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 84, [0, 35]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 84, (x)&127),
  },
  'lfo-2-rate': {
      label: 'Rate',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 85, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 85, (x)&127),
  },
  'lfo-2-rate-sync': {
      label: 'Rate Sync',
      enum: sync,
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 86, [0, 35]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 86, (x)&127),
  },
  'lfo-2-one-shot': {
      label: 'OneShot',
      enum: ['Normal', 'OneShot'],
      type: CommandType.NRPN,
      range: [0,127],
      init: 12,
      mapFrom: [
        [0, 122, [22, 23]],
      ],
      decode: ([, , y]) => y-22,
      msg: x => nrpn(0, 122, (x+22)&127),
  },
  'lfo-2-key-sync': {
      label: 'KeySync',
      enum: ['Freerun', 'KeySync'],
      type: CommandType.NRPN,
      range: [0,127],
      init: 14,
      mapFrom: [
        [0, 122, [24, 25]],
      ],
      decode: ([, , y]) => y-24,
      msg: x => nrpn(0, 122, (x+24)&127),
  },
  'lfo-2-common-sync': {
      label: 'Common Sync',
      enum: ['Normal', 'Common'],
      type: CommandType.NRPN,
      range: [0,127],
      init: 16,
      mapFrom: [
        [0, 122, [26, 27]],
      ],
      decode: ([, , y]) => y-26,
      msg: x => nrpn(0, 122, (x+26)&127),
  },
  'lfo-2-delay-trigger': {
      label: 'Delay Trigger',
      enum: ['Single', 'Multi'],
      type: CommandType.NRPN,
      range: [0,127],
      init: 18,
      mapFrom: [
        [0, 122, [28, 29]],
      ],
      decode: ([, , y]) => y-28,
      msg: x => nrpn(0, 122, (x+28)&127),
  },
  'lfo-2-fade-mode': {
      label: 'Fade Mode',
      enum: ['Fade In', 'Fade Out', 'Gate In', 'Gate Out'],
      type: CommandType.NRPN,
      range: [0,127],
      init: 18,
      mapFrom: [
        [0, 123, [4, 7]],
      ],
      decode: ([, , y]) => y-4,
      msg: x => nrpn(0, 123, (x+4)&127),
  },

  'lfo-3-waveform': {
      label: 'Waveform',
      enum: lfowaveform,
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 88, [0, 24]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 88, (x)&127),

  },
  'lfo-3-phase-offset': {
      label: 'Phase Offset',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 89, [0, 119]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 89, (x)&127),
  },
  'lfo-3-slew-rate': {
      label: 'Slew Rate',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 90, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 90, (x)&127),
  },
  'lfo-3-delay': {
      label: 'Delay',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 92, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 92, (x)&127),
  },
  'lfo-3-delay-sync': {
      label: 'Delay Sync',
      enum: sync,
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 93, [0, 35]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 93, (x)&127),
  },
  'lfo-3-rate': {
      label: 'Rate',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 94, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 94, (x)&127),
  },
  'lfo-3-rate-sync': {
      label: 'Rate Sync',
      enum: sync,
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 95, [0, 35]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 95, (x)&127),
  },
  'lfo-3-one-shot': {
      label: 'OneShot',
      enum: ['Normal', 'OneShot'],
      type: CommandType.NRPN,
      range: [0,127],
      init: 12,
      mapFrom: [
        [0, 122, [32, 33]],
      ],
      decode: ([, , y]) => y-32,
      msg: x => nrpn(0, 122, (x+32)&127),
  },
  'lfo-3-key-sync': {
      label: 'KeySync',
      enum: ['Freerun', 'KeySync'],
      type: CommandType.NRPN,
      range: [0,127],
      init: 14,
      mapFrom: [
        [0, 122, [34, 35]],
      ],
      decode: ([, , y]) => y-34,
      msg: x => nrpn(0, 122, (x+34)&127),
  },
  'lfo-3-common-sync': {
      label: 'Common Sync',
      enum: ['Normal', 'Common'],
      type: CommandType.NRPN,
      range: [0,127],
      init: 16,
      mapFrom: [
        [0, 122, [36, 37]],
      ],
      decode: ([, , y]) => y-36,
      msg: x => nrpn(0, 122, (x+36)&127),
  },
  'lfo-3-delay-trigger': {
      label: 'Delay Trigger',
      enum: ['Single', 'Multi'],
      type: CommandType.NRPN,
      range: [0,127],
      init: 18,
      mapFrom: [
        [0, 122, [38, 39]],
      ],
      decode: ([, , y]) => y-38,
      msg: x => nrpn(0, 122, (x+38)&127),
  },
  'lfo-3-fade-mode': {
      label: 'Fade Mode',
      enum: ['Fade In', 'Fade Out', 'Gate In', 'Gate Out'],
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 123, [8, 11]],
      ],
      decode: ([, , y]) => y-8,
      msg: x => nrpn(0, 123, (x+8)&127),
  },
  'fx-pan-position': {
    label: 'Pan Position',
    range: [-64, 63],
    init: 0,
    msg: _cc(10),
    type: CommandType.ControlChange,
    mapFrom: [10, [0, 127]],
    offset:-64,
    decode: ([, x]) => x-64,
  },
  'fx-pan-rate': {
    label: 'Pan Rate',
    range: [0, 127],
    init: 0,
    msg: _cc(88),
    type: CommandType.ControlChange,
    mapFrom: [88, [0, 127]],
    decode: decodeCC,

  },
  'fx-pan-sync': {
    label: 'Pan Sync',
    enum: sync,
    init: 0,
    msg: _cc(89),
    type: CommandType.ControlChange,
    mapFrom: [89, [0, 35]],
    decode: decodeCC,
  },
  'fx-pan-mod-depth': {
    label: 'Pan Mod Depth',
    range: [0, 127],
    init: 0,
    msg: _cc(90),
    type: CommandType.ControlChange,
    mapFrom: [90, [0, 127]],
    decode: decodeCC,
  },
  'fx-routing': {
      label: 'Routing',
      enum: ['R1','R2','R3','R4', 'R5','R6', 'R7','R8'],
      type: CommandType.NRPN,
      init: 0,
      mapFrom: [
        [0, 97, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 97, (x)&127),

  },
  'fx-feedback': {
      label: 'Feedback',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 98, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 98, (x)&127),
  },
  'fx-1-level': {
    label: 'FX1 Level',
    range: [0, 127],
    init: 0,
    msg: _cc(91),
    type: CommandType.ControlChange,
    mapFrom: [91, [0, 127]],
    decode: decodeCC,
  },
  'fx-2-level': {
    label: 'FX2 Level',
    range: [0, 127],
    init: 0,
    msg: _cc(92),
    type: CommandType.ControlChange,
    mapFrom: [92, [0, 127]],
    decode: decodeCC,
  },
  'fx-3-level':{
    label: 'FX3 Level',
    range: [0, 127],
    init: 0,
    msg: _cc(93),
    type: CommandType.ControlChange,
    mapFrom: [93, [0, 127]],
    decode: decodeCC,
  },
  'fx-4-level':{
    label: 'FX4 Level',
    range: [0, 127],
    init: 0,
    msg: _cc(94),
    type: CommandType.ControlChange,
    mapFrom: [94, [0, 127]],
    decode: decodeCC,
  },
  'fx-5-level':{
    label: 'FX5 Level',
    range: [0, 127],
    init: 0,
    msg: _cc(95),
    type: CommandType.ControlChange,
    mapFrom: [95, [0, 127]],
    decode: decodeCC,
  },
  'fx-1-select': {
      label: "FX1 Select", 
      enum: fxnames,
      type: CommandType.NRPN,
      init: 0,
      mapFrom: [
        [0, 99, [0, 14]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 99, (x)&127),
  },
  'fx-2-select': {
      label: "FX2 Select", 
      enum: fxnames,
      type: CommandType.NRPN,
      init: 0,
      mapFrom: [
        [0, 100, [0, 14]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 100, (x)&127),
  },
  'fx-3-select': {
      label: "FX3 Select", 
      enum: fxnames,
      type: CommandType.NRPN,
      init: 0,
      mapFrom: [
        [0, 101, [0, 14]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 101, (x)&127),
  },
  'fx-4-select': {
      label: "FX4 Select", 
      enum: fxnames,
      type: CommandType.NRPN,
      init: 0,
      mapFrom: [
        [0, 102, [0, 14]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 102, (x)&127),
  },
  'fx-5-select': {
      label: "FX5 Select", 
      enum: fxnames,
      type: CommandType.NRPN,
      init: 0,
      mapFrom: [
        [0, 103, [0, 14]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 103, (x)&127),
  },
  'eq-bass-frequency': {
      label: 'Bass Frequency',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 104, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 104, (x)&127),
  },
  'eq-bass-level': {
    label: "Bass Level",
    type: CommandType.NRPN,
    range: [-64,63],
    init: 0,
    mapFrom: [
      [0, 105, [0, 127]],
    ],
    decode: ([, , y]) => y-64,
    msg: x => nrpn(0, 105, (x+64)&127),
   },
  'eq-mid-frequency': {
      label: 'Mid Frequency',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 106, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 106, (x)&127),
  },
  'eq-mid-level': {
    label: "Mid Level",
    type: CommandType.NRPN,
    range: [-64,63],
    init: 0,
    mapFrom: [
      [0, 107, [0, 127]],
    ],
    decode: ([, , y]) => y-64,
    msg: x => nrpn(0, 107, (x+64)&127),

  },
  'eq-treble-frequency': {
      label: 'Treble Frequency',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 108, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 108, (x)&127),
  },
  'eq-treble-level': {
    label: "Treble Level",
    type: CommandType.NRPN,
    range: [-64,63],
    init: 0,
    mapFrom: [
      [0, 109, [0, 127]],
    ],
    decode: ([, , y]) => y-64,
    msg: x => nrpn(0, 109, (x+64)&127),

  },

  'compres-1-ratio': {
      label: 'Ratio',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 110, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 110, (x)&127),
  },
  'compres-1-treshold': {
    label: "Treble Level",
    type: CommandType.NRPN,
    range: [-60,0],
    init: 0,
    mapFrom: [
      [0, 111, [0, 60]],
    ],
    decode: ([, , y]) => y-64,
    msg: x => nrpn(0, 111, (x+60)&127),
  },
  'compres-1-attack': {
      label: 'Attack',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 112, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 112, (x)&127),
  },
  'compres-1-release': {
      label: 'Release',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 113, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 113, (x)&127),

  },
    'compres-1-hold': {
        label: 'Hold',
        type: CommandType.NRPN,
        range: [0,127],
        init: 0,
        mapFrom: [
            [0, 114, [0, 127]],
        ],
        decode: ([, , y]) => y,
        msg: x => nrpn(0, 114, (x)&127),
  },
  'compres-1-gain': {
      label: 'Gain',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 115, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 115, (x)&127),
  },

  'compres-2-ratio': {
      label: 'Ratio',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 116, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 116, (x)&127),
  },
  'compres-2-treshold': {
    label: "Treble Level",
    type: CommandType.NRPN,
    range: [-60,0],
    init: 0,
    mapFrom: [
      [0, 117, [0, 60]],
    ],
    decode: ([, , y]) => y-64,
    msg: x => nrpn(0, 117, (x+60)&127),
  },
  'compres-2-attack': {
      label: 'Attack',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 118, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 118, (x)&127),
  },
  'compres-2-release': {
      label: 'Release',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 119, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 119, (x)&127),

  },
    'compres-2-hold': {
        label: 'Hold',
        type: CommandType.NRPN,
        range: [0,127],
        init: 0,
        mapFrom: [
            [0, 120, [0, 127]],
        ],
        decode: ([, , y]) => y,
        msg: x => nrpn(0, 120, (x)&127),
  },
  'compres-2-gain': {
      label: 'Gain',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [0, 121, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(0, 121, (x)&127),
  },
  'distort-1-type': {
      label: "Type", 
      enum: ['Diode', 'Valve', 'Clipper', 'XOver','Rectify', 'BitsDown', 'RateDown'],
      type: CommandType.NRPN,
      init: 0,
      mapFrom: [
        [1, 0, [0, 6]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 0, (x)&127),
  },
  'distort-1-compensation': {
      label: 'Compensation',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 1, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 1, (x)&127),
  },
  'distort-1-level': {
      label: 'Level',
      type: CommandType.NRPN,
      range: [-12,18],
      init: 0,
      mapFrom: [
        [1, 2, [52, 82]],
      ],
      decode: ([, , y]) => y-60,
      msg: x => nrpn(1, 2, (x+60)&127),
  },
  'distort-2-type': {
      label: "Type", 
      enum: ['Diode', 'Valve', 'Clipper', 'XOver','Rectify', 'BitsDown', 'RateDown'],
      type: CommandType.NRPN,
      init: 0,
      mapFrom: [
        [1, 3, [0, 6]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 3, (x)&127),
  },
  'distort-2-compensation': {
      label: 'Compensation',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 4, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 4, (x)&127),
  },
  'distort-2-level': {
      label: 'Level',
      type: CommandType.NRPN,
      range: [-12,18],
      init: 0,
      mapFrom: [
        [1, 5, [52, 82]],
      ],
      decode: ([, , y]) => y-60,
      msg: x => nrpn(1, 5, (x+60)&127),
  },

  'delay-1-time': {
      label: 'Time',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 6, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 6, (x)&127),
  },
  'delay-1-sync': {
      label: 'Sync',
      enum: sync,
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 7, [0, 35]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 7, (x)&127),
  },
  'delay-1-feedback': {
      label: 'Feedback',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 8, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 8, (x)&127),
  },
  'delay-1-width': {
      label: 'Width',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 9, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 9, (x)&127),
  },
  'delay-1-lr-ratio': {
      label: 'LR Ratio',
      enum: ['L 1:1 R', 'L 4:3 R', 'L 3:4 R', 'L 3:2 R', 'L 2:3 R', 'L 2:1 R', 'L 1:2 R', 'L 3:1 R', 'L 1:3 R', 'L 4:1 R', 'L 1:4 R', 'L 1:Off', 'Off:1 R'],
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 10, [0, 12]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 10, (x)&127),
  },
  'delay-1-slew-rate': {
      label: 'Slew Rate',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 11, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 11, (x)&127),
  },

  'delay-2-time': {
      label: 'Time',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 12, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 12, (x)&127),
  },
  'delay-2-sync': {
      label: 'Sync',
      enum: sync,
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 13, [0, 35]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 13, (x)&127),
  },
  'delay-2-feedback': {
      label: 'Feedback',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 14, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 14, (x)&127),
  },
  'delay-2-width': {
      label: 'Width',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 15, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 15, (x)&127),
  },
  'delay-2-lr-ratio': {
      label: 'LR Ratio',
      enum: ['L 1:1 R', 'L 4:3 R', 'L 3:4 R', 'L 3:2 R', 'L 2:3 R', 'L 2:1 R', 'L 1:2 R', 'L 3:1 R', 'L 1:3 R', 'L 4:1 R', 'L 1:4 R', 'L 1:Off', 'Off:1 R'],
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 16, [0, 12]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 16, (x)&127),
  },
  'delay-2-slew-rate': {
      label: 'Slew Rate',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 17, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 17, (x)&127),
  },

  'reverb-1-type': {
      label: 'Type',
      enum: ['Chamber', 'SmlRoom', 'LrgRoom', 'SmlHall', 'LrgHall', 'GrtHall'],
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 18, [0, 5]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 18, (x)&127),

  },
  'reverb-1-decay': {
      label: 'Decay',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 19, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 19, (x)&127),

  },
  'reverb-1-damping': {
      label: 'Damping',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 20, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 20, (x)&127),
  },
  'reverb-2-type': {
      label: 'Type',
      enum: ['Chamber', 'SmlRoom', 'LrgRoom', 'SmlHall', 'LrgHall', 'GrtHall'],
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 21, [0, 5]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 21, (x)&127),

  },
  'reverb-2-decay': {
      label: 'Decay',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 22, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 22 , (x)&127),

  },
  'reverb-2-damping': {
      label: 'Damping',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 23, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 23, (x)&127),
  },

  'chorus-1-type': {
      label: 'Type',
      enum: ['Phaser', 'Chorus'],
      type: CommandType.NRPN,
      range: [0,1],
      init: 0,
      mapFrom: [
        [1, 24, [0, 1]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 24, (x)&127),
  },
  'chorus-1-rate': {
      label: 'Rate',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 25, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 25, (x)&127),
  },
  'chorus-1-rate-sync': {
      label: 'Rate Sync',
      enum: sync,
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 26, [0, 35]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 26, (x)&127),
  },
  'chorus-1-feedback': {
      label: 'Feedback',
      type: CommandType.NRPN,
      range: [-64,63],
      init: 0,
      mapFrom: [
        [1, 27, [0, 127]],
      ],
      decode: ([, , y]) => y-64,
      msg: x => nrpn(1, 27, (x+64)&127),
   },
  'chrous-1-mod-depth': {
      label: 'Mod Depth',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 28, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 28, (x)&127),
  },
  'chorus-1-delay': {
      label: 'Delay',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 29, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 29, (x)&127),
  },
  'chorus-2-type': {
      label: 'Type',
      enum: ['Phaser', 'Chorus'],
      type: CommandType.NRPN,
      range: [0,1],
      init: 0,
      mapFrom: [
        [1, 30, [0, 1]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 30, (x)&127),
  },
  'chorus-2-rate': {
      label: 'Rate',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 31, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 31, (x)&127),
  },
  'chorus-2-rate-sync': {
      label: 'Rate Sync',
      enum: sync,
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 32, [0, 35]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 32, (x)&127),
  },
  'chorus-2-feedback': {
      label: 'Feedback',
      type: CommandType.NRPN,
      range: [-64,63],
      init: 0,
      mapFrom: [
        [1, 33, [0, 127]],
      ],
      decode: ([, , y]) => y-64,
      msg: x => nrpn(1, 33, (x+64)&127),
   },
  'chrous-2-mod-depth': {
      label: 'Mod Depth',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 34, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 34, (x)&127),
  },
  'chorus-2-delay': {
      label: 'Delay',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 35, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 35, (x)&127),
  },
  'chorus-3-type': {
      label: 'Type',
      enum: ['Phaser', 'Chorus'],
      type: CommandType.NRPN,
      range: [0,1],
      init: 0,
      mapFrom: [
        [1, 36, [0, 1]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 36, (x)&127),
  },
  'chorus-3-rate': {
      label: 'Rate',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 37, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 37, (x)&127),
  },
  'chorus-3-rate-sync': {
      label: 'Rate Sync',
      enum: sync,
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 38, [0, 35]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 38, (x)&127),
  },
  'chorus-3-feedback': {
      label: 'Feedback',
      type: CommandType.NRPN,
      range: [-64,63],
      init: 0,
      mapFrom: [
        [1, 39, [0, 127]],
      ],
      decode: ([, , y]) => y-64,
      msg: x => nrpn(1, 39, (x+64)&127),
   },
  'chrous-3-mod-depth': {
      label: 'Mod Depth',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 40, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 40, (x)&127),
  },
  'chorus-3-delay': {
      label: 'Delay',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 41, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 41, (x)&127),
  },
  'chorus-4-type': {
      label: 'Type',
      enum: ['Phaser', 'Chorus'],
      type: CommandType.NRPN,
      range: [0,1],
      init: 0,
      mapFrom: [
        [1, 42, [0, 1]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 42, (x)&127),
  },
  'chorus-4-rate': {
      label: 'Rate',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 43, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 43, (x)&127),
  },
  'chorus-4-rate-sync': {
      label: 'Rate Sync',
      enum: sync,
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 44, [0, 35]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 44, (x)&127),
  },
  'chorus-4-feedback': {
      label: 'Feedback',
      type: CommandType.NRPN,
      range: [-64,63],
      init: 0,
      mapFrom: [
        [1, 45, [0, 127]],
      ],
      decode: ([, , y]) => y-64,
      msg: x => nrpn(1, 45, (x+64)&127),
   },
  'chrous-4-mod-depth': {
      label: 'Mod Depth',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 46, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 46, (x)&127),
  },
  'chorus-4-delay': {
      label: 'Delay',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 47, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 47, (x)&127),
  },

  'gator-on': {
      label: 'On',
      enum: ['Off', 'on'],
      type: CommandType.NRPN,
      range: [0,127],
      init: 52,
      mapFrom: [
        [0, 122, [52, 53]],
      ],
      decode: ([, , y]) => y-52,
      msg: x => nrpn(0, 122, (x+52)&127),
  },
  'gator-key-sync': {
      label: 'Key Sync',
      enum: ['Freerun', 'KeySync'],
      type: CommandType.NRPN,
      range: [0,127],
      init: 54,
      mapFrom: [
        [0, 122, [54, 55]],
      ],
      decode: ([, , y]) => y-54,
      msg: x => nrpn(0, 122, (x+54)&127),
  },
  'gator-key-latch': {
      label: 'Key Latch',
      enum: ['Off', 'On'],
      type: CommandType.NRPN,
      range: [0,127],
      init: 56,
      mapFrom: [
        [0, 122, [56, 57]],
      ],
      decode: ([, , y]) => y-56,
      msg: x => nrpn(0, 122, (x+56)&127),
  },
  'gator-rate-sync': {
      label: 'Rate Sync',
      enum: sync,
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 49, [0, 35]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 49, (x)&127),
  },
  'gator-mode': {
      label: 'Mode',
      enum: ['Mono16', 'MonoAlt1','MonoAlt2', 'Stereo16', 'SterAlt1', 'SterAlt2'],
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 50, [0, 5]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 50, (x)&127),
  },
  'gator-edge-slew': {
      label: 'Edge Slew',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 52, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 52, (x)&127),
  },
  'gator-hold': {
      label: 'Hold',
      type: CommandType.NRPN,
      range: [0,127],
      init: 0,
      mapFrom: [
        [1, 53, [0, 127]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(1, 53, (x)&127),
  },
  'gator-lr-delay': {
    label: 'LR Delay',
      type: CommandType.NRPN,
      range: [-64,63],
      init: 0,
      mapFrom: [
        [1, 54, [0, 127]],
      ],
      decode: ([, , y]) => y-64,
      msg: x => nrpn(1, 54, (x+64)&127),
  },
  'gator-level-1': {
      label: 'Level 1',
      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 0, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 0, (x)&127),
  },
  'gator-level-2': {
      label: 'Level 2',
      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 1, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 1, (x)&127),
  },

  'gator-level-3': {
      label: 'Level 3',
      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 2, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 2, (x)&127),
  },

  'gator-level-4': {
      label: 'Level 4',
      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 3, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 3, (x)&127),
  },

  'gator-level-5': {
      label: 'Level 5',
      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 4, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 4, (x)&127),
  },

  'gator-level-6': {
      label: 'Level 6',
      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 5, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 5, (x)&127),
  },

  'gator-level-7': {
      label: 'Level 7',
      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 6, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 6, (x)&127),
  },

  'gator-level-8': {
      label: 'Level 7',
      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 7, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 7, (x)&127),
  },

  'gator-level-9': {
      label: 'Level 9',
      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 8, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 8, (x)&127),
  },

  'gator-level-10': {
      label: 'Level 10',
      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 9, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 9, (x)&127),
  },

  'gator-level-11': {
      label: 'Level 11',
      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 10, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 10, (x)&127),
  },

  'gator-level-12': {
      label: 'Level 12',
      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 11, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 11, (x)&127),
  },

  'gator-level-13': {
      label: 'Level 13',

      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 12, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 12, (x)&127),
  },

  'gator-level-14': {
      label: 'Level 14',
      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 13, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 13, (x)&127),
  },

  'gator-level-15': {
      label: 'Level 15',
      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 14, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 14, (x)&127),
  },

  'gator-level-16': {
      label: 'Level 16',
      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 15, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 15, (x)&127),
  },

  'gator-level-17': {
      label: 'Level 17',
      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 16, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 16, (x)&127),
  },

  'gator-level-18': {
      label: 'Level 18',
      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 17, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 17, (x)&127),
  },

  'gator-level-19': {
      label: 'Level 19',
      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 18, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 18, (x)&127),
  },

  'gator-level-20': {
      label: 'Level 20',
      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 19, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 19, (x)&127),
  },

  'gator-level-21': {
      label: 'Level 21', 
      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 20, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 20, (x)&127),
  },

  'gator-level-22': {
      label: 'Level 22',
      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 21, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 21, (x)&127),
  },

  'gator-level-23': {
      label: 'Level 23',
      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 22, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 22, (x)&127),
  },

  'gator-level-24': {
      label: 'Level 24',
      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 23, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 23, (x)&127),
  },

  'gator-level-25': {
      label: 'Level 25',
      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 24, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 24, (x)&127),
  },

  'gator-level-26': {
      label: 'Level 26',
      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 25, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 25, (x)&127),
  },

  'gator-level-27': {
      label: 'Level 27',
      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 26, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 26, (x)&127),
  },

  'gator-level-28': {
      label: 'Level 28',
      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 27, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 27, (x)&127),
  },

  'gator-level-29': {
      label: 'Level 29',
      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 28, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 28, (x)&127),
  },

  'gator-level-30': {
      label: 'Level 30',
      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 29, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 29, (x)&127),
  },

  'gator-level-31': {
      label: 'Level 31',
      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 30, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 30, (x)&127),
  },

  'gator-level-32': {
      label: 'Level 32',
      type: CommandType.NRPN,
      range: [0,7],
      init: 0,
      mapFrom: [
        [5, 32, [0, 7]],
      ],
      decode: ([, , y]) => y,
      msg: x => nrpn(5, 32, (x)&127),
  },


};


//  'gator-on':
//  'gator-key-sync':
//  'gator-key-latch':
//  'gator-rate-sync':
//  'gator-mode':
//  'gator-edge-slew':
//  'gator-hold':
//  'gator-lr-delay':
//  'gator-level-1':
//  'gator-level-2':
//  'gator-level-3':
//  'gator-level-4':
//  'gator-level-5':
//  'gator-level-6':
//  'gator-level-7':
//  'gator-level-8':
//  'gator-level-9':
//  'gator-level-10':
//  'gator-level-11':
//  'gator-level-12':
//  'gator-level-13':
//  'gator-level-14':
//  'gator-level-15':
//  'gator-level-16':
//  'gator-level-17':
//  'gator-level-18':
//  'gator-level-19':
//  'gator-level-20':
//  'gator-level-21':
//  'gator-level-22':
//  'gator-level-23':
//  'gator-level-24':
//  'gator-level-25':
//  'gator-level-26':
//  'gator-level-27':
//  'gator-level-28':
//  'gator-level-29':
//  'gator-level-30':
//  'gator-level-31':
//  'gator-level-32':


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
