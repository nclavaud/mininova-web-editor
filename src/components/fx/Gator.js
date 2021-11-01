import React from 'react';
import Control from '../Control';
import {controls} from '../../mininova.js';

function Gator({id,emit}) {
    const params = [
        'gator-on',
        'gator-key-sync',
        'gator-key-latch',
        'gator-rate-sync',
        'gator-mode',
        'gator-edge-slew',
        'gator-hold',
        'gator-lr-delay',
        'gator-level-1',
        'gator-level-2',
        'gator-level-3',
        'gator-level-4',
        'gator-level-5',
        'gator-level-6',
        'gator-level-7',
        'gator-level-8',
        'gator-level-9',
        'gator-level-10',
        'gator-level-11',
        'gator-level-12',
        'gator-level-13',
        'gator-level-14',
        'gator-level-15',
        'gator-level-16',
        'gator-level-17',
        'gator-level-18',
        'gator-level-19',
        'gator-level-20',
        'gator-level-21',
        'gator-level-22',
        'gator-level-23',
        'gator-level-24',
        'gator-level-25',
        'gator-level-26',
        'gator-level-27',
        'gator-level-28',
        'gator-level-29',
        'gator-level-30',
        'gator-level-31',
        'gator-level-32'
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

export default Gator;
