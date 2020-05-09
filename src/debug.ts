import { DeviceIO, MidiMessage } from './ports';

export const debugMidiMessage = (message: MidiMessage, prefix: string) => {
  const bytes = message.map(d => d).join(' ');
  console.log(`${prefix}${bytes}`);
};

export const noDevice = new class implements DeviceIO {
  send(message: MidiMessage) {}
  setIncomingMidiMessageListener() {}
}();
