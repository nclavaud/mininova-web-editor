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
 
  const vocoder = [
'vocoder-level',
'vocoder-carier-level',
'vocoder-modulator-level',
'vocoder-resonance',
'vocoder-decay',
'vocoder-gate-threshold',
'vocoder-gate-release',
'vocoder-spectrum-level-1',
'vocoder-spectrum-level-2',
'vocoder-spectrum-level-3',
'vocoder-spectrum-level-4',
'vocoder-spectrum-level-5',
'vocoder-spectrum-level-6',
'vocoder-spectrum-level-7',
'vocoder-spectrum-level-8',
'vocoder-spectrum-level-9',
'vocoder-spectrum-level-10',
'vocoder-spectrum-level-11',
'vocoder-spectrum-level-12',
'vocoder-spectrum-level-13',
'vocoder-spectrum-level-14',
'vocoder-spectrum-level-15',
'vocoder-spectrum-level-16',
'vocoder-spectrum-level-17',
'vocoder-spectrum-level-18',
'vocoder-spectrum-level-19',
'vocoder-spectrum-level-20',
'vocoder-spectrum-level-21',
'vocoder-spectrum-level-22',
'vocoder-spectrum-level-23',
'vocoder-spectrum-level-24',
'vocoder-spectrum-level-25',
'vocoder-spectrum-level-26',
'vocoder-spectrum-level-27',
'vocoder-spectrum-level-28',
'vocoder-spectrum-level-29',
'vocoder-spectrum-level-30',
'vocoder-spectrum-level-31',
'vocoder-spectrum-level-32',
'vocoder-spectrum-resample',
  ];

  const chorder = [    
'chorder-transpose',
'chorder-on',
'chorder-count',
'chorder-key-2',
'chorder-key-3',
'chorder-key-4',
'chorder-key-5',
'chorder-key-6',
'chorder-key-7',
'chorder-key-8',
'chorder-key-9',
'chorder-key-10',
  ];

  const vocaltune = [
'vocal-tune-shift',
'vocal-tune-bend',
'vocal-tune-mode',
'vocal-tune-insert',
'vocal-tune-scale-type',
'vocal-tune-scale-key',
'vocal-tune-correction-time',
'vocal-tune-level',
'vocal-tune-vibrato',
'vocal-tune-vibrato-mod-wheel',
'vocal-tune-vibrato-rate',
  ];

  return (
    <div>
    <div className="rows">
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
      <div>
        <h4>Vocoder</h4>
        {vocoder.map(id => (
          <Control
            key={id}
            id={id}
            control={controls[id]}
            emit={emit}
          />
        ))}
      </div>
      <div>
        <h4>Chorder</h4>
        {chorder.map(id => (
          <Control
            key={id}
            id={id}
            control={controls[id]}
            emit={emit}
          />
        ))}
      </div>
      <div>
        <h4>Vocal Tune</h4>
        {vocaltune.map(id => (
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
