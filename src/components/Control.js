import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { patchControlChanged, patchControlLockOff, patchControlLockOn } from '../redux/patch';
import { CommandType } from '../midi.command';
import InputEnum from './InputEnum';
import InputRange from './InputRange';
import InputText from './InputText';

function Control(props) {
  const { control, emit, id } = props;

  const value = useSelector(state => state.patch[id]);
  const locked = useSelector(state => state.patch.locks.includes(id));
  const dispatch = useDispatch();

  const onChange = value => {
    dispatch(patchControlChanged(id, value));
    const ofs = control.hasOwnProperty("offset") ? control.offset : 0;
    emit(control.msg(value - ofs));
  };

  const onLockOff = () => {
    dispatch(patchControlLockOff(id));
  };

  const onLockOn = () => {
    dispatch(patchControlLockOn(id));
  };

  let Component = control.hasOwnProperty('enum') ? InputEnum : InputRange;
  if (control.type === CommandType.None) {
      Component = InputText
  }

  return (
    <Component
      {...props}
      id={id}
      onChange={onChange}
      onLockOff={onLockOff}
      onLockOn={onLockOn}
      value={value}
      locked={locked}
    />
  );
}

export default Control;
