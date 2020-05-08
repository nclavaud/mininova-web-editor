export type MidiMessage = Uint8Array;
export type MidiMessageFunc = (message: MidiMessage) => void;

export interface DeviceInput
{
  setIncomingMidiMessageListener(MidiMessageFunc): void;
}

export interface DeviceOutput
{
  send: ((message: MidiMessage) => void);
}

export interface DeviceIO extends DeviceInput, DeviceOutput {}
