import { Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

interface Props {
  value?: string | number | readonly string[] | undefined;
  onChange?: (text: string) => void;
}
export const Password = ({
  value,
  onChange,
  isClearable,
  ...rest
}: Props & any) => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
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
    <InputGroup size='md'>
      <Input
        aria-label='Password'
        variant='outline'
        {...rest}
        focusBorderColor="rgb(17,24,28)"
        type={show ? 'text' : 'password'}
        ref={inputRef}
        // defaultValue={value}
        // initialValue={value}
        onChange={changeHandler}
      />
      <InputRightElement width='4.5rem'>
        <Button h='1.75rem' size='sm' onClick={handleClick}>
          {show ? 'Hide' : 'Show'}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};
