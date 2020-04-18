import React from 'react';
import * as R from 'ramda';
import InputRange from './InputRange';

const waveforms = [
  0, 'Sine',
  1, 'Triangle',
  2, 'Sawtooth',
];

function Oscillator({ emit, controls, number }) {
  const selectWave = event => emit(controls.wave(event.target.value));
  const selectWTInt = event => emit(controls.wtint(event.target.value));
  const selectVSync = event => emit(controls.vsync(event.target.value));

  return (
    <div>
      <h4>Oscillator {number}</h4>
      <select onChange={selectWave}>
        {R.map(([waveform, label]) => (
          <option key={waveform} value={waveform}>{label}</option>
        ), R.splitEvery(2, waveforms))}
      </select>
      <InputRange
        id={`osc-${number}-vsync`}
        label="Virtual Sync"
        range={[0, 127]}
        onChange={selectVSync}
      />
      <InputRange
        id={`osc-${number}-wtint`}
        label="Wave Table Interpolation"
        range={[0, 127]}
        onChange={selectWTInt}
      />
    </div>
  );
};

export default Oscillator;
