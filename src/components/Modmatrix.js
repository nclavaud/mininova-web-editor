import React from 'react';
import Mod from './Mod';

function ModMatrix({ emit }) {
  return (
    <>
      <h3>Mod Matrix</h3>
      <div className="rows">
        {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map(i=>(
            <Mod emit={emit} key={i} number={i}/>
        ))}
      </div>
    </>
  );
}

export default ModMatrix;
