import React from 'react';
import Control from '../Control';
import {controls} from '../../mininova.js';

function Chorus3({id,emit}) {
    const params = [ 'chorus-3-type', 'chorus-3-rate', 'chorus-3-rate-sync', 'chorus-3-feedback', 'chrous-3-mod-depth', 'chorus-3-delay' ]
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

export default Chorus3;
