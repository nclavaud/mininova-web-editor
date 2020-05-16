import React from 'react';
import { useDispatch } from 'react-redux';
import { cc, nrpn } from '../midi';
import { controls, loadPatch } from '../mininova';
import Oscillator from './Oscillator';
import Control from './Control';
import { patchControlChanged } from '../redux/patch';

const randomInt = ([min, max]) => Math.floor(Math.random() * (max + 1 - min)) + min;

function Controls({ currentPatch, emit }) {
  const dispatch = useDispatch();

  const changeOctave = () => emit(cc(13, 0));
  const activateArp = () => emit(nrpn(0, 122, 47));
  const deactivateArp = () => emit(nrpn(0, 122, 46));
  const selectPrevPatch = () => emit(nrpn(63, 0, 0));
  const selectNextPatch = () => emit(nrpn(63, 0, 2));
  const randomize = () => {
    for (let [controlId, control] of Object.entries(controls)) {
      if (!controlId.startsWith('osc-')) {
        continue;
      }
      if (!control.range) {
        continue;
      }
      const value = randomInt(control.range);
      emit(control.msg(value));
      dispatch(patchControlChanged(controlId, value));
    }
  };

  return (
    <div className="controls">
      <h3>Patch</h3>
      <p>Current patch: {currentPatch}</p>
      <button onClick={selectPrevPatch}>Prev patch</button>
      <button onClick={selectNextPatch}>Next patch</button>
      <button onClick={() => emit(loadPatch)}>Load patch</button>
      <h3>Oct / Arp</h3>
      <Control
        id="tempo"
        control={controls['tempo']}
        emit={emit}
        readonly
      />
      <button onClick={changeOctave}>Change octave</button>
      <button onClick={activateArp}>Arp ON</button>
      <button onClick={deactivateArp}>Arp OFF</button>
      <h3>Oscillators</h3>
      <button onClick={randomize}>Randomize</button>
      <div className="oscillators">
        {[1, 2, 3].map(i => (
          <Oscillator
            key={i}
            emit={emit}
            number={i}
          />
        ))}
      </div>
    </div>
  );
}

export default Controls;
