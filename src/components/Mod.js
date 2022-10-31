import React from 'react';
import Control from './Control';
import { controls } from '../mininova';

function Mod({ emit, number }) {
  const params = [
    'src-1',
    'src-2',
    'anim',
    'depth',
    'dest',
  ]

  return (
    <div className="mod">
      <h4>Mod {number}</h4>
      {params.map(param => (
        <Control
          key={param}
          id={`mod-${number}-${param}`}
          control={controls[`mod-${number}-${param}`]}
          emit={emit}
        />
      ))}
    </div>
  );

  
}
export default Mod;
