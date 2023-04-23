import { useState, useRef, useEffect } from 'react';
import { Modal, Text, Input } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { useGlobalStore, useWalletStore } from '@/store';
import { useRequest } from '@/api';
import { useCountDown } from '@/lib/hooks';
import toast from 'react-hot-toast';
interface Props {
  onChange: (data: { email: string; code: string }) => void;
}
export const EmailBox = ({ onChange }: Props) => {
  const [email, setEmail] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const { start, text, flag } = useCountDown(60);

  const { mutate: sendCode, loading: codeLoading } = useRequest(
    {
      url: '/user/sendmail4verifycode',
      arg: {
        method: 'post',
        query: { email },
      },
    },
    {
      onSuccess(res) {
        if (res.code === '000000') {
          toast.success('验证码已发送');
          start();
        } else {
          toast.error(res.msg);
        }
      },
    },
  );
  const emailChange = (e: any) => {
    setEmail(e.target.value);
  };
  const verifyCodeChange = async (e: any) => {
    const { value } = e.target;
    await setVerifyCode(value);
    onChange && onChange({ email, code: value });
  };
  const sendVerify = async () => {
    if (email && flag) {
      await sendCode();
    }
  };
  const emailBlur = () => {};
  return (
    <div>
      <Input
        clearable
        bordered
        fullWidth
        type='email'
        aria-label='email'
        color='primary'
        size='lg'
        onBlur={emailBlur}
        value={email}
        onChange={emailChange}
        placeholder='邮箱'
        className='mb-6'
        contentLeft={<div className='i-mdi-email color-current' />}
      />
      <div className='flex'>
        <Input
          clearable
          bordered
          fullWidth
          type='number'
          maxLength={6}
          aria-label='验证码'
          className='flex-1'
          color='primary'
          size='lg'
          value={verifyCode}
          onChange={verifyCodeChange}
          placeholder='验证码'
          contentLeft={<div className='i-mdi-shield-outline color-current' />}
        />
        <Button
          auto
          className='ml-4 min-w-20'
          color='secondary'
          loading={codeLoading}
          onPress={sendVerify}>
          {text}
        </Button>
      </div>
    </div>
  );
};
