import { DeviceIO, MidiMessage } from './ports';

export const debugMidiMessage = (message: MidiMessage, prefix: string) => {
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
  send(message: MidiMessage) {}
  setIncomingMidiMessageListener() {}
}();
