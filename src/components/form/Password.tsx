import { Input as NextInput } from '@nextui-org/react';
import { useEffect, useRef, useState } from 'react';

interface Props {
  value?: string | number | readonly string[] | undefined;
  onChange?: (text: string) => void;
}
export const Password = ({ value, onChange, ...rest }: Props & any) => {

  const inputRef = useRef<HTMLInputElement | null>(null);
  const chanageSuccess = (val: string) => {
    onChange && onChange(val);
  };
  const changeHandler = (e: any) => {
    chanageSuccess(e.target.value);
  };
  const clearHandler = () => {
    chanageSuccess('');
  };
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = value || '';
    }
  });
  return (
    <NextInput
      aria-label='Password'
      variant='bordered'
      {...rest}
      isClearable
      type='password'
      ref={inputRef}
      // defaultValue={value}
      // initialValue={value}
      onChange={changeHandler}
      onClearClick={clearHandler}
    />
  );
};
