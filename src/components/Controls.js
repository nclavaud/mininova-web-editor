import React from 'react';
import * as R from 'ramda';
import { cc, nrpn } from '../midi';
import Oscillator from './Oscillator';

const _cc = R.curry(cc);

function Controls({ currentPatch, loadPatch, emit }) {
  const changeOctave = () => emit(cc(13, 0));
  const activateArp = () => emit(nrpn(0, 122, 47));
  const deactivateArp = () => emit(nrpn(0, 122, 46));
  const selectPrevPatch = () => emit(nrpn(63, 0, 0));
  const selectNextPatch = () => emit(nrpn(63, 0, 2));
  const osc = {
    1: {
      wave: _cc(19),
      vsync: _cc(22),
    },
    2: {
      wave: _cc(29),
      vsync: _cc(33),
    },
    3: {
      wave: _cc(41),
      vsync: _cc(44),
    },
  };

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
      {[1, 2, 3].map(i => (
        <Oscillator
          key={i}
          emit={emit}
          controls={osc[i]}
          number={i}
        />
      ))}
    </div>
  );
}

export default Controls;
