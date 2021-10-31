import React from 'react';
import Control from './Control';
import { controls } from '../mininova';

function Filter({ emit, number }) {
  const params = [
    'drive',
    'drive-type', 
    'type',
    'track', 
    'resonance', 
    'frequency',
    'qnormalize', 
    'env2-to-freq'
  ];

  return (
    <div className="filter">
      <h4>Filter {number}</h4>
      {params.map(param => (
        <Control
          key={param}
          id={`filter-${number}-${param}`}
          control={controls[`filter-${number}-${param}`]}
          emit={emit}
        />
      ))}
    </div>
  );
};

export default Filter;
