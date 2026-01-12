import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MidiMessage } from '../ports';
import { MidiInputWrapper, MidiOutputWrapper } from '../adapters/midi';
import { DeviceInput, DeviceOutput } from '../ports';
import { findDeviceById, listPorts, requestAccess } from '../webmidi';
import { midiDevicesDetected } from '../redux/midi';
import { deviceInputSelected, deviceOutputSelected } from '../redux/device';

type MIDIDeviceSetupProps = {
  onChangeOutput: () => {},
  onIncomingMidiMessage: (message: MidiMessage) => void,
  input: DeviceInput,
  output: DeviceOutput,
};

interface RootState {
  midi: {
    isSupported: boolean,
    detectionComplete: boolean,
    inputs: DeviceInput[],
    outputs: DeviceOutput[],
  },
};

function MIDIDeviceSetup({
  onChangeOutput,
  onIncomingMidiMessage,
  input,
  output,
}: MIDIDeviceSetupProps) {
  const dispatch = useDispatch();
  const isSupported = useSelector((state: RootState) => state.midi.isSupported);
  const detectionComplete = useSelector((state: RootState) => state.midi.detectionComplete);
  const availableInputs = useSelector((state: RootState) => state.midi.inputs);
  const availableOutputs = useSelector((state: RootState) => state.midi.outputs);

  const selectOutput = (id: string) => {
    const device = findDeviceById<DeviceOutput>(id, availableOutputs);
    if (device !== null) {
      dispatch(deviceOutputSelected(device));
    }
    onChangeOutput();
  };

  const selectInput = (id: string) => {
    const device = findDeviceById<DeviceInput>(id, availableInputs);
    if (device !== null) {
      device.setIncomingMidiMessageListener(onIncomingMidiMessage);
      dispatch(deviceInputSelected(device));
    }
  };

  useEffect(() => {
    if (!isSupported) {
      return;
    }

    const registerAvailablePorts = (access: MIDIAccess) => {
      const [inputs, outputs] = listPorts(access);
      // Wrap the MIDI devices to implement DeviceInput/DeviceOutput interfaces
      const wrappedInputs = inputs.map(input => new MidiInputWrapper(input));
      const wrappedOutputs = outputs.map(output => new MidiOutputWrapper(output));
      dispatch(midiDevicesDetected(wrappedInputs, wrappedOutputs));
    };

    const detectAvailablePorts = async () => {
      const access = await requestAccess();
      access.onstatechange = e => {
        registerAvailablePorts(access);
      }
      registerAvailablePorts(access);
    };

    detectAvailablePorts();
  }, [isSupported, dispatch]);

  if (!isSupported) {
    return (
      <div>
        <p>It looks like your browser does not support MIDI.</p>
        <p>MIDI access is an experimental technology. Check the list of compatible browsers in the <a href="https://developer.mozilla.org/en-US/docs/Web/API/MIDIAccess#Browser_compatibility">Browser compatibility table </a>.</p>
      </div>
    );
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
