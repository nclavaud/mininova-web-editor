import React from 'react';
import Control from '../Control';
import {controls} from '../../mininova.js';

function Delay2({id,emit}) {
    const params = [ 'delay-2-time', 'delay-2-sync', 'delay-2-feedback', 'delay-2-width', 'delay-2-lr-ratio', 'delay-2-slew-rate'] 
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

export default Delay2;
