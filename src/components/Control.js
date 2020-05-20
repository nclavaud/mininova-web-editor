import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { patchControlChanged } from '../redux/patch';
import InputEnum from './InputEnum';
import InputRange from './InputRange';

function Control(props) {
  const { control, emit, id } = props;

  const value = useSelector(state => state.patch[id]);
  const dispatch = useDispatch();

  const onChange = value => {
    dispatch(patchControlChanged(id, value));
    emit(control.msg(value));
  };

  const Component = control.hasOwnProperty('enum') ? InputEnum : InputRange;

  return (
    <Component
      {...props}
      id={id}
      onChange={onChange}
      value={value}
    />
  );
}

export default Control;
