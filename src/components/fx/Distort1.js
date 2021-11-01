import React from 'react';
import Control from '../Control';
import {controls} from '../../mininova.js';

function Distort1({id,emit}) {
    const params = [ 'distort-1-type', 'distort-1-compensation',  'distort-1-level'];
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

export default Distort1;
