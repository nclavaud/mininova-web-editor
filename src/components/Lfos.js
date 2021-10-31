import React from 'react';
import Lfo from './Lfo';
import Control from './Control';
import { controls } from '../mininova';

function Lfos({ emit }) {
  return (
    <div>
      <div className="lfos">
        {[1, 2, 3].map(i => (
          <Lfo
            key={i}
            emit={emit}
            number={i}
          />
        ))}
      </div>
    </div>
  );
}

export default Lfos;
