import React from 'react';
import Control from '../Control';
import {controls} from '../../mininova.js';

function EQ({id,emit}) {
    const params = ['eq-bass-frequency', 'eq-bass-level', 'eq-mid-frequency', 'eq-mid-level', 'eq-treble-frequency', 'eq-treble-level'] 
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

export default EQ;
