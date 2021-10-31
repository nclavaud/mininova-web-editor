import React from 'react';
import Control from './Control';
import { controls } from '../mininova';

function Row({emit, number, param}) {
    const exists = controls[`env-${number}-${param}`]
    if (exists) {
    return (
        <Control
          key={param}
          id={`env-${number}-${param}`}
          control={controls[`env-${number}-${param}`]}
          emit={emit}
        /> 
    );
    } else {
        return null;
    }
}

function Envelope({ emit, number }) {
  const params = [
        'delay',
        'attack',
        'decay',
        'sustain',
        'release',
        'trigger',
        'velocity',
        'sustain-rate',
        'sustain-time',
        'ad-repeats',
        'attack-track',
        'decay-track',
        'level-track',
        'attack-slope',
        'decay-slope',
        'anim-trigger',
  ];

  return (
    <div className="envelope">
      <h4>Envelope {number}</h4>
      {params.map(param => (
          <Row key={param} emit={emit} number={number} param={param}/>
      ))}
    </div>
  );
};

export default Envelope;
