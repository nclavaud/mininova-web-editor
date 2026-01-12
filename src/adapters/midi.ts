import { DeviceInput, DeviceOutput, MidiMessage, MidiMessageFunc } from '../ports';

export class MidiInputWrapper implements DeviceInput {
  private midiInput: MIDIInput;
  private listener: MidiMessageFunc | null = null;

  constructor(midiInput: MIDIInput) {
    this.midiInput = midiInput;
  }

  public setIncomingMidiMessageListener(listener: MidiMessageFunc): void {
    this.listener = listener;
    this.midiInput.onmidimessage = (e: MIDIMessageEvent) => {
      if (e.data && this.listener) {
        this.listener(e.data);
      }
    };
  }

  // Provide access to the original MIDIInput properties for compatibility
  public get id(): string {
    return this.midiInput.id;
  }

  public get name(): string | null {
    return this.midiInput.name;
  }

  public get manufacturer(): string | null {
    return this.midiInput.manufacturer;
  }
}

export class MidiOutputWrapper implements DeviceOutput {
  private midiOutput: MIDIOutput;

  constructor(midiOutput: MIDIOutput) {
    this.midiOutput = midiOutput;
  }

  public send(message: MidiMessage): void {
    this.midiOutput.send(message);
  }

  // Provide access to the original MIDIOutput properties for compatibility
  public get id(): string {
    return this.midiOutput.id;
  }

  public get name(): string | null {
    return this.midiOutput.name;
  }

  public get manufacturer(): string | null {
    return this.midiOutput.manufacturer;
  }
}