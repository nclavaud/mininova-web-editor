import React from 'react';
import { cc, nrpn } from '../midi';
import { send } from '../webmidi';

function Controls({ currentPatch, loadPatch, output }) {
  const changeOctave = () => send(output, cc(13, 0));
  const activateArp = () => send(output, nrpn(0, 122, 47));
  const deactivateArp = () => send(output, nrpn(0, 122, 46));
  const selectPrevPatch = () => send(output, nrpn(63, 0, 0));
  const selectNextPatch = () => send(output, nrpn(63, 0, 2));

  return (
    <div>
      <h3>Oct / Arp</h3>
      <button onClick={changeOctave}>Change octave</button>
      <button onClick={activateArp}>Arp ON</button>
      <button onClick={deactivateArp}>Arp OFF</button>
      <h3>Patch</h3>
      <p>Current patch: {currentPatch}</p>
      <button onClick={selectPrevPatch}>Prev patch</button>
      <button onClick={selectNextPatch}>Next patch</button>
      <button onClick={loadPatch}>Load patch</button>
    </div>
  );
}

export default Controls;
