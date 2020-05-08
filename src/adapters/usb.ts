import { DeviceIO, MidiMessage, MidiMessageFunc } from '../ports';

const MININOVA_VENDOR_ID = 0x1235;
const MININOVA_PRODUCT_ID = 0x001e;
const MININOVA_CONFIGURATION = 1;
const MININOVA_INTERFACE = 0;
const MININOVA_ENDPOINT_IN = 1;
const MININOVA_ENDPOINT_OUT = 2;
const MININOVA_BUFFER_LENGTH = 64;

class USBDeviceIO implements DeviceIO
{
  private device: USBDevice;
  private onIncomingMidiMessage: MidiMessageFunc;

  constructor(device: USBDevice) {
    this.device = device;
    this.onIncomingMidiMessage = (message: MidiMessage) => {};
  }

  public setIncomingMidiMessageListener(onIncomingMidiMessage: MidiMessageFunc) {
    this.onIncomingMidiMessage = onIncomingMidiMessage;

    this.listen();
  }

  private async listen() {
    console.log('Waiting for incoming messages from USB device...');
    const result = await this.device.transferIn(MININOVA_ENDPOINT_IN, MININOVA_BUFFER_LENGTH);
    if (result?.data?.buffer) {
      this.onIncomingMidiMessage(new Uint8Array(result.data.buffer));
    }

    this.listen();
  };

  public send(message: Uint8Array) {
    this.device.transferOut(MININOVA_ENDPOINT_OUT, message);
  }
}

export const detectUSB = async () => {
  console.log('Detecting USB devices');
  const device = await navigator.usb.requestDevice({
    filters: [
      {
        vendorId: MININOVA_VENDOR_ID,
        productId: MININOVA_PRODUCT_ID,
      }
    ],
  });
  console.log(`Connected to ${device.productName}`);
  console.log(device);
  await device.open();
  await device.selectConfiguration(MININOVA_CONFIGURATION);
  await device.claimInterface(MININOVA_INTERFACE);

  return new USBDeviceIO(device);
};
