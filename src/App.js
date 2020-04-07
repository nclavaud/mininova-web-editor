import * as R from 'ramda';
import React, { useState, useEffect } from 'react';
import NotSupported from './components/NotSupported.js';
import { cc, nrpn, sysex, PROGRAM_CHANGE } from './midi';

const send = (device, msg) => device && device.send(msg);

// is it really handshake?
const sequenceHandshake = [0x7F, 0x60, 0x21, 0x00, 0x00, 0x00, 0x00];
const sequencePreHandshake = [0x7F, 0x62, 0x01, 0x00, 0x00, 0x00, 0x00];
const sequenceLoadCurrentPatch = [0x7F, 0x40, 0x00, 0x00, 0x00, 0x00, 0x00];

function App() {
  const [midiSupport, setMidiSupport] = useState(null);
  const [availableInputs, setAvailableInputs] = useState(null);
  const [availableOutputs, setAvailableOutputs] = useState(null);
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

  const selectPatch = output => {
    send(output, sysex(sequencePreHandshake));
    setTimeout(() => send(output, sysex(sequenceHandshake)), 1000);
    setTimeout(() => send(output, nrpn(63, 0, 1)), 2000);
    setTimeout(() => send(output, sysex(sequenceLoadCurrentPatch)), 3000);
  };

  const selectOutput = id => {
    const device = R.find(R.propEq('id', id))(availableOutputs);
    setOutput(device);
    selectPatch(device);
  };

  const selectInput = id => {
    if (input) {
      input.onmidimessage = null;
    }
    const device = R.find(R.propEq('id', id))(availableInputs);
    device.onmidimessage = onIncomingMidiMessage;
    setInput(device);
  };

  useEffect(() => {

    const detectDevices = access => {
      console.log('Detecting devices');

      const outputDevicesFound = [];
      const outputs = access.outputs.values();
      for (let output = outputs.next(); output && !output.done; output = outputs.next()) {
        outputDevicesFound.push(output.value);
      }
      setAvailableOutputs(outputDevicesFound);

      const inputDevicesFound = [];
      const inputs = access.inputs.values();
      for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
        inputDevicesFound.push(input.value);
      }
      setAvailableInputs(inputDevicesFound);
    };

    if (!navigator.requestMIDIAccess) {
      setMidiSupport(false);
      return;
    } else {
      setMidiSupport(true);
    }

    navigator.requestMIDIAccess({ sysex: true }).then(access => {
      access.onstatechange = e => {
        detectDevices(access);
      }
      detectDevices(access);
    });
  }, []);

  if (null === midiSupport) {
    return <p>Detecting MIDI support...</p>;
  } else if (!midiSupport) {
    return <NotSupported />;
  }

  if (null === availableInputs || null === availableOutputs) {
    return <div>Detecting MIDI devices...</div>;
  }

  const changeOctave = () => send(output, cc(13, 0));
  const activateArp = () => send(output, nrpn(0, 122, 47));
  const deactivateArp = () => send(output, nrpn(0, 122, 46));
  const loadPatch = () => send(output, sysex(sequenceLoadCurrentPatch));
  const selectPrevPatch = () => send(output, nrpn(63, 0, 0));
  const selectNextPatch = () => send(output, nrpn(63, 0, 2));

  return (
    <div>
      <p>Available devices:</p>
      <ul>
        {availableInputs.map(device => (
          <li key={device.id}>
            IN {device.name}
            {input && device.id === input.id
              ? ' (selected)'
              : <button onClick={() => selectInput(device.id)}>select</button>
            }
          </li>
        ))}
        {availableOutputs.map(device => (
          <li key={device.id}>
            OUT {device.name}
            {output && device.id === output.id
              ? ' (selected)'
              : <button onClick={() => selectOutput(device.id)}>select</button>
            }
          </li>
        ))}
      </ul>
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
    </div>
  );
}

export default App;
