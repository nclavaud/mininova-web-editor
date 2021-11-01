import React from 'react';
import { useDispatch } from 'react-redux';
import { cc, nrpn } from '../midi';
import { controls, loadPatch } from '../mininova';
import Oscillators from './Oscillators';
import Filters from './Filters';
import Envelopes from './Envelopes';
import Lfos from './Lfos';
import Effects from './Effects';
import ArpVocoder from './ArpVocoder';
import Control from './Control';
import { patchControlChanged } from '../redux/patch';

const randomInt = (min, max) => Math.floor(Math.random() * (max + 1 - min)) + min;

function Controls({ currentPatch, emit }) {
  const dispatch = useDispatch();

  const changeOctave = () => emit(cc(13, 0));
  const activateArp = () => emit(nrpn(0, 122, 47));
  const deactivateArp = () => emit(nrpn(0, 122, 46));
  const selectPrevPatch = () => emit(nrpn(63, 0, 0));
  const selectNextPatch = () => emit(nrpn(63, 0, 2));

  const resetDefaults = () => {
    for (let [controlId, control] of Object.entries(controls)) {
      const value = control.init;
      emit(control.msg(value));
      dispatch(patchControlChanged(controlId, value));
    }
  };

  const randomize = () => {
    for (let [controlId, control] of Object.entries(controls)) {
      if (['patch-name', 'tempo', 'osc-fixed-note'].includes(controlId)) {
        continue;
      }
      const value = control.range ? randomInt(...control.range) : randomInt(0, control.enum.length);
      emit(control.msg(value));
      dispatch(patchControlChanged(controlId, value));
    }
  };

  return (
    <div className="controls">
      <h3>Patch</h3>
      <p>Current patch: {currentPatch}</p>
      <Control
        id="patch-name"
        control={controls['patch-name']}
        readonly
      />


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
      <button onClick={resetDefaults}>Reset defaults</button>
      <Oscillators emit={emit} />
      <Filters emit={emit} />
      <Envelopes emit={emit} />
      <Lfos emit={emit} />
      <Effects emit={emit} />
      <ArpVocoder emit={emit} />
    </div>
  );
}

export default Controls;
