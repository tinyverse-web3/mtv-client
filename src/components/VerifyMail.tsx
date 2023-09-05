import { useState, useRef, useEffect } from 'react';
import { Modal, Text, Input } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { useGlobalStore } from '@/store';
import { useRequest } from '@/api';
import { useCountDown } from '@/lib/hooks';
import toast from 'react-hot-toast';

interface Props {
  visibly: boolean;
  onChange: (v: boolean) => void;
  onSubmit: (s: { shareKey: string; questions: any[] }) => void;
}
export const VerifyMail = ({ visibly, onChange, onSubmit }: Props) => {
  const [loginLoading, setLoginLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const { start, text, flag } = useCountDown(60);

  const { mutate: verifyBindEmail } = useRequest(
    {
      url: '/user/verifymail',
      arg: {
        auth: true,
        method: 'post',
        query: { email, confirmCode: verifyCode },
      },
    },
    {
      onSuccess: (res) => {
        const { sssData, questions = [] } = res?.data || {};
        if (sssData) {
          console.log(email);

          onSubmit({ shareKey: sssData, questions });
          onChange(false);
        } else {
          toast.error('您的账号未备份，无法通过该途径恢复');
        }
      },
      onError() {
        setLoginLoading(false);
      },
    },
  );

  const { mutate: sendCode, loading: codeLoading } = useRequest({
    url: '/user/sendmail4verifycode',
    arg: {
      method: 'post',
      query: { email },
    },
  });

  const closeHandler = () => {
    onChange(false);
    document.body.removeAttribute('style');
  };
  const loginHandler = async () => {
    if (!verifyCode) {
      console.log('没有验证码');
      return;
    }
    console.log(email);
    await verifyBindEmail();
  };
  const emailChange = (e: any) => {
    setEmail(e.target.value);
  };
  const verifyCodeChange = (e: any) => {
    setVerifyCode(e.target.value);
  };
  const sendVerify = async () => {
    if (email && flag) {
      await sendCode();
      toast.success('验证码已发送');
      await start();
    }
  };
  const emailBlur = () => {};
  return (
    <Modal
      className='max-w-90% mx-auto'
      autoMargin
      closeButton
      open={visibly}
      onClose={closeHandler}>
      <Modal.Header>
        <Text id='modal-title' size={18}>
          验证邮箱
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Input
          clearable
          bordered
          fullWidth
          type='email'
          className='h-50px'
          aria-label='email'
          color='primary'
          size='lg'
          onBlur={emailBlur}
          value={email}
          readOnly={loginLoading}
          onChange={emailChange}
          placeholder='邮箱'
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
            readOnly={loginLoading}
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
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat color='error' onPress={closeHandler}>
          关闭
        </Button>
        <Button auto onPress={loginHandler} loading={loginLoading}>
          验证邮箱
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
