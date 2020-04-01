import * as R from 'ramda';
import React, { useState, useEffect } from 'react';
import NotSupported from './components/NotSupported.js';

function App() {
  const [midiSupport, setMidiSupport] = useState(true);
  const [devices, setDevices] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const CC = 0xB0;

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

  const changeOctave = () => {
    device.send([CC, 13, 0]); // keyboard octave
  };

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
      {device && (
        <button onClick={changeOctave}>Change octave</button>
      )}
    </div>
  );
}

export default App;
