import React from 'react';
import Control from './Control';
import { controls } from '../mininova';

function Tweaks({ emit }) {
    return (
        <div className="tweaks">
        <div>
        <h4>Tweaks</h4>
        {['tweak-1', 'tweak-2', 'tweak-3', 'tweak-4', 'tweak-5', 'tweak-6', 'tweak-7', 'tweak-8'].map(i=>(
            <Control
                key={i}
                id={i}
                control={controls[i]}
                emit={emit}
            />
        ))}
        </div>
        </div>
    );
}

export default Tweaks;

