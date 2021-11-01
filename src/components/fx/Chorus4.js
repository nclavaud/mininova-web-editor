import React from 'react';
import Control from '../Control';
import {controls} from '../../mininova.js';

function Chorus4({id,emit}) {
    const params = [ 'chorus-4-type', 'chorus-4-rate', 'chorus-4-rate-sync', 'chorus-4-feedback', 'chrous-4-mod-depth', 'chorus-4-delay' ]
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

export default Chorus4;
