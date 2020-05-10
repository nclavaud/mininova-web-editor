import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detectUSB } from '../adapters/usb';
import { DeviceInput, DeviceOutput, MidiMessage } from '../ports';
import { deviceInputOutputSelected } from '../redux/device';

type USBDeviceSetupProps = {
  onIncomingMidiMessage: (message: MidiMessage) => void,
  input: DeviceInput,
  output: DeviceOutput,
};

function USBDeviceSetup({
  input,
  onIncomingMidiMessage,
}: USBDeviceSetupProps) {
  interface RootState {
    usb: {
      isSupported: boolean,
    },
  };

  const dispatch = useDispatch();
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
    dispatch(deviceInputOutputSelected(device));
  };

  return (
    <button onClick={connectToUSBDevice}>Connect to USB device</button>
  );
}

export default USBDeviceSetup;
