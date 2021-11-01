import React from 'react';
import Control from '../Control';
import {controls} from '../../mininova.js';

function Delay1({id,emit}) {
    const params = [ 'delay-1-time', 'delay-1-sync', 'delay-1-feedback', 'delay-1-width', 'delay-1-lr-ratio', 'delay-1-slew-rate'] 
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

export default Delay1;
