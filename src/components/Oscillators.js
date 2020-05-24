import React from 'react';
import Oscillator from './Oscillator';
import Control from './Control';
import { controls } from '../mininova';

function Oscillators({ emit }) {
  return (
    <div>
      <div className="oscillators">
        {[1, 2, 3].map(i => (
          <Oscillator
            key={i}
            emit={emit}
            number={i}
          />
        ))}
      </div>
      <div>
        <h4>Common Oscillator parameters</h4>
        {['osc-vibrato-depth', 'osc-vibrato-speed', 'osc-drift', 'osc-phase', 'osc-fixed-note'].map(id => (
          <Control
            key={id}
            id={id}
            control={controls[id]}
            emit={emit}
          />
        ))}
      </div>
      <div>
        <h4>Mixer</h4>
        {['osc-1-level', 'osc-2-level', 'ring-mod-level-1-3', 'ring-mod-level-2-3', 'noise-level', 'noise-type'].map(id => (
          <Control
            key={id}
            id={id}
            control={controls[id]}
            emit={emit}
          />
        ))}
      </div>
    </div>
  );
}

export default Oscillators;
