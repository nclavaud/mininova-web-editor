import React, { useState, useEffect } from 'react';
import NotSupported from './components/NotSupported.js';

function App() {
  const [midiSupport, setMidiSupport] = useState(true);
  const [devices, setDevices] = useState(null);

  useEffect(() => {
    const detectDevices = access => {
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

    navigator.requestMIDIAccess().then(detectDevices);
  }, []);

  if (!midiSupport) {
    return <NotSupported />;
  }

  if (null === devices) {
    return <div>Detecting MIDI devices...</div>;
  }

  return (
    <div>
      <p>Available devices:</p>
      <ul>
        {devices.map(device => (
          <li key={device.id}>{device.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
