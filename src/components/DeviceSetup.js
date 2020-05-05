import React, { useState, useEffect } from 'react';
import * as R from 'ramda';
import NotSupported from './NotSupported.js';
import { cc } from '../midi';
import { debugMidiMessage } from '../debug';

function DeviceSetup({
  onChangeOutput,
  onIncomingMidiMessage,
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
    onChangeOutput();
  };

  const selectInput = id => {
    if (input) {
      input.onmidimessage = null;
    }
    const device = R.find(R.propEq('id', id))(availableInputs);
    device.onmidimessage = onIncomingMidiMessage;
    setInput(device);
  };

  const detectUSB = async () => {
    console.log('Detecting USB devices');
    const device = await navigator.usb.requestDevice({
      filters: [
        {
          vendorId: 0x1235,
          productId: 0x001e,
        }
      ],
    });
    console.log(`Connected to ${device.productName}`);
    console.log(device);
    await device.open();
    await device.selectConfiguration(1);
    await device.claimInterface(0);
    const data = cc(13, 0);
    const [endpointIn, endpointOut] = [1, 2];
    console.log('Sending a message to USB device');
    device.transferOut(endpointOut, data);

    const listen = async () => {
      console.log('Waiting for incoming messages from USB device...');
      const result = await device.transferIn(endpointIn, 64);
      debugMidiMessage(new Uint8Array(result.data.buffer), 'USB Input: ');
      listen();
    };

    listen();
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
    <div className="deviceSetup">
      <button onClick={detectUSB}>Connect to USB device</button>
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

export default DeviceSetup;
