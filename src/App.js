import React, { useState } from 'react';
import { Controls, DeviceSetup } from './components';
import { PROGRAM_CHANGE } from './midi';
import { isPatch, selectPatch } from './mininova';
import { debugMidiMessage, consoleOutput } from './debug';

function App() {
  const [input, setInput] = useState(null);
  const [output, setOutput] = useState(consoleOutput);
  const [currentPatch, setCurrentPatch] = useState(null);

  const decodePatch = data => {
    console.log('Received patch.');
  }

  const onIncomingMidiMessage = message => {
    debugMidiMessage(message.data, 'Input: ');
    if (message.data[0] === PROGRAM_CHANGE) {
      setCurrentPatch(message.data[1]);
    } else if (isPatch(message.data)) {
      decodePatch(message.data);
    }
  };

  const emit = message => output && output.send(message);

  const onChangeOutput = () => selectPatch(emit);

  return (
    <div>
      <DeviceSetup
        onChangeOutput={onChangeOutput}
        emit={emit}
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
