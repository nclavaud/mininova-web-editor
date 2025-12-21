import { CommandType } from './midi.command';
import { findControl, isPatch } from './mininova';

test('it detects a patch', () => {
  const message = new Uint8Array([
    0xF0, 0x00, 0x20, 0x29, 0x03, 0x01, 0x7F, 0x00, 0x00, 0x09, 0x04,
    0x00, 0x00, 0x00, 0x2A
  ]);

  expect(isPatch(message)).toBe(true);
});

test('it can decode a simple control change', () => {
  const osc1SetToMaximumLevel = {
    type: CommandType.ControlChange,
    values: [51, 127],
  };

  const control = findControl(osc1SetToMaximumLevel);

  expect(control.id).toEqual('osc-1-level');
  expect(control.value).toEqual(127);
});

test('it can decode a control change with linear mapping', () => {
  const preFXLevelSetTo18dB = {
    type: CommandType.ControlChange,
    values: [58, 82],
  };

  const control = findControl(preFXLevelSetTo18dB);

  expect(control.id).toEqual('pre-fx-level');
  expect(control.value).toEqual(18);
});

test('it can decode a NRPN message', () => {
  const tempoSetAt40 = {
    type: CommandType.NRPN,
    values: [2, 63, 0, 40],
  };

  const control = findControl(tempoSetAt40);

  expect(control.id).toEqual('tempo');
  expect(control.value).toEqual(40);
});

test('it can decode a message that maps to different NRPN values', () => {
  const tempoSetAt250 = {
    type: CommandType.NRPN,
    values: [2, 63, 1, 122],
  };

  const control = findControl(tempoSetAt250);

  expect(control.id).toEqual('tempo');
  expect(control.value).toEqual(250);
});

test('it will not return a control when value is out of range', () => {
  const invalidTempo = {
    type: CommandType.NRPN,
    values: [2, 63, 0, 0],
  };

  const control = findControl(invalidTempo);

  expect(control).toBe(undefined);
});
