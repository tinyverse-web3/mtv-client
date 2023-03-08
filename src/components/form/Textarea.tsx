import { Text, Textarea as NextTextarea, Button } from '@nextui-org/react';
import { useState } from 'react';

interface Props {
  value?: string | number | readonly string[] | undefined;
  onChange?: (text: string) => void;
}
export const Textarea = ({ value, onChange, ...rest }: Props & any) => {
  console.log(value);
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
    <NextTextarea
      fullWidth
      bordered
      {...rest}
      aria-label="textarea"
      initialValue={value}
      defaultValue={value}
      minRows={4}
      onClearClick={clearHandler}
      onChange={changeHandler}
      onCompositionStart={start}
      onCompositionEnd={end}
    />
  );
};
