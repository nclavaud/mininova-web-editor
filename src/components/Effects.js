import React from 'react';
import Effect from './fx/Effect.js';

function Effects({ emit }) {
  return (
      <div className="rows">
      {[1,2,3,4,5].map(i => (
          <Effect key={`fix-details-${i}`} slot={i} id={`fx-details-${i}`} emit={emit}/>
      ))}
      </div>
  );
}

export default Effects; 
