import React from 'react';
import * as R from 'ramda';
import { cc, nrpn } from '../midi';

const waveforms = [
  0, 'Sine',
  1, 'Triangle',
  2, 'Sawtooth',
];

function Controls({ currentPatch, loadPatch, emit }) {
  const changeOctave = () => emit(cc(13, 0));
  const activateArp = () => emit(nrpn(0, 122, 47));
  const deactivateArp = () => emit(nrpn(0, 122, 46));
  const selectPrevPatch = () => emit(nrpn(63, 0, 0));
  const selectNextPatch = () => emit(nrpn(63, 0, 2));
  const selectOsc1Wave = event => emit(cc(19, event.target.value));

  return (
    <div>
      <h3>Patch</h3>
      <p>Current patch: {currentPatch}</p>
      <button onClick={selectPrevPatch}>Prev patch</button>
      <button onClick={selectNextPatch}>Next patch</button>
      <button onClick={loadPatch}>Load patch</button>
      <h3>Oct / Arp</h3>
      <button onClick={changeOctave}>Change octave</button>
      <button onClick={activateArp}>Arp ON</button>
      <button onClick={deactivateArp}>Arp OFF</button>
      <h3>Oscillators</h3>
      <h4>Oscillator 1</h4>
      <select onClick={selectOsc1Wave}>
        {R.map(([waveform, label]) => (
          <option key={waveform} value={waveform}>{label}</option>
        ), R.splitEvery(2, waveforms))}
      </select>
    </div>
  );
}

export default Controls;
