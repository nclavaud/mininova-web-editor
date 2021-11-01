import React from 'react';
import Control from './Control';
import { controls } from '../mininova';

function ArpVocoder({ emit }) {

  const arp = [
    'arp-on',
    'arp-key-latch',
    'arp-octaves',
    'arp-rate-sync',
    'arp-gate',
    'arp-mode',
    'arp-pattern',
    'arp-swing',
    'arp-length',
    'arp-step-1',
    'arp-step-2',
    'arp-step-3',
    'arp-step-4',
    'arp-step-5',
    'arp-step-6',
    'arp-step-7',
    'arp-step-8'
  ]

  return (
    <div>
    <div className="arp_vocoder">
      <div>
        <h4>Arp</h4>
        {arp.map(id => (
          <Control
            key={id}
            id={id}
            control={controls[id]}
            emit={emit}
          />
        ))}
      </div>
    </div>
    </div>
  );
}

export default ArpVocoder;
