import React, { useState } from 'react';

function InputEnum({ id, control, emit }) {
  const [value, setValue] = useState(control.init);

  const onChange = event => {
    const value = Number(event.target.value);

    if (!Array.from(control.enum.keys()).includes(value)) {
      return;
    }

    setValue(value);

    emit(control.msg(value));
  };

  return (
    <div>
      <label htmlFor={control.id}>{control.label}</label>
      <select onChange={onChange} value={value}>
        {control.enum.map((label, value) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
  );
}

export default InputEnum;
