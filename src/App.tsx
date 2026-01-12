import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  const [debug, setDebug] = useState<boolean>(false);
  const previousCommandRef = useRef<Command>({ type: CommandType.None, values: [] });
  const dispatch = useDispatch();

  const onIncomingMidiMessage = useCallback((message: MidiMessage) => {
    const decodePatch = (data: Uint8Array) => {
      if (debug) {
        console.log('Received patch.');
      }
      dispatch(patchDumpReceived(data));
    };

    if (debug) {
      debugMidiMessage(message, 'Input: ');
    }

    const command = getCommand(message, previousCommandRef.current);
    previousCommandRef.current = command;

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
  }, [debug, dispatch]);

  const emit = (message: Uint8Array) => {
    if (debug) {
      debugMidiMessage(message, 'Output: ');
    }
    if (!output) {
      return;
    }
    output.send(message);
  };

  const onChangeOutput = () => selectPatch(emit);

  const memoizedEmit = useCallback(emit, [output, debug]);

  // Update the MIDI input listener when debug state changes
  useEffect(() => {
    if (input) {
      input.setIncomingMidiMessageListener(onIncomingMidiMessage);
    }
  }, [input, debug, onIncomingMidiMessage]);

  useEffect(() => {
    memoizedEmit(loadPatch);
  }, [currentPatch, memoizedEmit]);

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
      <div className="debug">
        <label>
          <input type="checkbox" checked={debug} onChange={() => setDebug(!debug)} />
          Debug {debug ? 'on' : 'off'}
        </label>
      </div>
      <Controls
        currentPatch={currentPatch}
        emit={emit}
      />
      <p><a href="https://github.com/nclavaud/mininova-web-editor/">Contribute on GitHub</a></p>
      <p>Last update: {process.env.REACT_APP_BUILD_DATE}</p>
    </div>
  );
}

export default App;
