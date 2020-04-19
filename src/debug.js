export const debugMidiMessage = (message, prefix) => {
  const bytes = message.map(d => d).join(' ');
  console.log(`${prefix}${bytes}`);
};

export const consoleOutput = new class {
  send(message) {
    debugMidiMessage(message, 'Output: ');
  }
}();
