import { Textarea as NextTextarea, Button } from '@nextui-org/react';
import { useEffect, useRef, useState } from 'react';

interface Props {
  value?: string | number | readonly string[] | undefined;
  onChange?: (text: string) => void;
}
export const Textarea = ({ value, onChange, ...rest }: Props & any) => {
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
    chanageSuccess('');
  };
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = value || '';
    }
  });
  return (
    <NextTextarea
      fullWidth
      bordered
      aria-label='textarea'
      ref={inputRef}
      initialValue={value}
      defaultValue={value}
      minRows={4}
      {...rest}
      onClearClick={clearHandler}
      onChange={changeHandler}
      onCompositionStart={start}
      onCompositionEnd={end}
    />
  );
};
