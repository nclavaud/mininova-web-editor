import React from 'react';

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
