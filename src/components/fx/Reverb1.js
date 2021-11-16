import React from 'react';
import Control from '../Control';
import {controls} from '../../mininova.js';

function Reverb1({id,emit}) {
    const params = [ 'reverb-1-type', 'reverb-1-decay', 'reverb-1-damping' ];
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

export default Reverb1;
