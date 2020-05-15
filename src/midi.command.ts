import { PROGRAM_CHANGE, SYSEX_START, SYSEX_END } from './midi';
import { MidiMessage } from './ports';
import { isNRPNStart, isNRPNMiddle, isNRPNEnd } from './mininova.nrpn';

export enum CommandType {
  ControlChange,
  ProgramChange,
  NRPN,
  IncompleteNRPN,
  SysEx,
  Unsupported,
  None,
}

export interface Command {
  type: CommandType,
  values: number[],
}

export const getCommand = (message: MidiMessage, previous: Command): Command => {
  if (message[0] === PROGRAM_CHANGE) {
    return {
      type: CommandType.ProgramChange,
      values: [message[1]],
    };
  }

  if (isNRPNEnd(message, previous.values)) {
    return {
      type: CommandType.NRPN,
      values: previous.values.concat(message[2]),
    };
  }

  if (isNRPNMiddle(message, previous.values)) {
    return {
      type: CommandType.IncompleteNRPN,
      values: previous.values.concat(message[2]),
    }
  }

  if (isNRPNStart(message)) {
    return {
      type: CommandType.IncompleteNRPN,
      values: [message[2]],
    };
  }

  if (message[0] === SYSEX_START && message[message.length - 1] === SYSEX_END) {
    return {
      type: CommandType.SysEx,
      values: Array.from(message),
    };
  }

  return {
    type: CommandType.Unsupported,
    values: Array.from(message),
  }
};

