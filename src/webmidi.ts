export const requestAccess = () => navigator.requestMIDIAccess({ sysex: true });

export const listPorts = (access: MIDIAccess) => {
  const outputDevicesFound = [];
  const outputs = access.outputs.values();
  for (let output = outputs.next(); output && !output.done; output = outputs.next()) {
    outputDevicesFound.push(output.value);
  }

  const inputDevicesFound = [];
  const inputs = access.inputs.values();
  for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
    inputDevicesFound.push(input.value);
  }

  return [inputDevicesFound, outputDevicesFound];
};

export function findDeviceById<T extends MIDIPort>(id: string, devices: Array<T>): T | null {
  return devices.filter(device => device.id === id)[0] || null;
};
