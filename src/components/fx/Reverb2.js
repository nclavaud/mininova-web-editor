import React from 'react';
import Control from '../Control';
import {controls} from '../../mininova.js';

function Reverb2({id,emit}) {
    const params = [ 'reverb-2-type', 'reverb-2-decay', 'reverb-2-damping' ];
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

export default Reverb2;
