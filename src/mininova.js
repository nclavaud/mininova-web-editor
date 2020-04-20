import * as R from 'ramda';
import { cc, nrpn, sysex } from './midi';

// is it really handshake?
const sequenceHandshake = [0x7F, 0x60, 0x21, 0x00, 0x00, 0x00, 0x00];
const sequencePreHandshake = [0x7F, 0x62, 0x01, 0x00, 0x00, 0x00, 0x00];
const sequenceLoadCurrentPatch = [0x7F, 0x40, 0x00, 0x00, 0x00, 0x00, 0x00];
const sequencePatchResponse = [0xF0, 0x00, 0x20, 0x29, 0x03, 0x01, 0x7F, 0x00, 0x00, 0x09, 0x04];

export const isPatch = message =>
  R.equals(R.take(sequencePatchResponse.length, Array.from(message)), sequencePatchResponse);

export const loadPatch = sysex(sequenceLoadCurrentPatch);

export const selectPatch = emit => {
  emit(sysex(sequencePreHandshake));
  setTimeout(() => emit(sysex(sequenceHandshake)), 1000);
  setTimeout(() => emit(nrpn(63, 0, 1)), 2000);
  setTimeout(() => emit(loadPatch), 3000);
};

const _cc = R.curry(cc);

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
    msg: _cc(43),
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
};
