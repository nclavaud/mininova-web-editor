import React from 'react';
import Control from './Control';
import { controls } from '../mininova';

function Lfo({ emit, number }) {
  const params = [
    'waveform',
    'phase-offset',
    'slew-rate',
    'delay',
    'delay-sync',
    'rate',
    'rate-sync',
    'one-shot',
    'key-sync',
    'common-sync',
    'delay-trigger',
    'fade-mode',
  ];

  return (
    <div className="lfo">
      <h4>Lfo {number}</h4>
      {params.map(param => (
        <Control
          key={param}
          id={`lfo-${number}-${param}`}
          control={controls[`lfo-${number}-${param}`]}
          emit={emit}
        />
      ))}
    </div>
  );
};

export default Lfo;
