import React from 'react';
import Filter from './Filter';
import Control from './Control';
import { controls } from '../mininova';

function Filters({ emit }) {
  return (
      <div>
      <div className="rows">
        {[1, 2].map(i => (
          <Filter
            key={i}
            emit={emit}
            number={i}
          />
        ))}
      <div>
        <h4>Common Filter parameters</h4>
        {['filter-routing', 'filter-balance','filter-freqlink','filter-reslink'].map(id => (
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

export default Filters;
