const CC = 0xB0;
const NRPN_MSB = 0x63;
const NRPN_LSB = 0x62;
const NRPN_VAL = 0x06;
const SYSEX_START = 0xF0;
const SYSEX_END = 0xF7;
export const PROGRAM_CHANGE = 0xC0;

export const cc = (control, value) => new Uint8Array([
  CC, control, value,
]);

export const nrpn = (msb, lsb, value) => new Uint8Array([
  CC, NRPN_MSB, msb,
  CC, NRPN_LSB, lsb,
  CC, NRPN_VAL, value,
]);

const isValidSysexValue = value => value >= 0x00 && value <= 0x7F;

export const sysex = values => {
  if (!values.every(isValidSysexValue)) {
    throw new RangeError("Sequence contains invalid sysex value");
  }

  return new Uint8Array(
    [SYSEX_START]
      .concat(values)
      .concat([SYSEX_END])
  );
};
