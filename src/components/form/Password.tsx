import { Input as NextInput } from '@nextui-org/react';
import { divide } from 'lodash';
import { Icon } from '@iconify/react';
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
    setShow(false);
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
      isClearable={false}
      type={show ? 'text' : 'password'}
      ref={inputRef}
      endContent={
        value ? (
          <div className='cursor-pointer flex items-center'>
            <Icon
              icon={show ? 'eva:eye-off-outline' : 'eva:eye-outline'}
              className='text-2xl'
              onClick={handleClick}
            />
            <Icon
              icon='pajamas:clear'
              className='text-md text-gray-500 ml-1'
              onClick={clearHandler}
            />
          </div>
        ) : (
          <></>
        )
      }
      // defaultValue={value}
      // initialValue={value}
      onChange={changeHandler}
    />
  );
};
