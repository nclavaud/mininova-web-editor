import React from 'react';
import Control from '../Control';
import {controls} from '../../mininova.js';

function Chorus1({id,emit}) {
    const params = [ 'chorus-1-type', 'chorus-1-rate', 'chorus-1-rate-sync', 'chorus-1-feedback', 'chrous-1-mod-depth', 'chorus-1-delay' ]
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

export default Chorus1;
