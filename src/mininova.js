import * as R from 'ramda';
import { cc } from './midi';

const _cc = R.curry(cc);

const waveforms = [
  'Sine',
  'Triangle',
  'Sawtooth',
];

export const controls = {
  'osc-1-wave': {
    label: 'Wave',
    type: 'enum',
    enum: waveforms,
    msg: _cc(19),
  },
  'osc-1-wtint': {
    label: 'Wave Table Interpolation',
    type: 'range',
    range: [0, 127],
    msg: _cc(20),
  },
  'osc-1-vsync': {
    label: 'Virtual Sync',
    type: 'range',
    range: [0, 127],
    msg: _cc(22),
  },
  'osc-1-hardness': {
    label: 'Hardness',
    type: 'range',
    range: [0, 127],
    msg: _cc(23),
  },
  'osc-2-wave': {
    label: 'Wave',
    type: 'enum',
    enum: waveforms,
    msg: _cc(29),
  },
  'osc-2-wtint': {
    label: 'Wave Table Interpolation',
    type: 'range',
    range: [0, 127],
    msg: _cc(30),
  },
  'osc-2-vsync': {
    label: 'Virtual Sync',
    type: 'range',
    range: [0, 127],
    msg: _cc(33),
  },
  'osc-2-hardness': {
    label: 'Hardness',
    type: 'range',
    range: [0, 127],
    msg: _cc(34),
  },
  'osc-3-wave': {
    label: 'Wave',
    type: 'enum',
    enum: waveforms,
    msg: _cc(41),
  },
  'osc-3-wtint': {
    label: 'Wave Table Interpolation',
    type: 'range',
    range: [0, 127],
    msg: _cc(42),
  },
  'osc-3-vsync': {
    label: 'Virtual Sync',
    type: 'range',
    range: [0, 127],
    msg: _cc(44),
  },
  'osc-3-hardness': {
    label: 'Hardness',
    type: 'range',
    range: [0, 127],
    msg: _cc(45),
  },
};
