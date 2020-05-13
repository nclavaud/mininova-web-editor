import { CC, NRPN_MSB, NRPN_LSB, NRPN_VAL, NRPN_ADJ } from './midi';

export const isNRPNStart = message => message[0] === CC && message[1] === NRPN_MSB;

export const isNRPNMiddle = (message, nrpn) => {
  if (message[0] !== CC) {
    return false;
  }

  if (nrpn.length === 1 && message[1] === NRPN_LSB) {
    return true;
  }

  if (nrpn.length === 2 && message[1] === NRPN_VAL) {
    return true;
  }

  return false;
}

export const isNRPNEnd = (message, nrpn) => {
  if (message[0] !== CC) {
    return false;
  }

  if (nrpn.length === 3 && message[1] === NRPN_ADJ) {
    return true;
  }

  if (nrpn.length === 2 && message[1] === NRPN_VAL) {
    return !isChangePatch(nrpn)
      && !isChangeTempo(nrpn);
  }

  return false;
}

const isChangePatch = nrpn => nrpn[0] === 63 && nrpn[1] === 1;
const isChangeTempo = nrpn => nrpn[0] === 2 && nrpn[1] === 63;
