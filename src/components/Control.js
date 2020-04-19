import React from 'react';
import InputEnum from './InputEnum';
import InputRange from './InputRange';

function Control(props) {
  const { control } = props;

  if (control.hasOwnProperty('enum')) {
    return <InputEnum {...props} />;
  }

  return <InputRange {...props} />;
}

export default Control;
