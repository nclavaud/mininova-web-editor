import React from 'react';
import { useSelector } from 'react-redux';

import { detectUSB } from '../adapters/usb';
import { DeviceInput, DeviceOutput, MidiMessage } from '../ports';

type USBDeviceSetupProps = {
  onIncomingMidiMessage: (message: MidiMessage) => void,
  input: DeviceInput,
  setInput: (device: DeviceInput | null) => void,
  output: DeviceOutput,
  setOutput: (device: DeviceOutput | null) => void,
};

function USBDeviceSetup({
  input,
  onIncomingMidiMessage,
  setInput,
  setOutput
}: USBDeviceSetupProps) {
  interface RootState {
    usb: {
      isSupported: boolean,
    },
  };

  const isSupported = useSelector((state: RootState) => state.usb.isSupported);

  if (!isSupported) {
    return (
      <div>
        <p>It looks like your browser does not support USB.</p>
        <p>Web USB is an experimental technology. Check the list of compatible browsers in the <a href="https://developer.mozilla.org/en-US/docs/Web/API/USB#Browser_compatibility">Browser compatibility table </a>.</p>
      </div>
    )
  }

  const connectToUSBDevice = async () => {
    const device = await detectUSB();
    device.setIncomingMidiMessageListener(onIncomingMidiMessage);
    setOutput(device);
    setInput(device);
  };

  return (
    <button onClick={connectToUSBDevice}>Connect to USB device</button>
  );
}

export default USBDeviceSetup;
