import React, { useState } from 'react';
import { Controls, DeviceSetup, Intro } from './components';
import { PROGRAM_CHANGE } from './midi';
import { isPatch, selectPatch } from './mininova';
import { debugMidiMessage, noDevice } from './debug';
import { DeviceInput, DeviceOutput, MidiMessage } from './ports';

function App() {
  const [input, setInput] = useState<DeviceInput>(noDevice);
  const [output, setOutput] = useState<DeviceOutput>(noDevice);
  const [currentPatch, setCurrentPatch] = useState<number | undefined>(undefined);

  const decodePatch = (data: Uint8Array) => {
    console.log('Received patch.');
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
        setInput={setInput}
        output={output}
        setOutput={setOutput}
      />
      <Controls
        currentPatch={currentPatch}
        emit={emit}
      />
    </div>
  );
}

export default App;
