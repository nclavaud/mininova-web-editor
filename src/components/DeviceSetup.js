import React, { useState } from 'react';
import MIDIDeviceSetup from './MIDIDeviceSetup';
import USBDeviceSetup from './USBDeviceSetup';

function DeviceSetup(props) {
  const [visible, setVisible] = useState(false);

  if (!visible) {
    return (
      <button onClick={() => setVisible(true)}>Choose device</button>
    );
  }

  const close = () => setVisible(false);

  return (
    <div>
      <USBDeviceSetup
        {...props}
        onDone={close}
      />
      <MIDIDeviceSetup {...props} />
      <button onClick={close}>Close</button>
    </div>
  );
}

export default DeviceSetup;
