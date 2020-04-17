import React, { useState } from 'react';
import { Controls, Devices } from './components';
import { nrpn, sysex, PROGRAM_CHANGE } from './midi';
import { send } from './webmidi';

// is it really handshake?
const sequenceHandshake = [0x7F, 0x60, 0x21, 0x00, 0x00, 0x00, 0x00];
const sequencePreHandshake = [0x7F, 0x62, 0x01, 0x00, 0x00, 0x00, 0x00];
const sequenceLoadCurrentPatch = [0x7F, 0x40, 0x00, 0x00, 0x00, 0x00, 0x00];

function App() {
  const [input, setInput] = useState(null);
  const [output, setOutput] = useState(null);
  const [currentPatch, setCurrentPatch] = useState(null);

  const onIncomingMidiMessage = message => {
    if (message.data[0] === PROGRAM_CHANGE) {
      setCurrentPatch(message.data[1]);
    } else {
      console.log(message);
    }
  };

  const emit = message => output && output.send(message);

  const loadPatch = () => emit(sysex(sequenceLoadCurrentPatch));

  const selectPatch = output => {
    emit(sysex(sequencePreHandshake));
    setTimeout(() => emit(sysex(sequenceHandshake)), 1000);
    setTimeout(() => emit(nrpn(63, 0, 1)), 2000);
    setTimeout(loadPatch, 3000);
  };


  return (
    <div>
      <Devices
        onIncomingMidiMessage={onIncomingMidiMessage}
        selectPatch={selectPatch}
        input={input}
        setInput={setInput}
        output={output}
        setOutput={setOutput}
      />
      <Controls
        currentPatch={currentPatch}
        loadPatch={loadPatch}
        emit={emit}
      />
    </div>
  );
}

export default App;
