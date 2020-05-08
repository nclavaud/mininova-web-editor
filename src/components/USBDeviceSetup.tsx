import React from 'react';

import { cc } from '../midi';
import { debugMidiMessage } from '../debug';

function USBDeviceSetup() {
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
      if (result?.data?.buffer) {
        debugMidiMessage(new Uint8Array(result.data.buffer), 'USB Input: ');
      }
      listen();
    };

    listen();
  };

  return (
    <button onClick={detectUSB}>Connect to USB device</button>
  );
}

export default USBDeviceSetup;
