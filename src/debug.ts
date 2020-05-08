import { MidiMessage } from './ports';

export const debugMidiMessage = (message: MidiMessage, prefix: string) => {
  const bytes = message.map(d => d).join(' ');
  console.log(`${prefix}${bytes}`);
};

export const consoleOutput = new class {
  send(message: MidiMessage) {
    debugMidiMessage(message, 'Output: ');
  }
}();

export const noInput = new class {
  setIncomingMidiMessageListener() {}
}();
