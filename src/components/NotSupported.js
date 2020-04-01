import React from 'react';

function NotSupported() {
  return (
    <div>
      <p>It looks like your browser does not support MIDI.</p>
      <p>MIDI access is an experimental technology. Check the list of compatible browsers in the <a href="https://developer.mozilla.org/en-US/docs/Web/API/MIDIAccess#Browser_compatibility">Browser compatibility table </a>.</p>
    </div>
  );
}

export default NotSupported;
