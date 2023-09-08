import { useState, useCallback } from 'react';
import { Input } from '@/components/form/Input';
import { Icon } from '@iconify/react'

export const InputEmail = () => {
  const [email, setEmail] = useState('ygz14835187@163.com');
  const [validStatus, setValidStatus] = useState(true);

  const emailChange = (e: any) => {
    setEmail(e.target.value);
  };
  const emailBlur = () => {};
  return (
    <Input
      type='email'
      className='h-50px'
      aria-label='email'
      color='primary'
      size='lg'
      helperColor={validStatus ? 'default' : 'error'}
      status={validStatus ? 'default' : 'error'}
      helperText={validStatus ? '' : '邮箱错误'}
      onBlur={emailBlur}
      value={email}
      onChange={emailChange}
      placeholder='邮箱'
      contentLeft={<Icon icon="mdi:email" className=' color-current' />}
    />
  );
};
