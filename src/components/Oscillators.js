import React from 'react';
import Oscillator from './Oscillator';
import Control from './Control';
import { controls } from '../mininova';

function Oscillators({ emit }) {
  return (
    <div>
      <div className="rows">
        {[1, 2, 3].map(i => (
          <Oscillator
            key={i}
            emit={emit}
            number={i}
          />
        ))}
      </div>
      <div className="rows">
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
          {['osc-1-level', 'osc-2-level', 'osc-3-level', 'ring-mod-level-1-3', 'ring-mod-level-2-3', 'noise-level', 'noise-type', 'pre-fx-level', 'post-fx-level'].map(id => (
            <Control
              key={id}
              id={id}
              control={controls[id]}
              emit={emit}
            />
          ))}
        </div>
        <div>
          <h4>Pan</h4>
          {[ 'fx-pan-position','fx-pan-rate', 'fx-pan-sync', 'fx-pan-mod-depth'].map(id => (
            <Control
              key={id}
              id={id}
              control={controls[id]}
              emit={emit}
            />
          ))}
        </div>
        <div>
          <h4>FX</h4>
          {[ 'fx-routing', 'fx-feedback', 'fx-1-level', 'fx-2-level', 'fx-3-level', 'fx-4-level', 'fx-5-level', 'fx-1-select', 'fx-2-select', 'fx-3-select', 'fx-4-select', 'fx-5-select'].map(id => (
            <Control
              key={id}
              id={id}
              control={controls[id]}
              emit={emit}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Oscillators;
