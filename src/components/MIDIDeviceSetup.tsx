import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MidiMessage } from '../ports';
import { findDeviceById, listPorts, requestAccess } from '../webmidi';
import { midiDevicesDetected } from '../redux/midi';

type MIDIDeviceSetupProps = {
  onChangeOutput: () => {},
  onIncomingMidiMessage: (message: MidiMessage) => void,
  input: WebMidi.MIDIInput,
  output: WebMidi.MIDIOutput,
};

interface RootState {
  midi: {
    isSupported: boolean,
    detectionComplete: boolean,
    inputs: WebMidi.MIDIInput[],
    outputs: WebMidi.MIDIOutput[],
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
    const device = findDeviceById<WebMidi.MIDIOutput>(id, availableOutputs);
    dispatch({
      type: 'DEVICE_SELECT_OUTPUT',
      payload: {
        device,
      },
    });
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
    dispatch({
      type: 'DEVICE_SELECT_INPUT',
      payload: {
        device,
      },
    });
  };

  useEffect(() => {
    if (!isSupported) {
      return;
    }

    const registerAvailablePorts = (access: WebMidi.MIDIAccess) => {
      const [inputs, outputs] = listPorts(access);
      dispatch(midiDevicesDetected(inputs, outputs));
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
