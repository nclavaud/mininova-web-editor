import React from 'react';
import Control from './Control';
import { controls } from '../mininova';

function Oscillator({ emit, number }) {
  const params = [
    'wave',
    'semitones',
    'cents',
    'vsync',
    'pwwti',
    'hardness',
    'density',
    'densitydetune',
    'pitch',
    'wtint',
  ];

  return (
    <div>
      <h4>Oscillator {number}</h4>
      {params.map(param => (
        <Control
          key={param}
          id={param}
          control={controls[`osc-${number}-${param}`]}
          emit={emit}
        />
      ))}
    </div>
  );
};

export default Oscillator;
