import { CommandType } from './midi.command';
import { findControl, isPatch } from './mininova';

test('it detects a patch', () => {
  const message = new Uint8Array([
    0xF0, 0x00, 0x20, 0x29, 0x03, 0x01, 0x7F, 0x00, 0x00, 0x09, 0x04,
    0x00, 0x00, 0x00, 0x2A
  ]);

  expect(isPatch(message)).toBe(true);
});

test('it finds a control given a command', () => {
  const tempoSetAt40 = {
    type: CommandType.NRPN,
    values: [2, 63, 0, 40],
  };

  const control = findControl(tempoSetAt40);

  expect(control.id).toEqual('tempo');
});

test('it finds a control that maps to different NRPN values', () => {
  const tempoSetAt250 = {
    type: CommandType.NRPN,
    values: [2, 63, 1, 122],
  };

  const control = findControl(tempoSetAt250);

  expect(control.id).toEqual('tempo');
});

test('it finds a control given a command', () => {
  const invalidTempo = {
    type: CommandType.NRPN,
    values: [2, 63, 0, 0],
  };

  const control = findControl(invalidTempo);

  expect(control).toBe(undefined);
});
