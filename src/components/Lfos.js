import React from 'react';
import Lfo from './Lfo';

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
