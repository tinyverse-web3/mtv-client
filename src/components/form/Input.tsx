import { Text, Input as NextInput, Button } from '@nextui-org/react';
import { useEffect, useRef, useState } from 'react';

interface Props {
  value?: string | number | readonly string[] | undefined;
  onChange?: (text: string) => void;
}
export const Input = ({ value, onChange, ...rest }: Props & any) => {
  console.log(value);
  const [flag, setFlag] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const chanageSuccess = (val: string) => {
    onChange && onChange(val);
  };
  const changeHandler = (e: any) => {
    if (!flag) {
      chanageSuccess(e.target.value);
    }
  };
  const start = () => {
    console.log('start');
    setFlag(true);
  };
  const end = (e: any) => {
    setFlag(false);
    chanageSuccess(e.target.value);
  };
  const clearHandler = () => {
    chanageSuccess('');
  };
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = value
    }
  }, [value]);
  return (
    <NextInput
      aria-label='text'
      fullWidth
      bordered
      clearable
      {...rest}
      ref={inputRef}
      // defaultValue={value}
      // initialValue={value}
      onChange={changeHandler}
      onClearClick={clearHandler}
      onCompositionStart={start}
      onCompositionEnd={end}
    />
  );
};
