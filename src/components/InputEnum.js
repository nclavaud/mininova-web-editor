import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

function InputEnum({ id, control, emit }) {
  const dispatch = useDispatch();
  const value = useSelector(state => state[id]);

  const onChange = event => {
    const value = Number(event.target.value);

    if (!Array.from(control.enum.keys()).includes(value)) {
      console.log('Wrong value: ' + value);
      return;
    }

    dispatch({
      type: 'CONTROL_CHANGED',
      payload: {
        id,
        value,
      },
    });

    emit(control.msg(value));
  };

  return (
    <div className="control">
      <label htmlFor={control.id} className="control-label">{control.label}</label>
      <select onChange={onChange} value={value} className="control-input">
        {control.enum.map((label, value) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
  );
}

export default InputEnum;
