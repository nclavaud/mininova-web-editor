import React from 'react';
import { useSelector } from 'react-redux';
import { controls } from '../../mininova';
import Bypass from './Bypass';
import EQ from './EQ';
import Compres1 from './Compres1';
import Compres2 from './Compres2';
import Distort1 from './Distort1';
import Distort2 from './Distort2';
import Delay1 from './Delay1';
import Delay2 from './Delay2';
import Reverb1 from './Reverb1';
import Reverb2 from './Reverb2';
import Chorus1 from './Chorus1';
import Chorus2 from './Chorus2';
import Chorus3 from './Chorus3';
import Chorus4 from './Chorus4';
import Gator from './Gator';
function Effect({emit, id, slot, control}) {
    const value = useSelector(state => state.patch[`fx-${slot}-select`]);
    
    let Component = Bypass;
    switch(controls[`fx-${slot}-select`].enum[value]) {
        case 'EQ':
            Component = EQ;
            break;
        case 'Compres1':
            Component = Compres1;
            break;
        case 'Compres2':
            Component = Compres2;
            break;
        case 'Distort1':
            Component = Distort1;
            break;
        case 'Distort2':
            Component = Distort2;
            break;
        case 'Delay1': 
            Component = Delay1;
            break;
        case 'Delay2': 
            Component = Delay2;
            break;
        case 'Reverb1':
            Component = Reverb1;
            break;
        case 'Reverb2':
            Component = Reverb2;
            break;
        case 'Chorus1':
            Component = Chorus1;
            break;
        case 'Chorus2':
            Component = Chorus2;
            break;
        case 'Chorus3':
            Component = Chorus3;
            break;
        case 'Chorus4':
            Component = Chorus4;
            break;
        case 'Gator':
            Component = Gator;
            break;
        default:
    }

    return (
        <div>
          <h4 key={id} id={id}>FX {slot} {controls[`fx-${slot}-select`].enum[value]}</h4>
        <Component id={id} emit={emit}/>
        </div>
    );
}

export default Effect;
