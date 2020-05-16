import React from 'react';
import Oscillator from './Oscillator';

function Oscillators({ emit }) {
  return (
    <div className="oscillators">
      {[1, 2, 3].map(i => (
        <Oscillator
          key={i}
          emit={emit}
          number={i}
        />
      ))}
    </div>
  );
}

export default Oscillators;
