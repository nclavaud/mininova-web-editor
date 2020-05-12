import { DeviceIO, MidiMessage, MidiMessageFunc } from '../ports';

const MININOVA_VENDOR_ID = 0x1235;
const MININOVA_PRODUCT_ID = 0x001e;
const MININOVA_CONFIGURATION = 1;
const MININOVA_INTERFACE = 0;
const MININOVA_ENDPOINT_IN = 1;
const MININOVA_ENDPOINT_OUT = 2;
const MININOVA_BUFFER_LENGTH = 64;

const isLastPartOfSysex = (message: Uint8Array) => {
  const lastByte = message[message.byteLength - 1];

  return lastByte === 0xF7;
};

class USBDeviceIO implements DeviceIO
{
  private device: USBDevice;
  private onIncomingMidiMessage: MidiMessageFunc;
  private incomingMessageBuffer: Uint8Array;

  constructor(device: USBDevice) {
    this.device = device;
    this.onIncomingMidiMessage = (message: MidiMessage) => {};
    this.incomingMessageBuffer = new Uint8Array(0);
  }

  public setIncomingMidiMessageListener(onIncomingMidiMessage: MidiMessageFunc): void {
    this.onIncomingMidiMessage = onIncomingMidiMessage;

    this.listen();
  }

  private async listen(): Promise<void> {
    const result = await this.device.transferIn(MININOVA_ENDPOINT_IN, MININOVA_BUFFER_LENGTH);
    if (result?.data?.buffer) {
      const message = new Uint8Array(result.data.buffer);
      if (message.length === MININOVA_BUFFER_LENGTH && !isLastPartOfSysex(message)) {
        // incomplete message => store in buffer
        this.appendToIncomingMessageBuffer(message);
      } else if (this.incomingMessageBuffer.byteLength > 0) {
        // end part of a message that has been stored in the buffer
        this.appendToIncomingMessageBuffer(message);
        this.dispatchIncomingMessage(this.incomingMessageBuffer);
        this.incomingMessageBuffer = new Uint8Array(0);
      } else {
        // complete message, no buffer involved
        this.dispatchIncomingMessage(message);
      }
    }

    this.listen();
  };

  private appendToIncomingMessageBuffer(message: Uint8Array): void {
    const b = new Uint8Array(this.incomingMessageBuffer.byteLength + message.byteLength);
    b.set(this.incomingMessageBuffer, 0);
    b.set(message, this.incomingMessageBuffer.byteLength);
    this.incomingMessageBuffer = b;
  }

  private dispatchIncomingMessage(message: MidiMessage): void {
    const messages = this.ungroup(message);
    messages.forEach(this.onIncomingMidiMessage);
  }

  private ungroup(message: MidiMessage): MidiMessage[] {
    return [message];
  }

  public send(message: Uint8Array): void {
    this.device.transferOut(MININOVA_ENDPOINT_OUT, message);
  }
}

export const detectUSB = async () => {
  const device = await navigator.usb.requestDevice({
    filters: [
      {
        vendorId: MININOVA_VENDOR_ID,
        productId: MININOVA_PRODUCT_ID,
      }
    ],
  });
  console.log(`Connected to ${device.productName}`);
  await device.open();
  await device.selectConfiguration(MININOVA_CONFIGURATION);
  await device.claimInterface(MININOVA_INTERFACE);

  return new USBDeviceIO(device);
};
