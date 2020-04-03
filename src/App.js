import * as R from 'ramda';
import React, { useState, useEffect } from 'react';
import NoDeviceFound from './components/NoDeviceFound.js';
import NotSupported from './components/NotSupported.js';
import { cc, nrpn, sysex, PROGRAM_CHANGE } from './midi';

const send = (device, messages) => {
  messages.forEach(msg => device.send(msg));
};

function App() {
  const [midiSupport, setMidiSupport] = useState(true);
  const [devices, setDevices] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [currentPatch, setCurrentPatch] = useState(null);

  useEffect(() => {
    const onMidiMessage = message => {
      if (message.data[0] === PROGRAM_CHANGE) {
        setCurrentPatch(message.data[1]);
      }
    };

    const detectDevices = access => {
      console.log('Detecting devices');

      const found = [];
      const outputs = access.outputs.values();
      let output = outputs.next();
      while (!output.done) {
        found.push(output.value);
        output = outputs.next();
      }
      setDevices(found);

      const inputs = access.inputs.values();
      const input = inputs.next().value;
      input.onmidimessage = onMidiMessage;
    };

    if (!navigator.requestMIDIAccess) {
      setMidiSupport(false);
      return;
    }

    navigator.requestMIDIAccess({ sysex: true }).then(access => {
      access.onstatechange = e => {
        detectDevices(access);
      }
      detectDevices(access);
    });
  }, []);

  if (!midiSupport) {
    return <NotSupported />;
  }

  if (null === devices) {
    return <div>Detecting MIDI devices...</div>;
  }

  const device = R.find(R.propEq('id', selectedDevice))(devices);

  const changeOctave = () => send(device, cc(13, 0));
  const activateArp = () => send(device, nrpn(0, 122, 47));
  const deactivateArp = () => send(device, nrpn(0, 122, 46));
  const loadPatch = () => send(device, sysex([0x7F, 0x40, 0x00, 0x00, 0x00, 0x00, 0x00]));
  const selectPrevPatch = () => send(device, nrpn(63, 0, 0));
  const selectNextPatch = () => send(device, nrpn(63, 0, 2));

  if (!devices.length) {
    return <NoDeviceFound />;
  }

  return (
    <div>
      <p>Available devices:</p>
      <ul>
        {devices.map(device => (
          <li key={device.id}>
            {device.name}
            {device.id === selectedDevice
              ? ' (selected)'
              : <button onClick={() => setSelectedDevice(device.id)}>select</button>
            }
          </li>
        ))}
      </ul>
      {device && <>
        <h3>Oct / Arp</h3>
        <button onClick={changeOctave}>Change octave</button>
        <button onClick={activateArp}>Arp ON</button>
        <button onClick={deactivateArp}>Arp OFF</button>
        <h3>Patch</h3>
        <p>Current patch: {currentPatch}</p>
        <button onClick={selectPrevPatch}>Prev patch</button>
        <button onClick={selectNextPatch}>Next patch</button>
        <button onClick={loadPatch}>Load patch</button>
      </>}
    </div>
  );
}

export default App;
