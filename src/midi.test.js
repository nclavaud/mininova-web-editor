import { cc, nrpn, ungroup, sysex } from './midi';

test('build a CC message', () => {
  const expected = new Uint8Array([0xB0, 13, 0]);
  const sequence = cc(13, 0);

  expect(sequence).toEqual(expected);
});

test('build a NRPN sequence', () => {
  const expected = new Uint8Array([0xB0, 0x63, 0, 0xB0, 0x62, 122, 0xB0, 0x06, 47]);
  const sequence = nrpn(0, 122, 47);

  expect(sequence).toEqual(expected);
});

test('build a NRPN sequence with an adjustment value', () => {
  const expected = new Uint8Array([0xB0, 0x63, 0, 0xB0, 0x62, 122, 0xB0, 0x06, 47, 0xB0, 0x26, 0x01]);
  const sequence = nrpn(0, 122, 47, 1);

  expect(sequence).toEqual(expected);
});

test('build a sysex sequence', () => {
  const expected = new Uint8Array([0xF0, 0x7F, 0x40, 0x00, 0x00, 0x00, 0x00, 0x00, 0xF7]);
  const sequence = sysex([0x7F, 0x40, 0x00, 0x00, 0x00, 0x00, 0x00]);

  expect(sequence).toEqual(expected);
});

test('throw an invalid sysex value', () => {
  const buildSequence = () => sysex([0x7F, 0x40, 0xF8]);

  expect(buildSequence).toThrow(new RangeError('Sequence contains invalid sysex value'));
});

test('ungroup inlined messages', () => {
  const raw = new Uint8Array([
    0xB0, 0x20, 0x01,
    0xC0, 0x01,
    0xB0, 0x63, 0x3F,
    0xB0, 0x62, 0x01,
    0xB0, 0x06, 0x01,
    0xB0, 0x26, 0x01,
  ]);

  const expected = [
    new Uint8Array([0xB0, 0x20, 0x01]),
    new Uint8Array([0xC0, 0x01]),
    new Uint8Array([0xB0, 0x63, 0x3F]),
    new Uint8Array([0xB0, 0x62, 0x01]),
    new Uint8Array([0xB0, 0x06, 0x01]),
    new Uint8Array([0xB0, 0x26, 0x01]),
  ];

  expect(ungroup(raw)).toEqual(expected);
});
