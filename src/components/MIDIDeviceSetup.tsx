import React, { useEffect, useState } from 'react';
import NotSupported from './NotSupported.js';
import { MidiMessage } from '../ports';

function findDeviceById<T extends WebMidi.MIDIPort>(id: string, devices: Array<T>): T | null {
  return devices.filter(device => device.id === id)[0] || null;
};

type MIDIDeviceSetupProps = {
  onChangeOutput: () => {},
  onIncomingMidiMessage: (message: MidiMessage) => void,
  input: WebMidi.MIDIInput,
  setInput: (device: WebMidi.MIDIInput | null) => void,
  output: WebMidi.MIDIOutput,
  setOutput: (device: WebMidi.MIDIOutput | null) => void,
};

enum MidiSupport {
  No = 0,
  Yes = 1,
  Unknown = 2,
}

function MIDIDeviceSetup({
  onChangeOutput,
  onIncomingMidiMessage,
  input,
  setInput,
  output,
  setOutput
}: MIDIDeviceSetupProps) {
  const [midiSupport, setMidiSupport] = useState(MidiSupport.Unknown);
  const [availableInputs, setAvailableInputs] = useState<Array<WebMidi.MIDIInput>>([]);
  const [availableOutputs, setAvailableOutputs] = useState<Array<WebMidi.MIDIOutput>>([]);
  const [detectionComplete, setDetectionComplete] = useState(false);

  const selectOutput = (id: string) => {
    const device = findDeviceById<WebMidi.MIDIOutput>(id, availableOutputs);
    setOutput(device);
    onChangeOutput();
  };

  const selectInput = (id: string) => {
    if (input) {
      input.onmidimessage = (e: WebMidi.MIDIMessageEvent) => {};
    }
    const device = findDeviceById<WebMidi.MIDIInput>(id, availableInputs);
    if (device !== null) {
      device.onmidimessage = (e: WebMidi.MIDIMessageEvent) => {
        onIncomingMidiMessage(e.data);
      }
    }
    setInput(device);
  };

  useEffect(() => {

    const detectDevices = (access: WebMidi.MIDIAccess) => {
      console.log('Detecting devices');

      const outputDevicesFound = [];
      const outputs = access.outputs.values();
      for (let output = outputs.next(); output && !output.done; output = outputs.next()) {
        outputDevicesFound.push(output.value);
      }
      setAvailableOutputs(outputDevicesFound);

      const inputDevicesFound = [];
      const inputs = access.inputs.values();
      for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
        inputDevicesFound.push(input.value);
      }
      setAvailableInputs(inputDevicesFound);

      setDetectionComplete(true);
    };

    if (!navigator.requestMIDIAccess) {
      setMidiSupport(MidiSupport.No);
      return;
    } else {
      setMidiSupport(MidiSupport.Yes);
    }

    navigator.requestMIDIAccess({ sysex: true }).then(access => {
      access.onstatechange = e => {
        detectDevices(access);
      }
      detectDevices(access);
    });
  }, []);

  if (midiSupport === MidiSupport.Unknown) {
    return <p>Detecting MIDI support...</p>;
  } else if (midiSupport === MidiSupport.No) {
    return <NotSupported />;
  }

  if (!detectionComplete) {
    return <div>Detecting MIDI devices...</div>;
  }

  return (
    <div>
      <p>Available devices:</p>
      <ul>
        {availableInputs.map(device => (
          <li key={device.id}>
            IN {device.name}
            {input && device.id === input.id
              ? ' (selected)'
              : <button onClick={() => selectInput(device.id)}>select</button>
            }
          </li>
        ))}
        {availableOutputs.map(device => (
          <li key={device.id}>
            OUT {device.name}
            {output && device.id === output.id
              ? ' (selected)'
              : <button onClick={() => selectOutput(device.id)}>select</button>
            }
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MIDIDeviceSetup;
