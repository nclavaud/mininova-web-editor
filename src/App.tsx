import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Controls, DeviceSetup, Intro } from './components';
import { PROGRAM_CHANGE } from './midi';
import { isPatch, selectPatch } from './mininova';
import { isNRPNStart, isNRPNMiddle, isNRPNEnd } from './mininova.nrpn';
import { debugMidiMessage } from './debug';
import { DeviceInput, DeviceOutput, MidiMessage } from './ports';
import { patchDumpReceived } from './redux/patch';

interface RootState {
  device: {
    input: DeviceInput,
    output: DeviceOutput,
  }
}

function App() {
  const input = useSelector((state: RootState) => state.device.input);
  const output = useSelector((state: RootState) => state.device.output);
  const [currentPatch, setCurrentPatch] = useState<number | undefined>(undefined);
  const dispatch = useDispatch();

  const decodePatch = (data: Uint8Array) => {
    console.log('Received patch.');
    dispatch(patchDumpReceived(data));
  }

  let nrpn: number[] = [];

  const onIncomingMidiMessage = (message: MidiMessage) => {
    debugMidiMessage(message, 'Input: ');
    if (message[0] === PROGRAM_CHANGE) {
      setCurrentPatch(message[1]);
    } else if (isPatch(message)) {
      decodePatch(message);
    } else if (isNRPNEnd(message, nrpn)) {
      nrpn.push(message[2]);
      console.log('NRPN: ' + nrpn);
      nrpn = [];
    } else if (isNRPNMiddle(message, nrpn)) {
      nrpn.push(message[2]);
    } else if (isNRPNStart(message)) {
      nrpn = [message[2]];
    }
  };

  const emit = (message: Uint8Array) => {
    if (!output) {
      return;
    }
    debugMidiMessage(message, 'Output: ');
    output.send(message);
  };

  const onChangeOutput = () => selectPatch(emit);

  return (
    <div>
      <Intro />
      <h3>Setup</h3>
      <DeviceSetup
        onChangeOutput={onChangeOutput}
        onIncomingMidiMessage={onIncomingMidiMessage}
        input={input}
        output={output}
      />
      <Controls
        currentPatch={currentPatch}
        emit={emit}
      />
    </div>
  );
}

export default App;
