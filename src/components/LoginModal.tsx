import { useState, useCallback } from 'react';
import { Button, Modal, Text, Card, Row, Input } from '@nextui-org/react';
import { useGlobalStore } from '@/store';
import { validEmail } from '@/lib/utils';
import { useRequest } from '@/api';
import { useCountDown } from '@/lib/hooks';

export const LoginModal = () => {
  const showLogin = useGlobalStore((state) => state.showLogin);
  const setShowLogin = useGlobalStore((state) => state.setShowLogin);
  const setUserInfo = useGlobalStore((state) => state.setUserInfo);
  const token = useGlobalStore((state) => state.token);
  const setToken = useGlobalStore((state) => state.setToken);
  const [email, setEmail] = useState('ygz14835187@163.com');
  const [verifyCode, setVerifyCode] = useState('652077');
  const { start, text, flag } = useCountDown(60);
  const loginSucess = async (res: any) => {
    if (res.data) {
      await setUserInfo({ email });
      await setToken(res.data);
      console.log(res)
      console.log(token)
      console.log(123123);
    }
  };
  const { trigger } = useRequest(
    {
      path: '/user/login',
      method: 'post',
      query: { email, confirmCode: verifyCode },
    },
    { onSuccess: loginSucess },
  );

  const { trigger: sendCode } = useRequest({
    path: '/user/sendmail',
    method: 'post',
    query: { email },
  });

  const closeHandler = () => {
    setShowLogin(false);
  };
  const loginHandler = async () => {
    if (!verifyCode) {
      console.log('没有验证码');
    }
    await trigger();
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
      await start();
    }
  };
  const emailBlur = () => {
    
  }
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
          登录
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Input
          clearable
          bordered
          fullWidth
          type="email"
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
            type="number"
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
            onPress={sendVerify}>
            {text}
          </Button>
        </div>
        {/* <Row justify="space-between">
            <Checkbox>
              <Text size={14}>Remember me</Text>
            </Checkbox>
            <Text size={14}>Forgot password?</Text>
          </Row> */}
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat color='error' onPress={closeHandler}>
          关闭
        </Button>
        <Button auto onPress={loginHandler}>
          登录
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export async function useCheckLogin() {
  const isLogin = useGlobalStore.getState().isLogin;
  let loginStatus = isLogin;
  const setShowLogin = useGlobalStore.getState().setShowLogin;
  if (!loginStatus) {
    setShowLogin(true);
    loginStatus = await new Promise((resolve, reject) => {
      useGlobalStore.subscribe((state) => {
        resolve(state.isLogin);
      });
    });
  }
  return loginStatus;
}
