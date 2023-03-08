import { Text, Input as NextInput, Button } from '@nextui-org/react';
import { useState } from 'react';

interface Props {
  value?: string | number | readonly string[] | undefined;
  onChange?: (text: string) => void;
}
export const Input = ({ value, onChange, ...rest }: Props & any) => {
  const [flag, setFlag] = useState(false);

  const chanageSuccess = (val: string) => {
    onChange && onChange(val);
  };
  const changeHandler = (e: any) => {
    if (!flag) {
      console.log('change');
      chanageSuccess(e.target.value);
    }
  };
  const start = () => {
    console.log('start');
    setFlag(true);
  };
  const end = (e: any) => {
    setFlag(false);
    console.log(e.target.value);
    chanageSuccess(e.target.value);
  };
  const clearHandler = () => {
    chanageSuccess('');
  };
  return (
    <NextInput
      aria-label='text'
      fullWidth
      bordered
      clearable
      {...rest}
      defaultValue={value}
      initialValue={value}
      // value={value}
      onChange={changeHandler}
      onClearClick={clearHandler}
      onCompositionStart={start}
      onCompositionEnd={end}
    />
  );
};
