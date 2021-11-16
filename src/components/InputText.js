import React from 'react';

function InputText({ id, control, onChange, readonly, value }) {
  const onInputChange = event => {
    const value = event.target.value;
    onChange(value);
  };

  return (
    <div className="control">
      <label htmlFor={id} className="control-label">{control.label}</label>
      <input
        id={id}
        className="control-input"
        onChange={onInputChange}
        value={value}
        readOnly={readonly}
      />
    </div>
  );
}

export default InputText;
