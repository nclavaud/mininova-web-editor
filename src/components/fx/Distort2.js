import React from 'react';
import Control from '../Control';
import {controls} from '../../mininova.js';

function Distort2({id,emit}) {
    const params = [ 'distort-2-type', 'distort-2-compensation',  'distort-2-level'];
    return (
        <div>
        {params.map(param => (
          <Control
            key={param}
            id={param}
            control={controls[param]}
            emit={emit}/>
        ))}
        </div>
    );
}

export default Distort2;
