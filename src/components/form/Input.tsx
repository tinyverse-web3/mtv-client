import { Input as NextInput } from '@nextui-org/react';
import { useEffect, useRef, useState } from 'react';

interface Props {
  value?: string | number | readonly string[] | undefined;
  onChange?: (text: string) => void;
}
export const Input = ({
  value,
  onChange,
  variant = 'bordered',
  isClearable = true,
  fullWidth = true,
  ...rest
}: Props & any) => {
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
    setFlag(true);
  };
  const end = (e: any) => {
    setFlag(false);
    chanageSuccess(e.target.value);
  };
  const clearHandler = () => {
    console.log(123);
    chanageSuccess('');
  };
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = value || '';
    }
  });
  return (
    <NextInput
      aria-label='text'
      fullWidth={fullWidth}
      variant={variant}
      isClearable={isClearable}
      {...rest}
      ref={inputRef}
      // defaultValue={value}
      // initialValue={value}
      onChange={changeHandler}
      onClear={isClearable && clearHandler}
      onCompositionStart={start}
      onCompositionEnd={end}
    />
  );
};
