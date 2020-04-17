import React from 'react';
import * as R from 'ramda';
import { cc, nrpn } from '../midi';
import { send } from '../webmidi';

const waveforms = [
  0, 'Sine',
  1, 'Triangle',
  2, 'Sawtooth',
];

function Controls({ currentPatch, loadPatch, output }) {
  const changeOctave = () => send(output, cc(13, 0));
  const activateArp = () => send(output, nrpn(0, 122, 47));
  const deactivateArp = () => send(output, nrpn(0, 122, 46));
  const selectPrevPatch = () => send(output, nrpn(63, 0, 0));
  const selectNextPatch = () => send(output, nrpn(63, 0, 2));
  const selectOsc1Wave = event => send(output, cc(19, event.target.value));

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
