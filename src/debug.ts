import { DeviceIO, MidiMessage } from './ports';

// MIDI messages that should be filtered out in debug mode
const IGNORED_MESSAGES = new Set([
  0xF8, // MIDI Clock (Timing Clock)
]);

export const debugMidiMessage = (message: MidiMessage, prefix: string) => {
    if (message.length === 1 && IGNORED_MESSAGES.has(message[0])) {
        return;
    }

    var res = "";
    for( var i=0; i<message.length; i++) {
        if ( i > 0 && i % 16 === 0 ) {
            res += "\n"
        }
        res += message[i].toString(16).padStart(2, "0") + " ";
    }
    console.log(`${prefix}\n${res}`);


  //const bytes = message.map(d => d).join(' ');
  //console.log(`${prefix}${bytes}`);
};

export const noDevice = new class implements DeviceIO {
  id = 'no-device';
  name = null;
  manufacturer = null;
  send(message: MidiMessage) {}
  setIncomingMidiMessageListener() {}
}();
