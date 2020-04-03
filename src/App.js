import * as R from 'ramda';
import React, { useState, useEffect } from 'react';
import NoDeviceFound from './components/NoDeviceFound.js';
import NotSupported from './components/NotSupported.js';
import { cc, nrpn } from './midi';

const send = (device, messages) => {
  messages.forEach(msg => device.send(msg));
};

function App() {
  const [midiSupport, setMidiSupport] = useState(true);
  const [devices, setDevices] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
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
    };

    if (!navigator.requestMIDIAccess) {
      setMidiSupport(false);
      return;
    }

    navigator.requestMIDIAccess().then(access => {
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
        <button onClick={selectPrevPatch}>Prev patch</button>
        <button onClick={selectNextPatch}>Next patch</button>
      </>}
    </div>
  );
}

export default App;
