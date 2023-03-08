import { Text, Input as NextInput, Button } from '@nextui-org/react';
import { useState } from 'react';

interface Props {
  value?: string | number | readonly string[] | undefined;
  onChange?: (text: string) => void;
}
export const Input = ({ value, onChange }: Props) => {
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
  return (
    <NextInput
      aria-label='text'
      fullWidth
      clearable
      // value={value}
      onChange={changeHandler}
      onCompositionStart={start}
      onCompositionEnd={end}
    />
  );
};
