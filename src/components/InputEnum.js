import React from 'react';

function InputEnum({ id, control, onChange, value }) {
  const onSelectChange = event => {
    const value = Number(event.target.value);

    if (!Array.from(control.enum.keys()).includes(value)) {
      return;
    }

    onChange(value);
  };

  return (
    <div className="control">
      <label htmlFor={control.id} className="control-label">{control.label}</label>
      <select onChange={onSelectChange} value={value} className="control-input">
        {control.enum.map((label, value) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
  );
}

export default InputEnum;
