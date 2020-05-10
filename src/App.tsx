import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Controls, DeviceSetup, Intro } from './components';
import { PROGRAM_CHANGE } from './midi';
import { isPatch, selectPatch } from './mininova';
import { debugMidiMessage } from './debug';
import { DeviceInput, DeviceOutput, MidiMessage } from './ports';

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
    dispatch({
      type: 'PATCH_DUMP_RECEIVED',
      payload: {
        data,
      },
    });
  }

  const onIncomingMidiMessage = (message: MidiMessage) => {
    debugMidiMessage(message, 'Input: ');
    if (message[0] === PROGRAM_CHANGE) {
      setCurrentPatch(message[1]);
    } else if (isPatch(message)) {
      decodePatch(message);
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
