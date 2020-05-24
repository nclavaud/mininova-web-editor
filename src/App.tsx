import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Controls, DeviceSetup, Intro } from './components';
import { Command, CommandType, getCommand } from './midi.command';
import { findControl, isPatch, loadPatch, selectPatch } from './mininova';
import { debugMidiMessage } from './debug';
import { DeviceInput, DeviceOutput, MidiMessage } from './ports';
import { patchControlChanged, patchDumpReceived } from './redux/patch';

interface RootState {
  device: {
    input: DeviceInput,
    output: DeviceOutput,
  }
}

function App() {
  const input = useSelector((state: RootState) => state.device.input);
  const output = useSelector((state: RootState) => state.device.output);
  const [currentPatch, setCurrentPatch] = useState<number | undefined>(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    emit(loadPatch);
  }, [currentPatch]);

  const decodePatch = (data: Uint8Array) => {
    console.log('Received patch.');
    dispatch(patchDumpReceived(data));
  }

  let command: Command = {
    type: CommandType.None,
    values: [],
  };

  const onIncomingMidiMessage = (message: MidiMessage) => {
    debugMidiMessage(message, 'Input: ');
    command = getCommand(message, command);
    switch (command.type) {
      case CommandType.ProgramChange:
        setCurrentPatch(command.values[0]);
        break;
      case CommandType.NRPN:
      case CommandType.ControlChange:
        const control = findControl(command);
        if (control) {
          dispatch(patchControlChanged(control.id, control.value));
        }
        break;
      case CommandType.SysEx:
        if (isPatch(message)) {
          decodePatch(message);
        }
        break;
    }
  };

  const emit = (message: Uint8Array) => {
    if (!output) {
      return;
    }
    debugMidiMessage(message, 'Output: ');
    output.send(message);
  };

  const onChangeOutput = () => selectPatch(emit);

  return (
    <div>
      <Intro />
      <h3>Setup</h3>
      <DeviceSetup
        onChangeOutput={onChangeOutput}
        onIncomingMidiMessage={onIncomingMidiMessage}
        input={input}
        output={output}
      />
      <Controls
        currentPatch={currentPatch}
        emit={emit}
      />
      <p><a href="https://github.com/nclavaud/mininova-web-editor/">Contribute on GitHub</a></p>
    </div>
  );
}

export default App;
