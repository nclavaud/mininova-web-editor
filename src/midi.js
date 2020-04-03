const CC = 0xB0;
const NRPN_MSB = 0x63;
const NRPN_LSB = 0x62;
const NRPN_VAL = 0x06;

export const cc = (control, value) => [
  [CC, control, value]
];

export const nrpn = (msb, lsb, value) => [
  [CC, NRPN_MSB, msb],
  [CC, NRPN_LSB, lsb],
  [CC, NRPN_VAL, value],
];
