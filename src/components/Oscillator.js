import React from 'react';
import * as R from 'ramda';

const waveforms = [
  0, 'Sine',
  1, 'Triangle',
  2, 'Sawtooth',
];

function Oscillator({ emit, controls, number }) {
  const selectWave = event => emit(controls.wave(event.target.value));
  const selectVSync = event => emit(controls.vsync(event.target.value));

  return (
    <div>
      <h4>Oscillator {number}</h4>
      <select onChange={selectWave}>
        {R.map(([waveform, label]) => (
          <option key={waveform} value={waveform}>{label}</option>
        ), R.splitEvery(2, waveforms))}
      </select>
      <div>
        <label htmlFor={`osc-${number}-vsync`}>Virtual Sync</label>
        <input
          id={`osc-${number}-vsync`}
          type="number"
          min="0"
          max="127"
          onChange={selectVSync}
        />
      </div>
    </div>
  );
};

export default Oscillator;
