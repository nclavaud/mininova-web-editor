import React from 'react';
import InputRange from './InputRange';

const inRange = (value, range) => (value >= range[0] && value <= range[1]);

function Control({ id, control, emit }) {
  if (control.type === 'enum') {
    const onChange = event => {
      const value = Number(event.target.value);

      if (!control.enum.includes(value)) {
        return;
      }

      emit(control.msg(value));
    };

    return (
      <select onChange={onChange}>
        {control.enum.map((label, value) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    );
  }

  const onChange = event => {
    const value = Number(event.target.value);

    if (!inRange(value, control.range)) {
      return;
    }

    emit(control.msg(value));
  };

  return (
    <InputRange
      id={id}
      label={control.label}
      range={control.range}
      onChange={onChange}
    />
  );
}

export default Control;
