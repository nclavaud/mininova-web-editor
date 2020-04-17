import React from 'react';
import * as R from 'ramda';

const waveforms = [
  0, 'Sine',
  1, 'Triangle',
  2, 'Sawtooth',
];

function Oscillator({ emit, controls, number }) {
  const selectWave = event => emit(controls.wave(event.target.value));

  return (
    <div>
      <h4>Oscillator {number}</h4>
      <select onChange={selectWave}>
        {R.map(([waveform, label]) => (
          <option key={waveform} value={waveform}>{label}</option>
        ), R.splitEvery(2, waveforms))}
      </select>
    </div>
  );
};

export default Oscillator;
