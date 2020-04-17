import React, { useState, useEffect } from 'react';
import * as R from 'ramda';
import NotSupported from './NotSupported.js';

function Devices({
  onIncomingMidiMessage,
  selectPatch,
  input,
  setInput,
  output,
  setOutput
}) {
  const [midiSupport, setMidiSupport] = useState(null);
  const [availableInputs, setAvailableInputs] = useState(null);
  const [availableOutputs, setAvailableOutputs] = useState(null);

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
    </div>
  );
}

export default Devices;
