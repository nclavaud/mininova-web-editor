import { CommandType, getCommand } from './midi.command';

test('it builds a complete NRPN command', () => {
  const message = new Uint8Array([0xB0, 0x06, 0x03]);

  const previous = {
    type: CommandType.IncompleteNRPN,
    values: [0x01, 0x02],
  };

  const command = getCommand(message, previous);

  expect(command.type).toEqual(CommandType.NRPN);
});

