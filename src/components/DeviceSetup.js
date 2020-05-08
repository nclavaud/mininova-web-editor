import React, { useState } from 'react';
import MIDIDeviceSetup from './MIDIDeviceSetup';
import USBDeviceSetup from './USBDeviceSetup';

function DeviceSetup({
  onChangeOutput,
  onIncomingMidiMessage,
  input,
  setInput,
  output,
  setOutput
}) {
  const [visible, setVisible] = useState(false);

  if (!visible) {
    return (
      <button onClick={() => setVisible(true)}>Choose device</button>
    );
  }

  return (
    <div className="deviceSetup">
      <USBDeviceSetup />
      <MIDIDeviceSetup />
      <button onClick={() => setVisible(false)}>Close</button>
    </div>
  );
}

export default DeviceSetup;
