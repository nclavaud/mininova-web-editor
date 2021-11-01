import React from 'react';
import Control from '../Control';
import {controls} from '../../mininova.js';

function Compres1({id,emit}) {
    const params=[    
    'compres-1-ratio',
    'compres-1-treshold',
    'compres-1-attack',
    'compres-1-release',
    'compres-1-hold',
    'compres-1-gain'
    ];

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

export default Compres1;
