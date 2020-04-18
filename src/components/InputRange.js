import React from 'react';

function InputRange({ id, label, range, onChange }) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="number"
        min={range[0]}
        max={range[1]}
        onChange={onChange}
      />
    </div>
  );
}

export default InputRange;
