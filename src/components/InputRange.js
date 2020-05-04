import React, { useState } from 'react';

const inRange = (value, range) => (value >= range[0] && value <= range[1]);

function InputRange({ id, control, emit }) {
  const [value, setValue] = useState(control.init);

  const onChange = event => {
    const value = Number(event.target.value);

    if (!inRange(value, control.range)) {
      return;
    }

    setValue(value);

    emit(control.msg(value));
  };

  return (
    <div className="control">
      <label htmlFor={id} className="control-label">{control.label}</label>
      <input
        id={id}
        className="control-input"
        type="number"
        min={control.range[0]}
        max={control.range[1]}
        onChange={onChange}
        value={value}
      />
    </div>
  );
}

export default InputRange;
