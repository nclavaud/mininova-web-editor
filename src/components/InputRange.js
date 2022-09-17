import React from 'react';

const inRange = (value, range) => (value >= range[0] && value <= range[1]);

function InputRange({ id, control, locked, onChange, onLockOff, onLockOn, readonly, value }) {
  const onInputChange = event => {
    const value = Number(event.target.value);

    if (!inRange(value, control.range)) {
      return;
    }

    onChange(value);
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
        onChange={onInputChange}
        value={value}
        readOnly={readonly}
      />
      <div
        className={`control-lock ${locked ? 'control-locked' : ''}`}
        onClick={locked ? onLockOff : onLockOn}
        title="Click to lock/unlock value (randomize)"
      >L</div>
    </div>
  );
}

export default InputRange;
