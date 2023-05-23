import { useState, useRef, useEffect } from 'react';
import { Modal, Text, Input } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { useGlobalStore, useAccountStore } from '@/store';
import { useRequest } from '@/api';
import { useCountDown } from '@/lib/hooks';
import toast from 'react-hot-toast';
import { STATUS_CODE } from '@/lib/account/account';

export const BindMail = () => {
  const [loginLoading, setLoginLoading] = useState(false);
  const { showLogin, setShowLogin } = useGlobalStore((state) => state);
  const { account } = useAccountStore((state) => state);
  const [email, setEmail] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const { start, text, flag, reset } = useCountDown(60);
  const { changeProtectorStatus } = useGlobalStore((state) => state);
  const closeHandler = () => {
    setShowLogin(false);
  };
  const loginHandler = async () => {
    if (!verifyCode) {
      console.log('没有验证码');
      return;
    }

    setLoginLoading(true);
    const status = await account.addGuardian({
      account: email,
      verifyCode: verifyCode,
      type: 'email',
    });
    if (status === STATUS_CODE.SUCCESS) {
      setShowLogin(false);
      changeProtectorStatus(true);
    } else {
      toast.error('绑定失败');
    }
    setLoginLoading(false);
  };
  const emailChange = (e: any) => {
    setEmail(e.target.value);
  };
  const verifyCodeChange = (e: any) => {
    setVerifyCode(e.target.value);
  };
  const sendVerify = async () => {
    if (email && flag) {
      await account.sendVerifyCode({ type: 'email', account: email });
      start();
    }
  };
  const emailBlur = () => {};
  return (
    <Modal
      className='max-w-90% mx-auto'
      blur
      autoMargin
      closeButton
      open={showLogin}
      onClose={closeHandler}>
      <Modal.Header>
        <Text id='modal-title' size={18}>
          绑定邮箱
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
            className='flex-1 50px'
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
          绑定邮箱
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export async function useCheckLogin() {
  const { bindStatus } = useAccountStore.getState().account.accountInfo;
  console.log(useAccountStore.getState().account.accountInfo);
  let loginStatus = bindStatus;
  const setShowLogin = useGlobalStore.getState().setShowLogin;
  if (!loginStatus) {
    setShowLogin(true);
    loginStatus = await new Promise((resolve, reject) => {
      useAccountStore.subscribe((state) => {
        if (state.account.accountInfo.bindStatus) {
          resolve(state.account.accountInfo.bindStatus);
        }
      });
    });
  }
  return loginStatus;
}
