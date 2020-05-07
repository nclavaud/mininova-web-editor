import React, { useState } from 'react';
import { Controls, DeviceSetup, Intro } from './components';
import { PROGRAM_CHANGE } from './midi';
import { isPatch, selectPatch } from './mininova';
import { debugMidiMessage, consoleOutput } from './debug';

function App() {
  const [input, setInput] = useState(undefined);
  const [output, setOutput] = useState(consoleOutput);
  const [currentPatch, setCurrentPatch] = useState<number | undefined>(undefined);

  const decodePatch = (data: Uint8Array) => {
    console.log('Received patch.');
  }

  const onIncomingMidiMessage = (message: WebMidi.MIDIMessageEvent) => {
    debugMidiMessage(message.data, 'Input: ');
    if (message.data[0] === PROGRAM_CHANGE) {
      setCurrentPatch(message.data[1]);
    } else if (isPatch(message.data)) {
      decodePatch(message.data);
    }
  };

  const emit = (message: Uint8Array) => output && output.send(message);

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
