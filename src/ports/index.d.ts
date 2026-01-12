export type MidiMessage = Uint8Array;
export type MidiMessageFunc = (message: MidiMessage) => void;

export interface DeviceInput
{
  id: string;
  name: string | null;
  manufacturer: string | null;
  setIncomingMidiMessageListener(MidiMessageFunc): void;
}

export interface DeviceOutput
{
  id: string;
  name: string | null;
  manufacturer: string | null;
  send: ((message: MidiMessage) => void);
}

export interface DeviceIO extends DeviceInput, DeviceOutput {}
