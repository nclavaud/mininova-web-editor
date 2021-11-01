import React from 'react';
import Control from '../Control';
import {controls} from '../../mininova.js';

function Chorus2({id,emit}) {
    const params = [ 'chorus-2-type', 'chorus-2-rate', 'chorus-2-rate-sync', 'chorus-2-feedback', 'chrous-2-mod-depth', 'chorus-2-delay' ]
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

export default Chorus2;
