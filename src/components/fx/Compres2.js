import React from 'react';
import Control from '../Control';
import {controls} from '../../mininova.js';

function Compres2({id,emit}) {
    const params=[    
    'compres-2-ratio',
    'compres-2-treshold',
    'compres-2-attack',
    'compres-2-release',
    'compres-2-hold',
    'compres-2-gain'
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

export default Compres2;
