import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { patchControlChanged } from '../redux/patch';

const inRange = (value, range) => (value >= range[0] && value <= range[1]);

function InputRange({ id, control, emit, readonly }) {
  const dispatch = useDispatch();
  const value = useSelector(state => state.patch[id]);

  const onChange = event => {
    const value = Number(event.target.value);

    if (!inRange(value, control.range)) {
      return;
    }

    dispatch(patchControlChanged(id, value));
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
        readOnly={readonly}
      />
    </div>
  );
}

export default InputRange;
